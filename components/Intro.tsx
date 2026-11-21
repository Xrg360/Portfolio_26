import { IntroFace } from "./IntroFace";
import { IntroControl } from "./IntroControl";

/**
 * Game-style entrance, ~1.8 s, home page only, once per session. The boot script in
 * app/layout.tsx picks a scene (never the same as last visit) by setting
 * <html data-intro="…">; without that attribute none of this renders. CSS only, so it
 * exits on its own even if JS is slow; IntroControl adds skip-on-input.
 */
const pick = (scene: string, conf: string) => (
  <p className="intro-ai">
    <span className="text-[#ff4655]">agent ›</span> pick_entrance() → <b>{scene}</b> · confidence {conf} · guardrail: skippable ✓
  </p>
);

export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-slash" />
      <div className="intro-panel">
        {/* 1 · DASH: speed lines, afterimages, skid stop */}
        <div className="intro-scene scene-dash">
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} className="dash-line" style={{ top: `${12 + i * 9.5}%`, animationDelay: `${(i % 4) * 60}ms` }} />
          ))}
          <div className="intro-stage">
            <div className="dash-ghost dash-ghost-2"><IntroFace className="intro-face" /></div>
            <div className="dash-ghost dash-ghost-1"><IntroFace className="intro-face" /></div>
            <div className="dash-hero"><IntroFace className="intro-face" /></div>
            <div className="dash-puff" />
          </div>
          <p className="intro-tag">WHOOSH. <span>Rohit has entered the site.</span></p>
          {pick("dash", "0.93")}
        </div>

        {/* 2 · FLASH: an orb arcs in and pops (one soft flash) */}
        <div className="intro-scene scene-flash">
          <div className="intro-stage">
            <div className="flash-face"><IntroFace className="intro-face" /></div>
          </div>
          <i className="flash-orb" />
          <i className="flash-burst" />
          <p className="intro-tag">FLASH OUT. <span>Eyes up: portfolio incoming.</span></p>
          {pick("flash", "0.88")}
        </div>

        {/* 3 · RECON: surveillance cam tracking the agent graph */}
        <div className="intro-scene scene-recon">
          <div className="recon-frame">
            <span className="recon-c tl" /><span className="recon-c tr" /><span className="recon-c bl" /><span className="recon-c br" />
            <p className="recon-hud left"><i className="recon-rec" /> REC · CAM_02</p>
            <p className="recon-hud right">tracking agents</p>
            {[
              ["planner", 22, 30],
              ["policy", 68, 24],
              ["tools", 30, 68],
              ["audit", 74, 66],
            ].map(([n, x, y], i) => (
              <div key={n} className="recon-node" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${180 + i * 170}ms` }}>
                <span className="recon-box" />
                <span className="recon-label">{n} · online</span>
              </div>
            ))}
            <div className="recon-op">
              <IntroFace className="intro-face" />
              <span className="recon-label !opacity-100">human in the loop</span>
            </div>
            <i className="recon-scan" />
          </div>
          {pick("recon", "0.91")}
        </div>

        {/* 4 · LOCK IN: agent select */}
        <div className="intro-scene scene-lockin">
          <div className="lock-row">
            {["{ }", "λ", "⌘", "▲"].map((g, i) => (
              <span key={g} className="lock-tile" style={{ animationDelay: `${i * 90}ms` }}>{g}</span>
            ))}
          </div>
          <div className="lock-card">
            <IntroFace className="intro-face" />
          </div>
          <p className="lock-name">ROHIT <span>· AI ENGINEER</span></p>
          <p className="lock-btn">LOCK IN</p>
          {pick("lock-in", "0.95")}
        </div>
      </div>
      <p className="intro-skip-hint">
        <span className="[@media(hover:none)]:hidden">press any key to skip</span>
        <span className="hidden [@media(hover:none)]:inline">tap to skip</span>
      </p>
      <IntroControl />
    </div>
  );
}
