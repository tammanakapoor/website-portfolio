"use client";

import { useRef } from "react";
import "./camera-roll.css";

const photos = [
  { src: "regents-canal.jpg", caption: "The long way home", alt: "Sunlit towpath along Regent’s Canal" },
  { src: "barbican-pond.jpg", caption: "An afternoon at the Barbican", alt: "Waterlilies and fountains at the Barbican lake" },
  { src: "embroidered-tote.jpg", caption: "One stitch at a time", alt: "Hand embroidered flowers on a cream tote bag" },
  { src: "cheddar-gorge.jpg", caption: "Somewhere along the way", alt: "A winding road between the cliffs of Cheddar Gorge" },
  { src: "london-in-march.jpg", caption: "London, in bloom", alt: "Sketchbook studies of spring flowers" },
  { src: "countryside-cows.jpg", caption: "A little further afield", alt: "Cattle grazing in a green field under a blue sky" },
  { src: "scooter-sketch.jpg", caption: "Collected on paper", alt: "A colourful sketch of two people on a scooter" },
  { src: "cake-roll-sketch.jpg", caption: "Something sweet", alt: "A pastel drawing of a green cake roll with strawberries" },
  { src: "victoria-park-run.jpg", caption: "Out for a very long run", alt: "A sketchbook record of a route to Victoria Park" },
  { src: "washing-line-sketch.jpg", caption: "An ordinary afternoon", alt: "An ink drawing of windows and a washing line" },
];

export default function CameraRoll() {
  const roll = useRef<HTMLDivElement>(null);
  function scroll(direction: number) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roll.current?.scrollBy({ left: direction * roll.current.clientWidth * .75, behavior: reducedMotion ? "instant" : "smooth" });
  }
  return <section className="camera-diary" aria-labelledby="camera-title">
    <header className="camera-heading"><div><p className="camera-kicker">OFF THE CLOCK / A VISUAL DIARY</p><h2 id="camera-title">Camera <em>roll.</em></h2></div><p>Things I make. Places I wander.<br/>Little moments worth keeping.</p></header>
    <div className="camera-strip" ref={roll} tabIndex={0} role="region" aria-label="Camera roll. Scroll horizontally to explore photographs and sketches.">
      <div className="camera-frames">{photos.map((photo) => <figure className="camera-frame" key={photo.src}>
        <img src={`/visual-diary/${photo.src}`} alt={photo.alt} loading="lazy" decoding="async" />
        <figcaption>{photo.caption}</figcaption>
      </figure>)}</div>
    </div>
    <footer className="camera-footer"><span>A FEW FRAMES FROM LIFE LATELY</span><div><span className="camera-swipe">SCROLL TO EXPLORE</span><button onClick={() => scroll(-1)} aria-label="Previous photos">←</button><button onClick={() => scroll(1)} aria-label="Next photos">→</button></div></footer>
  </section>;
}
