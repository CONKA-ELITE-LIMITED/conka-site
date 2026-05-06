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

const BENEFIT_SPECS: { label: string; value: string; note: string }[] = [
  { label: "Validation", value: "Clinical", note: "Cambridge-derived" },
  { label: "Results", value: "~ 30s", note: "Instant score" },
  { label: "Profile", value: "Personal", note: "Benchmarked" },
];

function BenefitsSpecStrip() {
  return (
    <div className="grid grid-cols-3 gap-0 border border-white/12 bg-white/[0.03] mt-8">
      {BENEFIT_SPECS.map((b, i) => (
        <div
          key={b.label}
          className={`p-4 ${i < BENEFIT_SPECS.length - 1 ? "border-r border-white/10" : ""}`}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
            {b.label}
          </p>
          <p className="font-mono text-xl font-bold tabular-nums text-white mt-2 leading-none">
            {b.value}
          </p>
          <p className="font-mono text-[9px] text-white/50 mt-2 leading-tight tabular-nums">
            {b.note}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function CognitiveTestSection({
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
      <div className="mb-10">
        <h2
          id="cognitive-test-heading"
          className="brand-h2 max-w-[24ch]"
          style={{ letterSpacing: "-0.02em", color: "#ffffff" }}
        >
          Measure your cognitive performance.
        </h2>
      </div>

      {/* Content Area - Changes based on state */}
      <div className="flex flex-col items-start">
        {/* IDLE STATE */}
        {testState === "idle" && (
          <div className="w-full max-w-2xl">
            <CognitiveTestIdleCard onStart={handleStartTest} />
            <BenefitsSpecStrip />
          </div>
        )}

        {/* EMAIL STATE */}
        {testState === "email" && (
          <div className="w-full max-w-2xl">
            <div className="bg-white/10 border border-white/12 p-6 lg:p-10">
              <EmailCaptureForm
                onSubmit={handleEmailSubmit}
                onBack={handleBackToIdle}
              />
            </div>
            <BenefitsSpecStrip />
          </div>
        )}

        {/* TESTING STATE */}
        {testState === "testing" && (
          <div className="w-full">
            {/* Top spec bar */}
            <div className="flex items-center justify-between border border-white/12 border-b-0 bg-white/10 px-4 py-2.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 tabular-nums">
                Fig. 07 · Cognetivity SDK
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white tabular-nums flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-white animate-pulse" />
                Live session · In progress
              </p>
            </div>

            {/* SDK frame */}
            <div className="relative h-[650px] overflow-hidden border border-white/12 bg-[#111111]">
              <div
                className="absolute top-0 left-0"
                style={{
                  width: "90.91%",
                  height: "90.91%",
                  transform: "scale(1.1)",
                  transformOrigin: "top left",
                }}
              >
                <CognicaSDK
                  onComplete={handleTestComplete}
                  subjectId={subjectId}
                />
              </div>
            </div>

            {/* Bottom spec strip */}
            <div className="grid grid-cols-3 gap-0 border border-white/12 border-t-0 bg-white/10">
              <div className="p-4 border-r border-white/10">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
                  Animals
                </p>
                <p className="font-mono text-sm font-bold tabular-nums text-white mt-2 leading-none">
                  Press J
                </p>
              </div>
              <div className="p-4 border-r border-white/10">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
                  Anything else
                </p>
                <p className="font-mono text-sm font-bold tabular-nums text-white mt-2 leading-none">
                  Press F
                </p>
              </div>
              <div className="p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
                  Scored on
                </p>
                <p className="font-mono text-sm font-bold tabular-nums text-white mt-2 leading-none">
                  Speed + Accuracy
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PROCESSING STATE */}
        {testState === "processing" && (
          <div className="w-full max-w-2xl">
            <CognitiveTestLoader onComplete={handleProcessingComplete} />
          </div>
        )}

        {/* RESULTS STATE */}
        {testState === "results" && testResult && (
          <div className="w-full max-w-2xl space-y-6">
            <CognitiveTestScores
              result={testResult}
              email={emailSubmission?.email}
            />
            <CognitiveTestRecommendation result={testResult} />
            <CognitiveTestAppPromo />
            <div className="flex justify-start">
              <button
                onClick={handleRetakeTest}
                className="inline-flex items-center gap-3 bg-transparent border border-white/30 text-white font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-6 py-4 lab-clip-tr transition-colors hover:bg-white/10 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2"
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
