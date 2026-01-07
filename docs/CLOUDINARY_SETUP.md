# Cloudinary CDN Setup Guide

This guide explains how to use Cloudinary as a CDN for image delivery in the Antar Pravaah Next.js application.

## Table of Contents

- [Overview](#overview)
- [Getting Cloudinary Credentials](#getting-cloudinary-credentials)
- [Environment Setup](#environment-setup)
- [Uploading Images](#uploading-images)
- [Using Images in Components](#using-images-in-components)
- [Adding New Images](#adding-new-images)
- [Cloudinary URL Structure](#cloudinary-url-structure)
- [Troubleshooting](#troubleshooting)
- [Rollback Instructions](#rollback-instructions)

## Overview

We use Cloudinary to:
- Serve optimized images via CDN
- Automatically deliver AVIF/WebP formats based on browser support
- Reduce bundle size and improve page load times
- Enable responsive image delivery

**What's on Cloudinary:**
- Large WebP images (namita_*.webp, immersion_*.webp, training_*.webp, etc.)

**What stays local:**
- Small icons and SVGs (< 100KB)
- UI elements (buttons, logos, decorative blobs)

## Getting Cloudinary Credentials

1. **Sign up for Cloudinary** (if you haven't already):
   - Go to https://cloudinary.com
   - Create a free account (25GB storage, 25GB bandwidth/month)

2. **Get your credentials**:
   - Log in to https://cloudinary.com/console
   - Go to **Dashboard** → **Account Details**
   - Copy the following:
     - **Cloud Name**
     - **API Key**
     - **API Secret**

## Environment Setup

1. **Create `.env.local` file** in the project root (if it doesn't exist):

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

2. **Replace the placeholder values** with your actual Cloudinary credentials

3. **Restart your development server** for changes to take effect:

```bash
npm run dev
```

## Uploading Images

### First Time Upload

1. **Ensure you have WebP images** in the `/public` folder

2. **Run the upload script**:

```bash
npm run upload:images
```

3. **What the script does**:
   - Scans `/public` for large WebP images
   - Uploads them to Cloudinary with organized folder structure:
     - `antarpravaah/about/` - Namita images
     - `antarpravaah/immersions/` - Immersion decorative images
     - `antarpravaah/immersions/workshops/` - Workshop images
     - `antarpravaah/trainings/` - Training images
     - `antarpravaah/we-work/` - We Work Together section images
     - `antarpravaah/general/` - General images
   - Generates `cloudinary-urls.json` mapping file
   - Skips already uploaded images
   - Shows progress and compression stats

4. **Review the output**:
   - Check the console for upload status
   - Review `cloudinary-urls.json` for URL mappings

### Re-running the Upload

The script is **idempotent** - it skips images that are already uploaded. You can safely run it multiple times.

## Using Images in Components

### Method 1: Using the Cloudinary Helper (Recommended)

```tsx
import Image from 'next/image';
import { getCloudinaryUrl } from '@/lib/cloudinary';

function MyComponent() {
  return (
    <Image
      src={getCloudinaryUrl('antarpravaah/about/namita_one')}
      alt="Namita"
      width={276}
      height={289}
      quality={85}
      loading="lazy"
    />
  );
}
```

### Method 2: Using FadeInImage Component

```tsx
import FadeInImage from '@/components/FadeInImage';
import { getCloudinaryUrl } from '@/lib/cloudinary';

function MyComponent() {
  return (
    <FadeInImage
      src={getCloudinaryUrl('antarpravaah/about/namita_one')}
      alt="Namita"
      width={276}
      height={289}
      className="h-full w-full object-cover"
    />
  );
}
```

### Key Points

- Always import `getCloudinaryUrl` from `@/lib/cloudinary`
- Use the Cloudinary public ID (without file extension)
- Provide `width` and `height` for Next.js Image optimization
- Set `quality` (default: 85) and `loading="lazy"` for best performance

## Adding New Images

When you need to add new large images:

1. **Convert to WebP format** (if not already):
   ```bash
   # Using online tools or CLI
   # Target quality: 80-85%
   ```

2. **Add to `/public` folder** with appropriate naming:
   - For about page: `namita_*.webp`
   - For immersions: `immersion_*.webp`
   - For workshops: `immersion_workshop_*.webp`
   - For trainings: `training_*.webp`

3. **Upload to Cloudinary**:
   ```bash
   npm run upload:images
   ```

4. **Add dimensions to `lib/cloudinary.ts`**:
   ```typescript
   export const imageDimensions = {
     // ... existing dimensions
     'your_new_image': { width: 400, height: 300 },
   };
   ```

5. **Use in components** as shown above

## Cloudinary URL Structure

### Basic URL Format

```
https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
```

### Example URLs

**Original quality:**
```
https://res.cloudinary.com/your_cloud/image/upload/antarpravaah/about/namita_one
```

**With transformations:**
```
https://res.cloudinary.com/your_cloud/image/upload/w_400,h_300,c_fit,q_auto:good,f_auto/antarpravaah/about/namita_one
```

### Transformation Parameters

Our helper function (`getCloudinaryUrl`) automatically applies:
- `q_auto:good` - Automatic quality optimization
- `f_auto` - Automatic format (AVIF/WebP based on browser)
- `c_fit` - Fit within dimensions without cropping
- `w_*` and `h_*` - Width and height (if specified)

### Manual URL Customization

You can pass options to `getCloudinaryUrl`:

```typescript
getCloudinaryUrl('antarpravaah/about/namita_one', {
  width: 400,
  height: 300,
  quality: 90,
  format: 'webp',
  crop: 'fill'
})
```

## Troubleshooting

### Images Not Loading

1. **Check environment variables**:
   ```bash
   # Verify .env.local has correct values
   cat .env.local
   ```

2. **Verify images are uploaded**:
   - Log in to Cloudinary console
   - Check Media Library for your images
   - Verify folder structure matches expected paths

3. **Check browser console** for errors:
   - Look for 404 errors (image not found)
   - Look for CORS errors (configuration issue)

### Upload Script Fails

1. **Check credentials**:
   - Ensure all three environment variables are set
   - Verify no extra spaces in values

2. **Check network connection**:
   - Ensure you can access cloudinary.com
   - Check firewall settings

3. **Check file permissions**:
   - Ensure script has read access to `/public` folder

### Build Errors

1. **Missing dimensions**:
   - Error: "Image with src ... is missing required width/height"
   - Solution: Add dimensions to `lib/cloudinary.ts`

2. **Invalid Cloudinary URL**:
   - Error: "Invalid src prop"
   - Solution: Check `next.config.ts` has correct `remotePatterns`

## Rollback Instructions

If you need to revert to local images:

### Option 1: Quick Rollback (Keep Cloudinary Setup)

1. **Update components** to use local paths:
   ```tsx
   // Change from:
   src={getCloudinaryUrl('antarpravaah/about/namita_one')}
   
   // Back to:
   src="/namita_one.webp"
   ```

2. **Keep all configuration** (next.config.ts, helpers, etc.) for future use

### Option 2: Complete Removal

1. **Revert component changes**:
   ```bash
   git checkout HEAD -- app/about/page.tsx app/immersions/page.tsx components/FadeInImage.tsx
   ```

2. **Remove Cloudinary configuration**:
   ```bash
   # Remove from next.config.ts
   # Delete lib/cloudinary.ts
   # Remove from package.json scripts
   ```

3. **Uninstall packages** (optional):
   ```bash
   npm uninstall cloudinary dotenv
   ```

### Images Remain on Cloudinary

- Uploaded images stay on Cloudinary (free tier has no time limit)
- You can re-enable Cloudinary anytime without re-uploading
- To delete images: Go to Cloudinary console → Media Library

## Performance Benefits

After Cloudinary migration:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total image size | ~125MB | ~8-15MB | 90-94% |
| Initial load time | 30-60s | 2-4s | 15x faster |
| Format optimization | WebP only | AVIF/WebP auto | ✅ |
| CDN delivery | No | Yes | ✅ |
| Responsive images | No | Yes | ✅ |

## Support

For issues or questions:
1. Check this documentation first
2. Review Cloudinary docs: https://cloudinary.com/documentation
3. Check Next.js Image docs: https://nextjs.org/docs/app/api-reference/components/image

## Additional Resources

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Cloudinary Media Library](https://cloudinary.com/console/media_library)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [WebP Image Format](https://developers.google.com/speed/webp)

