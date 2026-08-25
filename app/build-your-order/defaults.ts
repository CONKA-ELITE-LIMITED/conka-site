import type { ByoCadence, ByoProduct } from "@/app/lib/byoData";

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
export const BYO_DEFAULT_PRODUCT: ByoProduct = "both";
export const BYO_DEFAULT_CADENCE: ByoCadence = "monthly-sub";

/**
 * Order attribution tag. Kept at the historic funnel-c value so Shopify /
 * Triple Whale revenue attribution stays continuous; renames with the rest of
 * the analytics taxonomy in Phase 2 (SCRUM-1248).
 */
export const BYO_SOURCE = "funnel_page_c";

/** Identifies this flow in the shared `funnel:*` event taxonomy (Phase 2 renames it). */
export const BYO_VARIANT = "c" as const;

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
export function cadencePriceSuffix(cadence: ByoCadence): string {
  if (cadence === "monthly-sub") return "/mo";
  if (cadence === "quarterly-sub") return "/3 months";
  return "";
}

/** Reads after a shot count, e.g. "60 shots every 3 months". */
export function cadenceDeliveryPeriod(cadence: ByoCadence): string {
  return cadence === "quarterly-sub" ? "every 3 months" : "a month";
}
