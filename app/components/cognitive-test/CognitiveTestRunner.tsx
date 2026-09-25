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
 * The engine in the real app's look: its default grey left half, black right
 * half and white pill for Start. Only the font is the site's.
 */
const SITE_THEME: EngineTheme = {
  fontFamily: "var(--font-brand-primary)",
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
