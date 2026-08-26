"use client";

import { pickFaqItems, stripClaimAnchors } from "@/app/lib/faqContent";
import { getPdpIngredientList } from "@/app/lib/mmPdpData";
import { WHO_ITS_FOR } from "./HeroAccordions";
import { getHeroProductType } from "@/app/lib/productHeroHelpers";
import type { ProductHeroId } from "@/app/lib/productTypes";

/* ============================================================================
 * IngredientDisclosureRows (SCRUM-1262, Phase 3b)
 *
 * The four supporting answers that sit under the ingredient grid: what is in
 * it, who it is for, what it tastes like, and how to take it.
 *
 * Every row reads from the canonical source rather than restating copy here,
 * so a change in faqContent.ts or HeroAccordions.tsx reaches the PDP with no
 * second edit. Native <details>, so it costs no client JS to open a row.
 *
 * "Who is it for" in particular has been desktop-only since SCRUM-1260 cut the
 * outcome accordions from the mobile hero, taking this block with them. This
 * row is what returns it to mobile.
 * ========================================================================== */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details name="pdp-ingredient-disclosure" className="group border-t border-black/12">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span className="text-base font-semibold text-black sm:text-lg">
          {label}
        </span>
        {/* Circled +, rotating to a x when the row is open. */}
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-transform duration-200 group-open:rotate-45"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>

      <div className="flex flex-col gap-3 pb-5 text-sm leading-relaxed text-black/70 sm:text-base">
        {children}
      </div>
    </details>
  );
}

export default function IngredientDisclosureRows({
  formulaId,
}: {
  formulaId: ProductHeroId;
}) {
  const ingredientLines = getPdpIngredientList(formulaId);
  const whoItsFor = WHO_ITS_FOR[getHeroProductType(formulaId)];

  // Both takes the sequencing answer as well, since it runs two formulas.
  const [taste] = pickFaqItems("taste");
  const howToTake = pickFaqItems(
    ...(formulaId === "03" ? ["how-to-take", "when-to-take"] : ["how-to-take"]),
  );

  return (
    <div className="mt-12 border-b border-black/12">
      <Row label="Ingredients">
        {ingredientLines.map((line) => (
          <p key={line.label ?? "list"}>
            {line.label && (
              <strong className="font-semibold text-black">{line.label} </strong>
            )}
            {line.text}
          </p>
        ))}
        {/* The hub link the desktop hero's outcome accordions used to carry. */}
        <a
          href="/ingredients"
          className="inline-flex items-center gap-1 self-start text-sm font-semibold text-black underline underline-offset-4"
        >
          See all ingredients
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </Row>

      <Row label="Who is it for">
        {whoItsFor.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </Row>

      {taste && <Row label="Taste">{stripClaimAnchors(taste.answer)}</Row>}

      <Row label="How to take">
        {howToTake.map((item) => (
          <p key={item.id}>{stripClaimAnchors(item.answer)}</p>
        ))}
      </Row>
    </div>
  );
}
