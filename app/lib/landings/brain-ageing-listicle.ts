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
      "One 30-second habit to protect cognitive longevity. Measurable, clear recall that holds from your morning routine to your evening conversations.",
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
      src: "/formulas/both/BoxIngredientHero.png",
      alt: "CONKA Flow and Clear shots with their ingredients",
      aspect: "2528/1696",
    },
  },
  ticker: [
    "ZERO CAFFEINE",
    "INFORMED SPORT CERTIFIED",
    "MADE IN THE UK",
    "100-DAY GUARANTEE",
    "2-MINUTE BRAIN TEST",
  ],
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "WORD RECALL",
      headline: "Seamless Speech, Without the Hesitation",
      body: "Struggling to find the right word is agonizing, but this 30-second daily habit flips the script.\n\nBy supporting optimal neural pathways, it helps your mind open up so sentences form seamlessly, curing lost words. Experience the joy of conversation flowing naturally exactly when you need it. Clear communication, without the mental block.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Conversation flowing naturally, words on the tip of the tongue",
      },
    },
    {
      kind: "reason",
      n: 2,
      tag: "MEMORY",
      headline: "Clearer Memory That Lifts the Fog",
      body: "Forgetting why you entered a room is a frustrating sign of cognitive fatigue.\n\nThis targeted nutrition provides essential fuel to lift the fog, helping you remember exactly where you put things and why you walked in. Instead of accepting decline, you can regain control of your short-term memory in just six weeks. Sharp mental clarity when you need it most.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Fog lifting, sharp short-term recall",
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
      body: "Brain health is front of mind, and this isn't just a temporary spike, it's a dedicated system for cognitive longevity.\n\nBy delivering targeted, natural support, it ticks all the vital brain health boxes to future-proof your mind. Protect your cognitive function for the long term, safely and naturally. Future-proof your mind for the years ahead.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Long-term cognitive protection, daily ritual",
      },
    },
    {
      kind: "reason",
      n: 4,
      tag: "TRACK IT",
      headline: "Measurable Results You Can Actually Track",
      body: "Most supplements make massive claims with zero proof, but this natural brain-boost offers measurable cognition tracking.\n\nBy using the companion app test, you can watch your focus and memory improve in hard numbers. Customers consistently report up to a 15% measured boost in direct brain function. Proven cognitive gains, tracked in real-time.",
      asset: {
        kind: "placeholder",
        aspect: "3/4",
        note: "App screenshot: focus and memory scores over time",
      },
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
      body: "Complicated routines kill consistency, so we made this daily approach simple, natural, and effective.\n\nPacked with essential vitamins, it supports optimal daily functioning and keeps your brain feeling distinctly less tired from morning to night. No more midday slumps or mental exhaustion. Sustained mental energy, all day long.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Sustained mental energy morning to night",
      },
    },
    {
      kind: "reason",
      n: 6,
      tag: "AUTHORITY",
      headline: "Stable Cognition Backed by Real Proof",
      body: "Concrete authority matters more than hype. This isn't a generic vitamin; it's a tailored, scientifically backed approach you can actively rely on to keep cognitive performance stable.\n\nBuilt on undeniable proof, it provides the natural brain-boost trusted for consistent, long-lasting mental health. Reliable results backed by real authority.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Certifications and science: patent, Informed Sport, universities",
      },
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
  },
  trustCarousel: true,
  reviewsCarousel: true,
  faq: [
    {
      q: "Is CONKA a medicine or a treatment for cognitive decline?",
      a: "No. CONKA is a food supplement that supports everyday focus, memory and mental clarity. It is not a medicine and does not diagnose, treat or prevent any condition.",
    },
    {
      q: "Can I take CONKA with my other medication?",
      a: "CONKA is a food supplement, not a medicine. If you take prescription medication, check with your GP or pharmacist before adding anything new to your routine.",
    },
    {
      q: "How quickly will I notice a difference?",
      a: "Most people feel the morning shot within minutes, and many report clearer recall over about six weeks. The 2-minute test in the app lets you track it in numbers.",
    },
    {
      q: "Is it caffeine-free? I don't want anything that affects my sleep.",
      a: "Yes, completely caffeine-free. There is nothing to spike you up or keep you awake, and Clear in the afternoon is designed to keep you steady into the evening.",
    },
    {
      q: "I'm not very techy. Do I have to use the app?",
      a: "No. The app is an optional bonus that lets you see your scores over time. The two daily shots work on their own.",
    },
    {
      q: "What if it doesn't work for me?",
      a: "You have 100 days to try it risk-free. If you don't see a difference, you get your money back.",
    },
  ],
  stickyBar: {
    label: "Protect your sharpest asset.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
