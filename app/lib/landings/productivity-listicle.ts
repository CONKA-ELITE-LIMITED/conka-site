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
 *
 * Repositioned 2026-07-27 (SCRUM-1187) to a founder-led "high performers"
 * have-it-all angle to message-match the founder-driven ads and fix the weak
 * first fold. Hero carries the founder proof (TwoFounders photo + Harry/Humphrey
 * juggler origin); reasons re-themed off generic caffeine fights to: 1 performance-
 * without-burnout, 2 socialise-keep-tomorrow, 3 founder cheat-code, 4 have-it-all,
 * 5 sharp-all-day, 6 app-proof, 7 guarantee. Plan: docs/development/featurePlans/
 * productivity-listicle-founder-reposition.md. Deferred: named exec quotes
 * (Shane, Nimisha) integrated into the review strip.
 */
export const productivityListicle: ListicleConfig = {
  slug: "productivity-listicle",
  persona: "productivity",
  format: "listicle",
  template: "im8",
  title: "7 Reasons High Performers Run on CONKA",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline: "7 Reasons High Performers Run on CONKA",
    subcopy:
      "You want it all, the career and the life, without one costing you the other. So did the two founders who built CONKA: one an Olympian with Team GB at Tokyo, the other juggling a full-time team with ultramarathons and Ironmans. Two caffeine-free shots, Flow and Clear, with an app to prove it's working.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Have it all, risk-free for 100 days",
    trustPills: [
      { label: "Zero caffeine", icon: "no-caffeine" },
      { label: "Informed Sport Certified", icon: "informed-sport" },
      { label: "100-day guarantee", icon: "guarantee" },
    ],
    asset: {
      kind: "image",
      src: "/TwoFounders.jpg",
      alt: "CONKA founders Harry Glover and Humphrey Bodington",
      // Native 1840x1226 (3:2); frame matches so nothing crops
      aspect: "1840/1226",
    },
  },
  ticker: [
    "ZERO CAFFEINE",
    "INFORMED SPORT CERTIFIED",
    "MADE IN THE UK",
    "100-DAY GUARANTEE",
    "2-MINUTE BRAIN TEST",
  ],
  // Post-reasons proof tier. Four moments, each doing a different job.
  proof: {
    logoBand: true,
    // No pressBand here: the "As Published On" marquee lives on the app-proof
    // reason (reason 4) for this page, so a second copy in the tier would be
    // redundant.
    // Shared UGC set: the band needs volume to read as volume, and we
    // have no persona-tagged stills yet. Pass `items` once we do.
    ugc: {},
    // TODO: source a white-background cutout of a productivity/ADHD-relevant
    // figure and swap this out. Jack Willis is the site-wide default, not a
    // persona match. Any `*NB.jpg` in public/testimonials/athlete/ works.
    feature: {
      name: "Jack Willis",
      credentials: [
        "2025 Top 14 Player of the Season",
        "4\u00d7 Top 14 Champion, Champions Cup winner",
      ],
      quote:
        "For me it was about trying to find the small margins, and maximising my brain as well as my body was so important.",
      image: "/testimonials/athlete/JackWillisNB.jpg",
      imageAlt:
        "Jack Willis applauding in the Stade Toulousain jersey, 2025 Top 14 Player of the Season",
    },
  },
  body: [
    {
      kind: "reason",
      n: 1,
      headline: "High Performance, Without the Burnout",
      body: "You don't call it burnout. You call it a busy quarter, then another. The ones most at risk are the people still hitting every target, running on willpower and caffeine until something gives. CONKA's adaptogens are shown to lower the cortisol load that turns drive into depletion, so you can perform hard without paying for it later.",
      // Exec quote tile: Shane's workload-without-burnout testimonial. Confirm the
      // exact title + that the quote is his before shipping (claims pass).
      asset: {
        kind: "athleteQuote",
        name: "Shane Corstorphine",
        role: "Former CFO, Skyscanner",
        image: "/caseStudies/ShaneCorstorphine.jpg",
        quote:
          "I can now tolerate the same workload as I did in my 30s. I travel from Scotland to London frequently for intense bouts of work. I used to lose my memory in these periods, but now I don't.",
      },
    },
    {
      kind: "reason",
      n: 2,
      headline: "Enjoy the Night. Keep Tomorrow.",
      body: "The dinners and the late nights are part of the life you are working for, and they should not cost you the morning after. CONKA will not undo a big night, but the stack below helps your brain clear the load and start the next day closer to sharp.",
      asset: {
        kind: "ingredientGrid",
        eyebrow: "The morning-after stack",
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
      headline: "The Cheat Code Two Founders Built for Themselves",
      body: "This started as a private edge, not a product. Harry needed to think clearly under Olympic pressure with Team GB; Humphrey was running a full-time team while training for Ironmans. Nothing on the market worked, so they spent years and £500,000 of their own money building it, collapsing 14 daily capsules into a single shot tested at Cambridge. What was their cheat code is now yours.",
      chips: ["Backed by 25+ cognitive trials"],
      asset: {
        kind: "image",
        src: "/lifestyle/CreationOfConka.jpg",
        alt: "CONKA founders developing the formula",
        fit: "cover",
        aspect: "1500/1000",
      },
    },
    {
      kind: "reason",
      n: 4,
      headline: "Have the Career Without Losing the Life",
      body: "Chasing the next deadline while the dinners, the friends, the people at home quietly slip down the list. You were told that's the cost of ambition. It isn't. CONKA gives you steady, all-day capacity, so you can go hard at work and still show up for the life that makes it worth it, present in both and drained by neither.",
      chips: ["28% less burnout in a clinical trial", "28% lower cortisol, the stress hormone"],
      citation: "PMID: 19016404 · PMID: 23439798",
      asset: {
        kind: "image",
        src: "/lifestyle/GirlsLaughing.jpg",
        alt: "Friends laughing together over a meal",
        fit: "cover",
        aspect: "1/1",
      },
    },
    {
      kind: "reason",
      n: 5,
      headline: "Sharp From Your Morning Workout to Your Late-Night Deadline",
      body: "The clarity you have at 9am is usually gone by 3pm, and a fourth coffee only rents it back with a crash to follow. CONKA is completely caffeine-free, and its ingredients deliver 18.1% faster mental processing than caffeine, so your sharpness holds from the morning workout to the last deadline of the day.",
      citation: "DOI: 10.1186/1550-2783-12-S1-P41",
      // Day-energy curve: afternoon holds steady with CONKA
      asset: { kind: "dayEnergyCurve" },
    },
    {
      kind: "reason",
      n: 6,
      headline: "You Measure Everything Else. Measure This Too.",
      body: "You run your work on numbers, so run this on numbers too. The CONKA app is built around CognICA, an FDA-cleared cognitive test from Cambridge used clinically to help diagnose dementia. It takes under two minutes, so when your score moves, it's real, not a feeling.",
      // App cognitive-score count-up card. Press outlets render below via pressMarquee.
      asset: { kind: "measureTile" },
      pressMarquee: true,
    },
    {
      // Hand-cropped excerpts (productivity / endurance theme). Named exec
      // quotes (Shane, Nimisha) are the deferred final pass, pending real copy.
      kind: "reviewStrip",
      eyebrow: "What Customers Say",
      ratingSummary: "Rated 4.7 / 5 · 622+ reviews",
      reviews: [
        {
          headline: "Consistent energy, no trade-off",
          quote:
            "My energy feels more consistent, and I can stay sharp later in the day without the downside.",
          name: "Aaron H.",
          image: "/lander/reviews/AaronH.jpg",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "Capacity left for the evenings",
          quote:
            "I take something after work, lock back in for the hustle, and still sleep well. Sharper on client work during the day.",
          name: "Sam J.",
          image: "/testimonials/dtc/SamJ.jpg",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "Measure it to manage it",
          quote:
            "What can't be measured can't be managed. I have more energy, and if you're pessimistic, just do a before and after test.",
          name: "Anthony Stodart",
          image: "/testimonials/ugc/15.jpg",
          detail: "Verified · Flow + Clear",
        },
      ],
    },
    {
      kind: "reason",
      n: 7,
      headline: "100 Days to Feel It, or Your Money Back",
      body: "Try CONKA for a full 100 days. If your clarity and output haven't changed, you get every penny back. Informed Sport certified, made in the UK, built on a decade of brain research.",
      // University research proof (matches the ADHD guarantee asset)
      asset: { kind: "researchBacked" },
    },
  ],
  bridge: {
    headline: "Have the career and the life. Refuse the trade-off.",
    cta: "Try Conka Risk-Free for 100 Days →",
  },
  product: {
    productHeroId: "03",
  },
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
    label: "Have it all, without the burnout.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
