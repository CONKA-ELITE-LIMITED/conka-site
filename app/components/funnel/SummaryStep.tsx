"use client";

import {
  type FunnelProduct,
  type FunnelCadence,
  FUNNEL_PRODUCTS,
  FUNNEL_CADENCES,
  getOfferPricing,
} from "@/app/lib/funnelData";
import { formatPrice } from "@/app/lib/productData";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";

interface SummaryStepProps {
  product: FunnelProduct;
  cadence: FunnelCadence;
}

function getDeliverySchedule(cadence: FunnelCadence): string {
  switch (cadence) {
    case "monthly-sub":
      return "First delivery within 3 days, then every 28 days";
    case "monthly-otp":
      return "Ships within 3 days, one-time delivery";
    case "quarterly-sub":
      return "First delivery within 3 days, then every 90 days";
  }
}

function formatTotal(pricing: ReturnType<typeof getOfferPricing>, cadence: FunnelCadence): string {
  if (cadence === "monthly-sub") return `${formatPrice(pricing.price)}/mo`;
  if (cadence === "quarterly-sub") return `${formatPrice(pricing.price)}/quarter`;
  return formatPrice(pricing.price);
}

const APP_BULLETS = [
  "Personalised brain performance insights in the CONKA app",
  `${GUARANTEE_DAYS}-day money-back guarantee, no questions asked`,
  "Track your cognitive score, sleep and energy daily",
];

export default function SummaryStep({ product, cadence }: SummaryStepProps) {
  const display = FUNNEL_PRODUCTS[product];
  const cadenceDisplay = FUNNEL_CADENCES[cadence];
  const pricing = getOfferPricing(product, cadence);
  const isSub = cadence === "monthly-sub" || cadence === "quarterly-sub";
  const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
  const total = formatTotal(pricing, cadence);

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
        Step 04 · Review
      </p>
      <h2
        className="text-2xl lg:text-3xl font-semibold tracking-[var(--brand-h2-tracking)] mb-5"
        style={{ color: "var(--brand-black)" }}
      >
        Your order
      </h2>

      {/* Order recap */}
      <div className="border border-black/10 divide-y divide-black/8 mb-4">
        <div className="flex items-start justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/35 mb-1">Product</p>
            <p className="text-sm font-semibold text-[var(--brand-black)]">{display.label}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/45 mt-0.5">{display.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-[var(--brand-black)] tabular-nums">
              {formatPrice(pricing.perShot)}
              <span className="font-mono text-[10px] font-normal text-black/45">/shot</span>
            </p>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/35 mb-1">Plan</p>
            <p className="text-sm font-semibold text-[var(--brand-black)]">{cadenceDisplay.label}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/45 mt-0.5">{cadenceDisplay.subtitle}</p>
          </div>
          {isSub && (
            <div className="shrink-0 pt-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white bg-[#1B2757] px-2 py-1">
                {cadence === "quarterly-sub" ? "Best Value" : "Save 25%"}
              </span>
            </div>
          )}
        </div>

        <div className="px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/35 mb-1">Delivery</p>
          <p className="text-sm text-[var(--brand-black)]">{getDeliverySchedule(cadence)}</p>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[var(--brand-tint)]">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/35 mb-1">Total</p>
            {savings > 0 && (
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#1B2757] font-semibold">
                Save {formatPrice(savings)} vs trial pack
              </p>
            )}
          </div>
          <p className="text-base font-bold text-[var(--brand-black)] tabular-nums">{total}</p>
        </div>
      </div>

      {/* App + guarantee section */}
      <div className="border border-black/10 mb-5">
        <div className="px-4 py-3 border-b border-black/8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
            Also included
          </p>
        </div>
        <div className="divide-y divide-black/8">
          {APP_BULLETS.map((bullet) => (
            <div key={bullet} className="flex items-start gap-3 px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
                <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
              <p className="text-sm text-[var(--brand-black)]">{bullet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
