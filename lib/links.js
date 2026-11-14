// Internal-link rewriting: the old site linked to *.html files; the Next.js
// port uses clean routes. Every internal href that flows through a component
// or a data file passes through rewriteHref() / rewriteLinksInHtml().
//
//   index.html                              -> /
//   people.html                             -> /people
//   recruitment-status/index.html           -> /recruitment-status
//   recruitment-status/team-matching.html   -> /recruitment-status/team-matching
//   ../people.html (from recruitment-status) -> /people
// Fragments (#faq-8903) and external/mailto links pass through unchanged.
//
// Internal paths are prefixed with the site's basePath (set with BASE_PATH at
// build time, see next.config.mjs). Use withBase() for any hard-coded internal
// href; links that go through rewriteHref() already get it.

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBase(path) {
  return `${BASE_PATH}${path}`;
}

export function rewriteHref(raw) {
  if (raw == null) return raw;
  const href = String(raw).trim();
  if (!href) return href;
  if (href.startsWith('#')) return href;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)) return href; // http:, mailto:, ...
  if (href.startsWith('//')) return href;

  const hashIdx = href.indexOf('#');
  const pathPart = hashIdx === -1 ? href : href.slice(0, hashIdx);
  const hashPart = hashIdx === -1 ? '' : href.slice(hashIdx);

  let p = pathPart.replace(/^(\.\.\/|\.\/)+/, '').replace(/^\//, '');
  if (p === '' || p === 'index.html') return withBase('/') + hashPart;
  if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length);
  else if (p.endsWith('.html')) p = p.slice(0, -'.html'.length);
  return withBase('/' + p) + hashPart;
}

// Same check the old content-render-blocks.js used before trusting an href,
// including the renderer-hardening pass (PR #55): browsers treat backslashes
// as slashes, so /\evil.com is protocol-relative. Decide on a probe copy
// with control characters stripped and backslashes converted to slashes.
export function isSafeHref(value) {
  const href = String(value || '').trim();
  if (!href) return false;
  const probe = href.replace(/[\u0000-\u0020\u007f]/g, '').replace(/\\/g, '/');
  if (!probe) return false;
  if (probe.startsWith('//')) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(probe)) {
    return /^(https?|mailto):/i.test(probe);
  }
  return true; // relative
}

export function safeHref(value) {
  return isSafeHref(value) ? String(value).trim() : '#';
}
