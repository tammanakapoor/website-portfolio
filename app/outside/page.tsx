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
    <main id="top" className="subpage">
      <TopBar current="outside" />

      <div className="page-shell">
        <header className="page-header page-header-short">
          <p className="section-kicker">Outside the screen</p>
          <h1>A diary of small things.</h1>
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

        <p className="back-link"><a className="text-link" href="/#outside">Back to the overview <ArrowRight className="arrow-inline" /></a></p>
      </div>

      <ContactBand />
      <Footer />
    </main>
  );
}
