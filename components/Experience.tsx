import { Section, SectionHeading } from "@/components/Section";
import { Reveal, RevealItem } from "@/components/Reveal";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <Section id="experience" className="bg-surface-raised">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've worked"
        description="A timeline of shipping mobile software, from first commit to today."
      />
      <Reveal className="relative space-y-12 border-l border-surface-line pl-8 sm:pl-12">
        {experience.map((item) => (
          <RevealItem key={item.period} className="relative">
            {/* Timeline dot */}
            <span
              className="absolute -left-8 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-accent ring-1 ring-surface-line sm:-left-12"
              aria-hidden
            />
            <p className="font-mono text-sm text-ink-faint">{item.period}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              {item.role}
              <span className="text-ink-faint"> · {item.company}</span>
            </h3>
            <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
              {item.description}
            </p>
            <ul className="mt-4 space-y-2">
              {item.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex max-w-2xl gap-3 text-sm leading-relaxed text-ink-soft"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {highlight}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
