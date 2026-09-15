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
 * Top to bottom: a row of three square trial-pack tiles (bottle image, name and
 * price only; the selected tile carries a navy ring), the checkout CTA, the
 * conversion disclosure, and the buy-once link. Tiles are kept deliberately
 * quiet: the CTA carries the price, the disclosure carries the terms.
 *
 * The disclosure is the single statement of the terms (shots today, when the
 * monthly plan starts, what it costs, cancel before): the page sells a trial
 * into a subscription and must say so next to the button. The Both gallery's
 * how-it-works slide shows the same journey visually.
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

      <div className="mt-4">
        <OfferCtaButton section="hero" isTile>
          Checkout - {formatPrice(selected.price)}
        </OfferCtaButton>
        <OfferCheckoutError />
      </div>
      <p className="mt-2 text-center text-xs leading-snug text-black/60">
        {selected.shots} shots today. Monthly {formatPrice(selected.monthly.price)} from day{" "}
        {conversionDays}, cancel anytime before.
      </p>

      <OfferOtpLink />
    </div>
  );
}

/**
 * One square trial-pack tile: the bottle render on white, cropped to the upper
 * part of the bottles, over a base with name and trial price. The image box is 160% of the tile's height and anchored top; going nearer a true
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

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`${option.label} trial pack, ${option.shots} shots, ${formatPrice(option.price)}`}
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

      <span className="flex flex-col items-center gap-0.5 rounded-b-md border-t border-black/5 px-1 py-2 text-center">
        <span className="text-[13px] font-bold leading-tight">{option.label}</span>
        <span className="text-[13px] tabular-nums text-black/70">{formatPrice(option.price)}</span>
      </span>
    </button>
  );
}
