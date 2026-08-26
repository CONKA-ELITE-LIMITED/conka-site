"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, withMotion, drawProgress, scrubBrighten } from "@/app/lib/motion";
import {
  expectV2Header,
  expectV2Milestones,
  expectV2Asset,
  type ExpectV2ProductId,
} from "@/app/lib/whatToExpectV2";

/* ============================================================================
 * WhatToExpectV2
 *
 * Scroll-driven "what to expect" timeline (Gray Matters pattern): a vertical
 * line draws down as you scroll and each milestone block brightens as the
 * line reaches it. Desktop (lg+) pairs the timeline with a CSS-sticky product
 * render column; mobile is header + stacked timeline only.
 *
 * Motion: withMotion-gated scrub via drawProgress + scrubBrighten from
 * app/lib/motion.ts. JSX carries the final, fully-lit state, so reduced
 * motion and no-JS users see the complete timeline. No ScrollTrigger pin;
 * the desktop column uses position: sticky.
 *
 * Content-only: the page owns the section wrapper and background. The PDPs
 * mount one tree at a time (useIsMobile branch), so a single instance runs;
 * useGSAP({ scope }) cleans up on breakpoint remounts.
 * ========================================================================== */

export default function WhatToExpectV2({
  productId = "01",
}: {
  productId?: ExpectV2ProductId;
}) {
  const root = useRef<HTMLDivElement>(null);
  const milestones = expectV2Milestones[productId];
  const asset = expectV2Asset[productId];

  useGSAP(
    () => {
      withMotion(() => {
        drawProgress("[data-wte-line]", "[data-wte-timeline]");
        scrubBrighten("[data-wte-block]");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Sticky product render -- desktop only */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5] w-full max-w-[440px]">
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                loading="lazy"
                sizes="40vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Header + timeline */}
        <div>
          <h2
            className="brand-h2 mb-4 text-[#1B2757]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {expectV2Header.title}
          </h2>
          <p className="brand-body mb-12 text-black/70">
            {expectV2Header.subtitle}
          </p>

          <div data-wte-timeline className="relative">
            {/* Rail: static track + scroll-drawn line on top */}
            <div
              aria-hidden
              className="absolute bottom-2 left-[9px] top-2 w-[2px] rounded-full bg-[#1B2757]/15"
            />
            <div
              data-wte-line
              aria-hidden
              className="absolute bottom-2 left-[9px] top-2 w-[2px] origin-top rounded-full bg-[#1B2757]"
            />

            <ol className="space-y-12">
              {milestones.map((m) => (
                <li key={m.title} data-wte-block className="relative pl-10">
                  {/* Dot centred on the rail */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0.5 h-5 w-5 rounded-full border-2 border-[#1B2757] bg-white"
                  />
                  <h3 className="mb-3 inline-block rounded-md bg-white px-4 py-2 text-lg font-bold leading-tight text-[#1B2757] lg:text-xl">
                    {m.title}
                  </h3>
                  <p className="text-base leading-relaxed text-black lg:text-lg">
                    {m.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
