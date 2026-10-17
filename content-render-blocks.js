// Generic renderer: fills a page's masthead, main column and sidebar from a JSON file.
// Usage (before </body>):
//   <script src="content-render-blocks.js" data-flag="dynamicPhdContent" data-src="content/phd-postdoc.json"></script>
// Does nothing unless the feature flag is enabled. If the fetch fails, the original HTML stays.
(function () {
  var script = document.currentScript;
  if (!script) return;
  var flag = script.getAttribute('data-flag');
  var src = script.getAttribute('data-src');
  var F = window.HAAGFeatures;
  if (!flag || !src || !F || !F.isEnabled(flag)) return;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function each(list, fn) { return (list || []).map(fn).join(''); }

  var main = {
    heading: function (b) { return '<h2 class="h2">' + esc(b.text) + '</h2>'; },
    paragraph: function (b) { return '<p class="body-text">' + esc(b.text) + '</p>'; },
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
        esc(b.link_href) + '">' + esc(b.link_text) + '</a></div>';
    }
  };
  var side = {
    links: function (b) {
      return '<div class="side-card"><h3>' + esc(b.heading) + '</h3><ul>' + each(b.items, function (l) {
        return '<li><a href="' + esc(l.href) + '">' + esc(l.text) + '</a></li>';
      }) + '</ul></div>';
    },
    contact: function (b) {
      return '<div class="side-card contact"><h3>' + esc(b.heading) + '</h3><p>' + esc(b.text) +
        '</p><a class="cta-link" href="' + esc(b.link_href) + '">' + esc(b.link_text) + '</a></div>';
    }
  };
  function build(blocks, table) {
    return each(blocks, function (b) { return table[b.type] ? table[b.type](b) : ''; });
  }

  fetch(src)
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
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