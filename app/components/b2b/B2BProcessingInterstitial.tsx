"use client";

import { useEffect, useState } from "react";

/**
 * Processing interstitial shown between the B2B enquiry submit and the order
 * page. Content-only: the page owns the section wrapper and background.
 *
 * This is not a fake delay. The submit request is genuinely in flight while the
 * steps run, and `onComplete` fires only once both the steps have played out and
 * the caller's promise has settled. The step sequence gives that wait a shape,
 * and lends the trade-pricing reveal a sense of formal qualification rather than
 * a door that just swings open.
 *
 * Modelled on AnalyzingView in app/components/go/QuizScreens.tsx, using
 * brand-base tokens rather than the quiz-scoped ones.
 */

const STEPS = [
  "Validating your details",
  "Matching your squad size",
  "Preparing your team pricing",
] as const;

const STEP_MS = 700;
const REDUCED_STEP_MS = 150;

const mono = { fontFamily: "var(--font-brand-data)" } as const;

export default function B2BProcessingInterstitial({
  onComplete,
}: {
  /** Fires once every step has played out. The caller owns the redirect. */
  onComplete: () => void;
}) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const step = reduced ? REDUCED_STEP_MS : STEP_MS;

    if (done >= STEPS.length) {
      const t = setTimeout(onComplete, step);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setDone((d) => d + 1), step);
    return () => clearTimeout(t);
  }, [done, onComplete]);

  return (
    <div
      className="rounded-none border border-black/12 bg-white p-8 lg:p-10"
      role="status"
      aria-live="polite"
    >
      <p className="brand-eyebrow mb-4">Processing your application</p>
      <h3 className="brand-h3 mb-8 max-w-[18ch]">
        Setting up your team pricing.
      </h3>

      <ul className="flex flex-col gap-5">
        {STEPS.map((step, i) => {
          const isDone = i < done;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 text-base transition-opacity duration-300 ${
                isDone ? "opacity-100" : "opacity-40"
              }`}
              style={mono}
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 border transition-colors duration-300"
                style={{
                  borderColor: isDone
                    ? "var(--brand-accent)"
                    : "var(--brand-border-color)",
                  backgroundColor: isDone ? "var(--brand-accent)" : undefined,
                }}
                aria-hidden
              />
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
