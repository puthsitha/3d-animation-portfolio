"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  /** Phrases typed out one after another, looping. */
  phrases: string[];
  /** Ms per character while typing. */
  typeSpeed?: number;
  /** Ms per character while deleting. */
  deleteSpeed?: number;
  /** Ms to hold a finished phrase before deleting it. */
  pauseTime?: number;
  className?: string;
}

/**
 * Typewriter text (inspired by 21st.dev) — types each phrase, holds, deletes,
 * and moves to the next, looping forever, with a blinking caret. Honours
 * prefers-reduced-motion by showing the first phrase statically.
 */
export default function Typewriter({
  phrases,
  typeSpeed = 70,
  deleteSpeed = 38,
  pauseTime = 1400,
  className = "",
}: TypewriterProps) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(phrases[0]);
      setDone(true);
      return;
    }

    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const current = phrases[phrase];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));

      let delay = deleting ? deleteSpeed : typeSpeed;
      if (!deleting && char === current.length) {
        deleting = true;
        delay = pauseTime;
      } else if (deleting && char === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        delay = typeSpeed * 2;
      }
      timer = setTimeout(step, delay);
    };

    timer = setTimeout(step, typeSpeed);
    return () => clearTimeout(timer);
  }, [phrases, typeSpeed, deleteSpeed, pauseTime]);

  return (
    <span className={`typewriter ${className}`}>
      {text}
      <span className={`typewriter__caret ${done ? "is-static" : ""}`} aria-hidden />
    </span>
  );
}
