import type { EvidenceStrength } from "@/app/lib/appInsightsTypes";

/**
 * The evidence line every finding carries: strength pill, an optional
 * "Early signal" chip for small samples, and the sample size. This is what
 * keeps the light page serious, so it sits beside every number, not behind
 * a disclosure. Monochrome by design: the dot ramp communicates rigour
 * without colour-coding "good" vs "bad".
 */

const DOT_BY_STRENGTH: Record<EvidenceStrength, string> = {
  Strong: "bg-[var(--brand-navy)]",
  Moderate: "bg-[var(--brand-navy)]/45",
  "Early signal": "border border-[var(--brand-navy)]/55",
};

export default function EvidenceStrengthBadge({
  strength,
  earlySignal = false,
  sample,
}: {
  strength: EvidenceStrength;
  earlySignal?: boolean;
  /** Sample label shown after the pills, e.g. "712 users". */
  sample?: string;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-xs font-medium text-black/60">
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-[#eef0f5] px-2.5 py-1 font-semibold text-[var(--brand-navy)]"
        aria-label={`Evidence strength: ${strength}`}
      >
        <span
          className={`block h-1.5 w-1.5 rounded-full ${DOT_BY_STRENGTH[strength]}`}
          aria-hidden="true"
        />
        {strength}
      </span>
      {earlySignal && (
        <span className="rounded-full border border-dashed border-[var(--brand-navy)]/40 px-2.5 py-[3px] font-semibold text-[var(--brand-navy)]">
          Early signal
        </span>
      )}
      {sample && <span className="tabular-nums">{sample}</span>}
    </span>
  );
}
