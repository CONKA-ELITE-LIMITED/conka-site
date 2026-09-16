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
        setConsentError("Tick the box to get your results");
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
    <div className="flex h-full flex-col text-black">
      <button
        onClick={onBack}
        className="mb-4 inline-flex min-h-[44px] items-center gap-2 self-start text-sm font-semibold text-black/60 transition-colors hover:text-black"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <div className="mb-6">
        <h3
          className="mb-2 text-2xl font-semibold leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Where should we send your results?
        </h3>
        <p className="text-base leading-relaxed text-black/70">
          Your score, what it means, and how to track it in the app.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col space-y-5">
        <div>
          <label
            htmlFor="email-capture"
            className="mb-2 block text-sm font-semibold"
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
            className={`w-full rounded-md border bg-white p-3 text-base text-black placeholder-black/35 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)]/20 ${
              emailError
                ? "border-red-500"
                : "border-black/15 focus:border-[var(--brand-navy)]"
            }`}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {emailError && (
            <p className="mt-2 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (consentError) setConsentError("");
                }}
                className="peer sr-only"
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--brand-navy)] peer-focus-visible:ring-offset-2 ${
                  consentError ? "border-red-500" : "border-black/30"
                } ${
                  consent
                    ? "border-[var(--brand-navy)] bg-[var(--brand-navy)]"
                    : "bg-white"
                }`}
              >
                {consent && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-relaxed text-black/75">
              Email me my results and news from CONKA. Unsubscribe anytime.
            </span>
          </label>
          {consentError && (
            <p className="ml-8 mt-2 text-sm text-red-600">{consentError}</p>
          )}
        </div>

        <div className="flex-1" />

        <button
          type="submit"
          disabled={!isFormValid}
          className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--brand-navy)] px-6 py-3.5 text-base font-semibold text-white transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] focus-visible:ring-offset-2 ${
            !isFormValid
              ? "cursor-not-allowed opacity-40"
              : "hover:opacity-90 active:opacity-80"
          }`}
        >
          Start the test
        </button>
      </form>
    </div>
  );
}
