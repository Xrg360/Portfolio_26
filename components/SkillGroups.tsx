import type { CSSProperties } from "react";
import { skills } from "@/content/skills";

/**
 * Giant category rows; hover, focus or tap one to wipe in its skill list.
 * CSS only, so it works without JS. Both layers stay in the DOM for screen readers.
 */
export function SkillGroups() {
  return (
    <div>
      <p className="mb-4 font-mono text-[0.8rem] text-muted">
        <span className="hidden [@media(hover:hover)]:inline">Hover a row</span>
        <span className="[@media(hover:hover)]:hidden">Tap a row</span> to reveal the stack.
      </p>
      <ul className="border-t-2 border-ink">
        {skills.map((g, i) => (
          <li key={g.group} tabIndex={0} className="skill-row" data-cursor="reveal">
            <div className="skill-label">
              <span className="font-mono text-[0.8rem] text-muted sm:text-sm">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="skill-title">{g.group}</h3>
              <span aria-hidden="true" className="skill-arrow font-mono text-muted">
                {g.items.length} ↘
              </span>
            </div>
            <ul className="skill-reveal" aria-label={`${g.group} skills`}>
              {g.items.map((s, k) => (
                <li key={s} style={{ "--d": `${90 + k * 35}ms` } as CSSProperties}>
                  {s}
                  {k < g.items.length - 1 ? <span aria-hidden="true" className="opacity-60">,</span> : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
