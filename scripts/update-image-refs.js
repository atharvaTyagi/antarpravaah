const fs = require('fs');
const path = require('path');

// Map of files to update and their SVG->WebP replacements
const filesToUpdate = [
  'app/about/page.tsx',
  'app/immersions/page.tsx',
  'components/WeWorkTogether.tsx'
];

const replacements = [
  ['/immersion_1.svg', '/immersion_1.webp'],
  ['/immersion_2.svg', '/immersion_2.webp'],
  ['/immersion_3.svg', '/immersion_3.webp'],
  ['/immersion_workshop_1.svg', '/immersion_workshop_1.webp'],
  ['/immersion_workshop_2.svg', '/immersion_workshop_2.webp'],
  ['/immersion_workshop_3.svg', '/immersion_workshop_3.webp'],
  ['/namita_one.svg', '/namita_one.webp'],
  ['/namita_two.svg', '/namita_two.webp'],
  ['/namita_three.svg', '/namita_three.webp'],
  ['/namita_four.svg', '/namita_four.webp'],
  ['/namita_five.svg', '/namita_five.webp'],
  ['/namita_six.svg', '/namita_six.webp'],
  ['/training_1.svg', '/training_1.webp'],
  ['/training_2.svg', '/training_2.webp'],
  ['/training_3.svg', '/training_3.webp'],
  ['/we_work_together_vector_one.svg', '/we_work_together_vector_one.webp'],
  ['/we_work_together_vector_two.svg', '/we_work_together_vector_two.webp'],
  ['/we_work_together_vector_three.svg', '/we_work_together_vector_three.webp'],
  ['/we_work_together_vector_four.svg', '/we_work_together_vector_four.webp']
];

function updateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let changeCount = 0;

  for (const [oldRef, newRef] of replacements) {
    const regex = new RegExp(oldRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);

    if (matches) {
      content = content.replace(regex, newRef);
      changeCount += matches.length;
    }
  }

  if (changeCount > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ ${filePath.padEnd(40)} (${changeCount} references updated)`);
  } else {
    console.log(`  ${filePath.padEnd(40)} (no changes)`);
  }
}

function main() {
  console.log('\n📝 Updating image references from .svg to .webp...\n');

  for (const file of filesToUpdate) {
    updateFile(file);
  }

  console.log('\n✓ Image references updated successfully!\n');
}

main();
