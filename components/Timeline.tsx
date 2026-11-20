import { GraduationCap } from "lucide-react";
import { education, experience } from "@/content/experience";

export function Timeline() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div>
        {experience.map((c) => (
          <article key={c.company} className="brut p-5 sm:p-7">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-xl font-bold">{c.company}</h3>
              <p className="font-mono text-sm text-muted">
                {c.location} · {c.period}
              </p>
            </header>
            <ol className="relative mt-6 space-y-10 border-l-2 border-ink pl-6 sm:pl-8">
              {c.roles.map((r, ri) => (
                <li key={r.title} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-2 border-ink sm:-left-[41px] ${ri === 0 ? "bg-accent" : "bg-surface"}`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h4 className="text-lg font-semibold">{r.title}</h4>
                    <p className="font-mono text-sm text-muted">{r.period}</p>
                  </div>
                  {r.groups?.map((g) => (
                    <div key={g.title} className="mt-5">
                      <p className="font-semibold">
                        <span className="text-accent">{g.title}</span>
                        <span className="text-muted font-normal"> · {g.context}</span>
                      </p>
                      <ul className="mt-2 space-y-2">
                        {g.bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-[0.98rem]">
                            <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-ink" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {r.bullets ? (
                    <ul className="mt-3 space-y-2">
                      {r.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-[0.98rem]">
                          <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-ink" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <aside aria-labelledby="edu-title" className="brut h-fit p-5 sm:p-6 lg:sticky lg:top-24">
        <p className="eyebrow flex items-center gap-2 text-accent">
          <GraduationCap size={16} aria-hidden="true" /> Education
        </p>
        <h3 id="edu-title" className="mt-3 font-bold leading-snug">{education.school}</h3>
        <p className="mt-1 text-muted">{education.degree}</p>
        <p className="mt-2 font-mono text-sm text-muted">
          {education.period} · {education.grade}
        </p>
        <p className="eyebrow mt-5 text-muted">Leadership</p>
        <ul className="mt-2 space-y-2 text-[0.95rem]">
          {education.leadership.map((l) => (
            <li key={l} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-ink" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
