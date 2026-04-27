"use client";

/**
 * AppComparisonTable — CONKA App vs Them differentiation table.
 * Content only. Clinical grammar: hairline card, mono counter header row,
 * navy-tinted "Us" column vs neutral "Them" column.
 */

const ROWS = [
  {
    feature: "Purpose",
    us: "Measures and trains your brain for real performance improvement",
    them: "Tracks general wellness or gives broad lifestyle advice",
  },
  {
    feature: "Measurement",
    us: "Objective cognitive data that shows when you're actually underperforming",
    them: "Relies on how you feel or surface-level metrics",
  },
  {
    feature: "Focus",
    us: "Brain-first. The organ that drives everything",
    them: "Mostly heart rate, steps, sleep or mood tracking",
  },
  {
    feature: "Scientific backing",
    us: "FDA cleared medical device with clinical grounding",
    them: "Often unverified or loosely science-informed",
  },
  {
    feature: "Testing method",
    us: "Uses visual tests (animals) to avoid learning, language or education bias",
    them: "Many tests are affected by prior knowledge or IQ factors",
  },
  {
    feature: "Progress over time",
    us: "Shows measurable cognitive improvement without learning effects",
    them: "Score increases are often just familiarity with the test",
  },
  {
    feature: "Guidance",
    us: "Pairs data with the CONKA formula to actively improve performance",
    them: "Gives numbers with little direction or actionable change",
  },
  {
    feature: "Motivation",
    us: "Keeps you competitive by benchmarking against pro athletes",
    them: "No high-performance comparison or motivational challenge",
  },
];

export function AppComparisonTable() {
  return (
    <div>
      {/* Trio header */}
      <div className="mb-8 lg:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
          {"// Feature comparison · APP-01"}
        </p>
        <h2
          className="brand-h2 text-black mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          Why our app has the best functionality
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          FDA cleared · Brain-first · Measurable outcomes
        </p>
      </div>

      {/* Comparison table */}
      <div className="bg-white border border-black/12 overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[1.1fr_1.35fr_1.35fr] border-b border-black/8">
          <div className="px-4 py-3 border-r border-black/8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
              Feature
            </p>
          </div>
          <div className="px-4 py-3 border-r border-black/8 bg-[#1B2757]/[0.04]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1B2757] tabular-nums">
              CONKA App
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
              Them
            </p>
          </div>
        </div>

        {/* Rows */}
        {ROWS.map((row, idx) => {
          const isLast = idx === ROWS.length - 1;
          return (
            <div
              key={row.feature}
              className={`grid grid-cols-[1.1fr_1.35fr_1.35fr] ${!isLast ? "border-b border-black/8" : ""}`}
            >
              <div className="px-4 py-4 border-r border-black/8 flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-black/35 tabular-nums flex-shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-black leading-snug">
                  {row.feature}
                </span>
              </div>
              <div className="px-4 py-4 border-r border-black/8 bg-[#1B2757]/[0.04]">
                <p className="text-sm text-black/80 leading-relaxed">
                  {row.us}
                </p>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm text-black/55 leading-relaxed">
                  {row.them}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AppComparisonTable;
