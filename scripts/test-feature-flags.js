const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const registry = fs.readFileSync(path.join(root, 'feature-flags.js'), 'utf8');
const runtime = fs.readFileSync(path.join(root, 'feature-toggle.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(registry, context);
assert.equal(context.window.HAAG_FEATURE_FLAGS.existingSite, 'CURRENT');
for (const [name, value] of Object.entries(context.window.HAAG_FEATURE_FLAGS)) {
  assert.match(name, /^[a-zA-Z][a-zA-Z0-9_-]*$/);
  assert.ok(['CURRENT', 'PREVIEW'].includes(value), `Invalid flag: ${name}`);
}

function boot(storageValue, blocked = false) {
  const style = { textContent: '[data-feature] { display: none !important; }' };
  const window = {
    HAAG_FEATURE_FLAGS: { released: 'CURRENT', upcoming: 'PREVIEW', invalid: 'true' },
    get sessionStorage() {
      if (blocked) throw new Error('Storage blocked');
      return { getItem: () => storageValue };
    },
  };
  vm.runInNewContext(runtime, {
    window,
    document: { getElementById: (id) => {
      assert.equal(id, 'haag-feature-gates');
      return style;
    } },
  });
  return { api: window.HAAGFeatures, css: style.textContent };
}
for (const [value, blocked, expected] of [
  [null, false, false], ['CURRENT', false, false], ['true', false, false],
  ['PREVIEW', false, true], ['PREVIEW', true, false],
]) {
  const { api, css } = boot(value, blocked);
  assert.equal(api.isEnabled('released'), true);
  assert.equal(api.isEnabled('upcoming'), expected);
  for (const name of ['invalid', 'missing', 'toString', '__proto__']) {
    assert.equal(api.isEnabled(name), false);
  }
  assert.equal(api.mode, expected ? 'PREVIEW' : 'CURRENT');
  assert.ok(Object.isFrozen(api.flags));
  assert.ok(Object.isFrozen(api));
  assert.ok(css.includes(':not([data-feature="released"])'));
  assert.equal(css.includes(':not([data-feature="upcoming"])'), expected);
  assert.ok(css.endsWith('{ display: none !important; }'));
}

let pages = 0;
function checkPages(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { checkPages(file); continue; }
    if (!file.endsWith('.html')) continue;
    const html = fs.readFileSync(file, 'utf8');
    const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'));
    const styleIndex = head.indexOf('id="haag-feature-gates"');
    const registryIndex = head.indexOf('feature-flags.js');
    const runtimeIndex = head.indexOf('feature-toggle.js');
    assert.ok(styleIndex >= 0 && registryIndex > styleIndex && runtimeIndex > registryIndex,
      `Missing or unordered feature setup: ${file}`);
    for (const script of head.matchAll(/<script\b([^>]*src="([^"]*feature-(?:flags|toggle)\.js)"[^>]*)>/g)) {
      assert.ok(!/\b(async|defer)\b/.test(script[1]), `Feature script must be synchronous: ${file}`);
      assert.ok(fs.existsSync(path.resolve(dir, script[2])), `Missing script: ${file}`);
    }
    for (const gate of html.matchAll(/data-feature="([^"]+)"/g)) {
      assert.ok(Object.hasOwn(context.window.HAAG_FEATURE_FLAGS, gate[1]), `Unknown feature: ${gate[1]}`);
    }
    pages++;
  }
}
checkPages(root);
console.log(`✓ Feature modes, blocked storage, registry, and integration across ${pages} HTML pages verified.`);
