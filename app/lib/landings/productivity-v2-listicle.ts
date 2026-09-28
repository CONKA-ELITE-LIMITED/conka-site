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
  title: "Why 5,000+ People Are Swapping Coffee for a Daily Brain Shot",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline: "Your brain has a limit. Raise it.",
    subcopy:
      "One caffeine-free shot each morning. Whether it's too much on, a mind that won't settle or a brain that isn't as quick as it was, CONKA's natural nootropics and adaptogens keep you sharp from the first task to the last.",
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
    headline: "Why 5,000+ People Are Swapping Coffee for a Daily Brain Shot",
  },
  proof: {
    logoBand: true,
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
  // Headlines are the benefit; each body opens on the moment the reader hits
  // their limit, then names the ingredient doing the work. Reason 1 says what
  // CONKA is. The guarantee closes the page in the bridge, not as a reason.
  body: [
    {
      kind: "reason",
      n: 1,
      headline: "One Shot in the Morning, Sharp Until the Evening",
      body: "CONKA is a small, caffeine-free shot you drink with breakfast. Inside are six natural ingredients, including Rhodiola, Ashwagandha and Lemon Balm, that support the pathways behind focus and mental energy. So the clarity you have at 9am is still there at 4pm, when the list is half done and your brain would normally clock off.",
      asset: { kind: "focusBars" },
    },
    {
      kind: "reason",
      n: 2,
      headline: "Go All Day, Into the Evening, and Still Sleep",
      body: "Coffee gets you to lunch, then the crash collects, and a late cup costs you the night. CONKA is completely caffeine-free, and its ingredients delivered 18.1% faster mental processing than caffeine. So you stay sharp through the afternoon and into the evening, and still fall asleep when your head hits the pillow.",
      citation: "DOI: 10.1186/1550-2783-12-S1-P41",
      asset: { kind: "dayEnergyCurve" },
    },
    {
      // ADHD bridge: headline names the shared moment, body names the condition.
      kind: "reason",
      n: 3,
      headline: "Getting Started Stops Being a Fight",
      body: "If you have ADHD, you know the gap between \"I should\" and \"I am\". ADHD brains run lower on dopamine, the chemical that bridges it, so starting feels like a fight. Plenty of people without ADHD feel it on a heavy day too. Lemon Balm and Rhodiola support calm, steady drive, so getting started stops costing so much.",
      asset: {
        kind: "video",
        src: "/videos/flow/FlowFloat.mp4",
        alt: "A CONKA Flow bottle floating over a neural network",
        aspect: "3/4",
      },
    },
    {
      // Ageing bridge. Shane's quote is the proof: same workload as his 30s.
      kind: "reason",
      n: 4,
      headline: "Your Workload Feels Like It Did at 35",
      body: "Past 40, the job hasn't changed but it costs more. A ten-year study of over 7,000 people found cognitive decline already measurable from around 45, gradual enough to miss. CONKA's Turmeric and Bilberry are antioxidants that help protect brain cells from the wear behind it, so your workload feels like it used to.",
      citation: "Singh-Manoux et al., BMJ, 2012 (Whitehall II)",
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
      headline: "A Bad Night Costs You Less of Tomorrow",
      body: "Short sleep shrinks what your brain can handle the next day. A late deadline, a newborn, a night lost to your phone. Rhodiola, one of CONKA's six ingredients, cut fatigue and sharpened mental performance in night-shift doctors, so a rough night takes less out of the day that follows.",
      citation: "PMID: 11081987",
      asset: { kind: "researchBacked" },
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
      n: 6,
      headline: "You Get Home With Something Left",
      body: "Most days the work gets the best of you and the people at home get what's left. That's a capacity problem, not a priorities one. Ashwagandha, one of CONKA's adaptogens, has been shown to lower cortisol, the stress hormone, by 28%, so you finish work with something in the tank and the evening gets you at your best.",
      citation: "PMID: 23439798",
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
      n: 7,
      headline: "You Can See It Working, in Your Score",
      body: "Every supplement says it works. We'd rather you check. The CONKA app is built around CognICA, an FDA-cleared cognitive test from Cambridge. Take it before you start and again a few weeks in. Two minutes, and you'll see in a number whether your brain is sharper, not a hunch.",
      asset: { kind: "measureTile" },
      pressMarquee: true,
    },
  ],
  bridge: {
    headline: "Try it for 100 days. If your limit hasn't moved, you get every penny back.",
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
  stickyBar: { cta: "Try it risk-free" },
};
