# Netlify Deployment Guide

## ✅ What Was Fixed

1. **Updated React to 19.2.4** - Matches peer dependency requirements
2. **Created `.npmrc`** - Tells npm to use legacy-peer-deps during build
3. **Created `netlify.toml`** - Configures Netlify build settings
4. **Updated Sanity client** - Supports optional read tokens

## 🚀 Deploy to Netlify

### Step 1: Verify Environment Variables

Go to your Netlify dashboard:
1. Select your site
2. Go to **Site settings** → **Build & deploy** → **Environment variables**
3. Add/verify these variables:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=31nfdrj2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-31
```

Optional (only if dataset is private):
```bash
NEXT_PUBLIC_SANITY_READ_TOKEN=your-token-here
```

Also add your other environment variables:
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dtipijiwr
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=your-url-here
NEXT_PUBLIC_GOOGLE_SCRIPT_TOKEN=your-token-here
NEXT_PUBLIC_TALLY_FORM_ID=zxMvag
NEXT_PUBLIC_TALLY_API_KEY=your-key-here
```

### Step 2: Push Changes to Git

Commit the new files:

```bash
git add .npmrc netlify.toml package.json package-lock.json
git commit -m "fix: update React and add Netlify configuration for Sanity v5"
git push
```

### Step 3: Trigger Deployment

Netlify will automatically deploy when you push. Or manually trigger:

1. Go to Netlify dashboard
2. Click **Deploys** tab
3. Click **Trigger deploy** → **Deploy site**

### Step 4: Verify Build Success

Watch the build logs in Netlify:
- ✅ Build should complete without peer dependency errors
- ✅ All environment variables should be available
- ✅ Next.js build should succeed

### Step 5: Test Your Site

Once deployed:
1. Open your production site
2. Press F12 to open DevTools
3. Check Console for any errors
4. Verify thoughts and immersions are loading
5. Check Network tab - Sanity API calls should return 200 OK

## 🔍 Troubleshooting

### Build Still Failing?

**Issue: npm peer dependency errors**

If you still see peer dependency errors, check that:
1. `.npmrc` file exists in your repo
2. It contains: `legacy-peer-deps=true`
3. File is committed to git

**Issue: Environment variables not working**

1. Verify variables are spelled EXACTLY as shown above
2. Make sure they're in the "Environment variables" section (not "Build hooks")
3. Trigger a NEW deployment after adding variables
4. Old deployments don't get new environment variables

**Issue: 403 Forbidden on Sanity API**

Your dataset visibility check showed it's public, but if you're still getting 403:

1. Create a read token at: https://www.sanity.io/manage/personal/project/31nfdrj2/api
2. Click "Add API token"
3. Name: "Netlify Read Token"
4. Permission: **Viewer** (read-only)
5. Copy the token
6. Add to Netlify environment variables: `NEXT_PUBLIC_SANITY_READ_TOKEN=your-token`
7. Redeploy

### Data Not Showing?

Even if build succeeds, data might not show if:

1. **Environment variables missing** - Add them to Netlify
2. **Old deployment** - Trigger new deployment after adding variables
3. **CDN caching** - Wait 1-2 minutes or clear CDN cache
4. **CORS issues** - Add your Netlify domain to Sanity CORS:

```bash
npx sanity cors add https://your-site.netlify.app --credentials
```

### Check Logs

View deployment logs:
1. Netlify dashboard → **Deploys** tab
2. Click on latest deploy
3. Scroll through the log
4. Look for errors or warnings

View function logs (if using Netlify Functions):
1. Netlify dashboard → **Functions** tab
2. Click on a function
3. View real-time logs

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] All environment variables added to Netlify
- [ ] `.npmrc` file exists and is committed
- [ ] `netlify.toml` file exists and is committed
- [ ] React updated to 19.2.4 in package.json
- [ ] Local build succeeds: `npm run build`
- [ ] Git changes committed and pushed

## 🎯 Expected Build Output

Your Netlify build should show:

```
9:30 AM: Installing dependencies
9:30 AM: npm install --legacy-peer-deps
9:30 AM: added 1427 packages in 45s
9:31 AM: Building Next.js application
9:31 AM: > antarpravaah@0.1.0 build
9:31 AM: > next build
9:31 AM: ✓ Compiled successfully in 7.5s
9:31 AM: ✓ Generating static pages (11/11)
9:32 AM: Build complete
9:32 AM: Deploying to production
```

## 🚨 Common Errors and Solutions

### Error: "ERESOLVE could not resolve"

**Solution:** `.npmrc` file with `legacy-peer-deps=true`

### Error: "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"

**Solution:** Add environment variables in Netlify settings

### Error: "Failed to fetch thoughts from Sanity"

**Solution:**
1. Check Sanity project ID is correct
2. Verify dataset name is "production"
3. Check dataset visibility (public or add token)

### Warning: "The default export of @sanity/image-url has been deprecated"

**Solution:** Already fixed in `sanity/lib/image.ts` - using named export

## 📞 Need More Help?

If you're still having issues:

1. Check Netlify build logs for specific errors
2. Use the debug component: Add `<DebugSanity />` to your page
3. Run diagnostic scripts locally:
   ```bash
   node scripts/check-sanity-data.js
   node scripts/test-queries.js
   node scripts/check-dataset-visibility.js
   ```

## 🎉 Success Indicators

Your deployment is successful when:

- ✅ Netlify build completes without errors
- ✅ Site loads without console errors
- ✅ Thoughts section shows your Sanity content
- ✅ Immersions page displays your immersions
- ✅ Network tab shows 200 OK for Sanity API calls

---

**Last Updated:** After Sanity v5 migration and React 19.2.4 update
