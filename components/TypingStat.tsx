"use client";

import { useEffect, useRef, useState } from "react";
import { Keyboard } from "lucide-react";
import { typingCopy as c } from "@/content/site";
import type { TypingStats } from "@/lib/monkeytype";

type Ok = Extract<TypingStats, { ok: true }>;
const POLL_MS = 60_000;

function ago(ts: number) {
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 90) return "just now";
  const m = s / 60;
  if (m < 60) return `${Math.round(m)} min ${c.ago}`;
  const h = m / 60;
  if (h < 36) return `${Math.round(h)} h ${c.ago}`;
  return `${Math.round(h / 24)} d ${c.ago}`;
}

/** Count up to a new value (skipped under reduced motion). */
function useCount(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || from.current === target) {
      from.current = target;
      setV(target);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      setV(Math.round(a + (target - a) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
      else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export function TypingStat() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Ok | null>(null);
  const [, tick] = useState(0); // re-render so "x min ago" stays fresh

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let timer = 0;
    let started = false;
    const load = async () => {
      if (document.hidden) return;
      try {
        const r = await fetch("/api/typing", { cache: "no-store" });
        const j = (await r.json()) as TypingStats;
        if (j.ok) setData(j);
        tick((n) => n + 1);
      } catch {
        /* keep whatever we showed last */
      }
    };
    const start = () => {
      if (started) return;
      started = true;
      load();
      timer = window.setInterval(load, POLL_MS);
    };
    // Only start once the section is near the viewport.
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (start(), io.disconnect()), { rootMargin: "600px" });
    io.observe(host);
    const onVis = () => started && !document.hidden && load();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const wpm = useCount(data?.last.wpm ?? 0);

  return (
    <div ref={hostRef} aria-live="polite">
      {data ? (
        <div className="brut rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md border-2 border-ink bg-accent text-accent-ink">
              <Keyboard size={20} aria-hidden="true" />
            </span>
            <div className="font-mono text-[0.78rem] leading-tight">
              <p className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-ok">
                <span aria-hidden="true" className="pulse-ok inline-block h-2 w-2 rounded-full bg-ok" />
                {c.live}
              </p>
              <p className="text-muted">
                {c.source} · {c.lastTest}
              </p>
            </div>
          </div>

          <p className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight tabular-nums">{wpm}</span>
            <span className="font-mono text-sm text-muted">wpm</span>
            {data.last.isPb ? <span className="tag !border-accent !text-accent">{c.newPb}</span> : null}
          </p>

          <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 font-mono text-[0.8rem]">
            <dt className="text-muted">{c.acc}</dt>
            <dd>{data.last.acc}%</dd>
            <dt className="text-muted">test</dt>
            <dd>
              {data.last.label} · {data.last.language}
            </dd>
            {data.pb ? (
              <>
                <dt className="text-muted">{c.best}</dt>
                <dd>
                  {data.pb.wpm} wpm · {data.pb.acc}%
                </dd>
              </>
            ) : null}
          </dl>

          <p className="font-mono text-[0.75rem] text-muted sm:ml-auto sm:text-right">
            <time dateTime={new Date(data.last.timestamp).toISOString()}>{ago(data.last.timestamp)}</time>
            <br />
            {c.note}
          </p>
        </div>
      ) : null}
    </div>
  );
}
