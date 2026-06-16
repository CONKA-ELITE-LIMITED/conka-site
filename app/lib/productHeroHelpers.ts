import { formulaContent } from "./productData";
import {
  BOTH_HERO_CONTENT,
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
// CADENCE DISPLAY HELPERS
// Shared by the funnel and protocol surfaces so wording and pricing
// display can never drift between them.
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
