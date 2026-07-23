import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle: older generation / brain-ageing.
 *
 * Restructured 2026-07-23 (conversion pass) into a true numbered "X reasons"
 * listicle: a counted hero and 7 tight reasons, one idea each, statement
 * headlines, pain-first openings. The men/women segmentToggle is kept as one
 * reason (men's body trimmed); the verbose mechanism detail and search-question
 * framing move to the parallel /blog work (SCRUM-1175). One stats band and one
 * review strip sit between reasons so the page reads as a scannable list.
 * Template stays "im8". Claims pass is owned by the user.
 *
 * Slug is brain-ageing-listicle to avoid colliding with the brain-age QUIZ
 * page (/go/brain-age, SCRUM-1084).
 */
export const brainAgeingListicle: ListicleConfig = {
  slug: "brain-ageing-listicle",
  persona: "brain-ageing",
  format: "listicle",
  template: "im8",
  title: "7 Reasons Word-Slips Don't Have to Get Worse",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline: "7 Reasons Word-Slips Don't Have to Get Worse",
    subcopy:
      "Losing a word mid-sentence is rarely what you fear, more often just fatigue and mental overload in a technology-driven world. You can support the recall pathways behind it before it gets worse. Flow in the morning, Clear in the afternoon.",
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
      src: "/lifestyle/ageing/WorkingWoman.jpg",
      alt: "A professional woman in her fifties taking a CONKA shot",
      // Landscape source fills the hero frame; anchor to the top so the crop
      // takes from the bottom and keeps her face in frame.
      aspect: "1500/1000",
      objectPosition: "center top",
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
    // Persona-matched: an older athlete talking about word-finding and calmness,
    // which is exactly this page's promise.
    feature: {
      name: "Dan Norton",
      credentials: [
        "Olympic Silver Medallist",
        "Rugby Sevens, Great Britain",
      ],
      quote:
        "I am finding myself being able to speak clearer and in conversations my words just flow better. I have more calmness.",
      image: "/testimonials/athlete/DanNortonNB.jpg",
      imageAlt:
        "Dan Norton, Olympic silver medallist in rugby sevens for Great Britain",
    },
  },
  body: [
    {
      kind: "reason",
      n: 1,
      headline: "Find Your Words Again, Without the Hesitation",
      body: "That moment your words vanish mid-sentence is unsettling, but it's rarely permanent. This daily shot supports the language pathways behind recall, so the words are there when you reach for them and conversation flows again. The earlier you support it, the easier to stay ahead.",
      // Dan Norton's quote (speaking clearer, words flowing) lands the word-recall reason
      asset: {
        kind: "athleteQuote",
        name: "Dan Norton",
        role: "Rugby 7s · Olympic Silver Medallist",
        image: "/testimonials/athlete/DanNortonNB.jpg",
        quote:
          "After a career in contact sport, my memory isn't what it was. I am finding myself able to speak clearer, and in conversations my words just flow better. I have more calmness.",
      },
    },
    {
      kind: "segmentToggle",
      n: 2,
      headline: "Where Ageing Hits Hardest, and What Helps",
      segments: [
        {
          label: "For men",
          headline:
            "From 30, Testosterone Only Goes One Way, Unless You Do Something About It",
          body: "From your thirties, testosterone drifts down and sustained effort starts to feel heavier. Ashwagandha and Rhodiola are adaptogens shown in clinical trials to ease the cortisol load that suppresses it, so work and training stop feeling like a grind.",
          ingredientsEyebrow: "The men's stack",
          ingredients: [
            {
              icon: "🔥",
              name: "Ashwagandha",
              benefit: "Eases the cortisol load that quietly suppresses testosterone.",
              citation: "PMID: 30854916",
            },
            {
              icon: "⚡",
              name: "Rhodiola Rosea",
              benefit: "Makes sustained effort, physical or mental, feel lighter, not harder.",
              citation: "PMID: 23443221",
            },
            {
              icon: "🩸",
              name: "Ginkgo Biloba",
              benefit: "Supports the blood flow behind focus under pressure.",
              citation: "PMID: 17457961",
            },
            {
              icon: "🧠",
              name: "Alpha GPC",
              benefit: "Fuels the neurotransmitter your brain uses for sharp, driven thinking.",
              citation: "PMID: 39683633",
            },
          ],
          ingredientsFooter: "All in two daily 30ml shots.",
          testimonial: {
            quote:
              "I can now tolerate the same workload as I did in my 30s. I travel from Scotland to London frequently for intense bouts of work. I used to lose my memory in these periods, but now I don't.",
            name: "Shane",
            image: "/testimonials/ugc/16.jpg",
            detail: "Verified customer",
          },
        },
        {
          label: "For women",
          headline: "Is Forgetting Words Mid-Sentence a Sign of Perimenopause?",
          body: "Often, yes, and not dementia. Oestrogen plays a direct role in word retrieval and memory, and the drop during perimenopause is one of the most common, least-talked-about causes of this. Lemon Balm, NAC and high-dose Vitamin C support the calm and clarity that hormonal fog disrupts.",
          ingredientsEyebrow: "The women's stack",
          ingredients: [
            {
              icon: "🍋",
              name: "Lemon Balm",
              benefit:
                "Shown in clinical trials to significantly improve quality of life for menopausal women with sleep disturbances.",
              citation: "PMID: 33465795",
            },
            {
              icon: "⚙️",
              name: "Acetyl-L-Carnitine",
              benefit:
                "Clinically shown to reduce mental fatigue and support cognitive function in older women.",
              citation: "PMID: 17658628",
            },
            {
              icon: "🧪",
              name: "NAC + Glutathione",
              benefit:
                "NAC is the precursor to glutathione; together they make the best detoxifying combination possible.",
            },
            {
              icon: "🍊",
              name: "Vitamin C (high-dose)",
              benefit: "An antioxidant shown in clinical trials to help ease anxiety among women.",
              citation: "PMID: 26353411",
            },
          ],
          ingredientsFooter: "All in two daily 30ml shots.",
          testimonial: {
            quote:
              "I am a patient of Dr Tina Peers, a menopause specialist, who told me to take NAC in this formula. I don't get hot flushes or a red face anymore. I think that says it all.",
            name: "Rosalind",
            detail: "Verified customer",
          },
        },
      ],
    },
    {
      kind: "statsBand",
      eyebrow: "CLINICALLY PROVEN",
      stats: [
        { value: "+14.86%", label: "Sharper thinking vs placebo" },
        { value: "+19.3%", label: "Sharper focus in pro athletes" },
        { value: "82%", label: "Improved within 2 hours of a single dose" },
        { value: "80%", label: "Improved cognitive scores" },
      ],
      footnote:
        "*From CONKA cognitive trials, including a 6-week randomised double-blind placebo-controlled trial with professional rugby players, plus internal testing on male and female athletes.",
    },
    {
      kind: "reason",
      n: 3,
      headline: "Protect Your Brain for the Years Ahead",
      body: "This isn't a temporary spike, it's a daily system for long-term brain health. Targeted, natural support helps protect your cognitive function for the years ahead, without stimulants. Durham University research found the ingredients in Flow extended lifespan and reduced oxidative stress.",
      chips: ["+15 human-year equivalent in an ageing study"],
      citation:
        "Alanazi et al., Journal of Pharmacy and Pharmacology, 2025 (Durham University)",
      asset: { kind: "researchBacked" },
    },
    {
      kind: "reason",
      n: 4,
      headline: "Watch It Working, in Real Numbers",
      body: "Most brain-training apps are just games with a leaderboard. The CONKA app is built around CognICA, an FDA-cleared cognitive test from Cambridge used clinically to help diagnose dementia. The same test, so when your score moves, it's real. The same science has been covered and published here:",
      // App cognitive-score count-up card; "Do you see an animal?" GIF is a
      // Phase 5 asset swap. Press outlets render below via pressMarquee.
      asset: { kind: "measureTile" },
      pressMarquee: true,
    },
    {
      kind: "reason",
      n: 5,
      headline: "Beat the Afternoon Slump Without Caffeine",
      body: "Most energy fixes are just caffeine, and caffeine always ends the same way. CONKA's ingredients deliver 18.1% faster mental processing than caffeine, and CONKA is completely caffeine-free.",
      citation: "DOI: 10.1186/1550-2783-12-S1-P41",
      // Day-energy curve: afternoon slump without, steady with CONKA
      asset: { kind: "dayEnergyCurve" },
    },
    {
      // Age-matched customer voices for the persona
      kind: "reviewStrip",
      eyebrow: "What Customers Say",
      ratingSummary: "Rated 4.7 / 5 · 622+ reviews",
      reviews: [
        {
          headline: "Measure it to manage it",
          quote:
            "What can't be measured can't be managed. I have more energy, and if you're pessimistic, just do a before and after test.",
          name: "Anthony S.",
          image: "/testimonials/ugc/15.jpg",
          detail: "Verified · Age 61",
        },
        {
          headline: "Clarity, energy and better sleep",
          quote:
            "I noticed a clarity and energy and have benefited from that. My sleep wasn't great after I retired, but now I seem to be sleeping well.",
          name: "Deborah Lowe",
          image: "/testimonials/ugc/17.jpg",
          detail: "Verified · Age 62",
        },
        {
          headline: "Sharper recall, clearer words",
          quote:
            "My short-term memory is better, I feel more eloquent, and I am able to stay focused for longer periods of time.",
          name: "Millie H.",
          image: "/testimonials/ugc/14.jpg",
          detail: "Verified · Flow + Clear",
        },
      ],
    },
    {
      kind: "reason",
      n: 6,
      headline: "Backed by Trials, Not Testimonials",
      body: "Most focus supplements hide one trick: caffeine, which by the original definition is a stimulant, not a nootropic. CONKA has run randomised controlled trials over 20 times, and we built a way for you to measure it yourself.",
      asset: { kind: "scoreByGroup" },
    },
    {
      kind: "reason",
      n: 7,
      headline: "100 Days to Feel It, or Your Money Back",
      body: "Try CONKA for a full 100 days. If your recall and clarity haven't changed, you get every penny back. Developed from brain research at Durham and Newcastle, Informed Sport certified, made in the UK.",
      // Off CONKA vs on CONKA measured focus (+19.3%)
      asset: { kind: "focusBars" },
    },
  ],
  bridge: {
    headline: "Protect your sharpest asset. Start today.",
    cta: "Try Conka Risk-Free for 100 Days →",
  },
  product: {
    productHeroId: "03",
  },
  // Persona-curated canonical FAQ ids (resolved in the renderer). Order:
  // dementia, mid-sentence, cognitive-decline, medication, timeline, sleep,
  // app-optional, guarantee. The first two are new canonical entries.
  faqIds: [
    "forgetting-words-dementia",
    "forget-words-midsentence",
    "cognitive-decline",
    "medication",
    "results",
    "sleep",
    "app-optional",
    "guarantee",
  ],
  stickyBar: {
    label: "Protect your sharpest asset.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
