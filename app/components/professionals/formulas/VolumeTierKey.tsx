"use client";

import {
  B2B_TIER_BANDS,
  b2bFormulaPricing,
  formatPrice,
  getB2BTier,
} from "@/app/lib/productData";
import type { B2BTier } from "@/app/lib/productData";

const TIER_ORDER: B2BTier[] = ["starter", "squad", "elite"];
const RRP_28 = 79.99;
// 26 bricks = entrance to Elite; aligns with Starter (1–10), Squad (11–25), Elite (26+)
const NUM_BRICKS = 26;
const STARTER_BRICKS = 10;   // 1–10
const SQUAD_BRICKS = 15;     // 11–25
const ELITE_BRICKS = 1;      // 26

function brickFillClass(i: number, filled: boolean): string {
  if (!filled) return "bg-gray-300 dark:bg-gray-600";
  if (i < STARTER_BRICKS) return "!bg-amber-500";
  if (i < STARTER_BRICKS + SQUAD_BRICKS) return "!bg-emerald-600";
  return "!bg-blue-600";
}

function tierLabel(tier: B2BTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function quantityRange(tier: B2BTier): string {
  const { min, max } = B2B_TIER_BANDS[tier];
  if (max === Infinity) return `${min}+ boxes`;
  return `${min}–${max} boxes`;
}

function savingsPercent(tier: B2BTier): number {
  const price = b2bFormulaPricing.subscription[tier].price;
  return Math.round(((RRP_28 - price) / RRP_28) * 100);
}

interface VolumeTierKeyProps {
  /** Total B2B boxes currently in cart; scale fills this many bricks. Default 0. */
  totalBoxes?: number;
  /** Optional extra class names (e.g. margin) for the section. */
  className?: string;
}

export default function VolumeTierKey({ totalBoxes = 0, className }: VolumeTierKeyProps) {
  const currentTier = getB2BTier(totalBoxes);
  const filledCount = Math.min(totalBoxes, NUM_BRICKS);
  const caption =
    totalBoxes === 0
      ? "0 boxes in cart"
      : totalBoxes >= NUM_BRICKS
        ? `26+ boxes in cart · ${tierLabel(currentTier)}`
        : `${totalBoxes} box${totalBoxes === 1 ? "" : "es"} in cart · ${tierLabel(currentTier)}`;

  return (
    <section
      className={`px-6 md:px-16 py-5 md:py-6 ${className ?? ""}`.trim()}
      aria-label="Volume pricing by quantity"
    >
      <div className="max-w-6xl mx-auto">
        {/* Bar first: boxes-in-cart brick strip */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wide opacity-70 mb-1.5 md:mb-2">
            Boxes in cart
          </h2>
          <p className="font-mono text-sm text-[var(--foreground)] mb-1.5 md:mb-2">
            {caption}
          </p>
          <div
            className="grid gap-0.5 mt-0"
            style={{ gridTemplateColumns: `repeat(${NUM_BRICKS}, minmax(0, 1fr))` }}
            role="img"
            aria-label={`${totalBoxes} boxes in cart`}
          >
            {Array.from({ length: NUM_BRICKS }, (_, i) => (
              <div
                key={i}
                className={`rounded-sm transition-colors min-w-0 ${brickFillClass(i, i < filledCount)}`}
                style={{ aspectRatio: "4/3" }}
              />
            ))}
          </div>
          <div
            className="grid mt-1 font-mono text-[10px] opacity-60"
            style={{ gridTemplateColumns: `${STARTER_BRICKS}fr ${SQUAD_BRICKS}fr ${ELITE_BRICKS}fr` }}
          >
            <span>Starter</span>
            <span>Squad</span>
            <span>26+ Elite</span>
          </div>
        </div>

        {/* Tier key below: price per box and tier cards */}
        <div className="mt-4 md:mt-6">
          <h2 className="font-mono text-xs uppercase tracking-wide opacity-70 mb-1 md:mb-2">
            Price per box by quantity
          </h2>
          <p className="font-mono text-[10px] md:text-xs opacity-60 mb-3 md:mb-4">
            per box ex. VAT · vs RRP {formatPrice(RRP_28)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
            {TIER_ORDER.map((tier) => {
              const price = b2bFormulaPricing.subscription[tier].price;
              const save = savingsPercent(tier);
              return (
                <div
                  key={tier}
                  className="rounded-lg border border-black/10 bg-black/[0.02] p-2.5 md:p-4 flex flex-col items-center justify-center text-center min-h-0"
                >
                  <p className="font-mono text-[11px] md:text-xs uppercase tracking-wide opacity-70">
                    Tier: {tierLabel(tier)} ({quantityRange(tier)})
                  </p>
                  <div className="flex flex-wrap items-baseline justify-center gap-1.5 md:gap-2 mt-1.5 md:mt-3">
                    <span className="text-base md:text-lg font-bold tabular-nums">
                      {formatPrice(price)}
                    </span>
                    <span
                      className="font-mono text-lg md:text-2xl font-bold tabular-nums"
                      style={{ color: "#059669" }}
                    >
                      Save {save}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
