"use client";

import { useEffect, useState } from "react";

interface RotatingTextProps {
  /** Words to cycle through, swapping one for the next. */
  texts: string[];
  /** Ms each word stays on screen before swapping. */
  interval?: number;
  className?: string;
}

/**
 * Lightweight rotating text. Swaps words with a cheap CSS slide-up + fade
 * (one transform/opacity transition per swap) — no per-frame blur filters,
 * so it stays smooth even on low-end devices. Replaces the heavier GooeyText.
 *
 * Honours prefers-reduced-motion by holding the first word static.
 */
export default function RotatingText({
  texts,
  interval = 2200,
  className = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (texts.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(false);
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length);
    }, interval);
    return () => clearInterval(id);
  }, [texts, interval]);

  return (
    <span className={`rotating-text ${className}`}>
      {/* Sizing ghost: reserves the widest word so layout never jumps. */}
      <span aria-hidden className="rotating-text__ghost">
        {texts.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <span
        key={index}
        className={`rotating-text__word ${animate ? "is-animated" : ""}`}>
        {texts[index]}
      </span>
    </span>
  );
}
