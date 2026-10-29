import type { Project } from "./projects/data";
import { journalNotes } from "./journal-notes";
import "./journal-project-pages.css";

function Doodle({ kind = "star", className = "" }: { kind?: "star" | "arrow" | "cup" | "sprig"; className?: string }) {
  return <svg viewBox="0 0 100 100" className={`jn-doodle ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "arrow" ? <><path d="M8 20c70-13 76 44 27 49-17 2-23-14-8-18 18-4 29 21 61 4" strokeDasharray="3 5"/><path d="m74 48 15 6-8 14"/></> : kind === "cup" ? <><path d="M20 40h48l-5 36c-12 9-25 9-38 0Zm49 4c26-10 23 29-3 22M13 86c24 7 47 7 65-1M34 30c-13-13 14-14 1-27m16 27C38 17 65 16 52 3"/></> : kind === "sprig" ? <><path d="M48 94c7-29 7-54 3-83"/><path d="M52 64C14 63 23 38 51 57c2-28 26-33 20-15-3 9-13 11-19 15M53 35C24 32 28 9 51 28c-1-26 19-30 16-14-1 8-10 11-15 14M49 85C22 84 21 66 49 77c8-27 32-26 23-11-5 8-17 10-23 11"/></> : <><path d="m48 8 10 28 29 2-22 18 7 28-24-16-24 17 7-29L9 39l29-3Z"/><path d="m79 4 3 10 11 1-9 7 3 10-9-6-9 6 3-11-8-6 10-1Z"/></>}
  </svg>;
}

export function JournalContents({ projects }: { projects: Project[] }) {
  return <div className={`jn-page jn-contents ${projects.length > 3 ? "jn-contents-four" : ""}`}>
    <header className="jn-running"><span>collected projects</span><span>a small index</span></header>
    <h2 className="jn-title">Things I’ve<br/><em>been making.</em></h2>
    <p className="jn-contents-note">Read the story, or try a little something.</p>
    <ol className="jn-contents-list">
      {projects.map((project, i) => {
        const destination = project.site ?? project.links.find(link => link.external);
        const visitLabel = project.id === "energy-changes" ? "try lesson" : project.id === "floraquest" ? "play game" : "visit café";
        return <li key={project.id} className="jn-content-slip">
          <span className="jn-content-no" aria-hidden="true">0{i + 1}</span>
          <a className="jn-content-story" href={`/projects/${project.id}`} aria-label={`Read about ${project.title}`}>
            <img src={project.cover.src} alt=""/>
            <span><strong>{project.title}</strong><em>{journalNotes[project.id].heading}</em></span>
          </a>
          <div className="jn-content-actions">
            <a className="jn-cutout-link" href={`/projects/${project.id}`} aria-label={`Read the story of ${project.title}`}>read story <span aria-hidden="true">↗</span></a>
            {destination ? <a className="jn-cutout-link jn-cutout-visit" href={destination.href} target="_blank" rel="noopener noreferrer" aria-label={`${destination.label} — ${project.title} (opens in a new tab)`}>{visitLabel} <span aria-hidden="true">↗</span></a> : <span className="jn-prototype-note">private prototype</span>}
          </div>
        </li>;
      })}
    </ol>
    <p className="jn-contents-foot">ideas, experiments & the bits in between ↗</p><Doodle kind="sprig"/>
  </div>;
}

export function JournalIntroduction() {
  return <div className="jn-page jn-introduction"><header className="jn-running"><span>from the worktable</span><span>always in progress</span></header><h2 className="jn-title">A mind full<br/><em>of little things.</em></h2><p className="jn-writing">A café. A plant game. Chemistry, made visible. And a field guide for everyday walks.</p><div className="jn-intro-scraps"><figure className="jn-intro-photo"><span className="dy-tape" aria-hidden="true"/><img src="/visual-diary/london-in-march.jpg" alt="Botanical sketches from my sketchbook"/><figcaption>looking closely, on & off the screen</figcaption></figure><div className="jn-intro-note"><span className="jn-paperclip" aria-hidden="true"/><p>Most things start<br/>with a question.</p><p>Then a sketch.<br/>Then a messy first try.</p><span>and then another. ♡</span></div><Doodle kind="star"/></div><p className="jn-writing jn-intro-bottom">The first thoughts, the experiments, the changes, and the little things I’m taking into whatever comes next.</p><span className="jn-cutout-words"><span>make a little.</span> <span>learn a little.</span></span></div>;
}
