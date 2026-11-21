import { Download, Mail } from "lucide-react";
import { hero, site } from "@/content/site";
import { AgentTrace } from "./AgentTrace";
import { GraphBackdrop } from "./GraphBackdrop";
import { GitHubIcon, LinkedInIcon } from "./icons";

const d = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="grid-paper relative isolate overflow-hidden">
      <GraphBackdrop />
      <div className="mx-auto grid max-w-[1120px] items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="eyebrow rise inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-surface px-2 py-1" style={d(0)}>
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ok" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="display mt-6">
            {site.name}
          </h1>
          <p className="mt-6 max-w-[24ch] text-[clamp(1.35rem,2.6vw,1.75rem)] font-semibold leading-snug">
            {site.oneLiner}
            <span aria-hidden="true" className="caret" />
          </p>
          <p className="rise mt-5 max-w-[56ch] text-muted" style={d(180)}>
            {site.supportingLine}
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={d(240)}>
            <a href={site.resumePath} className="btn btn-primary" data-cursor="download ↓">
              <Download size={18} aria-hidden="true" /> {hero.primaryCta}
            </a>
            <a href={`mailto:${site.email}`} className="btn" data-cursor="email">
              <Mail size={18} aria-hidden="true" /> {hero.secondaryCta}
            </a>
            <a href={site.links.github} target="_blank" rel="me noopener" className="btn btn-icon" aria-label="GitHub (opens in a new tab)" data-cursor="open ↗">
              <GitHubIcon size={18} />
            </a>
            <a href={site.links.linkedin} target="_blank" rel="me noopener" className="btn btn-icon" aria-label="LinkedIn (opens in a new tab)" data-cursor="open ↗">
              <LinkedInIcon size={18} />
            </a>
          </div>
          <p className="rise mt-6 font-mono text-[0.8rem] text-muted" style={d(300)}>
            {site.location} · {site.availability}
          </p>
        </div>
        <div className="rise" style={d(200)}>
          <AgentTrace />
        </div>
      </div>
    </section>
  );
}
