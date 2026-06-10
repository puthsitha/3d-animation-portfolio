import { Reveal, RevealItem } from "@/components/Reveal";

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 px-6 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-content">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mb-14 max-w-2xl">
      <RevealItem>
        <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      </RevealItem>
      <RevealItem>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </RevealItem>
      {description ? (
        <RevealItem>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {description}
          </p>
        </RevealItem>
      ) : null}
    </Reveal>
  );
}
