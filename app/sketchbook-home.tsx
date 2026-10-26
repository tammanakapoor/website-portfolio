"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import CameraRoll from "./camera-roll";
import { projects } from "./projects/data";
import "./sketchbook-home.css";

type Plate = { title: string; category: string; image: string; alt: string; description: string; note: string; href: string; link: string };
const plates: Plate[] = [
  ...projects.map(p => ({ title: p.title, category: p.tagList[0], image: p.cover.src, alt: p.cover.alt, description: p.summary, note: p.cover.note, href: `/projects/${p.id}`, link: "Read the project story" })),
  { title: "An ordinary afternoon", category: "Sketchbook", image: "/visual-diary/washing-line-sketch.jpg", alt: "Pencil sketch of a washing line outside a house", description: "A washing line, a quiet street, a moment that would be easy to walk past. A small reminder to look a little longer.", note: "the everyday, in pencil", href: "/outside", link: "Beyond the screen" },
  { title: "Spring, on paper", category: "Botanical study", image: "/visual-diary/london-in-march.jpg", alt: "A sketchbook filled with drawings of spring flowers", description: "A page for the flowers that make an ordinary walk feel different. Looking closely, drawing slowly, and learning as I go.", note: "a little bit of London", href: "/outside", link: "More little observations" },
  { title: "Something sweet", category: "Sketchbook", image: "/visual-diary/cake-roll-sketch.jpg", alt: "A hand-drawn study of a cake roll", description: "Some things are worth drawing before they disappear. A little study from my sketchbook, made for the pleasure of noticing.", note: "pencil, paper & a little appetite", href: "/outside", link: "Beyond the screen" },
  { title: "Parked for a moment", category: "Sketchbook", image: "/visual-diary/scooter-sketch.jpg", alt: "A drawing of a scooter in a sketchbook", description: "A scooter becomes a reason to stop. I like the way drawing turns a passing detail into something you remember.", note: "no particular destination", href: "/outside", link: "More from the sketchbook" },
  { title: "One stitch at a time", category: "Made by hand", image: "/visual-diary/embroidered-tote.jpg", alt: "A tote bag decorated with hand embroidery", description: "Away from a screen, making takes a different pace. Thread, a tote bag, and the satisfaction of something slowly coming together.", note: "a small exercise in patience", href: "/outside", link: "More things made by hand" },
  { title: "The long way home", category: "London wanderings", image: "/visual-diary/regents-canal.jpg", alt: "A view along Regent’s Canal in London", description: "An excuse to take the slower route. Walks, water, and the little things that find their way back into everything I make.", note: "collected on a walk", href: "/outside", link: "More from my everyday" },
];
const number = (n: number) => String(n + 1).padStart(2, "0");

function Arrow({ left = false }: { left?: boolean }) {
  return <svg viewBox="0 0 24 60" fill="none" aria-hidden="true"><path d={left ? "M19 3 4 30l15 27" : "M5 3 20 30 5 57"} stroke="currentColor" strokeWidth=".8"/></svg>;
}

export default function SketchbookHome() {
  const [page, setPage] = useState(0);
  const [leaf, setLeaf] = useState<{ plate: Plate; direction: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [magnifier, setMagnifier] = useState(false);
  const [lens, setLens] = useState({ x: 58, y: 48 });
  const [dragging, setDragging] = useState(false);
  const [artSize, setArtSize] = useState({ width: 1, height: 1 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const art = useRef<HTMLDivElement>(null);
  const gesture = useRef<number | null>(null);
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const plate = plates[page];
  useEffect(() => {
    if (!art.current) return;
    const observer = new ResizeObserver(entries => { const box = entries[0].contentRect; setArtSize({ width: box.width, height: box.height }); });
    observer.observe(art.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => () => { if (turnTimer.current) clearTimeout(turnTimer.current); }, []);

  function turn(next: number, direction = next > page ? 1 : -1) {
    if (leaf || next === page) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) setLeaf({ plate, direction });
    setPage((next + plates.length) % plates.length);
    setTilt({ x: 0, y: 0 });
    turnTimer.current = setTimeout(() => setLeaf(null), 700);
  }
  function moveGlass(event: PointerEvent<HTMLButtonElement>) {
    if (!dragging || !art.current) return;
    const bounds = art.current.getBoundingClientRect();
    setLens({ x: Math.max(12, Math.min(88, (event.clientX - bounds.left) / bounds.width * 100)), y: Math.max(14, Math.min(82, (event.clientY - bounds.top) / bounds.height * 100)) });
  }
  function choose(index: number) { turn(index); document.getElementById("sketchbook")?.scrollIntoView({ behavior: "smooth" }); }

  return <main className="folio" id="top">
    <div className="folio-wash" aria-hidden="true"/>
    <a className="folio-skip" href="#about">Skip the sketchbook</a>
    <header className="folio-header"><a className="folio-name" href="#top">Tammana Kapoor</a><nav aria-label="Primary navigation"><a href="#plates">Journal</a><a href="#photos">Camera roll</a><a href="#about">About</a><a href="#contact">Contact</a><span/><a href="/projects">Selected work ↗</a></nav></header>
    <section className="folio-hero" id="sketchbook" aria-labelledby="folio-title">
      <img className="folio-botany left" src="/sketchbook/botany-left.png" alt=""/>
      <img className="folio-botany right" src="/sketchbook/botany-right.png" alt=""/>
      <h1 id="folio-title">EDUCATOR / DESIGNER / CURIOUS MAKER / LONDON</h1>
      <div className="folio-stage">
        <button className="folio-arrow" aria-label="Previous page" onClick={() => turn(page - 1, -1)} disabled={!!leaf}><Arrow left/></button>
        <div className="folio-book-space">
          <nav className="folio-project-tabs" aria-label="Project bookmarks">
            {projects.map((project, index) => <button key={project.id} type="button" className="folio-project-tab" aria-current={page === index ? "page" : undefined} aria-label={`Turn to ${project.title}`} disabled={!!leaf} onClick={() => turn(index)} style={{ "--tab-color": ["#e8ce86", "#becbb0", "#dfb7a8"][index % 3], "--tab-angle": ["-2deg", "1.5deg", "-1deg"][index % 3] } as CSSProperties}><span>{project.title}</span><span className="folio-tab-mark" aria-hidden="true">{page === index ? "↙" : "↗"}</span></button>)}
          </nav>
          <div className="folio-book" tabIndex={0} role="group" aria-label="Interactive portfolio sketchbook. Use left and right arrow keys to turn pages."
            onKeyDown={e => { if (e.key === "ArrowRight") { e.preventDefault(); turn(page + 1, 1); } if (e.key === "ArrowLeft") { e.preventDefault(); turn(page - 1, -1); } }}
            onPointerDown={e => { if (!(e.target as HTMLElement).closest("a,button")) gesture.current = e.clientX; }}
            onPointerUp={e => { if (gesture.current !== null && Math.abs(e.clientX - gesture.current) > 45) turn(page + (e.clientX < gesture.current ? 1 : -1), e.clientX < gesture.current ? 1 : -1); gesture.current = null; }}
            onPointerCancel={() => { gesture.current = null; }}
            onPointerMove={e => { if (e.pointerType !== "mouse" || dragging || leaf) return; const b = e.currentTarget.getBoundingClientRect(); setTilt({ x: (e.clientY - b.top - b.height / 2) / b.height * -2, y: (e.clientX - b.left - b.width / 2) / b.width * 2 }); }}
            onPointerLeave={() => { setTilt({ x: 0, y: 0 }); gesture.current = null; }}
            style={{ "--book-zoom": zoom, "--book-rx": `${tilt.x}deg`, "--book-ry": `${tilt.y}deg` } as CSSProperties}>
            <div className="folio-page folio-page-left"><div className="folio-page-meta"><span>TAMMANA’S SKETCHBOOK</span><span>VOL. 01</span></div><div className="folio-page-text"><span className="folio-small">{plate.category}</span><h2>{plate.title}</h2><div className="folio-rule"/><p>{plate.description}</p><a href={plate.href}>{plate.link} <span>↗</span></a></div><div className="folio-page-foot"><span className="folio-hand">{plate.note}</span><span>{number(page * 2)}</span></div></div>
            <div className="folio-page folio-page-right"><div className="folio-page-meta"><span>A COLLECTION OF SMALL CURIOSITIES</span><span>PLATE {number(page)}</span></div><div ref={art} className="folio-art" style={{ backgroundImage: `url("${plate.image}")` }} role="group" aria-label={plate.alt}>
              {magnifier && <button className={`folio-loupe ${dragging ? "dragging" : ""}`} aria-label="Magnifying glass. Drag to inspect artwork; use arrow keys to move it." style={{ left: `${lens.x}%`, top: `${lens.y}%` }}
                onPointerDown={e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); }} onPointerMove={moveGlass} onPointerUp={() => setDragging(false)} onLostPointerCapture={() => setDragging(false)}
                onKeyDown={e => { if (e.key.startsWith("Arrow")) { e.preventDefault(); e.stopPropagation(); setLens(pos => ({ x: Math.max(12, Math.min(88, pos.x + (e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0))), y: Math.max(14, Math.min(82, pos.y + (e.key === "ArrowDown" ? 5 : e.key === "ArrowUp" ? -5 : 0))) })); } }}>
                <span className="folio-loupe-image"><img src={plate.image} alt="" draggable={false} style={{ width: artSize.width * 2.2, height: artSize.height * 2.2, left: `calc(50% - ${lens.x / 100 * artSize.width * 2.2}px)`, top: `calc(50% - ${lens.y / 100 * artSize.height * 2.2}px)` }}/></span><span className="folio-loupe-handle"/></button>}
              </div><div className="folio-page-foot"><span>LOOK A LITTLE LONGER.</span><span>{number(page * 2 + 1)}</span></div></div>
            <div className="folio-spine" aria-hidden="true"/>
            {leaf && <div className={`folio-turn ${leaf.direction < 0 ? "backward" : ""}`} aria-hidden="true"><div className="folio-turn-art" style={{ backgroundImage: `url("${leaf.plate.image}")` }}/><div className="folio-turn-shade"/></div>}
          </div>
        </div>
        <button className="folio-arrow" aria-label="Next page" onClick={() => turn(page + 1, 1)} disabled={!!leaf}><Arrow/></button>
      </div>
      <div className="folio-caption" aria-live="polite" aria-atomic="true"><span>{number(page)} / {String(plates.length).padStart(2, "0")}</span><p>{plate.title}</p><span>{plate.category}</span></div>
      <div className="folio-controls" aria-label="Sketchbook view controls"><button aria-label="Zoom out" onClick={() => setZoom(z => Math.max(.85, +(z - .1).toFixed(2)))} disabled={zoom <= .85}>−</button><output aria-label="Zoom level">{Math.round(zoom * 100)}%</output><button aria-label="Zoom in" onClick={() => setZoom(z => Math.min(1.15, +(z + .1).toFixed(2)))} disabled={zoom >= 1.15}>+</button><span/><button aria-label="Toggle magnifying glass" aria-pressed={magnifier} onClick={() => setMagnifier(!magnifier)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor"/><path d="m15 15 6 6" stroke="currentColor" strokeWidth="1.5"/></svg></button></div>
      <p className="folio-hint">TURN A PAGE · FOLLOW A CURIOSITY{magnifier ? " · DRAG THE GLASS TO EXPLORE" : " · A SKETCHBOOK OF WORK & EVERYDAY THINGS"}</p>
      <a href="#about" className="folio-down" aria-label="Read about Tammana">↓</a>
    </section>
    <section className="folio-about folio-section" id="about"><span className="folio-section-label">ABOUT</span><div><h2>A little curiosity goes a long way.</h2><p>I’m Tammana, an educator, designer and curious maker based in London. I make thoughtful little experiences for learning, for everyday life, and sometimes just for the joy of it.</p><p>My work moves between teaching, design and code. This sketchbook is the other half of that: things made by hand, small experiments, and the everyday looked at a little more slowly.</p><p className="folio-about-links"><a href="/projects">Things I’ve made ↗</a><a href="/outside">Life beyond the screen ↗</a></p></div></section>
    <img className="folio-divider" src="/sketchbook/divider.png" alt="" loading="lazy"/>
    <section className="folio-plates folio-section" id="plates"><div><span className="folio-section-label">THE PLATES</span><p className="folio-index-note">Ideas, observations,<br/>and things made with care.</p></div><ol>{plates.map((item,index) => <li key={item.title}><button onClick={() => choose(index)} aria-current={page === index ? "true" : undefined}><span>{number(index)}</span><span>{item.title}</span><span>{item.category}</span><span aria-hidden="true">↗</span></button></li>)}</ol></section>
    <div id="photos"><CameraRoll /></div>
    <section className="folio-contact folio-section" id="contact"><span className="folio-section-label">A LITTLE HELLO</span><div><h2>The next page<br/>could start with you.</h2><p>Have an idea, a question, or something lovely to share?</p><a href="mailto:tammana4513@gmail.com">tammana4513@gmail.com ↗</a><img src="/sketchbook/bloom.png" alt="" loading="lazy"/></div></section>
    <footer className="folio-footer"><span>LONDON · A PERSONAL SKETCHBOOK · {new Date().getFullYear()}</span><a href="#top">BACK TO THE FIRST PAGE ↑</a></footer>
  </main>;
}
