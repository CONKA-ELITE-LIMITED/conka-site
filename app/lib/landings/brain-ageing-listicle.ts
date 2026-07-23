import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle: older generation / brain-ageing.
 *
 * Rewritten 2026-07-22 to Humphrey's improved copy and sentiment (template
 * upgrade Phase 4). Uses the bespoke men/women segmentToggle block, the Phase 1
 * citations and press marquee, and canonical FAQ ids (two new word-recall
 * entries added to faqContent.ts). The "Do you see an animal?" test GIF is a
 * Phase 5 asset swap. Claims pass is owned by the user.
 *
 * Slug is brain-ageing-listicle to avoid colliding with the brain-age QUIZ
 * page (/go/brain-age, SCRUM-1084).
 */
export const brainAgeingListicle: ListicleConfig = {
  slug: "brain-ageing-listicle",
  persona: "brain-ageing",
  format: "listicle",
  template: "im8",
  title: "Is Forgetting Words Mid-Sentence a Sign of Dementia?",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline: "Is Forgetting Words Mid-Sentence a Sign of Dementia?",
    subcopy:
      "Not always what you fear, often just fatigue and mental overload, common in a modern, technology-driven world. Support the recall pathways behind it before it gets worse. Flow in the morning, Clear in the afternoon.",
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
  logoMarquee: true,
  pressMarquee: true,
  athleteTestimonials: true,
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "WORD RECALL",
      headline: "Seamless Speech, Without the Hesitation",
      body: "That moment your words vanish mid-sentence is unsettling, but it's rarely permanent. This 30ml daily shot supports the neural pathways behind language, so sentences form more easily, the words are there when you reach for them, and conversation flows naturally again. The earlier you support it, the easier it is to keep ahead of.",
      // Dan Norton's quote (speaking clearer, words flowing) lands the seamless-speech reason
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
      tag: "MEN & WOMEN",
      headline: "Where Ageing Hits Your Brain, and What Helps",
      segments: [
        {
          label: "For men",
          headline:
            "From 30, Testosterone Only Goes One Way, Unless You Do Something About It",
          body: "Ashwagandha and Rhodiola are adaptogens shown in clinical trials to ease the cortisol load that suppresses testosterone, so sustained effort, at work, training, or both, stops feeling like a grind. The adaptogens do their job daily, but the biggest lever is still training: heavy compound lifts trigger the body's largest natural testosterone response of any exercise type. Stack that on daily cortisol support and you are not fighting your hormones on top of everything else.",
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
      tag: "LONGEVITY",
      headline: "How to Protect Your Brain As You Age",
      body: "This isn't a temporary spike, it's a daily system for long-term brain health. Targeted, natural support covers the vitals, helping protect your cognitive function for the years ahead, safely and without stimulants. Published, peer-reviewed research from Durham University found the combination of ingredients in Flow significantly extended lifespan and reduced oxidative stress in an ageing model.",
      chips: ["+15 human-year equivalent in an ageing study"],
      citation:
        "Alanazi et al., Journal of Pharmacy and Pharmacology, 2025 (Durham University)",
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
          detail: "Verified · Age 61",
        },
        {
          headline: "Clarity, energy and better sleep",
          quote:
            "I noticed a clarity and energy and have benefited from that. My sleep wasn't great after I retired, but now I seem to be sleeping well.",
          name: "Deborough L.",
          detail: "Verified · Age 62",
        },
        {
          headline: "Sharper recall, clearer words",
          quote:
            "My short-term memory is better, I feel more eloquent, and I am able to stay focused for longer periods of time.",
          name: "Millie H.",
          detail: "Verified · Flow + Clear",
        },
      ],
    },
    {
      kind: "reason",
      n: 5,
      tag: "THE 2PM SLUMP",
      headline: "What Causes the Afternoon Energy Slump?",
      body: "Most energy fixes are just caffeine, and caffeine always ends the same way. The components in CONKA's shots have been shown to deliver 18.1% faster mental processing speed than caffeine, and CONKA is completely caffeine-free.",
      citation: "DOI: 10.1186/1550-2783-12-S1-P41",
      // Day-energy curve: afternoon slump without, steady with CONKA
      asset: { kind: "dayEnergyCurve" },
    },
    {
      kind: "reason",
      n: 6,
      tag: "REAL PROOF",
      headline: "Which Brain Supplements Are Actually Proven to Work?",
      body: "Proof matters. Most energy and focus supplements are hiding a simple trick: caffeine. It works briefly, then comes the crash, the jitters, the dependency. By the original definition of the word nootropic, a substance with side effects like that isn't even a true nootropic, it's just a stimulant. The only real way to know if a supplement works is randomised controlled trial evidence. Not a testimonial, not a before-and-after photo, a trial. CONKA has done it over 20 times, and if that's still not enough, we built something most brands never will: a way to measure it yourself.",
      asset: { kind: "scoreByGroup" },
    },
  ],
  bridge: {
    headline: "Protect your sharpest asset. Start today.",
    cta: "Try Conka Risk-Free for 100 Days →",
  },
  product: {
    headline: "Try Conka Risk-Free for 100 Days",
    subline: "Two daily shots. Zero caffeine. Track the difference in the app.",
    productHeroId: "03",
    whoItsFor: [
      "You've noticed words on the tip of your tongue and the odd \"why did I walk in here\" moment, and you want to stay sharp for the years ahead. Two daily shots support memory, recall and everyday clarity.",
      "You want something simple and natural you can actually stick to, with proof. Two shots a day plus a 2-minute brain test that tracks your scores over time, so you can see it holding.",
    ],
  },
  reviewsCarousel: true,
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
