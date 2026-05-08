import { PROFESSIONAL_TRIALS } from "@/app/lib/revolutTrialData";

export default function ProfessionalTrialsBlock() {
  return (
    <div className="border border-white/20 bg-white/[0.06] p-6 lg:p-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 tabular-nums mb-4">
          {"// Professional Trials · PROOF-01"}
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:gap-6 gap-3">
          <p
            className="font-mono text-5xl lg:text-7xl text-white tabular-nums leading-none"
            style={{ letterSpacing: "-0.03em" }}
          >
            {PROFESSIONAL_TRIALS.count}
          </p>
          <p className="text-base lg:text-lg text-white/80 leading-snug max-w-[36ch]">
            trials run with professional sports organisations.
          </p>
        </div>
      </div>

      {/* Sport tags */}
      <div className="flex flex-wrap gap-2">
        {PROFESSIONAL_TRIALS.sports.map((sport) => (
          <span
            key={sport}
            className="border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60"
          >
            {sport}
          </span>
        ))}
      </div>

      {/* NDA note + CTA */}
      <div className="border-t border-white/10 pt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35 tabular-nums">
          {PROFESSIONAL_TRIALS.note}
        </p>
        <a
          href="mailto:sales@conka.io?subject=Trial enquiry"
          className="inline-flex items-center justify-center w-full lg:w-auto px-6 py-3 border border-white/40 text-white/70 font-mono text-[11px] uppercase tracking-[0.18em] hover:border-white hover:text-white transition-colors min-h-[44px] whitespace-nowrap"
        >
          Enquire about a trial
        </a>
      </div>
    </div>
  );
}
