import { formulaContent } from "./productData";
import { BOTH_HERO_CONTENT, type BothHeroContent } from "./cadenceData";
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
