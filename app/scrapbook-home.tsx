"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { projects } from "./projects/data";
import "./scrapbook-home.css";

type Entry = { id: string; title: string; text: string; category: string; date: string; image?: string };
type Scrap = { image: string; title: string; category: string; caption: string };
const scraps: Scrap[] = [
  { image: "regents-canal.jpg", title: "The long way home", category: "Little moments", caption: "A little frame from Regent’s Canal, London. There is always something to notice along the water." },
  { image: "london-in-march.jpg", title: "London, on paper", category: "Sketchbook", caption: "Flowers from the sketchbook. A collection of colours, shapes, and small details." },
  { image: "embroidered-tote.jpg", title: "One stitch at a time", category: "Made by hand", caption: "A tote bag, some thread, and flowers made by hand. The lovely, slow business of making things." },
  { image: "cake-roll-sketch.jpg", title: "Something sweet", category: "Sketchbook", caption: "A little study of a cake roll, strawberries and all. Collected in the sketchbook." },
  { image: "countryside-cows.jpg", title: "A little further afield", category: "Little moments", caption: "Green fields, a wide sky, and a few curious neighbours. A frame from the countryside." },
  { image: "washing-line-sketch.jpg", title: "An ordinary afternoon", category: "Sketchbook", caption: "Windows and a washing line, saved in ink. Everyday things make good subjects." },
];
const prompts = ["What’s one small thing you want to remember?", "What caught your eye on your last walk?", "What are you curious about right now?", "What did you make, try, or learn today?", "What felt like a little bit of joy?", "What’s an unfinished idea you keep coming back to?"];
const entryKey = "tammana-journal-entries-v1";
const draftKey = "tammana-journal-draft-v1";

function Flower({ className = "" }: { className?: string }) {
  return <svg className={`sj-flower ${className}`} viewBox="0 0 100 100" aria-hidden="true"><g fill="#f8eed2" stroke="#e1d1ae" strokeWidth=".7">{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="50" cy="27" rx="10" ry="21" transform={`rotate(${i * 45} 50 50)`} />)}</g><circle cx="50" cy="50" r="12" fill="#b7a047"/><circle cx="48" cy="48" r="7" fill="#d5bb65"/><g fill="#7f713b"><circle cx="46" cy="47" r="1"/><circle cx="53" cy="49" r="1"/><circle cx="49" cy="54" r="1"/></g></svg>;
}

function Butterfly() {
  return <svg className="sj-butterfly" viewBox="0 0 100 80" aria-hidden="true"><g className="sj-wing-left"><path d="M49 44C30 0 1 1 9 28c2 9 11 15 21 18C4 47 21 79 47 51Z" fill="#a4b8ca" stroke="#384553" strokeWidth="2"/><path d="m46 42-23-24m23 29L29 60" stroke="#657888" fill="none"/><path d="m16 16 7 5m-8 9 7 3m2 23 7 2" stroke="#f7ead6" strokeWidth="3"/></g><g className="sj-wing-right"><path d="M51 44C70 0 99 1 91 28c-2 9-11 15-21 18 26 1 9 33-17 5Z" fill="#a4b8ca" stroke="#384553" strokeWidth="2"/><path d="m54 42 23-24M54 47l17 13" stroke="#657888" fill="none"/><path d="m84 16-7 5m8 9-7 3m-2 23-7 2" stroke="#f7ead6" strokeWidth="3"/></g><path d="M50 34v24m-1-23-5-8m7 8 5-8" stroke="#3b3931" strokeWidth="3" strokeLinecap="round"/></svg>;
}

function MovableStar() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  function down(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, startX: position.x, startY: position.y };
  }
  return <button className="sj-star" aria-label="Move the lucky star sticker. Drag, or use the arrow keys. Press Home to reset." title="A lucky little star. Drag me!" style={{ translate: `${position.x}px ${position.y}px` }} onPointerDown={down} onPointerMove={event => {
    if (drag.current) setPosition({ x: Math.max(-170, Math.min(100, drag.current.startX + event.clientX - drag.current.x)), y: Math.max(-100, Math.min(180, drag.current.startY + event.clientY - drag.current.y)) });
  }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onKeyDown={event => {
    const changes: Record<string, [number, number]> = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
    if (event.key === "Home") { event.preventDefault(); setPosition({ x: 0, y: 0 }); }
    if (changes[event.key]) { event.preventDefault(); const [x, y] = changes[event.key]; setPosition(p => ({ x: Math.max(-170, Math.min(100, p.x + x)), y: Math.max(-100, Math.min(180, p.y + y)) })); }
  }}><svg viewBox="0 0 100 100" aria-hidden="true"><path d="m50 3 12 31 34 2-27 22 8 34-28-19-28 19 8-34L3 36l34-2Z" fill="#c1a04a" stroke="#f7eccb" strokeWidth="5"/><path d="m50 15 8 25 26 1-21 16 7 25-21-15-21 15 7-25-20-16 26-1Z" fill="none" stroke="#a38438" strokeWidth="1"/></svg></button>;
}

export default function ScrapbookHome() {
  const [spread, setSpread] = useState(0);
  const [motion, setMotion] = useState(true);
  const [filter, setFilter] = useState("Everything");
  const [prompt, setPrompt] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Little moments");
  const [entryImage, setEntryImage] = useState("");
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState("");
  const [activeScrap, setActiveScrap] = useState<Scrap | null>(null);
  const [activeEntry, setActiveEntry] = useState<Entry | null>(null);
  const [removedEntry, setRemovedEntry] = useState<Entry | null>(null);
  const editor = useRef<HTMLDialogElement>(null);
  const viewer = useRef<HTMLDialogElement>(null);
  const upload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(entryKey) || "[]");
      if (Array.isArray(saved)) setEntries(saved.filter((e): e is Entry => e && typeof e.id === "string" && typeof e.title === "string" && typeof e.text === "string" && typeof e.category === "string" && typeof e.date === "string"));
      const draft = JSON.parse(localStorage.getItem(draftKey) || "null");
      if (draft && typeof draft.text === "string") { setText(draft.text); setTitle(typeof draft.title === "string" ? draft.title : ""); setCategory(draft.category || "Little moments"); setEntryImage(draft.image || ""); }
    } catch { setStorageError("Browser storage is unavailable. You can still write and download your words."); }
    setLoaded(true);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotion(!preference.matches);
    const changed = () => setMotion(!preference.matches);
    preference.addEventListener("change", changed);
    return () => preference.removeEventListener("change", changed);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(draftKey, JSON.stringify({ title, text, category, image: entryImage })); }
    catch { setStorageError("Your draft could not be stored. Download a copy to keep it safe."); }
  }, [title, text, category, entryImage, loaded]);

  function write() { setNotice(""); editor.current?.showModal(); }
  function saveEntry() {
    if (!text.trim() && !entryImage) { setNotice("A word, a sentence, or a photo is all you need to start."); return; }
    const next = [{ id: crypto.randomUUID(), title: title.trim() || "A little moment", text: text.trim(), category, date: new Date().toISOString(), image: entryImage || undefined }, ...entries];
    try { localStorage.setItem(entryKey, JSON.stringify(next)); }
    catch { setStorageError("There isn’t enough browser storage. Download your entry before closing it."); return; }
    setEntries(next); setTitle(""); setText(""); setEntryImage(""); editor.current?.close(); setFilter("My entries"); setNotice("A little piece of today, kept.");
    document.getElementById("collected")?.scrollIntoView({ behavior: motion ? "smooth" : "instant" });
  }
  function downloadDraft() {
    const blob = new Blob([`${title || "A little moment"}\n\n${text}\n`], { type: "text/plain" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "a-little-moment.txt"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportEntries() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "my-journal.json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function showScrap(scrap: Scrap) { setActiveEntry(null); setActiveScrap(scrap); viewer.current?.showModal(); }
  function showEntry(entry: Entry) { setActiveScrap(null); setActiveEntry(entry); viewer.current?.showModal(); }
  const visibleScraps = filter === "My entries" ? [] : scraps.filter(s => filter === "Everything" || filter === s.category);
  const visibleEntries = entries.filter(e => filter === "Everything" || filter === "My entries" || e.category === filter);

  return <main className={`sj ${motion ? "" : "sj-still"}`} id="top">
    <a className="sj-skip" href="#journal">Skip to journal</a>
    <header className="sj-header"><a className="sj-brand" href="#top">tammana<span>’s little world</span><span className="sj-brand-star" aria-hidden="true">✳</span></a><nav aria-label="Main navigation"><a href="#journal">the journal</a><a href="#projects">things I’m making</a><a href="#about">a little about me</a></nav><button className="sj-write-link" onClick={write}><span aria-hidden="true">✎</span> Write a little <span aria-hidden="true">↗</span></button></header>

    <section className="sj-intro" aria-labelledby="journal-title">
      <div className="sj-prelude"><span>A PERSONAL JOURNAL, OF SORTS</span><span>LONDON & WHEREVER CURIOSITY GOES <i aria-hidden="true">✧</i></span></div>
      <div className="sj-book-wrap">
        <div className="sj-bookmarks" role="tablist" aria-label="Explore the journal"><button id="tab-intro" role="tab" aria-selected={spread === 0} aria-controls="sj-spread" onClick={() => setSpread(0)}>a little hello</button><button id="tab-love" role="tab" aria-selected={spread === 1} aria-controls="sj-spread" onClick={() => setSpread(1)}>things I love</button><button id="tab-making" role="tab" aria-selected={spread === 2} aria-controls="sj-spread" onClick={() => setSpread(2)}>in the making</button></div>
        <div className="sj-book" id="sj-spread" role="tabpanel" aria-labelledby={['tab-intro', 'tab-love', 'tab-making'][spread]}>
          <div className="sj-left-page" key={`left-${spread}`}>
            <div className="sj-page-meta"><span>THE EVERYDAY ARCHIVE</span><span>VOL. 01</span></div>
            {spread === 0 ? <><p className="sj-hand sj-hello">Oh, hello. I’m Tammana.</p><h1 id="journal-title">Life, in<br/><em>little</em><br/>pieces<span className="sj-title-dot">.</span></h1><p className="sj-hero-copy">A place for the things I notice,<br/>the things I make, and all the lovely<br/>bits in between.</p><a className="sj-underlink" href="#journal">Come, have a little wander <span>↓</span></a><p className="sj-hand sj-margin-note">No grand story.<br/>Just a collection of me.</p></> : spread === 1 ? <><p className="sj-hand sj-hello">A few of my favourite things.</p><h1 id="journal-title" className="sj-hero-title">Following<br/>my <em>little</em><br/>curiosities.</h1><p className="sj-hero-copy">Canal walks. A page full of sketches.<br/>Flowers, thread, and things made slowly.<br/>There is a little world in the everyday.</p><a className="sj-underlink" href="#collected">Explore the collection <span>↓</span></a><p className="sj-hand sj-margin-note">Always room for<br/>one more interest.</p></> : <><p className="sj-hand sj-hello">Usually starting another idea.</p><h1 id="journal-title" className="sj-hero-title">Made with<br/><em>a little</em><br/>curiosity.</h1><p className="sj-hero-copy">A quiet café. A plant-guessing game.<br/>New ways to make learning visible.<br/>Ideas that became something you can try.</p><a className="sj-underlink" href="#projects">See what I’m making <span>↓</span></a><p className="sj-hand sj-margin-note">Learning by making.<br/>Making as I go.</p></>}
            <span className="sj-page-number">{String(spread * 2 + 1).padStart(2, "0")}</span>
          </div>
          <div className="sj-right-page" key={`right-${spread}`}>
            <p className="sj-hand sj-collage-note">a few things worth keeping ↴</p>
            <button className="sj-photo sj-main-photo" onClick={() => spread === 2 ? window.location.assign("/projects/daily-cafe") : showScrap(scraps[0])}><span className="sj-tape"/><img src={spread === 2 ? "/daily-cafe-cover.jpg" : "/visual-diary/regents-canal.jpg"} alt={spread === 2 ? "An illustration of the Daily Café" : "A sunny afternoon beside Regent’s Canal"}/><span className="sj-hand">{spread === 2 ? "a café you can carry with you" : "taking the scenic route, always"}</span></button>
            <button className="sj-photo sj-small-photo" onClick={() => showScrap(scraps[spread === 1 ? 1 : 2])}><span className="sj-tape"/><img src={`/visual-diary/${spread === 1 ? "london-in-march.jpg" : "embroidered-tote.jpg"}`} alt={spread === 1 ? "Botanical drawings in a sketchbook" : "Flowers embroidered on a tote bag"}/><span className="sj-hand">{spread === 1 ? "a page of little discoveries" : "made slowly, by hand ♡"}</span></button>
            <img className="sj-pressed-flower" src="/sketchbook/bloom.png" alt=""/>
            <div className="sj-butterfly-path"><Butterfly/></div>
            <MovableStar/>
            <div className="sj-stamp" aria-hidden="true"><span>A LITTLE</span><b>✿</b><span>MORE WONDER</span></div>
            <div className="sj-paper-note"><span className="sj-note-pin"/><p className="sj-hand">For the small things<br/>that turn out to be<br/><em>the big things.</em></p></div>
            <Flower className="sj-daisy-one"/><Flower className="sj-daisy-two"/>
            <span className="sj-page-number">{String(spread * 2 + 2).padStart(2, "0")}</span>
          </div>
          <div className="sj-spine" aria-hidden="true"/>
        </div>
        <div className="sj-book-bottom"><span className="sj-hand">a work in progress, just like me</span><div><span>{String(spread + 1).padStart(2, "0")} / 03</span><button aria-label="Previous journal spread" onClick={() => setSpread((spread + 2) % 3)}>←</button><button aria-label="Next journal spread" onClick={() => setSpread((spread + 1) % 3)}>→</button></div></div>
      </div>
    </section>

    <section className="sj-journal-section" id="journal" aria-labelledby="begin-title">
      <div className="sj-section-label"><span>01 / THE JOURNAL</span><span>A SENTENCE COUNTS. A PHOTO COUNTS. YOU COUNT.</span></div>
      <div className="sj-begin-grid"><div><p className="sj-hand sj-small-heading">A blank page can be a funny thing.</p><h2 id="begin-title">Let’s start <em>small.</em></h2><p>You don’t need the right words.<br/>Just a little something from your day.</p><span className="sj-drawn-arrow" aria-hidden="true">⤳</span></div><div className="sj-prompt-card"><span className="sj-tape"/><div className="sj-prompt-meta"><span>A LITTLE NUDGE TO GET YOU GOING</span><span aria-hidden="true">✧</span></div><p key={prompt}>{prompts[prompt]}</p><div className="sj-prompt-actions"><button className="sj-button" onClick={write}>Put it on paper <span>↗</span></button><button className="sj-shuffle" onClick={() => setPrompt((prompt + 1) % prompts.length)}><span aria-hidden="true">⤨</span> Another thought</button></div><span className="sj-prompt-footnote">just for you · saved in this browser</span></div></div>
    </section>

    <section className="sj-collection" id="collected" aria-labelledby="collection-title"><div className="sj-collection-heading"><div><p className="sj-section-label">THE LITTLE THINGS, COLLECTED</p><h2 id="collection-title">Along the <em>way.</em></h2></div><p className="sj-hand">Some days a thought.<br/>Some days just a picture.</p></div><div className="sj-filters" role="group" aria-label="Filter the collection">{["Everything", "Little moments", "Sketchbook", "Made by hand", "My entries"].map(item => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}{item === "My entries" && entries.length > 0 ? ` (${entries.length})` : ""}</button>)}</div>
      <div className="sj-live-notice" role="status">{notice}{removedEntry && <button onClick={() => { const next = [removedEntry, ...entries].sort((a, b) => b.date.localeCompare(a.date)); try { localStorage.setItem(entryKey, JSON.stringify(next)); setEntries(next); setRemovedEntry(null); setNotice("Your little moment is back."); } catch { setNotice("Your entry could not be restored. Try again."); } }}>Undo removal ↶</button>}</div>
      <div className="sj-scraps-grid">{visibleEntries.map(entry => <button className="sj-entry-preview" key={entry.id} onClick={() => showEntry(entry)}><span className="sj-tape"/><span className="sj-scrap-category">{entry.category} / YOUR PRIVATE PAGES</span>{entry.image && <img src={entry.image} alt="Your journal photograph"/>}<h3>{entry.title}</h3><p>{entry.text.slice(0, 160)}{entry.text.length > 160 ? "…" : ""}</p><span className="sj-hand">{new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span></button>)}{visibleScraps.map((scrap, i) => <button className="sj-scrap" style={{ "--scrap-rotation": `${[-2, 1.5, -1, 1.4, -1.6, 2][i % 6]}deg` } as CSSProperties} key={scrap.image} onClick={() => showScrap(scrap)}><span className="sj-tape"/><div className="sj-scrap-image"><img src={`/visual-diary/${scrap.image}`} alt={scrap.title} loading="lazy"/><span className="sj-scrap-open" aria-hidden="true">↗</span></div><div className="sj-scrap-caption"><span className="sj-scrap-category">{scrap.category}</span><h3>{scrap.title}</h3><span className="sj-hand">a page from my everyday</span></div></button>)}</div>
      {filter === "My entries" && entries.length === 0 && <div className="sj-empty"><Flower/><h3>Your little collection starts here.</h3><p>One line about today is a perfectly good beginning.</p><button className="sj-button" onClick={write}>Write your first little note ↗</button></div>}
      {filter === "My entries" && entries.length > 0 && <div className="sj-private-footer"><p>These pages stay in this browser. Download a backup to keep them.</p><button onClick={exportEntries}>Download my journal ↓</button></div>}
    </section>

    <section className="sj-projects" id="projects" aria-labelledby="making-title"><div className="sj-section-label"><span>02 / MADE & IN THE MAKING</span><span>IDEAS THAT GREW LEGS</span></div><div className="sj-projects-heading"><h2 id="making-title">A curious mind.<br/><em>Busy hands.</em></h2><p>Little experiments in design, learning,<br/>and making something of an idea.<br/><span className="sj-hand">Have a look around. Try something.</span></p><span className="sj-thread" aria-hidden="true">〰</span></div><div className="sj-project-grid">{projects.map((project, i) => <a href={`/projects/${project.id}`} className="sj-project" key={project.id}><div className="sj-project-image"><img src={project.cover.src} alt={project.cover.alt} loading="lazy"/><span className="sj-project-index">0{i + 1}</span><span className="sj-project-arrow">↗</span></div><div className="sj-project-details"><span className="sj-scrap-category">{project.tagList.slice(0, 2).join(" / ")}</span><h3>{project.title}</h3><p>{i === 0 ? "A hand-drawn café, a little music, and a room you can settle into." : i === 1 ? "A plant-guessing game for the quietly curious. Learn a little. Grow a little." : "Making the invisible visible, one chemistry discovery at a time."}</p><span className="sj-underlink">The story behind it <span>↗</span></span></div></a>)}</div></section>

    <section className="sj-about" id="about" aria-labelledby="about-title"><div className="sj-about-art"><figure className="sj-photo"><span className="sj-tape"/><img src="/visual-diary/scooter-sketch.jpg" alt="A colourful hand-drawn scooter in my sketchbook" loading="lazy"/><figcaption className="sj-hand">a little peek inside my head</figcaption></figure><Flower/><span className="sj-about-doodle" aria-hidden="true">♡</span></div><div className="sj-about-copy"><p className="sj-section-label">03 / THE PERSON BETWEEN THE PAGES</p><h2 id="about-title">Many interests.<br/><em>All me.</em></h2><p>I’m Tammana, an educator, designer, and curious maker based in London. I like thoughtful little experiences, learning by doing, and noticing things I might otherwise walk past.</p><p>This is a home for all those pieces. The sketches, the side projects, the things made slowly, and the ideas still figuring themselves out.</p><a className="sj-underlink" href="mailto:tammana4513@gmail.com">Leave me a little hello <span>↗</span></a></div></section>
    <footer className="sj-footer"><a className="sj-brand" href="#top">tammana<span>’s little world</span></a><p className="sj-hand">An unfinished collection. There’s always more to notice.</p><button className="sj-motion" onClick={() => setMotion(!motion)} aria-pressed={!motion}><span aria-hidden="true">{motion ? "Ⅱ" : "▷"}</span> {motion ? "Pause the little movements" : "Let things move"}</button></footer>

    <dialog className="sj-dialog sj-editor" ref={editor} aria-labelledby="entry-dialog-title" onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}><div className="sj-dialog-inner"><button className="sj-dialog-close" onClick={() => editor.current?.close()} aria-label="Close journal editor">×</button><p className="sj-section-label">A MOMENT, JUST FOR YOU</p><h2 id="entry-dialog-title">Dear <em>little journal,</em></h2><p className="sj-editor-prompt">{prompts[prompt]} <button aria-label="Try another writing prompt" onClick={() => setPrompt((prompt + 1) % prompts.length)}>⤨</button></p><form onSubmit={e => { e.preventDefault(); saveEntry(); }}><label htmlFor="entry-title">A title, if you like</label><input id="entry-title" placeholder="A little moment…" value={title} onChange={e => setTitle(e.target.value)} maxLength={120}/><label htmlFor="entry-words">A few words</label><textarea id="entry-words" placeholder="Today, I noticed…" value={text} onChange={e => setText(e.target.value)} rows={6} autoFocus/><div className="sj-editor-options"><label>File it under<select value={category} onChange={e => setCategory(e.target.value)}>{["Little moments", "Sketchbook", "Made by hand", "Curiosities", "Projects"].map(c => <option key={c}>{c}</option>)}</select></label><button type="button" onClick={() => upload.current?.click()}>＋ Add a photo</button><input ref={upload} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e => {
        const file = e.target.files?.[0]; if (!file) return;
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setNotice("Choose a JPG, PNG, or WebP photograph."); return; }
        if (file.size > 2 * 1024 * 1024) { setNotice("Choose a photo under 2 MB so it fits in your journal."); return; }
        const reader = new FileReader(); reader.onload = () => { setEntryImage(String(reader.result)); setNotice(""); }; reader.onerror = () => setNotice("That photo couldn’t be read. Try another one."); reader.readAsDataURL(file); e.target.value = "";
      }}/></div>{entryImage && <div className="sj-upload-preview"><img src={entryImage} alt="Photo to add to your entry"/><button type="button" onClick={() => setEntryImage("")}>Remove photo ×</button></div>}<p className="sj-editor-notice" role="status">{notice || storageError}</p><div className="sj-editor-bottom"><button type="submit" className="sj-button">Keep this little moment ↗</button><button type="button" className="sj-download" onClick={downloadDraft}>Download words ↓</button></div><p className="sj-privacy-note">Your draft and entries stay in this browser, on this device. They aren’t published to the website. Download a copy to keep them beyond this browser.</p></form></div></dialog>

    <dialog className="sj-dialog sj-viewer" ref={viewer} aria-labelledby="scrap-dialog-title" onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}><div className="sj-dialog-inner"><button className="sj-dialog-close" onClick={() => viewer.current?.close()} aria-label="Close journal page">×</button>{activeScrap && <><img className="sj-viewer-image" src={`/visual-diary/${activeScrap.image}`} alt={activeScrap.title}/><p className="sj-section-label">{activeScrap.category} / FROM MY CAMERA ROLL & SKETCHBOOK</p><h2 id="scrap-dialog-title">{activeScrap.title}</h2><p className="sj-viewer-text">{activeScrap.caption}</p><button className="sj-underlink" onClick={() => { viewer.current?.close(); write(); }}>Keep a moment of your own ↗</button></>}{activeEntry && <>{activeEntry.image && <img className="sj-viewer-image" src={activeEntry.image} alt="Your journal photograph"/>}<p className="sj-section-label">{activeEntry.category} / YOUR PRIVATE PAGES</p><h2 id="scrap-dialog-title">{activeEntry.title}</h2><p className="sj-entry-text">{activeEntry.text}</p><span className="sj-hand">{new Date(activeEntry.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span><div className="sj-delete-area"><button onClick={() => {
        const next = entries.filter(e => e.id !== activeEntry.id);
        try { localStorage.setItem(entryKey, JSON.stringify(next)); setEntries(next); setRemovedEntry(activeEntry); viewer.current?.close(); setNotice("The entry has been removed. "); }
        catch { setNotice("The entry couldn’t be removed from browser storage. Please try again."); }
      }}>Remove this entry</button></div></>}</div></dialog>
  </main>;
}
