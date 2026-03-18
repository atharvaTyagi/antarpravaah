/**
 * Check Sanity dataset visibility (public or private)
 * Run with: node scripts/check-dataset-visibility.js
 */

const https = require('https');
require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

console.log('\n=== CHECKING DATASET VISIBILITY ===\n');
console.log(`Project ID: ${projectId}`);
console.log(`Dataset: ${dataset}\n`);

// Try to fetch without token
const url = `https://${projectId}.apicdn.sanity.io/v2026-01-31/data/query/${dataset}?query=*%5B_type%20%3D%3D%20%22thought%22%5D%5B0%5D`;

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}\n`);

  if (res.statusCode === 200) {
    console.log('✅ Dataset is PUBLIC');
    console.log('   Your website should be able to fetch data without issues.\n');
  } else if (res.statusCode === 403) {
    console.log('🔒 Dataset is PRIVATE');
    console.log('   You need to either:');
    console.log('   1. Make it public: npx sanity dataset visibility set production public');
    console.log('   2. Or add a read token to your environment variables\n');
    console.log('   See SANITY_403_FIX.md for detailed instructions.\n');
  } else {
    console.log(`⚠️  Unexpected status code: ${res.statusCode}`);
    console.log('   There may be another issue. Check your project ID and dataset name.\n');
  }
}).on('error', (e) => {
  console.error('❌ Error checking dataset:', e.message);
  console.error('   Make sure you have internet connection and correct project settings.\n');
});
