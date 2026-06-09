import ScienceExplainer, {
  type ExplainerData,
} from "./ScienceExplainer";

const ADAPTOGENS_DATA: ExplainerData = {
  eyebrow: "// Education · SCI-04",
  heading: "What are adaptogens?",
  systemTag: "Resilience system",
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  definition:
    "Adaptogens are natural compounds that help your body adapt to stress instead of forcing a response the way a stimulant does. They nudge an overworked stress system back toward balance.",
  ingredientsLabel: "Adaptogens in the CONKA system",
  ingredients: [
    {
      name: "Ashwagandha",
      render: "/ingredients/renders/Ashwagandha.jpg",
      note: "Cortisol modulator",
    },
    {
      name: "Rhodiola rosea",
      render: "/ingredients/renders/RhodiolaRosea.jpg",
      note: "Anti-fatigue",
    },
    {
      name: "Lemon balm",
      render: "/ingredients/renders/LemonBalm.jpg",
      note: "Calm without sedation",
    },
  ],
  analogy:
    "Think of them like a thermostat for stress. Rather than blasting heat or cold, they hold the room at a workable temperature.",
  mechanism: [
    {
      label: "The HPA axis",
      detail:
        "Your hypothalamus, pituitary, and adrenal glands form the loop that runs your stress response. Under constant load it stays switched on long after the threat has passed.",
    },
    {
      label: "Cortisol",
      detail:
        "Adaptogens help modulate this axis so cortisol, the main stress hormone, settles into a healthier daily rhythm rather than running high from morning to night.",
    },
    {
      label: "The result",
      detail:
        "A steadier baseline. You stay composed under pressure, and you are not paying for today's focus with tomorrow's crash.",
    },
  ],
  doseNote:
    "Mechanism only matters at the right dose. Adaptogens are studied as specific amounts of specific extracts. Below that threshold you get the name on the label and little of the effect, which is why we dose to the research and name every extract.",
  tags: ["HPA-axis modulation", "Cortisol rhythm", "Non-sedating"],
};

export default function ScienceAdaptogens() {
  return <ScienceExplainer data={ADAPTOGENS_DATA} />;
}
