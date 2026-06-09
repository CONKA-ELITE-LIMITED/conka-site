/* ============================================================================
 * TeamFAQ
 *
 * Procurement objection-handling for the /professionals landing, as native
 * <details> accordions: progressive disclosure with no client JS. Presentational
 * Server Component, content-only. Answers are operational/factual and reuse the
 * Informed Sport claim - no new product or health claims.
 *
 * NOTE: the delivery-timeline answer is deliberately non-committal; replace with
 * a real SLA once confirmed.
 * ========================================================================== */

type QA = { q: string; a: string };

const FAQS: QA[] = [
  {
    q: "Is there a minimum order?",
    a: "No minimum. Per-box pricing improves automatically as your combined Flow and Clear box count grows, so a bigger squad order simply costs less per box.",
  },
  {
    q: "Can we pay by invoice with a PO?",
    a: "Yes. Pay by card, or request a VAT invoice and add your PO number. We send the invoice to your finance team and ship once payment is received.",
  },
  {
    q: "Is it safe for drug-tested athletes?",
    a: "Every batch of CONKA Flow and Clear is independently tested by Informed Sport for over 280 banned substances.",
  },
  {
    q: "What is the difference between Flow and Clear?",
    a: "Flow is the morning shot for focus and drive. Clear is the afternoon shot for clarity and calm under load. Many squads run both across the day.",
  },
  {
    q: "How quickly can you deliver?",
    a: "Orders ship to your training base once payment is confirmed. For a firm timeline on a large or pallet-sized order, just ask and we will confirm before you commit.",
  },
];

export default function TeamFAQ() {
  return (
    <div>
      {/* Trio header */}
      <p className="brand-eyebrow mb-4">{"// Team FAQ"}</p>
      <h2
        className="brand-h2 max-w-[16ch] text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Questions from procurement.
      </h2>

      <div className="mt-8 border-t border-black/12">
        {FAQS.map((f) => (
          <details key={f.q} className="group border-b border-black/12">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-4 min-h-[44px]">
              <span className="text-base font-medium text-black">{f.q}</span>
              <span
                className="font-mono text-xl leading-none shrink-0 transition-transform group-open:rotate-45"
                style={{ color: "#1B2757" }}
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="text-sm text-black/65 leading-relaxed pb-5 max-w-[64ch]">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
