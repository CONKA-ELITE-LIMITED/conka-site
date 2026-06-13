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
      "Two small daily shots. Zero caffeine. Built for brains that won't start, won't settle and won't switch off.",
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
      src: "/formulas/both/BoxIngredientHero.png",
      alt: "CONKA Flow and Clear shots with their ingredients",
      // Native 2528x1696; frame matches so nothing crops
      aspect: "2528/1696",
    },
  },
  ticker: [
    "ZERO CAFFEINE",
    "INFORMED SPORT CERTIFIED",
    "MADE IN THE UK",
    "100-DAY GUARANTEE",
    "2-MINUTE BRAIN TEST",
  ],
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "GETTING STARTED",
      headline: "Finally Start the Thing You've Been Avoiding",
      body: "You've known about it since Monday. It's not even hard. But every time you sit down, your brain slides off it, so you make another coffee and lose the morning. That stuck feeling isn't laziness. An ADHD brain runs low on the focus chemical that gets you moving.\n\nConka 1, your caffeine-free morning shot, supports that exact spark. Most people feel it within minutes, and the task that felt like a locked door is suddenly open.",
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
      body: "Your leg won't stop. Your eyes drift to the window, the door, your phone. It's not that you don't want to focus. Your brain just can't hold itself steady, because its focus chemistry runs uneven. Coffee only winds you up tighter.\n\nConka gives you focus and calm at the same time, with no caffeine to make you jittery. The fidget settles, and you look up to find you've worked for half an hour straight.",
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
      body: "Mid-sentence in a meeting, and the word is just gone. You talk around it and lose your point. That blank, lost feeling is brain fog, and it shows up when your brain's focus fuel is running low.\n\nConka supports clear, sharp thinking, so finding your words feels easy instead of like a fight. Names, words, the point you were making. They're there when you reach for them.",
      asset: {
        kind: "image",
        src: "/listicles/FaceDrawings.jpg",
        alt: "Classical sketch studies of faces in profile",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 4,
      tag: "THE 2PM CRASH",
      headline: "Kill the 2PM Crash (Without More Coffee)",
      body: "You run on coffee because it's the only thing that gets your brain going. Then 2pm hits with the slump, the jitters, and the fog. That crash is baked into caffeine, and an ADHD brain feels the swing harder.\n\nConka has zero caffeine, so there's nothing to spike you up and nothing to crash from. Steady focus all day, and Conka 2 at night helps you wind down instead of lying there wired.",
      // Fig. 01 coffee-vs-CONKA curves: pays off the caffeine crash story
      asset: { kind: "valueChart" },
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
      body: "ADHD isn't just distraction. It's ten thoughts at once and a low hum of stress that makes a simple to-do list feel scary. When your focus chemistry is all over the place, your brain struggles to filter any of it out.\n\nConka brings calm alongside focus, without knocking you out. It turns the volume down so you can finally hear yourself think.",
      asset: {
        kind: "image",
        src: "/videos/misc/BrainScan.gif",
        alt: "Rotating brain scan animation",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 6,
      tag: "CONSISTENCY",
      headline: "Stick With It, and Actually See It Working",
      body: "You've got a drawer full of half-used supplements and apps you opened twice. Anything complicated dies by week two. And \"trust me, it's working\" means nothing when you can't feel a difference.\n\nConka is just two small shots, morning and night, plus a 2-minute brain test in the app that scores your focus. You watch it climb over time, like a fitness tracker for your brain.",
      asset: {
        kind: "image",
        src: "/formulas/both/BothHero.jpg",
        alt: "CONKA Flow and Clear shot bottles",
        aspect: "4/3",
        fit: "cover",
      },
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
  },
  trustCarousel: true,
  reviewsCarousel: true,
  faq: [
    {
      q: "Does CONKA contain caffeine or other stimulants?",
      a: "No. CONKA is completely caffeine-free, so there is nothing to spike you up and nothing to crash from.",
    },
    {
      q: "Can I take CONKA alongside my ADHD medication?",
      a: "CONKA is a food supplement, not a medicine. If you take prescription medication, check with your GP or prescriber before adding anything new to your routine.",
    },
    {
      q: "Is CONKA a replacement for ADHD medication?",
      a: "No. CONKA supports everyday focus and calm. It is not a medicine and does not diagnose or treat ADHD.",
    },
    {
      q: "How quickly will I feel something?",
      a: "Most people notice the morning shot within minutes. The 2-minute brain test in the app lets you track the difference over weeks instead of guessing.",
    },
    {
      q: "I'm terrible at sticking to routines. Is this complicated?",
      a: "It's two small shots, one in the morning and one at night. No powders, no mixing, no pill organisers.",
    },
    {
      q: "What if it doesn't work for me?",
      a: "You have 100 days to try it risk-free. If you don't feel a difference, you get your money back.",
    },
  ],
  stickyBar: {
    label: "Stop fighting your brain.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
