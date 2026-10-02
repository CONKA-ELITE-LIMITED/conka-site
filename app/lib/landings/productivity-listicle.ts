import type { ListicleConfig } from "./listicle-types";

/**
 * /go/productivity-listicle: the live Meta campaign slug (SCRUM-1470).
 *
 * A frozen copy of productivity-v2-listicle.ts as of 29 Sep 2026 (round 3,
 * Henry's Figma notes), kept as its own config on purpose: the ads point here, so this page must not move when
 * v2 is iterated on. Work on /go/productivity-v2; when an iteration wins,
 * copy it back here in one deliberate change (and flag it on the Notion
 * timeline). The original v1 copy lives in git history.
 *
 * Sells the Both trial pack since 2 Oct 2026 (SCRUM-1516): `product.offer`
 * swaps the buy zone and CTAs; the Flow monthly/quarterly version is in git
 * history.
 *
 * Duplication with v2 is intended, not debt: sharing one config would push
 * every experiment straight to paid traffic.
 */
export const productivityListicle: ListicleConfig = {
  slug: "productivity-listicle",
  persona: "productivity",
  format: "listicle",
  template: "im8",
  title: "6 Reasons Thousands Have Made the Viral Brain Shot Part of Their Routine",
  hero: {
    proofWallFirst: true,
    // No laurel: the logo band a scroll later does the credibility job, and the
    // hero reads as H1, subcopy, CTA, one proof line.
    // Henry's round-3 note: statics convert when they name the product the way
    // social proof does ("viral brain shot"), so the H1 carries it.
    headline: "The Viral Brain Shot That Keeps You Sharp All Day.",
    subcopy:
      "Too much on, a mind that won't settle, or a brain that isn't as quick as it was. Flow first. Clear before it counts.",
    // Trustpilot star boxes (4.7 is our Trustpilot score) in place of the
    // gold stars and the review and user counts.
    socialProof: { label: "Excellent 4.7", trustpilot: true },
    cta: "Try CONKA from £{trialPrice}",
    // Purpose-shot hero (round 2): overloaded desk worker, hands offering CONKA shots from every side.
    asset: {
      kind: "image",
      src: "/listicle/ProductivityHeroV4.webp",
      alt: "A woman on the phone with arms full of folders and coffees, as hands offer her CONKA shots from every side",
      aspect: "4/5",
      objectPosition: "center",
    },
  },
  reasonsHeader: {
    eyebrow: "Get ahead. Stay ahead.",
    headline: "6 Reasons Thousands Have Made the Viral Brain Shot Part of Their Routine",
  },
  proof: {
    logoBand: true,
    logoBandHeading: "Improving brain performance at:",
    // Corporate and sport alternating, big-name sport only (Henry, round 3).
    logoBandLogos: [
      { src: "/lander/partners/nike.svg", alt: "Nike", h: 26, w: 73 },
      { src: "/lander/partners/england-rugby.webp", alt: "England Rugby", h: 58, w: 34 },
      { src: "/logos/Revolut.png", alt: "Revolut", h: 28, w: 56 },
      { src: "/lander/partners/bayern.webp", alt: "FC Bayern Munich", h: 52, w: 52 },
      { src: "/logos/Skyscanner.png", alt: "Skyscanner", h: 20, w: 118 },
      { src: "/lander/partners/f1.webp", alt: "Formula 1", h: 26, w: 104 },
      { src: "/lander/partners/goldman-sachs.webp", alt: "Goldman Sachs", h: 36, w: 86 },
      { src: "/lander/partners/team-gb.webp", alt: "Team GB", h: 58, w: 42 },
      { src: "/lander/partners/british-airways.webp", alt: "British Airways", h: 18, w: 114 },
      { src: "/lander/partners/bath-rugby.webp", alt: "Bath Rugby", h: 52, w: 52 },
      { src: "/lander/partners/equinox.webp", alt: "Equinox", h: 19, w: 100 },
      { src: "/lander/partners/wales-rugby.webp", alt: "Wales Rugby", h: 56, w: 42 },
    ],
    ugc: {},
  },
  // Grüns pattern: each reason is a category of reason to buy (tag eyebrow),
  // a concrete outcome headline, and a bold closing fact (payoff). Copy follows
  // the conka-messaging skill: experience not biology, no named conditions, and
  // Flow / Clear in their moments. One visual per reason; the review strip is
  // a band between reasons, not part of one.
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "Composure",
      headline: "Stay Calm in the Chaos of Life",
      body: "The deadline moves up, the inbox fills, and your head goes from full to frantic. CONKA helps you keep your composure when the day piles on, so you stay in control instead of playing catch-up.",
      citation: "PMID: 23439798",
      // Graph as the hero, zoomed so the gap reads first. No payoff: the tile
      // already states the figure, so a caption would repeat it.
      asset: { kind: "focusBars", zoom: true },
    },
    // Closes reason 1 (compact strip): customers backing the calm claim.
    {
      kind: "reviewStrip",
      compact: true,
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
          image: "/testimonials/dtc/AnthonyS.jpg",
          detail: "Verified · Flow + Clear",
        },
      ],
    },
    {
      kind: "reason",
      n: 2,
      tag: "Motivation",
      headline: "Motivation Comes From a Fuelled Mind",
      body: "After a heavy week or a short night, your brain has less to give. The hardest part of any task is the first minute, and it takes the most energy.",
      payoff: "Flow before opening your laptop prepares you for the day ahead.",
      // Quote wording from Henry's round-3 notes.
      asset: {
        kind: "athleteQuote",
        name: "Dr James Morehen",
        role: "Performance Nutritionist",
        image: "/testimonials/expert/JamesMorehenHero.webp",
        logo: "/lander/partners/england-rugby.webp",
        logoAlt: "England Rugby",
        crest: true,
        label: "Meet Our Nutrition Advisor",
        quote:
          "My clients make more mistakes in the second half. That's a nutritional gap that can only be solved with the correct fuel their brains are missing.",
      },
    },
    {
      kind: "reason",
      n: 3,
      tag: "Memory",
      headline: "Feeling Slow? Your Brain Is Just Overloaded.",
      body: "Words get lost mid-conversation. Names go blank. It's normal to fear the worst, but most days your head is simply carrying more than it can handle. A ten-year study of over 7,000 people found the slip in processing speed already measurable by 45.",
      payoff: "CONKA Clear supports the moments that count.",
      citation: "Singh-Manoux et al., BMJ, 2012 (Whitehall II)",
      asset: {
        kind: "athleteQuote",
        name: "Shane Corstorphine",
        role: "Former CFO, Skyscanner",
        image: "/caseStudies/ShaneCorstorphine.jpg",
        logo: "/logos/Skyscanner.png",
        logoAlt: "Skyscanner",
        quote:
          "I can now tolerate the same workload as I did in my 30s. I travel from Scotland to London frequently for intense bouts of work. I used to lose my memory in these periods, but now I don't.",
      },
    },
    {
      kind: "reason",
      n: 4,
      tag: "Convenience",
      headline: "Fits Around Your Day, Whatever Time It Starts",
      body: "Flow first, before you open your laptop or your emails. Clear in the five minutes before it counts. No powders to mix or capsules to count, and zero caffeine, so it fits whatever time your day starts.",
      // Rendered at the frame's 4:5 from design/listicle-assets/routine.html.
      asset: {
        kind: "image",
        src: "/listicle/RoutineTwoShotsV4.jpg",
        alt: "Flow first, Clear before it counts: Flow before you open your laptop, Clear 5 minutes before the big moment. 0 caffeine, 0 sugar, 0 calories",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 5,
      tag: "Value",
      headline: "Costs Less Than Your Daily Coffee",
      body: "We love coffee too, but it has its limits. Too much caffeine takes a toll on your brain and your sleep. CONKA gives you the focus today and looks after your brain for the long run, with zero caffeine. CONKA works 18.1% better than caffeine.*",
      // The 18.1% is the Alpha-GPC vs caffeine processing-speed study, the
      // same source brain-ageing reason 5 cites.
      citation:
        "*Mental processing speed, Alpha-GPC vs caffeine. DOI: 10.1186/1550-2783-12-S1-P41",
      payoff:
        "On a quarterly subscription, CONKA works out at £{perDay} a day.",
      // Cost is the first row; the payoff becomes the tile's bottom strip.
      asset: { kind: "coffeeCompare" },
    },
    // Reason 6: the individual score cards, then the trials, then the reader's
    // own test and the guarantee. Cards are the simple format (Henry, round 3):
    // who, figure, zoomed chart, no CONKA-vs-CONKA bars. Figures from
    // caseStudiesData and the trial reports.
    {
      kind: "trialCarousel",
      n: 6,
      tag: "Proof",
      headline: "Tested by the Best. Built for You.",
      intro:
        "Why are we so confident? The results speak for themselves: athletes, executives and professionals, all tested while taking CONKA. Now it's your turn: take the free two-minute test in the CONKA app to measure the change.",
      payoff:
        "If your score and your days haven't moved within 100 days, you get every penny back.",
      appStores: true,
      pressMarquee: true,
      // Better-known names first, sport and corporate alternating. Bamford is
      // shown here deliberately (29 Sep decision), though Leeds players stay
      // hidden elsewhere under SCRUM-1354.
      athletes: [
        { name: "Patrick Bamford", role: "Professional Footballer", image: "/caseStudies/PatrickBamford.jpg", from: 62.67, to: 80.17, change: "+27.9%" },
        { name: "Doris Regazi", role: "Account Executive, Revolut", image: "/caseStudies/DorisRegazi.jpg", from: 61.33, to: 80.21, change: "+30.8%" },
        { name: "Jack Willis", role: "Stade Toulousain, England", image: "/caseStudies/JackWillis.jpg", from: 69.33, to: 83.56, change: "+20.5%" },
        { name: "Nimisha Kurup", role: "Managing Director, Bank of America", image: "/caseStudies/NimishaKurup.jpg", from: 65.67, to: 81.87, change: "+24.7%" },
        { name: "Finn Russell", role: "Bath Rugby, Scotland", image: "/caseStudies/FinnRussell.jpg", from: 54.67, to: 70.5, change: "+29.0%" },
      ],
      slides: [
        {
          logo: "/logos/Harlequins.webp",
          logoAlt: "Harlequins",
          meta: "29 pro rugby players · 6 weeks",
          figure: "+14.86%",
          figureLabel: "Cognitive performance vs placebo",
          chartTitle: "Change in cognitive score",
          bars: [
            { label: "Placebo", value: -0.69, display: "−0.69%" },
            { label: "CONKA", value: 14.86, display: "+14.86%", conka: true },
          ],
          axis: { min: 0, max: 16, ticks: [0, 8, 16] },
        },
        {
          logo: "/logos/BristolBears.svg",
          logoAlt: "Bristol Bears",
          meta: "15 pro rugby players · 13 weeks",
          figure: "+13.9%",
          figureLabel: "Average cognitive score, start to week 9",
          chartTitle: "Average cognitive score",
          bars: [
            { label: "Start", value: 77.9, display: "77.9" },
            { label: "Week 9", value: 88.7, display: "88.7", conka: true },
          ],
          axis: { min: 75, max: 90, ticks: [75, 80, 85, 90] },
        },
        // Reaction time averages the five participants the report gives start
        // and end times for: 416ms to 317ms, inside its "20-25% faster". Drawn
        // as speed (1000 / ms) so taller reads as faster.
        {
          logo: "/logos/Revolut.png",
          logoAlt: "Revolut",
          meta: "9 Revolut employees · 18 days",
          figure: "24% faster",
          figureLabel: "Average reaction time, 416ms to 317ms",
          chartTitle: "Reactions per second",
          bars: [
            { label: "Start", value: 2.4, display: "2.4" },
            { label: "Day 18", value: 3.15, display: "3.2", conka: true },
          ],
          axis: { min: 2, max: 3.5, ticks: [2, 2.5, 3, 3.5] },
        },
      ],
    },
  ],
  bridge: {
    headline: "Make it part of your routine. 100 days, risk-free.",
    cta: "Try CONKA from £{trialPrice} →",
  },
  product: {
    // The buy zone and CTAs sell the Both trial pack (SCRUM-1516); Flow still
    // drives the prices above the buy zone (coffee compare, proof tier).
    productHeroId: "01",
    offer: "trial-pack",
  },
  faqIds: [
    "caffeine",
    "vs-energy-drink",
    "reduce-coffee",
    "when-to-take",
    "results",
    "with-coffee",
    "guarantee",
  ],
  // Same line as the hero CTA, so the page makes one ask.
  stickyBar: { cta: "Try CONKA from £{trialPrice}", layout: "button" },
};
