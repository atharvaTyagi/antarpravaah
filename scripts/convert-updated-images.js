#!/usr/bin/env node

/**
 * Convert updated SVG images to WebP at 90% quality
 *
 * This script converts three specific updated SVG images:
 * - immersion_2.svg
 * - immersion_workshop_3.svg
 * - Private Sessions.svg
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Files to convert with their target dimensions for crisp display
const filesToConvert = [
  {
    filename: 'immersion_2.svg',
    // Current display: 280x280, render at 2x for retina displays
    width: 560,
    height: 560,
  },
  {
    filename: 'immersion_workshop_3.svg',
    // Current display: 400x206, render at 2x for retina displays
    width: 800,
    height: 412,
  },
  {
    filename: 'Private Sessions.svg',
    // Current display: 400x300, render at 2x for retina displays
    width: 800,
    height: 600,
  },
];

const publicDir = path.join(__dirname, '..', 'public');
const QUALITY = 90;

async function convertToWebP(file) {
  const inputPath = path.join(publicDir, file.filename);
  const outputPath = path.join(publicDir, file.filename.replace(/\.svg$/, '.webp'));

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${file.filename} - file not found`);
    return;
  }

  try {
    // Convert SVG to WebP at 2x dimensions for crisp display on all screens
    // Use unlimited: true for very large/complex SVGs
    await sharp(inputPath, {
      density: 300,
      unlimited: true
    })
      .resize(file.width, file.height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const reduction = inputSize > outputSize
      ? ((1 - outputSize / inputSize) * 100).toFixed(1)
      : '0';

    console.log(
      `✓ ${file.filename.padEnd(30)} ${formatSize(inputSize)} → ${formatSize(outputSize)} (${reduction}% reduction)`
    );
    console.log(`  Dimensions: ${file.width}x${file.height}px @ ${QUALITY}% quality`);
  } catch (error) {
    console.error(`✗ Failed to convert ${file.filename}:`, error.message);
  }
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`.padStart(10);
  }
  return `${(bytes / 1024).toFixed(2)}KB`.padStart(10);
}

async function main() {
  console.log('🖼️  Converting Updated Images to WebP');
  console.log('======================================\n');
  console.log(`Quality: ${QUALITY}%`);
  console.log(`Strategy: 2x dimensions for crisp display on all breakpoints\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of filesToConvert) {
    await convertToWebP(file);

    const inputPath = path.join(publicDir, file.filename);
    const outputPath = path.join(publicDir, file.filename.replace(/\.svg$/, '.webp'));

    if (fs.existsSync(inputPath)) {
      totalBefore += fs.statSync(inputPath).size;
    }
    if (fs.existsSync(outputPath)) {
      totalAfter += fs.statSync(outputPath).size;
    }
    console.log('');
  }

  console.log('======================================');
  console.log(`Total: ${formatSize(totalBefore)} → ${formatSize(totalAfter)}`);
  if (totalBefore > 0) {
    console.log(`Overall change: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
  }
  console.log('======================================\n');

  console.log('✅ Conversion complete!');
  console.log('\n📝 Next step: Run upload script');
  console.log('   npm run upload-to-cloudinary\n');
}

main().catch(console.error);
