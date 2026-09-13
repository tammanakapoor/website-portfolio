import { ArrowDown, ArrowRight, Asterisk, Leaf } from "../marks";

const dreamNotes = [
  ["01", "Education", "Ideas that invite people in"],
  ["02", "Design", "Interfaces with warmth and wonder"],
  ["03", "Experiments", "Small worlds made to explore"],
];

export default function SurrealPreview() {
  return (
    <main className="surreal-page" id="top">
      <header className="surreal-nav surreal-shell">
        <a className="surreal-brand" href="/surreal" aria-label="Tammana Kapoor surreal concept home">
          <span>Tammana Kapoor</span>
          <Leaf className="surreal-brand-leaf" />
        </a>
        <nav aria-label="Surreal concept navigation">
          <a href="#dreams">Dreams</a>
          <a href="#about">About</a>
          <a href="#hello">Hello</a>
        </nav>
      </header>

      <section className="surreal-hero" aria-labelledby="surreal-title">
        <img
          className="surreal-hero-art"
          src="/surreal-hero.jpg"
          alt="A surreal paper collage where an open book becomes a botanical landscape"
        />
        <div className="surreal-hero-wash" aria-hidden="true" />
        <div className="surreal-hero-copy surreal-shell">
          <p className="surreal-kicker">Educator · designer · collector of curiosities</p>
          <h1 id="surreal-title">
            I make curious worlds for people who love to <em>learn.</em>
          </h1>
          <p className="surreal-intro">
            By day, I help young minds find their way. By night, I turn questions into playful digital experiences.
          </p>
          <a className="surreal-scroll" href="#dreams">
            Enter the work <ArrowDown />
          </a>
        </div>
        <span className="surreal-orbit surreal-orbit-one" aria-hidden="true">always becoming</span>
        <span className="surreal-orbit surreal-orbit-two" aria-hidden="true">✦</span>
      </section>

      <section className="surreal-manifesto surreal-shell" aria-label="Creative manifesto">
        <p className="surreal-kicker">A small manifesto</p>
        <p className="surreal-statement">
          Somewhere between a <i>classroom</i>, a garden and an open browser tab, ideas begin to grow.
        </p>
        <div className="surreal-notes">
          {dreamNotes.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surreal-work" id="dreams" aria-labelledby="dreams-title">
        <div className="surreal-shell surreal-section-head">
          <div>
            <p className="surreal-kicker">Selected dreams / 02</p>
            <h2 id="dreams-title">Things that grew from an idea.</h2>
          </div>
          <p>Two playful experiments about atmosphere, discovery and the pleasure of learning something new.</p>
        </div>

        <article className="surreal-project surreal-project-cafe surreal-shell">
          <div className="surreal-project-visual">
            <span className="surreal-portal surreal-portal-coral" aria-hidden="true" />
            <img src="/daily-cafe.png" alt="Daily Café illustrated website" />
            <span className="surreal-caption">a room hidden inside a flower</span>
          </div>
          <div className="surreal-project-copy">
            <p className="surreal-kicker">01 · Illustration · Sound · Web</p>
            <h3>Daily Café</h3>
            <p>An illustrated ambient café where visitors can settle in, play music and borrow a small moment of calm.</p>
            <a href="https://daily-cafe-psi.vercel.app" target="_blank" rel="noreferrer">
              Step inside <ArrowRight />
            </a>
          </div>
        </article>

        <article className="surreal-project surreal-project-flora surreal-shell">
          <div className="surreal-project-copy">
            <p className="surreal-kicker">02 · Learning game · Product</p>
            <h3>FloraQuest</h3>
            <p>A guessing game where plant knowledge becomes a trail of clues, branches and curious discoveries.</p>
            <a href="/projects#floraquest">
              Follow the branches <ArrowRight />
            </a>
          </div>
          <div className="surreal-project-visual">
            <span className="surreal-portal surreal-portal-moss" aria-hidden="true" />
            <img src="/floraquest.png" alt="FloraQuest plant discovery game" />
            <span className="surreal-caption">the answer is growing</span>
          </div>
        </article>
      </section>

      <section className="surreal-about" id="about" aria-labelledby="surreal-about-title">
        <div className="surreal-shell surreal-about-grid">
          <div className="surreal-about-copy">
            <p className="surreal-kicker">Field notes / 03</p>
            <h2 id="surreal-about-title">A many-hat kind of person.</h2>
            <p>
              I move between classrooms, design tools and small digital experiments. Curiosity is the thread that ties them all together.
            </p>
            <a href="/outside">See life outside the screen <ArrowRight /></a>
          </div>
          <div className="surreal-cabinet" aria-label="Cabinet of current curiosities">
            <span className="surreal-moon" aria-hidden="true" />
            <div className="surreal-cabinet-card surreal-card-one">
              <span>Currently</span>
              <strong>Learning support<br />in London</strong>
            </div>
            <div className="surreal-cabinet-card surreal-card-two">
              <span>Collecting</span>
              <strong>Embroidery, sketches<br />and long walks</strong>
            </div>
            <div className="surreal-cabinet-card surreal-card-three">
              <span>Wondering</span>
              <strong>What should I<br />learn next?</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="surreal-contact" id="hello" aria-labelledby="surreal-contact-title">
        <div className="surreal-shell">
          <p className="surreal-kicker">One more doorway</p>
          <h2 id="surreal-contact-title">Have a curious idea?</h2>
          <a href="mailto:tammana4513@gmail.com">
            Let’s make it real <ArrowRight />
          </a>
          <p className="surreal-signoff">The kettle is on. I’d love to hear about it.</p>
        </div>
      </section>

      <footer className="surreal-footer surreal-shell">
        <p>© Tammana Kapoor <Asterisk /> made with curiosity</p>
        <a href="/">Return to the original portfolio</a>
      </footer>
    </main>
  );
}
