"use client";

import { useState, type MouseEvent } from "react";

const skills = [
  "Inclusive learning",
  "Science teaching",
  "UX / UI design",
  "Visual storytelling",
  "Creative coding",
  "MSc Botany",
];

const chapters = [
  {
    year: "Now",
    title: "Learning Support Assistant",
    place: "Lady Margaret School · London",
    text: "Supporting students with additional learning needs in science and mathematics, running interventions and adapting lessons so more learners can participate with confidence.",
    color: "pink",
  },
  {
    year: "2022—Now",
    title: "Freelance UX/UI Designer",
    place: "Independent practice",
    text: "Creating thoughtful interfaces, brand identities and visual stories—often where education, creativity and friendly digital experiences meet.",
    color: "blue",
  },
  {
    year: "Earlier",
    title: "Tutor, researcher & graphic designer",
    place: "India · London",
    text: "A mix of private teaching, scientific research and café design shaped the way I communicate: clearly, visually and with care for the person on the other side.",
    color: "green",
  },
];

export default function Home() {
  const [playMode, setPlayMode] = useState(false);

  const tilt = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
  };

  const resetTilt = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <main className={playMode ? "site play-mode" : "site"} id="top">
      <header className="topbar page-shell">
        <a className="brand" href="#top" aria-label="Tammana Kapoor, home">
          <span className="brand-mark" aria-hidden="true">TK</span>
          <span>Tammana Kapoor</span>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#work">Projects</a>
          <a href="#story">My story</a>
          <a href="#toolkit">Toolkit</a>
          <a className="nav-contact" href="mailto:tammana4513@gmail.com">Say hello ↗</a>
        </nav>
      </header>

      <div className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true" /> Educator · Designer · Digital maker</p>
            <h1 id="hero-title">I make learning feel <span>clearer, kinder</span> & more curious.</h1>
            <p className="intro">Hello, I’m Tammana—a learning support assistant and UX/UI designer in London. I turn complex ideas into welcoming lessons, thoughtful interfaces and playful digital experiments.</p>
            <div className="hero-actions">
              <a className="button button-yellow" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
              <button className="play-button" type="button" aria-pressed={playMode} onClick={() => setPlayMode((value) => !value)}>
                <span aria-hidden="true">{playMode ? "✦" : "✿"}</span>
                {playMode ? "Calm it down" : "Make it playful"}
              </button>
            </div>
          </div>

          <div className="creative-desk" aria-label="A playful illustrated portrait surrounded by Tammana's skills">
            <span className="tape" aria-hidden="true" />
            <div className="portrait-note">
              <div className="portrait" aria-hidden="true">
                <span className="hair" />
                <span className="head"><i /><b /><em /></span>
                <span className="shirt" />
              </div>
              <strong>Curious by nature</strong>
              <small>TEACHER · DESIGNER · MAKER</small>
            </div>
            <span className="sticker sticker-flower" aria-hidden="true">✿</span>
            <span className="sticker sticker-sen">Inclusive<br />learning ♥</span>
            <span className="sticker sticker-ux">UX / UI<br />design</span>
            <span className="sticker sticker-msc">MSc<br />Botany</span>
            <span className="scribble" aria-hidden="true" />
          </div>
        </section>

        <section className="skill-strip" id="toolkit" aria-label="Skills and experience">
          {skills.map((skill, index) => <span className={`skill-chip chip-${index + 1}`} key={skill}>{index === 0 ? "✦ " : ""}{skill}</span>)}
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Selected experiments</p>
              <h2 id="work-title">From my playground</h2>
            </div>
            <p>Two self-initiated projects where illustration, interaction and curiosity get to share the same table.</p>
          </div>

          <div className="projects">
            <article className="project project-cafe" onMouseMove={tilt} onMouseLeave={resetTilt}>
              <div className="project-copy">
                <span className="project-label">Website · Illustration · Sound</span>
                <p className="project-number">01</p>
                <h3>Daily Café</h3>
                <p>An illustrated ambient café where visitors can settle in, play music and enjoy a small moment of calm.</p>
                <a href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer">Visit the café <span aria-hidden="true">↗</span></a>
              </div>
              <div className="project-visual">
                <img src="/daily-cafe.png" alt="Hand-drawn Daily Café website showing a barista, plants and colourful lamps" />
                <span className="visual-sticker">Coffee + music</span>
              </div>
            </article>

            <article className="project project-flora" onMouseMove={tilt} onMouseLeave={resetTilt}>
              <div className="project-copy">
                <span className="project-label">Learning game · Product design</span>
                <p className="project-number">02</p>
                <h3>FloraQuest</h3>
                <p>A plant-guessing game that turns taxonomy into a friendly trail of clues, branches and discoveries.</p>
                <a href="http://localhost:3111/play/mystery" target="_blank" rel="noreferrer">Open local preview <span aria-hidden="true">↗</span></a>
                <small>In development · local demo</small>
              </div>
              <div className="project-visual">
                <img src="/floraquest.png" alt="FloraQuest game interface with mystery clues, a guess field and a branching discovery tree" />
                <span className="visual-sticker">275 discoveries</span>
              </div>
            </article>
          </div>
        </section>

        <section className="story-section" id="story" aria-labelledby="story-title">
          <div className="story-intro">
            <p className="section-kicker">The useful bit</p>
            <h2 id="story-title">A many-hat kind of person.</h2>
            <p>My path moves between classrooms, design tools and scientific curiosity. The common thread is helping people understand, participate and feel welcome.</p>
            <a className="text-link" href="https://www.behance.net/tammanakapoor" target="_blank" rel="noreferrer">More visual work on Behance ↗</a>
          </div>
          <div className="chapters">
            {chapters.map((chapter) => (
              <article className={`chapter chapter-${chapter.color}`} key={chapter.title}>
                <span>{chapter.year}</span>
                <div>
                  <h3>{chapter.title}</h3>
                  <p className="chapter-place">{chapter.place}</p>
                  <p>{chapter.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="learning-section" aria-labelledby="learning-title">
          <div className="learning-title-card">
            <span aria-hidden="true">✎</span>
            <p className="section-kicker">Learning + making</p>
            <h2 id="learning-title">Serious about the work.<br />Never too serious about the process.</h2>
          </div>
          <div className="qualification qualification-yellow">
            <small>EDUCATION</small>
            <strong>Bachelor of Education</strong>
            <span>Cluster University of Jammu</span>
          </div>
          <div className="qualification qualification-purple">
            <small>SCIENCE BACKGROUND</small>
            <strong>Master of Science</strong>
            <span>Botany · HNBG University</span>
          </div>
          <div className="tools-card">
            <small>TOOLS I REACH FOR</small>
            <p>Figma · Sketch · Illustrator · Photoshop · PowerPoint · Excel</p>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <span className="contact-doodle" aria-hidden="true">✦</span>
          <p className="section-kicker">One more curious idea?</p>
          <h2 id="contact-title">Let’s make it feel<br /><span>wonderful.</span></h2>
          <p>I’m always happy to talk about inclusive learning, thoughtful design and small digital experiments.</p>
          <a className="button button-coral" href="mailto:tammana4513@gmail.com">Send me a note ↗</a>
        </section>

        <footer>
          <p>Designed and made with curiosity by Tammana Kapoor.</p>
          <div><a href="mailto:tammana4513@gmail.com">Email</a><a href="https://www.behance.net/tammanakapoor" target="_blank" rel="noreferrer">Behance ↗</a><a href="#top">Back to top ↑</a></div>
        </footer>
      </div>
    </main>
  );
}
