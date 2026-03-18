const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files that failed with sharp (XML buffer limit)
const largeFiles = [
  'immersion_1.svg',
  'immersion_2.svg',
  'immersion_workshop_1.svg',
  'immersion_workshop_2.svg',
  'immersion_workshop_3.svg',
  'namita_two.svg',
  'namita_four.svg',
  'namita_six.svg',
  'training_1.svg',
  'training_2.svg',
  'training_3.svg',
  'we_work_together_vector_one.svg',
  'we_work_together_vector_two.svg',
  'we_work_together_vector_four.svg'
];

// Files that worked with sharp
const smallFiles = [
  'immersion_3.svg',
  'namita_one.svg',
  'namita_three.svg',
  'namita_five.svg',
  'we_work_together_vector_three.svg'
];

const publicDir = path.join(__dirname, '..', 'public');

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  }
  return `${(bytes / 1024).toFixed(2)}KB`;
}

function checkImageMagick() {
  try {
    execSync('magick --version', { stdio: 'ignore' });
    return true;
  } catch {
    try {
      execSync('convert --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

function convertWithImageMagick(filename, quality = 82) {
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, filename.replace(/\.svg$/, '.webp'));

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} - file not found`);
    return false;
  }

  try {
    const inputSize = fs.statSync(inputPath).size;

    // Try with magick first, fall back to convert
    let command;
    try {
      execSync('magick --version', { stdio: 'ignore' });
      command = `magick "${inputPath}" -quality ${quality} -define webp:method=6 "${outputPath}"`;
    } catch {
      command = `convert "${inputPath}" -quality ${quality} -define webp:method=6 "${outputPath}"`;
    }

    execSync(command, { stdio: 'pipe', maxBuffer: 100 * 1024 * 1024 });

    const outputSize = fs.statSync(outputPath).size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(
      `✓ ${filename.padEnd(35)} ${formatSize(inputSize)} → ${formatSize(outputSize)} (${reduction}% reduction)`
    );
    return true;
  } catch (error) {
    console.error(`✗ Failed to convert ${filename}:`, error.message);
    return false;
  }
}

function extractEmbeddedImage(filename) {
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, filename.replace(/\.svg$/, '.webp'));

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} - file not found`);
    return false;
  }

  try {
    const inputSize = fs.statSync(inputPath).size;
    const svgContent = fs.readFileSync(inputPath, 'utf8');

    // Look for embedded base64 image
    const base64Match = svgContent.match(/data:image\/(png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)/);

    if (!base64Match) {
      console.log(`⚠️  No embedded image found in ${filename}`);
      return false;
    }

    const base64Data = base64Match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Write to temp file
    const tempPath = path.join(publicDir, `temp_${filename}.png`);
    fs.writeFileSync(tempPath, buffer);

    // Convert to WebP using sharp
    const sharp = require('sharp');
    sharp(tempPath)
      .webp({ quality: 82, effort: 6 })
      .toFile(outputPath)
      .then(() => {
        fs.unlinkSync(tempPath);

        const outputSize = fs.statSync(outputPath).size;
        const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

        console.log(
          `✓ ${filename.padEnd(35)} ${formatSize(inputSize)} → ${formatSize(outputSize)} (${reduction}% reduction)`
        );
      })
      .catch((err) => {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        throw err;
      });

    return true;
  } catch (error) {
    console.error(`✗ Failed to extract from ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('\n🖼️  Alternative SVG Conversion Script');
  console.log('=====================================\n');

  console.log('📊 Status of conversions:\n');
  console.log('Already converted with sharp (5 files):');
  smallFiles.forEach((f) => console.log(`   ✓ ${f}`));

  console.log(`\n❌ Failed due to XML buffer limits (${largeFiles.length} files):\n`);

  // Check if ImageMagick is available
  const hasImageMagick = checkImageMagick();

  if (!hasImageMagick) {
    console.log('⚠️  ImageMagick not found!\n');
    console.log('📥 Installation options:\n');
    console.log('Option 1 - Chocolatey (Windows):');
    console.log('   choco install imagemagick\n');
    console.log('Option 2 - Direct download:');
    console.log('   Download from: https://imagemagick.org/script/download.php');
    console.log('   Install and add to PATH\n');
    console.log('Option 3 - Use online conversion tool:');
    console.log('   1. Visit https://cloudconvert.com/svg-to-webp');
    console.log('   2. Upload each large SVG file');
    console.log('   3. Set quality to 80-85%');
    console.log('   4. Download and save to /public folder\n');
    console.log('Files to convert manually:');
    largeFiles.forEach((f) => console.log(`   - ${f}`));
    return;
  }

  console.log('✓ ImageMagick detected! Converting...\n');

  let successCount = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const filename of largeFiles) {
    const inputPath = path.join(publicDir, filename);
    const sizeBefore = fs.existsSync(inputPath) ? fs.statSync(inputPath).size : 0;
    totalBefore += sizeBefore;

    if (convertWithImageMagick(filename)) {
      successCount++;
      const outputPath = path.join(publicDir, filename.replace(/\.svg$/, '.webp'));
      if (fs.existsSync(outputPath)) {
        totalAfter += fs.statSync(outputPath).size;
      }
    }
  }

  console.log('\n=====================================');
  console.log(`Converted: ${successCount}/${largeFiles.length} files`);
  if (totalBefore > 0) {
    console.log(`Size: ${formatSize(totalBefore)} → ${formatSize(totalAfter)}`);
    console.log(`Reduction: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
  }
  console.log('=====================================\n');
}

main().catch(console.error);
