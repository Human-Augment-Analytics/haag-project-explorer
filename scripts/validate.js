#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'projects', 'manifest.json');
const projectsDir = path.join(__dirname, '..', 'projects');

if (!fs.existsSync(manifestPath)) {
  console.error('❌ projects/manifest.json not found');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let errors = 0;

const dirFiles = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.yml'));

// 1. Check all manifest projects exist
for (const file of manifest.projects) {
  const full = path.join(projectsDir, file);
  if (!fs.existsSync(full)) {
    console.error(`❌ Missing file listed in manifest: ${file}`);
    errors++;
  }
}

// 2. Warn if any YAML file on disk is omitted from manifest
for (const file of dirFiles) {
  if (!manifest.projects.includes(file)) {
    console.warn(`⚠️ Warning: projects/${file} exists on disk but is not in manifest.json`);
  }
}

// 3. Ensure no unedited placeholder link values exist
for (const file of dirFiles) {
  const content = fs.readFileSync(path.join(projectsDir, file), 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\s*)([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const val = match[3].split('#')[0].trim();
    if (/example\.(com|edu)|github\.com\/org\/\.\.\.|doi\.org\/\.\.\./i.test(val)) {
      console.error(`❌ ${file} contains active placeholder link value: ${val}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\nFound ${errors} issue(s).`);
  process.exit(1);
}

console.log(`✅ All ${manifest.projects.length} project files valid and in sync!`);
