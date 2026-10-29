"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { projects } from "./projects/data";
import "./diary-home.css";
import DiaryCover3D from "./diary-cover-3d";
import { HelloArtwork, HelloNote } from "./hello-journal";
import ProjectFolder from "./project-folder";
import { coverMessage } from "./diary-cover-copy";
import "./diary-cover-3d.css";

type Section = "about" | "projects" | "outside" | "hello";
/** cutout: shown as the object lifted out of its background (public/cutouts); otherwise a borderless print. */
type Photo = { file: string; title: string; note: string; category: string; cutout?: boolean };
type Leaf = { kind: string; section: Section; title?: [string, string]; photo?: Photo; images?: Photo[] };
const photos: Photo[] = [
  { file: "regents-canal.jpg", title: "The long way home", note: "A little frame from Regent’s Canal, London. Water, trees, and an excuse to take the slower route.", category: "London wanderings" },
  { file: "embroidered-tote.jpg", title: "One stitch at a time", note: "Flowers embroidered on a tote bag. A different sort of making: thread, fabric, and a little patience.", category: "Made by hand", cutout: true },
  { file: "london-in-march.jpg", title: "London, on paper", note: "A collection of botanical sketches. Looking closely at the colours, shapes, and small details.", category: "From the sketchbook", cutout: true },
  { file: "cake-roll-sketch.jpg", title: "Something sweet", note: "A little study of a cake roll, strawberries and all. Some things are worth saving on paper.", category: "From the sketchbook", cutout: true },
  { file: "countryside-cows.jpg", title: "A little further afield", note: "Green fields, a wide sky, and a few curious neighbours. A frame from outside the city.", category: "Little adventures" },
  { file: "washing-line-sketch.jpg", title: "An ordinary afternoon", note: "Windows and a washing line, collected in ink. Everyday things make good subjects.", category: "From the sketchbook", cutout: true },
  { file: "scooter-sketch.jpg", title: "Parked for a moment", note: "A colourful scooter, saved in a sketchbook. Drawing makes a passing detail into something you remember.", category: "From the sketchbook", cutout: true },
  { file: "barbican-pond.jpg", title: "An afternoon at the Barbican", note: "Waterlilies, water, and a little moment in the city. A photograph from the camera roll.", category: "London wanderings" },
  { file: "dog-eared-books.jpg", title: "A bookshop on the corner", note: "Dog Eared Books in San Francisco: a painted corner shop with a crate of free books by the door. Impossible to walk past.", category: "Further from home", cutout: true },
  { file: "new-york-from-above.jpg", title: "New York, from above", note: "Rooftops, water towers and the river beyond, from the top of the Empire State Building. From up here, even New York looks quiet.", category: "Further from home" },
  { file: "window-seat-sunset.jpg", title: "Between two places", note: "A thin line of sunset from a plane window, and towns switching on their lights below. Always worth the window seat.", category: "Further from home" },
  { file: "golden-cacti.jpg", title: "Soft, from a distance", note: "Golden cacti leaning into the afternoon light. They look soft enough to touch. They are not.", category: "Things that grow", cutout: true },
  { file: "red-branches.jpg", title: "Branches like ink", note: "Twisting red branches on a walk, smooth and almost painted. The kind of tree that makes you stop and look up.", category: "Things that grow" },
];
// Each gallery is one journal page; keep an even number so every photo and its note share a spread.
const galleries: { title: [string, string]; images: Photo[] }[] = [
  { title: ["Outside", "the internet."], images: photos.slice(0, 4) },
  { title: ["The lovely bits", "in between."], images: photos.slice(4, 8) },
  { title: ["Somewhere", "further away."], images: photos.slice(8, 11) },
  { title: ["Things that grow,", "somewhere new."], images: photos.slice(11) },
];
const menu: { id: Section; label: string }[] = [{ id: "about", label: "about" }, { id: "projects", label: "projects" }, { id: "outside", label: "outside" }, { id: "hello", label: "contact" }];
const tabs: { id: Section; title: string; short: string }[] = [
  { id: "about", title: "about me", short: "about me" }, { id: "projects", title: "projects", short: "projects" }, { id: "outside", title: "outside the internet", short: "outside" }, { id: "hello", title: "hello", short: "hello" },
];
function makeBook() {
  // Projects live in their own folder view, not in the page sequence.
  const leaves: Leaf[] = [{ kind: "collage", section: "about" }, { kind: "about", section: "about" }, { kind: "favourites-cups", section: "about" }, { kind: "favourites-shelf", section: "about" }];
  const outsideStart = leaves.length;
  // Where each photo's spread starts, and the gallery page to return to from it.
  const photoStarts: Record<string, number> = {}, photoHomes: Record<string, number> = {};
  for (const gallery of galleries) {
    for (const photo of gallery.images) photoHomes[photo.file] = leaves.length;
    leaves.push({ kind: "gallery", section: "outside", images: gallery.images, title: gallery.title });
  }
  for (const photo of photos) {
    photoStarts[photo.file] = leaves.length;
    leaves.push({ kind: "photo", section: "outside", photo }, { kind: "photo-note", section: "outside", photo });
  }
  const helloStart = leaves.length;
  leaves.push({ kind: "hello-art", section: "hello" }, { kind: "hello", section: "hello" });
  return { leaves, photoStarts, photoHomes, starts: { about: 0, outside: outsideStart, hello: helloStart } };
}
const book = makeBook();

function Daisy({ className = "" }: { className?: string }) {
  return <svg className={`dy-daisy ${className}`} viewBox="0 0 100 100" aria-hidden="true"><g fill="#faf0d6" stroke="#d6c5a0" strokeWidth=".7">{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx="50" cy="27" rx="9" ry="21" transform={`rotate(${i * 40} 50 50)`}/>)}</g><circle cx="50" cy="50" r="12" fill="#b99a48"/><circle cx="48" cy="48" r="7" fill="#d7bc69"/><g fill="#93813f"><circle cx="46" cy="46" r="1"/><circle cx="53" cy="49" r="1"/><circle cx="49" cy="54" r="1"/></g></svg>;
}
function Butterfly() {
  return <svg className="dy-butterfly" viewBox="0 0 100 80" aria-hidden="true"><g className="dy-wing"><path d="M49 44C30 0 1 1 9 28c2 9 11 15 21 18C4 47 21 79 47 51Z" fill="#b3bdca" stroke="#4e555c" strokeWidth="2"/><path d="m46 42-23-24m23 29L29 60" stroke="#7a8c9a"/><path d="m16 16 7 5m-8 9 7 3m2 23 7 2" stroke="#f7ead6" strokeWidth="3"/></g><g className="dy-wing dy-wing-right"><path d="M51 44C70 0 99 1 91 28c-2 9-11 15-21 18 26 1 9 33-17 5Z" fill="#b3bdca" stroke="#4e555c" strokeWidth="2"/><path d="m54 42 23-24M54 47l17 13" stroke="#7a8c9a"/><path d="m84 16-7 5m8 9-7 3m-2 23-7 2" stroke="#f7ead6" strokeWidth="3"/></g><path d="M50 34v24m-1-23-5-8m7 8 5-8" stroke="#424238" strokeWidth="3" strokeLinecap="round"/></svg>;
}
function LaceBow() {
  return <svg className="dy-lace-bow" viewBox="0 0 260 210" aria-hidden="true"><defs><pattern id="diary-lace" width="12" height="12" patternUnits="userSpaceOnUse"><path d="m0 6 6-6 6 6-6 6ZM0 6h12M6 0v12" fill="none" stroke="#f4ead8" strokeWidth=".8"/><circle cx="6" cy="6" r="2" fill="#fbf4e3"/></pattern></defs><g fill="url(#diary-lace)" stroke="#e6ddca" strokeWidth="2"><path d="M128 88C95 16 25 9 23 46 20 78 75 107 128 98c-35 17-48 54-58 101l42-20c0-35 9-58 24-78Z"/><path d="M135 88c22-72 91-80 102-49 13 36-45 65-102 59 38 22 65 47 76 87l-46-15c-9-31-19-54-35-69Z"/></g><path d="M124 78c5-4 15-4 18 0l-2 25c-5 4-12 4-16 0Z" fill="#e5ddce" stroke="#fff7e6"/><path d="M39 43c25-9 52 6 73 34M223 42c-23-8-52 7-72 34" stroke="#fff9ee" strokeWidth="2" fill="none" opacity=".7"/></svg>;
}
function LuckyStar() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  function down(event: PointerEvent<HTMLButtonElement>) { event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }; }
  return <button className="dy-lucky-star" title="A little good luck. Drag me!" aria-label="Move the lucky star. Drag or use arrow keys; Home resets it." style={{ translate: `${offset.x}px ${offset.y}px` }} onPointerDown={down} onPointerMove={e => {
    if (drag.current) setOffset({ x: Math.max(-80, Math.min(80, drag.current.ox + e.clientX - drag.current.x)), y: Math.max(-100, Math.min(80, drag.current.oy + e.clientY - drag.current.y)) });
  }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onKeyDown={e => {
    const directions: Record<string, [number, number]> = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
    if (e.key === "Home") { e.preventDefault(); setOffset({ x: 0, y: 0 }); }
    if (directions[e.key]) { e.preventDefault(); const [x, y] = directions[e.key]; setOffset(p => ({ x: Math.max(-80, Math.min(80, p.x + x)), y: Math.max(-100, Math.min(80, p.y + y)) })); }
  }}><svg viewBox="0 0 100 100" aria-hidden="true"><path d="m50 3 12 31 34 2-27 22 8 34-28-19-28 19 8-34L3 36l34-2Z" fill="#b79a51" stroke="#f5e5ae" strokeWidth="5"/><path d="m50 15 8 25 26 1-21 16 7 25-21-15-21 15 7-25-20-16 26-1Z" fill="none" stroke="#947635"/></svg></button>;
}
function photoSrc(photo: Photo) {
  return photo.cutout ? `/cutouts/${photo.file.replace(/\.jpg$/, ".webp")}` : `/visual-diary/${photo.file}`;
}
function PhotoScrap({ photo, className = "", onClick }: { photo: Photo; className?: string; onClick: () => void }) {
  return <button className={`dy-polaroid ${photo.cutout ? "dy-cut" : "dy-paper"} ${className}`} onClick={onClick}>{!photo.cutout && <span className="dy-tape"/>}<img src={photoSrc(photo)} alt={photo.title} draggable={false}/></button>;
}
/** Favourite things, taped onto the about pages like scraps. */
function Scrap({ name, alt, className }: { name: string; alt: string; className: string }) {
  return <figure className={`dy-scrap dy-cut ${className}`}><img src={`/cutouts/${name}.webp`} alt={alt} draggable={false} loading="lazy"/></figure>;
}
function CoffeeRing({ n, className }: { n: 1 | 2 | 3; className: string }) {
  return <img className={`dy-coffee-ring ${className}`} src={`/about-me/coffee-ring-${n}.jpg`} alt="" aria-hidden="true" draggable={false}/>;
}
/** Photo-booth strip on the about page. Add photos (kept in /public/about/) and it appears; while empty it stays hidden. */
const portraits: { src: string; alt: string }[] = [];
function PhotoStrip() {
  if (!portraits.length) return null;
  return <figure className="dy-photo-strip"><span className="dy-tape" aria-hidden="true"/>{portraits.map(photo => <img key={photo.src} src={photo.src} alt={photo.alt} draggable={false}/>)}</figure>;
}
/** A paper iPod that plays the Daily Café room: the same public-domain recordings the café itself uses. */
function CafeIpod({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return <div className={`dy-ipod ${playing ? 'dy-ipod-on' : ''}`}>
    <span className="dy-tape" aria-hidden="true"/>
    <div className="dy-ipod-body">
      <div className="dy-ipod-screen" aria-hidden="true"><b>Daily Café</b><span>{playing ? 'now playing: the café' : 'a room for quiet days'}</span><i className="dy-ipod-bars"><i/><i/><i/><i/><i/></i></div>
      <button className="dy-ipod-wheel" onClick={onToggle} aria-pressed={playing} aria-label={playing ? 'Pause the café sounds' : 'Play café sounds from Daily Café'}><span aria-hidden="true">MENU</span><b aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</b></button>
    </div>
    <span className="dy-hand dy-ipod-note">{playing ? 'the café is open ♡' : 'press play for café sounds'}</span>
  </div>;
}

export default function DiaryHome() {
  const [open, setOpen] = useState(false);
  const [coverReady, setCoverReady] = useState(false);
  const [leaf, setLeaf] = useState(0);
  const [single, setSingle] = useState(false);
  const [motion, setMotion] = useState(true);
  const [turn, setTurn] = useState<{ direction: number; old: number } | null>(null);
  const [message, setMessage] = useState("");
  const [folder, setFolder] = useState(false);
  const [project, setProject] = useState(0);
  const [cafeOn, setCafeOn] = useState(false);
  const cafe = useRef<{ room: HTMLAudioElement; barista: HTMLAudioElement; timer?: ReturnType<typeof setTimeout> } | null>(null);
  const folderRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mobile = matchMedia("(max-width: 700px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => { setSingle(mobile.matches); setLeaf(n => mobile.matches ? n : n - n % 2); };
    const reduce = () => setMotion(!reduced.matches);
    resize(); reduce(); mobile.addEventListener("change", resize); reduced.addEventListener("change", reduce);
    const restoreSection = () => {
      const [section, slug] = window.location.hash.slice(1).split("/") as [Section, string?];
      if (section === "projects") {
        const index = projects.findIndex(p => p.id === slug);
        if (index >= 0) setProject(index);
        setFolder(true); setOpen(true);
      } else if (tabs.some(tab => tab.id === section)) {
        setFolder(false); setLeaf(book.starts[section]); setOpen(true);
      }
    };
    restoreSection();
    window.addEventListener("hashchange", restoreSection);
    return () => { window.removeEventListener("hashchange", restoreSection); mobile.removeEventListener("change", resize); reduced.removeEventListener("change", reduce); if (timer.current) clearTimeout(timer.current); };
  }, []);
  // Open the journal by itself shortly after arriving, unless the visitor has already clicked, typed or scrolled.
  useEffect(() => {
    if (window.location.hash.length > 1) return;
    const events = ["pointerdown", "keydown", "wheel", "touchstart"];
    const cancel = () => { clearTimeout(autoOpen); events.forEach(name => removeEventListener(name, cancel)); };
    const autoOpen = setTimeout(() => { cancel(); setLeaf(0); setFolder(false); setOpen(true); }, 2600);
    events.forEach(name => addEventListener(name, cancel, { passive: true }));
    return cancel;
  }, []);
  useEffect(() => () => { const c = cafe.current; if (c) { clearTimeout(c.timer); c.room.pause(); c.barista.pause(); } }, []);
  function go(next: number) {
    const target = Math.max(0, Math.min(book.leaves.length - (single ? 1 : 2), single ? next : next - next % 2));
    if (target === leaf || turn) return;
    if (motion) {
      setTurn({ direction: target > leaf ? 1 : -1, old: leaf });
      timer.current = setTimeout(() => setTurn(null), 700);
    }
    setLeaf(target); setMessage("");
  }
  function jump(section: Section) {
    history.replaceState(null, "", section === "projects" ? `#projects/${projects[project].id}` : `#${section}`);
    if (section === "projects") {
      setFolder(true); setMessage("");
      setTimeout(() => folderRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus(), motion ? 900 : 0);
    } else if (folder) {
      setFolder(false); setLeaf(single ? book.starts[section] : book.starts[section] - book.starts[section] % 2);
      setTimeout(() => bookRef.current?.focus(), motion ? 700 : 0);
    } else go(book.starts[section]);
  }
  function pickProject(index: number) {
    const next = Math.max(0, Math.min(projects.length - 1, index));
    setProject(next); history.replaceState(null, "", `#projects/${projects[next].id}`);
  }
  function openAt(section: Section) {
    history.replaceState(null, "", section === "projects" ? `#projects/${projects[project].id}` : `#${section}`);
    setFolder(section === "projects");
    if (section !== "projects") setLeaf(single ? book.starts[section] : book.starts[section] - book.starts[section] % 2);
    setOpen(true);
  }
  function pauseCafe() {
    const c = cafe.current;
    if (!c) return;
    clearTimeout(c.timer); c.room.pause(); c.barista.pause(); setCafeOn(false);
  }
  function toggleCafe() {
    if (cafeOn) { pauseCafe(); setMessage("Café sounds paused."); return; }
    if (!cafe.current) {
      const room = new Audio("/audio/cafe-room.m4a"), barista = new Audio("/audio/cafe-barista.m4a");
      room.loop = barista.loop = true;
      cafe.current = { room, barista };
    }
    const c = cafe.current;
    // As in the café itself, the room comes first and the espresso machine joins a few seconds later.
    c.room.play().then(() => {
      setCafeOn(true); setMessage("Café sounds playing.");
      c.timer = setTimeout(() => { c.barista.play().catch(() => {}); }, 5000);
    }).catch(() => setMessage("The café sounds couldn’t start in this browser."));
  }
  function closeJournal() { setOpen(false); setFolder(false); pauseCafe(); }
  function flip(direction: number) { go(leaf + direction * (single ? 1 : 2)); }
  const currentSection = folder ? "projects" : book.leaves[leaf].section;
  const sectionTabs = <nav className="dy-tabs" aria-label="Journal sections">{tabs.map(tab => <button key={tab.id} className={`dy-tab dy-tab-${tab.id}`} aria-label={tab.title} aria-current={currentSection === tab.id ? 'page' : undefined} onClick={() => jump(tab.id)}><span className="dy-tab-long">{tab.title}</span><span className="dy-tab-short">{tab.short}</span></button>)}</nav>;
  const visibleLeaves = single ? [leaf] : [leaf, leaf + 1];
  const canPrev = leaf > 0;
  const canNext = leaf + (single ? 1 : 2) < book.leaves.length;

  function content(page: Leaf): ReactNode {
    switch (page.kind) {
      case "collage": return <div className="dy-collage"><CoffeeRing n={2} className="dy-ring-collage"/><p className="dy-hand dy-collage-heading">a little bit of everything, a little bit of me</p><PhotoScrap photo={photos[0]} className="dy-canal" onClick={() => go(book.photoStarts[photos[0].file])}/><PhotoScrap photo={photos[1]} className="dy-embroidery" onClick={() => go(book.photoStarts[photos[1].file])}/><CafeIpod playing={cafeOn} onToggle={toggleCafe}/><PhotoScrap photo={photos[6]} className="dy-sketch" onClick={() => go(book.photoStarts[photos[6].file])}/><img className="dy-botanical" src="/sketchbook/bloom.png" alt=""/><div className="dy-flying"><Butterfly/></div><LuckyStar/><span className="dy-round-stamp" aria-hidden="true">COLLECT LITTLE<br/><b>✿</b><br/>MOMENTS</span><span className="dy-hand dy-collage-bottom">making room for a little wonder.</span></div>;
      case "about": return <div className="dy-about dy-page-content"><CoffeeRing n={3} className="dy-ring-about"/><Scrap name="chai" alt="Chai being poured through a strainer into two small glasses" className="dy-scrap-about-chai"/><Scrap name="plants" alt="Trailing houseplants spilling over a wooden cabinet" className="dy-scrap-about-plants"/><p className="dy-eyebrow">THE PERSON BETWEEN THE PAGES</p><PhotoStrip/><p className="dy-hand dy-red dy-oh">Oh, hello. I’m</p><h1>Tammana<span>Kapoor.</span></h1><p className="dy-about-role">EDUCATOR · DESIGNER · CURIOUS MAKER</p><p>I’m a London-based educator, designer, and curious maker. I make thoughtful digital experiences, collect little moments, and learn by doing.</p><p>Away from the screen: sketchbooks, embroidery, and the long way home.</p><div className="dy-lately"><span className="dy-tape"/><p className="dy-hand">On my desk lately…</p><ul><li><a className="dy-lately-project" href="/projects/fieldnotes">Fieldnotes: finding familiar trees. ↗</a></li><li>Daily Café: a room for quiet days.</li><li>FloraQuest: a game for the plant-curious.</li><li>Chemistry, made visible.</li></ul></div><p className="dy-hand dy-about-signoff">Many interests. All me. ♡</p></div>;
      case "favourites-cups": return <div className="dy-favourites dy-favourites-cups"><CoffeeRing n={1} className="dy-ring-a"/><p className="dy-eyebrow">LITTLE THINGS, OFTEN</p><h2>A few of my<br/><em>favourite things.</em></h2><Scrap name="pour-over" alt="Coffee dripping slowly through a glass pour-over" className="dy-scrap-pourover"/><Scrap name="iced-coffee" alt="A tall glass of frothy iced coffee in the sun" className="dy-scrap-iced"/><Scrap name="chai" alt="Chai being poured through a strainer into two small glasses" className="dy-scrap-chai dy-phone-only"/><p className="dy-hand dy-favourites-note">most good ideas start with a warm cup.</p></div>;
      case "favourites-shelf": return <div className="dy-favourites dy-favourites-shelf"><CoffeeRing n={2} className="dy-ring-b"/><CoffeeRing n={3} className="dy-ring-c"/><p className="dy-eyebrow">AND THE THINGS AROUND ME</p><Scrap name="books" alt="A tall, slightly wobbly stack of paperbacks" className="dy-scrap-books"/><Scrap name="earphones" alt="Tangled wired earphones on a wooden table" className="dy-scrap-earphones"/><Scrap name="plants" alt="Trailing houseplants spilling over a wooden cabinet" className="dy-scrap-plants dy-phone-only"/><p className="dy-hand dy-favourites-note">small things that make a place feel like mine.</p></div>;
      case "gallery": return <div className="dy-page-content dy-gallery"><p className="dy-eyebrow">WALKS / SKETCHES / THINGS MADE SLOWLY</p><h2>{page.title?.[0]}<br/><em>{page.title?.[1]}</em></h2><div className={`dy-gallery-grid dy-gallery-${page.images?.length}`}>{page.images?.map((photo, i) => <PhotoScrap key={photo.file} photo={photo} onClick={() => go(book.photoStarts[photo.file])} className={`dy-gallery-photo dy-photo-${i}`}/>)}</div></div>;
      case "photo": return page.photo && <div className="dy-photo-leaf"><figure className={page.photo.cutout ? "dy-cut" : "dy-paper"}>{!page.photo.cutout && <span className="dy-tape"/>}<img src={photoSrc(page.photo)} alt={page.photo.title}/></figure><Daisy/></div>;
      case "photo-note": return page.photo && <div className="dy-page-content dy-photo-note"><p className="dy-eyebrow">{page.photo.category}</p><h2>{page.photo.title}<em>.</em></h2><p className="dy-hand dy-photo-words">{page.photo.note}</p><p>From my camera roll & sketchbook.<br/>An ordinary thing, worth keeping.</p><button className="dy-text-link" onClick={() => page.photo && go(book.photoHomes[page.photo.file])}>Back to the collection <span>↶</span></button><div className="dy-flying dy-photo-butterfly"><Butterfly/></div></div>;
      case "hello-art": return <HelloArtwork onRead={() => { if (single) go(book.starts.hello + 1); else document.getElementById('hello-email')?.focus(); }}/>;
      case "hello": return <HelloNote onCopy={async () => { try { await navigator.clipboard.writeText('tammana4513@gmail.com'); setMessage('Email address copied.'); } catch { setMessage('You can write to tammana4513@gmail.com.'); } }}/>;
      default: return null;
    }
  }

  return <main className={`diary-app ${open ? 'dy-open' : 'dy-closed'} ${open && folder ? 'dy-folder-view' : ''} ${motion ? '' : 'dy-still'} ${single ? 'dy-single' : ''} ${coverReady ? 'dy-has-3d' : ''}`}>
    <div className="dy-table-texture" aria-hidden="true"/>
    <header className="dy-room-header"><span>TAMMANA KAPOOR <i>✳</i> <span className="dy-brand-sub">A PERSONAL JOURNAL</span></span><nav className="dy-menu" aria-label="Main menu">{menu.map(item => <button key={item.id} aria-current={open && currentSection === item.id ? 'page' : undefined} onClick={() => open ? jump(item.id) : openAt(item.id)}>{item.label}<svg viewBox="0 0 120 50" aria-hidden="true" preserveAspectRatio="none"><path pathLength={1} d="M64 6C30 3 5 13 6 26c1 15 37 20 64 18 28-2 47-10 45-22C113 9 82 4 48 8"/></svg></button>)}</nav><button onClick={() => { if (open) { closeJournal(); return; } setLeaf(0); setOpen(true); setTimeout(() => bookRef.current?.focus(), motion ? 1100 : 0); }}>{open ? '↶ Close the journal' : 'A little world, waiting to be opened'}</button></header>
    <div className="dy-scene">
      <div className="dy-desk-note" aria-hidden="true"><p className="dy-hand">For all the little things<br/>that turn out to be<br/><em>the big things.</em></p><span>♡</span></div>
      <div className="dy-open-book" ref={bookRef} tabIndex={open ? 0 : -1} role="region" aria-label="Tammana’s journal. Use left and right arrow keys to turn pages." aria-hidden={!open || folder} inert={!open || folder} onKeyDown={e => { if ((e.target as HTMLElement).closest('input,textarea,select,button,a')) return; if (e.key === 'ArrowRight') { e.preventDefault(); flip(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); flip(-1); } if (e.key === 'Escape') closeJournal(); }} onTouchStart={e => { if ((e.target as HTMLElement).closest('input,textarea,select,button,a')) return; swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={e => { if (!swipe.current) return; const x = e.changedTouches[0].clientX - swipe.current.x; const y = e.changedTouches[0].clientY - swipe.current.y; if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.5) flip(x < 0 ? 1 : -1); swipe.current = null; }}>
        <div className="dy-leather-base" aria-hidden="true"/><div className="dy-paper-stack" aria-hidden="true"/>
        <div className="dy-spread" aria-live="polite" aria-atomic="false">{visibleLeaves.map((index, side) => <article key={index} className={`dy-leaf dy-leaf-${side === 0 ? 'left' : 'right'} dy-kind-${book.leaves[index].kind}`} aria-label={`Page ${index + 1}: ${book.leaves[index].section}`}><div className="dy-leaf-inner">{content(book.leaves[index])}</div><span className="dy-page-no">{String(index + 1).padStart(2, '0')}</span></article>)}</div>
        <div className="dy-binding" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <span key={i} style={{ '--ring': i } as CSSProperties}><i/><b/></span>)}</div>
        {turn && <div className={`dy-turning-leaf ${turn.direction < 0 ? 'dy-turn-back' : ''}`} key={`${turn.old}-${leaf}`} aria-hidden="true"><div className="dy-leaf dy-turn-face" inert>{content(book.leaves[turn.old + (turn.direction > 0 && !single ? 1 : 0)])}</div><span className="dy-turn-mark">{String(leaf + 1).padStart(2, '0')}</span></div>}
        {!folder && sectionTabs}
        <div className="dy-ribbon" aria-hidden="true"/>
      </div>
      <ProjectFolder projects={projects} active={project} shown={open && folder} onSelect={pickProject} folderRef={folderRef} onKeyDown={e => { if ((e.target as HTMLElement).closest('a,button:not(.dy-divider)')) return; if (e.key === 'ArrowRight') { e.preventDefault(); pickProject(project + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); pickProject(project - 1); } if (e.key === 'Escape') closeJournal(); }} onTouchStart={e => { if ((e.target as HTMLElement).closest('a,button')) return; swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={e => { if (!swipe.current) return; const x = e.changedTouches[0].clientX - swipe.current.x; const y = e.changedTouches[0].clientY - swipe.current.y; if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.5) pickProject(project + (x < 0 ? 1 : -1)); swipe.current = null; }}>{folder && sectionTabs}</ProjectFolder>
      <DiaryCover3D open={open} motion={motion} onReady={setCoverReady} onOpen={() => { setLeaf(0); setFolder(false); setOpen(true); setTimeout(() => bookRef.current?.focus(), motion ? 1250 : 0); }}/>
      <div className="dy-cover-wrap" aria-hidden={open || coverReady} inert={open || coverReady}>
        <button className="dy-cover" onClick={() => { setLeaf(0); setFolder(false); setOpen(true); setTimeout(() => bookRef.current?.focus(), motion ? 1100 : 0); }} aria-label="Open Tammana’s journal">
          <span className="dy-cover-stitch"/><span className="dy-cover-spine"/>
          <span className="dy-cover-photo-strip"><img src="/visual-diary/regents-canal.jpg" alt=""/><img src="/visual-diary/embroidered-tote.jpg" alt=""/><img src="/visual-diary/scooter-sketch.jpg" alt=""/></span>
          <LaceBow/>
          <span className="dy-cover-handwritten"><img src="/journal-3d/handwritten-note.jpg" alt={coverMessage}/></span>
          <span className="dy-cover-band"/><span className="dy-cover-clasp"><i/></span>
          <span className="dy-charm-chain"/><span className="dy-cover-charms"><span className="dy-charm-star">✧</span><span className="dy-pearl"/><span className="dy-charm-heart">♡</span></span>
          <svg className="dy-stitched-heart" viewBox="0 0 100 90" aria-hidden="true"><path d="M50 78C14 54 1 30 15 15 29 0 46 12 50 23c4-11 21-23 35-8 14 15 1 39-35 63Z" stroke="#d5bb86" strokeWidth="2.5" strokeDasharray="5 3" fill="none"/></svg>
          <img className="dy-cover-signature" src="/journal-3d/stitched-name.svg" alt="Tammana, cursive cross stitch in silver"/>
          <span className="dy-cover-corner"/>
        </button>
        <p className="dy-open-invitation"><span className="dy-hand">a little curiosity goes a long way</span><span>CLICK THE JOURNAL TO OPEN <i>↗</i></span></p>
      </div>
      {open && folder && <div className="dy-book-controls"><button className="dy-page-arrow" onClick={() => pickProject(project - 1)} disabled={project === 0} aria-label="Previous project">←</button><span className="dy-control-label">projects<small>{String(project + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</small></span><button className="dy-page-arrow" onClick={() => pickProject(project + 1)} disabled={project === projects.length - 1} aria-label="Next project">→</button></div>}
      {open && !folder && <div className="dy-book-controls"><button className="dy-page-arrow" onClick={() => flip(-1)} disabled={!canPrev || !!turn} aria-label="Previous journal spread">←</button><span className="dy-control-label">{tabs.find(t => t.id === currentSection)?.title}<small>{single ? `${String(leaf + 1).padStart(2, '0')}` : `${String(leaf + 1).padStart(2, '0')} — ${String(leaf + 2).padStart(2, '0')}`} / {book.leaves.length}</small></span><button className="dy-page-arrow" onClick={() => flip(1)} disabled={!canNext || !!turn} aria-label="Next journal spread">→</button></div>}
    </div>
    <footer className="dy-room-footer"><span>{open && folder ? 'PICK A TAB. OPEN A LITTLE PROJECT.' : open ? single ? 'SWIPE OR TAP TO TURN A PAGE' : 'TURN A PAGE. FOLLOW A LITTLE CURIOSITY.' : 'LONDON & WHEREVER CURIOSITY GOES'}</span><div className="dy-status-message" role="status">{message}</div>{cafeOn && <button className="dy-cafe-playing" onClick={toggleCafe}>♪ café sounds <span>· pause</span></button>}<button className="dy-motion" onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? 'Ⅱ Pause the little movements' : '▷ Let things move'}</button></footer>
  </main>;
}
