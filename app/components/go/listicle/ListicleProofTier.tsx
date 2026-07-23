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
import LogoMarquee, { PRESS_LOGOS } from "@/app/components/landing/LogoMarquee";
import UGCMarquee from "@/app/components/testimonials/UGCMarquee";
import AthleteReviewFeature from "@/app/components/AthleteReviewFeature";
import ReviewRail from "@/app/components/landing/ReviewRail";
import LandingTrustBadges from "@/app/components/landing/LandingTrustBadges";

export default function ListicleProofTier({ proof }: { proof: ListicleProof }) {
  const blocks: { key: string; node: ReactNode }[] = [];

  // Partner logos and press logos are ONE moment, not two: both are
  // institutional trust, and stacking them as separate beats is what made the
  // old tier read as a wall. The press marquee sits in a white panel directly
  // under the partner band, tight enough (mt-8) to group with it, because the
  // press sources are flattened onto white and would show a seam on the bone
  // section background.
  if (proof.logoBand || proof.pressBand) {
    blocks.push({
      key: "logos",
      node: (
        <>
          {proof.logoBand ? <LogoMarquee /> : null}
          {proof.pressBand ? (
            <div
              className={`rounded-[var(--brand-radius-container)] bg-white px-5 py-8 text-black ring-1 ring-black/5 md:px-8 ${
                proof.logoBand ? "mt-8" : ""
              }`}
            >
              <LogoMarquee heading="As Published On:" logos={PRESS_LOGOS} />
            </div>
          ) : null}
        </>
      ),
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
