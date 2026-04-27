// Why CONKA - Data for the persuasive value proposition page

export interface WhyConkaPoint {
  id: number;
  theme: "light" | "dark";
  headline: string;
  subheading: string;
  description: string;
  image?: string;
}

// The 7 key reasons to choose CONKA
export const whyConkaPoints: WhyConkaPoint[] = [
  {
    id: 1,
    theme: "dark",
    headline: "Over £500,000 invested in research, not advertising",
    subheading: "We put the majority of our money into research, third-party studies, and our own trials",
    description:
      "Working with neuroscientists at Durham University and Cambridge University, we've completed over 25 clinical trials with high-performing organisations. Every ingredient is backed by peer-reviewed research: 32 studies indexed in PubMed. The first trial showed a 16% increase in brain performance compared to placebo. We do all the hard research and bottle it into a simple, effective solution.",
    image: "/story/Screenshot_2025-11-10_171922.webp",
  },
  {
    id: 2,
    theme: "light",
    headline: "Used by Olympians, Premier League athletes, and C-suite executives",
    subheading: "When performance matters most, the best choose CONKA",
    description:
      "Tested by Bristol Rugby, McGuigan Boxing Gym, Blackburn Rovers, Sale Sharks, Team GB 7s, Toulouse Rugby, Leeds United, Bath Rugby, and more. Athletes like Finn Russell, Patrick Bamford, Jade Shekells, and Jack Willis have seen measurable improvements of up to +36% in cognitive performance. C-suite executives at Bank of America and Skyscanner trust CONKA for peak decision-making.",
    image: "/story/19347-jmp-harlequins-v-bath-jg-158.webp",
  },
  {
    id: 3,
    theme: "dark",
    headline: "Natural, high-quality ingredients, manufactured in the UK",
    subheading: "Grown by nature, refined by science",
    description:
      "We use premium botanical ingredients like Ashwagandha, Rhodiola rosea, Turmeric, and Ginkgo Biloba, all sourced for purity and potency. Our alcohol-free extraction method, invented by Dr. Shankar Katekhaye Ph.D, delivers faster absorption without compromising performance. Every batch is manufactured in the UK to the highest quality standards.",
    image: "/CONKA_01.jpg",
  },
  {
    id: 4,
    theme: "light",
    headline: "Measure your improvement with our industry-leading app",
    subheading: "We don't just talk. We show you the results",
    description:
      "CONKA includes an industry-leading cognitive testing app developed in partnership with Cambridge University. The Integrated Cognitive Assessment (ICA) is an unlearnable, 5-minute, language-independent digital test that measures your brain's processing speed with precision. It's purely a measurement of how your brain is performing. Track your cognitive function over time and see exactly how much CONKA is helping you, with objective proof of improvement.",
    image: "/story/Tech_Update_1.webp",
  },
  {
    id: 5,
    theme: "dark",
    headline: "Raising what's possible for human performance",
    subheading: "We're not trying to just sell a supplement",
    description:
      "We're on a mission to raise what's possible for people by giving them natural solutions to improve brain performance. Better cognitive function more consistently means better decisions and a better life. From concussion recovery to peak performance, we're helping people unlock their cognitive potential through science-backed nutrition.",
    image: "/TwoFounders.jpg",
  },
  {
    id: 6,
    theme: "light",
    headline: "Real results you can measure and feel",
    subheading: "Clinical studies meet real-world performance",
    description:
      "Our research shows +22% cognitive speed in men, +33% in women, and +16% overall cognitive efficiency. Individual case studies show improvements up to +36.72% in total cognitive scores. Ingredients are clinically proven: -56% stress scores, +63% memory improvement, +40% glutathione levels. These aren't marketing claims. They're verified statistics from peer-reviewed research.",
    image: "/lifestyle/flow/FlowConkaRing.jpg",
  },
  {
    id: 7,
    theme: "dark",
    headline: "Built by athletes, for athletes, and for everyone who demands more",
    subheading: "Born from personal need, validated by science",
    description:
      "Founded by two athletes. One whose career was cut short by concussion, the other an Olympian. CONKA was born from the need for brain recovery that didn't exist. After years of research and development, we've created two formulas: CONKA Flow for daily cognitive enhancement and CONKA Clarity for peak performance moments. Our commitment to quality means every product is 100% natural, non-GMO, and Informed Sport tested for professional athletes.",
    image: "/story/lab-extraction.jpg",
  },
];
