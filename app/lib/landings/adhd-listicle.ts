import type { ListicleConfig } from "./listicle-types";
import { CURATED_TESTIMONIALS } from "@/app/lib/customerTestimonials";
import type { Testimonial } from "@/app/components/testimonials/types";
import type { ListicleReview } from "./listicle-types";

function toReview(t: Testimonial, limit = 220): ListicleReview {
  return {
    headline: t.headline,
    quote:
      t.body.length > limit ? `${t.body.slice(0, limit).trimEnd()}...` : t.body,
    name: t.name,
    detail: t.productLabel ? `Verified · ${t.productLabel}` : "Verified customer",
  };
}

const byName = (name: string) =>
  CURATED_TESTIMONIALS.find((t) => t.name === name)!;

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
    headline:
      "6 Reasons People With ADHD Say CONKA Finally Gets Them Started, Focused and Calm",
    subcopy:
      "Two small daily shots. Zero caffeine. Built for brains that won't start, won't settle and won't switch off.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Try Conka Risk-Free for 60 Days →",
    trustPills: ["Zero caffeine", "Informed Sport Certified", "60-day guarantee"],
    asset: {
      kind: "image",
      src: "/formulas/both/BoxIngredientHero.png",
      alt: "CONKA Flow and Clear shots with their ingredients",
      aspect: "1/1",
    },
  },
  ticker: [
    "ZERO CAFFEINE",
    "INFORMED SPORT CERTIFIED",
    "MADE IN THE UK",
    "60-DAY GUARANTEE",
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
        kind: "placeholder",
        aspect: "4/3",
        note: "Lifestyle: sitting down and starting work",
      },
    },
    {
      kind: "reason",
      n: 2,
      tag: "RESTLESSNESS",
      headline: "Sit Still Long Enough to Actually Get Things Done",
      body: "Your leg won't stop. Your eyes drift to the window, the door, your phone. It's not that you don't want to focus. Your brain just can't hold itself steady, because its focus chemistry runs uneven. Coffee only winds you up tighter.\n\nConka gives you focus and calm at the same time, with no caffeine to make you jittery. The fidget settles, and you look up to find you've worked for half an hour straight.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Lifestyle: settled deep-work moment",
      },
    },
    {
      kind: "statsBand",
      eyebrow: "CLINICALLY PROVEN",
      stats: [
        { value: "+14.86%", label: "Sharper cognitive performance, proven against placebo" },
        { value: "80%", label: "Improved cognitive performance on CONKA" },
        { value: "+19.3%", label: "Sharper focus in professional athletes" },
        { value: "75%", label: "Improved cognitive function in under 3 weeks" },
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
        kind: "placeholder",
        aspect: "4/3",
        note: "Lifestyle: speaking up in a meeting",
      },
    },
    {
      kind: "reason",
      n: 4,
      tag: "THE 2PM CRASH",
      headline: "Kill the 2PM Crash (Without More Coffee)",
      body: "You run on coffee because it's the only thing that gets your brain going. Then 2pm hits with the slump, the jitters, and the fog. That crash is baked into caffeine, and an ADHD brain feels the swing harder.\n\nConka has zero caffeine, so there's nothing to spike you up and nothing to crash from. Steady focus all day, and Conka 2 at night helps you wind down instead of lying there wired.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Stat panel: caffeine spike-and-crash vs steady curve",
      },
    },
    {
      kind: "reviewStrip",
      reviews: [
        toReview(byName("Phil B.")),
        toReview(byName("Alex L.")),
        toReview(byName("Jack G.")),
      ],
    },
    {
      kind: "reason",
      n: 5,
      tag: "MENTAL NOISE",
      headline: "Quiet the Noise in Your Head",
      body: "ADHD isn't just distraction. It's ten thoughts at once and a low hum of stress that makes a simple to-do list feel scary. When your focus chemistry is all over the place, your brain struggles to filter any of it out.\n\nConka brings calm alongside focus, without knocking you out. It turns the volume down so you can finally hear yourself think.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Visual: noise fading to a single clear thread",
      },
    },
    {
      kind: "reason",
      n: 6,
      tag: "CONSISTENCY",
      headline: "Stick With It, and Actually See It Working",
      body: "You've got a drawer full of half-used supplements and apps you opened twice. Anything complicated dies by week two. And \"trust me, it's working\" means nothing when you can't feel a difference.\n\nConka is just two small shots, morning and night, plus a 2-minute brain test in the app that scores your focus. You watch it climb over time, like a fitness tracker for your brain.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "App screenshot: focus score climbing over weeks",
      },
    },
  ],
  bridge: {
    headline: "Stop fighting your brain. Start working with it.",
    cta: "Try Conka Risk-Free for 60 Days →",
  },
  product: {
    headline: "Try Conka Risk-Free for 60 Days",
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
      a: "You have 60 days to try it risk-free. If you don't feel a difference, you get your money back.",
    },
  ],
  stickyBar: {
    label: "Two shots a day. Zero caffeine.",
    cta: "Get started",
    sub: "60-day guarantee",
  },
};
