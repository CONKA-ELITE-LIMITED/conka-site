"use client";

import { useCallback } from "react";
import {
  CognitiveTestEngine,
  type EngineResult,
  type EngineTheme,
} from "./engine";
import { CONKA_APP_API_ORIGIN } from "@/app/lib/conkaAppApi";
import type { TestResult } from "./types";

/**
 * The engine in the site's Simple DTC look: a navy left half, a deep grey right
 * half, white text and a white pill for Start. Plain brand tokens only, which
 * the engine's custom properties resolve against the page (no color-mix, so
 * older Safari renders it too).
 */
const SITE_THEME: EngineTheme = {
  leftBackground: "var(--brand-navy)",
  rightBackground: "var(--brand-deep-grey)",
  text: "var(--brand-white)",
  mutedText: "var(--brand-neutral)",
  accent: "var(--brand-white)",
  accentText: "var(--brand-navy)",
  fontFamily: "var(--font-brand-primary)",
  radius: "9999px",
};

interface CognitiveTestRunnerProps {
  onComplete: (result: TestResult) => void;
  /** Sizing for the test surface; the engine fills it. */
  className?: string;
}

/**
 * The live test on /app: the portable engine, themed to the site, scored by
 * the CONKA app server. Rounds the server's scores for display; Klaviyo gets
 * the same numbers, rounded server-side from the same test_stats row.
 */
export default function CognitiveTestRunner({ onComplete, className = "" }: CognitiveTestRunnerProps) {
  const handleComplete = useCallback(
    (result: EngineResult) =>
      onComplete({
        score: Math.round(result.score),
        accuracy: Math.round(result.accuracy),
        speed: Math.round(result.speed),
        testInstanceId: result.testInstanceId,
      }),
    [onComplete],
  );

  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <CognitiveTestEngine apiBaseUrl={CONKA_APP_API_ORIGIN} theme={SITE_THEME} onComplete={handleComplete} />
    </div>
  );
}
