# 🚦 Rate Limiting Implementation Guide

**Status:** ✅ Implemented  
**Date:** February 14, 2026

---

## 📋 Overview

Rate limiting has been implemented to prevent spam and abuse. Users are limited to:
- **10 interactions per hour**
- **3 registration attempts per hour**
- **10 login attempts per 15 minutes**

---

## 🗄️ Database Setup

### 1. Apply Migration

Run the rate limiting migration on Supabase:

```bash
# From Supabase dashboard or CLI
supabase db push

# Or manually run the migration file:
# supabase/migrations/20240214_add_rate_limiting.sql
```

This creates:
- `rate_limit_log` table - tracks user actions
- `rate_limit_config` table - stores rate limit rules
- `check_rate_limit()` function - checks if user exceeded limit
- `log_rate_limit_action()` function - logs actions
- `cleanup_old_rate_limit_logs()` function - removes old logs

### 2. Verify Tables

Check that tables were created:

```sql
SELECT * FROM rate_limit_config;
-- Should show 3 rows: interaction, registration, login
```

---

## ⚡ Edge Function Deployment

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Your project ref is in the Supabase URL:
`https://YOUR_PROJECT_REF.supabase.co`

### 4. Deploy Edge Function

```bash
supabase functions deploy submit-interaction
```

### 5. Set Environment Variables

In Supabase Dashboard → Edge Functions → Settings:

```
SUPABASE_URL=https://piqdleuumeppiombuytj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **IMPORTANT:** Use SERVICE ROLE KEY, not anon key!

---

## 🧪 Testing Rate Limiting

### Test 1: Normal Submission

```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/submit-interaction \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"whatIGave": "Test item", "whatIGot": "Test item 2"}'
```

Expected response:
```json
{
  "success": true,
  "interaction": {...},
  "newPoints": 1
}
```

### Test 2: Rate Limit Exceeded

Submit 11 requests within 1 hour. The 11th should return:

```json
{
  "error": "Rate limit exceeded. You can submit maximum 10 interactions per hour.",
  "retryAfter": 3600
}
```

### Test 3: Check Rate Limit Logs

```sql
SELECT * FROM rate_limit_log 
WHERE user_id = 'YOUR_USER_ID' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔧 Configuration

### Adjust Rate Limits

Update limits in database:

```sql
UPDATE rate_limit_config 
SET max_requests = 20, time_window_minutes = 60 
WHERE action_type = 'interaction';
```

### Cleanup Old Logs

Run cleanup function (can be scheduled):

```sql
SELECT cleanup_old_rate_limit_logs();
```

Consider setting up a cron job:

```sql
-- In Supabase Dashboard → Database → Cron Jobs
SELECT cron.schedule(
  'cleanup-rate-limits',
  '0 * * * *', -- Every hour
  $$ SELECT cleanup_old_rate_limit_logs(); $$
);
```

---

## 📊 Monitoring

### Check Rate Limit Usage

```sql
-- Users hitting rate limits
SELECT 
  user_id,
  action_type,
  COUNT(*) as request_count,
  MAX(created_at) as last_request
FROM rate_limit_log
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY user_id, action_type
HAVING COUNT(*) >= 10
ORDER BY request_count DESC;
```

### Most Active Users

```sql
SELECT 
  user_id,
  COUNT(*) as total_requests,
  COUNT(DISTINCT DATE(created_at)) as active_days
FROM rate_limit_log
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY user_id
ORDER BY total_requests DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### Edge Function Not Working

1. Check function logs:
```bash
supabase functions logs submit-interaction
```

2. Verify environment variables are set in Supabase Dashboard

3. Check CORS headers if getting CORS errors

### Rate Limit Not Enforcing

1. Verify migration was applied:
```sql
SELECT * FROM rate_limit_config;
```

2. Check if `check_rate_limit()` function exists:
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'check_rate_limit';
```

3. Test function directly:
```sql
SELECT check_rate_limit(
  'USER_ID_HERE'::uuid,
  'interaction',
  10,
  60
);
```

### Client Not Calling Edge Function

1. Check browser console for errors
2. Verify Supabase client is initialized
3. Check user is authenticated
4. Verify Edge Function URL is correct

---

## 🔐 Security Notes

1. ✅ Edge Function uses service role key (admin access)
2. ✅ JWT token verified before processing
3. ✅ Input sanitized (HTML tags removed)
4. ✅ Input length validated (max 200 chars)
5. ✅ RLS policies protect rate_limit_log table
6. ✅ IP address and user agent logged for abuse detection

---

## 📝 Client Integration

The client automatically uses the Edge Function with rate limiting:

```typescript
import { submitSimpleExchange } from '@/services/interactionService';

const result = await submitSimpleExchange(whatIGave, whatIGot);

if (!result.success) {
  if (result.error.includes('rate limit')) {
    // Show rate limit error to user
    alert('Dosiahli ste limit. Môžete odoslať maximálne 10 interakcií za hodinu.');
  }
}
```

---

## 🎯 Next Steps

1. ✅ Database migration applied
2. ✅ Edge Function created
3. ⏳ Deploy Edge Function to Supabase
4. ⏳ Set environment variables
5. ⏳ Test rate limiting
6. ⏳ Monitor usage
7. ⏳ Adjust limits if needed

---

## 📚 Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase CLI Docs](https://supabase.com/docs/reference/cli)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)

---

**Last Updated:** February 14, 2026  
**Status:** Ready for deployment
