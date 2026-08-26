"use client";

import { useState } from "react";
import {
  getPdpIngredientList,
  PDP_DISCLOSURE_COPY,
} from "@/app/lib/mmPdpData";
import { WHO_ITS_FOR } from "./HeroAccordions";
import { getHeroProductType } from "@/app/lib/productHeroHelpers";
import type { ProductHeroId } from "@/app/lib/productTypes";

/* ============================================================================
 * IngredientDisclosureRows (SCRUM-1262, Phase 3b)
 *
 * The four supporting answers, rendered by both heroes directly under the
 * check grid: what is in it, who it is for, what it tastes like, how to take
 * it. They sit inside the buy decision rather than a section away, which is
 * how the reference runs them.
 *
 * No copy is written in this file. Ingredients and Who-is-it-for read the
 * canonical shared sources (`getPdpIngredientList`, `WHO_ITS_FOR`), so a change
 * there reaches the PDP with no second edit.
 *
 * Taste and How-to-take deliberately do NOT use the `faqContent.ts` entries of
 * the same name. Those are product-agnostic and describe Flow and Clear
 * together, and on /conka-flow a row that talks about Clear answers a question
 * the visitor did not ask. Their per-product copy lives in
 * PDP_DISCLOSURE_COPY, which carries the note about keeping the two in step.
 *
 * "Who is it for" has been desktop-only since SCRUM-1260 cut the outcome
 * accordions from the mobile hero, taking this block with them. This row is
 * what returns it to mobile.
 * ========================================================================== */

/**
 * One row. Controlled rather than a native <details> so the close animates too:
 * a <details> drops its content the instant `open` is removed, which snaps.
 *
 * The open/close uses a `grid-template-rows: 0fr -> 1fr` transition. That is
 * the one technique that animates to content height without measuring it in JS.
 * It does run layout each frame, unlike the drawer's transform, but the content
 * is a few short paragraphs in a section that is not scroll-linked, so the cost
 * is negligible. The inner fade is opacity only. Both are skipped entirely
 * under prefers-reduced-motion.
 */
function Row({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const panelId = `pdp-row-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="border-t border-black/12">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-base font-semibold text-black sm:text-lg">
          {label}
        </span>
        {/* Circled +, rotating to an x when the row is open. */}
        <span
          aria-hidden
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-transform duration-200 motion-reduce:transition-none ${
            isOpen ? "rotate-45" : ""
          }`}
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
      </button>

      {/* `inert` while collapsed. The content stays in the DOM so it can
          animate, and a 0fr grid row plus overflow-hidden only hides it
          visually: without this a keyboard user would tab into the collapsed
          Ingredients row and land on the invisible "See all ingredients" link,
          and a screen reader would read every closed row aloud. */}
      <div
        id={panelId}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`flex flex-col gap-3 pb-5 text-sm leading-relaxed text-black/70 transition-opacity duration-200 motion-reduce:transition-none sm:text-base ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IngredientDisclosureRows({
  formulaId,
}: {
  formulaId: ProductHeroId;
}) {
  const ingredientLines = getPdpIngredientList(formulaId);
  const whoItsFor = WHO_ITS_FOR[getHeroProductType(formulaId)];

  const copy = PDP_DISCLOSURE_COPY[formulaId];

  // One open at a time, like the native `name` grouping this replaced.
  const [openRow, setOpenRow] = useState<string | null>(null);
  const toggle = (row: string) =>
    setOpenRow((current) => (current === row ? null : row));

  return (
    <div className="border-b border-black/12">
      <Row
        label="Ingredients"
        isOpen={openRow === "ingredients"}
        onToggle={() => toggle("ingredients")}
      >
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

      <Row
        label="Who is it for"
        isOpen={openRow === "who"}
        onToggle={() => toggle("who")}
      >
        {whoItsFor.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </Row>

      <Row
        label="Taste"
        isOpen={openRow === "taste"}
        onToggle={() => toggle("taste")}
      >
        <p>{copy.taste}</p>
      </Row>

      <Row
        label="How to take"
        isOpen={openRow === "how"}
        onToggle={() => toggle("how")}
      >
        <p>{copy.howToTake}</p>
      </Row>
    </div>
  );
}
