"use client";

import { useEffect, useRef } from "react";

/**
 * Tactical crosshair cursor (a nod to Valorant): tracks the pointer 1:1, blooms
 * and turns red over links and buttons while [brackets] lock onto the target
 * with a mono label, flashes a hit marker on click, and becomes a caret over
 * the trace. Fine pointers only; disabled under reduced motion.
 */
export function Cursor() {
  const blockRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const block = blockRef.current;
    const frame = frameRef.current;
    const label = labelRef.current;
    if (!fine || reduce || !block || !frame || !label) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let bx = -100;
    let by = -100;
    let raf = 0;
    let running = false;
    let target: HTMLElement | null = null;
    let mode: "idle" | "target" | "caret" | "hidden" = "hidden";

    const setMode = (m: typeof mode) => {
      if (m === mode) return;
      mode = m;
      block.dataset.mode = m;
      frame.dataset.active = m === "target" ? "true" : "false";
    };

    const placeFrame = () => {
      if (!target) return;
      const r = target.getBoundingClientRect();
      const pad = 6;
      frame.style.transform = `translate(${r.left - pad}px, ${r.top - pad}px)`;
      frame.style.width = `${r.width + pad * 2}px`;
      frame.style.height = `${r.height + pad * 2}px`;
    };

    const loop = () => {
      bx = x;
      by = y;
      block.style.transform = `translate(${bx}px, ${by}px)`;
      if (Math.abs(x - bx) > 0.1 || Math.abs(y - by) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const labelFor = (el: HTMLElement) => {
      if (el.dataset.cursor) return el.dataset.cursor;
      if (el instanceof HTMLAnchorElement) {
        return el.target === "_blank" || /^https?:/.test(el.getAttribute("href") ?? "") ? "open ↗" : "go →";
      }
      return "click";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (mode === "hidden") {
        bx = x;
        by = y;
        setMode(target ? "target" : "idle");
      }
      kick();
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el?.closest) return;
      const interactive = el.closest<HTMLElement>("a, button, summary, [data-cursor]");
      if (interactive) {
        target = interactive;
        label.textContent = labelFor(interactive);
        placeFrame();
        setMode("target");
        return;
      }
      target = null;
      setMode(el.closest("[data-cursor-mode='caret']") ? "caret" : "idle");
    };

    const onLeave = () => setMode("hidden");
    let hitTimer = 0;
    const onDown = () => {
      block.classList.add("is-down");
      block.classList.remove("is-hit");
      void block.offsetWidth; // restart the hit-marker animation
      block.classList.add("is-hit");
      window.clearTimeout(hitTimer);
      hitTimer = window.setTimeout(() => block.classList.remove("is-hit"), 280);
    };
    const onUp = () => block.classList.remove("is-down");
    const onScroll = () => {
      if (target) {
        if (!document.contains(target)) {
          target = null;
          setMode("idle");
        } else placeFrame();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hitTimer);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden [html.has-cursor_&]:block">
      <div
        ref={frameRef}
        data-active="false"
        className="cursor-frame fixed left-0 top-0 opacity-0 transition-[transform,width,height,opacity] duration-150 ease-out data-[active=true]:opacity-100"
      >
        <span className="absolute left-0 top-0 h-3 w-3 border-l-[2.5px] border-t-[2.5px] border-accent" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r-[2.5px] border-t-[2.5px] border-accent" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b-[2.5px] border-l-[2.5px] border-accent" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b-[2.5px] border-r-[2.5px] border-accent" />
        <span
          ref={labelRef}
          className="absolute -bottom-7 right-0 whitespace-nowrap rounded-sm bg-ink px-1.5 py-0.5 font-mono text-[0.7rem] font-medium text-bg"
        />
      </div>
      <div ref={blockRef} data-mode="hidden" className="cursor-block fixed left-0 top-0">
        <div className="xh">
          <i />
          <i />
          <i />
          <i />
          <b />
        </div>
        <div className="xh-hit">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="xh-caret" />
      </div>
    </div>
  );
}
