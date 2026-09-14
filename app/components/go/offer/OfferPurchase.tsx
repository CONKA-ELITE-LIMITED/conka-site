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
import ProductImageSlideshow from "@/app/components/product/ProductImageSlideshow";
import IngredientDisclosureRows from "@/app/components/product/IngredientDisclosureRows";
import { trackOfferOptionSelected } from "@/app/lib/analytics";
import { formatPrice } from "@/app/lib/productData";
import type { OfferOptionId, OfferOptionView } from "@/app/lib/landings/offer-types";
import { offerCheckout, type OfferPurchaseType } from "./offerCheckout";

/**
 * The offer page's selection and purchase flow (SCRUM-1343), as small client
 * islands inside an otherwise server-rendered page.
 *
 * The provider owns the selected trial pack. Everything that follows the
 * selection reads it from here: the gallery, the ingredient disclosure rows,
 * the plan cards, the CTA and buy-once prices, and the sticky bar. The CTA goes
 * straight to Shopify checkout with the selected trial pack; the buy-once link
 * goes to checkout with that product's one-time box.
 *
 * Must sit inside <SectionImpressions>, which gives the CTA reporter its slug.
 */

const CHECKOUT_ERROR = "We couldn't open checkout. Please try again.";

interface PurchaseContext {
  options: OfferOptionView[];
  selected: OfferOptionView;
  select: (id: OfferOptionId) => void;
  /** The main CTA: the selected trial pack. */
  start: (section: string) => void;
  /** The buy-once link: the selected product's one-time box. */
  buyOnce: (section: string) => void;
  loading: OfferPurchaseType | null;
  error: string | null;
  /** Where the failed click came from, so exactly one error line announces it. */
  errorAt: "page" | "sticky";
  tileCtaRef: RefObject<HTMLButtonElement | null>;
}

const PurchaseCtx = createContext<PurchaseContext | null>(null);

export function useOfferPurchase(): PurchaseContext {
  const ctx = useContext(PurchaseCtx);
  if (!ctx) throw new Error("Offer component rendered outside <OfferPurchaseProvider>");
  return ctx;
}

export function OfferPurchaseProvider({
  slug,
  options,
  defaultOption,
  children,
}: {
  slug: string;
  options: OfferOptionView[];
  defaultOption: OfferOptionId;
  children: ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<OfferOptionId>(defaultOption);
  const [loading, setLoading] = useState<OfferPurchaseType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorAt, setErrorAt] = useState<"page" | "sticky">("page");
  const sectionRef = useRef("hero");
  const tileCtaRef = useRef<HTMLButtonElement>(null);
  // Synchronous guard: `loading` only disables the buttons after a re-render,
  // so a fast double tap could otherwise create two carts.
  const inFlight = useRef(false);

  const selected = options.find((o) => o.id === selectedId) ?? options[0];

  // Back from Shopify checkout restores this page from the bfcache with the
  // button still spinning. Reset so the visitor can act again.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        inFlight.current = false;
        setLoading(null);
      }
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const select = useCallback(
    (id: OfferOptionId) => {
      if (id === selectedId || inFlight.current) return;
      setSelectedId(id);
      setError(null);
      trackOfferOptionSelected({ slug, option: id });
    },
    [selectedId, slug],
  );

  const checkout = useCallback(
    async (purchase: OfferPurchaseType, section: string) => {
      // Guard before touching sectionRef, or a tap during an in-flight checkout
      // would relabel that checkout's analytics location.
      if (inFlight.current) return;
      inFlight.current = true;
      sectionRef.current = section;
      setLoading(purchase);
      setError(null);
      const trial = purchase === "trial";
      try {
        await offerCheckout({
          product: selected.product,
          option: selected.id,
          purchase,
          section,
          variantId: trial ? selected.variantId : selected.oneTime.variantId,
          sellingPlanId: trial ? (selected.sellingPlanId ?? undefined) : undefined,
          price: trial ? selected.price : selected.oneTime.price,
          packSize: trial ? (selected.shots === 8 ? "8" : "4") : undefined,
        });
      } catch (err) {
        // The visitor sees a generic retry line; the cause goes to the console
        // for whoever is testing (e.g. a trial option with no Skio plan yet).
        console.error("Offer checkout failed:", err);
        inFlight.current = false;
        setErrorAt(sectionRef.current === "sticky" ? "sticky" : "page");
        setError(CHECKOUT_ERROR);
        setLoading(null);
      }
    },
    [selected],
  );

  const start = useCallback((section: string) => void checkout("trial", section), [checkout]);
  const buyOnce = useCallback((section: string) => void checkout("one_time", section), [checkout]);

  return (
    <PurchaseCtx.Provider
      value={{ options, selected, select, start, buyOnce, loading, error, errorAt, tileCtaRef }}
    >
      {children}
    </PurchaseCtx.Provider>
  );
}

/** Navy pill CTA for the selected trial pack. Reports the click, then checks out. */
export function OfferCtaButton({
  section,
  children,
  isTile = false,
  compact = false,
  tabIndex,
}: {
  section: string;
  children: ReactNode;
  /** The hero CTA the sticky bar watches. Exactly one per page. */
  isTile?: boolean;
  compact?: boolean;
  tabIndex?: number;
}) {
  const { start, loading, tileCtaRef } = useOfferPurchase();
  const fireCta = useListicleCta();
  const busy = loading === "trial";

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
      className={`flex items-center justify-center gap-2 rounded-full bg-[var(--brand-navy)] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] focus-visible:ring-offset-2 ${
        compact ? "min-h-[48px] shrink-0 px-6 text-[15px]" : "min-h-[58px] w-full px-6 text-lg"
      }`}
    >
      {busy && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
      )}
      {busy ? "Opening checkout" : children}
      {/* The arrow is the Cloud cue that this button goes to checkout. The
          compact sticky button stays text only, to fit beside its label. */}
      {!busy && !compact && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

/**
 * "Buy once" text link under the CTA, the PDP's MM pattern: the selected
 * product's regular one-time box, no subscription. Reports as the `otp` section.
 */
export function OfferOtpLink() {
  const { buyOnce, loading, selected } = useOfferPurchase();
  const fireCta = useListicleCta();

  return (
    <button
      type="button"
      disabled={loading !== null}
      onClick={() => {
        fireCta("otp");
        buyOnce("otp");
      }}
      className="mx-auto mt-1 block min-h-[44px] w-fit text-center text-sm font-medium text-black underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-50"
    >
      {loading === "one_time" ? (
        "Opening checkout"
      ) : (
        <>
          Or buy a {selected.oneTime.shots}-shot box once for{" "}
          <span className="tabular-nums">{formatPrice(selected.oneTime.price)}</span>
        </>
      )}
    </button>
  );
}

/**
 * Checkout failure line. Rendered under the hero CTA and in the sticky bar, but
 * only the one matching where the click came from shows, so a screen reader
 * hears a single alert.
 */
export function OfferCheckoutError({
  placement = "page",
}: {
  placement?: "page" | "sticky";
}) {
  const { error, errorAt } = useOfferPurchase();
  if (!error || errorAt !== placement) return null;
  return (
    <p role="alert" className="mt-2 text-sm font-medium text-black">
      {error}
    </p>
  );
}

/** The hero gallery for the selected option. Remounts on change so it restarts at the lead slide. */
export function OfferGallery({ alt }: { alt: string }) {
  const { selected } = useOfferPurchase();
  return (
    <ProductImageSlideshow
      key={selected.id}
      images={selected.galleryImages.map((src) => ({ src }))}
      alt={`${alt}, ${selected.label}`}
      noFrame
      smallThumbnails
      aspectRatio="landscape"
      hideArrows
    />
  );
}

/** The PDP ingredient / who-it's-for / taste rows for the selected option. */
export function OfferDisclosureRows() {
  const { selected } = useOfferPurchase();
  return <IngredientDisclosureRows formulaId={selected.heroId} />;
}

/**
 * Sticky bottom CTA. Appears only once the hero CTA has scrolled up out of
 * view, so it never duplicates a visible button.
 */
export function OfferStickyBar() {
  const { tileCtaRef, selected } = useOfferPurchase();
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

  return (
    <aside
      aria-label="Trial pack offer"
      aria-hidden={!pastTile}
      className={`brand-bg-white fixed inset-x-0 bottom-0 z-40 border-t border-black/10 px-5 pt-3 text-black transition-transform duration-300 md:px-[5vw] ${
        pastTile ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      {/* A checkout can fail from this bar while the hero, and its error line,
          is scrolled out of view. */}
      <div className="brand-track">
        <OfferCheckoutError placement="sticky" />
      </div>
      <div className="brand-track mt-2 flex items-center justify-between gap-3">
        <span className="min-w-0 text-[15px] font-bold leading-tight">
          {selected.label} trial pack
        </span>
        <OfferCtaButton section="sticky" compact tabIndex={pastTile ? undefined : -1}>
          Checkout - {formatPrice(selected.price)}
        </OfferCtaButton>
      </div>
    </aside>
  );
}
