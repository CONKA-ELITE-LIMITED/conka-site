import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";

export default function AppInsightsCallout() {
  return (
    <a
      href="/app-insights"
      className="group block border border-white/15 bg-white/[0.07] p-6 lg:p-10 transition-colors hover:bg-white/[0.10] focus:outline-none focus-visible:bg-white/[0.10] focus-visible:border-white/30"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 tabular-nums mb-4">
        {"// Real cognitive data · APP-01"}
      </p>

      <h2
        className="brand-h2 text-white mb-4 max-w-[24ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Curious what 700+ users actually show?
      </h2>

      <p className="text-base lg:text-lg text-white/75 leading-relaxed max-w-[58ch] mb-6">
        Real patterns from real users tracking their cognition every day. The daily curve, the hangover hit, the cost of stress, and where the data is too thin to draw a conclusion.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 tabular-nums">
          {APP_INSIGHTS_TOTALS.users} users · {APP_INSIGHTS_TOTALS.tests.toLocaleString()} tests · {APP_INSIGHTS_TOTALS.monthsSpan} months
        </p>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-white border border-white/40 group-hover:border-white px-4 min-h-[44px] flex items-center transition-colors">
          See the data ↗
        </span>
      </div>
    </a>
  );
}
