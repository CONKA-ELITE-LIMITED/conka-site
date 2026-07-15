import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle: older generation / brain-ageing. Hero + 6 reason bodies
 * supplied 2026-06-14 (wired verbatim, light formatting only; claims pass is
 * owned by the user). Framing copy (laurel, ticker, bridge, FAQ, sticky)
 * mirrors the ADHD page. Reason assets are placeholders until sourced.
 *
 * Slug is brain-ageing-listicle to avoid colliding with the brain-age QUIZ
 * page (/go/brain-age, SCRUM-1084).
 */
export const brainAgeingListicle: ListicleConfig = {
  slug: "brain-ageing-listicle",
  persona: "brain-ageing",
  format: "listicle",
  title: "6 Reasons to Protect Your Brain With CONKA",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline:
      "6 Reasons the Older Generation Is Adding This Daily Shot Before Brain Fog and Cognitive Decline Set In",
    subcopy:
      "Two caffeine-free daily shots to support memory, focus and mental clarity as you age: Flow in the morning, Clear in the afternoon, so the sharpness you rely on holds day after day.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Try Conka Risk-Free for 100 Days →",
    trustPills: [
      { label: "Zero caffeine", icon: "no-caffeine" },
      { label: "Informed Sport Certified", icon: "informed-sport" },
      { label: "100-day guarantee", icon: "guarantee" },
    ],
    asset: {
      kind: "image",
      src: "/lifestyle/ageing/WorkingWoman.jpg",
      alt: "A professional woman in her fifties taking a CONKA shot",
      // Landscape source fills the hero frame; anchor to the top so the crop
      // takes from the bottom and keeps her face in frame.
      aspect: "1500/1000",
      objectPosition: "center top",
    },
  },
  ticker: [
    "ZERO CAFFEINE",
    "INFORMED SPORT CERTIFIED",
    "MADE IN THE UK",
    "100-DAY GUARANTEE",
    "2-MINUTE BRAIN TEST",
  ],
  logoMarquee: true,
  athleteTestimonials: true,
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "WORD RECALL",
      headline: "Seamless Speech, Without the Hesitation",
      body: "Struggling to find the right word is agonising. This 30ml daily shot supports the neural pathways behind language, so sentences form more easily and the words are there when you reach for them, and conversation flows naturally again.",
      // Dan Norton's quote (speaking clearer, words flowing) lands the seamless-speech reason
      asset: {
        kind: "athleteQuote",
        name: "Dan Norton",
        role: "Rugby 7s · Olympic Silver Medallist",
        image: "/testimonials/athlete/DanNortonNB.jpg",
        quote:
          "I am finding myself being able to speak clearer and in conversations my words just flow better. I have more calmness.",
      },
    },
    {
      kind: "reason",
      n: 2,
      tag: "MEMORY",
      headline: "Clearer Memory That Lifts the Fog",
      body: "Forgetting why you walked into a room is a frustrating sign of cognitive fatigue. This targeted nutrition gives your brain the fuel to lift that fog, so you remember where you put things and why you came in, with many people noticing clearer recall over about six weeks.",
      // The recall stack: actives that feed acetylcholine and clear the fog
      asset: {
        kind: "ingredientGrid",
        eyebrow: "What lifts the fog",
        items: [
          {
            icon: "⚡",
            name: "Alpha GPC",
            benefit: "The most bioavailable choline for recall.",
          },
          {
            icon: "🧠",
            name: "Lecithin",
            benefit: "Rebuilds the membranes neurons rely on.",
          },
          {
            icon: "🩸",
            name: "Ginkgo Biloba",
            benefit: "Supports cerebral circulation and attention.",
          },
          {
            icon: "🫐",
            name: "Bilberry",
            benefit: "Anthocyanins shown to support recall.",
          },
        ],
        footer: "All in two daily 30ml shots.",
      },
    },
    {
      kind: "statsBand",
      eyebrow: "CLINICALLY PROVEN",
      stats: [
        { value: "+14.86%", label: "Sharper thinking vs placebo" },
        { value: "80%", label: "Improved cognitive scores" },
        { value: "+19.3%", label: "Sharper focus in pro athletes" },
        { value: "75%", label: "Improved in under 3 weeks" },
      ],
      footnote:
        "*From CONKA cognitive trials, including a 6-week randomised double-blind placebo-controlled trial with 29 professional rugby players.",
    },
    {
      kind: "reason",
      n: 3,
      tag: "LONGEVITY",
      headline: "Cognitive Protection for the Long Term",
      body: "This isn't a temporary spike, it's a daily system for long-term brain health. Targeted, natural support covers the vitals, helping protect your cognitive function for the years ahead, safely and without stimulants.",
      // The protection stack: antioxidants and neuroprotective actives
      asset: {
        kind: "ingredientGrid",
        eyebrow: "Ticks the brain-health boxes",
        items: [
          {
            icon: "🧬",
            name: "Turmeric (Longvida)",
            benefit: "Protects neurons and supports memory.",
          },
          {
            icon: "💊",
            name: "Vitamin B12",
            benefit: "Supports healthy brain structure with age.",
          },
          {
            icon: "🛡",
            name: "Glutathione",
            benefit: "The body's master antioxidant.",
          },
          {
            icon: "🍊",
            name: "Vitamin C",
            benefit: "Concentrated in the brain to defend cells.",
          },
          {
            icon: "♻️",
            name: "Alpha Lipoic Acid",
            benefit: "Regenerates vitamins C, E and glutathione.",
          },
          {
            icon: "🌊",
            name: "N-Acetyl Cysteine",
            benefit: "Replenishes the body's glutathione.",
          },
        ],
        footer: "All in two daily 30ml shots.",
      },
    },
    {
      kind: "reason",
      n: 4,
      tag: "TRACK IT",
      headline: "Measurable Results You Can Actually Track",
      body: "Most supplements make big claims with zero proof. With the companion app test you watch your focus and memory change in hard numbers, and customers report up to a 15% measured boost in brain function, tracked over time.",
      asset: { kind: "measureTile" },
    },
    {
      // Hand-cropped excerpts (memory / clarity theme)
      kind: "reviewStrip",
      eyebrow: "What Customers Say",
      ratingSummary: "Rated 4.7 / 5 · 622+ reviews",
      reviews: [
        {
          headline: "Sharper recall, clearer words",
          quote:
            "My short-term memory is better, I feel more eloquent, and I am able to stay focused for longer periods of time.",
          name: "Millie H.",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "The fog lifts fast",
          quote:
            "About three minutes in, my brain fog has dissipated and I'm locked into my work.",
          name: "Sam T.",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "Measurable improvements",
          quote:
            "After trying both Flow and Clear, I am noticing measurable improvements.",
          name: "Ankita K.",
          detail: "Verified · Flow + Clear",
        },
      ],
    },
    {
      kind: "reason",
      n: 5,
      tag: "STAMINA",
      headline: "Mental Energy That Defeats Fatigue",
      body: "Complicated routines kill consistency, so this is simple: two small daily shots. Rich in essential vitamins, they support steady daily function and keep your brain feeling less tired from morning to night, without the midday slump.",
      // Day-energy curve: afternoon slump without, steady with CONKA
      asset: { kind: "dayEnergyCurve" },
    },
    {
      kind: "reason",
      n: 6,
      tag: "AUTHORITY",
      headline: "Stable Cognition Backed by Real Proof",
      body: "Proof matters more than hype. This isn't a generic vitamin, it's a tailored, science-backed formula built to keep cognitive performance stable, so you get reliable, long-lasting support you can actually rely on.",
      asset: { kind: "researchBacked" },
    },
  ],
  bridge: {
    headline: "Protect your sharpest asset. Start today.",
    cta: "Try Conka Risk-Free for 100 Days →",
  },
  product: {
    headline: "Try Conka Risk-Free for 100 Days",
    subline: "Two daily shots. Zero caffeine. Track the difference in the app.",
    productHeroId: "03",
    whoItsFor: [
      "You've noticed words on the tip of your tongue and the odd \"why did I walk in here\" moment, and you want to stay sharp for the years ahead. Two daily shots support memory, recall and everyday clarity.",
      "You want something simple and natural you can actually stick to, with proof. Two shots a day plus a 2-minute brain test that tracks your scores over time, so you can see it holding.",
    ],
  },
  reviewsCarousel: true,
  // Persona-curated canonical FAQ ids (resolved in the renderer). Order:
  // cognitive-decline, medication, timeline, sleep, app-optional, guarantee.
  faqIds: [
    "cognitive-decline",
    "medication",
    "results",
    "sleep",
    "app-optional",
    "guarantee",
  ],
  stickyBar: {
    label: "Protect your sharpest asset.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
