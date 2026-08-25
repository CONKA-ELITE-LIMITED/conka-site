"use client";

/**
 * Build Your Order — plan selector (lives inside the single-page Build step).
 *
 * Layout rules that matter here:
 *  - The collapsed row is a strict 3-column grid: radio | name+detail | price.
 *    Nothing wraps into the price column, so long names cannot squash it.
 *  - Free shots are stated ONCE, in the detail line. They used to appear in a
 *    wrapping pill, again in the value stack, and again in a table.
 *  - Card grammar matches the PDP buy panel (ProductBuyPanel.FlatPlanCard):
 *    quiet grey fill unselected, the brand offer gradient as a 2px ring when
 *    selected. Navy appears only on the radio.
 *  - No per-card CTA. The sticky footer is the single forward action.
 */

import { useState, Fragment } from "react";
import {
  type ByoCadence,
  type ByoProduct,
  getChargedPrice,
  getOfferPricing,
  getDisplayDiscount,
} from "@/app/lib/byoData";
import { formatPrice } from "@/app/lib/productData";
import { cadenceDeliveryPeriod, cadencePriceSuffix } from "../defaults";

interface CadenceSelectorProps {
  cadence: ByoCadence;
  product: ByoProduct;
  onChange: (cadence: ByoCadence) => void;
}

const PLAN_ORDER: ByoCadence[] = ["monthly-sub", "quarterly-sub", "monthly-otp"];

/** The plan name carries the commitment, so no separate "Subscription" chip. */
const PLAN_NAME: Record<ByoCadence, string> = {
  "monthly-sub": "Monthly subscription",
  "quarterly-sub": "Quarterly subscription",
  "monthly-otp": "One-time purchase",
};

/** Floating badge on the top edge of the card. */
const PLAN_BADGE: Partial<Record<ByoCadence, string>> = {
  "monthly-sub": "Most popular",
};

/** Per-plan discount-badge colour, mirroring the PDP buy panel. */
const SAVE_COLOR: Record<ByoCadence, string> = {
  "monthly-sub": "#C9A24A",
  "quarterly-sub": "#E07A5F",
  "monthly-otp": "#C9A24A",
};

function postageValue(cadence: ByoCadence): number {
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
  const [openKey, setOpenKey] = useState<ByoCadence | null>(cadence);

  const handleToggle = (key: ByoCadence) => {
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
        const savingsPct = pricing.compareAtPrice ? getDisplayDiscount(pricing) : 0;

        const subRef = getOfferPricing(product, "monthly-sub");
        const otpMissed = (subRef.freeShotsValue ?? 0) + (pricing.postage ?? 0);

        // Crossed-out anchor, matching the PDP buy panel: the REAL all-in
        // one-time price for the same period (charged OTP; quarterly anchors
        // against three of them). Never an invented value stack. OTP is the
        // reference itself, so it gets no anchor.
        const otpCharged = getChargedPrice(getOfferPricing(product, "monthly-otp"));
        const anchor = isOtp ? null : key === "quarterly-sub" ? otpCharged * 3 : otpCharged;

        const period = cadenceDeliveryPeriod(key);

        // The bonus shots are a FIRST-ORDER acquisition incentive on every
        // subscription cadence, quarterly included. Same rule as the shared
        // FreeShotsBadge used on the PDPs, so the flow cannot promise more
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
          <Fragment key={key}>
            {/* Separates the subscriptions from the one-time option */}
            {isOtp && (
              <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-black/10" />
                <span className="text-[13px] font-medium text-black/45">Or buy once</span>
                <span className="h-px flex-1 bg-black/10" />
              </div>
            )}

            <div
              className={`relative rounded-md transition-colors duration-200 ${
                isSelected ? "" : "border-2 border-transparent bg-[#f1f1f3] hover:bg-[#e9e9ee]"
              }`}
              // Selected state uses the brand offer gradient as a 2px ring
              // (padding-box keeps the fill, border-box paints the gradient
              // edge), exactly as the PDP plan cards do.
              style={
                isSelected
                  ? {
                      border: "2px solid transparent",
                      background:
                        "linear-gradient(#f8f9fd,#f8f9fd) padding-box, linear-gradient(90deg,#cdeecf,#e9f5c9) border-box",
                    }
                  : undefined
              }
            >
              {badge && (
                <span
                  className="absolute left-5 top-0 z-10 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#14532d]"
                  style={{ background: "linear-gradient(90deg, #cdeecf, #e9f5c9)" }}
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
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white whitespace-nowrap"
                        style={{ backgroundColor: SAVE_COLOR[key] }}
                      >
                        {savingsPct}% off
                      </span>
                    )}
                  </span>
                  <span className="block text-[13px] text-black/60 leading-snug mt-1">
                    {detail}
                  </span>
                </span>

                {/* Price. Fixed column, so a long name can never squash it.
                    The struck anchor sits on its own line so the pair can never
                    overflow the column at 390px. */}
                <span className="shrink-0 text-right">
                  {anchor !== null && anchor > pricing.price && (
                    <span className="block text-[12px] tabular-nums leading-none mb-1 text-black/35 line-through whitespace-nowrap">
                      {formatPrice(anchor)}
                    </span>
                  )}
                  <span className="block text-[22px] font-bold text-black tabular-nums leading-none whitespace-nowrap">
                    {formatPrice(pricing.price)}
                    <span className="text-[13px] font-medium text-black/50">{cadencePriceSuffix(key)}</span>
                  </span>
                  <span className="block text-[12px] tabular-nums mt-1.5 whitespace-nowrap text-black/60">
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
              {/* One-time: the cost of NOT subscribing, stated up front rather
                  than hidden behind the chevron. */}
              {isOtp && (
                <div className="mx-4 mb-4 -mt-1 flex items-start gap-2 rounded-md bg-[#C4892A]/[0.10] px-3 py-2">
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
                  <div className="rounded-md bg-white border border-black/10 p-4">
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
                      delivery, then {pricing.shotCount} {period}. 100-day money-back
                      guarantee. Pause, skip, or cancel any time.
                    </p>
                  </div>
                </div>
              )}

              {/* Expanded — one-time. What you pay, and what you give up. */}
              {isOpen && isOtp && (
                <div className="px-4 pb-4">
                  <div className="rounded-md bg-white border border-black/10 p-4">
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

              {/* Free-shots incentive as a full-width gradient footer on the
                  SELECTED card only, hugging the rounded bottom corners (PDP
                  FlatPlanCard pattern - one strip on screen at a time). */}
              {isSelected && hasFreeShots && (
                <div
                  className="rounded-b-md px-4 py-2 text-center text-[12px] font-bold text-[#14532d]"
                  style={{ background: "linear-gradient(90deg, #cdeecf, #e9f5c9)" }}
                >
                  +{freeShots} free shots on your first order
                </div>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
