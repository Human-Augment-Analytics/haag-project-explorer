// HTML sanitizer for the *_html fields in content/*.json.
// Mirrors sanitizeHtml() in the old content-render-blocks.js exactly:
//   - allow-list of tags: A P STRONG EM B I BR UL OL LI
//   - SCRIPT/STYLE/IFRAME/OBJECT/EMBED/TEMPLATE/NOSCRIPT dropped with content
//   - any other tag is unwrapped (children kept)
//   - on <a>, only href (validated) and class="link-strong" survive;
//     http(s) links gain rel="noopener noreferrer"
// Internal *.html hrefs are rewritten to Next.js routes via rewriteHref().
import { rewriteHref, isSafeHref } from './links.js';

const ALLOWED = new Set(['A', 'P', 'STRONG', 'EM', 'B', 'I', 'BR', 'UL', 'OL', 'LI']);
const DROP_WITH_CONTENT = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'NOSCRIPT']);
const VOID = new Set(['BR']);

function escapeAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeBasicEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&');
}

export function sanitizeHtml(input) {
  const html = String(input == null ? '' : input);
  let out = '';
  let i = 0;
  let dropDepth = 0;
  let dropTag = null;

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      if (!dropDepth) out += html.slice(i);
      break;
    }
    if (!dropDepth) out += html.slice(i, lt);

    const gt = html.indexOf('>', lt);
    const rest = html.slice(lt + 1);
    if (gt === -1) {
      // Unterminated tag at the end: drop it. A stray '<' in text stays text.
      if (!dropDepth) out += /^\/?[a-zA-Z]/.test(rest) ? '' : '&lt;' + rest;
      break;
    }

    const rawTag = html.slice(lt + 1, gt);
    const closing = rawTag.startsWith('/');
    const nameMatch = rawTag.replace(/^\//, '').match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
    if (!nameMatch) {
      // Comments and doctypes are dropped; a stray '<' in text is kept as text.
      if (rawTag.startsWith('!')) {
        i = gt + 1;
      } else {
        if (!dropDepth) out += '&lt;';
        i = lt + 1;
      }
      continue;
    }
    const tag = nameMatch[1].toUpperCase();

    if (dropDepth) {
      if (tag === dropTag) dropDepth += closing ? -1 : 1;
      i = gt + 1;
      continue;
    }

    if (DROP_WITH_CONTENT.has(tag)) {
      if (!closing) {
        dropDepth = 1;
        dropTag = tag;
      }
      i = gt + 1;
      continue;
    }

    if (!ALLOWED.has(tag)) {
      i = gt + 1; // unwrap: drop the tag, keep walking its children
      continue;
    }

    if (closing) {
      if (!VOID.has(tag)) out += `</${tag.toLowerCase()}>`;
      i = gt + 1;
      continue;
    }

    if (tag === 'A') {
      const hrefMatch = rawTag.match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
      const clsMatch = rawTag.match(/class\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
      const rawHref = hrefMatch ? decodeBasicEntities(hrefMatch[2] ?? hrefMatch[3] ?? hrefMatch[4] ?? '') : '';
      const cls = clsMatch ? (clsMatch[2] ?? clsMatch[3] ?? clsMatch[4] ?? '') : '';
      let attrs = '';
      if (rawHref && isSafeHref(rawHref)) {
        const finalHref = rewriteHref(rawHref);
        attrs += ` href="${escapeAttr(finalHref)}"`;
        if (/^https?:/i.test(finalHref)) attrs += ' rel="noopener noreferrer"';
      }
      if (cls === 'link-strong') attrs += ' class="link-strong"';
      out += `<a${attrs}>`;
    } else {
      out += `<${tag.toLowerCase()}>`;
    }
    i = gt + 1;
  }

  return out;
}

// YAML fields such as role_label / byline in people.yml carry HTML entities
// (&middot;) that the old pages injected via innerHTML, so browsers decoded
// them. React escapes strings, so decode the common entities at load time.
const ENTITY_MAP = {
  '&middot;': '·',
  '&mdash;': '—',
  '&ndash;': '–',
  '&rarr;': '→',
  '&hellip;': '…',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&copy;': '©',
};

export function decodeEntities(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/&[a-z#0-9]+;/gi, (m) => ENTITY_MAP[m] ?? ENTITY_MAP[m.toLowerCase()] ?? m);
}
