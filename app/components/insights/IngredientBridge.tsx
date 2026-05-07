import type { IngredientBridge as IngredientBridgeData } from "@/app/lib/appInsightsTypes";

export default function IngredientBridge({
  bridge,
}: {
  bridge: IngredientBridgeData;
}) {
  return (
    <div className="border border-white/15 bg-white/[0.07] p-5 lg:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 tabular-nums mb-3">
        {"// Ingredient evidence · APP-01"}
      </p>
      <p className="text-sm text-white/75 leading-relaxed max-w-[68ch]">
        {bridge.intro}
      </p>

      <ul className="mt-6 flex flex-col">
        {bridge.citations.map((citation, idx) => {
          const isLast = idx === bridge.citations.length - 1;
          return (
            <li
              key={citation.pmid}
              className={`flex flex-col gap-2 py-4 ${
                isLast ? "" : "border-b border-white/10"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-white leading-tight">
                  {citation.ingredient}
                </span>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${citation.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55 hover:text-white tabular-nums flex-shrink-0 transition-colors"
                >
                  PMID {citation.pmid} ↗
                </a>
              </div>
              <p className="text-sm text-white/70 leading-snug max-w-[60ch]">
                {citation.finding}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 tabular-nums">
                {citation.studyDesign} · {citation.participants} · {citation.duration}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
