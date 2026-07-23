import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle: ADHD.
 *
 * Restructured 2026-07-23 (conversion pass, SCRUM-listicle-rework) into a true
 * numbered "X reasons" listicle: a counted hero and 7 tight numbered reasons,
 * one idea each. The interactive symptom explainer is slimmed to 4 core
 * symptoms as reason 1; the full 10-symptom breakdown, the per-ingredient
 * mechanisms and the citations move to the parallel /blog post (SCRUM-1175).
 * Only one stats band and one review strip sit between reasons so the page
 * reads as a scannable list. Template stays "im8" (the only one that renders
 * the symptom explainer + data-viz assets). Claims pass is owned by the user.
 *
 * TODO(FAQ): Humphrey's bespoke ADHD FAQ copy was not delivered (ran out of
 * credits). Until it lands, the persona reuses existing canonical faqIds.
 */
export const adhdListicle: ListicleConfig = {
  slug: "adhd-listicle",
  persona: "adhd",
  format: "listicle",
  template: "im8",
  title: "7 Reasons an ADHD Brain Runs Better on CONKA",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. Trusted by 1,000+ ADHD brains, tested through our app.",
    },
    headline: "7 Reasons an ADHD Brain Runs Better on CONKA",
    subcopy:
      "It isn't that you're not trying. An ADHD brain runs low on the exact chemicals that start tasks and hold focus. CONKA is built around that, not another 'just try harder': two caffeine-free shots, Flow to get going and Clear for the afternoon, with an app to prove it's working.",
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
  pressMarquee: true,
  athleteTestimonials: true,
  body: [
    {
      // Reason 1: the interactive explorer, slimmed to 4 core symptoms.
      // Full 10-symptom breakdown + per-ingredient mechanisms -> /blog.
      kind: "symptomExplainer",
      n: 1,
      headline: "It's Built for How an ADHD Brain Actually Works",
      intro:
        "An ADHD brain runs low on signal from two messengers, dopamine and norepinephrine, in the part of the brain that handles focus and self-control. The chemicals haven't disappeared, it's more like a radio signal that keeps cutting in and out. That's why the everyday things below take real effort other brains spend without noticing, and where CONKA's ingredients genuinely fit in.",
      disclaimer:
        "CONKA is a food supplement, not a treatment for ADHD. This explains general research, not personal medical advice.",
      symptoms: [
        {
          icon: "🪫",
          label: "Struggling to start tasks",
          primary: true,
          brain:
            "There's a kind of 'starter motor' in the brain (the locus coeruleus) that runs on norepinephrine and gets you from 'I should do this' to actually doing it. When it's underpowered, you can genuinely want to start something and still not move.",
          brainCitation: "Aston-Jones et al., Biological Psychiatry, 1999",
          ingredients: [
            {
              icon: "🧠",
              name: "Alpha GPC",
              formula: "Clear",
              detail:
                "Produced faster processing speed than caffeine in a clinical comparison, with less jitteriness, a cleaner nudge to that starter motor.",
              citation: "DOI: 10.1186/1550-2783-12-S1-P41",
            },
            {
              icon: "🍊",
              name: "Vitamin C",
              formula: "Clear",
              detail:
                "The cofactor for the enzyme that converts dopamine into norepinephrine, the exact step that turns 'I should' into 'I am.'",
            },
          ],
        },
        {
          icon: "⏳",
          label: "Losing track of objects and time",
          primary: true,
          brain:
            "The same circuit that lets you hold a thought in your head, 'where did I just put my keys', is the one running low on fuel, so information doesn't stick the way it should.",
          brainCitation: "Arnsten & Li, Biological Psychiatry, 2005",
          ingredients: [
            {
              icon: "🧠",
              name: "Alpha GPC",
              formula: "Clear",
              detail:
                "Supplies choline, the raw material the brain uses to build acetylcholine, the messenger tied to laying down and holding onto memories.",
            },
            {
              icon: "🌻",
              name: "Sunflower Lecithin",
              formula: "Clear",
              detail:
                "A natural source of phosphatidylcholine, a core building block of the neuron membranes signals travel across.",
            },
            {
              icon: "🔴",
              name: "Vitamin B12",
              formula: "Clear",
              detail:
                "As methylcobalamin, a cofactor needed to produce acetylcholine alongside dopamine, norepinephrine, serotonin and GABA.",
            },
          ],
        },
        {
          icon: "🌫️",
          label: "Brain fog that won't lift, mentally underwater",
          primary: true,
          brain:
            "This foggy, underwater feeling is different from an ordinary attention lapse, it's linked to low-grade inflammation, oxidative stress and dips in cellular energy quietly slowing down how efficiently brain cells fire, all day long.",
          brainCitation: "General neuroinflammation and oxidative-stress mechanism",
          ingredients: [
            {
              icon: "🟠",
              name: "Turmeric + Black Pepper",
              formula: "Flow",
              detail:
                "Turmeric (curcumin) improved working memory and cut fatigue in a placebo-controlled trial. Black Pepper's piperine lets the body actually absorb the curcumin.",
              citation: "PMC7352411",
            },
            {
              icon: "⚡",
              name: "ALCAR",
              formula: "Clear",
              detail:
                "Ferries fatty acids into mitochondria for energy and supports acetylcholine synthesis. In a randomised trial, L-carnitine significantly reduced physical and mental fatigue versus placebo.",
              citation: "PMID: 18065594",
            },
          ],
        },
        {
          icon: "🌀",
          label: "Restless, can't sit still",
          primary: true,
          brain:
            "Your brain's 'brake pedal' chemicals (dopamine and norepinephrine) aren't firing strongly enough at the front of the brain, the part that says 'stay seated, wait your turn'. So your body reaches for movement instead, because motion becomes a stand-in source of stimulation.",
          brainCitation: "Arnsten & Li, Biological Psychiatry, 2005",
          ingredients: [
            {
              icon: "🌿",
              name: "Ashwagandha",
              formula: "Flow",
              detail:
                "Lowers the stress hormone cortisol, taking fuel away from the restlessness rather than acting on the focus circuit directly.",
              citation: "PMID: 32800311",
            },
          ],
        },
      ],
    },
    {
      kind: "statsBand",
      eyebrow: "ADHD BY THE NUMBERS",
      stats: [
        { value: "26%", label: "of people report ADHD traits" },
        { value: "£10k", label: "lower yearly earnings with untreated ADHD" },
        { value: "47%", label: "of likely-ADHD UK adults are undiagnosed" },
      ],
      footnote: "Sources: Priory Group; ADHD Evidence; King's College London.",
    },
    {
      kind: "reason",
      n: 2,
      headline: "It Helps You Start, Not Just Focus",
      body: "Most focus products help you concentrate once you've started. With ADHD the hard part is starting at all. CONKA Clear feeds the norepinephrine that gets you from 'I should' to 'I'm doing it', without caffeine.",
      // 9:16 source centre-cropped to 3:4, the animated Clear shot
      asset: { kind: "video", src: "/videos/clear/ClearLiquid.mp4", aspect: "3/4" },
    },
    {
      kind: "reason",
      n: 3,
      headline: "No Caffeine, So No Crash and No 3pm Cliff",
      body: "Coffee buys focus on credit, then the afternoon crash collects. CONKA is completely caffeine-free, so the energy holds steady from your first task to your last, no spike, no cliff.",
      asset: { kind: "dayEnergyCurve" },
    },
    {
      kind: "reason",
      n: 4,
      headline: "You Can Watch It Working, in Real Numbers",
      body: "With ADHD, 'does this actually work?' is a fair question. The CONKA app is built around an FDA-cleared, CE-marked cognitive test from Cambridge University. It takes 75 seconds, so when your focus score moves, it's measuring something real.",
      asset: { kind: "measureTile" },
    },
    {
      kind: "reason",
      n: 5,
      headline: "It's Built for the Nights You Doom-Scrolled Instead of Sleeping",
      body: "Racing thoughts at midnight, one more scroll turning into forty minutes, then a morning already behind. CONKA won't erase a bad night, but the stack below gives your brain a real head start on the next one.",
      asset: {
        kind: "ingredientGrid",
        eyebrow: "Built to absorb bad nights",
        items: [
          {
            icon: "🏔",
            name: "Rhodiola Rosea",
            benefit:
              "Shown in night-shift physicians to cut fatigue and sharpen mental performance.",
            citation: "PMID: 11081987",
          },
          {
            icon: "🛡",
            name: "Glutathione",
            benefit:
              "Clinically shown to speed clearance of acetaldehyde, the toxin behind hangovers.",
            citation: "PMC11479010",
          },
          {
            icon: "🌿",
            name: "Ashwagandha",
            benefit: "Helps lower cortisol and the daily stress load.",
            citation: "PMID: 32800311",
          },
          {
            icon: "♻️",
            name: "Alpha Lipoic Acid",
            benefit: "Clears the oxidative stress of short sleep.",
          },
        ],
        footer: "All in two 30ml shots, morning and night.",
      },
    },
    {
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
      n: 6,
      headline: "Backed by Trials, Not Testimonials",
      body: "Most focus supplements are hiding one trick: caffeine. CONKA's actives have been through randomised controlled trials over 20 times, and if that isn't enough, we built a way for you to measure it yourself.",
      chips: ["+14.86% sharper thinking vs placebo", "80% improved cognitive scores"],
      citation:
        "6-week randomised double-blind placebo-controlled trial, 29 professional rugby players.",
      asset: { kind: "scoreByGroup" },
    },
    {
      kind: "reason",
      n: 7,
      headline: "100 Days to Feel It, or Your Money Back",
      body: "Try CONKA for a full 100 days. If your focus, calm and follow-through haven't changed, you get every penny back. Developed from brain research at Newcastle, Informed Sport certified, made in the UK.",
      asset: { kind: "researchBacked" },
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
  // TODO(FAQ): swap in Humphrey's bespoke ADHD FAQ copy once delivered.
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
