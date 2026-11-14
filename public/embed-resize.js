// When this site is shown inside an iframe, report the page height to the
// parent so it can size the frame to fit (used by the GT WordPress embed).
(function () {
  if (window.parent === window) return;
  var lastHeight = 0;
  var embeddedViewportHeight = window.innerHeight;
  var scrollTarget = null;
  var pendingResizeScroll = false;

  function send() {
    var contentHeight = Math.ceil(
      Math.max(document.body.scrollHeight, document.body.getBoundingClientRect().height)
    );
    var height = scrollTarget ? embeddedViewportHeight : contentHeight;
    if (height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage({ type: "haag-embed-height", height: height }, "*");
  }

  // Keep internal anchor navigation scrollable when the parent expands this iframe.
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href") === "#") return;
    var target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    pendingResizeScroll = embeddedViewportHeight !== lastHeight;
    scrollTarget = target;
    send();
    requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  window.addEventListener("resize", function () {
    if (!pendingResizeScroll) return;
    pendingResizeScroll = false;
    requestAnimationFrame(function () {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  new ResizeObserver(send).observe(document.body);
  window.addEventListener("load", send);
  send();
})();
