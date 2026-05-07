/**
 * Credibility proof points for the CONKA cognitive test, lifted out of
 * the methodology footer onto the surface of /app-insights.
 *
 * Mirrors the stat grid pattern used in AppResearchModal so the same
 * proof points remain consistent across surfaces. Component is
 * content-only (no section/track/bg). Locked source language matches
 * LandingDisclaimer.tsx footnote ^^.
 */

const CREDENTIAL_STATS = [
  {
    value: "93%",
    label: "Sensitivity detecting cognitive change",
    source: "ADePT Study, PMC10533908",
  },
  {
    value: "87.5%",
    label: "Test-retest reliability",
    source: "ADePT Study, PMC10533908",
  },
  {
    value: "14",
    label: "NHS Trusts in clinical validation",
    source: "HRA ISRCTN95636074",
  },
  {
    value: "510(k)",
    label: "FDA cleared as a medical device",
    source: "Cognetivity Neurosciences",
  },
] as const;

export default function CredentialsBadgeBlock() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/12 border border-white/15"
      role="list"
      aria-label="Cognitive test validation"
    >
      {CREDENTIAL_STATS.map((s) => (
        <div
          key={s.value + s.label}
          role="listitem"
          className="bg-[#0a0a0a] p-5 lg:p-6 flex flex-col"
        >
          <p className="font-mono text-[2rem] lg:text-[2.25rem] font-bold text-white tabular-nums leading-none mb-3">
            {s.value}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 leading-snug mb-2">
            {s.label}
          </p>
          <p className="font-mono text-[9px] text-white/35 tabular-nums mt-auto pt-2">
            {s.source}
          </p>
        </div>
      ))}
    </div>
  );
}
