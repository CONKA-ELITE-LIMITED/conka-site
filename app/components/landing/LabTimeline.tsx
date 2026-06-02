import Image from "next/image";
import Link from "next/link";
import ConkaCTAButton from "./ConkaCTAButton";
import LabTrustBadges from "./LabTrustBadges";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";

/* ============================================================================
 * LabTimeline
 *
 * "Expected outcomes" — 3 milestones (24h / 14d / 30d), benefits-first.
 *
 * Each milestone is a compact white card with navy accents: timeframe badge
 * (navy fill), outcome headline, and a one-line benefit. That's the whole
 * collapsed face — scannable in seconds. The depth (felt problem → felt
 * outcome → app data → clinical mechanism) sits behind a native <details>
 * expander, written in the linked narrative style of KeyBenefits: struggle,
 * outcome, evidence.
 *
 * Desktop pairs the card stack with a sticky lifestyle asset; mobile leads
 * with the same asset full-bleed.
 *
 * Perf: pure server component. Zero client JS — expanders are native
 * <details name="..."> (exclusive-open on Chromium 120+ / Safari 17+,
 * graceful multi-open fallback elsewhere). Call sites can import directly;
 * no dynamic() needed.
 * ========================================================================== */

const NAVY = "#1B2757";

interface Milestone {
  timeframe: string;
  phase: string;
  outcome: string;
  title: string;
  description: string;
  /* Expanded layer — KeyBenefits narrative structure */
  struggle: string;
  feltOutcome: string;
  appData: {
    value: string;
    label: string;
    caveat: string;
    anchor: string;
  };
  mechanism: React.ReactNode;
}

const MILESTONES: Milestone[] = [
  {
    timeframe: "24 hours",
    phase: "01",
    outcome: "Focus stabilisation",
    title: "Focus without the noise.",
    description:
      "Sharper focus from the first shot. No jitters, no crash, no 2pm dip.",
    struggle:
      "Most focus aids spike you up, then drop you. The 2pm dip is the receipt.",
    feltOutcome:
      "Sharper focus that holds for hours. Deep work feels effortless. Calm, not wired.",
    appData: {
      value: "+1.09 pts",
      label: "evening focus above your daily average, when scores naturally fall",
      caveat: "n=74 Conka tests · 18–21 window ^^",
      anchor: "/app-insights#time-of-day",
    },
    mechanism: (
      <>
        <strong className="font-semibold text-black">Lemon balm</strong>{" "}
        supports GABA receptors within 30 minutes.{" "}
        <strong className="font-semibold text-black">Alpha GPC</strong> raises
        acetylcholine, the brain&apos;s memory messenger.
      </>
    ),
  },
  {
    timeframe: "14 days",
    phase: "02",
    outcome: "Cognitive momentum",
    title: "Your sharpest weeks yet.",
    description:
      "Adaptogens reach full strength. Mornings start sharp, afternoons hold the line.",
    struggle:
      "One bad email can still ruin a whole morning. Stress is the single biggest drag on a cognitive score.",
    feltOutcome:
      "Scores trend consistently higher. Stress rolls off, recovery shortens. The afternoon dip stops being a daily event.",
    appData: {
      value: "−5.4 pts",
      label: "what moderate stress takes off a score, before your defence is built",
      caveat: "n=18 users · 58 tests ^^",
      anchor: "/app-insights#stress",
    },
    mechanism: (
      <>
        <strong className="font-semibold text-black">Ashwagandha</strong> and{" "}
        <strong className="font-semibold text-black">rhodiola</strong> compound
        with daily use. Week two is when adaptogens reach full effect.
      </>
    ),
  },
  {
    timeframe: "30 days",
    phase: "03",
    outcome: "Baseline shift",
    title: "A measurably sharper baseline.",
    description:
      "Decisions come faster. Your everyday performance, not just a good day.",
    struggle:
      "Good days shouldn't be a coin flip. The goal is a higher floor, not a lucky ceiling.",
    feltOutcome:
      "Less variation day to day. Problems feel simpler, decisions come faster. A baseline you can track in the CONKA app.",
    appData: {
      value: "+28.96%",
      label: "average cognitive score improvement across our tested user base",
      caveat: "N=150+ participants · 5,000+ tests",
      anchor: "/case-studies",
    },
    mechanism: (
      <>
        The{" "}
        <strong className="font-semibold text-black">
          nootropic and antioxidant stack
        </strong>{" "}
        reaches steady state. Neuroprotection and resilience compound from
        here.
      </>
    ),
  },
];

export default function LabTimeline({
  hideCTA = false,
  ctaHref,
  ctaLabel,
}: {
  hideCTA?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
} = {}) {
  return (
    <div>
      {/* Mobile/tablet banner — full-bleed lifestyle asset */}
      <div className="relative -mt-20 md:mt-0 -mx-5 w-[calc(100%+2.5rem)] mb-6 overflow-hidden aspect-[4/3] md:mb-8 md:aspect-[16/9] lg:hidden">
        <Image
          src="/lifestyle/flow/FlowConkaRing.jpg"
          alt="CONKA Flow bottle beside a phone showing a CONKA cognitive score of 92"
          fill
          sizes="(max-width: 1024px) 100vw, 0px"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Trio header */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// Expected outcomes · SCI-02"}
      </p>
      <h2 className="brand-h1 mb-2" style={{ letterSpacing: "-0.02em" }}>
        Feel it in 24 hours.
        <br />
        Measure it in 30 days.
        <sup className="text-[0.5em] text-black/30 align-super">^^</sup>
      </h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-8">
        {APP_INSIGHTS_TOTALS.users} users ·{" "}
        {APP_INSIGHTS_TOTALS.tests.toLocaleString()} cognitive tests ·{" "}
        {APP_INSIGHTS_TOTALS.monthsSpan} months
      </p>

      <div className="lg:flex lg:gap-10 lg:items-start">
        {/* Milestone cards — compact navy faces, depth behind [+] */}
        <ol className="flex flex-col gap-4 lg:flex-1">
          {MILESTONES.map((m) => (
            <li
              key={m.timeframe}
              className="lab-clip-tr border border-black/12 overflow-hidden"
            >
              {/* Card face — everything a visitor needs in one glance */}
              <div className="bg-white p-5 lg:p-6 pb-0 lg:pb-0">
                <div className="flex items-center justify-between gap-3 mb-4">
                  {/* Timeframe badge — navy accent */}
                  <span
                    className="lab-clip-tr inline-block text-white font-mono text-[11px] font-bold uppercase tracking-[0.16em] leading-none tabular-nums px-3 py-1.5"
                    style={{ backgroundColor: NAVY }}
                  >
                    {m.timeframe}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 tabular-nums">
                    Phase {m.phase} ·{" "}
                    <span style={{ color: NAVY }}>{m.outcome}</span>
                  </span>
                </div>

                <h3 className="text-xl lg:text-2xl font-semibold leading-snug text-black mb-1.5">
                  {m.title}
                </h3>
                <p className="text-sm text-black/60 leading-snug">
                  {m.description}
                </p>
              </div>

              {/* Expander — app data + clinical detail, KeyBenefits narrative */}
              <details name="lab-timeline-detail" className="group bg-white">
                <summary className="flex items-center gap-1.5 min-h-[44px] px-5 lg:px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/50 hover:text-black cursor-pointer list-none [&::-webkit-details-marker]:hidden transition-colors">
                  <span className="tabular-nums group-open:hidden">[+]</span>
                  <span className="tabular-nums hidden group-open:inline">
                    [−]
                  </span>
                  <span className="group-open:hidden">
                    App data &amp; clinical detail
                  </span>
                  <span className="hidden group-open:inline">Show less</span>
                </summary>

                <div className="px-5 lg:px-6 pb-5 lg:pb-6">
                  {/* 1. Struggle — the felt problem, quiet and italic */}
                  <p className="text-sm italic text-black/55 leading-relaxed mb-2">
                    {m.struggle}
                  </p>

                  {/* 2. Outcome — the felt result, plain English, bold */}
                  <p className="text-base lg:text-lg font-semibold text-black leading-snug mb-5">
                    {m.feltOutcome}
                  </p>

                  {/* 3. App data — compact, stat and label on one reading line */}
                  <div className="border border-black/8 bg-black/[0.03] p-4 mb-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 mb-2">
                      App data · real users
                    </p>
                    <p className="text-sm text-black/75 leading-snug mb-2">
                      <span
                        className="text-xl font-semibold tabular-nums mr-2"
                        style={{ color: NAVY }}
                      >
                        {m.appData.value}
                      </span>
                      {m.appData.label}
                    </p>
                    <div className="flex items-end justify-between gap-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/35">
                        {m.appData.caveat}
                      </p>
                      <Link
                        href={m.appData.anchor}
                        className="shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] text-black/50 hover:text-black underline underline-offset-2 whitespace-nowrap"
                      >
                        See data →
                      </Link>
                    </div>
                  </div>

                  {/* 4. Mechanism — what drives this phase, ingredients bolded */}
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 mb-1.5">
                    How it works
                  </p>
                  <p className="text-sm leading-relaxed text-black/75">
                    {m.mechanism}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ol>

        {/* Desktop sidebar image with figure plate */}
        <div className="hidden lg:block lg:w-[600px] lg:flex-shrink-0 lg:sticky lg:top-24">
          <div className="relative aspect-square border border-black/12 overflow-hidden bg-[#f5f5f5]">
            <Image
              src="/lifestyle/flow/FlowConkaRing.jpg"
              alt="CONKA Flow bottle beside a phone showing a CONKA cognitive score of 92"
              fill
              sizes="450px"
              className="object-cover"
            />
            <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
              Fig. 03 · Daily Use
            </span>
            <span className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
              CONKA Flow · Score 92
            </span>
          </div>
        </div>
      </div>

      {!hideCTA && (
        <>
          <div className="mt-10 flex flex-col items-start gap-2">
            <ConkaCTAButton href={ctaHref} meta={null}>
              {ctaLabel ?? `Try Both from £${PRICE_PER_SHOT_BOTH}/shot`}
            </ConkaCTAButton>
          </div>
          <div className="mt-6">
            <LabTrustBadges />
          </div>
        </>
      )}
    </div>
  );
}
