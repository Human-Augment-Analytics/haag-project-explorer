#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const projectsDir = path.join(root, "projects");
const manifestPath = path.join(projectsDir, "manifest.json");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(manifestPath)) {
  fail("projects/manifest.json not found");
  process.exit();
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (error) {
  fail(`projects/manifest.json is not valid JSON: ${error.message}`);
  process.exit();
}

if (!Array.isArray(manifest.projects)) {
  fail("projects/manifest.json must contain a projects array");
  process.exit();
}

const listed = new Set();
for (const filename of manifest.projects) {
  if (typeof filename !== "string" || filename === "." || filename === ".." ||
      path.basename(filename) !== filename || !filename.endsWith(".yml")) {
    fail(`invalid project filename in manifest: ${filename}`);
    continue;
  }

  const projectPath = path.resolve(projectsDir, filename);
  const relativePath = path.relative(projectsDir, projectPath);
  if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    fail(`project path escapes projects directory: ${filename}`);
    continue;
  }

  if (listed.has(filename)) fail(`duplicate project in manifest: ${filename}`);
  listed.add(filename);
  if (!fs.existsSync(projectPath)) fail(`missing project file: ${filename}`);
}

const dirFiles = fs.readdirSync(projectsDir).filter((name) => name.endsWith(".yml"));
for (const filename of dirFiles) {
  if (!listed.has(filename)) fail(`project file is not listed in manifest: ${filename}`);
}

// Ensure no unedited placeholder link values exist in project files
for (const filename of dirFiles) {
  const projectPath = path.resolve(projectsDir, filename);
  if (!fs.existsSync(projectPath)) continue;
  const content = fs.readFileSync(projectPath, "utf8");
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(\s*)([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const val = match[3].split("#")[0].trim();
    if (/example\.(com|edu)|github\.com\/org\/\.\.\.|doi\.org\/\.\.\./i.test(val)) {
      fail(`${filename} contains active placeholder link value: ${val}`);
    }
  }
}

const peoplePath = path.join(root, "people.html");
if (fs.existsSync(peoplePath)) {
  const peopleHtml = fs.readFileSync(peoplePath, "utf8");
  const inlineScripts = [...peopleHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  inlineScripts.forEach((match, index) => {
    try {
      new vm.Script(match[1], { filename: `people.html inline script ${index + 1}` });
    } catch (error) {
      fail(`${error.message} in people.html inline script ${index + 1}`);
    }
  });
}

if (process.exitCode) process.exit();
console.log(`✓ Manifest matches all ${listed.size} project files; links verified; people.html inline JavaScript parses.`);
