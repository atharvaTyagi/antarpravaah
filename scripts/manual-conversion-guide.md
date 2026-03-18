# Manual Conversion Guide for Large SVG Files

The following files are too large for sharp to process due to XML buffer limits. They need to be converted using alternative methods.

## Files Requiring Manual Conversion (14 files)

### Immersion Images (5 files)
- `immersion_1.svg` (18MB)
- `immersion_2.svg` (15MB)
- `immersion_workshop_1.svg` (13MB)
- `immersion_workshop_2.svg` (15MB)
- `immersion_workshop_3.svg` (11MB)

### Namita Portraits (3 files)
- `namita_two.svg` (14MB)
- `namita_four.svg` (11MB)
- `namita_six.svg` (16MB)

### Training Images (3 files)
- `training_1.svg` (2.0MB)
- `training_2.svg` (6.8MB)
- `training_3.svg` (3.1MB)

### We Work Together Cards (3 files)
- `we_work_together_vector_one.svg` (2.9MB)
- `we_work_together_vector_two.svg` (15MB)
- `we_work_together_vector_four.svg` (4.8MB)

## Already Converted Successfully (5 files)

✓ `immersion_3.svg` → `immersion_3.webp`
✓ `namita_one.svg` → `namita_one.webp`
✓ `namita_three.svg` → `namita_three.webp`
✓ `namita_five.svg` → `namita_five.webp`
✓ `we_work_together_vector_three.svg` → `we_work_together_vector_three.webp`

---

## Conversion Methods

### Method 1: ImageMagick (Recommended - Batch Processing)

**Install ImageMagick:**

Windows (Chocolatey):
```bash
choco install imagemagick
```

Windows (Direct):
- Download from: https://imagemagick.org/script/download.php
- Install with "Add to PATH" option checked
- Restart terminal

**Convert files:**
```bash
cd public

# Single file
magick immersion_1.svg -quality 82 -define webp:method=6 immersion_1.webp

# Batch convert all (PowerShell)
$files = @(
  "immersion_1.svg",
  "immersion_2.svg",
  "immersion_workshop_1.svg",
  "immersion_workshop_2.svg",
  "immersion_workshop_3.svg",
  "namita_two.svg",
  "namita_four.svg",
  "namita_six.svg",
  "training_1.svg",
  "training_2.svg",
  "training_3.svg",
  "we_work_together_vector_one.svg",
  "we_work_together_vector_two.svg",
  "we_work_together_vector_four.svg"
)

foreach ($file in $files) {
  $output = $file -replace '\.svg$', '.webp'
  magick $file -quality 82 -define webp:method=6 $output
  Write-Host "Converted: $file -> $output"
}
```

**Or use the automated script:**
```bash
node scripts/convert-images-alternative.js
```

---

### Method 2: Online Converter (Quick, No Installation)

**CloudConvert** (Free, high quality):
1. Visit: https://cloudconvert.com/svg-to-webp
2. Upload SVG file(s)
3. Click "Options" → Set Quality to 82%
4. Click "Convert"
5. Download and save to `/public` folder with `.webp` extension

**Batch process:**
- CloudConvert supports multiple files at once
- Drag all 14 files into the upload area
- Set quality once for all files
- Download as ZIP

---

### Method 3: GIMP (Free Desktop App)

1. Download GIMP: https://www.gimp.org/downloads/
2. Open SVG file in GIMP
3. Export As → Choose WebP
4. Set Quality to 82%
5. Save to `/public` folder

---

### Method 4: Figma/Adobe Illustrator (If Available)

**Figma:**
1. Import SVG to Figma
2. Export as PNG (2x resolution)
3. Use sharp-cli to convert PNG to WebP:
   ```bash
   npx sharp-cli -i file.png -o file.webp -f webp --quality 82
   ```

**Adobe Illustrator:**
1. Open SVG
2. File → Export → Export As
3. Choose PNG at 2x
4. Convert PNG to WebP using sharp-cli (see above)

---

## After Conversion Checklist

Once all 14 files are converted:

1. **Verify all .webp files exist:**
   ```bash
   ls public/*.webp
   ```
   You should see 19 .webp files total (5 already done + 14 manual)

2. **Update code references:**
   ```bash
   node scripts/update-image-refs.js
   ```

3. **Test the site:**
   ```bash
   npm run dev
   ```
   Check:
   - `/about` - All 6 Namita portraits load
   - `/immersions` - All immersion cards, workshops, and training images load
   - `/` - All "We Work Together" cards load

4. **Check file sizes:**
   The total should be around 6-12MB (down from 125MB)

5. **Delete original SVGs** (after confirming everything works):
   ```bash
   rm public/immersion_*.svg
   rm public/namita_*.svg
   rm public/training_*.svg
   rm public/we_work_together_vector_*.svg
   ```

---

## Naming Convention

Each converted file should match this pattern:

| Original | Converted |
|----------|-----------|
| `immersion_1.svg` | `immersion_1.webp` |
| `namita_two.svg` | `namita_two.webp` |

**IMPORTANT:** Keep exact same filename, just change extension from `.svg` to `.webp`

---

## Quality Settings

- **Quality: 80-85%** (recommended: 82%)
- **Target file size:** < 500KB per image (most will be 50-300KB)
- **Effort/Method:** 6 (if option available - higher quality, slower)

---

## Troubleshooting

**Issue:** Converted image looks blurry
- **Solution:** Increase quality to 90% or try exporting from Figma at higher resolution

**Issue:** File size still too large (> 1MB)
- **Solution:** Lower quality to 75% or check if source is unnecessarily high resolution

**Issue:** Colors look different
- **Solution:** WebP uses sRGB color space - this is normal and acceptable for web

---

## Support

If you encounter issues, you can:
1. Use ImageMagick (most reliable for batch)
2. Use CloudConvert (easiest, no installation)
3. Convert a few files manually in GIMP to verify quality, then batch with CloudConvert
