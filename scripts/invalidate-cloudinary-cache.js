#!/usr/bin/env node

/**
 * Invalidate Cloudinary CDN cache for updated images
 *
 * This script explicitly invalidates the CDN cache by:
 * 1. Checking current image info
 * 2. Using Cloudinary's explicit invalidation API
 */

const { v2: cloudinary } = require('cloudinary');
require('dotenv').config({ path: '.env.local' });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imagesToInvalidate = [
  'antarpravaah/immersions/immersion_2',
  'antarpravaah/immersions/workshops/immersion_workshop_3',
  'antarpravaah/general/Private Sessions',
];

async function checkImageInfo(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId);
    console.log(`\n📷 ${publicId}`);
    console.log(`   Version: ${result.version}`);
    console.log(`   Created: ${new Date(result.created_at).toLocaleString()}`);
    console.log(`   Size: ${(result.bytes / 1024).toFixed(2)} KB`);
    console.log(`   Format: ${result.format}`);
    console.log(`   Width x Height: ${result.width} x ${result.height}`);
    console.log(`   URL: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`❌ Error checking ${publicId}: ${error.message}`);
    return null;
  }
}

async function explicitInvalidate(publicId) {
  try {
    // Use the explicit API to force invalidation
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      invalidate: true,
    });
    console.log(`✅ Invalidated CDN cache for: ${publicId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to invalidate ${publicId}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🔍 Checking Cloudinary Image Information');
  console.log('=========================================');

  for (const publicId of imagesToInvalidate) {
    await checkImageInfo(publicId);
  }

  console.log('\n\n🔄 Invalidating CDN Cache');
  console.log('=========================================');

  for (const publicId of imagesToInvalidate) {
    await explicitInvalidate(publicId);
  }

  console.log('\n\n✅ Cache Invalidation Complete');
  console.log('=========================================');
  console.log('\n💡 Tips for immediate viewing:');
  console.log('   1. Use cache-busted URLs with version parameter');
  console.log('   2. Add ?v=' + Date.now() + ' to your image URLs temporarily');
  console.log('   3. Wait 5-10 minutes for global CDN propagation');
  console.log('   4. Try accessing from an incognito window\n');

  console.log('🔗 Cache-busted URLs (open in incognito to verify new images):');
  imagesToInvalidate.forEach(id => {
    const url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v${Date.now()}/${id}`;
    console.log(`   ${url.replace(/ /g, '%20')}`);
  });
}

main().catch(console.error);
