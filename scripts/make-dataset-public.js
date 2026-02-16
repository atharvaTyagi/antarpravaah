/**
 * Make Sanity dataset public via Management API
 * Run with: node scripts/make-dataset-public.js
 */

const https = require('https');
require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

console.log('\n=== MAKING DATASET PUBLIC ===\n');
console.log(`Project ID: ${projectId}`);
console.log(`Dataset: ${dataset}\n`);

console.log('⚠️  This script requires a management token with admin permissions.');
console.log('To create one:');
console.log('1. Go to https://www.sanity.io/manage/personal/project/' + projectId + '/api');
console.log('2. Click "Add API token"');
console.log('3. Name: "Management Token"');
console.log('4. Permissions: "Deploy Studio + Write" or "Admin"');
console.log('5. Copy the token and add to .env.local as SANITY_MANAGEMENT_TOKEN\n');

const token = process.env.SANITY_MANAGEMENT_TOKEN;

if (!token) {
  console.log('❌ SANITY_MANAGEMENT_TOKEN not found in .env.local');
  console.log('\nAlternatively, run this command instead:');
  console.log('\n  npx sanity dataset visibility set ' + dataset + ' public\n');
  process.exit(1);
}

// Use Management API to set dataset visibility
const options = {
  hostname: 'api.sanity.io',
  path: `/v2021-06-07/projects/${projectId}/datasets/${dataset}`,
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify({
  aclMode: 'public'
});

const req = https.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Dataset is now PUBLIC!');
      console.log('\nYou can verify by running:');
      console.log('  node scripts/check-dataset-visibility.js\n');
    } else {
      console.log(`❌ Failed to update dataset (Status: ${res.statusCode})`);
      console.log('Response:', body);
      console.log('\nTry running this command instead:');
      console.log('  npx sanity dataset visibility set ' + dataset + ' public\n');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(data);
req.end();
