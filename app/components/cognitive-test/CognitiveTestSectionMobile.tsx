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
    <div className="grid grid-cols-3 gap-0 border border-black/12 bg-white mt-6">
      {BENEFIT_SPECS_MOBILE.map((b, i) => (
        <div
          key={b.label}
          className={`p-3 ${i < BENEFIT_SPECS_MOBILE.length - 1 ? "border-r border-black/8" : ""}`}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
            {b.label}
          </p>
          <p className="font-mono text-base font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
            {b.value}
          </p>
          <p className="font-mono text-[8px] text-black/50 mt-2 leading-tight tabular-nums">
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
    console.log("Email submitted:", submission.email);
  }, []);

  const handleTestComplete = useCallback((result: TestResult) => {
    setTestResult(result);
    setTestState("processing");
    console.log("Test completed:", result);
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
      {/* Trio header */}
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
          {"// Test your brain · APP-01"}
        </p>
        <h2
          id="cognitive-test-heading"
          className="brand-h2 text-black mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          Measure your cognitive performance.
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          Short version · Clinically derived
        </p>
      </div>

      {/* Content Area - Changes based on state */}
      <div className="flex flex-col">
        {/* IDLE STATE */}
        {testState === "idle" && (
          <div className="w-full">
            <CognitiveTestIdleCard onStart={handleStartTest} />
            <BenefitsSpecStripMobile />
          </div>
        )}

        {/* EMAIL STATE */}
        {testState === "email" && (
          <div className="w-full">
            <div className="bg-white border border-black/12 p-5">
              <EmailCaptureForm
                onSubmit={handleEmailSubmit}
                onBack={handleBackToIdle}
              />
            </div>
            <BenefitsSpecStripMobile />
          </div>
        )}

        {/* TESTING STATE */}
        {testState === "testing" && (
          <div className="w-full">
            {/* Top spec bar */}
            <div className="flex items-center justify-between border border-black/12 border-b-0 bg-white px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/50 tabular-nums">
                Fig. 07 · SDK
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#1B2757] tabular-nums flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#1B2757] animate-pulse" />
                Live
              </p>
            </div>

            {/* SDK frame */}
            <div className="min-h-[500px] overflow-hidden border border-black/12 bg-[#f5f5f5]">
              <CognicaSDK
                onComplete={handleTestComplete}
                subjectId={subjectId}
              />
            </div>

            {/* Bottom spec strip */}
            <div className="grid grid-cols-3 gap-0 border border-black/12 border-t-0 bg-white">
              <div className="p-3 border-r border-black/8">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                  Animals
                </p>
                <p className="font-mono text-xs font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                  Tap right
                </p>
              </div>
              <div className="p-3 border-r border-black/8">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                  Else
                </p>
                <p className="font-mono text-xs font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                  Tap left
                </p>
              </div>
              <div className="p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                  Scored
                </p>
                <p className="font-mono text-xs font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                  Speed + Acc.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PROCESSING STATE */}
        {testState === "processing" && (
          <div className="w-full">
            <CognitiveTestLoader onComplete={handleProcessingComplete} />
          </div>
        )}

        {/* RESULTS STATE */}
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
                className="inline-flex items-center gap-3 bg-white border border-black/25 text-[#1B2757] font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums px-5 py-3.5 lab-clip-tr transition-colors hover:border-[#1B2757] hover:bg-[#1B2757] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757] focus-visible:ring-offset-2"
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
