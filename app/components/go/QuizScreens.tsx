"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type {
  AnalyzingScreen,
  BrainAgeResult,
  InterstitialScreen,
  LandingScreen,
  QuizAnswer,
  ResultBucket,
  RevealScreen,
} from "@/app/lib/landings/types";
import QuizButton from "./QuizButton";
import AnimatedText from "./AnimatedText";
import TypewriterText from "./TypewriterText";
import AnimatedStat from "./AnimatedStat";
import ComparisonChart from "./ComparisonChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import CycleLoop from "./CycleLoop";
import TurnaroundChart from "./TurnaroundChart";

const mono = { fontFamily: "var(--font-brand-data)" } as const;

/** Replaces {realAge}/{brainAge}/{gap} in copy with the computed result */
export function fillAgeTokens(
  text: string,
  ages: BrainAgeResult | null,
): string {
  if (!ages) return text;
  return text
    .replace(/\{realAge\}/g, String(ages.realAge))
    .replace(/\{brainAge\}/g, String(ages.brainAge))
    .replace(/\{gap\}/g, String(ages.gap));
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
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-medium leading-tight tracking-[-0.02em] sm:text-5xl">
          {screen.title}
          {screen.titleAccent && (
            <span
              className="mt-1 block text-5xl font-semibold tracking-[-0.02em] sm:text-6xl"
              style={{ color: "var(--brand-accent)" }}
            >
              {screen.titleAccent}
            </span>
          )}
        </h1>
        {screen.subtitle && (
          <p className="go-text-soft text-base leading-relaxed sm:text-lg">
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
          <p className="go-text-soft mb-3 text-sm">
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
          <p className="go-text-faint mt-3 text-sm" style={mono}>
            {screen.footnote}
          </p>
        )}
      </div>
    </div>
  );
}

export function InterstitialView({
  screen,
  answers,
  onContinue,
}: {
  screen: InterstitialScreen;
  answers: Record<string, QuizAnswer>;
  onContinue: () => void;
}) {
  const mirrorLabel = screen.mirror
    ? answers[screen.mirror.questionId]?.label
    : undefined;
  /* Payoff keeps its title with the orb in the centred block; everything
     else anchors the title under the progress bar (Flow layout) */
  const isPayoff = screen.variant === "payoff";

  return (
    <div className="flex flex-1 flex-col">
      {(mirrorLabel || (!isPayoff && screen.title) || screen.subtitle) && (
        <div className="flex flex-col items-center gap-4 pt-2">
          {mirrorLabel && (
            <p
              className="rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.14em]"
              style={{
                ...mono,
                backgroundColor: "var(--go-pill-bg)",
                color: "var(--go-pill-text)",
              }}
            >
              <span className="opacity-60">
                {screen.mirror?.prefix ?? "YOU SAID:"}
              </span>{" "}
              {mirrorLabel}
            </p>
          )}
          {!isPayoff && screen.title && (
            <h2
              className={
                screen.variant === "commitment"
                  ? "text-5xl font-medium leading-tight tracking-[-0.02em]"
                  : "text-3xl font-medium leading-tight tracking-[-0.01em] sm:text-4xl"
              }
            >
              {screen.title}
            </h2>
          )}
          {screen.subtitle && (
            <p className="go-text-mid text-base leading-relaxed sm:text-lg">
              {screen.subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center gap-7 py-8">
        {isPayoff && (
          <>
            <div className="go-orb go-fade-up h-44 w-44" aria-hidden />
            <h2
              className="go-fade-up text-3xl font-medium leading-tight tracking-[-0.01em] sm:text-4xl"
              style={{ animationDelay: "300ms" }}
            >
              {screen.title}
            </h2>
          </>
        )}

        {screen.variant === "stat" && screen.stat && (
          <AnimatedStat {...screen.stat} />
        )}

        {screen.images && screen.images.length === 1 && (
          <div className="w-full max-w-[220px]">
            <Image
              src={screen.images[0].src}
              alt={screen.images[0].alt}
              width={screen.images[0].width}
              height={screen.images[0].height}
              className="go-fade-up h-auto w-full"
              style={{ animationDelay: "250ms" }}
              sizes="220px"
            />
          </div>
        )}
        {screen.images && screen.images.length > 1 && (
          /* Side-by-side product cards; white surface needs its own
             text colour (differs from the section background) */
          <div className="grid w-full grid-cols-2 gap-3">
            {screen.images.map((image, i) => (
              <figure
                key={image.src}
                className="go-fade-up overflow-hidden rounded-2xl bg-white p-3"
                style={{ animationDelay: `${250 + i * 180}ms` }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full"
                  sizes="(max-width: 640px) 45vw, 250px"
                />
                {image.caption && (
                  <figcaption
                    className="pb-1 pt-2 text-center text-xs uppercase tracking-[0.14em] text-black/70"
                    style={mono}
                  >
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
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
        {screen.chart?.type === "cycle" && (
          <CycleLoop nodes={screen.chart.nodes} center={screen.chart.center} />
        )}

        {screen.variant === "testimonial" && screen.testimonial && (
          <blockquote>
            <p className="text-2xl leading-snug">
              {"“"}
              {screen.testimonial.quote}
              {"”"}
            </p>
            <footer className="go-text-mid mt-4 text-sm" style={mono}>
              {screen.testimonial.name}
              {screen.testimonial.detail ? ` / ${screen.testimonial.detail}` : ""}
            </footer>
          </blockquote>
        )}

        {screen.body &&
          (screen.variant === "commitment" ? (
            <TypewriterText
              lines={screen.body}
              className="go-text-soft space-y-6 text-2xl font-medium leading-snug sm:text-3xl"
            />
          ) : (
            <AnimatedText
              lines={screen.body}
              className="go-text-soft space-y-3 text-lg leading-relaxed"
              startDelayMs={200}
            />
          ))}
      </div>
      <div className="pb-8">
        <QuizButton label={screen.cta ?? "Continue"} onClick={onContinue} />
      </div>
    </div>
  );
}

/** Eased count-up that can start after a delay (reveal second beat) */
function CountUp({
  value,
  delayMs = 0,
  durationMs = 900,
}: {
  value: number;
  delayMs?: number;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf: number;
    const start = performance.now() + delayMs;
    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, delayMs, durationMs]);

  return <>{display}</>;
}

export function RevealView({
  screen,
  ages,
  onContinue,
}: {
  screen: RevealScreen;
  ages: BrainAgeResult | null;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <div className="flex items-end justify-center gap-10">
          <div>
            <p className="go-text-mid text-xs uppercase tracking-[0.14em]" style={mono}>
              {screen.realAgeLabel}
            </p>
            <p className="mt-2 text-6xl font-medium tabular-nums tracking-[-0.02em]">
              {ages ? <CountUp value={ages.realAge} delayMs={200} /> : "–"}
            </p>
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-[0.14em]"
              style={{ ...mono, color: "var(--brand-accent)" }}
            >
              {screen.brainAgeLabel}
            </p>
            <p
              className="mt-2 text-7xl font-medium tabular-nums tracking-[-0.02em]"
              style={{ color: "var(--brand-accent)" }}
            >
              {ages ? <CountUp value={ages.brainAge} delayMs={1000} /> : "–"}
            </p>
          </div>
        </div>

        {screen.turnaround && (
          <TurnaroundChart
            nowLabel={screen.turnaround.nowLabel}
            futureLabel={screen.turnaround.futureLabel}
            caption={screen.turnaround.caption}
            startDelayMs={1900}
          />
        )}

        <h2
          className="go-fade-up text-3xl font-medium leading-tight tracking-[-0.01em] sm:text-4xl"
          style={{ animationDelay: "2300ms" }}
        >
          {fillAgeTokens(screen.title, ages)}
        </h2>

        {screen.body && (
          <AnimatedText
            lines={screen.body.map((line) => fillAgeTokens(line, ages))}
            className="go-text-soft space-y-3 text-lg leading-relaxed"
            startDelayMs={2600}
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
                className="inline-block h-2.5 w-2.5 border transition-colors duration-300"
                style={{
                  borderColor: isDone
                    ? "var(--brand-accent)"
                    : "var(--go-neutral-strong)",
                  backgroundColor: isDone ? "var(--brand-accent)" : undefined,
                }}
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
      <div className="pt-2">
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
      <div className="flex flex-1 flex-col items-center justify-center gap-7 py-8">
        <p className="go-text-soft text-lg leading-relaxed">{bucket.body}</p>
        <div
          className="w-full border p-6"
          style={{
            borderColor: "var(--go-hairline-soft)",
            backgroundColor: "var(--go-surface)",
          }}
        >
          <p className="go-text-mid text-sm uppercase tracking-wide" style={mono}>
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
