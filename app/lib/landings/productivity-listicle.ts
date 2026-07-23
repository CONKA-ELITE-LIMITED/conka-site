import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle: productivity / "smart people".
 *
 * Restructured 2026-07-23 (conversion pass) into a true numbered "X reasons"
 * listicle: a counted hero and 7 tight reasons, one idea each, statement
 * headlines, pain-first openings. The verbose mechanism detail and the
 * search-question framing move to the parallel /blog work (SCRUM-1175). One
 * stats band and one review strip sit between reasons so the page reads as a
 * scannable list. Template stays "im8". Claims pass is owned by the user.
 */
export const productivityListicle: ListicleConfig = {
  slug: "productivity-listicle",
  persona: "productivity",
  format: "listicle",
  template: "im8",
  title: "7 Reasons You'll Get More Done on CONKA",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline: "7 Reasons You'll Get More Done on CONKA",
    subcopy:
      "The 11am fog, the 3pm crash, the fourth coffee that stopped working. Focus that fades by lunch isn't a willpower problem, it's a fuel problem. CONKA is two caffeine-free shots, Flow to start sharp and Clear to replace the afternoon coffee, with an app to prove it's working.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Try it risk free, now 46% off",
    trustPills: [
      { label: "Zero caffeine", icon: "no-caffeine" },
      { label: "Informed Sport Certified", icon: "informed-sport" },
      { label: "100-day guarantee", icon: "guarantee" },
    ],
    asset: {
      kind: "image",
      src: "/lifestyle/ConkaAtWorkDesk.jpg",
      alt: "A CONKA shot on a desk beside a keyboard while someone works",
      // Native 1500x1000; frame matches so nothing crops
      aspect: "1500/1000",
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
  pressMarquee: true,
  athleteTestimonials: true,
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "CAFFEINE VS CONKA",
      headline: "CONKA Focus Beats Caffeine Focus",
      body: "Caffeine focus is jittery and runs on borrowed time, with a hard ceiling the NHS puts at two cups before it works against you. CONKA focus is calm and steady, no comedown, no ceiling to watch.",
      chips: ["88% drank one less coffee a day in their first 45 days"],
      // Coffee-crash vs CONKA-steady energy curve + cost table
      asset: { kind: "crashChart" },
    },
    {
      kind: "reason",
      n: 2,
      tag: "THE 2PM SLUMP",
      headline: "Stay Sharp Through the Afternoon",
      body: "The lunch slump sends you back for another coffee just to function. CONKA Clear pairs nine afternoon detoxifiers with Alpha GPC, shown to deliver 18.1% faster mental processing than caffeine.",
      citation: "DOI: 10.1186/1550-2783-12-S1-P41",
      // Day-energy curve: afternoon holds steady with CONKA
      asset: { kind: "dayEnergyCurve" },
    },
    {
      kind: "statsBand",
      eyebrow: "CLINICALLY PROVEN",
      stats: [
        { value: "18.1%", label: "Faster processing than caffeine" },
        { value: "80%", label: "Improved cognitive scores in week one" },
        { value: "+14.86%", label: "Sharper thinking vs placebo" },
        { value: "75%", label: "Improved in under three weeks" },
      ],
      footnote:
        "*From CONKA cognitive trials, including a 6-week randomised double-blind placebo-controlled trial with 29 professional rugby players.",
    },
    {
      kind: "reason",
      n: 3,
      tag: "COMPOUNDS DAILY",
      headline: "Better Focus Compounds, Day After Day",
      body: "This isn't a one-off spike. Calmer focus today means less cortisol tomorrow, better sleep tonight, and a sharper dose the next day. Durham University research found the exact combination in Flow extended lifespan and cut oxidative stress.",
      citation: "PMID: 31279955 · PMID: 32707771",
      asset: { kind: "researchBacked" },
    },
    {
      kind: "reason",
      n: 4,
      tag: "MEASURE IT",
      headline: "Watch It Working, in Real Numbers",
      body: "Most brain-training apps are just games with a leaderboard. The CONKA app is built around CognICA, an FDA-cleared cognitive test from Cambridge used clinically to help diagnose dementia. The same test, so when your score moves, it's real.",
      // App cognitive-score count-up card; "Do you see an animal?" GIF is a
      // Phase 5 asset swap. Press outlets render via pressMarquee (trust zone).
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
      tag: "BAD NIGHTS",
      headline: "Built for the Days You Didn't Sleep",
      body: "Interrupted sleep, a deadline all-nighter, one drink too many. Some days you start at a deficit before you've opened your laptop. CONKA won't erase a bad night, but the stack below gives your brain a real head start.",
      // The bad-nights stack, showcasing the Phase 1 per-ingredient citations
      asset: {
        kind: "ingredientGrid",
        eyebrow: "Built to absorb booze and bad nights",
        items: [
          {
            icon: "🏔",
            name: "Rhodiola Rosea",
            benefit:
              "Shown in night-shift physicians to cut fatigue and sharpen mental performance.",
            citation: "PMID: 11081987",
          },
          {
            icon: "🛡",
            name: "Glutathione",
            benefit:
              "Clinically shown to speed clearance of acetaldehyde, the toxin behind hangovers.",
            citation: "PMC11479010",
          },
          {
            icon: "🌿",
            name: "Ashwagandha",
            benefit: "Helps lower cortisol and the daily stress load.",
            citation: "PMID: 32800311",
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
      headline: "Backed by Trials, Not Testimonials",
      body: "Most focus supplements hide one trick: caffeine, which by the original definition is a stimulant, not a nootropic. CONKA's formula is built on ingredients backed by 32 published studies, and we built a way for you to measure it yourself.",
      // 4-group average cognitive score, CONKA groups in green (app data)
      asset: { kind: "scoreByGroup" },
    },
    {
      kind: "reason",
      n: 7,
      tag: "RISK-FREE",
      headline: "100 Days to Feel It, or Your Money Back",
      body: "Try CONKA for a full 100 days. If your focus and output haven't changed, you get every penny back. Informed Sport certified, made in the UK, built on a decade of brain research.",
      // Off CONKA vs on CONKA measured focus (+19.3%)
      asset: { kind: "focusBars" },
    },
  ],
  bridge: {
    headline: "Stop running on coffee. Start running on focus.",
    cta: "Try Conka Risk-Free for 100 Days →",
  },
  product: {
    productHeroId: "03",
  },
  reviewsCarousel: true,
  // Persona-curated canonical FAQ ids (resolved in the renderer). Order:
  // caffeine, vs-energy-drink, reduce-coffee, timing, timeline, coffee, guarantee.
  faqIds: [
    "caffeine",
    "vs-energy-drink",
    "reduce-coffee",
    "when-to-take",
    "results",
    "with-coffee",
    "guarantee",
  ],
  stickyBar: {
    label: "Stop running on coffee.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
