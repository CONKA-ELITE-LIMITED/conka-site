/**
 * "What to expect" V2 milestone data for the PDP scroll timeline
 * (Flow / Clear / Both).
 *
 * PLACEHOLDER COPY: the 5-beat copy below is the Gray Matters reference text,
 * used verbatim while the layout ships. The CONKA copy + asset pass per
 * product is Phase 2 in docs/development/featurePlans/what-to-expect-v2-timeline.md,
 * and swapping it is a data-only edit to this file.
 */

export interface ExpectV2Milestone {
  title: string;
  body: string;
}

export type ExpectV2ProductId = "01" | "02" | "both";

const placeholderMilestones: ExpectV2Milestone[] = [
  {
    title: "First 15 Mins",
    body: "Most people experience a mental uplift within minutes.",
  },
  {
    title: "Next 4-8 Hours",
    body: "Heightened flow state due to the powerful & synergistic effects our four blends. Experience a calm, focused, long-lasting productive state of mind.",
  },
  {
    title: "No Crash Ever",
    body: "Plant-based energy & stress busting adaptogens create a steady energic state without a crash.",
  },
  {
    title: "Week 1",
    body: "You'll notice increases in productivity due to less fatigue in the afternoons and more clarity in the mornings. Brain fog is a thing of the past.",
  },
  {
    title: "Week 2+",
    body: "Your cognitive stamina improves as nootropics boost acetylcholine and neurogenesis, while adaptogens enhance your mood by regulating cortisol and stress.",
  },
];

export const expectV2Header = {
  title: "Train your mind like you do your body",
  subtitle: "Enhance focus, energy, and clarity, one sip at a time.",
};

export const expectV2Milestones: Record<ExpectV2ProductId, ExpectV2Milestone[]> = {
  "01": placeholderMilestones,
  "02": placeholderMilestones,
  both: placeholderMilestones,
};

export interface ExpectV2Asset {
  /** Portrait-friendly render for the desktop sticky column. */
  src: string;
  alt: string;
}

export const expectV2Asset: Record<ExpectV2ProductId, ExpectV2Asset> = {
  "01": {
    src: "/formulas/conkaFlow/FlowNoBackground.png",
    alt: "CONKA Flow bottle",
  },
  "02": {
    src: "/formulas/conkaClear/ClearNoBackground.png",
    alt: "CONKA Clear bottle",
  },
  both: {
    src: "/formulas/both/BothHold.jpg",
    alt: "CONKA Flow and Clear shots held together",
  },
};
