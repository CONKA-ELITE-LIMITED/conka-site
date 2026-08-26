"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useInView } from "@/app/hooks/useInView";
import { useIsMobile } from "@/app/hooks/useIsMobile";
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
 * Performance: GSAP is NOT statically imported -- the PDPs are the only
 * routes this component ships on, and nothing else there uses GSAP. The
 * motion layer loads via dynamic import only when the section approaches the
 * viewport (and only when motion is allowed), so it stays out of the routes'
 * first-load JS. JSX carries the final, fully-lit state, so no-JS, reduced
 * motion, and the pre-load moment all show the complete timeline; the scrub
 * is position-synced, so late binding loses nothing. No ScrollTrigger pin;
 * the desktop column uses position: sticky.
 *
 * The PDPs mount one tree at a time (useIsMobile branch); the isMobile
 * dependency rebinds and refreshes triggers when the tree settles, so
 * positions are measured against the final layout.
 *
 * Content-only: the page owns the section wrapper and background.
 * ========================================================================== */

export default function WhatToExpectV2({
  productId = "01",
}: {
  productId?: ExpectV2ProductId;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const [inViewRef, isInView] = useInView({ threshold: 0 });
  const isMobile = useIsMobile();
  const milestones = expectV2Milestones[productId];
  const asset = expectV2Asset[productId];

  useEffect(() => {
    const el = root.current;
    if (!el || !isInView) return;
    // Reduced motion never animates -- skip loading GSAP entirely.
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      return;
    }

    let cancelled = false;
    let revert: (() => void) | undefined;

    import("@/app/lib/motion").then(
      ({ gsap, ScrollTrigger, withMotion, drawProgress, scrubBrighten }) => {
        if (cancelled) return;
        const ctx = gsap.context(() => {
          withMotion(() => {
            drawProgress("[data-wte-line]", "[data-wte-timeline]");
            scrubBrighten("[data-wte-block]");
            ScrollTrigger.refresh();
          });
        }, el);
        revert = () => ctx.revert();
      },
    );

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [isInView, isMobile]);

  return (
    <div
      ref={(node) => {
        root.current = node;
        inViewRef(node);
      }}
    >
      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Sticky product render -- desktop only */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1280px) 592px, 45vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Header + timeline */}
        <div>
          <h2
            className="brand-h2 mb-4 text-black"
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
