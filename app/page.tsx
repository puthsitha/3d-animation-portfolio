import SceneController from "@/components/SceneController";

export default function Home() {
  return (
    <>
      {/* Loading screen */}
      <div id="loader" className="loader">
        <div className="loader__inner">
          <span className="loader__label">Loading</span>
          <span id="loader-percent" className="loader__percent">0%</span>
          <div className="loader__bar">
            <div id="loader-bar-fill" className="loader__bar-fill" />
          </div>
        </div>
      </div>

      {/* Fixed WebGL canvas behind everything */}
      <canvas id="webgl" />

      {/* Explore-mode overlay controls */}
      <button id="exit-explore" className="explore-exit" hidden>
        ✕&nbsp;&nbsp;Exit 3D view
      </button>
      <div id="explore-hint" className="explore-hint" hidden>
        Drag to orbit · Scroll to zoom
      </div>

      {/* Scrollable content */}
      <main id="content">
        {/* 1 · HERO */}
        <section className="section section--hero" data-section="hero">
          <div className="section__inner">
            <p className="eyebrow">Portfolio · 2026</p>
            <h1 className="hero-title">Puthsitha</h1>
            <p className="hero-subtitle">iOS &amp; Flutter Developer</p>
            <p className="scroll-cue">
              Scroll<span className="scroll-cue__line" />
            </p>
          </div>
        </section>

        {/* 2 · ABOUT */}
        <section className="section section--about" data-section="about">
          <div className="section__inner section__inner--right">
            <p className="eyebrow">01 — About</p>
            <h2>
              Mobile, crafted
              <br />
              with care.
            </h2>
            <p className="body-copy">
              I build native iOS apps in Swift and cross-platform experiences in
              Flutter — with an obsession for smooth animation, clean
              architecture, and the small details that make an app feel alive.
            </p>
          </div>
        </section>

        {/* 3 · PROJECTS */}
        <section className="section section--projects" data-section="projects">
          <div className="section__inner">
            <p className="eyebrow">02 — Selected work</p>
            <h2>Projects</h2>
            <div className="cards">
              <article className="card">
                <span className="card__tag">iOS · Swift</span>
                <h3>Habitloop</h3>
                <p>A habit tracker with streak widgets, Live Activities and a buttery custom ring animation.</p>
              </article>
              <article className="card">
                <span className="card__tag">Flutter</span>
                <h3>Fairfare</h3>
                <p>Ride-fare comparison mini app — one codebase, 60&nbsp;fps hero transitions on both platforms.</p>
              </article>
              <article className="card">
                <span className="card__tag">iOS · SwiftUI</span>
                <h3>Pocket Recipes</h3>
                <p>Offline-first recipe manager with shared SwiftData models and an iPad-optimised layout.</p>
              </article>
            </div>
          </div>
        </section>

        {/* 4 · CONTACT */}
        <section className="section section--contact" data-section="contact">
          <div className="section__inner section__inner--center">
            <p className="eyebrow">03 — Contact</p>
            <h2>
              Let&apos;s build
              <br />
              something.
            </h2>
            <div className="contact-links">
              <a href="mailto:puthsithamouern@gmail.com">puthsithamouern@gmail.com</a>
              <a href="https://github.com/puthsithamouern" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
            <button id="enter-explore" className="explore-btn">
              <span className="explore-btn__icon">⟳</span> Explore in 3D
            </button>
          </div>
        </section>
      </main>

      {/* Client controller drives the canvas + scroll animation */}
      <SceneController />
    </>
  );
}
