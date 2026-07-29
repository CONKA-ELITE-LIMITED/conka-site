/**
 * Skeleton 14-day calendar for the trial fortnight. Presentational (server) —
 * shows an example fortnight with 10 of 14 days tested, so "aim for about 10 of
 * your 14 days" is something you can see rather than read. Gold stars echo the
 * "Tested" marker in the actual app.
 */

type Day = {
  d: number;
  wd: string;
  tested: boolean;
  kickoff?: boolean;
  baseline?: boolean;
};

// Example fortnight from kickoff (Thu 6 Aug). Exactly 10 tested days.
const DAYS: Day[] = [
  { d: 6, wd: "Thu", tested: true, kickoff: true },
  { d: 7, wd: "Fri", tested: true, baseline: true },
  { d: 8, wd: "Sat", tested: true, baseline: true },
  { d: 9, wd: "Sun", tested: true, baseline: true },
  { d: 10, wd: "Mon", tested: false },
  { d: 11, wd: "Tue", tested: true },
  { d: 12, wd: "Wed", tested: true },
  { d: 13, wd: "Thu", tested: true },
  { d: 14, wd: "Fri", tested: false },
  { d: 15, wd: "Sat", tested: true },
  { d: 16, wd: "Sun", tested: false },
  { d: 17, wd: "Mon", tested: true },
  { d: 18, wd: "Tue", tested: true },
  { d: 19, wd: "Wed", tested: false },
];

const StarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5L2.5 9.9l6.6-.9L12 2.5z" />
  </svg>
);

function Cell({ day }: { day: Day }) {
  const border = day.kickoff
    ? "border-[#6478e0] bg-[#6478e0]/12"
    : day.baseline
      ? "border-white/12 bg-white/[0.05]"
      : "border-white/10 bg-white/[0.02]";
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 ${border}`}
    >
      <span className="text-[9px] uppercase tracking-wide text-white/40">
        {day.wd}
      </span>
      <span className="text-[14px] font-semibold text-white/85">{day.d}</span>
      {day.tested ? (
        <StarIcon className="h-3.5 w-3.5 text-[#f0b24b]" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" aria-hidden />
      )}
    </div>
  );
}

export default function TrialCalendar() {
  const weeks = [DAYS.slice(0, 7), DAYS.slice(7, 14)];
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      {weeks.map((week, i) => (
        <div key={i} className={i === 1 ? "mt-4" : ""}>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Week {i + 1}
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {week.map((day) => (
              <Cell key={day.d} day={day} />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/55">
        <span className="inline-flex items-center gap-1.5">
          <StarIcon className="h-3.5 w-3.5 text-[#f0b24b]" /> A day you tested
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" aria-hidden /> A day
          off
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] border border-[#6478e0] bg-[#6478e0]/20" aria-hidden />{" "}
          Kickoff
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-white/55">
        Ten stars, that&rsquo;s the target: about 10 of your 14 days. Your first
        few tests set your baseline, then every test after adds to your trend.
        Miss one, no drama, just pick it back up.
      </p>
    </div>
  );
}
