# 🚨 FIX 403 ERROR - 5 MINUTE SOLUTION

## The Problem

Your environment variables are set correctly in Netlify, but `next-sanity` is adding `perspective=published` to API calls, which requires authentication.

## The Solution (5 minutes)

You need a Sanity read token.

### Step 1: Create Token (2 min)

Go to: **https://www.sanity.io/manage/personal/project/31nfdrj2/api**

1. Click **"Add API token"**
2. Label: `Production Token`
3. Permissions: **"Viewer"** (read-only)
4. Click **"Save"**
5. **COPY THE TOKEN** (you only see it once!)

### Step 2: Add to Netlify (2 min)

1. Go to Netlify → Your Site → Site settings → Build & deploy → Environment variables
2. Click **"Add a variable"**
3. Key: `NEXT_PUBLIC_SANITY_READ_TOKEN`
4. Value: [paste your token]
5. Check ALL scopes
6. Click **"Save"**

### Step 3: Redeploy (1 min)

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for build to complete

### Step 4: Verify

1. Open your site
2. F12 → Network tab
3. Should see **200 OK** instead of 403!

## ✅ Done!

Your 403 errors will be gone and data will load correctly!

---

**Need more details?** See `CREATE_SANITY_TOKEN.md`
