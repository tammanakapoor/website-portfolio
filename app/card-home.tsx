"use client";

import { useEffect, useState } from "react";

type PanelId = "about" | "projects" | "hobbies" | "contact";

const panels: { id: PanelId; label: string; icon: string; shortcut: string }[] = [
  { id: "about", label: "About me", icon: "✦", shortcut: "A" },
  { id: "projects", label: "Projects", icon: "↗", shortcut: "P" },
  { id: "hobbies", label: "Hobbies", icon: "☼", shortcut: "H" },
  { id: "contact", label: "Say hello", icon: "♡", shortcut: "C" },
];

function AboutPanel() {
  return (
    <div className="desk-about">
      <div className="desk-panel-heading">
        <p className="desk-kicker">A little context</p>
        <h2>I’m interested in the space where <em>learning meets making.</em></h2>
      </div>
      <div className="about-grid">
        <div className="about-copy">
          <p>
            I’m an educator, UX/UI designer and curious maker based in London. I teach by day and build small,
            thoughtful things for the web by night.
          </p>
          <p>
            Whether I’m adapting a lesson or designing an interface, I care about making things clear, welcoming
            and a little more human.
          </p>
          <a className="desk-link" href="https://www.behance.net/tammanakapoor" target="_blank" rel="noreferrer">
            More on Behance <span>↗</span>
          </a>
        </div>
        <aside className="field-note">
          <span className="pin" aria-hidden="true" />
          <p className="scribble">right now...</p>
          <dl>
            <div><dt>Teaching</dt><dd>Learning support in London</dd></div>
            <div><dt>Building</dt><dd>Daily Café + FloraQuest</dd></div>
            <div><dt>Learning</dt><dd>Whatever has caught my eye</dd></div>
          </dl>
        </aside>
      </div>
      <div className="tiny-tags" aria-label="Skills and interests">
        <span>Inclusive learning</span><span>UX / UI</span><span>Visual stories</span><span>Creative coding</span>
      </div>
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="desk-projects">
      <div className="desk-panel-heading compact-heading">
        <p className="desk-kicker">Selected work</p>
        <h2>Things I’m <em>making.</em></h2>
      </div>
      <div className="project-cards">
        <article className="mini-project">
          <a href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer" className="mini-project-image cafe-thumb">
            <img src="/daily-cafe-cover.jpg" alt="Hand-drawn Daily Café interior with a barista and a guest at a table" />
            <span>01</span>
          </a>
          <div>
            <p>Website · illustration · sound</p>
            <h3>Daily Café</h3>
            <a href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer">Visit the café ↗</a>
          </div>
        </article>
        <article className="mini-project">
          <a href="/projects/floraquest" className="mini-project-image flora-thumb">
            <img src="/floraquest.png" alt="FloraQuest plant discovery game" />
            <span>02</span>
          </a>
          <div>
            <p>Learning game · product design</p>
            <h3>FloraQuest</h3>
            <a href="/projects/floraquest">See the process →</a>
          </div>
        </article>
      </div>
      <a className="all-work-link" href="/projects">Open the project archive <span>→</span></a>
    </div>
  );
}

function HobbiesPanel() {
  const hobbies = [
    ["Embroidery", "thread, slowly", "✽"],
    ["Sketching", "mostly people", "✎"],
    ["Walking", "no destination", "⌁"],
    ["London lately", "on film", "◉"],
  ];

  return (
    <div className="desk-hobbies">
      <div className="desk-panel-heading compact-heading">
        <p className="desk-kicker">Away from the screen</p>
        <h2>Current <em>side quests.</em></h2>
      </div>
      <div className="hobby-cards">
        {hobbies.map(([name, note, mark], index) => (
          <div className="hobby-card" key={name}>
            <span className="hobby-mark" aria-hidden="true">{mark}</span>
            <span className="hobby-count">0{index + 1}</span>
            <strong>{name}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <div className="hobby-footer">
        <p className="scribble">collecting hobbies like little souvenirs</p>
        <a className="desk-link" href="/outside">Open the visual diary <span>→</span></a>
      </div>
    </div>
  );
}

function ContactPanel() {
  return (
    <div className="desk-contact">
      <p className="desk-kicker">A note can become a nice thing</p>
      <h2>Have an idea?<br /><em>Let’s talk.</em></h2>
      <p className="contact-copy">
        I’m always happy to hear about thoughtful projects, creative collaborations or the hobby you think I
        should try next.
      </p>
      <div className="contact-actions">
        <a className="email-button" href="mailto:tammana4513@gmail.com">
          <span className="email-icon">↗</span>
          <span><small>Write to me</small>tammana4513@gmail.com</span>
        </a>
        <a className="email-button secondary" href="https://www.behance.net/tammanakapoor" target="_blank" rel="noreferrer">
          <span className="email-icon">✦</span>
          <span><small>See the portfolio</small>behance.net/tammanakapoor</span>
        </a>
      </div>
      <p className="scribble contact-scribble">I usually reply within a day or two, tea in hand.</p>
      <div className="contact-bottom">
        <span>Based in London · open to good ideas</span>
        <span>Teaching · design · small web things</span>
      </div>
    </div>
  );
}

function PanelContent({ active }: { active: PanelId }) {
  if (active === "projects") return <ProjectsPanel />;
  if (active === "hobbies") return <HobbiesPanel />;
  if (active === "contact") return <ContactPanel />;
  return <AboutPanel />;
}

export default function CardHome() {
  const [active, setActive] = useState<PanelId>("about");
  // null = untouched: CSS shows the panel on wide screens and keeps it closed on phones.
  const [open, setOpen] = useState<boolean | null>(null);
  const panelState = open === null ? "default" : open ? "open" : "closed";

  const showPanel = (id: PanelId) => {
    setActive(id);
    setOpen(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      const match = panels.find((panel) => panel.shortcut.toLowerCase() === event.key.toLowerCase());
      if (match && !event.metaKey && !event.ctrlKey && !event.altKey) showPanel(match.id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeLabel = panels.find((panel) => panel.id === active)?.label ?? "About me";

  return (
    <main className="card-home">
      <div className="desk-grain" aria-hidden="true" />
      <header className="desk-topbar">
        <a href="/" className="desk-brand">Tammana Kapoor <span>✦</span></a>
        <p>Educator · designer · curious maker</p>
        <span className="desk-status"><i /> London, UK</span>
      </header>

      <section className="desk-stage" aria-label="Tammana's portfolio desk">
        <span className="background-word word-one" aria-hidden="true">curious</span>
        <span className="background-word word-two" aria-hidden="true">maker</span>
        <span className="desk-doodle doodle-one" aria-hidden="true">✷</span>
        <span className="desk-doodle doodle-two" aria-hidden="true">⌇</span>

        <article className={`identity-card panel-is-${panelState}`}>
          <div className="identity-photo">
            <img src="/hero-botanist.jpg" alt="A dreamy botanical illustration representing Tammana" />
            <span className="available-pill"><i /> Currently creating</span>
          </div>
          <div className="identity-copy">
            <p className="desk-kicker">Hello, I’m Tammana</p>
            <h1>I teach, design & make <em>small things</em> with big curiosity.</h1>
            <p>Welcome to my little corner of the internet.</p>
          </div>
          <div className="identity-footer">
            <span>TK · 2026</span>
            <button type="button" onClick={() => showPanel("projects")}>See my work <span>↗</span></button>
          </div>
        </article>

        <aside className={`popup-window popup-${active} is-${panelState}`} aria-live="polite">
          <div className="window-bar">
            <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
            <span>tammana / {activeLabel.toLowerCase().replace(" ", "-")}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label={`Close ${activeLabel}`}>×</button>
          </div>
          <div className="window-content" key={active}>
            <PanelContent active={active} />
          </div>
        </aside>

        <p className="dock-hint" aria-hidden="true">Click a tab, or press <kbd>A</kbd> <kbd>P</kbd> <kbd>H</kbd> <kbd>C</kbd></p>
        <nav className="app-dock" aria-label="Explore portfolio">
          {panels.map((panel) => (
            <button
              type="button"
              className={active === panel.id && open !== false ? `active-${panelState}` : ""}
              onClick={() => showPanel(panel.id)}
              aria-pressed={active === panel.id && open === true}
              key={panel.id}
            >
              <span className="dock-icon" aria-hidden="true">{panel.icon}</span>
              <span>{panel.label}</span>
              <kbd>{panel.shortcut}</kbd>
            </button>
          ))}
        </nav>
      </section>

      <footer className="desk-footer">
        <span>© Tammana Kapoor</span>
        <span className="scribble">made with curiosity + too much tea</span>
        <a href="mailto:tammana4513@gmail.com">tammana4513@gmail.com</a>
      </footer>
    </main>
  );
}
