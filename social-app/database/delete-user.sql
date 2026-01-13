-- Delete User Script
-- Replace 'user-email@example.com' with the actual email

-- First, get the user ID from auth
-- Run this to see the user ID:
SELECT id, email FROM auth.users WHERE email = 'dianabombi@gmail.com';

-- Then delete from users table (replace the UUID with the actual ID from above)
-- DELETE FROM public.users WHERE email = 'dianabombi@gmail.com';

-- OR delete all test users at once:
DELETE FROM public.users WHERE email LIKE '%@gmail.com';

-- Now you can delete from auth.users in the dashboard
