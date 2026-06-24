/**
 * Lightweight "3D" section artwork. Pure inline SVG with isometric geometry,
 * soft gradients and glass highlights so each new CV section gets a rendered-
 * 3D feel without shipping a single image byte or running any WebGL. A gentle
 * CSS float (see globals.css .section-art) gives them life; it's disabled
 * under prefers-reduced-motion.
 */

type Variant = "experience" | "education" | "skills" | "resume";

const grad = (id: string, from: string, to: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor={from} />
    <stop offset="1" stopColor={to} />
  </linearGradient>
);

/** Isometric stacked phone — Experience. */
function Experience() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="Stacked mobile devices">
      <defs>
        {grad("exp-a", "#8a8aff", "#5b5bff")}
        {grad("exp-b", "#3a3a55", "#1c1c2c")}
      </defs>
      <g transform="translate(110 118)">
        {/* back slab */}
        <g transform="translate(26 -34)" opacity="0.5">
          <path d="M0-58 52-28 52 30 0 60-52 30-52-28Z" fill="url(#exp-b)" />
        </g>
        {/* device body */}
        <path d="M0-66 56-34 56 34 0 66-56 34-56-34Z" fill="url(#exp-a)" />
        <path d="M0-66 56-34 0-2-56-34Z" fill="#ffffff" opacity="0.18" />
        {/* screen */}
        <path d="M0-50 40-27 40 27 0 50-40 27-40-27Z" fill="#0c0c14" opacity="0.85" />
        {/* ui rows */}
        <g fill="#8a8aff" opacity="0.9">
          <path d="M-20-14 4-2-20 10Z" />
          <path d="M-20 2 4 14-20 26Z" opacity="0.6" />
          <path d="M-20 18 -4 26-20 34Z" opacity="0.4" />
        </g>
      </g>
    </svg>
  );
}

/** Floating graduation cap — Education. */
function Education() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="Graduation cap">
      <defs>
        {grad("edu-a", "#9a9aff", "#5b5bff")}
        {grad("edu-b", "#2a2a40", "#15151f")}
      </defs>
      <g transform="translate(110 110)">
        {/* base / head block */}
        <path d="M0 4 40 26 0 48-40 26Z" fill="url(#edu-b)" />
        <path d="M-40 26 0 48 0 70-40 48Z" fill="#1c1c2c" />
        <path d="M40 26 0 48 0 70 40 48Z" fill="#121220" />
        {/* mortarboard */}
        <path d="M0-44 70-6 0 32-70-6Z" fill="url(#edu-a)" />
        <path d="M0-44 70-6 0 8-70-6Z" fill="#ffffff" opacity="0.15" />
        {/* tassel */}
        <path d="M0-6 56-24" stroke="#ffd479" strokeWidth="3" fill="none" />
        <circle cx="56" cy="-24" r="5" fill="#ffd479" />
        <path d="M56-19 56 4" stroke="#ffd479" strokeWidth="3" />
      </g>
    </svg>
  );
}

/** Layered skill chips — Skills. */
function Skills() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="Stacked skill layers">
      <defs>
        {grad("skl-a", "#8a8aff", "#5b5bff")}
        {grad("skl-b", "#6f6fe0", "#4a4ad0")}
        {grad("skl-c", "#5757c8", "#3a3ab0")}
      </defs>
      <g transform="translate(110 120)">
        {[
          { y: 34, fill: "url(#skl-c)", o: 0.85 },
          { y: 4, fill: "url(#skl-b)", o: 0.92 },
          { y: -26, fill: "url(#skl-a)", o: 1 },
        ].map((l, i) => (
          <g key={i} transform={`translate(0 ${l.y})`} opacity={l.o}>
            <path d="M0-30 64-2 0 26-64-2Z" fill={l.fill} />
            <path d="M-64-2 0 26 0 38-64 10Z" fill="#1c1c2c" opacity="0.55" />
            <path d="M64-2 0 26 0 38 64 10Z" fill="#10101c" opacity="0.55" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Floating document — Resume / CV. */
function Resume() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="Document">
      <defs>
        {grad("res-a", "#f2f2f0", "#c9c9e6")}
        {grad("res-b", "#8a8aff", "#5b5bff")}
      </defs>
      <g transform="translate(110 110)">
        {/* back page */}
        <g transform="translate(14 8) rotate(6)" opacity="0.4">
          <rect x="-46" y="-62" width="92" height="124" rx="8" fill="#2a2a40" />
        </g>
        {/* main page */}
        <g transform="rotate(-5)">
          <rect x="-46" y="-62" width="92" height="124" rx="8" fill="url(#res-a)" />
          <rect x="-30" y="-46" width="34" height="34" rx="6" fill="url(#res-b)" />
          <g fill="#5b5b77" opacity="0.6">
            <rect x="10" y="-44" width="24" height="6" rx="3" />
            <rect x="10" y="-32" width="18" height="6" rx="3" />
          </g>
          <g fill="#9a9ab8" opacity="0.55">
            <rect x="-30" y="2" width="60" height="5" rx="2.5" />
            <rect x="-30" y="14" width="60" height="5" rx="2.5" />
            <rect x="-30" y="26" width="44" height="5" rx="2.5" />
            <rect x="-30" y="38" width="52" height="5" rx="2.5" />
          </g>
        </g>
      </g>
    </svg>
  );
}

const MAP = { experience: Experience, education: Education, skills: Skills, resume: Resume };

export default function SectionArt({ variant }: { variant: Variant }) {
  const Art = MAP[variant];
  return (
    <div className="section-art" aria-hidden={false}>
      <Art />
    </div>
  );
}
