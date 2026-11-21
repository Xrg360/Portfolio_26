/**
 * Monkeytype API (https://api.monkeytype.com/docs), authenticated with an ApeKey.
 * Limits: results/last and users/personalBests allow 60 calls/hour each, and
 * every endpoint shares 30 calls/minute. Caching below stays well inside both.
 */
const API = process.env.MONKEYTYPE_API_BASE || "https://api.monkeytype.com";
export const LAST_TTL = 90; // seconds: about 40 calls/hour at most
const PB_TTL = 3600; // personal bests change rarely

export type TypingStats =
  | { ok: false; reason: "not-configured" | "unavailable" }
  | {
      ok: true;
      last: { wpm: number; acc: number; label: string; language: string; timestamp: number; isPb: boolean };
      pb: { wpm: number; acc: number } | null;
    };

type RawResult = {
  wpm: number;
  acc: number;
  mode: string;
  mode2: string;
  language?: string;
  timestamp: number;
  isPb?: boolean;
};
type RawPb = { wpm: number; acc: number; language?: string };

async function ape<T>(path: string, ttl: number, key: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `ApeKey ${key}`, Accept: "application/json" },
    next: { revalidate: ttl },
  });
  if (!res.ok) throw new Error(`monkeytype ${path} -> ${res.status}`);
  return ((await res.json()) as { data: T }).data;
}

function modeLabel(mode: string, mode2: string) {
  if (mode === "time") return `${mode2}s`;
  if (mode === "words") return `${mode2} words`;
  return mode; // quote, zen, custom
}

// The docs don't pin the shape of personalBests' `data` (array, object or a map
// keyed by mode2), so accept all three and keep the best wpm.
function bestOf(data: unknown, mode2: string): RawPb | null {
  let list: unknown[] = [];
  if (Array.isArray(data)) list = data;
  else if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.wpm === "number") list = [d];
    else if (Array.isArray(d[mode2])) list = d[mode2] as unknown[];
  }
  const pbs = list.filter((x): x is RawPb => !!x && typeof (x as RawPb).wpm === "number");
  return pbs.sort((a, b) => b.wpm - a.wpm)[0] ?? null;
}

export async function getTypingStats(): Promise<TypingStats> {
  const key = process.env.MONKEYTYPE_APE_KEY;
  if (!key) return { ok: false, reason: "not-configured" };

  const last = await ape<RawResult>("/results/last", LAST_TTL, key);
  let pb: RawPb | null = null;
  try {
    const q = new URLSearchParams({ mode: last.mode, mode2: last.mode2 });
    pb = bestOf(await ape<unknown>(`/users/personalBests?${q}`, PB_TTL, key), last.mode2);
  } catch {
    // PB is a nice-to-have; show the last result without it.
  }

  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    ok: true,
    last: {
      wpm: Math.round(last.wpm),
      acc: round(last.acc),
      label: modeLabel(last.mode, last.mode2),
      language: (last.language ?? "english").replace(/_/g, " "),
      timestamp: last.timestamp,
      isPb: !!last.isPb,
    },
    pb: pb ? { wpm: Math.round(Math.max(pb.wpm, last.isPb ? last.wpm : 0)), acc: round(pb.acc) } : null,
  };
}
