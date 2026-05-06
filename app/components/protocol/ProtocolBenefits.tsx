"use client";

import {
  ProtocolId,
  protocolContent,
  formulaContent,
  FORMULA_COLORS,
} from "@/app/lib/productData";

interface ProtocolBenefitsProps {
  protocolId: ProtocolId;
}

export default function ProtocolBenefits({
  protocolId,
}: ProtocolBenefitsProps) {
  const protocol = protocolContent[protocolId];
  const formula01 = formulaContent["01"];
  const formula02 = formulaContent["02"];
  const benefitStats = protocol.benefitStats ?? [];

  return (
    <section className="premium-section">
      <div className="premium-container max-w-6xl mx-auto px-6 md:px-16 py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="premium-section-heading text-3xl md:text-4xl font-bold mb-2">
            Why This Protocol Works
          </h2>
          <p className="premium-annotation text-xl">the science of synergy</p>
        </div>

        {/* Protocol-level stats grid (stat-led, like FormulaBenefitsStats) */}
        {benefitStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {benefitStats.map((item, idx) => (
              <div key={idx} className="premium-box p-4 text-center">
                <p className="font-mono text-2xl md:text-3xl font-bold text-current leading-tight">
                  {item.stat}
                </p>
                <p className="premium-data text-sm opacity-70 mt-0.5">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Diagram placeholder for Phase 4 */}
        <div className="mb-12" aria-hidden />

        {/* Protocol Benefits (checkmark list) */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {protocol.benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="premium-box p-6 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all"
            >
              <div className="flex items-start gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500 flex-shrink-0 mt-1"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className="font-medium">{benefit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Combined Formula Benefits */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* CONKA Flow Benefits */}
          <div className="premium-box overflow-hidden">
            <div className={`${FORMULA_COLORS["01"].bg} p-4 text-white`}>
              <h3 className="text-xl font-bold">CONKA Flow Benefits</h3>
              <p className="font-mono text-sm opacity-80">
                Energy & Resilience
              </p>
            </div>
            <div className="p-6 space-y-4">
              {formula01.benefits.slice(0, 3).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span
                    className={`text-2xl font-bold font-mono ${FORMULA_COLORS["01"].text}`}
                  >
                    {benefit.stat}
                  </span>
                  <div>
                    <p className="font-bold">{benefit.title}</p>
                    <p className="font-mono text-xs opacity-70">
                      {benefit.annotation}
                    </p>
                  </div>
                </div>
              ))}
              <a
                href="/conka-flow"
                className="inline-flex items-center gap-2 font-mono text-sm hover:opacity-70 transition-all mt-4"
              >
                Learn more about CONKA Flow
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* CONKA Clear Benefits */}
          <div className="premium-box overflow-hidden">
            <div className={`${FORMULA_COLORS["02"].bg} p-4 text-white`}>
              <h3 className="text-xl font-bold">CONKA Clear Benefits</h3>
              <p className="font-mono text-sm opacity-80">
                Clarity & Performance
              </p>
            </div>
            <div className="p-6 space-y-4">
              {formula02.benefits.slice(0, 3).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span
                    className={`text-2xl font-bold font-mono ${FORMULA_COLORS["02"].text}`}
                  >
                    {benefit.stat}
                  </span>
                  <div>
                    <p className="font-bold">{benefit.title}</p>
                    <p className="font-mono text-xs opacity-70">
                      {benefit.annotation}
                    </p>
                  </div>
                </div>
              ))}
              <a
                href="/conka-clarity"
                className="inline-flex items-center gap-2 font-mono text-sm hover:opacity-70 transition-all mt-4"
              >
                Learn more about CONKA Clear
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Synergy Explanation */}
        <div className="mt-16 premium-box p-8 text-center">
          <h3 className="premium-section-heading text-2xl font-bold mb-4">
            The Power of Combination
          </h3>
          <p className="premium-annotation text-lg opacity-80 max-w-2xl mx-auto">
            When taken as part of a protocol, CONKA Flow and CONKA Clear work
            together synergistically. CONKA Flow&apos;s adaptogens build your
            daily foundation while CONKA Clear&apos;s nootropics enhance peak
            performance when you need it most.
          </p>
        </div>
      </div>
    </section>
  );
}
