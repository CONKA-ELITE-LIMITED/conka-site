/**
 * Skio subscription-platform integration (Loop -> Skio migration).
 *
 * PHASE 1 SCAFFOLD — not wired into any purchase or portal path yet. This module
 * exists so Phase 2 (re-point purchase surfaces) and Phase 3 (iframe portal) have
 * their config + plan mapping ready. Importing it has no runtime effect on the
 * live storefront; Loop remains the live subscription platform until Phase 4.
 *
 * See docs/development/featurePlans/skio-migration.md
 */

import { env } from "@/app/lib/env";

/**
 * Skio GraphQL API endpoint and auth header.
 *
 * Auth is `authorization: API {token}` (note the literal `API ` prefix, not
 * `Bearer`). Server-only — never expose `SKIO_API_TOKEN` to the client.
 * Documented limits: query depth 4, 100 nodes/request, 2,000 req/min.
 * Shopify GIDs are exposed on Skio objects as `platformId` (useful for
 * reconciliation against our existing GIDs).
 */
export const SKIO_GRAPHQL_ENDPOINT = "https://graphql.skio.com/v1/graphql";

/** Build the Skio GraphQL auth header. Returns undefined if the token is unset. */
export function skioAuthHeader(): { authorization: string } | undefined {
  const token = env.skioApiToken;
  return token ? { authorization: `API ${token}` } : undefined;
}

/**
 * Loop selling-plan GID -> Skio selling-plan GID mapping.
 *
 * Reference / reconciliation map. The LIVE storefront wiring is inlined in
 * `app/lib/byoData.ts` (`SKIO_SUBSCRIPTION_VARIANTS`, flag-gated, NOT YET BUILT) — this const is
 * not consumed by the purchase path; it documents the plan-level old->new
 * mapping (and which Loop plans have no Skio equivalent).
 *
 * Keys are the CURRENT live Loop selling-plan GIDs, sourced from:
 *   - BYO:      app/lib/byoData.ts (BYO_VARIANTS)
 *   - PDP:      app/api/auth/subscriptions/[id]/pause/route.ts (PLAN_CONFIGURATIONS)
 *   - Protocol: app/lib/legacy/protocolSubscriptions.ts (PROTOCOL_VARIANTS)
 *
 * NOTE: the PDP and legacy-protocol surfaces share the SAME three Loop plans
 * (starter/pro/max, 20% off) — deliberately kept as three entries, not deduped,
 * so each surface's mapping is self-evident.
 *
 * The full old->new table also lives in docs/product/SKU_AND_SHOT_REFERENCE.md.
 */
export const LOOP_TO_SKIO_SELLING_PLAN: Record<string, string | null> = {
  // --- BYO (BYO_VARIANTS) ---
  // Flow & Clear — Monthly  →  Skio "20 Shots - Monthly" (42.86% off, FLOW-20/CLEAR-20)
  "gid://shopify/SellingPlan/712527348086": "gid://shopify/SellingPlan/712928887158",
  // Flow & Clear — Quarterly  →  Skio "60 Shots - Quarterly" (42.11% off, FLOW-60/CLEAR-60)
  "gid://shopify/SellingPlan/712527413622": "gid://shopify/SellingPlan/712928919926",
  // Both — Monthly  →  Skio "40 Shots - Monthly" (25.00% off, BOTH-40)
  "gid://shopify/SellingPlan/712527479158": "gid://shopify/SellingPlan/712928952694",
  // Both — Quarterly  →  Skio "120 Shots - Quarterly" (46.43% off, BOTH-120)
  "gid://shopify/SellingPlan/712527446390": "gid://shopify/SellingPlan/712928985462",

  // --- PDP + legacy protocol (PLAN_CONFIGURATIONS / PROTOCOL_VARIANTS), 20% off ---
  // No Skio equivalents created: these Family-B plans are only recreated if a
  // surface still sells against them (see status doc). Left null intentionally.
  // Starter tier
  "gid://shopify/SellingPlan/711429882230": null,
  // Pro tier
  "gid://shopify/SellingPlan/711429947766": null,
  // Max tier
  "gid://shopify/SellingPlan/711429980534": null,
};

// The Skio subscription variant GIDs (net-new Stage-1 base variants) are the
// live storefront wiring and will live in `app/lib/byoData.ts` (`SKIO_SUBSCRIPTION_VARIANTS`),
// alongside the plans they attach to. Not duplicated here to avoid drift.

const SELLING_PLAN_GID_PREFIX = "gid://shopify/SellingPlan/";

/** Normalise a bare numeric id or a full GID to the full-GID form used as map keys. */
function toSellingPlanGid(idOrGid: string): string {
  return idOrGid.startsWith(SELLING_PLAN_GID_PREFIX)
    ? idOrGid
    : `${SELLING_PLAN_GID_PREFIX}${idOrGid}`;
}

/**
 * Resolve a Loop selling-plan id to its Skio equivalent.
 *
 * Accepts EITHER the full GID (BYO `BYO_VARIANTS`, legacy `PROTOCOL_VARIANTS`)
 * OR the bare numeric id (`PLAN_CONFIGURATIONS` stores plans without the GID prefix),
 * normalising both to the full-GID map key. Returns null when the mapping is not yet
 * populated (pre-cutover) or the id is unknown. Callers in Phase 2 MUST handle null —
 * do not attach a dead plan.
 */
export function loopToSkioSellingPlan(loopIdOrGid: string): string | null {
  return LOOP_TO_SKIO_SELLING_PLAN[toSellingPlanGid(loopIdOrGid)] ?? null;
}
