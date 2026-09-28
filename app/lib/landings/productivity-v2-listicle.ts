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
  title: "7 Reasons to Raise Your Brain's Limit",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline: "Your brain has a limit. Raise it.",
    subcopy:
      "Too much on, a mind that won't settle, or a brain that isn't as quick as it was. Coffee borrows against tomorrow. CONKA works from within to give your brain more capacity, so you get done what needs doing.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Save {percent}% and raise your limit",
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
    headline: "7 Reasons to Raise Your Brain's Limit",
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
  body: [
    {
      kind: "reason",
      n: 1,
      headline: "Your Brain Runs Out Before Your Day Does",
      body: "Emails, meetings, decisions, the list at home. Each one draws on the same limited supply of focus, and by mid-afternoon it's spent. That isn't a willpower problem, it's biology. CONKA supports the pathways behind focus and mental energy from within, so there's more in the tank when the day asks for it.",
      asset: { kind: "focusBars" },
    },
    {
      kind: "reason",
      n: 2,
      headline: "More Capacity, Without the Crash",
      body: "Coffee doesn't raise your limit, it borrows against it, and the 3pm crash comes to collect. CONKA is completely caffeine-free, and its ingredients delivered 18.1% faster mental processing than caffeine, so your capacity holds from the first task of the day to the last.",
      citation: "DOI: 10.1186/1550-2783-12-S1-P41",
      asset: { kind: "dayEnergyCurve" },
    },
    {
      // ADHD bridge: headline names the shared problem, body names the condition.
      kind: "reason",
      n: 3,
      headline: "Why Starting Is the Hardest Part",
      body: "ADHD brains run lower on dopamine, the chemical that turns \"I should\" into \"I am\". So starting a task feels like a fight. Plenty of people without ADHD know that fight on a heavy day. CONKA supports the pathways behind focus and drive, so getting started stops costing so much.",
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
      headline: "The Same Workload Gets Heavier Every Year",
      body: "Your brain doesn't fall off a cliff, it slowly loses speed. A ten-year study of over 7,000 people found decline already measurable from around 45. The job doesn't get lighter, so the same load costs more every year. CONKA supports the recall and processing pathways that start to slip, so today's workload feels like it used to.",
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
      headline: "Measure Your Limit, Then Watch It Move",
      body: "You track your steps, your sleep and your spend, but your brain runs on guesswork. The CONKA app is built around CognICA, an FDA-cleared cognitive test from Cambridge used clinically to help diagnose dementia. It takes under two minutes, so when your score moves, you know your limit has moved, not just your mood.",
      asset: { kind: "measureTile" },
      pressMarquee: true,
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
      headline: "Get It All Done and Still Have a Life",
      body: "Most days the work gets the best of you and everyone else gets what's left. The dinners, the friends, the people at home slip down the list. More capacity changes the maths. With steady, all-day support and no crash, you finish the day with something left over, so the evening gets you at your best too.",
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
      headline: "100 Days to Feel It, or Your Money Back",
      body: "Try CONKA for a full 100 days. If your clarity and output haven't changed, you get every penny back. Informed Sport certified, made in the UK, built on a decade of brain research.",
      asset: { kind: "researchBacked" },
    },
  ],
  bridge: {
    headline: "Your brain has a limit. Raise it today.",
    cta: "Try Conka Risk-Free for 100 Days →",
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
  stickyBar: { cta: "Get started" },
};
