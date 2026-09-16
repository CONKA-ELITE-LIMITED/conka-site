import type { ReactNode } from "react";
import {
  CATEGORY_INTRO,
  CATEGORY_EXPLAINERS,
  INGREDIENT_RESEARCH,
  LITERATURE_REFERENCES,
  type CategoryIcon,
  type IngredientGroup,
} from "@/app/lib/scienceContent";
import { IconBrain, IconLeaf } from "@/app/components/landing/icons";
import ScienceDisclosure from "./ScienceDisclosure";

/* ============================================================================
 * ScienceCategories (SCRUM-1352, Simple DTC)
 *
 * "What are nootropics and adaptogens?" Answer-first: the first
 * sentence of each card is the definition, so an answer engine can quote it
 * alone. Two equal cards, then a short "why nature makes them" beat.
 *
 * Depth layer: every active with one human study. The dose shown is the dose
 * the STUDY used. Our own per-shot amounts are patented and never reach the
 * client, and the copy says so rather than leaving the gap unexplained.
 * ========================================================================== */

const ICONS: Record<CategoryIcon, (props: { className?: string }) => ReactNode> = {
  brain: IconBrain,
  leaf: IconLeaf,
};

const GROUP_ORDER: IngredientGroup[] = [
  "Adaptogens",
  "Nootropics",
  "Antioxidants",
  "Amino acids",
  "Vitamins",
  "Absorption",
];

export default function ScienceCategories() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2 className="brand-h2 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          {CATEGORY_INTRO.heading}
        </h2>
        <p className="text-base leading-relaxed text-black/80">{CATEGORY_INTRO.body}</p>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 lg:mb-4 lg:grid-cols-2 lg:gap-4">
        {CATEGORY_EXPLAINERS.map((category) => {
          const Icon = ICONS[category.icon];
          return (
            <article
              key={category.id}
              className="flex flex-col rounded-md bg-[#eef0f5] p-5 text-black lg:p-8"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-navy)] text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[var(--brand-navy)]">
                  {category.timing}
                </span>
              </div>
              <h3 className="mb-3 text-2xl font-bold leading-tight text-black">
                {category.name}
              </h3>
              <p className="mb-3 text-base font-medium leading-relaxed text-black">
                {category.definition}
              </p>
              <p className="mb-5 text-base leading-relaxed text-black/80">
                {category.analogy}
              </p>
              <p className="mb-2 mt-auto text-sm font-semibold text-black">In CONKA</p>
              <ul className="flex flex-wrap gap-2">
                {category.examples.map((name) => (
                  <li
                    key={name}
                    className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-black"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="mb-3 border-l-4 border-[var(--brand-navy)] py-1 pl-5 lg:mb-4">
        <h3 className="mb-1.5 text-lg font-bold text-black">{CATEGORY_INTRO.natureHeading}</h3>
        <p className="max-w-[70ch] text-base leading-relaxed text-black/80">
          {CATEGORY_INTRO.nature}
        </p>
      </div>

      <div className="mt-6 rounded-md bg-white px-5 text-black shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 lg:px-8 [&>details:first-child]:border-t-0">
        <ScienceDisclosure summary="Every active ingredient, and the research behind it">
          <p className="mb-5 max-w-[70ch] text-base leading-relaxed text-black/80">
            One human study for each active. The dose shown is the amount each
            study used. The exact amounts in a CONKA shot are part of our
            patented formula, so we do not publish them.
          </p>

          <div className="space-y-6">
            {GROUP_ORDER.map((group) => {
              const rows = INGREDIENT_RESEARCH.filter((row) => row.group === group);
              if (rows.length === 0) return null;
              return (
                <div key={group}>
                  <h4 className="mb-1 text-sm font-semibold text-[var(--brand-navy)]">{group}</h4>
                  <ul className="divide-y divide-black/10">
                    {rows.map((row) => (
                      <li
                        key={row.name}
                        className="grid grid-cols-1 gap-1 py-3 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:items-center md:gap-6"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base font-semibold text-black">{row.name}</span>
                          <span className="rounded-full bg-[#eef0f5] px-2 py-0.5 text-xs font-medium text-black">
                            {row.shot}
                          </span>
                        </span>
                        <span className="text-base leading-snug text-black">
                          {row.finding}
                          <span className="block text-sm text-black/60">
                            Study dose: {row.studyDose}
                          </span>
                        </span>
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${row.pmid}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--brand-navy)] underline-offset-4 hover:underline"
                        >
                          PubMed {row.pmid} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="mb-2 mt-6 text-sm font-semibold text-black">Further reading</p>
          <ul className="space-y-1.5">
            {LITERATURE_REFERENCES.map((ref) => (
              <li key={`${ref.citation}-${ref.topic}`} className="text-sm text-black/80">
                {ref.citation}. {ref.topic}.
              </li>
            ))}
          </ul>
        </ScienceDisclosure>
      </div>
    </div>
  );
}
