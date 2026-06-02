import { formulaContent, formatPrice } from "./productData";
import {
  BOTH_HERO_CONTENT,
  FUNNEL_CADENCES,
  type BothHeroContent,
  type CadenceType,
} from "./cadenceData";
import type { ProductHeroId } from "./productTypes";

export type { BothHeroContent as HeroContent };

export function getHeroContent(formulaId: ProductHeroId): BothHeroContent {
  if (formulaId === "03") return BOTH_HERO_CONTENT;
  const formula = formulaContent[formulaId];
  return {
    name: formulaId === "01" ? "CONKA FL0W" : formula.name,
    tagline: formula.tagline,
    headline: formula.headline,
    soldCount: formulaId === "01" ? "Over 90,000 bottles sold" : "Over 60,000 bottles sold",
  };
}

export function getHeroProductType(formulaId: ProductHeroId): "flow" | "clear" | "both" {
  if (formulaId === "01") return "flow";
  if (formulaId === "02") return "clear";
  return "both";
}

// ============================================
// CADENCE TILE HELPERS
// Shared by ProductHero (desktop) and ProductHeroMobile so wording and
// pricing display can never drift between the two.
// ============================================

/** Billing-frequency suffix shown after a price, e.g. "£89.99/mo" */
export function getPriceFrequency(cadence: CadenceType): string {
  switch (cadence) {
    case "monthly-sub": return "/mo";
    case "monthly-otp": return "";
    case "quarterly-sub": return "/quarter";
  }
}

/** Plain-English line describing exactly what ships and when */
export function getWhatShips(cadence: CadenceType, shotCount: number): string {
  const boxes = shotCount / 28;
  const boxLabel = boxes === 1 ? "1 box" : `${boxes} boxes`;
  switch (cadence) {
    case "monthly-sub":
      return `${boxLabel} (${shotCount} shots) delivered every month`;
    case "monthly-otp":
      return `${boxLabel} (${shotCount} shots), one-time delivery`;
    case "quarterly-sub":
      return `${boxLabel} (${shotCount} shots total) delivered every 3 months`;
  }
}

export interface TileChecklistItem {
  text: string;
  /** "shipment" lines render with the box emoji; everything else gets a green check */
  kind: "shipment" | "check";
}

/**
 * The selected tile's checklist: what ships, shipping terms, then the
 * cadence's reassurance bullets (cancel anytime, savings). One list,
 * one visual register. The guarantee lives in GuaranteeRow under the CTA,
 * not here, because it applies regardless of which tile is selected.
 */
export function getTileChecklist(cadence: CadenceType, shotCount: number): TileChecklistItem[] {
  const display = FUNNEL_CADENCES[cadence];
  return [
    { text: getWhatShips(cadence, shotCount), kind: "shipment" },
    ...(display.shippingCallout
      ? [{ text: display.shippingCallout, kind: "check" as const }]
      : []),
    ...display.features.map((text) => ({ text, kind: "check" as const })),
  ];
}

/** CTA meta line confirming price + saving at the point of action */
export function getCTAMeta(
  cadence: CadenceType,
  pricing: { price: number; compareAtPrice?: number },
): string {
  const savings = pricing.compareAtPrice
    ? pricing.compareAtPrice - pricing.price
    : 0;
  const savingsSegment = savings > 0 ? ` · Save ${formatPrice(savings)}` : "";

  switch (cadence) {
    case "monthly-sub":
      return `${formatPrice(pricing.price)}/mo${savingsSegment}`;
    case "quarterly-sub":
      return `${formatPrice(pricing.price)}/quarter${savingsSegment}`;
    case "monthly-otp":
      return `${formatPrice(pricing.price)} · one-time`;
  }
}
