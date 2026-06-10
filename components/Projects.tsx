"use client";

import { Section, SectionHeading } from "@/components/Section";
import { Reveal, RevealItem } from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="A few things I've designed, built, and shipped — native iOS and cross-platform Flutter."
      />
      <div style={{ perspective: 1200 }}>
        <Reveal
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          amount={0.1}
        >
          {projects.map((project) => (
            <RevealItem key={project.title} className="h-full">
              <TiltCard className="group h-full rounded-2xl border border-surface-line bg-white p-7 shadow-sm transition-shadow hover:shadow-lg">
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-lg font-semibold text-white"
                  style={{ backgroundColor: project.accent }}
                  aria-hidden
                >
                  {project.title[0]}
                </div>
                <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {project.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-surface-raised px-2 py-1 font-mono text-xs text-ink-faint"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
