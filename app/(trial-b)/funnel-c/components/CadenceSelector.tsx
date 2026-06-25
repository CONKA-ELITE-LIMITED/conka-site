"use client";

/**
 * funnel-c — plan selector (lives inside the single-page Build step).
 *
 * Same production "clinical" card language, but tuned to this layout:
 *  - collapsed by default (all options visible)
 *  - NO per-card CTA — the sticky footer is the single forward action
 *  - when expanded, the detail is a COMPACT 2-column grid (free stack | shots),
 *    not a tall stacked panel
 */

import { useState, Fragment } from "react";
import {
  type FunnelCadence,
  type FunnelProduct,
  getOfferPricing,
  getSavingsPercent,
} from "../../lib/funnelData";
import { formatPrice } from "@/app/lib/productData";

interface CadenceSelectorProps {
  cadence: FunnelCadence;
  product: FunnelProduct;
  onChange: (cadence: FunnelCadence) => void;
}

const PLAN_ORDER: FunnelCadence[] = ["monthly-sub", "quarterly-sub", "monthly-otp"];

function nameLine(cadence: FunnelCadence, shotCount: number): string {
  if (cadence === "monthly-sub") return `${shotCount} shots / month`;
  if (cadence === "quarterly-sub") return `${shotCount} shots / quarter`;
  return `${shotCount} shots / one time`;
}

function frequency(cadence: FunnelCadence): string {
  if (cadence === "monthly-sub") return "/mo";
  if (cadence === "quarterly-sub") return "/quarter";
  return "";
}

function postageValue(cadence: FunnelCadence): number {
  return cadence === "quarterly-sub" ? 29.97 : 9.99;
}

const ico = {
  width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
};
const AppIcon = () => (<svg {...ico}><rect x="7" y="3" width="10" height="18" rx="1.5" /><line x1="10.5" y1="18" x2="13.5" y2="18" /></svg>);
const BrainIcon = () => (<svg {...ico}><path d="M9.5 6a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0-1 4.8V15a2.5 2.5 0 0 0 3.5 2.3" /><path d="M14.5 6A2.5 2.5 0 0 1 17 8.5a2.5 2.5 0 0 1 1 4.8V15a2.5 2.5 0 0 1-3.5 2.3" /><line x1="12" y1="6" x2="12" y2="18" /></svg>);
const BoxIcon = () => (<svg {...ico}><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M3 8v8l9 4 9-4V8" /></svg>);
const ShotIcon = () => (<svg {...ico}><path d="M9 3h6M10 3v5l-4 9a2 2 0 0 0 1.8 3h8.4a2 2 0 0 0 1.8-3l-4-9V3" /></svg>);
const Sparkle = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l1.7 6.1L20 10l-6.3 1.9L12 18l-1.7-6.1L4 10l6.3-1.9z" />
  </svg>
);

export default function CadenceSelector({ cadence, product, onChange }: CadenceSelectorProps) {
  const [openKey, setOpenKey] = useState<FunnelCadence | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  const handleToggle = (key: FunnelCadence) => {
    setPulseKey((k) => k + 1);
    setOpenKey((prev) => (prev === key ? null : key));
    onChange(key);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {PLAN_ORDER.map((key) => {
        const pricing = getOfferPricing(product, key);
        const isOpen = openKey === key;
        const isSelected = cadence === key;
        const isOtp = key === "monthly-otp";
        const freeShots = pricing.freeShots ?? 0;
        const freeShotsValue = pricing.freeShotsValue ?? 0;
        const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
        const savingsPct = pricing.compareAtPrice ? getSavingsPercent(pricing.price, pricing.compareAtPrice) : 0;

        const subRef = getOfferPricing(product, "monthly-sub");
        const otpMissed = (subRef.freeShotsValue ?? 0) + (pricing.postage ?? 0);

        const freeStack = [
          { icon: <AppIcon />, label: "CONKA app", was: null as string | null },
          { icon: <BrainIcon />, label: "Brain Coach", was: null as string | null },
          { icon: <BoxIcon />, label: "Free postage", was: formatPrice(postageValue(key)) },
          { icon: <ShotIcon />, label: `${freeShots} bonus shots`, was: formatPrice(freeShotsValue) },
        ];

        return (
          <Fragment key={isOpen ? `open-${pulseKey}` : key}>
            {/* Light divider separating the subscriptions from the one-time option */}
            {isOtp && (
              <div className="flex items-center gap-3 py-1.5">
                <span className="h-px flex-1 bg-black/10" />
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/35">Or buy once</span>
                <span className="h-px flex-1 bg-black/10" />
              </div>
            )}
            <div
              className={`relative border bg-white transition-colors duration-200 overflow-hidden ${
                isOpen || isSelected ? "card-pulse border-[#1B2757]" : "border-black/12 hover:border-black/25"
              }`}
            >
            {/* Header */}
            <button type="button" onClick={() => handleToggle(key)} aria-expanded={isOpen} className="block w-full text-left p-4 select-none">
              <div className="flex items-center gap-3">
                {/* Left: badge + counter, then radio + name/offer */}
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <span
                      className={`lab-clip-tr inline-block font-mono text-[9px] font-bold uppercase tracking-[0.12em] leading-none px-2.5 py-1 ${
                        isOtp ? "bg-[#C4892A]/[0.12] text-[#C4892A]" : "bg-[#1B2757]/[0.08] text-[#1B2757]"
                      }`}
                    >
                      {isOtp ? "One time" : "Subscription"}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-colors ${isSelected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/30 bg-white"}`}>
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className={isSelected ? "opacity-100" : "opacity-0"} aria-hidden>
                        <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-[var(--brand-black)] leading-tight">{nameLine(key, pricing.shotCount)}</p>
                      {!isOtp && freeShots > 0 && (
                        <>
                          <span className="inline-flex items-center mt-2 bg-[#1a7f4f]/[0.1] text-[#1a7f4f] text-xs font-semibold px-2.5 py-1">
                            +<span className="font-bold mx-1">{freeShots} free shots</span> {key === "quarterly-sub" ? "included" : "on your first order"}
                          </span>
                          <p className="flex items-center gap-1 text-[11px] text-black/50 mt-1.5">
                            Plus free postage, CONKA app &amp; Brain Coach
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-black/35">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </p>
                        </>
                      )}
                      {isOtp && (
                        <p className="text-[11px] text-black/50 mt-1.5">
                          Still includes the CONKA app &amp; Brain Coach free
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price — vertically centered against the whole card */}
                <div className="text-right shrink-0">
                  {!isOtp && savingsPct > 0 && (
                    <span className="lab-clip-tr inline-block mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white bg-[#1B2757] px-2.5 py-1">Save {savingsPct}%</span>
                  )}
                  <p className="text-xl lg:text-2xl font-bold text-[var(--brand-black)] tabular-nums leading-none">
                    {formatPrice(pricing.price)}<span className="text-sm font-medium text-black/45">{frequency(key)}</span>
                  </p>
                  {isOtp ? (
                    <p className="text-xs mt-1 text-[#C4892A] tabular-nums">+{formatPrice(pricing.postage ?? 0)} postage</p>
                  ) : (
                    <p className="text-xs mt-1 text-[#1B2757] tabular-nums">{formatPrice(pricing.perShot)} / shot</p>
                  )}
                </div>

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`shrink-0 text-black/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            {/* Expanded — compact 2-column */}
            {isOpen && !isOtp && (
              <div className="border-t border-black/10 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Free with every order */}
                  <div>
                    <p className="flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/45 mb-2.5">
                      <span className="text-[#1B2757]"><Sparkle /></span> Free with every order
                    </p>
                    <div className="flex flex-col gap-2">
                      {freeStack.map((r) => (
                        <div key={r.label} className="flex items-center gap-2.5 text-[13px]">
                          <span className="text-[#1B2757] flex-shrink-0">{r.icon}</span>
                          <span className="flex-1 text-black/60">{r.label}</span>
                          <span className="text-[#1B2757] text-[11px] whitespace-nowrap tabular-nums">
                            {r.was ? (<><span className="line-through text-black/30">{r.was}</span> free</>) : "free"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Your shots */}
                  <div>
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/45 mb-2.5">Your shots</p>
                    <div className="border border-black/10 divide-y divide-black/[0.07]">
                      <div className="flex items-center justify-between px-3 py-2 text-[13px]">
                        <span className="text-black/55">Priced shots</span>
                        <span className="font-medium text-[var(--brand-black)] tabular-nums">{pricing.shotCount}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 text-[13px]">
                        <span className="text-black/55">Free shots</span>
                        <span className="font-semibold text-[#1B2757] tabular-nums">+{freeShots}</span>
                      </div>
                      {key === "monthly-sub" ? (
                        <>
                          <div className="flex items-center justify-between px-3 py-2 text-[13px] bg-[#1B2757]/[0.04]">
                            <span className="font-semibold text-[var(--brand-black)]">First order</span>
                            <span className="font-bold text-[#1B2757] tabular-nums">{pricing.firstOrderShots}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 text-[13px]">
                            <span className="text-black/55">Every order after</span>
                            <span className="font-medium text-[var(--brand-black)] tabular-nums">{pricing.subsequentShots}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between px-3 py-2 text-[13px] bg-[#1B2757]/[0.04]">
                          <span className="font-semibold text-[var(--brand-black)]">Each quarter</span>
                          <span className="font-bold text-[#1B2757] tabular-nums">{pricing.firstOrderShots}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slim value line */}
                {savings > 0 && (
                  <p className="mt-3.5 pt-3 border-t border-black/8 text-[13px]">
                    {pricing.compareAtPrice && (
                      <span className="line-through text-black/30 tabular-nums mr-2">{formatPrice(pricing.compareAtPrice)}</span>
                    )}
                    <span className="font-semibold text-[var(--brand-black)] tabular-nums">{formatPrice(pricing.price)}{frequency(key)}</span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#1B2757] ml-2">Save {formatPrice(savings)} · {savingsPct}%</span>
                  </p>
                )}
              </div>
            )}

            {/* Expanded — one-time, compact 2-column */}
            {isOpen && isOtp && (
              <div className="border-t border-black/10 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#C4892A] mb-2.5">Required with a one-time order</p>
                    <div className="border border-black/10 divide-y divide-black/[0.07]">
                      <div className="flex items-center justify-between px-3 py-2 text-[13px]">
                        <span className="text-black/60">{pricing.shotCount} shots</span>
                        <span className="font-medium text-[var(--brand-black)] tabular-nums">{formatPrice(pricing.price)}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 text-[13px]">
                        <span className="text-black/60">Postage (required)</span>
                        <span className="font-medium text-[#C4892A] tabular-nums">{formatPrice(pricing.postage ?? 0)}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 text-[13px] bg-black/[0.02]">
                        <span className="font-semibold text-[var(--brand-black)]">Billed today</span>
                        <span className="font-bold text-[var(--brand-black)] tabular-nums">{formatPrice(pricing.price + (pricing.postage ?? 0))}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/45 mb-2.5">You miss vs subscribing</p>
                    <p className="text-2xl font-bold text-[var(--brand-black)] tabular-nums leading-none">{formatPrice(otpMissed)}</p>
                    <p className="text-[13px] text-black/55 mt-2 leading-snug">
                      {subRef.freeShots} free shots and free postage come with every {formatPrice(subRef.price)}/mo subscription.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(isOpen || isSelected) && <div className="h-1 w-full bg-[#1B2757]" aria-hidden />}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
