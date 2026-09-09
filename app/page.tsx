const skills = [
  "Inclusive learning",
  "UX / UI design",
  "Visual storytelling",
  "Creative coding",
  "Always learning",
];

const chapters = [
  {
    year: "Now",
    title: "Learning Support Assistant",
    place: "Lady Margaret School · London",
    text: "Supporting students with additional learning needs in science and mathematics, running interventions and adapting lessons so more learners can participate with confidence.",
  },
  {
    year: "2022—Now",
    title: "Freelance UX/UI Designer",
    place: "Independent practice",
    text: "Creating thoughtful interfaces, brand identities and visual stories—often where education, creativity and friendly digital experiences meet.",
  },
  {
    year: "Earlier",
    title: "Tutor, researcher & graphic designer",
    place: "India · London",
    text: "Teaching, research and café design shaped how I communicate: clearly, visually and with care for the person on the other side.",
  },
];

export default function Home() {
  return (
    <main id="top">
      <header className="topbar page-shell">
        <a className="brand" href="#top" aria-label="Tammana Kapoor, home">
          Tammana Kapoor
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#work">Projects</a>
          <a href="#outside">Outside</a>
          <a href="#story">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <div className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Creator · Curious learner · Vibe coder</p>
            <h1 id="hero-title">I learn new things, then make something with them.</h1>
            <p className="intro">Hello, I’m Tammana—a creator, somebody who likes learning new things and a self-described vibe coder. I bring together teaching, design and curiosity to make thoughtful experiences for the web.</p>
            <a className="arrow-link" href="#work">Selected work <span aria-hidden="true">↓</span></a>
          </div>

          <aside className="now-card" aria-label="What Tammana is doing now">
            <div>
              <span>Currently</span>
              <p>Learning support<br />in London</p>
            </div>
            <div>
              <span>Building</span>
              <p>Daily Café<br />FloraQuest</p>
            </div>
            <div>
              <span>Interested in</span>
              <p>Design, learning<br />and small digital ideas</p>
            </div>
          </aside>
        </section>

        <div className="skill-strip" id="toolkit" aria-label="Skills and interests">
          {skills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">01 / Selected work</p>
              <h2 id="work-title">Things I’m making.</h2>
            </div>
            <p>Two self-initiated projects built for the joy of learning, experimenting and making something useful.</p>
          </div>

          <div className="projects">
            <article className="project">
              <a className="project-image" href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer" aria-label="Visit Daily Café">
                <img src="/daily-cafe.png" alt="Hand-drawn Daily Café website showing a barista and café interior" />
              </a>
              <div className="project-copy">
                <div><span className="project-number">01</span><span>Website · Illustration · Sound</span></div>
                <h3>Daily Café</h3>
                <p>An illustrated ambient café where visitors can settle in, play music and enjoy a small moment of calm.</p>
                <a className="text-link" href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer">Visit the café ↗</a>
              </div>
            </article>

            <article className="project project-reverse">
              <a className="project-image" href="http://localhost:3111/play/mystery" target="_blank" rel="noreferrer" aria-label="Open local FloraQuest preview">
                <img src="/floraquest.png" alt="FloraQuest game interface with mystery clues and a branching discovery tree" />
              </a>
              <div className="project-copy">
                <div><span className="project-number">02</span><span>Learning game · Product design</span></div>
                <h3>FloraQuest</h3>
                <p>A friendly guessing game that turns plant knowledge into a trail of clues, branches and discoveries.</p>
                <a className="text-link" href="http://localhost:3111/play/mystery" target="_blank" rel="noreferrer">Open local preview ↗</a>
                <small>In development · local demo</small>
              </div>
            </article>
          </div>
        </section>

        <section className="outside-section" id="outside" aria-labelledby="outside-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">02 / Outside the screen</p>
              <h2 id="outside-title">Other things I enjoy.</h2>
            </div>
            <p>A small, growing visual diary of the things I make, notice and collect away from a screen.</p>
          </div>

          <div className="hobby-gallery" aria-label="Photo placeholders for Tammana's hobbies">
            <figure className="hobby hobby-tall">
              <div className="photo-placeholder" role="img" aria-label="Space for an embroidery photograph"><span>+</span></div>
              <figcaption><span>01</span> Embroidery</figcaption>
            </figure>
            <figure>
              <div className="photo-placeholder" role="img" aria-label="Space for a sketchbook photograph"><span>+</span></div>
              <figcaption><span>02</span> Sketching</figcaption>
            </figure>
            <figure>
              <div className="photo-placeholder" role="img" aria-label="Space for a photograph from a walk"><span>+</span></div>
              <figcaption><span>03</span> Walking</figcaption>
            </figure>
            <figure className="hobby hobby-wide">
              <div className="photo-placeholder" role="img" aria-label="Space for a London photograph"><span>+</span></div>
              <figcaption><span>04</span> London, lately</figcaption>
            </figure>
          </div>
          <p className="gallery-note">Photographs coming soon.</p>
        </section>

        <section className="story-section" id="story" aria-labelledby="story-title">
          <div className="story-intro">
            <p className="section-kicker">03 / A little context</p>
            <h2 id="story-title">A many-hat kind of person.</h2>
            <p>I move between classrooms, design tools and small digital experiments. The common thread is curiosity—and making things feel useful, clear and welcoming.</p>
            <a className="text-link" href="https://www.behance.net/tammanakapoor" target="_blank" rel="noreferrer">See more on Behance ↗</a>
          </div>
          <div className="chapters">
            {chapters.map((chapter) => (
              <article className="chapter" key={chapter.title}>
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

        <section className="details-section" aria-labelledby="details-title">
          <div className="details-heading">
            <p className="section-kicker">04 / Foundations</p>
            <h2 id="details-title">Learning has always been part of the work.</h2>
          </div>
          <div className="detail-list">
            <div><span>Education</span><strong>Bachelor of Education</strong><p>Cluster University of Jammu</p></div>
            <div><span>Science background</span><strong>Master of Science</strong><p>Botany · HNBG University</p></div>
            <div><span>Tools</span><strong>Things I reach for</strong><p>Figma · Sketch · Illustrator · Photoshop · PowerPoint · Excel</p></div>
          </div>
        </section>
      </div>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="page-shell">
          <p className="section-kicker">Have an idea?</p>
          <h2 id="contact-title">Let’s make something thoughtful.</h2>
          <a href="mailto:tammana4513@gmail.com">tammana4513@gmail.com ↗</a>
        </div>
      </section>

      <footer className="page-shell">
        <p>© Tammana Kapoor</p>
        <div><a href="https://www.behance.net/tammanakapoor" target="_blank" rel="noreferrer">Behance ↗</a><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
