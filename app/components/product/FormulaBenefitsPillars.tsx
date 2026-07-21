import Image from "next/image";
import { FormulaId, formulaContent } from "@/app/lib/productData";
import { CURATED_STATS } from "./formulaStatsData";
import BottleVideo from "../landing/BottleVideo";

interface FormulaBenefitsPillarsProps {
  formulaId: FormulaId;
}

// Simple DTC daily-benefits block (Magic Mind "Daily habit. Lifelong
// benefits." homage). Three always-open outcome blocks sit beside the
// rotating 3D render: each leads with the shift, states its one clinical
// figure, explains the actives behind it in a plain sentence, then shows
// those actives as render thumbnails. No accordion, no mono eyebrows, no
// "Fig." plate — one sans voice with the stat as the only mono scalpel.
//
// Pillar copy lives on CURATED_STATS so the legacy renderers still compiling
// against the same array shape are unaffected.

export default function FormulaBenefitsPillars({
  formulaId,
}: FormulaBenefitsPillarsProps) {
  const formula = formulaContent[formulaId];
  const stats = CURATED_STATS[formulaId];

  const header = (
    <div className="mb-8 lg:mb-10">
      <h2
        className="brand-h1 mb-3 text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        {formula.subheadline}
      </h2>
      <p className="brand-body text-black">
        The shifts you feel, and the actives behind each one.
      </p>
    </div>
  );

  const blocks = stats.map((item, idx) => {
    const pillarLabel = item.pillarName ?? item.label;

    return (
      // Native <details> accordion (no client JS): single-open via the shared
      // name, first block open, the other two collapsed. The summary keeps the
      // outcome + its clinical figure visible while the story and renders
      // collapse away.
      <details
        key={pillarLabel}
        name={`benefits-${formulaId}`}
        open={idx === 0}
        className="group border-t border-black/10 first:border-t-0"
      >
        <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-6 [&::-webkit-details-marker]:hidden">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-black leading-tight tracking-tight">
              {pillarLabel}
            </h3>
            {/* Single clinical figure — the only mono in the block. */}
            <p className="mt-2 flex items-baseline gap-2.5">
              <span className="font-mono text-3xl lg:text-4xl font-bold tabular-nums text-[#1B2757] leading-none">
                {item.stat}
              </span>
              <span className="text-sm text-black/55 leading-snug">
                {item.label}
              </span>
            </p>
          </div>
          <svg
            className="w-5 h-5 mt-1.5 shrink-0 text-black/40 transition-transform duration-300 group-open:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>

        <div className="pb-8">
          {/* Plain sentence weaving the named actives into the outcome. */}
          {item.story && (
            <p className="text-base text-black leading-relaxed">
              {item.story}
            </p>
          )}

          {/* The actives the sentence just named, as render thumbnails. */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
              {item.ingredients.map((ing) => (
                <div key={ing.name} className="flex flex-col items-center gap-2">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white ring-1 ring-black/8">
                    <Image
                      src={ing.imageSrc}
                      alt={ing.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 30vw, 130px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-black/60 text-center leading-tight">
                    {ing.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </details>
    );
  });

  // Rotating 3D render in a soft, contained panel; cards stacked beside it.
  return (
    <div className="flex flex-col lg:flex-row lg:gap-12">
      <div className="relative aspect-[4/5] mb-8 rounded-2xl overflow-hidden bg-[#eef1f8] ring-1 ring-black/8 lg:mb-0 lg:flex-[2] lg:sticky lg:top-24 lg:self-start">
        <BottleVideo formula={formulaId === "01" ? "flow" : "clear"} />
      </div>

      <div className="lg:flex-[3]">
        {header}
        <div className="flex flex-col">{blocks}</div>
      </div>
    </div>
  );
}
