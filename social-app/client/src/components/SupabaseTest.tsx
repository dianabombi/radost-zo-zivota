import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Button from './ui/Button';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');

    try {
      if (!isSupabaseConfigured) {
        setStatus('❌ Supabase is not configured. Using demo mode.');
        setLoading(false);
        return;
      }

      // Test 1: Check connection
      const { error: healthError } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (healthError) {
        setStatus(`❌ Connection Error: ${healthError.message}\n\nMake sure:\n1. Database tables are created (run schema-simple.sql)\n2. RLS policies are set up correctly`);
        setLoading(false);
        return;
      }

      // Test 2: Check auth
      const { data: { session } } = await supabase.auth.getSession();
      
      setStatus(`✅ Connection successful!\n\nSession: ${session ? 'Active' : 'None'}\nDatabase: Connected`);
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setLoading(false);
  };

  const testSignUp = async () => {
    setLoading(true);
    setStatus('Testing sign up...');

    try {
      const testEmail = `test${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          data: {
            nickname: 'TestUser',
            city: 'Bratislava',
            region: 'Bratislavský kraj',
            country: 'Slovakia',
          }
        }
      });

      if (error) {
        setStatus(`❌ Sign Up Error: ${error.message}`);
      } else {
        setStatus(`✅ Sign Up successful!\n\nUser ID: ${data.user?.id}\nEmail: ${testEmail}\n\nCheck if user profile was created in database.`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-charcoal-light border-2 border-warm-yellow rounded-2xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-poppins font-bold text-warm-yellow mb-4">
        🔧 Supabase Connection Test
      </h2>
      
      <div className="space-y-4">
        <Button
          onClick={testConnection}
          disabled={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </Button>

        <Button
          onClick={testSignUp}
          disabled={loading || !isSupabaseConfigured}
          variant="success"
          className="w-full"
        >
          Test Sign Up
        </Button>

        {status && (
          <div className="bg-deep-charcoal rounded-xl p-4 mt-4">
            <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
              {status}
            </pre>
          </div>
        )}

        <div className="bg-electric-blue bg-opacity-10 border border-electric-blue rounded-xl p-4 mt-4">
          <h3 className="text-electric-blue font-semibold mb-2">Setup Instructions:</h3>
          <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
            <li>Go to your Supabase project dashboard</li>
            <li>Navigate to SQL Editor</li>
            <li>Copy and run the schema-simple.sql file</li>
            <li>Verify tables are created in Table Editor</li>
            <li>Test the connection again</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
