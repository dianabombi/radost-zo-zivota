# Authentication Solution Documentation

## Problem
Supabase JS client (`@supabase/supabase-js`) was timing out on `signInWithPassword()` and REST API calls, causing the application to hang during login.

## Root Cause
The Supabase JS client was experiencing timeout issues with:
1. `supabase.auth.signInWithPassword()` - Login authentication
2. `supabase.from('users').select()` - Profile fetching

However, direct `fetch()` API calls to the same endpoints worked perfectly (confirmed via curl tests).

## Solution
Replaced Supabase JS client calls with direct `fetch()` API calls for authentication and profile fetching.

### Implementation Details

#### 1. Supabase Configuration (`client/src/lib/supabase.ts`)
```typescript
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false  // Important: prevents hanging
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key')
```

#### 2. Login Implementation (`client/src/contexts/AuthContext.tsx`)

**Direct fetch for authentication:**
```typescript
const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: credentials.email,
    password: credentials.password
  })
});

const result = await response.json();
```

**Direct fetch for profile:**
```typescript
const profileResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users?id=eq.${data.user.id}&select=*`, {
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${result.access_token}`
  }
});

const profiles = await profileResponse.json();
const profile = profiles[0];
```

## Environment Variables
Required in `client/.env`:
```env
VITE_SUPABASE_URL=https://piqdleuumeppiombuytj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcWRsZXV1bWVwcGlvbWJ1eXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTc4NDIsImV4cCI6MjA4MTI5Mzg0Mn0.I8S1mZ09bvCOZbNpgj9HXju488lv4N_NPzW3W7qb5SM
```

## Database Setup
Run these SQL scripts in Supabase SQL Editor:

1. **Cleanup (if needed):**
```sql
-- From database/cleanup.sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_groups_updated_at ON public.groups;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS public.interactions CASCADE;
DROP TABLE IF EXISTS public.group_members CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```

2. **Schema:**
```sql
-- From database/schema-simple.sql
-- Creates users, groups, group_members, interactions tables
-- Sets up RLS policies
-- Creates triggers for auto-profile creation
```

## Test User
- **Email:** diana@wavelynecode.com
- **Password:** Bombina@155
- **Nickname:** waveDia
- **City:** Bratislava
- **Region:** bratislavsky
- **Country:** Slovakia

## Verification
Login should show these console logs:
```
Attempting Supabase login with fetch...
Login response: 200
📊 Fetching user profile for ID: cd20eeb8-f29d-4706-a1ec-175430dc92ce
✅ Profile fetch completed: 1 profiles found
```

## Features Added
- **Eye icons** for password visibility toggle in login and register forms
- **Combined tile** for "Overenie Blízkosti → Hra" (Verification → Game flow)

## Important Notes
1. **Vite server must be restarted** after `.env` changes
2. `detectSessionInUrl: false` is crucial to prevent hanging
3. Direct fetch API calls bypass Supabase JS client timeout issues
4. RLS policies must be properly configured in Supabase Dashboard
5. The `handle_new_user()` trigger automatically creates user profiles on registration

## Future Improvements
If Supabase JS client timeout issues are resolved in future versions, consider reverting to:
- `supabase.auth.signInWithPassword()` for authentication
- `supabase.from('users').select()` for profile fetching

This would simplify the code and provide better TypeScript support.

## Date
January 25, 2026
