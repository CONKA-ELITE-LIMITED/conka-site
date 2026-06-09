import type { ReactNode } from "react";

/* ============================================================================
 * WhyConkaForTeams
 *
 * "What you get" beat for the /professionals landing: the product value a squad
 * gets, distinct from the logistics points in the apply section. Presentational
 * Server Component, content-only (page owns the section wrapper). Copy reuses
 * existing vetted product language and the Informed Sport claim - no new
 * product or health claims. Clinical grammar: navy icon tiles, hairline cards.
 * ========================================================================== */

const NAVY = "#1B2757";

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

type Item = { title: string; detail: string; icon: ReactNode };

const ITEMS: Item[] = [
  {
    title: "Flow in the morning",
    detail: "The morning shot for focus and drive as the day starts.",
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
      </svg>
    ),
  },
  {
    title: "Clear in the afternoon",
    detail: "The afternoon shot for clarity and calm under load.",
    icon: (
      <svg {...svgProps}>
        <path d="M20 14A8 8 0 1 1 11 5a7 7 0 0 0 9 9z" />
      </svg>
    ),
  },
  {
    title: "Clinically studied ingredients",
    detail: "Built for sport and developed around clinically studied ingredients.",
    icon: (
      <svg {...svgProps}>
        <path d="M9 3h6" />
        <path d="M10 3v6l-5 9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1l-5-9V3" />
      </svg>
    ),
  },
  {
    title: "One shot a day",
    detail: "No powders or protocols to manage. One shot per athlete, every day.",
    icon: (
      <svg {...svgProps}>
        <path d="M9 3h6" />
        <path d="M10 3v4l-2 2v11h8V9l-2-2V3" />
      </svg>
    ),
  },
];

export default function WhyConkaForTeams() {
  return (
    <div>
      {/* Trio header */}
      <p className="brand-eyebrow mb-4">{"// Why CONKA for teams"}</p>
      <h2
        className="brand-h2 max-w-[18ch] text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        A daily system, built for sport.
      </h2>
      <p className="brand-mono-sub mt-3">
        Flow AM &middot; Clear PM &middot; One shot a day
      </p>

      <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ITEMS.map((it) => (
          <div
            key={it.title}
            className="bg-white border border-black/12 p-5 lg:p-6 flex items-start gap-4"
          >
            <div
              className="w-11 h-11 flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: NAVY }}
            >
              {it.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-base lg:text-lg font-semibold text-black leading-tight">
                {it.title}
              </h3>
              <p className="text-sm text-black/65 mt-1.5 leading-snug">
                {it.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
