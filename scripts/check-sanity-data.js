/**
 * Diagnostic script to check Sanity data
 * Run with: node scripts/check-sanity-data.js
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-01-31',
  useCdn: false, // Use fresh data
  token: process.env.SANITY_API_TOKEN, // Optional: only needed for private datasets
});

async function checkData() {
  console.log('\n=== SANITY DATA DIAGNOSTICS ===\n');
  console.log(`Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}\n`);

  try {
    // Check all thoughts (published and unpublished)
    console.log('--- THOUGHTS ---');
    const allThoughts = await client.fetch(`*[_type == "thought"] {
      _id,
      content,
      published,
      publishedAt
    }`);
    console.log(`Total thoughts: ${allThoughts.length}`);

    const publishedThoughts = allThoughts.filter(t => t.published);
    console.log(`Published thoughts: ${publishedThoughts.length}`);

    if (allThoughts.length > 0) {
      console.log('\nSample thought:');
      console.log(JSON.stringify(allThoughts[0], null, 2));
    } else {
      console.log('⚠️  No thoughts found in database');
    }

    // Check all immersions (published and unpublished)
    console.log('\n--- IMMERSIONS ---');
    const allImmersions = await client.fetch(`*[_type == "immersion"] {
      _id,
      title,
      type,
      published,
      order
    }`);
    console.log(`Total immersions: ${allImmersions.length}`);

    const publishedImmersions = allImmersions.filter(i => i.published);
    console.log(`Published immersions: ${publishedImmersions.length}`);

    if (allImmersions.length > 0) {
      console.log('\nSample immersion:');
      console.log(JSON.stringify(allImmersions[0], null, 2));
    } else {
      console.log('⚠️  No immersions found in database');
    }

    // Check all trainings (published and unpublished)
    console.log('\n--- TRAININGS ---');
    const allTrainings = await client.fetch(`*[_type == "training"] {
      _id,
      title,
      published,
      order
    }`);
    console.log(`Total trainings: ${allTrainings.length}`);

    const publishedTrainings = allTrainings.filter(t => t.published);
    console.log(`Published trainings: ${publishedTrainings.length}`);

    if (allTrainings.length > 0) {
      console.log('\nSample training:');
      console.log(JSON.stringify(allTrainings[0], null, 2));
    } else {
      console.log('⚠️  No trainings found in database');
    }

    // Check testimonials
    console.log('\n--- TESTIMONIALS ---');
    const allTestimonials = await client.fetch(`*[_type == "testimonial"] {
      _id,
      name,
      published
    }`);
    console.log(`Total testimonials: ${allTestimonials.length}`);

    const publishedTestimonials = allTestimonials.filter(t => t.published);
    console.log(`Published testimonials: ${publishedTestimonials.length}`);

    console.log('\n=== END DIAGNOSTICS ===\n');

    // Summary
    if (allThoughts.length === 0 && allImmersions.length === 0) {
      console.log('🚨 ACTION NEEDED: No documents found in Sanity.');
      console.log('   1. Open Sanity Studio: npx sanity dev');
      console.log('   2. Create some thoughts and immersions');
      console.log('   3. Make sure to toggle "Published" to true\n');
    } else if (publishedThoughts.length === 0 || publishedImmersions.length === 0) {
      console.log('⚠️  ACTION NEEDED: Documents exist but are not published.');
      console.log('   1. Open Sanity Studio: npx sanity dev');
      console.log('   2. Edit your documents');
      console.log('   3. Toggle "Published" field to true\n');
    } else {
      console.log('✅ Data looks good! Documents are published and should be visible.\n');
    }

  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
    console.error('\nPossible issues:');
    console.error('- Check your .env.local file has correct NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET');
    console.error('- Verify your Sanity project is accessible');
    console.error('- Run: npx sanity deploy to deploy your schema\n');
  }
}

checkData();
