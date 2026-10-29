import { useRef } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode, Ref, TouchEvent } from "react";
import type { Project } from "./projects/data";
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

/** Projects as a leather folder seen from the front, one divider per project. */
export default function ProjectFolder({ projects, active, shown, onSelect, onKeyDown, onTouchStart, onTouchEnd, folderRef, children }: Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = projects[active];
  const destination = project.site ?? project.links.find(link => link.external);

  function select(index: number) {
    const next = (index + projects.length) % projects.length;
    onSelect(next);
    tabRefs.current[next]?.focus();
  }
  function tabKeys(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: projects.length - 1 };
    if (event.key in moves) { event.preventDefault(); event.stopPropagation(); select(moves[event.key]); }
  }

  return <section className="dy-folder" ref={folderRef} aria-label="Projects folder. Use the divider tabs to choose a project." aria-hidden={!shown} inert={!shown} onKeyDown={onKeyDown} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <div className="dy-folder-leather" aria-hidden="true"/>
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
      <article className="dy-folder-page" key={project.id}>
        <figure className={`dy-folder-photo dy-folder-photo-${project.id}`}>
          <span className="dy-tape" aria-hidden="true"/>
          <img src={project.cover.src} alt={project.cover.alt}/>
          <figcaption>{project.cover.note}</figcaption>
        </figure>
        <div className="dy-folder-copy">
          <p className="dy-folder-meta">{project.number} <i aria-hidden="true">·</i> {project.status}</p>
          <h2 className="dy-folder-title">{project.title}</h2>
          <p className="dy-folder-heading">{journalNotes[project.id]?.heading}</p>
          <ul className="dy-folder-tags" aria-label="What kind of project">{project.tagList.map(tag => <li key={tag}>{tag}</li>)}</ul>
          <p className="dy-folder-summary">{project.summary}</p>
          <div className="dy-folder-actions">
            <a className="dy-folder-link" href={`/projects/${project.id}`}>read the story <span aria-hidden="true">↗</span></a>
            {destination ? <a className="dy-folder-link dy-folder-link-quiet" href={destination.href} target="_blank" rel="noopener noreferrer" aria-label={`${destination.label} (opens in a new tab)`}>{visitLabels[project.id] ?? destination.label.toLowerCase()} <span aria-hidden="true">↗</span></a> : <span className="dy-folder-private">private prototype</span>}
          </div>
        </div>
      </article>
    </div>
    <div className="dy-folder-lip" aria-hidden="true"/>
    <div className="dy-folder-rings" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <span key={i}/>)}</div>
    {children}
  </section>;
}
