"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ProductHeroV2 from "@/app/components/product/ProductHeroV2";
import ProductHeroMobileV2 from "@/app/components/product/ProductHeroMobileV2";
import ProductBenefitTiles from "@/app/components/product/ProductBenefitTiles";
import Certifications from "@/app/components/Certifications";
import { ClinicalIngredients } from "@/app/components/product";
import LandingValueComparison from "@/app/components/landing/LandingValueComparison";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import AthleteSportMarquee from "@/app/components/AthleteSportMarquee";
import WhatToExpect from "@/app/components/home/WhatToExpect";
import AbsorptionBioavailability from "@/app/components/product/AbsorptionBioavailability";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import BrainFuelBand from "@/app/lander/sections/BrainFuelBand/BrainFuelBand";
import LabFAQ from "@/app/components/landing/LabFAQ";
import { BOTH_PDP_FAQ_ITEMS } from "@/app/lib/faqContent";
import CROTestimonials from "@/app/components/cro/CROTestimonials";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import {
  CadenceType,
  getCadenceVariantByProductHeroId,
} from "@/app/lib/cadenceData";
import { getPurchaseSource, getQuizSessionId } from "@/app/lib/analytics";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";

const PRODUCT_HERO_ID = "03" as const;

export default function ConkaBothPage() {
  const isMobile = useIsMobile();
  const { addToCart } = useCart();
  const [selectedCadence, setSelectedCadence] =
    useState<CadenceType>("monthly-sub");

  // Meta ViewContent on page load
  useEffect(() => {
    const variantData = getCadenceVariantByProductHeroId(
      PRODUCT_HERO_ID,
      "monthly-sub",
    );
    if (variantData?.variantId) {
      trackMetaViewContent({
        content_ids: [toContentId(variantData.variantId)],
        content_name: "CONKA Flow + Clear",
        content_type: "product",
      });
    }
  }, []);

  const handleAddToCart = async (
    location: "hero" | "sticky_footer",
    cadence: CadenceType = selectedCadence,
  ) => {
    const variantData = getCadenceVariantByProductHeroId(
      PRODUCT_HERO_ID,
      cadence,
    );
    if (variantData?.variantId) {
      await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
        location,
        source: getPurchaseSource(),
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for cadence:", cadence);
    }
  };

  // Sticky-footer pricing — restore with the footers after the V2 hero build (SCRUM-1171).
  // const cadencePricing = getBalanceCadencePricing(selectedCadence);
  // const cadencePrice = cadencePricing.price;
  // const cadenceFreeShots = cadencePricing.freeShots;

  // Shared sections — ordered as they appear on the page. Backgrounds
  // alternate white/tint starting from the white hero.
  // Full-bleed dark proof band — owns its own section + dark background
  const brainFuelSection = <BrainFuelBand />;

  // Magic Mind textured benefits band (generic across products), rendered
  // directly under the hero on both mobile and desktop.
  const benefitTilesSection = (
    <>
      <section
        id="benefit-tiles"
        className="brand-section brand-bg-white"
        aria-label="Key benefits"
      >
        <div className="brand-track">
          <ProductBenefitTiles formula="flow" />
        </div>
      </section>
      {/* Certification badges band directly under the benefit tiles. */}
      <Certifications />
    </>
  );

  const ingredientsSection = (
    <section
      id="ingredients"
      className="brand-section brand-bg-white"
      aria-label="What's inside CONKA"
    >
      <div className="brand-track">
        <ClinicalIngredients />
      </div>
    </section>
  );

  const absorptionSection = (
    <section
      id="absorption"
      className="brand-section brand-bg-tint"
      aria-label="Why liquid absorbs better"
    >
      <div className="brand-track">
        <AbsorptionBioavailability
          imageSrc="/formulas/conkaClear/ClearLiquid.jpg"
          imageAlt="CONKA liquid pouring from an amber bottle"
        />
      </div>
    </section>
  );

  const athleteSection = (
    <section
      id="athletes"
      className="brand-section brand-bg-tint brand-tight-top-mobile brand-tight-bottom-mobile"
      aria-label="Athletes who use CONKA"
    >
      <AthleteSportMarquee fullBleed />
      <div className="brand-track">
        <AthleteCredibilityCarousel showMarquee={false} />
      </div>
    </section>
  );

  const ugcSection = (
    <section
      id="ugc"
      className="brand-section brand-bg-white !px-0"
      aria-label="Real people using CONKA"
    >
      <UGCMarquee />
    </section>
  );

  const testimonialsSection = (
    <section
      className="brand-section brand-bg-white brand-tight-bottom-mobile"
      aria-label="Customer reviews"
    >
      <div className="brand-track">
        <CROTestimonials hideCTA />
      </div>
    </section>
  );

  const comparisonSection = (
    <section
      id="comparison"
      className="brand-section brand-bg-tint brand-tight-top-mobile brand-tight-bottom-mobile"
      aria-label="CONKA vs coffee comparison"
    >
      <div className="brand-track">
        <LandingValueComparison
          ctaHref="#hero"
          ctaLabel="Try the full system"
        />
      </div>
    </section>
  );

  const whatToExpectSection = (
    <section
      id="what-to-expect"
      className="brand-section brand-bg-tint !px-0 !py-0"
      aria-label="What to expect"
    >
      <WhatToExpect productId="both" />
    </section>
  );

  const guaranteeSection = (
    <section
      className="brand-section brand-bg-tint !px-0 lg:!px-[var(--brand-gutter-desktop)] brand-tight-top-mobile brand-tight-bottom-mobile"
      aria-label="Risk-free guarantee"
    >
      <div className="brand-track">
        <LabGuarantee />
      </div>
    </section>
  );

  const faqSection = (
    <section className="brand-section brand-bg-white brand-tight-top-mobile" aria-label="FAQ">
      <div className="brand-track">
        <LabFAQ items={BOTH_PDP_FAQ_ITEMS} hideCTA />
      </div>
    </section>
  );

  // Mobile-first: render the mobile layout on SSR and first paint (74% of
  // traffic) and only switch to desktop once useIsMobile confirms >= lg. Treating
  // the undefined initial value as mobile avoids the desktop-then-mobile hero
  // swap that shifted the image on phones.
  if (isMobile ?? true) {
    return (
      <div className="brand-clinical brand-page min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
        <Navigation />

        {/* ===== SECTION 1: HERO ===== */}
        <section
          id="hero"
          className="brand-section brand-hero-first brand-bg-white"
          aria-label="Product hero"
        >
          <div className="brand-track">
            <ProductHeroMobileV2
              formulaId={PRODUCT_HERO_ID}
              selectedCadence={selectedCadence}
              onCadenceChange={setSelectedCadence}
              onAddToCart={() => handleAddToCart("hero")}
              onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
            />
          </div>
        </section>

        {/* ===== BENEFITS TILE (Magic Mind textured band) ===== */}
        {benefitTilesSection}

        {/* ===== UGC SOCIAL PROOF ===== */}
        {ugcSection}

        {/* ===== SECTION 2: BRAIN FUEL BAND ===== */}
        {brainFuelSection}

        {/* ===== SECTION 3: INGREDIENTS ===== */}
        {ingredientsSection}

        {/* ===== SECTION 3b: ABSORPTION (why liquid) ===== */}
        {absorptionSection}

        {/* ===== SECTION 4: WHAT TO EXPECT ===== */}
        {whatToExpectSection}

        {/* ===== SECTION 5: TESTIMONIALS ===== */}
        {testimonialsSection}

        {/* ===== SECTION 6: COMPARISON ===== */}
        {comparisonSection}

        {/* ===== SECTION 7: GUARANTEE ===== */}
        {guaranteeSection}

        {/* ===== SECTION 8: ATHLETE CREDIBILITY (before FAQ) ===== */}
        {athleteSection}

        {/* ===== SECTION 9: FAQ ===== */}
        {faqSection}

        <Footer />

        {/* Sticky footer hidden during V2 hero build (SCRUM-1171) — restore after. */}
        {/* <StickyPurchaseFooterMobile
          productHeroId="03"
          selectedCadence={selectedCadence}
          cadencePrice={cadencePrice}
          onAddToCart={() => handleAddToCart("sticky_footer")}
        /> */}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      <Navigation />

      {/* ===== SECTION 1: HERO ===== */}
      {/* V2 hero runs wider than the 1280 brand-track and with a tighter gutter
          to sit closer to the Magic Mind reference (SCRUM-1171). */}
      <section
        id="hero"
        className="brand-section brand-hero-first brand-bg-white !px-[3vw]"
        aria-label="Product hero"
      >
        <div className="brand-track !max-w-[1480px]">
          <ProductHeroV2
            formulaId={PRODUCT_HERO_ID}
            selectedCadence={selectedCadence}
            onCadenceChange={setSelectedCadence}
            onAddToCart={() => handleAddToCart("hero")}
            onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
          />
        </div>
      </section>

      {/* ===== BENEFITS TILE (Magic Mind textured band) ===== */}
      {benefitTilesSection}

      {/* ===== UGC SOCIAL PROOF ===== */}
      {ugcSection}

      {/* ===== SECTION 2: BRAIN FUEL BAND ===== */}
      {brainFuelSection}

      {/* ===== SECTION 3: INGREDIENTS ===== */}
      {ingredientsSection}

      {/* ===== SECTION 3b: ABSORPTION (why liquid) ===== */}
      {absorptionSection}

      {/* ===== SECTION 4: WHAT TO EXPECT ===== */}
      {whatToExpectSection}

      {/* ===== SECTION 5: TESTIMONIALS ===== */}
      {testimonialsSection}

      {/* ===== SECTION 6: COMPARISON ===== */}
      {comparisonSection}

      {/* ===== SECTION 7: GUARANTEE ===== */}
      {guaranteeSection}

      {/* ===== SECTION 8: ATHLETE CREDIBILITY (before FAQ) ===== */}
      {athleteSection}

      {/* ===== SECTION 9: FAQ ===== */}
      {faqSection}

      <Footer />

      {/* Sticky footer hidden during V2 hero build (SCRUM-1171) — restore after. */}
      {/* <StickyPurchaseFooter
        productHeroId="03"
        selectedCadence={selectedCadence}
        cadencePrice={cadencePrice}
        cadenceFreeShots={cadenceFreeShots}
        onAddToCart={() => handleAddToCart("sticky_footer")}
      /> */}
    </div>
  );
}
