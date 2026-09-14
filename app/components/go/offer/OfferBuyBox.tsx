import { formatPrice } from "@/app/lib/productData";
import { getSavingsPercent } from "@/app/lib/offerData";
import type { OfferConfig } from "@/app/lib/landings/offer-types";
import { OfferCheckoutError, OfferCtaButton, OfferOtpLink } from "./OfferPurchase";

/**
 * OfferBuyBox: the offer page's purchase section, sitting where ProductBuyPanel
 * sits in the PDP hero (SCRUM-1343).
 *
 * Order, top to bottom: the checkout CTA, the renewal disclosure, the buy-once
 * text link, then the plan card as the detail behind the price.
 *
 * The plan card mirrors the PDP's selected FlatPlanCard (ProductBuyPanel) so
 * the offer reads with the same energy: gradient ring, centred offer badge,
 * gold discount pill, filled radio, struck price, 2x2 detail grid and a
 * gradient footer strip. It is display only: there is one plan, so the radio
 * is always filled and nothing is selectable. Deliberately absent versus the
 * PDP card: the per-bottle price (£3.75 on this plan, kept for the upsell's
 * argument) and the guarantee line.
 *
 * Content only; the CTA islands come from OfferPurchase.
 */

/** The offer gradient shared with FlatPlanCard, CartUpsellTile and GiftValueStack. */
const OFFER_GRADIENT = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

/** FlatPlanCard's monthly-plan discount pill colour. */
const DISCOUNT_GOLD = "#C9A24A";

export default function OfferBuyBox({ config }: { config: OfferConfig }) {
  const { box, tile } = config;
  const discount = getSavingsPercent(box.price, box.compareAtPrice);

  return (
    <div>
      <OfferCtaButton section="hero" isTile>
        {tile.cta}
      </OfferCtaButton>
      <OfferCheckoutError />
      <p className="mt-2 text-center text-xs text-black/60">{tile.renewal}</p>

      <OfferOtpLink price={formatPrice(box.compareAtPrice)} />

      {/* mt-6 leaves room for the badges that straddle the top edge. */}
      <div
        className="relative mt-6 w-full rounded-md text-black"
        style={{
          border: "2px solid transparent",
          background: `linear-gradient(#f8f9fd,#f8f9fd) padding-box, ${OFFER_GRADIENT} border-box`,
        }}
      >
        {tile.badge && (
          <span
            className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#14532d]"
            style={{ background: OFFER_GRADIENT }}
          >
            {tile.badge}
          </span>
        )}
        {discount > 0 && (
          <span
            className="absolute right-3 top-0 z-10 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-bold uppercase leading-none tracking-wide text-white max-[360px]:px-2 max-[360px]:text-[10px] sm:right-4"
            style={{ backgroundColor: DISCOUNT_GOLD }}
          >
            {discount}% off
          </span>
        )}

        <div className="px-3 py-3 sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span
                className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-navy)] bg-[var(--brand-navy)]"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="whitespace-nowrap text-sm font-bold leading-tight">
                {tile.name}
              </span>
            </span>
            <span className="flex items-baseline gap-1 leading-none">
              <s className="text-[11px] font-bold text-black/40">
                {formatPrice(box.compareAtPrice)}
              </s>
              <span className="text-base font-bold tabular-nums">
                {formatPrice(box.price)}
              </span>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-black/10 pt-3 text-[11px] leading-tight">
            {tile.details.map((detail, i) => (
              <span key={detail} className={i % 2 === 1 ? "text-right" : undefined}>
                {detail}
              </span>
            ))}
          </div>

          {tile.footer && (
            <div
              className="-mx-3 -mb-3 mt-3 rounded-b-md px-3 py-2 text-center text-[12px] font-bold text-[#14532d] sm:-mx-4 sm:px-4"
              style={{ background: OFFER_GRADIENT }}
            >
              {tile.footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
