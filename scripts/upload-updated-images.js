#!/usr/bin/env node

/**
 * Upload general images to Cloudinary at full quality (no upload-time compression).
 *
 * Files (place in /public before running):
 *   - Private Sessions.png  → antarpravaah/general/Private Sessions
 *   - AP Immersions.jpg     → antarpravaah/general/AP Immersions
 *   - Trainings.jpg         → antarpravaah/general/Trainings
 *
 * Quality strategy:
 *   - NO quality param on upload → Cloudinary stores the original untouched master
 *   - Delivery-time compression is handled by q_auto:best in lib/cloudinary.ts
 *   - This avoids double-compression (local → upload → delivery)
 */

const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PNG/JPG source files → Cloudinary public IDs (same mappings as before)
const imagesToUpload = [
  {
    filename: 'Private Sessions.png',
    publicId: 'antarpravaah/general/Private Sessions',
  },
  {
    filename: 'AP Immersions.jpg',
    publicId: 'antarpravaah/general/AP Immersions',
  },
  {
    filename: 'Trainings.jpg',
    publicId: 'antarpravaah/general/Trainings',
  },
];

const publicDir = path.join(process.cwd(), 'public');

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function uploadImage(image) {
  const filePath = path.join(publicDir, image.filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${image.filename} (skipping)`);
    return { success: false, filename: image.filename };
  }

  const localSize = fs.statSync(filePath).size;
  console.log(`🔄 Uploading ${image.filename} (${formatSize(localSize)})...`);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: image.publicId,
      resource_type: 'image',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      invalidate: true,
      // No quality param — store the original master at full fidelity.
      // Delivery-time compression (q_auto:best) is applied via URL transformations.
    });

    const cloudinarySize = result.bytes;
    console.log(`✅ Uploaded: ${image.filename}`);
    console.log(`   Stored size : ${formatSize(cloudinarySize)}`);
    console.log(`   Public ID   : ${result.public_id}`);
    console.log(`   URL         : ${result.secure_url}\n`);

    return {
      success: true,
      filename: image.filename,
      publicId: result.public_id,
      url: result.secure_url,
      size: cloudinarySize,
    };
  } catch (error) {
    console.error(`❌ Failed: ${image.filename} — ${error.message}\n`);
    return { success: false, filename: image.filename, error: error.message };
  }
}

async function main() {
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error('❌ Missing Cloudinary credentials in .env.local');
    console.error('   Required: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════');
  console.log('   Upload General Images → Cloudinary (Full Quality)');
  console.log('═══════════════════════════════════════════════════\n');
  console.log('Strategy: No upload-time compression.');
  console.log('          Delivery compression handled by q_auto:best in cloudinary.ts.\n');

  let successCount = 0;
  let failedCount = 0;

  for (const image of imagesToUpload) {
    const result = await uploadImage(image);
    if (result.success) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  console.log('═══════════════════════════════════════════════════');
  console.log('Upload Summary');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Successful : ${successCount}`);
  if (failedCount > 0) console.log(`❌ Failed     : ${failedCount}`);
  console.log(`📊 Total      : ${successCount + failedCount}`);
  console.log('═══════════════════════════════════════════════════\n');

  if (successCount > 0) {
    console.log('✅ Done! Masters are stored at full quality on Cloudinary.');
    console.log('   CDN cache has been invalidated — changes are live immediately.\n');
    console.log('📝 Public ID mappings:');
    imagesToUpload.forEach(img => {
      console.log(`   /public/${img.filename}  →  ${img.publicId}`);
    });
    console.log('');
  }
}

main().catch((err) => {
  console.error(`\n❌ Fatal error: ${err.message}`);
  process.exit(1);
});
