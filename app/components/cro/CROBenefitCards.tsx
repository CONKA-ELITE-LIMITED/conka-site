"use client";

import Link from "next/link";

/* ============================================================================
 * CROBenefitCards
 *
 * V2 Section 6 on /start. First "proof density" moment after Sections 1-5.
 * 2x2 grid of square tiles in the Ketone-IQ pdp-stat-cards style: small
 * uppercase headline at the top, big centered stat below. One tile per
 * dimension of cognitive performance (Focus / Speed / Memory / Calm), no
 * overlap. Two tiles from in-app CONKA data, two from PMID-backed
 * ingredient studies. The (01)..(04) tile indexes map to the numbered
 * references in the footer block.
 *
 * Tiles are intentionally glanceable, no inline expand. If we add "see the
 * data" detail later, the easiest path is a modal sheet keyed off tile id;
 * the footer link to /app-insights already covers the full report.
 * ========================================================================== */

interface BenefitTile {
  id: string;
  headline: string;
  metric: string;
  caption: string;
}

// Headlines use base-form verbs so the title bar above the grid reads
// continuously into each tile: "Taking CONKA can hold evening focus" /
// "sharpen reaction" / "strengthen memory" / "lower felt stress".
const TILES: BenefitTile[] = [
  {
    id: "focus",
    headline: "Hold evening focus",
    metric: "+1.09 pts",
    caption: "When most people drop.",
  },
  {
    id: "speed",
    headline: "Sharpen reaction",
    metric: "−41 ms",
    caption: "On fatigued days.",
  },
  {
    id: "memory",
    headline: "Strengthen memory",
    metric: "+63%",
    caption: "Recall under load.",
  },
  {
    id: "calm",
    headline: "Lower felt stress",
    metric: "−28%",
    caption: "In healthy adults.",
  },
];

// References mapped by tile index. 01-02 are in-app CONKA data; 03-04 are
// PMID-backed ingredient studies.
const REFERENCES: string[] = [
  "01. CONKA in-app cognitive tests, evening-dip window. n=74 across 712 users, 30 months. Per-user delta methodology.",
  "02. CONKA in-app cognitive tests, fatigued-day window. n=15 users with both conditions. Per-user delta methodology.",
  "03. Small et al. (2018). Bacopa monnieri, 12-week clinical trial on memory performance. PMID 29246725.",
  "04. Kennedy et al. (2006). Melissa officinalis (Lemon Balm), randomised double-blind placebo-controlled crossover on stress and anxiety. PMID 16444660.",
];

function BenefitTileCard({
  tile,
  index,
}: {
  tile: BenefitTile;
  index: number;
}) {
  return (
    <article className="relative aspect-square bg-black/[0.04] rounded-[16px] p-4 flex flex-col items-center justify-center text-center">
      <span
        className="absolute top-3 left-3 font-mono text-[10px] tabular-nums text-black/35"
        aria-hidden
      >
        ({String(index + 1).padStart(2, "0")})
      </span>

      <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-black/65 leading-tight mb-3 max-w-[16ch]">
        {tile.headline}
      </p>
      <p className="text-[28px] sm:text-[30px] font-bold text-[#1B2757] tabular-nums leading-none mb-2">
        {tile.metric}
      </p>
      <p className="text-[11px] text-black/55 leading-tight max-w-[18ch]">
        {tile.caption}
      </p>
    </article>
  );
}

export default function CROBenefitCards() {
  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        Measured, not marketed.
      </h2>

      <p className="text-[15px] leading-snug text-black/75 mb-8">
        Sharper focus, faster recall, stronger memory, calmer days, all
        anchored in real data.
      </p>

      <p className="text-center text-[13px] uppercase tracking-[0.18em] font-bold text-black/70 mb-4">
        Taking{" "}
        <strong className="text-[#1B2757] font-extrabold">CONKA</strong> can:
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {TILES.map((tile, i) => (
          <BenefitTileCard key={tile.id} tile={tile} index={i} />
        ))}
      </div>

      <div className="border-t border-black/8 pt-4 space-y-3">
        <p className="text-[10px] text-black/45 leading-relaxed">
          {REFERENCES.join(" ")}
        </p>
        <p className="text-[10px] text-black/45 leading-relaxed">
          Ingredient findings as published, not extrapolated to product-level
          effect. Full per-user app data and methodology at{" "}
          <Link
            href="/app-insights"
            className="underline underline-offset-2 hover:text-[#1B2757] transition-colors"
          >
            /app-insights
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
