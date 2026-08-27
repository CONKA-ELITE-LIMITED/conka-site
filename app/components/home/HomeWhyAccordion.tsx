import Image from "next/image";
import {
  HOME_WHY_ROWS,
  HOME_WHY_HEADLINE,
  HOME_WHY_SUBLINE,
} from "@/app/lib/homeWhyContent";

/* ============================================================================
 * HomeWhyAccordion (SCRUM-1265, Simple DTC)
 *
 * The home page's second section: the "why" beat that frames a problem before
 * the page sells anything. Structural reference is the Gray Matter home page,
 * whose equivalent section carries four arguments in one numbered accordion
 * instead of spending four sections on them.
 *
 * Built from the rendered design, NOT that page's source markup. The raw HTML
 * reads as a two-column image-left / accordion-right layout; the CSS puts the
 * headline centred above, the image small and circular in the top right, and
 * the rows inside one soft card. Anyone re-deriving this from the markup will
 * build the wrong thing.
 *
 * Design language is Simple DTC borrowing three clinical devices (numbered
 * circles outside the rows, hairline row borders, a highlighted lede line).
 * Deliberately NOT taken from the reference: its grid-paper background and its
 * mono body copy, both of which would read as a foreign block between our hero
 * and our showcase. The accent is navy; the `#1a7f4f` green stays reserved for
 * price savings so it keeps meaning one thing.
 *
 * Static server component. The accordion is native <details> with a shared
 * `name` for single-open behaviour, the same recipe as AppUSPSection, so the
 * section ships no client JS.
 * ========================================================================== */

export default function HomeWhyAccordion() {
  return (
    <div className="w-full">
      {/* Headline block. Centred from lg up, matching the reference; left on
          mobile so it lines up with every other section on a phone. */}
      <div className="relative lg:text-center lg:max-w-[38ch] lg:mx-auto">
        <h2
          className="brand-h1 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          {HOME_WHY_HEADLINE.lead}{" "}
          {/* Outlined pill around the accent word. inline-block keeps the
              padding from clipping when the headline wraps onto a new line. */}
          <span className="inline-block rounded-full border border-[var(--brand-navy)] px-4 py-0.5 text-[var(--brand-navy)]">
            {HOME_WHY_HEADLINE.accent}
          </span>
        </h2>
        <p className="mt-4 text-base lg:text-lg leading-snug text-black/70 lg:mx-auto max-w-[46ch]">
          {HOME_WHY_SUBLINE}
        </p>
      </div>

      {/* Card + decorative circle share a relative parent so the circle can
          overlap the card's top-right corner the way the reference does. */}
      <div className="relative mt-10 lg:mt-14">
        {/* Decorative only, so it carries an empty alt and is hidden from the
            a11y tree. Desktop only: at 390px it would either crowd the card or
            shrink to the point of being noise.
            Deliberately NOT z-raised. The card below is also positioned and
            comes later in the DOM, so it paints over this: the circle peeks
            above the card's top-right corner and can never cover the first
            row's chevron, which a z-10 overlap would have done. */}
        <div
          aria-hidden
          className="hidden lg:block absolute -top-14 right-0 h-36 w-36 overflow-hidden rounded-full ring-1 ring-black/8"
        >
          <Image
            src="/videos/both/BothNeuronFloat-poster.jpg"
            alt=""
            fill
            sizes="144px"
            className="object-cover"
            loading="lazy"
          />
        </div>

        <div className="relative rounded-md bg-white ring-1 ring-black/5 shadow-sm px-5 py-2 lg:px-12 lg:py-6">
          {HOME_WHY_ROWS.map((row, idx) => (
            <details
              key={row.title}
              name="home-why"
              open={idx === 0}
              className="group border-t border-black/8 first:border-t-0"
            >
              <summary className="flex items-center gap-4 cursor-pointer list-none py-5 lg:py-6 [&::-webkit-details-marker]:hidden">
                {/* The number. From lg up it outdents into the card's own 48px
                    padding (-40px puts the 32px circle roughly centred in that
                    gutter), so it reads as a marker beside the row rather than
                    part of it. Inline on mobile, where a dedicated column would
                    cost ~44px of a 390px viewport and squeeze the titles. */}
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef0f5] text-sm font-bold text-[var(--brand-navy)] lg:-ml-10"
                >
                  {idx + 1}
                </span>
                <span className="flex-1 text-lg font-bold text-black leading-tight">
                  {row.title}
                </span>
                <svg
                  className="w-5 h-5 shrink-0 text-black/40 transition-transform duration-300 group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>

              {/* Indented to the title's left edge, so the body hangs off the
                  title rather than the number: 48px on mobile (32px circle plus
                  the 16px gap), 8px from lg up where the circle is outdented by
                  40px and the title therefore starts 8px in. */}
              <div className="pl-12 pr-9 pb-5 lg:pb-6 lg:pl-2">
                {/* The highlight is a background on the inline text, so it wraps
                    line by line like a marker pen rather than boxing the block. */}
                <p className="-mt-1 mb-2 max-w-[52ch] text-base font-medium leading-snug text-black">
                  <span className="bg-[#eef0f5] box-decoration-clone px-1.5 py-0.5">
                    {row.lede}
                  </span>
                </p>
                <p className="max-w-[52ch] text-base leading-snug text-black/70">
                  {row.body}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
