import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { World } from "./scene";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  CAMERA KEYFRAMES — tweak these to reframe each section.            */
/*                                                                     */
/*  pos    = where the camera sits        [x, y, z]                    */
/*  target = where the camera looks       [x, y, z]                    */
/*  yaw    = figurine Y rotation (rad). 0 faces the camera; positive   */
/*           turns its face toward screen-right, negative screen-left. */
/*                                                                     */
/*  The figurine is ~1.6 units tall standing on a 0.18-unit plinth     */
/*  at the origin, so y≈1.0 is its chest and y≈1.5 its head.           */
/*                                                                     */
/*  Two sets: WIDE screens sit the figure beside the text; NARROW /    */
/*  portrait screens can't, so they centre the figure in the upper     */
/*  half (low look-target → figure rides high) leaving the lower half  */
/*  clear for the copy. The director swaps sets on the breakpoint.     */
/* ------------------------------------------------------------------ */
type Keyframe = {
  pos: readonly [number, number, number];
  target: readonly [number, number, number];
  yaw: number;
};
type KeyframeSet = Record<"hero" | "about" | "projects" | "contact", Keyframe>;

const KEYFRAMES_WIDE: KeyframeSet = {
  // 1 · HERO — straight-on front view, full figure, room to breathe.
  hero: { pos: [0.0, 1.4, 5.2], target: [0.0, 1.0, 0.0], yaw: 0.0 },
  // 2 · ABOUT — figure held on the LEFT half, gazing toward the copy on the
  //     RIGHT, pulled back enough to leave a clear gutter between them.
  about: { pos: [1.9, 1.5, 3.7], target: [1.45, 1.12, 0.0], yaw: 0.3 },
  // 3 · PROJECTS — figure held on the RIGHT half, facing the cards on the LEFT.
  projects: { pos: [2.6, 1.25, 3.3], target: [-1.55, 1.08, 0.0], yaw: -0.45 },
  // 4 · CONTACT — pull back and up for a top-down hero-shot finish.
  contact: { pos: [0.6, 4.6, 4.0], target: [0.0, 0.6, 0.0], yaw: 0.0 },
};

const KEYFRAMES_NARROW: KeyframeSet = {
  // Centred, pulled back so the whole figure fits; a LOW look-target lifts the
  // figure into the upper half so the text below it stays clear.
  hero: { pos: [0.0, 1.4, 6.2], target: [0.0, 0.85, 0.0], yaw: 0.0 },
  about: { pos: [0.8, 1.0, 5.7], target: [0.0, 0.12, 0.0], yaw: 0.18 },
  projects: { pos: [-0.8, 1.0, 5.7], target: [0.0, 0.12, 0.0], yaw: -0.18 },
  contact: { pos: [0.5, 4.2, 5.0], target: [0.0, 0.5, 0.0], yaw: 0.0 },
};

const NARROW_BP = 768; // px — below this we use the centred portrait framing

/** Where OrbitControls starts when entering explore mode. */
const EXPLORE_POS = new THREE.Vector3(2.4, 1.8, 3.6);

export interface ScrollDirector {
  enterExplore(): void;
  exitExplore(): void;
  isExploring(): boolean;
  /** Call every frame; drives OrbitControls damping in explore mode. */
  update(): void;
  /** Tear down triggers, tweens, controls and listeners. Call on unmount. */
  destroy(): void;
}

export function createScrollDirector(world: World): ScrollDirector {
  const { camera, cameraTarget } = world;

  const pickSet = (): KeyframeSet =>
    window.innerWidth < NARROW_BP ? KEYFRAMES_NARROW : KEYFRAMES_WIDE;

  let activeSet = pickSet();
  let tl: gsap.core.Timeline | null = null;
  let extraTweens: gsap.core.Tween[] = [];

  /* ------------------------------------------------------------ */
  /*  Build the scrubbed timeline for the active keyframe set.     */
  /*  3 segments between 4 sections → each is 1/3 of the timeline; */
  /*  snap lands exactly on section boundaries.                    */
  /* ------------------------------------------------------------ */
  function buildTimeline() {
    const K = activeSet;

    // Start at the hero framing
    camera.position.set(...K.hero.pos);
    cameraTarget.set(...K.hero.target);
    world.modelYaw.value = K.hero.yaw;

    tl = gsap.timeline({
      defaults: { ease: "none", duration: 1 }, // scrub supplies the easing feel
      scrollTrigger: {
        trigger: "#content",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8, // slight lag = smooth camera
        snap: {
          snapTo: 1 / 3, // 4 sections → progress 0, 1/3, 2/3, 1
          duration: { min: 0.3, max: 0.8 },
          ease: "power2.inOut",
          delay: 0.1,
          inertia: false, // snap to the NEAREST section, not a velocity guess
        },
      },
    });

    // Animate position AND lookAt target together for each leg.
    // (cameraTarget is re-applied via camera.lookAt in the render loop.)
    tl.to(camera.position, { x: K.about.pos[0], y: K.about.pos[1], z: K.about.pos[2] }, 0)
      .to(cameraTarget, { x: K.about.target[0], y: K.about.target[1], z: K.about.target[2] }, 0)
      // turn the figure to face the About text, fade the hero pointer-look out
      // and fade the gentle left↔right sway in for ABOUT & PROJECTS
      .to(world.modelYaw, { value: K.about.yaw }, 0)
      .to(world.idleSpin, { strength: 0 }, 0)
      .to(world.sway, { strength: 1 }, 0)

      .to(camera.position, { x: K.projects.pos[0], y: K.projects.pos[1], z: K.projects.pos[2] }, 1)
      .to(cameraTarget, { x: K.projects.target[0], y: K.projects.target[1], z: K.projects.target[2] }, 1)
      // continue the turn so the figure faces the Projects cards
      .to(world.modelYaw, { value: K.projects.yaw }, 1)

      .to(camera.position, { x: K.contact.pos[0], y: K.contact.pos[1], z: K.contact.pos[2] }, 2)
      .to(cameraTarget, { x: K.contact.target[0], y: K.contact.target[1], z: K.contact.target[2] }, 2)
      .to(world.modelYaw, { value: K.contact.yaw }, 2)
      // stop the sway and let the figure loop all the way around on CONTACT
      .to(world.sway, { strength: 0 }, 2)
      .to(world.contactSpin, { strength: 1 }, 2);

    /* ---- Per-section content animations ---- */
    // Project cards slide in from the right, staggered
    extraTweens.push(
      gsap.to(".card", {
        opacity: 1,
        x: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section--projects",
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      }),
    );

    // Headings drift up as their section arrives
    for (const sel of [".section--about", ".section--contact"]) {
      extraTweens.push(
        gsap.from(`${sel} .section__inner`, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sel,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }),
      );
    }
  }

  function teardownTimeline() {
    extraTweens.forEach((t) => t.scrollTrigger?.kill());
    extraTweens.forEach((t) => t.kill());
    extraTweens = [];
    tl?.scrollTrigger?.kill();
    tl?.kill();
    tl = null;
  }

  buildTimeline();

  let exploring = false;

  /* ------------------------------------------------------------ */
  /*  Rebuild on a breakpoint crossing so the framing always fits  */
  /*  the viewport. Plain resizes just let ScrollTrigger refresh.  */
  /* ------------------------------------------------------------ */
  const onResize = () => {
    const want = pickSet();
    if (want === activeSet || exploring) return;
    const progress = tl?.scrollTrigger?.progress ?? 0;
    activeSet = want;
    teardownTimeline();
    buildTimeline();
    ScrollTrigger.refresh();
    // keep the user where they were in the timeline after the rebuild
    tl?.scrollTrigger?.scroll(
      (tl.scrollTrigger.start as number) +
        progress * ((tl.scrollTrigger.end as number) - (tl.scrollTrigger.start as number)),
    );
  };
  window.addEventListener("resize", onResize);

  /* ------------------------------------------------------------ */
  /*  Explore mode (free OrbitControls, scroll disabled)           */
  /* ------------------------------------------------------------ */
  const controls = new OrbitControls(camera, world.renderer.domElement);
  controls.enabled = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 1.2;
  controls.maxDistance = 9;
  controls.maxPolarAngle = Math.PI * 0.55; // don't go under the floor
  controls.target.copy(cameraTarget);

  const exitBtn = document.getElementById("exit-explore")!;
  const hint = document.getElementById("explore-hint")!;
  const enterBtn = document.getElementById("enter-explore")!;

  function enterExplore() {
    if (exploring) return;
    exploring = true;

    ScrollTrigger.getAll().forEach((st) => st.disable(false)); // keep progress
    document.body.classList.add("is-exploring");
    exitBtn.hidden = false;
    hint.hidden = false;

    controls.target.set(0, 0.9, 0);
    controls.enabled = true;

    // Glide from wherever scroll left the camera to a nice orbit seat
    gsap.to(camera.position, {
      x: EXPLORE_POS.x,
      y: EXPLORE_POS.y,
      z: EXPLORE_POS.z,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }

  function exitExplore() {
    if (!exploring) return;
    exploring = false;

    controls.enabled = false;
    document.body.classList.remove("is-exploring");
    exitBtn.hidden = true;
    hint.hidden = true;

    const contact = activeSet.contact;
    // Fly back to the contact framing, then hand control to scroll again
    gsap.to(camera.position, {
      x: contact.pos[0],
      y: contact.pos[1],
      z: contact.pos[2],
      duration: 1.0,
      ease: "power2.inOut",
    });
    gsap.to(cameraTarget, {
      x: contact.target[0],
      y: contact.target[1],
      z: contact.target[2],
      duration: 1.0,
      ease: "power2.inOut",
      onComplete: () => {
        ScrollTrigger.getAll().forEach((st) => st.enable());
        ScrollTrigger.refresh();
      },
    });
  }

  function update() {
    if (exploring) {
      controls.update();
      // keep lookAt in sync so the render loop's camera.lookAt agrees
      cameraTarget.copy(controls.target);
    }
  }

  enterBtn.addEventListener("click", enterExplore);
  exitBtn.addEventListener("click", exitExplore);

  function destroy() {
    enterBtn.removeEventListener("click", enterExplore);
    exitBtn.removeEventListener("click", exitExplore);
    window.removeEventListener("resize", onResize);
    document.body.classList.remove("is-exploring");
    controls.dispose();
    teardownTimeline();
  }

  return {
    enterExplore,
    exitExplore,
    isExploring: () => exploring,
    update,
    destroy,
  };
}
