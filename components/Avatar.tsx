"use client";

import { useEffect, useRef, useState } from "react";
import { ART } from "./avatar-art";

export type Mood = "focused" | "happy" | "concerned" | "delighted";

/**
 * Hand-drawn SVG self-portrait (curly hair, glasses, beard) peeking over the trace panel.
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
      lidsRef.current?.setAttribute("transform", `translate(0 ${ART.eyeLine}) scale(1 0.1) translate(0 -${ART.eyeLine})`);
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

  const [browL, browR] = mood === "concerned" ? ART.brows.raised : ART.brows.calm;

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
        {/* ears + face */}
        {ART.ears.map((e) => (
          <ellipse key={e.cx} cx={e.cx} cy={e.cy} rx="5.5" ry="8" fill={ART.skin} />
        ))}
        <ellipse {...ART.face} fill={ART.skin} />
        {/* tall curly hair, swept up */}
        <path d={ART.hair} fill={ART.hairInk} />
        <path d={ART.hairCurls} fill="none" stroke={ART.hairTexture} strokeWidth="1.6" />
        {/* full beard */}
        <path d={ART.beard} fill={ART.hairInk} />
        {/* thick eyebrows */}
        <path d={browL} fill="none" stroke={ART.hairInk} strokeWidth="4" style={{ transition: "d 200ms" }} />
        <path d={browR} fill="none" stroke={ART.hairInk} strokeWidth="4" style={{ transition: "d 200ms" }} />
        {/* big squarish glasses */}
        {ART.lenses.map((l) => (
          <rect key={l.x} x={l.x} y={l.y} width={l.w} height={l.h} rx="4" fill={ART.lens} />
        ))}
        <path d={ART.bridge} fill="none" />
        {/* pupils (follow pointer) + blink */}
        <g ref={pupilsRef} transform="translate(0 2.5)">
          <g ref={lidsRef} stroke="none" fill={ART.hairInk}>
            {ART.pupils.map((p) => (
              <circle key={p.cx} cx={p.cx} cy={p.cy} r="3.3" />
            ))}
          </g>
        </g>
        {/* nose */}
        <path d={ART.nose} fill="none" stroke={ART.skinShade} strokeWidth="2" />
        {/* cheeks */}
        <g stroke="none" fill="#e07a5f" opacity={mood === "happy" || mood === "delighted" ? 0.4 : 0} style={{ transition: "opacity 250ms" }}>
          {ART.cheeks.map((c) => (
            <circle key={c.cx} cx={c.cx} cy={c.cy} r="4.5" />
          ))}
        </g>
        {/* mouth (inside the beard), then moustache on top */}
        {mood === "delighted" || mood === "happy" ? (
          <g>
            <path d={ART.mouths[mood].open} fill={ART.mouth} stroke="none" />
            <path d={ART.mouths[mood].teeth} fill="#ffffff" stroke="none" />
          </g>
        ) : (
          <path d={ART.mouths[mood]} fill="none" stroke={ART.lip} strokeWidth="2.5" />
        )}
        <path d={ART.moustache} fill={ART.hairInk} strokeWidth="2" />
        {/* shirt collar */}
        <path d={ART.collar} fill="var(--surface)" />
      </g>

      {/* hands gripping the panel edge */}
      <g stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" fill={ART.skin}>
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
