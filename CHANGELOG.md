# Changelog

All notable changes to this project are documented here. This project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-06-27

First closed release (**V1**). Scroll-driven 3D portfolio landing page built
with Next.js (App Router) + TypeScript, Three.js and GSAP ScrollTrigger.

### Added
- Scroll-driven 3D scene with per-section camera keyframes, snapping, and an
  "explore" free-look mode (`lib/scroll.ts`, `components/SceneController.tsx`).
- Three.js renderer with environment lighting, plinth, and the hooded-human
  figurine, including a capsule-person fallback when `public/models/me.glb` is
  missing (`lib/scene.ts`).
- Hero figurine that turns to face the camera and tracks the cursor.
- Draco-compressed model pipeline (~78 MB raw export down to ~2 MB) with the
  Draco decoder served from `public/draco/`.
- Server-rendered section markup with client-side dynamic import of the heavy
  WebGL libraries so nothing 3D touches SSR.
- Framer Motion scroll reveals and micro-interactions on the CV block.
- UI components: animated shader background, custom cursor, liquid button,
  rotating text, typewriter, skill bars, and section art.
- Netlify deployment configuration (`netlify.toml`).

[1.0.0]: https://github.com/puthsitha/3d-animation-portfolio/releases/tag/v1.0.0
