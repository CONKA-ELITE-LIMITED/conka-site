"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  ProductHero,
  ProductHeroMobile,
  ClinicalIngredients,
  FormulaBenefitsPillars,
  ProductWhatYouGet,
  FormulaFAQ,
  StickyPurchaseFooter,
  StickyPurchaseFooterMobile,
} from "@/app/components/product";
import WhatToExpect from "@/app/components/home/WhatToExpect";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import LandingValueComparison from "@/app/components/landing/LandingValueComparison";
import LabGuarantee from "@/app/components/landing/LabGuarantee";
import CROTestimonials from "@/app/components/cro/CROTestimonials";
import ProductGrid from "@/app/components/home/ProductGrid";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { getAddToCartSource, getQuizSessionId } from "@/app/lib/analytics";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";
import {
  CadenceType,
  getCadenceVariantByFormula,
  getCadencePricingByFormula,
} from "@/app/lib/cadenceData";

export default function ConkaFlowPage() {
  const isMobile = useIsMobile();
  const [selectedCadence, setSelectedCadence] = useState<CadenceType>("monthly-sub");
  const { addToCart } = useCart();

  const cadencePricing = getCadencePricingByFormula("01", selectedCadence);
  const cadencePrice = cadencePricing.price;
  const cadenceCompareAtPrice = cadencePricing.compareAtPrice;

  // Meta ViewContent (once per page view; stable variant ID for Meta)
  useEffect(() => {
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
        source: getAddToCartSource() === "quiz" ? "quiz" : "product_page",
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for:", { formula: "01", cadence });
    }
  };

  // Mobile version
  if (isMobile) {
    return (
      <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
        <Navigation />

        {/* ===== SECTION 1: HERO ===== */}
        <section id="hero" className="brand-section brand-hero-first brand-bg-white" aria-label="Product hero">
          <div className="brand-track">
            <ProductHeroMobile
              formulaId="01"
              selectedCadence={selectedCadence}
              onCadenceChange={setSelectedCadence}
              onAddToCart={() => handleAddToCart("hero")}
              onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
            />
          </div>
        </section>

        {/* ===== SECTION 2: BENEFITS PILLARS ===== */}
        <section id="benefits" className="brand-section brand-bg-tint" aria-label="Daily benefits">
          <div className="brand-track">
            <FormulaBenefitsPillars formulaId="01" />
          </div>
        </section>

        {/* TODO Phase 3: FormulaQualityBadges section goes here (Informed Sport, vegan, etc.). */}

        {/* ===== SECTION 4: INGREDIENTS ===== */}
        <section id="ingredients" className="brand-section brand-bg-white" aria-label="Formula ingredients">
          <div className="brand-track">
            <ClinicalIngredients formulaIds={["01"]} />
          </div>
        </section>

        {/* ===== SECTION 5: WHAT YOU GET ===== */}
        <section id="what-you-get" className="brand-section brand-bg-tint" aria-label="What ships with your order">
          <div className="brand-track">
            <ProductWhatYouGet formulaId="01" />
          </div>
        </section>

        {/* ===== SECTION 6: WHAT TO EXPECT ===== */}
        <section id="what-to-expect" className="brand-section brand-bg-tint" aria-label="What to expect">
          <div className="brand-track">
            <WhatToExpect productId="01" />
          </div>
        </section>

        {/* ===== SECTION 7: ANCHOR ATHLETE ===== */}
        <section id="athletes" className="brand-section brand-bg-white" aria-label="Athletes who use CONKA">
          <div className="brand-track">
            <AthleteCredibilityCarousel />
          </div>
        </section>

        {/* ===== SECTION 8: COMPARISON (Balance upsell to /conka-both) ===== */}
        <section id="comparison" className="brand-section brand-bg-tint" aria-label="CONKA vs coffee comparison">
          <div className="brand-track">
            <LandingValueComparison ctaHref="/conka-both" ctaLabel="Try the full system" />
          </div>
        </section>

        {/* ===== SECTION 9: GUARANTEE ===== */}
        <section id="guarantee" className="brand-section brand-bg-white" aria-label="Risk-free guarantee">
          <div className="brand-track">
            <LabGuarantee />
          </div>
        </section>

        {/* ===== SECTION 10: REVIEWS CHORUS ===== */}
        <section id="testimonials" className="brand-section brand-bg-tint" aria-label="Customer reviews">
          <div className="brand-track">
            <CROTestimonials hideCTA />
          </div>
        </section>

        {/* ===== SECTION 11: FAQ ===== */}
        <section id="faq" className="brand-section brand-bg-white" aria-label="FAQ">
          <div className="brand-track">
            <FormulaFAQ formulaId="01" />
          </div>
        </section>

        {/* ===== SECTION 12: EXPLORE ===== */}
        <section id="explore" className="brand-section brand-bg-tint" aria-label="Explore other protocols and formulas">
          <div className="brand-track">
            <ProductGrid exclude={["flow"]} />
          </div>
        </section>

        <StickyPurchaseFooterMobile
          formulaId="01"
          selectedCadence={selectedCadence}
          cadencePrice={cadencePrice}
          cadenceCompareAtPrice={cadenceCompareAtPrice}
          onAddToCart={() => handleAddToCart("sticky_footer")}
        />

        <Footer />
      </div>
    );
  }

  // Desktop version
  return (
    <div className="brand-clinical min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      <Navigation />

      {/* ===== SECTION 1: HERO ===== */}
      <section id="hero" className="brand-section brand-hero-first brand-bg-white" aria-label="Product hero">
        <div className="brand-track">
          <ProductHero
            formulaId="01"
            selectedCadence={selectedCadence}
            onCadenceChange={setSelectedCadence}
            onAddToCart={() => handleAddToCart("hero")}
            onOtpAddToCart={() => handleAddToCart("hero", "monthly-otp")}
          />
        </div>
      </section>

      {/* ===== SECTION 2: BENEFITS PILLARS ===== */}
      <section id="benefits" className="brand-section brand-bg-tint" aria-label="Daily benefits">
        <div className="brand-track">
          <FormulaBenefitsPillars formulaId="01" />
        </div>
      </section>

      {/* TODO Phase 3: FormulaQualityBadges section goes here (Informed Sport, vegan, etc.). */}

      {/* ===== SECTION 4: INGREDIENTS ===== */}
      <section id="ingredients" className="brand-section brand-bg-white" aria-label="Formula ingredients">
        <div className="brand-track">
          <ClinicalIngredients formulaIds={["01"]} />
        </div>
      </section>

      {/* ===== SECTION 5: WHAT YOU GET ===== */}
      <section id="what-you-get" className="brand-section brand-bg-tint" aria-label="What ships with your order">
        <div className="brand-track">
          <ProductWhatYouGet formulaId="01" />
        </div>
      </section>

      {/* ===== SECTION 6: WHAT TO EXPECT ===== */}
      <section id="what-to-expect" className="brand-section brand-bg-tint" aria-label="What to expect">
        <div className="brand-track">
          <WhatToExpect productId="01" />
        </div>
      </section>

      {/* ===== SECTION 7: ANCHOR ATHLETE ===== */}
      <section id="athletes" className="brand-section brand-bg-white" aria-label="Athletes who use CONKA">
        <div className="brand-track">
          <AthleteCredibilityCarousel />
        </div>
      </section>

      {/* ===== SECTION 8: COMPARISON (Balance upsell to /conka-both) ===== */}
      <section id="comparison" className="brand-section brand-bg-tint" aria-label="CONKA vs coffee comparison">
        <div className="brand-track">
          <LandingValueComparison ctaHref="/conka-both" ctaLabel="Try the full system" />
        </div>
      </section>

      {/* ===== SECTION 9: GUARANTEE ===== */}
      <section id="guarantee" className="brand-section brand-bg-white" aria-label="Risk-free guarantee">
        <div className="brand-track">
          <LabGuarantee />
        </div>
      </section>

      {/* ===== SECTION 10: REVIEWS CHORUS ===== */}
      <section id="testimonials" className="brand-section brand-bg-tint" aria-label="Customer reviews">
        <div className="brand-track">
          <CROTestimonials hideCTA />
        </div>
      </section>

      {/* ===== SECTION 11: FAQ ===== */}
      <section id="faq" className="brand-section brand-bg-white" aria-label="FAQ">
        <div className="brand-track">
          <FormulaFAQ formulaId="01" />
        </div>
      </section>

      {/* ===== SECTION 12: EXPLORE ===== */}
      <section id="explore" className="brand-section brand-bg-tint" aria-label="Explore other protocols and formulas">
        <div className="brand-track">
          <ProductGrid exclude={["flow"]} />
        </div>
      </section>

      <StickyPurchaseFooter
        formulaId="01"
        selectedCadence={selectedCadence}
        cadencePrice={cadencePrice}
        onAddToCart={() => handleAddToCart("sticky_footer")}
      />

      <Footer />
    </div>
  );
}
