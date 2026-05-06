"use client";

import type { CognitiveTestRecommendationProps } from "./types";

export default function CognitiveTestRecommendation({
  result,
}: CognitiveTestRecommendationProps) {
  const getRecommendation = () => {
    if (result.accuracy < 70 && result.speed < 70) {
      return {
        headline: "Consider the Balance Protocol.",
        description:
          "Your scores suggest both accuracy and speed could benefit from support. The Balance Protocol alternates CONKA Flow and CONKA Clear daily for comprehensive cognitive coverage.",
        buttonText: "Try Balance Protocol",
        href: "/conka-both",
        eyebrow: "Recommendation · Balance",
      };
    }
    if (result.accuracy < 70) {
      return {
        headline: "Precision Protocol may help.",
        description:
          "Your accuracy score suggests room for improvement. Clinical studies show CONKA Clear ingredients improve cognition by +16% and attention by +14%.",
        buttonText: "Try Precision Protocol",
        href: "/protocol/2",
        eyebrow: "Recommendation · Precision",
      };
    }
    if (result.speed < 70) {
      return {
        headline: "Resilience Protocol may help.",
        description:
          "Your speed score suggests room for improvement. Clinical studies show CONKA Flow ingredients improve memory by +18% and cognitive performance.",
        buttonText: "Try Resilience Protocol",
        href: "/protocol/1",
        eyebrow: "Recommendation · Resilience",
      };
    }
    return {
      headline: "Great baseline.",
      description:
        "Your scores show strong cognitive function. The Ultimate Protocol (CONKA Flow and CONKA Clear daily) helps maintain and further enhance peak performance.",
      buttonText: "Try Ultimate Protocol",
      href: "/protocol/4",
      eyebrow: "Recommendation · Ultimate",
    };
  };

  const recommendation = getRecommendation();

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
          href={recommendation.href}
          className="inline-flex items-center justify-center gap-3 bg-white text-black font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-5 py-3.5 lab-clip-tr transition-opacity hover:opacity-85 active:opacity-70"
        >
          <span>{recommendation.buttonText}</span>
          <span aria-hidden>↗</span>
        </a>
        <a
          href="/quiz"
          className="inline-flex items-center justify-center gap-3 bg-transparent border border-white/30 text-white font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-5 py-3.5 lab-clip-tr transition-colors hover:bg-white/10 hover:border-white/50"
        >
          <span>Take the quiz</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
