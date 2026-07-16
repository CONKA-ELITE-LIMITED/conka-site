/**
 * Authored meta descriptions for the legacy import, keyed by Shopify handle.
 *
 * Not optional. `app/lib/blog.ts` skips any row with no `Meta description`
 * (see toSummary), so a post without one never renders at all: this gates
 * rendering, not just publishing. The importer refuses to write a row whose
 * handle is missing here rather than creating an invisible post.
 *
 * Rules (docs/development/featurePlans/blog-notion-engine-brief.md):
 * 150 to 160 characters, no em dashes, answers the query the post targets.
 * Each is drafted from that post's own body, then reviewed by the owner at the
 * `Status` gate before anything goes live.
 *
 * Length is enforced, not trusted: see the assertion at the foot of this file.
 */
export const META_DESCRIPTIONS: Record<string, string> = {
  // --- Ageing -------------------------------------------------------------
  "cognitive-function-age":
    "Memory and attention shift as you age, but decline is not inevitable. Here is what actually changes in the brain, and the habits that measurably protect it.",
  "decoding-language":
    "Researchers built an AI decoder that turns brain activity into text. Here is how the brain builds language, where it happens, and how we come to acquire it.",
  "visualisation-mental-imagery-and-rehearsal":
    "Visualisation and mental rehearsal change the brain through neuroplasticity and mirror neurons. Here is the science, and how to practise it in sport and work.",

  // --- Brain fog ----------------------------------------------------------
  "the-link-between-brain-fog-and-inflammation":
    "Brain fog is often inflammation rather than simple tiredness. Here is how neuroinflammation clouds thinking, what the research shows, and what clears it.",
  "how-to-reduce-brain-fog-with-nootropics":
    "Which nootropics clear brain fog, and how? Two mechanisms matter most: neurotransmitter support and cerebral blood flow. Here is the evidence for each.",
  "how-does-ashwagandha-help-reduce-brain-fog":
    "Ashwagandha lowers cortisol, and chronic stress is a common driver of brain fog. Here is the mechanism, the evidence behind it, and how it is typically used.",

  // --- Comparison ---------------------------------------------------------
  "conka-vs-energy-drinks-what-s-better-for-focus-and-brain-health":
    "Energy drinks mask fatigue, they do not build focus. Here is how they compare with a daily brain shot on mechanism, the crash, and long term brain health.",

  // --- Focus and habits ---------------------------------------------------
  "brain-health-habits-a-daily-routine-to-optimise-mental-performance":
    "Your brain uses a fifth of your daily energy. Here is a daily routine built from the habits with real evidence: movement, sleep, food, and focused work.",
  "the-power-of-consistency-why-small-daily-habits-drive-big-brain-gains":
    "Quick fixes do not change the brain, repetition does. Here is the science of why small daily habits compound, and how long the gains really take to appear.",
  "10-daily-habits-to-naturally-detoxify-the-brain-and-improve-cognitive-health":
    "Your brain clears waste as you sleep, via the glymphatic system. Here are ten daily habits that support it, and the evidence behind every one of them.",
  "how-to-build-a-brain-boosting-morning-routine":
    "The first hours set your focus for the day. Here is a morning routine built on light, movement, food and timing, and the neuroscience behind each step.",
  "the-power-of-mindfulness-how-habits-shape-the-brain-through-neuroplasticity":
    "Mindfulness measurably rewires the brain through neuroplasticity. Here is what changes, how long it takes, and how to build the habit that actually drives it.",
  "the-state-of-flow-part-l":
    "Flow is a measurable brain state, not a mood. Part one covers what happens inside the brain when you drop into the zone, and why it feels so effortless.",
  "the-state-of-flow-part-ll":
    "Part two of our flow series: the conditions that reliably trigger flow state, how to set them up on purpose, and what tends to stop you dropping into it.",
  "the-power-of-mind":
    "Do your thoughts really shape your reality? Here is what the neuroscience says about belief, expectation, and the measurable limits of positive thinking.",
  "how-to-build-the-power-to-overcome-challenges":
    "Motivation is unreliable, and waiting for it is why things stall. Here is what builds the capacity to act anyway, and the psychology that supports it.",
  "flow-states":
    "Flow is total immersion in a task, and it is visible in your brain waves. Here is what happens in the brain, which regions go quiet, and why it works.",

  // --- Military -----------------------------------------------------------
  "the-link-between-gut-health-and-blast-induced-trauma-a-cognitive-perspective":
    "Blast trauma injures the gut as well as the brain. Here is how the gut brain axis shapes recovery, and why it matters in military and contact sport alike.",
  "the-hidden-impact-of-blast-induced-trauma-on-military-brain-health":
    "Blast exposure can injure the brain with no visible wound. Here is what happens, the long term cognitive effects, and how military brain health is supported.",

  // --- Neuroscience -------------------------------------------------------
  "how-can-neurofeedback-devices-enhance-brain-activity":
    "Neurofeedback devices claim to train your brain waves. Here is how they actually work, what the evidence currently supports, and where the limits are.",
  "the-vagus-nerve-gut-brain-axis":
    "The vagus nerve is the main line between your gut and your brain. Here is what it does, how the gut brain axis works, and practical ways to support it.",
  "the-mesolimbic-dopamine-system-unveiling-the-pathway-to-pleasure-and-reward":
    "The mesolimbic pathway is the brain's reward circuit. Here is how dopamine drives pleasure and motivation, and what happens when it becomes dysregulated.",
  "the-neural-basis-of-emotions":
    "Where do emotions actually come from? Here is the neuroscience: the regions behind core emotions, the chemistry that regulates them, and how they form.",
  "how-the-brain-learns-and-stores-information":
    "Learning physically changes your brain. Here is how memories actually form and consolidate, and the retention strategies that follow from the neuroscience.",
  "the-social-brain":
    "Humans are wired for connection. Here is how the brain processes social information, the regions and hormones involved, and what drives our behaviour.",
  "decision-making":
    "Every decision is a negotiation between brain regions. Here is how the brain weighs choices, the chemistry behind it, and how concussion disrupts the process.",
  "the-brain-and-creativity":
    "Creativity is not a gift, it is a brain state. Here is what happens neurologically when ideas form, and whether you can train yourself to have more of them.",
  "what-is-dopamine-signalling-and-what-can-we-learn-from-adhd-paranoid-schizophrenia-psz":
    "Dopamine signalling drives motivation and reward. Here is how it works, and what ADHD and paranoid schizophrenia reveal when the system starts to misfire.",
  "mirror-neurons-emotional-copycats":
    "Mirror neurons fire when you act and when you watch someone else act. Here is how they work, and why emotion really is contagious between the people near you.",

  // --- Nootropics ---------------------------------------------------------
  "creatine-for-the-brain-more-than-just-muscle":
    "Creatine is not only for muscle. Here is how it fuels brain cells, what the research shows on memory and mental fatigue, and who benefits most from it.",
  "caffeine-everything-you-need-to-know":
    "Caffeine blocks adenosine, it does not create energy. Here is the science, the half-life that quietly ruins your sleep, and how to time it for real focus.",
  "adaptogens-stress-relieving-powerhouses":
    "Adaptogens help the body regulate stress rather than simply mask it. Here is how they work, which ones have real evidence, and what to expect from each one.",

  // --- Recovery -----------------------------------------------------------
  "the-hidden-cost-of-dehydration-how-it-impacts-your-brain":
    "Your brain is roughly 75% water, so even mild dehydration costs you focus. Here is what happens, the early warning signs, and how much it affects you.",
  "the-neuroscience-behind-a-hangover-what-happens-to-your-brain-after-drinking":
    "A hangover is a neurological event, not just a headache. Here is what alcohol does to your neurotransmitters, dopamine and sleep, and why fog follows.",
  "what-actually-happens-to-your-brain-in-the-sauna":
    "Saunas are not only muscle recovery. Here is what heat does to your brain: heat shock proteins, blood flow, and the effects on mood and mental clarity.",
  "rice-vs-meat-movement-is-the-panacea-for-injury":
    "Ice may delay healing rather than speed it up. Here is why RICE fell out of favour, what the MEAT protocol proposes, and what the evidence now supports.",
  "ketosis-the-ketogenic-diet":
    "Ketosis burns fat for fuel instead of carbohydrates. Here is what that does to your brain, the main ketogenic variants, and what the research really shows.",
  "brrrr-embrace-the-cold-cold-water":
    "Why do athletes sit in freezing water? Here is what cold immersion does: cold shock proteins, circulation, immunity, and the effect on mood and focus.",
  "how-can-breathwork-improve-your-physical-and-mental-health":
    "Breathwork changes your nervous system on demand. Here is how controlled breathing affects stress, focus and recovery, and what the science actually supports.",
  "hope-molecules-exercise-myokines":
    "Your muscles release myokines when you train, and they travel to your brain. Here is how exercise lifts mood and protects cognition at a molecular level.",

  // --- Sleep --------------------------------------------------------------
  "zzzz-a-primer-on-sleep-stages":
    "Sleep is when the brain repairs itself. Here is what happens in each stage, from N1 through to REM, and why it matters most during concussion recovery.",
  "intermittent-fasting-for-brain-health":
    "Does fasting help your brain? Here are the main protocols, what happens neurologically when you fast, and what the evidence does and does not support.",

  // --- Sport --------------------------------------------------------------
  "cognitive-enhancers-for-athletes-what-the-science-says":
    "Elite sport now trains the mind, not just the body. Here is which cognitive enhancers have real evidence behind them, how they work, and whether they are safe.",
  "tennis-and-brain-health-how-the-game-sharpens-focus-memory-and-resilience":
    "Tennis is a cognitive sport as much as a physical one. Here is how it sharpens reaction time, strategic thinking and resilience, and what that builds.",
  "how-to-optimise-athletic-performance-in-extreme-weather-conditions":
    "Heat and cold both blunt performance, in different ways. Here is what happens physiologically, and how to prepare to train or compete in either extreme.",
  "the-weight-of-success-navigating-the-challenges-of-making-weight-in-boxing":
    "Boxers can shed 10% of their body weight before a weigh-in. Here is what that does to the brain and body, and why it raises the risk of serious injury.",
  "can-supplements-improve-reaction-time-in-sport":
    "In sport, milliseconds decide outcomes. Here is which supplements have real evidence for reaction time, from caffeine and theanine to creatine and ALC.",
  "informed-sport-and-what-that-means":
    "Informed Sport batch-tests supplements for banned substances. Here is what the certification involves, how it works, and why it matters so much to athletes.",

  // --- Sport / concussion -------------------------------------------------
  "5-groundbreaking-discoveries-in-concussion-neuroscience":
    "Concussion science has moved quickly. Here are five discoveries that changed how mild traumatic brain injury is understood, diagnosed and managed today.",
  "10-ways-to-support-someone-with-post-concussion-syndrome":
    "Post-concussion syndrome is invisible and isolating. Here are ten practical, evidence-informed ways to support someone living through the long recovery.",
  "the-header-the-facts-so-what":
    "80% of players fail a concussion test after 20 headers, yet heading is only 13% of sub-concussions. Here are the facts, and what they actually mean for you.",
  "women-sport-is-worse-for-concussion":
    "Women are more likely to be concussed and take longer to recover than men. Here are the facts behind that disparity, and what is being done to address it.",

  // --- Trend --------------------------------------------------------------
  "how-chatgpt-may-be-rewiring-the-human-brain-what-the-latest-research-reveals":
    "MIT measured what happens in your brain when you write with ChatGPT. Here is what the EEG study found, and what it suggests about cognitive offloading.",
};

/**
 * Guard the contract at import time rather than discovering a bad description
 * after 53 rows are already in Notion. Google truncates past roughly 160
 * characters, and the engine brief forbids em dashes.
 */
for (const [handle, description] of Object.entries(META_DESCRIPTIONS)) {
  if (description.length < 150 || description.length > 160) {
    throw new Error(
      `[metaDescriptions] "${handle}" is ${description.length} chars, must be 150 to 160`,
    );
  }
  if (description.includes("—")) {
    throw new Error(`[metaDescriptions] "${handle}" contains an em dash`);
  }
}
