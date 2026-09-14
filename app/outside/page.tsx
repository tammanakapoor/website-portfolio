import type { Metadata } from "next";
import { ContactBand, Footer, TopBar } from "../chrome";
import { ArrowRight, Squiggle, Tape } from "../marks";

export const metadata: Metadata = {
  title: "Outside the screen — Tammana Kapoor",
  description: "Photographs from away from the screen: embroidery, sketching, walking and London.",
};

/** Frames on the board. Swap `src` in when a photograph is ready; leave it empty for a placeholder. */
const frames: { n: string; name: string; shape: "tall" | "square" | "wide" | "landscape"; src?: string; alt?: string }[] = [
  { n: "01", name: "Embroidery", shape: "tall" },
  { n: "02", name: "Sketching", shape: "landscape" },
  { n: "03", name: "Walking", shape: "wide" },
  { n: "04", name: "London, lately", shape: "square" },
  { n: "05", name: "Embroidery", shape: "landscape" },
  { n: "06", name: "Sketching", shape: "tall" },
  { n: "07", name: "London, lately", shape: "wide" },
  { n: "08", name: "Walking", shape: "square" },
];

export default function OutsidePage() {
  return (
    <main id="top" className="subpage desk-subpage">
      <TopBar current="outside" />

      <div className="subpage-window page-shell">
        <div className="subpage-titlebar">
          <span className="subpage-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>tammana / outside the screen</span>
          <a href="/" aria-label="Return home">×</a>
        </div>
        <div className="subpage-window-content">
          <header className="page-header page-header-short">
            <p className="section-kicker">Outside the screen · visual diary</p>
            <h1>A diary of <span className="subpage-script">small things.</span></h1>
            <p className="page-intro">A quiet collection of things I make, notice and pick up along the way—kept here like photographs pinned above a desk.</p>
        </header>

          <div className="board" aria-label="Photographs from outside the screen">
            {frames.map((f) => (
              <figure className={`hobby board-${f.shape}`} key={f.n}>
                <Tape className="tape-top" />
                {f.src ? (
                  <img className="board-photo" src={f.src} alt={f.alt ?? f.name} loading="lazy" />
                ) : (
                  <div className="photo-placeholder" role="img" aria-label={`Space for a ${f.name.toLowerCase()} photograph`}>
                    <Squiggle className="placeholder-mark" />
                    <span className="note">photo soon</span>
                  </div>
                )}
                <figcaption>
                  <span className="hobby-n">{f.n}</span>
                  <span className="hobby-name">{f.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="back-link"><a className="text-link" href="/">Back to the desk <ArrowRight className="arrow-inline" /></a></p>
        </div>
      </div>

      <ContactBand />
      <Footer />
    </main>
  );
}
