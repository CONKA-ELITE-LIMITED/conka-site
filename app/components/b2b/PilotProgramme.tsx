import type { ReactNode } from "react";

/* ============================================================================
 * PilotProgramme
 *
 * B2B USP section for /professionals. Frames the live squad pilot (product +
 * CONKA app + coach's cognitive dashboard + testing cadence) as the de-risk
 * path: prove it on your own squad, then scale to team pricing. Presentational
 * only (Server Component) - the page owns the section wrapper and the #pilot
 * anchor the hero CTA targets. CTA is a templated mailto to Harry; no backend.
 *
 * Shows the pilot as one clear staged flow (order -> app -> baseline -> take
 * CONKA -> test -> readout) rather than competing format options. Clinical
 * grammar: numbered navy nodes, hairline connector, mono labels, no new claims.
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
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
};

type Stage = {
  n: string;
  title: string;
  detail: string;
  icon: ReactNode;
};

const STAGES: Stage[] = [
  {
    n: "01",
    title: "Order the product",
    detail: "Pick a small batch for the squad and we ship it out to your base.",
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
    title: "Athletes onto the app",
    detail: "Your selected athletes get set up on the CONKA app in minutes.",
    icon: (
      <svg {...svgProps}>
        <path d="M7 3h10v18H7z" />
        <path d="M7 16h10" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Baseline on the app",
    detail: "Capture each athlete's starting cognitive scores before any product.",
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
    title: "Take CONKA for 2 to 6 weeks",
    detail: "The squad takes their daily shot across the agreed trial window.",
    icon: (
      <svg {...svgProps}>
        <path d="M9 3h6" />
        <path d="M10 3v4l-2 2v11h8V9l-2-2V3" />
      </svg>
    ),
  },
  {
    n: "05",
    title: "Test consistently",
    detail: "Cognitive testing around 3x per week tracks the change as it happens.",
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
    title: "Data analysis and feedback",
    detail: "We read the squad's data back with a coach's view and clear recommendations.",
    icon: (
      <svg {...svgProps}>
        <path d="M4 5v14h16" />
        <path d="M7 15l4-5 3 3 5-7" />
      </svg>
    ),
  },
];

export default function PilotProgramme() {
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

      {/* Staged flow */}
      <p className="brand-eyebrow mt-10 mb-6">{"// How a pilot runs"}</p>
      <ol className="relative">
        {STAGES.map((s, i) => {
          const isLast = i === STAGES.length - 1;
          return (
            <li key={s.n} className="relative flex gap-4 sm:gap-5 pb-6 last:pb-0">
              {/* Connector line between nodes */}
              {!isLast && (
                <span
                  className="absolute left-[21px] sm:left-[27px] top-12 sm:top-14 bottom-0 w-px bg-black/12"
                  aria-hidden="true"
                />
              )}

              {/* Node: navy icon tile + mono step number */}
              <div className="relative shrink-0">
                <div
                  className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  {s.icon}
                </div>
                <span className="absolute -top-2 -left-2 bg-white border border-black/12 font-mono text-[9px] font-bold tabular-nums text-black/60 px-1 py-0.5 leading-none">
                  {s.n}
                </span>
              </div>

              {/* Content */}
              <div className="pt-1 sm:pt-2 flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-black leading-tight">
                  {s.title}
                </h3>
                <p className="text-sm text-black/65 mt-1 leading-snug max-w-[52ch]">
                  {s.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* De-risk + CTA */}
      <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
