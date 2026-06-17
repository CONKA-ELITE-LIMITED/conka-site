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
import LandingValueComparison from "@/app/components/landing/LandingValueComparison";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import FormulaCaseStudies, {
  FormulaCaseStudiesMobile,
} from "@/app/components/FormulaCaseStudies";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import BrainFuelBand from "@/app/lander/sections/BrainFuelBand/BrainFuelBand";
import LabFAQ from "@/app/components/landing/LabFAQ";
import CROTestimonials from "@/app/components/cro/CROTestimonials";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
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
        source: getAddToCartSource() === "quiz" ? "quiz" : "product_page",
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for cadence:", cadence);
    }
  };

  const cadencePrice = getBalanceCadencePricing(selectedCadence).price;

  // Shared sections — ordered as they appear on the page. Backgrounds
  // alternate white/tint starting from the white hero.
  // Full-bleed dark proof band — owns its own section + dark background
  const brainFuelSection = <BrainFuelBand />;

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
      className="brand-section brand-bg-white"
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
      className="brand-section brand-bg-tint"
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

  const caseStudiesMobile = (
    <section
      className="brand-section brand-bg-white"
      aria-label="Clinically validated results"
    >
      <div className="brand-track">
        <FormulaCaseStudiesMobile productId={"3"} />
      </div>
    </section>
  );

  const caseStudiesDesktop = (
    <section
      className="brand-section brand-bg-white"
      aria-label="Clinically validated results"
    >
      <div className="brand-track">
        <FormulaCaseStudies productId={"3"} />
      </div>
    </section>
  );

  const guaranteeSection = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="Risk-free guarantee"
    >
      <div className="brand-track">
        <LabGuarantee ctaLabel="Learn more" ctaHref="/app" />
      </div>
    </section>
  );

  const faqSection = (
    <section className="brand-section brand-bg-white" aria-label="FAQ">
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
              onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
            />
          </div>
        </section>

        {/* ===== UGC SOCIAL PROOF ===== */}
        {ugcSection}

        {/* ===== SECTION 2: BRAIN FUEL BAND ===== */}
        {brainFuelSection}

        {/* ===== SECTION 3: INGREDIENTS ===== */}
        {ingredientsSection}

        {/* ===== SECTION 4: ATHLETE CREDIBILITY ===== */}
        {athleteSection}

        {/* ===== SECTION 5: TESTIMONIALS ===== */}
        {testimonialsSection}

        {/* ===== SECTION 6: COMPARISON ===== */}
        {comparisonSection}

        {/* ===== SECTION 7: CASE STUDIES ===== */}
        {caseStudiesMobile}

        {/* ===== SECTION 8: GUARANTEE ===== */}
        {guaranteeSection}

        {/* ===== SECTION 9: FAQ ===== */}
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
            onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
          />
        </div>
      </section>

      {/* ===== UGC SOCIAL PROOF ===== */}
      {ugcSection}

      {/* ===== SECTION 2: BRAIN FUEL BAND ===== */}
      {brainFuelSection}

      {/* ===== SECTION 3: INGREDIENTS ===== */}
      {ingredientsSection}

      {/* ===== SECTION 4: ATHLETE CREDIBILITY ===== */}
      {athleteSection}

      {/* ===== SECTION 5: TESTIMONIALS ===== */}
      {testimonialsSection}

      {/* ===== SECTION 6: COMPARISON ===== */}
      {comparisonSection}

      {/* ===== SECTION 7: CASE STUDIES ===== */}
      {caseStudiesDesktop}

      {/* ===== SECTION 8: GUARANTEE ===== */}
      {guaranteeSection}

      {/* ===== SECTION 9: FAQ ===== */}
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
