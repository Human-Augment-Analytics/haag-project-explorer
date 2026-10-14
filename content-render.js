(function () {
  'use strict';
  if (!window.HAAGFeatures || !window.HAAGFeatures.isEnabled('dynamicFacultyContent')) return;

  var cols = document.querySelectorAll('.article-grid > div');
  if (cols.length < 2) return;

  function renderMain(d) {
    var h = '';
    h += '<h2 class="h2">' + d.intro.heading + '</h2>';
    h += '<p class="body-text">' + d.intro.body_html + '</p>';
    h += '<div class="service-list">' + d.services.map(function (s, i) {
      return '<div class="service-item"><h4><span class="num">' + (i + 1) + '</span>' +
        s.title + '</h4><p>' + s.text + '</p></div>';
    }).join('') + '</div>';
    h += '<div class="callout">' + d.callout_html + '</div>';
    h += '<div class="img-row">' + d.images.map(function (im) {
      return '<img src="' + im.src + '" alt="' + im.alt + '" />';
    }).join('') + '</div>';
    h += '<h2 class="h2">' + d.mentoring.heading + '</h2>';
    h += '<p class="body-text">' + d.mentoring.body_html + '</p>';
    h += '<h2 class="h2">' + d.method.heading + '</h2>';
    h += '<p class="body-text">' + d.method.intro_html + '</p>';
    h += d.method.steps.map(function (st) {
      return '<div class="step-card"><div class="step-label">' + st.label + '</div>' +
        '<h3>' + st.title + '</h3><p class="step-summary">' + st.summary + '</p>' +
        '<details class="step-detail"><summary>Read the full process &rarr;</summary>' +
        st.detail_html + '</details></div>';
    }).join('');
    return h;
  }

  function renderSide(d) {
    return d.sidebar.map(function (c, i) {
      var cls = 'side-card' + (i === d.sidebar.length - 1 ? ' contact' : '');
      var h = '<div class="' + cls + '"><h3>' + c.heading + '</h3>';
      if (c.text) h += '<p>' + c.text + '</p>';
      if (c.links) {
        h += '<ul>' + c.links.map(function (l) {
          return '<li><a href="' + l.href + '">' + l.text + '</a></li>';
        }).join('') + '</ul>';
      }
      if (c.link_href) h += '<a class="cta-link" href="' + c.link_href + '">' + c.link_text + '</a>';
      return h + '</div>';
    }).join('');
  }

  fetch('content/faculty-affiliates.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (d) {
      cols[0].innerHTML = renderMain(d);
      cols[1].innerHTML = renderSide(d);
    })
    .catch(function (e) {
      // On any failure the original hardcoded content stays visible.
      console.error('Dynamic faculty content failed:', e);
    });
})();