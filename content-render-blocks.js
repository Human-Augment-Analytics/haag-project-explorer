// Generic renderer: fills a page's masthead, main column and sidebar from a JSON file.
// Usage (before </body>):
//   <script src="content-render-blocks.js" data-flag="dynamicPhdContent" data-src="content/phd-postdoc.json"></script>
// Optional: data-endpoint="https://..." is tried first; if it fails, data-src (the committed JSON) is used.
// Does nothing unless the feature flag is enabled. If everything fails, the original HTML stays.
(function () {
  var script = document.currentScript;
  if (!script) return;
  var flag = script.getAttribute('data-flag');
  var src = script.getAttribute('data-src');
  var endpoint = script.getAttribute('data-endpoint');
  var F = window.HAAGFeatures;
  if (!flag || !src || !F || !F.isEnabled(flag)) return;

  // Missing fields render as empty text, never "undefined".
  function esc(s) {
    if (s === undefined || s === null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function each(list, fn) { return (list || []).map(fn).join(''); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  // Only http, https, mailto and relative links are allowed. Anything else becomes ''.
  function safeHref(h) {
    h = String(h === undefined || h === null ? '' : h).trim();
    var probe = h.replace(/[\u0000-\u0020\u007f]/g, '');
    if (!probe || /^\/\//.test(probe)) return '';
    if (/^(https?:|mailto:)/i.test(probe)) return h;
    if (/^[a-z][a-z0-9+.\-]*:/i.test(probe)) return '';
    return h;
  }

  // Allow-list sanitiser for *_html fields. Unknown tags are unwrapped (text kept),
  // script-like tags are dropped with their content, attributes are removed except a[href] and an allow-listed a[class].
  var ALLOWED = { A: 1, P: 1, STRONG: 1, EM: 1, B: 1, I: 1, BR: 1, UL: 1, OL: 1, LI: 1 };
  var LINK_CLASSES = { 'link-strong': 1 };
  var DROP = { SCRIPT: 1, STYLE: 1, IFRAME: 1, OBJECT: 1, EMBED: 1, TEMPLATE: 1, NOSCRIPT: 1 };
  function copyClean(from, to) {
    Array.prototype.forEach.call(from.childNodes, function (n) {
      if (n.nodeType === 3) { to.appendChild(document.createTextNode(n.nodeValue)); return; }
      if (n.nodeType !== 1 || has(DROP, n.tagName)) return;
      if (!has(ALLOWED, n.tagName)) { copyClean(n, to); return; }
      var el = document.createElement(n.tagName);
      if (n.tagName === 'A') {
        var href = safeHref(n.getAttribute('href'));
        if (href) {
          el.setAttribute('href', href);
          if (/^https?:/i.test(href)) el.setAttribute('rel', 'noopener noreferrer');
        }
        // Only these class names survive on links (styled by the page's own CSS).
        var cls = n.getAttribute('class');
        if (cls && has(LINK_CLASSES, cls)) el.setAttribute('class', cls);
      }
      copyClean(n, el);
      to.appendChild(el);
    });
  }
  function sanitize(html) {
    var doc = new DOMParser().parseFromString('<body>' + (html === undefined || html === null ? '' : html), 'text/html');
    var out = document.createElement('div');
    copyClean(doc.body, out);
    return out.innerHTML;
  }

  var main = {
    // level 2 (default) or 3
    heading: function (b) {
      var t = b.level === 3 ? 'h3' : 'h2';
      return '<' + t + ' class="' + t + '">' + esc(b.text) + '</' + t + '>';
    },
    rich_text: function (b) { return '<div class="body-text">' + sanitize(b.body_html) + '</div>'; },
    // "text" is plain text (escaped). "body_html" is inline HTML (sanitised).
    paragraph: function (b) {
      return '<p class="body-text">' + (b.body_html !== undefined ? sanitize(b.body_html) : esc(b.text)) + '</p>';
    },
    numbered_list: function (b) {
      return '<div class="service-list">' + each(b.items, function (it, i) {
        return '<div class="service-item"><h4><span class="num">' + (i + 1) + '</span>' + esc(it.title) +
          '</h4><p>' + esc(it.text) + '</p></div>';
      }) + '</div>';
    },
    callout: function (b) { return '<div class="callout">' + esc(b.text) + '</div>'; },
    images: function (b) {
      return '<div class="img-row">' + each(b.items, function (im) {
        return '<img src="' + esc(safeHref(im.src)) + '" alt="' + esc(im.alt) + '" />';
      }) + '</div>';
    },
    // Step cards with a collapsible "more_html" section (sanitised).
    expandable_steps: function (b) {
      return each(b.items, function (s) {
        return '<div class="step-card"><div class="step-label">' + esc(s.label) + '</div><h3>' + esc(s.title) +
          '</h3><p class="step-summary">' + esc(s.text) + '</p><details class="step-detail"><summary>' +
          esc(b.more_label) + '</summary>' + sanitize(s.more_html) + '</details></div>';
      });
    },
    people_cards: function (b) {
      return '<div class="team-grid">' + each(b.items, function (p) {
        return '<div class="team-card"><div class="team-avatar">' + esc(p.initials) + '</div><h4>' + esc(p.name) +
          '</h4><div class="role">' + esc(p.role) + '</div><p>' + esc(p.text) + '</p></div>';
      }) + '</div>';
    },
    grade_cards: function (b) {
      return '<div class="grade-row">' + each(b.items, function (g) {
        return '<div class="grade-card"><div class="pct">' + esc(g.value) + '</div><h4>' + esc(g.title) + '</h4><ul>' +
          each(g.bullets, function (x) { return '<li>' + esc(x) + '</li>'; }) + '</ul></div>';
      }) + '</div>';
    },
    item_list: function (b) {
      return each(b.items, function (it) {
        return '<div class="deliverable-item"><h4>' + esc(it.title) + '</h4><p>' + esc(it.text) + '</p></div>';
      });
    },
    link_list: function (b) {
      return '<div class="resource-list">' + (b.items || []).map(function (l) {
        return '<a href="' + esc(safeHref(l.href)) + '">' + esc(l.text) + '</a>';
      }).join('<br>') + '</div>';
    },
    pills: function (b) {
      return '<div class="audience-row">' + each(b.items, function (t) {
        return '<span class="audience-pill">' + esc(t) + '</span>';
      }) + '</div>';
    },
    cards: function (b) {
      var grid = b.variant === 'fact' ? 'fact-row' : 'challenge-grid';
      var card = b.variant === 'fact' ? 'fact-card' : 'challenge-card';
      return '<div class="' + grid + '">' + each(b.items, function (c) {
        return '<div class="' + card + '"><div class="icon">' + esc(c.icon) + '</div><h4>' + esc(c.title) +
          '</h4><p>' + esc(c.text) + '</p></div>';
      }) + '</div>';
    },
    steps: function (b) {
      return each(b.items, function (s) {
        return '<div class="step-card"><div class="step-num">' + esc(s.number) + '</div><div><h3>' + esc(s.title) +
          '</h3><p>' + esc(s.text) + '</p></div></div>';
      });
    },
    faq: function (b) {
      return each(b.items, function (q) {
        return '<div class="faq-item"><h4>' + esc(q.question) + '</h4><p>' + esc(q.answer) + '</p></div>';
      });
    },
    cta: function (b) {
      return '<div class="callout-cta"><h3>' + esc(b.title) + '</h3><p>' + esc(b.text) + '</p><a class="btn-gold" href="' +
        esc(safeHref(b.link_href)) + '">' + esc(b.link_text) + '</a></div>';
    }
  };
  var side = {
    // Generic sidebar card: heading, optional text, optional link list, optional call-to-action link.
    // variant "contact" gives the highlighted contact style.
    card: function (b) {
      return '<div class="side-card' + (b.variant === 'contact' ? ' contact' : '') + '"><h3>' + esc(b.heading) + '</h3>' +
        (b.text !== undefined ? '<p>' + esc(b.text) + '</p>' : '') +
        (b.items ? '<ul>' + each(b.items, function (l) {
          return '<li><a href="' + esc(safeHref(l.href)) + '">' + esc(l.text) + '</a></li>';
        }) + '</ul>' : '') +
        (b.link_href !== undefined ? '<a class="cta-link" href="' + esc(safeHref(b.link_href)) + '">' + esc(b.link_text) + '</a>' : '') +
        '</div>';
    },
    links: function (b) {
      return '<div class="side-card"><h3>' + esc(b.heading) + '</h3><ul>' + each(b.items, function (l) {
        return '<li><a href="' + esc(safeHref(l.href)) + '">' + esc(l.text) + '</a></li>';
      }) + '</ul></div>';
    },
    contact: function (b) {
      return '<div class="side-card contact"><h3>' + esc(b.heading) + '</h3><p>' + esc(b.text) +
        '</p><a class="cta-link" href="' + esc(safeHref(b.link_href)) + '">' + esc(b.link_text) + '</a></div>';
    }
  };
  function build(blocks, table) {
    return each(blocks, function (b) {
      if (b && has(table, b.type)) return table[b.type](b);
      console.warn('[HAAG] ' + flag + ': unknown block type "' + (b && b.type) + '" skipped');
      return '';
    });
  }

  function getJson(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }
  function valid(d) { return d && d.main && d.sidebar; }
  var data = endpoint
    ? getJson(endpoint).then(function (d) { if (!valid(d)) throw new Error('bad endpoint shape'); return d; })
        .catch(function (e) { console.warn('[HAAG] ' + flag + ': endpoint failed (' + e.message + '), using ' + src); return getJson(src); })
    : getJson(src);

  data
    .then(function (d) {
      var cols = document.querySelectorAll('.article-grid > div');
      if (cols.length < 2 || !d.main || !d.sidebar) throw new Error('unexpected page or content shape');
      var m = d.masthead;
      if (m) {
        var e = document.querySelector('.masthead .eyebrow');
        var h = document.querySelector('.masthead h1');
        var s = document.querySelector('.masthead .sub');
        if (e && m.eyebrow) e.textContent = m.eyebrow;
        if (h && m.title) h.textContent = m.title;
        if (s && m.sub) s.textContent = m.sub;
      }
      cols[0].innerHTML = build(d.main, main);
      cols[1].innerHTML = build(d.sidebar, side);
    })
    .catch(function (err) { console.warn('[HAAG] ' + flag + ': keeping original content (' + err.message + ')'); });
})();