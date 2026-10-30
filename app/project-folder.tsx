import { Fragment, useEffect, useRef } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode, Ref, TouchEvent } from "react";
import type { Figure, Project } from "./projects/data";
import BinderRings, { SnapStrap, Stitching } from "./binder-rings";
import { journalNotes } from "./journal-notes";
import "./project-folder.css";

/** Divider labels: the full name on wide screens, a single word on phones. */
const dividerNames: Record<string, [string, string]> = {
  "daily-cafe": ["Daily Café", "café"],
  floraquest: ["FloraQuest", "flora"],
  "energy-changes": ["Energy Changes", "energy"],
  fieldnotes: ["Fieldnotes", "field"],
};
const dividerColours = ["#bdc3a0", "#d1a7a0", "#d4c18c", "#b1bfcc"];
const visitLabels: Record<string, string> = { "daily-cafe": "visit café", floraquest: "play game", "energy-changes": "try lesson" };

function Print({ image, className = "" }: { image: Figure; className?: string }) {
  return <figure className={`dy-folder-print ${className}`}><span className="dy-tape" aria-hidden="true"/><img src={image.src} alt={image.alt} loading="lazy"/><figcaption>{image.caption}</figcaption></figure>;
}

/** One project's story, from the first thought to what it became. */
function Story({ project, index, count, nextTitle, onJump }: { project: Project; index: number; count: number; nextTitle: string; onJump: (index: number) => void }) {
  const note = journalNotes[project.id];
  const destination = project.site ?? project.links.find(link => link.external);
  const last = index === count - 1;
  return <article className="dy-folder-project" id={`folder-project-${project.id}`} data-index={index} aria-label={`${project.title}: the story`} style={{ "--tab": dividerColours[index % dividerColours.length] } as CSSProperties}>
    <header className="dy-folder-head">
      <div className="dy-folder-copy">
        <p className="dy-folder-meta">{project.number} <i aria-hidden="true">·</i> {project.status}</p>
        <h2 className="dy-folder-title">{project.title}</h2>
        <p className="dy-folder-heading">{note?.heading}</p>
        <ul className="dy-folder-tags" aria-label="What kind of project">{project.tagList.map(tag => <li key={tag}>{tag}</li>)}</ul>
      </div>
      <div className="dy-folder-actions">
        {destination ? <a className="dy-folder-link" href={destination.href} target="_blank" rel="noopener noreferrer" aria-label={`${destination.label} (opens in a new tab)`}>{visitLabels[project.id] ?? destination.label.toLowerCase()} <span aria-hidden="true">↗</span></a> : <span className="dy-folder-private">private prototype, not public yet</span>}
      </div>
    </header>
    <div className="dy-folder-intro">
      <Print image={{ src: project.cover.src, alt: project.cover.alt, caption: project.cover.note }} className={`dy-folder-photo dy-folder-photo-${project.id}`}/>
      <div>
        <p className="dy-folder-summary">{project.summary}</p>
        {note && <p className="dy-folder-opening">{note.opening}</p>}
        <p className="dy-folder-hint" aria-hidden="true">the story, from the beginning ↓</p>
      </div>
    </div>
    {note && <>
      <section className="dy-folder-story">
        <span className="dy-folder-step">01 / the first thought</span>
        <h3>It started with <em>a little “what if…”</em></h3>
        <p>{note.spark}</p>
        <blockquote className="dy-folder-question">{note.question}</blockquote>
        <ul className="dy-folder-ticks">{note.intentions.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="dy-folder-story">
        <span className="dy-folder-step">02 / on the worktable</span>
        <h3>From a thought <em>to a first try.</em></h3>
        <p>{note.process}</p>
        {project.id === "fieldnotes" && <ol className="dy-folder-walk">{project.timeline.map(step => <li key={step.label}>{step.label}</li>)}</ol>}
        <div className="dy-folder-prints">{note.snippets.map(image => <Print key={image.src} image={image}/>)}</div>
        <p className="dy-folder-aside">{note.processNote}</p>
      </section>
      <section className="dy-folder-story">
        <span className="dy-folder-step">03 / the crossed-out bits</span>
        <h3>Try. Notice. <em>Try again.</em></h3>
        <ol className="dy-folder-revisions">{note.revisions.map(revision => <li key={revision.before}><del>{revision.before}</del><strong><span aria-hidden="true">↳ </span>{revision.after}</strong><p>{revision.note}</p></li>)}</ol>
      </section>
      <section className="dy-folder-story">
        <span className="dy-folder-step">{project.id === "fieldnotes" ? "04 / still in development" : "04 / out in the world"}</span>
        <h3>The thing <em>{project.id === "fieldnotes" ? "it’s becoming." : "it became."}</em></h3>
        <p>{note.result}</p>
        <p className="dy-folder-ticket"><span>one little idea, later</span><strong>{note.keepsake[0]}</strong><em>{note.keepsake[1]}</em></p>
      </section>
      <section className="dy-folder-story">
        <span className="dy-folder-step">05 / notes to keep</span>
        <h3>A few things <em>for the next page.</em></h3>
        <ul className="dy-folder-takeaways">{note.takeaways.map(line => <li key={line}>{line}</li>)}</ul>
        <p className="dy-folder-aside">{note.next}</p>
      </section>
    </>}
    <footer className="dy-folder-end">
      <p>{project.id === "fieldnotes" ? "still growing, one walk at a time." : "still learning. still making."} <span aria-hidden="true">♡</span></p>
      {count > 1 && <button type="button" className="dy-folder-next" onClick={() => onJump(last ? 0 : index + 1)}>{last ? "back to the first project ↑" : `next: ${nextTitle} ↓`}</button>}
    </footer>
  </article>;
}

type Props = {
  projects: Project[];
  active: number;
  shown: boolean;
  onSelect: (index: number) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  onTouchStart?: (event: TouchEvent<HTMLElement>) => void;
  onTouchEnd?: (event: TouchEvent<HTMLElement>) => void;
  folderRef?: Ref<HTMLElement>;
  children?: ReactNode;
};

/** Projects as a leather folder seen from the front: every story on one long sheet, with a divider that jumps to each. */
export default function ProjectFolder({ projects, active, shown, onSelect, onKeyDown, onTouchStart, onTouchEnd, folderRef, children }: Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  // The project the reader scrolled to; choosing that one again must not jerk the sheet back to its top.
  const scrolledTo = useRef(active);
  // While a picked story glides into view, the dividers wait for it to land instead of flickering past the others.
  const gliding = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A divider, arrow or link picked a project: bring its story to the top of the sheet.
  useEffect(() => {
    const page = pageRef.current;
    if (!page || !shown || active === scrolledTo.current) return;
    scrolledTo.current = active;
    const story = page.querySelector<HTMLElement>(`[data-index="${active}"]`);
    const still = document.querySelector(".dy-still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!story) return;
    if (!still) gliding.current = setTimeout(land, 150);
    page.scrollTo({ top: story.offsetTop - parseFloat(getComputedStyle(page).paddingTop), behavior: still ? "auto" : "smooth" });
  }, [active, shown]);

  // Opening the folder at a project (from a link like #projects/floraquest) starts at that story.
  useEffect(() => {
    const page = pageRef.current;
    if (!page || !shown) return;
    const story = page.querySelector<HTMLElement>(`[data-index="${active}"]`);
    page.scrollTop = story && active > 0 ? story.offsetTop - parseFloat(getComputedStyle(page).paddingTop) : 0;
    scrolledTo.current = active;
    // Only when the folder opens; later changes scroll smoothly above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  // As the reader scrolls, the divider of the story in view stands forward.
  function land() {
    gliding.current = null;
  }
  function followScroll() {
    if (gliding.current) { clearTimeout(gliding.current); gliding.current = setTimeout(land, 150); return; }
    const page = pageRef.current;
    if (!page) return;
    const line = page.scrollTop + page.clientHeight * .35;
    const stories = [...page.querySelectorAll<HTMLElement>("[data-index]")];
    const atEnd = page.scrollTop + page.clientHeight >= page.scrollHeight - 2;
    const current = atEnd ? stories.length - 1 : Math.max(0, stories.filter(story => story.offsetTop <= line).length - 1);
    if (current !== scrolledTo.current) { scrolledTo.current = current; onSelect(current); }
  }

  function select(index: number) {
    const next = (index + projects.length) % projects.length;
    onSelect(next);
    tabRefs.current[next]?.focus();
  }
  function tabKeys(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: projects.length - 1 };
    if (event.key in moves) { event.preventDefault(); event.stopPropagation(); select(moves[event.key]); }
  }

  return <section className="dy-folder" ref={folderRef} aria-label="Projects folder. Scroll through every project, or use the dividers to jump to one." aria-hidden={!shown} inert={!shown} onKeyDown={onKeyDown} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <div className="dy-folder-leather" aria-hidden="true"><Stitching/></div>
    <SnapStrap/>
    <div className="dy-folder-stack" aria-hidden="true"/>
    <nav className="dy-dividers" aria-label="Jump to a project">
      {projects.map((item, i) => {
        const [long, short] = dividerNames[item.id] ?? [item.title, item.title];
        return <button key={item.id} ref={el => { tabRefs.current[i] = el; }} className="dy-divider" aria-current={i === active ? "true" : undefined} aria-label={item.title} style={{ "--tab": dividerColours[i % dividerColours.length], "--i": i } as CSSProperties} onClick={() => onSelect(i)} onKeyDown={tabKeys}>
          <small aria-hidden="true">0{i + 1}</small><span className="dy-divider-long" aria-hidden="true">{long}</span><span className="dy-divider-short" aria-hidden="true">{short}</span>
        </button>;
      })}
    </nav>
    <div className="dy-folder-sheet">
      <div className="dy-folder-page" ref={pageRef} tabIndex={0} aria-label="Every project, one after another" onScroll={followScroll}>
        {/* One sheet per project, with the binder's rings between each pair as the reader scrolls past. */}
        {projects.map((item, i) => <Fragment key={item.id}>
          {i > 0 && <div className="dy-folder-join"><BinderRings spine="horizontal"/></div>}
          <Story project={item} index={i} count={projects.length} nextTitle={projects[(i + 1) % projects.length].title} onJump={onSelect}/>
        </Fragment>)}
      </div>
    </div>
    <div className="dy-folder-lip" aria-hidden="true"><span className="dy-folder-lip-stitch"><Stitching/></span></div>
    {children}
  </section>;
}
