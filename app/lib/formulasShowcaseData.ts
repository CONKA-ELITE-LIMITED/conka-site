import {
  formulaContent,
  formulaPricing,
  FORMULA_COLORS,
  FormulaId,
} from "@/app/lib/productData";

// Shared formula data interface
export interface FormulaShowcaseData {
  id: FormulaId;
  name: string;
  subtitle: string;
  subheadline: string;
  description: string;
  headline: string;
  positioning: string;
  whenToTake: string;
  accentColor: string;
  bgColor: string;
  stats: {
    label: string;
    value: string;
    source: string;
    description: string;
  }[];
  keyPoints: string[];
  startingPrice: string;
  href: string;
  image: {
    src: string;
    alt: string;
    focalX: number;
    focalY: number;
  };
}

// Product images mapping
const formulaImages: Record<
  FormulaId,
  { src: string; alt: string; focalX: number; focalY: number }
> = {
  "01": {
    src: "/CONKA_01.jpg",
    alt: "CONKA Flow bottle - Caffeine-Free Focus",
    focalX: 55,
    focalY: 48,
  },
  "02": {
    src: "/CONKA_06.jpg",
    alt: "CONKA Clear bottle - Peak Performance Boost",
    focalX: 52,
    focalY: 50,
  },
};

// Positioning and timing data
const formulaMeta: Record<
  FormulaId,
  { positioning: string; whenToTake: string }
> = {
  "01": {
    positioning: "ENERGY",
    whenToTake: "Morning ritual",
  },
  "02": {
    positioning: "CLARITY",
    whenToTake: "Before peak performance",
  },
};

// Build formulas array from formulaContent
export const formulas: FormulaShowcaseData[] = (
  ["01", "02"] as FormulaId[]
).map((id) => {
  const content = formulaContent[id];
  const colors = FORMULA_COLORS[id];
  const meta = formulaMeta[id];

  // Get top 3 benefits as stats
  const stats = content.benefits.slice(0, 3).map((benefit) => ({
    label: benefit.title,
    value: benefit.stat,
    source: benefit.annotation,
    description: benefit.description,
  }));

  // Get first 3 key points
  const keyPoints = content.keyPoints.slice(0, 3);

  return {
    id,
    name: content.name,
    subtitle: content.tagline,
    subheadline: content.subheadline,
    description: content.subheadline,
    headline: content.headline,
    positioning: meta.positioning,
    whenToTake: meta.whenToTake,
    accentColor: colors.hex,
    bgColor: colors.bg,
    stats,
    keyPoints,
    startingPrice: `From £${formulaPricing["one-time"]["4"].price.toFixed(2)}`,
    href: id === "01" ? "/conka-flow" : "/conka-clarity",
    image: formulaImages[id],
  };
});

// Export formula IDs for iteration
export const formulaIds: FormulaId[] = ["01", "02"];
