import { Section, SectionHeading } from "@/components/Section";
import { Reveal, RevealItem } from "@/components/Reveal";
import { about } from "@/lib/data";

export default function About() {
  return (
    <Section id="about">
      <SectionHeading eyebrow="About" title={about.intro} />
      <div className="grid gap-12 lg:grid-cols-[1.5fr,1fr]">
        <Reveal className="space-y-5">
          {about.paragraphs.map((p) => (
            <RevealItem key={p.slice(0, 24)}>
              <p className="text-lg leading-relaxed text-ink-soft">{p}</p>
            </RevealItem>
          ))}
        </Reveal>
        <Reveal className="grid content-start gap-4">
          {about.stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="rounded-2xl border border-surface-line bg-surface-raised p-6"
            >
              <p className="text-4xl font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
