import type { Metadata } from "next";
import { ContactBand, Footer, TopBar } from "../chrome";
import { ArrowRight, Ring, Tape } from "../marks";

export const metadata: Metadata = {
  title: "Projects — Tammana Kapoor",
  description: "Daily Café and FloraQuest: what they are, how they were made, and the thinking behind them.",
};

type Step = { title: string; text: string };

const projects = [
  {
    id: "daily-cafe",
    number: "No. 01",
    tags: "Website · Illustration · Sound",
    status: "Live",
    title: "Daily Café",
    tagline: "A quiet café-style webpage. You arrive, press one button, and music starts with the sound of a coffee shop underneath it.",
    cover: { src: "/daily-cafe-cover.jpg", alt: "Hand-drawn Daily Café interior with a barista, a menu board, hanging plants and a guest at a table", note: "drawn frame by frame, mostly at night" },
    idea: "I wanted a page that behaves like a good café: you walk in, nobody asks anything of you, and there is music and a low hum of people. Nothing on the page makes a sound until you choose to press the button. After that it looks after itself—tracks crossfade, the ambience never restarts, and when the playlist ends it quietly begins again.",
    steps: [
      { title: "Start by subtracting", text: "The first list I wrote was everything the café would not have: accounts, volume sliders, settings, weather, rooms, search, navigation. One button became the whole interface. Every later decision was measured against that list." },
      { title: "Draw the room by hand", text: "The illustration is mine—the barista, the tiled counter, the menu board, the plants on the shelf. Drawing it decided the mood before a line of code existed, and it kept the interface honest: anything that would not fit in the drawing did not belong on the page." },
      { title: "Two layers of sound, not one", text: "The room bed is a small riverside café in Worcestershire: people, cups, movement. The barista layer, recorded beside an espresso machine in Brazil, fades in only after twenty-five seconds. Arriving somewhere should not mean a grinder in your face." },
      { title: "Music as an energy curve", text: "Ninety-six tracks from fifty-nine artists, all Creative Commons or public domain, nearly six hours. I measured every track’s loudness and ordered the day from quietest at opening to loudest around midday, then softer towards closing. No two tracks in a row share an artist." },
      { title: "Change the brief when it is wrong", text: "The original plan used YouTube playback and a fixed list of commercial songs. Licensing made that impossible to do properly, so the café became self-hosted and every track is credited on screen while it plays. The constraint produced a better café." },
    ] as Step[],
    learned: ["Licensing is a design material, not paperwork.", "Restraint is a feature people can feel.", "Measure before you sort: loudness made a better playlist than taste alone."],
    links: [{ label: "Visit the café", href: "https://daily-cafe-psi.vercel.app", external: true }],
  },
  {
    id: "floraquest",
    number: "No. 02",
    tags: "Learning game · Product design",
    status: "In development",
    title: "FloraQuest",
    tagline: "A friendly guessing game that turns plant knowledge into a trail of clues, branches and discoveries.",
    cover: { src: "/floraquest-cover.png", alt: "FloraQuest title with a sunflower, a fern, a bee and a small field notebook", note: "still growing" },
    idea: "In the classroom, a guess made before the answer is what makes the answer stick. FloraQuest is built on that. Three small games—Mystery Plant, Picture Guess and Plant Facts—give you a clue and let you commit to a name. Every plant you find lands in a Field Journal that grows the more you play.",
    steps: [
      { title: "Teach the way I teach", text: "The first clue is always free. A wrong guess costs a little, a hint costs a bit more, and a name the game does not recognise costs nothing at all. Every round starts at 100 points so the rules fit in one sentence, and the score stays out of the way while you play." },
      { title: "Get the botany right", text: "There are 300 plants in the game and each one has been through a content and photo review. That took longer than the code. The family tree turns any group of discovered relatives into a focused round, and every reveal explains how to tell two similar plants apart." },
      { title: "One accent per screen", text: "Warm paper, deep green ink, two typefaces, one soft shadow. No white, no black, no gradients, and a single orange accent that appears once on every screen. A script audits the built site so the rules survive my own late-night edits." },
      { title: "Make it forgiving", text: "An unfinished round can be picked up for six hours. Achievements show what they need before they unlock. Collections by plant type, habitat and season mean a beginner and a keen gardener can both find a comfortable place to start." },
      { title: "Keep growing it", text: "It is still a local demo. The next work is on the clues themselves: shorter, kinder, and more like something a friend would say on a walk." },
    ] as Step[],
    learned: ["Content is the product. Reviewing 300 plants shaped the game more than any feature.", "Rules you can say in one breath are rules people trust.", "A design system needs a way to check itself."],
    links: [{ label: "Open local preview", href: "http://localhost:3111/play/mystery", external: true }],
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
            <p className="page-intro">Both are self-initiated. Both started with a drawing or a lesson rather than a feature list. These pages are the working notes: what the idea was, the decisions along the way, and what I would tell myself at the start.</p>
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
              </div>

              <figure className={`case-cover ${i % 2 ? "tilt-right" : "tilt-left"}`}>
                <Tape className="tape-corner tape-corner-left" />
                <img src={p.cover.src} alt={p.cover.alt} />
                <figcaption className="note">{p.cover.note}</figcaption>
              </figure>

              <div className="case-body">
                <section className="case-block">
                  <h3>The idea</h3>
                  <p>{p.idea}</p>
                </section>

                <section className="case-block">
                  <h3>Thought process</h3>
                  <ol className="process">
                    {p.steps.map((step, n) => (
                      <li key={step.title}>
                        <span className="ringed process-n">
                          {String(n + 1).padStart(2, "0")}
                          <Ring className="ring-mark" />
                        </span>
                        <div>
                          <h4>{step.title}</h4>
                          <p>{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

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
                  {p.id === "floraquest" && <small>Local demo · not yet public</small>}
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
