import * as THREE from "three";

/**
 * The "tech swarm" — a set of mobile-dev emblems and tiny devices that fly in
 * looping orbits around the figurine during the HERO section. They share the
 * hero `strength` (1 in hero, faded to 0 by scroll.ts past it) so they appear
 * only on the first screen and dissolve as you scroll into About.
 *
 *   group   — add to the scene root (NOT the figurine stage, so they orbit
 *             independently of the figurine's own spin).
 *   update  — call every frame with (dt, strength).
 */
export interface Orbiters {
  group: THREE.Group;
  update(dt: number, strength: number): void;
}

interface Item {
  obj: THREE.Object3D;
  radius: number; // orbit radius in the XZ plane
  height: number; // base Y the orbit sits at
  speed: number; // angular speed (rad/s); sign sets direction
  phase: number; // starting angle
  bobAmp: number; // vertical bob amplitude
  bobSpeed: number;
  tumble: THREE.Vector2 | null; // x/y spin speeds for the 3D devices
  /** Materials whose opacity is driven by `strength` so the item fades out. */
  fadeMats: THREE.Material[];
}

/* ------------------------------------------------------------------ */
/*  Icon artwork — brand logos rasterised from inline SVG on a         */
/*  transparent canvas, used as billboarded sprites facing the camera. */
/* ------------------------------------------------------------------ */

const canvas = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">` +
  inner +
  `</svg>`;

// Helper to drop a 24×24-viewBox path into the centre of the canvas.
const glyph24 = (d: string, fill: string, scale = 5.2) =>
  `<g transform="translate(128,128) scale(${scale}) translate(-12,-12)"><path d="${d}" fill="${fill}"/></g>`;

const APPLE = canvas(
  glyph24(
    "M17.543 13.298c-.024-2.43 1.983-3.594 2.073-3.65-1.13-1.653-2.888-1.88-3.512-1.905-1.495-.151-2.918.88-3.675.88-.756 0-1.926-.858-3.17-.834-1.63.024-3.134.948-3.972 2.408-1.694 2.94-.434 7.293 1.215 9.68.806 1.168 1.766 2.48 3.025 2.433 1.214-.049 1.673-.785 3.14-.785 1.466 0 1.88.785 3.165.761 1.307-.024 2.135-1.19 2.935-2.36.925-1.354 1.305-2.665 1.328-2.732-.029-.014-2.549-.978-2.575-3.879zM15.1 6.31c.67-.812 1.122-1.942.998-3.067-.965.039-2.133.643-2.826 1.454-.621.72-1.165 1.87-1.018 2.974 1.076.083 2.176-.547 2.846-1.36z",
    "#ffffff",
    8
  )
);

const SWIFT = canvas(
  // Authentic Swift bird (simple-icons path) in Swift orange.
  `<g transform="translate(128,128) scale(9.3) translate(-11.6,-11.7)">` +
    `<path fill="#F05138" d="M13.543 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z"/>` +
    `</g>`
);

const FLUTTER = canvas(
  `<g transform="translate(128,128) scale(8.2) translate(-12,-12)">` +
    `<path d="M14.3 2.4 6.6 10.1l3.8 3.8L21.9 2.4z" fill="#54C5F8"/>` +
    `<path d="M14.3 11.5 9.5 16.3l4.8 4.8h4.6l-4.8-4.8 4.8-4.8z" fill="#54C5F8"/>` +
    `<path d="M10.4 13.9l3.9 3.9 2.3-2.3-3.9-3.9z" fill="#1389FD"/>` +
    `</g>`
);

const REACT = canvas(
  `<g transform="translate(128,128)" stroke="#61DAFB" stroke-width="7" fill="none">` +
    `<ellipse rx="104" ry="40"/>` +
    `<ellipse rx="104" ry="40" transform="rotate(60)"/>` +
    `<ellipse rx="104" ry="40" transform="rotate(120)"/>` +
    `</g>` +
    `<circle cx="128" cy="128" r="17" fill="#61DAFB"/>`
);

const ANDROID = canvas(
  // Android robot built from primitives, enlarged to fill the canvas.
  `<g transform="translate(128,130) scale(1.42) translate(-128,-130)">` +
    `<g fill="#3DDC84">` +
      `<path d="M84 112a44 40 0 0 1 88 0z"/>` + // domed head, flat bottom
      `<rect x="84" y="116" width="88" height="66" rx="12"/>` + // body
      `<rect x="64" y="120" width="14" height="54" rx="7"/>` + // left arm
      `<rect x="178" y="120" width="14" height="54" rx="7"/>` + // right arm
      `<rect x="100" y="178" width="14" height="26" rx="7"/>` + // left leg
      `<rect x="142" y="178" width="14" height="26" rx="7"/>` + // right leg
    `</g>` +
    `<g stroke="#3DDC84" stroke-width="6" stroke-linecap="round">` +
      `<line x1="98" y1="72" x2="90" y2="56"/>` + // left antenna
      `<line x1="158" y1="72" x2="166" y2="56"/>` + // right antenna
    `</g>` +
    `<g fill="#ffffff"><circle cx="108" cy="92" r="6"/><circle cx="148" cy="92" r="6"/></g>` +
  `</g>`
);

/* ------------------------------------------------------------------ */
/*  Builders                                                           */
/* ------------------------------------------------------------------ */

function makeSprite(svg: string, loader: THREE.TextureLoader): { obj: THREE.Sprite; mat: THREE.SpriteMaterial } {
  const tex = loader.load("data:image/svg+xml;utf8," + encodeURIComponent(svg));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const obj = new THREE.Sprite(mat);
  obj.scale.setScalar(0.62);
  return { obj, mat };
}

function makeMacBook(): { obj: THREE.Group; mats: THREE.Material[] } {
  const g = new THREE.Group();
  const alu = new THREE.MeshStandardMaterial({ color: 0x2a2d34, metalness: 0.85, roughness: 0.32, transparent: true });
  const screen = new THREE.MeshStandardMaterial({
    color: 0x06070c,
    emissive: 0x2a6cff,
    emissiveIntensity: 0.7,
    metalness: 0.2,
    roughness: 0.4,
    transparent: true,
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.045, 0.68), alu);
  g.add(base);

  const lid = new THREE.Group();
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.62, 0.03), alu);
  panel.position.y = 0.31;
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.54), screen);
  display.position.set(0, 0.31, 0.02);
  lid.add(panel, display);
  lid.position.set(0, 0.02, -0.34);
  lid.rotation.x = -1.95; // hinge open ~112°
  g.add(lid);

  g.scale.setScalar(0.42);
  return { obj: g, mats: [alu, screen] };
}

function makeIPhone(): { obj: THREE.Group; mats: THREE.Material[] } {
  const g = new THREE.Group();
  const frame = new THREE.MeshStandardMaterial({ color: 0x17171b, metalness: 0.75, roughness: 0.28, transparent: true });
  const screen = new THREE.MeshStandardMaterial({
    color: 0x05060a,
    emissive: 0x7a3aff,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    transparent: true,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.74, 0.045), frame);
  g.add(body);
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.67), screen);
  display.position.z = 0.026;
  g.add(display);

  g.scale.setScalar(0.5);
  return { obj: g, mats: [frame, screen] };
}

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export function createOrbiters(): Orbiters {
  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();
  const items: Item[] = [];

  const addSprite = (svg: string, cfg: Omit<Item, "obj" | "tumble" | "fadeMats">) => {
    const { obj, mat } = makeSprite(svg, loader);
    group.add(obj);
    items.push({ obj, tumble: null, fadeMats: [mat], ...cfg });
  };

  const addDevice = (
    built: { obj: THREE.Group; mats: THREE.Material[] },
    cfg: Omit<Item, "obj" | "fadeMats">
  ) => {
    group.add(built.obj);
    items.push({ obj: built.obj, fadeMats: built.mats, ...cfg });
  };

  // Logos spread across phases / radii / directions so the swarm looks lively.
  addSprite(APPLE, { radius: 2.0, height: 1.55, speed: 0.5, phase: 0.0, bobAmp: 0.14, bobSpeed: 1.1 });
  addSprite(SWIFT, { radius: 2.3, height: 1.0, speed: -0.42, phase: 1.25, bobAmp: 0.18, bobSpeed: 0.9 });
  addSprite(FLUTTER, { radius: 1.8, height: 1.85, speed: 0.58, phase: 2.5, bobAmp: 0.12, bobSpeed: 1.3 });
  addSprite(REACT, { radius: 2.35, height: 0.75, speed: -0.46, phase: 3.7, bobAmp: 0.16, bobSpeed: 1.0 });
  addSprite(ANDROID, { radius: 2.05, height: 1.3, speed: 0.54, phase: 4.9, bobAmp: 0.15, bobSpeed: 1.2 });

  // Little 3D devices that also tumble as they orbit.
  addDevice(makeMacBook(), {
    radius: 2.45, height: 1.65, speed: 0.34, phase: 0.7, bobAmp: 0.13, bobSpeed: 0.8,
    tumble: new THREE.Vector2(0.15, 0.5),
  });
  addDevice(makeIPhone(), {
    radius: 1.7, height: 0.6, speed: -0.62, phase: 5.6, bobAmp: 0.17, bobSpeed: 1.05,
    tumble: new THREE.Vector2(0.2, -0.7),
  });

  let elapsed = 0;

  function update(dt: number, strength: number) {
    elapsed += dt;
    group.visible = strength > 0.01;
    if (!group.visible) return;

    for (const it of items) {
      const a = it.phase + elapsed * it.speed;
      it.obj.position.set(
        Math.cos(a) * it.radius,
        it.height + Math.sin(elapsed * it.bobSpeed + it.phase) * it.bobAmp,
        Math.sin(a) * it.radius
      );
      if (it.tumble) {
        it.obj.rotation.x += dt * it.tumble.x;
        it.obj.rotation.y += dt * it.tumble.y;
      }
      for (const m of it.fadeMats) m.opacity = strength;
    }
  }

  return { group, update };
}
