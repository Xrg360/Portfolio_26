import { footer, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="font-mono text-muted">
          <p>
            © 2026 {site.name} · {footer.builtWith}
          </p>
          <p className="mt-1 flex items-center gap-2 text-[0.8rem]">
            {/* tiny crosshair glyph */}
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[var(--val)]" fill="currentColor">
              <rect x="7" y="1" width="2" height="4.5" />
              <rect x="7" y="10.5" width="2" height="4.5" />
              <rect x="1" y="7" width="4.5" height="2" />
              <rect x="10.5" y="7" width="4.5" height="2" />
              <rect x="7.25" y="7.25" width="1.5" height="1.5" />
            </svg>
            {footer.offDuty}
          </p>
        </div>
        <ul className="flex flex-wrap gap-5 font-medium">
          <li><a className="link-grow" href={site.links.github} rel="me noopener" target="_blank">GitHub</a></li>
          <li><a className="link-grow" href={site.links.linkedin} rel="me noopener" target="_blank">LinkedIn</a></li>
          <li><a className="link-grow" href={site.resumePath}>Résumé</a></li>
        </ul>
      </div>
    </footer>
  );
}
