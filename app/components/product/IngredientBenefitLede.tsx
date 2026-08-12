import { getHeroContent } from "@/app/lib/productHeroHelpers";

/* ============================================================================
 * IngredientBenefitLede (SCRUM-1209)
 *
 * The product subline + description + green-check benefit grid. On desktop V3 it
 * sits above the outcome accordions (inside IngredientOutcomeAccordions); on
 * mobile V3 it sits between the asset and the pricing widget. Flow only.
 * ========================================================================== */

const GREEN = "#1a7f4f";

const CHECK_ITEMS = [
  "Zero caffeine, zero crash",
  "Clinically-backed ingredients",
  "5x absorption vs pills & powders",
  "Informed Sport Certified",
  "+14.86% sharper thinking, placebo-tested",
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

export default function IngredientBenefitLede() {
  const content = getHeroContent("01");
  // Subline: bold the lead clause, lighten the "for ..." tail, at a smaller
  // (product-name-ish) size rather than the full display heading.
  const subline = content.seoHeading ?? "";
  const forIdx = subline.indexOf(" for ");
  const sublineBold = forIdx > 0 ? subline.slice(0, forIdx) : subline;
  const sublineRest = forIdx > 0 ? subline.slice(forIdx) : "";

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
      <p className="brand-body mt-4 max-w-2xl text-black">{content.headline}</p>
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
