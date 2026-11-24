"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef } from "react";
import { prepareInk, switchTheme } from "@/lib/ink-transition";

type Theme = "light" | "dark";

function apply(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

function nextTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "light" : "dark";
}

export function ThemeToggle() {
  const ref = useRef<HTMLButtonElement>(null);

  // Render the ink mask while the page is idle, so the first click starts instantly.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => ref.current && prepareInk(nextTheme(), ref.current));
    return () => cancel(id);
  }, []);

  // Re-check on hover/focus in case the viewport changed since.
  const warm = () => {
    if (ref.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) prepareInk(nextTheme(), ref.current);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => switchTheme(apply, e.currentTarget)}
      onPointerEnter={warm}
      onFocus={warm}
      className="btn btn-icon"
      aria-label="Toggle dark mode"
      data-cursor="theme"
    >
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
      <Moon size={18} className="block dark:hidden" aria-hidden="true" />
    </button>
  );
}
