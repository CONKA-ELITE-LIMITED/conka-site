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
import { trackCognitiveTest } from "@/app/lib/klaviyo";

const BENEFIT_SPECS_MOBILE: { label: string; value: string; note: string }[] = [
  { label: "Validation", value: "Clinical", note: "Cambridge" },
  { label: "Results", value: "~ 30s", note: "Instant" },
  { label: "Profile", value: "Personal", note: "Benchmarked" },
];

function BenefitsSpecStripMobile() {
  return (
    <div className="grid grid-cols-3 gap-0 border border-white/12 bg-white/10 mt-6">
      {BENEFIT_SPECS_MOBILE.map((b, i) => (
        <div
          key={b.label}
          className={`p-3 ${i < BENEFIT_SPECS_MOBILE.length - 1 ? "border-r border-white/10" : ""}`}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
            {b.label}
          </p>
          <p className="font-mono text-base font-bold tabular-nums text-white mt-2 leading-none">
            {b.value}
          </p>
          <p className="font-mono text-[8px] text-white/50 mt-2 leading-tight tabular-nums">
            {b.note}
          </p>
        </div>
      ))}
    </div>
  );
}

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
    setTestState("email");
  }, []);

  const handleBackToIdle = useCallback(() => {
    setTestState("idle");
  }, []);

  const handleEmailSubmit = useCallback((submission: EmailSubmission) => {
    setEmailSubmission(submission);
    setTestState("testing");
  }, []);

  const handleTestComplete = useCallback((result: TestResult) => {
    setTestResult(result);
    setTestState("processing");
  }, []);

  const handleProcessingComplete = useCallback(() => {
    setTestState("results");

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
      {/* Header */}
      <div className="mb-6">
        <h2
          id="cognitive-test-heading"
          className="brand-h2 max-w-[24ch]"
          style={{ letterSpacing: "-0.02em", color: "#ffffff" }}
        >
          Measure your cognitive performance.
        </h2>
      </div>

      {/* Content Area */}
      <div className="flex flex-col">
        {testState === "idle" && (
          <div className="w-full">
            <CognitiveTestIdleCard onStart={handleStartTest} />
            <BenefitsSpecStripMobile />
          </div>
        )}

        {testState === "email" && (
          <div className="w-full">
            <div className="bg-white/10 border border-white/12 p-5">
              <EmailCaptureForm
                onSubmit={handleEmailSubmit}
                onBack={handleBackToIdle}
              />
            </div>
            <BenefitsSpecStripMobile />
          </div>
        )}

        {testState === "testing" && (
          <div className="w-full">
            <div className="flex items-center justify-between border border-white/12 border-b-0 bg-white/10 px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 tabular-nums">
                Fig. 07 · SDK
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white tabular-nums flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-white animate-pulse" />
                Live
              </p>
            </div>

            <div className="min-h-[500px] overflow-hidden border border-white/12 bg-[#111111]">
              <CognicaSDK
                onComplete={handleTestComplete}
                subjectId={subjectId}
              />
            </div>

            <div className="grid grid-cols-3 gap-0 border border-white/12 border-t-0 bg-white/10">
              <div className="p-3 border-r border-white/10">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
                  Animals
                </p>
                <p className="font-mono text-xs font-bold tabular-nums text-white mt-2 leading-none">
                  Tap right
                </p>
              </div>
              <div className="p-3 border-r border-white/10">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
                  Else
                </p>
                <p className="font-mono text-xs font-bold tabular-nums text-white mt-2 leading-none">
                  Tap left
                </p>
              </div>
              <div className="p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
                  Scored
                </p>
                <p className="font-mono text-xs font-bold tabular-nums text-white mt-2 leading-none">
                  Speed + Acc.
                </p>
              </div>
            </div>
          </div>
        )}

        {testState === "processing" && (
          <div className="w-full">
            <CognitiveTestLoader onComplete={handleProcessingComplete} />
          </div>
        )}

        {testState === "results" && testResult && (
          <div className="w-full space-y-4">
            <CognitiveTestScores
              result={testResult}
              email={emailSubmission?.email}
            />
            <CognitiveTestRecommendation result={testResult} />
            <CognitiveTestAppPromo />
            <div className="flex justify-start">
              <button
                onClick={handleRetakeTest}
                className="inline-flex items-center gap-3 bg-transparent border border-white/30 text-white font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums px-5 py-3.5 lab-clip-tr transition-colors hover:bg-white/10 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span>Play again</span>
                <span aria-hidden>↻</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
