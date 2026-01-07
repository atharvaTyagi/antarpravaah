# Image Optimization Scripts

This directory contains scripts to convert large SVG files to optimized WebP format.

## Problem

The site currently has ~125MB of SVG files that are actually photo-like images. These cause:
- Slow page loads
- High bandwidth usage
- Potential deployment issues on Netlify

## Solution

Convert photo-like SVGs to WebP format with 80-85% quality, reducing file sizes by ~95%.

## Setup

1. Install sharp dependency:
   ```bash
   npm install --save-dev sharp
   ```

## Usage

### Step 1: Convert images to WebP

```bash
node scripts/convert-images.js
```

This will:
- Create a backup of all original SVGs in `public-svg-backup/`
- Convert 19 large SVG files to WebP format
- Display size reduction statistics

### Step 2: Update code references

```bash
node scripts/update-image-refs.js
```

This automatically updates:
- `app/about/page.tsx` - Namita portrait images
- `app/immersions/page.tsx` - Immersion and training images
- `components/WeWorkTogether.tsx` - Card images

### Step 3: Test the site

```bash
npm run dev
```

Visit and verify:
- `/about` - Check Namita portrait grid
- `/immersions` - Check immersion cards and training images
- Homepage - Check "We Work Together" cards

### Step 4: Clean up (after testing)

Once you've verified everything works:

```bash
# Delete the large SVG files from public/
rm public/immersion_*.svg
rm public/namita_*.svg
rm public/training_*.svg
rm public/we_work_together_vector_*.svg
```

⚠️ **Keep the backups in `public-svg-backup/` - do NOT commit them to git**

## Files Converted

| File | Original Size | Category |
|------|--------------|----------|
| `immersion_1.svg` | 18MB | Immersion cards |
| `immersion_2.svg` | 15MB | Immersion cards |
| `immersion_3.svg` | 9.6MB | Immersion cards |
| `immersion_workshop_1.svg` | 13MB | Workshop images |
| `immersion_workshop_2.svg` | 15MB | Workshop images |
| `immersion_workshop_3.svg` | 11MB | Workshop images |
| `namita_one.svg` | 131KB | About page portraits |
| `namita_two.svg` | 14MB | About page portraits |
| `namita_three.svg` | 1.5MB | About page portraits |
| `namita_four.svg` | 11MB | About page portraits |
| `namita_five.svg` | 2.1MB | About page portraits |
| `namita_six.svg` | 16MB | About page portraits |
| `training_1.svg` | 2.0MB | Training images |
| `training_2.svg` | 6.8MB | Training images |
| `training_3.svg` | 3.1MB | Training images |
| `we_work_together_vector_one.svg` | 2.9MB | Homepage cards |
| `we_work_together_vector_two.svg` | 15MB | Homepage cards |
| `we_work_together_vector_three.svg` | 132KB | Homepage cards |
| `we_work_together_vector_four.svg` | 4.8MB | Homepage cards |

## Expected Results

- **Before**: ~125MB total
- **After**: ~6-12MB total (estimated)
- **Reduction**: ~90-95%

## Backup Strategy

Original SVG files are backed up to `public-svg-backup/`:
- ✓ Keep this folder locally
- ✗ Do NOT commit to git (add to .gitignore)
- ✓ Store elsewhere if needed (cloud storage, external drive)

## Rollback

If you need to revert:

```bash
cp public-svg-backup/*.svg public/
node scripts/update-image-refs.js  # Run in reverse
```

Or manually restore from `public-svg-backup/`.

## Notes

- WebP has 99%+ browser support (all modern browsers)
- Quality 82 balances file size and visual quality
- Photo-like images compress extremely well as WebP
- True vector SVGs (icons, logos) are NOT converted
