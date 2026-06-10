"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Reveal, RevealItem } from "@/components/Reveal";
import { site } from "@/lib/data";

export default function Contact() {
  return (
    <Section id="contact">
      <Reveal className="relative overflow-hidden rounded-3xl border border-surface-line bg-gradient-to-b from-white to-accent-soft px-8 py-20 text-center sm:px-16">
        <RevealItem>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            Contact
          </p>
        </RevealItem>
        <RevealItem>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s build something together
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Have a mobile app in mind — or an existing one that needs a
            steadier hand? I&apos;m currently open to freelance and full-time
            opportunities.
          </p>
        </RevealItem>
        <RevealItem>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href={`mailto:${site.email}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full bg-ink px-8 py-4 font-medium text-white"
            >
              {site.email}
            </motion.a>
            <motion.a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full border border-surface-line bg-white px-8 py-4 font-medium"
            >
              GitHub
            </motion.a>
            <motion.a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full border border-surface-line bg-white px-8 py-4 font-medium"
            >
              LinkedIn
            </motion.a>
          </div>
        </RevealItem>
      </Reveal>
    </Section>
  );
}
