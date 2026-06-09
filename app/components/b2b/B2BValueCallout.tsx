import { B2B_TIERS, getB2BPerShot } from "@/app/lib/b2bPricing";

/* ============================================================================
 * B2BValueCallout
 *
 * The value-framing beat for the /professionals landing. Reframes a large order
 * total into the smallest honest unit - cost per shot - while keeping the real
 * per-box price visible so the cost is clear at a glance. Per shot makes no
 * assumption about how a team uses the product. Presentational Server Component,
 * content-only (the page owns the section wrapper).
 *
 * Figures are derived from B2B_TIERS so they never drift from real pricing. All
 * ex VAT (B2B budgets ex VAT).
 * ========================================================================== */

const fmt = (n: number) => `£${n.toFixed(2)}`;

const bandLabel = (min: number, max: number | null) =>
  max === null ? `${min}+ boxes` : `${min}-${max} boxes`;

const lowestPerShot = Math.min(...B2B_TIERS.map(getB2BPerShot));

export default function B2BValueCallout() {
  return (
    <div>
      <p className="brand-eyebrow mb-4">{"// Volume pricing"}</p>
      <h2 className="brand-h2 max-w-[20ch]" style={{ letterSpacing: "-0.02em" }}>
        From {fmt(lowestPerShot)} a shot.
      </h2>
      <p className="brand-mono-sub mt-3">
        The more your squad takes, the less each shot costs. Prices ex VAT.
      </p>

      <div className="mt-8 border border-black/12 bg-white">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 sm:gap-x-12 px-5 py-3 border-b border-black/12 bg-black/[0.02]">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/45">
            Order size
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/45 text-right">
            Per box
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/45 text-right">
            Per shot
          </span>
        </div>

        {B2B_TIERS.map((tier) => (
          <div
            key={tier.label}
            className="grid grid-cols-[1fr_auto_auto] gap-x-6 sm:gap-x-12 items-baseline px-5 py-4 border-b border-black/8 last:border-b-0"
          >
            <span>
              <span className="block text-base font-semibold text-black leading-tight">
                {tier.label}
              </span>
              <span className="block font-mono text-[11px] tracking-[0.06em] text-black/45 mt-0.5">
                {bandLabel(tier.minBoxes, tier.maxBoxes)}
              </span>
            </span>
            <span className="text-base sm:text-lg font-medium tabular-nums text-black/70 text-right">
              £{tier.pricePerBox}
            </span>
            <span className="text-xl sm:text-2xl font-semibold tabular-nums text-black text-right">
              {fmt(getB2BPerShot(tier))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
