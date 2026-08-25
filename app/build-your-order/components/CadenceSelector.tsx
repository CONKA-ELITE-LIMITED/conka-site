"use client";

/**
 * Build Your Order — plan selector (lives inside the single-page Build step).
 *
 * A direct port of the PDP buy panel's grammar (ProductBuyPanel.FlatPlanCard +
 * SubscriptionSummary), per the SCRUM-1249 review:
 *  - Two subscription cards, ONE line collapsed: radio + shot count + "% off"
 *    pill + struck anchor + price. The SELECTED card expands to the light 2x2
 *    detail and the gradient free-shots footer. No chevrons, no toggles:
 *    selection IS expansion.
 *  - One-time purchase is a text link under the cards, not a third card.
 *  - The fuller "what you get" list lives in the "Your subscription" box
 *    below, rewriting itself with the selection, so the cards stay lean.
 *  - No per-card CTA. The sticky footer is the single forward action.
 */

import {
  type ByoCadence,
  type ByoProduct,
  getChargedPrice,
  getOfferPricing,
  getDisplayDiscount,
} from "@/app/lib/byoData";
import { formatPrice } from "@/app/lib/productData";
import { cadenceDeliveryPeriod } from "../defaults";

interface CadenceSelectorProps {
  cadence: ByoCadence;
  product: ByoProduct;
  onChange: (cadence: ByoCadence) => void;
}

const GREEN = "#14532d";
const OFFER_GRADIENT = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

/** Per-plan discount-badge colour, mirroring the PDP buy panel. */
const SAVE_COLOR: Record<"monthly-sub" | "quarterly-sub", string> = {
  "monthly-sub": "#C9A24A",
  "quarterly-sub": "#E07A5F",
};

const GreenCheck = () => (
  <span className="flex h-3 w-3 items-center justify-center rounded-full shrink-0" style={{ background: "#1a7f4f" }}>
    <svg width="7" height="7" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8.5L6.5 12L13 4.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

function PlanCard({
  product,
  planCadence,
  isSelected,
  onSelect,
}: {
  product: ByoProduct;
  planCadence: "monthly-sub" | "quarterly-sub";
  isSelected: boolean;
  onSelect: () => void;
}) {
  const pricing = getOfferPricing(product, planCadence);
  const savePct = getDisplayDiscount(pricing);
  const freeShots = pricing.freeShots ?? 0;
  const cadenceWord = planCadence === "quarterly-sub" ? "every 3 months" : "monthly";

  // Crossed-out anchor, exactly as the PDP buy panel derives it: monthly
  // anchors to the REAL all-in one-time price for the same shots; quarterly
  // has no one-time equivalent, so it derives a reference from the published
  // discount so the strike and the badge agree.
  const otpCharged = getChargedPrice(getOfferPricing(product, "monthly-otp"));
  const compareAtDisplay =
    planCadence === "monthly-sub"
      ? otpCharged
      : savePct > 0
        ? pricing.price / (1 - savePct / 100)
        : undefined;

  return (
    <div
      className={`relative w-full select-none rounded-md transition-colors duration-200 ${
        isSelected ? "" : "border-2 border-transparent bg-[#f1f1f3] hover:bg-[#e9e9ee]"
      }`}
      // Selected state uses the brand offer gradient as a 2px ring
      // (padding-box keeps the fill, border-box paints the gradient edge).
      style={
        isSelected
          ? {
              border: "2px solid transparent",
              background: `linear-gradient(#f8f9fd,#f8f9fd) padding-box, ${OFFER_GRADIENT} border-box`,
            }
          : undefined
      }
    >
      {planCadence === "monthly-sub" && (
        <span
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
          style={{ background: OFFER_GRADIENT, color: GREEN }}
        >
          Most popular
        </span>
      )}

      {/* Full-card select target sitting behind the (pointer-events-none) content. */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Select ${pricing.shotCount} shots ${cadenceWord}`}
        className="absolute inset-0 z-0 rounded-md"
      />

      <div className="pointer-events-none relative z-10 px-3 py-3.5 sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isSelected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/30 bg-white"
              }`}
              aria-hidden
            >
              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className="whitespace-nowrap text-[15px] font-bold leading-tight text-black">
              {pricing.shotCount} shots
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1.5">
            {savePct > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                style={{ backgroundColor: SAVE_COLOR[planCadence] }}
              >
                {savePct}% off
              </span>
            )}
            <span className="flex items-baseline gap-1 leading-none">
              {compareAtDisplay && (
                <s className="text-[11px] font-bold text-black/40 tabular-nums">
                  {formatPrice(compareAtDisplay)}
                </s>
              )}
              <span className="text-base font-bold tabular-nums text-black">
                {formatPrice(pricing.price)}
              </span>
            </span>
          </span>
        </div>

        {/* Selected-only 2x2 detail (Magic Mind pattern). */}
        {isSelected && (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-black/10 pt-3 text-[11px] leading-tight text-black">
            <span>100-day guarantee</span>
            <span className="text-right tabular-nums">{formatPrice(pricing.perShot)} per shot</span>
            <span>Delivered {cadenceWord}</span>
            <span className="text-right">Free UK shipping</span>
          </div>
        )}
      </div>

      {/* Full-width gradient footer on the selected card reinforcing the
          free-shots incentive. */}
      {isSelected && freeShots > 0 && (
        <div
          className="rounded-b-md px-3 py-2 text-center text-[12px] font-bold sm:px-4"
          style={{ background: OFFER_GRADIENT, color: GREEN }}
        >
          +{freeShots} free shots on your first order
        </div>
      )}
    </div>
  );
}

/**
 * The dynamic "Your subscription" box (PDP SubscriptionSummary pattern). It
 * restates exactly what the selected plan delivers and rewrites itself when
 * the plan changes; every figure derives from the same pricing the cards read.
 */
function PlanSummary({ product, cadence }: { product: ByoProduct; cadence: ByoCadence }) {
  const pricing = getOfferPricing(product, cadence);
  const isOtp = cadence === "monthly-otp";
  const savePct = getDisplayDiscount(pricing);
  const freeShots = pricing.freeShots ?? 0;
  const period = cadenceDeliveryPeriod(cadence);
  const subRef = getOfferPricing(product, "monthly-sub");

  const lines: React.ReactNode[] = isOtp
    ? [
        <>{pricing.shotCount} shots, delivered once</>,
        <>
          Billed today:{" "}
          <strong className="font-semibold tabular-nums">{formatPrice(getChargedPrice(pricing))}</strong>{" "}
          including postage
        </>,
        <>100-day money-back guarantee</>,
        <>
          Subscribe instead for {subRef.freeShots} free shots and free postage,
          from {formatPrice(subRef.price)}/mo
        </>,
      ]
    : [
        <>{pricing.shotCount} shots delivered {period}</>,
        <span key="free" className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{ background: "rgba(26,127,79,0.14)", color: "#1a7f4f" }}
          >
            <GreenCheck />
            +{freeShots} free shots
          </span>
          on your first order
        </span>,
        ...(savePct > 0 ? [<>Save {savePct}% vs buying once</>] : []),
        <>Free UK shipping</>,
        <>
          100-day money-back guarantee
          <span className="block">(less than 1.2% of people actually use it)</span>
        </>,
        <>Full app access + personal brain coach</>,
        <>Pause, skip, or cancel anytime</>,
      ];

  return (
    <div className="rounded-md ring-1 ring-black/10 bg-white p-4">
      <p className="text-[16px] font-semibold text-black mb-3">
        {isOtp ? "Your one-time order" : "Your subscription"}
      </p>
      <ul className="flex flex-col gap-2">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] text-black/80 leading-snug">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#1a7f4f" }} aria-hidden />
            <span className="min-w-0">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CadenceSelector({ cadence, product, onChange }: CadenceSelectorProps) {
  const otpCharged = getChargedPrice(getOfferPricing(product, "monthly-otp"));
  const isOtp = cadence === "monthly-otp";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 pt-2">
        <PlanCard
          product={product}
          planCadence="monthly-sub"
          isSelected={cadence === "monthly-sub"}
          onSelect={() => onChange("monthly-sub")}
        />
        <PlanCard
          product={product}
          planCadence="quarterly-sub"
          isSelected={cadence === "quarterly-sub"}
          onSelect={() => onChange("quarterly-sub")}
        />
      </div>

      {/* One-time purchase as a text link, the PDP pattern: present, honest
          (the all-in charged price), and deliberately not a third card. */}
      <button
        type="button"
        onClick={() => onChange("monthly-otp")}
        aria-pressed={isOtp}
        className={`mx-auto block w-fit text-center text-sm underline underline-offset-4 transition-opacity hover:opacity-70 ${
          isOtp ? "font-bold text-black" : "font-medium text-black"
        }`}
      >
        {isOtp ? "Buying once for " : "Buy it once for "}
        <span className="tabular-nums">{formatPrice(otpCharged)}</span>
      </button>

      <PlanSummary product={product} cadence={cadence} />
    </div>
  );
}
