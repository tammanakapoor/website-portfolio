"use client";

import { useEffect, useState } from "react";

type SectionName = "portrait" | "projects" | "about" | "hobbies";

export default function CardHome() {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState<SectionName | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpened(true), 280);
    return () => window.clearTimeout(timer);
  }, []);

  const replay = () => {
    setOpened(false);
    setActive(null);
    window.setTimeout(() => setOpened(true), 520);
  };

  return (
    <main className="popup-card-page">
      <div className="craft-grain" aria-hidden="true" />

      <header className="popup-site-header">
        <a href="/">Tammana Kapoor <span>✿</span></a>
        <p>A portfolio that unfolds</p>
        <button type="button" onClick={replay} aria-label="Replay the card opening animation">
          ↻ open again
        </button>
      </header>

      <section className={`paper-stage ${opened ? "card-opened" : ""}`} aria-label="An open paper pop-up portfolio">
        <div className="card-shadow" aria-hidden="true" />

        <div className="card-back" aria-hidden="true">
          <span className="back-sun" />
          <span className="paper-cloud cloud-one" />
          <span className="paper-cloud cloud-two" />
          <span className="paper-leaf leaf-one">❧</span>
          <span className="paper-leaf leaf-two">❧</span>
          <p>hello, curious human</p>
        </div>

        <div className="popup-garden" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i /><i /><i />
        </div>

        <article
          className={`paper-popup portrait-popup ${active === "portrait" ? "is-active" : ""}`}
          onClick={() => setActive(active === "portrait" ? null : "portrait")}
        >
          <div className="popup-fold" aria-hidden="true" />
          <div className="portrait-cutout">
            <img src="/hero-botanist.jpg" alt="Illustrated portrait of Tammana surrounded by plants" />
          </div>
          <div className="portrait-label">
            <small>Meet the maker</small>
            <strong>Tammana</strong>
            <span>educator · designer · collector of hobbies</span>
          </div>
        </article>

        <article
          className={`paper-popup projects-popup ${active === "projects" ? "is-active" : ""}`}
          onClick={() => setActive(active === "projects" ? null : "projects")}
        >
          <div className="popup-fold" aria-hidden="true" />
          <span className="paper-tab">01</span>
          <p className="paper-kicker">Selected work</p>
          <h2>Things I’m making</h2>
          <div className="paper-projects">
            <a href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
              <img src="/daily-cafe.png" alt="Daily Café illustrated website" />
              <span><strong>Daily Café</strong><small>visit ↗</small></span>
            </a>
            <a href="/projects#floraquest" onClick={(event) => event.stopPropagation()}>
              <img src="/floraquest.png" alt="FloraQuest plant learning game" />
              <span><strong>FloraQuest</strong><small>explore →</small></span>
            </a>
          </div>
          <a className="paper-more" href="/projects" onClick={(event) => event.stopPropagation()}>All projects →</a>
        </article>

        <article
          className={`paper-popup about-popup ${active === "about" ? "is-active" : ""}`}
          onClick={() => setActive(active === "about" ? null : "about")}
        >
          <div className="popup-fold" aria-hidden="true" />
          <span className="paper-tab">02</span>
          <p className="paper-kicker">A little about me</p>
          <h2>Learning meets <em>making.</em></h2>
          <p>
            I teach by day and build small, thoughtful things for the web by night. I care about making ideas feel
            clear, useful and human.
          </p>
          <div className="about-stamps"><span>London</span><span>UX / UI</span><span>Education</span></div>
        </article>

        <article
          className={`paper-popup hobbies-popup ${active === "hobbies" ? "is-active" : ""}`}
          onClick={() => setActive(active === "hobbies" ? null : "hobbies")}
        >
          <div className="popup-fold" aria-hidden="true" />
          <span className="paper-tab">03</span>
          <p className="paper-kicker">Current side quests</p>
          <h2>Hobbies</h2>
          <div className="hobby-blooms">
            <span><b>✿</b> Embroidery</span>
            <span><b>✎</b> Sketching</span>
            <span><b>⌁</b> Walking</span>
            <span><b>◉</b> Film photos</span>
          </div>
          <a className="paper-more" href="/outside" onClick={(event) => event.stopPropagation()}>Visual diary →</a>
        </article>

        <div className="card-floor">
          <div className="floor-fold" aria-hidden="true" />
          <div className="floor-message">
            <p>Folded with care in London</p>
            <h1>Come in.<br />Have a little <em>look around.</em></h1>
          </div>
          <a className="floor-contact" href="mailto:tammana4513@gmail.com">
            <small>Want to make something thoughtful?</small>
            <strong>say hello</strong>
            <span>↗</span>
          </a>
          <p className="floor-instruction">Tap a paper piece to bring it forward</p>
        </div>
      </section>

      <footer className="popup-site-footer">
        <span>© 2026 Tammana Kapoor</span>
        <span>paper, pixels &amp; plenty of curiosity</span>
        <a href="https://www.behance.net/tammanakapoor" target="_blank" rel="noreferrer">Behance ↗</a>
      </footer>
    </main>
  );
}
