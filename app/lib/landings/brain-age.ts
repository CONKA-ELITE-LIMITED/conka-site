import type { LandingConfig } from "./types";
import { formulaContent } from "@/app/lib/productData";

const flowTagline = formulaContent["01"].tagline;
const clearTagline = formulaContent["02"].tagline;

/**
 * Brain-age quiz for the ageing-brain persona (copy: Luke, June 2026).
 * Plan + decisions: docs/development/featurePlans/landing-conversion/brain-age-quiz.md
 *
 * Scoring: Q1 sets the real-age baseline; Q2-Q9 answers add or
 * subtract years (Q6, sharp-vs-past, is weighted heaviest). The gap is
 * clamped to +3..+12 so it stays believable and even mostly-good
 * answers produce a small gap. Q10/Q11 score nothing; they exist for
 * desire and ad segmentation (captured by landing:answer_selected).
 *
 * The brain-age number is a lifestyle self-assessment score, never a
 * medical measurement. Keep the reveal/turnaround copy illustrative.
 *
 * PLACEHOLDER stats below (rating line, 61% word-loss figure) must be
 * replaced with defensible numbers before scaling spend (Phase 2).
 */
export const brainAgeQuiz: LandingConfig = {
  slug: "brain-age",
  persona: "ageing-brain",
  format: "quiz",
  title: "What's your real brain age?",
  theme: "dark",
  scoring: { mode: "brain-age", gapMin: 3, gapMax: 12 },
  // No results screen in this flow (commit links straight to the
  // brain-ageing listicle buy box); kept as the fallback destination
  // and the analytics bucket id
  resultsCta: { label: "See the system", href: "/go/brain-ageing-listicle#product" },
  buckets: [
    {
      id: "both",
      tag: "YOUR SYSTEM",
      title: "Close the {gap}-year gap.",
      body: "Your answers point to a brain running {gap} years older than it needs to. The fix is not willpower, it is daily inputs: one for the morning, one for the afternoon dip.",
      recommendation: "CONKA Flow + Clear, the complete daily system.",
    },
  ],
  screens: [
    {
      kind: "landing",
      id: "hook",
      title: "What's your real",
      titleAccent: "brain age?",
      subtitle: "Take the 2-minute test and find out.",
      video: "/videos/misc/BrainScan.mp4",
      videoAspect: "square",
      // PLACEHOLDER: needs a defensible customer figure before scaled spend
      rating: { text: "Trusted by 10,000+ sharp minds" },
      cta: "Test my brain age 🧠",
    },
    {
      kind: "question",
      id: "q_age",
      type: "single",
      question: "How old are you?",
      options: [
        { label: "Under 25", baselineAge: 22 },
        { label: "25–34", baselineAge: 30 },
        { label: "35–44", baselineAge: 40 },
        { label: "45–54", baselineAge: 50 },
        { label: "55–64", baselineAge: 60 },
        { label: "65+", baselineAge: 70 },
      ],
    },
    {
      kind: "question",
      id: "q_mental_activity",
      type: "single",
      question:
        "How often do you do something mentally demanding, like puzzles, reading or learning something new?",
      options: [
        { label: "Most days", years: -2 },
        { label: "A few times a week", years: 0 },
        { label: "Now and then", years: 1 },
        { label: "Rarely", years: 2 },
      ],
    },
    {
      kind: "question",
      id: "q_misplacing",
      type: "single",
      question:
        "How often do you misplace everyday things, like keys, phone or glasses?",
      options: [
        { label: "Never", years: -1 },
        { label: "Occasionally", years: 0 },
        { label: "A few times a week", years: 1 },
        { label: "Most days", years: 2 },
      ],
    },
    {
      kind: "question",
      id: "q_names",
      type: "single",
      question:
        "How often do you blank on a name? Someone you just met, or even someone you know well.",
      options: [
        { label: "Never", years: -1 },
        { label: "Once in a while", years: 0 },
        { label: "A few times a week", years: 2 },
        { label: "All the time", years: 3 },
      ],
    },
    {
      kind: "question",
      id: "q_words",
      type: "single",
      question:
        "How often is a word right on the tip of your tongue, but you just can't reach it?",
      options: [
        { label: "Rarely", years: -1 },
        { label: "A few times a week", years: 1 },
        { label: "Once a day", years: 2 },
        { label: "Several times a day", years: 3 },
      ],
    },
    {
      kind: "interstitial",
      id: "i_not_alone",
      variant: "stat",
      mirror: { questionId: "q_words" },
      // PLACEHOLDER split: replace with figures we can back (own quiz
      // data). Per-answer values sum to 100 across the four options.
      stat: {
        value: 41,
        suffix: "%",
        label: "of people your age lose words the same way",
        byAnswer: {
          questionId: "q_words",
          values: {
            Rarely: 14,
            "A few times a week": 41,
            "Once a day": 27,
            "Several times a day": 18,
          },
        },
      },
      title: "You're not alone.",
      body: [
        "Word-finding slips are one of the most common things people notice as the brain gets older. Keep going.",
      ],
    },
    {
      kind: "question",
      id: "q_sharp_vs_past",
      type: "single",
      question: "Do you feel as mentally sharp as you did 5 to 10 years ago?",
      options: [
        { label: "Sharper than ever", years: -3 },
        { label: "About the same", years: 0 },
        { label: "A little slower", years: 3 },
        { label: "Noticeably slower", years: 5 },
      ],
    },
    {
      kind: "question",
      id: "q_fog",
      type: "single",
      question:
        "Do you have days where your thinking feels foggy or slow to get going?",
      options: [
        { label: "Never", years: -1 },
        { label: "Rarely", years: 0 },
        { label: "Sometimes", years: 1 },
        { label: "Most days", years: 3 },
      ],
    },
    {
      kind: "interstitial",
      id: "i_not_your_fault",
      variant: "education",
      title: "This isn't your fault.",
      body: [
        "From your mid-twenties, processing speed and recall naturally start to slide. That's biology, not laziness.",
        "And it isn't fixed. **With the right inputs, it can be lifted back up.**",
      ],
      chart: {
        type: "line",
        withLabel: "Supported",
        withoutLabel: "Left alone",
      },
    },
    {
      kind: "interstitial",
      id: "i_cycle",
      variant: "comparison",
      title: "It's a loop.",
      subtitle: "And it spins faster every day you don't fix it.",
      chart: {
        type: "cycle",
        nodes: [
          { label: "Brain slows" },
          { label: "You forget more" },
          { label: "You stress, push harder" },
          { label: "Worse sleep" },
        ],
        center: "You can break it.",
      },
    },
    {
      kind: "question",
      id: "q_learning",
      type: "single",
      question:
        "When you're learning or trying to remember something new, how does it feel?",
      options: [
        { label: "It sticks easily", years: -2 },
        { label: "Takes a bit more effort than it used to", years: 1 },
        { label: "I have to really work at it", years: 2 },
        { label: "It often doesn't stick", years: 3 },
      ],
    },
    {
      kind: "question",
      id: "q_sharpness",
      type: "slider",
      question: "On an average day, how sharp does your mind feel?",
      slider: {
        min: 0,
        max: 100,
        step: 1,
        minLabel: "Foggy",
        maxLabel: "Razor sharp",
        unit: "{value}/100",
        anchor: { value: 65, label: "Average" },
        bands: [
          { upTo: 30, years: 3 },
          { upTo: 50, years: 2 },
          { upTo: 70, years: 1 },
          { upTo: 100, years: -1 },
        ],
      },
    },
    {
      kind: "interstitial",
      id: "i_cost_of_waiting",
      variant: "stat",
      title: "The cost of waiting.",
      mirror: { questionId: "q_sharpness", prefix: "YOU RATED YOURSELF:" },
      // PLACEHOLDER: source a defensible cognitive-readiness decline figure
      stat: {
        value: 23,
        suffix: "%",
        label: "drop in cognitive readiness people report by 60",
      },
      body: ["The earlier you start, the more you keep."],
    },
    {
      kind: "question",
      id: "q_what_matters",
      type: "single",
      question: "What matters most to you about staying mentally sharp?",
      options: [
        { label: "Remembering names, words and details" },
        { label: "Staying sharp as I get older" },
        { label: "Keeping up at work and in life" },
        { label: "Feeling like myself again" },
      ],
    },
    {
      kind: "question",
      id: "q_best_self",
      type: "single",
      question: "When your mind is at its best, you feel…",
      options: [
        { label: "Quick and clear" },
        { label: "Focused and reliable" },
        { label: "Confident I won't forget" },
        { label: "Sharp, like my younger self" },
      ],
    },
    {
      kind: "analyzing",
      id: "analyzing",
      title: "Calculating your brain age",
      steps: [
        "Reading your answers",
        "Weighing the signals",
        "Comparing against your age group",
        "Building your result",
      ],
    },
    {
      kind: "reveal",
      id: "reveal",
      // No real-age beat: Q1 only captures a band, so a precise "your
      // age" number would read as invented. The brain age stands alone.
      brainAgeLabel: "YOUR BRAIN AGE",
      title: "Your brain is acting {gap} years older than it should.",
      body: [
        "The good news: this number isn't fixed. It reflects habits and inputs, and inputs can change.",
      ],
      turnaround: {
        nowLabel: "You now",
        futureLabel: "Where you could be",
      },
      cta: "Show me how",
    },
    {
      kind: "interstitial",
      id: "i_mechanism",
      variant: "education",
      title: "A system, not a pill.",
      images: [
        {
          src: "/formulas/conkaFlow/FlowNew.jpg",
          alt: "CONKA Flow shot bottle",
          width: 875,
          height: 875,
          caption: "AM · FLOW",
        },
        {
          src: "/formulas/conkaClear/ClearNew.jpg",
          alt: "CONKA Clear shot bottle",
          width: 875,
          height: 875,
          caption: "PM · CLEAR",
        },
      ],
      bodyTone: "strong",
      body: [
        `*Flow* in the morning. ${flowTagline}`,
        `*Clear* for the second half. ${clearTagline}`,
        "Two minutes a day. That's the whole ritual.",
      ],
    },
    {
      kind: "interstitial",
      id: "i_payoff",
      variant: "payoff",
      title: "Now your mind is clear, sharp and switched on.",
      cta: "Continue",
    },
    {
      kind: "interstitial",
      id: "i_app",
      variant: "education",
      title: "Track it, don't guess it.",
      body: [
        "The CONKA app gives you a 2-minute brain test whenever you want.",
        "Watch your score move over time, like a Garmin for your mind.",
      ],
      images: [
        {
          src: "/app/AppConkaRing.png",
          alt: "CONKA app showing a brain score of 92 with a daily tracking calendar",
          width: 1455,
          height: 2942,
        },
      ],
    },
    {
      kind: "interstitial",
      id: "i_commit",
      variant: "commitment",
      body: [
        "This is *just text* on a screen.",
        "It can't make your brain sharper.",
        "Only *you* can decide to look after it.",
        "Don't put it off.",
        "*Make the decision now.*",
      ],
      cta: "Commit",
      // Straight to the brain-ageing listicle buy box; completion analytics
      // fired at the reveal
      ctaHref: "/go/brain-ageing-listicle#product",
    },
  ],
};
