# Puthsitha — 3D Portfolio

> **Status:** v1.0.0 — V1 closed. See [CHANGELOG.md](CHANGELOG.md). Further work continues in V2.

Scroll-driven 3D portfolio landing page (inspired by the WebGi Canon camera demo),
built with **Next.js (App Router) + TypeScript**, Three.js and GSAP ScrollTrigger.

## Run

```bash
npm install
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## The 3D model

The hooded-human model lives at `public/models/me.glb` — it was Draco-compressed
from the 78 MB raw export down to ~2 MB with:

```bash
npx @gltf-transform/cli optimize "assets/hooded_human_3d_model.glb" \
  public/models/me.glb --compress draco --texture-compress webp
```

If `public/models/me.glb` is ever missing, the loader falls back to a placeholder
capsule-person so the site still runs. The model is auto-scaled to ~1.6 world
units tall and stood on the plinth, so any export size/origin works.

## Tweaking camera framing

All per-section camera positions/targets live in the `KEYFRAMES` object at the
top of [lib/scroll.ts](lib/scroll.ts) — each section has a commented `pos` /
`target` pair (figurine is ~1.6 units tall; y≈1.0 is its chest, y≈1.5 its head).

## Architecture

The static section markup is **server-rendered** (good first paint / SEO); all
Three.js + GSAP work runs in a client controller that **dynamically imports** the
heavy libs, so nothing WebGL-related touches SSR.

- `app/layout.tsx` — root layout + metadata
- `app/page.tsx` — server-rendered sections, canvas, loader, explore buttons
- `app/globals.css` — dark minimal styling
- `components/SceneController.tsx` — `"use client"` controller: render loop,
  loader progress, visibility/resize handling, cleanup on unmount
- `lib/scene.ts` — renderer, environment lighting, plinth + figurine (with fallback)
- `lib/scroll.ts` — GSAP ScrollTrigger camera timeline, snap, explore mode
- `public/draco/` — Draco decoder (served for GLTF decompression)
