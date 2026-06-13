import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createOrbiters } from "./orbiters";

/**
 * Everything the rest of the app needs from the 3D world.
 */
export interface World {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Group holding the figurine + plinth — rotate this for the idle spin. */
  stage: THREE.Group;
  /** Point the camera looks at; animated by scroll.ts alongside position. */
  cameraTarget: THREE.Vector3;
  /** 0 → no idle sway, 1 → full amplitude. scroll.ts fades this out past hero. */
  idleSpin: { strength: number };
  /**
   * Absolute Y rotation (radians) of the figurine, animated by scroll.ts so the
   * model turns to "look at" each section. 0 = facing the camera (front).
   * Positive = turns its face toward screen-right, negative = screen-left.
   */
  modelYaw: { value: number };
  resize(): void;
  render(dt: number): void;
  /** Free GPU resources. Call on unmount. */
  dispose(): void;
}

const MODEL_URL = "/models/me.glb";
const MODEL_HEIGHT = 1.6; // world-units the figurine is normalised to

export function createWorld(canvas: HTMLCanvasElement): World {
  /* ------------------------------------------------------------ */
  /*  Renderer                                                     */
  /* ------------------------------------------------------------ */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // mobile cap
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  /* ------------------------------------------------------------ */
  /*  Scene, environment & camera                                  */
  /* ------------------------------------------------------------ */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c0c0e);
  scene.fog = new THREE.Fog(0x0c0c0e, 8, 18);

  // Image-based lighting from three's built-in RoomEnvironment —
  // no HDR download needed, looks like a soft studio.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  const cameraTarget = new THREE.Vector3(0, 1, 0);

  /* ------------------------------------------------------------ */
  /*  Lights (env map does the base fill, these add shape/shadow)  */
  /* ------------------------------------------------------------ */
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2.5, 4, 2.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 12;
  key.shadow.camera.left = key.shadow.camera.bottom = -3;
  key.shadow.camera.right = key.shadow.camera.top = 3;
  key.shadow.radius = 6; // soft edges with PCFSoft
  key.shadow.bias = -0.0005;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x8a8aff, 0.8);
  rim.position.set(-3, 2, -3);
  scene.add(rim);

  /* ------------------------------------------------------------ */
  /*  Stage: plinth + figurine + contact shadow                    */
  /* ------------------------------------------------------------ */
  const stage = new THREE.Group();
  scene.add(stage);

  // Plinth
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.95, 0.18, 64),
    new THREE.MeshStandardMaterial({ color: 0x1b1b1f, roughness: 0.35, metalness: 0.6 })
  );
  plinth.position.y = 0.09;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  stage.add(plinth);

  // Floor that only shows the directional-light shadow
  const shadowCatcher = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.35 })
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  // Subtle baked contact-shadow blob right under the plinth
  scene.add(makeContactShadow(1.4, 0.45));

  // Hero "tech swarm" — logos + tiny devices looping around the figurine.
  // Added to the scene root so they orbit independently of the figurine spin.
  const orbiters = createOrbiters();
  scene.add(orbiters.group);

  /* ------------------------------------------------------------ */
  /*  Resize / render loop                                         */
  /* ------------------------------------------------------------ */
  const idleSpin = { strength: 1 };
  const modelYaw = { value: 0 };
  let spinOffset = 0; // accumulated hero loop rotation (radians)
  const TWO_PI = Math.PI * 2;
  const SPIN_SPEED = 0.6; // rad/s while looping → ~10.5s per full turn

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function render(dt: number) {
    // Figurine facing = scroll-driven yaw + a hero loop spin. While in the
    // hero (idleSpin.strength === 1) the model rotates continuously, one full
    // turn at a time. scroll.ts fades strength to 0 over the hero→About leg;
    // as it fades we ease the accumulated spin to the NEAREST full turn, so
    // the model settles exactly front-facing and lands on modelYaw — keeping
    // every section's keyframe deterministic (About stays identical).
    spinOffset += dt * SPIN_SPEED * idleSpin.strength;
    const settle = 1 - idleSpin.strength; // 0 in hero, → 1 leaving it
    if (settle > 0.001) {
      const nearest = Math.round(spinOffset / TWO_PI) * TWO_PI;
      spinOffset += (nearest - spinOffset) * (1 - Math.exp(-settle * 6 * dt));
    }
    stage.rotation.y = modelYaw.value + spinOffset;
    // Tech swarm orbits the figurine; shares the hero fade (idleSpin.strength).
    orbiters.update(dt, idleSpin.strength);
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
  }

  function dispose() {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
    scene.environment?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return { renderer, scene, camera, stage, cameraTarget, idleSpin, modelYaw, resize, render, dispose };
}

/* ---------------------------------------------------------------- */
/*  Model loading                                                    */
/* ---------------------------------------------------------------- */

/**
 * Loads /public/models/me.glb into the stage. If the file is missing or
 * fails to parse, builds the capsule-person placeholder instead so the
 * site always runs. `onProgress` receives 0–1.
 */
export async function loadFigurine(
  world: World,
  onProgress: (ratio: number) => void
): Promise<void> {
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/"); // decoders copied from three into public/draco
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  try {
    const gltf = await loader.loadAsync(MODEL_URL, (e) => {
      if (e.total > 0) onProgress(Math.min(e.loaded / e.total, 1));
    });
    const model = gltf.scene;

    // Normalise: scale to MODEL_HEIGHT and stand centred on the plinth,
    // so any export size/origin works without retuning the cameras.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const scale = MODEL_HEIGHT / size.y;
    model.scale.setScalar(scale);
    box.setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y += 0.18 - box.min.y; // feet on top of the plinth

    model.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    world.stage.add(model);
  } catch {
    console.warn(`[scene] ${MODEL_URL} not found — using placeholder figurine.`);
    world.stage.add(makePlaceholderPerson());
  } finally {
    draco.dispose();
  }
  onProgress(1);
}

/**
 * Fallback "person": capsule body + sphere head standing on the plinth.
 */
function makePlaceholderPerson(): THREE.Group {
  const person = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xd8d8de,
    roughness: 0.4,
    metalness: 0.1,
  });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.75, 8, 24), mat);
  body.position.y = 0.18 + 0.32 + 0.375; // plinth top + capsule half-height
  body.castShadow = true;
  person.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 32), mat);
  head.position.y = body.position.y + 0.75 / 2 + 0.32 + 0.1;
  head.castShadow = true;
  person.add(head);

  return person;
}

/**
 * Radial-gradient sprite lying flat under the plinth — fakes soft
 * ambient-occlusion contact shadow without extra render passes.
 */
function makeContactShadow(size: number, opacity: number): THREE.Mesh {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, `rgba(0,0,0,${opacity})`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size * 2, size * 2),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(c),
      transparent: true,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.005;
  return mesh;
}
