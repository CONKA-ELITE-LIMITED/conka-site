import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import MetaViewContent from "@/app/components/MetaViewContent";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
import { ClinicalIngredients } from "@/app/components/product";
import WhatToExpectV2 from "@/app/components/home/WhatToExpectV2";
import ProductComparisonTable from "@/app/components/product/ProductComparisonTable";
import LabFAQ from "@/app/components/landing/LabFAQ";
import {
  SectionImpressions,
  TrackedSection,
} from "@/app/components/go/listicle/listicleAnalytics";
import { getFormulaPdpFaqItems } from "@/app/lib/formulaFaq";
import { getHeroProductType } from "@/app/lib/productHeroHelpers";
import {
  getOfferPricing,
  getOfferVariant,
  type OfferProduct,
} from "@/app/lib/offerData";
import { getCadenceGiftSummary } from "@/app/lib/cadenceData";
import type { OfferConfig } from "@/app/lib/landings/offer-types";
import OfferHero from "./OfferHero";
import { OfferPurchaseProvider, OfferStickyBar } from "./OfferPurchase";
import type { OfferUpsellData } from "./OfferUpsellModal";

/**
 * /go offer format (SCRUM-1343): a single-offer page for paid traffic that
 * reuses the PDP. Nav, OfferHero (ProductHeroV3's parts with OfferBuyBox), then
 * the PDP's UGC marquee, ingredients, what to expect, comparison table and FAQ,
 * footer and a sticky CTA.
 *
 * Wrapped in the same `brand-clinical` root as the PDPs so the reused parts
 * render exactly as they do there. Server-rendered; only the CTAs, sticky bar
 * and upsell modal are client islands (OfferPurchase). Views and CTA clicks
 * report through the listicle stream, keyed by slug.
 */

/**
 * The upsell is always the product's monthly starter pack, shown in the modal
 * as a comparison with the 4 box plus the first-box gifts. Gifts and their
 * value come from getCadenceGiftSummary, the same helper as the PDP gift stack.
 * Throws at build time rather than shipping a modal that cannot check out.
 */
function buildUpsell(product: OfferProduct): OfferUpsellData {
  const pricing = getOfferPricing(product, "monthly-sub");
  const variant = getOfferVariant(product, "monthly-sub");
  if (!variant?.sellingPlanId) {
    throw new Error(`Offer page: no monthly subscription variant for "${product}"`);
  }
  const { tiles, total } = getCadenceGiftSummary(pricing);

  return {
    variantId: variant.variantId,
    sellingPlanId: variant.sellingPlanId,
    price: pricing.price,
    perShot: pricing.perShot,
    subsequentShots: pricing.subsequentShots ?? pricing.shotCount,
    gifts: tiles.map(({ id, label, image, imageFit }) => ({ id, label, image, imageFit })),
    // Rounded to the penny: float sums of RRPs carry noise.
    giftValue: Math.round(total * 100) / 100,
  };
}

export default function OfferRenderer({ config }: { config: OfferConfig }) {
  const product = getHeroProductType(config.formulaId);
  const upsell = buildUpsell(product);

  return (
    <SectionImpressions slug={config.slug}>
      <OfferPurchaseProvider
        slug={config.slug}
        product={product}
        productName={config.productName}
        offerId={config.offerId}
        box={config.box}
        upsell={upsell}
      >
        {/* Mid-funnel signal for paid traffic, as on the landers and BYO. */}
        <MetaViewContent
          variantIds={[config.box.variantId]}
          value={config.box.price}
          contentName={config.title}
        />

        <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
          <Navigation />

          {/* Padding mirrors the PDP hero (mobile !pt-6, desktop 6vw gutter and
              the wider 1480px track). */}
          <TrackedSection section="hero">
            <section
              aria-label="4 box offer"
              className="brand-section brand-hero-first brand-bg-white !pt-6 brand-tight-bottom-mobile lg:!px-[6vw]"
            >
              <div className="brand-track !max-w-[1480px]">
                <OfferHero config={config} />
              </div>
            </section>
          </TrackedSection>

          <TrackedSection section="ugc">
            <section
              aria-label="Real people using CONKA"
              className="brand-section brand-bg-white !px-0 brand-tight-top-mobile brand-tight-bottom-mobile"
            >
              <UGCMarquee />
            </section>
          </TrackedSection>

          {/* What's in it, then what you'll feel and when: the two questions a
              cold visitor still has after the hero. Same components, order and
              backgrounds as the PDP. */}
          <TrackedSection section="ingredients">
            <section
              aria-label="Formula ingredients"
              className="brand-section brand-bg-white brand-tight-top-mobile"
            >
              <div className="brand-track">
                <ClinicalIngredients formulaIds={[config.formulaId]} />
              </div>
            </section>
          </TrackedSection>

          <TrackedSection section="what_to_expect">
            <section aria-label="What to expect" className="brand-section brand-bg-tint">
              <div className="brand-track">
                <WhatToExpectV2 productId={config.formulaId} />
              </div>
            </section>
          </TrackedSection>

          <TrackedSection section="comparison">
            <section
              aria-label="CONKA compared with coffee and prescription stimulants"
              className="brand-section brand-bg-white"
            >
              <div className="brand-track">
                <ProductComparisonTable
                  product={product}
                  guaranteeDays={config.guaranteeDays}
                />
              </div>
            </section>
          </TrackedSection>

          <TrackedSection section="faq">
            <section aria-label="FAQ" className="brand-section brand-bg-tint">
              <div className="brand-track">
                <LabFAQ
                  items={getFormulaPdpFaqItems(config.formulaId)}
                  hideCTA
                  showSeeAllLink={false}
                />
              </div>
            </section>
          </TrackedSection>

          {/* Clears the fixed sticky bar so it never covers the footer's last row. */}
          <div aria-hidden className="h-20" />
          <Footer />
        </div>

        <OfferStickyBar label={config.sticky.label} cta={config.sticky.cta} />
      </OfferPurchaseProvider>
    </SectionImpressions>
  );
}
