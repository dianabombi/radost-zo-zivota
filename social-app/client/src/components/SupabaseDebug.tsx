import React from 'react';
import { isSupabaseConfigured } from '../lib/supabase';

export const SupabaseDebug: React.FC = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return (
    <div className="fixed bottom-4 right-4 bg-charcoal-light border border-electric-blue rounded-xl p-4 max-w-md text-xs font-mono z-50">
      <h3 className="text-electric-blue font-bold mb-2">Supabase Debug</h3>
      <div className="space-y-1 text-gray-300">
        <p>Configured: <span className={isSupabaseConfigured ? 'text-vibrant-green' : 'text-red-500'}>
          {isSupabaseConfigured ? 'YES ✅' : 'NO ❌'}
        </span></p>
        <p>URL: <span className="text-warm-yellow">{url || 'NOT SET'}</span></p>
        <p>Key: <span className="text-warm-yellow">{key ? `${key.substring(0, 20)}...` : 'NOT SET'}</span></p>
        <p>Mode: <span className="text-vibrant-green">{import.meta.env.MODE}</span></p>
      </div>
    </div>
  );
};

export default SupabaseDebug;
