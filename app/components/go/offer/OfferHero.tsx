import type { OfferConfig } from "@/app/lib/landings/offer-types";
import { formatPrice } from "@/app/lib/productData";
import { TrustStrip } from "@/app/components/product/ProductBuyPanel";
import TrustMicroRow from "@/app/components/landing/TrustMicroRow";
import Certifications from "@/app/components/Certifications";
import OfferBuyBox from "./OfferBuyBox";
import OfferReviewRotator from "./OfferReviewRotator";
import { OfferDisclosureRows, OfferGallery } from "./OfferPurchase";

/**
 * OfferHero: the offer page hero (SCRUM-1343). ProductHeroV3's two-column frame
 * with a Cloud-style identity block and OfferBuyBox in place of ProductBuyPanel.
 * The PDP heroes are untouched.
 *
 * The frame is server-rendered; the gallery, reviews, buy box and disclosure
 * rows are client islands (the selection-driven ones read OfferPurchase).
 *
 * Mobile order: offer pill and title, gallery, avatar trust row,
 * rotating review, then the buy box. From `lg` it becomes V3's two columns: a
 * sticky gallery on the left, the rest on the right, placed with explicit rows.
 */

/** The offer gradient shared with the plan tiles, CartUpsellTile and GiftValueStack. */
const OFFER_GRADIENT = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

export default function OfferHero({ config }: { config: OfferConfig }) {
  const fromPrice = Math.min(...config.options.map((o) => o.price));

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      <div className="grid grid-cols-1 gap-6 text-black lg:grid-cols-[minmax(0,760px)_minmax(0,400px)] lg:items-start lg:justify-center lg:gap-x-12">
        {/* Named first on mobile, so the offer is clear before the gallery. */}
        <div className="flex flex-col gap-2 lg:col-start-2 lg:row-start-1">
          <span
            className="self-start rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#14532d]"
            style={{ background: OFFER_GRADIENT }}
          >
            Limited-time trial offer
          </span>
          <h1
            className="brand-h1 !mb-0 !leading-none lg:!text-[3.25rem]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Try CONKA from {formatPrice(fromPrice)}
          </h1>
        </div>

        <div className="lg:sticky lg:top-24 lg:col-start-1 lg:row-span-5 lg:row-start-1 lg:self-start">
          <OfferGallery alt="CONKA trial pack" />
        </div>

        {/* lg:-mt-3 pulls this up under the heading block on desktop, where the
            grid's gap-6 would otherwise push the trust row away from it. */}
        <div className="flex flex-col gap-3 lg:col-start-2 lg:row-start-2 lg:-mt-3">
          {/* The product name, under the gallery on mobile; the headline sells the price. */}
          <p className="text-xl font-bold leading-tight text-black">{config.title}</p>
          <TrustMicroRow />
          <OfferReviewRotator reviews={config.reviews} />
        </div>

        <div className="lg:col-start-2 lg:row-start-3">
          <OfferBuyBox conversionDays={config.conversionDays} />
        </div>

        <div className="lg:col-start-2 lg:row-start-4">
          <OfferDisclosureRows />
        </div>

        <div className="lg:col-start-2 lg:row-start-5">
          <Certifications inline />
        </div>
      </div>

      <TrustStrip />
    </div>
  );
}
