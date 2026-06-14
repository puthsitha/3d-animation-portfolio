"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

interface LiquidButtonProps {
  children: ReactNode;
  id?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

/**
 * Liquid Glass button (inspired by 21st.dev). A glassmorphic pill — blurred
 * translucent backdrop, inset specular highlights — with a soft accent glow
 * that tracks the pointer across the surface, plus a hover lift/press spring
 * via framer-motion. An SVG turbulence layer gives the rim a faint liquid
 * shimmer.
 *
 * Forwards `id`, so scroll.ts can still bind its click handler by id.
 */
export default function LiquidButton({
  children,
  id,
  className = "",
  type = "button",
  onClick,
}: LiquidButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glowX = useSpring(mx, { stiffness: 200, damping: 20 });
  const glowY = useSpring(my, { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };
  const onLeave = () => {
    mx.set(50);
    my.set(50);
  };

  return (
    <motion.button
      ref={ref}
      id={id}
      type={type}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`liquid-btn ${className}`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {/* pointer-tracking specular glow */}
      <motion.span
        className="liquid-btn__glow"
        aria-hidden
        style={{
          background: useMotionTemplateBg(glowX, glowY),
        }}
      />
      <span className="liquid-btn__label">{children}</span>
    </motion.button>
  );
}

/**
 * Builds a radial-gradient string that follows the two spring motion values.
 * (Kept inline-tiny so the component file stays self-contained.)
 */
function useMotionTemplateBg(
  x: ReturnType<typeof useSpring>,
  y: ReturnType<typeof useSpring>
) {
  return useMotionTemplate`radial-gradient(120px circle at ${x}% ${y}%, rgba(138,138,255,0.55), rgba(138,138,255,0) 70%)`;
}
