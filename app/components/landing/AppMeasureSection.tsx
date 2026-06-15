"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "@/app/hooks/useInView";

/* ============================================================================
 * AppMeasureSection + MeasureTile
 *
 * "We don't ask if CONKA works. We measure it." — the app proof, ported from
 * the lander (app/lander/sections/Measure) into our patterns: Tailwind + the
 * shared useInView hook + motion-safe inline transitions, no CSS Module. Two
 * scroll-triggered effects on first view: the cognitive-score line draws, and
 * the score counts up 72 -> 89. Both respect prefers-reduced-motion.
 *
 * Shared pieces (MeasureScoreCard / MeasureSteps / MeasureStoreButtons) are
 * composed two ways:
 *   - AppMeasureSection: full dark-band section (header + card + steps +
 *     stores + guarantee).
 *   - MeasureTile: compact dark card (card + steps + stores) for a listicle
 *     reason's media slot on the "measurable" points.
 * ========================================================================== */

const FROM = 72;
const TO = 89;

const STEPS = [
  { n: "1", title: "Install & test", desc: "Set your baseline" },
  { n: "2", title: "Take daily", desc: "Flow AM, Clear PM" },
  { n: "3", title: "Track over time", desc: "Watch it climb" },
];

const APP_STORE_URL = "https://apps.apple.com/gb/app/conka-app/id6450399391";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.conka.conkaApp";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** Dark cognitive-score card: line draws + score counts up on first view. */
function MeasureScoreCard() {
  const [ref, isInView] = useInView();
  const [score, setScore] = useState(FROM);
  const lineRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const counted = useRef(false);
  // Unique gradient ids so multiple instances on one page don't collide.
  const gid = useId().replace(/:/g, "");

  useEffect(() => {
    if (!lineRef.current) return;
    try {
      setLen(Math.ceil(lineRef.current.getTotalLength()));
    } catch {
      /* getTotalLength unavailable — line just shows undrawn */
    }
  }, []);

  useEffect(() => {
    if (!isInView || counted.current) return;
    counted.current = true;

    if (prefersReducedMotion()) {
      setScore(TO);
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const dur = 1400;
    const stepFn = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      setScore(Math.round(FROM + (TO - FROM) * p));
      if (p < 1) raf = requestAnimationFrame(stepFn);
    };
    raf = requestAnimationFrame(stepFn);
    return () => cancelAnimationFrame(raf);
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="rounded-[22px] border border-white/12 bg-[#18233f] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
    >
      <span className="text-[13.5px] font-medium text-white/85">
        Your cognitive score
      </span>
      <div className="mb-2 mt-1 flex items-baseline gap-2">
        <b className="text-[31px] font-extrabold tracking-[-0.04em] tabular-nums">
          {score}
        </b>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#6bd37b]">
          ↑ trending up over 30 days
        </span>
      </div>
      <svg
        className="block h-auto w-full"
        viewBox="0 0 320 150"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Cognitive score rising over 30 days"
      >
        <defs>
          <linearGradient id={`${gid}-grad`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E9B200" />
            <stop offset="100%" stopColor="#6BD37B" />
          </linearGradient>
          <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6BD37B" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6BD37B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="20" y1="118" x2="300" y2="118" stroke="rgba(255,255,255,.10)" strokeWidth="1" />
        <line x1="20" y1="74" x2="300" y2="74" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
        <path
          d="M20,106 C70,98 90,90 132,78 C175,66 210,54 300,40 L300,118 L20,118 Z"
          fill={`url(#${gid}-fill)`}
          className="motion-safe:[transition:opacity_0.8s_ease_0.9s]"
          style={{ opacity: isInView ? 1 : 0 }}
        />
        <path
          ref={lineRef}
          d="M20,106 C70,98 90,90 132,78 C175,66 210,54 300,40"
          fill="none"
          stroke={`url(#${gid}-grad)`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="motion-safe:[transition:stroke-dashoffset_1.6s_cubic-bezier(0.4,0,0.2,1)]"
          style={
            len
              ? { strokeDasharray: len, strokeDashoffset: isInView ? 0 : len }
              : undefined
          }
        />
        <circle
          cx="20"
          cy="106"
          r="4.5"
          fill="#E9B200"
          className="motion-safe:[transition:opacity_0.4s_ease_1.5s]"
          style={{ opacity: isInView ? 1 : 0 }}
        />
        <circle
          cx="300"
          cy="40"
          r="5.5"
          fill="#6BD37B"
          stroke="#18233F"
          strokeWidth="2"
          className="motion-safe:[transition:opacity_0.4s_ease_1.5s]"
          style={{ opacity: isInView ? 1 : 0 }}
        />
        <g className="fill-white/40 text-[9.9px] font-medium uppercase tracking-[0.04em]">
          <text x="20" y="138" textAnchor="start">
            Day 1
          </text>
          <text x="160" y="138" textAnchor="middle">
            Day 14
          </text>
          <text x="300" y="138" textAnchor="end">
            Day 30
          </text>
        </g>
      </svg>
    </div>
  );
}

/** 1-2-3 routine steps with a connecting line. */
function MeasureSteps() {
  return (
    <div className="relative mx-auto flex max-w-[40rem] justify-between gap-2">
      <div
        className="absolute left-[58px] right-[58px] top-[17px] h-0.5 bg-white/16"
        aria-hidden
      />
      {STEPS.map((s) => (
        <div
          key={s.n}
          className="relative flex flex-1 flex-col items-center gap-2 text-center"
        >
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-white bg-[#18233f] text-[13.5px] font-extrabold">
            {s.n}
          </span>
          <span className="text-[13px] font-medium leading-tight">
            {s.title}
          </span>
          <span className="text-[11.5px] font-light leading-tight text-white/55">
            {s.desc}
          </span>
        </div>
      ))}
    </div>
  );
}

/** App Store + Google Play download buttons. */
function MeasureStoreButtons() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className="inline-flex items-center gap-2.5 rounded-xl border border-white/28 bg-black px-4 py-2.5"
      >
        <svg viewBox="0 0 24 24" className="h-[21px] w-[21px] flex-shrink-0 fill-white" aria-hidden>
          <path d="M17.05 12.04c-.03-3.16 2.58-4.67 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.94-.2-3.79 1.14-4.78 1.14-.98 0-2.5-1.12-4.12-1.09-2.12.03-4.08 1.23-5.17 3.13-2.2 3.83-.56 9.5 1.58 12.61 1.05 1.52 2.3 3.23 3.93 3.17 1.58-.06 2.18-1.02 4.09-1.02 1.91 0 2.45 1.02 4.12.99 1.7-.03 2.78-1.55 3.82-3.08 1.2-1.76 1.7-3.47 1.72-3.56-.04-.02-3.3-1.27-3.34-5.06z M14.0 3.97c.87-1.05 1.46-2.5 1.3-3.95-1.25.05-2.77.83-3.67 1.88-.8.93-1.5 2.42-1.32 3.84 1.39.11 2.81-.71 3.69-1.77z" />
        </svg>
        <span className="flex flex-col text-left leading-[1.12] text-white">
          <small className="text-[8.3px] uppercase tracking-[0.04em] opacity-85">
            Download on the
          </small>
          <b className="text-[14.5px] font-medium tracking-[-0.01em]">
            App Store
          </b>
        </span>
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        className="inline-flex items-center gap-2.5 rounded-xl border border-white/28 bg-black px-4 py-2.5"
      >
        <svg viewBox="0 0 24 24" className="h-[21px] w-[21px] flex-shrink-0 fill-white" aria-hidden>
          <path d="M4.2 2.6c-.3.16-.5.48-.5.92v16.96c0 .44.2.76.5.92l9.06-9.4L4.2 2.6z" />
          <path d="M17.2 8.9 6.1 2.5l8.34 8.66L17.2 8.9z" opacity=".85" />
          <path d="M17.2 15.1l-2.76-3.94L6.1 21.5 17.2 15.1z" opacity=".7" />
          <path d="M20.5 10.6 17.2 8.9l-2.76 2.26 2.76 2.94 3.3-1.7c.9-.5.9-1.3 0-1.8z" />
        </svg>
        <span className="flex flex-col text-left leading-[1.12] text-white">
          <small className="text-[8.3px] uppercase tracking-[0.04em] opacity-85">
            Get it on
          </small>
          <b className="text-[14.5px] font-medium tracking-[-0.01em]">
            Google Play
          </b>
        </span>
      </a>
    </div>
  );
}

/** Compact measure card for a listicle reason slot: graph + steps + stores. */
export function MeasureTile() {
  return (
    <div className="rounded-3xl bg-[#101a33] p-5 text-white md:p-6">
      <MeasureScoreCard />
      <div className="mt-7">
        <MeasureSteps />
      </div>
      <div className="mt-7">
        <MeasureStoreButtons />
      </div>
    </div>
  );
}

/** Full-section app proof: header + card + steps + stores + guarantee. */
export default function AppMeasureSection() {
  return (
    <div className="overflow-hidden rounded-3xl bg-[#101a33] px-5 py-12 text-white md:px-10 md:py-16">
      <div className="mx-auto mb-8 max-w-[42rem] text-center">
        <h2
          className="mb-3.5 text-3xl font-extrabold leading-[1.05] md:text-5xl"
          style={{ letterSpacing: "var(--letter-spacing-premium-title)" }}
        >
          We don&rsquo;t ask if CONKA works.
          <br />
          We measure it.
        </h2>
        <p className="mx-auto max-w-[22rem] text-[15px] leading-snug text-white/75">
          Take CONKA daily and run the cognitive test in the app whenever you
          want. After a month, the numbers tell you whether it worked.
        </p>
      </div>

      <div className="mx-auto mb-8 max-w-[34rem]">
        <MeasureScoreCard />
      </div>

      <div className="mb-7">
        <MeasureSteps />
      </div>

      <div className="mb-10">
        <MeasureStoreButtons />
      </div>

      <div className="mx-auto max-w-[600px] text-center">
        <p className="text-[16.5px] font-light leading-6 text-white/85">
          <b className="mb-1 block text-[62px] font-extrabold leading-none tracking-[-0.04em] text-white">
            100
          </b>
          days to feel AND see the difference, or your money back.
        </p>
        <p className="mx-auto mt-3 max-w-[300px] text-[13px] font-light leading-[18px] text-white/50">
          No returns. No hassles. No questions. The only thing you have to lose
          is the fog.
        </p>
      </div>
    </div>
  );
}
