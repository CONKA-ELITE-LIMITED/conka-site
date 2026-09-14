/**
 * Offer page config schema (/go/[slug], format "offer", SCRUM-1343).
 *
 * A single-offer page for impulse-priced acquisition tests. It reuses the PDP:
 * the hero is built from ProductHeroV3's parts, with a simplified buy box (one
 * weekly trial plan, a buy-once link) in place of the plan selector, followed
 * by the PDP's UGC marquee, comparison table and FAQ. A new offer or copy
 * iteration is a new slug (GO_LANDING_PAGES.md), so a Clear version is a second
 * config, not a toggle.
 */
import type { FormulaId } from "@/app/lib/productTypes";

export interface OfferTrial {
  /** Shots in the box. Shown in copy and sent as the add-to-cart pack size. */
  shots: number;
  /**
   * Weekly subscription price (£). Display only, pre-add: the charge comes from
   * Shopify (base price minus the Skio plan percentage), never from here.
   */
  price: number;
  /**
   * The variant's base price (£). Struck through against `price`, and what the
   * buy-once link charges: the variant bought without a selling plan.
   */
  compareAtPrice: number;
  variantId: string;
  sellingPlanId: string;
}

export interface OfferConfig {
  format: "offer";
  slug: string;
  /** The hero <h1>, and the browser title suffixed with " | CONKA". */
  title: string;
  /** Drives the reused PDP parts: gallery, lede, disclosure rows, FAQ, table. */
  formulaId: FormulaId;
  /** Display name used in the upsell headline, e.g. "Flow". */
  productName: string;
  /** Written as the `_offer` line attribute on every order from this page. */
  offerId: string;
  trial: OfferTrial;
  /**
   * Lead gallery slide, placed in front of the PDP gallery where the PDP shows
   * its starter-pack render (the trial box has no starter pack).
   */
  galleryLead: string;
  /**
   * The single short review under the trust row (Cloud pattern). Condense a
   * real review with an ellipsis; never reword it.
   */
  review: { quote: string; name: string; avatar: string };
  /** The OfferBuyBox CTA, disclosure and plan card (styled as the PDP's plan card). */
  tile: {
    /** Plan card title beside the radio, e.g. "4 shots". */
    name: string;
    /** Centred pill straddling the card's top edge, e.g. "Trial offer". */
    badge?: string;
    /** The 2x2 detail grid, read left to right, top to bottom (even count). */
    details: string[];
    /** Gradient strip along the card's bottom edge. */
    footer?: string;
    cta: string;
    /** The renewal disclosure under the CTA. Never remove it. */
    renewal: string;
  };
  sticky: { label: string; cta: string };
}
