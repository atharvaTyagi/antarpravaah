# Fix Sanity 403 Forbidden Error

## 🚨 Problem Identified

Your Sanity dataset is **private**, which requires authentication. Currently getting:

```
Status Code: 403 Forbidden
URL: https://31nfdrj2.apicdn.sanity.io/v2026-01-31/data/query/production
```

## ✅ Solution Options

You have two ways to fix this:

---

### Option 1: Make Dataset Public (Recommended) ⭐

**Best for:** Public content like blog posts, thoughts, testimonials that anyone should be able to read.

**Pros:**
- ✅ Simplest solution
- ✅ No tokens to manage
- ✅ Better CDN caching
- ✅ No risk of token exposure

**Cons:**
- ❌ Anyone can read your content (but not edit)

**How to do it:**

```bash
# Make dataset public
npx sanity dataset visibility set production public
```

That's it! Your site should work immediately after this.

---

### Option 2: Use Read Token (Private Dataset) 🔒

**Best for:** Sensitive content that shouldn't be publicly queryable.

**Pros:**
- ✅ Dataset stays private
- ✅ Full control over access

**Cons:**
- ❌ Need to manage tokens
- ❌ Token must be added to production environment
- ❌ Slightly more complex setup

**How to do it:**

#### Step 1: Create a Read Token

1. Go to https://www.sanity.io/manage
2. Select your project (31nfdrj2)
3. Click on **API** tab
4. Click **Add API token**
5. Fill in:
   - **Label**: "Public Read Token" or "Website Token"
   - **Permissions**: Select **Viewer** (read-only)
6. Click **Add token**
7. **COPY THE TOKEN** (you'll only see it once!)

#### Step 2: Add Token to Local Environment

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_SANITY_READ_TOKEN=your-token-here
```

#### Step 3: Add Token to Production

**For Vercel:**
1. Go to Project Settings → Environment Variables
2. Add: `NEXT_PUBLIC_SANITY_READ_TOKEN` = `your-token-here`
3. Apply to: All environments (or just Production)
4. Redeploy your site

**For Netlify:**
1. Go to Site settings → Build & deploy → Environment
2. Add: `NEXT_PUBLIC_SANITY_READ_TOKEN` = `your-token-here`
3. Redeploy your site

#### Step 4: Update Client Configuration

Already done! I've updated `sanity/lib/client.ts` to use the token if provided.

---

## 🎯 Recommendation

For your use case (thoughts, immersions, trainings, testimonials), I recommend **Option 1: Make Dataset Public**.

Why?
- Your content is meant to be displayed publicly on the website
- It's simpler and has no security risks (no one can edit, only read)
- Better performance with CDN caching
- No tokens to manage or rotate

## 📝 Quick Fix Steps

Run this command to make your dataset public:

```bash
npx sanity dataset visibility set production public
```

Then test your site - it should work immediately!

## ✅ Verify It's Working

After making the dataset public OR adding the token:

1. Clear browser cache
2. Reload your production site
3. Open DevTools (F12) → Network tab
4. Look for the Sanity API call
5. Status should be **200 OK** instead of 403

Or run the test script:
```bash
node scripts/test-queries.js
```

## 🔍 Still Getting 403?

If you're still getting 403 after making the dataset public:

1. Wait 1-2 minutes for changes to propagate
2. Clear browser cache completely
3. Try in incognito/private window
4. Check that you ran the command in the correct project directory

If you chose the token approach and still getting 403:

1. Verify token was created with **Viewer** permissions
2. Check token is in environment variables (both local and production)
3. Redeploy your site after adding the token
4. Verify token is actually being sent in the request (check Network tab)

## 💡 Security Note

Using `NEXT_PUBLIC_*` prefix means the token is exposed in the browser. This is fine for:
- ✅ Read-only tokens (Viewer permission)
- ✅ Public content

Never use `NEXT_PUBLIC_*` for:
- ❌ Write tokens (Editor/Admin permissions)
- ❌ Tokens with mutation access

For write operations, use server-side tokens without the `NEXT_PUBLIC_` prefix.
