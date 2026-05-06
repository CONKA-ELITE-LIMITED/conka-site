"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ProductHero from "@/app/components/product/ProductHero";
import ProductHeroMobile from "@/app/components/product/ProductHeroMobile";
import {
  StickyPurchaseFooter,
  StickyPurchaseFooterMobile,
} from "@/app/components/product";
import LandingProductShowcase from "@/app/components/landing/LandingProductShowcase";
import WhyConkaWorks from "@/app/components/WhyConkaWorks";
import FormulaCaseStudies, {
  FormulaCaseStudiesMobile,
} from "@/app/components/FormulaCaseStudies";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import LabTimeline from "@/app/components/landing/LabTimeline";
import LabFAQ from "@/app/components/landing/LabFAQ";
import ProductGrid from "@/app/components/home/ProductGrid";
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

  const whyConkaWorksSection = (
    <section
      className="brand-section brand-bg-white"
      aria-label="Why CONKA works"
    >
      <div className="brand-track">
        <WhyConkaWorks />
      </div>
    </section>
  );

  const whatItDoesSection = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="What CONKA does"
    >
      <div className="brand-track">
        <LandingProductShowcase />
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

  const exploreSection = (
    <section
      className="brand-section brand-bg-white"
      aria-label="Explore Flow and Clear individually"
    >
      <div className="brand-track">
        <ProductGrid exclude={["protocol"]} />
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

        {/* ===== SECTION 2: CASE STUDIES ===== */}
        {caseStudiesMobile}

        {/* ===== SECTION 3: TIMELINE ===== */}
        {timelineSection}

        {/* ===== SECTION 4: TESTIMONIALS ===== */}
        {testimonialsSection}

        {/* ===== SECTION 5: WHY CONKA WORKS ===== */}
        {whyConkaWorksSection}

        {/* ===== SECTION 6: WHAT CONKA DOES ===== */}
        {whatItDoesSection}

        {/* ===== SECTION 7: GUARANTEE ===== */}
        {guaranteeSection}

        {/* ===== SECTION 8: FAQ ===== */}
        {faqSection}

        {/* ===== SECTION 9: EXPLORE ===== */}
        {exploreSection}

        <Footer />

        <StickyPurchaseFooterMobile
          protocolId="3"
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

      {/* ===== SECTION 2: CASE STUDIES ===== */}
      {caseStudiesDesktop}

      {/* ===== SECTION 3: TIMELINE ===== */}
      {timelineSection}

      {/* ===== SECTION 4: TESTIMONIALS ===== */}
      {testimonialsSection}

      {/* ===== SECTION 5: WHY CONKA WORKS ===== */}
      {whyConkaWorksSection}

      {/* ===== SECTION 6: WHAT CONKA DOES ===== */}
      {whatItDoesSection}

      {/* ===== SECTION 7: GUARANTEE ===== */}
      {guaranteeSection}

      {/* ===== SECTION 8: FAQ ===== */}
      {faqSection}

      {/* ===== SECTION 9: EXPLORE ===== */}
      {exploreSection}

      <Footer />

      <StickyPurchaseFooter
        protocolId="3"
        selectedCadence={selectedCadence}
        cadencePrice={cadencePrice}
        onAddToCart={() => handleAddToCart("sticky_footer")}
      />
    </div>
  );
}
