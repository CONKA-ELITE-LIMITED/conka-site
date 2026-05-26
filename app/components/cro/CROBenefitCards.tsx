"use client";

import Link from "next/link";

/* ============================================================================
 * CROBenefitCards
 *
 * V2 Section 6 on /start. First "proof density" moment after Sections 1-5.
 * 2x2 grid of square tiles in the Ketone-IQ pdp-stat-cards style: small
 * uppercase headline at the top, big centered stat below. One tile per
 * dimension of cognitive performance (Focus / Speed / Memory / Calm), no
 * overlap. Two tiles from in-app CONKA data (^^), two from PMID-backed
 * ingredient studies (¶).
 *
 * Tiles are intentionally glanceable, no inline expand. If we add "see the
 * data" detail later, the easiest path is a modal sheet keyed off tile id;
 * the footnote link to /app-insights already covers the full report.
 * ========================================================================== */

type Anchor = "^^" | "¶";

interface BenefitTile {
  id: string;
  headline: string;
  metric: string;
  caption: string;
  anchor: Anchor;
}

const TILES: BenefitTile[] = [
  {
    id: "focus",
    headline: "Holds evening focus",
    metric: "+1.09 pts",
    caption: "When most people drop.",
    anchor: "^^",
  },
  {
    id: "speed",
    headline: "Sharpens reaction",
    metric: "−41 ms",
    caption: "On fatigued days.",
    anchor: "^^",
  },
  {
    id: "memory",
    headline: "Strengthens memory",
    metric: "+63%",
    caption: "Recall under load.",
    anchor: "¶",
  },
  {
    id: "calm",
    headline: "Lowers felt stress",
    metric: "−28%",
    caption: "In healthy adults.",
    anchor: "¶",
  },
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
      <span
        className="absolute bottom-3 right-3 text-[10px] tabular-nums text-black/35"
        aria-hidden
      >
        {tile.anchor}
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

      <div className="grid grid-cols-2 gap-3 mb-6">
        {TILES.map((tile, i) => (
          <BenefitTileCard key={tile.id} tile={tile} index={i} />
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
