"use client";

import { useState } from "react";
import {
  type FunnelCadence,
  type FunnelProduct,
  FUNNEL_CADENCES,
  FUNNEL_PRODUCTS,
  getDisplayDiscount,
  getOfferPricing,
} from "@/app/lib/funnelData";
import { formatPrice } from "@/app/lib/productData";
import FreeShotsBadge from "@/app/components/FreeShotsBadge";

interface CadenceSelectorProps {
  cadence: FunnelCadence;
  product: FunnelProduct;
  onChange: (cadence: FunnelCadence) => void;
}

const CADENCE_ORDER: FunnelCadence[] = ["quarterly-sub", "monthly-sub", "monthly-otp"];

/** Short delivery label for collapsed cards */
function getDeliveryLabel(cadence: FunnelCadence): string {
  switch (cadence) {
    case "monthly-sub":
      return "Delivered Monthly";
    case "monthly-otp":
      return "One-Time Delivery";
    case "quarterly-sub":
      return "Delivered Quarterly";
  }
}

/** Cadence-aware frequency label */
function getPriceFrequency(cadence: FunnelCadence): string {
  switch (cadence) {
    case "monthly-sub":
      return "/mo";
    case "monthly-otp":
      return "";
    case "quarterly-sub":
      return "/quarter";
  }
}

/** Explicit "what ships" — uses actual product shot count */
function getWhatShips(cadence: FunnelCadence, product: FunnelProduct, shotCount: number): string {
  const isBoth = product === "both";
  switch (cadence) {
    case "monthly-sub":
      return isBoth
        ? `2 boxes (${shotCount} shots) delivered every month`
        : `1 box (${shotCount} shots) delivered every month`;
    case "monthly-otp":
      return isBoth
        ? `2 boxes (${shotCount} shots), one-time delivery`
        : `1 box (${shotCount} shots), one-time delivery`;
    case "quarterly-sub":
      return isBoth
        ? `6 boxes (${shotCount} shots total) delivered every 3 months`
        : `3 boxes (${shotCount} shots total) delivered every 3 months`;
  }
}

export default function CadenceSelector({
  cadence,
  product,
  onChange,
}: CadenceSelectorProps) {
  const [pulseKey, setPulseKey] = useState(0);

  const handleChange = (newCadence: FunnelCadence) => {
    setPulseKey((k) => k + 1);
    onChange(newCadence);
  };

  // Preserve per-product accent — small decision aid on the selected-state left bar.
  const productAccent = FUNNEL_PRODUCTS[product].accent;

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
        Step 03 · Plan
      </p>
      <h2
        className="text-2xl lg:text-3xl font-semibold tracking-[var(--brand-h2-tracking)] mb-5"
        style={{ color: "var(--brand-black)" }}
      >
        Your delivery plan
      </h2>

      <div className="flex flex-col gap-3">
        {CADENCE_ORDER.map((cadenceKey, i) => {
          const display = FUNNEL_CADENCES[cadenceKey];
          const isActive = cadence === cadenceKey;
          const pricing = getOfferPricing(product, cadenceKey);
          const frequency = getPriceFrequency(cadenceKey);

          return (
            <button
              key={isActive ? `active-${pulseKey}` : cadenceKey}
              type="button"
              onClick={() => handleChange(cadenceKey)}
              className={`relative w-full text-left border-2 bg-white transition-all duration-200 select-none overflow-hidden ${
                isActive
                  ? "card-pulse border-[#1B2757] shadow-md"
                  : "border-black/10 hover:border-black/25 shadow-sm"
              }`}
            >
              {/* Badge banner — navy fill, mono register */}
              {display.badge && (
                <div className="py-1.5 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] leading-none text-white bg-[#1B2757] text-center">
                  {display.savingsLabel
                    ? `${display.badge} · ${display.savingsLabel}`
                    : display.badge}
                </div>
              )}

              <div className={isActive ? "p-4" : "px-4 py-3"}>
                {/* Row number + delivery label — mono spec counter */}
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35 leading-none mb-3 tabular-nums">
                  {String(i + 1).padStart(2, "0")} · {getDeliveryLabel(cadenceKey)}
                </p>

                {/* Header row: radio + name + per-shot price */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Radio square — zero radius, navy when active */}
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-all duration-200 ${
                        isActive
                          ? "border-[#1B2757] bg-[#1B2757]"
                          : "border-black/30 bg-white"
                      }`}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`transition-all duration-200 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                      >
                        <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    </div>

                    <div>
                      <p className={`font-semibold ${isActive ? "text-base text-[var(--brand-black)]" : "text-sm text-black/60"}`}>
                        {display.label}
                      </p>
                      {/* Collapsed: shots count in mono */}
                      {!isActive && (
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40 mt-0.5 tabular-nums">
                          {pricing.shotCount} shots
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Per-shot price — primary anchor */}
                  <div className="text-right flex-shrink-0">
                    <p className={`font-semibold tabular-nums ${isActive ? "text-base text-[var(--brand-black)]" : "text-sm text-black/60"}`}>
                      {formatPrice(pricing.perShot)}
                      <span className="font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-black/40">
                        /shot
                      </span>
                    </p>
                    {/* Collapsed: total price underneath */}
                    {!isActive && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40 mt-0.5 tabular-nums">
                        {formatPrice(pricing.price)}
                        {frequency}
                      </p>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isActive && (
                  <div className="mt-4 pt-4 ml-8 border-t border-black/10 space-y-3">
                    {/* Per-shot cost — large anchor, tabular-nums */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[var(--brand-black)] tabular-nums">
                        {formatPrice(pricing.perShot)}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/50">
                        per shot
                      </span>
                    </div>

                    {/* Total price — secondary */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base font-semibold text-[var(--brand-black)] tabular-nums">
                        {formatPrice(pricing.price)}
                        {frequency}
                      </span>
                      {pricing.compareAtPrice && (
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1B2757] tabular-nums">
                          {getDisplayDiscount(pricing)}% off
                        </span>
                      )}
                    </div>

                    {/* "20 + 8 free" bonus shots */}
                    <FreeShotsBadge freeShots={pricing.freeShots} cadence={cadenceKey} />

                    {/* What ships */}
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55 mt-0.5 shrink-0">
                        Ships
                      </span>
                      <p className="text-sm text-black/60">
                        {getWhatShips(cadenceKey, product, pricing.shotCount)}
                      </p>
                    </div>

                    {display.shippingCallout && (
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55 mt-0.5 shrink-0">
                          Note
                        </span>
                        <p className="text-sm text-black/60">{display.shippingCallout}</p>
                      </div>
                    )}

                    {/* Feature bullets — navy checks */}
                    <div className="space-y-1.5">
                      {display.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-black/70">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-[#1B2757]">
                            <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selection indicator — bottom accent bar, carries per-product accent */}
              {isActive && (
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: productAccent }}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
