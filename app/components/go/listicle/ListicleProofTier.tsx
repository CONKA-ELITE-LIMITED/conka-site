/* ============================================================================
 * Listicle proof, split across the page
 *
 * The post-reasons proof is no longer one stacked block. It is distributed so
 * the tail escalates instead of repeating:
 *
 *   ListicleLogoBand  -> institutional trust, ABOVE the buy box
 *                        (partner logos + optional press/journal logos)
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

/**
 * Partner + press logo band, rendered above the buy box. Partner logos get the
 * large black section title; the press band (when set) sits under them at the
 * muted eyebrow size, slower, so the two never read as one track.
 */
export function ListicleLogoBand({ proof }: { proof: ListicleProof }) {
  if (!proof.logoBand && !proof.pressBand) return null;
  return (
    <div>
      {proof.logoBand ? <LogoMarquee largeHeading /> : null}
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
export default function ListicleProofTier({ proof }: { proof: ListicleProof }) {
  const blocks: { key: string; node: ReactNode }[] = [];

  if (proof.feature) {
    blocks.push({
      key: "feature",
      node: <AthleteReviewFeature athlete={proof.feature} />,
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
          // Sharp tiles on the listicles (the Simple DTC 24px rounding was
          // rejected here), matching the clinical UGC band on home and PDPs.
          tileRadius="0px"
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
