"use client";

/**
 * funnel-c — the alternative funnel layout.
 *
 * Flow: Learn → Build (product + plan on one page) → Review → checkout.
 * A persistent sticky footer carries the step-aware CTA, live price and trust
 * strip. Left column plays the product video (driven by the formula toggle).
 */

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
// First-paint content (step 1 + always-visible chrome) stays eager.
import EducationStep from "./components/EducationStep";
import StickyFooter from "./components/StickyFooter";
import FunnelMedia from "./components/FunnelMedia";

// Downstream steps (2/3) and the overlays are code-split so only step-1 JS
// ships at first paint. BuildStep/SummaryStep keep SSR (they prefetch on
// approach); the modals are ssr:false and gated on open state below, so their
// chunk only downloads the first time the user actually opens them.
const BuildStep = dynamic(() => import("./components/BuildStep"), {
  loading: () => <div className="min-h-[420px]" aria-hidden />,
});
const SummaryStep = dynamic(() => import("./components/SummaryStep"), {
  loading: () => <div className="min-h-[360px]" aria-hidden />,
});
const UpsellBottomSheet = dynamic(
  () => import("./components/UpsellBottomSheet"),
  { ssr: false },
);
const NutritionInfoModal = dynamic(
  () => import("./components/NutritionInfoModal"),
  { ssr: false },
);
import {
  type FunnelCadence,
  type FunnelProduct,
  type UpsellOffer,
  FUNNEL_PRODUCTS,
  getOfferPricing,
  getUpsellOffer,
} from "../lib/funnelData";
import { funnelCheckout, isFunnelCheckoutError } from "../lib/funnelCheckout";
import { formatPrice } from "@/app/lib/productData";
import {
  FUNNEL_C_DEFAULT_CADENCE,
  FUNNEL_C_DEFAULT_PRODUCT,
  FUNNEL_C_SOURCE,
  FUNNEL_C_VARIANT,
} from "./defaults";
import {
  trackFunnelAccordionOpened,
  trackFunnelBackNav,
  trackFunnelCadenceChanged,
  trackFunnelCheckout,
  trackFunnelCheckoutFailed,
  trackFunnelCtaClicked,
  trackFunnelProductChanged,
  trackFunnelPropertyProbe,
  trackFunnelStepCompleted,
  trackFunnelUpsellAccepted,
  trackFunnelUpsellDeclined,
  trackFunnelUpsellDismissed,
  trackFunnelUpsellShown,
  trackFunnelViewed,
} from "@/app/lib/analytics";

type Step = 1 | 2 | 3;
const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Learn" },
  { n: 2, label: "Build" },
  { n: 3, label: "Review" },
];

export default function FunnelClient() {
  const [step, setStep] = useState<Step>(1);
  // Land on the headline £39.99 offer (Flow, monthly).
  const [product, setProduct] = useState<FunnelProduct>(FUNNEL_C_DEFAULT_PRODUCT);
  const [cadence, setCadence] = useState<FunnelCadence>(FUNNEL_C_DEFAULT_CADENCE);

  /**
   * Steps whose completion event has already fired.
   *
   * Step completions must be counted once per session, not once per transition.
   * Steps are driven through history.pushState, so a user who goes back and
   * re-advances (or just mashes browser back/forward) would otherwise inflate
   * every completion without limit. See handleForward.
   */
  const completedSteps = useRef<Set<Step>>(new Set());

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [upsellOffer, setUpsellOffer] = useState<UpsellOffer | null>(null);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    trackFunnelViewed({
      variant: FUNNEL_C_VARIANT,
      product: FUNNEL_C_DEFAULT_PRODUCT,
      cadence: FUNNEL_C_DEFAULT_CADENCE,
    });
    // TEMPORARY: settles whether Vercel Pro's 2-property limit drops extras at
    // ingestion or is only a query-side gate. Delete once read. See analytics.ts.
    trackFunnelPropertyProbe(FUNNEL_C_VARIANT);
    window.history.replaceState({ step: 1 }, "");
  }, []);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state?.step as Step | undefined;
      if (s && [1, 2, 3].includes(s)) {
        setVisible(false);
        setTimeout(() => {
          setStep(s);
          setError(null);
          window.scrollTo({ top: 0, behavior: "instant" });
          requestAnimationFrame(() => setVisible(true));
        }, 140);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setIsCheckingOut(false);
        setError(null);
      }
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const goToStep = useCallback((s: Step) => {
    setVisible(false);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setStep(s);
      window.history.pushState({ step: s }, "");
      setError(null);
      window.scrollTo({ top: 0, behavior: "instant" });
      requestAnimationFrame(() => setVisible(true));
    }, 140);
  }, []);

  /**
   * Advance one step, recording the step just completed.
   *
   * Tracking lives HERE, in the forward-intent path, and nowhere else. It must
   * not go in a useEffect on `step` (popstate drives setStep, so browser
   * back/forward would re-fire completions) and it must not go in `goToStep`,
   * which is also the BACKWARD handler for the nav arrow and the step indicator.
   */
  const handleForward = useCallback(
    (from: Step) => {
      if (!completedSteps.current.has(from)) {
        completedSteps.current.add(from);
        trackFunnelStepCompleted({
          variant: FUNNEL_C_VARIANT,
          step: from,
          product,
          cadence,
        });
      }
      goToStep(Math.min(3, from + 1) as Step);
    },
    [product, cadence, goToStep],
  );

  /** Step back. `from` is the step being left. */
  const handleBack = useCallback(
    (from: Step, to: Step) => {
      trackFunnelBackNav({ variant: FUNNEL_C_VARIANT, step: from });
      goToStep(to);
    },
    [goToStep],
  );

  const handleAccordionOpen = useCallback((id: string) => {
    trackFunnelAccordionOpened({ variant: FUNNEL_C_VARIANT, id });
  }, []);

  const handleProductChange = useCallback(
    (p: FunnelProduct) => {
      setProduct((prev) => {
        if (prev !== p) {
          trackFunnelProductChanged({
            variant: FUNNEL_C_VARIANT,
            from: prev,
            to: p,
          });
        }
        return p;
      });
      setError(null);
    },
    [],
  );

  const handleCadenceChange = useCallback((c: FunnelCadence) => {
    setCadence((prev) => {
      if (prev !== c) {
        trackFunnelCadenceChanged({
          variant: FUNNEL_C_VARIANT,
          from: prev,
          to: c,
        });
      }
      return c;
    });
    setError(null);
  }, []);

  const proceedToCheckout = useCallback(
    async (p: FunnelProduct, c: FunnelCadence, upsellAccepted: boolean) => {
      setIsCheckingOut(true);
      setError(null);
      trackFunnelCheckout({ variant: FUNNEL_C_VARIANT, product: p, cadence: c });
      const result = await funnelCheckout({
        product: p,
        cadence: c,
        upsellAccepted,
        source: FUNNEL_C_SOURCE,
      });
      if (isFunnelCheckoutError(result)) {
        trackFunnelCheckoutFailed({
          variant: FUNNEL_C_VARIANT,
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

    // Pressing Checkout is what completes step 3, the last step before Shopify.
    if (!completedSteps.current.has(3)) {
      completedSteps.current.add(3);
      trackFunnelStepCompleted({
        variant: FUNNEL_C_VARIANT,
        step: 3,
        product,
        cadence,
      });
    }
    trackFunnelCtaClicked({ variant: FUNNEL_C_VARIANT, product, cadence });

    const offer = getUpsellOffer(product, cadence);
    if (offer) {
      setUpsellOffer(offer);
      setIsUpsellOpen(true);
      trackFunnelUpsellShown({ variant: FUNNEL_C_VARIANT, product, cadence });
      return;
    }
    proceedToCheckout(product, cadence, false);
  }, [product, cadence, proceedToCheckout]);

  // Live product + price shown INSIDE the footer CTA
  const pricing = getOfferPricing(product, cadence);
  const freq = cadence === "monthly-sub" ? "/mo" : cadence === "quarterly-sub" ? "/quarter" : "";
  const ctaPrice = `${FUNNEL_PRODUCTS[product].label} · ${formatPrice(pricing.price)}${freq}`;
  const ctaPriceShort = `${formatPrice(pricing.price)}${freq}`;
  const isSubscription = cadence !== "monthly-otp";

  const footer =
    step === 1
      ? { label: "Build my order", priceLabel: "", priceShort: "", onClick: () => handleForward(1), loading: false }
      : step === 2
        ? { label: "Review my order", priceLabel: ctaPrice, priceShort: ctaPriceShort, onClick: () => handleForward(2), loading: false }
        : { label: "Checkout", priceLabel: ctaPrice, priceShort: ctaPriceShort, onClick: handleCheckout, loading: isCheckingOut };

  return (
    <div className="brand-clinical min-h-screen bg-white text-[var(--brand-black)]">
      {/* Top step indicator + progress bar */}
      <div className="fixed top-0 inset-x-0 z-40 bg-white border-b border-black/10">
        <div className="h-14 flex items-center justify-between px-5 lg:px-8">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center">
                {i > 0 && <span className="mx-3 h-3.5 w-px bg-black/15" aria-hidden />}
                <button
                  type="button"
                  onClick={() => s.n < step && handleBack(step, s.n)}
                  disabled={s.n > step}
                  className={`font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                    s.n === step
                      ? "text-[#1B2757] font-semibold"
                      : s.n < step
                        ? "text-black/45 hover:text-black/70"
                        : "text-black/25 cursor-default"
                  }`}
                >
                  <span className="tabular-nums">{s.n < step ? "✓" : `0${s.n}`}</span> {s.label}
                </button>
              </div>
            ))}
          </div>
          <Image src="/conka-logo.webp" alt="CONKA" width={132} height={30} className="h-[26px] w-auto" priority />
        </div>
        {/* Gamified progress bar */}
        <div className="h-[3px] w-full bg-black/[0.07]">
          <div
            className="h-full bg-[#1B2757] transition-all duration-500 ease-out"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="h-[59px]" />

      <main className="lg:flex lg:min-h-[calc(100vh-59px)]">
        {/* Left media — desktop */}
        <div className="hidden lg:block lg:w-[42%] lg:sticky lg:top-[59px] lg:h-[calc(100vh-59px)]">
          <FunnelMedia product={product} showCaption={step !== 1} />
        </div>

        {/* Right content */}
        <div
          className="w-full lg:w-[58%] lg:overflow-y-auto transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div className="mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-3xl px-4 pt-6 pb-40 lg:px-10 lg:pt-10 lg:pb-40">
            {step === 1 && <EducationStep onAccordionOpen={handleAccordionOpen} />}
            {step === 2 && (
              <BuildStep
                product={product}
                cadence={cadence}
                onProductChange={handleProductChange}
                onCadenceChange={handleCadenceChange}
                onAccordionOpen={handleAccordionOpen}
              />
            )}
            {step === 3 && <SummaryStep product={product} cadence={cadence} />}
          </div>
        </div>
      </main>

      <StickyFooter
        label={footer.label}
        priceLabel={footer.priceLabel}
        priceShort={footer.priceShort}
        isSubscription={isSubscription}
        onCta={footer.onClick}
        onBack={() => handleBack(step, Math.max(1, step - 1) as Step)}
        onForward={() => handleForward(step)}
        canBack={step > 1}
        canForward={step < 3}
        loading={footer.loading}
        error={error}
      />

      {isUpsellOpen && (
        <UpsellBottomSheet
          isOpen={isUpsellOpen}
          offer={upsellOffer}
          onAccept={() => {
            if (!upsellOffer) return;
            // Report the UPGRADED offer, so the event reads as the outcome.
            trackFunnelUpsellAccepted({
              variant: FUNNEL_C_VARIANT,
              product: upsellOffer.upgradedProduct,
              cadence: upsellOffer.upgradedCadence,
            });
            setIsUpsellOpen(false);
            proceedToCheckout(upsellOffer.upgradedProduct, upsellOffer.upgradedCadence, true);
          }}
          onDecline={() => {
            trackFunnelUpsellDeclined({ variant: FUNNEL_C_VARIANT, product, cadence });
            setIsUpsellOpen(false);
            proceedToCheckout(product, cadence, false);
          }}
          onDismiss={() => {
            trackFunnelUpsellDismissed({ variant: FUNNEL_C_VARIANT, product, cadence });
            setIsUpsellOpen(false);
          }}
          loading={isCheckingOut}
        />
      )}

      {isNutritionOpen && (
        <NutritionInfoModal
          isOpen={isNutritionOpen}
          product={product}
          onClose={() => setIsNutritionOpen(false)}
        />
      )}
    </div>
  );
}
