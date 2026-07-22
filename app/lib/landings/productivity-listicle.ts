import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle: productivity / "smart people".
 *
 * Rewritten 2026-07-22 to Humphrey's improved copy and sentiment (template
 * upgrade Phase 2, see docs/development/featurePlans/listicle-template-upgrade.md).
 * Six question-led reasons mapped onto existing primitives plus the Phase 1
 * additions: PMID/DOI citations under claims and the "As Published On:" press
 * marquee (pressMarquee). The CognICA reason uses the measureTile asset for now;
 * the "Do you see an animal?" test GIF is a Phase 5 asset swap. Claims pass is
 * owned by the user.
 */
export const productivityListicle: ListicleConfig = {
  slug: "productivity-listicle",
  persona: "productivity",
  format: "listicle",
  template: "im8",
  title: "What to Do When You Can't Focus at Work",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline: "What to Do When You Can't Focus at Work",
    subcopy:
      "Two caffeine-free daily shots: Flow to start the day sharp, Clear to replace the afternoon coffee. Calm, measurable focus from your first task to your last, no spike, no crash.",
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
      headline: "CONKA Focus vs. Caffeine Focus",
      body: "Caffeine focus is jittery, running on borrowed time, and it has a hard ceiling: the NHS suggests no more than two cups of coffee before it starts working against your focus. CONKA focus feels completely different. Calm, steady, no comedown, and no ceiling to watch.",
      chips: ["88% drank one less coffee a day in their first 45 days"],
      // Coffee-crash vs CONKA-steady energy curve + cost table
      asset: { kind: "crashChart" },
    },
    {
      kind: "reason",
      n: 2,
      tag: "THE 2PM SLUMP",
      headline: "Stay Sharp Through the Afternoon",
      body: "The lunch slump sends you back for another coffee just to stay productive. CONKA Clear combines the nine best afternoon detoxifiers with one key ingredient, Alpha GPC, shown in clinical testing to produce 18.1% faster mental processing speed than caffeine.",
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
      headline: "What Are the Long-Term Effects of Better Focus?",
      body: "This isn't a temporary spike, it's a daily system that compounds. Calmer focus today means less cortisol tomorrow. Less cortisol means better recall and steadier sleep. Better sleep means the next day's dose works even better than the last. That's the loop CONKA is built around. Independent research from Durham University found the exact combination of ingredients in Flow significantly extended lifespan and reduced oxidative stress in a peer-reviewed ageing study.",
      citation: "PMID: 31279955 · PMID: 32707771",
      asset: { kind: "researchBacked" },
    },
    {
      kind: "reason",
      n: 4,
      tag: "MEASURE IT",
      headline: "Do Brain-Training Apps Actually Work?",
      body: "Most brain-training apps are just games with a leaderboard. The CONKA app is different. It's built around CognICA, an FDA-cleared, CE-marked cognitive assessment developed by Cambridge University and Cognetivity Neurosciences and used in clinical settings to help diagnose dementia. It's the same test, not a gamified imitation, so when you see your score move, it's measuring something real.",
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
      body: "Interrupted sleep, all-nighters before a deadline, or one drink too many, that's life. Some days you start at a deficit before you've even opened your laptop. Rhodiola Rosea has been shown in a clinical trial of 56 night-duty physicians to reduce fatigue and improve mental performance. Glutathione, your body's master antioxidant, clears acetaldehyde, the toxin behind hangover symptoms, significantly faster. CONKA doesn't erase a bad night, but it gives your brain a real head start on the next day.",
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
      headline: "Which Brain Supplements Are Actually Proven to Work?",
      body: "Proof matters. Most energy and focus supplements are hiding a simple trick: caffeine. It works briefly, then comes the crash, the jitters, the dependency. By the original definition of the word nootropic, a substance with side effects like that isn't even a true one, it's just a stimulant. The only real way to know if a supplement works is randomised controlled trial evidence. Not a testimonial, not a before-and-after photo, a trial. CONKA's formula is built on ingredients backed by 32 published studies, and if that's still not enough, we built something most brands never will: a way to measure it yourself.",
      // 4-group average cognitive score, CONKA groups in green (app data)
      asset: { kind: "scoreByGroup" },
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
