import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle: productivity / "smart people". Hero + 6 reason bodies
 * supplied 2026-06-14 (wired verbatim, light formatting only; claims pass
 * is owned by the user). Framing copy (laurel, ticker, bridge, FAQ, sticky)
 * mirrors the ADHD page. Reason assets are placeholders until sourced; the
 * caffeine-crash reason uses the shared value chart.
 */
export const productivityListicle: ListicleConfig = {
  slug: "productivity-listicle",
  persona: "productivity",
  format: "listicle",
  title: "6 Reasons Smart People Use CONKA for Productivity",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline:
      "6 Reasons Why Smart People Are Improving Their Productivity With CONKA",
    subcopy:
      "One 30ml shot to start the day, one to replace the afternoon coffee. Calm, measurable focus that holds from your first task to your last.",
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
  logoMarquee: true,
  athleteTestimonials: true,
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "START THE DAY",
      headline: "Start Your Day Focused, Not Wired",
      body: "Three coffees before 9am can leave you wired, anxious, and still struggling to focus.\n\nCONKA Flow uses adaptogens like ashwagandha and lemon balm to support calm, steady focus without caffeine, helping you feel switched on without the jitters.",
      // 4-group average cognitive score (CONKA app data), CONKA groups in green
      asset: { kind: "scoreByGroup" },
    },
    {
      kind: "reason",
      n: 2,
      tag: "THE 2PM SLUMP",
      headline: "Stay Sharp Through the Afternoon",
      body: "That 2pm slump can make it hard to stay productive, sending you back for another coffee.\n\nCONKA Clear is designed to support focus later in the day, helping you stay sharp and get more done without relying on caffeine to power through.",
      // Coffee-crash vs CONKA-steady energy curve + cost table
      asset: { kind: "crashChart" },
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
      tag: "NO CRASH",
      headline: "It's Not an Energy Drink (and Won't Leave Your Brain Checked Out)",
      body: "Energy drinks give you a quick buzz, then a crash that leaves you foggy. Even \"zero sugar\" drinks often let you down.\n\nConka is caffeine-free. It is a clean boost that keeps your brain clear and focused all day, without the typical burnout.",
      // 9:16 brain-fuel loop, centre-cropped to 3:4 like the ADHD video tile
      asset: { kind: "video", src: "/lander/video/BrainFuel.mp4", aspect: "3/4" },
    },
    {
      kind: "reason",
      n: 4,
      tag: "MEASURABLE",
      headline: "See Your Focus, Not Just Feel It",
      body: "Most focus products just make claims. CONKA is different.\n\nIt includes a 2-minute in-app test so you can see your focus in numbers, not guesswork. In thousands of tests, users saw an average +28.96% improvement, backed by 32 studies.",
      asset: { kind: "measureTile" },
    },
    {
      // Hand-cropped excerpts (productivity / endurance theme)
      kind: "reviewStrip",
      eyebrow: "What Customers Say",
      ratingSummary: "Rated 4.7 / 5 · 622+ reviews",
      reviews: [
        {
          headline: "Consistent energy, no trade-off",
          quote:
            "My energy feels more consistent, and I can stay sharp later in the day without the downside.",
          name: "Aaron H.",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "Capacity left for the evenings",
          quote:
            "I take something after work, lock back in for the hustle, and still sleep well. Sharper on client work during the day.",
          name: "Sam J.",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "Locked in on long days",
          quote:
            "I am on calls all day for work, and Conka has been instrumental to staying focused and locked in on long days.",
          name: "Alex L.",
          detail: "Verified · Flow + Clear",
        },
      ],
    },
    {
      kind: "reason",
      n: 5,
      tag: "BACK-TO-BACK",
      headline: "Built for Back-to-Back Days",
      body: "Some days you feel sharp, by Thursday you feel drained. You are on calls all day, focus drops, and by the end of the week you are running on empty.\n\nTwo shots support a 24 hour focus cycle. Flow in the morning and Clear in the afternoon so your focus stays steady.",
      // The stress-load stack: actives that help absorb a relentless week
      asset: {
        kind: "ingredientGrid",
        eyebrow: "Built to absorb the load",
        items: [
          {
            icon: "🏔",
            name: "Rhodiola Rosea",
            benefit: "Buffers burnout and fatigue under prolonged stress.",
          },
          {
            icon: "🌿",
            name: "Ashwagandha",
            benefit: "Helps lower cortisol and the daily stress load.",
          },
          {
            icon: "🍋",
            name: "Lemon Balm",
            benefit: "Calm, steady focus without the sedation.",
          },
          {
            icon: "⚡",
            name: "Acetyl-L-Carnitine",
            benefit: "Fuels neurons for sustained mental energy.",
          },
          {
            icon: "🛡",
            name: "Glutathione",
            benefit: "Your master antioxidant for recovery.",
          },
          {
            icon: "♻️",
            name: "Alpha Lipoic Acid",
            benefit: "Clears the oxidative stress of short sleep.",
          },
        ],
        footer: "All in two 30ml shots, morning and night.",
      },
    },
    {
      kind: "reason",
      n: 6,
      tag: "REAL PROOF",
      headline: "Built on Real Proof, Not Big Claims",
      body: "A lot of focus products make big promises without proof. CONKA is different.\n\nIt is patented, Informed Sport certified, made in the UK, and developed with universities. It also comes with a 100-day money-back guarantee if you do not see results.",
      asset: { kind: "researchBacked" },
    },
  ],
  bridge: {
    headline: "Stop running on coffee. Start running on focus.",
    cta: "Try Conka Risk-Free for 100 Days →",
  },
  product: {
    headline: "Try Conka Risk-Free for 100 Days",
    subline: "Two daily shots. Zero caffeine. Track the difference in the app.",
    productHeroId: "03",
    whoItsFor: [
      "You run on back-to-back calls and deep work, and you want clean output all day without stacking coffees. Flow in the morning, Clear in the afternoon, no 2pm crash.",
      "You care about results you can measure, not just a buzz. The 2-minute in-app test tracks your focus in numbers, so you know the shots are actually working.",
    ],
  },
  reviewsCarousel: true,
  faq: [
    {
      q: "Does CONKA contain caffeine?",
      a: "No. CONKA is completely caffeine-free, so you get steady focus with no jitters and no crash.",
    },
    {
      q: "How is this different from an energy drink?",
      a: "Energy drinks spike you on caffeine and sugar, then drop you. CONKA is caffeine-free and supports steady, clear focus across the day without the crash.",
    },
    {
      q: "When do I take Flow and Clear?",
      a: "Flow in the morning to start the day focused, Clear in the early afternoon to replace the coffee and stay sharp into the evening.",
    },
    {
      q: "How quickly will I notice a difference?",
      a: "Most people feel the morning shot within minutes. The 2-minute test in the app lets you track your focus in numbers over the weeks.",
    },
    {
      q: "Can I take it alongside my morning coffee?",
      a: "Yes. CONKA is caffeine-free, so it works alongside coffee, though most people find they reach for fewer cups once they are on it.",
    },
    {
      q: "What if it doesn't work for me?",
      a: "You have 100 days to try it risk-free. If you don't see a difference, you get your money back.",
    },
  ],
  stickyBar: {
    label: "Stop running on coffee.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
