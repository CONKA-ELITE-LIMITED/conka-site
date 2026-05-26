"use client";

import Link from "next/link";

/* ============================================================================
 * CROBenefitCards
 *
 * V2 Section 6 on /start. First "proof density" moment after Sections 1-5.
 * Grey rectangular title-bar tile sits above a 2x2 grid of square stat
 * tiles. Each stat tile carries a verb-infinitive headline that flows into
 * the title bar's "Taking CONKA can help you:" framing. Source anchors
 * (^^ in-app, ¶ ingredient studies) are cross-referenced by the (01)..(04)
 * indexes in the references footer.
 *
 * Tiles are intentionally glanceable, no captions. The headline is now the
 * only line of copy on each tile so it has to read clearly on its own.
 * ========================================================================== */

interface BenefitTile {
  id: string;
  headline: string;
  metric: string;
}

// Headlines are verb-infinitive form so they flow with the title-bar tile
// above: "Taking CONKA can help you: remember more / stay calmer / hold
// focus later / react faster." Each title also reads cleanly on its own
// as a benefit statement.
const TILES: BenefitTile[] = [
  {
    id: "memory",
    headline: "Remember more",
    metric: "+63%",
  },
  {
    id: "calm",
    headline: "Stay calmer",
    metric: "−28%",
  },
  {
    id: "focus",
    headline: "Focus into the night",
    metric: "+1.09 pts",
  },
  {
    id: "speed",
    headline: "Think faster",
    metric: "−41 ms",
  },
];

// References mapped by tile index. 01-02 are ingredient studies (PMID
// backed); 03-04 are in-app CONKA data (per-user delta methodology).
const REFERENCES: string[] = [
  "01. Small et al. (2018). Bacopa monnieri, 12-week clinical trial on memory performance. PMID 29246725.",
  "02. Kennedy et al. (2006). Melissa officinalis (Lemon Balm), randomised double-blind placebo-controlled crossover on stress and anxiety. PMID 16444660.",
  "03. CONKA in-app cognitive tests, evening-dip window. n=74 across 712 users, 30 months. Per-user delta methodology.",
  "04. CONKA in-app cognitive tests, fatigued-day window. n=15 users with both conditions. Per-user delta methodology.",
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

      <p className="text-[12px] uppercase tracking-[0.14em] font-bold text-black/70 leading-tight mb-3 max-w-[16ch]">
        {tile.headline}
      </p>
      <p className="text-[28px] sm:text-[30px] font-bold text-[#1B2757] tabular-nums leading-none">
        {tile.metric}
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

      {/* ===== Title-bar tile (grey rectangle spanning the grid width) ===== */}
      <div className="bg-black/[0.04] rounded-[16px] p-4 mb-3 text-center">
        <p className="text-[13px] uppercase tracking-[0.18em] font-bold text-black/80">
          Taking{" "}
          <strong className="text-[#1B2757] font-extrabold">CONKA</strong> can
          help you:
        </p>
      </div>

      {/* ===== 2x2 stat tiles ===== */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TILES.map((tile, i) => (
          <BenefitTileCard key={tile.id} tile={tile} index={i} />
        ))}
      </div>

      {/* ===== References (slightly more prominent for credibility) ===== */}
      <div className="border-t border-black/10 pt-5 space-y-3">
        <p className="text-[11px] text-black/60 leading-relaxed">
          {REFERENCES.join(" ")}
        </p>
        <p className="text-[11px] text-black/60 leading-relaxed">
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
