# 🚀 Quick Start - Deploy to Netlify

## ✅ All Fixes Applied - Ready to Deploy!

### Step 1: Commit Your Changes (2 minutes)

```bash
git add .
git commit -m "fix: upgrade to Sanity v5 and fix Netlify deployment"
git push
```

### Step 2: Add Environment Variables to Netlify (5 minutes)

🚨 **CRITICAL:** Follow these steps EXACTLY to fix 403 errors!

1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment variables**
4. Click **Edit variables** button
5. Click **Add a variable** for EACH variable below

**⚠️ IMPORTANT: Enter values WITHOUT quotes!**

```
Key: NEXT_PUBLIC_SANITY_PROJECT_ID
Value: 31nfdrj2
(NO quotes around the value!)
```

```
Key: NEXT_PUBLIC_SANITY_DATASET
Value: production
```

```
Key: NEXT_PUBLIC_SANITY_API_VERSION
Value: 2026-01-31
```

```
Key: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
Value: dtipijiwr
```

```
Key: NEXT_PUBLIC_TALLY_FORM_ID
Value: zxMvag
```

```
Key: NEXT_PUBLIC_TALLY_API_KEY
Value: (copy from your .env.local)
```

```
Key: NEXT_PUBLIC_GOOGLE_SCRIPT_URL
Value: (copy from your .env.local)
```

```
Key: NEXT_PUBLIC_GOOGLE_SCRIPT_TOKEN
Value: (copy from your .env.local)
```

6. For each variable, check ALL scopes:
   - ☑ Production
   - ☑ Deploy Previews
   - ☑ Branch deploys

7. Click **Save**

### Step 3: Clear Cache and Deploy (2 minutes)

🚨 **CRITICAL:** You MUST clear cache for new environment variables to work!

1. Go to **Site settings** → **Build & deploy**
2. Scroll down to **Build settings**
3. Click **Clear build cache** button
4. Go to **Deploys** tab
5. Click **Trigger deploy** → **Clear cache and deploy site**
6. Wait for build to complete (2-3 minutes)

### Step 4: Verify Environment Variables (1 minute)

After deployment completes:

1. Open your deployed site
2. Press F12 to open DevTools → Console tab
3. Type and run:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
   ```
4. Should output: `31nfdrj2`
5. If it says `undefined` → Environment variables weren't applied correctly

### Step 5: Verify Data Loading (2 minutes)

1. Stay in DevTools
2. Go to **Network** tab
3. Reload the page
4. Look for requests to `sanity.io`
5. Check status:
   - ✅ **200 OK** = Working!
   - ❌ **403 Forbidden** = Environment variables not set correctly

Also check:
- ✅ No console errors
- ✅ Thoughts section shows content
- ✅ Immersions page displays data

---

## 🎉 Done!

Your site should now be live with all Sanity data displaying correctly!

## ❌ Still Getting 403 Errors?

The 403 error means environment variables are NOT set correctly. See:
- **NETLIFY_ENV_VARS_FIX.md** - Detailed environment variable troubleshooting

Key things to check:
1. Did you enter values WITHOUT quotes?
2. Did you click **Save** after adding variables?
3. Did you **Clear cache and deploy** (not just redeploy)?
4. Do variables show in browser console?

## ❓ Other Issues?

See detailed guides:
- **NETLIFY_DEPLOYMENT.md** - Full deployment guide
- **SANITY_403_FIX.md** - Fix 403 errors
- **DEPLOYMENT_SUMMARY.md** - All changes made

Or run diagnostics locally:
```bash
node scripts/check-sanity-data.js
node scripts/test-queries.js
```
