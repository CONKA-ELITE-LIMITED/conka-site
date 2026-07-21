import Image from "next/image";
import { FormulaId, formulaContent } from "@/app/lib/productData";
import { CURATED_STATS } from "./formulaStatsData";
import BottleVideo from "../landing/BottleVideo";

interface FormulaBenefitsPillarsProps {
  formulaId: FormulaId;
}

// Simple DTC daily-benefits block (Magic Mind "Daily habit. Lifelong
// benefits." homage). Three collapsed outcome blocks sit beside the rotating
// 3D render: each summary keeps the shift and its one clinical figure on a
// single line; expanding reveals what the figure measures, a plain sentence
// on the actives behind it, and those actives as render thumbnails. No mono
// eyebrows, no "Fig." plate — one sans voice with the stat as the only mono
// scalpel.
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
      <h2 className="brand-h1 mb-3 text-black">{formula.subheadline}</h2>
      <p className="brand-body text-black">
        The shifts you feel, and the actives behind each one.
      </p>
    </div>
  );

  const blocks = stats.map((item) => {
    const pillarLabel = item.pillarName ?? item.label;

    return (
      // Native <details> accordion (no client JS): single-open via the shared
      // name, all blocks collapsed on mount. The summary keeps the outcome and
      // its clinical figure on one line while the label, story and renders
      // collapse away.
      <details
        key={pillarLabel}
        name={`benefits-${formulaId}`}
        className="group border-t border-black/10 first:border-t-0"
      >
        <summary className="flex items-center justify-between gap-3 cursor-pointer list-none py-6 [&::-webkit-details-marker]:hidden">
          {/* Outcome + its clinical figure, one line. Stat is the only mono. */}
          <span className="flex items-baseline gap-2.5 min-w-0 flex-wrap">
            <h3 className="text-xl lg:text-2xl font-bold text-black leading-tight tracking-tight">
              {pillarLabel}
            </h3>
            <span className="font-mono text-lg lg:text-xl font-bold tabular-nums text-[#1B2757] leading-none">
              {item.stat}
            </span>
          </span>
          <svg
            className="w-5 h-5 shrink-0 text-black transition-transform duration-300 group-open:rotate-180"
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

  // Mobile stacks title, then the render, then the blocks (source order). On
  // desktop it becomes a two-column grid: the render sticks on the left across
  // both rows, with the header and blocks in the right column.
  return (
    <div className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-x-12 lg:items-start">
      <div className="lg:col-start-2 lg:row-start-1">{header}</div>

      <div className="relative aspect-[4/5] mb-8 rounded-2xl overflow-hidden bg-[#eef1f8] ring-1 ring-black/8 lg:mb-0 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 lg:self-start">
        <BottleVideo formula={formulaId === "01" ? "flow" : "clear"} />
      </div>

      <div className="flex flex-col lg:col-start-2 lg:row-start-2">{blocks}</div>
    </div>
  );
}
