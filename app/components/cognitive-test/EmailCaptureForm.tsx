"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { EmailCaptureFormProps, EmailSubmission } from "./types";

export default function EmailCaptureForm({
  onSubmit,
  onBack,
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [consentError, setConsentError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setEmailError("");
      setConsentError("");

      let hasError = false;

      if (!email.trim()) {
        setEmailError("Email is required");
        hasError = true;
      } else if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address");
        hasError = true;
      }

      if (!consent) {
        setConsentError("You must agree to receive your results");
        hasError = true;
      }

      if (hasError) return;

      const submission: EmailSubmission = {
        email: email.trim(),
        consentGiven: consent,
        submittedAt: new Date(),
      };

      onSubmit(submission);
    },
    [email, consent, onSubmit],
  );

  const isFormValid = email.trim() !== "" && validateEmail(email) && consent;

  return (
    <div className="flex flex-col h-full text-white">
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 hover:text-white transition-colors mb-6 self-start tabular-nums"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 tabular-nums">
          Step 01 · Email · Before You Begin
        </p>
        <h3
          className="brand-h3 text-white mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          We&apos;ll send you the full breakdown.
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 tabular-nums">
          Detailed results · Personal benchmarks · In-app follow-up
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email-capture"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 block mb-2 tabular-nums"
          >
            Email address
          </label>
          <input
            ref={emailInputRef}
            type="email"
            id="email-capture"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            className={`w-full border bg-white/[0.08] p-3 text-base text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors ${
              emailError ? "border-red-400" : "border-white/20 focus:border-white/50"
            }`}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {emailError && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-400 mt-2 tabular-nums">
              {emailError}
            </p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (consentError) setConsentError("");
                }}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                  consentError
                    ? "border-red-400"
                    : "border-white/30"
                } ${consent ? "bg-white border-white" : "bg-transparent"}`}
              >
                {consent && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-white/75 leading-relaxed">
              I agree to receive my cognitive test results via email
            </span>
          </label>
          {consentError && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-400 mt-2 ml-8 tabular-nums">
              {consentError}
            </p>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`inline-flex items-center justify-center gap-3 w-full bg-white text-black font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-6 py-4 lab-clip-tr transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 ${
            !isFormValid ? "opacity-40 cursor-not-allowed" : "hover:opacity-85 active:opacity-70"
          }`}
        >
          <span>Continue to game</span>
          <span aria-hidden>↗</span>
        </button>
      </form>
    </div>
  );
}
