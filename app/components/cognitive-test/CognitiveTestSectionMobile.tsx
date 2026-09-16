"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  TestState,
  TestResult,
  EmailSubmission,
  CognitiveTestSectionProps,
} from "./types";
import EmailCaptureForm from "./EmailCaptureForm";
import CognicaSDK from "./CognicaSDK";
import CognitiveTestIdleCard from "./CognitiveTestIdleCard";
import CognitiveTestLoader from "./CognitiveTestLoader";
import CognitiveTestScores from "./CognitiveTestScores";
import CognitiveTestRecommendation from "./CognitiveTestRecommendation";
import CognitiveTestAppPromo from "./CognitiveTestAppPromo";
import { trackCognitiveTest, subscribeAppTestSignup } from "@/app/lib/klaviyo";
import {
  trackAppTestClicked,
  trackAppEmailSubmitted,
  trackAppResultsViewed,
} from "@/app/lib/analytics";

export default function CognitiveTestSectionMobile({
  className = "",
}: CognitiveTestSectionProps) {
  const [testState, setTestState] = useState<TestState>("idle");
  const [emailSubmission, setEmailSubmission] =
    useState<EmailSubmission | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const subjectId = useMemo(() => {
    if (emailSubmission) {
      return `website_${emailSubmission.submittedAt.getTime()}`;
    }
    return `website_${Date.now()}`;
  }, [emailSubmission]);

  const handleStartTest = useCallback(() => {
    trackAppTestClicked();
    setTestState("email");
  }, []);

  const handleBackToIdle = useCallback(() => {
    setTestState("idle");
  }, []);

  const handleEmailSubmit = useCallback((submission: EmailSubmission) => {
    // Capture the signup now, not at the end, so a visitor who drops out
    // mid-test is still on the list (SCRUM-1360).
    void subscribeAppTestSignup(submission.email);
    trackAppEmailSubmitted();
    setEmailSubmission(submission);
    setTestState("testing");
  }, []);

  const handleTestComplete = useCallback((result: TestResult) => {
    setTestResult(result);
    setTestState("processing");
  }, []);

  const handleProcessingComplete = useCallback(() => {
    setTestState("results");

    if (testResult) trackAppResultsViewed();

    if (emailSubmission && testResult) {
      trackCognitiveTest(
        emailSubmission.email,
        testResult.score,
        testResult.accuracy,
        testResult.speed,
      ).catch((err) => {
        console.error("Failed to track to Klaviyo:", err);
      });
    }
  }, [emailSubmission, testResult]);

  const handleRetakeTest = useCallback(() => {
    setTestResult(null);
    setTestState("idle");
  }, []);

  return (
    <div className={className}>
      <div className="mb-8 max-w-2xl">
        <h2
          id="cognitive-test-heading"
          className="brand-h2 mb-3 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          Get your baseline now.
        </h2>
        <p className="text-lg leading-relaxed text-black/75">
          Try a short version of the CONKA test right here. It takes about 30
          seconds, and we will email you your results.
        </p>
      </div>

      <div className="flex flex-col">
        {testState === "idle" && (
          <div className="w-full">
            <CognitiveTestIdleCard onStart={handleStartTest} />
          </div>
        )}

        {testState === "email" && (
          <div className="w-full rounded-lg bg-[#eef0f5] p-5 text-black lg:p-10">
            <EmailCaptureForm
              onSubmit={handleEmailSubmit}
              onBack={handleBackToIdle}
            />
          </div>
        )}

        {testState === "testing" && (
          <div className="w-full">
            <div className="min-h-[500px] overflow-hidden rounded-lg bg-[#111111] ring-1 ring-black/10">
              <CognicaSDK
                onComplete={handleTestComplete}
                subjectId={subjectId}
              />
            </div>
            <p className="mt-3 text-sm text-black/70">
              Tap right when you see an animal, and left for anything else.
              Scored on speed and accuracy.
            </p>
          </div>
        )}

        {testState === "processing" && (
          <div className="w-full">
            <CognitiveTestLoader onComplete={handleProcessingComplete} />
          </div>
        )}

        {testState === "results" && testResult && (
          <div className="w-full space-y-4 lg:space-y-5">
            <CognitiveTestScores
              result={testResult}
              email={emailSubmission?.email}
            />
            <CognitiveTestRecommendation result={testResult} />
            <CognitiveTestAppPromo />
            <button
              onClick={handleRetakeTest}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-[var(--brand-navy)] px-6 text-base font-semibold text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-navy)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] focus-visible:ring-offset-2"
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
