"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "home", label: "Beginning", number: "00" },
  { id: "about", label: "About", number: "01" },
  { id: "projects", label: "Work", number: "02" },
  { id: "curiosities", label: "Curiosities", number: "03" },
  { id: "contact", label: "Contact", number: "04" },
] as const;

function Lotus({ className = "" }: { className?: string }) {
  return (
    <div className={`lotus ${className}`} aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
      <b />
    </div>
  );
}

function Ripple({ className = "" }: { className?: string }) {
  return <span className={`pond-ripple ${className}`} aria-hidden="true"><i /><i /><i /></span>;
}

function Leaf({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`pond-leaf ${className}`}>
      <span className="leaf-notch" aria-hidden="true" />
      <span className="leaf-vein leaf-vein-a" aria-hidden="true" />
      <span className="leaf-vein leaf-vein-b" aria-hidden="true" />
      <span className="leaf-vein leaf-vein-c" aria-hidden="true" />
      {children}
    </div>
  );
}

export default function CardHome() {
  const pageRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const move = (event: PointerEvent) => {
      page.style.setProperty("--pond-x", `${event.clientX}px`);
      page.style.setProperty("--pond-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-42% 0px -42% 0px" },
    );
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener("pointermove", move);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="pond-home" ref={pageRef}>
      <div className="pond-water" aria-hidden="true"><span /><span /><span /></div>
      <div className="cursor-glow" aria-hidden="true" />

      <header className="pond-header">
        <a className="pond-brand" href="#home" aria-label="Tammana Kapoor, back to the beginning">
          <span>TK</span>
          <i />
          <strong>Tammana Kapoor</strong>
        </a>
        <p>London · 51.5072° N</p>
        <a className="availability" href="mailto:tammana4513@gmail.com"><i /> Available for thoughtful ideas</a>
      </header>

      <nav className="pond-nav" aria-label="Portfolio sections">
        {sections.map((item) => (
          <a key={item.id} className={active === item.id ? "active" : ""} href={`#${item.id}`}>
            <span>{item.number}</span>{item.label}
          </a>
        ))}
      </nav>

      <section className="pond-scene hero-pond" id="home">
        <div className="editorial-hero-art">
          <img src="/og-pond.png" alt="A moonlit lotus pond with a glass panel reading Ideas that grow gently" />
          <div className="hero-art-actions">
            <h1 className="visually-hidden">Ideas that grow gently.</h1>
            <p className="visually-hidden">Tammana Kapoor—educator, designer and curious maker.</p>
            <a className="pond-cta" href="#projects"><span>Discover the work</span><i>↓</i></a>
          </div>
        </div>
        <p className="water-caption caption-one">A quiet place for curious work</p>
        <Ripple className="ripple-one" />
        <span className="floating-petal petal-one" aria-hidden="true" />
      </section>

      <section className="pond-scene about-pond" id="about">
        <p className="water-index">01 <span>THE PERSON</span></p>
        <Leaf className="leaf-about">
          <Lotus className="lotus-blur lotus-about" />
          <div className="glass-panel about-glass">
            <div className="editorial-title">
              <p className="pond-kicker"><span>A little context</span><i /></p>
              <h2>Making learning feel<br /><em>clear and human.</em></h2>
            </div>
            <div className="about-columns">
              <p className="dropcap">I’m an educator, UX/UI designer and curious maker based in London. I teach by day and build small, thoughtful things for the web by night.</p>
              <p>Whether I’m adapting a lesson or designing an interface, I care about clarity, warmth and the tiny details that make an experience feel welcoming.</p>
            </div>
            <div className="now-line"><span>Currently</span><strong>Teaching · Building · Learning</strong></div>
          </div>
        </Leaf>
        <Leaf className="decor-leaf decor-leaf-three"><span /></Leaf>
        <Ripple className="ripple-three" />
      </section>

      <section className="pond-scene work-pond" id="projects">
        <p className="water-index water-index-right">02 <span>SELECTED WORK</span></p>
        <Leaf className="leaf-work">
          <Lotus className="lotus-blur lotus-work" />
          <div className="glass-panel work-glass">
            <div className="editorial-title work-title">
              <p className="pond-kicker"><span>Selected work</span><i /></p>
              <h2>Things I’m<br /><em>growing.</em></h2>
              <a className="quiet-link" href="/projects">View the archive ↗</a>
            </div>
            <div className="pond-projects">
              <article>
                <a className="project-frame" href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer">
                  <img src="/daily-cafe.png" alt="The illustrated Daily Café website" />
                  <span>01</span>
                </a>
                <div className="project-meta"><p>Website · Illustration · Sound</p><h3>Daily Café</h3><a href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer">Enter the café ↗</a></div>
              </article>
              <article>
                <a className="project-frame" href="/projects#floraquest">
                  <img src="/floraquest.png" alt="FloraQuest plant discovery game" />
                  <span>02</span>
                </a>
                <div className="project-meta"><p>Learning game · Product design</p><h3>FloraQuest</h3><a href="/projects#floraquest">See the process ↗</a></div>
              </article>
            </div>
          </div>
        </Leaf>
        <Leaf className="decor-leaf decor-leaf-four"><span /></Leaf>
        <span className="floating-petal petal-three" aria-hidden="true" />
      </section>

      <section className="pond-scene curiosity-pond" id="curiosities">
        <p className="water-index">03 <span>OFF SCREEN</span></p>
        <Leaf className="leaf-curiosity">
          <Lotus className="lotus-blur lotus-curiosity" />
          <div className="glass-panel curiosity-glass">
            <div className="editorial-title">
              <p className="pond-kicker"><span>Elsewhere, lately</span><i /></p>
              <h2>A collector of<br /><em>small obsessions.</em></h2>
            </div>
            <div className="curiosity-list">
              {["Embroidery", "Sketching people", "Aimless walks", "London on film"].map((item, index) => (
                <a href="/outside" key={item}><span>0{index + 1}</span><strong>{item}</strong><i>↗</i></a>
              ))}
            </div>
            <p className="margin-note">The side quests are part of the work.</p>
          </div>
        </Leaf>
        <Leaf className="decor-leaf decor-leaf-five"><Lotus className="lotus-small lotus-ivory" /></Leaf>
        <Ripple className="ripple-four" />
      </section>

      <section className="pond-scene contact-pond" id="contact">
        <Leaf className="leaf-contact">
          <Lotus className="lotus-contact" />
          <div className="glass-panel contact-glass">
            <p className="pond-kicker"><span>Come say hello</span><i /></p>
            <h2>Perhaps we’ll make<br /><em>something lovely.</em></h2>
            <p>Thoughtful projects, creative collaborations, or simply a hobby I should try next—I’d love to hear from you.</p>
            <a className="email-link" href="mailto:tammana4513@gmail.com"><span>Write to me</span><strong>tammana4513@gmail.com</strong><i>↗</i></a>
            <div className="contact-links"><span>London, United Kingdom</span><a href="https://www.behance.net/tammanakapoor" target="_blank" rel="noreferrer">Behance ↗</a></div>
          </div>
        </Leaf>
        <p className="pond-signoff">Made with curiosity · Tammana Kapoor © 2026</p>
        <Ripple className="ripple-five" />
      </section>
    </main>
  );
}
