/**
 * Topic tags for the 53 legacy posts (SCRUM-1161).
 *
 * The source is the triage table in
 * docs/development/featurePlans/legacy-blog-migration.md, which already assigns
 * a lane to all 53. This file is that table plus the reconciliation rules, as
 * data, so the doc stays the source of truth. A wrong lane is fixed as a one-row
 * edit in Notion, not by re-reading the posts.
 *
 * The lanes are not the `Topic` options, so they reconcile: `Neuro` to
 * Neuroscience, `Ageing` to Brain Ageing, `Nootropic` to Nootropics. Thin lanes
 * fold into the nearest fat topic (`Sleep` to Recovery, `Trend` to Neuroscience,
 * `Comparison` to Nootropics). Compound lanes carry both tags.
 *
 * `Productivity` and `ADHD` are deliberately absent: Productivity belongs to the
 * engine rows and is not renamed to Focus, and ADHD's only candidate row has no
 * Status and no Source and is left alone.
 */

/** The Topic options this backfill writes. `Focus` is added to the schema by SCRUM-1161. */
export type Topic =
  | "Brain Ageing"
  | "Brain Fog"
  | "Concussion"
  | "Focus"
  | "Military"
  | "Neuroscience"
  | "Nootropics"
  | "Recovery"
  | "Sport";

/** The option that must exist in Notion before the backfill can write. */
export const NEW_TOPIC_OPTION = "Focus";

/** Triage lane to Topic tags. A compound lane maps to two. */
const LANE_TO_TOPICS: Readonly<Record<string, readonly Topic[]>> = {
  Ageing: ["Brain Ageing"],
  // The one post still ranking while it 404ed: an ageing post about athletic
  // rehearsal, so it earns both hubs.
  "Ageing/performance": ["Brain Ageing", "Sport"],
  "Brain fog": ["Brain Fog"],
  Comparison: ["Nootropics"],
  Focus: ["Focus"],
  Military: ["Military"],
  Neuro: ["Neuroscience"],
  Nootropic: ["Nootropics"],
  Recovery: ["Recovery"],
  Sleep: ["Recovery"],
  "Sleep/recovery": ["Recovery"],
  Sport: ["Sport"],
  "Sport/concussion": ["Sport", "Concussion"],
  Trend: ["Neuroscience"],
};

/** Shopify handle (= Slug) to triage lane, verbatim from the table, in doc order. */
const HANDLE_LANES: Readonly<Record<string, string>> = {
  "cognitive-function-age": "Ageing",
  "decoding-language": "Ageing",
  "visualisation-mental-imagery-and-rehearsal": "Ageing/performance",
  "the-link-between-brain-fog-and-inflammation": "Brain fog",
  "how-to-reduce-brain-fog-with-nootropics": "Brain fog",
  "how-does-ashwagandha-help-reduce-brain-fog": "Brain fog",
  "conka-vs-energy-drinks-what-s-better-for-focus-and-brain-health": "Comparison",
  "brain-health-habits-a-daily-routine-to-optimise-mental-performance": "Focus",
  "the-power-of-consistency-why-small-daily-habits-drive-big-brain-gains": "Focus",
  "10-daily-habits-to-naturally-detoxify-the-brain-and-improve-cognitive-health": "Focus",
  "how-to-build-a-brain-boosting-morning-routine": "Focus",
  "the-power-of-mindfulness-how-habits-shape-the-brain-through-neuroplasticity": "Focus",
  "the-state-of-flow-part-l": "Focus",
  "the-state-of-flow-part-ll": "Focus",
  "the-power-of-mind": "Focus",
  "how-to-build-the-power-to-overcome-challenges": "Focus",
  "flow-states": "Focus",
  "the-link-between-gut-health-and-blast-induced-trauma-a-cognitive-perspective": "Military",
  "the-hidden-impact-of-blast-induced-trauma-on-military-brain-health": "Military",
  "how-can-neurofeedback-devices-enhance-brain-activity": "Neuro",
  "the-vagus-nerve-gut-brain-axis": "Neuro",
  "the-mesolimbic-dopamine-system-unveiling-the-pathway-to-pleasure-and-reward": "Neuro",
  "the-neural-basis-of-emotions": "Neuro",
  "how-the-brain-learns-and-stores-information": "Neuro",
  "the-social-brain": "Neuro",
  "decision-making": "Neuro",
  "the-brain-and-creativity": "Neuro",
  "what-is-dopamine-signalling-and-what-can-we-learn-from-adhd-paranoid-schizophrenia-psz": "Neuro",
  "mirror-neurons-emotional-copycats": "Neuro",
  "creatine-for-the-brain-more-than-just-muscle": "Nootropic",
  "caffeine-everything-you-need-to-know": "Nootropic",
  "adaptogens-stress-relieving-powerhouses": "Nootropic",
  "the-hidden-cost-of-dehydration-how-it-impacts-your-brain": "Recovery",
  "the-neuroscience-behind-a-hangover-what-happens-to-your-brain-after-drinking": "Recovery",
  "what-actually-happens-to-your-brain-in-the-sauna": "Recovery",
  "rice-vs-meat-movement-is-the-panacea-for-injury": "Recovery",
  "ketosis-the-ketogenic-diet": "Recovery",
  "brrrr-embrace-the-cold-cold-water": "Recovery",
  "how-can-breathwork-improve-your-physical-and-mental-health": "Recovery",
  "hope-molecules-exercise-myokines": "Recovery",
  "zzzz-a-primer-on-sleep-stages": "Sleep",
  "intermittent-fasting-for-brain-health": "Sleep/recovery",
  "cognitive-enhancers-for-athletes-what-the-science-says": "Sport",
  "tennis-and-brain-health-how-the-game-sharpens-focus-memory-and-resilience": "Sport",
  "how-to-optimise-athletic-performance-in-extreme-weather-conditions": "Sport",
  "the-weight-of-success-navigating-the-challenges-of-making-weight-in-boxing": "Sport",
  "can-supplements-improve-reaction-time-in-sport": "Sport",
  "informed-sport-and-what-that-means": "Sport",
  "5-groundbreaking-discoveries-in-concussion-neuroscience": "Sport/concussion",
  "10-ways-to-support-someone-with-post-concussion-syndrome": "Sport/concussion",
  "the-header-the-facts-so-what": "Sport/concussion",
  "women-sport-is-worse-for-concussion": "Sport/concussion",
  "how-chatgpt-may-be-rewiring-the-human-brain-what-the-latest-research-reveals": "Trend",
};

/** The tags for a legacy handle, or an empty array if it is not one of the 53. */
export function topicsForHandle(handle: string): readonly Topic[] {
  const lane = HANDLE_LANES[handle];
  if (!lane) return [];
  const topics = LANE_TO_TOPICS[lane];
  if (!topics) throw new Error(`[topics] no Topic mapping for lane "${lane}" (${handle})`);
  return topics;
}
