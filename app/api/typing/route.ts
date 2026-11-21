import { getTypingStats } from "@/lib/monkeytype";

// Regenerated at most every 90 s (ISR). Visitors read the cached copy, so
// traffic never reaches Monkeytype's rate limits.
export const revalidate = 90;

export async function GET() {
  try {
    return Response.json(await getTypingStats());
  } catch (err) {
    // At build time, ship a harmless placeholder. At runtime, throwing makes
    // Next keep serving the last good copy instead of caching an error.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return Response.json({ ok: false, reason: "unavailable" });
    }
    throw err;
  }
}
