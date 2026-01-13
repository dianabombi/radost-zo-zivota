#!/bin/bash

# Vercel Deployment Script
# Run this from the client folder

echo "🚀 Deploying to Vercel..."
echo ""
echo "Make sure you have:"
echo "1. Vercel CLI installed: npm i -g vercel"
echo "2. Logged in: vercel login"
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy
echo "🔧 Starting deployment..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site is live!"
echo ""
echo "⚠️  Don't forget to add environment variables in Vercel Dashboard:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
