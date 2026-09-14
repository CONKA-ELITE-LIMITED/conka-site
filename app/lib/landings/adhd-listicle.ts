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
    // Soft educational preframe (SCRUM-1320). The "7 Reasons..." list promise
    // moves off the H1; it comes back as the reasons section header in
    // SCRUM-1321. `title` deliberately keeps it so the tab and the Meta
    // content_name stay comparable with earlier data.
    headline: "Discover the natural way to finally calm racing thoughts.",
    subcopy:
      "Coffee and willpower push at the problem from the outside. CONKA works from within, supporting the pathways an ADHD brain runs low on, so starting a task stops feeling like a fight.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    // One offer surface, outcome first. The old green "+1 week free" pill sat
    // directly above this and read as a second, competing offer.
    cta: "Save {percent}% on a calmer mind",
    asset: {
      kind: "image",
      src: "/testimonials/ugc/11.jpg",
      alt: "A CONKA customer working at a laptop in headphones, with the daily shots on the desk",
      // A real customer photograph, replacing a generated studio shot of a man
      // with his eyes closed and a bottle floating over his head. Closed eyes
      // read as sedated, which is the opposite of what this page promises.
      // It is also the only situation photograph in the UGC set: every other
      // still is a selfie or a posed hold, so it is the only one that shows
      // the moment this persona is being sold, actually starting work.
      //
      // Portrait source (810x1013) in the 1:1 hero frame all three personas
      // share. Offset rather than top-anchored: the square at "center top"
      // cuts his hands off the keyboard, and 35% down keeps his face, both
      // hands and both bottles in frame.
      aspect: "1/1",
      objectPosition: "center 35%",
    },
  },
  // Reintroduces the list promise at the point the list starts, now that
  // the hero H1 is a soft outcome line (SCRUM-1320/1321). Matches `title`.
  reasonsHeader: {
    eyebrow: "Brain health at the cellular level",
    headline: "7 Reasons an ADHD Brain Runs Better on CONKA",
  },
  // Post-reasons proof tier. Four moments, each doing a different job.
  proof: {
    logoBand: true,
    // No pressBand here: the "As Published On" marquee lives on the app-proof
    // reason (reason 4) for this page, so a second copy in the tier would be
    // redundant. brain-ageing and productivity still carry it in the tier.
    // Shared UGC set: the band needs volume to read as volume, and we
    // have no persona-tagged stills yet. Pass `items` once we do.
    ugc: {},
    // TODO: source a white-background cutout of a productivity/ADHD-relevant
    // figure and swap this out. Jack Willis is the site-wide default, not a
    // persona match. Any `*NB.jpg` in public/testimonials/athlete/ works.
    feature: {
      name: "Jack Willis",
      credentials: [
        "2025 Top 14 Player of the Season",
        "4\u00d7 Top 14 Champion, Champions Cup winner",
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
      // Reason 1: the interactive explorer, slimmed to 4 core symptoms.
      // Full 10-symptom breakdown + per-ingredient mechanisms -> /blog.
      kind: "symptomExplainer",
      n: 1,
      headline: "It's Built for How an ADHD Brain Actually Works",
      intro:
        "An ADHD brain runs low on signal from two messengers, dopamine and norepinephrine, in the part of the brain that handles focus and self-control. The chemicals haven't disappeared, it's more like a radio signal that keeps cutting in and out. That's why the everyday things below take real effort other brains spend without noticing, and where CONKA's ingredients genuinely fit in.",
      symptoms: [
        // Commented out for the Flow-only repositioning of this page: these two
        // symptoms are answered entirely by Clear ingredients (Alpha GPC,
        // Vitamin C, Sunflower Lecithin, B12). Restore them if the page ever
        // sells Both again.
        // {
        //   icon: "🪫",
        //   label: "Struggling to start tasks",
        //   primary: true,
        //   brain:
        //     "There's a kind of 'starter motor' in the brain (the locus coeruleus) that runs on norepinephrine and gets you from 'I should do this' to actually doing it. When it's underpowered, you can genuinely want to start something and still not move.",
        //   brainCitation: "Aston-Jones et al., Biological Psychiatry, 1999",
        //   ingredients: [
        //     {
        //       icon: "🧠",
        //       name: "Alpha GPC",
        //       formula: "Clear",
        //       detail:
        //         "Produced faster processing speed than caffeine in a clinical comparison, with less jitteriness, a cleaner nudge to that starter motor.",
        //       citation: "DOI: 10.1186/1550-2783-12-S1-P41",
        //     },
        //     {
        //       icon: "🍊",
        //       name: "Vitamin C",
        //       formula: "Clear",
        //       detail:
        //         "The cofactor for the enzyme that converts dopamine into norepinephrine, the exact step that turns 'I should' into 'I am.'",
        //     },
        //   ],
        // },
        // {
        //   icon: "⏳",
        //   label: "Losing track of objects and time",
        //   primary: true,
        //   brain:
        //     "The same circuit that lets you hold a thought in your head, 'where did I just put my keys', is the one running low on fuel, so information doesn't stick the way it should.",
        //   brainCitation: "Arnsten & Li, Biological Psychiatry, 2005",
        //   ingredients: [
        //     {
        //       icon: "🧠",
        //       name: "Alpha GPC",
        //       formula: "Clear",
        //       detail:
        //         "Supplies choline, the raw material the brain uses to build acetylcholine, the messenger tied to laying down and holding onto memories.",
        //     },
        //     {
        //       icon: "🌻",
        //       name: "Sunflower Lecithin",
        //       formula: "Clear",
        //       detail:
        //         "A natural source of phosphatidylcholine, a core building block of the neuron membranes signals travel across.",
        //     },
        //     {
        //       icon: "🔴",
        //       name: "Vitamin B12",
        //       formula: "Clear",
        //       detail:
        //         "As methylcobalamin, a cofactor needed to produce acetylcholine alongside dopamine, norepinephrine, serotonin and GABA.",
        //     },
        //   ],
        // },
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
            // Commented out for the Flow-only repositioning: ALCAR sits in Clear.
            // {
            //   icon: "⚡",
            //   name: "ALCAR",
            //   formula: "Clear",
            //   detail:
            //     "Ferries fatty acids into mitochondria for energy and supports acetylcholine synthesis. In a randomised trial, L-carnitine significantly reduced physical and mental fatigue versus placebo.",
            //   citation: "PMID: 18065594",
            // },
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
      eyebrow: "ADHD by the numbers",
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
      body: "Most focus products help you concentrate once you've started. With ADHD the hard part is starting at all. CONKA Flow gives you the calm, steady drive to get from 'I should' to 'I'm doing it', no caffeine and none of the jittery push.",
      // The Flow "neuron" clip: the bottle floating over a neural network, the
      // same footage BottleVideo runs in PDP section 4. Flow rather than Clear
      // or Both because every listicle is Flow-primary (productHeroId "01").
      // Still a 9:16 source centre-cropped to 3:4 by object-cover.
      asset: {
        kind: "video",
        src: "/videos/flow/FlowFloat.mp4",
        alt: "A CONKA Flow bottle floating over a neural network",
        aspect: "3/4",
      },
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
      body: "With ADHD, 'does this actually work?' is a fair question. The CONKA app is built around an FDA-cleared, CE-marked cognitive test from Cambridge University. It takes 75 seconds, so when your focus score moves, it's measuring something real. The same science has been covered and published here:",
      asset: { kind: "measureTile" },
      pressMarquee: true,
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
          image: "/testimonials/dtc/AaronH.jpg",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "No more jitters",
          quote:
            "In the first few days of taking Flow, I relied less on the jitters of caffeine to get me through a day.",
          name: "Ankita K.",
          image: "/lander/reviews/AnkitaK.jpg",
          detail: "Verified · Flow + Clear",
        },
        {
          headline: "Keeping up with both",
          quote:
            "What I didn't expect was being able to take something after work, lock back in for the hustle, and still sleep well.",
          name: "Sam J.",
          image: "/testimonials/dtc/SamJ.jpg",
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
    productHeroId: "01",
    whoItsFor: [
      "You've got an ADHD brain that won't get going in the morning. Flow gives you calm, caffeine-free drive to start the things you've been putting off.",
      "You're done running on coffee and willpower. A caffeine-free daily shot supports steady focus without the jitters, and the 2-minute app test lets you watch it working instead of guessing.",
    ],
  },
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
  stickyBar: { cta: "Get started" },
};
