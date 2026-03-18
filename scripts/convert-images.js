const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Files to convert (all SVGs > 500KB)
const filesToConvert = [
  'immersion_1.svg',
  'immersion_2.svg',
  'immersion_3.svg',
  'immersion_workshop_1.svg',
  'immersion_workshop_2.svg',
  'immersion_workshop_3.svg',
  'namita_one.svg',
  'namita_two.svg',
  'namita_three.svg',
  'namita_four.svg',
  'namita_five.svg',
  'namita_six.svg',
  'training_1.svg',
  'training_2.svg',
  'training_3.svg',
  'we_work_together_vector_one.svg',
  'we_work_together_vector_two.svg',
  'we_work_together_vector_three.svg',
  'we_work_together_vector_four.svg'
];

const publicDir = path.join(__dirname, '..', 'public');
const backupDir = path.join(__dirname, '..', 'public-svg-backup');

async function convertToWebP(filename, quality = 82) {
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, filename.replace(/\.svg$/, '.webp'));

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} - file not found`);
    return;
  }

  try {
    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(
      `✓ ${filename.padEnd(35)} ${formatSize(inputSize)} → ${formatSize(outputSize)} (${reduction}% reduction)`
    );
  } catch (error) {
    console.error(`✗ Failed to convert ${filename}:`, error.message);
  }
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  }
  return `${(bytes / 1024).toFixed(2)}KB`;
}

async function backupOriginals() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('\n📦 Backing up original SVG files...\n');

  for (const filename of filesToConvert) {
    const sourcePath = path.join(publicDir, filename);
    const backupPath = path.join(backupDir, filename);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, backupPath);
      console.log(`   Backed up: ${filename}`);
    }
  }

  console.log(`\n✓ Backup complete at: ${backupDir}\n`);
}

async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('================================\n');

  // Backup originals
  await backupOriginals();

  // Convert images
  console.log('🔄 Converting images to WebP...\n');

  let totalBefore = 0;
  let totalAfter = 0;

  for (const filename of filesToConvert) {
    await convertToWebP(filename);

    const inputPath = path.join(publicDir, filename);
    const outputPath = path.join(publicDir, filename.replace(/\.svg$/, '.webp'));

    if (fs.existsSync(inputPath)) {
      totalBefore += fs.statSync(inputPath).size;
    }
    if (fs.existsSync(outputPath)) {
      totalAfter += fs.statSync(outputPath).size;
    }
  }

  console.log('\n================================');
  console.log(`Total: ${formatSize(totalBefore)} → ${formatSize(totalAfter)}`);
  console.log(`Overall reduction: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
  console.log('================================\n');

  console.log('📝 Next steps:');
  console.log('   1. Review the generated .webp files');
  console.log('   2. Update image references from .svg to .webp');
  console.log('   3. Test the site thoroughly');
  console.log('   4. Delete original .svg files from /public');
  console.log(`   5. Keep backups in ${backupDir}\n`);
}

main().catch(console.error);
