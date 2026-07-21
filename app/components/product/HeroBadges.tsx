/**
 * Shared Magic Mind-style hero pills used on both the desktop (ProductHeroV2)
 * and mobile (ProductHeroMobileV2) PDP heroes. Kept in one place so the two
 * surfaces stay in step. Pass `className` to control alignment (mobile centres
 * with `mx-auto`; the desktop left column leaves them left-aligned).
 */

type SpecProductType = "flow" | "clear" | "both";

/** Per-product spec pill copy (caffeine + when to take it). */
const SPEC_LABEL: Record<SpecProductType, string> = {
  flow: "0mg caffeine | morning ritual",
  clear: "0mg caffeine | afternoon clarity",
  both: "0mg caffeine | full system",
};

/** Product spec pill (caffeine + timing), shown under the rating in the hero. */
export function SpecBadge({
  productType,
  className = "",
}: {
  productType: SpecProductType;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-lg bg-gradient-to-r from-[#dbe0f0] to-[#eef1f8] px-4 py-2 font-mono text-sm font-bold uppercase tracking-wide text-black ${className}`}
    >
      {SPEC_LABEL[productType]}
    </span>
  );
}

/** Live-viewer count per product for the social-proof pill. */
const SOCIAL_PROOF_COUNT: Record<SpecProductType, number> = {
  flow: 112,
  clear: 104,
  both: 224,
};

/** Live-viewer style social-proof pill (Magic Mind pattern), grey gradient. */
export function SocialProofBadge({
  productType,
  className = "",
}: {
  productType: SpecProductType;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#e6e6e6] to-[#f4f4f4] px-4 py-2 text-sm font-semibold text-black ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 13C6.6 5 17.4 5 21 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3" fill="currentColor" />
      </svg>
      {SOCIAL_PROOF_COUNT[productType]} others exploring better focus
    </span>
  );
}
