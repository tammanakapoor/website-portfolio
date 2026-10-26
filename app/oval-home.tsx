import PatternedOval from "./patterned-oval";
import { stories } from "../public/oval-home.js";

export default function OvalHome({ staticSite = false }: { staticSite?: boolean }) {
  const opening = stories[0];
  return (
    <main className="oval-home" data-oval-home data-static={staticSite}>
      <section className="oval-studio" aria-label="An introduction from Tammana">
        <PatternedOval />
        <article className="oval-story" aria-live="polite" aria-atomic="true">
          <p className="oval-kicker" data-story-label>{opening.label}</p>
          <h1 data-story-title>{opening.title}</h1>
          <div className="oval-body" data-story-body>{opening.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          <a className="oval-story-link" data-story-link hidden href={staticSite ? "projects" : "/projects"}>{opening.link} ↗</a>
        </article>
      </section>
      <section className="oval-explore" aria-label="Explore my story">
        <p>THERE’S MORE TO THE STORY</p>
        <nav className="oval-tabs" aria-label="Choose a story">
          {[["about", "About me"], ["work", "What I make"], ["outside", "Beyond the screen"], ["hello", "A little hello"]].map(([id, label], i) => (
            <button key={id} type="button" data-story={id} aria-pressed={i === 0}><span>0{i + 1}</span>{label}<span className="oval-tab-arrow">↗</span></button>
          ))}
        </nav>
      </section>
      <footer className="oval-footer">
        <span>© {new Date().getFullYear()} Tammana Kapoor</span>
        <span><i /> London, UK <span className="oval-footer-divider">/</span> Usually making something.</span>
        <span className="oval-footer-script">Made with a little curiosity.</span>
      </footer>
    </main>
  );
}
