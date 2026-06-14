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
/* ------------------------------------------------------------------ */
const KEYFRAMES = {
  // 1 · HERO — straight-on front view, full figure, room to breathe
  hero: { pos: [0.0, 1.4, 5.2], target: [0.0, 1.0, 0.0], yaw: 0.0 },

  // 2 · ABOUT — 3/4 close-up of the upper body from the front-RIGHT, so the
  //     figure stays facing us while it turns its head toward the text on the
  //     right. Camera sits on the same side it's looking, model held on the
  //     left of frame (target.x > 0). yaw turns the gaze toward screen-right.
  // about: { pos: [1.4, 1.5, 2.4], target: [0.4, 1.25, 0.0], yaw: 0.5 },
  about: { pos: [2.44, 1.2, 1.51], target: [-0.49, 1.06, 0.0], yaw: -0.1 },
  // 3 · PROJECTS — orbit around to the model's side, slightly low,
  //     leaving the right half of the screen free for the cards. Cards
  //     sit on the LEFT, so the figure turns its face toward screen-left.
  projects: { pos: [2.8, 1.1, 1.2], target: [-0.8, 1.0, 0.0], yaw: -0.7 },

  // 4 · CONTACT — pull back and up for a top-down hero-shot finish
  contact: { pos: [0.6, 4.6, 4.0], target: [0.0, 0.6, 0.0], yaw: 0.0 },
} as const;

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

  // Start at the hero framing
  camera.position.set(...KEYFRAMES.hero.pos);
  cameraTarget.set(...KEYFRAMES.hero.target);
  world.modelYaw.value = KEYFRAMES.hero.yaw;

  /* ------------------------------------------------------------ */
  /*  One timeline, scrubbed across the whole page.                */
  /*  3 segments between 4 sections → each segment is 1/3 of the   */
  /*  timeline; snap lands exactly on section boundaries.          */
  /* ------------------------------------------------------------ */
  const tl = gsap.timeline({
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
  tl.to(
    camera.position,
    {
      x: KEYFRAMES.about.pos[0],
      y: KEYFRAMES.about.pos[1],
      z: KEYFRAMES.about.pos[2],
    },
    0,
  )
    .to(
      cameraTarget,
      {
        x: KEYFRAMES.about.target[0],
        y: KEYFRAMES.about.target[1],
        z: KEYFRAMES.about.target[2],
      },
      0,
    )
    // turn the figure to face the About text, fade the hero loop spin out and
    // fade the gentle left↔right sway in for ABOUT & PROJECTS
    .to(world.modelYaw, { value: KEYFRAMES.about.yaw }, 0)
    .to(world.idleSpin, { strength: 0 }, 0)
    .to(world.sway, { strength: 1 }, 0)

    .to(
      camera.position,
      {
        x: KEYFRAMES.projects.pos[0],
        y: KEYFRAMES.projects.pos[1],
        z: KEYFRAMES.projects.pos[2],
      },
      1,
    )
    .to(
      cameraTarget,
      {
        x: KEYFRAMES.projects.target[0],
        y: KEYFRAMES.projects.target[1],
        z: KEYFRAMES.projects.target[2],
      },
      1,
    )
    // continue the turn so the figure faces the Projects cards on the left
    .to(world.modelYaw, { value: KEYFRAMES.projects.yaw }, 1)

    .to(
      camera.position,
      {
        x: KEYFRAMES.contact.pos[0],
        y: KEYFRAMES.contact.pos[1],
        z: KEYFRAMES.contact.pos[2],
      },
      2,
    )
    .to(
      cameraTarget,
      {
        x: KEYFRAMES.contact.target[0],
        y: KEYFRAMES.contact.target[1],
        z: KEYFRAMES.contact.target[2],
      },
      2,
    )
    .to(world.modelYaw, { value: KEYFRAMES.contact.yaw }, 2)
    // stop the sway and let the figure loop all the way around on CONTACT
    .to(world.sway, { strength: 0 }, 2)
    .to(world.contactSpin, { strength: 1 }, 2);

  /* ------------------------------------------------------------ */
  /*  Per-section content animations                               */
  /* ------------------------------------------------------------ */
  const extraTweens: gsap.core.Tween[] = [];

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

  let exploring = false;
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

    // Fly back to the contact framing, then hand control to scroll again
    gsap.to(camera.position, {
      x: KEYFRAMES.contact.pos[0],
      y: KEYFRAMES.contact.pos[1],
      z: KEYFRAMES.contact.pos[2],
      duration: 1.0,
      ease: "power2.inOut",
    });
    gsap.to(cameraTarget, {
      x: KEYFRAMES.contact.target[0],
      y: KEYFRAMES.contact.target[1],
      z: KEYFRAMES.contact.target[2],
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
    document.body.classList.remove("is-exploring");
    controls.dispose();
    extraTweens.forEach((t) => t.scrollTrigger?.kill());
    extraTweens.forEach((t) => t.kill());
    tl.scrollTrigger?.kill();
    tl.kill();
  }

  return {
    enterExplore,
    exitExplore,
    isExploring: () => exploring,
    update,
    destroy,
  };
}
