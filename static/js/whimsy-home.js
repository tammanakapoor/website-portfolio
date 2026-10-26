"use strict";
var WhimsyHome = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // public/whimsy-home.js
  var whimsy_home_exports = {};
  __export(whimsy_home_exports, {
    initWhimsyHome: () => initWhimsyHome,
    stories: () => stories
  });

  // public/oval-home.js
  var stories = [
    {
      id: "about",
      label: "A LITTLE INTRODUCTION",
      title: "Hello, I\u2019m\nTammana Kapoor.",
      paragraphs: ["An educator, designer, vibe coder and curious maker based in London.", "I make thoughtful little things where learning meets making.", "Welcome to my corner of the internet."],
      link: "Explore my projects",
      href: "projects"
    },
    {
      id: "work",
      label: "THINGS I\u2019M MAKING",
      title: "Small things.\nBig curiosity.",
      paragraphs: ["Daily Caf\xE9, a little place to unwind. FloraQuest, a plant discovery game. Energy Changes, a chemistry pathway.", "From lessons to interfaces, I care about making things clear, welcoming and a little more human."],
      link: "Explore my projects",
      href: "projects"
    },
    {
      id: "outside",
      label: "AWAY FROM THE SCREEN",
      title: "A few of my\nside quests.",
      paragraphs: ["Embroidery, one stitch at a time. Sketching the things I notice. Long walks, with no destination. And little discoveries around London.", "Collecting hobbies like souvenirs. There\u2019s always something to learn."],
      link: "Open my visual diary",
      href: "outside"
    },
    {
      id: "hello",
      label: "A LITTLE HELLO",
      title: "Have an idea?\nLet\u2019s talk.",
      paragraphs: ["A thoughtful project. A creative collaboration. Or a hobby you think I should try next.", "I\u2019d love to hear about it."],
      link: "Write me a little hello",
      href: "mailto:tammana4513@gmail.com"
    }
  ];

  // public/whimsy-home.js
  var paperFrames = [
    { time: 0, left: 0.355, top: 0.283, width: 0.54, height: 0.18 },
    { time: 1.55, left: 0.27, top: 0.2575, width: 0.591, height: 0.205 },
    { time: 3.1, left: 0.147, top: 0.225, width: 0.663, height: 0.225 },
    { time: 5.167, left: 0.146, top: 0.225, width: 0.664, height: 0.225 }
  ];
  function initWhimsyHome(container) {
    const root = container.querySelector("[data-whimsy-home]");
    if (!root) return;
    const video = root.querySelector("[data-typewriter-video]");
    const title = root.querySelector("[data-typed-title]");
    const body = root.querySelector("[data-typed-body]");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const buttons = Array.from(root.querySelectorAll("[data-story]"));
    const cleanups = [];
    let current = 0;
    let position = 0;
    let timer;
    let frame;
    let destroyed = false;
    let reading = false;
    let paragraphs = [];
    const on = (target, event, handler) => {
      target.addEventListener(event, handler);
      cleanups.push(() => target.removeEventListener(event, handler));
    };
    const completeText = () => stories[current].title + "\n\n" + stories[current].paragraphs.join("\n\n");
    function positionPaper(time = video.currentTime) {
      let index = 0;
      while (index < paperFrames.length - 2 && time > paperFrames[index + 1].time) index += 1;
      const from = paperFrames[index];
      const to = paperFrames[index + 1];
      const progress = Math.max(0, Math.min(1, (time - from.time) / (to.time - from.time)));
      const value = (key) => from[key] + (to[key] - from[key]) * progress;
      root.style.setProperty("--paper-left", `${value("left") * 100}%`);
      root.style.setProperty("--paper-width", `${value("width") * 100}%`);
      root.style.setProperty("--paper-top", `${(value("top") - 0.19) / 0.675 * 100}%`);
      root.style.setProperty("--paper-height", `${value("height") / 0.675 * 100}%`);
    }
    function trackFrame() {
      if (destroyed) return;
      positionPaper();
      if (!video.paused && !video.ended) frame = window.requestAnimationFrame(trackFrame);
    }
    function finishFilm() {
      video.pause();
      if (Number.isFinite(video.duration)) video.currentTime = Math.max(0, video.duration - 0.03);
      positionPaper(paperFrames[paperFrames.length - 1].time);
    }
    function playFilm() {
      if (destroyed) return;
      window.cancelAnimationFrame(frame);
      if (motion.matches) {
        finishFilm();
        return;
      }
      video.currentTime = 0;
      positionPaper(0);
      const playing = video.play();
      if (playing) void playing.catch(() => {
        if (destroyed) return;
        const poster = video.getAttribute("poster");
        if (poster) video.setAttribute("poster", poster.replace("typewriter-start", "typewriter-finished"));
        finishFilm();
      });
    }
    function paint() {
      const story = stories[current];
      title.textContent = story.title.slice(0, position);
      let remaining = position - story.title.length - 2;
      paragraphs.forEach((paragraph, index) => {
        const text = story.paragraphs[index];
        paragraph.textContent = text.slice(0, Math.max(0, remaining));
        paragraph.hidden = remaining <= 0;
        remaining -= text.length + 2;
      });
      if (!reading) body.scrollTop = position >= completeText().length ? 0 : body.scrollHeight;
      root.dataset.paperOverflow = String(body.scrollHeight > body.clientHeight + 2);
      root.dataset.typing = String(position < completeText().length);
    }
    function tick() {
      if (destroyed || position >= completeText().length) return;
      position += 1;
      paint();
      const char = completeText()[position - 1];
      timer = window.setTimeout(tick, char === "\n" ? 180 : /[.,?]/.test(char) ? 130 : 24 + Math.random() * 18);
    }
    function load(index, restart = true) {
      window.clearTimeout(timer);
      current = index;
      reading = false;
      const story = stories[current];
      paragraphs = story.paragraphs.map(() => document.createElement("p"));
      body.replaceChildren(...paragraphs);
      body.scrollTop = 0;
      position = motion.matches ? completeText().length : 0;
      root.querySelector("[data-readable]").textContent = `${story.title}

${story.paragraphs.join("\n\n")}`;
      const link = root.querySelector("[data-story-link]");
      link.hidden = story.id === "about";
      link.textContent = `${story.link} \u2197`;
      link.setAttribute("href", story.href.startsWith("mailto:") ? story.href : `${root.dataset.static === "true" ? "" : "/"}${story.href}`);
      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.story === story.id)));
      paint();
      if (restart && video.readyState >= 1) playFilm();
      timer = window.setTimeout(tick, 600);
    }
    on(video, "loadedmetadata", playFilm);
    on(video, "play", () => {
      window.cancelAnimationFrame(frame);
      trackFrame();
    });
    on(video, "timeupdate", () => positionPaper());
    on(video, "seeked", () => positionPaper());
    on(video, "ended", () => {
      window.cancelAnimationFrame(frame);
      positionPaper();
    });
    on(video, "error", () => {
      const poster = video.getAttribute("poster");
      if (poster) video.setAttribute("poster", poster.replace("typewriter-start", "typewriter-finished"));
      positionPaper(paperFrames[paperFrames.length - 1].time);
    });
    on(body, "wheel", () => {
      reading = true;
    });
    on(body, "touchstart", () => {
      reading = true;
    });
    on(motion, "change", () => {
      if (motion.matches) {
        window.clearTimeout(timer);
        position = completeText().length;
        paint();
        finishFilm();
      }
    });
    buttons.forEach((button) => on(button, "click", () => {
      const index = stories.findIndex((story) => story.id === button.dataset.story);
      if (index >= 0) load(index);
    }));
    root.dataset.ready = "true";
    const resize = new ResizeObserver(() => {
      root.dataset.paperOverflow = String(body.scrollHeight > body.clientHeight + 2);
    });
    resize.observe(body);
    load(0, false);
    if (video.readyState >= 1) playFilm();
    return () => {
      destroyed = true;
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      video.pause();
      resize.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }
  return __toCommonJS(whimsy_home_exports);
})();
WhimsyHome.initWhimsyHome(document);
