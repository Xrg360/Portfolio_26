// Phase 2 hook: "Ask about my work" chat.
// Requirements (see spec §8): grounded only in site content with citations, strict scope,
// injection-resistant, rate-limited (e.g. 10 req/IP/hour), token budget, no storage,
// visible "how this is built" link. Enabled only when NEXT_PUBLIC_ENABLE_ASK_CHAT=true.
import { site } from "@/content/site";

export function AskChat() {
  if (!site.features.askChat) return null;
  return null; // TODO (phase 2): implement the widget.
}
