"use client";

import { useState } from "react";
import Image from "next/image";
import { HOME_WHY_ROWS, HOME_WHY_HEADLINE } from "@/app/lib/homeWhyContent";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

/* ============================================================================
 * HomeWhyAccordion (SCRUM-1265, Simple DTC)
 *
 * The "why" beat that frames a problem before the page argues anything else.
 * Structural reference is the Gray Matter home page, whose equivalent section
 * carries four arguments in one numbered accordion instead of spending four
 * sections on them. Ours runs five: the fifth is the app, which is the one
 * argument on the page a competitor cannot copy.
 *
 * Built from the rendered design, NOT that page's source markup: a left-aligned
 * headline, a card, and numbered rows whose numbers sit outside them. The
 * reference's own decorative image is a circular crop floating over the card
 * corner; ours is a tall asset in its own column, which was tried the circular
 * way first and read as a sticker stuck onto the layout.
 *
 * Design language is Simple DTC borrowing three clinical devices (the number
 * circles, the hairline row rules, the highlighted lede line). Deliberately NOT
 * taken from the reference: its grid-paper background and its mono body copy,
 * both of which would read as a foreign block between our hero and our
 * showcase. The accent is navy; the `#1a7f4f` green stays reserved for price
 * savings so it keeps meaning one thing.
 *
 * DESKTOP AND MOBILE DIFFER STRUCTURALLY, deliberately, matching the reference:
 *
 *  - Desktop: a white card, and each row is its own bordered box inside it.
 *  - Mobile: no card and no row boxes. Rows are separated by a full-width rule
 *    running across both the number gutter and the content, with noticeably
 *    more vertical padding. At 390px a card border inside a section inside a
 *    row border is three nested containers eating horizontal space that the
 *    copy needs, and the rules plus the padding do the same job for free.
 *
 * Client component, for two reasons a native <details> cannot give:
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
      className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center text-black"
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
      {/* Left-aligned, and capped so it keeps wrapping to roughly two lines
          rather than running the full 1280px track. */}
      <h2
        className="brand-h1 max-w-[52rem] text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        {HOME_WHY_HEADLINE.lead}{" "}
        {/* inline-block stops the pill's padding clipping when it wraps. */}
        <span className="inline-block rounded-full border border-[var(--brand-navy)] px-4 py-0.5 text-[var(--brand-navy)]">
          {HOME_WHY_HEADLINE.accent}
        </span>
      </h2>

      {/* Two columns on desktop: a tall asset, then the accordion. Which is
          the order the Gray Matter source markup implies and the order we
          arrived at independently after trying it the other way round.
          This replaced a circular crop of the neuron-float poster that floated
          over the card's top-right corner. That asset was busy, the circle cut
          it badly, and it read as a sticker rather than part of the layout. A
          full-height rectangle in its own column is calmer and gives the
          section a product presence it otherwise lacks entirely. */}
      <div className="mt-8 lg:mt-10 lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-stretch lg:gap-10 xl:grid-cols-[26rem_minmax(0,1fr)]">
        {/* The asset column. Stretches to the accordion's full height, so it
            reads as a tall rectangle rather than a floating thumbnail, and
            re-crops rather than distorting as the rows open and close.

            Widens from 20rem at lg to 26rem at xl, deliberately taking width
            off the accordion beside it: the rows are short and were sitting in
            too much empty space. It steps rather than jumping straight to
            26rem because at exactly 1024px the track is only ~920px, and a
            26rem column there would squeeze the row copy.

            Desktop only, since at 390px the accordion needs the full width. */}
        <div
          aria-hidden
          className="relative hidden overflow-hidden rounded-md ring-1 ring-black/5 lg:block"
        >
          <Image
            src="/formulas/conkaFlow/FlowShotSide.jpg"
            alt=""
            fill
            sizes="(min-width: 1280px) 416px, 320px"
            className="object-cover"
            loading="lazy"
          />
        </div>
        {/* The card is desktop-only. On mobile the rows sit straight on the
            section tint: at 390px a card border inside a section is a container
            the copy cannot spare the width for. Desktop sets its own text
            colour, being a surface that differs from the section background. */}
        <div className="lg:rounded-md lg:bg-white lg:p-10 lg:text-black lg:shadow-sm lg:ring-1 lg:ring-black/5">
          <ul className="flex flex-col gap-0 lg:gap-5">
            {HOME_WHY_ROWS.map((row, idx) => {
              const isOpen = idx === openIdx;
              const panelId = `home-why-panel-${idx}`;

              return (
                <li
                  key={row.title}
                  // The rule is on the <li>, not the content box, so on mobile
                  // it runs the full width across the number gutter too.
                  //
                  // pb-5 matters more than it looks. With items-start, a
                  // COLLAPSED row is taller in the number column (52px circle)
                  // than in the content column (~46px button), so the number
                  // sets the row height and its bottom edge lands exactly on the
                  // next row's rule. The bottom padding is what keeps the two
                  // apart; the mobile rhythm lives here rather than on the panel
                  // so it applies to open and collapsed rows alike.
                  className="grid grid-cols-[3.25rem_1fr] items-start gap-4 border-t border-black/12 pt-5 pb-5 lg:grid-cols-[4rem_1fr] lg:gap-6 lg:border-t-0 lg:pt-0 lg:pb-0"
                >
                  {/* The number, outside the row content in its own gutter,
                      which is the device that makes the section read as an
                      argument in sequence rather than an FAQ.

                      No top margin on purpose: the circle's height is close
                      enough to the title row's that aligning their tops also
                      aligns their centres (desktop, 64px circle against a
                      ~65px title row). An earlier mt-2 pushed it 8px low. */}
                  <span
                    aria-hidden
                    className="flex h-13 w-13 items-center justify-center rounded-full bg-[#dbe2f0] text-xl font-bold text-[var(--brand-navy)] lg:h-16 lg:w-16 lg:text-2xl"
                  >
                    {idx + 1}
                  </span>

                  {/* Bordered box on desktop only. See the header comment. */}
                  <div className="min-w-0 lg:rounded-md lg:border lg:border-black/12">
                    <button
                      type="button"
                      // Selects rather than toggles: one row is always open, so
                      // pressing the open row deliberately does nothing.
                      onClick={() => setOpenIdx(idx)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left lg:px-6 lg:py-5"
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
                          className={`transition-opacity duration-200 motion-reduce:transition-none lg:px-6 lg:pb-9 ${
                            isOpen ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {/* A mid light-navy: one step darker than the #eef0f5
                              used by the number circles and the site's tint
                              strips, which was too faint to register as a
                              highlight against a white card.
                              Solid navy with white text was also tried, and cut:
                              it read as a UI chip rather than a marker pen and
                              fought the row for attention. This sits between the
                              two. box-decoration-clone keeps the highlight on
                              every wrapped line rather than boxing the whole
                              paragraph. */}
                          <p className="mb-3 max-w-[54ch] text-base font-medium leading-snug text-black">
                            <span className="box-decoration-clone bg-[#dbe2f0] px-1.5 py-0.5">
                              {row.lede}
                            </span>
                          </p>
                          <p className="max-w-[54ch] text-base leading-relaxed text-black">
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

          {/* CTA sits OUTSIDE the card's row list, so "centred" means centred
              against the card rather than against the row content column.
              Inside the rows it was offset by the number gutter and read as
              slightly off. */}
          <div className="mt-8 flex justify-center lg:mt-10">
            <ConkaCTAButton href="/conka-both" meta={null}>
              Try the solution
            </ConkaCTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}
