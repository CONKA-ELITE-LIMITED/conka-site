import type { CSSProperties } from "react";
import { getHeroContent } from "@/app/lib/productHeroHelpers";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { LEDE_DESCRIPTION, LEDE_SUBLINE } from "@/app/lib/mmPdpData";

/* ============================================================================
 * IngredientBenefitLede (SCRUM-1209)
 *
 * The product subline + condensed description + green-check benefit grid.
 *
 * Rendered directly by both heroes: above the buy panel on mobile
 * (ProductHeroMobileV3, SCRUM-1335), still below it on desktop
 * (ProductHeroV3), where the right column has room either way.
 *
 * Flow ("01"), Clear ("02"), and Both ("03").
 * ========================================================================== */

const GREEN = "#1a7f4f";

/** Average glyph advance of the bold face, in em. Wide, so it errs to wrapping. */
const FIT_RATIO = 0.55;

/** Largest size that fits `text` on one line. Clamped in .pdp-lede-headline. */
function fitCqi(text: string): string {
  return `${(100 / (text.length * FIT_RATIO)).toFixed(2)}cqi`;
}

const CHECK_ITEMS = [
  "Zero caffeine, zero crash",
  "Clinically-backed ingredients",
  "5x absorption vs pills & powders",
  "Informed Sport Certified",
];

function CheckMark() {
  return (
    <svg
      viewBox="0 0 15 15"
      width="16"
      height="16"
      fill="none"
      className="mt-0.5 shrink-0"
      aria-hidden
    >
      <circle cx="7.5" cy="7.5" r="7.5" fill={GREEN} />
      <path d="M4.2 7.7L6.5 10L10.8 5.4" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}

export default function IngredientBenefitLede({
  formulaId,
}: {
  formulaId: ProductHeroId;
}) {
  const content = getHeroContent(formulaId);
  // Subline: bold the lead clause (product name), lighten + shrink the
  // descriptor tail, breaking onto two lines. Prefer a word connector
  // ("... for ..." Flow, "... that ..." Clear); fall back to a comma (Both),
  // dropping the comma from the tail.
  const subline = LEDE_SUBLINE[formulaId] ?? content.seoHeading ?? "";
  const wordSplit = [" for ", " That ", " that "]
    .map((c) => subline.indexOf(c))
    .filter((i) => i > 0)
    .sort((a, b) => a - b)[0] ?? -1;
  let boldEnd = wordSplit;
  let restStart = wordSplit;
  if (boldEnd < 0) {
    const ci = subline.indexOf(", ");
    if (ci > 0) {
      boldEnd = ci;
      restStart = ci + 2;
    }
  }
  const sublineBold = boldEnd > 0 ? subline.slice(0, boldEnd) : subline;
  const sublineRest = boldEnd > 0 ? subline.slice(restStart) : "";

  return (
    <div style={{ containerType: "inline-size" }}>
      {subline && (
        <h2
          className="leading-tight text-black"
          style={{ letterSpacing: "-0.01em" }}
        >
          <span
            className="pdp-lede-headline block font-bold"
            style={
              { "--pdp-lede-fit": fitCqi(sublineBold) } as CSSProperties
            }
          >
            {sublineBold}
          </span>
          {sublineRest && (
            <span
              className="block font-medium text-black"
              style={{ fontSize: "var(--brand-h3-size, 1.25rem)" }}
            >
              {sublineRest.trim()}
            </span>
          )}
        </h2>
      )}
      {/* Condensed description (the images carry the fuller story). Canonical
          formulaContent.headline is left intact for other surfaces. */}
      <p className="brand-body mt-4 max-w-2xl text-black">
        {LEDE_DESCRIPTION[formulaId]}
      </p>
      <ul className="mt-6 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-3">
        {CHECK_ITEMS.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-snug text-black"
          >
            <CheckMark />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
