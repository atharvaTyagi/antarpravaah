# Fix 403 Error on Netlify - Environment Variables Issue

## 🚨 Problem

You're getting 403 Forbidden errors on Netlify even though:
- ✅ Dataset is PUBLIC (verified locally)
- ✅ Queries work locally
- ✅ Build succeeds

This means **environment variables are not set correctly in Netlify**.

## 🔍 Root Cause

The error shows the request is going to:
```
https://31nfdrj2.apicdn.sanity.io/v2026-01-31/data/query/production
```

This proves the client has the correct `projectId` and `dataset`, BUT it's still getting 403. This happens when:

1. **Environment variables are missing** in Netlify
2. **Environment variables have typos** or wrong values
3. **Deployment didn't pick up** the new environment variables

## ✅ Solution: Step-by-Step Fix

### Step 1: Verify Local .env.local

First, make sure your local file is correct. Run:

```bash
cat .env.local | grep SANITY
```

You should see:
```
NEXT_PUBLIC_SANITY_PROJECT_ID="31nfdrj2"
NEXT_PUBLIC_SANITY_DATASET="production"
```

**Important:** Remove the quotes if they're there! Environment variables in Netlify should NOT have quotes.

### Step 2: Add Environment Variables to Netlify (EXACT STEPS)

1. **Go to Netlify Dashboard**
   - URL: https://app.netlify.com

2. **Select Your Site**
   - Click on your site name

3. **Go to Environment Variables**
   - Click **Site settings** (in the top menu)
   - Click **Build & deploy** (in the left sidebar)
   - Scroll down to **Environment variables**
   - Click **Edit variables** button

4. **Add Variables ONE BY ONE** (NO QUOTES!)

Click **Add a variable** and add:

```
Key: NEXT_PUBLIC_SANITY_PROJECT_ID
Value: 31nfdrj2
Scopes: ☑ Production ☑ Deploy Previews ☑ Branch deploys
```

```
Key: NEXT_PUBLIC_SANITY_DATASET
Value: production
Scopes: ☑ Production ☑ Deploy Previews ☑ Branch deploys
```

```
Key: NEXT_PUBLIC_SANITY_API_VERSION
Value: 2026-01-31
Scopes: ☑ Production ☑ Deploy Previews ☑ Branch deploys
```

**CRITICAL:**
- ❌ DON'T use quotes: `"31nfdrj2"`
- ✅ DO use: `31nfdrj2`

5. **Save Variables**
   - Click **Save**

### Step 3: Clear Existing Deployment and Redeploy

**Important:** Old deployments don't get new environment variables!

1. **Clear Build Cache**
   - In Netlify Dashboard, go to **Site settings** → **Build & deploy**
   - Scroll to **Build settings**
   - Click **Clear build cache** button

2. **Trigger New Deployment**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Clear cache and deploy site**
   - This ensures a completely fresh build with new environment variables

3. **Wait for Build**
   - Watch the build logs
   - Wait for "Site is live" message

### Step 4: Verify Environment Variables in Build Log

In the build logs, you should see something like:

```
9:30 AM: Environment variables set:
9:30 AM:   NEXT_PUBLIC_SANITY_PROJECT_ID: 31nfdrj2
9:30 AM:   NEXT_PUBLIC_SANITY_DATASET: production
```

If you DON'T see this, the variables weren't applied correctly.

### Step 5: Test Production Site

1. **Open Your Site**
   - Go to your Netlify URL

2. **Open DevTools**
   - Press F12
   - Go to **Console** tab

3. **Check for Environment Variables**
   - Type in console:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
   console.log(process.env.NEXT_PUBLIC_SANITY_DATASET)
   ```

   **Expected output:**
   ```
   31nfdrj2
   production
   ```

   **If you see `undefined`** → Environment variables are not set!

4. **Check Network Tab**
   - Go to **Network** tab
   - Look for requests to `sanity.io`
   - Should show **200 OK** instead of 403

## 🔧 Alternative: Use a Read Token

If environment variables still don't work, use a read token as a workaround:

### Create Token

1. Go to https://www.sanity.io/manage/personal/project/31nfdrj2/api
2. Click **Add API token**
3. Fill in:
   - **Label:** "Netlify Production Token"
   - **Permissions:** Select **Viewer** (read-only)
4. Click **Add token**
5. **Copy the token immediately** (you won't see it again!)

### Add Token to Netlify

Add another environment variable in Netlify:

```
Key: NEXT_PUBLIC_SANITY_READ_TOKEN
Value: [paste your token]
Scopes: ☑ Production ☑ Deploy Previews ☑ Branch deploys
```

Then redeploy (clear cache and deploy).

## 🐛 Still Not Working?

### Debug: Add Console Logging

Temporarily add this to `sanity/lib/client.ts`:

```typescript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN,
})

// Debug logging (remove after fixing)
if (typeof window !== 'undefined') {
  console.log('🔍 Sanity Config:', {
    projectId,
    dataset,
    apiVersion,
    hasToken: !!process.env.NEXT_PUBLIC_SANITY_READ_TOKEN,
  })
}
```

Deploy and check the console. This will show you if the environment variables are actually being loaded.

### Check Netlify Build Logs

Look for these sections in the build logs:

1. **Environment variables loaded:**
   ```
   Building site from "dev" branch
   Loading environment variables from UI
   ```

2. **Next.js build output:**
   ```
   info  - Loaded env from .env.local
   ```

3. **Any errors about missing environment variables**

### Verify netlify.toml

Make sure your `netlify.toml` doesn't override environment variables:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"
  # Don't add Sanity env vars here - use the UI instead

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## ✅ Success Checklist

Your 403 error is fixed when:

- [ ] Environment variables added to Netlify UI (no quotes)
- [ ] All scopes selected (Production, Deploy Previews, Branch deploys)
- [ ] Build cache cleared
- [ ] New deployment triggered
- [ ] Build logs show environment variables loaded
- [ ] Browser console shows correct env var values
- [ ] Network tab shows 200 OK for Sanity API calls
- [ ] Thoughts and immersions data displays on site

## 📞 Still Need Help?

If none of this works:

1. **Screenshot your Netlify environment variables page**
2. **Share the build logs** (especially the "Environment variables" section)
3. **Share browser console output** after adding the debug logging

The issue is definitely with how Netlify is loading the environment variables.
