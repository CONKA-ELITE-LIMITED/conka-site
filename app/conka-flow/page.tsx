"use client";

import { useState, useEffect } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  ProductHero,
  ProductHeroMobile,
  FormulaIngredients,
  FormulaBenefits,
  FormulaBenefitsStats,
  FormulaBenefitsMobile,
  FormulaFAQ,
  HowItWorks,
  StickyPurchaseFooter,
  StickyPurchaseFooterMobile,
} from "@/app/components/product";
import WhatToExpect from "@/app/components/home/WhatToExpect";
import { FormulaCaseStudiesMobile } from "@/app/components/FormulaCaseStudies";
import FormulaCaseStudies from "@/app/components/FormulaCaseStudies";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { getAddToCartSource, getQuizSessionId } from "@/app/lib/analytics";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";
import LandingTestimonials from "@/app/components/landing/LandingTestimonials";
import ProductGrid from "@/app/components/home/ProductGrid";
import {
  CadenceType,
  getCadenceVariantByFormula,
  getCadencePricingByFormula,
} from "@/app/lib/cadenceData";

export default function ConkaFlowPage() {
  const isMobile = useIsMobile();
  const [selectedCadence, setSelectedCadence] = useState<CadenceType>("monthly-sub");
  const { addToCart } = useCart();

  const cadencePrice = getCadencePricingByFormula("01", selectedCadence).price;

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

  const handleAddToCart = async (location: "hero" | "sticky_footer") => {
    const variantData = getCadenceVariantByFormula("01", selectedCadence);
    if (variantData?.variantId) {
      await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
        location,
        source: getAddToCartSource() === "quiz" ? "quiz" : "product_page",
        sessionId: getQuizSessionId(),
      });
    } else {
      console.warn("Variant not configured for:", { formula: "01", cadence: selectedCadence });
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
            />
          </div>
        </section>

        {/* ===== SECTION 2: BENEFITS STATS ===== */}
        <section id="benefits-stats" className="brand-section brand-bg-tint" aria-labelledby="benefits-stats-heading">
          <div className="brand-track">
            <FormulaBenefitsStats formulaId="01" />
          </div>
        </section>

        {/* ===== SECTION 3: TESTIMONIALS ===== */}
        <section id="testimonials" className="brand-section brand-bg-white" aria-label="Customer reviews">
          <div className="brand-track">
            <LandingTestimonials hideCTA />
          </div>
        </section>

        {/* ===== SECTION 4: INGREDIENTS ===== */}
        <section id="ingredients" className="brand-section brand-bg-tint" aria-label="Formula ingredients">
          <div className="brand-track">
            <FormulaIngredients formulaId="01" />
          </div>
        </section>

        {/* ===== SECTION 5: FORMULA BENEFITS ===== */}
        <section id="proof-and-science" className="brand-section brand-bg-white" aria-labelledby="proof-and-science-heading">
          <div className="brand-track">
            <FormulaBenefitsMobile formulaId="01" />
          </div>
        </section>

        {/* ===== SECTION 6: WHAT TO EXPECT ===== */}
        <section id="what-to-expect" className="brand-section brand-bg-tint" aria-label="What to expect">
          <div className="brand-track">
            <WhatToExpect productId="01" />
          </div>
        </section>

        {/* ===== SECTION 7: HOW IT WORKS ===== */}
        <section id="how-it-works" className="brand-section brand-bg-white" aria-labelledby="how-it-works-heading">
          <div className="brand-track">
            <HowItWorks formulaId="01" />
          </div>
        </section>

        {/* ===== SECTION 8: CASE STUDIES ===== */}
        <section id="case-studies" className="brand-section brand-bg-tint" aria-label="CONKA Case Studies">
          <div className="brand-track">
            <FormulaCaseStudiesMobile formulaId="01" />
          </div>
        </section>

        {/* ===== SECTION 9: FAQ ===== */}
        <section id="faq" className="brand-section brand-bg-white" aria-label="FAQ">
          <div className="brand-track">
            <FormulaFAQ formulaId="01" />
          </div>
        </section>

        {/* ===== SECTION 10: EXPLORE ===== */}
        <section id="explore" className="brand-section brand-bg-tint" aria-label="Explore other protocols and formulas">
          <div className="brand-track">
            <ProductGrid exclude={["flow"]} />
          </div>
        </section>

        <StickyPurchaseFooterMobile
          formulaId="01"
          selectedCadence={selectedCadence}
          cadencePrice={cadencePrice}
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
          />
        </div>
      </section>

      {/* ===== SECTION 2: BENEFITS STATS ===== */}
      <section id="benefits-stats" className="brand-section brand-bg-tint" aria-labelledby="benefits-stats-heading">
        <div className="brand-track">
          <FormulaBenefitsStats formulaId="01" />
        </div>
      </section>

      {/* ===== SECTION 3: TESTIMONIALS ===== */}
      <section id="testimonials" className="brand-section brand-bg-white" aria-label="Customer reviews">
        <div className="brand-track">
          <LandingTestimonials hideCTA />
        </div>
      </section>

      {/* ===== SECTION 4: INGREDIENTS ===== */}
      <section id="ingredients" className="brand-section brand-bg-tint" aria-label="Formula ingredients">
        <div className="brand-track">
          <FormulaIngredients formulaId="01" />
        </div>
      </section>

      {/* ===== SECTION 5: FORMULA BENEFITS ===== */}
      <section id="proof-and-science" className="brand-section brand-bg-white" aria-labelledby="proof-and-science-heading">
        <div className="brand-track">
          <FormulaBenefits formulaId="01" />
        </div>
      </section>

      {/* ===== SECTION 6: WHAT TO EXPECT ===== */}
      <section id="what-to-expect" className="brand-section brand-bg-tint" aria-label="What to expect">
        <div className="brand-track">
          <WhatToExpect productId="01" />
        </div>
      </section>

      {/* ===== SECTION 7: HOW IT WORKS ===== */}
      <section id="how-it-works" className="brand-section brand-bg-white" aria-labelledby="how-it-works-heading">
        <div className="brand-track">
          <HowItWorks formulaId="01" />
        </div>
      </section>

      {/* ===== SECTION 8: CASE STUDIES ===== */}
      <section id="case-studies" className="brand-section brand-bg-tint" aria-label="CONKA Case Studies">
        <div className="brand-track">
          <FormulaCaseStudies formulaId="01" />
        </div>
      </section>

      {/* ===== SECTION 9: FAQ ===== */}
      <section id="faq" className="brand-section brand-bg-white" aria-label="FAQ">
        <div className="brand-track">
          <FormulaFAQ formulaId="01" />
        </div>
      </section>

      {/* ===== SECTION 10: EXPLORE ===== */}
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
