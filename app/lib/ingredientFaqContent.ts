/**
 * Ingredient-level FAQ for /ingredients (Phase 4 of the FAQ answer surface).
 *
 * These target the highest-volume terms in the keyword dataset ("ginkgo biloba
 * benefits", "ashwagandha side effects", etc.). Two questions per active: what
 * the evidence says it does, and its side effects / cautions. The side-effects
 * half is the part people actually search and the part no brand publishes
 * willingly.
 *
 * Disclosure policy (docs/development/featurePlans/faq-answer-surface.md): every
 * dose quoted here is the dose used in the cited study, explicitly labelled as
 * such, never CONKA's per-ingredient amount. Benefits are framed as study
 * observations, not product claims.
 *
 * The FAQPage JSON-LD on /ingredients is built from this same array, so schema
 * never describes anything the page does not render.
 */

import type { FaqEntry } from "./faqContent";

export const INGREDIENT_FAQ_ITEMS: FaqEntry[] = [
  // Ginkgo Biloba — highest-volume term in the whole keyword dataset.
  {
    id: "ingredient-ginkgo-benefits",
    question: "What is Ginkgo Biloba and what does it do?",
    answer:
      "Ginkgo Biloba is one of the most studied botanicals in cognition. Its flavonoids and terpenoids support cerebral microcirculation, helping oxygen and glucose reach neurons. A meta-analysis of 13 randomised controlled trials across 2,372 people found improvements in cognition, attention and memory versus placebo (Laws et al. 2012, PMID 22628390), with effects typically appearing after two to four weeks (Kaschel 2009). The dose used in those trials was around 240mg of standardised extract a day. Ginkgo Biloba is one of the nootropics in CONKA Clear.",
  },
  {
    id: "ingredient-ginkgo-side-effects",
    question: "Does Ginkgo Biloba have side effects? Who should avoid it?",
    answer:
      "Ginkgo is generally well tolerated. The mild effects occasionally reported in trials are headache and digestive upset. The caution that matters: Ginkgo can affect platelet activity and may increase bleeding risk, so it is advised against alongside blood-thinning or anticoagulant medication such as warfarin, and it should be stopped before planned surgery. If you take any prescription medication, check with your GP or pharmacist before starting.",
  },

  // Ashwagandha
  {
    id: "ingredient-ashwagandha-benefits",
    question: "What is Ashwagandha and what does it do?",
    answer:
      "Ashwagandha (Withania somnifera) is an adaptogen whose active withanolides modulate the HPA axis, the body's stress-response system. In a 60-day randomised, placebo-controlled trial, participants taking a standardised root extract showed a 28% reduction in serum cortisol and a large fall in perceived stress (Chandrasekhar et al. 2012, PMID 23439798); a separate trial reported improved sleep quality (Salve et al. 2019). The doses used in those studies ranged from roughly 250 to 600mg of extract a day. Ashwagandha is one of the adaptogens in CONKA Flow.",
  },
  {
    id: "ingredient-ashwagandha-side-effects",
    question: "Does Ashwagandha have side effects? Who should avoid it?",
    answer:
      "For most people Ashwagandha is well tolerated, with mild digestive upset or drowsiness the effects most often reported. It is not recommended in pregnancy or breastfeeding. Because it can influence thyroid hormones and the immune system, it is best avoided, or checked with a doctor first, if you have a thyroid or autoimmune condition or take thyroid medication, sedatives or immunosuppressants. Check with your GP or pharmacist if any of that applies to you.",
  },

  // Alpha GPC
  {
    id: "ingredient-alpha-gpc-benefits",
    question: "What is Alpha GPC and what does it do?",
    answer:
      "Alpha GPC (alpha-glycerylphosphorylcholine) is one of the most bioavailable forms of choline, the raw material the brain uses to make acetylcholine, the neurotransmitter behind memory and reaction speed. In controlled studies it improved measures of cognitive performance and physical output (Parker et al. 2015, PMID 26500463); the doses studied were in the region of 600 to 1,200mg a day. Alpha GPC is one of the nootropics in CONKA Clear.",
  },
  {
    id: "ingredient-alpha-gpc-side-effects",
    question: "Does Alpha GPC have side effects?",
    answer:
      "Alpha GPC is generally well tolerated. The effects occasionally reported in studies are mild: headache, heartburn or digestive discomfort, and at higher doses a small drop in blood pressure. There are no established major drug interactions, but as with any supplement, if you take prescription medication or have a medical condition, check with your GP or pharmacist first.",
  },

  // Rhodiola
  {
    id: "ingredient-rhodiola-benefits",
    question: "What is Rhodiola rosea and what does it do?",
    answer:
      "Rhodiola rosea is an adaptogen used for mental and physical fatigue under stress. Its rosavins and salidroside help preserve neurotransmitter balance and cellular energy. In a 28-day randomised, placebo-controlled trial in people with stress-related fatigue, a standardised extract reduced burnout scores and improved the ability to concentrate (Olsson et al. 2009, PMID 19016404); the dose used in that study was around 576mg a day. Rhodiola is one of the adaptogens in CONKA Flow.",
  },
  {
    id: "ingredient-rhodiola-side-effects",
    question: "Does Rhodiola have side effects? Who should avoid it?",
    answer:
      "Rhodiola is well tolerated, with mild dizziness or dry mouth occasionally reported. The caution to note is that it is commonly advised against alongside antidepressants, SSRIs and MAO inhibitors as a precaution, and alongside other stimulants. If you take medication for your mood, or are unsure, check with your GP or pharmacist before starting.",
  },

  // Lemon Balm
  {
    id: "ingredient-lemon-balm-benefits",
    question: "What is Lemon Balm and what does it do?",
    answer:
      "Lemon Balm (Melissa officinalis) is a calming botanical that supports GABA activity, one of the brain's main 'slow down' signals, without sedation. In placebo-controlled studies, single doses improved calmness and buffered the effect of stress on anxiety ratings (Kennedy et al. 2003 and 2006, PMID 12888775); the doses studied were around 600mg. Its rosmarinic acid also adds antioxidant activity. Lemon Balm is one of the ingredients in CONKA Flow.",
  },
  {
    id: "ingredient-lemon-balm-side-effects",
    question: "Does Lemon Balm have side effects?",
    answer:
      "Lemon Balm has a long history of food use and is generally very well tolerated. Mild drowsiness is the effect most often noted, so it can add to the effect of sedative medication. As a precaution it is best avoided in pregnancy and breastfeeding without medical advice. If you take sedatives or thyroid medication, check with your GP or pharmacist first.",
  },
];
