"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animated pointer (inspired by 21st.dev). A small solid dot tracks the
 * pointer 1:1 while a larger ring trails it with a spring, and the ring grows
 * + brightens when hovering anything interactive (links / buttons / [data-cursor]).
 *
 * Disabled entirely on touch / coarse pointers and under prefers-reduced-motion,
 * where the native cursor is left untouched.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  // dot: instant. ring: springy trail.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHovering(!!el?.closest('a, button, [data-cursor="hover"]'));
    };
    const downFn = () => setDown(true);
    const upFn = () => setDown(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", downFn);
    window.addEventListener("pointerup", upFn);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", downFn);
      window.removeEventListener("pointerup", upFn);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursor-ring"
        style={{ left: ringX, top: ringY }}
        animate={{ scale: hovering ? 1.8 : down ? 0.7 : 1, opacity: hovering ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-hidden
      />
      <motion.div
        className="cursor-dot"
        style={{ left: x, top: y }}
        animate={{ scale: down ? 0.6 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        aria-hidden
      />
    </>
  );
}
