/**
 * The only source of customer-facing Q&A. Every surface imports from here; none
 * keeps its own copy.
 *
 * The FAQPage JSON-LD is built from this same array, so the schema cannot
 * describe anything the page does not render.
 *
 * Order follows the conversion arc: differentiation, safety, usage, results,
 * product choice, risk reversal, logistics.
 */

import {
  GUARANTEE_LABEL_FULL,
  GUARANTEE_COPY_TRIAL,
} from "@/app/lib/offerConstants";

/** Groupings, so a surface can select a subset instead of holding its own copy. */
export type FaqCategory =
  | "about"
  | "efficacy"
  | "safety"
  | "usage"
  | "commercial";

/** What a FAQ component needs to render a row. Landing configs supply their own. */
export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export interface FaqItem extends FaqEntry {
  category: FaqCategory;
}

/** Strip claim anchors (††) for surfaces that do not render the footnote. */
export function stripClaimAnchors(text: string): string {
  return text.replace(/†/g, "");
}

/**
 * The curated conversion subset. Only `/faq` renders the full set; every
 * conversion surface (home, /conka-both, /start, the landers) renders these,
 * and their FAQPage schema is built from the same list so schema == visible.
 *
 * Ordered by the conversion arc (differentiation, trust, results, choice, risk
 * reversal, logistics), which is deliberately not the hub's category grouping.
 * Edit here to change every conversion surface at once.
 */
export const CONVERSION_FAQ_IDS = [
  "different",
  "daily-safety",
  "side-effects",
  "drug-test",
  "results",
  "how-to-take",
  "which-product",
  "guarantee",
  "delivery",
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-conka",
    question: "What is CONKA?",
    answer:
      "CONKA is a daily nootropic brain shot: a 30ml liquid shot you drink straight from the bottle. There are two formulas. CONKA Flow is the morning shot, built on adaptogens like Ashwagandha, Rhodiola and Lemon Balm. CONKA Clear is the afternoon shot, built on nootropics like Alpha GPC and Ginkgo Biloba, plus Vitamin C. Both are caffeine-free, Informed Sport certified, and made in the UK.",
    category: "about",
  },
  {
    id: "is-it-a-medicine",
    question: "Is CONKA a medicine?",
    answer:
      "No. CONKA is a food supplement, not a medicine. It is not intended to diagnose, treat, cure or prevent any disease, and it is not a substitute for prescribed medication. It sits alongside a normal diet, and like any supplement it works best with sleep, food and exercise doing their share.",
    category: "about",
  },
  {
    id: "different",
    question: "What makes CONKA different?",
    answer:
      "Most nootropics are capsules with underdosed ingredients. CONKA is a liquid shot: clinical doses in 30ml, absorbed fast. It's a complete system, Flow for your morning, Clear for your afternoon. The formula is patented (GB2620279). Every batch is Informed Sport tested. And you don't have to take our word for any of it: the CONKA app tracks your cognitive scores, so you can measure the difference yourself.",
    category: "about",
  },
  {
    id: "daily-safety",
    question: "Is CONKA safe to take every day?",
    answer:
      "Yes. CONKA is built for daily use, and every batch is Informed Sport certified and tested for 280+ banned substances, the same standard professional athletes are held to. Both formulas are caffeine-free, so there is no stimulant to build up. If you are pregnant, breastfeeding, giving it to a child, or taking prescription medication, read the questions below and check with your doctor before starting.",
    category: "safety",
  },
  {
    id: "side-effects",
    question: "Are there any side effects?",
    answer:
      "For most people, no, and CONKA is generally well tolerated. The most commonly reported effect with botanical supplements like these is mild digestive change in the first few days as your body adjusts. Because both formulas are caffeine-free, there are none of the jitters, spikes or crashes a stimulant causes. If you have an unusual or persistent reaction, stop taking it and speak to your doctor.",
    category: "safety",
  },
  {
    id: "who-should-not",
    question: "Who should not take CONKA?",
    answer:
      "Do not take CONKA if you are pregnant or breastfeeding, and it is not suitable for children under 3. If you take prescription medication, have a diagnosed medical condition (particularly a thyroid, bleeding or autoimmune condition), or have surgery coming up, check with your GP or pharmacist before starting. CONKA is a food supplement, an addition to a balanced diet rather than a medicine, and it is not a substitute for anything a doctor has prescribed.",
    category: "safety",
  },
  {
    id: "pregnancy",
    question: "Can I take CONKA if I'm pregnant or breastfeeding?",
    answer:
      "No. We do not recommend CONKA during pregnancy or breastfeeding. Several of the botanical ingredients, including Ashwagandha, have not been established as safe in pregnancy, so the responsible position is to leave them out rather than reassure you on evidence that does not exist. If you are trying to conceive, pregnant, or breastfeeding, speak to your midwife or GP about any supplement.",
    category: "safety",
  },
  {
    id: "under-18",
    question: "Can children or under-18s take CONKA?",
    answer:
      "Yes, from age 3 and up. CONKA is suitable for children over 3 and for teenagers, not only adults. It is a food supplement, an addition to a balanced diet and lifestyle rather than a medicine or a cure, so it works alongside good food, sleep and exercise. We do not recommend it for children under 3. As with any supplement, if your child takes medication or has a health condition, check with your GP first.",
    category: "safety",
  },
  {
    id: "medication",
    question: "Can I take CONKA with prescription medication?",
    answer:
      "Often yes, but check with your GP or pharmacist first, because it depends on the medication. CONKA is a food supplement rather than a medicine, but some of its botanicals can interact with specific drug groups: Ginkgo Biloba with blood-thinning or anticoagulant medication, Ashwagandha with thyroid medication and sedatives, and Rhodiola with antidepressants. If you take anything in those groups, or any medicine with a narrow safe range, run the ingredient list past your pharmacist before you start. It is a two-minute conversation and worth having.",
    category: "safety",
  },
  {
    id: "adhd-medication",
    question: "Can I take CONKA alongside ADHD medication?",
    answer:
      "There is no known direct interaction between CONKA and stimulant ADHD medication such as methylphenidate or amphetamine, but check with your prescriber before combining them. CONKA is caffeine-free and is not a stimulant, and it is not a replacement for prescribed ADHD treatment. Many people take it for everyday focus and calm; it is not a medicine and does not treat ADHD.",
    category: "safety",
  },
  {
    id: "antidepressants",
    question: "Can I take CONKA with antidepressants or SSRIs?",
    answer:
      "Check with your GP first. The ingredient to flag is Rhodiola, which is commonly advised against alongside antidepressants and SSRIs as a precaution. This is exactly the kind of combination worth a quick word with the doctor who prescribed your medication, who can look at your specific prescription rather than a general answer.",
    category: "safety",
  },
  {
    id: "addictive",
    question: "Is CONKA addictive? Will I become reliant on it?",
    answer:
      "No. CONKA contains no caffeine, no stimulants and nothing habit-forming, and there is no evidence of dependence, tolerance or withdrawal with the adaptogens and nootropics it uses. You will not need a bigger dose over time to get the same effect, and you can stop whenever you like without a rebound. It is a daily supplement you choose to take, not something your body starts to need.",
    category: "safety",
  },
  {
    id: "stopping",
    question: "What happens if I stop taking CONKA?",
    answer:
      "Nothing abrupt. There is no withdrawal and nothing rebounds, because the ingredients are not habit-forming. What CONKA does reflects what is in your system, so if you stop, the effect tapers off gently over the following days as levels clear rather than dropping off a cliff. You can pause and restart whenever you want.",
    category: "safety",
  },
  {
    id: "drug-test",
    question: "Will CONKA show up on a drug test? Does it contain banned substances?",
    answer:
      "No, and this is one of the few things we can say with certainty. Every batch of CONKA Flow and CONKA Clear is independently tested by Informed Sport, the most rigorous certification in sports nutrition, and screened for more than 280 substances banned in sport. That is why professional and drug-tested athletes use it. Both formulas are also caffeine-free.",
    category: "safety",
  },
  {
    id: "alcohol",
    question: "Can I drink alcohol with CONKA?",
    answer:
      "Yes. There is no harmful interaction between CONKA and moderate alcohol, so you can drink as you normally would. CONKA Clear is built around antioxidants, and a Clear shot the morning after can help take the edge off. It will not cure a hangover, but it can help. The only caveat is the obvious one: alcohol pulls against the steady focus CONKA is there to give, so a heavy night undoes some of the point.",
    category: "safety",
  },
  {
    id: "how-to-take",
    question: "How do I take CONKA?",
    answer:
      "Two shots, ten seconds each. Flow in the morning to set up your focus for the day. Clear in the afternoon, right when most people hit the dip. Straight from the bottle. No powders, no mixing, no timing windows.",
    category: "usage",
  },
  {
    id: "results",
    question: "When will I notice results?",
    answer:
      "Day 1: sharper focus and steady energy, no crash. Day 14: adaptogens like Ashwagandha reach full strength and stress rolls off faster. Day 30: your baseline sits measurably higher. Across 150+ tested users and 5,000+ cognitive tests, the average score improvement was +28.96%.",
    category: "efficacy",
  },
  {
    id: "which-product",
    question: "Flow, Clear, or Both?",
    answer:
      "Flow (black cap) is for mornings: adaptogens like Ashwagandha and Lemon Balm for calm, caffeine-free focus. Clear (white cap) is for afternoons: nootropics like Alpha GPC and Glutathione, plus Vitamin C. Both is the full system. Morning to evening covered, designed to work as a pair, and the best value per shot.",
    category: "about",
  },
  {
    id: "guarantee",
    question: "What if it doesn't work for me?",
    answer: `Then you get your money back. ${GUARANTEE_COPY_TRIAL}, and if you're not satisfied, contact us for a full refund. No returns needed, no questions asked. That's the ${GUARANTEE_LABEL_FULL}: we're confident enough in the product to take the risk for you.`,
    category: "commercial",
  },
  {
    id: "delivery",
    question: "When will I receive my order?",
    answer:
      "Fast. Order before 2pm and it ships the same day. Most UK customers have theirs within 1 to 2 working days, and subscriptions ship free. You'll get tracking by email the moment it dispatches. Subscribers can pause, change, or cancel anytime from their account. No contracts.",
    category: "commercial",
  },

  // Efficacy: the scepticism cluster. These are the questions a doubter types
  // into a search box, and the ones we can answer better than the category.
  {
    id: "do-nootropics-work",
    question: "Do nootropics actually work?",
    answer:
      "It depends entirely on the ingredient and the dose, and most of the category deserves its scepticism. Plenty of nootropics are proprietary blends in a capsule, where the ingredient is named but the amount is a fraction of what the research used, so the study the label leans on does not apply to the product in your hand. What we did instead was build the formulas around the doses used in published trials, put them in liquid so they are absorbed rather than sitting in a capsule shell, and then measure the result: the CONKA app runs a two-minute cognitive test so you can see your own scores rather than trusting ours.",
    category: "efficacy",
  },
  {
    id: "placebo",
    question: "Is it just placebo?",
    answer:
      "It is a fair question, and it is the reason we built the app. Every CONKA customer can run a two-minute FDA-cleared cognitive test on and off CONKA and watch their own scores, which is not something you can do with a supplement that only offers you a feeling. Across 150+ tested users and more than 5,000 cognitive tests, the average score improvement was +28.96%. You do not have to take that number on trust either: run the test yourself and see what your own line does.",
    category: "efficacy",
  },
  {
    id: "underdosed",
    question: "Are the ingredients clinically dosed, or underdosed?",
    answer:
      "Clinically dosed.† The formulas were built around the doses used in the published trials on each ingredient, not the trace amounts that let a label name-drop an ingredient it has barely included. We do not publish the per-ingredient breakdown, because the individual amounts are patented (GB2620279) and it is the part a competitor would copy. What we will say is that CONKA is a liquid, so the actives are absorbed rather than waiting on a capsule to break down, and every batch is Informed Sport certified, which means an independent lab has tested what is actually in the bottle.",
    category: "efficacy",
  },
  {
    id: "no-effect",
    question: "What if I don't feel anything?",
    answer:
      "Some people feel the first shot and some feel nothing for a fortnight, and neither is a sign of whether it is working. Adaptogens like Ashwagandha build up over roughly two weeks rather than hitting like caffeine, so the honest advice is to give it 30 days and use the app to check whether your scores are moving even when your subjective sense is not. If you get to the end of that and it has done nothing for you, take the money back. That is what the 100-day guarantee is for.",
    category: "efficacy",
  },

  // Usage
  {
    id: "when-to-take",
    question: "When should I take CONKA Flow and CONKA Clear?",
    answer:
      "CONKA Flow in the morning, CONKA Clear in the early afternoon. Flow is designed to set up the front half of your day and can be taken with or without food. Clear is designed for the point most people hit the dip and reach for a second coffee, so early afternoon is the natural slot, though it also works 30 to 60 minutes before something demanding. Neither has a strict timing window; consistency matters more than the exact hour.",
    category: "usage",
  },
  {
    id: "caffeine",
    question: "Does CONKA contain caffeine?",
    answer:
      "No. Both CONKA Flow and CONKA Clear are completely caffeine-free. There is no stimulant in either formula, which means nothing to spike from and nothing to crash off, and it is why Clear can be taken in the afternoon without the sleep problem an afternoon coffee causes.",
    category: "usage",
  },
  {
    id: "with-coffee",
    question: "Can I take CONKA with coffee?",
    answer:
      "Yes. CONKA is caffeine-free, so it works alongside your morning coffee rather than competing with it. Most people find they reach for fewer cups over time, but nothing about CONKA requires you to give up coffee, and there is no interaction to worry about.",
    category: "usage",
  },
  {
    id: "sleep",
    question: "Will CONKA affect my sleep?",
    answer:
      "It should not, because there is no caffeine or stimulant in either formula. This is the practical difference between CONKA and most 'focus' products: a shot with caffeine in it has to carry a warning about taking it after early afternoon, and CONKA Clear does not, which is precisely why it is built for the afternoon slot.",
    category: "usage",
  },
  {
    id: "taste",
    question: "What does CONKA taste like?",
    answer:
      "CONKA Flow tastes of turmeric, earthy and slightly sweet, and it is a yellowish-brown liquid. CONKA Clear is citrus, made with real lemon juice and lemon essential oil. Neither is trying to taste like a soft drink: this is a 30ml shot with a serious amount of active botanical in it, and it tastes like one. It is over in ten seconds.",
    category: "usage",
  },
  {
    id: "allergens",
    question: "Is CONKA vegan? Is it free from allergens?",
    answer:
      "CONKA is vegan, non-GMO, and free from all 14 declarable allergens: no gluten, dairy, egg, soy, nuts, peanuts, sesame, fish, shellfish, molluscs, celery, mustard, lupin or sulphites. The formulas contain no animal-derived materials or processing aids. As with any manufacturer handling multiple products, absolute absence of trace cross-contamination further up the supply chain cannot be guaranteed.",
    category: "usage",
  },
  {
    id: "storage",
    question: "How should I store CONKA, and does it expire?",
    answer:
      "Store CONKA in a cool, dry place away from direct sunlight and heat. It does not need refrigerating. Unopened and stored correctly, shelf life is 36 months from manufacture, and every bottle carries its own date.",
    category: "usage",
  },

  // Commercial
  {
    id: "price",
    question: "Why does CONKA cost what it costs?",
    answer:
      "Because the doses are real, and that is the expensive part. It is straightforward to make a cheap nootropic: name a long list of impressive ingredients, include a fraction of the amount the research used, and sell it in a capsule. The cost of a formula built around published trial doses is mostly raw material, and it goes up again when every batch is sent for independent Informed Sport testing. On a quarterly subscription CONKA works out cheaper per day than the coffee it tends to replace, and if it does not earn its place you have 100 days to get your money back.",
    category: "commercial",
  },
  {
    id: "subscription",
    question: "Can I pause or cancel my subscription?",
    answer:
      "Yes, anytime, from your account. There is no contract, no minimum term and no cancellation fee, and you can pause instead of cancelling if you just want to skip a month. Subscriptions also ship free.",
    category: "commercial",
  },
];

const FAQ_BY_ID = new Map(FAQ_ITEMS.map((item) => [item.id, item]));

/**
 * The conversion subset, resolved in CONVERSION_FAQ_IDS order. Throws at module
 * load if an id is misspelled or removed, so a bad reference fails the build
 * rather than silently dropping a question.
 */
export const CONVERSION_FAQ_ITEMS: FaqItem[] = CONVERSION_FAQ_IDS.map((id) => {
  const item = FAQ_BY_ID.get(id);
  if (!item) throw new Error(`CONVERSION_FAQ_IDS references unknown FAQ id "${id}"`);
  return item;
});

/**
 * Resolve specific canonical items by id, in the order given. Lets a surface
 * with its own product-specific questions (e.g. the Flow/Clear PDPs) graft on a
 * few shared answers from the single source rather than restating them. Throws
 * on an unknown id so a typo fails the build.
 */
export function pickFaqItems(...ids: string[]): FaqItem[] {
  return ids.map((id) => {
    const item = FAQ_BY_ID.get(id);
    if (!item) throw new Error(`pickFaqItems references unknown FAQ id "${id}"`);
    return item;
  });
}

/** The shared trust answers grafted onto the consumer PDPs (Phase 3). */
export const PDP_TRUST_FAQ_IDS = ["side-effects", "drug-test"] as const;
