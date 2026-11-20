import type { GraphNode } from "@/content/traces";

// Shared layout for the hero backdrop: used by the static SVG fallback and the 3D scene.
// Coordinates are in a [-10, 10] x [-5, 5] x [-3, 3] box.

export const mainNodes: Record<GraphNode, [number, number, number]> = {
  request: [-8.2, 2.6, -1],
  planner: [-3.6, 0.4, 1.2],
  context: [-6.0, -3.2, 0.2],
  policy: [1.0, 3.0, -0.6],
  human: [4.6, 0.9, 1.4],
  tools: [8.0, -2.4, -0.4],
  audit: [2.4, -3.6, 0.8],
};

export const flowEdges: [GraphNode, GraphNode][] = [
  ["request", "planner"],
  ["planner", "context"],
  ["context", "request"],
  ["planner", "policy"],
  ["policy", "human"],
  ["human", "tools"],
  ["tools", "audit"],
  ["planner", "tools"],
  ["audit", "policy"],
];

/** Deterministic pseudo-random satellites so server and client agree. */
export function satellites(count = 38): { pos: [number, number, number]; parent: GraphNode }[] {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const keys = Object.keys(mainNodes) as GraphNode[];
  return Array.from({ length: count }, (_, i) => {
    const parent = keys[i % keys.length];
    const [px, py, pz] = mainNodes[parent];
    const a = rnd() * Math.PI * 2;
    const r = 1.2 + rnd() * 2.2;
    return {
      parent,
      pos: [px + Math.cos(a) * r, py + Math.sin(a) * r * 0.7, pz + (rnd() - 0.5) * 3] as [number, number, number],
    };
  });
}
