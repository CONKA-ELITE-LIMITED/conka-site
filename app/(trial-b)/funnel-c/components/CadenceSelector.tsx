"use client";

/**
 * funnel-c — plan selector (lives inside the single-page Build step).
 *
 * Layout rules that matter here:
 *  - The collapsed row is a strict 3-column grid: radio | name+detail | price.
 *    Nothing wraps into the price column, so long names cannot squash it.
 *  - Free shots are stated ONCE, in the detail line. They used to appear in a
 *    wrapping pill, again in the value stack, and again in a table.
 *  - Unselected cards take a quiet grey border. Black is reserved for content
 *    tiles; navy means "this is the one you have chosen".
 *  - No per-card CTA. The sticky footer is the single forward action.
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

/** The plan name carries the commitment, so no separate "Subscription" chip. */
const PLAN_NAME: Record<FunnelCadence, string> = {
  "monthly-sub": "Monthly subscription",
  "quarterly-sub": "Quarterly subscription",
  "monthly-otp": "One-time purchase",
};

/** Floating badge on the top edge of the card. */
const PLAN_BADGE: Partial<Record<FunnelCadence, string>> = {
  "monthly-sub": "Most popular",
};

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

export default function CadenceSelector({ cadence, product, onChange }: CadenceSelectorProps) {
  // The pre-selected plan starts open, so its value stack is the first thing the
  // user reads rather than something they have to go looking for.
  const [openKey, setOpenKey] = useState<FunnelCadence | null>(cadence);
  const [pulseKey, setPulseKey] = useState(0);

  const handleToggle = (key: FunnelCadence) => {
    setPulseKey((k) => k + 1);
    setOpenKey((prev) => (prev === key ? null : key));
    onChange(key);
  };

  return (
    <div className="flex flex-col gap-3">
      {PLAN_ORDER.map((key) => {
        const pricing = getOfferPricing(product, key);
        const isOpen = openKey === key;
        const isSelected = cadence === key;
        const isOtp = key === "monthly-otp";
        const badge = PLAN_BADGE[key];
        const freeShots = pricing.freeShots ?? 0;
        const freeShotsValue = pricing.freeShotsValue ?? 0;
        const savingsPct = pricing.compareAtPrice ? getSavingsPercent(pricing.price, pricing.compareAtPrice) : 0;

        const subRef = getOfferPricing(product, "monthly-sub");
        const otpMissed = (subRef.freeShotsValue ?? 0) + (pricing.postage ?? 0);

        const period = key === "quarterly-sub" ? "a quarter" : "a month";

        // The bonus shots are a FIRST-ORDER acquisition incentive on every
        // subscription cadence, quarterly included. Same rule as the shared
        // FreeShotsBadge used on the PDPs, so the funnel cannot promise more
        // than the product pages do.
        const hasFreeShots = !isOtp && freeShots > 0;

        // Recurring volume only. Free shots get their own row, so this line
        // never has to qualify itself.
        const detail = isOtp
          ? `${pricing.shotCount} shots, delivered once`
          : `${pricing.shotCount} shots ${period}`;

        const freeStack = [
          { icon: <BoxIcon />, label: "Free postage", was: formatPrice(postageValue(key)), note: null as string | null },
          {
            icon: <ShotIcon />,
            label: `${freeShots} bonus shots`,
            was: formatPrice(freeShotsValue),
            note: "first order",
          },
          { icon: <AppIcon />, label: "CONKA app", was: null as string | null, note: null as string | null },
          { icon: <BrainIcon />, label: "Brain Coach", was: null as string | null, note: null as string | null },
        ];

        return (
          <Fragment key={isOpen ? `open-${pulseKey}` : key}>
            {/* Separates the subscriptions from the one-time option */}
            {isOtp && (
              <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-black/10" />
                <span className="text-[13px] font-medium text-black/45">Or buy once</span>
                <span className="h-px flex-1 bg-black/10" />
              </div>
            )}

            <div
              className={`relative rounded-[16px] border-2 transition-colors duration-200 ${
                isSelected
                  ? "card-pulse border-[#1B2757] bg-[#1B2757]/[0.03]"
                  : "border-black/10 bg-white hover:border-black/25"
              }`}
            >
              {badge && (
                <span
                  className={`absolute -top-2.5 left-5 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                    isSelected ? "bg-[#10B981] text-white" : "bg-black text-white"
                  }`}
                >
                  {badge}
                </span>
              )}

              <button
                type="button"
                onClick={() => handleToggle(key)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 p-4 text-left select-none"
              >
                {/* Radio */}
                <span
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/25 bg-white"
                  }`}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className={isSelected ? "opacity-100" : "opacity-0"} aria-hidden>
                    <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>

                {/* Name + the one detail line. Gold savings badge, matching the
                    PDP buy panel (ProductBuyPanel). */}
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2 flex-wrap">
                    <span className="text-[16px] font-semibold text-black leading-tight">
                      {PLAN_NAME[key]}
                    </span>
                    {savingsPct > 0 && (
                      <span className="rounded-full bg-[#C9A24A] px-2 py-0.5 text-[11px] font-bold text-white whitespace-nowrap">
                        Save {savingsPct}%
                      </span>
                    )}
                  </span>
                  <span className="block text-[13px] text-black/60 leading-snug mt-1">
                    {detail}
                  </span>
                </span>

                {/* Price. Fixed column, so a long name can never squash it. */}
                <span className="shrink-0 text-right">
                  {pricing.compareAtPrice && (
                    <span className="block text-[13px] text-black/35 line-through tabular-nums leading-none">
                      {formatPrice(pricing.compareAtPrice)}
                    </span>
                  )}
                  <span className="block text-[22px] font-bold text-black tabular-nums leading-none mt-1 whitespace-nowrap">
                    {formatPrice(pricing.price)}
                    <span className="text-[13px] font-medium text-black/50">{frequency(key)}</span>
                  </span>
                  <span className="block text-[12px] tabular-nums mt-1.5 whitespace-nowrap text-[#1B2757]">
                    {isOtp ? `+${formatPrice(pricing.postage ?? 0)} postage` : `${formatPrice(pricing.perShot)} / shot`}
                  </span>
                </span>

                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                  className={`shrink-0 text-black/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Free shots get a full-width row of their own. Squeezed into the
                  name column they wrapped into an unreadable blob, and the
                  "first order" qualifier is too important to lose to a line break. */}
              {hasFreeShots && (
                <div className="mx-4 mb-4 -mt-1 flex items-center gap-2 rounded-[10px] bg-[#10B981]/[0.10] px-3 py-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                    <circle cx="12" cy="12" r="10" fill="#10B981" />
                    <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[13px] leading-snug text-[#0b7a55]">
                    <strong className="font-bold">{freeShots} free shots</strong> on your first order
                  </span>
                </div>
              )}

              {/* One-time: the cost of NOT subscribing, stated up front rather
                  than hidden behind the chevron. */}
              {isOtp && (
                <div className="mx-4 mb-4 -mt-1 flex items-start gap-2 rounded-[10px] bg-[#C4892A]/[0.10] px-3 py-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4892A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 mt-0.5">
                    <path d="M12 9v4M12 17h.01" />
                    <path d="M10.3 3.9L2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                  </svg>
                  <span className="text-[13px] leading-snug text-[#8a5f16]">
                    You lose <strong className="font-bold tabular-nums">{formatPrice(otpMissed)}</strong>: no free
                    shots, and postage is not included.
                  </span>
                </div>
              )}

              {/* Expanded — subscription. The value stack, and the one fact the
                  old "Your shots" table was trying to convey. */}
              {isOpen && !isOtp && (
                <div className="px-4 pb-4">
                  <div className="rounded-[12px] bg-white border border-black/10 p-4">
                    <p className="text-[13px] font-semibold text-black mb-3">Included free</p>
                    <div className="flex flex-col gap-2.5">
                      {freeStack.map((r) => (
                        <div key={r.label} className="flex items-center gap-2.5 text-[13px]">
                          <span className="text-[#1B2757] shrink-0">{r.icon}</span>
                          <span className="flex-1 min-w-0 text-black/70">
                            {r.label}
                            {r.note && (
                              <span className="ml-1.5 rounded-full bg-black/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-black/60 whitespace-nowrap">
                                {r.note}
                              </span>
                            )}
                          </span>
                          <span className="text-[12px] whitespace-nowrap tabular-nums font-semibold text-[#0b7a55]">
                            {r.was ? (<><span className="line-through text-black/30 font-normal mr-1">{r.was}</span>free</>) : "free"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-3.5 pt-3 border-t border-black/10 text-[13px] text-black leading-snug">
                      <strong className="font-semibold">{pricing.firstOrderShots} shots</strong> in your first
                      delivery, then {pricing.shotCount} {period}. Cancel any time.
                    </p>
                  </div>
                </div>
              )}

              {/* Expanded — one-time. What you pay, and what you give up. */}
              {isOpen && isOtp && (
                <div className="px-4 pb-4">
                  <div className="rounded-[12px] bg-white border border-black/10 p-4">
                    <div className="flex flex-col gap-2.5 text-[13px]">
                      <div className="flex items-center justify-between">
                        <span className="text-black/70">{pricing.shotCount} shots</span>
                        <span className="font-medium text-black tabular-nums">{formatPrice(pricing.price)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-black/70">Postage (required)</span>
                        <span className="font-medium text-[#C4892A] tabular-nums">{formatPrice(pricing.postage ?? 0)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2.5 border-t border-black/10">
                        <span className="font-semibold text-black">Billed today</span>
                        <span className="font-bold text-black tabular-nums">
                          {formatPrice(pricing.price + (pricing.postage ?? 0))}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3.5 pt-3 border-t border-black/10 text-[13px] text-black leading-snug">
                      Subscribe instead and you get {subRef.freeShots} free shots and free postage, worth{" "}
                      <strong className="font-semibold tabular-nums">{formatPrice(otpMissed)}</strong>, from{" "}
                      {formatPrice(subRef.price)}/mo. Cancel any time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
