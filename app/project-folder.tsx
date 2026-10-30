import { Fragment, useRef } from "react";
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

/** Sheets of one project's story: the cover, then the story two parts at a time. */
function sheets(project: Project, footer: ReactNode): ReactNode[] {
  const note = journalNotes[project.id];
  const destination = project.site ?? project.links.find(link => link.external);
  const cover = <>
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
  </>;
  if (!note) return [<>{cover}{footer}</>];
  return [
    cover,
    <>
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
    </>,
    <>
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
    </>,
    <>
        <section className="dy-folder-story">
          <span className="dy-folder-step">05 / notes to keep</span>
          <h3>A few things <em>for the next page.</em></h3>
          <ul className="dy-folder-takeaways">{note.takeaways.map(line => <li key={line}>{line}</li>)}</ul>
          <p className="dy-folder-aside">{note.next}</p>
        </section>
      {footer}
    </>,
  ];
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

/** Projects as a leather folder seen from the front, one divider per project. A project's story runs over several sheets, with the binder's rings between them. */
export default function ProjectFolder({ projects, active, shown, onSelect, onKeyDown, onTouchStart, onTouchEnd, folderRef, children }: Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = projects[active];

  function select(index: number) {
    const next = (index + projects.length) % projects.length;
    onSelect(next);
    tabRefs.current[next]?.focus();
  }
  function tabKeys(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: projects.length - 1 };
    if (event.key in moves) { event.preventDefault(); event.stopPropagation(); select(moves[event.key]); }
  }

  const footer = <footer className="dy-folder-end">
    <p>{project.id === "fieldnotes" ? "still growing, one walk at a time." : "still learning. still making."} <span aria-hidden="true">♡</span></p>
    {projects.length > 1 && <button type="button" className="dy-folder-next" onClick={() => select(active + 1)}>next: {projects[(active + 1) % projects.length].title} →</button>}
  </footer>;

  return <section className="dy-folder" ref={folderRef} aria-label="Projects folder. Use the divider tabs to choose a project." aria-hidden={!shown} inert={!shown} onKeyDown={onKeyDown} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <div className="dy-folder-leather" aria-hidden="true"><Stitching/></div>
    <SnapStrap/>
    <div className="dy-folder-stack" aria-hidden="true"/>
    <div className="dy-dividers" role="tablist" aria-label="Projects">
      {projects.map((item, i) => {
        const [long, short] = dividerNames[item.id] ?? [item.title, item.title];
        return <button key={item.id} ref={el => { tabRefs.current[i] = el; }} id={`folder-tab-${item.id}`} className="dy-divider" role="tab" aria-selected={i === active} aria-controls="folder-sheet" tabIndex={i === active ? 0 : -1} style={{ "--tab": dividerColours[i % dividerColours.length], "--i": i } as CSSProperties} onClick={() => onSelect(i)} onKeyDown={tabKeys}>
          <small aria-hidden="true">0{i + 1}</small><span className="dy-divider-long">{long}</span><span className="dy-divider-short" aria-hidden="true">{short}</span>
        </button>;
      })}
    </div>
    <div className="dy-folder-sheet" id="folder-sheet" role="tabpanel" aria-labelledby={`folder-tab-${project.id}`}>
      {/* Keyed by project, so switching dividers starts the new story from its first sheet. */}
      <article className="dy-folder-page" key={project.id} tabIndex={0} aria-label={`${project.title}: the story`}>
        {sheets(project, footer).map((sheet, i) => <Fragment key={i}>
          {i > 0 && <div className="dy-folder-join"><BinderRings spine="horizontal"/></div>}
          <div className="dy-folder-paper">{sheet}</div>
        </Fragment>)}
      </article>
    </div>
    {children}
  </section>;
}
