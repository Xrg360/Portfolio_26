import { Activity, Plug, ShieldCheck } from "lucide-react";
import { capabilities } from "@/content/site";

const icons = { plug: Plug, shield: ShieldCheck, activity: Activity } as const;

export function CapabilityCards() {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {capabilities.map((c, i) => {
        const Icon = icons[c.icon];
        return (
          <li key={c.title} className="brut brut-hover group p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-md border-2 border-ink bg-bg transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="font-mono text-sm text-muted">0{i + 1}</span>
            </div>
            <h3 className="mt-5 text-lg font-bold leading-snug">{c.title}</h3>
            <p className="mt-2 text-muted">{c.body}</p>
          </li>
        );
      })}
    </ul>
  );
}
