// Tests for the *_html sanitizer and href checks used by the content renderer.
// Run with `npm test` (or `node --experimental-default-type=module --test scripts/test-sanitize.mjs`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeHtml } from '../lib/sanitize.js';
import { isSafeHref, rewriteHref } from '../lib/links.js';

test('drops javascript: links, including padded, uppercase and tab-split schemes', () => {
  assert.equal(sanitizeHtml('<a href="javascript:alert(1)">x</a>'), '<a>x</a>');
  assert.equal(sanitizeHtml('<a href=" javascript:alert(1)">x</a>'), '<a>x</a>');
  assert.equal(sanitizeHtml('<A HREF="JAVASCRIPT:alert(1)">x</A>'), '<a>x</a>');
  assert.equal(sanitizeHtml('<a href="java\tscript:alert(1)">x</a>'), '<a>x</a>');
  assert.equal(sanitizeHtml('<a href="data:text/html,hi">x</a>'), '<a>x</a>');
});

test('drops protocol-relative and backslash links that browsers treat as external', () => {
  assert.equal(sanitizeHtml('<a href="//evil.example">x</a>'), '<a>x</a>');
  assert.equal(sanitizeHtml('<a href="/\\evil.example">x</a>'), '<a>x</a>');
  assert.equal(sanitizeHtml('<a href="\\\\evil.example">x</a>'), '<a>x</a>');
});

test('keeps safe links, rewrites old .html paths and adds rel on external links', () => {
  assert.equal(sanitizeHtml('<a href="people.html">x</a>'), '<a href="/people">x</a>');
  assert.equal(
    sanitizeHtml('<a href="https://example.org" class="link-strong">x</a>'),
    '<a href="https://example.org" rel="noopener noreferrer" class="link-strong">x</a>',
  );
  assert.equal(sanitizeHtml('<a href="mailto:haag@gatech.edu">x</a>'), '<a href="mailto:haag@gatech.edu">x</a>');
});

test('escapes encoded entities in hrefs instead of decoding them into a scheme', () => {
  const out = sanitizeHtml('<a href="java&#x09;script:alert(1)">x</a>');
  assert.equal(out, '<a href="/java&amp;#x09;script:alert(1)">x</a>');
});

test('unwraps tags that are not on the allow-list and keeps their text', () => {
  assert.equal(sanitizeHtml('<div><p>Hi <span>there</span></p></div>'), '<p>Hi there</p>');
  assert.equal(sanitizeHtml('<img src=x onerror=alert(1)>'), '');
});

test('drops script-like elements together with their content', () => {
  assert.equal(sanitizeHtml('a<script>alert(1)</script>b'), 'ab');
  assert.equal(sanitizeHtml('<STYLE>p{}</STYLE>ok'), 'ok');
  const nested = sanitizeHtml('<script><script>alert(1)</script>alert(2)</script>ok');
  assert.ok(!/alert|<script/i.test(nested), `unexpected output: ${nested}`);
});

test('handles unclosed tags without throwing or leaking partial markup', () => {
  assert.equal(sanitizeHtml('<p>hello <strong>world'), '<p>hello <strong>world');
  assert.equal(sanitizeHtml('before <a href="/x'), 'before ');
  assert.equal(sanitizeHtml('1 < 2 and <b>bold</b>'), '1 &lt; 2 and <b>bold</b>');
  assert.equal(sanitizeHtml('<!-- note --><p>ok</p>'), '<p>ok</p>');
});

test('isSafeHref rejects control-character and backslash tricks', () => {
  for (const bad of ['javascript:alert(1)', ' JaVaScRiPt:alert(1)', 'java\nscript:x', '//evil.example', '/\\evil.example', '\\\\evil.example', 'data:text/html,x', '']) {
    assert.equal(isSafeHref(bad), false, bad);
  }
  for (const good of ['https://haag.cc.gatech.edu', 'http://example.org', 'mailto:haag@gatech.edu', '/people', '#faq-1', 'projects/x.html']) {
    assert.equal(isSafeHref(good), true, good);
  }
});

test('rewriteHref maps old page filenames to clean routes', () => {
  assert.equal(rewriteHref('index.html'), '/');
  assert.equal(rewriteHref('recruitment-status/index.html'), '/recruitment-status');
  assert.equal(rewriteHref('../people.html#top'), '/people#top');
  assert.equal(rewriteHref('#faq-8903'), '#faq-8903');
});
