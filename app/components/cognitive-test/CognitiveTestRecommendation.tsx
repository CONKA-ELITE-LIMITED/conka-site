"use client";

import Link from "next/link";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
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
      eyebrow: "Recommended: Flow + Clear",
      headline: "Both scores have room to move.",
      description:
        "Accuracy comes down to focus and sustained attention, which is what CONKA Flow is built for. Speed comes down to recall and faster thinking, which is what CONKA Clear is built for. Together they cover both halves of the test you just took.",
    };
  }

  if (lowAccuracy) {
    return {
      eyebrow: "Recommended: Flow first",
      headline: "Accuracy is where you have the most room.",
      description:
        "Accuracy comes down to focus and sustained attention. That is what CONKA Flow is built for. CONKA Clear covers the other half, recall and faster thinking, so taking both keeps you covered as your scores move.",
    };
  }

  if (lowSpeed) {
    return {
      eyebrow: "Recommended: Clear first",
      headline: "Speed is where you have the most room.",
      description:
        "Speed comes down to recall and faster thinking. That is what CONKA Clear is built for. CONKA Flow covers the other half, focus and sustained attention, so taking both keeps you covered as your scores move.",
    };
  }

  return {
    eyebrow: "Recommended: Flow + Clear",
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
    <div className="rounded-lg bg-white p-5 text-black ring-1 ring-black/[0.08] lg:p-7">
      <p className="mb-2 text-sm font-semibold text-[var(--brand-navy)]">
        {recommendation.eyebrow}
      </p>
      <h4
        className="mb-2 max-w-[28ch] text-xl font-semibold leading-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        {recommendation.headline}
      </h4>
      <p className="mb-6 max-w-xl text-base leading-relaxed text-black/70">
        {recommendation.description}
      </p>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <ConkaCTAButton href={CTA.href}>{CTA.text}</ConkaCTAButton>
        <Link
          href="/build-your-order"
          className="inline-flex min-h-[44px] items-center text-base font-semibold text-[var(--brand-navy)] underline underline-offset-4"
        >
          Build your order
        </Link>
      </div>
    </div>
  );
}
