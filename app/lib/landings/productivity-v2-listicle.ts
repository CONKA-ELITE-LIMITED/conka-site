import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle v2: productivity as the core "your brain has a limit"
 * message (SCRUM-1470). Plan: docs/development/featurePlans/productivity-listicle-v2.md.
 *
 * v1 sold an identity ("high performers"); v2 sells a situation anyone
 * recognises: the day asks more of your brain than it has to give. Copy follows
 * the conka-messaging skill (.claude/skills/conka-messaging): experience not
 * biology, no named conditions, Flow first / Clear before it counts.
 *
 * Six reasons: composure, motivation ("not lazy"), memory ("not losing it"),
 * routine, value, then a proof reason that runs the club and workplace trials
 * into the reader's own test and the guarantee.
 */
export const productivityV2Listicle: ListicleConfig = {
  slug: "productivity-v2",
  persona: "productivity",
  format: "listicle",
  template: "im8",
  title: "6 Reasons 5,000+ People Have Made CONKA Part of Their Routine",
  hero: {
    proofWallFirst: true,
    // No laurel: the logo band a scroll later does the credibility job, and the
    // hero reads as H1, subcopy, CTA, one proof line.
    // v1 headline as a stand-in until the new hero line is settled.
    headline: "Discover the natural way to stay sharp all day.",
    subcopy:
      "Whether it's too much on, a mind that won't settle or a brain that isn't as quick as it was, CONKA keeps you sharp from the first task to the last. Flow first. Clear before it counts.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Save {percent}% and try it risk-free",
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
    headline: "6 Reasons 5,000+ People Have Made CONKA Part of Their Routine",
  },
  proof: {
    logoBand: true,
    ugc: {},
  },
  // Grüns pattern: each reason is a category of reason to buy (tag eyebrow),
  // a concrete outcome headline, and a bold closing fact (payoff). Copy follows
  // the conka-messaging skill: experience not biology, no named conditions, and
  // Flow / Clear in their moments. Reasons 2 and 3 reframe the reader's worry
  // ("not lazy", "not losing it") as the shared problem: a brain at its limit.
  // Visuals are stand-ins from the existing pages until purpose-made assets exist.
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "Composure",
      headline: "Stay Calm in the Chaos of Life",
      body: "The deadline moves up, the inbox fills, and your head goes from full to frantic. CONKA helps you keep your composure when the day piles on, so you stay in control instead of playing catch-up.",
      payoff:
        "Focus scores rose 19.3% in a trial of professional athletes, people whose job is performing under pressure.",
      citation: "PMID: 23439798",
      // Payoff becomes the focus bars' caption strip (athlete trial figure).
      asset: { kind: "focusBars" },
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
          image: "/testimonials/ugc/15.jpg",
          detail: "Verified · Flow + Clear",
        },
      ],
    },
    {
      kind: "reason",
      n: 2,
      tag: "Motivation",
      headline: "You're Not Lazy. Your Brain Is Underfuelled.",
      body: "Some days the hardest part of any task is the first minute. That isn't a character flaw. After a heavy week or a short night, your brain has less to give, and starting takes everything you've got.",
      payoff:
        "Flow first, before you open your emails, and the first minute stops feeling like a fight.",
      // Placeholder wording tightened from the team's paraphrase: needs
      // Dr Morehen's sign-off before scaling spend.
      pullQuote: {
        quote:
          "Our athletes make more mistakes in the second half. That's a fuel gap: their body and brain are missing the fuel to stay sharp.",
        name: "Dr James Morehen",
        credentials: [
          "England Rugby Performance Nutritionist",
          "Also works with boxers Chris Billam-Smith and Adam Azim",
        ],
        image: "/testimonials/expert/JamesMorehen.webp",
      },
      ingredients: ["lemon-balm", "rhodiola"],
      // Round 2: athletes and professionals, alternating, each with their own
      // score change. Figures from caseStudiesData (CognICA total score).
      // Leeds players are hidden site-wide on request (SCRUM-1354), so no Bamford.
      asset: {
        kind: "athleteScores",
        athletes: [
          { name: "Jade Shekells", role: "GB Women's Rugby 7s", image: "/caseStudies/JadeShekells.jpg", from: 60.33, to: 82.48, change: "+36.7%" },
          { name: "Doris Regazi", role: "Account Executive, Revolut", image: "/caseStudies/DorisRegazi.jpg", from: 61.33, to: 80.21, change: "+30.8%" },
          { name: "Finn Russell", role: "Bath Rugby, Scotland", image: "/caseStudies/FinnRussell.jpg", from: 54.67, to: 70.5, change: "+29.0%" },
          { name: "Nimisha Kurup", role: "Managing Director, Bank of America", image: "/caseStudies/NimishaKurup.jpg", from: 65.67, to: 81.87, change: "+24.7%" },
          { name: "Pierre-Louis Barassi", role: "Stade Toulousain", image: "/caseStudies/PierreLouisBarassi.jpg", from: 67, to: 85.25, change: "+27.2%" },
          { name: "Jack Willis", role: "Stade Toulousain", image: "/caseStudies/JackWillis.jpg", from: 69.33, to: 83.56, change: "+20.5%" },
        ],
      },
    },
    {
      kind: "reason",
      n: 3,
      tag: "Memory",
      headline: "You're Not Losing It. Your Brain Is Just Overloaded.",
      body: "The word you want arrives a beat late. A name you know goes blank. It's easy to fear the worst, but most days your head is simply carrying too much at once. And the pace does shift: Archana Singh-Manoux's ten-year study of over 7,000 people found the slip in processing speed already measurable by 45.",
      payoff:
        "Clear before it counts, so the name is there when you need it.",
      citation: "Singh-Manoux et al., BMJ, 2012 (Whitehall II)",
      ingredients: ["turmeric", "bilberry"],
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
      // Rendered at the frame's 4:5 from design/listicle-assets/routine.html,
      // round 2: rewritten to the conka-messaging system lines.
      asset: {
        kind: "image",
        src: "/listicle/RoutineTwoShotsV3.jpg",
        alt: "Flow first, Clear before it counts: Flow before you open your laptop, Clear 5 minutes before the big meeting. Zero caffeine, no powders, no capsules",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 5,
      tag: "Value",
      headline: "Costs Less Than Your Daily Coffee",
      body: "We love coffee too, but it has its limits. Too much caffeine takes a toll on your body and your sleep. CONKA gives you the focus today and looks after your brain for the long run, with zero caffeine.",
      payoff:
        "On a quarterly subscription, CONKA works out at £{perDay} a day.",
      // Cost is the first row; the payoff becomes the tile's bottom strip.
      asset: { kind: "coffeeCompare" },
    },
    // Reason 6: "why are we so confident" and "prove it to yourself" in one.
    // Others' results first, then the reader's own test and the guarantee. Figures exactly as
    // docs/conkaAppData/HIGH_LEVEL_STATS.md and the two trial PDFs state them.
    {
      kind: "trialCarousel",
      n: 6,
      tag: "Proof",
      headline: "Tested by the Pros. Now Prove It to Yourself.",
      intro:
        "Why are we so confident? The people who can't afford an off day already measure it: professional athletes, executives and whole teams, tracking their scores on CONKA. Your turn: take the free two-minute test in the CONKA app before you start, then again a few weeks in.",
      payoff:
        "If your score and your days haven't moved within 100 days, you get every penny back.",
      appStores: true,
      pressMarquee: true,
      slides: [
        {
          logo: "/logos/Harlequins.webp",
          logoAlt: "Harlequins",
          design: "Randomised, double-blind, placebo-controlled",
          meta: "29 professional rugby players · 6 weeks",
          figure: "+14.86%",
          figureLabel: "Cognitive performance on CONKA",
          chartTitle: "Change in cognitive score",
          bars: [
            { label: "Placebo", value: -0.69, display: "−0.69%" },
            { label: "CONKA", value: 14.86, display: "+14.86%", conka: true },
          ],
          axis: { min: 0, max: 16, ticks: [0, 8, 16] },
          caption:
            "80% of fully tracked players on CONKA improved, while taking 60% more contact.",
          source: "Harlequins F.C. trial report",
        },
        {
          logo: "/logos/BristolBears.svg",
          logoAlt: "Bristol Bears",
          design: "Each player against their own baseline",
          meta: "15 professional rugby players · 13 weeks",
          figure: "77.9 → 88.7",
          figureLabel: "Average cognitive score, baseline to peak",
          chartTitle: "Average score every three weeks",
          bars: [
            { label: "Start", value: 77.9, display: "77.9" },
            { label: "Wk 3", value: 83.9, display: "83.9", conka: true },
            { label: "Wk 6", value: 86.5, display: "86.5", conka: true },
            { label: "Wk 9", value: 88.7, display: "88.7", conka: true },
          ],
          axis: { min: 70, max: 90, ticks: [70, 80, 90] },
          caption: "Scores climbed for nine straight weeks on CONKA.",
          source: "Bristol Bears trial report",
        },
        // The desk-job bridge. The group score average is flat (high scorers
        // stopped testing in week 2), so this card leads on the share who
        // improved and charts reaction time. RT bars average the five
        // participants the report gives start and end times for (Ben, Fred,
        // Doris, William, Michael): 416ms to 317ms, inside its "20-25% faster".
        {
          logo: "/logos/Revolut.png",
          logoAlt: "Revolut",
          design: "Workplace trial",
          meta: "9 Revolut employees · 18 days",
          figure: "75%",
          figureLabel: "Improved their cognitive score",
          // Reaction time inverted to speed (1000 / ms) so taller reads as
          // faster: 416ms = 2.4 per second, 317ms = 3.2 per second.
          chartTitle: "Reaction speed (responses per second)",
          bars: [
            { label: "Start", value: 2.4, display: "2.4" },
            { label: "End", value: 3.15, display: "3.2", conka: true },
          ],
          axis: { min: 0, max: 4, ticks: [0, 2, 4] },
          caption:
            "Everyone got faster, with average response times down from 416ms to 317ms.",
          source: "Revolut trial report, March 2026",
        },
      ],
    },
  ],
  bridge: {
    headline: "Make it part of your routine. 100 days, risk-free.",
    cta: "Try CONKA Risk-Free →",
  },
  product: {
    productHeroId: "01",
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
  stickyBar: { cta: "Save {percent}% and try it risk-free", layout: "button" },
};
