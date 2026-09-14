/**
 * Offer page config schema (/go/[slug], format "offer", SCRUM-1343).
 *
 * A single-offer page for paid acquisition tests. The first use is the CONKA
 * trial pack: the visitor picks Flow, Clear or Both, pays a low price for a few
 * days of CONKA, and Skio moves them onto that product's monthly plan a set
 * number of days after the order. The page reuses the PDP: the hero is built
 * from ProductHeroV3's parts with a trial-pack selector in place of the plan
 * selector, then PDP sections below the fold. A new offer or copy iteration is a
 * new slug (GO_LANDING_PAGES.md).
 */
import type { ProductHeroId } from "@/app/lib/productTypes";
import type { OfferProduct } from "@/app/lib/offerData";

export type OfferOptionId = "flow" | "clear" | "both";

/** One selectable trial pack, as authored in the config. */
export interface OfferOption {
  id: OfferOptionId;
  /** Card and copy label, e.g. "Flow" or "Flow + Clear". */
  label: string;
  /** The product whose PDP gallery, disclosure rows and monthly plan this option uses. */
  heroId: ProductHeroId;
  /** Shots in the trial pack. */
  shots: number;
  /** Trial price (£). Display only, pre-add: the charge comes from Shopify. */
  price: number;
  /** The trial pack variant, e.g. FLOW-BOX-4. */
  variantId: string;
  /**
   * The Skio trial plan that moves the contract onto the monthly plan after
   * `conversionDays`. Null until it exists in Skio; trial checkout refuses to
   * run without it rather than selling the pack at its base price.
   */
  sellingPlanId: string | null;
  /** Lead gallery slide in front of the product's PDP slides. Optional until the asset exists. */
  galleryLead?: string;
  /** Pill on the card's top edge. */
  badge?: string;
}

/** An option plus the figures derived server-side from offerData, sent to the client. */
export interface OfferOptionView extends OfferOption {
  product: OfferProduct;
  galleryImages: string[];
  /** The monthly plan this trial converts to. */
  monthly: { price: number; shots: number };
  /** The one-time box behind the buy-once link. */
  oneTime: { variantId: string; price: number; shots: number };
}

export interface OfferConfig {
  format: "offer";
  slug: string;
  /** The hero <h1>, and the browser title suffixed with " | CONKA". */
  title: string;
  /** Days of CONKA in each trial pack, for copy. */
  trialDays: number;
  /**
   * Days after the order when Skio moves the contract onto monthly. Stated in
   * the disclosure next to the CTA, so it must match the Skio plan.
   */
  conversionDays: number;
  /** In card order. */
  options: OfferOption[];
  defaultOption: OfferOptionId;
  /**
   * The single short review under the trust row (Cloud pattern). Condense a
   * real review with an ellipsis; never reword it.
   */
  review: { quote: string; name: string; avatar: string };
}
