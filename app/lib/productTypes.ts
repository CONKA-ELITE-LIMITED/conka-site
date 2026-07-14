/**
 * Shared product type definitions.
 * Imports only from the legacy protocol boundary (a dependency leaf).
 */

import type { ProtocolId } from "./legacy/protocolSubscriptions";

export type FormulaId = "01" | "02";
export type PackSize = "4" | "8" | "12" | "28";
export type PurchaseType = "subscription" | "one-time";

/**
 * Union of every ID that can appear on a Shopify line item, which still
 * includes the retired protocols because customers hold protocol subscriptions.
 * Collapsing this to FormulaId is Phase 5, and is not planned.
 */
export type ProductId = FormulaId | ProtocolId;

// ============================================
// BOTH PRODUCT
// ============================================

/** "03" = Flow + Clear daily system (Both). Distinct from FormulaId intentionally. */
export type BothProductId = "03";

/** Union accepted by ProductHero / ProductHeroMobile */
export type ProductHeroId = FormulaId | BothProductId;
