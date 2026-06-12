"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
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
      for (const [bucketId, points] of Object.entries(answer.scores)) {
        totals[bucketId] = (totals[bucketId] ?? 0) + points;
      }
    }
    return config.buckets.reduce(
      (best, bucket) => (totals[bucket.id] > totals[best.id] ? bucket : best),
      config.buckets[0],
    );
  }, [answers, config.buckets]);

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
    });
    trackLandingResultsViewed({ ...base, resultBucket: resultBucket.id });
    trackMetaLead({ content_name: config.title, content_category: config.slug });
    // Fire once on reaching results; guarded by resultsFiredRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.kind]);

  const goNext = useCallback(
    () => setIndex((i) => Math.min(i + 1, screens.length - 1)),
    [screens.length],
  );
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));

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
  const showChrome = screen.kind !== "landing";
  const canGoBack =
    index > 0 && screen.kind !== "analyzing" && screen.kind !== "results";
  const progress = screens.length > 1 ? index / (screens.length - 1) : 0;

  return (
    <div className="brand-clinical flex min-h-[100dvh] flex-col bg-white text-black">
      <header className="mx-auto w-full max-w-xl px-5 pt-5">
        {showChrome ? (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack}
              aria-label="Back"
              className={`-ml-2 px-2 py-1 text-xl leading-none text-black/60 transition-opacity duration-150 ${
                canGoBack ? "" : "opacity-0"
              }`}
            >
              {"←"}
            </button>
            <QuizProgressBar progress={progress} />
            <span
              className="min-w-8 text-right text-xs tabular-nums text-black/50"
              style={{ fontFamily: "var(--font-brand-data)" }}
            >
              {questionNumber > 0 ? `${questionNumber}/${totalQuestions}` : ""}
            </span>
          </div>
        ) : (
          <p
            className="text-center text-sm font-medium uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-brand-data)" }}
          >
            CONKA
          </p>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-6 pt-6">
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
            <InterstitialView screen={screen} onContinue={goNext} />
          )}
          {screen.kind === "analyzing" && (
            <AnalyzingView screen={screen} onComplete={goNext} />
          )}
          {screen.kind === "results" && (
            <ResultsView
              screen={screen}
              bucket={resultBucket}
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
