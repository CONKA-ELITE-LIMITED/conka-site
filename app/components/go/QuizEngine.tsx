"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type {
  BrainAgeResult,
  LandingConfig,
  QuestionScreen,
  QuizAnswer,
  ResultBucket,
} from "@/app/lib/landings/types";
import QuizProgressBar from "./QuizProgressBar";
import QuizQuestion from "./QuizQuestion";
import {
  AnalyzingView,
  InterstitialView,
  LandingView,
  ResultsView,
  RevealView,
  fillAgeTokens,
} from "./QuizScreens";
import {
  trackLandingAnswerSelected,
  trackLandingCompleted,
  trackLandingCtaClicked,
  trackLandingResultsViewed,
  trackLandingScreenViewed,
  trackLandingStarted,
} from "@/app/lib/analytics";
import { trackMetaLead, trackMetaViewContent } from "@/app/lib/metaPixel";

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Full-viewport quiz orchestrator for /go/[slug]. Renders whatever the
 * config's screens array describes; owns sequencing, back navigation,
 * the answers map, score tally and all analytics. The page renders no
 * Navigation/Footer, so the quiz owns the viewport.
 */
export default function QuizEngine({ config }: { config: LandingConfig }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [sessionId] = useState(generateSessionId);
  const startTimeRef = useRef(0);
  const resultsFiredRef = useRef(false);

  const screens = config.screens;
  const screen = screens[index];
  const base = {
    slug: config.slug,
    persona: config.persona,
    format: config.format,
    sessionId,
  };

  const questionIds = useMemo(
    () => screens.filter((s) => s.kind === "question").map((s) => s.id),
    [screens],
  );
  const totalQuestions = questionIds.length;
  const questionNumber =
    screen.kind === "question" ? questionIds.indexOf(screen.id) + 1 : 0;

  const resultBucket: ResultBucket = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const bucket of config.buckets) totals[bucket.id] = 0;
    for (const answer of Object.values(answers)) {
      for (const [bucketId, points] of Object.entries(answer.scores ?? {})) {
        totals[bucketId] = (totals[bucketId] ?? 0) + points;
      }
    }
    return config.buckets.reduce(
      (best, bucket) => (totals[bucket.id] > totals[best.id] ? bucket : best),
      config.buckets[0],
    );
  }, [answers, config.buckets]);

  /** Brain-age mode: baseline + clamped years gap (null until the
   *  baseline question is answered, and always null in bucket mode) */
  const ages: BrainAgeResult | null = useMemo(() => {
    if (config.scoring?.mode !== "brain-age") return null;
    let baseline: number | null = null;
    let years = 0;
    for (const answer of Object.values(answers)) {
      if (typeof answer.baselineAge === "number") baseline = answer.baselineAge;
      years += answer.years ?? 0;
    }
    if (baseline === null) return null;
    const gap = Math.min(
      Math.max(Math.round(years), config.scoring.gapMin),
      config.scoring.gapMax,
    );
    return { realAge: baseline, brainAge: baseline + gap, gap };
  }, [answers, config.scoring]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    trackLandingStarted(base);
    trackMetaViewContent({
      content_ids: [config.slug],
      content_name: config.title,
    });
    // Mount-only: base/config are stable for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    trackLandingScreenViewed({
      ...base,
      screenIndex: index,
      screenId: screen.id,
      screenKind: screen.kind,
      totalScreens: screens.length,
    });
    // Fire once per screen change only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (screen.kind !== "results" || resultsFiredRef.current) return;
    resultsFiredRef.current = true;
    const timeSpentSeconds = Math.floor(
      (Date.now() - startTimeRef.current) / 1000,
    );
    trackLandingCompleted({
      ...base,
      resultBucket: resultBucket.id,
      totalQuestions,
      timeSpentSeconds,
      ...(ages ? { brainAge: ages.brainAge, brainAgeGap: ages.gap } : {}),
    });
    trackLandingResultsViewed({
      ...base,
      resultBucket: resultBucket.id,
      ...(ages ? { brainAge: ages.brainAge, brainAgeGap: ages.gap } : {}),
    });
    trackMetaLead({ content_name: config.title, content_category: config.slug });
    // Fire once on reaching results; guarded by resultsFiredRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.kind]);

  const goNext = useCallback(
    () => setIndex((i) => Math.min(i + 1, screens.length - 1)),
    [screens.length],
  );
  const goBack = () =>
    setIndex((i) => {
      let prev = Math.max(i - 1, 0);
      // Landing back on analyzing would just auto-play forward again;
      // step past it to the last real screen (e.g. reveal -> Q11)
      while (prev > 0 && screens[prev].kind === "analyzing") prev -= 1;
      return prev;
    });

  const handleAnswer = (question: QuestionScreen, answer: QuizAnswer) => {
    setAnswers((a) => ({ ...a, [question.id]: answer }));
    trackLandingAnswerSelected({
      ...base,
      screenId: question.id,
      questionNumber: questionIds.indexOf(question.id) + 1,
      totalQuestions,
      answerLabel: answer.label,
      answerValue: String(answer.value),
    });
    goNext();
  };

  const ctaHref = resultBucket.ctaHref ?? config.resultsCta.href;
  const canGoBack =
    index > 0 && screen.kind !== "analyzing" && screen.kind !== "results";
  const progress = screens.length > 1 ? index / (screens.length - 1) : 0;
  const dark = config.theme === "dark";

  return (
    <div
      className={`brand-clinical go-quiz${dark ? " go-dark" : ""} flex min-h-[100dvh] flex-col`}
      style={{
        backgroundColor: "var(--go-bg)",
        color: "var(--go-text)",
      }}
    >
      {/* Fixed header: logo centred with breathing room, wide thick bar below */}
      <header
        className="fixed inset-x-0 top-0 z-10"
        style={{ backgroundColor: "var(--go-bg)" }}
      >
        <div className="relative flex h-14 items-end justify-center pt-4">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label="Back"
            className={`go-text-soft absolute bottom-1 left-3 px-2 py-1 text-2xl leading-none transition-opacity duration-150 ${
              canGoBack ? "" : "opacity-0"
            }`}
          >
            {"←"}
          </button>
          <Image
            src="/conka-logo.webp"
            alt="CONKA logo"
            width={440}
            height={112}
            className={`h-10 w-auto${dark ? " invert" : ""}`}
            priority
          />
          {questionNumber > 0 && (
            <span
              className="go-text-faint absolute bottom-2 right-4 text-sm tabular-nums"
              style={{ fontFamily: "var(--font-brand-data)" }}
            >
              {questionNumber}/{totalQuestions}
            </span>
          )}
        </div>
        {/* No bar on the landing screen; wide, near full content width */}
        {index > 0 && (
          <div className="mx-auto w-full max-w-2xl px-5 pb-3 pt-3.5">
            <QuizProgressBar progress={progress} />
          </div>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-6 pt-28 text-center">
        <div key={index} className="go-screen-enter flex flex-1 flex-col">
          {screen.kind === "landing" && (
            <LandingView screen={screen} onStart={goNext} />
          )}
          {screen.kind === "question" && (
            <QuizQuestion
              screen={screen}
              initial={answers[screen.id]}
              onAnswer={(answer) => handleAnswer(screen, answer)}
            />
          )}
          {screen.kind === "interstitial" && (
            <InterstitialView
              screen={screen}
              answers={answers}
              onContinue={goNext}
            />
          )}
          {screen.kind === "analyzing" && (
            <AnalyzingView screen={screen} onComplete={goNext} />
          )}
          {screen.kind === "reveal" && (
            <RevealView screen={screen} ages={ages} onContinue={goNext} />
          )}
          {screen.kind === "results" && (
            <ResultsView
              bucket={{
                ...resultBucket,
                title: fillAgeTokens(resultBucket.title, ages),
                body: fillAgeTokens(resultBucket.body, ages),
                recommendation: fillAgeTokens(resultBucket.recommendation, ages),
              }}
              ctaLabel={config.resultsCta.label}
              ctaHref={ctaHref}
              onCtaClick={() =>
                trackLandingCtaClicked({
                  ...base,
                  resultBucket: resultBucket.id,
                  destination: ctaHref,
                })
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}
