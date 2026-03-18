/**
 * Test the actual queries used in the app
 * Run with: node scripts/test-queries.js
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-01-31',
  useCdn: false,
});

// Exact queries from queries.ts
const thoughtsQuery = `*[_type == "thought" && published == true] | order(publishedAt desc) {
  _id,
  content,
  image,
  publishedAt
}`;

const immersionsQuery = `*[_type == "immersion" && published == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  type,
  duration,
  language,
  prerequisite,
  format,
  about,
  whatToExpect,
  image,
  ctaText,
  order
}`;

async function testQueries() {
  console.log('\n=== TESTING ACTUAL APP QUERIES ===\n');

  try {
    console.log('Testing THOUGHTS query...');
    const thoughts = await client.fetch(thoughtsQuery);
    console.log(`✅ Thoughts fetched: ${thoughts.length}`);
    if (thoughts.length > 0) {
      console.log('First thought:', JSON.stringify(thoughts[0], null, 2));
    }

    console.log('\nTesting IMMERSIONS query...');
    const immersions = await client.fetch(immersionsQuery);
    console.log(`✅ Immersions fetched: ${immersions.length}`);
    if (immersions.length > 0) {
      console.log('First immersion:', JSON.stringify(immersions[0], null, 2));
    }

    console.log('\n=== QUERY TEST COMPLETE ===\n');

    if (thoughts.length > 0 && immersions.length > 0) {
      console.log('✅ All queries working correctly!');
      console.log('\nIf data is not showing on your website, check:');
      console.log('1. Browser console for errors (F12)');
      console.log('2. Network tab to see if API calls are failing');
      console.log('3. Check if components are mounted and rendering');
      console.log('4. Verify environment variables in production deployment');
    }

  } catch (error) {
    console.error('❌ Query error:', error);
  }
}

testQueries();
