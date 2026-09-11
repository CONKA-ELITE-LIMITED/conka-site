import { formatPrice } from "@/app/lib/productData";
import {
  getCadenceGiftSummary,
  getCadencePricingByProductHeroId,
} from "@/app/lib/cadenceData";
import type { CadenceType } from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";

/**
 * Shared Magic Mind-style hero elements used on both the desktop
 * (ProductHeroV3) and mobile (ProductHeroMobileV3) PDP heroes. Kept in one
 * place so the two surfaces stay in step. Pass `className` to control
 * alignment (mobile centres with `mx-auto`; the desktop left column leaves
 * them left-aligned).
 */

type SpecProductType = "flow" | "clear" | "both";

/** "over £80" from 82.96. Rounds down so the claim stays true, and steps down a
 *  bucket on an exact multiple, since "over £80" is false at £80. */
function roundedDownValue(value: number): string | null {
  const floored = Math.floor(value / 10) * 10;
  const safe = floored === value ? floored - 10 : floored;
  return safe >= 10 ? `£${safe}` : null;
}

/** The starter-kit offer above the gallery; GiftValueStack is the full version.
 *  Count-led because a bare figure here reads as the product's price.
 *
 *  NOT CURRENTLY RENDERED. Removed from both PDP heroes once the redrawn
 *  starter-kit slide (design/pdp-slides/slides/s0.html) took the lead position
 *  in the gallery: the slide states the same offer, itemised, immediately
 *  below where this pill sat. Kept because the component is sound and the
 *  decision may not survive a conversion test. */
export function HeroGiftValue({
  formulaId,
  selectedCadence,
  className = "",
}: {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  className?: string;
}) {
  const pricing = getCadencePricingByProductHeroId(formulaId, selectedCadence);
  const { count, total } = getCadenceGiftSummary(pricing);
  if (count === 0 || total <= 0) return null;
  const rounded = roundedDownValue(total);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#dbe0f0] to-[#eef1f8] px-4 py-2 font-mono text-sm font-bold uppercase tracking-wide text-black ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        aria-hidden
        className="shrink-0"
        style={{ color: "var(--brand-positive)" }}
      >
        <path
          d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      +{count} free gifts{" "}
      {rounded ? `worth over ${rounded}` : `worth ${formatPrice(total)}`}
    </span>
  );
}

/** Live-viewer count per product for the social-proof pill. */
const SOCIAL_PROOF_COUNT: Record<SpecProductType, number> = {
  flow: 112,
  clear: 104,
  both: 224,
};

/** Live-viewer social proof (Magic Mind pattern): small plain text + eye icon,
 *  no background pill. */
export function SocialProofBadge({
  productType,
  className = "",
}: {
  productType: SpecProductType;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-black/70 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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
