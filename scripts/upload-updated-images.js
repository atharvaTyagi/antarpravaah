#!/usr/bin/env node

/**
 * Upload updated images to Cloudinary (force overwrite)
 *
 * Uploads the three updated images with overwrite enabled:
 * - immersion_2.webp → antarpravaah/immersions/immersion_2
 * - immersion_workshop_3.webp → antarpravaah/immersions/workshops/immersion_workshop_3
 * - Private Sessions.webp → antarpravaah/general/Private Sessions
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

// Images to upload with their Cloudinary paths
const imagesToUpload = [
  {
    filename: 'immersion_2.webp',
    publicId: 'antarpravaah/immersions/immersion_2',
  },
  {
    filename: 'immersion_workshop_3.webp',
    publicId: 'antarpravaah/immersions/workshops/immersion_workshop_3',
  },
  {
    filename: 'Private Sessions.webp',
    publicId: 'antarpravaah/general/Private Sessions',
  },
];

const publicDir = path.join(process.cwd(), 'public');

async function uploadImage(image) {
  const filePath = path.join(publicDir, image.filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${image.filename}`);
    return { success: false, filename: image.filename };
  }

  try {
    console.log(`🔄 Uploading ${image.filename}...`);

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: image.publicId,
      resource_type: 'image',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      invalidate: true, // Invalidate CDN cache
      quality: 'auto:good',
      fetch_format: 'auto',
    });

    const sizeKB = (result.bytes / 1024).toFixed(2);
    console.log(`✅ Uploaded: ${image.filename} (${sizeKB} KB)`);
    console.log(`   URL: ${result.secure_url}\n`);

    return {
      success: true,
      filename: image.filename,
      publicId: image.publicId,
      url: result.secure_url,
      size: result.bytes,
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${image.filename}: ${error.message}\n`);
    return {
      success: false,
      filename: image.filename,
      error: error.message,
    };
  }
}

async function main() {
  try {
    // Validate environment variables
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.log('❌ Error: Missing Cloudinary credentials in .env.local');
      console.log('\nPlease add the following to your .env.local file:');
      console.log('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name');
      console.log('CLOUDINARY_API_KEY=your_api_key');
      console.log('CLOUDINARY_API_SECRET=your_api_secret');
      process.exit(1);
    }

    console.log('🚀 Uploading Updated Images to Cloudinary');
    console.log('==========================================\n');

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

    console.log('==========================================');
    console.log('Upload Summary:');
    console.log(`✅ Successful: ${successCount}`);
    if (failedCount > 0) {
      console.log(`❌ Failed: ${failedCount}`);
    }
    console.log('==========================================\n');

    if (successCount > 0) {
      console.log('✅ Upload complete! Images are live on Cloudinary.');
      console.log('   The Cloudinary CDN cache has been invalidated.');
      console.log('\n📝 Mapping preserved:');
      imagesToUpload.forEach(img => {
        console.log(`   ${img.filename} → ${img.publicId}`);
      });
    }

    console.log('\n🎨 The images should now be crisp on all breakpoints!');
    console.log('   Rendered at 2x dimensions with 90% quality.\n');
  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
