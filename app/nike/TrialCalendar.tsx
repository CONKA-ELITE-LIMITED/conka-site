/**
 * A plain calendar of the trial. Weekday columns (Mon-Sun), opaque cells in a
 * single colour for the trial stretch (Thursday 6 to Thursday 20 August). No
 * per-day markers and no phases: the days you test are up to you, the point is
 * only which window of dates the trial covers. Content only (no outer
 * container) — the page owns the section.
 */

const HEAD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// The trial runs Thursday 6 to Thursday 20 August. Cells outside that window
// are shown greyed for calendar context.
const TRIAL_START = 6;
const TRIAL_END = 20;
const CELLS: { d: number; inTrial: boolean }[] = Array.from(
  { length: 21 },
  (_, i) => {
    const d = 3 + i; // Mon 3 Aug through Sun 23 Aug (three weeks)
    return { d, inTrial: d >= TRIAL_START && d <= TRIAL_END };
  },
);

export default function TrialCalendar() {
  return (
    <div>
      <div
        role="img"
        aria-label="Calendar: the 14-day trial runs from Thursday 6 to Thursday 20 August."
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
      >
        {HEAD.map((wd) => (
          <span
            key={wd}
            aria-hidden
            className="pb-1 text-center text-[11px] font-medium text-white/60"
          >
            {wd}
          </span>
        ))}
        {CELLS.map((cell) => (
          <div
            key={cell.d}
            className={`flex aspect-square items-center justify-center rounded-lg text-[15px] ${
              cell.inTrial
                ? "bg-[#6478e0] font-semibold text-white"
                : "text-white/25"
            }`}
          >
            {cell.d}
          </div>
        ))}
      </div>

      <p className="mt-4 text-[14px] text-white/70 lg:text-center">
        Thursday 6 to Thursday 20 August.
      </p>
    </div>
  );
}
