"use client";

/**
 * Funnel Step 3 — Plan (offer trial B).
 *
 * Accordion of plans in priority order: Monthly → Quarterly → One-time.
 * Built in the funnel's production "clinical" language (see ProductSelector /
 * SummaryStep): squared border-2 cards, shadow + accent bar for depth, soft
 * --brand-tint surfaces, readable text-sm/base content with mono used only for
 * small eyebrow labels. The FREE value stack is the hero of each open plan.
 */

import { useState } from "react";
import {
  type FunnelCadence,
  type FunnelProduct,
  getOfferPricing,
  getDisplayDiscount,
} from "../../lib/funnelData";
import { formatPrice } from "@/app/lib/productData";

interface CadenceSelectorProps {
  cadence: FunnelCadence;
  product: FunnelProduct;
  onChange: (cadence: FunnelCadence) => void;
}

// Hierarchy: monthly first, quarterly second, one-time last.
const PLAN_ORDER: FunnelCadence[] = ["monthly-sub", "quarterly-sub", "monthly-otp"];

const DELIVERY_LABEL: Record<FunnelCadence, string> = {
  "monthly-sub": "Monthly subscription",
  "quarterly-sub": "Quarterly subscription",
  "monthly-otp": "One-time purchase",
};

function nameLine(cadence: FunnelCadence, shotCount: number): string {
  if (cadence === "monthly-sub") return `${shotCount} shots / month`;
  if (cadence === "quarterly-sub") return `${shotCount} shots / quarter`;
  return `${shotCount} shots`;
}

function frequency(cadence: FunnelCadence): string {
  if (cadence === "monthly-sub") return "/mo";
  if (cadence === "quarterly-sub") return "/quarter";
  return "";
}

/** Postage value forgone-as-free on subscriptions (quarterly = 3×). */
function postageValue(cadence: FunnelCadence): number {
  return cadence === "quarterly-sub" ? 29.97 : 9.99;
}

// ---- Icons (line marks, navy) ----
const ico = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const AppIcon = () => (
  <svg {...ico}><rect x="7" y="3" width="10" height="18" rx="1.5" /><line x1="10.5" y1="18" x2="13.5" y2="18" /></svg>
);
const BrainIcon = () => (
  <svg {...ico}><path d="M9.5 6a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0-1 4.8V15a2.5 2.5 0 0 0 3.5 2.3" /><path d="M14.5 6A2.5 2.5 0 0 1 17 8.5a2.5 2.5 0 0 1 1 4.8V15a2.5 2.5 0 0 1-3.5 2.3" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
);
const BoxIcon = () => (
  <svg {...ico}><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M3 8v8l9 4 9-4V8" /></svg>
);
const ShotIcon = () => (
  <svg {...ico}><path d="M9 3h6M10 3v5l-4 9a2 2 0 0 0 1.8 3h8.4a2 2 0 0 0 1.8-3l-4-9V3" /></svg>
);
const Sparkle = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l1.7 6.1L20 10l-6.3 1.9L12 18l-1.7-6.1L4 10l6.3-1.9z" />
  </svg>
);

export default function CadenceSelector({
  cadence,
  product,
  onChange,
}: CadenceSelectorProps) {
  // Accordion open state is separate from the selected cadence, so every plan
  // renders COLLAPSED on landing (all options visible at once) while a default
  // cadence stays selected for the bottom "Review my order" CTA.
  const [openKey, setOpenKey] = useState<FunnelCadence | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  // Header click: toggle this row open/closed and make it the selected cadence.
  const handleHeaderToggle = (key: FunnelCadence) => {
    setPulseKey((k) => k + 1);
    setOpenKey((prev) => (prev === key ? null : key));
    onChange(key);
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
        Step 03 · Plan
      </p>
      <h2
        className="text-2xl lg:text-3xl font-semibold tracking-[var(--brand-h2-tracking)] mb-2"
        style={{ color: "var(--brand-black)" }}
      >
        Your delivery plan
      </h2>
      <p className="text-sm text-black/55 mb-5 leading-snug">
        Every plan includes the CONKA app, Brain Coach and free postage.
        Subscribe and your first order ships with bonus shots free.
      </p>

      <div className="flex flex-col gap-3">
        {PLAN_ORDER.map((key, i) => {
          const pricing = getOfferPricing(product, key);
          const isOpen = openKey === key;
          const isSelected = cadence === key;
          const isOtp = key === "monthly-otp";
          const freeShots = pricing.freeShots ?? 0;
          const freeShotsValue = pricing.freeShotsValue ?? 0;
          const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
          const savingsPct = getDisplayDiscount(pricing);

          // For OTP, the matching monthly subscription supplies the bonus-shot
          // count/value shown (greyed) so the contrast with subscribing is clear.
          const subRef = getOfferPricing(product, "monthly-sub");

          const freeStack = [
            { icon: <AppIcon />, label: "CONKA app", was: null as string | null },
            { icon: <BrainIcon />, label: "Brain Coach", was: null as string | null },
            { icon: <BoxIcon />, label: "Free postage", was: formatPrice(postageValue(key)) },
            { icon: <ShotIcon />, label: `${freeShots} bonus shots`, was: formatPrice(freeShotsValue) },
          ];

          return (
            <div
              key={isOpen ? `open-${pulseKey}` : key}
              className={`relative w-full border-2 transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "card-pulse border-[#1B2757] shadow-md"
                  : "border-black/10 hover:border-black/25 shadow-sm"
              } bg-white`}
            >
              {/* ---------- Header (toggles open) ---------- */}
              <button
                type="button"
                onClick={() => handleHeaderToggle(key)}
                aria-expanded={isOpen}
                className="block w-full text-left p-4 select-none"
              >
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35 leading-none mb-3 tabular-nums">
                  {String(i + 1).padStart(2, "0")} · {DELIVERY_LABEL[key]}
                </p>

                <div className="flex items-start gap-3">
                  {/* Radio square */}
                  <span
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-colors ${
                      isSelected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/30 bg-white"
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className={isSelected ? "opacity-100" : "opacity-0"} aria-hidden>
                      <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-[var(--brand-black)] leading-tight">
                      {nameLine(key, pricing.shotCount)}
                    </p>

                    {!isOtp && freeShots > 0 && (
                      <>
                        <span className="inline-flex w-fit items-center mt-2 bg-[#16a34a]/10 text-[#15803d] text-xs font-semibold px-2.5 py-1">
                          +{freeShots} free shots
                          {key === "quarterly-sub" ? " included" : " on your first order"}
                        </span>
                        <span className="flex items-center gap-1 mt-1.5 text-xs text-black/45">
                          Plus free postage, CONKA app &amp; Brain Coach
                          <svg
                            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                            className="text-black/35"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                      </>
                    )}
                    {isOtp && (
                      <p className="text-xs text-[#C4892A] mt-2 leading-snug">
                        +{formatPrice(pricing.postage ?? 0)} postage
                      </p>
                    )}
                  </div>

                  {/* Price + chevron */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="text-right">
                      {!isOtp && savingsPct > 0 && (
                        <span className="inline-block mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white bg-[#1B2757] px-2 py-0.5">
                          Save {savingsPct}%
                        </span>
                      )}
                      <p className="text-lg font-bold text-[var(--brand-black)] tabular-nums leading-none">
                        {formatPrice(pricing.price)}
                        <span className="text-xs font-medium text-black/45">{frequency(key)}</span>
                      </p>
                      <p className={`text-xs mt-1 tabular-nums ${isOtp ? "text-black/45" : "text-[#1B2757]"}`}>
                        {formatPrice(pricing.perShot)} / shot
                      </p>
                    </div>
                    <svg
                      width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                      className={`text-black/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* ---------- Expanded: subscription ---------- */}
              {isOpen && !isOtp && (
                <div className="border-t border-black/10 p-4">
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Included free — compact list */}
                    <div>
                      <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45 mb-2.5">
                        <span className="text-[#1B2757]"><Sparkle size={12} /></span>
                        Included free
                      </p>
                      <div className="space-y-2.5">
                        {freeStack.map((t) => (
                          <div key={t.label} className="flex items-center gap-2.5 text-sm">
                            <span className="text-[#1B2757] flex-shrink-0">{t.icon}</span>
                            <span className="flex-1 text-black/60">{t.label}</span>
                            <span className="text-xs font-medium text-[#15803d] whitespace-nowrap">
                              {t.was ? (
                                <>
                                  <span className="line-through text-black/30 mr-1 tabular-nums">{t.was}</span>
                                  free
                                </>
                              ) : (
                                "free"
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Your shots */}
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45 mb-2.5">
                        Your shots
                      </p>
                      <div className="border border-black/10 divide-y divide-black/[0.07]">
                        <div className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="text-black/55">Priced shots</span>
                          <span className="font-medium text-[var(--brand-black)] tabular-nums">{pricing.shotCount}</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="text-black/55">Free shots</span>
                          <span className="font-semibold text-[#1B2757] tabular-nums">+{freeShots}</span>
                        </div>
                        {key === "monthly-sub" ? (
                          <>
                            <div className="flex items-center justify-between px-3 py-2 text-sm bg-[#1B2757]/[0.04]">
                              <span className="font-semibold text-[var(--brand-black)]">First order</span>
                              <span className="font-bold text-[#1B2757] tabular-nums">{pricing.firstOrderShots}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 text-sm">
                              <span className="text-black/55">Every order after</span>
                              <span className="font-medium text-[var(--brand-black)] tabular-nums">{pricing.subsequentShots}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between px-3 py-2 text-sm bg-[#1B2757]/[0.04]">
                            <span className="font-semibold text-[var(--brand-black)]">Each quarter</span>
                            <span className="font-bold text-[#1B2757] tabular-nums">{pricing.firstOrderShots}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* What you pay — slim bar */}
                  <div className="mt-4 flex items-center justify-between gap-3 bg-[var(--brand-tint)] px-4 py-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {pricing.compareAtPrice && (
                        <span className="text-sm line-through text-black/30 tabular-nums">
                          {formatPrice(pricing.compareAtPrice)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-[var(--brand-black)] tabular-nums leading-none">
                        {formatPrice(pricing.price)}
                      </span>
                      <span className="text-sm text-black/50">{frequency(key)}</span>
                    </div>
                    {savings > 0 && (
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white bg-[#1B2757] px-2 py-1 whitespace-nowrap">
                        Save {savingsPct}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ---------- Expanded: one-time ---------- */}
              {isOpen && isOtp && (
                <div className="border-t border-black/10 p-4">
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Included — same list shape as subscriptions, but on a
                        one-time order only the app & Brain Coach are free;
                        postage and bonus shots show what they'd otherwise cost. */}
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45 mb-2.5">
                        Included
                      </p>
                      <div className="space-y-2.5">
                        {[
                          { icon: <AppIcon />, label: "CONKA app", value: "free", free: true },
                          { icon: <BrainIcon />, label: "Brain Coach", value: "free", free: true },
                          { icon: <BoxIcon />, label: "Postage", value: formatPrice(pricing.postage ?? 0), free: false },
                          { icon: <ShotIcon />, label: `${subRef.freeShots} bonus shots`, value: formatPrice(subRef.freeShotsValue ?? 0), free: false },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-2.5 text-sm">
                            <span className={`flex-shrink-0 ${item.free ? "text-[#1B2757]" : "text-black/35"}`}>
                              {item.icon}
                            </span>
                            <span className="flex-1 text-black/60">{item.label}</span>
                            <span
                              className={`text-xs font-medium whitespace-nowrap ${
                                item.free ? "text-[#15803d]" : "text-[#C4892A]"
                              }`}
                            >
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Your order — what's actually billed today */}
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45 mb-2.5">
                        Your order
                      </p>
                      <div className="border border-black/10 divide-y divide-black/[0.07]">
                        <div className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="text-black/55">{pricing.shotCount} shots</span>
                          <span className="font-medium text-[var(--brand-black)] tabular-nums">{formatPrice(pricing.price)}</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="text-black/55">Postage (required)</span>
                          <span className="font-medium text-[#C4892A] tabular-nums">{formatPrice(pricing.postage ?? 0)}</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 text-sm bg-[#1B2757]/[0.04]">
                          <span className="font-semibold text-[var(--brand-black)]">Total billed today</span>
                          <span className="font-bold text-[var(--brand-black)] tabular-nums">
                            {formatPrice(pricing.price + (pricing.postage ?? 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected accent bar */}
              {isOpen && <div className="h-1 w-full bg-[#1B2757]" aria-hidden />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
