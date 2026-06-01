import type { ReactNode } from "react";
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
    /**
     * Prose sentence(s) for the expanded panel that weave the ingredient
     * names into the claim, so the stat, the study, and the renders below
     * read as one story rather than disconnected fragments.
     */
    story?: ReactNode;
    ingredients?: { name: string; imageSrc: string }[];
  }>
> = {
  "01": [
    {
      stat: "+18%",
      label: "improvement in memory performance",
      anchor: "¶",
      pillarName: "Improves Memory & Recall",
      oneLine:
        "Sharpen focus and recall, powered by clinically-dosed adaptogens.",
      feltTranslation:
        "Remember names. Hold the thread. Stop second-guessing.",
      sourceRef: "PMID 12888775 · Kennedy et al. 2003",
      story: (
        <>
          In a placebo-controlled trial, participants taking{" "}
          <strong className="font-semibold text-black">Lemon Balm</strong>{" "}
          showed an 18% improvement in memory performance.{" "}
          <strong className="font-semibold text-black">Bilberry</strong> and{" "}
          <strong className="font-semibold text-black">Rhodiola</strong>{" "}
          support the same outcome through cerebral circulation and stress
          resilience.
        </>
      ),
      ingredients: [
        { name: "Lemon Balm", imageSrc: "/ingredients/renders/LemonBalm.jpg" },
        { name: "Bilberry", imageSrc: "/ingredients/renders/Bilberry.jpg" },
        { name: "Rhodiola", imageSrc: "/ingredients/renders/RhodiolaRosea.jpg" },
      ],
    },
    {
      stat: "Reduces",
      label: "tiredness and fatigue",
      anchor: "††",
      pillarName: "Reduces Tiredness & Fatigue",
      oneLine:
        "Stay productive through the afternoon without a stimulant crash.",
      feltTranslation:
        "No 3pm slump. No caffeine cliff. Morning clarity carries through.",
      sourceRef: "EFSA Reg. No 432/2012 · Authorised claim",
      story: (
        <>
          <strong className="font-semibold text-black">Ashwagandha</strong>{" "}
          and <strong className="font-semibold text-black">Rhodiola</strong>{" "}
          are adaptogens: they help your body handle demanding days rather
          than masking the fatigue.{" "}
          <strong className="font-semibold text-black">Turmeric</strong>{" "}
          keeps inflammation in check, and the formula&apos;s vitamin content
          carries an EFSA-authorised claim for reducing tiredness and fatigue.
        </>
      ),
      ingredients: [
        {
          name: "Ashwagandha",
          imageSrc: "/ingredients/renders/Ashwagandha.jpg",
        },
        { name: "Rhodiola", imageSrc: "/ingredients/renders/RhodiolaRosea.jpg" },
        { name: "Turmeric", imageSrc: "/ingredients/renders/Turmeric.jpg" },
      ],
    },
    {
      stat: "+42%",
      label: "improvement in sleep quality",
      anchor: "¶",
      pillarName: "Improves Sleep Quality",
      oneLine:
        "Calm your nervous system so the day ends as sharply as it started.",
      feltTranslation:
        "Wind down without effort. Wake up clear, not foggy.",
      sourceRef: "PMID 32021735 · Salve et al. 2019",
      story: (
        <>
          In an 8-week clinical study, participants taking{" "}
          <strong className="font-semibold text-black">Ashwagandha</strong>{" "}
          reported a 42% improvement in sleep quality.{" "}
          <strong className="font-semibold text-black">Lemon Balm</strong>{" "}
          adds calm without sedation, so the wind-down starts before your
          head hits the pillow.
        </>
      ),
      ingredients: [
        {
          name: "Ashwagandha",
          imageSrc: "/ingredients/renders/Ashwagandha.jpg",
        },
        { name: "Lemon Balm", imageSrc: "/ingredients/renders/LemonBalm.jpg" },
        { name: "Bilberry", imageSrc: "/ingredients/renders/Bilberry.jpg" },
      ],
    },
  ],
  "02": [
    {
      stat: "+63%",
      label: "improvement in memory performance",
      anchor: "¶",
      pillarName: "Improves Memory & Recall",
      oneLine: "Sharpen memory and recall when the details matter.",
      feltTranslation:
        "Hold names. Hold numbers. Pull the exact phrase from yesterday's email.",
      sourceRef: "PMID 29246725 · Small et al. 2018",
      story: (
        <>
          In clinical research, participants showed a 63% improvement in
          memory performance.{" "}
          <strong className="font-semibold text-black">Alpha GPC</strong>{" "}
          raises acetylcholine, the brain&apos;s memory messenger, while{" "}
          <strong className="font-semibold text-black">Ginkgo Biloba</strong>{" "}
          and{" "}
          <strong className="font-semibold text-black">
            Acetyl-L-Carnitine
          </strong>{" "}
          keep neurons supplied with oxygen and energy.
        </>
      ),
      ingredients: [
        { name: "Alpha GPC", imageSrc: "/ingredients/renders/AlphaGPC.jpg" },
        {
          name: "Ginkgo Biloba",
          imageSrc: "/ingredients/renders/GinkgoBiloba.jpg",
        },
        // Generic white-powder render: ALCAR's typical commercial form,
        // until a bespoke render ships.
        { name: "Acetyl-L-Carnitine", imageSrc: "/ingredients/renders/11.jpg" },
      ],
    },
    {
      stat: "+30%",
      label: "improvement in fatigue resistance",
      anchor: "¶",
      pillarName: "Reduces Mental Fatigue",
      oneLine: "Stay precise through long meetings and demanding work.",
      feltTranslation:
        "Hour three feels like hour one. No drop-off, no fade.",
      sourceRef: "PMID 18937015 · Malaguarnera et al. 2008",
      story: (
        <>
          In a placebo-controlled trial, participants taking{" "}
          <strong className="font-semibold text-black">
            Acetyl-L-Carnitine
          </strong>{" "}
          showed a 30% improvement in fatigue resistance.{" "}
          <strong className="font-semibold text-black">Vitamin B12</strong>{" "}
          and{" "}
          <strong className="font-semibold text-black">
            N-Acetyl Cysteine
          </strong>{" "}
          support the same energy pathway at the cellular level.
        </>
      ),
      ingredients: [
        { name: "Acetyl-L-Carnitine", imageSrc: "/ingredients/renders/11.jpg" },
        {
          name: "Vitamin B12",
          imageSrc: "/ingredients/renders/VitaminB12.jpg",
        },
        {
          name: "N-Acetyl Cysteine",
          imageSrc: "/ingredients/renders/NAcetylCysteine.jpg",
        },
      ],
    },
    {
      stat: "+57%",
      label: "increase in cerebral blood flow",
      anchor: "¶",
      pillarName: "Improves Mental Clarity",
      oneLine:
        "Lift cognitive performance through enhanced blood flow to the brain.",
      feltTranslation:
        "Faster connections. Cleaner thinking. Noticeable lift.",
      sourceRef: "PMID 22628390 · Laws et al. 2012",
      story: (
        <>
          Clinical research on{" "}
          <strong className="font-semibold text-black">Ginkgo Biloba</strong>{" "}
          shows a 57% increase in cerebral blood flow. More blood flow means
          more oxygen and glucose reaching neurons.{" "}
          <strong className="font-semibold text-black">Vitamin C</strong> and{" "}
          <strong className="font-semibold text-black">Glutathione</strong>{" "}
          protect those neurons while they work harder.
        </>
      ),
      ingredients: [
        {
          name: "Ginkgo Biloba",
          imageSrc: "/ingredients/renders/GinkgoBiloba.jpg",
        },
        { name: "Vitamin C", imageSrc: "/ingredients/renders/VitaminC.jpg" },
        // Generic white-powder render: glutathione's typical commercial
        // form, until a bespoke render ships.
        { name: "Glutathione", imageSrc: "/ingredients/renders/11.jpg" },
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
