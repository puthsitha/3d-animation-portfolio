import { site } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-surface-line px-6 py-10">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 text-sm text-ink-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js,
          Tailwind &amp; Framer Motion.
        </p>
        <p className="font-mono text-xs">{site.location}</p>
      </div>
    </footer>
  );
}
