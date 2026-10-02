import type { ReportData } from "@/app/lib/appInsightsTypes";

/* ============================================================================
 * One line icon per report, drawn on a 24px grid with a 1.75 stroke so they
 * read as a set. Used by the finding tiles and the report card eyebrows.
 * Decorative: every use sits next to a text label, so they are aria-hidden.
 * ========================================================================== */

const PATHS: Record<ReportData["id"], React.ReactNode> = {
  "time-of-day": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  "mental-fatigue": (
    <>
      <rect x="3" y="7" width="16" height="10" rx="2" />
      <path d="M22 11v2" />
      <path d="M6.5 10.5v3" />
    </>
  ),
  stress: <path d="M3 12h3l2-5 4 10 2.5-7L17 12h4" />,
  alcohol: (
    <>
      <path d="M8 3h8l-1 6a3 3 0 0 1-6 0L8 3Z" />
      <path d="M12 12v8" />
      <path d="M8.5 21h7" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3.5v2M12 3.5v2" />
    </>
  ),
};

export default function InsightIcon({
  id,
  className = "",
}: {
  id: ReportData["id"];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[id]}
    </svg>
  );
}
