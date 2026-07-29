/**
 * A plain calendar of the trial. Weekday columns (Mon-Sun), opaque cells: one
 * colour for the 3 baseline days (Thu 6 to Sat 8 Aug), one for the two-week
 * stretch (Mon 10 to Sun 23 Aug). No per-day markers: the days you test are up
 * to you, the point is only which window of dates the trial covers. Content
 * only (no outer container) — the page owns the section.
 */

const HEAD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Phase = "out" | "base" | "fort";
const CELLS: { d: number; phase: Phase }[] = [
  // Week of Aug 3-9 (trial starts Thu 6)
  { d: 3, phase: "out" },
  { d: 4, phase: "out" },
  { d: 5, phase: "out" },
  { d: 6, phase: "base" },
  { d: 7, phase: "base" },
  { d: 8, phase: "base" },
  { d: 9, phase: "out" },
  // The fortnight: Mon 10 - Sun 23
  ...Array.from({ length: 14 }, (_, i) => ({
    d: 10 + i,
    phase: "fort" as Phase,
  })),
];

const CELL_STYLE: Record<Phase, string> = {
  out: "text-white/25",
  base: "bg-[#6478e0] font-semibold text-white",
  fort: "bg-[#2f6f4c] font-semibold text-white",
};

export default function TrialCalendar() {
  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {HEAD.map((wd) => (
          <span
            key={wd}
            className="pb-1 text-center text-[11px] font-medium text-white/60"
          >
            {wd}
          </span>
        ))}
        {CELLS.map((cell) => (
          <div
            key={cell.d}
            className={`flex aspect-square items-center justify-center rounded-lg text-[15px] ${CELL_STYLE[cell.phase]}`}
          >
            {cell.d}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-white">
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-[#6478e0]" aria-hidden /> Baseline
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-[#2f6f4c]" aria-hidden /> Your two
          weeks
        </span>
      </div>

      <p className="mt-4 text-[16px] leading-relaxed text-white">
        Test on at least{" "}
        <span className="font-semibold">10 days across the two weeks</span>. We
        will remind you, so keep notifications on.
      </p>
    </div>
  );
}
