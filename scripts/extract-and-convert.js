const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const failedFiles = [
  'immersion_1.svg',
  'immersion_2.svg',
  'immersion_workshop_1.svg',
  'immersion_workshop_2.svg',
  'immersion_workshop_3.svg',
  'namita_two.svg',
  'namita_four.svg',
  'namita_six.svg',
  'we_work_together_vector_two.svg'
];

const publicDir = path.join(__dirname, '..', 'public');

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  }
  return `${(bytes / 1024).toFixed(2)}KB`;
}

async function extractAndConvert(filename) {
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, filename.replace(/\.svg$/, '.webp'));

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} - file not found`);
    return false;
  }

  try {
    const inputSize = fs.statSync(inputPath).size;
    console.log(`Processing ${filename} (${formatSize(inputSize)})...`);

    // Read SVG file
    const svgContent = fs.readFileSync(inputPath, 'utf8');

    // Look for embedded base64 image (most common pattern in large SVGs)
    const base64Match = svgContent.match(/data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)/);

    if (!base64Match) {
      console.log(`  ❌ No embedded image found`);
      return false;
    }

    const imageType = base64Match[1];
    const base64Data = base64Match[2];

    console.log(`  Found embedded ${imageType} image`);
    console.log(`  Decoding and converting to WebP...`);

    // Decode base64
    const buffer = Buffer.from(base64Data, 'base64');

    // Convert to WebP using sharp
    await sharp(buffer)
      .webp({ quality: 82, effort: 6 })
      .toFile(outputPath);

    const outputSize = fs.statSync(outputPath).size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`  ✓ ${formatSize(inputSize)} → ${formatSize(outputSize)} (${reduction}% reduction)`);
    return true;

  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('\n🔄 Extracting embedded images from large SVG files\n');
  console.log('=' .repeat(60));
  console.log('');

  let successCount = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const filename of failedFiles) {
    const inputPath = path.join(publicDir, filename);
    const outputPath = path.join(publicDir, filename.replace(/\.svg$/, '.webp'));

    if (fs.existsSync(inputPath)) {
      totalBefore += fs.statSync(inputPath).size;
    }

    const success = await extractAndConvert(filename);

    if (success) {
      successCount++;
      if (fs.existsSync(outputPath)) {
        totalAfter += fs.statSync(outputPath).size;
      }
    }

    console.log('');
  }

  console.log('=' .repeat(60));
  console.log(`\nResults: ${successCount}/${failedFiles.length} files converted`);

  if (totalBefore > 0) {
    console.log(`Total: ${formatSize(totalBefore)} → ${formatSize(totalAfter)}`);
    console.log(`Overall reduction: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
  }

  console.log('\n');
}

main().catch(console.error);
