"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import SpatialCanvas from "./spatial-canvas";

const principles = [
  {
    number: "01",
    title: "Motion",
    label: "Choreography, not decoration",
    text: "Type, images and navigation respond with purpose—guiding attention and making the interface feel alive.",
  },
  {
    number: "02",
    title: "Glass",
    label: "Depth without visual weight",
    text: "Translucent surfaces establish hierarchy while preserving the atmosphere and colour moving behind them.",
  },
  {
    number: "03",
    title: "Space",
    label: "A single dimensional moment",
    text: "A lightweight 3D object gives the opening scene presence, while the rest of the portfolio stays direct.",
  },
];

const projects = [
  {
    number: "01",
    title: "Daily Café",
    type: "Ambient web experience",
    text: "An illustrated café for music, focus and a small moment of calm.",
    image: "/daily-cafe.png",
    href: "https://daily-cafe-psi.vercel.app",
    external: true,
  },
  {
    number: "02",
    title: "FloraQuest",
    type: "Learning game",
    text: "A trail of clues and branches that turns plant knowledge into discovery.",
    image: "/floraquest.png",
    href: "/projects#floraquest",
    external: false,
  },
];

function WordReveal({ children, delay }: { children: string; delay: number }) {
  const reduced = useReducedMotion();
  return (
    <span className="lab-word-mask">
      <motion.span
        initial={reduced ? false : { y: "110%", rotate: 2 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function LabExperience() {
  const reduced = useReducedMotion();
  const [activePrinciple, setActivePrinciple] = useState(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 });

  return (
    <main className="lab-page" id="top">
      <motion.div className="lab-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <header className="lab-nav lab-glass">
        <a className="lab-brand" href="/lab">Tammana Kapoor <span>TK</span></a>
        <nav aria-label="Experimental portfolio navigation">
          <a href="#work">Work</a>
          <a href="#system">System</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="lab-nav-status"><i /> London · available</span>
      </header>

      <section className="lab-hero" aria-labelledby="lab-title">
        <div className="lab-ambient lab-ambient-one" aria-hidden="true" />
        <div className="lab-ambient lab-ambient-two" aria-hidden="true" />
        <div className="lab-hero-grid">
          <div className="lab-hero-copy">
            <motion.p
              className="lab-kicker"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6 }}
            >
              Educator · designer · curious maker
            </motion.p>
            <h1 id="lab-title" aria-label="Designing things that feel alive">
              <WordReveal delay={0.12}>Designing</WordReveal>{" "}
              <WordReveal delay={0.19}>things that</WordReveal>{" "}
              <WordReveal delay={0.26}>feel alive.</WordReveal>
            </h1>
            <motion.p
              className="lab-hero-intro"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.7 }}
            >
              I make thoughtful digital experiences where learning, atmosphere and playful interaction meet.
            </motion.p>
            <motion.a
              className="lab-primary-action lab-glass"
              href="#work"
              initial={reduced ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.56, duration: 0.55 }}
              whileHover={reduced ? undefined : { y: -4, scale: 1.02 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
            >
              Explore selected work <span>↘</span>
            </motion.a>
          </div>

          <motion.div
            className="lab-spatial-stage"
            initial={reduced ? false : { opacity: 0, scale: 0.84, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lab-canvas-wrap" aria-hidden="true">
              <SpatialCanvas still={Boolean(reduced)} />
            </div>
            <motion.div
              className="lab-float-card lab-float-card-top lab-glass"
              animate={reduced ? undefined : { y: [0, -9, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span>Currently</span>
              <strong>Exploring interaction</strong>
            </motion.div>
            <motion.div
              className="lab-float-card lab-float-card-bottom lab-glass"
              animate={reduced ? undefined : { y: [0, 7, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <span>01 / 03</span>
              <strong>Move your cursor</strong>
            </motion.div>
          </motion.div>
        </div>
        <div className="lab-tech-line" aria-label="Techniques explored">
          <span>Motion choreography</span><i />
          <span>Liquid surfaces</span><i />
          <span>Real-time 3D</span>
        </div>
      </section>

      <section className="lab-system" id="system" aria-labelledby="system-title">
        <div className="lab-section-heading">
          <p className="lab-kicker">Interaction study / 01</p>
          <h2 id="system-title">Three layers.<br />One quiet system.</h2>
          <p>Each technology has a job. Hover the cards to see the hierarchy shift without breaking the layout.</p>
        </div>

        <div className="lab-principles">
          {principles.map((principle, index) => (
            <motion.article
              className={`lab-principle lab-glass ${activePrinciple === index ? "is-active" : ""}`}
              onMouseEnter={() => setActivePrinciple(index)}
              onFocus={() => setActivePrinciple(index)}
              whileHover={reduced ? undefined : { y: -10 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              tabIndex={0}
              key={principle.number}
            >
              <span>{principle.number}</span>
              <p>{principle.label}</p>
              <h3>{principle.title}</h3>
              <div className="lab-principle-detail">
                <p>{principle.text}</p>
                <i aria-hidden="true">↗</i>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="lab-work" id="work" aria-labelledby="work-title">
        <div className="lab-section-heading lab-work-heading">
          <p className="lab-kicker">Selected work / 02</p>
          <h2 id="work-title">The work stays<br />in focus.</h2>
          <p>Spatial effects create atmosphere around the projects; they never compete with the case studies themselves.</p>
        </div>

        <div className="lab-projects">
          {projects.map((project, index) => (
            <motion.article
              className="lab-project"
              initial={reduced ? false : { opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              key={project.number}
            >
              <motion.a
                className="lab-project-image lab-glass"
                href={project.href}
                target={project.external ? "_blank" : undefined}
                rel={project.external ? "noreferrer" : undefined}
                whileHover={reduced ? undefined : { scale: 0.985 }}
              >
                <img src={project.image} alt={`${project.title} project preview`} />
                <span>Open project ↗</span>
              </motion.a>
              <div className="lab-project-copy">
                <div><span>{project.number}</span><span>{project.type}</span></div>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="lab-contact" id="contact" aria-labelledby="lab-contact-title">
        <motion.div
          className="lab-contact-card lab-glass"
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="lab-kicker">Have a thoughtful idea?</p>
          <h2 id="lab-contact-title">Let’s make it move.</h2>
          <a href="mailto:tammana4513@gmail.com">tammana4513@gmail.com <span>↗</span></a>
        </motion.div>
      </section>

      <footer className="lab-footer">
        <span>© Tammana Kapoor</span>
        <a href="/">Return to the main portfolio</a>
        <span>Motion · glass · space</span>
      </footer>
    </main>
  );
}
