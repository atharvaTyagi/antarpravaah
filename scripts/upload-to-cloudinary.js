#!/usr/bin/env node

/**
 * Upload large WebP images to Cloudinary
 * 
 * This script:
 * - Scans /public for large WebP images
 * - Uploads to Cloudinary with organized folder structure
 * - Generates cloudinary-urls.json mapping file
 * - Skips already uploaded images
 * - Displays progress and compression stats
 */

const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image mapping: filename pattern -> Cloudinary folder
const imageMapping = [
  { pattern: /^namita_.*\.webp$/, folder: 'antarpravaah/about', files: [] },
  { pattern: /^immersion_[123]\.webp$/, folder: 'antarpravaah/immersions', files: [] },
  { pattern: /^immersion_workshop_.*\.webp$/, folder: 'antarpravaah/immersions/workshops', files: [] },
  { pattern: /^training_.*\.webp$/, folder: 'antarpravaah/trainings', files: [] },
  { pattern: /^we_work_together_.*\.webp$/, folder: 'antarpravaah/we-work', files: [] },
  { pattern: /^(AP Immersions|Private Sessions|Trainings)\.webp$/, folder: 'antarpravaah/general', files: [] },
];

// Output mapping file
const outputFile = 'cloudinary-urls.json';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function scanPublicFolder() {
  const publicPath = path.join(process.cwd(), 'public');
  const files = fs.readdirSync(publicPath);
  
  log('\n📁 Scanning /public folder for WebP images...', 'blue');
  
  files.forEach(file => {
    if (file.endsWith('.webp')) {
      const filePath = path.join(publicPath, file);
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      // Find matching folder
      for (const mapping of imageMapping) {
        if (mapping.pattern.test(file)) {
          mapping.files.push({
            filename: file,
            path: filePath,
            size: stats.size,
            sizeMB: sizeMB,
          });
          log(`  ✓ Found: ${file} (${sizeMB} MB) → ${mapping.folder}`, 'cyan');
          break;
        }
      }
    }
  });
  
  const totalFiles = imageMapping.reduce((sum, m) => sum + m.files.length, 0);
  const totalSize = imageMapping.reduce((sum, m) => 
    sum + m.files.reduce((s, f) => s + f.size, 0), 0
  );
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  log(`\n📊 Found ${totalFiles} images (${totalSizeMB} MB total)\n`, 'green');
  
  return totalFiles;
}

async function uploadImage(file, folder) {
  try {
    // Extract filename without extension for public_id
    const publicId = path.basename(file.filename, '.webp');
    const fullPublicId = `${folder}/${publicId}`;
    
    // Check if already uploaded
    try {
      await cloudinary.api.resource(fullPublicId);
      log(`  ⏭️  Skipped: ${file.filename} (already uploaded)`, 'yellow');
      return {
        success: true,
        skipped: true,
        filename: file.filename,
        publicId: fullPublicId,
      };
    } catch (error) {
      // Image doesn't exist, proceed with upload
    }
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: fullPublicId,
      resource_type: 'image',
      folder: folder,
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      quality: 'auto:good',
      fetch_format: 'auto',
    });
    
    const cloudinarySizeKB = (result.bytes / 1024).toFixed(2);
    const originalSizeMB = file.sizeMB;
    const compression = ((1 - result.bytes / file.size) * 100).toFixed(1);
    
    log(`  ✅ Uploaded: ${file.filename} (${cloudinarySizeKB} KB) - ${compression}% compression`, 'green');
    
    return {
      success: true,
      skipped: false,
      filename: file.filename,
      publicId: fullPublicId,
      url: result.secure_url,
      cloudinarySize: result.bytes,
      originalSize: file.size,
    };
  } catch (error) {
    log(`  ❌ Failed: ${file.filename} - ${error.message}`, 'red');
    return {
      success: false,
      filename: file.filename,
      error: error.message,
    };
  }
}

async function uploadAllImages() {
  log('🚀 Starting upload to Cloudinary...\n', 'blue');
  
  const urlMappings = {};
  let uploadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  
  for (const mapping of imageMapping) {
    if (mapping.files.length === 0) continue;
    
    log(`📂 Uploading to folder: ${mapping.folder}`, 'blue');
    
    for (const file of mapping.files) {
      const result = await uploadImage(file, mapping.folder);
      
      if (result.success) {
        // Store mapping: local path -> Cloudinary URL
        const localPath = `/${file.filename}`;
        urlMappings[localPath] = {
          publicId: result.publicId,
          url: result.url || `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${result.publicId}`,
        };
        
        if (result.skipped) {
          skippedCount++;
        } else {
          uploadedCount++;
        }
      } else {
        failedCount++;
      }
    }
    
    log(''); // Empty line between folders
  }
  
  return { urlMappings, uploadedCount, skippedCount, failedCount };
}

async function saveUrlMappings(mappings) {
  const outputPath = path.join(process.cwd(), outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(mappings, null, 2));
  log(`\n💾 Saved URL mappings to: ${outputFile}`, 'green');
}

async function main() {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      log('❌ Error: Missing Cloudinary credentials in .env.local', 'red');
      log('\nPlease add the following to your .env.local file:', 'yellow');
      log('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name');
      log('CLOUDINARY_API_KEY=your_api_key');
      log('CLOUDINARY_API_SECRET=your_api_secret');
      log('\nGet credentials from: https://cloudinary.com/console', 'cyan');
      process.exit(1);
    }
    
    log('═══════════════════════════════════════════════════', 'blue');
    log('   Cloudinary Image Upload Script', 'blue');
    log('═══════════════════════════════════════════════════', 'blue');
    
    // Scan for images
    const totalFiles = await scanPublicFolder();
    
    if (totalFiles === 0) {
      log('⚠️  No WebP images found to upload', 'yellow');
      process.exit(0);
    }
    
    // Upload images
    const { urlMappings, uploadedCount, skippedCount, failedCount } = await uploadAllImages();
    
    // Save mappings
    await saveUrlMappings(urlMappings);
    
    // Summary
    log('\n═══════════════════════════════════════════════════', 'blue');
    log('   Upload Summary', 'blue');
    log('═══════════════════════════════════════════════════', 'blue');
    log(`✅ Uploaded: ${uploadedCount}`, 'green');
    log(`⏭️  Skipped:  ${skippedCount}`, 'yellow');
    if (failedCount > 0) {
      log(`❌ Failed:   ${failedCount}`, 'red');
    }
    log(`📊 Total:    ${uploadedCount + skippedCount + failedCount}`, 'cyan');
    log('═══════════════════════════════════════════════════\n', 'blue');
    
    log('🎉 Done! Images are now available on Cloudinary CDN', 'green');
    log(`\nNext steps:`, 'cyan');
    log(`1. Review ${outputFile} for URL mappings`);
    log(`2. Update components to use Cloudinary URLs`);
    log(`3. Test images load correctly`);
    log(`4. (Optional) Delete local WebP files after verification\n`);
    
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();

