"use client";

import Link from "next/link";

/* ============================================================================
 * CROBenefitCards
 *
 * V2 Section 6 on /start. First "proof density" moment after Sections 1-5.
 * 2x2 grid of square tiles, one per dimension of cognitive performance:
 * Focus / Speed / Memory / Calm. Two tiles from in-app CONKA data (^^),
 * two from PMID-backed ingredient studies (¶).
 *
 * The four metrics here are load-bearing claims. They are hardcoded so the
 * surface is predictable; the full reports + methodology live at
 * /app-insights for visitors who want the deep dive.
 * ========================================================================== */

type Anchor = "^^" | "¶";

interface BenefitTile {
  id: string;
  dimension: string;
  metric: string;
  context: string;
  anchor: Anchor;
}

const TILES: BenefitTile[] = [
  {
    id: "focus",
    dimension: "Focus",
    metric: "+1.09 pts",
    context: "Steadier focus into the evening, where most people drop.",
    anchor: "^^",
  },
  {
    id: "speed",
    dimension: "Speed",
    metric: "−41 ms",
    context: "Sharper reactions on the days your brain is running low.",
    anchor: "^^",
  },
  {
    id: "memory",
    dimension: "Memory",
    metric: "+63%",
    context: "Stronger recall under load, from the actives in Clear.",
    anchor: "¶",
  },
  {
    id: "calm",
    dimension: "Calm",
    metric: "−28%",
    context: "Lower felt stress, from the actives in Flow.",
    anchor: "¶",
  },
];

function BenefitTileCard({ tile }: { tile: BenefitTile }) {
  return (
    <div className="relative aspect-square bg-black/[0.04] rounded-[16px] p-4 flex flex-col">
      <p className="text-[24px] sm:text-[28px] font-bold text-[#1B2757] tabular-nums leading-none mb-3">
        {tile.metric}
      </p>
      <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-black/55 mb-2">
        {tile.dimension}
      </p>
      <p className="text-[12px] text-black/75 leading-snug">{tile.context}</p>
      <span
        className="absolute bottom-3 right-3 text-[10px] text-black/40 tabular-nums"
        aria-hidden
      >
        {tile.anchor}
      </span>
    </div>
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

      <div className="grid grid-cols-2 gap-3 mb-6">
        {TILES.map((tile) => (
          <BenefitTileCard key={tile.id} tile={tile} />
        ))}
      </div>

      <div className="border-t border-black/8 pt-4 space-y-2">
        <p className="text-[11px] text-black/50 leading-snug">
          <span className="font-semibold text-black/65">^^</span> From in-app
          cognitive tests across 712 CONKA users, 7,593 tests, 30 months.
          Per-user delta methodology. Full breakdown at{" "}
          <Link
            href="/app-insights"
            className="underline underline-offset-2 hover:text-[#1B2757] transition-colors"
          >
            /app-insights
          </Link>
          .
        </p>
        <p className="text-[11px] text-black/50 leading-snug">
          <span className="font-semibold text-black/65">&para;</span>{" "}
          Peer-reviewed studies on individual active ingredients. Findings as
          published, not extrapolated to product-level effect.
        </p>
      </div>
    </div>
  );
}
