#!/bin/bash

# Setup environment variables for Supabase
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://piqdleuumeppiombuytj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcWRsZXV1bWVwcGlvbWJ1eXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTc4NDIsImV4cCI6MjA4MTI5Mzg0Mn0.I8S1mZ09bvCOZbNpgj9HXju488lv4N_NPzW3W7qb5SM
EOF

echo "✅ Environment variables created in .env.local"
echo "🔄 Please restart your development server (npm run dev)"
