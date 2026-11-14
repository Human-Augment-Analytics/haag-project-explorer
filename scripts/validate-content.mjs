// Checks every content/*.json page against content/blocks.schema.json so that
// a block the renderer does not know (or a missing field) fails the build
// instead of rendering an empty section.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'content');
const schemaPath = path.join(contentDir, 'blocks.schema.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

let failures = 0;
const pages = fs
  .readdirSync(contentDir)
  .filter((name) => name.endsWith('.json') && name !== 'blocks.schema.json');

for (const name of pages) {
  const file = path.join(contentDir, name);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`✗ content/${name} is not valid JSON: ${error.message}`);
    failures += 1;
    continue;
  }
  if (!validate(data)) {
    failures += 1;
    for (const err of validate.errors) {
      console.error(`✗ content/${name}${err.instancePath || ''} ${err.message}`);
    }
  }
}

if (failures) {
  process.exitCode = 1;
} else {
  console.log(`✓ ${pages.length} content page(s) match content/blocks.schema.json.`);
}
