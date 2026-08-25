"use client";

/**
 * Build Your Order — the alternative funnel layout.
 *
 * Learn → Build (product + plan on one page) → Review → checkout.
 *
 * A persistent sticky footer carries the step-aware CTA, the live price, and the
 * guarantee line (once there is a price on screen to reassure about). The left
 * column plays the product video, driven by the formula selection.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
// First-paint content (step 1 + always-visible chrome) stays eager.
import EducationStep from "./components/EducationStep";
import StickyFooter from "./components/StickyFooter";
import ByoMedia from "./components/ByoMedia";

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
import {
  type ByoCadence,
  type ByoProduct,
  type UpsellOffer,
  BYO_PRODUCTS,
  getOfferPricing,
  getUpsellOffer,
} from "@/app/lib/byoData";
import { byoCheckout, isByoCheckoutError } from "@/app/lib/byoCheckout";
import { formatPrice } from "@/app/lib/productData";
import {
  cadencePriceSuffix,
  BYO_DEFAULT_CADENCE,
  BYO_DEFAULT_PRODUCT,
  BYO_SOURCE,
  BYO_VARIANT,
} from "./defaults";
import {
  captureListicleSrc,
  getPurchaseOrigin,
  trackByoAccordionOpened,
  trackByoBackNav,
  trackByoCadenceChanged,
  trackByoCheckout,
  trackByoCheckoutFailed,
  trackByoCtaClicked,
  trackByoProductChanged,
  trackByoStepCompleted,
  trackByoUpsellDeclined,
  trackByoUpsellDismissed,
  trackByoViewed,
  trackCartUpsellAccepted,
  trackCartUpsellShown,
} from "@/app/lib/analytics";

type Step = 1 | 2 | 3;

/**
 * Which upgrade kind an upsell offer represents, in the shared `cart:upsell_*`
 * vocabulary (`product` is always the FROM product, matching CartUpsellTile).
 */
function upsellKind(
  offer: UpsellOffer,
  from: ByoProduct,
): "otp_to_sub" | "single_to_both" | "monthly_to_quarterly" {
  if (offer.upgradedProduct !== from) return "single_to_both";
  return offer.upgradedCadence === "monthly-sub"
    ? "otp_to_sub"
    : "monthly_to_quarterly";
}
const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Learn" },
  { n: 2, label: "Build" },
  { n: 3, label: "Review" },
];

export default function BuildYourOrderClient() {
  const [step, setStep] = useState<Step>(1);
  const [product, setProduct] = useState<ByoProduct>(BYO_DEFAULT_PRODUCT);
  const [cadence, setCadence] = useState<ByoCadence>(BYO_DEFAULT_CADENCE);

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
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    // Persist a listicle `?src=` before anything else, so the checkout still
    // knows its origin after the param is long gone (SCRUM-1248).
    captureListicleSrc();
    trackByoViewed({
      variant: BYO_VARIANT,
      product: BYO_DEFAULT_PRODUCT,
      cadence: BYO_DEFAULT_CADENCE,
    });
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
        trackByoStepCompleted({
          variant: BYO_VARIANT,
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
      trackByoBackNav({ variant: BYO_VARIANT, step: from });
      goToStep(to);
    },
    [goToStep],
  );

  const handleAccordionOpen = useCallback((id: string) => {
    trackByoAccordionOpened({ variant: BYO_VARIANT, id });
  }, []);

  // Tracking reads the previous value from the closure, NOT from inside a
  // setState updater: updaters must be pure, and React invokes them twice under
  // StrictMode, which would double-count every switch.
  const handleProductChange = useCallback(
    (p: ByoProduct) => {
      if (p !== product) {
        trackByoProductChanged({
          variant: BYO_VARIANT,
          from: product,
          to: p,
        });
      }
      setProduct(p);
      setError(null);
    },
    [product],
  );

  const handleCadenceChange = useCallback(
    (c: ByoCadence) => {
      if (c !== cadence) {
        trackByoCadenceChanged({
          variant: BYO_VARIANT,
          from: cadence,
          to: c,
        });
      }
      setCadence(c);
      setError(null);
    },
    [cadence],
  );

  const proceedToCheckout = useCallback(
    async (p: ByoProduct, c: ByoCadence, upsellAccepted: boolean) => {
      setIsCheckingOut(true);
      setError(null);
      trackByoCheckout({ variant: BYO_VARIANT, product: p, cadence: c });
      // Listicle arrivals carry their captured `?src=` token through to the
      // cart `_source` attribute and purchase:add_to_cart; everyone else gets
      // the flow's own tag.
      const result = await byoCheckout({
        product: p,
        cadence: c,
        upsellAccepted,
        source: getPurchaseOrigin() ?? BYO_SOURCE,
      });
      if (isByoCheckoutError(result)) {
        trackByoCheckoutFailed({
          variant: BYO_VARIANT,
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
      trackByoStepCompleted({
        variant: BYO_VARIANT,
        step: 3,
        product,
        cadence,
      });
    }
    trackByoCtaClicked({ variant: BYO_VARIANT, product, cadence });

    const offer = getUpsellOffer(product, cadence);
    if (offer) {
      setUpsellOffer(offer);
      setIsUpsellOpen(true);
      // Shared cart:upsell_* names so the conka-lab dashboard ingests these.
      trackCartUpsellShown({ type: upsellKind(offer, product), product });
      return;
    }
    proceedToCheckout(product, cadence, false);
  }, [product, cadence, proceedToCheckout]);

  // Live product + price shown INSIDE the footer CTA
  const pricing = getOfferPricing(product, cadence);
  const freq = cadencePriceSuffix(cadence);
  const ctaPrice = `${BYO_PRODUCTS[product].label} · ${formatPrice(pricing.price)}${freq}`;
  const ctaPriceShort = `${formatPrice(pricing.price)}${freq}`;
  const isSubscription = cadence !== "monthly-otp";

  const footer =
    step === 1
      ? { label: "Build my order", priceLabel: "", priceShort: "", onClick: () => handleForward(1), loading: false }
      : step === 2
        ? { label: "Review my order", priceLabel: ctaPrice, priceShort: ctaPriceShort, onClick: () => handleForward(2), loading: false }
        : { label: "Checkout", priceLabel: ctaPrice, priceShort: ctaPriceShort, onClick: handleCheckout, loading: isCheckingOut };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top chrome. Logo left, step position right, rounded progress bar under.
          Deliberately quiet: this is orientation, not content. */}
      <div className="fixed top-0 inset-x-0 z-40 bg-white border-b border-black/10">
        <div className="h-14 flex items-center justify-between px-5 lg:px-8">
          <Link
            href="/"
            aria-label="CONKA home"
            prefetch={false}
            className="flex h-11 items-center"
          >
            <Image
              src="/conka-logo.webp"
              alt="CONKA"
              width={132}
              height={30}
              className="h-[24px] w-auto"
              priority
            />
          </Link>

          {/* Named steps on desktop (they show how short the flow is, which is
              worth the pixels). Mobile gets the count, which says the same in
              less space. Completed steps are clickable to go back. */}
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-black/20" aria-hidden />}
                <button
                  type="button"
                  onClick={() => s.n < step && handleBack(step, s.n)}
                  disabled={s.n >= step}
                  className={`text-[14px] transition-colors ${
                    s.n === step
                      ? "font-semibold text-black"
                      : s.n < step
                        ? "text-black/45 hover:text-black cursor-pointer"
                        : "text-black/25 cursor-default"
                  }`}
                >
                  {s.label}
                </button>
              </div>
            ))}
          </div>
          <span className="sm:hidden text-[13px] font-medium text-black/50 tabular-nums">
            Step {step} of {STEPS.length}
          </span>
        </div>

        {/* Quiet 3px rule. The gamified /go fill (gradient + shimmer) was tried
            here and pulled far too much attention for a checkout surface. */}
        <div
          className="h-[3px] w-full bg-black/[0.07]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((step / STEPS.length) * 100)}
          aria-label="Order progress"
        >
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
          <ByoMedia product={product} showCaption={step !== 1} />
        </div>

        {/* Right content */}
        <div
          className="w-full lg:w-[58%] lg:overflow-y-auto transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {/* 560px reading measure, matching /start-b. pb clears the sticky footer. */}
          <div className="mx-auto w-full max-w-[560px] px-5 pt-8 pb-44 lg:pt-12">
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
        canBack={step > 1}
        loading={footer.loading}
        error={error}
      />

      {isUpsellOpen && (
        <UpsellBottomSheet
          isOpen={isUpsellOpen}
          offer={upsellOffer}
          onAccept={() => {
            if (!upsellOffer) return;
            trackCartUpsellAccepted({
              type: upsellKind(upsellOffer, product),
              product,
            });
            setIsUpsellOpen(false);
            proceedToCheckout(upsellOffer.upgradedProduct, upsellOffer.upgradedCadence, true);
          }}
          onDecline={() => {
            trackByoUpsellDeclined({ variant: BYO_VARIANT, product, cadence });
            setIsUpsellOpen(false);
            proceedToCheckout(product, cadence, false);
          }}
          onDismiss={() => {
            trackByoUpsellDismissed({ variant: BYO_VARIANT, product, cadence });
            setIsUpsellOpen(false);
          }}
          loading={isCheckingOut}
        />
      )}

    </div>
  );
}
