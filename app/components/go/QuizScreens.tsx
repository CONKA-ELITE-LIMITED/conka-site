"use client";

import { useEffect, useState } from "react";
import type {
  AnalyzingScreen,
  InterstitialScreen,
  LandingScreen,
  ResultBucket,
  ResultsScreen,
} from "@/app/lib/landings/types";
import QuizButton from "./QuizButton";
import AnimatedText from "./AnimatedText";
import AnimatedStat from "./AnimatedStat";
import ComparisonChart from "./ComparisonChart";

const mono = { fontFamily: "var(--font-brand-data)" } as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs uppercase tracking-[0.14em] text-black/60"
      style={mono}
    >
      {children}
    </p>
  );
}

export function LandingView({
  screen,
  onStart,
}: {
  screen: LandingScreen;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-5">
        {screen.eyebrow && <Eyebrow>{screen.eyebrow}</Eyebrow>}
        <h1 className="text-4xl font-medium leading-tight tracking-[-0.02em]">
          {screen.title}
        </h1>
        {screen.subtitle && (
          <p className="text-base leading-relaxed text-black/70">
            {screen.subtitle}
          </p>
        )}
      </div>
      <div className="pb-2">
        <QuizButton label={screen.cta} onClick={onStart} />
        {screen.footnote && (
          <p className="mt-3 text-center text-xs text-black/50" style={mono}>
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
      <div className="flex flex-1 flex-col justify-center gap-6">
        {screen.eyebrow && <Eyebrow>{screen.eyebrow}</Eyebrow>}

        {screen.variant === "stat" && screen.stat && (
          <AnimatedStat {...screen.stat} />
        )}

        <h2
          className={
            screen.variant === "commitment"
              ? "text-4xl font-medium leading-tight tracking-[-0.02em]"
              : "text-[1.75rem] font-medium leading-tight tracking-[-0.01em]"
          }
        >
          {screen.title}
        </h2>

        {screen.variant === "comparison" && screen.comparison && (
          <ComparisonChart {...screen.comparison} />
        )}

        {screen.variant === "testimonial" && screen.testimonial && (
          <blockquote
            className="border-l-2 pl-4"
            style={{ borderColor: "var(--brand-accent)" }}
          >
            <p className="text-lg leading-relaxed">
              {"“"}
              {screen.testimonial.quote}
              {"”"}
            </p>
            <footer
              className="mt-3 text-xs uppercase tracking-wide text-black/60"
              style={mono}
            >
              {screen.testimonial.name}
              {screen.testimonial.detail ? ` / ${screen.testimonial.detail}` : ""}
            </footer>
          </blockquote>
        )}

        {screen.body && (
          <AnimatedText
            lines={screen.body}
            className="space-y-3 text-base leading-relaxed text-black/70"
            startDelayMs={200}
          />
        )}
      </div>
      <div className="pb-2">
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
    <div className="flex flex-1 flex-col justify-center gap-8">
      <h2 className="text-[1.75rem] font-medium leading-tight tracking-[-0.01em]">
        {screen.title}
      </h2>
      <ul className="flex flex-col gap-4">
        {screen.steps.map((step, i) => {
          const isDone = i < done;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 text-sm transition-opacity duration-300 ${
                isDone ? "opacity-100" : "opacity-40"
              }`}
              style={mono}
            >
              <span
                className="inline-block h-2 w-2 border border-black/30 transition-colors duration-300"
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
  screen,
  bucket,
  ctaLabel,
  ctaHref,
  onCtaClick,
}: {
  screen: ResultsScreen;
  bucket: ResultBucket;
  ctaLabel: string;
  ctaHref: string;
  onCtaClick: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-6">
        {screen.eyebrow && <Eyebrow>{screen.eyebrow}</Eyebrow>}
        <div>
          <p
            className="text-xs uppercase tracking-[0.14em]"
            style={{ ...mono, color: "var(--brand-accent)" }}
          >
            {bucket.tag}
          </p>
          <h1 className="mt-2 text-3xl font-medium leading-tight tracking-[-0.02em]">
            {bucket.title}
          </h1>
        </div>
        <p className="text-base leading-relaxed text-black/70">{bucket.body}</p>
        <div className="border border-black/10 p-5">
          <p
            className="text-xs uppercase tracking-wide text-black/60"
            style={mono}
          >
            Recommendation
          </p>
          <p className="mt-2 text-lg font-medium">{bucket.recommendation}</p>
        </div>
      </div>
      <div className="pb-2">
        <QuizButton label={ctaLabel} href={ctaHref} onClick={onCtaClick} />
      </div>
    </div>
  );
}
