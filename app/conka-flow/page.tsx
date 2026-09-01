"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  ClinicalIngredients,
  FormulaBenefitsPillars,
} from "@/app/components/product";
import ProductHeroV3 from "@/app/components/product/ProductHeroV3";
import ProductHeroMobileV3 from "@/app/components/product/ProductHeroMobileV3";
import StarterPackContents from "@/app/components/product/StarterPackContents";
import ProductComparisonTable from "@/app/components/product/ProductComparisonTable";
import PdpSection, {
  PdpSectionImpressions,
} from "@/app/components/product/PdpSection";
import LabFAQ from "@/app/components/landing/LabFAQ";
import { getFormulaPdpFaqItems } from "@/app/lib/formulaFaq";
import WhatToExpectV2 from "@/app/components/home/WhatToExpectV2";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import CROTestimonials from "@/app/components/cro/CROTestimonials";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
import ProductGrid from "@/app/components/home/ProductGrid";
import StickyPurchaseFooter from "@/app/components/product/StickyPurchaseFooter";
import StickyPurchaseFooterMobile from "@/app/components/product/StickyPurchaseFooterMobile";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import {
  captureListicleSrc,
  getPurchaseOrigin,
  getPurchaseSource,
  getQuizSessionId,
} from "@/app/lib/analytics";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";
import {
  CadenceType,
  getCadencePricingByFormula,
  getCadenceVariantByFormula,
  getOtpCadenceFor,
} from "@/app/lib/cadenceData";

const FLOW_FAQ_ITEMS = getFormulaPdpFaqItems("01");

export default function ConkaFlowPage() {
  const isMobile = useIsMobile();
  const [selectedCadence, setSelectedCadence] = useState<CadenceType>("monthly-sub");
  const { addToCart } = useCart();

  const cadencePricing = getCadencePricingByFormula("01", selectedCadence);
  const cadencePrice = cadencePricing.price;

  // Meta ViewContent (once per page view; stable variant ID for Meta)
  useEffect(() => {
    // Persist any listicle ?src= that carried the visitor here, so an add-to-cart
    // after navigating within the PDP still attributes to its listicle (SCRUM-1180).
    captureListicleSrc();

    const variantData = getCadenceVariantByFormula("01", "monthly-sub");
    if (variantData?.variantId) {
      trackMetaViewContent({
        content_ids: [toContentId(variantData.variantId)],
        content_name: "CONKA Flow",
        content_type: "product",
      });
    }
  }, []);

  const handleAddToCart = async (
    location: "hero" | "sticky_footer",
    cadence: CadenceType = selectedCadence,
  ) => {
    const variantData = getCadenceVariantByFormula("01", cadence);
    if (variantData?.variantId) {
      await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
        location,
        source: getPurchaseSource(),
        origin: getPurchaseOrigin(),
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for:", { formula: "01", cadence });
    }
  };

  // Shared sections, defined once, composed into the mobile and desktop trees
  // below (only the hero differs between them). Order, backgrounds and mobile
  // spacing mirror conka-clarity and conka-both so all three PDPs share one
  // structure. Each PdpSection's id is both its anchor and its analytics name.
  const ugcSection = (
    <PdpSection
      id="ugc"
      className="brand-section brand-bg-white !px-0 brand-tight-top-mobile brand-tight-bottom-mobile"
      ariaLabel="Real people using CONKA"
    >
      <UGCMarquee />
    </PdpSection>
  );

  // Starter pack: subscription cadences only. The page owns the visibility
  // decision so a one-time cadence renders no wrapper and leaves no gap.
  const starterPackSection = cadencePricing.starterPackImage ? (
    <PdpSection
      id="starter-pack"
      className="brand-section brand-bg-white"
      ariaLabel="What is in the starter pack"
    >
      <div className="brand-track">
        <StarterPackContents
          pricing={cadencePricing}
          productLabel="CONKA Flow"
        />
      </div>
    </PdpSection>
  ) : null;

  const ingredientsSection = (
    <PdpSection
      id="ingredients"
      className="brand-section brand-bg-white brand-tight-top-mobile"
      ariaLabel="Formula ingredients"
    >
      <div className="brand-track">
        <ClinicalIngredients formulaIds={["01"]} />
      </div>
    </PdpSection>
  );

  const benefitsSection = (
    <PdpSection
      id="benefits"
      className="brand-section brand-bg-tint"
      ariaLabel="Daily benefits"
    >
      <div className="brand-track">
        <FormulaBenefitsPillars formulaId="01" />
      </div>
    </PdpSection>
  );

  const whatToExpectSection = (
    <PdpSection
      id="what-to-expect"
      className="brand-section brand-bg-tint"
      ariaLabel="What to expect"
    >
      <div className="brand-track">
        <WhatToExpectV2 productId="01" />
      </div>
    </PdpSection>
  );

  const comparisonSection = (
    <PdpSection
      id="comparison"
      className="brand-section brand-bg-white"
      ariaLabel="CONKA compared with coffee and prescription stimulants"
    >
      <div className="brand-track">
        <ProductComparisonTable product="flow" />
      </div>
    </PdpSection>
  );

  const testimonialsSection = (
    <PdpSection
      id="testimonials"
      className="brand-section brand-bg-white brand-tight-bottom-mobile"
      ariaLabel="Customer reviews"
    >
      <div className="brand-track">
        <CROTestimonials hideCTA />
      </div>
    </PdpSection>
  );

  const athleteSection = (
    <PdpSection
      id="athletes"
      className="brand-section brand-bg-tint brand-tight-top-mobile brand-tight-bottom-mobile"
      ariaLabel="Athletes who use CONKA"
    >
      <div className="brand-track">
        <AthleteCredibilityCarousel />
      </div>
    </PdpSection>
  );

  const guaranteeSection = (
    <PdpSection
      id="guarantee"
      className="brand-section brand-bg-tint !px-0 lg:!px-[var(--brand-gutter-desktop)] brand-tight-top-mobile brand-tight-bottom-mobile"
      ariaLabel="Risk-free guarantee"
    >
      <div className="brand-track">
        <LabGuarantee />
      </div>
    </PdpSection>
  );

  const faqSection = (
    <PdpSection
      id="faq"
      className="brand-section brand-bg-white brand-tight-top-mobile"
      ariaLabel="FAQ"
    >
      <div className="brand-track">
        <LabFAQ items={FLOW_FAQ_ITEMS} hideCTA />
      </div>
    </PdpSection>
  );

  const exploreSection = (
    <PdpSection
      id="explore"
      className="brand-section brand-bg-tint"
      ariaLabel="Explore other formulas"
    >
      <div className="brand-track">
        <ProductGrid exclude={["flow"]} />
      </div>
    </PdpSection>
  );

  // Clears the fixed sticky footer so it never covers the site footer's last row.
  const stickySpacer = <div aria-hidden className="h-16 lg:h-14" />;

  // Mobile-first: render the mobile layout on SSR and first paint (74% of
  // traffic) and only switch to desktop once useIsMobile confirms >= lg. Treating
  // the undefined initial value as mobile avoids the desktop-then-mobile hero
  // swap that shifted the image on phones.
  if (isMobile ?? true) {
    return (
      <PdpSectionImpressions product="flow">
        <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
          <Navigation />

          {/* ===== HERO ===== */}
          <PdpSection
            id="hero"
            className="brand-section brand-hero-first brand-bg-white !pt-6 brand-tight-bottom-mobile"
            ariaLabel="Product hero"
          >
            <div className="brand-track">
              <ProductHeroMobileV3
                formulaId="01"
                selectedCadence={selectedCadence}
                onCadenceChange={setSelectedCadence}
                onAddToCart={() => handleAddToCart("hero")}
                onOtpAddToCart={() => handleAddToCart("hero", getOtpCadenceFor(selectedCadence))}
              />
            </div>
          </PdpSection>

          {ugcSection}
          {ingredientsSection}
          {benefitsSection}
          {starterPackSection}
          {whatToExpectSection}
          {comparisonSection}
          {testimonialsSection}
          {athleteSection}
          {guaranteeSection}
          {faqSection}
          {exploreSection}

          {stickySpacer}
          <Footer />

          <StickyPurchaseFooterMobile
            selectedCadence={selectedCadence}
            cadencePrice={cadencePrice}
            onAddToCart={() => handleAddToCart("sticky_footer")}
          />
        </div>
      </PdpSectionImpressions>
    );
  }

  // Desktop version
  return (
    <PdpSectionImpressions product="flow">
      <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
        <Navigation />

        {/* ===== HERO ===== */}
        {/* V3 two-column hero runs wider than the 1280 brand-track with a tighter
            gutter to sit closer to the Magic Mind reference. It embeds the
            ingredient-benefit accordions in its right column; the body's
            ClinicalIngredients section is a different surface and both are
            merged into one in Phase 3 (SCRUM-1262). */}
        <PdpSection
          id="hero"
          className="brand-section brand-hero-first brand-bg-white !px-[6vw]"
          ariaLabel="Product hero"
        >
          <div className="brand-track !max-w-[1480px]">
            <ProductHeroV3
              formulaId="01"
              selectedCadence={selectedCadence}
              onCadenceChange={setSelectedCadence}
              onAddToCart={() => handleAddToCart("hero")}
              onOtpAddToCart={() => handleAddToCart("hero", getOtpCadenceFor(selectedCadence))}
            />
          </div>
        </PdpSection>

        {ugcSection}
        {ingredientsSection}
        {benefitsSection}
        {starterPackSection}
        {whatToExpectSection}
        {comparisonSection}
        {testimonialsSection}
        {athleteSection}
        {guaranteeSection}
        {faqSection}
        {exploreSection}

        {stickySpacer}
        <Footer />

        <StickyPurchaseFooter
          formulaId="01"
          selectedCadence={selectedCadence}
          cadencePrice={cadencePrice}
          onAddToCart={() => handleAddToCart("sticky_footer")}
        />
      </div>
    </PdpSectionImpressions>
  );
}
