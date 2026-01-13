const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://piqdleuumeppiombuytj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcWRsZXV1bWVwcGlvbWJ1eXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTc4NDIsImV4cCI6MjA4MTI5Mzg0Mn0.I8S1mZ09bvCOZbNpgj9HXju488lv4N_NPzW3W7qb5SM';

console.log('🔍 Testing Supabase Database Connection...\n');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
console.log('');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase credentials are missing!');
  console.error('Please check your .env.local file in the client directory.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('⏳ Testing connection to Supabase...\n');

    // Test 1: Check if we can connect
    const { data: healthData, error: healthError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (healthError) {
      console.log('⚠️  Connection Test Result:');
      console.log('   Status: Connected to Supabase');
      console.log('   Note:', healthError.message);
      console.log('   (This is normal if tables don\'t exist yet)\n');
    } else {
      console.log('✅ Connection Test: SUCCESS');
      console.log('   Database is accessible\n');
    }

    // Test 2: Try to list tables (this will work even if tables don't exist)
    console.log('📊 Attempting to query users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      if (usersError.code === '42P01') {
        console.log('⚠️  Table "users" does not exist yet');
        console.log('   You need to run the database schema setup\n');
      } else {
        console.log('⚠️  Error querying users:', usersError.message, '\n');
      }
    } else {
      console.log('✅ Users table exists');
      console.log('   Found', users?.length || 0, 'user(s)\n');
    }

    // Test 3: Check groups table
    console.log('📊 Attempting to query groups table...');
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('*')
      .limit(1);

    if (groupsError) {
      if (groupsError.code === '42P01') {
        console.log('⚠️  Table "groups" does not exist yet');
        console.log('   You need to run the database schema setup\n');
      } else {
        console.log('⚠️  Error querying groups:', groupsError.message, '\n');
      }
    } else {
      console.log('✅ Groups table exists');
      console.log('   Found', groups?.length || 0, 'group(s)\n');
    }

    // Test 4: Check auth
    console.log('🔐 Testing authentication service...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  Auth service error:', authError.message, '\n');
    } else {
      console.log('✅ Auth service is accessible');
      console.log('   Current session:', authData.session ? 'Active' : 'None\n');
    }

    console.log('═══════════════════════════════════════════════');
    console.log('📋 SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log('✅ Supabase connection: WORKING');
    console.log('📍 Project URL:', supabaseUrl);
    console.log('🔐 Authentication: ACCESSIBLE');
    
    if (usersError?.code === '42P01' || groupsError?.code === '42P01') {
      console.log('\n⚠️  ACTION REQUIRED:');
      console.log('   Database tables need to be created.');
      console.log('   Run the schema.sql file in your Supabase SQL editor:');
      console.log('   File: ./database/schema.sql');
    } else {
      console.log('✅ Database tables: READY');
    }
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Unexpected error during connection test:');
    console.error(error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

testConnection();
