import { getHeroContent } from "@/app/lib/productHeroHelpers";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { LEDE_DESCRIPTION } from "@/app/lib/mmPdpData";

/* ============================================================================
 * IngredientBenefitLede (SCRUM-1209)
 *
 * The product subline + condensed description + green-check benefit grid. On
 * desktop V3 it sits above the outcome accordions (inside
 * IngredientOutcomeAccordions); on mobile V3 it sits between the asset and the
 * pricing widget. Flow ("01") and Clear ("02").
 * ========================================================================== */

const GREEN = "#1a7f4f";

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
  const subline = content.seoHeading ?? "";
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
    <div>
      {subline && (
        <h2
          className="leading-tight text-black"
          style={{ letterSpacing: "-0.01em" }}
        >
          <span className="block text-[2.25rem] font-bold">{sublineBold}</span>
          {sublineRest && (
            <span className="block text-[1.5rem] font-medium text-black">
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
