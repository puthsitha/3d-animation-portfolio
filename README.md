# Portfolio

Personal developer portfolio — Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion.

The centerpiece is a scroll-driven 3D figurine: `public/figurine-spin.mp4` is scrubbed via
`video.currentTime` tied to scroll progress (Framer Motion `useScroll`), pinned in the viewport
while caption phases cross-fade past it. On touch devices and with `prefers-reduced-motion`,
it gracefully falls back to a simple autoplay loop.

## Editing content

All personal content (name, tagline, skills, projects, experience, links) lives in one file:
[`lib/data.ts`](lib/data.ts). Edit it and everything updates.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Smooth scrubbing tip

If the scroll-scrub ever feels steppy, re-encode the video with a keyframe every frame so
the decoder can seek instantly to any time:

```bash
ffmpeg -i assets/figurine-spin.mp4 -g 1 -an -movflags +faststart -crf 23 public/figurine-spin.mp4
```

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new) — no configuration
needed. Or from the CLI:

```bash
npx vercel
```
