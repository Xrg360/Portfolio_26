import { ART } from "./avatar-art";

/** Static, grinning version of the site's cartoon self-portrait, for the intro card. */
export function IntroFace({ className = "" }: { className?: string }) {
  const m = ART.mouths.delighted;
  return (
    <svg viewBox="44 10 92 112" className={className} aria-hidden="true">
      <defs>
        <clipPath id="intro-face-clip">
          <rect x="0" y="0" width="180" height="121" />
        </clipPath>
      </defs>
      <g clipPath="url(#intro-face-clip)" stroke="#0b0d10" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {ART.ears.map((e) => (
          <ellipse key={e.cx} cx={e.cx} cy={e.cy} rx="5.5" ry="8" fill={ART.skin} />
        ))}
        <ellipse {...ART.face} fill={ART.skin} />
        <path d={ART.hair} fill={ART.hairInk} />
        <path d={ART.hairCurls} fill="none" stroke={ART.hairTexture} strokeWidth="1.6" />
        <path d={ART.beard} fill={ART.hairInk} />
        <path d={ART.brows.calm.join(" ")} fill="none" stroke={ART.hairInk} strokeWidth="4" />
        {ART.lenses.map((l) => (
          <rect key={l.x} x={l.x} y={l.y} width={l.w} height={l.h} rx="4" fill={ART.lens} />
        ))}
        <path d={ART.bridge} fill="none" />
        {ART.pupils.map((p) => (
          <circle key={p.cx} cx={p.cx} cy={p.cy + 1.5} r="3.3" fill={ART.hairInk} stroke="none" />
        ))}
        <path d={ART.nose} fill="none" stroke={ART.skinShade} strokeWidth="2" />
        {ART.cheeks.map((c) => (
          <circle key={c.cx} cx={c.cx} cy={c.cy} r="4.5" fill="#e07a5f" opacity="0.4" stroke="none" />
        ))}
        <path d={m.open} fill={ART.mouth} stroke="none" />
        <path d={m.teeth} fill="#ffffff" stroke="none" />
        <path d={ART.moustache} fill={ART.hairInk} strokeWidth="2" />
        <path d={ART.collar} fill="#ffffff" />
      </g>
    </svg>
  );
}
