// Requires Playwright and Chromium: npm install --no-save --package-lock=false playwright
// Then: npx playwright install chromium && node scripts/test-feature-browser.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');

(async () => {
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, body) => {
      if (error) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'text/plain');
      res.end(body);
    });
  });
  let browser;
  try {
    await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**/*', route => route.abort());
    const url = `http://127.0.0.1:${server.address().port}/project-explorer.html`;
    async function loaded() { await page.locator('.project-card').first().waitFor(); }
    const counter = page.locator('#project-result-count');
    await page.goto(url);
    await loaded();
    const total = await page.locator('.project-card').count();
    assert.ok(total > 0);
    assert.equal(await counter.isVisible(), false);
    assert.equal(await counter.textContent(), ''); // Feature behavior did not execute.
    await page.locator('.project-card').first().click();
    assert.equal(await page.locator('#project-modal').isVisible(), true);
    await page.keyboard.press('Escape');
    console.log('✓ Default mode: count hidden and uninitialized; existing cards and modal work.');

    await page.evaluate(() => sessionStorage.setItem('haag:preview', 'PREVIEW'));
    await page.reload();
    await loaded();
    assert.equal(await counter.isVisible(), true);
    assert.equal(await counter.textContent(), `Showing ${total} of ${total} public projects`);
    await page.locator('#recruit-list button', { hasText: 'Open' }).click();
    const filtered = await page.locator('.project-card').count();
    assert.ok(filtered < total, 'Filter must change the result count');
    assert.equal(await counter.textContent(), `Showing ${filtered} of ${total} public projects`);
    console.log('✓ PREVIEW mode: count visible and updates when recruitment filter changes.');

    await page.evaluate(() => sessionStorage.removeItem('haag:preview'));
    await page.reload();
    await loaded();
    assert.equal(await counter.isVisible(), false);
    assert.equal(await counter.textContent(), '');
    console.log('✓ Preview disabled again: count hidden and behavior inactive.');

    // Simulate promotion in the response only; leave the source registry PREVIEW.
    await page.route('**/feature-flags.js', async route => {
      const source = fs.readFileSync(path.join(root, 'feature-flags.js'), 'utf8');
      assert.ok(source.includes("projectResultCount: 'PREVIEW'"));
      await route.fulfill({ contentType: 'text/javascript', body: source.replace("projectResultCount: 'PREVIEW'", "projectResultCount: 'CURRENT'") });
    });
    await page.reload();
    await loaded();
    assert.equal(await counter.isVisible(), true);
    assert.equal(await counter.textContent(), `Showing ${total} of ${total} public projects`);
    assert.equal(await page.evaluate(() => HAAGFeatures.mode), 'CURRENT');
    assert.deepEqual(errors, []);
    console.log('✓ Promotion to CURRENT: count works without preview opt-in; no JavaScript errors.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
