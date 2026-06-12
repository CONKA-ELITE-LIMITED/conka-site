import type { LandingConfig } from "./types";

/**
 * Reference quiz config. Placeholder copy: the structure is the
 * deliverable. To create a real persona quiz, copy this file, swap the
 * copy and scores, and register the new config in index.ts.
 *
 * Screen grammar (from the reference funnel): landing hook, questions
 * interleaved with interstitials, analyzing beat, scored results.
 */
export const quizTemplate: LandingConfig = {
  slug: "quiz-template",
  persona: "template",
  format: "quiz",
  title: "Find your focus profile",
  resultsCta: { label: "See your system", href: "/funnel" },
  buckets: [
    {
      id: "flow",
      tag: "MORNING SYSTEM",
      title: "Your mornings are the bottleneck",
      body: "Your answers point to slow starts: the first hours of your day cost you the most focus. That is the window to fix first.",
      recommendation: "CONKA Flow, taken with your morning routine.",
      ctaHref: "/conka-flow",
    },
    {
      id: "clear",
      tag: "AFTERNOON SYSTEM",
      title: "Your afternoons are the bottleneck",
      body: "You start fine, then fade. The mid-afternoon dip is where your output drops, so that is where your system should work hardest.",
      recommendation: "CONKA Clear, taken after lunch.",
      ctaHref: "/conka-clarity",
    },
    {
      id: "both",
      tag: "FULL-DAY SYSTEM",
      title: "You need the full-day system",
      body: "Your focus leaks at both ends of the day. A single fix will not cover it: you need the morning and afternoon working together.",
      recommendation: "CONKA Flow + Clear, the complete daily system.",
    },
  ],
  screens: [
    {
      kind: "landing",
      id: "hook",
      title: "Where does your focus go?",
      subtitle:
        "Answer a few questions and we will map your focus profile to the system built for it.",
      video: "/videos/Flow.mp4",
      rating: { text: "4.9/5 rated by CONKA customers" },
      cta: "Start",
    },
    {
      kind: "question",
      id: "q_low_point",
      type: "single",
      question: "When does your head feel least clear?",
      options: [
        { label: "First thing in the morning", scores: { flow: 2 } },
        { label: "Mid-afternoon", scores: { clear: 2 } },
        { label: "Most of the day", scores: { both: 2 } },
        { label: "It varies day to day", scores: { both: 1, flow: 1 } },
      ],
    },
    {
      kind: "interstitial",
      id: "i_not_alone",
      variant: "stat",
      stat: { value: 67, suffix: "%", label: "of knowledge workers report a daily focus crash" },
      title: "The dip is normal. Losing the day to it is optional.",
      body: ["Placeholder supporting line. Replace with persona-specific proof."],
    },
    {
      kind: "question",
      id: "q_caffeine",
      type: "single",
      question: "How do you currently push through?",
      options: [
        { label: "More coffee", scores: { flow: 1, clear: 1 } },
        { label: "Energy drinks", scores: { both: 1 } },
        { label: "Just grind it out", scores: { both: 1 } },
        { label: "I do not, I lose the hours", scores: { both: 2 } },
      ],
    },
    {
      kind: "question",
      id: "q_deep_work",
      type: "slider",
      question: "How many hours of real, deep focus do you get a day?",
      subtitle: "Be honest. Not hours at the desk, hours of actual output.",
      slider: {
        min: 0,
        max: 8,
        step: 1,
        minLabel: "0",
        maxLabel: "8+",
        unit: "{value} hours",
        bands: [
          { upTo: 2, scores: { both: 2 } },
          { upTo: 4, scores: { flow: 1, clear: 1 } },
          { upTo: 8, scores: { flow: 1 } },
        ],
      },
    },
    {
      kind: "interstitial",
      id: "i_education",
      variant: "education",
      title: "Focus is not willpower. It is chemistry.",
      body: [
        "Placeholder education paragraph one. Explain the mechanism in plain language.",
        "Placeholder paragraph two. One idea per line, revealed in sequence.",
      ],
    },
    {
      kind: "question",
      id: "q_stakes",
      type: "single",
      question: "What would two extra sharp hours a day change?",
      options: [
        { label: "My work output", scores: { flow: 1 } },
        { label: "My training", scores: { flow: 1 } },
        { label: "My evenings and family time", scores: { clear: 1 } },
        { label: "All of it", scores: { both: 1 } },
      ],
    },
    {
      kind: "interstitial",
      id: "i_comparison",
      variant: "comparison",
      title: "Your day, with and without a system",
      chart: {
        type: "line",
        withLabel: "With CONKA",
        withoutLabel: "Without",
        caption: "Illustrative focus curve across a working day",
      },
    },
    {
      kind: "interstitial",
      id: "i_bar_demo",
      variant: "comparison",
      title: "Placeholder bar comparison",
      chart: {
        type: "bar",
        items: [
          { label: "With CONKA", value: 6, accent: true },
          { label: "Coffee alone", value: 3 },
          { label: "Nothing", value: 2 },
        ],
        unit: "{value} hrs",
        caption: "Placeholder values. Swap for persona-specific data.",
      },
    },
    {
      kind: "interstitial",
      id: "i_pie_demo",
      variant: "comparison",
      title: "Placeholder share breakdown",
      chart: {
        type: "pie",
        segments: [
          { label: "Deep focus", value: 55 },
          { label: "Distracted", value: 30 },
          { label: "Flat", value: 15 },
        ],
        caption: "Placeholder split. Swap for persona-specific data.",
      },
    },
    {
      kind: "interstitial",
      id: "i_testimonial",
      variant: "testimonial",
      title: "People like you, already running the system",
      testimonial: {
        quote: "Placeholder quote. Swap in a real verified review for each persona.",
        name: "Placeholder name",
        detail: "Verified customer",
      },
    },
    {
      kind: "interstitial",
      id: "i_commitment",
      variant: "commitment",
      title: "Small daily inputs compound.",
      body: [
        "Placeholder commitment line. This screen primes the result.",
      ],
      cta: "Show my result",
    },
    {
      kind: "analyzing",
      id: "analyzing",
      title: "Building your focus profile",
      steps: [
        "Reading your answers",
        "Mapping your focus pattern",
        "Matching your system",
      ],
    },
    {
      kind: "results",
      id: "results",
    },
  ],
};
