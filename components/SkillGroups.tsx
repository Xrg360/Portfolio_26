import { skills } from "@/content/skills";

export function SkillGroups() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {skills.map((g) => (
        <div key={g.group} className="brut p-5">
          <h3 className="eyebrow text-accent">{g.group}</h3>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={g.group}>
            {g.items.map((s) => (
              <li key={s} className="chip !rounded-md !text-[0.8rem]">{s}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
