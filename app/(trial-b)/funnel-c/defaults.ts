import type { FunnelCadence, FunnelProduct } from "../lib/funnelData";

/**
 * The offer funnel-c lands on.
 *
 * Single source of truth, shared by the server page (Meta ViewContent) and the
 * client state machine. They previously declared this separately and drifted:
 * the page told Meta "both" while the UI actually showed Flow, so every
 * ViewContent carried the wrong content_id and the wrong value.
 */
/**
 * Flow, pre-selected: the headline entry offer, and the lowest-friction first
 * commitment. Both is still surfaced as the recommended routine on the Build
 * step, and the checkout upsell offers the Flow to Both upgrade.
 *
 * Note this differs from /funnel and /funnel-b, which open on Both.
 */
export const FUNNEL_C_DEFAULT_PRODUCT: FunnelProduct = "flow";
export const FUNNEL_C_DEFAULT_CADENCE: FunnelCadence = "monthly-sub";

/** Order attribution tag. Distinct from funnel-b so revenue is separable. */
export const FUNNEL_C_SOURCE = "funnel_page_c";

/** Identifies this funnel in the shared `funnel:*` event taxonomy. */
export const FUNNEL_C_VARIANT = "c" as const;

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
export function cadencePriceSuffix(cadence: FunnelCadence): string {
  if (cadence === "monthly-sub") return "/mo";
  if (cadence === "quarterly-sub") return "/3 months";
  return "";
}

/** Reads after a shot count, e.g. "60 shots every 3 months". */
export function cadenceDeliveryPeriod(cadence: FunnelCadence): string {
  return cadence === "quarterly-sub" ? "every 3 months" : "a month";
}
