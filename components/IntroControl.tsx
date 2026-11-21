"use client";

import { useEffect } from "react";

/** Ends the intro (set by the boot script) on time, or early on any key, click, scroll or touch. */
export function IntroControl() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.intro) return;
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      delete root.dataset.intro;
      root.classList.remove("intro-skip");
      events.forEach((e) => window.removeEventListener(e, skip));
    };
    const skip = () => {
      root.classList.add("intro-skip");
      window.setTimeout(end, 260);
    };
    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
    const t = window.setTimeout(end, 2000); // matches the CSS exit (1.45 s + 0.42 s)
    return () => {
      window.clearTimeout(t);
      end();
    };
  }, []);
  return null;
}
