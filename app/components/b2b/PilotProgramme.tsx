"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ============================================================================
 * PilotProgramme
 *
 * B2B USP section for /professionals. Frames the live squad pilot (product +
 * CONKA app + coach's cognitive dashboard + testing cadence) as the de-risk
 * path: prove it on your own squad, then scale to team pricing. The page owns
 * the section wrapper and the #pilot anchor the hero CTA targets. CTA is a
 * templated mailto to Harry; no backend.
 *
 * The intro sits beside a CONKA app figure-plate (matching the home
 * AppUSPSection treatment). The flow is an interactive horizontal stepper:
 * click a stage (or use prev/next) to highlight it and expand its detail. Tile
 * labels are a single word on mobile and a fuller title on desktop. Per-step
 * assets are intentionally not shown yet (we lack assets for every stage).
 * Clinical grammar, no new claims.
 * ========================================================================== */

const NAVY = "#1B2757";

const PILOT_MAILTO =
  "mailto:harryglover@conka.io?subject=" +
  encodeURIComponent("CONKA squad pilot enquiry") +
  "&body=" +
  encodeURIComponent(
    [
      "Hi Harry,",
      "",
      "We would like to explore a CONKA squad pilot. Some quick context:",
      "",
      "- Estimated squad size:",
      "- Preferred time period:",
      "- Coach's app view of interest (yes / no):",
      "",
      "Thanks,",
    ].join("\n"),
  );

const svgProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
};

type Stage = {
  n: string;
  short: string; // mobile tile label (one word)
  title: string; // desktop tile label + panel heading
  detail: string;
  icon: ReactNode;
};

const STAGES: Stage[] = [
  {
    n: "01",
    short: "Order",
    title: "Order the product",
    detail:
      "Choose a small batch for the squad. We ship it to your training base, ready to start.",
    icon: (
      <svg {...svgProps}>
        <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
        <path d="M3 7l9 4 9-4" />
        <path d="M12 11v10" />
      </svg>
    ),
  },
  {
    n: "02",
    short: "Onboard",
    title: "Onboard the squad",
    detail:
      "The CONKA app is free to install and takes minutes to set up. Each selected athlete gets their own login, with the cognitive testing built in.",
    icon: (
      <svg {...svgProps}>
        <path d="M7 3h10v18H7z" />
        <path d="M7 16h10" />
      </svg>
    ),
  },
  {
    n: "03",
    short: "Baseline",
    title: "Set the baseline",
    detail:
      "Before anyone takes a shot, each athlete runs a short two-minute cognitive test, backed by NHS clinical validation, to set their starting scores. The change becomes measurable, not anecdotal.",
    icon: (
      <svg {...svgProps}>
        <path d="M3 20h18" />
        <path d="M6 20v-6" />
        <path d="M12 20V6" />
        <path d="M18 20v-9" />
      </svg>
    ),
  },
  {
    n: "04",
    short: "Take CONKA",
    title: "Take CONKA daily",
    detail:
      "The squad takes their daily shot across the agreed 2 to 6 week window: Flow in the morning, Clear in the afternoon.",
    icon: (
      <svg {...svgProps}>
        <path d="M9 3h6" />
        <path d="M10 3v4l-2 2v11h8V9l-2-2V3" />
      </svg>
    ),
  },
  {
    n: "05",
    short: "Test",
    title: "Test consistently",
    detail:
      "Athletes retest around three times a week. The coach's view gives you a full overview of the squad: nudge athletes to keep testing, track who is taking their shots, and spot early trends as they emerge.",
    icon: (
      <svg {...svgProps}>
        <path d="M17 4l3 3-3 3" />
        <path d="M20 7H9a5 5 0 0 0-5 5" />
        <path d="M7 20l-3-3 3-3" />
        <path d="M4 17h11a5 5 0 0 0 5-5" />
      </svg>
    ),
  },
  {
    n: "06",
    short: "Review",
    title: "Review the data",
    detail:
      "At the end of the window we analyse the squad's data and give you a high-level team report plus an athlete-by-athlete breakdown, so you can see who responded and decide what to roll out at scale.",
    icon: (
      <svg {...svgProps}>
        <path d="M4 5v14h16" />
        <path d="M7 15l4-5 3 3 5-7" />
      </svg>
    ),
  },
];

export default function PilotProgramme() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const total = STAGES.length;
  const step = STAGES[active];

  // Keep the active stage in view as the user iterates (horizontal scroll only).
  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const go = (delta: number) =>
    setActive((a) => Math.min(total - 1, Math.max(0, a + delta)));

  return (
    <div>
      {/* Intro beside the CONKA app figure-plate */}
      <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:items-center">
        <div>
          <p className="brand-eyebrow mb-4">{"// The squad pilot"}</p>
          <h2
            className="brand-h2 max-w-[20ch] text-black"
            style={{ letterSpacing: "-0.02em" }}
          >
            Run a pilot with your own squad.
          </h2>
          <p className="mt-5 text-base text-black/80 leading-relaxed max-w-[58ch]">
            A pilot is the low-risk way in. Buy a small batch for the squad, and
            we layer the CONKA app, a coach&apos;s dashboard and cognitive testing
            on top. Watch your own athletes&apos; scores move over a few weeks,
            then scale to team pricing from evidence, not a leap of faith.
          </p>
        </div>

        <div className="relative aspect-[2/1] bg-[#f5f5f5] border border-black/12 overflow-hidden mt-8 lg:mt-0">
          <div className="absolute top-3 left-3 z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Fig. 01 &middot; CONKA App
          </div>
          {/* Phone scaled up and anchored to the top so the device bleeds off
              the bottom edge, featuring the score ring (bottom cropped). */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[10%] h-[150%] aspect-[1/2]">
            <Image
              src="/app/AppConkaRing.png"
              alt="The CONKA app home screen showing today's cognition score"
              fill
              sizes="(max-width: 1024px) 60vw, 320px"
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-3 right-3 z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            iOS &middot; Android
          </div>
        </div>
      </div>

      {/* Interactive horizontal stepper */}
      <p className="brand-eyebrow mt-12 mb-6">{"// How a pilot runs"}</p>

      <ol className="flex overflow-x-auto sm:overflow-visible -mx-1 px-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STAGES.map((s, i) => {
          const isActive = i === active;
          return (
            <li
              key={s.n}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative shrink-0 min-w-[92px] sm:min-w-0 sm:flex-1"
            >
              {/* Connector back to the previous node */}
              {i > 0 && (
                <span
                  className="absolute top-[27px] sm:top-[35px] left-[-50%] w-full h-px bg-black/15"
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${s.n}: ${s.title}`}
                className="relative z-10 flex w-full flex-col items-center gap-2.5 px-1"
              >
                <span className="relative">
                  <span
                    className={`flex h-14 w-14 sm:h-[72px] sm:w-[72px] items-center justify-center border transition-colors ${
                      isActive
                        ? "text-white border-transparent"
                        : "bg-white border-black/15 text-[#1B2757]"
                    }`}
                    style={isActive ? { backgroundColor: NAVY } : undefined}
                  >
                    {s.icon}
                  </span>
                  <span className="absolute -top-2.5 -left-2.5 bg-white border border-black/12 font-mono text-xs font-bold tabular-nums text-black/70 px-1.5 py-1 leading-none">
                    {s.n}
                  </span>
                </span>
                <span
                  className={`text-center leading-tight ${
                    isActive ? "text-black font-semibold" : "text-black/55"
                  }`}
                >
                  <span className="sm:hidden text-[11px]">{s.short}</span>
                  <span className="hidden sm:inline text-xs lg:text-sm">
                    {s.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Expanded detail (text only) */}
      <div
        className="mt-5 border border-black/12 bg-white p-5 lg:p-6"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/45 tabular-nums">
            Step {step.n} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <StepNavButton
              direction="prev"
              onClick={() => go(-1)}
              disabled={active === 0}
            />
            <StepNavButton
              direction="next"
              onClick={() => go(1)}
              disabled={active === total - 1}
            />
          </div>
        </div>
        <h3 className="text-lg lg:text-xl font-semibold text-black leading-tight">
          {step.title}
        </h3>
        <p className="text-sm lg:text-base text-black/70 mt-2 max-w-[60ch] leading-relaxed">
          {step.detail}
        </p>
      </div>

      {/* De-risk + CTA */}
      <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-base text-black/80 leading-relaxed max-w-[46ch]">
          Tell us your rough squad size and timing, and we&apos;ll shape a pilot
          around you.
        </p>
        <a
          href={PILOT_MAILTO}
          className="brand-btn brand-btn-accent inline-flex items-center justify-center min-h-[52px] w-full lg:w-auto text-sm uppercase tracking-[0.15em] whitespace-nowrap"
        >
          Enquire about a pilot
        </a>
      </div>
    </div>
  );
}

function StepNavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous step" : "Next step"}
      style={{ borderColor: NAVY, color: NAVY }}
      className="flex h-11 w-11 items-center justify-center border transition-opacity hover:bg-black/[0.04] disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <polyline
          points={direction === "prev" ? "15 6 9 12 15 18" : "9 6 15 12 9 18"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </button>
  );
}
