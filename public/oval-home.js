export const stories = [
  {
    id: "about", label: "A LITTLE INTRODUCTION", title: "Hello, I’m\nTammana Kapoor.",
    paragraphs: ["An educator, designer, vibe coder and curious maker based in London.", "I make thoughtful little things where learning meets making.", "Welcome to my corner of the internet."],
    link: "Explore my projects", href: "projects",
  },
  {
    id: "work", label: "THINGS I’M MAKING", title: "Small things.\nBig curiosity.",
    paragraphs: ["Daily Café, a little place to unwind. FloraQuest, a plant discovery game. Energy Changes, a chemistry pathway.", "From lessons to interfaces, I care about making things clear, welcoming and a little more human."],
    link: "Explore my projects", href: "projects",
  },
  {
    id: "outside", label: "AWAY FROM THE SCREEN", title: "A few of my\nside quests.",
    paragraphs: ["Embroidery, one stitch at a time. Sketching the things I notice. Long walks, with no destination. And little discoveries around London.", "Collecting hobbies like souvenirs. There’s always something to learn."],
    link: "Open my visual diary", href: "outside",
  },
  {
    id: "hello", label: "A LITTLE HELLO", title: "Have an idea?\nLet’s talk.",
    paragraphs: ["A thoughtful project. A creative collaboration. Or a hobby you think I should try next.", "I’d love to hear about it."],
    link: "Write me a little hello", href: "mailto:tammana4513@gmail.com",
  },
];

/** Shared by the React page and its framework-free static export. */
export function initOvalHome(container) {
  const root = container.querySelector("[data-oval-home]");
  if (!root) return;
  const buttons = Array.from(root.querySelectorAll("[data-story]"));
  const listeners = buttons.map(button => {
    const select = () => {
      const story = stories.find(item => item.id === button.dataset.story);
      if (!story) return;
      root.querySelector("[data-story-label]").textContent = story.label;
      root.querySelector("[data-story-title]").textContent = story.title;
      root.querySelector("[data-story-body]").replaceChildren(...story.paragraphs.map(text => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        return paragraph;
      }));
      const link = root.querySelector("[data-story-link]");
      link.textContent = `${story.link} ↗`;
      link.hidden = story.id === "about";
      link.setAttribute("href", story.href.startsWith("mailto:") ? story.href : `${root.dataset.static === "true" ? "" : "/"}${story.href}`);
      buttons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    };
    button.addEventListener("click", select);
    return () => button.removeEventListener("click", select);
  });
  return () => listeners.forEach(remove => remove());
}
