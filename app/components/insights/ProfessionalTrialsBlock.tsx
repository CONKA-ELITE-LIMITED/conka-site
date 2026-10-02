import { PROFESSIONAL_TRIALS } from "@/app/lib/revolutTrialData";
import { supportMailtoHref } from "@/app/lib/supportEmail";

/** The B2B exit: the same instrument runs trials with professional sports
 *  organisations. One white card, the count as the headline number, sports
 *  as pills, and an enquiry link. Content-only. */
export default function ProfessionalTrialsBlock() {
  return (
    <div className="flex flex-col gap-6 rounded-lg bg-white p-6 text-black ring-1 ring-black/5 lg:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-6">
        <p
          className="text-6xl font-bold leading-none tabular-nums text-[var(--brand-navy)] lg:text-7xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          {PROFESSIONAL_TRIALS.count}
        </p>
        <p className="max-w-[36ch] text-lg leading-snug text-black/80">
          trials run with professional sports organisations, on the same test.
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {PROFESSIONAL_TRIALS.sports.map((sport) => (
          <li
            key={sport}
            className="rounded-full bg-[#eef0f5] px-3.5 py-1.5 text-sm font-medium text-[var(--brand-navy)]"
          >
            {sport}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 border-t border-black/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs text-black/50">{PROFESSIONAL_TRIALS.note}</p>
        <a
          href={supportMailtoHref({ subject: "Trial enquiry" })}
          className="inline-flex min-h-[44px] w-full items-center justify-center whitespace-nowrap rounded-full border-2 border-[var(--brand-navy)] px-6 py-2.5 text-sm font-semibold text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-navy)] hover:text-white lg:w-auto"
        >
          Enquire about a trial
        </a>
      </div>
    </div>
  );
}
