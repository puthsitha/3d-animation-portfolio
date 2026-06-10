"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { site } from "@/lib/data";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  // Parallax: as the hero scrolls out, the text drifts up slower than the
  // page and the background glow slower still, giving depth.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6"
    >
      <motion.div
        style={{ y: glowY }}
        className="bg-glow pointer-events-none absolute inset-0"
        aria-hidden
      />

      <motion.div
        style={{ y: contentY, opacity }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-content pt-16"
      >
        <motion.p
          variants={rise}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-surface-line bg-white px-4 py-1.5 font-mono text-xs text-ink-soft"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Available for new projects
        </motion.p>

        <motion.h1
          variants={rise}
          className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl"
        >
          {site.name}
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-4 text-xl font-medium text-ink sm:text-2xl"
        >
          {site.role}{" "}
          <span className="text-ink-faint">({site.roleDetail})</span>
        </motion.p>

        <motion.p
          variants={rise}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
        >
          {site.tagline}
        </motion.p>

        <motion.div variants={rise} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-full bg-ink px-7 py-3.5 font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-surface-line bg-white px-7 py-3.5 font-medium text-ink transition-all hover:scale-105 hover:border-ink-faint active:scale-95"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-faint"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="font-mono text-xs tracking-widest"
        >
          SCROLL ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
