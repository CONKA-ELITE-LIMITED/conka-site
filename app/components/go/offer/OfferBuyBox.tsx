"use client";

import Image from "next/image";
import { formatPrice } from "@/app/lib/productData";
import { bottleRendersCutout } from "@/app/lib/productImages";
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
 * Top to bottom: a row of three square trial-pack tiles (bottle image, then a
 * name / price / shots base that turns navy when selected), a "What you get"
 * panel for the selected pack, the checkout CTA, the conversion disclosure, and
 * the buy-once link. Tiles are more visual and take less height than stacked
 * plan cards; the panel carries what an expanded card would have said.
 *
 * Every trial price is struck against its reference price: the same shots at
 * the regular one-time per-shot price. The disclosure states the price today,
 * when the monthly plan starts and what it costs: the page sells a trial into a
 * subscription and must say so next to the button.
 */

/** The offer gradient shared with FlatPlanCard, CartUpsellTile and GiftValueStack. */
const OFFER_GRADIENT = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

export default function OfferBuyBox({ conversionDays }: { conversionDays: number }) {
  const { options, selected, select } = useOfferPurchase();

  return (
    <div>
      <p id="offer-trial-pack-label" className="mb-3 text-lg font-bold text-black">
        Choose your trial pack:
      </p>
      {/* Groups the toggles under the visible heading, so a screen reader hears
          what the three pressed/unpressed buttons are choosing between. pt-2
          leaves room for the badge straddling a tile's top edge. */}
      <div
        role="group"
        aria-labelledby="offer-trial-pack-label"
        className="grid grid-cols-3 gap-2.5 pt-2"
      >
        {options.map((option) => (
          <PackTile
            key={option.id}
            option={option}
            isSelected={option.id === selected.id}
            onSelect={() => select(option.id)}
          />
        ))}
      </div>

      <WhatYouGet option={selected} conversionDays={conversionDays} />

      <div className="mt-4">
        <OfferCtaButton section="hero" isTile>
          Checkout - {formatPrice(selected.price)}
        </OfferCtaButton>
        <OfferCheckoutError />
      </div>
      <p className="mt-2 text-center text-xs leading-snug text-black/60">
        {formatPrice(selected.price)} today for your {selected.shots}-shot trial pack. Your{" "}
        {selected.label} monthly plan ({formatPrice(selected.monthly.price)}/month, starter pack in
        your first box) starts {conversionDays} days after your order. Cancel anytime before.
      </p>

      <OfferOtpLink />
    </div>
  );
}

/**
 * One square trial-pack tile: the bottle render on white, cropped to the upper
 * part of the bottles, over a base with name, struck reference price, trial
 * price and shots. The selected tile's base fills navy with white text. The
 * image box is 160% of the tile's height and anchored top; going nearer a true
 * half crop clips the outer bottles on the wider Both render.
 */
function PackTile({
  option,
  isSelected,
  onSelect,
}: {
  option: OfferOptionView;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const render = bottleRendersCutout[option.product];
  const discounted = option.referencePrice > option.price;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`${option.label} trial pack, ${option.shots} shots, ${formatPrice(option.price)}${
        discounted ? ` instead of ${formatPrice(option.referencePrice)}` : ""
      }`}
      onClick={onSelect}
      className={`relative flex flex-col rounded-md bg-white text-black transition-shadow focus:outline-none focus-visible:ring-offset-2 ${
        isSelected
          ? "ring-2 ring-[var(--brand-navy)]"
          : "ring-1 ring-black/10 hover:ring-black/30"
      }`}
    >
      {option.badge && (
        <span
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#14532d]"
          style={{ background: OFFER_GRADIENT }}
        >
          {option.badge}
        </span>
      )}

      <span className="relative block aspect-square w-full overflow-hidden rounded-t-md bg-white">
        <span className="absolute inset-x-0 top-0 h-[160%]">
          <Image
            src={render.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 130px, 30vw"
            className="object-cover object-top"
          />
        </span>
      </span>

      <span
        className={`flex flex-col items-center gap-0.5 rounded-b-md px-1 py-2 text-center transition-colors ${
          isSelected ? "bg-[var(--brand-navy)] text-white" : "border-t border-black/5"
        }`}
      >
        <span className="text-[13px] font-bold leading-tight">{option.label}</span>
        <span className="flex flex-wrap items-baseline justify-center gap-x-1">
          {discounted && (
            <s className={`text-[11px] tabular-nums ${isSelected ? "text-white/60" : "text-black/40"}`}>
              {formatPrice(option.referencePrice)}
            </s>
          )}
          <span className="text-[13px] font-semibold tabular-nums">{formatPrice(option.price)}</span>
        </span>
        <span className={`text-[11px] ${isSelected ? "text-white/75" : "text-black/55"}`}>
          {option.shots} shots
        </span>
      </span>
    </button>
  );
}

/** What the selected pack includes, in the offer's gradient ring. */
function WhatYouGet({
  option,
  conversionDays,
}: {
  option: OfferOptionView;
  conversionDays: number;
}) {
  const priceLine =
    option.referencePrice > option.price
      ? `${option.shots} shots to try for ${formatPrice(option.price)}, instead of ${formatPrice(option.referencePrice)}`
      : `${option.shots} shots to try for ${formatPrice(option.price)}`;
  const items = [
    priceLine,
    `Your monthly plan starts ${conversionDays} days after your order`,
    `Then ${option.monthly.shots} shots a month for ${formatPrice(option.monthly.price)}`,
    "Free starter pack with your first monthly box",
    "Cancel anytime",
  ];

  return (
    <div
      className="mt-4 rounded-md p-4 text-black"
      style={{
        border: "2px solid transparent",
        background: `linear-gradient(#f8f9fd,#f8f9fd) padding-box, ${OFFER_GRADIENT} border-box`,
      }}
    >
      <p className="text-sm font-bold">What you get with {option.label}</p>
      <ul className="mt-2 space-y-1.5 text-[13px] leading-snug">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-[1px] shrink-0">
              <circle cx="12" cy="12" r="10" fill="var(--brand-positive)" />
              <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
