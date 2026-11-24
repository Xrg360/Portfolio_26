// Ink-blot theme switch.
//
// The new theme is revealed through a marbled ink mask that pours out of the
// toggle. A WebGL noise shader renders every mask frame once into a sprite
// sheet (a PNG blob). The View Transitions API then masks the live new-theme
// snapshot with that sheet, stepping through frames in pure CSS, so a switch
// costs no per-frame JS or shader work.

type Theme = "light" | "dark";

const COLS = 6;
const ROWS = 6;
const FRAMES = COLS * ROWS;
const DURATION = 1350; // ms
const MAX_FRAME_DIM = 480; // mask px on the longest side; upscaled softly

type Sprite = { key: string; url: string; ready: Promise<boolean> };
const sprites = new Map<number, Sprite>();

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uCell;   // frame size, mask px
uniform vec2 uView;   // viewport, CSS px
uniform vec2 uOrigin; // CSS px
uniform float uH;     // sprite height, mask px
uniform float uSeed;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;mat2 r=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){v+=a*noise(p);p=r*p;a*=.5;}
  return v;
}

void main(){
  vec2 px=vec2(gl_FragCoord.x,uH-gl_FragCoord.y);
  vec2 cell=floor(px/uCell);
  float frame=cell.y*${COLS}.+cell.x;
  float t=frame/${FRAMES - 1}.;
  if(t>=1.){gl_FragColor=vec4(0.,0.,0.,1.);return;}

  vec2 css=(px-cell*uCell)/uCell*uView;
  vec2 o=uOrigin;
  float L=max(max(length(o),length(o-vec2(uView.x,0.))),max(length(o-vec2(0.,uView.y)),length(o-uView)));
  vec2 p=css/L;
  float d=length(css-o)/L;

  // Domain-warped noise: big marbled lobes plus fine ragged tendrils, drifting as it spreads.
  vec2 q=p*2.2+uSeed;
  float dr=t*.35;
  vec2 w=vec2(fbm(q+vec2(0.,dr)),fbm(q+vec2(5.2,1.3)-dr));
  float n=fbm(q*1.3+3.5*w);
  float m=fbm(p*14.+2.*w+uSeed*1.7);
  float amp=mix(.35,1.,smoothstep(0.,.3,d)); // a tidier blob right at the toggle
  float field=d+(.9*(n-.5)+.35*(m-.5))*amp;

  // Ridged noise = thin marbled filaments: ink streaks reaching ahead of the
  // front, and pale streaks left inside the ink just behind it.
  float r1=pow(1.-abs(2.*fbm(p*5.+3.*w+uSeed)-1.),7.);
  float r2=pow(1.-abs(2.*fbm(p*7.-2.5*w+uSeed*2.3)-1.),9.);

  float e=mix(t,t*t*(3.-2.*t),.65);
  float front=mix(.02,1.6,e);
  float band=front-field;
  band+=(.12*r1-.1*r2)*amp*smoothstep(.25,0.,abs(band));
  float soft=(uView.x/uCell.x)/L*.8;
  float a=smoothstep(-soft,soft,band);
  gl_FragColor=vec4(0.,0.,0.,a);
}`;

function renderSprite(view: [number, number], origin: [number, number], seed: number): Promise<Blob | null> {
  const s = Math.min(1, MAX_FRAME_DIM / Math.max(view[0], view[1]));
  const fw = Math.max(16, Math.round(view[0] * s));
  const fh = Math.max(16, Math.round(view[1] * s));
  const canvas = document.createElement("canvas");
  canvas.width = fw * COLS;
  canvas.height = fh * ROWS;
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
  if (!gl) return Promise.resolve(null);
  const dims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;
  if (canvas.width > dims[0] || canvas.height > dims[1]) return Promise.resolve(null);

  const sh = (type: number, src: string) => {
    const x = gl.createShader(type)!;
    gl.shaderSource(x, src);
    gl.compileShader(x);
    return x;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return Promise.resolve(null);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(gl.getUniformLocation(prog, "uCell"), fw, fh);
  gl.uniform2f(gl.getUniformLocation(prog, "uView"), view[0], view[1]);
  gl.uniform2f(gl.getUniformLocation(prog, "uOrigin"), origin[0], origin[1]);
  gl.uniform1f(gl.getUniformLocation(prog, "uH"), canvas.height);
  gl.uniform1f(gl.getUniformLocation(prog, "uSeed"), seed);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  return new Promise((res) =>
    canvas.toBlob((b) => {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      res(b);
    }, "image/png"),
  );
}

function originOf(el: Element): [number, number] {
  const r = el.getBoundingClientRect();
  return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)];
}

/** Build (or reuse) the mask sprite for switching *to* `theme`. Each direction gets its own ink pattern. */
export function prepareInk(theme: Theme, from: Element): Sprite {
  const view: [number, number] = [window.innerWidth, window.innerHeight];
  const origin = originOf(from);
  const seed = theme === "dark" ? 3.7 : 11.2;
  const key = `${view.join("x")}@${origin.join(",")}`;
  const cached = sprites.get(seed);
  if (cached?.key === key) return cached;
  if (cached) URL.revokeObjectURL(cached.url);

  const sprite: Sprite = { key, url: "", ready: Promise.resolve(false) };
  sprite.ready = renderSprite(view, origin, seed).then(async (blob) => {
    if (!blob) return false;
    sprite.url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = sprite.url;
    try {
      await img.decode(); // decode up front so the first frame doesn't hitch
    } catch {}
    return true;
  });
  sprites.set(seed, sprite);
  return sprite;
}

function styleFor(url: string, origin: [number, number]) {
  const steps: string[] = [];
  for (let i = 0; i < FRAMES; i++) {
    const x = ((i % COLS) / (COLS - 1)) * 100;
    const y = (Math.floor(i / COLS) / (ROWS - 1)) * 100;
    const pos = `${x}% ${y}%`;
    steps.push(`${((i / FRAMES) * 100).toFixed(3)}%{-webkit-mask-position:${pos};mask-position:${pos}}`);
  }
  steps.push(`100%{-webkit-mask-position:100% 100%;mask-position:100% 100%}`);
  const size = `${COLS * 100}% ${ROWS * 100}%`;
  return `
html.ink-vt::view-transition-old(root){animation:none;mix-blend-mode:normal}
html.ink-vt::view-transition-new(root){
  animation:ink-vt ${DURATION}ms step-end both;mix-blend-mode:normal;
  -webkit-mask-image:url(${url});mask-image:url(${url});
  -webkit-mask-size:${size};mask-size:${size};
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
@keyframes ink-vt{${steps.join("")}}
html.ink-vt-fallback::view-transition-old(root){animation:none;mix-blend-mode:normal}
html.ink-vt-fallback::view-transition-new(root){animation:ink-vt-circle 700ms cubic-bezier(.7,0,.2,1) both;mix-blend-mode:normal}
@keyframes ink-vt-circle{from{clip-path:circle(0 at ${origin[0]}px ${origin[1]}px)}to{clip-path:circle(150vmax at ${origin[0]}px ${origin[1]}px)}}
html.ink-vt *,html.ink-vt *::before,html.ink-vt *::after,
html.ink-vt-fallback *,html.ink-vt-fallback *::before,html.ink-vt-fallback *::after{transition:none!important}`;
}

let running: ViewTransition | null = null;

/** Switch theme with the ink reveal; falls back to a circle wipe, then to an instant swap. */
export async function switchTheme(apply: (t: Theme) => void, from: Element) {
  const root = document.documentElement;
  const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || typeof document.startViewTransition !== "function") {
    apply(next);
    return;
  }

  running?.skipTransition();
  const sprite = prepareInk(next, from);
  const ok = await sprite.ready;

  let style = document.getElementById("ink-vt-style") as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = "ink-vt-style";
    document.head.appendChild(style);
  }
  style.textContent = styleFor(sprite.url, originOf(from));
  root.classList.remove("ink-vt", "ink-vt-fallback");
  root.classList.add(ok ? "ink-vt" : "ink-vt-fallback");

  const vt = document.startViewTransition(() => apply(next));
  running = vt;
  vt.finished.finally(() => {
    if (running === vt) {
      root.classList.remove("ink-vt", "ink-vt-fallback");
      running = null;
    }
  });
}
