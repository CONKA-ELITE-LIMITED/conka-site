"use client";

import type { CognitiveTestRecommendationProps } from "./types";

/**
 * The test scores two things, and each formula answers one of them. The mapping
 * follows the PDP positioning, so the test and the product pages tell one story:
 *   Flow  "Sharper focus. Calmer energy."  -> accuracy (focus, sustained attention)
 *   Clear "Sharper recall. Faster thinking." -> speed (recall, faster thinking)
 * Every result lands on Flow + Clear, because the pair is what covers both halves.
 * The score only decides which half we lead with, so the reader sees their own
 * result reflected before the offer.
 */
const SCORE_THRESHOLD = 70;

const CTA = { text: "Explore Flow + Clear", href: "/conka-both" } as const;

function getRecommendation(accuracy: number, speed: number) {
  const lowAccuracy = accuracy < SCORE_THRESHOLD;
  const lowSpeed = speed < SCORE_THRESHOLD;

  if (lowAccuracy && lowSpeed) {
    return {
      eyebrow: "Recommendation · Flow + Clear",
      headline: "Both scores have room to move.",
      description:
        "Accuracy comes down to focus and sustained attention, which is what CONKA Flow is built for. Speed comes down to recall and faster thinking, which is what CONKA Clear is built for. Together they cover both halves of the test you just took.",
    };
  }

  if (lowAccuracy) {
    return {
      eyebrow: "Recommendation · Flow first",
      headline: "Accuracy is where you have the most room.",
      description:
        "Accuracy comes down to focus and sustained attention. That is what CONKA Flow is built for. CONKA Clear covers the other half, recall and faster thinking, so taking both keeps you covered as your scores move.",
    };
  }

  if (lowSpeed) {
    return {
      eyebrow: "Recommendation · Clear first",
      headline: "Speed is where you have the most room.",
      description:
        "Speed comes down to recall and faster thinking. That is what CONKA Clear is built for. CONKA Flow covers the other half, focus and sustained attention, so taking both keeps you covered as your scores move.",
    };
  }

  return {
    eyebrow: "Recommendation · Flow + Clear",
    headline: "Strong baseline.",
    description:
      "Both scores are strong. CONKA Flow holds focus and attention, CONKA Clear holds recall and speed. Taking both is how you keep a baseline like this one.",
  };
}

export default function CognitiveTestRecommendation({
  result,
}: CognitiveTestRecommendationProps) {
  const recommendation = getRecommendation(result.accuracy, result.speed);

  return (
    <div className="bg-white/10 border border-white/12 border-l-[3px] border-l-white/40 p-5 lg:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 tabular-nums">
        {recommendation.eyebrow} · Based on your performance
      </p>
      <h4
        className="brand-h4 mb-3 max-w-[24ch]"
        style={{ letterSpacing: "-0.02em", color: "#ffffff" }}
      >
        {recommendation.headline}
      </h4>
      <p className="text-sm text-white/55 leading-relaxed mb-5 max-w-xl">
        {recommendation.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={CTA.href}
          className="inline-flex items-center justify-center gap-3 bg-white text-black font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-5 py-3.5 lab-clip-tr transition-opacity hover:opacity-85 active:opacity-70"
        >
          <span>{CTA.text}</span>
          <span aria-hidden>↗</span>
        </a>
        <a
          href="/funnel"
          className="inline-flex items-center justify-center gap-3 bg-transparent border border-white/30 text-white font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-5 py-3.5 lab-clip-tr transition-colors hover:bg-white/10 hover:border-white/50"
        >
          <span>Get started</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
