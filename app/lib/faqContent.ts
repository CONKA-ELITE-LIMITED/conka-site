/**
 * Centralised FAQ content.
 *
 * Single source of truth for the customer-facing Q&A used by LabFAQ
 * (home, /conka-both) and CROFAQv2 (/start). Question order follows the
 * conversion arc: differentiation, safety, usage, results, product choice,
 * risk reversal, logistics. Update copy here, not in individual components.
 */

import {
  GUARANTEE_LABEL_FULL,
  GUARANTEE_COPY_TRIAL,
} from "@/app/lib/offerConstants";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "different",
    question: "What makes CONKA different?",
    answer:
      "Most nootropics are capsules with underdosed ingredients. CONKA is a liquid shot: clinical doses in 30ml, absorbed fast. It's a complete system, Flow for your morning, Clear for your afternoon. The formula is patented (GB2620279). Every batch is Informed Sport tested. And you don't have to take our word for any of it: the CONKA app tracks your cognitive scores, so you can measure the difference yourself.",
  },
  {
    id: "daily-safety",
    question: "Is CONKA safe to take every day?",
    answer:
      "Yes. CONKA is built for daily use. Every batch is Informed Sport certified and tested for 280+ banned substances, the same standard professional athletes are held to. Flow is caffeine-free, so it works alongside your morning coffee. If you're pregnant, breastfeeding, or on medication, check with your doctor first.",
  },
  {
    id: "how-to-take",
    question: "How do I take CONKA?",
    answer:
      "Two shots, ten seconds each. Flow in the morning to set up your focus for the day. Clear in the afternoon, right when most people hit the dip. Straight from the bottle. No powders, no mixing, no timing windows.",
  },
  {
    id: "results",
    question: "When will I notice results?",
    answer:
      "Day 1: sharper focus and steady energy, no crash. Day 14: adaptogens like Ashwagandha reach full strength and stress rolls off faster. Day 30: your baseline sits measurably higher. Across 150+ tested users and 5,000+ cognitive tests, the average score improvement was +28.96%.",
  },
  {
    id: "which-product",
    question: "Flow, Clear, or Both?",
    answer:
      "Flow (black cap) is for mornings: adaptogens like Ashwagandha and Lemon Balm for calm, caffeine-free focus. Clear (white cap) is for afternoons: nootropics like Alpha GPC and Glutathione, plus Vitamin C, which contributes to normal psychological function.†† Both is the full system. Morning to evening covered, designed to work as a pair, and the best value per shot.",
  },
  {
    id: "guarantee",
    question: "What if it doesn't work for me?",
    answer: `Then you get your money back. ${GUARANTEE_COPY_TRIAL}, and if you're not satisfied, contact us for a full refund. No returns needed, no questions asked. That's the ${GUARANTEE_LABEL_FULL}: we're confident enough in the product to take the risk for you.`,
  },
  {
    id: "delivery",
    question: "When will I receive my order?",
    answer:
      "Fast. Order before 2pm and it ships the same day. Most UK customers have theirs within 1 to 2 working days, and subscriptions ship free. You'll get tracking by email the moment it dispatches. Subscribers can pause, change, or cancel anytime from their account. No contracts.",
  },
];
