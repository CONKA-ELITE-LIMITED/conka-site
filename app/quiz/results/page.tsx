"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  QuizResultsOverview,
  QuizRecommendedSection,
} from "@/app/components/quiz";
import {
  StickyPurchaseFooter,
  StickyPurchaseFooterMobile,
} from "@/app/components/product";
import {
  calculateQuizResults,
  UserAnswers,
  QuizResult,
  ProtocolKey,
} from "@/app/lib/quizData";
import { ProtocolId, ProtocolTier, PurchaseType } from "@/app/lib/productData";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { getProtocolVariantId } from "@/app/lib/shopifyProductMapping";
import {
  trackQuizResultsViewed,
  trackQuizResultCTAClicked,
  getQuizSessionId,
} from "@/app/lib/analytics";

export default function QuizResultsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const recommendedSectionRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolKey | null>(
    null,
  );
  const [selectedTier, setSelectedTier] = useState<ProtocolTier>("pro");
  const [purchaseType, setPurchaseType] =
    useState<PurchaseType>("subscription");
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load results from sessionStorage on mount
  useEffect(() => {
    const storedAnswers = sessionStorage.getItem("quizAnswers");

    if (!storedAnswers) {
      // No answers found, redirect back to quiz
      router.push("/quiz");
      return;
    }

    try {
      const answers: UserAnswers = JSON.parse(storedAnswers);
      const calculatedResults = calculateQuizResults(answers);
      setResults(calculatedResults);

      // Set the recommended protocol (first in sorted results)
      if (calculatedResults.length > 0) {
        setSelectedProtocol(calculatedResults[0].protocolId);

        // Adjust tier for Protocol 4 (no starter)
        if (
          calculatedResults[0].protocolNumber === "4" &&
          selectedTier === "starter"
        ) {
          setSelectedTier("pro");
        }
      }

      setIsLoaded(true);
    } catch {
      router.push("/quiz");
    }
  }, [router, selectedTier]);

  // Track results viewed (Phase 1A)
  useEffect(() => {
    if (!isLoaded || results.length === 0) return;

    const sessionId = sessionStorage.getItem("quizSessionId");
    if (!sessionId) return;

    const recommendedProtocol = results[0].protocolId.replace(
      "protocol",
      "",
    ) as "1" | "2" | "3" | "4";

    // Calculate quiz completion time
    let quizCompletionTime = 0;
    const startTime = sessionStorage.getItem("quizStartTime");
    if (startTime) {
      quizCompletionTime = Math.floor(
        (Date.now() - parseInt(startTime)) / 1000,
      );
    }

    // Store results view time for CTA click tracking
    sessionStorage.setItem("quizResultsViewTime", Date.now().toString());

    trackQuizResultsViewed({
      recommendedProtocol,
      topMatchScore: results[0].percentage,
      sessionId,
      allProtocolScores: results.map((r) => ({
        protocolId: r.protocolId,
        percentage: r.percentage,
        totalPoints: r.totalPoints,
      })),
      quizCompletionTime,
    });
  }, [isLoaded, results]);

  // Show sticky footer when scrolling to recommended section
  useEffect(() => {
    const handleScroll = () => {
      if (recommendedSectionRef.current) {
        const rect = recommendedSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setShowStickyFooter(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Adjust tier when protocol changes (Protocol 4 has no starter)
  useEffect(() => {
    if (selectedProtocol === "protocol4" && selectedTier === "starter") {
      setSelectedTier("pro");
    }
  }, [selectedProtocol, selectedTier]);

  const handleProtocolSelect = (protocolId: ProtocolKey) => {
    setSelectedProtocol(protocolId);

    // Track CTA click (Phase 1B)
    const sessionId = sessionStorage.getItem("quizSessionId");
    const recommendedProtocol = results[0]?.protocolId.replace(
      "protocol",
      "",
    ) as "1" | "2" | "3" | "4" | undefined;
    if (sessionId && recommendedProtocol) {
      trackQuizResultCTAClicked({
        recommendedProtocol,
        ctaType: "view_protocol",
        sessionId,
        location: "results_page",
        destination: protocolId.replace("protocol", ""),
        topMatchScore: results[0]?.percentage || 0,
      });
    }

    // Scroll to recommended section
    setTimeout(() => {
      recommendedSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAddToCart = async (
    location: "results_page" | "sticky_footer" = "results_page",
  ) => {
    if (protocolId) {
      // Track CTA click (Phase 1B)
      const sessionId = sessionStorage.getItem("quizSessionId");
      const recommendedProtocol = results[0]?.protocolId.replace(
        "protocol",
        "",
      ) as "1" | "2" | "3" | "4" | undefined;
      if (sessionId && recommendedProtocol) {
        trackQuizResultCTAClicked({
          recommendedProtocol,
          ctaType: "add_to_cart",
          sessionId,
          location,
          destination: protocolId,
          topMatchScore: results[0]?.percentage || 0,
        });
      }

      const variantData = getProtocolVariantId(
        protocolId,
        selectedTier,
        purchaseType,
      );
      if (variantData) {
        await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
          location: location,
          source: "quiz",
          sessionId: getQuizSessionId(),
        });
      } else {
        console.warn("Variant ID not configured for:", {
          protocol: protocolId,
          tier: selectedTier,
          type: purchaseType,
        });
      }
    }
  };

  const recommendedProtocol =
    selectedProtocol || (results[0]?.protocolId ?? null);
  const protocolId = recommendedProtocol?.replace(
    "protocol",
    "",
  ) as ProtocolId | null;

  // Show loading state while checking for answers
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-current/20 border-t-current rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm opacity-60">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen theme-conka-flow"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navigation />

      {/* Results Content */}
      <main className="pt-4 lg:pt-24 pb-24">
        {/* Results Overview */}
        <QuizResultsOverview
          results={results}
          onProtocolSelect={handleProtocolSelect}
          selectedProtocol={selectedProtocol}
        />

        {/* Dynamic Recommended Section */}
        {recommendedProtocol && (
          <div ref={recommendedSectionRef}>
            <QuizRecommendedSection
              protocolKey={recommendedProtocol}
              selectedTier={selectedTier}
              onTierSelect={setSelectedTier}
              purchaseType={purchaseType}
              onPurchaseTypeChange={setPurchaseType}
              onAddToCart={() => handleAddToCart("results_page")}
            />
          </div>
        )}

        {/* Retake Quiz CTA */}
        <section className="px-4 md:px-8 py-12 text-center">
          <p className="font-commentary text-base opacity-60 mb-4">
            Not sure about your results?
          </p>
          <button
            onClick={() => {
              // Track CTA click (Phase 1B)
              const sessionId = sessionStorage.getItem("quizSessionId");
              const recommendedProtocol = results[0]?.protocolId.replace(
                "protocol",
                "",
              ) as "1" | "2" | "3" | "4" | undefined;
              if (sessionId && recommendedProtocol) {
                trackQuizResultCTAClicked({
                  recommendedProtocol,
                  ctaType: "retake_quiz",
                  sessionId,
                  location: "results_page",
                  topMatchScore: results[0]?.percentage || 0,
                });
              }

              sessionStorage.removeItem("quizAnswers");
              router.push("/quiz");
            }}
            className="neo-button-outline px-6 py-3 font-bold"
          >
            Retake Quiz
          </button>
        </section>

        <Footer />
      </main>

      {/* Sticky Purchase Footer (only when recommended section is visible) */}
      {showStickyFooter &&
        protocolId &&
        (isMobile ? (
          <StickyPurchaseFooterMobile
            protocolId={protocolId}
            selectedTier={selectedTier}
            onTierSelect={setSelectedTier}
            purchaseType={purchaseType}
            onAddToCart={() => handleAddToCart("sticky_footer")}
          />
        ) : (
          <StickyPurchaseFooter
            protocolId={protocolId}
            selectedTier={selectedTier}
            onTierSelect={setSelectedTier}
            purchaseType={purchaseType}
            onPurchaseTypeChange={setPurchaseType}
            onAddToCart={() => handleAddToCart("sticky_footer")}
          />
        ))}
    </div>
  );
}
