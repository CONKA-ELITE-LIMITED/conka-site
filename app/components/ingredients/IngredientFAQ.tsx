/**
 * Ingredient FAQ accordion for /ingredients. Native <details> so expand/collapse
 * needs no client JS. Content-only: the page owns the section wrapper.
 *
 * Every question here is also serialised into the page's FAQPage JSON-LD from the
 * same array (app/lib/ingredientFaqContent.ts), so schema == visible.
 */

import Link from "next/link";
import { INGREDIENT_FAQ_ITEMS } from "@/app/lib/ingredientFaqContent";

export default function IngredientFAQ() {
  return (
    <div>
      <p className="brand-eyebrow mb-3">{"// Ingredient questions · FAQ-02"}</p>
      <h2
        className="brand-h2 text-black mb-6 max-w-[22ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Benefits and side effects, ingredient by ingredient
      </h2>

      <div className="border-t border-black/12">
        {INGREDIENT_FAQ_ITEMS.map((item) => (
          <details key={item.id} className="group border-b border-black/12">
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
        ))}
      </div>

      <p className="mt-8 text-sm text-black/60">
        <Link
          href="/faq"
          className="text-black underline decoration-black/20 hover:decoration-black"
        >
          See all questions
        </Link>{" "}
        or email{" "}
        <a
          href="mailto:info@conka.io"
          className="text-black underline decoration-black/20 hover:decoration-black"
        >
          info@conka.io
        </a>
      </p>

      {/* Study doses cited above are the doses used in the referenced trials, not
          CONKA's per-ingredient amounts. CONKA is a food supplement and is not
          intended to diagnose, treat, cure or prevent any disease. */}
      <p className="mt-6 text-xs text-black/45 leading-relaxed max-w-[68ch]">
        Doses quoted are those used in the cited studies, not the amount in a CONKA
        shot. CONKA is a food supplement and is not intended to diagnose, treat, cure
        or prevent any disease.
      </p>
    </div>
  );
}
