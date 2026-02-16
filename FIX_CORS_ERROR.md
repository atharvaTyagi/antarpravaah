# 🚨 FIX CORS ERROR - 2 MINUTE SOLUTION

## The Problem

Sanity is blocking requests from your Netlify domain because it's not in the allowed CORS origins list.

## The Solution (2 minutes)

### Option 1: Using Sanity Dashboard (Recommended)

1. **Go to Sanity CORS settings:**
   - URL: https://www.sanity.io/manage/personal/project/31nfdrj2/api

2. **Click the "CORS Origins" tab**

3. **Click "Add CORS origin"**

4. **Add your Netlify domain:**
   ```
   Origin: https://your-site-name.netlify.app
   ```
   (Replace with your actual Netlify URL)

5. **Check "Allow credentials"** ✅

6. **Click "Save"**

7. **Add localhost for development (optional but recommended):**
   ```
   Origin: http://localhost:3000
   Allow credentials: ✅
   ```

### Option 2: Using Sanity CLI (Faster)

Run this command in your project directory:

```bash
npx sanity cors add https://your-site-name.netlify.app --credentials
```

Replace `your-site-name.netlify.app` with your actual Netlify domain.

For localhost:
```bash
npx sanity cors add http://localhost:3000 --credentials
```

## 🔍 Find Your Netlify Domain

If you don't know your Netlify domain:

1. Go to Netlify Dashboard
2. Click on your site
3. Look at the URL shown at the top (e.g., `https://amazing-site-123abc.netlify.app`)

## ✅ Verify the Fix

After adding CORS origin:

1. Wait 1-2 minutes (CORS changes need time to propagate)
2. Hard refresh your site (Ctrl+Shift+R or Cmd+Shift+R)
3. Open DevTools → Network tab
4. Should see **200 OK** instead of CORS error!

## 📋 Add Multiple Domains

If you have multiple domains (custom domain + Netlify domain):

Add each one separately:
```bash
npx sanity cors add https://your-site-name.netlify.app --credentials
npx sanity cors add https://www.yourdomain.com --credentials
npx sanity cors add https://yourdomain.com --credentials
```

## 🎉 Done!

Your CORS errors will be gone and Sanity data will load correctly!

---

## 🐛 Still Not Working?

### Check CORS is Actually Added

1. Go to https://www.sanity.io/manage/personal/project/31nfdrj2/api
2. Click "CORS Origins" tab
3. Verify your Netlify domain is listed
4. Verify "Allow credentials" is checked

### Check Token is Still There

Make sure `NEXT_PUBLIC_SANITY_READ_TOKEN` is still in Netlify environment variables.

### Clear Everything

1. Clear browser cache completely
2. Try in incognito/private window
3. Clear Netlify cache and redeploy

### Wildcard Option (Not Recommended for Production)

If you're still testing and need a quick fix, you can add:
```bash
npx sanity cors add "*" --credentials
```

⚠️ **Remove this before going to production!** It allows any domain to access your Sanity project.
