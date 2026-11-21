"use client";

import { useEffect, useRef, useState } from "react";

export type Mood = "focused" | "happy" | "concerned" | "delighted";

/**
 * Hand-drawn SVG character (wavy hair, specs) peeking over the trace panel.
 * Eyes follow the pointer; the face reacts to the agent run.
 */
export function Avatar({ mood, typing }: { mood: Mood; typing: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const [hover, setHover] = useState(false);
  if (hover) mood = "delighted";

  // Blink every few seconds (one style change, not a running animation).
  const lidsRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t1 = 0;
    let t2 = 0;
    const blink = () => {
      lidsRef.current?.setAttribute("transform", "translate(0 79) scale(1 0.1) translate(0 -79)");
      t2 = window.setTimeout(() => lidsRef.current?.removeAttribute("transform"), 130);
      t1 = window.setTimeout(blink, 3800 + Math.random() * 2400);
    };
    t1 = window.setTimeout(blink, 2500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const pupils = pupilsRef.current;
    if (!svg || !pupils) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let lastMove = 0;
    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 2.5;
    let running = false;

    const tick = () => {
      const r = svg.getBoundingClientRect();
      const active = performance.now() - lastMove < 2500;
      let tx = 0;
      let ty = 2.5; // idle: look down at the trace
      if (active && r.width) {
        const ex = r.left + r.width * 0.5;
        const ey = r.top + r.height * 0.68;
        const dx = px - ex;
        const dy = py - ey;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 220);
        tx = (dx / d) * 3.6 * k;
        ty = (dy / d) * 2.8 * k;
      }
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      pupils.setAttribute("transform", `translate(${cx.toFixed(2)} ${cy.toFixed(2)})`);
      if (Math.abs(tx - cx) > 0.02 || Math.abs(ty - cy) > 0.02 || active) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      lastMove = performance.now();
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const browL = mood === "concerned" ? "M64 62 Q74 55 84 62" : "M64 66 Q74 61 84 65";
  const browR = mood === "concerned" ? "M96 63 Q106 61 116 64" : "M96 65 Q106 61 116 66";

  return (
    <div className="relative">
      <span aria-hidden="true" className="drift-html absolute -left-3 top-3 text-[13px] text-accent">✦</span>
      <span aria-hidden="true" className="drift-html absolute -right-2 top-14 text-[10px] text-accent [animation-delay:1.4s]">✦</span>
    <svg
      ref={svgRef}
      viewBox="0 0 180 122"
      className="group/avatar pointer-events-auto h-auto w-[132px] sm:w-[150px] lg:w-[176px]"
      aria-hidden="true"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <defs>
        <clipPath id="av-clip">
          <rect x="0" y="0" width="180" height="120" />
        </clipPath>
      </defs>

      {/* sparkles */}
      <g fill="var(--accent)">
        <path d="M152 28 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" />
        <path d="M28 44 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
        <path
          d="M162 66 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z"
        />
        <text x="20" y="84" className="font-mono" fontSize="11" fontWeight="600" fill="var(--muted)">
          {"{ }"}
        </text>
      </g>

      <g clipPath="url(#av-clip)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* ears */}
        <ellipse cx="56" cy="84" rx="5.5" ry="8" fill="var(--surface)" />
        <ellipse cx="124" cy="84" rx="5.5" ry="8" fill="var(--surface)" />
        {/* face */}
        <ellipse cx="90" cy="82" rx="34" ry="38" fill="var(--surface)" />
        {/* wavy hair */}
        <path
          fill="var(--ink)"
          d="M54 88 C44 66 50 44 64 37 C68 26 84 21 92 28 C101 20 117 24 121 36 C134 41 138 63 128 86 C127 76 123 68 117 63 C111 68 103 66 99 59 C93 66 83 68 77 61 C71 67 63 70 59 78 Z"
        />
        {/* eyebrows */}
        <path d={browL} fill="none" style={{ transition: "d 200ms" }} />
        <path d={browR} fill="none" style={{ transition: "d 200ms" }} />
        {/* glasses */}
        <rect x="61" y="71" width="25" height="19" rx="5.5" fill="var(--bg)" />
        <rect x="94" y="71" width="25" height="19" rx="5.5" fill="var(--bg)" />
        <path d="M86 79 Q90 76 94 79" fill="none" />
        <path d="M61 78 L56 76 M119 78 L124 76" fill="none" />
        {/* pupils (follow pointer) + blink */}
        <g ref={pupilsRef} transform="translate(0 2.5)">
          <g ref={lidsRef} stroke="none" fill="var(--ink)">
            <circle cx="73.5" cy="79" r="3.3" />
            <circle cx="106.5" cy="79" r="3.3" />
          </g>
        </g>
        {/* nose */}
        <path d="M90 88 Q86.5 95 91 96" fill="none" strokeWidth="2" />
        {/* cheeks */}
        <g stroke="none" fill="var(--accent)" opacity={mood === "happy" || mood === "delighted" ? 0.35 : 0} style={{ transition: "opacity 250ms" }}>
          <circle cx="67" cy="99" r="4.5" />
          <circle cx="113" cy="99" r="4.5" />
        </g>
        {/* mouth */}
        {mood === "delighted" ? (
          <path d="M77 100 Q90 120 103 100 Z" fill="var(--ink)" />
        ) : mood === "happy" ? (
          <path d="M79 101 Q90 114 101 101 Z" fill="var(--ink)" />
        ) : mood === "concerned" ? (
          <path d="M83 108 Q90 103 97 108" fill="none" />
        ) : (
          <path d="M82 103 Q90 109 98 103" fill="none" />
        )}
        {/* collar peeking */}
        <path d="M70 120 L80 112 L90 118 L100 112 L110 120" fill="var(--surface)" />
      </g>

      {/* hands gripping the panel edge */}
      <g stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" fill="var(--surface)">
        <g className={typing ? "tap" : undefined}>
          <rect x="34" y="108" width="28" height="14" rx="6" />
          <path d="M42 110 v8 M48 110 v8 M54 110 v8" strokeWidth="1.8" />
        </g>
        <g className={typing ? "tap tap-delay" : undefined}>
          <rect x="118" y="108" width="28" height="14" rx="6" />
          <path d="M126 110 v8 M132 110 v8 M138 110 v8" strokeWidth="1.8" />
        </g>
      </g>
    </svg>
    </div>
  );
}
