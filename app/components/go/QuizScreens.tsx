"use client";

import { useEffect, useState } from "react";
import type {
  AnalyzingScreen,
  InterstitialScreen,
  LandingScreen,
  ResultBucket,
} from "@/app/lib/landings/types";
import QuizButton from "./QuizButton";
import AnimatedText from "./AnimatedText";
import AnimatedStat from "./AnimatedStat";
import ComparisonChart from "./ComparisonChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

const mono = { fontFamily: "var(--font-brand-data)" } as const;

export function LandingView({
  screen,
  onStart,
}: {
  screen: LandingScreen;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-medium leading-tight tracking-[-0.02em] sm:text-5xl">
          {screen.title}
        </h1>
        {screen.subtitle && (
          <p className="text-base leading-relaxed text-black/70 sm:text-lg">
            {screen.subtitle}
          </p>
        )}
        {screen.video && (
          /* portrait 720x1280 pour render, centred crop on the bottle */
          <div
            className="aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl border-2"
            style={{ borderColor: "var(--brand-accent)" }}
          >
            <video
              src={screen.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover object-center"
              aria-hidden
            />
          </div>
        )}
      </div>
      <div className="pb-8">
        {screen.rating && (
          <p className="mb-3 text-sm text-black/70">
            <span
              className="mr-2 tracking-[0.15em]"
              style={{ color: "var(--brand-accent)" }}
              aria-hidden
            >
              {"★★★★★"}
            </span>
            {screen.rating.text}
          </p>
        )}
        <QuizButton label={screen.cta} onClick={onStart} />
        {screen.footnote && (
          <p className="mt-3 text-sm text-black/50" style={mono}>
            {screen.footnote}
          </p>
        )}
      </div>
    </div>
  );
}

export function InterstitialView({
  screen,
  onContinue,
}: {
  screen: InterstitialScreen;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-7">
        <h2
          className={
            screen.variant === "commitment"
              ? "text-5xl font-medium leading-tight tracking-[-0.02em]"
              : "text-3xl font-medium leading-tight tracking-[-0.01em] sm:text-4xl"
          }
        >
          {screen.title}
        </h2>

        {screen.variant === "stat" && screen.stat && (
          <AnimatedStat {...screen.stat} />
        )}

        {screen.chart?.type === "line" && (
          <ComparisonChart
            withLabel={screen.chart.withLabel}
            withoutLabel={screen.chart.withoutLabel}
            caption={screen.chart.caption}
          />
        )}
        {screen.chart?.type === "bar" && (
          <BarChart
            items={screen.chart.items}
            unit={screen.chart.unit}
            caption={screen.chart.caption}
          />
        )}
        {screen.chart?.type === "pie" && (
          <PieChart
            segments={screen.chart.segments}
            caption={screen.chart.caption}
          />
        )}

        {screen.variant === "testimonial" && screen.testimonial && (
          <blockquote>
            <p className="text-2xl leading-snug">
              {"“"}
              {screen.testimonial.quote}
              {"”"}
            </p>
            <footer className="mt-4 text-sm text-black/60" style={mono}>
              {screen.testimonial.name}
              {screen.testimonial.detail ? ` / ${screen.testimonial.detail}` : ""}
            </footer>
          </blockquote>
        )}

        {screen.body && (
          <AnimatedText
            lines={screen.body}
            className="space-y-3 text-lg leading-relaxed text-black/70"
            startDelayMs={200}
          />
        )}
      </div>
      <div className="pb-8">
        <QuizButton label={screen.cta ?? "Continue"} onClick={onContinue} />
      </div>
    </div>
  );
}

export function AnalyzingView({
  screen,
  onComplete,
}: {
  screen: AnalyzingScreen;
  onComplete: () => void;
}) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (done >= screen.steps.length) {
      const t = setTimeout(onComplete, reduced ? 150 : 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), reduced ? 150 : 700);
    return () => clearTimeout(t);
  }, [done, screen.steps.length, onComplete]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10">
      <h2 className="text-3xl font-medium leading-tight tracking-[-0.01em] sm:text-4xl">
        {screen.title}
      </h2>
      <ul className="mx-auto flex flex-col items-start gap-5 text-left">
        {screen.steps.map((step, i) => {
          const isDone = i < done;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 text-base transition-opacity duration-300 ${
                isDone ? "opacity-100" : "opacity-40"
              }`}
              style={mono}
            >
              <span
                className="inline-block h-2.5 w-2.5 border border-black/30 transition-colors duration-300"
                style={
                  isDone
                    ? {
                        backgroundColor: "var(--brand-accent)",
                        borderColor: "var(--brand-accent)",
                      }
                    : undefined
                }
                aria-hidden
              />
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ResultsView({
  bucket,
  ctaLabel,
  ctaHref,
  onCtaClick,
}: {
  bucket: ResultBucket;
  ctaLabel: string;
  ctaHref: string;
  onCtaClick: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-7">
        <div>
          <p
            className="text-sm uppercase tracking-[0.14em]"
            style={{ ...mono, color: "var(--brand-accent)" }}
          >
            {bucket.tag}
          </p>
          <h1 className="mt-3 text-4xl font-medium leading-tight tracking-[-0.02em]">
            {bucket.title}
          </h1>
        </div>
        <p className="text-lg leading-relaxed text-black/70">{bucket.body}</p>
        <div className="w-full border border-black/8 bg-white p-6">
          <p className="text-sm uppercase tracking-wide text-black/60" style={mono}>
            Recommendation
          </p>
          <p className="mt-2 text-xl font-medium">{bucket.recommendation}</p>
        </div>
      </div>
      <div className="pb-8">
        <QuizButton label={ctaLabel} href={ctaHref} onClick={onCtaClick} />
      </div>
    </div>
  );
}
