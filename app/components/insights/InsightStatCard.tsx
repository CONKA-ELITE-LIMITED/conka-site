import type { StatCard as StatCardData } from "@/app/lib/appInsightsTypes";

/**
 * One supporting reading inside a report's "See the full data" layer: the
 * value, what it means, and the sample it came from. Static on purpose: it
 * lives behind a disclosure, so a count-up would play to nobody.
 */
export default function InsightStatCard({ stat }: { stat: StatCardData }) {
  return (
    <div className="flex w-full flex-col rounded-md bg-white p-4 text-black ring-1 ring-black/5 lg:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-black/50">
        {stat.topic}
      </p>
      <p className="mt-2 text-3xl font-bold leading-none tabular-nums text-[var(--brand-navy)]">
        {stat.value}
      </p>
      <p className="mt-3 text-sm leading-snug text-black/75">{stat.context}</p>
      <p className="mt-auto pt-3 text-xs tabular-nums text-black/50">
        {stat.caveat}
      </p>
    </div>
  );
}
