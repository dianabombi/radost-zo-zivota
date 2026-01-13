# ✅ VERCEL SETTINGS VERIFICATION CHECKLIST

## 🔴 STOP - Verify These Settings First

Before redeploying again, **verify each setting exactly**:

---

## 1️⃣ ROOT DIRECTORY (MOST IMPORTANT!)

**Go to**: Settings → General → Root Directory

**What it should show**:
```
Root Directory: client
```

**NOT**:
- ❌ Empty (blank)
- ❌ `/client`
- ❌ `social-app`
- ❌ `./client`
- ✅ Just: `client`

**How to check**:
1. Open your Vercel project
2. Click **Settings** (left sidebar)
3. Click **General** (left sidebar)
4. Scroll to **Root Directory** section
5. Look at what's displayed

**If it's NOT showing `client`**:
1. Click **Edit**
2. Clear the field completely
3. Type exactly: `client`
4. Click **Save**

---

## 2️⃣ BUILD & DEVELOPMENT SETTINGS

**Go to**: Settings → General → Build & Development Settings

**What it should show**:
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**How to verify**:
1. In Settings → General
2. Scroll to **Build & Development Settings**
3. Check each field matches above
4. If not, click **Override** and set them

---

## 3️⃣ ENVIRONMENT VARIABLES

**Go to**: Settings → Environment Variables

**Must have these 2 variables**:

### Variable 1:
```
Name: VITE_SUPABASE_URL
Value: https://piqdleuumeppiombuytj.supabase.co
Environments: Production ✓ Preview ✓ Development ✓
```

### Variable 2:
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcWRsZXV1bWVwcGlvbWJ1eXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTc4NDIsImV4cCI6MjA4MTI5Mzg0Mn0.I8S1mZ09bvCOZbNpgj9HXju488lv4N_NPzW3W7qb5SM
Environments: Production ✓ Preview ✓ Development ✓
```

**How to verify**:
1. Settings → Environment Variables
2. You should see both variables listed
3. Click on each one to verify all 3 environments are checked

---

## 4️⃣ REDEPLOY CORRECTLY

**After verifying all settings above**:

1. Go to **Deployments** (top menu)
2. Find the latest deployment
3. Click the **⋯** (three dots)
4. Click **Redeploy**
5. **CRITICAL**: UNCHECK "Use existing Build Cache"
6. Click **Redeploy**
7. Wait for build to complete (2-3 minutes)

---

## 🔍 HOW TO CHECK BUILD LOGS

While deployment is running:

1. Click on the deployment (it will be "Building...")
2. Click **View Build Logs** or **Building** tab
3. Look for these lines:

**Good signs**:
```
✓ Root Directory: client
✓ Installing dependencies...
✓ Running "npm run build"
✓ Build Completed
✓ Deploying outputs...
```

**Bad signs**:
```
❌ Error: Cannot find package.json
❌ No such file or directory
❌ Build failed
```

If you see bad signs, **Root Directory is still wrong**.

---

## 🎯 COMMON MISTAKES

### Mistake 1: Root Directory is empty
**Fix**: Set it to `client` (no slashes, no dots)

### Mistake 2: Didn't save after editing
**Fix**: Always click **Save** after changing settings

### Mistake 3: Used build cache
**Fix**: Always uncheck "Use existing Build Cache" when redeploying

### Mistake 4: Environment variables not set for all environments
**Fix**: Check all 3 boxes (Production, Preview, Development)

### Mistake 5: Changed settings but didn't redeploy
**Fix**: After changing ANY setting, you MUST redeploy

---

## 📸 WHAT TO SEND ME IF STILL NOT WORKING

If it's still not working after following this checklist:

1. **Screenshot of Root Directory setting**
   - Settings → General → Root Directory section

2. **Screenshot of Build & Development Settings**
   - Settings → General → Build & Development Settings section

3. **Screenshot of Environment Variables**
   - Settings → Environment Variables (show both variables)

4. **Screenshot or text of Build Logs**
   - From the failed deployment

This will help me see exactly what's wrong.

---

## ⚡ QUICK TEST

After successful deployment:

1. Click **Visit** button
2. You should see: **Login/Registration page**
3. You should NOT see: **404 error**

---

## 🆘 NUCLEAR OPTION (If Nothing Works)

If you've verified everything and it still doesn't work:

### Delete and Recreate:

1. **Delete project**:
   - Settings → General → Scroll to bottom
   - Click "Delete Project"

2. **Create new deployment**:
   - Go to https://vercel.com/new
   - Import your Git repository
   - **BEFORE clicking Deploy**:
     - Click "Edit" next to Root Directory
     - Type: `client`
     - Framework Preset: `Vite`
   - Click **Deploy**

3. **Add environment variables** (see section 3 above)

4. **Redeploy** (see section 4 above)

---

**Remember**: Port 5000 in your `.env` file has NOTHING to do with Vercel deployment. That's only for your local backend server.
