"use client";

import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal, RevealItem } from "@/components/Reveal";
import { skillGroups } from "@/lib/data";

export default function Skills() {
  return (
    <Section id="skills" className="bg-surface-raised">
      <SectionHeading
        eyebrow="Skills"
        title="The toolbox"
        description="Everything I reach for when turning an idea into something on the App Store."
      />
      <Reveal className="grid gap-6 sm:grid-cols-2" amount={0.15}>
        {skillGroups.map((group) => (
          <RevealItem key={group.title}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="h-full rounded-2xl border border-surface-line bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-ink-faint">{group.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-surface-line bg-surface-raised px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
