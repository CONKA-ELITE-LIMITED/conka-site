import Image from "next/image";
import { whyConkaReasons } from "@/app/lib/whyConkaData";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

/* ============================================================================
 * WhyConkaReasons — the 7 proof cards, rendered in the MM listicle grammar
 * (app/components/go/listicle/SimpleListicleRenderer.tsx SimpleReason).
 *
 * Every reason is flat and open: no accordion. Mobile stacks heading → image →
 * body; desktop is a two-column row with the asset held to a fixed 350px so it
 * does not scale up from its mobile size. The heading renders twice and toggles
 * per breakpoint so it sits above the image on mobile but beside it on desktop.
 *
 * Now a server component: dropping the expand/collapse state removed the only
 * reason this needed to be a client component.
 *
 * The classes are duplicated from SimpleListicleRenderer rather than shared,
 * so the live paid /go listicle is untouched by changes here.
 * ========================================================================== */

export default function WhyConkaReasons() {
  return (
    <div>
      {whyConkaReasons.map((reason, index) => {
        // The hero carries no image, so reason 1's asset is the likely LCP
        // element. Everything below it stays lazy.
        const isFirst = index === 0;
        const heading = (
          <>
            <span className="tabular-nums">{reason.id}.</span> {reason.headline}
          </>
        );

        return (
          <article
            key={reason.id}
            className="py-8 md:grid md:grid-cols-[minmax(0,350px)_minmax(0,1fr)] md:items-center md:gap-10 md:py-10"
          >
            {/* Heading above the image — mobile only */}
            <h2 className="mb-4 text-[22px] font-bold leading-[1.2] text-black md:hidden">
              {heading}
            </h2>

            {/* Photo — squarish corners for the editorial look */}
            <div>
              <div className="relative w-full overflow-hidden rounded-[8px] aspect-[4/3]">
                <Image
                  src={reason.asset}
                  alt={reason.assetAlt}
                  fill
                  priority={isFirst}
                  sizes="(max-width: 768px) 100vw, 350px"
                  className={
                    reason.assetFit === "contain"
                      ? "object-contain"
                      : "object-cover"
                  }
                />
              </div>
            </div>

            {/* Text: heading (desktop only) + body */}
            <div className="mt-6 md:mt-0">
              <h2 className="mb-4 hidden text-[28px] font-bold leading-[1.15] text-black md:block">
                {heading}
              </h2>
              <p className="max-w-[30rem] text-[15px] font-semibold leading-relaxed text-black">
                {reason.oneLine}
              </p>
              <p className="mt-3 max-w-[30rem] text-[15px] leading-relaxed text-black/75">
                {reason.story}
              </p>
              {reason.stat && (
                <p
                  className="mt-3 max-w-[36rem] text-[15px] font-semibold leading-relaxed"
                  style={{ color: "#1a7f4f" }}
                >
                  {reason.stat.value} {reason.stat.caption}
                </p>
              )}
              {reason.showAppButtons && (
                <div className="mt-5">
                  <AppInstallButtons variant="clinical" iconSize={16} />
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
