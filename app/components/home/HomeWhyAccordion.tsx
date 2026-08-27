"use client";

import { useState } from "react";
import Image from "next/image";
import { HOME_WHY_ROWS, HOME_WHY_HEADLINE } from "@/app/lib/homeWhyContent";

/* ============================================================================
 * HomeWhyAccordion (SCRUM-1265, Simple DTC)
 *
 * The home page's second section: the "why" beat that frames a problem before
 * the page sells anything. Structural reference is the Gray Matter home page,
 * whose equivalent section carries four arguments in one numbered accordion
 * instead of spending four sections on them.
 *
 * Built from the rendered design, NOT that page's source markup. The raw HTML
 * reads as a two-column image-left / accordion-right layout; the real design is
 * a left-aligned headline, a soft card, and four INDIVIDUALLY BORDERED row
 * boxes with large numbers in circles sitting outside them. Anyone re-deriving
 * this from the markup will build the wrong thing.
 *
 * Design language is Simple DTC borrowing three clinical devices (the outlined
 * number circles, the hairline row boxes, the highlighted lede line).
 * Deliberately NOT taken from the reference: its grid-paper background and its
 * mono body copy, both of which would read as a foreign block between our hero
 * and our showcase. The accent is navy; the `#1a7f4f` green stays reserved for
 * price savings so it keeps meaning one thing.
 *
 * Client component, for two reasons that a native <details> cannot give:
 *
 *  1. One row is ALWAYS open. Native <details name> lets the visitor close the
 *     open one and leave the section blank, which is what made the first build
 *     read as an empty stack of bars. Clicking the open row here is a no-op.
 *  2. The close animates. A <details> drops its content the instant `open` is
 *     removed, which snaps.
 *
 * The open/close uses the `grid-template-rows: 0fr -> 1fr` transition from
 * IngredientDisclosureRows, the one technique that animates to content height
 * without measuring it in JS. It runs layout each frame, but the content is a
 * two-paragraph block in a section that is not scroll-linked, so the cost is
 * negligible. Skipped entirely under prefers-reduced-motion.
 * ========================================================================== */

/** Plus that becomes a minus: the vertical bar scales to nothing when open. */
function PlusMinus({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden
      className="relative flex h-5 w-5 shrink-0 items-center justify-center text-black"
    >
      <span className="absolute h-[1.5px] w-full rounded-full bg-current" />
      <span
        className={`absolute h-full w-[1.5px] rounded-full bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "scale-y-0" : "scale-y-100"
        }`}
      />
    </span>
  );
}

export default function HomeWhyAccordion() {
  // Index rather than a nullable id: there is no "nothing open" state.
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="w-full">
      {/* The content column is capped well inside the 1280px track and stays
          left-aligned. Full-track width was the other half of why the first
          build read as underwhelming: four short titles stretched across 1280px
          are mostly empty space. */}
      <div className="max-w-[52rem]">
        <h2
          className="brand-h1 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          {HOME_WHY_HEADLINE.lead}{" "}
          {/* inline-block stops the pill's padding clipping when it wraps. */}
          <span className="inline-block rounded-full border border-[var(--brand-navy)] px-4 py-0.5 text-[var(--brand-navy)]">
            {HOME_WHY_HEADLINE.accent}
          </span>
        </h2>

        {/* Positioning context for the decorative circle. Anchored to the card
            rather than the section, because the headline's height changes with
            the viewport and an offset measured from the section top would drift
            the circle off the corner it is supposed to sit on. */}
        <div className="relative mt-8 lg:mt-10">
          {/* Decorative only, so empty alt and hidden from the a11y tree. Sits
              BEHIND the card (no z-raise; the card is `relative` and later in
              the DOM, so it paints over), which means it emerges from the
              top-right corner and can never cover a row. It overhangs the card
              by 80px into the track's spare width. Desktop only: at 390px it
              would crowd the card or shrink to noise. */}
          <div
            aria-hidden
            className="absolute -top-16 -right-20 hidden h-44 w-44 overflow-hidden rounded-full ring-1 ring-black/8 lg:block"
          >
            <Image
              src="/videos/both/BothNeuronFloat-poster.jpg"
              alt=""
              fill
              sizes="176px"
              className="object-cover"
              loading="lazy"
            />
          </div>

          <div className="relative rounded-md bg-white ring-1 ring-black/5 shadow-sm p-4 lg:p-10">
            <ul className="flex flex-col gap-4">
              {HOME_WHY_ROWS.map((row, idx) => {
                const isOpen = idx === openIdx;
                const panelId = `home-why-panel-${idx}`;

                return (
                  <li
                    key={row.title}
                    className="grid grid-cols-[2.75rem_1fr] items-start gap-3 lg:grid-cols-[4rem_1fr] lg:gap-6"
                  >
                    {/* The number, outside the row box in its own gutter, which
                      is the device that makes the section read as an argument
                      in sequence rather than an FAQ. */}
                    <span
                      aria-hidden
                      className="mt-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#eef0f5] text-lg font-bold text-[var(--brand-navy)] lg:h-16 lg:w-16 lg:text-2xl"
                    >
                      {idx + 1}
                    </span>

                    {/* Each row is its own bordered box, not a rule between rows. */}
                    <div className="min-w-0 rounded-md border border-black/12">
                      <button
                        type="button"
                        // Selects rather than toggles: one row is always open, so
                        // pressing the open row deliberately does nothing.
                        onClick={() => setOpenIdx(idx)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left lg:px-6 lg:py-5"
                      >
                        <span className="text-lg font-bold leading-tight text-black lg:text-xl">
                          {row.title}
                        </span>
                        <PlusMinus isOpen={isOpen} />
                      </button>

                      {/* `inert` while collapsed. The content stays in the DOM so
                        it can animate, and a 0fr grid row plus overflow-hidden
                        only hides it visually: without this a screen reader
                        would read all four closed rows aloud. */}
                      <div
                        id={panelId}
                        inert={!isOpen}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div
                            className={`px-4 pb-5 transition-opacity duration-200 motion-reduce:transition-none lg:px-6 lg:pb-6 ${
                              isOpen ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {/* Background on the inline text, so the highlight
                              wraps line by line like a marker pen rather than
                              boxing the whole block. */}
                            <p className="mb-3 max-w-[54ch] text-base font-medium leading-snug text-black">
                              <span className="box-decoration-clone bg-[#eef0f5] px-1.5 py-0.5">
                                {row.lede}
                              </span>
                            </p>
                            <p className="max-w-[54ch] text-base leading-relaxed text-black/70">
                              {row.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
