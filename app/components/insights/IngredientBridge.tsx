import type { IngredientBridge as IngredientBridgeData } from "@/app/lib/appInsightsTypes";

/** Peer-reviewed ingredient studies behind a report, inside its full-data
 *  layer. Findings as published; each links to PubMed. */
export default function IngredientBridge({
  bridge,
}: {
  bridge: IngredientBridgeData;
}) {
  return (
    <div className="rounded-md bg-white p-5 text-black ring-1 ring-black/5 lg:p-6">
      <h4 className="mb-2 text-base font-bold text-[var(--brand-navy)]">
        The ingredient research
      </h4>
      <p className="max-w-[68ch] text-sm leading-relaxed text-black/75">
        {bridge.intro}
      </p>

      <ul className="mt-4 flex flex-col divide-y divide-black/5">
        {bridge.citations.map((citation) => (
          <li key={citation.pmid} className="flex flex-col gap-1.5 py-4 last:pb-0">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold leading-tight text-black">
                {citation.ingredient}
              </span>
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${citation.pmid}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-medium tabular-nums text-black/50 underline underline-offset-2 hover:text-black"
              >
                PMID {citation.pmid} ↗
              </a>
            </div>
            <p className="max-w-[60ch] text-sm leading-snug text-black/75">
              {citation.finding}
            </p>
            <p className="text-xs tabular-nums text-black/50">
              {citation.studyDesign} · {citation.participants} · {citation.duration}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
