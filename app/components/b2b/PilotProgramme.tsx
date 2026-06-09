"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ============================================================================
 * PilotProgramme
 *
 * B2B USP section for /professionals. Frames the live squad pilot (product +
 * CONKA app + coach's cognitive dashboard + testing cadence) as the de-risk
 * path: prove it on your own squad, then scale to team pricing. The page owns
 * the section wrapper and the #pilot anchor the hero CTA targets. CTA is a
 * templated mailto to Harry; no backend.
 *
 * The flow is an interactive image filmstrip: each stage is a real asset tile;
 * the selected stage enlarges as the showcase and its detail expands below.
 * Click a tile or use prev/next to iterate; the rail scrolls on mobile with the
 * active tile scrolled into view. Clinical grammar, no new claims.
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

type Stage = {
  n: string;
  short: string;
  title: string;
  detail: string;
  image: string;
  alt: string;
};

const STAGES: Stage[] = [
  {
    n: "01",
    short: "Order",
    title: "Order the product",
    detail:
      "Choose a small batch for the squad. We ship it to your training base, ready to start.",
    image: "/formulas/box/BothBox.jpg",
    alt: "Two boxes of CONKA ready to ship to a club",
  },
  {
    n: "02",
    short: "App",
    title: "Athletes onto the app",
    detail:
      "Your selected athletes are set up on the CONKA app in minutes, each with their own login and the testing built in.",
    image: "/app/AppConkaRing.png",
    alt: "The CONKA app home screen showing today's cognition score",
  },
  {
    n: "03",
    short: "Baseline",
    title: "Baseline on the app",
    detail:
      "Before anyone takes a shot, we capture each athlete's starting cognitive scores so the change is measurable, not anecdotal.",
    image: "/app/AppTestBreakdown.png",
    alt: "The CONKA app insights screen showing a cognition test breakdown",
  },
  {
    n: "04",
    short: "Take CONKA",
    title: "Take CONKA for 2 to 6 weeks",
    detail:
      "The squad takes their daily shot across the agreed window: Flow in the morning, Clear in the afternoon.",
    image: "/lifestyle/flow/FlowDrink.jpg",
    alt: "An athlete taking a CONKA shot",
  },
  {
    n: "05",
    short: "Test",
    title: "Test consistently",
    detail:
      "Athletes complete short cognitive tests around three times a week, so progress is tracked as it happens.",
    image: "/app/AppTestAnimal.png",
    alt: "A CONKA cognition test in progress in the app",
  },
  {
    n: "06",
    short: "Readout",
    title: "Data analysis and feedback",
    detail:
      "We read the squad's data back through a coach's view, with clear recommendations on what to roll out at scale.",
    image: "/lifestyle/flow/FlowConkaRing.jpg",
    alt: "A CONKA shot beside the app showing a cognition score",
  },
];

export default function PilotProgramme() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const total = STAGES.length;
  const step = STAGES[active];

  // Keep the active tile in view as the user iterates (horizontal scroll only).
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
      {/* Trio header */}
      <p className="brand-eyebrow mb-4">{"// The squad pilot"}</p>
      <h2
        className="brand-h2 max-w-[20ch] text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Prove it on your own squad first.
      </h2>
      <p className="brand-mono-sub mt-3">
        App &middot; Coach&apos;s dashboard &middot; Cognitive testing
      </p>
      <p className="brand-body mt-5 max-w-[60ch]">
        Start small and see it on your own athletes. We set your squad up on the
        CONKA app, run a cognitive testing cadence, and give you a coach&apos;s
        view of the data, so you decide on a full order from evidence, not a leap
        of faith.
      </p>

      {/* Interactive image filmstrip */}
      <p className="brand-eyebrow mt-10 mb-6">{"// How a pilot runs"}</p>

      <ol className="flex items-end gap-2 sm:gap-3 overflow-x-auto -mx-1 px-1 pt-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STAGES.map((s, i) => {
          const isActive = i === active;
          return (
            <li
              key={s.n}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="shrink-0"
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${s.n}: ${s.title}`}
                style={{
                  borderColor: isActive ? NAVY : "rgba(0,0,0,0.15)",
                  borderWidth: isActive ? 2 : 1,
                }}
                className={`relative block overflow-hidden bg-[var(--brand-tint)] transition-all duration-300 ${
                  isActive
                    ? "w-32 h-32 sm:w-48 sm:h-48 opacity-100"
                    : "w-16 h-16 sm:w-[84px] sm:h-[84px] opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 128px, 192px"
                  className="object-cover"
                />
                <span className="absolute top-1 left-1 bg-white/90 font-mono text-[9px] font-bold tabular-nums text-black/70 px-1 py-0.5 leading-none">
                  {s.n}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Expanded detail for the active stage */}
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
        <p className="brand-body max-w-[46ch]">
          A pilot is a small batch with the data layer on top. Prove it on your
          squad, then scale to team pricing.
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
