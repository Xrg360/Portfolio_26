import type { ReactNode } from "react";

type Props = {
  id: string;
  index: string;
  eyebrow: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, index, eyebrow, title, children, className = "" }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6" data-reveal>
        <p className="eyebrow text-muted flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span aria-hidden="true" className="h-[2px] w-8 bg-ink" />
          <span>{eyebrow}</span>
        </p>
        {title ? (
          <h2 id={`${id}-title`} className="h2 mt-3 max-w-[30ch]">
            {title}
          </h2>
        ) : null}
        <div className={title ? "mt-10" : "mt-4"}>{children}</div>
      </div>
    </section>
  );
}
