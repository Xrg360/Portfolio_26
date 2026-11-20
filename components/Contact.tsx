import { Download, Mail } from "lucide-react";
import { contact, sections, site } from "@/content/site";
import { CopyEmail } from "./CopyEmail";
import { GitHubIcon, LinkedInIcon } from "./icons";

export function Contact({ index }: { index: string }) {
  return (
    <section id={sections.contact.id} aria-labelledby="contact-title" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6" data-reveal>
        <div className="brut grid-paper relative overflow-hidden p-6 sm:p-10 md:p-14">
          <p className="eyebrow text-muted flex items-center gap-3">
            <span className="text-accent">{index}</span>
            <span aria-hidden="true" className="h-[2px] w-8 bg-ink" />
            <span>{sections.contact.eyebrow}</span>
          </p>
          <h2 id="contact-title" className="display mt-4 max-w-[18ch] !text-[clamp(2rem,5vw,3.4rem)]">
            {contact.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg text-muted">{contact.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${site.email}`} className="btn btn-primary" data-cursor="email">
              <Mail size={18} aria-hidden="true" /> Email me
            </a>
            <a href={site.resumePath} className="btn" data-cursor="download ↓">
              <Download size={18} aria-hidden="true" /> Download résumé
            </a>
            <a href={site.links.linkedin} target="_blank" rel="me noopener" className="btn btn-icon" aria-label="LinkedIn (opens in a new tab)" data-cursor="open ↗">
              <LinkedInIcon size={18} />
            </a>
            <a href={site.links.github} target="_blank" rel="me noopener" className="btn btn-icon" aria-label="GitHub (opens in a new tab)" data-cursor="open ↗">
              <GitHubIcon size={18} />
            </a>
          </div>
          <div className="mt-8">
            <CopyEmail email={site.email} />
          </div>
        </div>
      </div>
    </section>
  );
}
