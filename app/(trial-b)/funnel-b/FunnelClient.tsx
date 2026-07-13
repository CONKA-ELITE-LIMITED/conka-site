"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import FunnelStepIndicator from "./components/FunnelStepIndicator";
import FunnelHeroAsset from "./components/FunnelHeroAsset";
import CadenceSelector from "./components/CadenceSelector";
import ProductSelector from "./components/ProductSelector";
import EducationStep from "./components/EducationStep";
import SummaryStep from "./components/SummaryStep";
import FunnelCTA from "./components/FunnelCTA";
import UpsellBottomSheet from "./components/UpsellBottomSheet";
import NutritionInfoModal from "./components/NutritionInfoModal";
import {
  type FunnelCadence,
  type FunnelProduct,
  type UpsellOffer,
  FUNNEL_PRODUCTS,
  getOfferPricing,
  getUpsellOffer,
} from "../lib/funnelData";
import {
  funnelCheckout,
  isFunnelCheckoutError,
} from "../lib/funnelCheckout";
import {
  trackFunnelCadenceChanged,
  trackFunnelCheckout,
  trackFunnelCheckoutFailed,
  trackFunnelCtaClicked,
  trackFunnelNutritionViewed,
  trackFunnelProductChanged,
  trackFunnelStepCompleted,
  trackFunnelUpsellAccepted,
  trackFunnelUpsellDeclined,
  trackFunnelUpsellDismissed,
  trackFunnelUpsellShown,
  trackFunnelViewed,
} from "@/app/lib/analytics";

type FunnelStep = 1 | 2 | 3 | 4;

/**
 * Identifies this funnel in the shared `funnel:*` taxonomy. funnel-b is a clone
 * of /funnel and fired identical event names, so the two were indistinguishable
 * in Vercel Analytics. The variant property separates them.
 */
const FUNNEL_VARIANT = "b" as const;

const DEFAULT_PRODUCT: FunnelProduct = "both";
const DEFAULT_CADENCE: FunnelCadence = "monthly-sub";

export default function FunnelClient() {
  const [currentStep, setCurrentStep] = useState<FunnelStep>(1);

  // Pre-selected defaults (highest LTV)
  const [product, setProduct] = useState<FunnelProduct>(DEFAULT_PRODUCT);
  const [cadence, setCadence] = useState<FunnelCadence>(DEFAULT_CADENCE);

  /**
   * Steps whose completion has already been counted. Steps are driven through
   * history.pushState, so a user who backs up via the step indicator and
   * re-advances would otherwise fire the same completion twice.
   */
  const completedSteps = useRef<Set<FunnelStep>>(new Set());

  // Checkout state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [upsellOffer, setUpsellOffer] = useState<UpsellOffer | null>(null);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackFunnelViewed({
      variant: FUNNEL_VARIANT,
      product: DEFAULT_PRODUCT,
      cadence: DEFAULT_CADENCE,
    });
  }, []);

  // Seed browser history so back button navigates within the funnel (not away from it)
  useEffect(() => {
    window.history.replaceState({ funnelStep: 1 }, "");
  }, []);

  // Handle browser back/forward within the funnel
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const step = event.state?.funnelStep as FunnelStep | undefined;
      if (step && ([1, 2, 3, 4] as FunnelStep[]).includes(step)) {
        setStepVisible(false);
        setTimeout(() => {
          setCurrentStep(step);
          setError(null);
          window.scrollTo({ top: 0, behavior: "instant" });
          requestAnimationFrame(() => setStepVisible(true));
        }, 150);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Reset checkout state when restored from bfcache (browser back from Shopify)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsCheckingOut(false);
        setError(null);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleProductChange = useCallback(
    (newProduct: FunnelProduct) => {
      setProduct(newProduct);
      setError(null);
      trackFunnelProductChanged({
        variant: FUNNEL_VARIANT,
        from: product,
        to: newProduct,
      });
    },
    [product],
  );

  const handleCadenceChange = useCallback(
    (newCadence: FunnelCadence) => {
      setCadence(newCadence);
      setError(null);
      trackFunnelCadenceChanged({
        variant: FUNNEL_VARIANT,
        from: cadence,
        to: newCadence,
      });
    },
    [cadence],
  );

  // Step transition animation
  const [stepVisible, setStepVisible] = useState(true);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const goToStep = useCallback((step: FunnelStep) => {
    setStepVisible(false);
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    transitionTimeout.current = setTimeout(() => {
      setCurrentStep(step);
      window.history.pushState({ funnelStep: step }, "");
      setError(null);
      window.scrollTo({ top: 0, behavior: "instant" });
      requestAnimationFrame(() => setStepVisible(true));
    }, 150);
  }, []);

  /**
   * Record a step completion exactly once, then advance.
   *
   * Only ever called from forward-intent handlers. It deliberately does NOT live
   * in `goToStep` (which the step indicator also uses to jump BACKWARD) or in an
   * effect on `currentStep` (popstate drives that, so browser back/forward would
   * re-fire it).
   */
  const advanceFrom = useCallback(
    (from: FunnelStep) => {
      if (!completedSteps.current.has(from)) {
        completedSteps.current.add(from);
        trackFunnelStepCompleted({
          variant: FUNNEL_VARIANT,
          step: from,
          product,
          cadence,
        });
      }
      goToStep((from + 1) as FunnelStep);
    },
    [product, cadence, goToStep],
  );

  const handleEducationNext = useCallback(() => advanceFrom(1), [advanceFrom]);
  const handleProductNext = useCallback(() => advanceFrom(2), [advanceFrom]);
  const handleCadenceNext = useCallback(() => advanceFrom(3), [advanceFrom]);

  // Checkout
  const proceedToCheckout = useCallback(
    async (
      finalProduct: FunnelProduct,
      finalCadence: FunnelCadence,
      upsellAccepted: boolean,
    ) => {
      setIsCheckingOut(true);
      setError(null);

      trackFunnelCheckout({
        variant: FUNNEL_VARIANT,
        product: finalProduct,
        cadence: finalCadence,
      });

      const result = await funnelCheckout({
        product: finalProduct,
        cadence: finalCadence,
        upsellAccepted,
      });

      if (isFunnelCheckoutError(result)) {
        trackFunnelCheckoutFailed({
          variant: FUNNEL_VARIANT,
          reason: result.error,
        });
        setError(result.error);
        setIsCheckingOut(false);
        return;
      }

      window.location.href = result.checkoutUrl;
    },
    [],
  );

  const handleCheckout = useCallback(() => {
    setError(null);

    trackFunnelCtaClicked({ variant: FUNNEL_VARIANT, product, cadence });

    const offer = getUpsellOffer(product, cadence);
    if (offer) {
      setUpsellOffer(offer);
      setIsUpsellOpen(true);
      trackFunnelUpsellShown({ variant: FUNNEL_VARIANT, product, cadence });
      return;
    }

    proceedToCheckout(product, cadence, false);
  }, [product, cadence, proceedToCheckout]);

  const handleUpsellAccept = useCallback(() => {
    if (!upsellOffer) return;
    // Report the UPGRADED offer, so the event reads as the outcome.
    trackFunnelUpsellAccepted({
      variant: FUNNEL_VARIANT,
      product: upsellOffer.upgradedProduct,
      cadence: upsellOffer.upgradedCadence,
    });
    setIsUpsellOpen(false);
    proceedToCheckout(upsellOffer.upgradedProduct, upsellOffer.upgradedCadence, true);
  }, [upsellOffer, proceedToCheckout]);

  const handleUpsellDecline = useCallback(() => {
    trackFunnelUpsellDeclined({ variant: FUNNEL_VARIANT, product, cadence });
    setIsUpsellOpen(false);
    proceedToCheckout(product, cadence, false);
  }, [product, cadence, proceedToCheckout]);

  const handleUpsellDismiss = useCallback(() => {
    trackFunnelUpsellDismissed({ variant: FUNNEL_VARIANT, product, cadence });
    setIsUpsellOpen(false);
  }, [product, cadence]);

  // CTA labels per step
  const productCTALabel = `Get ${product === "both" ? "Flow + Clear" : FUNNEL_PRODUCTS[product].name}`;
  const productCTASubLabel = FUNNEL_PRODUCTS[product].tagline;

  const { price: selectedPrice } = getOfferPricing(product, cadence);
  const priceSuffix = cadence === "monthly-sub" ? "/mo" : cadence === "quarterly-sub" ? "/quarter" : "";
  const formattedPrice = `£${selectedPrice.toFixed(2)}${priceSuffix}`;
  const reviewSubLabel = `${formattedPrice} · ${FUNNEL_PRODUCTS[product].label}`;

  return (
    <div className="brand-clinical min-h-screen bg-white text-[var(--brand-black)]">
      <FunnelStepIndicator
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      {/* Spacer for fixed header */}
      <div className="h-12 lg:h-14" />

      <main className="lg:flex lg:min-h-[calc(100vh-56px)]">
        {/* Desktop: Left column — sticky hero asset (kept compact so the plan
            column has room to breathe) */}
        <div className="hidden lg:flex lg:w-[44%] lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:items-center lg:justify-center lg:p-8 bg-[var(--brand-tint)]">
          <FunnelHeroAsset
            product={product}
            cadence={cadence}
            mode="carousel"
          />
        </div>

        {/* Right column — fills remaining space, content capped + centred so
            there's no awkward void on the right */}
        <div
          className="w-full lg:flex-1 lg:overflow-y-auto lg:px-12 lg:max-w-[52rem] lg:mx-auto transition-all duration-300"
          style={{
            opacity: stepVisible ? 1 : 0,
            transform: stepVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.985)",
          }}
        >
          {/* ===== STEP 1: Education ===== */}
          {currentStep === 1 && (
            <div className="px-5 pt-5 pb-6 lg:px-10 lg:pt-8">
              <EducationStep />
              <div className="h-36 lg:hidden" />
              <div className="hidden lg:block mt-6">
                <FunnelCTA
                  label="Choose my formula"
                  subLabel=""
                  highlightSubLabel={false}
                  onClick={handleEducationNext}
                  loading={false}
                  error={null}
                />
              </div>
            </div>
          )}

          {/* ===== STEP 2: Choose Product ===== */}
          {currentStep === 2 && (
            <>
              <div className="lg:hidden px-5 pt-5">
                <FunnelHeroAsset product={product} cadence={cadence} mode="carousel" />
              </div>

              <div className="px-5 pt-5 pb-6 lg:px-10 lg:pt-8">
                <ProductSelector
                  product={product}
                  onChange={handleProductChange}
                />
              </div>

              <div className="h-36 lg:hidden" />

              <div className="hidden lg:block px-10 pb-8">
                <FunnelCTA
                  label={productCTALabel}
                  subLabel={productCTASubLabel}
                  highlightSubLabel={product === "both"}
                  onClick={handleProductNext}
                  loading={false}
                  error={error}
                />
              </div>
            </>
          )}

          {/* ===== STEP 3: Choose Plan ===== */}
          {currentStep === 3 && (
            <>
              {/* Mobile: product confirmation bar */}
              <div className="lg:hidden mx-5 mt-5 flex items-center gap-3 px-4 py-3 bg-white border border-black/10">
                <Image
                  src={FUNNEL_PRODUCTS[product].thumbnail}
                  alt={FUNNEL_PRODUCTS[product].label}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/45">
                    You chose
                  </p>
                  <p className="text-sm font-semibold text-[var(--brand-black)] truncate">
                    {FUNNEL_PRODUCTS[product].label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="lab-clip-tr inline-flex items-center gap-1.5 bg-[#1B2757] text-white font-mono text-[10px] font-bold uppercase tracking-[0.14em] leading-none px-3 py-2 shrink-0 hover:opacity-85 active:opacity-70 transition-opacity"
                >
                  Change
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden>
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="px-5 pt-5 pb-6 lg:px-10 lg:pt-8">
                <CadenceSelector
                  cadence={cadence}
                  product={product}
                  onChange={handleCadenceChange}
                />
              </div>

              <div className="px-5 pb-4 lg:px-10 lg:pb-6">
                <button
                  type="button"
                  onClick={() => {
                    trackFunnelNutritionViewed({
                      variant: FUNNEL_VARIANT,
                      product,
                      cadence,
                    });
                    setIsNutritionOpen(true);
                  }}
                  className="flex w-full min-h-11 items-center gap-2 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60 hover:text-black/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="underline underline-offset-4 decoration-black/20">
                    Spec · Nutritional facts & ingredients
                  </span>
                </button>
              </div>

              <div className="h-36 lg:hidden" />

              <div className="hidden lg:block px-10 pb-8">
                <FunnelCTA
                  label="Review my order"
                  subLabel={reviewSubLabel}
                  highlightSubLabel={true}
                  onClick={handleCadenceNext}
                  loading={false}
                  error={error}
                />
              </div>
            </>
          )}

          {/* ===== STEP 4: Summary ===== */}
          {currentStep === 4 && (
            <>
              <div className="px-5 pt-5 pb-6 lg:px-10 lg:pt-8">
                <SummaryStep product={product} cadence={cadence} />
              </div>

              <div className="h-36 lg:hidden" />

              <div className="hidden lg:block px-10 pb-8">
                <FunnelCTA
                  label="Proceed to checkout"
                  subLabel=""
                  highlightSubLabel={false}
                  onClick={handleCheckout}
                  loading={isCheckingOut}
                  error={error}
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden">
        {currentStep === 1 && (
          <FunnelCTA
            label="Choose my formula"
            subLabel=""
            highlightSubLabel={false}
            onClick={handleEducationNext}
            loading={false}
            error={null}
          />
        )}
        {currentStep === 2 && (
          <FunnelCTA
            label={productCTALabel}
            subLabel={productCTASubLabel}
            highlightSubLabel={product === "both"}
            onClick={handleProductNext}
            loading={false}
            error={error}
          />
        )}
        {currentStep === 3 && (
          <FunnelCTA
            label="Review my order"
            subLabel={reviewSubLabel}
            highlightSubLabel={true}
            onClick={handleCadenceNext}
            loading={false}
            error={error}
          />
        )}
        {currentStep === 4 && (
          <FunnelCTA
            label="Proceed to checkout"
            subLabel=""
            highlightSubLabel={true}
            onClick={handleCheckout}
            loading={isCheckingOut}
            error={error}
          />
        )}
      </div>

      <UpsellBottomSheet
        isOpen={isUpsellOpen}
        offer={upsellOffer}
        onAccept={handleUpsellAccept}
        onDecline={handleUpsellDecline}
        onDismiss={handleUpsellDismiss}
        loading={isCheckingOut}
      />

      <NutritionInfoModal
        isOpen={isNutritionOpen}
        product={product}
        onClose={() => setIsNutritionOpen(false)}
      />
    </div>
  );
}
