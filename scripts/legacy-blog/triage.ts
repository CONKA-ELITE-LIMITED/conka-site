/**
 * The 53 legacy posts approved for import, from the triage table in
 * docs/development/featurePlans/legacy-blog-migration.md (82 editorial posts:
 * 53 import, 29 drop). Generated from that table, so the doc stays the source
 * of truth. The other 29 get redirects in SCRUM-1157, never rows here.
 *
 * Each entry is the Shopify handle, which the importer writes to `Slug`
 * verbatim: one wildcard 301 then recovers the whole archive. Never re-slug.
 */
export const IMPORT_HANDLES: readonly string[] = [
  "cognitive-function-age",
  "decoding-language",
  "visualisation-mental-imagery-and-rehearsal",
  "the-link-between-brain-fog-and-inflammation",
  "how-to-reduce-brain-fog-with-nootropics",
  "how-does-ashwagandha-help-reduce-brain-fog",
  "conka-vs-energy-drinks-what-s-better-for-focus-and-brain-health",
  "brain-health-habits-a-daily-routine-to-optimise-mental-performance",
  "the-power-of-consistency-why-small-daily-habits-drive-big-brain-gains",
  "10-daily-habits-to-naturally-detoxify-the-brain-and-improve-cognitive-health",
  "how-to-build-a-brain-boosting-morning-routine",
  "the-power-of-mindfulness-how-habits-shape-the-brain-through-neuroplasticity",
  "the-state-of-flow-part-l",
  "the-state-of-flow-part-ll",
  "the-power-of-mind",
  "how-to-build-the-power-to-overcome-challenges",
  "flow-states",
  "the-link-between-gut-health-and-blast-induced-trauma-a-cognitive-perspective",
  "the-hidden-impact-of-blast-induced-trauma-on-military-brain-health",
  "how-can-neurofeedback-devices-enhance-brain-activity",
  "the-vagus-nerve-gut-brain-axis",
  "the-mesolimbic-dopamine-system-unveiling-the-pathway-to-pleasure-and-reward",
  "the-neural-basis-of-emotions",
  "how-the-brain-learns-and-stores-information",
  "the-social-brain",
  "decision-making",
  "the-brain-and-creativity",
  "what-is-dopamine-signalling-and-what-can-we-learn-from-adhd-paranoid-schizophrenia-psz",
  "mirror-neurons-emotional-copycats",
  "creatine-for-the-brain-more-than-just-muscle",
  "caffeine-everything-you-need-to-know",
  "adaptogens-stress-relieving-powerhouses",
  "the-hidden-cost-of-dehydration-how-it-impacts-your-brain",
  "the-neuroscience-behind-a-hangover-what-happens-to-your-brain-after-drinking",
  "what-actually-happens-to-your-brain-in-the-sauna",
  "rice-vs-meat-movement-is-the-panacea-for-injury",
  "ketosis-the-ketogenic-diet",
  "brrrr-embrace-the-cold-cold-water",
  "how-can-breathwork-improve-your-physical-and-mental-health",
  "hope-molecules-exercise-myokines",
  "zzzz-a-primer-on-sleep-stages",
  "intermittent-fasting-for-brain-health",
  "cognitive-enhancers-for-athletes-what-the-science-says",
  "tennis-and-brain-health-how-the-game-sharpens-focus-memory-and-resilience",
  "how-to-optimise-athletic-performance-in-extreme-weather-conditions",
  "the-weight-of-success-navigating-the-challenges-of-making-weight-in-boxing",
  "can-supplements-improve-reaction-time-in-sport",
  "informed-sport-and-what-that-means",
  "5-groundbreaking-discoveries-in-concussion-neuroscience",
  "10-ways-to-support-someone-with-post-concussion-syndrome",
  "the-header-the-facts-so-what",
  "women-sport-is-worse-for-concussion",
  "how-chatgpt-may-be-rewiring-the-human-brain-what-the-latest-research-reveals",
];

/** The one post still ranking (pos 12.7, 464 impressions) while 404ing. */
export const PILOT_HANDLE = "visualisation-mental-imagery-and-rehearsal";
