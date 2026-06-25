// CONKA lander — FAQ content.
//
// Curated from app/lib/faqContent.ts and adapted for the standalone lander
// (claim footnote symbols removed, guarantee written out in full). Self-contained
// to match the lander's per-section data pattern.

export interface LanderFaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: LanderFaqItem[] = [
  {
    question: 'What makes CONKA different?',
    answer:
      "Most nootropics are capsules with underdosed ingredients. CONKA is a liquid shot: clinical doses in 30ml, absorbed fast. It's a complete system, Flow for your morning and Clear for your afternoon. The formula is patented (GB2620279), and every batch is Informed Sport tested. You don't have to take our word for it either: the CONKA app tracks your cognitive scores so you can measure the difference yourself.",
  },
  {
    question: 'Is CONKA safe to take every day?',
    answer:
      'Yes. CONKA is built for daily use. Every batch is Informed Sport certified and tested for 280+ banned substances, the same standard professional athletes are held to. Flow is caffeine-free, so it works alongside your morning coffee. If you are pregnant, breastfeeding, or on medication, check with your doctor first.',
  },
  {
    question: 'How do I take CONKA?',
    answer:
      'Two shots, ten seconds each. Flow in the morning to set up your focus for the day. Clear in the afternoon, right when most people hit the dip. Straight from the bottle. No powders, no mixing, no timing windows.',
  },
  {
    question: 'When will I notice results?',
    answer:
      'Day 1: sharper focus and steady energy, no crash. Day 14: adaptogens like Ashwagandha reach full strength and stress rolls off faster. Day 30: your baseline sits measurably higher. Across 150+ tested users and 5,000+ cognitive tests, the average score improvement was +28.96%.',
  },
  {
    question: 'Flow, Clear, or Both?',
    answer:
      'Flow (black cap) is for mornings: adaptogens like Ashwagandha and Lemon Balm for calm, caffeine-free focus. Clear (white cap) is for afternoons: nootropics like Alpha GPC and Glutathione, plus Vitamin C. Both is the full system, morning to evening covered, designed to work as a pair, and the best value per shot.',
  },
  {
    question: "What if it doesn't work for me?",
    answer:
      'Then you get your money back. Try CONKA for up to 100 days, and if you are not satisfied, contact us for a full refund. No returns needed, no questions asked. That is the 100-day money-back guarantee: we are confident enough in the product to take the risk for you.',
  },
  {
    question: 'When will I receive my order?',
    answer:
      'Fast. Order before 2pm and it ships the same day. Most UK customers have theirs within 1 to 2 working days, and subscriptions ship free. You will get tracking by email the moment it dispatches. Subscribers can pause, change, or cancel anytime from their account. No contracts.',
  },
];
