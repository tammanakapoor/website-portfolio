import type { Metadata } from "next";
import { ContactBand, Footer, TopBar } from "../chrome";
import { ArrowRight } from "../marks";

export const metadata: Metadata = {
  title: "Outside the screen — Tammana Kapoor",
  description: "Photographs from away from the screen: embroidery, sketching, walking and London.",
};

const frames: { shape: "tall" | "square" | "wide" | "landscape"; src: string; alt: string }[] = [
  { shape: "tall", src: "/visual-diary/embroidered-tote.jpg", alt: "Cream tote bag embroidered with a colourful bouquet, bees and a flowering branch" },
  { shape: "tall", src: "/visual-diary/regents-canal.jpg", alt: "Sunny towpath beside Regent’s Canal, framed by trees and a blue sky" },
  { shape: "wide", src: "/visual-diary/barbican-pond.jpg", alt: "Barbican lake with waterlilies, fountains and people sitting beside the water" },
  { shape: "tall", src: "/visual-diary/london-in-march.jpg", alt: "Sketchbook page with hand-drawn daffodil, crocus and magnolia flowers" },
  { shape: "tall", src: "/visual-diary/cheddar-gorge.jpg", alt: "Winding road between steep rocky cliffs beneath a cloudy sky" },
  { shape: "tall", src: "/visual-diary/scooter-sketch.jpg", alt: "Colourful sketch of two people riding together on a pale blue scooter" },
  { shape: "wide", src: "/visual-diary/countryside-cows.jpg", alt: "Brown cattle grazing in a vivid green field beneath a blue and cloudy sky" },
  { shape: "square", src: "/visual-diary/cake-roll-sketch.jpg", alt: "Oil pastel sketch of a green rolled cake decorated with strawberries" },
  { shape: "tall", src: "/visual-diary/victoria-park-run.jpg", alt: "Sketchbook page documenting a 21.75 kilometre route to Victoria Park" },
  { shape: "landscape", src: "/visual-diary/washing-line-sketch.jpg", alt: "Black ink sketch of two windows and clothes hanging on a washing line" },
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
              <figure className={`spiral-card board-${f.shape}`} key={f.src}>
                <img className="board-photo" src={f.src} alt={f.alt} loading="lazy" decoding="async" />
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
