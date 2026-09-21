// Projects page: fades each .reveal block up into place the first time it scrolls into view.
// The .reveal class hides the block until .is-visible is added (see css/site.css).
(function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (typeof IntersectionObserver === "undefined") {
    blocks.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  blocks.forEach(function (el) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    observer.observe(el);
  });
})();
