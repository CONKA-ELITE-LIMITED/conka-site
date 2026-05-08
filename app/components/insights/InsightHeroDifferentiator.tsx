import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";

/**
 * /app-insights hero. Lands the differentiation: this isn't third-party
 * literature, it's measured cognitive performance from real CONKA app
 * users. Page wraps this in brand-section.brand-hero-first + brand-track.
 * Component is content-only.
 */
export default function InsightHeroDifferentiator() {
  const stats = [
    { value: APP_INSIGHTS_TOTALS.users.toLocaleString(), label: "Users tracked" },
    { value: APP_INSIGHTS_TOTALS.tests.toLocaleString(), label: "Cognitive tests" },
    { value: `${APP_INSIGHTS_TOTALS.monthsSpan}`, label: "Months of data" },
    { value: `${APP_INSIGHTS_TOTALS.reportCount}`, label: "Public reports" },
  ];

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-4">
        {"// Real cognitive data · APP-01"}
      </p>

      <h1
        id="app-insights-hero"
        className="brand-h1 text-white mb-6 max-w-[22ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        We don&apos;t ask if CONKA works. We measure it.
      </h1>

      <p className="text-base lg:text-lg text-white/90 leading-relaxed max-w-[68ch] mb-10">
        Every chart on this page came from real CONKA app users running an
        FDA-cleared cognitive test on themselves, every day, alongside the days
        they take CONKA and the days they don&apos;t. Where the signal is strong,
        we say so. Where the data is too thin to draw a conclusion, we say that too.
      </p>

      {/* Stats ribbon. Single border, hairline dividers between cells. */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/15 border border-white/15"
        role="list"
        aria-label="Dataset totals"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            role="listitem"
            className="bg-[#0a0a0a] px-4 py-5 lg:px-5 lg:py-6 flex flex-col gap-2"
          >
            <p className="font-mono text-2xl lg:text-[2rem] font-bold text-white tabular-nums leading-none">
              {s.value}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
