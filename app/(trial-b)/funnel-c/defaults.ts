import type { FunnelCadence, FunnelProduct } from "../lib/funnelData";

/**
 * The offer funnel-c lands on.
 *
 * Single source of truth, shared by the server page (Meta ViewContent) and the
 * client state machine. They previously declared this separately and drifted:
 * the page told Meta "both" while the UI actually showed Flow, so every
 * ViewContent carried the wrong content_id and the wrong value.
 */
export const FUNNEL_C_DEFAULT_PRODUCT: FunnelProduct = "flow";
export const FUNNEL_C_DEFAULT_CADENCE: FunnelCadence = "monthly-sub";

/** Order attribution tag. Distinct from funnel-b so revenue is separable. */
export const FUNNEL_C_SOURCE = "funnel_page_c";

/** Identifies this funnel in the shared `funnel:*` event taxonomy. */
export const FUNNEL_C_VARIANT = "c" as const;
