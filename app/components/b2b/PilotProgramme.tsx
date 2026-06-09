/* ============================================================================
 * PilotProgramme
 *
 * B2B USP section for /professionals. Frames the live squad pilot (product +
 * CONKA app + coach's cognitive dashboard + testing cadence) as the de-risk
 * path: prove it on your own squad, then scale to team pricing. Presentational
 * only (Server Component) - the page owns the section wrapper and the #pilot
 * anchor the hero CTA targets. CTA is a templated mailto to Harry; no backend.
 *
 * Clinical grammar: trio header, hairline data cards, mono labels, em-dash
 * bullets, navy interactive accent. No new product or health claims.
 * ========================================================================== */

const PILOT_MAILTO =
  "mailto:harryglover@conka.io?subject=" +
  encodeURIComponent("CONKA squad pilot enquiry") +
  "&body=" +
  encodeURIComponent(
    [
      "Hi Harry,",
      "",
      "We would like to explore a CONKA squad pilot. Some quick context:",
      "",
      "- Estimated squad size:",
      "- Preferred time period:",
      "- Coach's app view of interest (yes / no):",
      "",
      "Thanks,",
    ].join("\n"),
  );

type PilotFormat = {
  index: string;
  name: string;
  duration: string;
  bestFor: string;
  phases: string[];
  features: string[];
};

const FORMATS: PilotFormat[] = [
  {
    index: "01",
    name: "Starter pilot",
    duration: "2 weeks",
    bestFor: "A fast read on a focused group.",
    phases: ["Setup", "2-week trial"],
    features: [
      "Product for 5 to 15 athletes",
      "Squad set up on the CONKA app",
      "Cognitive testing 3x per week",
      "Coach's view to track performance",
    ],
  },
  {
    index: "02",
    name: "In-depth pilot",
    duration: "4 to 6 weeks",
    bestFor: "A measured before-and-after across the squad.",
    phases: ["2-week baseline", "Product phase", "Readout"],
    features: [
      "2-week app baseline before product",
      "Measures the change, not just the level",
      "Cognitive testing 3x per week",
      "Coach's view to track performance",
    ],
  },
];

export default function PilotProgramme() {
  return (
    <div>
      {/* Trio header */}
      <p className="brand-eyebrow mb-4">{"// The squad pilot"}</p>
      <h2
        className="brand-h2 max-w-[20ch] text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Prove it on your own squad first.
      </h2>
      <p className="brand-mono-sub mt-3">
        App &middot; Coach&apos;s dashboard &middot; 3x weekly testing
      </p>
      <p className="brand-body mt-5 max-w-[60ch]">
        Start small and see it on your own athletes. We set your squad up on the
        CONKA app, run a cognitive testing cadence, and give you a coach&apos;s
        view of the data, so you decide on a full order from evidence, not a leap
        of faith.
      </p>

      {/* Format cards */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {FORMATS.map((f) => (
          <div
            key={f.name}
            className="bg-white border border-black/12 p-5 lg:p-6 flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-black/8 pb-3">
              <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
                {f.index}.
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
                {f.name}
              </span>
            </div>

            <p className="font-mono text-3xl font-bold tabular-nums text-[#1B2757] mt-5 leading-none">
              {f.duration}
            </p>
            <p className="text-sm text-black/70 mt-3">{f.bestFor}</p>

            {/* Phase sequence */}
            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1">
              {f.phases.map((p, i) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1B2757] tabular-nums">
                    {p}
                  </span>
                  {i < f.phases.length - 1 && (
                    <span className="font-mono text-black/30" aria-hidden="true">
                      &rarr;
                    </span>
                  )}
                </span>
              ))}
            </div>

            <ul className="mt-5 flex flex-col gap-2.5 border-t border-black/8 pt-5">
              {f.features.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-black/75 leading-snug"
                >
                  <span className="font-mono text-black/30 shrink-0" aria-hidden="true">
                    &mdash;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* De-risk + CTA */}
      <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="brand-body max-w-[46ch]">
          A pilot is a small batch with the data layer on top. Prove it on your
          squad, then scale to team pricing.
        </p>
        <a
          href={PILOT_MAILTO}
          className="brand-btn brand-btn-accent inline-flex items-center justify-center min-h-[52px] w-full lg:w-auto text-sm uppercase tracking-[0.15em] whitespace-nowrap"
        >
          Enquire about a pilot
        </a>
      </div>
    </div>
  );
}
