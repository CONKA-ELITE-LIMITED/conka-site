/**
 * What to expect / transformation timeline copy per product (formulas + protocols).
 * Used on PDP to show stages: immediate → 7 days → 14 days → 30 days → 60+.
 * Copy is feeling-led, laced with light science (mechanisms, pathways, outcomes) for credibility.
 *
 * ASSET RECOMMENDATIONS (per stage, optional):
 * - Flow: (1) Person taking shot / morning ritual. (2) Calm workspace or morning routine.
 *   (3) Focused work or exercise. (4) Balanced lifestyle / wind-down. (5) Long-term habit / bottle in routine.
 * - Clear: (1) Desk / screen work, clear head. (2) Supplement + water. (3) Deep work / clarity moment.
 *   (4) Sustained focus / week view. (5) Wellness routine.
 * Style: Real lifestyle or product-in-use; avoid stock clichés. Optional: subtle abstract (e.g. neurons, antioxidants)
 * for 30/60+ to signal “science” without being clinical.
 */

import type { FormulaId, ProtocolId, ProductId } from "./productData";

export interface WhatToExpectStep {
  subheading: string;
  heading: string;
  body: string;
}

export const whatToExpectStepsFlow: WhatToExpectStep[] = [
  {
    subheading: "Within 30 minutes",
    heading: "Calm focus without the fog",
    body: "Lemon balm supports GABA in the brain—you’ll get a calmer, clearer head without sedation. You’ll feel less mental chatter and easier focus within the first half-hour as your system responds to the blend.",
  },
  {
    subheading: "7 Days",
    heading: "The shift begins",
    body: "With daily use, adaptogens like ashwagandha and rhodiola stack. You’ll feel stress more manageable and mornings smoother. Your body adapts and builds a new baseline.",
  },
  {
    subheading: "14 Days",
    heading: "Energy, focus & resilience",
    body: "Turmeric’s support for BDNF and brain circulation, plus rhodiola’s fatigue-buffering effects, show up. You’ll feel steadier energy and focus through the day, with fewer afternoon dips and clearer mental clarity.",
  },
  {
    subheading: "30 Days",
    heading: "Mind & body in balance",
    body: "The benefits compound—neuroprotection and calm focus from the full stack. You’ll feel more balanced: sustained clarity, steadier energy, and a calmer baseline. It becomes a non-negotiable part of your routine.",
  },
  {
    subheading: "60+ Days",
    heading: "Total system strength",
    body: "You’re supporting your system for the long run. You’ll maintain focus, resilience, and balance as part of a sustainable daily habit—not a short-term spike.",
  },
];

export const whatToExpectStepsClear: WhatToExpectStep[] = [
  {
    subheading: "Within 30 minutes",
    heading: "Clearer head, less brain fog",
    body: "Glutathione and vitamin C dampen oxidative stress in the brain—you’ll feel the fog lift and complex tasks get easier from the first use. You’ll have a clearer head and sharper thinking within 30 minutes.",
  },
  {
    subheading: "7 Days",
    heading: "Antioxidant baseline building",
    body: "As you take it daily, glutathione and NAC (a glutathione precursor) build in your system. You’ll feel thinking get sharper and mental fatigue lighter as your antioxidant capacity rises.",
  },
  {
    subheading: "14 Days",
    heading: "Noticeable cognitive lift",
    body: "Vitamin C is concentrated in neurons and supports focus and decision speed. After two weeks you’ll feel steadier focus and more repeatable mental performance. Cognitive and clarity improvements are clearly there.",
  },
  {
    subheading: "30 Days",
    heading: "Compound mental clarity",
    body: "The full antioxidant and nootropic stack compounds. You’ll feel mental clarity and focus established—support for brain energy and resilience that sticks, not a short-lived boost.",
  },
  {
    subheading: "60+ Days",
    heading: "Long-term clarity & wellbeing",
    body: "You’re supporting clarity and cognitive health for the long term. You’ll maintain sharp thinking and balance—ingredients that support your brain over time, not just a short-term fix.",
  },
];

export const whatToExpectByFormula: Record<FormulaId, WhatToExpectStep[]> = {
  "01": whatToExpectStepsFlow,
  "02": whatToExpectStepsClear,
};

// ===== PROTOCOL TIMELINES =====
// Protocol timelines blend CONKA Flow + CONKA Clear, emphasizing synergy.
// Copy reduces repetition by using ingredient/mechanism names instead of product names.
// Science is laced throughout using pathways, mechanisms, and outcomes.

export const whatToExpectStepsResilience: WhatToExpectStep[] = [
  {
    subheading: "Within 30 minutes",
    heading: "Calm baseline, sharper focus when it counts",
    body: "Adaptogens like ashwagandha and rhodiola start modulating stress response pathways while glutathione and vitamin C dampen oxidative stress. You'll feel mental chatter ease and focus sharpen—the combination gives you a calm baseline with clarity when you need it.",
  },
  {
    subheading: "7 Days",
    heading: "Stress more manageable, recovery building",
    body: "Daily adaptogens modulate stress response pathways and maintain antioxidant balance, building resilience. Weekly glutathione and NAC support cognitive peaks by strengthening cellular repair capacity. You'll feel mornings smoother and recovery faster as systemic pressure reduces while repair mechanisms strengthen.",
  },
  {
    subheading: "14 Days",
    heading: "Steadier energy, fewer afternoon dips",
    body: "The synergy shows: adaptogens stack with nootropic support for focus and brain energy. Turmeric's BDNF support and rhodiola's fatigue-buffering effects combine with glutathione's cellular repair. You'll feel steadier through the day with less burnout and clearer thinking when you need to perform.",
  },
  {
    subheading: "30 Days",
    heading: "Resilience and clarity in rhythm",
    body: "Stress response pathways stabilize while cellular repair capacity compounds. You'll feel stress more manageable and mental clarity reliable—a system that supports recovery and performance without overload. The protocol becomes a non-negotiable part of your routine.",
  },
  {
    subheading: "60+ Days",
    heading: "Sustainable resilience",
    body: "You're supporting long-term stress resilience and cognitive performance. Adaptogens maintain antioxidant balance and reduce systemic pressure; glutathione and NAC fuel mitochondrial function. Sustainable support for those who need resilience without compromise.",
  },
];

export const whatToExpectStepsPrecision: WhatToExpectStep[] = [
  {
    subheading: "Within 30 minutes",
    heading: "Fog lifts, thinking sharpens",
    body: "Glutathione and NAC get to work fast, replenishing antioxidant reserves and dampening oxidative stress. Alpha GPC supports acetylcholine pathways while adaptogens keep the system steady. You'll feel the fog lift and complex tasks get easier without the jitters—clarity with balance.",
  },
  {
    subheading: "7 Days",
    heading: "Cognitive baseline building",
    body: "Daily glutathione synthesis and mitochondrial function strengthen cellular infrastructure. Alpha GPC and vitamin C build your neurological foundation while weekly adaptogens prevent burnout by modulating stress pathways. You'll feel thinking get sharper and mental fatigue lighter.",
  },
  {
    subheading: "14 Days",
    heading: "Noticeable mental endurance",
    body: "The synergy is clear: glutathione and NAC rebuild cellular repair capacity while adaptogens reduce systemic pressure. Cerebral blood flow improves and cognitive support compounds. You'll feel steadier focus and longer mental endurance—peak clarity without the crash.",
  },
  {
    subheading: "30 Days",
    heading: "Compound clarity and balance",
    body: "The full nootropic and adaptogen stack compounds. Glutathione reserves replenish, mitochondrial function strengthens, and stress pathways stabilize. You'll feel mental clarity and focus established—clarity that sticks, without burnout.",
  },
  {
    subheading: "60+ Days",
    heading: "Long-term cognitive edge",
    body: "You're supporting clarity and mental performance for the long run. Cellular repair capacity builds while stress modulation maintains balance. A sustainable protocol for those who need to stay sharp—maximum cognitive support without systemic overload.",
  },
];

export const whatToExpectStepsBalance: WhatToExpectStep[] = [
  {
    subheading: "Within 30 minutes",
    heading: "Best of both: calm and clear",
    body: "Alternating adaptogens and nootropics gives you the full spectrum from day one. You'll feel adaptogenic calm from ashwagandha and rhodiola modulating stress pathways, plus cognitive lift from glutathione and Alpha GPC supporting cellular function—two systems, one balanced approach.",
  },
  {
    subheading: "7 Days",
    heading: "The rhythm establishes",
    body: "Alternate days let each system do its job without overlap. Adaptogens build stress resilience and antioxidant balance; nootropics strengthen glutathione synthesis and mitochondrial function. You'll feel stress more manageable and thinking sharper as your body adapts to the rhythm.",
  },
  {
    subheading: "14 Days",
    heading: "Energy and clarity in balance",
    body: "The best of both worlds compounds. You'll feel steadier energy from adaptogens modulating stress response pathways and sustained clarity from glutathione and NAC rebuilding cellular repair capacity. No single-formula compromise—full spectrum benefits.",
  },
  {
    subheading: "30 Days",
    heading: "Mind and body in sync",
    body: "Alternating adaptogens and nootropics becomes second nature. Stress pathways stabilize while cellular infrastructure strengthens. You'll feel balanced: resilience from adaptogenic support, cognitive edge from nootropic enhancement. A protocol built for all-rounders who want it all.",
  },
  {
    subheading: "60+ Days",
    heading: "Sustainable full-spectrum support",
    body: "You're supporting stress resilience and cognitive performance in balance. The alternating rhythm keeps both systems primed—adaptogens reducing pressure, nootropics strengthening repair. Sustainable, comprehensive, no compromise on either side.",
  },
];

export const whatToExpectStepsUltimate: WhatToExpectStep[] = [
  {
    subheading: "Within 30 minutes",
    heading: "The full stack from the first use",
    body: "Both systems from the first use. Adaptogens modulate stress response pathways while glutathione and NAC replenish antioxidant reserves. You'll feel adaptogenic calm and cognitive clarity at once—no choosing between stress support and sharp thinking. The full stack from day one.",
  },
  {
    subheading: "7 Days",
    heading: "Daily synergy—no compromise",
    body: "Daily adaptogens plus daily nootropics means both systems stack without trade-off. Stress pathways stabilize while cellular repair capacity strengthens. You'll feel stress more manageable and mental clarity rising as systemic pressure reduces and repair mechanisms compound. Maximum support, no compromise.",
  },
  {
    subheading: "14 Days",
    heading: "Peak energy and peak clarity—every day",
    body: "The ultimate protocol shows its edge: daily adaptogens maintain antioxidant balance and reduce systemic pressure; daily glutathione and NAC fuel mitochondrial function and rebuild cellular infrastructure. You'll feel steadier energy and sharper focus—both systems working in parallel for elite performance.",
  },
  {
    subheading: "30 Days",
    heading: "The complete cognitive toolkit—yours",
    body: "Both systems daily compound. Stress response pathways stabilize while glutathione synthesis and mitochondrial function peak. You'll feel resilience and clarity at their peak—the full cognitive toolkit. For those who demand maximum results and won't choose between stress support and cognitive enhancement.",
  },
  {
    subheading: "60+ Days",
    heading: "Long-term peak—the best you can do",
    body: "You're supporting your system at the highest level. Daily adaptogens reduce pressure and maintain balance; daily nootropics strengthen repair and fuel performance. Focus, resilience, and clarity maintained as a sustainable habit—the ultimate protocol for the long run.",
  },
];

export const whatToExpectByProtocol: Record<ProtocolId, WhatToExpectStep[]> = {
  "1": whatToExpectStepsResilience,
  "2": whatToExpectStepsPrecision,
  "3": whatToExpectStepsBalance,
  "4": whatToExpectStepsUltimate,
};

/** Single config: formulas + protocols. Use with WhatToExpectTimeline (productId). */
export const whatToExpectByProduct: Record<ProductId, WhatToExpectStep[]> = {
  ...(whatToExpectByFormula as Record<FormulaId, WhatToExpectStep[]>),
  ...whatToExpectByProtocol,
};
