"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface Skill {
  label: string;
  value: number;
}

/**
 * Skill proficiency bars whose fill sweeps out — and whose percentage counts
 * up — the first time the group scrolls into view. Honours
 * prefers-reduced-motion by rendering the final values immediately.
 */
export default function SkillBars({ skills }: { skills: Skill[] }) {
  return (
    <div className="skill-bars">
      {skills.map((s, i) => (
        <SkillBar key={s.label} skill={s} delay={i * 0.12} />
      ))}
    </div>
  );
}

function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const progress = useMotionValue(reduce ? skill.value : 0);
  const width = useTransform(progress, (v) => `${v}%`);
  const pct = useTransform(progress, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(progress, skill.value, {
      duration: 1.1,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, reduce, skill.value, delay, progress]);

  return (
    <div className="skill-bar" ref={ref}>
      <div className="skill-bar__head">
        <span>{skill.label}</span>
        <motion.span className="skill-bar__pct">{pct}</motion.span>
      </div>
      <div className="skill-bar__track">
        <motion.span className="skill-bar__fill" style={{ width }} />
      </div>
    </div>
  );
}
