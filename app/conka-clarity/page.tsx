"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  ClinicalIngredients,
  FormulaBenefitsPillars,
} from "@/app/components/product";
import ProductHeroV2 from "@/app/components/product/ProductHeroV2";
import ProductHeroMobileV2 from "@/app/components/product/ProductHeroMobileV2";
import ProductBenefitTiles from "@/app/components/product/ProductBenefitTiles";
import LabFAQ from "@/app/components/landing/LabFAQ";
import { getFormulaPdpFaqItems } from "@/app/lib/formulaFaq";
import WhatToExpect from "@/app/components/home/WhatToExpect";
import AbsorptionBioavailability from "@/app/components/product/AbsorptionBioavailability";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import AthleteSportMarquee from "@/app/components/AthleteSportMarquee";
import LandingValueComparison from "@/app/components/landing/LandingValueComparison";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import CROTestimonials from "@/app/components/cro/CROTestimonials";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
import ProductGrid from "@/app/components/home/ProductGrid";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { getAddToCartSource, getQuizSessionId } from "@/app/lib/analytics";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";
import {
  CadenceType,
  getCadenceVariantByFormula,
} from "@/app/lib/cadenceData";

const CLEAR_FAQ_IMAGE = {
  src: "/lifestyle/clear/ClearDrink.jpg",
  alt: "Drinking a CONKA Clear shot",
};

const CLEAR_FAQ_ITEMS = getFormulaPdpFaqItems("02");

export default function ConkaClarityPage() {
  const isMobile = useIsMobile();
  const [selectedCadence, setSelectedCadence] = useState<CadenceType>("monthly-sub");
  const { addToCart } = useCart();

  // Sticky-footer pricing — restore with the footers after the V2 hero build (SCRUM-1171).
  // const cadencePricing = getCadencePricingByFormula("02", selectedCadence);
  // const cadencePrice = cadencePricing.price;
  // const cadenceFreeShots = cadencePricing.freeShots;

  // Meta ViewContent (once per page view; stable variant ID for Meta).
  // content_name preserved as "CONKA Clarity" to match production tracking
  // history; the product name in formulaContent is "CONKA Clear".
  useEffect(() => {
    const variantData = getCadenceVariantByFormula("02", "monthly-sub");
    if (variantData?.variantId) {
      trackMetaViewContent({
        content_ids: [toContentId(variantData.variantId)],
        content_name: "CONKA Clarity",
        content_type: "product",
      });
    }
  }, []);

  const handleAddToCart = async (
    location: "hero" | "sticky_footer",
    cadence: CadenceType = selectedCadence,
  ) => {
    const variantData = getCadenceVariantByFormula("02", cadence);
    if (variantData?.variantId) {
      await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
        location,
        source: getAddToCartSource() === "quiz" ? "quiz" : "product_page",
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for:", { formula: "02", cadence });
    }
  };

  // Shared sections — defined once, composed into the mobile and desktop trees
  // below (only the hero differs between them). Order, backgrounds and mobile
  // spacing mirror conka-both so all three PDPs share one structure.
  const benefitTilesSection = (
    <section id="benefit-tiles" className="brand-section brand-bg-white" aria-label="Key benefits">
      <div className="brand-track">
        <ProductBenefitTiles />
      </div>
    </section>
  );

  const ugcSection = (
    <section id="ugc" className="brand-section brand-bg-white !px-0" aria-label="Real people using CONKA">
      <UGCMarquee />
    </section>
  );

  const benefitsSection = (
    <section id="benefits" className="brand-section brand-bg-tint" aria-label="Daily benefits">
      <div className="brand-track">
        <FormulaBenefitsPillars formulaId="02" />
      </div>
    </section>
  );

  // TODO Phase 3: a FormulaQualityBadges section (Informed Sport, vegan, etc.)
  // will slot between benefits and ingredients.
  const ingredientsSection = (
    <section id="ingredients" className="brand-section brand-bg-white" aria-label="Formula ingredients">
      <div className="brand-track">
        <ClinicalIngredients formulaIds={["02"]} />
      </div>
    </section>
  );

  const absorptionSection = (
    <section id="absorption" className="brand-section brand-bg-tint" aria-label="Why liquid absorbs better">
      <div className="brand-track">
        <AbsorptionBioavailability
          imageSrc="/formulas/conkaClear/ClearLiquid.jpg"
          imageAlt="CONKA Clear liquid pouring from an amber bottle"
        />
      </div>
    </section>
  );

  const whatToExpectSection = (
    <section id="what-to-expect" className="brand-section brand-bg-tint !px-0 !py-0" aria-label="What to expect">
      <WhatToExpect productId="02" />
    </section>
  );

  const testimonialsSection = (
    <section id="testimonials" className="brand-section brand-bg-white brand-tight-bottom-mobile" aria-label="Customer reviews">
      <div className="brand-track">
        <CROTestimonials hideCTA />
      </div>
    </section>
  );

  const comparisonSection = (
    <section id="comparison" className="brand-section brand-bg-tint brand-tight-top-mobile brand-tight-bottom-mobile" aria-label="CONKA vs coffee comparison">
      <div className="brand-track">
        <LandingValueComparison ctaHref="/conka-both" ctaLabel="Try the full system" />
      </div>
    </section>
  );

  const guaranteeSection = (
    <section id="guarantee" className="brand-section brand-bg-tint !px-0 lg:!px-[var(--brand-gutter-desktop)] brand-tight-top-mobile brand-tight-bottom-mobile" aria-label="Risk-free guarantee">
      <div className="brand-track">
        <LabGuarantee />
      </div>
    </section>
  );

  const athleteSection = (
    <section id="athletes" className="brand-section brand-bg-tint brand-tight-top-mobile brand-tight-bottom-mobile" aria-label="Athletes who use CONKA">
      <AthleteSportMarquee fullBleed />
      <div className="brand-track">
        <AthleteCredibilityCarousel showMarquee={false} />
      </div>
    </section>
  );

  const faqSection = (
    <section id="faq" className="brand-section brand-bg-white brand-tight-top-mobile" aria-label="FAQ">
      <div className="brand-track">
        <LabFAQ items={CLEAR_FAQ_ITEMS} image={CLEAR_FAQ_IMAGE} hideCTA />
      </div>
    </section>
  );

  const exploreSection = (
    <section id="explore" className="brand-section brand-bg-tint" aria-label="Explore other protocols and formulas">
      <div className="brand-track">
        <ProductGrid exclude={["clear"]} />
      </div>
    </section>
  );

  // Mobile-first: render the mobile layout on SSR and first paint (74% of
  // traffic) and only switch to desktop once useIsMobile confirms >= lg. Treating
  // the undefined initial value as mobile avoids the desktop-then-mobile hero
  // swap that shifted the image on phones.
  if (isMobile ?? true) {
    return (
      <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
        <Navigation />

        {/* ===== HERO ===== */}
        <section id="hero" className="brand-section brand-hero-first brand-bg-white" aria-label="Product hero">
          <div className="brand-track">
            <ProductHeroMobileV2
              formulaId="02"
              selectedCadence={selectedCadence}
              onCadenceChange={setSelectedCadence}
              onAddToCart={() => handleAddToCart("hero")}
              onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
            />
          </div>
        </section>

        {benefitTilesSection}
        {ugcSection}
        {benefitsSection}
        {ingredientsSection}
        {absorptionSection}
        {whatToExpectSection}
        {testimonialsSection}
        {comparisonSection}
        {guaranteeSection}
        {athleteSection}
        {faqSection}
        {exploreSection}

        {/* Sticky footer hidden during V2 hero build (SCRUM-1171) — restore after. */}
        {/* <StickyPurchaseFooterMobile
          formulaId="02"
          selectedCadence={selectedCadence}
          cadencePrice={cadencePrice}
          onAddToCart={() => handleAddToCart("sticky_footer")}
        /> */}

        <Footer />
      </div>
    );
  }

  // Desktop version
  return (
    <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      <Navigation />

      {/* ===== HERO ===== */}
      {/* V2 hero runs wider than the 1280 brand-track and with a tighter gutter
          to sit closer to the Magic Mind reference (SCRUM-1171). */}
      <section id="hero" className="brand-section brand-hero-first brand-bg-white !px-[3vw]" aria-label="Product hero">
        <div className="brand-track !max-w-[1480px]">
          <ProductHeroV2
            formulaId="02"
            selectedCadence={selectedCadence}
            onCadenceChange={setSelectedCadence}
            onAddToCart={() => handleAddToCart("hero")}
            onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
          />
        </div>
      </section>

      {benefitTilesSection}
      {ugcSection}
      {benefitsSection}
      {/* TODO Phase 3: FormulaQualityBadges section goes here (Informed Sport, vegan, etc.). */}
      {ingredientsSection}
      {absorptionSection}
      {whatToExpectSection}
      {testimonialsSection}
      {comparisonSection}
      {guaranteeSection}
      {athleteSection}
      {faqSection}
      {exploreSection}

      {/* Sticky footer hidden during V2 hero build (SCRUM-1171) — restore after. */}
      {/* <StickyPurchaseFooter
        formulaId="02"
        selectedCadence={selectedCadence}
        cadencePrice={cadencePrice}
        cadenceFreeShots={cadenceFreeShots}
        onAddToCart={() => handleAddToCart("sticky_footer")}
      /> */}

      <Footer />
    </div>
  );
}
