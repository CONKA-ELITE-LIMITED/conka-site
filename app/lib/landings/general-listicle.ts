import type { ListicleConfig, ListicleReview } from "./listicle-types";
import type { Testimonial } from "@/app/components/testimonials/types";
import { CURATED_TESTIMONIALS } from "@/app/lib/customerTestimonials";

/** Map a curated DTC testimonial onto the listicle review card shape */
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
 * General, non-persona listicle (/go/why-conka).
 *
 * The broad-net creative for cold prospecting traffic where the persona is
 * not yet known. Structured on the Magic Mind "10 Reasons..." reference:
 * a numbered list of ten reasons cycling through efficacy, trust, mechanism,
 * cost, authority and risk reversal, each anchored to a named CONKA active or
 * a real trial figure. Real substance is pulled from brain-ageing-listicle
 * (the same actives, citations and trial numbers).
 *
 * Buy box uses the home ProductGrid (product.component: "grid") and repeats
 * mid-list via a `buyBox` block after reason 5, mirroring the reference's two
 * placements. The end grid sits at #product, the anchor for every CTA.
 *
 * First pass: structure and copy. Hero asset and the exact look are iterated
 * with the user (SCRUM-1174). Claims pass is owned by the user.
 */
export const generalListicle: ListicleConfig = {
  slug: "why-conka",
  persona: "general",
  format: "listicle",
  layout: "simple",
  title: "10 Reasons Why This Breakthrough Brain-Booster will Dominate 2026",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. 1,000+ brains tested through our app.",
    },
    headline: "10 Reasons Why This Breakthrough Brain-Booster will Dominate 2026",
    subcopy:
      "Magic Mind has revolutionized mental performance enhancement by creating the most effective nootropic elixir available today. Here's why industry leaders and high performers are making the switch:",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Try CONKA Risk-Free for 100 Days →",
    trustPills: [
      { label: "Zero caffeine", icon: "no-caffeine" },
      { label: "Informed Sport Certified", icon: "informed-sport" },
      { label: "100-day guarantee", icon: "guarantee" },
    ],
    asset: {
      kind: "image",
      src: "/formulas/both/BoxIngredientHero.png",
      alt: "CONKA Flow and Clear shots with their active ingredients",
      aspect: "2528/1696",
    },
  },
  ticker: [
    "ZERO CAFFEINE",
    "INFORMED SPORT CERTIFIED",
    "MADE IN THE UK",
    "100-DAY GUARANTEE",
    "UNIVERSITY RESEARCH",
  ],
  logoMarquee: true,
  pressMarquee: true,
  athleteTestimonials: true,
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "PEAK STATE",
      headline: "Unlock your peak mental state",
      body: "Transform your productivity with the most advanced brain-optimization formula ever developed. Magic Mind's precisely calibrated 2-oz shot combines 12 powerful nootropics, adaptogens, and essential nutrients to deliver immediate, sustained focus. By targeting multiple cognitive pathways, this innovative blend eliminates brain fog and enhances mental clarity, allowing you to perform at your absolute best.",
      chips: ["16 active ingredients", "Two 30ml shots a day"],
      asset: {
        kind: "image",
        src: "/formulas/both/BoxIngredientHero.png",
        alt: "CONKA Flow and Clear shots stood beside their ingredients",
        aspect: "4/3",
        fit: "contain",
      },
    },
    {
      kind: "reason",
      n: 2,
      tag: "TESTED & CERTIFIED",
      headline: "Science-backed safety",
      body: "Every ingredient in Magic Mind undergoes rigorous third-party testing for purity, potency, and safety. Each production run is independently verified to ensure you're getting exactly what's on the label—free from hidden additives, fillers, or unwanted surprises. Low in calories, Magic Mind integrates seamlessly into any lifestyle while optimizing cognitive function.",
      asset: {
        kind: "statPanel",
        tone: "light",
        eyebrow: "EVERY SINGLE BATCH",
        stats: [
          { label: "Third-party tested", to: "Every batch" },
          { label: "Informed Sport", to: "Certified" },
          { label: "Made in", to: "The UK" },
        ],
      },
    },
    {
      kind: "reason",
      n: 3,
      tag: "STRESS & CALM",
      headline: "Master your stress response",
      body: "Experience newfound emotional resilience with our advanced adaptogenic complex. Premium organic Ashwagandha and Rhodiola Rosea work synergistically to regulate cortisol levels while supporting optimal neurotransmitter balance. The result? Enhanced stress adaptation and improved emotional regulation when you need it most.",
      asset: {
        kind: "ingredientGrid",
        eyebrow: "IN EVERY CLEAR SHOT",
        items: [
          {
            icon: "🔥",
            name: "Ashwagandha",
            benefit: "Eases the cortisol load that keeps you wired and tired.",
            citation: "PMID: 30854916",
          },
          {
            icon: "⚡",
            name: "Rhodiola Rosea",
            benefit: "Makes sustained mental effort feel lighter, not harder.",
            citation: "PMID: 23443221",
          },
          {
            icon: "🍋",
            name: "Lemon Balm",
            benefit: "Clinically shown to support calm and steady mood.",
            citation: "PMID: 33465795",
          },
          {
            icon: "🧪",
            name: "NAC + Glutathione",
            benefit: "The precursor pairing behind your brain's own antioxidant defence.",
          },
        ],
        footer: "Named doses, no proprietary blends.",
      },
    },
    {
      kind: "reason",
      n: 4,
      tag: "COMPOUNDS OVER TIME",
      headline: "Results IMPROVE with time (not diminish)",
      body: "Unlike traditional stimulants, Magic Mind's benefits amplify over time. Our proprietary blend of Bacopa Monnieri and Lion's Mane Mushroom supports neuroplasticity and long-term cognitive enhancement. Regular use strengthens memory, sharpens focus, and builds lasting stress resilience – creating compounding improvements in your mental performance.",
      asset: { kind: "researchBacked" },
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
      n: 5,
      tag: "NO CRASH",
      headline: "It's packed with superfoods for total body health",
      body: "Magic Mind's carefully selected ingredients are rich in antioxidants, vitamins, and minerals that promote overall wellness, reduce inflammation, and boost immune function. With Magic Mind, you're sharpening your mind and fortifying your body, ensuring you stay healthy and vibrant every day.",
      asset: { kind: "dayEnergyCurve" },
    },
    {
      kind: "buyBox",
      headline: "Start with the full system",
      subline: "Flow for the morning, Clear for the afternoon. Or pick one to start.",
    },
    {
      kind: "reason",
      n: 6,
      tag: "MEASURE IT",
      headline: "You'll sleep better!",
      body: "Break free from the caffeine cycle. Magic Mind's balanced formulation, featuring cortisol-regulating Ashwagandha, promotes natural sleep-wake rhythms. Experience deeper, more restorative sleep and wake up refreshed – no more morning brain fog or caffeine dependency.",
      asset: { kind: "measureTile" },
    },
    {
      kind: "reason",
      n: 7,
      tag: "THE MATH",
      headline: "Your bank account will thank you",
      body: "Whether you choose to complement or replace your morning coffee, Magic Mind eliminates the need for expensive afternoon pick-me-ups. One shot provides sustained, calm focus throughout your day. Plus, take advantage of our limited-time offer to access premium cognitive enhancement at an unmatched value.",
      asset: { kind: "crashChart" },
    },
    {
      kind: "reason",
      n: 8,
      tag: "TRUSTED",
      headline: "It's trusted by the world's top-performers",
      body: "Join the ranks of industry titans like Biz Stone, Justin Kan, and Nathan Florence who rely on Magic Mind to maintain their competitive edge. These visionaries choose Magic Mind as their daily cognitive enhancement solution for peak mental performance.",
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
      kind: "reviewStrip",
      eyebrow: "What Customers Say",
      ratingSummary: "Rated 4.7 / 5 · 622+ reviews",
      reviews: [
        toReview(byName("Jack G.")),
        toReview(byName("Phil B.")),
        toReview(byName("Alex L.")),
      ],
    },
    {
      kind: "reason",
      n: 9,
      tag: "REAL PROOF",
      headline: "Over 10,000,000 Bottles Shipped",
      body: "Magic Mind has earned its position as the Mindful Beverage of the Year, outperforming established brands like Wonder Juice and Chobani Creamer. With over 10 million bottles shipped, we've helped countless individuals transform their productivity, focus, and overall well-being.",
      asset: { kind: "scoreByGroup" },
    },
    {
      kind: "reason",
      n: 10,
      tag: "RISK-FREE",
      headline: "It comes with a 100% money back guarantee",
      body: "Drawing on a decade of research and development, Magic Mind represents the culmination of our mission to create the world's most effective holistic cognitive enhancement solution. We're so confident in Magic Mind's transformative potential that we offer a 100% money-back guarantee. Experience the difference yourself, completely risk-free.",
      asset: {
        kind: "statPanel",
        tone: "dark",
        eyebrow: "RISK-FREE FOR 100 DAYS",
        stats: [
          { label: "Try it for", to: "100 days" },
          { label: "Not sharper?", to: "Full refund" },
        ],
        footer: "Cancel your subscription anytime.",
      },
    },
  ],
  bridge: {
    headline: "Sharper mornings. Calmer afternoons. Start today.",
    cta: "Try CONKA Risk-Free for 100 Days →",
  },
  product: {
    headline: "Try CONKA Risk-Free for 100 Days",
    subline: "Two daily shots. Zero caffeine. Track the difference in the app.",
    productHeroId: "03",
    component: "grid",
  },
  trustCarousel: true,
  reviewsCarousel: true,
  // Canonical, non-persona FAQ ids (resolved in the renderer; unknown id fails
  // the build). Broad-audience set: what makes it different, caffeine, results
  // timeline, how to take it, guarantee, delivery.
  faqIds: ["different", "caffeine", "results", "how-to-take", "guarantee", "delivery"],
  stickyBar: {
    label: "10 reasons. One daily system.",
    cta: "Get started",
    sub: "100-day guarantee",
  },
};
