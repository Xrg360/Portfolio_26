import { footer, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-muted">
          © 2026 {site.name} · {footer.builtWith}
        </p>
        <ul className="flex flex-wrap gap-5 font-medium">
          <li><a className="link-grow" href={site.links.github} rel="me noopener" target="_blank">GitHub</a></li>
          <li><a className="link-grow" href={site.links.linkedin} rel="me noopener" target="_blank">LinkedIn</a></li>
          <li><a className="link-grow" href={site.resumePath}>Résumé</a></li>
        </ul>
      </div>
    </footer>
  );
}
