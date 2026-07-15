/**
 * FAQ hub accordions, grouped by category. Native <details> so expand/collapse
 * works with no client JS.
 *
 * Every question rendered here is also serialised into the page's FAQPage
 * JSON-LD from the same array. Schema describing content the page does not show
 * breaches Google's policy, so the two must never diverge.
 */

import { FAQ_ITEMS, type FaqCategory, type FaqItem } from "@/app/lib/faqContent";

const SECTIONS: { category: FaqCategory; title: string; eyebrow: string }[] = [
  { category: "about", title: "About CONKA", eyebrow: "// 01" },
  { category: "efficacy", title: "Does it actually work?", eyebrow: "// 02" },
  { category: "safety", title: "Safety, side effects and medication", eyebrow: "// 03" },
  { category: "usage", title: "Taking CONKA", eyebrow: "// 04" },
  { category: "commercial", title: "Price, subscription and delivery", eyebrow: "// 05" },
];

function FaqRow({ item }: { item: FaqItem }) {
  return (
    <details className="group border-b border-black/12">
      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-4 min-h-[44px]">
        <h3 className="text-base font-medium text-black">{item.question}</h3>
        <span
          className="font-mono text-xl leading-none shrink-0 transition-transform group-open:rotate-45 mt-0.5"
          style={{ color: "#1B2757" }}
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <p className="text-sm text-black/65 leading-relaxed pb-5 max-w-[68ch]">
        {item.answer}
      </p>
    </details>
  );
}

export default function FaqHub() {
  return (
    <div className="flex flex-col gap-14">
      {SECTIONS.map((section) => {
        const items = FAQ_ITEMS.filter((i) => i.category === section.category);
        if (items.length === 0) return null;

        return (
          <section key={section.category} aria-label={section.title}>
            <p className="brand-eyebrow mb-3">{section.eyebrow}</p>
            <h2
              className="brand-h2 text-black mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              {section.title}
            </h2>
            <div className="border-t border-black/12">
              {items.map((item) => (
                <FaqRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
