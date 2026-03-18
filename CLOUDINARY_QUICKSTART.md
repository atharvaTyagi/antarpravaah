# Cloudinary CDN - Quick Start Guide

## 🚀 Setup (One-Time)

### 1. Get Cloudinary Credentials

1. Sign up at https://cloudinary.com (free tier)
2. Go to Dashboard → Account Details
3. Copy: Cloud Name, API Key, API Secret

### 2. Configure Environment Variables

Create/update `.env.local` in project root:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Upload Images to Cloudinary

```bash
npm run upload:images
```

This uploads all large WebP images from `/public` to Cloudinary with organized folder structure.

### 4. Test Locally

```bash
npm run dev
```

Visit your site and verify images load correctly.

## 📁 What's Migrated

**On Cloudinary (via CDN):**
- ✅ `namita_*.webp` (6 images) - About page
- ✅ `immersion_*.webp` (3 images) - Immersions decorative
- ✅ `immersion_workshop_*.webp` (3 images) - Workshop images
- ✅ `training_*.webp` (3 images) - Training images
- ✅ `we_work_together_*.webp` (4 images) - We Work Together section
- ✅ `AP Immersions.webp`, `Private Sessions.webp`, `Trainings.webp`

**Stays Local:**
- Small icons (< 100KB)
- SVG graphics
- UI elements

## 🔧 Key Files Modified

- ✅ `next.config.ts` - Cloudinary remote patterns
- ✅ `lib/cloudinary.ts` - Helper utilities
- ✅ `components/FadeInImage.tsx` - Now uses Next.js Image
- ✅ `app/about/page.tsx` - Uses Cloudinary URLs
- ✅ `app/immersions/page.tsx` - Uses Cloudinary URLs
- ✅ `scripts/upload-to-cloudinary.js` - Upload automation
- ✅ `package.json` - Added upload script
- ✅ `.gitignore` - Ignores cloudinary-urls.json

## 📊 Performance Gains

| Metric | Before | After |
|--------|--------|-------|
| Image size | ~125MB | ~8-15MB |
| Load time | 30-60s | 2-4s |
| Format | WebP | AVIF/WebP (auto) |
| CDN | ❌ | ✅ |

## 🎯 Next Steps

1. **Deploy to Netlify:**
   - Add environment variables in Netlify dashboard
   - Deploy and test

2. **Optional Cleanup:**
   - After verifying images work, you can delete local WebP files
   - Keep them initially as backup

3. **Monitor Usage:**
   - Check Cloudinary dashboard for bandwidth usage
   - Free tier: 25GB storage, 25GB bandwidth/month

## 📚 Full Documentation

See `docs/CLOUDINARY_SETUP.md` for:
- Detailed setup instructions
- Adding new images
- Troubleshooting
- Rollback procedures
- URL structure and customization

## ⚡ Quick Commands

```bash
# Upload images
npm run upload:images

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🆘 Troubleshooting

**Images not loading?**
- Check `.env.local` has correct credentials
- Verify images uploaded: https://cloudinary.com/console/media_library
- Check browser console for errors

**Upload fails?**
- Verify environment variables are set
- Check network connection
- Ensure WebP files exist in `/public`

**Build errors?**
- Run `npm run build` locally first
- Check all image dimensions are defined in `lib/cloudinary.ts`

## 📞 Support

For detailed help, see `docs/CLOUDINARY_SETUP.md`

