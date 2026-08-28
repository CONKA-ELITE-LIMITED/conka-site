import type { OfferCadence, OfferProduct } from "@/app/lib/offerData";

/**
 * The offer the Build Your Order flow lands on.
 *
 * Single source of truth, shared by the server page (Meta ViewContent) and the
 * client state machine. They previously declared this separately and drifted:
 * the page told Meta "both" while the UI actually showed Flow, so every
 * ViewContent carried the wrong content_id and the wrong value.
 */
/**
 * Both, pre-selected (SCRUM-1247): Both outsells Flow (98 vs 66 orders over
 * the 6 weeks to 24 Aug 2026) on less traffic, so the flow opens on the
 * best-converting configuration. Flow and Clear stay presented as equals on
 * the Build step (two-equal-cards rule).
 */
export const BYO_DEFAULT_PRODUCT: OfferProduct = "both";
export const BYO_DEFAULT_CADENCE: OfferCadence = "monthly-sub";

/**
 * FALLBACK order attribution tag, written to the cart's `_source` attribute
 * and the `purchase:add_to_cart` `source` prop when the visitor did not arrive
 * from a listicle. Listicle arrivals carry their captured `?src=` token
 * instead (see the source resolution in BuildYourOrderClient, SCRUM-1248).
 * Historic values in Shopify / Triple Whale: `funnel_page` (deleted variant a),
 * `funnel_page_b` (deleted variant b), `funnel_page_c` (funnel-c, this flow's
 * previous tag until the 2026-08 cutover).
 */
export const BYO_SOURCE = "byo_page";

/**
 * Identifies this flow variant in the `byo:*` event taxonomy. Fixed at "v1"
 * until an A/B variant exists; pre-consolidation history used "c" under the
 * retired `funnel:*` names.
 */
export const BYO_VARIANT = "v1" as const;

/**
 * Cadence wording.
 *
 * We say "every 3 months", never "a quarter". A quarter is a finance word: the
 * buyer is thinking about when a box lands on their doormat and when their card
 * is charged, and "3 months" answers that directly.
 *
 * Both helpers live here because the sticky footer, the plan cards and the
 * receipt each used to derive this separately, and drifted.
 */

/** Suffix beside a price, e.g. "£109.99/3 months". Empty for one-time. */
export function cadencePriceSuffix(cadence: OfferCadence): string {
  if (cadence === "monthly-sub") return "/mo";
  if (cadence === "quarterly-sub") return "/3 months";
  return "";
}

/** Reads after a shot count, e.g. "60 shots every 3 months". */
export function cadenceDeliveryPeriod(cadence: OfferCadence): string {
  return cadence === "quarterly-sub" || cadence === "quarterly-otp"
    ? "every 3 months"
    : "a month";
}
