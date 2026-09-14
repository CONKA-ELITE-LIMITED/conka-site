import Image from "next/image";
import type { OfferConfig } from "@/app/lib/landings/offer-types";
import { TrustStrip } from "@/app/components/product/ProductBuyPanel";
import TrustMicroRow from "@/app/components/landing/TrustMicroRow";
import Certifications from "@/app/components/Certifications";
import OfferBuyBox from "./OfferBuyBox";
import { OfferDisclosureRows, OfferGallery } from "./OfferPurchase";

/**
 * OfferHero: the offer page hero (SCRUM-1343). ProductHeroV3's two-column frame
 * with a Cloud-style identity block and OfferBuyBox in place of ProductBuyPanel.
 * The PDP heroes are untouched.
 *
 * The frame is server-rendered; the gallery, buy box and disclosure rows are
 * client islands that follow the selected trial pack (OfferPurchase).
 *
 * Mobile order: title, gallery, avatar trust row, one short review, then the
 * buy box (usecloud.co's pattern, with the product named before the gallery).
 * From `lg` it becomes V3's two columns: a sticky gallery on the left, the rest
 * on the right, placed with explicit grid rows.
 */
export default function OfferHero({ config }: { config: OfferConfig }) {
  const { review } = config;

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      <div className="grid grid-cols-1 gap-6 text-black lg:grid-cols-[minmax(0,760px)_minmax(0,400px)] lg:items-start lg:justify-center lg:gap-x-12">
        {/* Title first on mobile, so the product is named before the gallery. */}
        <h1
          className="brand-h1 !mb-0 !leading-none lg:col-start-2 lg:row-start-1 lg:!text-[3.25rem]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {config.title}
        </h1>

        <div className="lg:sticky lg:top-24 lg:col-start-1 lg:row-span-5 lg:row-start-1 lg:self-start">
          <OfferGallery alt={config.title} />
        </div>

        {/* lg:-mt-3 pulls this up under the title on desktop, where the grid's
            gap-6 would otherwise push the trust row away from its heading. */}
        <div className="flex flex-col gap-3 lg:col-start-2 lg:row-start-2 lg:-mt-3">
          <TrustMicroRow />
          <figure className="brand-bg-tint rounded-md p-4 text-black">
            <blockquote className="text-[15px] leading-snug">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-2 text-sm font-bold">
              <Image
                src={review.avatar}
                alt=""
                width={64}
                height={64}
                className="h-7 w-7 rounded-full object-cover"
                sizes="28px"
              />
              {review.name}
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-start-2 lg:row-start-3">
          <OfferBuyBox trialDays={config.trialDays} conversionDays={config.conversionDays} />
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
