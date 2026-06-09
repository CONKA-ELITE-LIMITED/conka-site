import { B2B_TIERS, getB2BPerAthletePerDay } from "@/app/lib/b2bPricing";

/* ============================================================================
 * B2BValueCallout
 *
 * The value-framing beat for the /professionals landing. Reframes a large order
 * total (a 50-box order is roughly GBP 2,250 ex VAT) into a small per-head daily
 * figure that is easy to justify internally. Presentational Server Component,
 * content-only (the page owns the section wrapper, which is the dark surface).
 *
 * Figures are derived from B2B_TIERS so they never drift from real pricing. All
 * ex VAT (B2B budgets ex VAT). The figure is per athlete on ONE format; an
 * athlete running both Flow and Clear takes two shots a day, so the copy says so
 * rather than showing a doubled number.
 * ========================================================================== */

const fmt = (n: number) => `£${n.toFixed(2)}`;

const bandLabel = (min: number, max: number | null) =>
  max === null ? `${min}+ boxes` : `${min}-${max} boxes`;

// Lowest per-day figure (top tier) anchors the "from" headline.
const lowestPerDay = Math.min(...B2B_TIERS.map(getB2BPerAthletePerDay));

export default function B2BValueCallout() {
  return (
    <div>
      {/* Header */}
      <p className="brand-eyebrow mb-4 text-white/55">{"// Cost per athlete"}</p>
      <h2
        className="brand-h2 max-w-[20ch] text-white"
        style={{ letterSpacing: "-0.02em" }}
      >
        From {fmt(lowestPerDay)} per athlete, per day.
      </h2>
      <p className="brand-mono-sub mt-3 text-white/55">
        Ex VAT &middot; one shot a day &middot; per athlete on one format
      </p>

      {/* Tier strip */}
      <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/12 border border-white/12">
        {B2B_TIERS.map((tier) => (
          <div
            key={tier.label}
            className="bg-black p-5 lg:p-6 flex flex-col"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">
              {tier.label}
            </p>
            <p className="font-mono text-[11px] tracking-[0.08em] text-white/40 mt-1">
              {bandLabel(tier.minBoxes, tier.maxBoxes)}
            </p>
            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-4xl lg:text-5xl font-semibold tabular-nums text-white leading-none">
                {fmt(getB2BPerAthletePerDay(tier))}
              </span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-white/45">
                / athlete / day
              </span>
            </div>
            <p className="text-sm text-white/55 mt-3 leading-snug">
              {fmt(tier.pricePerBox)} per box, ex VAT
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
