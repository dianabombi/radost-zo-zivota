-- Cleanup Script - Run this FIRST to remove existing database objects
-- This allows you to run the schema fresh without conflicts

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_groups_updated_at ON public.groups;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (CASCADE removes all dependent objects including policies)
DROP TABLE IF EXISTS public.interactions CASCADE;
DROP TABLE IF EXISTS public.group_members CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Success message
SELECT 'Database cleaned successfully! Now run schema-simple.sql' as message;
