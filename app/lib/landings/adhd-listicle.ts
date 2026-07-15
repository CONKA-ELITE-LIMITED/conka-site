import type { ListicleConfig } from "./listicle-types";

/**
 * First persona listicle: ADHD. Reason copy supplied 2026-06-12; hero
 * headline/subcopy, FAQ and bridge drafted around it (review before
 * spend). Assets are placeholders until sourced per reason.
 */
export const adhdListicle: ListicleConfig = {
  slug: "adhd-listicle",
  persona: "adhd",
  format: "listicle",
  title: "6 Reasons ADHD Brains Love CONKA",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. Trusted by 1,000+ ADHD brains, tested through our app.",
    },
    headline:
      "6 Reasons People With ADHD Say CONKA Finally Gets Them Started, Focused and Calm",
    subcopy:
      "Two caffeine-free daily shots: Flow for morning focus, Clear for the afternoon dip. Built for the ADHD pattern of won't-start, won't-settle, won't-switch-off, with an app to measure the difference.",
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
      src: "/lifestyle/BlurGrab.jpg",
      alt: "A hand reaching for a CONKA shot on a bedside table beside a mug",
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
  athleteTestimonials: true,
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "GETTING STARTED",
      headline: "Finally Start the Thing You've Been Avoiding",
      body: "That stuck feeling isn't laziness. An ADHD brain runs low on the focus chemical that gets you moving, so tasks slide and the morning disappears. Flow, your caffeine-free morning shot, supports that exact spark, and most people feel it within minutes: the task that felt like a locked door opens.",
      asset: {
        kind: "image",
        src: "/videos/misc/Neurons.gif",
        alt: "Neurons firing animation",
        // Native 480x270; frame matches so nothing crops
        aspect: "16/9",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 2,
      tag: "RESTLESSNESS",
      headline: "Sit Still Long Enough to Actually Get Things Done",
      body: "The restlessness isn't a willpower problem, it's uneven focus chemistry, and coffee only winds it tighter. Conka gives you focus and calm at once with no caffeine, so the fidget settles and you look up to find you've worked half an hour straight.",
      // 9:16 source centre-cropped to 3:4, same as the quiz landing frame
      asset: { kind: "video", src: "/videos/flow/FlowLiquid.mp4", aspect: "3/4" },
    },
    {
      kind: "statsBand",
      eyebrow: "CLINICALLY PROVEN",
      stats: [
        { value: "+14.86%", label: "Sharper thinking vs placebo" },
        { value: "80%", label: "Improved cognitive scores" },
        { value: "+19.3%", label: "Sharper focus in pro athletes" },
        { value: "75%", label: "Improved in under 3 weeks" },
      ],
      footnote:
        "*From CONKA cognitive trials, including a 6-week randomised double-blind placebo-controlled trial with 29 professional rugby players.",
    },
    {
      kind: "reason",
      n: 3,
      tag: "WORD RECALL",
      headline: "Find Your Words Before Your Face Goes Red",
      body: "That blank, mid-sentence moment is brain fog, and it shows up when your focus fuel runs low. Conka supports clear, sharp thinking, so names, words and the point you were making are there when you reach for them.",
      // Dan Norton's quote maps directly to word recall / finding your words
      asset: {
        kind: "athleteQuote",
        name: "Dan Norton",
        role: "Rugby 7s · Olympic Silver Medallist",
        image: "/testimonials/athlete/DanNortonNB.jpg",
        quote:
          "I am finding myself being able to speak clearer and in conversations my words just flow better. I have more calmness.",
      },
    },
    {
      kind: "reason",
      n: 4,
      tag: "THE 2PM CRASH",
      headline: "Kill the 2PM Crash (Without More Coffee)",
      body: "The 2pm slump, jitters and fog are baked into caffeine, and an ADHD brain feels the swing harder. Conka has zero caffeine, so there's nothing to spike from and nothing to crash off: steady focus all day, and Clear in the evening winds you down instead of leaving you wired.",
      // Skip-the-2pm-crash curve + cost table: pays off the caffeine crash story
      asset: { kind: "crashChart" },
    },
    {
      // Hand-cropped excerpts (caffeine/crash theme), not the full bodies
      kind: "reviewStrip",
      eyebrow: "What Customers Say",
      ratingSummary: "Rated 4.7 / 5 · 622+ reviews",
      reviews: [
        {
          headline: "Performance without the burnout",
          quote:
            "My energy feels more consistent, and I can stay sharp later in the day without the downside.",
          name: "Aaron H.",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "No more jitters",
          quote:
            "In the first few days of taking Flow, I relied less on the jitters of caffeine to get me through a day.",
          name: "Ankita K.",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "Keeping up with both",
          quote:
            "What I didn't expect was being able to take something after work, lock back in for the hustle, and still sleep well.",
          name: "Sam J.",
          detail: "Verified · Flow + Clear",
        },
      ],
    },
    {
      kind: "reason",
      n: 5,
      tag: "MENTAL NOISE",
      headline: "Quiet the Noise in Your Head",
      body: "ADHD isn't just distraction, it's ten thoughts at once and a low hum of stress, because scattered focus chemistry struggles to filter any of it out. Conka brings calm alongside focus without knocking you out, turning the volume down so you can hear yourself think.",
      // Two-bar focus comparison: quieter mind reads as sharper focus
      asset: { kind: "focusBars" },
    },
    {
      kind: "reason",
      n: 6,
      tag: "CONSISTENCY",
      headline: "Stick With It, and Actually See It Working",
      body: "Anything complicated dies by week two, and being told it works means nothing when you can't feel a difference. Conka is two small shots, morning and night, plus a 2-minute brain test in the app that scores your focus so you watch it climb over time, like a fitness tracker for your brain.",
      asset: { kind: "measureTile" },
    },
  ],
  bridge: {
    headline: "Stop fighting your brain. Start working with it.",
    cta: "Try Conka Risk-Free for 100 Days →",
  },
  product: {
    headline: "Try Conka Risk-Free for 100 Days",
    subline: "Two daily shots. Zero caffeine. Track the difference in the app.",
    productHeroId: "03",
    whoItsFor: [
      "You've got an ADHD brain that won't start in the morning and won't switch off at night. Flow helps you get going without caffeine, and Clear helps you wind down so the day actually ends.",
      "You're done running on coffee and willpower. Two caffeine-free shots support steady focus and calm across the whole day, and the 2-minute app test lets you watch it working instead of guessing.",
    ],
  },
  reviewsCarousel: true,
  // Persona-curated canonical FAQ ids (resolved in the renderer). Order:
  // caffeine, medication, not-a-replacement, timeline, simplicity, guarantee.
  faqIds: [
    "caffeine",
    "adhd-medication",
    "adhd-replacement",
    "results",
    "how-to-take",
    "guarantee",
  ],
  stickyBar: {
    label: "Stop fighting your brain.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
