import ScienceExplainer, {
  type ExplainerData,
} from "./ScienceExplainer";

const NOOTROPICS_DATA: ExplainerData = {
  eyebrow: "// Education · SCI-05",
  heading: "What are nootropics?",
  systemTag: "Performance system",
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  definition:
    "Nootropics are compounds that support the brain's performance directly: how well you focus, how fast you process, how reliably you recall. They work on the machinery of thinking itself.",
  analogy:
    "Think of them less like fuel and more like tuning the engine. The same brain, running cleaner and responding faster.",
  mechanism: [
    {
      label: "Neurotransmitters",
      detail:
        "Much of focus and memory runs on chemical messengers like acetylcholine. Several nootropics support the supply and signalling these depend on.",
    },
    {
      label: "Cerebral blood flow",
      detail:
        "The brain is a small organ with a large appetite for oxygen and glucose. Some actives support healthy blood flow, so more of both reaches the neurons doing the work.",
    },
    {
      label: "Cellular energy",
      detail:
        "Neurons are energy-hungry. Some actives support the mitochondria that power them, which shows up as stamina for sustained mental work.",
    },
  ],
  doseNote:
    "Same rule as adaptogens: the effect lives in the dose. We use the amounts the research used, with the active named and the quantity stated, not buried in a proprietary blend.",
  tags: ["Neurotransmitter support", "Cerebral blood flow", "Cellular energy"],
};

export default function ScienceNootropics() {
  return <ScienceExplainer data={NOOTROPICS_DATA} />;
}
