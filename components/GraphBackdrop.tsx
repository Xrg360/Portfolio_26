"use client";

import { useEffect, useRef, useState } from "react";
import { flowEdges, mainNodes, satellites } from "@/lib/graph-layout";

// Static SVG projection of the same graph (fallback and pre-load state).
const proj = ([x, y]: [number, number, number]) => [50 + x * 4.6, 50 - y * 8.2] as const;
const SATS = satellites();

function StaticGraph() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <g stroke="var(--muted)" vectorEffect="non-scaling-stroke" fill="none">
        {SATS.map((s, i) => {
          const [x1, y1] = proj(s.pos);
          const [x2, y2] = proj(mainNodes[s.parent]);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={0.12} strokeWidth={1} vectorEffect="non-scaling-stroke" />;
        })}
        {flowEdges.map(([a, b]) => {
          const [x1, y1] = proj(mainNodes[a]);
          const [x2, y2] = proj(mainNodes[b]);
          return <line key={a + b} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={0.35} strokeWidth={1} vectorEffect="non-scaling-stroke" />;
        })}
      </g>
    </svg>
  );
}

export function GraphBackdrop() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ok =
      window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData &&
      (navigator.hardwareConcurrency ?? 4) >= 4;
    if (!ok) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;
    const load = () => {
      import("./graph-scene")
        .then(({ startGraph }) => {
          if (cancelled) return;
          try {
            dispose = startGraph(host);
            setLive(true);
          } catch {
            /* WebGL unavailable: keep the static SVG */
          }
        })
        .catch(() => {});
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const idle = (cb: () => void) => (w.requestIdleCallback ? w.requestIdleCallback(cb, { timeout: 3000 }) : w.setTimeout(cb, 1500));
    const start = () => window.setTimeout(() => idle(load), 1200);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      dispose?.();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_70%_at_60%_45%,black_35%,transparent_80%)]"
    >
      <div className={`absolute inset-0 transition-opacity duration-1000 ${live ? "opacity-0" : "opacity-100"}`}>
        <StaticGraph />
      </div>
      <div ref={hostRef} className={`absolute inset-0 transition-opacity duration-1000 ${live ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
