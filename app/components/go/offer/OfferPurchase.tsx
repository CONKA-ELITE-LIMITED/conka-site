"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useListicleCta } from "@/app/components/go/listicle/listicleAnalytics";
import { trackOfferUpsellChoice, trackOfferUpsellShown } from "@/app/lib/analytics";
import type { OfferProduct } from "@/app/lib/offerData";
import type { OfferTrial } from "@/app/lib/landings/offer-types";
import { offerCheckout, type OfferChoice } from "./offerCheckout";
import OfferUpsellModal, { type OfferUpsellData } from "./OfferUpsellModal";

/**
 * The offer page's purchase flow (SCRUM-1343), as small client islands inside
 * an otherwise server-rendered page.
 *
 * CTA click -> upsell modal (once per session) -> Shopify checkout. After the
 * visitor has accepted or declined, later CTA clicks skip the modal and go
 * straight to trial checkout: the offer is one-time, not a nag. Dismissing
 * (backdrop, Escape, close) does not count, so it shows again on the next click.
 *
 * Must sit inside <SectionImpressions>, which gives the CTA reporter its slug.
 */

const CHECKOUT_ERROR = "We couldn't open checkout. Please try again.";

interface PurchaseContext {
  start: (section: string) => void;
  loading: OfferChoice | null;
  error: string | null;
  modalOpen: boolean;
  tileCtaRef: RefObject<HTMLButtonElement | null>;
}

const PurchaseCtx = createContext<PurchaseContext | null>(null);

function usePurchase(): PurchaseContext {
  const ctx = useContext(PurchaseCtx);
  if (!ctx) throw new Error("Offer CTA rendered outside <OfferPurchaseProvider>");
  return ctx;
}

// Session storage can throw (private mode, blocked storage). Failing open just
// means the modal can show again, which is harmless.
function readSeen(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function markSeen(key: string): void {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // Ignore: see readSeen.
  }
}

export function OfferPurchaseProvider({
  slug,
  product,
  productName,
  offerId,
  trial,
  upsell,
  children,
}: {
  slug: string;
  product: OfferProduct;
  productName: string;
  offerId: string;
  trial: OfferTrial;
  upsell: OfferUpsellData;
  children: ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<OfferChoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef("hero");
  const tileCtaRef = useRef<HTMLButtonElement>(null);
  // Synchronous guard: `loading` only disables the buttons after a re-render,
  // so a fast double tap could otherwise create two carts.
  const inFlight = useRef(false);
  const seenKey = `offer_upsell_seen_${slug}`;

  // Back from Shopify checkout restores this page from the bfcache with the
  // button still spinning. Reset so the visitor can act again.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        inFlight.current = false;
        setLoading(null);
        setModalOpen(false);
      }
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const checkout = useCallback(
    async (choice: OfferChoice) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setLoading(choice);
      setError(null);
      const target = choice === "monthly" ? upsell : trial;
      try {
        await offerCheckout({
          product,
          offerId,
          choice,
          section: sectionRef.current,
          variantId: target.variantId,
          sellingPlanId: target.sellingPlanId,
          price: target.price,
          packSize: choice === "monthly" ? "28" : "4",
        });
      } catch {
        inFlight.current = false;
        setError(CHECKOUT_ERROR);
        setLoading(null);
      }
    },
    [offerId, product, trial, upsell],
  );

  const start = useCallback(
    (section: string) => {
      if (inFlight.current) return;
      sectionRef.current = section;
      if (readSeen(seenKey)) {
        void checkout("trial");
        return;
      }
      setError(null);
      setModalOpen(true);
      trackOfferUpsellShown({ slug, product });
    },
    [checkout, product, seenKey, slug],
  );

  const accept = useCallback(() => {
    trackOfferUpsellChoice({ slug, choice: "accepted" });
    markSeen(seenKey);
    void checkout("monthly");
  }, [checkout, seenKey, slug]);

  const decline = useCallback(() => {
    trackOfferUpsellChoice({ slug, choice: "declined" });
    markSeen(seenKey);
    void checkout("trial");
  }, [checkout, seenKey, slug]);

  const dismiss = useCallback(() => {
    if (inFlight.current) return;
    trackOfferUpsellChoice({ slug, choice: "dismissed" });
    setModalOpen(false);
    setError(null);
  }, [slug]);

  return (
    <PurchaseCtx.Provider value={{ start, loading, error, modalOpen, tileCtaRef }}>
      {children}
      <OfferUpsellModal
        open={modalOpen}
        data={upsell}
        productName={productName}
        trialShots={trial.shots}
        trialPrice={trial.price}
        loadingChoice={loading}
        error={error}
        onAccept={accept}
        onDecline={decline}
        onDismiss={dismiss}
      />
    </PurchaseCtx.Provider>
  );
}

/** Navy pill CTA. Reports the click for its section, then opens the flow. */
export function OfferCtaButton({
  section,
  children,
  isTile = false,
  compact = false,
  tabIndex,
}: {
  section: string;
  children: ReactNode;
  /** The price-tile CTA the sticky bar watches. Exactly one per page. */
  isTile?: boolean;
  compact?: boolean;
  tabIndex?: number;
}) {
  const { start, loading, modalOpen, tileCtaRef } = usePurchase();
  const fireCta = useListicleCta();
  const busy = loading === "trial" && !modalOpen;

  return (
    <button
      ref={isTile ? tileCtaRef : undefined}
      type="button"
      tabIndex={tabIndex}
      disabled={loading !== null}
      onClick={() => {
        fireCta(section);
        start(section);
      }}
      className={`flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--brand-navy)] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] focus-visible:ring-offset-2 ${
        compact ? "shrink-0 px-6 text-[15px]" : "w-full px-6 py-4 text-base"
      }`}
    >
      {busy && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
      )}
      {busy ? "Opening checkout" : children}
    </button>
  );
}

/** Checkout failure when the modal is closed (a returning visitor's direct checkout). */
export function OfferCheckoutError() {
  const { error, modalOpen } = usePurchase();
  if (!error || modalOpen) return null;
  return (
    <p role="alert" className="mt-2 text-sm font-medium text-black">
      {error}
    </p>
  );
}

/**
 * Sticky bottom CTA. Appears only once the price-tile CTA has scrolled up out
 * of view, so it never duplicates a visible button, and hides behind the modal.
 */
export function OfferStickyBar({ label, cta }: { label: string; cta: string }) {
  const { tileCtaRef, modalOpen } = usePurchase();
  const [pastTile, setPastTile] = useState(false);

  useEffect(() => {
    const el = tileCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPastTile(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [tileCtaRef]);

  const visible = pastTile && !modalOpen;

  return (
    <aside
      aria-label="Trial offer"
      aria-hidden={!visible}
      className={`brand-bg-white fixed inset-x-0 bottom-0 z-40 border-t border-black/10 px-5 pt-3 text-black transition-transform duration-300 md:px-[5vw] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      {/* A returning visitor's direct checkout can fail from this bar while the
          tile, and its error line, is scrolled out of view. */}
      <div className="brand-track">
        <OfferCheckoutError />
      </div>
      <div className="brand-track mt-2 flex items-center justify-between gap-3">
        <span className="min-w-0 text-[15px] font-bold leading-tight">{label}</span>
        <OfferCtaButton section="sticky" compact tabIndex={visible ? undefined : -1}>
          {cta}
        </OfferCtaButton>
      </div>
    </aside>
  );
}
