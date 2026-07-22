import type { ListicleConfig } from "./listicle-types";

/**
 * General, non-persona listicle (/go/why-conka) on the simple (Magic Mind)
 * template. The broad-net creative for cold prospecting traffic: a ten-reason
 * editorial article, each reason a lifestyle photo + heading + body, with a
 * buy box after reason 5 and the product grid at the end.
 *
 * To make another simple listicle: copy this file, change the slug + persona,
 * swap the copy and photos, and register it in index.ts. Keep layout: "simple".
 *
 * NOTE: the reason copy is the Magic Mind reference text, in place as a
 * first-pass placeholder. Swap for CONKA copy before launch. The claims pass is
 * owned by the user.
 */
export const generalListicle: ListicleConfig = {
  slug: "why-conka",
  persona: "general",
  format: "listicle",
  template: "mm",
  title: "10 Reasons Why This Breakthrough Brain-Booster will Dominate 2026",
  hero: {
    // Placeholder byline. Real author name + headshot are a content decision.
    author: { name: "The CONKA Team", updated: "July 2026" },
    headline:
      "10 Reasons Why This Breakthrough Brain-Booster will Dominate 2026",
    subcopy:
      "Magic Mind has revolutionized mental performance enhancement by creating the most effective nootropic elixir available today. Here's why industry leaders and high performers are making the switch:",
  },
  body: [
    {
      kind: "reason",
      n: 1,
      headline: "Unlock your peak mental state",
      body: "Transform your productivity with the most advanced brain-optimization formula ever developed. Magic Mind's precisely calibrated 2-oz shot combines 12 powerful nootropics, adaptogens, and essential nutrients to deliver immediate, sustained focus. By targeting multiple cognitive pathways, this innovative blend eliminates brain fog and enhances mental clarity, allowing you to perform at your absolute best.",
      asset: {
        kind: "image",
        src: "/lifestyle/ConkaAtWorkDesk.jpg",
        alt: "A person focused at their work desk with a CONKA shot",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 2,
      headline: "Science-backed safety",
      body: "Every ingredient in Magic Mind undergoes rigorous third-party testing for purity, potency, and safety. Each production run is independently verified to ensure you're getting exactly what's on the label—free from hidden additives, fillers, or unwanted surprises. Low in calories, Magic Mind integrates seamlessly into any lifestyle while optimizing cognitive function.",
      asset: {
        kind: "image",
        src: "/lifestyle/flow/FlowBoxOpen.jpg",
        alt: "An open CONKA box showing the shots and label",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 3,
      headline: "Master your stress response",
      body: "Experience newfound emotional resilience with our advanced adaptogenic complex. Premium organic Ashwagandha and Rhodiola Rosea work synergistically to regulate cortisol levels while supporting optimal neurotransmitter balance. The result? Enhanced stress adaptation and improved emotional regulation when you need it most.",
      asset: {
        kind: "image",
        src: "/lifestyle/ConkaAppYoga.jpg",
        alt: "A person doing calm yoga with the CONKA app",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 4,
      headline: "Results IMPROVE with time (not diminish)",
      body: "Unlike traditional stimulants, Magic Mind's benefits amplify over time. Our proprietary blend of Bacopa Monnieri and Lion's Mane Mushroom supports neuroplasticity and long-term cognitive enhancement. Regular use strengthens memory, sharpens focus, and builds lasting stress resilience – creating compounding improvements in your mental performance.",
      asset: {
        kind: "image",
        src: "/lifestyle/CreationOfConka.jpg",
        alt: "CONKA being developed and researched in the lab",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 5,
      headline: "It's packed with superfoods for total body health",
      body: "Magic Mind's carefully selected ingredients are rich in antioxidants, vitamins, and minerals that promote overall wellness, reduce inflammation, and boost immune function. With Magic Mind, you're sharpening your mind and fortifying your body, ensuring you stay healthy and vibrant every day.",
      asset: {
        kind: "image",
        src: "/lifestyle/flow/FlowLeaf.jpg",
        alt: "A CONKA shot beside fresh natural ingredients",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "buyBox",
      headline: "Start with the full system",
      subline:
        "Flow for the morning, Clear for the afternoon. Or pick one to start.",
    },
    {
      kind: "reason",
      n: 6,
      headline: "You'll sleep better!",
      body: "Break free from the caffeine cycle. Magic Mind's balanced formulation, featuring cortisol-regulating Ashwagandha, promotes natural sleep-wake rhythms. Experience deeper, more restorative sleep and wake up refreshed – no more morning brain fog or caffeine dependency.",
      asset: {
        kind: "image",
        src: "/lifestyle/clear/ClearClose.jpg",
        alt: "A CONKA Clear shot in soft, calm light",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 7,
      headline: "Your bank account will thank you",
      body: "Whether you choose to complement or replace your morning coffee, Magic Mind eliminates the need for expensive afternoon pick-me-ups. One shot provides sustained, calm focus throughout your day. Plus, take advantage of our limited-time offer to access premium cognitive enhancement at an unmatched value.",
      asset: {
        kind: "image",
        src: "/lifestyle/flow/FlowDrink.jpg",
        alt: "A CONKA shot on the table in place of a coffee",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 8,
      headline: "It's trusted by the world's top-performers",
      body: "Join the ranks of industry titans like Biz Stone, Justin Kan, and Nathan Florence who rely on Magic Mind to maintain their competitive edge. These visionaries choose Magic Mind as their daily cognitive enhancement solution for peak mental performance.",
      asset: {
        kind: "image",
        src: "/lifestyle/ConkaJeansHold.jpg",
        alt: "A person holding a CONKA shot",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 9,
      headline: "Over 10,000,000 Bottles Shipped",
      body: "Magic Mind has earned its position as the Mindful Beverage of the Year, outperforming established brands like Wonder Juice and Chobani Creamer. With over 10 million bottles shipped, we've helped countless individuals transform their productivity, focus, and overall well-being.",
      asset: {
        kind: "image",
        src: "/lifestyle/clear/ClearBag.jpg",
        alt: "A bag packed with CONKA shots",
        aspect: "4/3",
        fit: "cover",
      },
    },
    {
      kind: "reason",
      n: 10,
      headline: "It comes with a 100% money back guarantee",
      body: "Drawing on a decade of research and development, Magic Mind represents the culmination of our mission to create the world's most effective holistic cognitive enhancement solution. We're so confident in Magic Mind's transformative potential that we offer a 100% money-back guarantee. Experience the difference yourself, completely risk-free.",
      asset: {
        kind: "image",
        src: "/lifestyle/flow/FlowShadow.jpg",
        alt: "A CONKA Flow shot in soft studio light",
        aspect: "4/3",
        fit: "cover",
      },
    },
  ],
  logoMarquee: true,
  trustCarousel: true,
  athleteTestimonials: true,
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
