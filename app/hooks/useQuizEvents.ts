"use client";

import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/** Identity carried on every event, stable for the life of the quiz page. */
export interface QuizEventBase {
  sessionId: string;
  slug: string;
  persona: string;
  format: string;
}

export type QuizEventType =
  | "started"
  | "screen_viewed"
  | "answer_selected"
  | "completed"
  | "cta_clicked";

/** Per-event payload. All optional; only the fields relevant to the type are set. */
export interface QuizEventPayload {
  screenIndex?: number;
  screenId?: string;
  screenKind?: string;
  totalScreens?: number;
  questionNumber?: number;
  answerValue?: string;
  answerLabel?: string;
  resultBucket?: string;
  brainAge?: number;
  brainAgeGap?: number;
  timeSpentSeconds?: number;
  destination?: string;
}

/** Read referrer + UTM once, attached only to the `started` event. */
function attribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    referrer: document.referrer || undefined,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
  };
}

/**
 * Durable Convex capture for the /go quiz engine, mirroring the
 * `trackLanding*` Vercel events. Every write is fire-and-forget with a
 * silent catch: persistence must never block or break the quiz UX (same
 * contract as analytics.ts safeTrack). See featurePlans/quiz-insights.md.
 */
export function useQuizEvents(base: QuizEventBase) {
  const recordEvent = useMutation(api.quizEvents.record);

  return useCallback(
    (type: QuizEventType, payload: QuizEventPayload = {}) => {
      try {
        void recordEvent({
          ...base,
          type,
          ts: Date.now(),
          ...payload,
          ...(type === "started" ? attribution() : {}),
        }).catch(() => {
          // Swallow async rejection: a failed write must never surface.
        });
      } catch {
        // Swallow sync throw too (e.g. client not ready). Persistence is
        // strictly best-effort and must never break the quiz UX.
      }
    },
    [recordEvent, base],
  );
}
