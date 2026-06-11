"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  gsap,
  useGSAP,
  withMotion,
  revealUp,
  drawLines,
} from "@/app/lib/motion";

/**
 * "The Engine" section for /app. Three acts telling the intelligence story:
 * 01 Everything in (Apple Health + Screen Time sync into the score),
 * 02 Patterns out (the engine finds what is true for you),
 * 03 Down to the millisecond (per-test forensics and long-term trends).
 * Desktop act 1 draws connector lines from the input chips into the phone;
 * insight cards and stat counters animate on entry. No pinning: the page
 * already has one pinned section and this one must stay light on mobile.
 * Content-only; the page owns the section wrapper.
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

type InputChip = {
  id: string;
  label: string;
  isNew?: boolean;
};

const INPUT_CHIPS: InputChip[] = [
  { id: "sleep", label: "Sleep" },
  { id: "hrv", label: "HRV" },
  { id: "steps", label: "Steps" },
  { id: "outdoors", label: "Time outside" },
  { id: "caffeine", label: "Caffeine" },
  { id: "training", label: "Training" },
  { id: "screentime", label: "Screen time", isNew: true },
  { id: "test", label: "The test" },
];

const PATTERN_CARDS = [
  {
    tag: "CONKA effect",
    icon: "effect",
    text: "What shifts on the days you take it: movement, mental fatigue, your score. Measured, not assumed.",
  },
  {
    tag: "Lifting your scores",
    icon: "lift",
    text: "The habits that reliably lift your number: training days, sleep, time outdoors. Yours will be different. That is the point.",
  },
  {
    tag: "Pulling you down",
    icon: "drag",
    text: "And what drags it: soreness, low readiness, stress. Clear levers you can pull.",
  },
];

const DEPTH_FEATURES = [
  {
    id: "precision",
    title: "Millisecond precision",
    text: "Every response timed to the millisecond. Changes too small to feel, made visible.",
  },
  {
    id: "benchmark",
    title: "Demographic benchmarks",
    text: "Your scores sit against aggregated, anonymised CONKA users, so you know how you actually fare.",
  },
  {
    id: "trends",
    title: "Trends across months",
    text: "Anything worth improving takes time. Watch the line move across weeks and months, not days.",
  },
];

// ─── Icons (mono line icons, square caps to match the clinical grammar) ──────

function ChipIcon({ id, size = 18 }: { id: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "square" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "sleep":
      return (
        <svg {...common}>
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
        </svg>
      );
    case "hrv":
      return (
        <svg {...common}>
          <polyline points="2 12 7 12 10 6 14 18 17 12 22 12" />
        </svg>
      );
    case "steps":
      return (
        <svg {...common}>
          <polyline points="3 21 3 16 8 16 8 11 13 11 13 6 18 6 18 3" />
        </svg>
      );
    case "outdoors":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
        </svg>
      );
    case "caffeine":
      return (
        <svg {...common}>
          <path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
          <path d="M16 9h2a2 2 0 0 1 0 4h-2" />
        </svg>
      );
    case "training":
      return (
        <svg {...common}>
          <path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12" />
        </svg>
      );
    case "screentime":
      return (
        <svg {...common}>
          <path d="M6 3h12M6 21h12M7 3v4l5 5 5-5V3M7 21v-4l5-5 5 5v4" />
        </svg>
      );
    case "test":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "precision":
      return (
        <svg {...common}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 13V8M10 2h4" />
        </svg>
      );
    case "benchmark":
      return (
        <svg {...common}>
          <path d="M5 21v-9M12 21V6M19 21v-6M3 21h18" />
        </svg>
      );
    case "trends":
      return (
        <svg {...common}>
          <polyline points="3 17 9 11 13 15 21 7" />
          <polyline points="16 7 21 7 21 12" />
        </svg>
      );
    case "effect":
      return (
        <svg {...common}>
          <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
        </svg>
      );
    case "lift":
      return (
        <svg {...common}>
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      );
    case "drag":
      return (
        <svg {...common}>
          <path d="M7 7l10 10M17 9v8H9" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Device card ──────────────────────────────────────────────────────────────

function EngineDeviceCard({
  src,
  alt,
  fig,
  priorityChip,
}: {
  src: string;
  alt: string;
  fig: string;
  priorityChip?: string;
}) {
  return (
    <div className="relative aspect-[4/5] w-full border border-black/12 bg-[#f5f5f5] overflow-hidden">
      <div className="absolute top-2 left-2 lg:top-3 lg:left-3 font-mono text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10">
        {fig}
      </div>
      {priorityChip && (
        <div className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 font-mono text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-black bg-white border border-black/15 px-2 py-1 tabular-nums z-10">
          {priorityChip}
        </div>
      )}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] aspect-[1/2]">
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 60vw, 320px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

// ─── Act heading ──────────────────────────────────────────────────────────────

function ActHeading({
  index,
  title,
  children,
  reveal,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
  reveal: string;
}) {
  const revealProps = { [reveal]: true };
  return (
    <div {...revealProps}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-3">
        {`// ${index}`}
      </p>
      <h3
        className="text-2xl lg:text-3xl font-medium text-white leading-tight mb-4"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h3>
      <p className="text-base lg:text-lg text-white/85 leading-relaxed max-w-[52ch]">
        {children}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const CONNECTOR_ROWS = [12.5, 37.5, 62.5, 87.5];

export default function AppV2Engine() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        // Act 1: copy, chips light up in sequence, lines draw into the phone
        revealUp("[data-engine-a1]", "[data-engine-act1]", { stagger: 0.1 });
        revealUp("[data-engine-chip]", "[data-engine-chips]", {
          y: 10,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { start: "top 80%" },
        });
        drawLines(
          gsap.utils.toArray<SVGPathElement>("[data-engine-line]"),
          "[data-engine-chips]",
        );

        // Act 2: copy, insight cards, then phone stagger in
        revealUp("[data-engine-a2]", "[data-engine-act2]");

        // Act 3: reveals only; the capability cards carry no live numbers
        revealUp("[data-engine-a3]", "[data-engine-act3]", { stagger: 0.1 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Section header */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4">
        {"// The engine · APP-04"}
      </p>
      <h2
        className="brand-h2 text-white mb-3 max-w-[24ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Everything in. Patterns out. Down to the millisecond.
      </h2>
      <p className="text-base lg:text-lg text-white/85 leading-relaxed max-w-[58ch] mb-14 lg:mb-20">
        Lab-grade analysis of your cognition, built from data your phone
        already has.
      </p>

      {/* ── Act 1: Everything in ─────────────────────────────────────────── */}
      <div
        data-engine-act1
        className="flex flex-col lg:flex-row lg:items-center lg:gap-10 mb-20 lg:mb-28"
      >
        <div className="lg:flex-1">
          <ActHeading index="01" title="Everything in." reveal="data-engine-a1">
            Sleep, HRV, steps, time outdoors, caffeine, training. Synced
            automatically from Apple Health on iOS and Android, not logged by
            hand. And new: screen time, a signal almost nobody has correlated
            with cognition before. We&apos;re watching what it reveals.
          </ActHeading>

          <div
            data-engine-chips
            className="grid grid-cols-2 gap-2 mt-8 max-w-[420px]"
          >
            {INPUT_CHIPS.map((chip) => (
              <div
                key={chip.id}
                data-engine-chip
                className="flex items-center gap-2.5 border border-white/25 bg-white/[0.07] px-3 py-3 min-h-[44px]"
              >
                <span className="text-white/80 flex-shrink-0">
                  <ChipIcon id={chip.id} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/85 leading-none">
                  {chip.label}
                </span>
                {chip.isNew && (
                  <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.16em] text-black bg-white px-1.5 py-0.5 leading-none">
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connector fan — desktop only, draws on scroll */}
        <svg
          aria-hidden
          className="hidden lg:block w-24 self-stretch min-h-[280px] text-white/30 flex-shrink-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {CONNECTOR_ROWS.map((y) => (
            <path
              key={y}
              data-engine-line
              d={`M 0 ${y} C 55 ${y}, 55 50, 100 50`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
            />
          ))}
        </svg>

        <div data-engine-a1 className="lg:flex-1 mt-10 lg:mt-0">
          <div className="max-w-[440px] mx-auto lg:mx-0">
            <EngineDeviceCard
              src="/app/AppConkaRingInt.png"
              alt="CONKA app home screen showing a cognitive score of 92 with Apple Health and Screen Time data synced"
              fig="Fig. 05 · Home, synced"
              priorityChip="Apple Health · Screen Time"
            />
          </div>
        </div>
      </div>

      {/* ── Act 2: Patterns out ──────────────────────────────────────────── */}
      <div
        data-engine-act2
        className="flex flex-col lg:flex-row lg:items-center lg:gap-16 mb-20 lg:mb-28"
      >
        {/* Copy first in DOM so the entrance stagger follows reading order */}
        <div className="order-1 lg:order-2 lg:flex-1">
          <ActHeading index="02" title="Patterns out." reveal="data-engine-a2">
            An engine that learns what is true for you. What lifts your score,
            what drags it, and what CONKA is changing. Not population
            averages. Your data.
          </ActHeading>

          {/* Insight cards — horizontal snap strip on mobile, stack on desktop */}
          <div className="flex lg:flex-col gap-3 mt-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory -mx-5 px-5 lg:mx-0 lg:px-0 scroll-pl-5 pb-2 lg:pb-0">
            {PATTERN_CARDS.map((card) => (
              <div
                key={card.tag}
                data-engine-a2
                className="snap-start flex-shrink-0 w-[260px] lg:w-auto border border-white/25 bg-white/[0.08] p-4 lg:p-5"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/65 tabular-nums mb-2">
                  {card.tag}
                </p>
                <div className="flex items-start gap-3">
                  <span aria-hidden className="text-white flex-shrink-0 mt-0.5">
                    <ChipIcon id={card.icon} size={24} />
                  </span>
                  <p className="text-sm text-white/85 leading-snug">
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-engine-a2 className="order-2 lg:order-1 mt-10 lg:mt-0 lg:flex-1">
          <div className="max-w-[440px] mx-auto lg:mx-0">
            <EngineDeviceCard
              src="/app/AppPatterns.png"
              alt="CONKA app patterns screen showing personalised insights like more daily movement on CONKA days"
              fig="Fig. 06 · Patterns"
            />
          </div>
        </div>
      </div>

      {/* ── Act 3: Down to the millisecond ───────────────────────────────── */}
      <div data-engine-act3>
        <ActHeading
          index="03"
          title="Down to the millisecond."
          reveal="data-engine-a3"
        >
          Every test breaks down into speed, accuracy and consistency,
          benchmarked against anonymised CONKA users. Spot the dip, tap the
          day, see the why: caffeine two hours before, no training, a meal 30
          minutes out. The kind of forensics you&apos;d otherwise need a lab
          for.
        </ActHeading>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 mb-8">
          {DEPTH_FEATURES.map((feature) => (
            <div
              key={feature.id}
              data-engine-a3
              className="border border-white/25 bg-white/[0.08] p-4 lg:p-5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-white/80 flex-shrink-0">
                  <ChipIcon id={feature.id} />
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white tabular-nums leading-none">
                  {feature.title}
                </p>
              </div>
              <p className="text-sm text-white/85 leading-relaxed">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:gap-8">
          <div data-engine-a3>
            <EngineDeviceCard
              src="/app/AppSpeedConsistency.png"
              alt="CONKA app speed consistency breakdown showing 333ms average response and 18% variation"
              fig="Fig. 07 · Speed consistency"
            />
          </div>
          <div data-engine-a3>
            <EngineDeviceCard
              src="/app/AppLongTrends.png"
              alt="CONKA app long-term trend graph of cognitive scores with wellness factors at test time"
              fig="Fig. 08 · Your brain over time"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
