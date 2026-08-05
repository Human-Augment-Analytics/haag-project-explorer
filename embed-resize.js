// When this site is shown inside an iframe, report the page height to the
// parent so it can size the frame to fit (used by the GT WordPress embed).
(function () {
  if (window.parent === window) return;
  var lastHeight = 0;
  function send() {
    var height = Math.ceil(
      Math.max(document.body.scrollHeight, document.body.getBoundingClientRect().height)
    );
    if (height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage({ type: "haag-embed-height", height: height }, "*");
  }
  new ResizeObserver(send).observe(document.body);
  window.addEventListener("load", send);
  send();
})();
