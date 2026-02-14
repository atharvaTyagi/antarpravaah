# Sanity Deployment Troubleshooting Guide

## ✅ Verified Working Locally
- Sanity queries are returning data correctly
- 4 published thoughts found
- 2 published immersions found
- 2 published trainings found

## 🚨 Issue: Data Not Showing in Production

### Most Common Causes

#### 1. Environment Variables Not Set in Production ⚠️

Your deployment platform (Vercel/Netlify/etc.) needs these environment variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=31nfdrj2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-31
```

**How to fix:**
- **Vercel**: Go to Project Settings → Environment Variables → Add the above
- **Netlify**: Go to Site Settings → Build & deploy → Environment → Add the above
- After adding, **trigger a new deployment** (environment variables don't apply to old builds)

#### 2. CDN Caching Old Data

Your Sanity client has `useCdn: true` which caches responses. This is good for performance but can cause stale data.

**How to fix:**
- Wait a few minutes for CDN cache to expire (usually 1-5 minutes)
- Or temporarily set `useCdn: false` in `sanity/lib/client.ts` for testing
- Use ISR (Incremental Static Regeneration) or server-side rendering for fresh data

#### 3. Build-Time vs Runtime Data Fetching

Your components use `useThoughts()` and `useImmersions()` hooks which fetch data client-side at runtime. This should work, but check:

**How to verify:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for Sanity API calls (to `*.sanity.io` or `*.apicdn.sanity.io`)
4. Check if they're succeeding or failing

#### 4. CORS Issues

If you deployed Studio to a different domain, you may need to add CORS origins.

**How to fix:**
```bash
npx sanity cors add https://your-production-domain.com --credentials
```

### Step-by-Step Troubleshooting

#### Step 1: Verify Environment Variables in Production

Check your deployment platform's environment variables section. They should match exactly:

```bash
# Run this locally to see what should be in production:
cat .env.local | grep SANITY
```

Output should show:
```
NEXT_PUBLIC_SANITY_PROJECT_ID="31nfdrj2"
NEXT_PUBLIC_SANITY_DATASET="production"
```

#### Step 2: Check Browser Console for Errors

1. Open your production site
2. Press F12 to open DevTools
3. Look for red errors in Console tab
4. Common errors:
   - "Missing environment variable" → Environment variables not set
   - "CORS error" → Need to add CORS origin
   - "Failed to fetch" → Network/API issue

#### Step 3: Verify Data in Sanity Dashboard

1. Go to https://www.sanity.io/manage
2. Open your project (31nfdrj2)
3. Click "Vision" tool (or go to your deployed Studio)
4. Run this query to verify published data:

```groq
*[_type == "thought" && published == true] {
  _id,
  content,
  published
}
```

#### Step 4: Force Fresh Build

1. Clear all caches in your deployment platform
2. Trigger a new deployment
3. Wait for build to complete
4. Test again

#### Step 5: Check Network Requests

In production:
1. Open DevTools → Network tab
2. Reload the page
3. Look for requests to Sanity API
4. Check if they return data or errors

### Quick Test Script

Run this locally to verify your data is accessible:

```bash
node scripts/test-queries.js
```

Should show:
```
✅ Thoughts fetched: 4
✅ Immersions fetched: 2
```

### Production Deployment Checklist

- [ ] Environment variables set in deployment platform
- [ ] Sanity Studio deployed: `npx sanity deploy`
- [ ] Schema deployed: `npx sanity schema deploy`
- [ ] CORS origins added for production domain
- [ ] New build triggered after adding environment variables
- [ ] Browser DevTools shows no errors
- [ ] Network tab shows successful Sanity API calls

### Still Not Working?

If data is still not showing after checking all the above:

1. **Enable debug logging** by adding this to `sanity/lib/client.ts`:

```typescript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Temporarily disable CDN
})

// Add this to debug
if (typeof window !== 'undefined') {
  console.log('Sanity config:', { projectId, dataset, apiVersion })
}
```

2. **Test with a simple component** that logs the data:

```typescript
// In any page
import { useEffect } from 'react'
import { useThoughts } from '@/sanity/lib/queries'

export function DebugSanity() {
  const { thoughts, isLoading, error } = useThoughts()

  useEffect(() => {
    console.log('Thoughts data:', thoughts)
    console.log('Loading:', isLoading)
    console.log('Error:', error)
  }, [thoughts, isLoading, error])

  return null
}
```

3. **Contact support** with:
   - Browser console logs
   - Network tab screenshots
   - Deployment platform logs

### Need Help?

Run the diagnostic scripts:
```bash
npm run dev  # Start local dev server
node scripts/check-sanity-data.js  # Check what's in Sanity
node scripts/test-queries.js  # Test actual queries
```
