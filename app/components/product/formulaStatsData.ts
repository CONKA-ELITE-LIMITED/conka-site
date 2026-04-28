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
    sourceRef?: string;
    ingredients?: { name: string; imageSrc: string }[];
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
      sourceRef: "PMID 12888775 · Kennedy et al. 2003",
      ingredients: [
        { name: "Lemon Balm", imageSrc: "/ingredients/flow/lemon-balm.webp" },
        { name: "Bilberry", imageSrc: "/ingredients/flow/bilberry.webp" },
        { name: "Rhodiola", imageSrc: "/ingredients/flow/rhodiola.webp" },
      ],
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
      sourceRef: "EFSA Reg. No 432/2012 · Authorised claim",
      ingredients: [
        { name: "Ashwagandha", imageSrc: "/ingredients/flow/ashwagandha.webp" },
        { name: "Rhodiola", imageSrc: "/ingredients/flow/rhodiola.webp" },
        { name: "Turmeric", imageSrc: "/ingredients/flow/turmeric.jpg" },
      ],
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
      sourceRef: "PMID 32021735 · Salve et al. 2019",
      ingredients: [
        { name: "Ashwagandha", imageSrc: "/ingredients/flow/ashwagandha.webp" },
        { name: "Lemon Balm", imageSrc: "/ingredients/flow/lemon-balm.webp" },
        { name: "Bilberry", imageSrc: "/ingredients/flow/bilberry.webp" },
      ],
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
      sourceRef: "PMID 29246725 · Small et al. 2018",
      ingredients: [
        { name: "Alpha GPC", imageSrc: "/ingredients/clear/alpha-gpc.webp" },
        { name: "Ginkgo Biloba", imageSrc: "/ingredients/clear/ginkgo.webp" },
        { name: "Acetyl-L-Carnitine", imageSrc: "/ingredients/clear/alcar.webp" },
      ],
    },
    {
      stat: "+30%",
      label: "improvement in fatigue resistance",
      anchor: "¶",
      pillarName: "Sustained performance",
      oneLine: "Stay precise through long meetings and demanding work.",
      feltTranslation:
        "Hour three feels like hour one. No drop-off, no fade.",
      sourceRef: "PMID 18937015 · Malaguarnera et al. 2008",
      ingredients: [
        { name: "Acetyl-L-Carnitine", imageSrc: "/ingredients/clear/alcar.webp" },
        { name: "Vitamin B12", imageSrc: "/ingredients/clear/vitamin-b12.webp" },
        { name: "N-Acetyl Cysteine", imageSrc: "/ingredients/clear/nac.webp" },
      ],
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
      sourceRef: "PMID 22628390 · Laws et al. 2012",
      ingredients: [
        { name: "Ginkgo Biloba", imageSrc: "/ingredients/clear/ginkgo.webp" },
        { name: "Vitamin C", imageSrc: "/ingredients/clear/vitamin-c.webp" },
        { name: "Glutathione", imageSrc: "/ingredients/clear/glutathione.webp" },
      ],
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
