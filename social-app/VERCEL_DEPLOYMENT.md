# Vercel Deployment Guide 🚀

## 🔴 CRITICAL: Fix 404 Error

### The Problem
Your app is in the `client` folder, but Vercel is trying to build from the root folder.

### The Solution (3 Options)

#### ✅ OPTION 1: Edit Root Directory in Vercel (EASIEST)

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Settings → General
4. Find "Root Directory" → Click "Edit"
5. Enter: `client`
6. Save
7. Go to Deployments → Click "···" → Redeploy

#### ✅ OPTION 2: Delete and Redeploy Fresh

1. Settings → General → Delete Project
2. Go to: https://vercel.com/new
3. Import your GitHub repo
4. **IMPORTANT**: Click "Edit" next to Root Directory
5. Type: `client`
6. Deploy

#### ✅ OPTION 3: Use CLI

```bash
cd client
npm install -g vercel
vercel login
vercel --prod
```

### 2. **Add Environment Variables**

Go to Project Settings → Environment Variables and add:

```
VITE_SUPABASE_URL=https://piqdleuumeppiombuytj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcWRsZXV1bWVwcGlvbWJ1eXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTc4NDIsImV4cCI6MjA4MTI5Mzg0Mn0.I8S1mZ09bvCOZbNpgj9HXju488lv4N_NPzW3W7qb5SM
```

Check all environments (Production, Preview, Development).

### 3. **Redeploy**

After adding variables:
1. Go to Deployments tab
2. Click "···" menu → Redeploy
3. Wait for build to complete

## 🚀 Full Deployment Steps

### Step 1: Import from GitHub

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Important**: Set Root Directory to `client`

### Step 2: Configure Build

Settings should be:
- Framework: Vite
- Build Command: `npm run build`  
- Output Directory: `dist`
- Root Directory: `client`

### Step 3: Add Environment Variables

In Settings → Environment Variables:
- Add `VITE_SUPABASE_URL`
- Add `VITE_SUPABASE_ANON_KEY`
- Enable for all environments

### Step 4: Deploy

Click "Deploy" and wait for completion.

## ✅ Verify

Visit your site:
- Should see login/registration page
- Try registering
- Check Supabase dashboard for new user

🎮 Spájaj • Zdieľaj • Hraj • Ži
