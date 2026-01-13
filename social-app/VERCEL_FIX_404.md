# 🔴 VERCEL 404 FIX - QUICK REFERENCE

## WHY YOU GET 404

Your project structure:
```
social-app/           ← Vercel is looking HERE (WRONG!)
├── client/           ← Your app is HERE (CORRECT!)
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── server/
└── database/
```

**Vercel must build from `client` folder!**

---

## ✅ FIX IN 3 STEPS

### STEP 1: Set Root Directory

**In Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Click your project name
3. Click **Settings** (left sidebar)
4. Click **General**
5. Scroll to **Root Directory**
6. Click **Edit** button
7. Type: `client`
8. Click **Save**

### STEP 2: Add Environment Variables

**Still in Settings:**
1. Click **Environment Variables** (left sidebar)
2. Click **Add New** button
3. Add Variable 1:
   ```
   Name: VITE_SUPABASE_URL
   Value: https://piqdleuumeppiombuytj.supabase.co
   Environments: ✓ Production ✓ Preview ✓ Development
   ```
4. Click **Save**
5. Add Variable 2:
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcWRsZXV1bWVwcGlvbWJ1eXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTc4NDIsImV4cCI6MjA4MTI5Mzg0Mn0.I8S1mZ09bvCOZbNpgj9HXju488lv4N_NPzW3W7qb5SM
   Environments: ✓ Production ✓ Preview ✓ Development
   ```
6. Click **Save**

### STEP 3: Redeploy

1. Click **Deployments** (top menu)
2. Find your latest deployment
3. Click the **···** (three dots) menu
4. Click **Redeploy**
5. Check **"Use existing Build Cache"** is OFF
6. Click **Redeploy**
7. Wait 2-3 minutes for build to complete

---

## ✅ VERIFY IT WORKS

After deployment:
1. Click **Visit** button
2. You should see your login/registration page
3. **NOT a 404 error!**

---

## 🆘 STILL NOT WORKING?

### Option: Start Fresh

1. **Delete the project:**
   - Settings → General → Scroll to bottom
   - Click "Delete Project"

2. **Create new deployment:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repo
   - **BEFORE CLICKING DEPLOY:**
     - Click "Edit" next to "Root Directory"
     - Type: `client`
   - Click "Deploy"

3. **Add environment variables** (see Step 2 above)

4. **Redeploy** (see Step 3 above)

---

## 📋 CHECKLIST

Before deploying, make sure:
- [ ] Root Directory is set to `client`
- [ ] Both environment variables are added
- [ ] Both variables are enabled for all 3 environments
- [ ] You've redeployed after adding variables

---

## 🎮 After Successful Deployment

Your app will be live at: `https://your-project.vercel.app`

Test:
- ✅ Login page loads
- ✅ Registration works
- ✅ Supabase connects
- ✅ No 404 errors!

**Spájaj • Zdieľaj • Hraj • Ži** 🎮✨
