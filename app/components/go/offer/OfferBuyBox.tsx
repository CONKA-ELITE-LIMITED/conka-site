"use client";

import { formatPrice } from "@/app/lib/productData";
import type { OfferOptionView } from "@/app/lib/landings/offer-types";
import {
  OfferCheckoutError,
  OfferCtaButton,
  OfferOtpLink,
  useOfferPurchase,
} from "./OfferPurchase";

/**
 * OfferBuyBox: the offer page's purchase section, sitting where ProductBuyPanel
 * sits in the PDP hero (SCRUM-1343).
 *
 * Top to bottom: the trial-pack cards (a radio group styled as the PDP's
 * FlatPlanCard), the checkout CTA, the conversion disclosure, and the buy-once
 * link. The disclosure states the price today, what it covers, when the monthly
 * plan starts and what it costs: the page sells a trial into a subscription and
 * must say so next to the button.
 */

/** The offer gradient shared with FlatPlanCard, CartUpsellTile and GiftValueStack. */
const OFFER_GRADIENT = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

export default function OfferBuyBox({
  trialDays,
  conversionDays,
}: {
  trialDays: number;
  conversionDays: number;
}) {
  const { options, selected, select } = useOfferPurchase();

  return (
    <div>
      <p id="offer-trial-pack-label" className="mb-3 text-lg font-bold text-black">
        Choose your trial pack:
      </p>
      {/* Groups the toggles under the visible heading, so a screen reader hears
          what the three pressed/unpressed buttons are choosing between. */}
      <div
        role="group"
        aria-labelledby="offer-trial-pack-label"
        className="flex flex-col gap-4 pt-2"
      >
        {options.map((option) => (
          <PlanCard
            key={option.id}
            option={option}
            isSelected={option.id === selected.id}
            onSelect={() => select(option.id)}
            trialDays={trialDays}
          />
        ))}
      </div>

      <div className="mt-4">
        <OfferCtaButton section="hero" isTile>
          Checkout - {formatPrice(selected.price)}
        </OfferCtaButton>
        <OfferCheckoutError />
      </div>
      <p className="mt-2 text-center text-xs leading-snug text-black/60">
        {formatPrice(selected.price)} today for {trialDays} days of CONKA. Your {selected.label}{" "}
        monthly plan ({formatPrice(selected.monthly.price)}/month, starter pack in your first box)
        starts {conversionDays} days after your order. Cancel anytime before.
      </p>

      <OfferOtpLink />
    </div>
  );
}

/**
 * One trial-pack card. Unselected cards are a single clean row; the selected
 * card gets the offer gradient ring, a 2x2 detail grid and the starter-pack
 * strip, as the PDP's FlatPlanCard does. The full-card radio button sits behind
 * the pointer-events-none content.
 */
function PlanCard({
  option,
  isSelected,
  onSelect,
  trialDays,
}: {
  option: OfferOptionView;
  isSelected: boolean;
  onSelect: () => void;
  trialDays: number;
}) {
  return (
    <div
      className={`relative w-full select-none rounded-md transition-colors duration-200 ${
        isSelected ? "" : "border-2 border-transparent bg-[#f1f1f3] hover:bg-[#e9e9ee]"
      }`}
      style={
        isSelected
          ? {
              border: "2px solid transparent",
              background: `linear-gradient(#f8f9fd,#f8f9fd) padding-box, ${OFFER_GRADIENT} border-box`,
            }
          : undefined
      }
    >
      {option.badge && (
        <span
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#14532d]"
          style={{ background: OFFER_GRADIENT }}
        >
          {option.badge}
        </span>
      )}

      {/* A pressed toggle rather than role="radio": the radio role promises
          arrow-key navigation that these buttons do not implement. */}
      <button
        type="button"
        aria-pressed={isSelected}
        aria-label={`${option.label} trial pack, ${option.shots} shots, ${formatPrice(option.price)}`}
        onClick={onSelect}
        className="absolute inset-0 z-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)]"
      />

      <div className="pointer-events-none relative z-10 px-3 py-3 sm:px-4">
        <div className="flex min-h-[24px] items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isSelected
                  ? "border-[var(--brand-navy)] bg-[var(--brand-navy)]"
                  : "border-black/30 bg-white"
              }`}
              aria-hidden
            >
              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className="whitespace-nowrap text-sm font-bold leading-tight text-black">
              {option.label}
            </span>
            <span className="whitespace-nowrap text-xs text-black/55">{option.shots} shots</span>
          </span>
          <span className="text-base font-bold tabular-nums text-black">
            {formatPrice(option.price)}
          </span>
        </div>

        {isSelected && (
          <>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-black/10 pt-3 text-[11px] leading-tight text-black">
              <span>{trialDays} days of CONKA</span>
              <span className="text-right">Cancel anytime</span>
              <span>Then {formatPrice(option.monthly.price)}/month</span>
              <span className="text-right">{option.monthly.shots} shots a month</span>
            </div>
            <div
              className="-mx-3 -mb-3 mt-3 rounded-b-md px-3 py-2 text-center text-[12px] font-bold text-[#14532d] sm:-mx-4 sm:px-4"
              style={{ background: OFFER_GRADIENT }}
            >
              Free starter pack with your first monthly box
            </div>
          </>
        )}
      </div>
    </div>
  );
}
