import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CATEGORY_INTRO,
  CATEGORY_EXPLAINERS,
  type CategoryIcon,
} from "@/app/lib/scienceContent";
import { IconBrain, IconLeaf } from "@/app/components/landing/icons";

/* ============================================================================
 * ScienceCategories (SCRUM-1352, Simple DTC)
 *
 * "What are nootropics and adaptogens?" Answer-first: the first sentence of
 * each card is the definition, so an answer engine can quote it alone.
 *
 * Each card opens with a strip of three ingredient renders, labelled in a pill
 * on the image (the tmrw studies-card pattern), so the category is something
 * you can see before it is something you read. Ingredient-level research lives
 * on /ingredients; this section links there rather than repeating it.
 * ========================================================================== */

const ICONS: Record<CategoryIcon, (props: { className?: string }) => ReactNode> = {
  brain: IconBrain,
  leaf: IconLeaf,
};

export default function ScienceCategories() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2 className="brand-h1 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          {CATEGORY_INTRO.heading}
        </h2>
        <p className="text-base leading-relaxed text-black/80">{CATEGORY_INTRO.body}</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 lg:mb-10 lg:grid-cols-2 lg:gap-4">
        {CATEGORY_EXPLAINERS.map((category) => {
          const Icon = ICONS[category.icon];
          return (
            <article
              key={category.id}
              className="flex flex-col overflow-hidden rounded-md bg-[#eef0f5] text-black"
            >
              <ul className="grid grid-cols-3 gap-px bg-[#eef0f5]">
                {category.examples.map((example) => (
                  <li key={example.name} className="relative aspect-square overflow-hidden bg-white">
                    <Image
                      src={example.image}
                      alt={example.name}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 200px, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 left-2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold leading-tight text-black sm:text-xs">
                      {example.name}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-1 flex-col p-5 lg:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-2xl font-bold leading-tight text-black">
                    {category.name}
                  </h3>
                </div>
                <span className="mb-4 w-fit whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[var(--brand-navy)]">
                  {category.timing}
                </span>
                <p className="mb-3 text-base font-medium leading-relaxed text-black">
                  {category.definition}
                </p>
                <p className="text-base leading-relaxed text-black/80">{category.analogy}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="border-l-4 border-[var(--brand-navy)] py-1 pl-5">
        <h3 className="mb-1.5 text-lg font-bold text-black">{CATEGORY_INTRO.natureHeading}</h3>
        <p className="max-w-[70ch] text-base leading-relaxed text-black/80">
          {CATEGORY_INTRO.nature}
        </p>
      </div>

      <div className="mt-8 flex justify-center lg:justify-start">
        <Link
          href="/ingredients"
          className="inline-flex min-h-[44px] items-center rounded-full border-2 border-[var(--brand-navy)] px-6 text-sm font-semibold text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-navy)] hover:text-white"
        >
          {CATEGORY_INTRO.linkLabel}
        </Link>
      </div>
    </div>
  );
}
