"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { projects } from "./projects/data";
import type { Project } from "./projects/data";
import "./diary-home.css";

type Section = "about" | "projects" | "outside" | "hello" | "pages";
type Photo = { file: string; title: string; note: string; category: string };
type Entry = { id: string; title: string; text: string; category: string; date: string; image?: string };
type Leaf = { kind: string; section: Section; title?: string; text?: string; project?: Project; photo?: Photo; images?: Photo[]; detail?: number };
const photos: Photo[] = [
  { file: "regents-canal.jpg", title: "The long way home", note: "A little frame from Regent’s Canal, London. Water, trees, and an excuse to take the slower route.", category: "London wanderings" },
  { file: "embroidered-tote.jpg", title: "One stitch at a time", note: "Flowers embroidered on a tote bag. A different sort of making: thread, fabric, and a little patience.", category: "Made by hand" },
  { file: "london-in-march.jpg", title: "London, on paper", note: "A collection of botanical sketches. Looking closely at the colours, shapes, and small details.", category: "From the sketchbook" },
  { file: "cake-roll-sketch.jpg", title: "Something sweet", note: "A little study of a cake roll, strawberries and all. Some things are worth saving on paper.", category: "From the sketchbook" },
  { file: "countryside-cows.jpg", title: "A little further afield", note: "Green fields, a wide sky, and a few curious neighbours. A frame from outside the city.", category: "Little adventures" },
  { file: "washing-line-sketch.jpg", title: "An ordinary afternoon", note: "Windows and a washing line, collected in ink. Everyday things make good subjects.", category: "From the sketchbook" },
  { file: "scooter-sketch.jpg", title: "Parked for a moment", note: "A colourful scooter, saved in a sketchbook. Drawing makes a passing detail into something you remember.", category: "From the sketchbook" },
  { file: "barbican-pond.jpg", title: "An afternoon at the Barbican", note: "Waterlilies, water, and a little moment in the city. A photograph from the camera roll.", category: "London wanderings" },
];
const prompts = ["What’s one small thing you want to remember?", "What caught your eye on your last walk?", "What are you curious about right now?", "What did you make, try, or learn today?", "What felt like a little bit of joy?"];
const tabs: { id: Section; title: string; short: string }[] = [
  { id: "about", title: "about me", short: "about me" }, { id: "projects", title: "projects", short: "projects" }, { id: "outside", title: "outside the internet", short: "outside" }, { id: "hello", title: "hello", short: "hello" }, { id: "pages", title: "my pages", short: "my pages" },
];
const entryKey = "tammana-journal-entries-v1";
const draftKey = "tammana-journal-draft-v1";

/** Keep long stories inside the book by splitting them into actual leaves. */
function paginate(text: string, budget = 85) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += budget) chunks.push(words.slice(i, i + budget).join(" "));
  return chunks.length ? chunks : [""];
}
function makeBook() {
  const leaves: Leaf[] = [{ kind: "collage", section: "about" }, { kind: "about", section: "about" }, { kind: "project-index", section: "projects" }, { kind: "project-intro", section: "projects" }];
  const projectStarts: Record<string, number> = {};
  const projectStories: Record<string, number> = {};
  for (const project of projects) {
    projectStarts[project.id] = leaves.length;
    leaves.push({ kind: "project-cover", section: "projects", project }, { kind: "project-overview", section: "projects", project });
    projectStories[project.id] = leaves.length;
    const blocks = [{ title: "The idea", text: [project.idea] }, ...project.chapters, { title: "What I learned", text: project.learned }];
    for (const block of blocks) {
      const chunks = paginate(block.text.join("\n\n"), 60);
      chunks.forEach((text, i) => leaves.push({ kind: "story", section: "projects", project, title: block.title, text, detail: i }));
    }
    if (leaves.length % 2) leaves.push({ kind: "project-end", section: "projects", project });
  }
  const outsideStart = leaves.length;
  leaves.push({ kind: "gallery", section: "outside", images: photos.slice(0, 4), title: "Outside the internet." }, { kind: "gallery", section: "outside", images: photos.slice(4), title: "The lovely bits in between." });
  const photoStarts: Record<string, number> = {};
  for (const photo of photos) {
    photoStarts[photo.file] = leaves.length;
    leaves.push({ kind: "photo", section: "outside", photo }, { kind: "photo-note", section: "outside", photo });
  }
  const helloStart = leaves.length;
  leaves.push({ kind: "hello-art", section: "hello" }, { kind: "hello", section: "hello" });
  const pagesStart = leaves.length;
  leaves.push({ kind: "prompts", section: "pages" }, { kind: "write", section: "pages" });
  return { leaves, projectStarts, projectStories, photoStarts, starts: { about: 0, projects: 2, outside: outsideStart, hello: helloStart, pages: pagesStart } };
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
function PhotoScrap({ photo, className = "", onClick, label }: { photo: Photo; className?: string; onClick: () => void; label?: string }) {
  return <button className={`dy-polaroid ${className}`} onClick={onClick}><span className="dy-tape"/><img src={`/visual-diary/${photo.file}`} alt={photo.title} draggable={false}/><span>{label || photo.title}</span></button>;
}

export default function DiaryHome() {
  const [open, setOpen] = useState(false);
  const [leaf, setLeaf] = useState(0);
  const [single, setSingle] = useState(false);
  const [motion, setMotion] = useState(true);
  const [turn, setTurn] = useState<{ direction: number; old: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");
  const [category, setCategory] = useState("Little moments");
  const [entryImage, setEntryImage] = useState("");
  const [prompt, setPrompt] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [entryPage, setEntryPage] = useState(0);
  const [entryListPage, setEntryListPage] = useState(0);
  const [deleted, setDeleted] = useState<Entry | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const selectedChunks = useMemo(() => paginate(selectedEntry?.text || "", 42), [selectedEntry]);

  useEffect(() => {
    const mobile = matchMedia("(max-width: 700px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => { setSingle(mobile.matches); setLeaf(n => mobile.matches ? n : n - n % 2); };
    const reduce = () => setMotion(!reduced.matches);
    resize(); reduce(); mobile.addEventListener("change", resize); reduced.addEventListener("change", reduce);
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(entryKey) || "[]");
      if (Array.isArray(saved)) setEntries(saved.filter((e): e is Entry => e && typeof e.id === "string" && typeof e.title === "string" && typeof e.text === "string" && typeof e.date === "string" && typeof e.category === "string"));
      const draft = JSON.parse(localStorage.getItem(draftKey) || "null");
      if (draft && typeof draft.text === "string") { setWords(draft.text); setTitle(draft.title || ""); setCategory(draft.category || "Little moments"); setEntryImage(draft.image || ""); }
    } catch { setMessage("Browser storage isn’t available. Download a copy of anything you write."); }
    setReady(true);
    return () => { mobile.removeEventListener("change", resize); reduced.removeEventListener("change", reduce); if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(draftKey, JSON.stringify({ title, text: words, category, image: entryImage })); }
    catch { setMessage("Your draft couldn’t be saved in this browser. Download your words to keep them."); }
  }, [title, words, category, entryImage, ready]);

  function go(next: number) {
    const target = Math.max(0, Math.min(book.leaves.length - (single ? 1 : 2), single ? next : next - next % 2));
    if (target === leaf || turn) return;
    if (motion) {
      setTurn({ direction: target > leaf ? 1 : -1, old: leaf });
      timer.current = setTimeout(() => setTurn(null), 700);
    }
    setLeaf(target); setMessage("");
  }
  function jump(section: Section) { go(book.starts[section]); }
  function flip(direction: number) { go(leaf + direction * (single ? 1 : 2)); }
  function startWriting() { setSelectedEntry(null); setMessage(""); go(book.starts.pages + (single ? 1 : 0)); }
  function download(data: string, name: string, type = "text/plain") {
    const url = URL.createObjectURL(new Blob([data], { type })); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function save() {
    if (!words.trim() && !entryImage) { setMessage("A sentence or a photo is a perfectly good beginning."); return; }
    const entry = { id: crypto.randomUUID(), title: title.trim() || "A little moment", text: words.trim(), category, image: entryImage || undefined, date: new Date().toISOString() };
    const next = [entry, ...entries];
    try { localStorage.setItem(entryKey, JSON.stringify(next)); }
    catch { setMessage("Your browser is full. Download your words before closing the diary."); return; }
    setEntries(next); setTitle(""); setWords(""); setEntryImage(""); setSelectedEntry(entry); setEntryPage(0); setMessage("A little piece of today, kept.");
  }
  function keepEntries(next: Entry[]) {
    try { localStorage.setItem(entryKey, JSON.stringify(next)); setEntries(next); return true; }
    catch { setMessage("The browser couldn’t save that change. Please try again."); return false; }
  }
  const currentSection = book.leaves[leaf].section;
  const visibleLeaves = single ? [leaf] : [leaf, leaf + 1];
  const canPrev = leaf > 0;
  const canNext = leaf + (single ? 1 : 2) < book.leaves.length;
  function dateLabel(date: string) { return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }

  function content(page: Leaf): ReactNode {
    const project = page.project;
    switch (page.kind) {
      case "collage": return <div className="dy-collage"><p className="dy-hand dy-collage-heading">a little bit of everything, a little bit of me</p><PhotoScrap photo={photos[0]} className="dy-canal" onClick={() => go(book.photoStarts[photos[0].file])} label="taking the scenic route"/><PhotoScrap photo={photos[1]} className="dy-embroidery" onClick={() => go(book.photoStarts[photos[1].file])} label="one stitch at a time ♡"/><button className="dy-mini-project" onClick={() => go(book.projectStarts['daily-cafe'])}><span className="dy-tape"/><img src="/daily-cafe-cover.jpg" alt="The hand-drawn Daily Café"/><span>an idea, brought to life</span></button><PhotoScrap photo={photos[6]} className="dy-sketch" onClick={() => go(book.photoStarts[photos[6].file])} label="from the sketchbook"/><img className="dy-botanical" src="/sketchbook/bloom.png" alt=""/><div className="dy-flying"><Butterfly/></div><LuckyStar/><span className="dy-round-stamp" aria-hidden="true">COLLECT LITTLE<br/><b>✿</b><br/>MOMENTS</span><span className="dy-hand dy-collage-bottom">making room for a little wonder.</span></div>;
      case "about": return <div className="dy-about dy-page-content"><p className="dy-eyebrow">THE PERSON BETWEEN THE PAGES</p><p className="dy-hand dy-red dy-oh">Oh, hello. I’m</p><h1>Tammana<span>Kapoor.</span></h1><p className="dy-about-role">EDUCATOR · DESIGNER · CURIOUS MAKER</p><p>I’m a London-based educator, designer, and curious maker. I make thoughtful digital experiences, collect little moments, and learn by doing.</p><p>Away from the screen: sketchbooks, embroidery, and the long way home.</p><div className="dy-lately"><span className="dy-tape"/><p className="dy-hand">On my desk lately…</p><ul><li>Daily Café: a room for quiet days.</li><li>FloraQuest: a game for the plant-curious.</li><li>Chemistry, made visible.</li></ul></div><p className="dy-hand dy-about-signoff">Many interests. All me. ♡</p></div>;
      case "project-index": return <div className="dy-page-content dy-project-index"><p className="dy-eyebrow">THINGS MADE & IN THE MAKING</p><h2>A few little<br/><em>experiments.</em></h2><div className="dy-project-list">{projects.map((p, i) => <button key={p.id} onClick={() => go(book.projectStarts[p.id])}><img src={p.cover.src} alt={p.cover.alt}/><div><small>0{i + 1} / {p.tagList[0]}</small><h3>{p.title}</h3><span className="dy-hand">{p.cover.note}</span></div><span className="dy-list-arrow">↗</span></button>)}</div><span className="dy-hand dy-index-note">pick a little curiosity ↗</span></div>;
      case "project-intro": return <div className="dy-page-content dy-project-intro"><p className="dy-eyebrow">NOTES FROM A CURIOUS MIND</p><h2>What if<br/><em>I made<br/>a little…</em></h2><p>That’s usually where it starts. A question, an itch, an idea that won’t quite leave me alone.</p><p>These pages hold a few things I’ve designed and built, and the stories of how they changed along the way.</p><p className="dy-hand dy-red">Learning by making.<br/>Making as I go.</p><img className="dy-intro-bloom" src="/sketchbook/bloom.png" alt=""/></div>;
      case "project-cover": return project && <div className="dy-page-content dy-project-cover"><p className="dy-eyebrow">{project.number} / {project.tagList[0]}</p><figure><span className="dy-tape"/><img src={project.cover.src} alt={project.cover.alt}/><figcaption className="dy-hand">{project.cover.note}</figcaption></figure><h2>{project.title}</h2><span className="dy-status">{project.status}</span><Daisy/></div>;
      case "project-overview": return project && <div className="dy-page-content dy-project-overview"><p className="dy-eyebrow">THE SHORT STORY</p><h2>An idea,<br/><em>out in the world.</em></h2><p>{project.summary}</p><div className="dy-project-learnings"><p className="dy-hand dy-red">A little of what I learned</p><p>{project.learned[0]}</p></div><button className="dy-text-link" onClick={() => go(book.projectStories[project.id])}>Read the making-of <span>→</span></button><div className="dy-live-links">{project.links.slice(0, 4).map(link => <a href={link.href} key={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div><button className="dy-back" onClick={() => jump('projects')}>↶ Back to all projects</button></div>;
      case "story": return project && <div className="dy-page-content dy-story"><p className="dy-eyebrow">{project.title} / MAKING-OF</p><h2>{page.title}{!!page.detail && <span className="dy-continued">continued</span>}</h2><p className="dy-story-words">{page.text}</p><p className="dy-hand dy-story-foot">A little more on the next page →</p><button className="dy-back" onClick={() => go(book.projectStarts[project.id])}>↶ Back to the project</button></div>;
      case "project-end": return project && <div className="dy-page-content dy-project-end"><Daisy/><p className="dy-hand dy-red">And that’s the story so far.</p><h2>Still learning.<br/><em>Still making.</em></h2><p>{project.learned[project.learned.length - 1]}</p><button className="dy-text-link" onClick={() => jump('projects')}>Back to the little experiments ↶</button></div>;
      case "gallery": return <div className="dy-page-content dy-gallery"><p className="dy-eyebrow">WALKS / SKETCHES / THINGS MADE SLOWLY</p><h2>{page.title === "Outside the internet." ? <>Outside<br/><em>the internet.</em></> : <>The lovely bits<br/><em>in between.</em></>}</h2><div className="dy-gallery-grid">{page.images?.map((photo, i) => <PhotoScrap key={photo.file} photo={photo} onClick={() => go(book.photoStarts[photo.file])} className={`dy-gallery-photo dy-photo-${i}`}/>)}</div></div>;
      case "photo": return page.photo && <div className="dy-photo-leaf"><figure><span className="dy-tape"/><img src={`/visual-diary/${page.photo.file}`} alt={page.photo.title}/><figcaption className="dy-hand">{page.photo.title}</figcaption></figure><Daisy/></div>;
      case "photo-note": return page.photo && <div className="dy-page-content dy-photo-note"><p className="dy-eyebrow">{page.photo.category}</p><h2>{page.photo.title}<em>.</em></h2><p className="dy-hand dy-photo-words">{page.photo.note}</p><p>From my camera roll & sketchbook.<br/>An ordinary thing, worth keeping.</p><button className="dy-text-link" onClick={() => jump('outside')}>Back to the collection <span>↶</span></button><div className="dy-flying dy-photo-butterfly"><Butterfly/></div></div>;
      case "hello-art": return <div className="dy-hello-art"><div className="dy-envelope"><div className="dy-letter"><p className="dy-hand">Good things start<br/>with a little hello.</p><span>To: a fellow curious person</span><Daisy/></div><div className="dy-envelope-front"/><div className="dy-envelope-heart">♡</div></div><p className="dy-hand dy-envelope-caption">a note from my little corner of the world</p><img className="dy-hello-flower" src="/sketchbook/bloom.png" alt=""/></div>;
      case "hello": return <div className="dy-page-content dy-hello"><p className="dy-eyebrow">LEAVE A LITTLE HELLO</p><h2>So lovely<br/><em>to find<br/>you here.</em></h2><p>Have an idea, a question, or a little something you’d like to share?</p><p>I’d love to hear from you.</p><a className="dy-email" href="mailto:tammana4513@gmail.com">tammana4513@gmail.com ↗</a><button className="dy-back" onClick={async () => { try { await navigator.clipboard.writeText('tammana4513@gmail.com'); setMessage('Email address copied.'); } catch { setMessage('You can write to tammana4513@gmail.com.'); } }}>Copy email address</button><p className="dy-hand dy-red dy-hello-signoff">Until the next little adventure,<br/>Tammana ♡</p></div>;
      case "prompts": return <div className="dy-page-content dy-prompts"><p className="dy-eyebrow">A FEW PRIVATE PAGES, JUST FOR YOU</p><h2>Start with<br/><em>a little thing.</em></h2><div className="dy-prompt-note"><span className="dy-tape"/><p className="dy-hand">{prompts[prompt]}</p><button className="dy-back" onClick={() => setPrompt((prompt + 1) % prompts.length)}>⤨ Another thought</button></div><button className="dy-text-link" onClick={startWriting}>Write a little <span>→</span></button><div className="dy-saved-notes"><p className="dy-eyebrow">YOUR KEPT MOMENTS · {entries.length}</p>{entries.slice(entryListPage * 3, entryListPage * 3 + 3).map(entry => <button key={entry.id} onClick={() => { setSelectedEntry(entry); setEntryPage(0); if (single) go(book.starts.pages + 1); }}><span>{entry.title}</span><small>{dateLabel(entry.date)}</small><i>↗</i></button>)}{!entries.length && <p className="dy-empty-note">A sentence counts. A photo counts.<br/>Your collection can start today.</p>}{entries.length > 3 && <div className="dy-mini-pagination"><button aria-label="Previous saved entries" disabled={entryListPage === 0} onClick={() => setEntryListPage(entryListPage - 1)}>←</button><span>{entryListPage + 1}/{Math.ceil(entries.length / 3)}</span><button aria-label="Next saved entries" disabled={(entryListPage + 1) * 3 >= entries.length} onClick={() => setEntryListPage(entryListPage + 1)}>→</button></div>}</div>{entries.length > 0 && <button className="dy-back" onClick={() => download(JSON.stringify(entries, null, 2), 'my-journal.json', 'application/json')}>Download my journal ↓</button>}</div>;
      case "write": return selectedEntry ? <div className="dy-page-content dy-kept-entry"><p className="dy-eyebrow">YOUR PRIVATE PAGES / {selectedEntry.category}</p><h2>{selectedEntry.title}</h2><span className="dy-entry-date">{dateLabel(selectedEntry.date)}</span>{selectedEntry.image && entryPage === 0 ? <><img className="dy-entry-image" src={selectedEntry.image} alt="Your journal photograph"/><p className="dy-hand dy-entry-image-note">A little moment, kept.</p></> : <p className="dy-hand dy-entry-words">{selectedChunks[entryPage - (selectedEntry.image ? 1 : 0)] || ""}</p>}<div className="dy-mini-pagination"><button aria-label="Previous part of entry" disabled={entryPage === 0} onClick={() => setEntryPage(entryPage - 1)}>←</button><span>{entryPage + 1} / {selectedChunks.length + (selectedEntry.image ? 1 : 0)}</span><button aria-label="Next part of entry" disabled={entryPage + 1 >= selectedChunks.length + (selectedEntry.image ? 1 : 0)} onClick={() => setEntryPage(entryPage + 1)}>→</button></div><div className="dy-kept-actions"><button className="dy-text-link" onClick={() => { setSelectedEntry(null); setMessage(''); }}>Write a new little moment ↗</button><button className="dy-back" onClick={() => { const next = entries.filter(e => e.id !== selectedEntry.id); if (keepEntries(next)) { setDeleted(selectedEntry); setSelectedEntry(null); setEntryListPage(0); setMessage('Entry removed. You can undo below.'); } }}>Remove this entry</button></div></div> : <div className="dy-page-content dy-editor"><p className="dy-eyebrow">A MOMENT, JUST FOR YOU</p><h2>Dear <em>little journal,</em></h2><form onSubmit={e => { e.preventDefault(); save(); }}><label htmlFor="dy-title">A title, if you like</label><input id="dy-title" placeholder="A little moment…" value={title} onChange={e => setTitle(e.target.value)} maxLength={100}/><label htmlFor="dy-words">A few words</label><textarea id="dy-words" placeholder="Today, I noticed…" value={words} onChange={e => setWords(e.target.value)} rows={5}/><div className="dy-editor-options"><label>File it under<select value={category} onChange={e => setCategory(e.target.value)}>{['Little moments','Sketchbook','Made by hand','Curiosities','Projects'].map(c => <option key={c}>{c}</option>)}</select></label><button type="button" onClick={() => fileInput.current?.click()}>{entryImage ? 'Change photo' : '＋ A photo'}</button><input ref={fileInput} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={e => { const file = e.target.files?.[0]; if (!file) return; if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 2 * 1024 * 1024) { setMessage('Choose a JPG, PNG, or WebP photo under 2 MB.'); return; } const reader = new FileReader(); reader.onload = () => { setEntryImage(String(reader.result)); setMessage('Photo added to your draft.'); }; reader.onerror = () => setMessage('That photograph could not be read. Try another.'); reader.readAsDataURL(file); e.target.value = ''; }}/></div>{entryImage && <div className="dy-attached"><img src={entryImage} alt="Attached photograph"/><button type="button" onClick={() => setEntryImage('')}>Remove photo ×</button></div>}<button className="dy-save" type="submit">Keep this little moment ↗</button><button className="dy-back" type="button" onClick={() => download(`${title || 'A little moment'}\n\n${words}`, 'a-little-moment.txt')}>Download words ↓</button><p className="dy-private-note">Only in this browser, on this device. Your words aren’t published. Download a copy to keep them.</p></form></div>;
      default: return null;
    }
  }

  return <main className={`diary-app ${open ? 'dy-open' : 'dy-closed'} ${motion ? '' : 'dy-still'} ${single ? 'dy-single' : ''}`}>
    <div className="dy-table-texture" aria-hidden="true"/>
    <header className="dy-room-header"><span>TAMMANA KAPOOR <i>✳</i> A PERSONAL JOURNAL</span><button onClick={() => { setOpen(!open); if (!open) { setLeaf(0); setTimeout(() => bookRef.current?.focus(), motion ? 1100 : 0); } }}>{open ? '↶ Close the journal' : 'A little world, waiting to be opened'}</button></header>
    <div className="dy-scene">
      <div className="dy-desk-note" aria-hidden="true"><p className="dy-hand">For all the little things<br/>that turn out to be<br/><em>the big things.</em></p><span>♡</span></div>
      <div className="dy-open-book" ref={bookRef} tabIndex={open ? 0 : -1} role="region" aria-label="Tammana’s journal. Use left and right arrow keys to turn pages." aria-hidden={!open} inert={!open} onKeyDown={e => { if ((e.target as HTMLElement).closest('input,textarea,select,button,a')) return; if (e.key === 'ArrowRight') { e.preventDefault(); flip(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); flip(-1); } if (e.key === 'Escape') setOpen(false); }} onTouchStart={e => { if ((e.target as HTMLElement).closest('input,textarea,select,button,a')) return; swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={e => { if (!swipe.current) return; const x = e.changedTouches[0].clientX - swipe.current.x; const y = e.changedTouches[0].clientY - swipe.current.y; if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.5) flip(x < 0 ? 1 : -1); swipe.current = null; }}>
        <div className="dy-leather-base" aria-hidden="true"/><div className="dy-paper-stack" aria-hidden="true"/>
        <div className="dy-spread" aria-live="polite" aria-atomic="false">{visibleLeaves.map((index, side) => <article key={index} className={`dy-leaf dy-leaf-${side === 0 ? 'left' : 'right'} dy-kind-${book.leaves[index].kind}`} aria-label={`Page ${index + 1}: ${book.leaves[index].section}`}><div className="dy-leaf-inner">{content(book.leaves[index])}</div><span className="dy-page-no">{String(index + 1).padStart(2, '0')}</span></article>)}</div>
        <div className="dy-binding" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <span key={i} style={{ '--ring': i } as CSSProperties}><i/><b/></span>)}</div>
        {turn && <div className={`dy-turning-leaf ${turn.direction < 0 ? 'dy-turn-back' : ''}`} key={`${turn.old}-${leaf}`} aria-hidden="true"><div className="dy-leaf dy-turn-face" inert>{book.leaves[turn.old + (turn.direction > 0 && !single ? 1 : 0)].kind === "write" ? <span className="dy-turn-flower">✿</span> : content(book.leaves[turn.old + (turn.direction > 0 && !single ? 1 : 0)])}</div><span className="dy-turn-mark">{String(leaf + 1).padStart(2, '0')}</span></div>}
        <nav className="dy-tabs" aria-label="Journal sections">{tabs.map(tab => <button key={tab.id} className={`dy-tab dy-tab-${tab.id}`} aria-label={tab.title} aria-current={currentSection === tab.id ? 'page' : undefined} onClick={() => jump(tab.id)}><span className="dy-tab-long">{tab.title}</span><span className="dy-tab-short">{tab.short}</span></button>)}</nav>
        <div className="dy-ribbon" aria-hidden="true"/>
      </div>
      <div className="dy-cover-wrap" aria-hidden={open} inert={open}>
        <button className="dy-cover" onClick={() => { setLeaf(0); setOpen(true); setTimeout(() => bookRef.current?.focus(), motion ? 1100 : 0); }} aria-label="Open Tammana’s journal">
          <span className="dy-cover-stitch"/><span className="dy-cover-spine"/>
          <span className="dy-cover-photo-strip"><img src="/visual-diary/regents-canal.jpg" alt=""/><img src="/visual-diary/embroidered-tote.jpg" alt=""/><img src="/visual-diary/scooter-sketch.jpg" alt=""/></span>
          <LaceBow/>
          <span className="dy-cover-title"><span>the little world of</span><strong>Tammana</strong><em>a journal of sorts</em></span>
          <span className="dy-cover-band"/><span className="dy-cover-clasp"><i/></span>
          <span className="dy-charm-chain"/><span className="dy-cover-charms"><span className="dy-charm-star">✧</span><span className="dy-pearl"/><span className="dy-charm-heart">♡</span></span>
          <svg className="dy-stitched-heart" viewBox="0 0 100 90" aria-hidden="true"><path d="M50 78C14 54 1 30 15 15 29 0 46 12 50 23c4-11 21-23 35-8 14 15 1 39-35 63Z" stroke="#d5bb86" strokeWidth="2.5" strokeDasharray="5 3" fill="none"/></svg>
          <span className="dy-cover-corner"/>
        </button>
        <p className="dy-open-invitation"><span className="dy-hand">a little curiosity goes a long way</span><span>CLICK THE JOURNAL TO OPEN <i>↗</i></span></p>
      </div>
      {open && <div className="dy-book-controls"><button className="dy-page-arrow" onClick={() => flip(-1)} disabled={!canPrev || !!turn} aria-label="Previous page">←</button><span className="dy-control-label">{tabs.find(t => t.id === currentSection)?.title}<small>{single ? `${String(leaf + 1).padStart(2, '0')}` : `${String(leaf + 1).padStart(2, '0')} — ${String(leaf + 2).padStart(2, '0')}`} / {book.leaves.length}</small></span><button className="dy-page-arrow" onClick={() => flip(1)} disabled={!canNext || !!turn} aria-label="Next page">→</button></div>}
    </div>
    <footer className="dy-room-footer"><span>{open ? single ? 'SWIPE OR TAP TO TURN A PAGE' : 'TURN A PAGE. FOLLOW A LITTLE CURIOSITY.' : 'LONDON & WHEREVER CURIOSITY GOES'}</span><div className="dy-status-message" role="status">{message}{deleted && <button onClick={() => { const next = [deleted, ...entries].sort((a, b) => b.date.localeCompare(a.date)); if (keepEntries(next)) { setDeleted(null); setMessage('Your little moment is back.'); } }}>Undo removal ↶</button>}</div><button className="dy-motion" onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? 'Ⅱ Pause the little movements' : '▷ Let things move'}</button></footer>
  </main>;
}
