"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ProductHero from "@/app/components/product/ProductHero";
import ProductHeroMobile from "@/app/components/product/ProductHeroMobile";
import {
  ClinicalIngredients,
  StickyPurchaseFooter,
  StickyPurchaseFooterMobile,
} from "@/app/components/product";
import LandingProductShowcase from "@/app/components/landing/LandingProductShowcase";
import LandingValueComparison from "@/app/components/landing/LandingValueComparison";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import FormulaCaseStudies, {
  FormulaCaseStudiesMobile,
} from "@/app/components/FormulaCaseStudies";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import LabTimeline from "@/app/components/landing/LabTimeline";
import LabFAQ from "@/app/components/landing/LabFAQ";
import LandingTestimonials from "@/app/components/landing/LandingTestimonials";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import {
  CadenceType,
  getCadenceVariantByProductHeroId,
  getBalanceCadencePricing,
} from "@/app/lib/cadenceData";
import { getAddToCartSource, getQuizSessionId } from "@/app/lib/analytics";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";

const PRODUCT_HERO_ID = "03" as const;

export default function ConkaBothPage() {
  const isMobile = useIsMobile();
  const { addToCart } = useCart();
  const [selectedCadence, setSelectedCadence] =
    useState<CadenceType>("monthly-sub");

  // Meta ViewContent on page load
  useEffect(() => {
    const variantData = getCadenceVariantByProductHeroId(PRODUCT_HERO_ID, "monthly-sub");
    if (variantData?.variantId) {
      trackMetaViewContent({
        content_ids: [toContentId(variantData.variantId)],
        content_name: "CONKA Flow + Clear",
        content_type: "product",
      });
    }
  }, []);

  const handleAddToCart = async (location: "hero" | "sticky_footer") => {
    const variantData = getCadenceVariantByProductHeroId(PRODUCT_HERO_ID, selectedCadence);
    if (variantData?.variantId) {
      await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
        location,
        source: getAddToCartSource() === "quiz" ? "quiz" : "product_page",
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for cadence:", selectedCadence);
    }
  };

  const cadencePrice = getBalanceCadencePricing(selectedCadence).price;

  // Shared sections
  const caseStudiesMobile = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="Clinically validated results"
    >
      <div className="brand-track">
        <FormulaCaseStudiesMobile productId={"3"} />
      </div>
    </section>
  );

  const caseStudiesDesktop = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="Clinically validated results"
    >
      <div className="brand-track">
        <FormulaCaseStudies productId={"3"} />
      </div>
    </section>
  );

  const timelineSection = (
    <section
      className="brand-section brand-bg-white"
      aria-label="What to expect"
    >
      <div className="brand-track">
        <LabTimeline hideCTA />
      </div>
    </section>
  );

  const testimonialsSection = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="Customer reviews"
    >
      <div className="brand-track">
        <LandingTestimonials hideCTA />
      </div>
    </section>
  );

  const athleteSection = (
    <section
      id="athletes"
      className="brand-section brand-bg-tint"
      aria-label="Athletes who use CONKA"
    >
      <div className="brand-track">
        <AthleteCredibilityCarousel />
      </div>
    </section>
  );

  const ingredientsSection = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="What's inside CONKA"
    >
      <div className="brand-track">
        <ClinicalIngredients />
      </div>
    </section>
  );

  const comparisonSection = (
    <section
      id="comparison"
      className="brand-section brand-bg-white"
      aria-label="CONKA vs coffee comparison"
    >
      <div className="brand-track">
        <LandingValueComparison ctaHref="#hero" ctaLabel="Try the full system" />
      </div>
    </section>
  );

  const whatItDoesSection = (
    <section
      className="brand-section brand-bg-white"
      aria-label="What CONKA does"
    >
      <div className="brand-track">
        <LandingProductShowcase hideCTA />
      </div>
    </section>
  );

  const guaranteeSection = (
    <section
      className="brand-section brand-bg-white"
      aria-label="Risk-free guarantee"
    >
      <div className="brand-track">
        <LabGuarantee ctaLabel="Learn more about the CONKA app" ctaHref="/app" />
      </div>
    </section>
  );

  const faqSection = (
    <section className="brand-section brand-bg-tint" aria-label="FAQ">
      <div className="brand-track">
        <LabFAQ hideCTA />
      </div>
    </section>
  );

  // Mobile version
  if (isMobile) {
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
            <ProductHeroMobile
              formulaId={PRODUCT_HERO_ID}
              selectedCadence={selectedCadence}
              onCadenceChange={setSelectedCadence}
              onAddToCart={() => handleAddToCart("hero")}
            />
          </div>
        </section>

        {/* ===== SECTION 2: ATHLETE CREDIBILITY ===== */}
        {athleteSection}

        {/* ===== SECTION 3: TIMELINE ===== */}
        {timelineSection}

        {/* ===== SECTION 4: TESTIMONIALS ===== */}
        {testimonialsSection}

        {/* ===== SECTION 5: WHAT CONKA DOES ===== */}
        {whatItDoesSection}

        {/* ===== SECTION 6: INGREDIENTS ===== */}
        {ingredientsSection}

        {/* ===== SECTION 7: COMPARISON ===== */}
        {comparisonSection}

        {/* ===== SECTION 8: CASE STUDIES ===== */}
        {caseStudiesMobile}

        {/* ===== SECTION 9: GUARANTEE ===== */}
        {guaranteeSection}

        {/* ===== SECTION 10: FAQ ===== */}
        {faqSection}

        <Footer />

        <StickyPurchaseFooterMobile
          productHeroId="03"
          selectedCadence={selectedCadence}
          cadencePrice={cadencePrice}
          onAddToCart={() => handleAddToCart("sticky_footer")}
        />
      </div>
    );
  }

  // Desktop version
  return (
    <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      <Navigation />

      {/* ===== SECTION 1: HERO ===== */}
      <section
        id="hero"
        className="brand-section brand-hero-first brand-bg-white"
        aria-label="Product hero"
      >
        <div className="brand-track">
          <ProductHero
            formulaId={PRODUCT_HERO_ID}
            selectedCadence={selectedCadence}
            onCadenceChange={setSelectedCadence}
            onAddToCart={() => handleAddToCart("hero")}
          />
        </div>
      </section>

      {/* ===== SECTION 2: ATHLETE CREDIBILITY ===== */}
      {athleteSection}

      {/* ===== SECTION 3: TIMELINE ===== */}
      {timelineSection}

      {/* ===== SECTION 4: TESTIMONIALS ===== */}
      {testimonialsSection}

      {/* ===== SECTION 5: WHAT CONKA DOES ===== */}
      {whatItDoesSection}

      {/* ===== SECTION 6: INGREDIENTS ===== */}
      {ingredientsSection}

      {/* ===== SECTION 7: COMPARISON ===== */}
      {comparisonSection}

      {/* ===== SECTION 8: CASE STUDIES ===== */}
      {caseStudiesDesktop}

      {/* ===== SECTION 9: GUARANTEE ===== */}
      {guaranteeSection}

      {/* ===== SECTION 10: FAQ ===== */}
      {faqSection}

      <Footer />

      <StickyPurchaseFooter
        productHeroId="03"
        selectedCadence={selectedCadence}
        cadencePrice={cadencePrice}
        onAddToCart={() => handleAddToCart("sticky_footer")}
      />
    </div>
  );
}
