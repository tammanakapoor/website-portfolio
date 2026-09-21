// Lab page animations, using the Motion library (vendor/motion.js, loaded before this file).
// Each block mirrors one animated element from the original React version:
// the same keyframes, durations, delays and easing.
(function () {
  var M = window.Motion;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = [0.16, 1, 0.3, 1];

  function $(selector) { return document.querySelector(selector); }
  function $$(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }

  // Elements start hidden via inline styles in the HTML (so nothing flashes before this runs).
  // With reduced motion on, the original skipped the entrance animation, so just show them.
  function clearInitial(el) { el.style.opacity = ""; el.style.transform = ""; }

  function entrance(el, keyframes, transition) {
    if (!el) return;
    if (reduced) { clearInitial(el); return; }
    M.animate(el, keyframes, transition);
  }

  /* ---- scroll progress bar: scroll position smoothed by a spring (stiffness 130, damping 28, mass .25) ---- */
  var bar = $(".lab-progress");
  if (bar) {
    var target = 0, value = 0, velocity = 0, last = null, frame = null;
    function step(now) {
      if (last === null) last = now;
      var dt = Math.min((now - last) / 1000, 0.064);
      last = now;
      var accel = (-130 * (value - target) - 28 * velocity) / 0.25;
      velocity += accel * dt;
      value += velocity * dt;
      var settled = Math.abs(velocity) < 0.0005 && Math.abs(value - target) < 0.0005;
      if (settled) { value = target; velocity = 0; }
      bar.style.transform = "scaleX(" + value + ")";
      if (settled) { frame = null; last = null; } else { frame = requestAnimationFrame(step); }
    }
    M.scroll(function (progress) {
      target = progress;
      if (frame === null) frame = requestAnimationFrame(step);
    });
  }

  /* ---- hero entrance ---- */
  entrance($(".lab-hero-copy .lab-kicker"), { opacity: [0, 1], y: [14, 0] }, { delay: 0.08, duration: 0.6 });

  $$(".lab-word-mask > span").forEach(function (word, i) {
    entrance(word, { y: ["110%", 0], rotate: [2, 0] }, { duration: 0.85, delay: [0.12, 0.19, 0.26][i], ease: EASE });
  });

  entrance($(".lab-hero-intro"), { opacity: [0, 1], y: [18, 0] }, { delay: 0.42, duration: 0.7 });

  var action = $(".lab-primary-action");
  var actionTransition = { delay: 0.56, duration: 0.55 };
  entrance(action, { opacity: [0, 1], scale: [0.94, 1] }, actionTransition);
  if (action && !reduced) {
    M.hover(action, function () {
      M.animate(action, { y: -4, scale: 1.02 }, actionTransition);
      return function () { M.animate(action, { y: 0, scale: 1 }, actionTransition); };
    });
    M.press(action, function () {
      M.animate(action, { scale: 0.97 }, actionTransition);
      return function () { M.animate(action, { scale: 1 }, actionTransition); };
    });
  }

  entrance($(".lab-spatial-stage"), { opacity: [0, 1], scale: [0.84, 1], rotate: [-5, 0] }, { delay: 0.2, duration: 1.1, ease: EASE });

  /* ---- floating cards beside the 3D scene ---- */
  if (!reduced) {
    var top = $(".lab-float-card-top"), bottom = $(".lab-float-card-bottom");
    if (top) M.animate(top, { y: [0, -9, 0] }, { duration: 5, repeat: Infinity, ease: "easeInOut" });
    if (bottom) M.animate(bottom, { y: [0, 7, 0] }, { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 });
  }

  /* ---- principle cards: hover/focus marks one as active and lifts it ---- */
  var principles = $$(".lab-principle");
  var spring = { type: "spring", stiffness: 280, damping: 24 };
  principles.forEach(function (card) {
    function activate() {
      principles.forEach(function (other) { other.classList.toggle("is-active", other === card); });
    }
    card.addEventListener("mouseenter", activate);
    card.addEventListener("focus", activate);
    if (!reduced) {
      M.hover(card, function () {
        M.animate(card, { y: -10 }, spring);
        return function () { M.animate(card, { y: 0 }, spring); };
      });
    }
  });

  /* ---- project cards and contact card: animate in once when scrolled into view ---- */
  function whenInView(el, amount, run) {
    if (!el) return;
    if (reduced) { clearInitial(el); return; }
    var done = false;
    var stop = M.inView(el, function () {
      if (done) return;
      done = true;
      run();
      if (stop) stop();
    }, { amount: amount });
    if (done) stop();
  }

  $$(".lab-project").forEach(function (project, i) {
    whenInView(project, 0.2, function () {
      M.animate(project, { opacity: [0, 1], y: [70, 0] }, { duration: 0.8, delay: i * 0.08, ease: EASE });
    });
    var image = project.querySelector(".lab-project-image");
    if (image && !reduced) {
      M.hover(image, function () {
        M.animate(image, { scale: 0.985 });
        return function () { M.animate(image, { scale: 1 }); };
      });
    }
  });

  whenInView($(".lab-contact-card"), 0.35, function () {
    M.animate($(".lab-contact-card"), { opacity: [0, 1], scale: [0.92, 1] }, { duration: 0.8, ease: EASE });
  });
})();
