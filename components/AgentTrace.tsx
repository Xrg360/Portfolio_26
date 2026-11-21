"use client";

import { useEffect, useRef, useState } from "react";
import { scenarios, type StepStatus } from "@/content/traces";
import { Avatar, type Mood } from "./Avatar";

const TYPE_MS = 250; // typing time per line
const GAP_MS = 190; // pause between lines
const LINE_MS = TYPE_MS + GAP_MS;
const HOLD_DONE = 3000;
const HOLD_HALT = 6500;
const FADE_MS = 450;
const TICK_MS = 50;
const START_DELAY_MS = 1500;

function emit(detail: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent("trace:step", { detail }));
}

function StatusIcon({ status, visible }: { status?: StepStatus; visible: boolean }) {
  if (!status || status === "info") return null;
  if (!visible) return <span className="inline-block w-4" />;
  if (status === "ok") return <span className="pop font-bold text-ok" aria-label="passed">✓</span>;
  if (status === "warn") return <span className="pop font-bold text-warn" aria-label="warning">⚠</span>;
  if (status === "wait")
    return <span className="pulse-warn inline-block h-2.5 w-2.5 rounded-full bg-warn align-middle" aria-label="waiting" />;
  return (
    <span className="inline-flex gap-[3px] align-middle" aria-label="held">
      <span className="h-2.5 w-[3px] bg-muted" />
      <span className="h-2.5 w-[3px] bg-muted" />
    </span>
  );
}

export function AgentTrace() {
  const [sIdx, setSIdx] = useState(0);
  // `null` = static frame (server render, no JS, reduced motion): everything shown.
  const [t, setT] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(false);
  const lastEmitted = useRef(-1);

  const scenario = scenarios[sIdx];
  const n = scenario.steps.length;
  const hold = scenario.outcome === "halt" ? HOLD_HALT : HOLD_DONE;
  const total = n * LINE_MS + hold + FADE_MS;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    const apply = () => {
      setAnimate(!mq.matches);
      setT(mq.matches ? null : 0);
    };
    // Keep the static frame through page load, then start the loop.
    const begin = () => {
      timer = window.setTimeout(apply, START_DELAY_MS);
    };
    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });
    mq.addEventListener("change", apply);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", begin);
      mq.removeEventListener("change", apply);
    };
  }, []);

  // Ticker (pauses on hover/focus and when the tab is hidden).
  useEffect(() => {
    if (!animate || paused) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setT((prev) => {
        if (prev === null) return prev;
        const next = prev + TICK_MS;
        return next >= total ? 0 : next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [animate, paused, total]);

  const done = t === null ? n : Math.min(n, Math.floor(t / LINE_MS)); // fully typed lines
  const partial = t === null ? 0 : Math.min(1, (t % LINE_MS) / TYPE_MS); // progress of current line
  const finished = done >= n;
  const fading = t !== null && t > n * LINE_MS + hold;

  // Notify the 3D backdrop when a line completes.
  useEffect(() => {
    if (t === null) return;
    if (done === 0 && lastEmitted.current !== -1 && t < LINE_MS) {
      lastEmitted.current = -1;
      emit({ type: "reset", scenario: scenario.id });
    }
    if (done > 0 && done - 1 !== lastEmitted.current) {
      lastEmitted.current = done - 1;
      const step = scenario.steps[done - 1];
      emit({ type: "step", node: step.node, status: step.status ?? "info", scenario: scenario.id });
    }
  }, [done, t, scenario]);

  const select = (i: number) => {
    setSIdx(i);
    lastEmitted.current = -1;
    emit({ type: "reset", scenario: scenarios[i].id });
    setT(animate ? 0 : null);
  };

  // Avatar mood from the latest completed line.
  const last = done > 0 ? scenario.steps[done - 1] : undefined;
  let mood: Mood = "focused";
  if (last?.status === "warn" || last?.status === "wait" || last?.status === "held") mood = "concerned";
  else if (last?.status === "ok") mood = "happy";
  if (finished) mood = scenario.outcome === "halt" ? "concerned" : "delighted";
  if (scenario.id === "injection" && done >= 5 && !finished) mood = "happy";

  const runState = !finished ? "running" : scenario.outcome === "halt" ? "awaiting human" : "completed";

  return (
    <div className="relative pt-[92px] sm:pt-[104px] lg:pt-[122px]">
      <div className="absolute right-6 top-0 z-10 sm:right-10">
        <Avatar mood={mood} typing={!finished && t !== null} />
      </div>

      <div
        className="brut relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
        }}
      >
        {/* title bar */}
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink bg-ink px-4 py-2 font-mono text-[0.75rem] text-bg">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-bg" />
              <span className="h-2.5 w-2.5 rounded-sm bg-bg/60" />
              <span className="h-2.5 w-2.5 rounded-sm bg-bg/30" />
            </span>
            agent-trace
          </span>
          <span className="flex items-center gap-2">
            {paused && animate ? <span className="opacity-70">paused</span> : null}
            <span
              className={`rounded-sm px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider ${
                runState === "completed" ? "bg-ok text-bg" : runState === "awaiting human" ? "bg-warn text-bg" : "bg-bg text-ink"
              }`}
            >
              {runState}
            </span>
          </span>
        </div>

        {/* Screen-reader version of the run */}
        <ol className="sr-only" aria-label={`Illustrative agent run: ${scenario.name}`}>
          {scenario.steps.map((s) => (
            <li key={s.label + s.text}>
              {s.label}: {s.text}
              {s.status === "ok" ? " (passed)" : s.status === "warn" ? " (warning)" : s.status === "wait" ? " (waiting for a human)" : ""}
            </li>
          ))}
        </ol>

        {/* Animated lines (fixed height: hidden lines keep their space) */}
        <ol
          aria-hidden="true"
          data-cursor-mode="caret"
          className="px-4 py-4 font-mono text-[0.78rem] leading-[1.55] [contain:layout_paint] sm:px-5 sm:text-[0.8125rem] transition-opacity"
          style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
        >
          {scenario.steps.map((s, i) => {
            const visible = i < done || (i === done && t !== null && !finished);
            const typedChars = i < done ? s.text.length : i === done ? Math.floor(partial * s.text.length) : 0;
            const isCurrent = i === done && !finished && t !== null;
            const lineDone = i < done;
            const tone =
              s.status === "held"
                ? "text-muted italic"
                : s.status === "wait"
                  ? "text-warn font-semibold"
                  : s.label === "observe"
                    ? "text-warn"
                    : "";
            return (
              <li
                key={scenario.id + i}
                className="grid grid-cols-[5.6rem_1fr_1rem] items-start gap-2 py-[3px] transition-opacity duration-150 sm:grid-cols-[6.2rem_1fr_1.2rem]"
                style={{ opacity: visible ? 1 : 0 }}
              >
                <span className="text-muted">
                  <span className={lineDone || isCurrent ? "text-accent" : ""}>▸</span> {s.label}
                </span>
                <span className={`break-words ${tone}`}>
                  <span>{s.text.slice(0, typedChars)}</span>
                  {isCurrent ? <span className="caret !ml-0 !h-[0.95em] !w-[0.45em]" /> : null}
                  <span className="opacity-0">{s.text.slice(typedChars)}</span>
                </span>
                <span className="text-right">
                  <StatusIcon status={s.status} visible={lineDone} />
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* scenario toggles */}
      <div role="group" aria-label="Choose a scenario" className="mt-5 flex flex-wrap gap-2">
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={i === sIdx}
            onClick={() => select(i)}
            data-cursor="run"
            className={`rounded-md border-2 border-ink px-3 py-1.5 font-mono text-[0.78rem] font-medium transition-[transform,box-shadow,background-color] duration-150 ${
              i === sIdx
                ? "bg-ink text-bg shadow-none translate-x-[2px] translate-y-[2px]"
                : "bg-surface shadow-[3px_3px_0_0_var(--shadow)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--shadow)]"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
