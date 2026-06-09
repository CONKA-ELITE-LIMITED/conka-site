"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics/react";

/**
 * Plain-English explainer of the per-user delta methodology that powers
 * every chart on /app-insights. Sits above the filter so educated
 * readers can see the rigor before the data, and laymen can skip past
 * it without feeling locked out.
 *
 * Closed by default on mobile, opens after mount on desktop. Initial
 * server render is closed for everyone to avoid hydration mismatch.
 *
 * Component is content-only. Page wraps it in brand-section + brand-track.
 */
export default function MethodologyInThirtySeconds() {
  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 1024) {
      // One-shot post-mount check; deliberate, not a render-cascade.
       
      setOpen(true);
    }
  }, []);

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      try {
        track("insights_methodology_open", {
          location: "app-insights-readability",
        });
      } catch {
        // analytics fail silently
      }
    }
  }

  return (
    <div className="border border-white/15 bg-white/[0.04]">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls="methodology-thirty-seconds-content"
        className="w-full flex items-center justify-between gap-4 px-5 py-4 lg:px-6 lg:py-5 text-left min-h-[44px] focus:outline-none focus-visible:border-white/60"
      >
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums">
            {"// Methodology in 30 seconds"}
          </span>
          <span className="text-sm lg:text-base text-white font-medium">
            We compare you to you, not you to other people.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 tabular-nums shrink-0">
          {open ? "Hide" : "Open"}
        </span>
      </button>

      {open ? (
        <div
          id="methodology-thirty-seconds-content"
          className="px-5 pb-6 pt-1 lg:px-6 lg:pb-7 border-t border-white/10"
        >
          {/* Per-user delta visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 mb-6">
            <div className="border border-white/10 bg-white/[0.03] p-4 lg:p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45 tabular-nums mb-2">
                The simple way (misleading)
              </p>
              <p className="text-sm text-white/65 leading-snug">
                Average every drinker against every non-drinker. Whoever
                naturally scores higher wins, regardless of the drinking.
              </p>
            </div>
            <div className="border border-white/30 bg-white/[0.10] p-4 lg:p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 tabular-nums mb-2">
                What we do (per-user delta)
              </p>
              <p className="text-sm text-white leading-snug">
                Build each user&apos;s own baseline from their clean-state
                tests. Measure their impaired-state tests against that
                baseline. Average the personal changes.
              </p>
            </div>
          </div>

          <p className="text-sm text-white/85 leading-relaxed mb-4 max-w-[68ch]">
            The question stops being &ldquo;are drinkers worse than non-drinkers&rdquo;
            and becomes &ldquo;how much does this person change relative to their
            own normal.&rdquo; That&apos;s the only honest way to compare an
            impaired state against a baseline using observational app data.
          </p>

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-3">
            {"// What this method can and can't do"}
          </p>
          <ul className="text-sm text-white/80 leading-relaxed flex flex-col gap-1.5 max-w-[68ch]">
            <li>· Observational, not a controlled clinical trial.</li>
            <li>
              · Each user must have tests in both conditions to be included,
              which is why some sample sizes are smaller than the topline user
              count.
            </li>
            <li>
              · Where the per-condition sample is too thin to defend a CONKA
              effect, we mark it Early signal or skip the claim entirely.
            </li>
            <li>
              · Wellness factors (alcohol, fatigue, stress, readiness) are
              self-reported in the app at the moment of testing.
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
