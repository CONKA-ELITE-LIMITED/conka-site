/**
 * Cadence data adapter for product pages (SCRUM-916).
 *
 * Wraps funnelData.ts so Flow, Clear, and Balance product pages share
 * the same Shopify variant IDs and pricing as the funnel without
 * duplicating data. funnelData.ts is the single source of truth.
 */

import {
  FunnelCadence,
  FunnelPricing,
  FunnelVariantConfig,
  getOfferPricing,
  getOfferVariant,
} from "./funnelData";
import { FormulaId } from "./productData";

// Re-export the cadence union so product pages don't import from funnelData directly
export type CadenceType = FunnelCadence;
export type { FunnelPricing as CadencePricing, FunnelVariantConfig as CadenceVariantConfig };

// Maps FormulaId to the FunnelProduct key used in funnelData
const FORMULA_TO_PRODUCT = {
  "01": "flow",
  "02": "clear",
} as const satisfies Record<FormulaId, "flow" | "clear">;

// ============================================
// FORMULA HELPERS (Flow / Clear product pages)
// ============================================

export function getCadencePricingByFormula(
  formulaId: FormulaId,
  cadence: CadenceType,
): FunnelPricing {
  return getOfferPricing(FORMULA_TO_PRODUCT[formulaId], cadence);
}

export function getCadenceVariantByFormula(
  formulaId: FormulaId,
  cadence: CadenceType,
): FunnelVariantConfig | null {
  return getOfferVariant(FORMULA_TO_PRODUCT[formulaId], cadence);
}

// ============================================
// BALANCE HELPERS (Both / protocol 3 page)
// ============================================

export function getBalanceCadencePricing(cadence: CadenceType): FunnelPricing {
  return getOfferPricing("both", cadence);
}

export function getBalanceCadenceVariant(cadence: CadenceType): FunnelVariantConfig | null {
  return getOfferVariant("both", cadence);
}
