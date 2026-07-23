import type { ListicleConfig } from "./listicle-types";

/**
 * Persona listicle: ADHD.
 *
 * Rewritten 2026-07-22 to Humphrey's improved copy and sentiment (template
 * upgrade Phase 3). Opens with the bespoke interactive symptom explainer
 * (kind: "symptomExplainer"), which absorbs the old standalone restlessness /
 * mental-noise reasons. Uses the Phase 1 citations and press marquee.
 *
 * TODO(FAQ): Humphrey's bespoke ADHD FAQ copy was not delivered (ran out of
 * credits). Until it lands, the persona reuses existing canonical faqIds. When
 * the copy arrives, add the entries to app/lib/faqContent.ts and update faqIds.
 * Tracked in docs/development/featurePlans/listicle-template-upgrade.md.
 */
export const adhdListicle: ListicleConfig = {
  slug: "adhd-listicle",
  persona: "adhd",
  format: "listicle",
  template: "im8",
  title: "Do I Have ADHD, or Am I Just Bad at Focusing?",
  hero: {
    laurel: {
      eyebrow: "World's Largest",
      body: "Consumer brain-research project. Trusted by 1,000+ ADHD brains, tested through our app.",
    },
    headline: "Do I Have ADHD, or Am I Just Bad at Focusing?",
    subcopy:
      "Two caffeine-free daily shots, built around the way an ADHD brain actually works, not another 'just try harder' or 'sit still'. Flow to start the day, Clear for the afternoon, with an app to measure the difference.",
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
  pressMarquee: true,
  athleteTestimonials: true,
  body: [
    {
      kind: "symptomExplainer",
      n: 1,
      tag: "GETTING STARTED",
      headline: "What's Actually Happening in Your ADHD Brain?",
      intro:
        "In simple terms, an ADHD brain tends to run low on signal from two chemical messengers, dopamine and norepinephrine, especially in the front of the brain that handles focus, planning and self-control. It's not that these chemicals disappear, it's more like a radio signal that keeps cutting in and out rather than a station that's gone dead. Because that signal is patchy, everyday things like sitting still, starting a boring task, holding a thought for five seconds, or shrugging off a small comment all take real effort, effort other brains spend without noticing. Below is what that patchy signal feels like day to day, and where CONKA's ingredients genuinely fit in.",
      disclaimer:
        "CONKA is a food supplement, not a treatment for ADHD. This explains general research, not personal medical advice.",
      symptoms: [
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
          icon: "🔁",
          label: "Can't stop the small loop (doomscrolling, picking)",
          primary: true,
          brain:
            "Repetitive habits you can't seem to override trace back to a different chemical, glutamate, getting stuck in a loop in the brain's reward centre, alongside the dopamine story most people know.",
          brainCitation: "Grant & Chamberlain, glutamate reward-circuit mechanism",
          ingredients: [
            {
              icon: "🧪",
              name: "NAC",
              formula: "Clear",
              detail:
                "Resets glutamate balance. In a trial of 66 adults it significantly reduced compulsive skin-picking versus placebo.",
              citation: "PMID: 27007062",
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
            {
              icon: "♻️",
              name: "Alpha Lipoic Acid",
              formula: "Clear",
              detail:
                "Improves insulin-stimulated glucose uptake into brain cells and supports acetylcholine production.",
            },
            {
              icon: "🛡️",
              name: "Glutathione",
              formula: "Clear",
              detail:
                "The brain's primary internal antioxidant, clearing oxidative byproducts so you reset properly overnight.",
            },
          ],
        },
        {
          icon: "💔",
          label: "Rejection sensitivity",
          primary: true,
          brain:
            "Feedback and criticism get processed through serotonin pathways as well as dopamine ones, so a small comment can land in the brain like a far bigger threat than it really is.",
          brainCitation: "Oades, Expert Review of Neurotherapeutics, 2007",
          ingredients: [
            {
              icon: "🌿",
              name: "Ashwagandha",
              formula: "Flow",
              detail:
                "Has trial evidence for lowering anxiety scores directly, not just cortisol, turning the emotional volume down a notch.",
              citation: "PMID: 32800311",
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
        {
          icon: "😤",
          label: "Snapping at people, low frustration tolerance",
          brain:
            "Your threshold between 'this is mildly annoying' and 'this is unbearable' is set by serotonin and stress-reactivity circuits. When those are dysregulated, ordinary friction can trigger an outsized reaction.",
          brainCitation: "Oades, Expert Review of Neurotherapeutics, 2007",
          ingredients: [
            {
              icon: "🍋",
              name: "Lemon Balm",
              formula: "Flow",
              detail:
                "Took the edge off people's stress response in a placebo-controlled study, calming the reaction without sedating you.",
              citation: "Kennedy et al., Psychosomatic Medicine, 2004",
            },
          ],
        },
        {
          icon: "🌙",
          label: "Wired at night, poor sleep",
          brain:
            "The same arousal system that's meant to power down at night can get stuck switched on in ADHD brains. It's not about too much caffeine, the system itself is running hot.",
          brainCitation: "Berridge & Waterhouse, Brain Research Reviews, 2003",
          ingredients: [
            {
              icon: "🏔️",
              name: "Rhodiola Rosea",
              formula: "Flow",
              detail:
                "Significantly reduced fatigue and improved mental performance for night-shift doctors in a clinical trial. Neither CONKA shot contains caffeine.",
              citation: "PMID: 11081987",
            },
          ],
        },
        {
          icon: "🐌",
          label: "Sluggish start, brain won't warm up",
          brain:
            "Before the brain's attention networks can properly switch on, they need blood flow, think of it as warming the engine before the car drives properly.",
          brainCitation: "General cerebral blood-flow and attention-network mechanism",
          ingredients: [
            {
              icon: "🫐",
              name: "Bilberry",
              formula: "Flow",
              detail:
                "Belongs to the anthocyanin family of plant compounds; a 2024 review of 14 trials linked anthocyanins to better working memory and attention.",
              citation: "PMC11775034",
            },
            {
              icon: "🍃",
              name: "Ginkgo Biloba",
              formula: "Clear",
              detail:
                "Its traditional use is built on supporting cerebral circulation. Being upfront: a 2012 meta-analysis found no significant cognitive benefit in healthy adults specifically, so the circulation mechanism is real but the boost evidence in healthy people isn't there yet.",
              citation: "Laws et al., Human Psychopharmacology, 2012",
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
      tag: "EXECUTIVE FUNCTION",
      headline: "Struggling With Small Decisions",
      body: "Decision-making leans on working memory and dopamine reward; when either is disrupted, even small choices stall or default to whatever's loudest. Alpha GPC in CONKA Clear supports working memory, so the everyday decisions that pile up stop feeling like a wall.",
      // 9:16 source centre-cropped to 3:4, the animated Clear shot
      asset: { kind: "video", src: "/videos/clear/ClearLiquid.mp4", aspect: "3/4" },
    },
    {
      kind: "reason",
      n: 3,
      tag: "MEASURE IT",
      headline: "Do Brain-Training Apps Actually Work?",
      body: "Most brain-training apps are just games with a leaderboard. The CONKA app is different. It's built around an FDA-cleared, CE-marked cognitive assessment developed by Cambridge University and used in clinical settings to help detect early signs of ADHD, reading impulsivity and focus in a test that takes 1 minute 15 seconds. So when you see your focus score move, it's measuring something real.",
      // App cognitive-score count-up card; "Do you see an animal?" GIF is a
      // Phase 5 asset swap. Press outlets render via pressMarquee (trust zone).
      asset: { kind: "measureTile" },
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
      n: 4,
      tag: "BAD NIGHTS",
      headline: "Built for the Nights You Doom-Scrolled Instead of Sleeping",
      body: "Racing thoughts at midnight, one more scroll turning into forty minutes, then a morning that starts already behind. A rough relationship with sleep is something a lot of people with ADHD recognise, and a late one drinking doesn't help the next day either. Glutathione, your body's master antioxidant, clears acetaldehyde, the toxin behind hangover symptoms, significantly faster. CONKA doesn't erase a bad night, but it gives your brain a real head start on the next one.",
      // The bad-nights stack, showcasing the Phase 1 per-ingredient citations
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
      n: 5,
      tag: "REAL PROOF",
      headline: "Which ADHD Brain Supplements Are Actually Proven to Work?",
      body: "Proof matters. Most focus supplements are hiding a simple trick: caffeine. It works briefly, then comes the crash, the jitters. By the original definition of the word nootropic, a substance with side effects like caffeine isn't even a true nootropic, it's just a stimulant. The only real way to know if a supplement works is randomised controlled trial evidence. Not a testimonial, not a before-and-after photo, a trial. CONKA has done it over 20 times, and if that's still not enough, we built something most brands never will: a way to measure it yourself.",
      // 4-group average cognitive score, CONKA groups in green (app data)
      asset: { kind: "scoreByGroup" },
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
