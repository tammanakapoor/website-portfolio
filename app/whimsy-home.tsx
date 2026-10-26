import { stories } from "../public/oval-home.js";

export default function WhimsyHome({ staticSite = false }: { staticSite?: boolean }) {
  const opening = stories[0];
  return <main className="whimsy-home" data-whimsy-home data-static={staticSite}>
    <header className="whimsy-header"><a href={staticSite ? "./" : "/"} aria-label="Tammana Kapoor home"><span className="whimsy-flower">✳</span> tammana kapoor<span className="whimsy-period">.</span></a><span>A LITTLE CORNER OF THE INTERNET</span><a href="mailto:tammana4513@gmail.com">Say hello <span>↗</span></a></header>
    <section className="whimsy-studio" aria-label="Tammana’s animated 3D typewriter">
      <div className="whimsy-scene-heading"><p>LETTERS FROM MY LITTLE WORLD</p><h1>A little curiosity.<br/><em>A story still unfolding.</em></h1></div>
      <div className="whimsy-scene" data-typewriter-scene>
        <article className="whimsy-fallback" data-readable aria-live="polite" aria-atomic="true"><p className="whimsy-letter-label">01 / A LITTLE INTRODUCTION</p><h2>{opening.title}</h2>{opening.paragraphs.map(p=><p key={p}>{p}</p>)}<span>with curiosity, Tammana</span></article>
        <span className="whimsy-scene-note" aria-hidden="true">a few thoughts,<br/>fresh off the keys <svg viewBox="0 0 80 70" fill="none"><path d="M4 6c42-8 67 10 49 42m-11-9 10 12 14-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
        <div className="whimsy-scene-controls"><button type="button" data-motion-toggle aria-pressed="false" aria-label="Pause typewriter animation">Ⅱ <span>Pause</span></button><button type="button" data-finish-letter>Read letter <span>↗</span></button></div>
      </div>
      <div className="whimsy-scene-caption"><span className="whimsy-status"><i/> <span data-typing-status>A thought taking shape...</span></span><span className="whimsy-touch-hint">a little machine, a lot of possibility</span></div>
    </section>
    <section className="whimsy-explore" aria-label="Explore my story"><p>TURN THE PAGE</p><nav className="whimsy-tabs" aria-label="Choose a letter">{[["about","About me"],["work","What I make"],["outside","Beyond the screen"],["hello","A little hello"]].map(([id,label],i)=><button key={id} type="button" data-story={id} aria-pressed={i===0}><span>0{i+1}</span>{label}<span className="whimsy-tab-arrow">↗</span></button>)}</nav><a className="whimsy-story-link" data-story-link href={staticSite ? "projects" : "/projects"}>{opening.link} ↗</a></section>
    <footer className="whimsy-footer"><span>© {new Date().getFullYear()} Tammana Kapoor</span><span><i/> London, UK <span className="whimsy-footer-divider">/</span> Usually making something.</span><span className="whimsy-footer-script">Made with a little curiosity.</span></footer>
  </main>;
}
