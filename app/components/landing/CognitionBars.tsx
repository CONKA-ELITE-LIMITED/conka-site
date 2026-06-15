"use client";

import { useInView } from "@/app/hooks/useInView";

/* ============================================================================
 * CognitionBars
 *
 * "Coffee vs Coffee + CONKA" measured-cognition comparison from the CONKA app
 * data report (docs/conkaAppData/coffee-conka-cognition-report.md). Two raw
 * group-mean comparisons (total cognitive score, reaction time) with the
 * robust within-person "64% improved" as the highlight and the observational
 * caveat in the footer. Bars animate width on first view (motion-safe).
 *
 * Honesty: bars are raw group averages; we lead with score + % improved (the
 * defensible numbers) and frame reaction time as "fastest average we measured",
 * never an implied within-person speed gain.
 * ========================================================================== */

const NAVY = "#1B2757";

interface Row {
  label: string;
  value: number;
  /** 0-1 fill fraction against the metric's scale */
  frac: number;
  conka?: boolean;
}

interface Metric {
  title: string;
  hint: string;
  rows: Row[];
}

const METRICS: Metric[] = [
  {
    title: "Cognitive score",
    hint: "higher is better",
    rows: [
      { label: "Coffee", value: 80.6, frac: 0.806 },
      { label: "Coffee + CONKA", value: 86.4, frac: 0.864, conka: true },
    ],
  },
  {
    title: "Reaction time",
    hint: "lower is better",
    rows: [
      { label: "Coffee", value: 430, frac: 430 / 480 },
      { label: "Coffee + CONKA", value: 368, frac: 368 / 480, conka: true },
    ],
  },
];

function Bar({ row, isInView }: { row: Row; isInView: boolean }) {
  const pct = `${Math.round(row.frac * 100)}%`;
  const isMs = row.value >= 200; // reaction-time rows display ms
  return (
    <div className="flex items-center gap-3">
      <span className="w-[110px] flex-shrink-0 text-[12px] font-medium text-black/65">
        {row.label}
      </span>
      <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-black/[0.05]">
        <div
          className="h-full rounded-md motion-safe:[transition:width_1.1s_cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: isInView ? pct : "0%",
            background: row.conka
              ? `linear-gradient(90deg, ${NAVY}, #3a4a82)`
              : "rgba(0,0,0,0.18)",
          }}
        />
        <span
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-[12px] font-bold tabular-nums ${
            row.conka ? "text-white" : "text-black/60"
          }`}
        >
          {isMs ? `${row.value}ms` : row.value.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export default function CognitionBars() {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-black/10 bg-white p-6 md:p-7"
    >
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
        Measured in the CONKA app
      </p>
      <h3 className="mb-5 text-lg font-bold text-[#1d1d1d]">
        Coffee vs Coffee + CONKA
      </h3>

      <div className="flex flex-col gap-5">
        {METRICS.map((m) => (
          <div key={m.title}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-[#1d1d1d]">
                {m.title}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40">
                {m.hint}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {m.rows.map((r) => (
                <Bar key={r.label} row={r} isInView={isInView} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p
        className="mt-5 rounded-xl px-4 py-3 text-[13px] font-semibold leading-snug"
        style={{ background: "rgba(27,39,87,0.06)", color: NAVY }}
      >
        64% improved when they added CONKA to their coffee.
      </p>

      <p className="mt-3 text-[10.5px] leading-tight text-black/40">
        From 200+ tests in the CONKA app. Observational and self-reported.
      </p>
    </div>
  );
}
