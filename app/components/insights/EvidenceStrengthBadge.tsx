import type { EvidenceStrength } from "@/app/lib/appInsightsTypes";

/**
 * Small all-caps mono pill that surfaces evidence strength inline next
 * to a finding. Three variants. Monochrome by design: the visual ramp
 * communicates rigor without color-coding "good" vs "bad".
 */

const DOT_BY_STRENGTH: Record<EvidenceStrength, string> = {
  Strong: "bg-white",
  Moderate: "bg-white/55",
  "Early signal": "bg-transparent border border-white/55",
};

const RING_BY_STRENGTH: Record<EvidenceStrength, string> = {
  Strong: "border-white/35",
  Moderate: "border-white/22",
  "Early signal": "border-white/15",
};

export default function EvidenceStrengthBadge({
  strength,
}: {
  strength: EvidenceStrength;
}) {
  const dot = DOT_BY_STRENGTH[strength];
  const ring = RING_BY_STRENGTH[strength];

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 border ${ring} font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 tabular-nums`}
      aria-label={`Evidence strength: ${strength}`}
    >
      <span
        className={`block w-1.5 h-1.5 rounded-full ${dot}`}
        aria-hidden="true"
      />
      Evidence: {strength}
    </span>
  );
}
