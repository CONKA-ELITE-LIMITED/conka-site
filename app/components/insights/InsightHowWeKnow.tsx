"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics/react";
import {
  Bottles,
  PhoneScreen,
  StatTile,
  type LoopStat,
} from "@/app/components/appv2/AppLoopVisuals";

/* ============================================================================
 * InsightHowWeKnow (SCRUM-1522, Simple DTC)
 *
 * Answers the sceptic's question after the findings, not before: how does a
 * supplement brand have this data, and why trust it? Merges the old "How
 * this is possible" module and "Methodology in 30 seconds".
 *
 * Glance layer: the method as a headline (we compare you to you), three
 * visual steps in the /app loop banner style, and the test's four
 * credentials as stat tiles. Depth, in two one-at-a-time accordions: the per-user delta method with its limits, and
 * the verbatim validation note (cited references kept exact).
 *
 * Events kept from the old modules: `insights_credibility_view` when the
 * section is in view, `insights_methodology_open` the first time the method
 * accordion opens. Content-only.
 * ========================================================================== */

/* The banners reuse the /app loop visuals (AppLoopVisuals). Outcome tiles
   are checks, not numbers: an illustrative score would sit badly next to
   the real findings above. */
const STEPS: {
  title: string;
  body: string;
  visual:
    | { kind: "phone"; src: string; alt: string; stat: LoopStat }
    | { kind: "product" };
}[] = [
  {
    title: "Take CONKA",
    body: "Flow in the morning, Clear in the afternoon, or both.",
    visual: { kind: "product" },
  },
  {
    title: "Test in the app",
    body: "A 90-second cognitive test, FDA cleared and built on Cambridge research.",
    visual: {
      kind: "phone",
      src: "/app/AppHomeCapture.webp",
      alt: "CONKA app home screen showing a cognitive score of 92",
      stat: { check: "Test done" },
    },
  },
  {
    title: "See your change",
    body: "Every test plots against your own baseline, so the data shows what moved you.",
    visual: {
      kind: "phone",
      src: "/app/AppTrendsCapture.webp",
      alt: "CONKA app chart of cognitive score over time against a personal baseline",
      stat: { check: "Against your baseline" },
    },
  },
];

const CREDENTIALS = [
  { value: "93%", label: "Sensitivity detecting cognitive change", source: "ADePT Study, PMC10533908" },
  { value: "87.5%", label: "Test-retest reliability", source: "ADePT Study, PMC10533908" },
  { value: "14", label: "NHS Trusts in clinical validation", source: "HRA ISRCTN95636074" },
  { value: "510(k)", label: "FDA cleared as a medical device", source: "Cognetivity Neurosciences" },
] as const;

const ACCORDION_NAME = "app-insights-how";

function Accordion({
  title,
  onOpen,
  children,
}: {
  title: string;
  onOpen?: () => void;
  children: React.ReactNode;
}) {
  return (
    <details
      name={ACCORDION_NAME}
      onToggle={(e) => {
        if (e.currentTarget.open) onOpen?.();
      }}
      className="group rounded-md bg-white text-black ring-1 ring-black/5"
    >
      <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 lg:px-5 lg:py-4 [&::-webkit-details-marker]:hidden">
        <h3 className="text-base font-bold leading-tight text-[var(--brand-navy)] lg:text-lg">
          {title}
        </h3>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef0f5] text-lg font-semibold leading-none text-[var(--brand-navy)] transition-transform group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="px-4 pb-5 lg:px-5">{children}</div>
    </details>
  );
}

export default function InsightHowWeKnow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const methodTrackedRef = useRef(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          try {
            track("insights_credibility_view", {
              location: "app-insights-credibility",
              module: "how-we-know",
            });
          } catch {
            // analytics fail silently
          }
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function onMethodOpen() {
    if (methodTrackedRef.current) return;
    methodTrackedRef.current = true;
    try {
      track("insights_methodology_open", {
        location: "app-insights-readability",
      });
    } catch {
      // analytics fail silently
    }
  }

  return (
    <div ref={rootRef}>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2
          className="brand-h1 mb-4 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          We compare you
          <br />
          <span className="text-[var(--brand-accent)]">to you.</span>
        </h2>
        <p className="text-lg leading-relaxed text-black/80">
          Every finding above comes from inside the CONKA app, on our own
          users, each measured against their own normal. Here is how.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex flex-col overflow-hidden rounded-md bg-white text-black ring-1 ring-black/5"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eef0f5]">
              {step.visual.kind === "phone" ? (
                <>
                  <PhoneScreen src={step.visual.src} alt={step.visual.alt} />
                  <StatTile stat={step.visual.stat} />
                </>
              ) : (
                <Bottles />
              )}
              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                Step {i + 1}
              </span>
            </div>
            <div className="p-5 lg:p-6">
              <h3 className="mb-1.5 text-lg font-bold leading-tight text-[var(--brand-navy)]">
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-black/80">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {CREDENTIALS.map((c) => (
          // dt must precede dd; column-reverse puts the number on top.
          <div
            key={c.label}
            className="flex flex-col-reverse justify-end rounded-md bg-white p-4 text-black ring-1 ring-black/5 lg:p-5"
          >
            <dt className="mt-2 text-sm leading-snug text-black/75">
              {c.label}
              <span className="mt-1 block text-xs text-black/45">{c.source}</span>
            </dt>
            <dd className="text-3xl font-bold leading-none tabular-nums text-[var(--brand-navy)]">
              {c.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-col gap-2">
        <Accordion title="How we compare you to you" onOpen={onMethodOpen}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-[#eef0f5] p-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-black/50">
                The simple way (misleading)
              </p>
              <p className="text-sm leading-snug text-black/75">
                Average every drinker against every non-drinker. Whoever
                naturally scores higher wins, regardless of the drinking.
              </p>
            </div>
            <div className="rounded-md bg-[var(--brand-navy)] p-4 text-white">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/70">
                What we do (per-user delta)
              </p>
              <p className="text-sm leading-snug">
                Build each user&apos;s own baseline from their clean-state
                tests. Measure their impaired-state tests against that
                baseline. Average the personal changes.
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-black/75">
            The question stops being &ldquo;are drinkers worse than
            non-drinkers&rdquo; and becomes &ldquo;how much does this person
            change relative to their own normal.&rdquo; That is the only honest
            way to compare an impaired state against a baseline using
            observational app data.
          </p>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-black/50">
            What this method can and can&apos;t do
          </p>
          <ul className="flex max-w-[68ch] list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-black/75">
            <li>Observational, not a controlled clinical trial.</li>
            <li>
              Each user must have tests in both conditions to be included,
              which is why some sample sizes are smaller than the topline user
              count.
            </li>
            <li>
              Where the per-condition sample is thin, we mark it Early signal
              or skip the claim entirely.
            </li>
            <li>
              Wellness factors (alcohol, fatigue, stress, readiness) are
              self-reported in the app at the moment of testing.
            </li>
          </ul>
        </Accordion>

        <Accordion title="About the test and its validation">
          {/* Verbatim credential note: cited study references kept exact. */}
          <p className="max-w-[78ch] text-sm leading-relaxed text-black/70">
            The CONKA app uses a clinically validated cognitive assessment
            developed by Cognetivity Neurosciences from Cambridge University
            research. The test is FDA cleared as a medical device with 93%
            sensitivity for detecting cognitive change and 87.5% test-retest
            reliability, validated across NHS Memory Clinics (ADePT Study,
            PMC10533908; HRA ISRCTN95636074). Test scores reflect individual
            cognitive test performance and do not constitute health claims
            about CONKA products. Many factors, including lifestyle changes,
            practice effects, and natural variation, may contribute to changes
            in test scores.
          </p>
        </Accordion>
      </div>
    </div>
  );
}
