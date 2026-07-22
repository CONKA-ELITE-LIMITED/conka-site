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
 * NOTE: the reason copy has been rewritten for CONKA off the Magic Mind
 * reference structure. Ingredient names/doses come from formulaContent, athlete
 * names from AthleteCredibilityCarousel, and result stats from productData. The
 * claims pass is owned by the user.
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
      "CONKA is the brain-performance system built with elite athletes and grounded in clinical research. Two caffeine-free daily shots that keep you sharp from morning to evening. Here's why high performers are making the switch:",
  },
  body: [
    {
      kind: "reason",
      n: 1,
      headline: "Unlock your peak mental state",
      body: "Transform your productivity with a brain-performance system built on clinical research. CONKA's two caffeine-free shots combine 16 clinically-dosed adaptogens, nootropics, and nutrients to deliver immediate, sustained focus. By targeting multiple cognitive pathways, the blend cuts through brain fog and sharpens mental clarity, so you perform at your absolute best.",
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
      body: "Every batch of CONKA is Informed Sport certified, independently screened against 280+ banned substances for purity and potency, which is why professional athletes trust it. You get exactly what's on the label, free from hidden additives or fillers. Caffeine-free and low in calories, CONKA fits seamlessly into any routine while sharpening cognitive function.",
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
      body: "Build real emotional resilience with CONKA Flow's adaptogenic complex. Ashwagandha and Rhodiola rosea work synergistically to regulate cortisol and support neurotransmitter balance. In one clinical study, participants taking Ashwagandha saw stress scores fall by more than half and serum cortisol drop significantly. You respond to pressure instead of reacting to it.",
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
      body: "Unlike caffeine, CONKA's benefits build over time. On day one you feel sharper focus and steady energy with no crash. By week two, adaptogens like Ashwagandha reach full strength and stress rolls off faster. By day 30 your baseline sits measurably higher. Across 150+ tested users and more than 5,000 cognitive tests, the average improvement was nearly 29%, and you can track your own in the CONKA app.",
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
      body: "CONKA's ingredients are rich in antioxidants, vitamins, and minerals that support whole-body wellness. Turmeric and Bilberry in Flow, plus Glutathione, Vitamin C, and Alpha Lipoic Acid in Clear, help the body fight oxidative stress and support immune function. With CONKA you sharpen your mind and fortify your body every day.",
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
      body: "Break free from the caffeine cycle. CONKA is completely caffeine-free, and Flow's cortisol-regulating Ashwagandha supports your natural sleep-wake rhythm. In a peer-reviewed study, participants taking Ashwagandha reported meaningfully better sleep quality. Deeper, more restorative rest, with no caffeine dependency or morning brain fog.",
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
      body: "Whether you complement or replace your coffee, CONKA removes the need for expensive afternoon pick-me-ups. Flow gives you sustained, calm focus through the morning, and Clear cuts the afternoon fog, all caffeine-free. On subscription it works out cheaper per day than the coffee it tends to replace.",
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
      headline: "It's trusted by the world's top performers",
      body: "Join the Olympic medallists and world champions who rely on CONKA when it matters most. Olympic silver medallist Dan Norton, world champion boxers Chris Billam-Smith and Adam Azim, and England international Fraser Dingwall use CONKA to sharpen focus and find the small margins. It's Informed Sport certified, so they can trust every batch.",
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
      headline: "Over 150,000 shots delivered, and proven in pro sport",
      body: "CONKA isn't hype. We've delivered over 150,000 shots to customers and elite athletes, and in the first professional-sport trial, CONKA improved brain performance by 16% compared to placebo. The formula is built on Durham University research and peer-reviewed studies behind every ingredient. Real results you can measure and track in the app.",
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
      headline: "It's backed by a 100-day money-back guarantee",
      body: "CONKA is the product of years of research with universities and elite sport. We're so confident it will work for you that every order is backed by a 100-day money-back guarantee. Try it for yourself, completely risk-free.",
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
