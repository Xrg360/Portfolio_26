// Loaded lazily (dynamic import) so three.js never counts toward first-load JS.
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import type { GraphNode } from "@/content/traces";
import { flowEdges, mainNodes, satellites } from "@/lib/graph-layout";

type Palette = { ink: Color; muted: Color; accent: Color; ok: Color; warn: Color; line: Color };

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const c = (v: string) => new Color(s.getPropertyValue(v).trim() || "#888");
  return { ink: c("--ink"), muted: c("--muted"), accent: c("--accent"), ok: c("--ok"), warn: c("--warn"), line: c("--muted") };
}

export function startGraph(host: HTMLElement): () => void {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 17);

  const group = new Group();
  scene.add(group);
  let palette = readPalette();

  // Main nodes: wireframe icosahedrons
  const nodeGeo = new IcosahedronGeometry(0.42, 0);
  const nodes = new Map<GraphNode, { mesh: Mesh; mat: MeshBasicMaterial; glow: number; hold: boolean; color: Color }>();
  (Object.keys(mainNodes) as GraphNode[]).forEach((k) => {
    const mat = new MeshBasicMaterial({ color: palette.muted.clone(), wireframe: true, transparent: true, opacity: 0.7 });
    const mesh = new Mesh(nodeGeo, mat);
    mesh.position.set(...mainNodes[k]);
    group.add(mesh);
    nodes.set(k, { mesh, mat, glow: 0, hold: false, color: palette.accent.clone() });
  });

  // Satellites + edges
  const sats = satellites();
  const satGeo = new BufferGeometry();
  satGeo.setAttribute("position", new Float32BufferAttribute(sats.flatMap((s) => s.pos), 3));
  const satMat = new PointsMaterial({ color: palette.muted.clone(), size: 0.09, transparent: true, opacity: 0.55 });
  group.add(new Points(satGeo, satMat));

  const edgePos: number[] = [];
  flowEdges.forEach(([a, b]) => edgePos.push(...mainNodes[a], ...mainNodes[b]));
  const flowGeo = new BufferGeometry();
  flowGeo.setAttribute("position", new Float32BufferAttribute(edgePos, 3));
  const flowMat = new LineBasicMaterial({ color: palette.muted.clone(), transparent: true, opacity: 0.38 });
  group.add(new LineSegments(flowGeo, flowMat));

  const satEdge: number[] = [];
  sats.forEach((s) => satEdge.push(...s.pos, ...mainNodes[s.parent]));
  const satEdgeGeo = new BufferGeometry();
  satEdgeGeo.setAttribute("position", new Float32BufferAttribute(satEdge, 3));
  const satEdgeMat = new LineBasicMaterial({ color: palette.muted.clone(), transparent: true, opacity: 0.12 });
  group.add(new LineSegments(satEdgeGeo, satEdgeMat));

  // Travelling pulse between nodes
  const pulseGeo = new SphereGeometry(0.13, 10, 10);
  const pulseMat = new MeshBasicMaterial({ color: palette.accent.clone(), transparent: true, opacity: 0 });
  const pulse = new Mesh(pulseGeo, pulseMat);
  group.add(pulse);
  const from = new Vector3();
  const to = new Vector3();
  let pulseT = 1;
  let prevNode: GraphNode | null = null;

  const colorFor = (status: string) =>
    status === "ok" ? palette.ok : status === "warn" || status === "wait" ? palette.warn : palette.accent;

  const onStep = (e: Event) => {
    const d = (e as CustomEvent).detail as { type: string; node?: GraphNode; status?: string };
    if (d.type === "reset") {
      nodes.forEach((n) => {
        n.hold = false;
        n.glow = 0;
      });
      prevNode = null;
      return;
    }
    if (!d.node) return;
    const n = nodes.get(d.node);
    if (!n) return;
    n.color.copy(colorFor(d.status ?? "info"));
    n.glow = 1;
    n.hold = d.status === "wait";
    if (prevNode && prevNode !== d.node) {
      from.copy(nodes.get(prevNode)!.mesh.position);
      to.copy(n.mesh.position);
      pulseMat.color.copy(n.color);
      pulseT = 0;
    }
    prevNode = d.node;
  };
  window.addEventListener("trace:step", onStep);

  // Pointer tilt
  let tx = 0;
  let ty = 0;
  const onPointer = (e: PointerEvent) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    ty = (e.clientY / window.innerHeight - 0.5) * 0.3;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // Theme changes
  const mo = new MutationObserver(() => {
    palette = readPalette();
    satMat.color.copy(palette.muted);
    flowMat.color.copy(palette.muted);
    satEdgeMat.color.copy(palette.muted);
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Size
  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // Only render while visible; cap at ~30fps to stay light.
  let visible = true;
  const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
  io.observe(host);

  let raf = 0;
  let last = 0;
  const tmp = new Color();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden || now - last < 33) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    group.rotation.y += (tx - group.rotation.y) * 0.04 + 0.0006;
    group.rotation.x += (ty - group.rotation.x) * 0.04;
    group.rotation.y = Math.max(-0.6, Math.min(0.6, group.rotation.y));

    nodes.forEach((n) => {
      if (n.hold) n.glow = 0.55 + 0.45 * Math.sin(now / 260);
      else n.glow *= Math.pow(0.25, dt); // decay
      const g = Math.max(0, n.glow);
      n.mesh.scale.setScalar(1 + g * 0.7);
      n.mesh.rotation.x += dt * (0.2 + g);
      n.mesh.rotation.y += dt * (0.25 + g);
      tmp.copy(palette.muted).lerp(n.color, Math.min(1, g * 1.4));
      n.mat.color.copy(tmp);
      n.mat.opacity = 0.55 + g * 0.45;
    });

    if (pulseT < 1) {
      pulseT = Math.min(1, pulseT + dt * 2.2);
      pulse.position.lerpVectors(from, to, pulseT);
      pulseMat.opacity = Math.sin(pulseT * Math.PI);
    } else pulseMat.opacity = 0;

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("trace:step", onStep);
    window.removeEventListener("pointermove", onPointer);
    mo.disconnect();
    ro.disconnect();
    io.disconnect();
    [nodeGeo, satGeo, flowGeo, satEdgeGeo, pulseGeo].forEach((g) => g.dispose());
    [satMat, flowMat, satEdgeMat, pulseMat, ...Array.from(nodes.values()).map((n) => n.mat)].forEach((m) => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
