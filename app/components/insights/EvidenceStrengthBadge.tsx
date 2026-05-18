import type { EvidenceStrength } from "@/app/lib/appInsightsTypes";

/**
 * Small all-caps mono pill that surfaces evidence strength inline next
 * to a finding. Three variants. Monochrome by design: the visual ramp
 * communicates rigor without color-coding "good" vs "bad".
 */

type Tone = "dark" | "light";

const DOT_BY_STRENGTH: Record<Tone, Record<EvidenceStrength, string>> = {
  dark: {
    Strong: "bg-white",
    Moderate: "bg-white/55",
    "Early signal": "bg-transparent border border-white/55",
  },
  light: {
    Strong: "bg-[#0a0a0a]",
    Moderate: "bg-[#0a0a0a]/55",
    "Early signal": "bg-transparent border border-[#0a0a0a]/55",
  },
};

const RING_BY_STRENGTH: Record<Tone, Record<EvidenceStrength, string>> = {
  dark: {
    Strong: "border-white/35",
    Moderate: "border-white/22",
    "Early signal": "border-white/15",
  },
  light: {
    Strong: "border-[#0a0a0a]/40",
    Moderate: "border-[#0a0a0a]/25",
    "Early signal": "border-[#0a0a0a]/18",
  },
};

const TEXT_BY_TONE: Record<Tone, string> = {
  dark: "text-white/80",
  light: "text-[#0a0a0a]/85",
};

export default function EvidenceStrengthBadge({
  strength,
  tone = "dark",
}: {
  strength: EvidenceStrength;
  tone?: Tone;
}) {
  const dot = DOT_BY_STRENGTH[tone][strength];
  const ring = RING_BY_STRENGTH[tone][strength];
  const text = TEXT_BY_TONE[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 border ${ring} font-mono text-[9px] uppercase tracking-[0.18em] ${text} tabular-nums`}
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
