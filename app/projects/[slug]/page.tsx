import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactBand, Footer, TopBar } from "../../chrome";
import { ArrowRight, Ring } from "../../marks";
import { getProject, projects } from "../data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found — Tammana Kapoor" };
  return {
    title: `${p.title} — Tammana Kapoor`,
    description: p.tagline,
    openGraph: { title: `${p.title} — Tammana Kapoor`, description: p.tagline, images: [p.cover.src] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="top" className="subpage desk-subpage">
      <TopBar current="projects" />

      <div className="subpage-window page-shell">
        <div className="subpage-titlebar">
          <span className="subpage-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>tammana / projects / {p.id}</span>
          <a href="/projects" aria-label="Back to all projects">×</a>
        </div>
        <div className="subpage-window-content">
          <p className="crumb-link"><a className="text-link" href="/projects"><ArrowRight className="arrow-inline arrow-inline-back" /> All projects</a></p>

          <article className="case case-single" aria-labelledby="project-title">
            <div className="case-head">
              <div className="specimen">
                <span>{p.number}</span>
                <span>{p.tagList.join(" · ")}</span>
                <span className="specimen-status">{p.status}</span>
              </div>
              <h1 id="project-title">{p.title}</h1>
              <p className="case-tagline">{p.tagline}</p>
              <section className="case-block case-idea">
                <h3>The idea</h3>
                <p>{p.idea}</p>
              </section>
            </div>

            <figure className={`case-cover ${index % 2 ? "tilt-right" : "tilt-left"}`}>
              <img src={p.cover.src} alt={p.cover.alt} />
              <figcaption className="note">{p.cover.note}</figcaption>
            </figure>

            <div className="case-body">
              <section className="case-block">
                <h3>How it went</h3>
                <ol className="timeline">
                  {p.timeline.map((m, n) => (
                    <li key={m.label}>
                      <span className="ringed timeline-n">
                        {String(n + 1).padStart(2, "0")}
                        <Ring className="ring-mark" />
                      </span>
                      <span className="timeline-label">{m.label}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="case-block">
                <h3>Design process</h3>
                <div className="chapters">
                  {p.chapters.map((c) => (
                    <section className="chapter" key={c.title}>
                      <h4>{c.title}</h4>
                      <div>
                        {c.text.map((t) => <p key={t}>{t}</p>)}
                        {c.figures && c.figures.length > 0 && (
                          <div className="case-figures">
                            {c.figures.map((f) => (
                              <figure className="case-figure" key={f.src}>
                                <div className="case-figure-frame">
                                  <div className="case-figure-bar" aria-hidden="true">
                                    <span className="subpage-dots"><i /><i /><i /></span>
                                    <span>app.lumi.education</span>
                                  </div>
                                  <img src={f.src} alt={f.alt} loading="lazy" />
                                </div>
                                <figcaption>{f.caption}</figcaption>
                              </figure>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  ))}
                </div>
                {p.quote && (
                  <blockquote className="case-quote">
                    <p>“{p.quote.text}”</p>
                    <footer>{p.quote.by}</footer>
                  </blockquote>
                )}
              </section>

              <section className="case-block">
                <h3>{p.ledgerTitle}</h3>
                <div className="ledger" role="table" aria-label={`What changed in ${p.title}`}>
                  <div className="ledger-row ledger-head" role="row">
                    {p.ledgerHead.map((h) => <span role="columnheader" key={h}>{h}</span>)}
                  </div>
                  {p.changes.map((c) => (
                    <div className="ledger-row" role="row" key={c.tried}>
                      <span role="cell">{c.tried}</span>
                      <span role="cell">{c.happened}</span>
                      <span role="cell">{c.became}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="case-foot">
                <section className="case-block learned">
                  <h3>What I learned</h3>
                  <ul>
                    {p.learned.map((l) => <li key={l}>{l}</li>)}
                  </ul>
                </section>

                <div className="link-row">
                  {p.links.map((l) => (
                    <a key={l.href} className="text-link" href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noreferrer" : undefined}>
                      {l.label} <ArrowRight className="arrow-inline" />
                    </a>
                  ))}
                  {p.id === "floraquest" && <small>Public beta · still changing</small>}
                </div>
              </div>
            </div>
          </article>

          <nav className="project-next" aria-label="Next project">
            <span className="section-kicker">Next project</span>
            <a href={`/projects/${next.id}`}>
              <span>{next.number}</span>
              <strong>{next.title}</strong>
              <ArrowRight className="arrow-inline" />
            </a>
            <a className="text-link" href="/projects">All projects <ArrowRight className="arrow-inline" /></a>
          </nav>
        </div>
      </div>

      <ContactBand />
      <Footer />
    </main>
  );
}
