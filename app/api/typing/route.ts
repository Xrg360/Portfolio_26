import { getTypingStats, MonkeytypeError } from "@/lib/monkeytype";

// Regenerated at most every 90 s (ISR). Visitors read the cached copy, so
// traffic never reaches Monkeytype's rate limits.
export const revalidate = 90;

export async function GET() {
  try {
    return Response.json(await getTypingStats());
  } catch (err) {
    const mt = err instanceof MonkeytypeError ? err : null;
    const detail = mt ? `${mt.status} ${mt.upstream}` : "network error";
    // Bad/inactive key, or build time: report why (never the key itself).
    if (mt?.config || process.env.NEXT_PHASE === "phase-production-build") {
      console.error("[typing]", detail);
      return Response.json({ ok: false, reason: "unavailable", detail });
    }
    // Transient (rate limit, 5xx, network): throw so Next keeps the last good copy.
    throw err;
  }
}
