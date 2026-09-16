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
 * Top to bottom: the heading and a line restating the selection with its
 * saving, a row of three square trial-pack tiles (bottle image, name, struck
 * one-time price and trial price; the selected tile carries a navy ring), the
 * "Start trial for £X" CTA, the conversion disclosure, and the buy-once link.
 * The CTA carries the price, the disclosure carries the terms. The struck price
 * stays on the tile, not the button: the saving is already stated above.
 *
 * The disclosure is the single statement of the terms (shots today, when the
 * monthly plan starts, what it costs, starter pack, cancel before): the page sells a trial
 * into a subscription and must say so next to the button. The Both gallery's
 * how-it-works slide shows the same journey visually.
 */

/** The offer gradient shared with FlatPlanCard, CartUpsellTile and GiftValueStack. */
const OFFER_GRADIENT = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

export default function OfferBuyBox({ conversionDays }: { conversionDays: number }) {
  const { options, selected, select } = useOfferPurchase();
  const saving = selected.referencePrice - selected.price;

  return (
    <div>
      <p id="offer-trial-pack-label" className="text-lg font-bold text-black">
        Choose your trial pack:
      </p>
      {/* Restates the selection in words with its saving. The two-line min
          height keeps the tiles from jumping when a shorter summary is picked. */}
      <p className="mb-2 mt-1 min-h-[2.75em] text-sm leading-snug text-black/70">
        <span className="font-semibold text-black">{selected.label}:</span>{" "}
        {selected.summary}
        {saving > 0 && (
          <>
            {" "}
            <span className="whitespace-nowrap font-semibold tabular-nums text-[var(--brand-positive)]">
              Save {formatPrice(saving)}
            </span>
          </>
        )}
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
          Start trial for {formatPrice(selected.price)}
        </OfferCtaButton>
        <OfferCheckoutError />
      </div>
      <p className="mt-2 text-center text-xs leading-snug text-black/60">
        {selected.shots} shots today. Monthly {formatPrice(selected.monthly.price)} from day{" "}
        {conversionDays}, starter pack in your first box. Cancel anytime before.
      </p>

      <OfferOtpLink />
    </div>
  );
}

/**
 * One square trial-pack tile: the bottle render on white, cropped to the upper
 * part of the bottles, over a base with name and trial price. The image box is
 * 160% of the tile's height and anchored top; going nearer a true half crop
 * clips the outer bottles on the wider Both render.
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
      aria-label={`${option.label} trial pack, ${option.shots} shots, ${formatPrice(option.price)}, was ${formatPrice(option.referencePrice)}`}
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
        {/* The pack's own one-time price, struck, so the discount the hero seal
            claims is visible where the choice is made. */}
        <span className="flex flex-wrap items-baseline justify-center gap-x-1 tabular-nums">
          <s className="text-[11px] text-black/40">{formatPrice(option.referencePrice)}</s>
          <span className="text-[13px] text-black/70">{formatPrice(option.price)}</span>
        </span>
      </span>
    </button>
  );
}
