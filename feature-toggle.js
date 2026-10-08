(function () {
  'use strict';

  const flags = Object.freeze({ ...window.HAAG_FEATURE_FLAGS });
  let preview = false;
  try {
    // Preview is an explicit, browser-tab-local choice. Reload after changing it.
    preview = window.sessionStorage.getItem('haag:preview') === 'PREVIEW';
  } catch (_) {
    // Storage may be unavailable in embedded pages; use CURRENT behavior.
  }

  function isEnabled(name) {
    if (!Object.prototype.hasOwnProperty.call(flags, name)) return false;
    return flags[name] === 'CURRENT' || (flags[name] === 'PREVIEW' && preview);
  }

  // Generate CSS before the body is parsed. It also covers dynamically inserted
  // elements without changing their original display styles or hidden state.
  const enabled = Object.keys(flags).filter(isEnabled);
  const exclusions = enabled
    .filter((name) => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name))
    .map((name) => `:not([data-feature="${name}"])`).join('');
  document.getElementById('haag-feature-gates').textContent =
    `[data-feature]${exclusions} { display: none !important; }`;

  window.HAAGFeatures = Object.freeze({
    isEnabled,
    flags,
    mode: preview ? 'PREVIEW' : 'CURRENT',
  });
})();
