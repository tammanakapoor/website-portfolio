import type { Metadata } from "next";
import { ContactBand, Footer, TopBar } from "../chrome";
import { ArrowRight } from "../marks";
import { projects } from "./data";
import Reveal from "./reveal";

export const metadata: Metadata = {
  title: "Projects — Tammana Kapoor",
  description: "Daily Café, FloraQuest and Making Energy Changes Visible: what they are, how they were made, and what changed after people used them.",
};

export default function ProjectsPage() {
  return (
    <main id="top" className="subpage desk-subpage">
      <TopBar current="projects" />

      <div className="subpage-window page-shell">
        <div className="subpage-titlebar">
          <span className="subpage-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>tammana / project archive</span>
          <a href="/" aria-label="Return home">×</a>
        </div>
        <div className="subpage-window-content">
          <header className="page-header page-header-short projects-header">
            <div>
              <p className="section-kicker">Projects · selected work</p>
              <h1>Things I’m <span className="subpage-script">making.</span></h1>
            </div>
            <p className="page-intro">Self-initiated projects that started with a drawing or a lesson rather than a feature list. Open one to read the working notes: the idea, what people said when they used it, and what changed because of that.</p>
          </header>

          <div className="project-grid" aria-label="Projects">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <article className="project-tile" id={p.id}>
                  <div className="project-tile-meta">
                    <span className="project-tile-number">{p.number} / Project</span>
                    <span className="project-tile-status">{p.status}</span>
                  </div>
                  <h2 className="project-tile-title">{p.title}</h2>
                  <p className="project-tile-tagline">{p.tagline}</p>
                  <p className="project-tile-summary">{p.summary}</p>
                  <ul className="project-tile-tags" aria-label="Disciplines">
                    {p.tagList.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <div className="project-tile-foot">
                    {p.site && <a className="project-tile-cta" href={p.site.href} target="_blank" rel="noreferrer">{p.site.label} ↗</a>}
                    <a className="project-tile-arrow" href={`/projects/${p.id}`} aria-label={`${p.title}: read the project notes`}><ArrowRight className="project-tile-arrow-mark" /></a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="back-link"><a className="text-link" href="/">Back to the desk <ArrowRight className="arrow-inline" /></a></p>
        </div>
      </div>

      <ContactBand />
      <Footer />
    </main>
  );
}
