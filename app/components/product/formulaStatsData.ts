import type { FormulaId, PackSize } from "@/app/lib/productData";

/**
 * Curated stats per formula -- 3 compliant stats only.
 *
 * Flow:
 *  - Sleep quality: observational ingredient-level research (¶)
 *  - Memory: observational ingredient-level research (¶)
 *  - Tiredness/fatigue: EFSA Vitamin C claim (††)
 *
 * Clear:
 *  - Memory: observational ingredient-level research (¶)
 *  - Fatigue resistance: ties to EFSA tiredness/fatigue claim (††)
 *  - Cerebral blood flow: observational ingredient-level research (¶)
 *
 * Dropped: stress scores, anxiety ratings (RED -- mood/stress claims
 * not authorised for any CONKA ingredient per CLAIMS_COMPLIANCE.md)
 */
export const CURATED_STATS: Record<
  FormulaId,
  Array<{
    stat: string;
    label: string;
    anchor: string;
    /**
     * Optional Magic-Mind-style pillar fields. Set on Flow for
     * FormulaBenefitsPillars; legacy renderers (FormulaBenefitsStats and
     * variants) ignore these without changes.
     */
    pillarName?: string;
    oneLine?: string;
    feltTranslation?: string;
  }>
> = {
  "01": [
    {
      stat: "+18%",
      label: "improvement in memory performance",
      anchor: "¶",
      pillarName: "Mental performance",
      oneLine:
        "Sharpen focus and recall, powered by clinically-dosed adaptogens.",
      feltTranslation:
        "Remember names. Hold the thread. Stop second-guessing.",
    },
    {
      stat: "Reduces",
      label: "tiredness and fatigue",
      anchor: "††",
      pillarName: "Sustained energy",
      oneLine:
        "Stay productive through the afternoon without a stimulant crash.",
      feltTranslation:
        "No 3pm slump. No caffeine cliff. Morning clarity carries through.",
    },
    {
      stat: "+42%",
      label: "improvement in sleep quality",
      anchor: "¶",
      pillarName: "Better sleep",
      oneLine:
        "Calm your nervous system so the day ends as sharply as it started.",
      feltTranslation:
        "Wind down without effort. Wake up clear, not foggy.",
    },
  ],
  "02": [
    {
      stat: "+63%",
      label: "improvement in memory performance",
      anchor: "¶",
      pillarName: "Sharper recall",
      oneLine: "Sharpen memory and recall when the details matter.",
      feltTranslation:
        "Hold names. Hold numbers. Pull the exact phrase from yesterday's email.",
    },
    {
      stat: "+30%",
      label: "improvement in fatigue resistance",
      anchor: "¶",
      pillarName: "Sustained performance",
      oneLine: "Stay precise through long meetings and demanding work.",
      feltTranslation:
        "Hour three feels like hour one. No drop-off, no fade.",
    },
    {
      stat: "+57%",
      label: "increase in cerebral blood flow",
      anchor: "¶",
      pillarName: "Mental clarity",
      oneLine:
        "Lift cognitive performance through enhanced blood flow to the brain.",
      feltTranslation:
        "Faster connections. Cleaner thinking. Noticeable lift.",
    },
  ],
};

/** What the customer receives, in plain language */
export function getDeliveryDescription(pack: PackSize): string {
  switch (pack) {
    case "4":
      return "4 shots delivered every week";
    case "8":
      return "8 shots delivered every 2 weeks";
    case "12":
      return "12 shots delivered every 2 weeks";
    case "28":
      return "28 shots delivered every month";
  }
}
