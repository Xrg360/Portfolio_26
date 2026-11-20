import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/content/projects";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="brut brut-hover flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {p.badge ? <span className="tag">{p.badge}</span> : <span />}
        {p.year ? <span className="font-mono text-sm text-muted">{p.year}</span> : null}
      </div>
      <h3 className="mt-4 text-xl font-bold leading-snug">{p.title}</h3>
      <p className="mt-2 text-muted">{p.summary}</p>
      <ul className="mt-4 space-y-2 text-[0.95rem]">
        {p.points.map((pt) => (
          <li key={pt} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-ink" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
        {p.stack.map((s) => (
          <li key={s} className="tag !border-line text-muted">{s}</li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        {p.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener"
            className="btn !min-h-[40px] !px-3 text-sm"
            data-cursor="open ↗"
          >
            {l.label} <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}
        {p.privateNote ? (
          <span className="inline-flex items-center gap-2 font-mono text-sm text-muted">
            <Lock size={14} aria-hidden="true" /> {p.privateNote}
          </span>
        ) : null}
      </div>
    </article>
  );
}
