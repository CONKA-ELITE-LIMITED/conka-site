"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ProductHeroV3 from "@/app/components/product/ProductHeroV3";
import ProductHeroMobileV3 from "@/app/components/product/ProductHeroMobileV3";
import ProductComparisonTable from "@/app/components/product/ProductComparisonTable";
import PdpSection, {
  PdpSectionImpressions,
} from "@/app/components/product/PdpSection";
import Certifications from "@/app/components/Certifications";
import { ClinicalIngredients } from "@/app/components/product";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import AthleteSportMarquee from "@/app/components/AthleteSportMarquee";
import WhatToExpectV2 from "@/app/components/home/WhatToExpectV2";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import BrainFuelBand from "@/app/lander/sections/BrainFuelBand/BrainFuelBand";
import LabFAQ from "@/app/components/landing/LabFAQ";
import { BOTH_PDP_FAQ_ITEMS } from "@/app/lib/faqContent";
import CROTestimonials from "@/app/components/cro/CROTestimonials";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
import StickyPurchaseFooter from "@/app/components/product/StickyPurchaseFooter";
import StickyPurchaseFooterMobile from "@/app/components/product/StickyPurchaseFooterMobile";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import {
  CadenceType,
  getBalanceCadencePricing,
  getCadenceVariantByProductHeroId,
} from "@/app/lib/cadenceData";
import {
  captureListicleSrc,
  getPurchaseOrigin,
  getPurchaseSource,
  getQuizSessionId,
} from "@/app/lib/analytics";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";

const PRODUCT_HERO_ID = "03" as const;

export default function ConkaBothPage() {
  const isMobile = useIsMobile();
  const { addToCart } = useCart();
  const [selectedCadence, setSelectedCadence] =
    useState<CadenceType>("monthly-sub");

  const cadencePrice = getBalanceCadencePricing(selectedCadence).price;

  // Meta ViewContent on page load
  useEffect(() => {
    // Persist any listicle ?src= that carried the visitor here, so an add-to-cart
    // after navigating within the PDP still attributes to its listicle (SCRUM-1180).
    captureListicleSrc();

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
        origin: getPurchaseOrigin(),
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for cadence:", cadence);
    }
  };

  // Shared sections — ordered as they appear on the page, matching conka-flow
  // and conka-clarity so all three PDPs share one structure. Backgrounds
  // alternate white/tint starting from the white hero. Each PdpSection's id is
  // both its anchor and its analytics name.
  const certificationsSection = <Certifications />;

  const ugcSection = (
    <PdpSection
      id="ugc"
      className="brand-section brand-bg-white !px-0 brand-tight-top-mobile"
      ariaLabel="Real people using CONKA"
    >
      <UGCMarquee />
    </PdpSection>
  );

  // Full-bleed proof section (white, neuron clip + grey stat card) — owns
  // its own section + background, so it is not wrapped in a PdpSection.
  const brainFuelSection = <BrainFuelBand />;

  const ingredientsSection = (
    <PdpSection
      id="ingredients"
      className="brand-section brand-bg-white"
      ariaLabel="What's inside CONKA"
    >
      <div className="brand-track">
        <ClinicalIngredients />
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
        <WhatToExpectV2 productId="both" />
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
        <ProductComparisonTable product="both" />
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
      <AthleteSportMarquee fullBleed />
      <div className="brand-track">
        <AthleteCredibilityCarousel showMarquee={false} />
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
        <LabFAQ items={BOTH_PDP_FAQ_ITEMS} hideCTA />
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
      <PdpSectionImpressions product="both">
        <div className="brand-clinical brand-page min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
          <Navigation />

          {/* ===== HERO ===== */}
          <PdpSection
            id="hero"
            className="brand-section brand-hero-first brand-bg-white !pt-6 brand-tight-bottom-mobile"
            ariaLabel="Product hero"
          >
            <div className="brand-track">
              <ProductHeroMobileV3
                formulaId={PRODUCT_HERO_ID}
                selectedCadence={selectedCadence}
                onCadenceChange={setSelectedCadence}
                onAddToCart={() => handleAddToCart("hero")}
                onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
              />
            </div>
          </PdpSection>

          {certificationsSection}
          {ugcSection}
          {brainFuelSection}
          {ingredientsSection}
          {whatToExpectSection}
          {comparisonSection}
          {testimonialsSection}
          {athleteSection}
          {guaranteeSection}
          {faqSection}

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
    <PdpSectionImpressions product="both">
      <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
        <Navigation />

        {/* ===== HERO ===== */}
        {/* V3 hero runs wider than the 1280 brand-track and with a tighter gutter
            to sit closer to the Magic Mind reference (SCRUM-1171). */}
        <PdpSection
          id="hero"
          className="brand-section brand-hero-first brand-bg-white !px-[6vw]"
          ariaLabel="Product hero"
        >
          <div className="brand-track !max-w-[1480px]">
            <ProductHeroV3
              formulaId={PRODUCT_HERO_ID}
              selectedCadence={selectedCadence}
              onCadenceChange={setSelectedCadence}
              onAddToCart={() => handleAddToCart("hero")}
              onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
            />
          </div>
        </PdpSection>

        {certificationsSection}
        {ugcSection}
        {brainFuelSection}
        {ingredientsSection}
        {whatToExpectSection}
        {comparisonSection}
        {testimonialsSection}
        {athleteSection}
        {guaranteeSection}
        {faqSection}

        {stickySpacer}
        <Footer />

        <StickyPurchaseFooter
          productHeroId={PRODUCT_HERO_ID}
          selectedCadence={selectedCadence}
          cadencePrice={cadencePrice}
          onAddToCart={() => handleAddToCart("sticky_footer")}
        />
      </div>
    </PdpSectionImpressions>
  );
}
