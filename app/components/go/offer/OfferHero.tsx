import Image from "next/image";
import type { OfferConfig } from "@/app/lib/landings/offer-types";
import { MM_GALLERY_ASSETS } from "@/app/lib/mmPdpData";
import ProductImageSlideshow from "@/app/components/product/ProductImageSlideshow";
import { TrustStrip } from "@/app/components/product/ProductBuyPanel";
import TrustMicroRow from "@/app/components/landing/TrustMicroRow";
import IngredientDisclosureRows from "@/app/components/product/IngredientDisclosureRows";
import Certifications from "@/app/components/Certifications";
import OfferBuyBox from "./OfferBuyBox";

/**
 * OfferHero: the offer page hero (SCRUM-1343). ProductHeroV3's two-column frame
 * and gallery, with a Cloud-style identity block and OfferBuyBox in place of
 * ProductBuyPanel. The PDP heroes are untouched.
 *
 * Mobile order follows usecloud.co: gallery, title, avatar trust row, one short
 * review, then the buy box. There is no product description or benefit grid:
 * on an impulse-priced page the proof does that job faster.
 *
 * One responsive tree rather than the PDP's mobile/desktop pair, so it stays a
 * Server Component with no useIsMobile swap. From `lg` it becomes V3's two
 * columns: a sticky gallery on the left, the identity block and buy box on the
 * right, placed with explicit grid rows.
 *
 * Gallery: `galleryLead` in the slot the PDP gives the starter-pack render,
 * then the PDP's slides.
 */
export default function OfferHero({ config }: { config: OfferConfig }) {
  const { formulaId, review } = config;
  // The PDP's guarantee slide bakes in the site-wide 100 days; this page states
  // its own `guaranteeDays`, so that slide is left out.
  const slides = MM_GALLERY_ASSETS[formulaId].filter(
    (src) => !src.includes("Guarantee"),
  );
  const images = [config.galleryLead, ...slides].map((src) => ({ src }));

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      <div className="grid grid-cols-1 gap-6 text-black lg:grid-cols-[minmax(0,760px)_minmax(0,400px)] lg:items-start lg:justify-center lg:gap-x-12">
        <div className="lg:sticky lg:top-24 lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:self-start">
          <ProductImageSlideshow
            images={images}
            alt={config.title}
            noFrame
            smallThumbnails
            aspectRatio="landscape"
            hideArrows
          />
        </div>

        <div className="flex flex-col gap-3 lg:col-start-2 lg:row-start-1">
          <h1
            className="brand-h1 !mb-0 !leading-none lg:!text-[3.25rem]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {config.title}
          </h1>
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

        <div className="lg:col-start-2 lg:row-start-2">
          <OfferBuyBox config={config} />
        </div>

        <div className="lg:col-start-2 lg:row-start-3">
          <IngredientDisclosureRows formulaId={formulaId} />
        </div>

        <div className="lg:col-start-2 lg:row-start-4">
          <Certifications inline />
        </div>
      </div>

      <TrustStrip guaranteeDays={config.guaranteeDays} />
    </div>
  );
}
