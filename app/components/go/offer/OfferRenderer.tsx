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
import { BOTH_PDP_FAQ_ITEMS } from "@/app/lib/faqContent";
import { getHeroProductType } from "@/app/lib/productHeroHelpers";
import { MM_GALLERY_ASSETS } from "@/app/lib/mmPdpData";
import {
  getChargedPrice,
  getOfferPricing,
  getOfferVariant,
} from "@/app/lib/offerData";
import type {
  OfferConfig,
  OfferOption,
  OfferOptionView,
} from "@/app/lib/landings/offer-types";
import OfferCountdownBanner from "./OfferCountdownBanner";
import OfferHero from "./OfferHero";
import { OfferPurchaseProvider, OfferStickyBar } from "./OfferPurchase";

/**
 * /go offer format (SCRUM-1343): the CONKA trial pack page for paid traffic.
 * Countdown banner (no site nav), OfferHero (ProductHeroV3's parts with the
 * trial-pack selector), the UGC marquee, then the Both versions of the PDP's
 * ingredients, what to expect, comparison table and FAQ, footer and a sticky CTA.
 *
 * Below the fold always renders Both: it speaks to the default option and keeps
 * the page server-rendered with no layout shift when the selection changes.
 *
 * Wrapped in the same `brand-clinical` root as the PDPs so the reused parts
 * render exactly as they do there. Views and CTA clicks report through the
 * listicle stream, keyed by slug.
 */

/**
 * An option plus everything the client needs, derived from offerData so the
 * monthly and one-time figures match the rest of the site. Throws at build time
 * rather than shipping an option whose buy-once link cannot check out.
 */
function buildOptionView(option: OfferOption): OfferOptionView {
  const product = getHeroProductType(option.heroId);
  const monthly = getOfferPricing(product, "monthly-sub");
  const oneTimePricing = getOfferPricing(product, "monthly-otp");
  const oneTimeVariant = getOfferVariant(product, "monthly-otp");
  if (!oneTimeVariant) {
    throw new Error(`Offer page: no one-time variant for "${product}"`);
  }

  const oneTimePrice = getChargedPrice(oneTimePricing);

  const galleryImages = [
    ...(option.galleryLead ? [option.galleryLead] : []),
    ...MM_GALLERY_ASSETS[option.heroId],
  ];
  // The explainer goes 2nd, straight after the lead: how the trial works is the
  // first question the offer raises.
  if (option.explainerSlide) galleryImages.splice(1, 0, option.explainerSlide);

  return {
    ...option,
    product,
    galleryImages,
    monthly: { price: monthly.price, shots: monthly.shotCount },
    oneTime: {
      variantId: oneTimeVariant.variantId,
      price: oneTimePrice,
      shots: oneTimePricing.shotCount,
    },
  };
}

export default function OfferRenderer({ config }: { config: OfferConfig }) {
  const options = config.options.map(buildOptionView);
  // The cheapest trial price, shared by the banner and the hero headline.
  const fromPrice = Math.min(...options.map((o) => o.price));
  const offerFaqs = config.offerFaqs?.build(options, config.conversionDays);
  const defaultView = options.find((o) => o.id === config.defaultOption);
  if (!defaultView) {
    throw new Error(`Offer page: defaultOption "${config.defaultOption}" is not an option`);
  }
  return (
    <SectionImpressions slug={config.slug}>
      <OfferPurchaseProvider
        slug={config.slug}
        options={options}
        defaultOption={config.defaultOption}
      >
        {/* Mid-funnel signal for paid traffic, as on the landers and BYO. */}
        <MetaViewContent
          variantIds={options.map((o) => o.variantId)}
          value={defaultView.price}
          contentName={config.title}
        />

        <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
          {/* No site nav: a paid-traffic page with nothing to click away to.
              The countdown banner is the whole top bar (Grüns pattern). */}
          <div className="bg-[var(--brand-navy)] px-5 text-white md:px-[5vw]">
            <div className="brand-track">
              <OfferCountdownBanner fromPrice={fromPrice} />
            </div>
          </div>

          {/* Padding mirrors the PDP hero (mobile !pt-6, desktop 6vw gutter and
              the wider 1480px track). */}
          <TrackedSection section="hero">
            <section
              aria-label="Trial pack offer"
              className="brand-section brand-hero-first brand-bg-white !pt-6 brand-tight-bottom-mobile lg:!px-[6vw]"
            >
              <div className="brand-track !max-w-[1480px]">
                <OfferHero config={config} fromPrice={fromPrice} />
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

          {/* What's in it, then what you'll feel and when. Same components,
              order and backgrounds as the Both PDP. */}
          <TrackedSection section="ingredients">
            <section
              aria-label="Formula ingredients"
              className="brand-section brand-bg-white brand-tight-top-mobile"
            >
              <div className="brand-track">
                <ClinicalIngredients />
              </div>
            </section>
          </TrackedSection>

          <TrackedSection section="what_to_expect">
            <section aria-label="What to expect" className="brand-section brand-bg-tint">
              <div className="brand-track">
                <WhatToExpectV2 productId="both" />
              </div>
            </section>
          </TrackedSection>

          <TrackedSection section="comparison">
            <section
              aria-label="CONKA compared with coffee and prescription stimulants"
              className="brand-section brand-bg-white"
            >
              <div className="brand-track">
                <ProductComparisonTable product="both" />
              </div>
            </section>
          </TrackedSection>

          {/* Offer-only questions (how the trial works) get their own section,
              then the general Both FAQ. Backgrounds alternate from the white
              comparison section above. The support footer shows once, under
              the general FAQ. */}
          {offerFaqs && (
            <TrackedSection section="offer_faq">
              <section aria-label={config.offerFaqs?.title} className="brand-section brand-bg-tint">
                <div className="brand-track">
                  <LabFAQ
                    title={config.offerFaqs?.title}
                    items={offerFaqs}
                    hideCTA
                    showSupport={false}
                  />
                </div>
              </section>
            </TrackedSection>
          )}

          <TrackedSection section="faq">
            <section
              aria-label="FAQ"
              className={`brand-section ${offerFaqs ? "brand-bg-white" : "brand-bg-tint"}`}
            >
              <div className="brand-track">
                <LabFAQ items={BOTH_PDP_FAQ_ITEMS} hideCTA showSeeAllLink={false} />
              </div>
            </section>
          </TrackedSection>

          {/* Clears the fixed sticky bar so it never covers the footer's last row. */}
          <div aria-hidden className="h-20" />
          <Footer />
        </div>

        <OfferStickyBar />
      </OfferPurchaseProvider>
    </SectionImpressions>
  );
}
