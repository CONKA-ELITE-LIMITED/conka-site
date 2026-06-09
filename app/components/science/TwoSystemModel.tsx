const SYSTEMS = [
  {
    name: "Adaptogens",
    role: "Resilience to load, over time.",
    description:
      "Adaptogens help the body hold its line under sustained stress, steadying the systems that fatigue, fray, and tip into burnout. The effect is not a hit you feel once. It builds with consistent use, raising the floor you operate from.",
    footer: "Builds with use",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    name: "Nootropics",
    role: "Acute cognitive performance.",
    description:
      "Nootropics work on the performance itself, sharpening attention, processing speed, and recall when the demand is in front of you. This is the part you feel on the day, in the session, under the deadline.",
    footer: "Felt on the day",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export default function TwoSystemModel() {
  return (
    <div>
      <div className="mb-8 lg:mb-10 max-w-2xl">
        <p className="brand-eyebrow mb-3">{"// The model · SCI-03"}</p>
        <h2
          className="brand-h2 text-black mb-4"
          style={{ letterSpacing: "-0.02em" }}
        >
          Two systems, one daily brain.
        </h2>
        <p className="text-sm md:text-base text-black/75 leading-relaxed">
          The brain is the most complex organ we know of, so we treat it like a
          system worth engineering for, not a market to sell hype into. CONKA is
          built on two complementary classes of active that do two different
          jobs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SYSTEMS.map((sys, idx) => (
          <div key={sys.name} className="bg-white border border-black/12">
            {/* Header row */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                SYS-{String(idx + 1).padStart(2, "0")} · System {idx + 1} / 2
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                {sys.footer}
              </span>
            </div>

            {/* Body */}
            <div className="p-5 lg:p-6">
              <div
                className="w-11 h-11 flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: "#1B2757" }}
              >
                {sys.icon}
              </div>
              <h3 className="text-lg lg:text-xl font-semibold leading-tight text-black mb-1">
                {sys.name}
              </h3>
              <p className="text-sm md:text-base font-medium text-black mb-3">
                {sys.role}
              </p>
              <p className="text-sm text-black/70 leading-relaxed">
                {sys.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bridge to Flow and Clear, kept equal */}
      <div className="mt-6 lg:mt-8 border-l-2 border-[#1B2757] pl-5 lg:pl-6 max-w-2xl">
        <p className="text-base md:text-lg text-black leading-relaxed">
          It is also why CONKA comes in two formulas. Flow and Clear draw on both
          systems in different balances, each tuned to a different kind of
          demand. Neither is the lite version of the other.
        </p>
      </div>
    </div>
  );
}
