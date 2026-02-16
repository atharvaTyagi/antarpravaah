# Create Sanity Read Token - Fix 403 Error

## 🚨 Problem

Your environment variables are set correctly, but you're still getting 403 errors because `next-sanity@12.1.0` automatically adds `perspective=published` to queries, which requires authentication even for public datasets.

## ✅ Solution: Create a Read Token

### Step 1: Create Token in Sanity Dashboard (2 minutes)

1. Go to: https://www.sanity.io/manage/personal/project/31nfdrj2/api

2. Click the **"Tokens"** tab (or **"Add API token"** button)

3. Fill in the form:
   - **Label:** `Production Read Token` or `Netlify Token`
   - **Permissions:** Select **"Viewer"** (read-only access)

4. Click **"Add token"** or **"Save"**

5. **COPY THE TOKEN IMMEDIATELY!**
   - You will see it only once
   - It looks like: `skAbCdEfGhIjKlMnOpQrStUvWxYz1234567890...`
   - Save it somewhere temporarily

### Step 2: Add Token to Local .env.local (1 minute)

Open your `.env.local` file and add:

```bash
NEXT_PUBLIC_SANITY_READ_TOKEN=sk_YOUR_TOKEN_HERE
```

Replace `sk_YOUR_TOKEN_HERE` with the token you just copied.

### Step 3: Add Token to Netlify (2 minutes)

1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment variables**
4. Click **"Add a variable"**
5. Enter:
   ```
   Key: NEXT_PUBLIC_SANITY_READ_TOKEN
   Value: sk_YOUR_TOKEN_HERE
   ```
6. Check all scopes:
   - ☑ Production
   - ☑ Deploy Previews
   - ☑ Branch deploys
7. Click **"Save"**

### Step 4: Redeploy (1 minute)

1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for build to complete

### Step 5: Verify (1 minute)

After deployment:

1. Open your production site
2. Press F12 → Network tab
3. Reload the page
4. Look for Sanity API requests
5. Status should be **200 OK** instead of 403!

## ✅ Expected Result

- Sanity API calls will return **200 OK**
- Thoughts and immersions data will display correctly
- No more 403 Forbidden errors

## 🔒 Security Note

Using `NEXT_PUBLIC_` prefix means the token is visible in the browser, which is fine because:
- ✅ It's a **read-only** token (Viewer permission)
- ✅ Your content is meant to be public anyway
- ✅ No one can edit or delete content with this token

Never use `NEXT_PUBLIC_` for tokens with write/delete permissions!

## 📋 Quick Checklist

- [ ] Created token with "Viewer" permission in Sanity
- [ ] Copied token immediately
- [ ] Added `NEXT_PUBLIC_SANITY_READ_TOKEN` to `.env.local`
- [ ] Added `NEXT_PUBLIC_SANITY_READ_TOKEN` to Netlify
- [ ] Checked all scopes in Netlify
- [ ] Cleared cache and redeployed
- [ ] Verified 200 OK in Network tab

## 🎉 Done!

Your site should now load all Sanity data correctly without any 403 errors!
