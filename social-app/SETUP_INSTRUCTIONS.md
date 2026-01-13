# Sign-In Issue - Setup Instructions

## Problem
The sign-in process is failing because the Supabase database tables haven't been created yet.

## Solution

### Option 1: Set Up Supabase Database (Recommended for Production)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `piqdleuumeppiombuytj`

2. **Run the Database Schema**
   - Navigate to: **SQL Editor** (left sidebar)
   - Click: **New Query**
   - Copy the entire contents of: `social-app/database/schema-simple.sql`
   - Paste into the SQL Editor
   - Click: **Run** (or press Ctrl/Cmd + Enter)

3. **Verify Tables Were Created**
   - Navigate to: **Table Editor** (left sidebar)
   - You should see these tables:
     - `users`
     - `groups`
     - `group_members`
     - `interactions`

4. **Test the Sign-In**
   - Go back to your app: http://localhost:5173
   - Try to register a new account
   - The sign-in should now work!

### Option 2: Use Demo Mode (Quick Testing)

If you just want to test the app without setting up the database:

1. The app already supports demo mode
2. Just enter any email and password (min. 6 characters)
3. Click "Prihlásiť sa" (Sign In)
4. You'll be logged in with a mock user account

**Note:** Demo mode data is stored in localStorage and will be lost when you clear browser data.

## Common Errors and Solutions

### Error: "Databáza nie je nastavená"
- **Cause:** Database tables don't exist
- **Solution:** Run `schema-simple.sql` in Supabase SQL Editor (see Option 1 above)

### Error: "Profil používateľa nebol nájdený"
- **Cause:** User exists in auth but not in users table
- **Solution:** Make sure the trigger `on_auth_user_created` was created (it's in schema-simple.sql)

### Error: "Chyba pripojenia k serveru"
- **Cause:** Network issue or Supabase is down
- **Solution:** Check your internet connection and Supabase status

### Error: "Nesprávne prihlasovacie údaje"
- **Cause:** Wrong email/password or user doesn't exist
- **Solution:** Try registering a new account first

## Testing the Connection

I've created a test component to help diagnose issues. To use it:

1. Import it in your App.tsx (temporarily)
2. Add `<SupabaseTest />` to see connection diagnostics
3. Click "Test Connection" to verify database setup

## Need Help?

- Check Supabase logs: Dashboard → Logs
- Check browser console: F12 → Console tab
- Verify environment variables in `.env` file
