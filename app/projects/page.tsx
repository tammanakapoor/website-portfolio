import type { Metadata } from "next";
import { ContactBand, Footer, TopBar } from "../chrome";
import { ArrowRight, Ring, Tape } from "../marks";

export const metadata: Metadata = {
  title: "Projects — Tammana Kapoor",
  description: "Daily Café and FloraQuest: what they are, how they were made, what changed after people used them, and the thinking behind them.",
};

type Chapter = { title: string; text: string[] };
type Moment = { label: string };
type Change = { tried: string; happened: string; became: string };

const projects = [
  {
    id: "daily-cafe",
    number: "No. 01",
    tags: "Website · Illustration · Sound",
    status: "Live",
    title: "Daily Café",
    tagline: "A quiet café-style webpage. You arrive, press one button, and music starts with the sound of a coffee shop underneath it.",
    cover: { src: "/daily-cafe-cover.jpg", alt: "Hand-drawn Daily Café interior with a barista, a menu board, hanging plants and a guest at a table", note: "drawn frame by frame, mostly at night" },
    idea: "A hobby project, made for people who miss being in a café, and for me. Sometimes you need a bit of noise in the background so that it is not so quiet. You walk in, nobody asks anything of you, and there is music and a low hum of people. Nothing makes a sound until you press the button. After that it looks after itself: tracks crossfade, the ambience never restarts, and when the playlist ends it quietly begins again.",
    timeline: [
      { label: "First version live: one button, one room recording" },
      { label: "Busier room with a door bell, then the bell silenced" },
      { label: "Full licensed playlist, shuffled" },
      { label: "Indian classical and indie join the day" },
      { label: "Hand-drawn café brought into the player" },
      { label: "Renamed for a day, then changed back" },
    ] as Moment[],
    chapters: [
      {
        title: "Why",
        text: [
          "I missed the sound of a café more than the coffee. Working from home is too quiet, and a playlist on its own does not fix that. What I wanted was the room: people, cups, movement, and music that nobody chose for me. The first thing I wrote was a list of everything the page would not have. Accounts, volume sliders, settings, rooms, search, navigation. One button.",
        ],
      },
      {
        title: "How I made it",
        text: [
          "I drew the room first. The barista, the tiled counter, the menu board, the plants on the shelf. That decided the mood before any code, and anything that would not fit in the drawing did not go on the page. The original plan used YouTube and commercial songs. Licensing made that impossible to do properly, so every track is Creative Commons or public domain, self-hosted, and credited on screen while it plays.",
          "The sound is two layers. A small riverside café in Worcestershire is the room. A barista layer, recorded beside an espresso machine in Brazil, fades in twenty-five seconds later. The music is ninety-six tracks from fifty-nine artists, ordered by measured loudness so the day rises to midday and softens towards closing.",
        ],
      },
      {
        title: "What changed after people listened",
        text: [
          "I sat friends down with it and did not explain anything. The first room was too still, so it became a busier café with a door bell. The bell was then the one thing everyone mentioned, so it went. Early on the playlist was mostly one artist and people could tell. Vocal tracks pulled attention, so it is instrumental only now. The artwork was tried on blue, then redrawn on white. I even renamed it once and changed it back the same day.",
        ],
      },
    ] as Chapter[],
    ledgerTitle: "Tried, and dropped",
    ledgerHead: ["Tried", "What happened", "What it became"],
    changes: [
      { tried: "YouTube playback and a commercial playlist", happened: "Could not be licensed properly", became: "Self-hosted Creative Commons tracks, credited on screen" },
      { tried: "A quiet room recording", happened: "Felt empty", became: "A busier riverside café, people and cups" },
      { tried: "A door bell in the room", happened: "The only thing anyone mentioned", became: "No bell; the machine fades in after twenty-five seconds" },
      { tried: "Vocal Indian classical, a country set", happened: "Pulled attention from whatever you were doing", became: "Instrumental only" },
    ] as Change[],
    learned: ["Licensing is a design material, not paperwork.", "Restraint is a feature people can feel.", "Measure before you sort: loudness made a better playlist than taste alone."],
    links: [{ label: "Visit the café", href: "https://daily-cafe-psi.vercel.app", external: true }],
  },
  {
    id: "floraquest",
    number: "No. 02",
    tags: "Learning game · Product design · UX research",
    status: "Public beta",
    title: "FloraQuest",
    tagline: "A friendly guessing game that turns plant knowledge into a trail of clues, branches and discoveries.",
    cover: { src: "/floraquest-cover.png", alt: "FloraQuest title with a sunflower, a fern, a bee and a small field notebook", note: "still growing" },
    idea: "In the classroom, a guess made before the answer is what makes the answer stick. FloraQuest is built on that. Three small games—Mystery Plant, Picture Guess and Plant Facts—give you a clue and let you commit to a name. Every plant you find lands in a Field Journal that grows the more you play.",
    timeline: [
      { label: "Private beta as PlantKin, thirty plants" },
      { label: "Public beta with a feedback page" },
      { label: "Renamed FloraQuest; difficulty paths" },
      { label: "Scoring, streaks and achievements" },
      { label: "A wrong guess becomes a lesson; accessibility pass" },
      { label: "Deployed publicly" },
      { label: "Full visual redesign" },
      { label: "325 plants; UK and India seasons" },
    ] as Moment[],
    chapters: [
      {
        title: "The hypothesis",
        text: [
          "A guess made before the answer makes the answer stick. I have watched that work in a classroom for years. The game exists to test whether the habit survives outside one, with no teacher in the room and nobody obliged to keep going.",
        ],
      },
      {
        title: "What I needed to learn first",
        text: [
          "Three questions shaped the first beta. Do people understand the rules without being told? Is a wrong guess motivating or discouraging? Are the photographs recognisable to a beginner, or only to me? Everything else could wait.",
        ],
      },
      {
        title: "How I tested it",
        text: [
          "A small private beta a week after the first build, then a public one. A feedback page sorted every note into four kinds: an idea, a confusing moment, a bug, or praise. I sat with people while they played and noted where they paused, what they tapped, and when they stopped. Alongside that, automated checks ran on every change: a content review of every plant, a session audit, an accessibility audit, and a script that checks the design system against its own rules.",
        ],
      },
      {
        title: "What I saw",
        text: [
          "Confusion clustered in three places. Early hints that gave the answer away, a permanent score strip that pulled eyes from the clue, and a homepage that offered three equal doors to a first-time player. Phone users met sideways scrolling. Keyboard and screen-reader users could not use the plant search at all. End-of-round summaries read like a report card and nobody read them.",
          "The wrong-guess question had a clear answer. A penalty on its own taught nothing. A wrong guess that shows how the two plants differ kept people playing.",
        ],
      },
      {
        title: "What changed because of it",
        text: [
          "Every observation above became a change, and the table below is the record. Phone layouts were rebuilt. The plant search works from the keyboard and announces its results. Attempts, hints and achievements are read aloud as they change, and motion switches off when a device asks for it. A first-time player gets a guided first round.",
          "The larger finding was that the game worked but looked like admin. By September I had painted a new hero illustration, written a design analysis against it, and rebuilt every screen: warm paper, deep green ink, two typefaces, one soft shadow, and a single orange accent that appears once per screen.",
        ],
      },
      {
        title: "What I would measure next",
        text: [
          "Round completion by game, time to first solve for a new player, and whether people come back after a week. The beta records aggregate counts, not retention, so that is the gap. The catalogue is at 325 reviewed plants with seasonal collections for the United Kingdom and India, and the next work is on the clues themselves: shorter, kinder, and more like something a friend would say on a walk.",
        ],
      },
    ] as Chapter[],
    ledgerTitle: "Findings, and what changed",
    ledgerHead: ["What I tried", "What I observed", "What I changed"],
    changes: [
      { tried: "End-of-session summaries", happened: "Read like a report card; nobody read them", became: "Removed the same day; scores live in the journal" },
      { tried: "A permanent score strip", happened: "Pulled eyes away from the clue", became: "Score appears only in the journal and on sharing" },
      { tried: "A wrong guess as a penalty", happened: "Taught nothing; people stopped", became: "A wrong guess shows how the two plants differ" },
      { tried: "Three equal games on the homepage", happened: "New players hesitated at the door", became: "A guided first round; Picture Guess suggested first" },
      { tried: "Mouse-only plant search", happened: "Unusable by keyboard and screen reader", became: "Keyboard listbox with live announcements" },
      { tried: "Emoji icons and a dashboard", happened: "Felt like admin, not a walk", became: "Warm paper, one accent, hand-painted hero" },
    ] as Change[],
    learned: ["Content is the product. Reviewing 325 plants shaped the game more than any feature.", "Rules you can say in one breath are rules people trust.", "A design system needs a way to check itself."],
    links: [{ label: "Play FloraQuest", href: "https://floraquest.tammana4513.workers.dev", external: true }],
  },
];

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
          <header className="page-header">
            <p className="section-kicker">Projects · selected work</p>
            <h1>Two things I made, and how I thought about them.</h1>
            <p className="page-intro">Both are self-initiated. Both started with a drawing or a lesson rather than a feature list. These pages are the working notes: what the idea was, what people said when they used it, what changed because of that, and what I would tell myself at the start.</p>
            <nav className="jump-links" aria-label="Jump to project">
              {projects.map((p) => (
                <a key={p.id} href={`#${p.id}`}>{p.number} <span>{p.title}</span> <ArrowRight className="arrow-inline" /></a>
              ))}
            </nav>
          </header>

          {projects.map((p, i) => (
            <article className="case" id={p.id} key={p.id} aria-labelledby={`${p.id}-title`}>
              <div className="case-head">
                <div className="specimen">
                  <span>{p.number}</span>
                  <span>{p.tags}</span>
                  <span className="specimen-status">{p.status}</span>
                </div>
                <h2 id={`${p.id}-title`}>{p.title}</h2>
                <p className="case-tagline">{p.tagline}</p>
                <section className="case-block case-idea">
                  <h3>The idea</h3>
                  <p>{p.idea}</p>
                </section>
              </div>

              <figure className={`case-cover ${i % 2 ? "tilt-right" : "tilt-left"}`}>
                <Tape className="tape-corner tape-corner-left" />
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
                        </div>
                      </section>
                    ))}
                  </div>
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
                      {p.learned.map((l) => <li key={l} className="note">{l}</li>)}
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
          ))}

          <p className="back-link"><a className="text-link" href="/">Back to the desk <ArrowRight className="arrow-inline" /></a></p>
        </div>
      </div>

      <ContactBand />
      <Footer />
    </main>
  );
}
