import { stories } from "../public/whimsy-home.js";

export default function WhimsyHome({ staticSite = false }: { staticSite?: boolean }) {
  const opening = stories[0];
  const media = staticSite ? "media/" : "/media/";
  return (
    <main className="whimsy-home" data-whimsy-home data-static={staticSite}>
      <div className="whimsy-backdrop" aria-hidden="true" />
      <div className="whimsy-pollen" aria-hidden="true">
        {[8, 19, 31, 72, 84, 92].map((left, index) => <i key={left} style={{ left: `${left}%`, animationDelay: `${index * -3.4}s`, animationDuration: `${17 + index * 2}s` }} />)}
      </div>

      <section className="whimsy-studio" aria-label="Tammana’s living typewriter">
        <h1 className="whimsy-sr-only">Tammana Kapoor — educator, designer and curious maker</h1>
        <div className="whimsy-frame">
          <div className="whimsy-reel">
            <video className="whimsy-video" data-typewriter-video muted playsInline preload="auto" poster={`${media}typewriter-start.jpg`} aria-label="A vintage black typewriter in warm sunlight, with flowers growing around it">
              <source src={`${media}flowers-typewriter.mp4`} type="video/mp4" />
            </video>
            <article className="whimsy-letter" aria-label="A letter from Tammana">
              <div className="whimsy-ink" aria-hidden="true">
                <h2 data-typed-title>{opening.title}</h2>
                <div className="whimsy-body" data-typed-body>{opening.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
              </div>
              <svg className="whimsy-scroll-cue" viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M6 2v14M2.5 5.5 6 2l3.5 3.5M2.5 12.5 6 16l3.5-3.5" /></svg>
            </article>
          </div>
        </div>
        <div className="whimsy-sr-only" data-readable aria-live="polite" aria-atomic="true">{opening.title} {opening.paragraphs.join(" ")}</div>
      </section>

      <section className="whimsy-explore" aria-label="Explore my story">
        <p>THERE’S MORE TO THE STORY</p>
        <nav className="whimsy-tabs" aria-label="Choose a letter">
          {[["about", "About me"], ["work", "What I make"], ["outside", "Beyond the screen"], ["hello", "A little hello"]].map(([id, label], index) => (
            <button key={id} type="button" data-story={id} aria-pressed={index === 0}><span>0{index + 1}</span>{label}<span className="whimsy-tab-arrow">↗</span></button>
          ))}
        </nav>
        <a className="whimsy-story-link" data-story-link hidden href={staticSite ? "projects" : "/projects"}>{opening.link} ↗</a>
      </section>

      <footer className="whimsy-footer">
        <span>© {new Date().getFullYear()} Tammana Kapoor</span>
        <span><i /> London, UK <span className="whimsy-footer-divider">/</span> Usually making something.</span>
        <span className="whimsy-footer-script">Made with a little curiosity.</span>
      </footer>
    </main>
  );
}
