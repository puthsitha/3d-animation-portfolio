"use client";

import { useEffect, useRef } from "react";

interface GooeyTextProps {
  /** Words to cycle through, morphing one into the next. */
  texts: string[];
  /** Seconds the blur-morph between two words takes. */
  morphTime?: number;
  /** Seconds a word stays fully readable before the next morph. */
  cooldownTime?: number;
  className?: string;
}

/**
 * Gooey text morphing (inspired by 21st.dev). Two overlaid spans cross-fade
 * through a shared SVG gooey filter: as one blurs out the next blurs in, and
 * the threshold filter fuses the blurred glyphs into liquid "blobs" mid-swap.
 *
 * Honours prefers-reduced-motion by hard-cutting between words instead of
 * blurring.
 */
export default function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 1.6,
  className = "",
}: GooeyTextProps) {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const t1 = text1Ref.current;
    const t2 = text2Ref.current;
    if (!t1 || !t2 || texts.length === 0) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let index = 0;
    let morph = 0;
    let cooldown = cooldownTime;
    let last = performance.now();
    let raf = 0;

    t1.textContent = texts[0];
    t2.textContent = texts[1 % texts.length];

    const setMorph = (fraction: number) => {
      t2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      t2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      const inv = 1 - fraction;
      t1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      t1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    };

    const setStill = () => {
      t2.style.filter = "";
      t2.style.opacity = "100%";
      t1.style.filter = "";
      t1.style.opacity = "0%";
    };

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      const dt = (now - last) / 1000;
      last = now;

      cooldown -= dt;
      if (cooldown > 0) {
        setStill();
        return;
      }

      // morph phase
      morph += dt;
      let fraction = morph / morphTime;
      if (reduce) fraction = fraction < 1 ? 0 : 1;

      if (fraction >= 1) {
        // landed on the next word — advance and rest
        fraction = 1;
        morph = 0;
        cooldown = cooldownTime;
        index = (index + 1) % texts.length;
        t1.textContent = texts[index];
        t2.textContent = texts[(index + 1) % texts.length];
        setStill();
        return;
      }
      setMorph(fraction);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [texts, morphTime, cooldownTime]);

  return (
    <span className={`gooey ${className}`}>
      <svg aria-hidden className="gooey__filter" width="0" height="0">
        <defs>
          <filter id="gooey-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
      <span className="gooey__stage">
        <span ref={text1Ref} className="gooey__text" />
        <span ref={text2Ref} className="gooey__text" />
      </span>
    </span>
  );
}
