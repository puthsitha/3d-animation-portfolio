"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Shared Framer Motion primitives for the scroll-driven CV block.    */
/*                                                                     */
/*  These live BELOW the 3D #content experience (which is owned by     */
/*  GSAP ScrollTrigger), so they're free to drive their own           */
/*  in-view entrances without fighting the camera timeline.            */
/*                                                                     */
/*  Every primitive honours prefers-reduced-motion: when the user      */
/*  asks for less motion we render the content in its final state with */
/*  no transform/opacity tweening (motion still strips its own props,  */
/*  so no stray attributes land on the DOM).                           */
/* ------------------------------------------------------------------ */

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET = 32;
const EASE = [0.22, 1, 0.36, 1] as const;

function offsetFor(direction: Direction) {
  switch (direction) {
    case "up":
      return { x: 0, y: OFFSET };
    case "down":
      return { x: 0, y: -OFFSET };
    case "left":
      return { x: OFFSET, y: 0 };
    case "right":
      return { x: -OFFSET, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

type RevealProps = HTMLMotionProps<"div"> & {
  /** Which way the element drifts in from. */
  direction?: Direction;
  /** Seconds to wait before the entrance plays. */
  delay?: number;
  /** Element tag to render. Defaults to a div. */
  as?: keyof JSX.IntrinsicElements;
};

/**
 * Fade + slide an element into view the first time it scrolls on screen.
 * Drop it around any block in the CV section for a polished entrance.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  as = "div",
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const { x, y } = offsetFor(direction);
  const MotionTag = (motion as any)[as] ?? motion.div;

  return (
    <MotionTag
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}>
      {children}
    </MotionTag>
  );
}

/* ---- Staggered groups -------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

type AsProps = HTMLMotionProps<"div"> & {
  as?: keyof JSX.IntrinsicElements;
};

/**
 * Container that releases its <StaggerItem> children one after another as the
 * group scrolls into view.
 */
export function Stagger({ children, as = "div", ...rest }: AsProps) {
  const reduce = useReducedMotion();
  const MotionTag = (motion as any)[as] ?? motion.div;

  if (reduce) {
    return <MotionTag {...rest}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      {...rest}>
      {children}
    </MotionTag>
  );
}

/** A single child of <Stagger>. */
export function StaggerItem({ children, as = "div", ...rest }: AsProps) {
  const reduce = useReducedMotion();
  const MotionTag = (motion as any)[as] ?? motion.div;

  if (reduce) {
    return <MotionTag {...rest}>{children}</MotionTag>;
  }

  return (
    <MotionTag variants={itemVariants} {...rest}>
      {children}
    </MotionTag>
  );
}

type MotionLinkProps = HTMLMotionProps<"a"> & {
  href: string;
};

/**
 * Anchor with a springy lift on hover and a press-down on tap — used for the
 * CV download / open buttons.
 */
export function MotionLink({ children, ...rest }: MotionLinkProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <motion.a {...rest}>{children}</motion.a>;
  }

  return (
    <motion.a
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      {...rest}>
      {children}
    </motion.a>
  );
}
