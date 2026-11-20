import { proofChips } from "@/content/site";

export function ProofStrip() {
  return (
    <div className="border-y-2 border-ink bg-surface">
      <ul aria-label="Highlights" className="mx-auto flex max-w-[1120px] flex-wrap gap-2.5 px-4 py-5 sm:px-6">
        {proofChips.map((c) => (
          <li key={c} className="chip">{c}</li>
        ))}
      </ul>
    </div>
  );
}
