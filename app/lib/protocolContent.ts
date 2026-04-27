/**
 * Protocol content data.
 */
import type { ProtocolId, ProtocolTier } from "./productTypes";


export interface ProtocolTierConfig {
  name: string;
  conkaFlowCount: number;
  conkaClarityCount: number;
  description: string;
  shotsPerWeek: number;
}

/** Optional stat + label for protocol benefits stats grid (PDP). */
export type ProtocolBenefitStat = { stat: string; label: string };

export interface ProtocolContent {
  id: ProtocolId;
  name: string;
  subtitle: string;
  description: string;
  icon: string; // Icon identifier
  image: string; // Navigation/thumbnail image path (used in cards, menus)
  // Hero images are defined in protocolHeroConfig.ts
  bestFor: string[];
  benefits: string[];
  /** Optional stats for protocol benefits stats grid (headline + stat grid). */
  benefitStats?: ProtocolBenefitStat[];
  availableTiers: ProtocolTier[];
  tiers: Partial<Record<ProtocolTier, ProtocolTierConfig>>;
}

export const protocolContent: Record<ProtocolId, ProtocolContent> = {
  "1": {
    id: "1",
    name: "Resilience Protocol",
    subtitle: "For those that want more focus",
    description:
      "Daily adaptogen support with CONKA Flow's Ashwagandha and Rhodiola builds stress resilience and recovery. Weekly CONKA Clarity boosts provide peak cognitive performance when you need it most.",
    icon: "shield",
    image: "/CONKA_15.jpg",
    bestFor: ["Recovery Focus", "Stress Management", "Daily Wellness"],
    benefits: [
      "Better stress response (-28% cortisol, PMID: 23439798)",
      "Reduced burnout & faster recovery (-28% burnout, PMID: 19016404)",
      "Improved sleep quality (+42%, PMID: 32021735)",
      "Enhanced focus when it counts (+18% memory, PMID: 12888775)",
    ],
    benefitStats: [
      { stat: "-28%", label: "cortisol" },
      { stat: "-28%", label: "burnout" },
      { stat: "+42%", label: "sleep quality" },
      { stat: "+18%", label: "memory" },
    ],
    availableTiers: ["starter", "pro", "max"],
    tiers: {
      starter: {
        name: "Starter",
        conkaFlowCount: 3,
        conkaClarityCount: 1,
        description: "Gentle introduction for newcomers",
        shotsPerWeek: 4,
      },
      pro: {
        name: "Pro",
        conkaFlowCount: 5,
        conkaClarityCount: 1,
        description: "Balanced protocol for consistent results",
        shotsPerWeek: 6,
      },
      max: {
        name: "Max",
        conkaFlowCount: 6,
        conkaClarityCount: 1,
        description: "Full coverage for maximum effect",
        shotsPerWeek: 7,
      },
    },
  },
  "2": {
    id: "2",
    name: "Precision Protocol",
    subtitle: "For those that feel foggy",
    description:
      "Front-load with cognitive enhancers for sustained mental endurance. CONKA Clarity's Alpha GPC and Vitamin C build your neurological foundation, while weekly CONKA Flow adaptogens prevent burnout.",
    icon: "bolt",
    image: "/protocols/Precision.jpg",
    bestFor: ["Peak Performance", "Mental Endurance", "Cognitive Enhancement"],
    benefits: [
      "Enhanced memory & attention (+63%, PMID: 29246725)",
      "Increased cerebral blood flow (+57%, PMID: 21802920)",
      "Improved cognitive recovery (+40% GSH, PMID: 29559699)",
      "Reduced mental fatigue (-30%, PMID: 17658628)",
    ],
    benefitStats: [
      { stat: "+63%", label: "memory & attention" },
      { stat: "+57%", label: "cerebral blood flow" },
      { stat: "+40%", label: "cognitive recovery" },
      { stat: "-30%", label: "mental fatigue" },
    ],
    availableTiers: ["starter", "pro", "max"],
    tiers: {
      starter: {
        name: "Starter",
        conkaFlowCount: 1,
        conkaClarityCount: 3,
        description: "Gentle introduction for newcomers",
        shotsPerWeek: 4,
      },
      pro: {
        name: "Pro",
        conkaFlowCount: 1,
        conkaClarityCount: 5,
        description: "Balanced protocol for consistent results",
        shotsPerWeek: 6,
      },
      max: {
        name: "Max",
        conkaFlowCount: 1,
        conkaClarityCount: 6,
        description: "Full coverage for maximum effect",
        shotsPerWeek: 7,
      },
    },
  },
  "3": {
    id: "3",
    name: "Balance Protocol",
    subtitle: "Flow in the morning. Clear in the afternoon.",
    description:
      "Take CONKA Flow with your morning routine for sustained energy and focus through the first half of your day. Switch to CONKA Clear after lunch to maintain precision and clarity through the afternoon. Full-day cognitive coverage without stimulant cycling.",
    icon: "balance",
    image: "/protocols/BalanceGreen.jpg", // Navigation/thumbnail image
    bestFor: ["Balanced Approach", "All-Rounders", "Hybrid Athletes"],
    benefits: [
      "Stress resilience (-56% stress scores, PMID: 23439798)",
      "Cognitive enhancement (+63% memory, PMID: 29246725)",
      "Sustained energy (+17% fitness, PMID: 10839209)",
      "Mental clarity & detox (+40% GSH, PMID: 29559699)",
    ],
    benefitStats: [
      { stat: "-56%", label: "stress scores" },
      { stat: "+63%", label: "memory" },
      { stat: "+17%", label: "fitness" },
      { stat: "+40%", label: "GSH / clarity" },
    ],
    availableTiers: ["starter", "pro", "max"],
    tiers: {
      starter: {
        name: "Starter",
        conkaFlowCount: 2,
        conkaClarityCount: 2,
        description: "Gentle introduction with balanced formulas",
        shotsPerWeek: 4,
      },
      pro: {
        name: "Pro",
        conkaFlowCount: 3,
        conkaClarityCount: 3,
        description: "Balanced weekly coverage",
        shotsPerWeek: 6,
      },
      max: {
        name: "Max",
        conkaFlowCount: 4,
        conkaClarityCount: 3,
        description: "Maximum balanced coverage",
        shotsPerWeek: 7,
      },
    },
  },
  "4": {
    id: "4",
    name: "Ultimate Protocol",
    subtitle: "Take Flow and Clarity both daily",
    description:
      "Maximum cognitive enhancement with both CONKA Flow and CONKA Clarity every single day. This is the most comprehensive protocol for those who demand peak performance in every aspect of their cognitive function.",
    icon: "crown",
    image: "/protocols/Ultimate.jpg",
    bestFor: ["Elite Performance", "Maximum Results", "No Compromise"],
    benefits: [
      "Daily adaptogen + nootropic stack",
      "Peak energy AND clarity every day",
      "Maximum neurological support",
      "The complete cognitive toolkit",
    ],
    benefitStats: [
      { stat: "Daily", label: "Flow + Clear" },
      { stat: "2×", label: "formulas per day" },
      { stat: "Peak", label: "energy & clarity" },
      { stat: "Full", label: "cognitive toolkit" },
    ],
    availableTiers: ["pro", "max"], // No starter for Ultimate
    tiers: {
      pro: {
        name: "Pro",
        conkaFlowCount: 6,
        conkaClarityCount: 6,
        description: "Bi-weekly delivery of the full stack",
        shotsPerWeek: 12, // 6 of each
      },
      max: {
        name: "Max",
        conkaFlowCount: 7,
        conkaClarityCount: 7,
        description: "Daily coverage of both formulas",
        shotsPerWeek: 14, // 7 of each
      },
    },
  },
};
