/* ============================================================================
 * ListicleProofTier
 *
 * The post-reasons proof tier for both /go listicle templates.
 *
 * This replaced a six-block trust wall (partner logos -> a hardcoded 3-up
 * athlete grid -> the athlete carousel -> press logos -> reviews -> badges).
 * Two athlete moments and two logo marquees in a row read as undifferentiated
 * noise at exactly the point the reader is deciding whether to buy. The tier
 * is now three moments, each doing a different job and each escalating:
 *
 *   logoBand -> institutional trust   (partner logos, LogoMarquee)
 *   ugc      -> volume and faces      (UGCMarquee, shared with home + PDPs)
 *   feature  -> one specific human    (AthleteReviewFeature, persona-matched)
 *   reviews  -> written outcomes      (ReviewRail + LandingTrustBadges)
 *
 * Every moment is optional and driven by `config.proof`, so a persona can
 * drop any of them. Blocks are collected into an array first so the vertical
 * rhythm stays correct whichever subset renders (no leading margin on the
 * first block, regardless of which one it is).
 *
 * Content-only: no <section>, no max-width, no horizontal padding at root.
 * The renderers own the section wrapper and background. See SCRUM-1176.
 * ========================================================================== */

import type { ReactNode } from "react";
import type { ListicleProof } from "@/app/lib/landings/listicle-types";
import LogoMarquee from "@/app/components/landing/LogoMarquee";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
import AthleteReviewFeature from "@/app/components/AthleteReviewFeature";
import ReviewRail from "@/app/components/landing/ReviewRail";
import LandingTrustBadges from "@/app/components/landing/LandingTrustBadges";

export default function ListicleProofTier({ proof }: { proof: ListicleProof }) {
  const blocks: { key: string; node: ReactNode }[] = [];

  if (proof.logoBand) {
    blocks.push({ key: "logos", node: <LogoMarquee /> });
  }

  if (proof.ugc) {
    blocks.push({
      key: "ugc",
      node: (
        <UGCMarquee
          title={proof.ugc.title}
          subtitle={proof.ugc.subtitle}
          items={proof.ugc.items}
        />
      ),
    });
  }

  if (proof.feature) {
    blocks.push({
      key: "feature",
      node: <AthleteReviewFeature athlete={proof.feature} />,
    });
  }

  if (proof.reviews) {
    blocks.push({
      key: "reviews",
      node: (
        <>
          <ReviewRail />
          <div className="mt-10">
            <LandingTrustBadges />
          </div>
        </>
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
