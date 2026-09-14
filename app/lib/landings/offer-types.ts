/**
 * Offer page config schema (/go/[slug], format "offer", SCRUM-1343).
 *
 * A stripped-back single-offer page for impulse-priced acquisition tests: one
 * product, one weekly trial subscription, a one-time upsell to the monthly
 * starter pack, then straight to Shopify checkout. A new offer or copy
 * iteration is a new slug (GO_LANDING_PAGES.md), so a Clear version is a
 * second config, not a toggle.
 */
import type { FaqEntry } from "@/app/lib/faqContent";
import type { OfferProduct } from "@/app/lib/offerData";

export interface OfferTrial {
  /** Shots in the box. Shown in copy and sent as the add-to-cart pack size. */
  shots: number;
  /**
   * Weekly subscription price (£). Display only, pre-add: the charge comes from
   * Shopify (base price minus the Skio plan percentage), never from here.
   */
  price: number;
  /** The variant's one-time base price (£), struck through against `price`. */
  compareAtPrice: number;
  variantId: string;
  sellingPlanId: string;
}

export interface OfferPoint {
  title: string;
  body: string;
}

export interface OfferConfig {
  format: "offer";
  slug: string;
  /** Browser title, suffixed with " | CONKA". The page is noindex regardless. */
  title: string;
  product: OfferProduct;
  /** Display name used in the upsell headline, e.g. "Flow". */
  productName: string;
  /** Written as the `_offer` line attribute on every order from this page. */
  offerId: string;
  trial: OfferTrial;
  hero: {
    eyebrow: string;
    headline: string;
    subline: string;
    image: { src: string; alt: string; width: number; height: number };
  };
  tile: {
    name: string;
    bullets: string[];
    cta: string;
    /** The renewal disclosure under the CTA. Never remove it. */
    renewal: string;
  };
  benefits: { title: string; items: OfferPoint[] };
  steps: { title: string; items: OfferPoint[] };
  /** Canonical FAQ ids from faqContent.ts, in display order. */
  faqIds: string[];
  /**
   * Questions only true on this page (weekly billing, cancelling the box). Kept
   * here rather than in FAQ_ITEMS so they never surface on the /faq hub, where
   * they would be wrong for everyone else. Safe because /go pages are noindex
   * and carry no FAQ schema (FAQ_SYSTEM.md).
   */
  offerFaqs: FaqEntry[];
  sticky: { label: string; cta: string };
}
