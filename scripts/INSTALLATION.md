# ImageMagick Installation Instructions

## Current Situation

- Chocolatey is not installed on your system
- ImageMagick is not installed
- Need to convert 14 large SVG files to WebP

## Options

### Option 1: Install Chocolatey, then ImageMagick (Recommended for Future)

**Step 1 - Install Chocolatey:**

Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**Step 2 - Close and reopen PowerShell as Administrator, then:**
```powershell
choco install imagemagick -y
```

**Step 3 - Close all terminals and reopen, then:**
```bash
cd C:\Users\athar\Atharva-freelance\antarpravaah
node scripts/convert-images-alternative.js
```

---

### Option 2: Direct ImageMagick Installation

**Download & Install:**

1. Visit: https://imagemagick.org/script/download.php#windows
2. Download: `ImageMagick-7.x.x-Q16-HDRI-x64-dll.exe` (recommended)
3. Run installer
4. **IMPORTANT:** Check "Add application directory to system path" during installation
5. **IMPORTANT:** Check "Install legacy utilities (e.g. convert)"
6. Complete installation
7. Close all terminals and reopen
8. Run:
   ```bash
   cd C:\Users\athar\Atharva-freelance\antarpravaah
   node scripts/convert-images-alternative.js
   ```

---

### Option 3: Use CloudConvert (Fastest - No Installation Required)

**This is the quickest option right now!**

1. Visit: https://cloudconvert.com/svg-to-webp

2. Upload these 14 files from `public/` folder:
   - `immersion_1.svg`
   - `immersion_2.svg`
   - `immersion_workshop_1.svg`
   - `immersion_workshop_2.svg`
   - `immersion_workshop_3.svg`
   - `namita_two.svg`
   - `namita_four.svg`
   - `namita_six.svg`
   - `training_1.svg`
   - `training_2.svg`
   - `training_3.svg`
   - `we_work_together_vector_one.svg`
   - `we_work_together_vector_two.svg`
   - `we_work_together_vector_four.svg`

3. Click "Options" → Set Quality to 82%

4. Click "Convert"

5. Download all files (they'll be named with .webp extension)

6. Save all .webp files to the `public/` folder

7. Run:
   ```bash
   node scripts/update-image-refs.js
   ```

8. Test:
   ```bash
   npm run dev
   ```

---

## Which Option Should You Choose?

**Choose Option 3 (CloudConvert)** if:
- ✓ You want to get this done RIGHT NOW (5-10 minutes total)
- ✓ You don't want to install anything
- ✓ You just need to convert these specific files

**Choose Option 1 or 2** if:
- ✓ You'll be doing more image conversions in the future
- ✓ You want a command-line workflow
- ✓ You're comfortable installing software

---

## After Conversion (Any Method)

1. Update code references:
   ```bash
   node scripts/update-image-refs.js
   ```

2. Test the site:
   ```bash
   npm run dev
   ```

3. Verify these pages:
   - http://localhost:3000/about (Namita portraits)
   - http://localhost:3000/immersions (all images)
   - http://localhost:3000 (We Work Together cards)

4. If everything works, delete original SVGs:
   ```bash
   rm public/immersion_1.svg
   rm public/immersion_2.svg
   rm public/immersion_workshop_*.svg
   rm public/namita_two.svg
   rm public/namita_four.svg
   rm public/namita_six.svg
   rm public/training_*.svg
   rm public/we_work_together_vector_one.svg
   rm public/we_work_together_vector_two.svg
   rm public/we_work_together_vector_four.svg
   ```

---

## Current Progress

✅ **Already converted (5 files):**
- immersion_3.svg → immersion_3.webp
- namita_one.svg → namita_one.webp
- namita_three.svg → namita_three.webp
- namita_five.svg → namita_five.webp
- we_work_together_vector_three.svg → we_work_together_vector_three.webp

⏳ **Need conversion (14 files):** Listed above

📦 **Backups:** All originals saved in `public-svg-backup/`
