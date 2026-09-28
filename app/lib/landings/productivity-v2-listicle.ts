import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle v2: productivity as the core "your brain has a limit"
 * message (SCRUM-1470). Plan: docs/development/featurePlans/productivity-listicle-v2.md.
 *
 * v1 (productivity-listicle.ts) sold an identity ("high performers"); v2 sells a
 * situation anyone recognises: the day asks more of your brain than it has to
 * give. The hero subcopy names all three causes (load, focus, age) so ADHD and
 * 40+ readers from the same ads see themselves, and reasons 3 and 4 bridge each
 * condition back to the shared problem. Headlines name the shared problem, bodies
 * name the condition, so a skimming productivity reader never feels excluded.
 *
 * Copy and order only: every asset is reused from the existing persona pages.
 * This page is the template the ADHD and brain-ageing listicles will copy.
 */
export const productivityV2Listicle: ListicleConfig = {
  slug: "productivity-v2",
  persona: "productivity",
  format: "listicle",
  template: "im8",
  title: "7 Reasons 5,000+ People Have Made CONKA Part of Their Routine",
  hero: {
    proofWallFirst: true,
    // No laurel: the logo band a scroll later does the credibility job, and the
    // hero reads as H1, subcopy, CTA, one proof line.
    // v1 headline as a stand-in until the new hero line is settled.
    headline: "Discover the natural way to stay sharp all day.",
    subcopy:
      "Whether it's too much on, a mind that won't settle or a brain that isn't as quick as it was, CONKA's natural nootropics and adaptogens keep you sharp from the first task to the last.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Save {percent}% and try it risk-free",
    // Same hero image as v1: this ticket changes copy only.
    asset: {
      kind: "image",
      src: "/lifestyle/flow/TrackAthlete.webp",
      alt: "A runner on a track holding a CONKA Flow shot",
      aspect: "1/1",
      objectPosition: "center top",
    },
  },
  reasonsHeader: {
    eyebrow: "Brain health at the cellular level",
    headline: "7 Reasons 5,000+ People Have Made CONKA Part of Their Routine",
  },
  proof: {
    logoBand: true,
    comparison: true,
    ugc: {},
    feature: {
      name: "Jack Willis",
      credentials: [
        "2025 Top 14 Player of the Season",
        "4× Top 14 Champion, Champions Cup winner",
      ],
      quote:
        "For me it was about trying to find the small margins, and maximising my brain as well as my body was so important.",
      image: "/testimonials/athlete/JackWillisNB.jpg",
      imageAlt:
        "Jack Willis applauding in the Stade Toulousain jersey, 2025 Top 14 Player of the Season",
    },
  },
  // Grüns pattern: each reason is a category of reason to buy (tag eyebrow),
  // a concrete outcome headline, and a bold closing fact (payoff). Reasons 3
  // and 4 carry the ADHD and 40+ readers in their bodies. Visuals are stand-ins
  // from the existing pages until purpose-made assets exist.
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "Focus",
      headline: "All-Day Energy and Focus, Without the Crash",
      body: "Sharp at your first meeting and still sharp at your last. CONKA's natural nootropics support the pathways behind focus and mental energy, so there's no spike to come down from and nothing wearing off by lunch.",
      // Payoff matches the crash chart: steady focus against coffee's crash.
      payoff:
        "Its ingredients delivered 18.1% faster mental processing than caffeine, with no crash.",
      citation: "DOI: 10.1186/1550-2783-12-S1-P41",
      asset: { kind: "crashChart" },
    },
    {
      kind: "reason",
      n: 2,
      tag: "Stress",
      headline: "Stay Calm When Everything Lands at Once",
      body: "The deadline moves up, the inbox fills, and your head goes from full to frantic. Ashwagandha, one of CONKA's adaptogens, has been shown to lower cortisol, the stress hormone, by 28%.",
      // Payoff matches the focus bars (athlete trial figure).
      payoff:
        "Focus scores rose 19.3% in a trial of professional athletes, people whose job is performing under pressure.",
      citation: "PMID: 23439798",
      asset: { kind: "focusBars" },
    },
    {
      kind: "reason",
      n: 3,
      tag: "Motivation",
      headline: "Start the Tasks You Keep Putting Off",
      body: "Some days the hardest part of any task is the first minute. Dopamine is the chemical that turns intention into action, and when it runs low, after a heavy week, a bad night, or in an ADHD brain that makes less of it, starting takes everything you've got.",
      payoff:
        "Lemon Balm and Rhodiola support calm, steady drive, so starting stops feeling like a fight.",
      ingredients: ["lemon-balm", "rhodiola"],
      asset: {
        kind: "video",
        src: "/videos/flow/FlowFloat.mp4",
        alt: "A CONKA Flow bottle floating over a neural network",
        aspect: "3/4",
      },
    },
    {
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
      n: 4,
      tag: "Memory",
      headline: "Stop Forgetting Names and Losing Your Words",
      body: "Past 30, the word you want arrives a beat late and a name you know goes blank. Processing speed and memory peak around 30, then slip so gradually it's easy to miss, and a ten-year study of over 7,000 people found the decline measurable by 45.",
      payoff:
        "CONKA's Turmeric and Bilberry are antioxidants that help protect the brain cells behind recall.",
      citation: "Singh-Manoux et al., BMJ, 2012 (Whitehall II)",
      ingredients: ["turmeric", "bilberry"],
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
      n: 5,
      tag: "Convenience",
      headline: "Fits Around Your Day, Whatever Time It Starts",
      body: "One shot in the morning, one in the afternoon. No powders to mix or capsules to count, and zero caffeine, so you can take it as early or as late as your routine needs.",
      payoff:
        "Our founders turned a 14-capsule daily stack into these two shots, tested at Cambridge.",
      // Rendered at the frame's 4:5 from design/listicle-assets/routine.html.
      asset: {
        kind: "image",
        src: "/listicle/RoutineTwoShotsV1.jpg",
        alt: "Two shots, zero caffeine: Flow in the morning for calm, sharp focus, Clear in the afternoon so the fog lifts",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 6,
      tag: "Value",
      headline: "Costs Less Than Your Daily Coffee",
      body: "A coffee-shop flat white wears off by lunch, and you're buying another by 3pm.",
      payoff:
        "On a quarterly subscription, CONKA works out at £{perDay} a day.",
      // Cost is the first row; the payoff becomes the tile's bottom strip.
      asset: { kind: "coffeeCompare" },
    },
    {
      kind: "reason",
      n: 7,
      tag: "Proof",
      headline: "See It Work, or Get Your Money Back",
      body: "Take the free two-minute CognICA test in the CONKA app, an FDA-cleared test from Cambridge, before you start and again a few weeks in.",
      payoff:
        "If your score and your days haven't moved within 100 days, you get every penny back.",
      pressMarquee: true,
      asset: { kind: "measureTile" },
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
