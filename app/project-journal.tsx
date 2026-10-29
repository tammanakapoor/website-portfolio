"use client";

import { useEffect, useRef, useState } from "react";
import type { Figure, Project } from "./projects/data";
import { journalNotes } from "./journal-notes";
import CafeIpod from "./project-ipod";
import "./project-journal.css";

function Print({ image, className = "" }: { image: Figure; className?: string }) {
  return <figure className={`pj-print ${className}`}><span className="pj-tape" aria-hidden="true"/><img src={image.src} alt={image.alt}/><figcaption>{image.caption}</figcaption></figure>;
}

function Newspaper({ project }: { project: Project }) {
  const cafe = project.id === "daily-cafe";
  const fieldnotes = project.id === "fieldnotes";
  return <aside className="pj-newspaper" aria-label="A newspaper-style note from my worktable"><span className="pj-tape" aria-hidden="true"/><p className="pj-news-masthead">The Little Daily</p><div className="pj-news-rule"><span>FROM MY WORKTABLE</span><span>VOL. {project.number.slice(-2)}</span></div><h3>{cafe ? "A room of one’s own. A little noise, too." : project.id === "floraquest" ? "In praise of getting it wrong." : fieldnotes ? "Your usual walk, a new way of seeing." : "First, look at the thermometer."}</h3><img src={project.cover.src} alt=""/><div className="pj-news-columns"><p>{cafe ? "Sometimes the thing you miss is the room. People talking. Cups meeting saucers. Music someone else put on." : project.id === "floraquest" ? "A clue, a guess, a small discovery. Learning can begin with something you don’t know yet." : fieldnotes ? "A familiar tree. A name to look up. A small moment of attention on an everyday walk." : "An observation gives a new idea something to attach to. Start there. Let the vocabulary follow."}</p><p>{cafe ? "A small experiment in making a webpage feel like somewhere you can stay. No reservation required." : fieldnotes ? "A private web and iPhone prototype, still growing. Outdoor verification is the next step." : "A little experiment, made with curiosity and changed by the people who tried it."}</p></div><p className="pj-news-foot">a clipping from this project’s story</p></aside>;
}

function Ephemera({ project, motion }: { project: Project; motion: boolean }) {
  return <div className="pj-ephemera">
    <Newspaper project={project}/>
    {project.id === "daily-cafe" ? <div className="pj-ipod-scrap"><CafeIpod motion={motion}/><p>little soundtrack, big feeling.</p></div> : project.id === "fieldnotes" ? <div className="pj-field-kit" aria-hidden="true"><img src="/sketchbook/botany-left.png" alt=""/><div className="pj-field-tag"><span>FIELD NOTES / No. 04</span><svg viewBox="0 0 120 75" fill="none"><path d="M13 57c14 0 21-6 29-6h35c12 0 19-9 23-24l6-9m-6 9 13-3M13 57c1 8 14 9 26 9h43c15 0 23-6 28-16" stroke="#6e7962" strokeWidth="5" strokeLinecap="round"/><circle cx="54" cy="35" r="24" fill="#d6b56d" stroke="#a98848" strokeWidth="2"/><path d="M66 45c-16 13-33-1-29-17 3-14 25-16 30-2 4 12-10 20-16 12-4-6 1-12 7-8" stroke="#786c45" strokeWidth="3" strokeLinecap="round"/></svg><p>take the<br/>curious route.</p><i>one walk at a time ♡</i></div></div> : <div className="pj-flower-scrap" aria-hidden="true"><img src="/sketchbook/bloom.png" alt=""/><span>something worth<br/>looking closer at.</span></div>}
    <div className="pj-coffee-ring" aria-hidden="true"/>
    <div className="pj-receipt" aria-hidden="true"><span>A SMALL RECEIPT</span><b>1 × curiosity<br/>1 × a messy first try<br/>a handful of changes</b><i>total: still learning</i><span>KEEP THIS LITTLE THING ♡</span></div>
    <div className="pj-side-stars" aria-hidden="true">✧<br/><span>✦</span></div>
    <img className="pj-side-botanical" src="/sketchbook/botany-left.png" alt="" aria-hidden="true"/>
    <div className="pj-paper-clip" aria-hidden="true"/>
  </div>;
}

export default function ProjectJournal({ project, projects, next }: { project: Project; projects: Project[]; next: Project }) {
  const note = journalNotes[project.id];
  const [motion, setMotion] = useState(true);
  const [progress, setProgress] = useState(0);
  const story = useRef<HTMLElement>(null);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => setMotion(!preference.matches);
    const track = () => {
      if (!story.current) return;
      const rect = story.current.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight))));
    };
    reduce(); track(); preference.addEventListener("change", reduce);
    window.addEventListener("scroll", track, { passive: true });
    window.addEventListener("resize", track);
    return () => { preference.removeEventListener("change", reduce); window.removeEventListener("scroll", track); window.removeEventListener("resize", track); };
  }, []);
  const figures = project.chapters.flatMap(chapter => chapter.figures || []);
  const resultImage: Figure | undefined = project.id === "fieldnotes" ? undefined : project.id === "energy-changes" ? {src:"/energy-changes/exp3-pathways.jpg",alt:"Activity comparing catalysed and uncatalysed energy pathways",caption:"the final step: apply the model to a new pathway"} : {...note.snippets[project.id === "daily-cafe" ? 1 : 0],caption:"a little clipping from the finished experience"};

  return <main className={`project-journal pj-${project.id} ${motion ? "" : "pj-still"}`} id="top">
    <nav className="pj-navigation" aria-label="Project navigation"><a className="pj-back" href={`/#projects/${project.id}`}>← All projects</a><span className="pj-nav-title">Tammana’s journal <i>/</i> <strong>{project.title}</strong></span><label><span className="pj-sr-only">Choose a project</span><select value={project.id} onChange={e => { window.location.href = `/projects/${e.target.value}`; }}>{projects.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><div className="pj-reading-progress" style={{transform:`scaleX(${progress})`}} aria-hidden="true"/></nav>
    <div className="pj-desk">
      <article className="pj-paper" ref={story} aria-labelledby="pj-title">
        <div className="pj-punched-edge" aria-hidden="true"/>
        <header className="pj-entry-header"><p className="pj-kicker">{project.number.replace("No.","ENTRY")} / {project.tagList.join(" · ")}</p><p className="pj-handwritten-intro">a small thing I made</p><h1 id="pj-title">{project.title}</h1><p className="pj-subtitle">{note.heading}</p><div className="pj-entry-meta"><span>{project.status}</span><span>ideas, experiments & the bits in between</span></div><Ephemera project={project} motion={motion}/><Print image={{src:project.cover.src,alt:project.cover.alt,caption:project.cover.note}} className="pj-hero-print"/><p className="pj-opening">{note.opening}</p><a className="pj-scroll-hint" href={project.id === "fieldnotes" ? "#a-walk" : "#the-idea"}>{project.id === "fieldnotes" ? "Follow a discovery →" : "the story, from the beginning ↓"}</a>{project.id === "fieldnotes" && <p className="pj-prototype-status">Web + iPhone · private prototype</p>}</header>
        <section className="pj-story-section pj-idea" id="the-idea"><span className="pj-section-number">01 / THE FIRST THOUGHT</span><h2>It started with<br/><em>a little “what if…”</em></h2><p>{note.spark}</p><blockquote className="pj-question"><span className="pj-tape" aria-hidden="true"/>{note.question}<span aria-hidden="true">✧</span></blockquote><div className="pj-intentions"><span className="pj-kicker">a few things to hold onto</span>{note.intentions.map(item => <p key={item}><span aria-hidden="true">✓</span>{item}</p>)}</div></section>
        <section className="pj-story-section pj-process" id="the-making"><span className="pj-section-number">02 / ON THE WORKTABLE</span><h2>From a thought<br/><em>to a first try.</em></h2><p>{note.process}</p><div className="pj-working-clippings">{note.snippets.map(image => <Print key={image.src} image={image}/>)}{project.id === "fieldnotes" && <div className="pj-fieldnotes-walk" id="a-walk"><h3>A walk, in three small steps</h3><ol><li><strong>01 / Explore — Find a tree on your usual route.</strong><p>Browse the map and open a tree’s recorded name, location and source.</p></li><li><strong>02 / Collect — Be there. Look a little closer.</strong><p>Save an encounter when you’re nearby. An unknown tree can stay identification pending.</p></li><li><strong>03 / Remember — Give the moment somewhere to live.</strong><p>Add a note or optional personal photo, then return to that species in your journal.</p></li></ol></div>}<span className="pj-scribbled-arrow" aria-hidden="true">↳</span></div><p className="pj-margin-annotation">{note.processNote}</p>{project.id === "daily-cafe" && <div className="pj-sound-note"><span className="pj-kicker">a little sound recipe</span><p>the room <span>+</span> the espresso machine <span>+</span> a day’s worth of music</p><span>layer by layer, until it felt like somewhere.</span></div>}</section>
        <section className="pj-story-section pj-changes" id="the-changes"><span className="pj-section-number">03 / THE CROSSED-OUT BITS</span><h2>Try. Notice.<br/><em>Try again.</em></h2><p className="pj-section-intro">A few things that changed along the way.</p><div className="pj-revisions">{note.revisions.map((revision,i) => <section key={revision.before}><span className="pj-revision-number">0{i+1}</span><div><del>{revision.before}</del><p className="pj-revision-after"><span aria-hidden="true">↳</span>{revision.after}</p><p>{revision.note}</p></div></section>)}</div><p className="pj-margin-annotation">the crossed-out bits are part of the story, too. ♡</p></section>
        <section className="pj-story-section pj-result" id="the-result"><span className="pj-section-number">{project.id === "fieldnotes" ? "04 / STILL IN DEVELOPMENT" : "04 / OUT IN THE WORLD"}</span><h2>The thing<br/><em>{project.id === "fieldnotes" ? "it’s becoming." : "it became."}</em></h2>{resultImage && <Print image={resultImage}/>}<p>{note.result}</p>{project.id === "fieldnotes" && <dl className="pj-fieldnotes-details"><div><dt>My focus</dt><dd>Experience, interface &amp; build</dd></div><div><dt>Made for</dt><dd>Everyday walks in London</dd></div><div><dt>Where it is now</dt><dd>Working web + iPhone prototype</dd></div></dl>}<div className="pj-result-bottom"><div className="pj-ticket"><span>ONE LITTLE IDEA, LATER</span><strong>{note.keepsake[0]}</strong><em>{note.keepsake[1]}</em></div><div className="pj-live-links">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></div></section>
        <section className="pj-story-section pj-reflection" id="notes-to-keep"><span className="pj-section-number">05 / NOTES TO KEEP</span><h2>A few things<br/><em>for the next page.</em></h2><div className="pj-lace-note"><img src="/journal-pages/ivory-paper-doily.png" alt=""/><div><span className="pj-kicker">note to myself</span>{note.takeaways.map((line,i) => <p key={line}><span aria-hidden="true">{["✧","♡","✳"][i]}</span>{line}</p>)}</div></div><div className="pj-next-thought"><span className="pj-kicker">still thinking about…</span><p>{note.next}</p></div><details className="pj-extra-notes"><summary>A little more from the making-of <span aria-hidden="true">＋</span></summary><div>{project.chapters.map(chapter => <section key={chapter.title}><h3>{chapter.title}</h3>{chapter.text.map(text => <p key={text}>{text}</p>)}</section>)}{figures.length > 0 && <div className="pj-archive-figures">{figures.map(image => <Print key={image.src} image={image}/>)}</div>}</div></details></section>
        <footer className="pj-story-footer"><p>{project.id === "fieldnotes" ? "still growing, one walk at a time." : "still learning. still making."} <span>♡</span></p><nav aria-label="Continue exploring"><a href="/#projects">← Back to all projects</a><a href={`/projects/${next.id}`}>Next: {next.title} →</a></nav><a className="pj-to-top" href="#top">back to the top ↑</a></footer>
      </article>
    </div>
    <footer className="pj-desk-footer"><span>A LITTLE CORNER OF TAMMANA’S JOURNAL</span><button onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? "Ⅱ Pause the little movements" : "▷ Let things move"}</button></footer>
  </main>;
}
