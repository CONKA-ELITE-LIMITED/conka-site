/**
 * Cadence data adapter for product pages (SCRUM-916).
 *
 * Wraps offerData.ts so Flow, Clear, and Both product pages share
 * the same Shopify variant IDs and pricing as the funnel without
 * duplicating data. offerData.ts is the single source of truth.
 */

import {
  OfferCadence,
  OfferGift,
  OfferPricing,
  OfferVariantConfig,
  OFFER_CADENCES,
  getDisplayDiscount,
  getSavingsPercent,
  getOfferProductSlideshow,
  getChargedPrice,
  getOfferPricing,
  getOfferVariant,
  getOtpCadenceFor,
  isOtpCadence,
} from "./offerData";
import { FormulaId } from "./productData";
import type { ProductHeroId } from "./productTypes";

export { OFFER_CADENCES, getChargedPrice, getDisplayDiscount, getSavingsPercent, getOfferProductSlideshow, getOtpCadenceFor, isOtpCadence };

// Re-export the cadence union so product pages don't import from offerData directly
export type CadenceType = OfferCadence;
export type { OfferPricing as CadencePricing, OfferVariantConfig as CadenceVariantConfig };
export type { OfferGift as CadenceGift };

// Maps FormulaId to the OfferProduct key used in offerData
const FORMULA_TO_PRODUCT = {
  "01": "flow",
  "02": "clear",
} as const satisfies Record<FormulaId, "flow" | "clear">;

// Per-product accent colors (bottom bar on selected cadence tile)
export const FORMULA_ACCENT: Record<FormulaId, string> = {
  "01": "#378ADD",
  "02": "#F59E0B",
};
export const BALANCE_ACCENT = "#0369a1";

// ============================================
// FORMULA HELPERS (Flow / Clear product pages)
// ============================================

export function getCadencePricingByFormula(
  formulaId: FormulaId,
  cadence: CadenceType,
): OfferPricing {
  return getOfferPricing(FORMULA_TO_PRODUCT[formulaId], cadence);
}

export function getCadenceVariantByFormula(
  formulaId: FormulaId,
  cadence: CadenceType,
): OfferVariantConfig | null {
  return getOfferVariant(FORMULA_TO_PRODUCT[formulaId], cadence);
}

// ============================================
// BALANCE HELPERS (Both / protocol 3 page)
// ============================================

export function getBalanceCadencePricing(cadence: CadenceType): OfferPricing {
  return getOfferPricing("both", cadence);
}

export function getBalanceCadenceVariant(cadence: CadenceType): OfferVariantConfig | null {
  return getOfferVariant("both", cadence);
}

// ============================================
// PRODUCT HERO HELPERS (Flow / Clear / Both via ProductHeroId)
// ============================================

/** Unified pricing lookup for ProductHero — routes "03" to the Both/balance data */
export function getCadencePricingByProductHeroId(
  productHeroId: ProductHeroId,
  cadence: CadenceType,
): OfferPricing {
  if (productHeroId === "03") return getBalanceCadencePricing(cadence);
  return getCadencePricingByFormula(productHeroId, cadence);
}

/** Unified variant lookup for ProductHero — routes "03" to the Both/balance data */
export function getCadenceVariantByProductHeroId(
  productHeroId: ProductHeroId,
  cadence: CadenceType,
): OfferVariantConfig | null {
  if (productHeroId === "03") return getBalanceCadenceVariant(cadence);
  return getCadenceVariantByFormula(productHeroId, cadence);
}

// ============================================
// BOTH HERO CONTENT ("03")
// Mirrors offerData OFFER_PRODUCTS.both, structured here so product
// pages have a single import path (cadenceData) rather than reaching
// into offerData directly.
// ============================================

export interface BothHeroContent {
  name: string;
  tagline: string;
  headline: string;
  soldCount: string;
  /** Descriptive, keyword-bearing subline shown under the product name in the PDP <h1> (SEO Phase 4, SCRUM-1138). */
  seoHeading?: string;
}

export const BOTH_HERO_CONTENT: BothHeroContent = {
  name: "CONKA Flow + Clear",
  tagline: "The complete daily performance system.",
  headline:
    "Flow in the morning for calm, sustained focus. Clear in the afternoon for precision and output. Two clinically-dosed liquid shots covering the full cognitive day, without stimulants or a crash.",
  soldCount: "Over 150,000 shots delivered",
  seoHeading: "The Complete Daily Brain Shot System, Morning to Evening",
};
