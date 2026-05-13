"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  ProtocolHero,
  ProtocolHeroMobile,
  ProtocolCalendar,
  ProtocolCalendarMobile,
} from "@/app/components/protocol";
import {
  StickyPurchaseFooter,
  StickyPurchaseFooterMobile,
} from "@/app/components/product";
import {
  ProtocolId,
  ProtocolTier,
  PurchaseType,
  protocolContent,
} from "@/app/lib/productData";
import {
  CadenceType,
  getBalanceCadenceVariant,
  getBalanceCadencePricing,
} from "@/app/lib/cadenceData";
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
import { getProtocolVariantId } from "@/app/lib/shopifyProductMapping";
import { getAddToCartSource, getQuizSessionId } from "@/app/lib/analytics";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";

// Valid protocol IDs
const validProtocolIds: ProtocolId[] = ["1", "2", "3", "4"];

const DEFAULT_PROTOCOL_ID: ProtocolId = "3";

export default function ProtocolPage() {
  const params = useParams();
  const router = useRouter();
  const idFromParams = params.id as string;
  const isMobile = useIsMobile();
  const { addToCart } = useCart();

  const [selectedProtocolId, setSelectedProtocolId] = useState<ProtocolId>(
    () =>
      validProtocolIds.includes(idFromParams as ProtocolId)
        ? (idFromParams as ProtocolId)
        : DEFAULT_PROTOCOL_ID,
  );
  const [selectedTier, setSelectedTier] = useState<ProtocolTier>("pro");
  const [purchaseType, setPurchaseType] =
    useState<PurchaseType>("subscription");
  // Cadence state for Balance (protocol 3) -- used instead of tier/purchaseType
  const [selectedCadence, setSelectedCadence] =
    useState<CadenceType>("monthly-sub");

  // Validate protocol ID from URL and redirect invalid to Balance
  useEffect(() => {
    if (!validProtocolIds.includes(idFromParams as ProtocolId)) {
      router.push("/protocol/3");
    }
  }, [idFromParams, router]);

  // Sync selected protocol from URL when navigating (e.g. back/forward or direct link)
  useEffect(() => {
    if (validProtocolIds.includes(idFromParams as ProtocolId)) {
      setSelectedProtocolId(idFromParams as ProtocolId);
    }
  }, [idFromParams]);

  const protocol = protocolContent[selectedProtocolId];

  // Set default tier based on protocol (Protocol 4 doesn't have starter)
  useEffect(() => {
    if (selectedProtocolId === "4" && selectedTier === "starter") {
      setSelectedTier("pro");
    }
  }, [selectedProtocolId, selectedTier]);

  // Meta ViewContent on initial load and when selected protocol changes
  useEffect(() => {
    if (!protocol) return;
    // Balance uses cadence variant IDs (funnel products); other protocols use legacy variant IDs
    if (selectedProtocolId === "3") {
      const variantData = getBalanceCadenceVariant("monthly-sub");
      if (variantData?.variantId) {
        trackMetaViewContent({
          content_ids: [toContentId(variantData.variantId)],
          content_name: protocol.name,
          content_type: "product",
        });
      }
    } else {
      const variantData = getProtocolVariantId(
        selectedProtocolId,
        "pro",
        "subscription",
      );
      if (variantData?.variantId) {
        trackMetaViewContent({
          content_ids: [toContentId(variantData.variantId)],
          content_name: protocol.name,
          content_type: "product",
        });
      }
    }
  }, [selectedProtocolId, protocol]);

  if (!protocol) {
    return null; // Will redirect
  }

  // Hero section handler
  const handleAddToCartFromHero = async () => {
    if (selectedProtocolId === "3") {
      const variantData = getBalanceCadenceVariant(selectedCadence);
      if (variantData?.variantId) {
        await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
          location: "hero",
          source: getAddToCartSource() === "quiz" ? "quiz" : "protocol_page",
          sessionId: getQuizSessionId(),
        });
      } else {
        console.warn("Variant not configured for:", {
          protocol: "3",
          cadence: selectedCadence,
        });
      }
    } else {
      const variantData = getProtocolVariantId(
        selectedProtocolId,
        selectedTier,
        purchaseType,
      );
      if (variantData?.variantId) {
        await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
          location: "hero",
          source: getAddToCartSource() === "quiz" ? "quiz" : "protocol_page",
          sessionId: getQuizSessionId(),
        });
      } else {
        console.warn("Variant ID not configured for:", {
          protocol: selectedProtocolId,
          tier: selectedTier,
          type: purchaseType,
        });
      }
    }
  };

  // Sticky footer handler
  const handleAddToCartFromFooter = async () => {
    if (selectedProtocolId === "3") {
      const variantData = getBalanceCadenceVariant(selectedCadence);
      if (variantData?.variantId) {
        await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
          location: "sticky_footer",
          source: getAddToCartSource() === "quiz" ? "quiz" : "protocol_page",
          sessionId: getQuizSessionId(),
        });
      } else {
        console.warn("Variant not configured for:", {
          protocol: "3",
          cadence: selectedCadence,
        });
      }
    } else {
      const variantData = getProtocolVariantId(
        selectedProtocolId,
        selectedTier,
        purchaseType,
      );
      if (variantData?.variantId) {
        await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
          location: "sticky_footer",
          source: getAddToCartSource() === "quiz" ? "quiz" : "protocol_page",
          sessionId: getQuizSessionId(),
        });
      } else {
        console.warn("Variant ID not configured for:", {
          protocol: selectedProtocolId,
          tier: selectedTier,
          type: purchaseType,
        });
      }
    }
  };

  // Navigate to a different protocol (ratio selector for non-Balance)
  const handleProtocolChange = (id: ProtocolId) => {
    router.push(`/protocol/${id}`);
  };

  // Shared sections used by both mobile and desktop
  const testimonialSection = (
    <section
      className="brand-section brand-bg-white"
      aria-label="Customer reviews"
    >
      <div className="brand-track">
        <LandingTestimonials hideCTA />
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

  const whyConkaWorksSection = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="Why CONKA works"
    >
      <div className="brand-track">
        <WhyConkaWorks />
      </div>
    </section>
  );

  const caseStudiesSectionDesktop = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="Clinically validated results"
    >
      <div className="brand-track">
        <FormulaCaseStudies productId={selectedProtocolId} />
      </div>
    </section>
  );

  const caseStudiesSectionMobile = (
    <section
      className="brand-section brand-bg-tint"
      aria-label="Clinically validated results"
    >
      <div className="brand-track">
        <FormulaCaseStudiesMobile productId={selectedProtocolId} />
      </div>
    </section>
  );

  const guaranteeSection = (
    <section
      className="brand-section brand-bg-white"
      aria-label="Risk-free guarantee"
    >
      <div className="brand-track">
        <LabGuarantee
          ctaLabel="Learn more about the CONKA app"
          ctaHref="/app"
        />
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
      aria-label="Explore other protocols and formulas"
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
            <ProtocolHeroMobile
              protocolId={selectedProtocolId}
              selectedTier={selectedTier}
              onTierSelect={setSelectedTier}
              purchaseType={purchaseType}
              onPurchaseTypeChange={setPurchaseType}
              onAddToCart={handleAddToCartFromHero}
              onProtocolChange={
                selectedProtocolId !== "3" ? handleProtocolChange : undefined
              }
              selectedCadence={
                selectedProtocolId === "3" ? selectedCadence : undefined
              }
              onCadenceChange={
                selectedProtocolId === "3" ? setSelectedCadence : undefined
              }
            />
          </div>
        </section>

        {/* ===== CASE STUDIES ===== */}
        {caseStudiesSectionMobile}

        {/* ===== TIMELINE ===== */}
        {timelineSection}

        {/* ===== TESTIMONIALS ===== */}
        {testimonialSection}

        {/* ===== WHY CONKA WORKS ===== */}
        {whyConkaWorksSection}

        {/* ===== WHAT CONKA DOES ===== */}
        {whatItDoesSection}

        {/* ===== CALENDAR (hidden for Balance) ===== */}
        {selectedProtocolId !== "3" && (
          <section
            className="brand-section brand-bg-tint"
            aria-label="How to follow your protocol"
          >
            <div className="brand-track">
              <ProtocolCalendarMobile
                protocolId={selectedProtocolId}
                selectedTier={selectedTier}
                onTierSelect={setSelectedTier}
                availableTiers={
                  protocolContent[selectedProtocolId].availableTiers
                }
              />
            </div>
          </section>
        )}

        {/* ===== GUARANTEE ===== */}
        {guaranteeSection}

        {/* ===== FAQ ===== */}
        {faqSection}

        {/* ===== EXPLORE ===== */}
        {exploreSection}

        <Footer />

        <StickyPurchaseFooterMobile
          protocolId={selectedProtocolId}
          selectedTier={selectedTier}
          onTierSelect={setSelectedTier}
          purchaseType={purchaseType}
          selectedCadence={
            selectedProtocolId === "3" ? selectedCadence : undefined
          }
          cadencePrice={
            selectedProtocolId === "3"
              ? getBalanceCadencePricing(selectedCadence).price
              : undefined
          }
          onAddToCart={handleAddToCartFromFooter}
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
          <ProtocolHero
            protocolId={selectedProtocolId}
            selectedTier={selectedTier}
            onTierSelect={setSelectedTier}
            purchaseType={purchaseType}
            onPurchaseTypeChange={setPurchaseType}
            onAddToCart={handleAddToCartFromHero}
            onProtocolChange={
              selectedProtocolId !== "3" ? handleProtocolChange : undefined
            }
            selectedCadence={
              selectedProtocolId === "3" ? selectedCadence : undefined
            }
            onCadenceChange={
              selectedProtocolId === "3" ? setSelectedCadence : undefined
            }
          />
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      {caseStudiesSectionDesktop}

      {/* ===== TIMELINE ===== */}
      {timelineSection}

      {/* ===== TESTIMONIALS ===== */}
      {testimonialSection}

      {/* ===== WHY CONKA WORKS ===== */}
      {whyConkaWorksSection}

      {/* ===== WHAT CONKA DOES ===== */}
      {whatItDoesSection}

      {/* ===== CALENDAR (hidden for Balance) ===== */}
      {selectedProtocolId !== "3" && (
        <section
          className="brand-section brand-bg-tint"
          aria-label="How to follow your protocol"
        >
          <div className="brand-track">
            <ProtocolCalendar
              protocolId={selectedProtocolId}
              selectedTier={selectedTier}
              onTierSelect={setSelectedTier}
              availableTiers={
                protocolContent[selectedProtocolId].availableTiers
              }
            />
          </div>
        </section>
      )}

      {/* ===== GUARANTEE ===== */}
      {guaranteeSection}

      {/* ===== FAQ ===== */}
      {faqSection}

      {/* ===== EXPLORE ===== */}
      {exploreSection}

      <Footer />

      <StickyPurchaseFooter
        protocolId={selectedProtocolId}
        selectedTier={selectedTier}
        onTierSelect={setSelectedTier}
        purchaseType={purchaseType}
        onPurchaseTypeChange={setPurchaseType}
        selectedCadence={
          selectedProtocolId === "3" ? selectedCadence : undefined
        }
        cadencePrice={
          selectedProtocolId === "3"
            ? getBalanceCadencePricing(selectedCadence).price
            : undefined
        }
        onAddToCart={handleAddToCartFromFooter}
      />
    </div>
  );
}
