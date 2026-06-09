const FAILURES = [
  {
    title: "Caffeine theatre",
    category: "The stimulant trap",
    description:
      "Most brain products are a stimulant in a new bottle. Caffeine makes you feel switched on, but feeling wired is not the same as thinking better, and the crash takes back what it lent you.",
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
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "Proprietary blends",
    category: "Hidden doses",
    description:
      'A "proprietary blend" lists ingredients but hides how much of each. It almost always means the active is there in name only, dosed far below what the research used.',
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
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
  },
  {
    title: "No mechanism, no proof",
    category: "Claims with nothing under them",
    description:
      "Big promises, no explanation of how, and no data to check. If a brand cannot tell you why an ingredient works or show you the evidence, the claim is marketing, not science.",
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
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function ScienceDifferent() {
  return (
    <div>
      <div className="mb-8 lg:mb-10 max-w-2xl">
        <p className="brand-eyebrow mb-3">{"// The problem · SCI-02"}</p>
        <h2
          className="brand-h2 text-black mb-4"
          style={{ letterSpacing: "-0.02em" }}
        >
          Why most brain products fail
        </h2>
        <p className="text-sm md:text-base text-black/75 leading-relaxed">
          The category is crowded with products that look scientific and behave
          like sugar pills. Three failures show up again and again.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {FAILURES.map((card, idx) => (
          <div key={card.title} className="bg-white border border-black/12">
            {/* Header row */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                {String(idx + 1).padStart(2, "0")} · Failure
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                {card.category}
              </span>
            </div>

            {/* Body */}
            <div className="p-5 lg:p-6">
              <div
                className="w-11 h-11 flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: "#1B2757" }}
              >
                {card.icon}
              </div>
              <h3 className="text-base lg:text-lg font-semibold leading-tight text-black mb-1.5">
                {card.title}
              </h3>
              <p className="text-sm text-black/70 leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bridge into the two-system model */}
      <div className="mt-6 lg:mt-8 border-l-2 border-[#1B2757] pl-5 lg:pl-6 max-w-2xl">
        <p className="text-base md:text-lg text-black leading-relaxed">
          We built CONKA the opposite way: named actives at clinical doses, a
          clear mechanism for each, and a model you can hold us to.
        </p>
      </div>
    </div>
  );
}
