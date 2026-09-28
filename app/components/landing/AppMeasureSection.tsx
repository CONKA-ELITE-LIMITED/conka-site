"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "@/app/hooks/useInView";

/* ============================================================================
 * MeasureTile
 *
 * The app proof as a listicle chart tile ("measure it" reason): tinted banner,
 * the cognitive score counting up 72 -> 89, a score chart with axis and day
 * marks drawing on first view, and the store buttons. Both effects respect
 * prefers-reduced-motion. (The file keeps its old name; the full dark
 * AppMeasureSection it once held had no consumers and was removed.)
 * ========================================================================== */

const FROM = 72;
const TO = 89;

const APP_STORE_URL = "https://apps.apple.com/gb/app/conka-app/id6450399391";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.conka.conkaApp";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** In-view trigger, the 72 -> 89 count-up, and the measured line length for
 *  the draw-on animation. */
function useScoreAnimation() {
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

  return { ref, isInView, score, lineRef, len, gid };
}

/** App Store + Google Play download buttons, sized to sit on one row inside a
 *  ~300px listicle tile (tight padding and type, no wrap). */
function MeasureStoreButtons() {
  const btn =
    "inline-flex min-w-0 items-center gap-2 rounded-xl border border-white/28 bg-black px-3 py-2";
  const name = "text-[13px] font-medium tracking-[-0.01em]";
  return (
    <div className="flex flex-nowrap justify-center gap-2">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className={btn}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[21px] w-[21px] flex-shrink-0 fill-white"
          aria-hidden
        >
          <path d="M17.05 12.04c-.03-3.16 2.58-4.67 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.94-.2-3.79 1.14-4.78 1.14-.98 0-2.5-1.12-4.12-1.09-2.12.03-4.08 1.23-5.17 3.13-2.2 3.83-.56 9.5 1.58 12.61 1.05 1.52 2.3 3.23 3.93 3.17 1.58-.06 2.18-1.02 4.09-1.02 1.91 0 2.45 1.02 4.12.99 1.7-.03 2.78-1.55 3.82-3.08 1.2-1.76 1.7-3.47 1.72-3.56-.04-.02-3.3-1.27-3.34-5.06z M14.0 3.97c.87-1.05 1.46-2.5 1.3-3.95-1.25.05-2.77.83-3.67 1.88-.8.93-1.5 2.42-1.32 3.84 1.39.11 2.81-.71 3.69-1.77z" />
        </svg>
        <span className="flex flex-col text-left leading-[1.12] text-white">
          <small className="text-[8.3px] uppercase tracking-[0.04em] opacity-85">
            Download on the
          </small>
          <b className={name}>App Store</b>
        </span>
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        className={btn}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[21px] w-[21px] flex-shrink-0 fill-white"
          aria-hidden
        >
          <path d="M4.2 2.6c-.3.16-.5.48-.5.92v16.96c0 .44.2.76.5.92l9.06-9.4L4.2 2.6z" />
          <path d="M17.2 8.9 6.1 2.5l8.34 8.66L17.2 8.9z" opacity=".85" />
          <path d="M17.2 15.1l-2.76-3.94L6.1 21.5 17.2 15.1z" opacity=".7" />
          <path d="M20.5 10.6 17.2 8.9l-2.76 2.26 2.76 2.94 3.3-1.7c.9-.5.9-1.3 0-1.8z" />
        </svg>
        <span className="flex flex-col text-left leading-[1.12] text-white">
          <small className="text-[8.3px] uppercase tracking-[0.04em] opacity-85">
            Get it on
          </small>
          <b className={name}>Google Play</b>
        </span>
      </a>
    </div>
  );
}

/**
 * Listicle chart tile for the "measure it" reason, in the same grammar as the
 * page's other tiles: tinted banner, the figure large, the chart filling the
 * rest, black copy. Navy is CONKA, green only on the trend. The reason's payoff
 * becomes the frame's bottom strip.
 *
 * The chart carries a score axis (70/80/90), weekly day marks and three plotted
 * points so it reads as measured data rather than a decorative swoosh. Scores
 * map to y as 180 - (score - 65) * 16/3: 72 -> 143, 89 -> 52.
 *
 * Fills its parent: the listicle frame is a flex column, this is `flex-1`.
 */
const SCORE_Y = (score: number) => 180 - ((score - 65) * 16) / 3;
const SCORE_TICKS = [70, 80, 90];
const DAY_TICKS: [string, number][] = [
  ["Day 1", 20],
  ["Day 7", 84],
  ["Day 14", 152],
  ["Day 21", 224],
  ["Day 30", 300],
];

export function MeasureTile() {
  const { ref, isInView, score, lineRef, len, gid } = useScoreAnimation();
  const NAVY = "#1B2757";
  const line = "M20,143 C70,134 100,122 152,108 C200,95 240,72 300,52";

  return (
    <div ref={ref} className="flex flex-1 flex-col text-black">
      <div className="rounded-t-lg bg-[#eef1f8] px-5 py-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em]">
          Measured in the CONKA app
        </p>
        <p className="mt-1 text-lg font-bold leading-snug">
          Your cognitive score
        </p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <div className="flex items-end gap-3">
          <p
            className="font-bold leading-none tabular-nums"
            style={{ fontSize: "clamp(3rem, 14vw, 4.25rem)" }}
          >
            {score}
          </p>
          <p
            className="pb-1 text-[15px] font-semibold leading-tight"
            style={{ color: "var(--brand-positive, #1a7f4f)" }}
          >
            &uarr; Trending up over
            <br />
            the past 30 days
          </p>
        </div>

        <div className="mt-4 flex flex-1 items-center">
          <svg
            className="block h-auto w-full"
            viewBox="-26 0 346 215"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={`Cognitive score rising from ${FROM} to ${TO} over 30 days`}
          >
            <defs>
              <linearGradient id={`${gid}-lfill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={NAVY} stopOpacity="0.14" />
                <stop offset="100%" stopColor={NAVY} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* score axis */}
            {SCORE_TICKS.map((t) => (
              <g key={t}>
                <line
                  x1="12"
                  y1={SCORE_Y(t)}
                  x2="300"
                  y2={SCORE_Y(t)}
                  stroke="#ececec"
                  strokeWidth="1"
                />
                <text
                  x="4"
                  y={SCORE_Y(t) + 4}
                  textAnchor="end"
                  className="fill-black/55 text-[11px] font-medium tabular-nums"
                >
                  {t}
                </text>
              </g>
            ))}
            <line
              x1="12"
              y1="180"
              x2="300"
              y2="180"
              stroke="#d6d6d6"
              strokeWidth="1"
            />

            {/* day marks */}
            {DAY_TICKS.map(([label, x]) => (
              <g key={label}>
                <line
                  x1={x}
                  y1="180"
                  x2={x}
                  y2="185"
                  stroke="#c4c4c4"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y="200"
                  textAnchor={x === 20 ? "start" : x === 300 ? "end" : "middle"}
                  className="fill-black/55 text-[10.5px] font-medium"
                >
                  {label}
                </text>
              </g>
            ))}

            <path
              d={`${line} L300,180 L20,180 Z`}
              fill={`url(#${gid}-lfill)`}
              className="motion-safe:[transition:opacity_0.8s_ease_0.9s]"
              style={{ opacity: isInView ? 1 : 0 }}
            />
            <path
              ref={lineRef}
              d={line}
              fill="none"
              stroke={NAVY}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="motion-safe:[transition:stroke-dashoffset_1.6s_cubic-bezier(0.4,0,0.2,1)]"
              style={
                len
                  ? {
                      strokeDasharray: len,
                      strokeDashoffset: isInView ? 0 : len,
                    }
                  : undefined
              }
            />

            {/* plotted points: start, mid, end */}
            <circle cx="20" cy="143" r="4.5" fill="#b4b4b4" />
            <text
              x="28"
              y="160"
              className="fill-black/60 text-[11px] font-semibold tabular-nums"
            >
              {FROM}
            </text>
            <g
              className="motion-safe:[transition:opacity_0.4s_ease_1.2s]"
              style={{ opacity: isInView ? 1 : 0 }}
            >
              <circle
                cx="152"
                cy="108"
                r="4.5"
                fill={NAVY}
                stroke="#fff"
                strokeWidth="2"
              />
            </g>
            <g
              className="motion-safe:[transition:opacity_0.4s_ease_1.5s]"
              style={{ opacity: isInView ? 1 : 0 }}
            >
              <circle
                cx="300"
                cy="52"
                r="5.5"
                fill={NAVY}
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x="300"
                y="38"
                textAnchor="end"
                className="fill-[#1B2757] text-[12px] font-bold tabular-nums"
              >
                {TO}
              </text>
            </g>
          </svg>
        </div>

        {/* Free app: the test is the proof, so the download stays in reach. */}
        <div className="mt-4">
          <MeasureStoreButtons />
        </div>
      </div>
    </div>
  );
}
