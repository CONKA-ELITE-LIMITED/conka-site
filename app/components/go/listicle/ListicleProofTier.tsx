/* ============================================================================
 * Listicle proof, split across the page
 *
 * The post-reasons proof is no longer one stacked block. It is distributed so
 * the tail escalates instead of repeating:
 *
 *   ListicleLogoBand  -> institutional trust, directly UNDER THE HERO
 *                        (partner logos + optional press/journal logos).
 *                        Moved up from above the buy box in SCRUM-1321:
 *                        only 8-17% of visitors ever reach the buy box, so
 *                        down there the proof wall was invisible to most.
 *   ListicleProofTier -> AFTER the buy box, running into the FAQ:
 *                        one named human (feature), then the UGC band last so
 *                        it sits directly before the FAQ.
 *
 * Written customer reviews are intentionally not here: the mid-reasons review
 * strip already carries them, and the UGC band does the social-proof work.
 *
 * Content-only: no <section>, no max-width, no horizontal padding at root. The
 * renderers own the section wrapper and background. See SCRUM-1176.
 * ========================================================================== */

import type { ReactNode } from "react";
import type { ListicleProof } from "@/app/lib/landings/listicle-types";
import LogoMarquee, { PRESS_LOGOS } from "@/app/components/landing/LogoMarquee";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
import AthleteReviewFeature from "@/app/components/AthleteReviewFeature";
import ProductComparisonTable, {
  type ComparisonProduct,
} from "@/app/components/product/ProductComparisonTable";

/**
 * Partner + press logo band. Under the hero, partner logos get the large black
 * section title; with `banner` (top of page) the heading is a navy bar instead.
 * The press band (when set) sits under them at the muted eyebrow size, slower,
 * so the two never read as one track.
 */
export function ListicleLogoBand({
  proof,
  banner = false,
}: {
  proof: ListicleProof;
  /** Top-of-page treatment: the heading becomes a full-width navy bar with
   *  white text, logos running beneath it, so it reads as a banner rather than
   *  a second title competing with the H1. */
  banner?: boolean;
}) {
  if (!proof.logoBand && !proof.pressBand) return null;
  return (
    <div>
      {proof.logoBand && banner ? (
        <>
          <p className="bg-[var(--brand-navy)] px-4 py-2.5 text-center text-[13px] font-semibold tracking-[0.02em] text-white">
            {proof.logoBandHeading ?? "Fueling High Performers at:"}
          </p>
          <div className="pt-5">
            {/* Above the hero now, so the logos yield to the hero image. */}
            <LogoMarquee heading="" logos={proof.logoBandLogos} lowPriority />
          </div>
        </>
      ) : proof.logoBand ? (
        <LogoMarquee
          largeHeading
          heading={proof.logoBandHeading}
          logos={proof.logoBandLogos}
        />
      ) : null}
      {proof.pressBand ? (
        <div className={proof.logoBand ? "mt-12" : ""}>
          <LogoMarquee
            heading="As Published On:"
            logos={PRESS_LOGOS}
            durationSeconds={60}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Post-buy-box proof: the named feature, then the UGC band last so it lands
 * right before the FAQ. Blocks are collected first so the first one never
 * carries a leading margin whichever subset renders.
 */
export default function ListicleProofTier({
  proof,
  product = "flow",
}: {
  proof: ListicleProof;
  /** Which bottle the comparison table shows */
  product?: ComparisonProduct;
}) {
  const blocks: { key: string; node: ReactNode }[] = [];

  if (proof.feature) {
    blocks.push({
      key: "feature",
      node: <AthleteReviewFeature athlete={proof.feature} />,
    });
  }

  if (proof.comparison) {
    blocks.push({
      key: "comparison",
      node: <ProductComparisonTable product={product} />,
    });
  }

  if (proof.ugc) {
    blocks.push({
      key: "ugc",
      node: (
        <UGCMarquee
          title={proof.ugc.title}
          subtitle={proof.ugc.subtitle}
          items={proof.ugc.items}
          // Simple DTC: the standard rounded-md tile radius (UGCMarquee's
          // default), matching the UGC band on home and the PDPs.
        />
      ),
    });
  }

  if (!blocks.length) return null;

  return (
    <div>
      {blocks.map((block, i) => (
        <div key={block.key} className={i ? "mt-16" : ""}>
          {block.node}
        </div>
      ))}
    </div>
  );
}
