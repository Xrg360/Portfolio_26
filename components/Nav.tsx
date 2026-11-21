import Link from "next/link";
import { Download, Menu } from "lucide-react";
import { site } from "@/content/site";
import { BrandMark } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

type Props = { showWriting: boolean };

export function Nav({ showWriting }: Props) {
  const items = [
    { href: "/#experience", label: "Experience" },
    { href: "/#projects", label: "Projects" },
    ...(showWriting ? [{ href: "/writing", label: "Writing" }] : []),
    { href: "/#skills", label: "Skills" },
    { href: "/#contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-bg">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold" aria-label={`${site.name}, home`}>
          <BrandMark size={28} />
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ul className="hidden items-center gap-5 md:flex">
            {items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="link-grow text-[0.95rem] font-medium">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={site.resumePath} className="btn btn-primary !min-h-[40px] !px-3 text-sm" data-cursor="download ↓">
            Résumé <Download size={16} aria-hidden="true" />
          </a>
          <ThemeToggle />
          {/* Mobile menu: <details> works without JavaScript */}
          <details className="relative md:hidden">
            <summary className="btn btn-icon list-none [&::-webkit-details-marker]:hidden" aria-label="Open menu">
              <Menu size={18} aria-hidden="true" />
            </summary>
            <ul className="brut absolute right-0 mt-3 w-48 p-2">
              {items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="block rounded px-3 py-2.5 font-medium hover:bg-ink hover:text-bg">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
