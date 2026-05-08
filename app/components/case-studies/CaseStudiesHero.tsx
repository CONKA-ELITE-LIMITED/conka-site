import {
  athletes,
  getTotalTestsCompleted,
  getAverageImprovementAcrossAll,
} from "@/app/lib/caseStudiesData";

/**
 * /case-studies hero. Orients a first-time visitor: what these case studies
 * are, why they can trust the data, and what to do with it.
 * Page wraps this in brand-section.brand-hero-first + brand-track.
 * Component is content-only.
 */
export default function CaseStudiesHero() {
  const stats = [
    { value: String(athletes.length), label: "Case studies" },
    { value: getTotalTestsCompleted().toLocaleString(), label: "Cognitive tests" },
    { value: `+${getAverageImprovementAcrossAll().toFixed(1)}%`, label: "Avg. improvement" },
  ];

  return (
    <div>
      <p className="brand-eyebrow mb-3">{"// Real results, real people · PROOF-01"}</p>

      <h1
        className="brand-h1 text-black mb-6 max-w-[22ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Tested by the people who use it.
      </h1>

      <p className="text-base lg:text-lg text-black/70 leading-relaxed max-w-[64ch] mb-10">
        Most people take a supplement and wonder if it is working. These 38
        decided to find out. Each ran the same 2-minute FDA-cleared cognitive
        test on themselves daily, comparing their performance on CONKA days
        against off days. No paid study. No coached testimonials. At the end of
        each case you will find the exact formula they used.
      </p>

      <div
        className="grid grid-cols-3 gap-px bg-black/12 border border-black/12"
        role="list"
        aria-label="Dataset totals"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            role="listitem"
            className="bg-white px-4 py-5 lg:px-5 lg:py-6 flex flex-col gap-2"
          >
            <p className="font-mono text-2xl lg:text-[2rem] font-bold text-[#1B2757] tabular-nums leading-none">
              {s.value}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
