import SceneController from "@/components/SceneController";
import AnimatedShaderBackground from "@/components/AnimatedShaderBackground";
import Cursor from "@/components/Cursor";
import Typewriter from "@/components/Typewriter";
import RotatingText from "@/components/RotatingText";
import LiquidButton from "@/components/LiquidButton";
import SectionArt from "@/components/SectionArt";
import SkillBars from "@/components/SkillBars";
import { Reveal, Stagger, StaggerItem, MotionLink } from "@/components/Motion";

const CV_FILE = "/Puthsitha_Moeurn_CV.pdf";

export default function Home() {
  return (
    <>
      {/* Animated pointer + flowing aurora shader background */}
      <Cursor />
      <AnimatedShaderBackground />

      {/* Loading screen */}
      <div id="loader" className="loader">
        <div className="loader__inner">
          <span className="loader__label">Loading</span>
          <span id="loader-percent" className="loader__percent">
            0%
          </span>
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

      {/* Dev-only camera readout (localhost; press D to toggle) */}
      <div id="debug-readout" className="debug-readout" hidden>
        <div className="debug-readout__row">
          <span className="debug-readout__label">Camera keyframe</span>
          <button id="debug-copy" className="debug-readout__copy" type="button">
            Copy
          </button>
        </div>
        <code id="debug-readout-value" className="debug-readout__value">
          …
        </code>
        <span className="debug-readout__hint">
          press D to toggle · enter Explore and drag to reframe
        </span>
      </div>

      {/* ============================================================ */}
      {/*  3D scroll experience — DO NOT add sections inside #content;  */}
      {/*  the camera timeline snaps to exactly these 4 sections.       */}
      {/* ============================================================ */}
      <main id="content">
        {/* 1 · HERO */}
        <section className="section section--hero" data-section="hero">
          <div className="section__inner">
            <p className="eyebrow">Portfolio · 2026</p>
            <h1 className="hero-title">Puthsitha</h1>
            <p className="hero-subtitle">
              <Typewriter
                phrases={[
                  "iOS Developer",
                  "Flutter Developer",
                  "React Native Developer",
                  "Mobile Engineer",
                ]}
              />
            </p>
            <p className="scroll-cue">
              Scroll
              <span className="scroll-cue__line" />
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
              I&apos;m a mobile developer with hands-on experience across
              e-commerce, education, hospital, hotel and booking-tour apps. I
              build native iOS in Swift, UIKit &amp; SwiftUI and cross-platform
              apps in Flutter and React Native — with a focus on clean
              architecture, smooth animation and bank-grade API integration.
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
                <span className="card__tag">iOS · Swift · SwiftUI</span>
                <h3>Hattha Mobile</h3>
                <p>
                  Enhancing and maintaining the Hattha Bank mobile app — new
                  features, issue fixes and polished UI in Swift, UIKit and
                  SwiftUI.
                </p>
              </article>
              <article className="card">
                <span className="card__tag">Flutter · BLoC</span>
                <h3>Banking &amp; Merchant Apps</h3>
                <p>
                  Cross-platform Flutter apps with secure API and bank-service
                  integration, built on BLoC and Provider state management.
                </p>
              </article>
              <article className="card">
                <span className="card__tag">React Native · Redux</span>
                <h3>E-commerce &amp; Booking</h3>
                <p>
                  React Native apps for e-commerce, hotel and booking-tour — ABA
                  payment integration, Redux &amp; Zustand, led with a team.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 4 · CONTACT */}
        <section className="section section--contact" data-section="contact">
          <div className="section__inner section__inner--center">
            <p className="eyebrow">03 — Contact</p>
            <h2 className="contact-heading">
              Let&apos;s build
              <RotatingText
                texts={["something", "apps", "delight", "the future"]}
                className="contact-morph"
              />
            </h2>
            <div className="contact-links">
              <a href="mailto:puthsithamouern@gmail.com">
                puthsithamouern@gmail.com
              </a>
              <a href="tel:+85592389497">+855 92 389 497</a>
              <a
                href="https://github.com/puthsitha"
                target="_blank"
                rel="noreferrer">
                github.com/puthsitha
              </a>
            </div>
            <LiquidButton id="enter-explore" className="explore-btn-liquid">
              <span className="explore-btn__icon">⟳</span> Explore in 3D
            </LiquidButton>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/*  CV detail — lives OUTSIDE #content (solid backdrop) so the   */}
      {/*  3D camera timeline above is left completely untouched.       */}
      {/* ============================================================ */}
      <div className="cv-extra">
        {/* EXPERIENCE */}
        <section className="cv-section" data-cv="experience">
          <div className="cv-section__inner">
            <Reveal className="cv-section__art" direction="right">
              <SectionArt variant="experience" />
            </Reveal>
            <Reveal className="cv-section__body" direction="left" delay={0.1}>
              <p className="eyebrow">04 — Experience</p>
              <h2>Where I&apos;ve worked</h2>
              <Stagger as="ol" className="timeline">
                <StaggerItem as="li" className="timeline__item">
                  <span className="timeline__date">Sep 2025 — Present</span>
                  <h3>Mobile Developer · Hattha Bank</h3>
                  <p>
                    Enhance, maintain and fix issues on the Hattha Mobile app
                    using Swift, UIKit &amp; SwiftUI, and the Hattha Merchant
                    app using Flutter.
                  </p>
                </StaggerItem>
                <StaggerItem as="li" className="timeline__item">
                  <span className="timeline__date">Apr 2024 — Aug 2025</span>
                  <h3>Mobile Developer · Digital One</h3>
                  <p>
                    Built Android &amp; iOS apps with Flutter, integrated APIs
                    and bank services, using BLoC and Provider state management.
                  </p>
                </StaggerItem>
                <StaggerItem as="li" className="timeline__item">
                  <span className="timeline__date">Dec 2021 — Mar 2024</span>
                  <h3>Mobile Developer · PHSAR TECH</h3>
                  <p>
                    Developed Android &amp; iOS apps with React Native and ABA
                    bank integration using Redux and Zustand. Led projects,
                    managing tasks, meetings and team responsibilities.
                  </p>
                </StaggerItem>
                <StaggerItem as="li" className="timeline__item">
                  <span className="timeline__date">Feb 2020</span>
                  <h3>Leadership Training · YRDP (NGO)</h3>
                  <p>
                    Completed the Youth Resource Development Program&apos;s
                    Leadership &amp; Personal Development training.
                  </p>
                </StaggerItem>
              </Stagger>
            </Reveal>
          </div>
        </section>

        {/* EDUCATION */}
        <section className="cv-section cv-section--alt" data-cv="education">
          <div className="cv-section__inner cv-section__inner--reverse">
            <Reveal className="cv-section__art" direction="left">
              <SectionArt variant="education" />
            </Reveal>
            <Reveal className="cv-section__body" direction="right" delay={0.1}>
              <p className="eyebrow">05 — Education</p>
              <h2>Studied &amp; certified</h2>
              <Stagger as="ol" className="timeline">
                <StaggerItem as="li" className="timeline__item">
                  <span className="timeline__date">2019 — 2023</span>
                  <h3>Royal University of Phnom Penh (RUPP)</h3>
                  <p>Bachelor&apos;s Degree in Computer Science.</p>
                </StaggerItem>
                <StaggerItem as="li" className="timeline__item">
                  <span className="timeline__date">2016 — 2019</span>
                  <h3>Thmorkoul High School</h3>
                  <p>High school diploma — passed Bac II (Grade C).</p>
                </StaggerItem>
              </Stagger>
            </Reveal>
          </div>
        </section>

        {/* SKILLS */}
        <section className="cv-section" data-cv="skills">
          <div className="cv-section__inner">
            <Reveal className="cv-section__art" direction="right">
              <SectionArt variant="skills" />
            </Reveal>
            <Reveal className="cv-section__body" direction="left" delay={0.1}>
              <p className="eyebrow">06 — Skills</p>
              <h2>What I work with</h2>

              <SkillBars
                skills={[
                  {
                    label: "Technical (Swift, Flutter, React Native)",
                    value: 96,
                  },
                  { label: "Communication & Teamwork", value: 75 },
                  { label: "Project Management", value: 50 },
                  { label: "Design", value: 42 },
                ]}
              />

              <Stagger as="ul" className="skill-tags">
                {[
                  "Swift",
                  "UIKit",
                  "SwiftUI",
                  "Flutter",
                  "React Native",
                  "JavaScript / ES6",
                  "TypeScript",
                  "Redux",
                  "Zustand",
                  "BLoC / Provider",
                  "REST API",
                  "Bank / ABA integration",
                  "App Store release",
                ].map((t) => (
                  <StaggerItem
                    as="li"
                    className="skill-tag"
                    key={t}
                    whileHover={{
                      y: -4,
                      scale: 1.06,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 18,
                      },
                    }}>
                    {t}
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          </div>
        </section>

        {/* RESUME / CV */}
        <section className="cv-section cv-section--alt" data-cv="resume">
          <div className="cv-section__inner cv-section__inner--reverse">
            <Reveal className="cv-section__art" direction="left">
              <SectionArt variant="resume" />
            </Reveal>
            <Reveal className="cv-section__body" direction="right" delay={0.1}>
              <p className="eyebrow">07 — Résumé</p>
              <h2>Download my CV</h2>
              <p className="body-copy">
                Prefer the full document? Preview it right here or grab a copy
                as PDF.
              </p>
              <div className="cv-actions">
                <MotionLink
                  className="cv-btn cv-btn--primary"
                  href={CV_FILE}
                  download>
                  ↓ Download PDF
                </MotionLink>
                <MotionLink
                  className="cv-btn"
                  href={CV_FILE}
                  target="_blank"
                  rel="noreferrer">
                  ↗ Open in new tab
                </MotionLink>
              </div>
              <div className="cv-preview">
                <object
                  data={`${CV_FILE}#view=FitH`}
                  type="application/pdf"
                  className="cv-preview__frame"
                  aria-label="CV preview">
                  <iframe
                    src={`${CV_FILE}#view=FitH`}
                    title="CV preview"
                    className="cv-preview__frame"
                  />
                </object>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOOTER — personal details + references */}
        <footer className="cv-footer">
          <Stagger className="cv-footer__grid">
            <StaggerItem>
              <p className="eyebrow">Personal</p>
              <ul className="cv-meta">
                <li>
                  <span>Date of birth</span>March 20, 2001
                </li>
                <li>
                  <span>Place of birth</span>Battambang, Cambodia
                </li>
                <li>
                  <span>Nationality</span>Khmer
                </li>
                <li>
                  <span>Location</span>Phnom Penh
                </li>
              </ul>
            </StaggerItem>
            <StaggerItem>
              <p className="eyebrow">References</p>
              <ul className="cv-meta">
                <li>
                  <span>Mr. Louern Chhay</span>Teamwork · +855 95 288 757
                </li>
                <li>
                  <span>Mr. Heng Sopharuth</span>Project Manager · +855 98 624
                  205
                </li>
              </ul>
            </StaggerItem>
            <StaggerItem>
              <p className="eyebrow">Get in touch</p>
              <ul className="cv-meta">
                <li>
                  <span>Email</span>
                  <a href="mailto:puthsithamouern@gmail.com">
                    puthsithamouern@gmail.com
                  </a>
                </li>
                <li>
                  <span>Phone</span>
                  <a href="tel:+85592389497">+855 92 389 497</a>
                </li>
                <li>
                  <span>GitHub</span>
                  <a
                    href="https://github.com/puthsitha"
                    target="_blank"
                    rel="noreferrer">
                    github.com/puthsitha
                  </a>
                </li>
              </ul>
            </StaggerItem>
          </Stagger>
          <p className="cv-footer__copy">
            © 2026 Puthsitha Moeurn · Built with Next.js &amp; Three.js
          </p>
        </footer>
      </div>

      {/* Client controller drives the canvas + scroll animation */}
      <SceneController />
    </>
  );
}
