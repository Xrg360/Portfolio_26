import Link from "next/link";
import { notFoundCopy } from "@/content/site";

export default function NotFound() {
  return (
    <section className="grid-paper">
      <div className="mx-auto max-w-[1120px] px-4 py-24 sm:px-6 md:py-32">
        <div className="brut max-w-xl p-6 font-mono text-sm sm:p-8">
          <p><span className="text-accent">▸ request</span>   {notFoundCopy.code}</p>
          <p><span className="text-accent">▸ policy</span>    no matching route <span className="text-warn">⚠</span></p>
          <p><span className="text-accent">▸ execute</span>   refused · nothing invented <span className="text-ok">✓</span></p>
        </div>
        <h1 className="display mt-10 !text-[clamp(2rem,5vw,3.4rem)]">{notFoundCopy.title}</h1>
        <p className="mt-4 max-w-[52ch] text-lg text-muted">{notFoundCopy.body}</p>
        <Link href="/" className="btn btn-primary mt-8">{notFoundCopy.back}</Link>
      </div>
    </section>
  );
}
