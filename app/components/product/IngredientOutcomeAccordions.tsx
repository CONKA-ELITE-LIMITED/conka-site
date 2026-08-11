"use client";

import Image from "next/image";
import {
  getOrderedActiveIngredients,
  type IngredientData,
} from "@/app/lib/ingredientsData";

/* ============================================================================
 * IngredientOutcomeAccordions (SCRUM-1209)
 *
 * The Flow PDP ingredient section, Magic Mind style: ingredients grouped under
 * three outcome headings, each a stack of collapsed accordion cards. The
 * collapsed face is an icon + name + chevron; expanding reveals the render, a
 * bold one-line claim, the description, and a "Studies support" PubMed link.
 *
 * Reads everything from the shared ingredientsData.ts. Flow only for now
 * (buckets reference Flow ingredient ids); Clear/Both keep ClinicalIngredients.
 * ========================================================================== */

const NAVY = "#1B2757";

// Magic Mind's three outcome buckets, mapped to Flow's six ingredients. Black
// Pepper is not its own card: it is folded into the Turmeric card as its
// absorption partner (see PARTNER_OF).
const BUCKETS: {
  id: string;
  title: string;
  subhead: string;
  ingredientIds: string[];
}[] = [
  {
    id: "mental-performance",
    title: "Mental performance",
    subhead: "Sharper focus, calm attention, and recall.",
    ingredientIds: ["lemon-balm", "ashwagandha"],
  },
  {
    id: "sustained-energy",
    title: "Sustained energy",
    subhead: "Steady mental energy and stress resilience, without the crash.",
    ingredientIds: ["rhodiola"],
  },
  {
    id: "brain-health",
    title: "Brain health",
    subhead: "Protects neurons and supports long-term cognition.",
    ingredientIds: ["turmeric", "bilberry"],
  },
];

// Ingredient id -> partner ingredient shown inside its card rather than as its
// own accordion. Black Pepper multiplies Turmeric's absorption.
const PARTNER_OF: Record<string, string> = {
  turmeric: "black-pepper",
};

/** First study with a pmid becomes the "Studies support" PubMed link; none => no link. */
function pubmedUrl(ing: IngredientData): string | null {
  const pmid = ing.clinicalStudies.find((s) => s.pmid)?.pmid;
  return pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}` : null;
}

function Chevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-black/40 transition-transform group-open:rotate-180"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IngredientCard({
  ing,
  partner,
}: {
  ing: IngredientData;
  partner?: IngredientData;
}) {
  const studies = pubmedUrl(ing);
  return (
    <details className="group rounded-xl border border-black/10 bg-white">
      {/* Collapsed face: render icon + name + chevron (44px+ tap target) */}
      <summary className="flex cursor-pointer list-none items-center gap-3 p-3.5 [&::-webkit-details-marker]:hidden">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#f1f1f3]">
          {ing.image && (
            <Image
              src={ing.image}
              alt={ing.name}
              fill
              loading="lazy"
              sizes="44px"
              className="object-cover"
            />
          )}
        </span>
        <span className="min-w-0 flex-1 text-base font-semibold leading-snug text-black">
          {ing.name}
        </span>
        <Chevron />
      </summary>

      {/* Expanded: render + bold claim + description + partner note + studies link */}
      <div className="px-3.5 pb-5">
        <div className="border-t border-black/10 pt-4">
          {ing.image && (
            <div className="relative mx-auto mb-4 aspect-square w-40 max-w-full overflow-hidden rounded-lg bg-[#f1f1f3]">
              <Image
                src={ing.image}
                alt={ing.name}
                fill
                loading="lazy"
                sizes="160px"
                className="object-cover"
              />
            </div>
          )}
          <p className="mb-2 text-base font-bold leading-snug text-black">
            {ing.oneLineClaim}
          </p>
          <p className="text-sm leading-relaxed text-black/70">{ing.description}</p>

          {partner && (
            <p className="mt-3 rounded-lg bg-[#f1f1f3] px-3 py-2.5 text-sm leading-snug text-black/70">
              <span className="font-semibold text-black">
                Paired with {partner.name}:
              </span>{" "}
              {partner.oneLineClaim}
            </p>
          )}

          {studies && (
            <a
              href={studies}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4"
              style={{ color: NAVY }}
            >
              Studies support
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
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </details>
  );
}

export default function IngredientOutcomeAccordions() {
  // Flow only. Index the six Flow ingredients by id so buckets can pull them
  // (and Turmeric can pull its Black Pepper partner) without re-querying.
  const byId = new Map(
    getOrderedActiveIngredients("01").map((ing) => [ing.id, ing]),
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-2xl">
        <h2 className="brand-h1 mb-3 text-black">Clinically-backed ingredients</h2>
        <p className="brand-body text-black">
          Every compound at a proven dose and bioavailable form, grouped by what it
          does for you.
        </p>
      </div>

      {BUCKETS.map((bucket) => {
        const items = bucket.ingredientIds
          .map((id) => byId.get(id))
          .filter((ing): ing is IngredientData => Boolean(ing));
        if (items.length === 0) return null;

        // Magic Mind emphasises the second word of each outcome heading.
        const [firstWord, ...rest] = bucket.title.split(" ");

        return (
          <div key={bucket.id}>
            <h3 className="mb-1.5 text-2xl font-bold leading-tight text-black">
              {firstWord}{" "}
              <span className="italic font-semibold">{rest.join(" ")}</span>
            </h3>
            <p className="brand-body mb-4 text-black/70">{bucket.subhead}</p>
            <div className="flex flex-col gap-3">
              {items.map((ing) => {
                const partnerId = PARTNER_OF[ing.id];
                const partner = partnerId ? byId.get(partnerId) : undefined;
                return <IngredientCard key={ing.id} ing={ing} partner={partner} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
