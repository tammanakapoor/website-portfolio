import { ArrowRight, ArrowUp, Asterisk, Leaf } from "./marks";

/** Shared top bar and footer for every page. */

export function TopBar({ current }: { current?: "projects" | "outside" }) {
  return (
    <header className="topbar page-shell">
      <a className="brand" href="/" aria-label="Tammana Kapoor, home">
        Tammana Kapoor
        <Leaf className="brand-leaf" />
      </a>
      <nav className="nav" aria-label="Primary navigation">
        <a href="/projects" aria-current={current === "projects" ? "page" : undefined}>Projects</a>
        <a href="/outside" aria-current={current === "outside" ? "page" : undefined}>Outside</a>
        <a href="/#story">About</a>
        <a href="/#contact">Contact</a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="page-shell">
      <p>
        © Tammana Kapoor <Asterisk className="footer-mark" /> <span className="note">made with curiosity</span>
      </p>
      <div>
        <a href="#top">Back to top <ArrowUp className="arrow-inline arrow-inline-up" /></a>
      </div>
    </footer>
  );
}

export function ContactBand() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="page-shell">
        <p className="section-kicker">Have an idea?</p>
        <h2 id="contact-title">Let’s make something thoughtful.</h2>
        <div className="contact-row">
          <a href="mailto:tammana4513@gmail.com">tammana4513@gmail.com</a>
          <span className="note contact-note" aria-hidden="true">
            <ArrowRight className="note-arrow" /> say hello, I reply
          </span>
        </div>
      </div>
    </section>
  );
}
