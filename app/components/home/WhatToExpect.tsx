import Image from "next/image";
import {
  expectMilestones,
  whatToExpectAsset,
  type ExpectMilestone,
  type ExpectProductId,
} from "@/app/lib/whatToExpectLanding";

/* ============================================================================
 * WhatToExpect
 *
 * Simple DTC "what to expect" section (Magic Mind days-banner pattern): a
 * full-bleed hero asset whose baked-in "Your Brain / Optimised · After 30 days"
 * copy acts as the section header, with a Day 1 / Day 7 / Day 30 outcome
 * timeline.
 *
 * Two layouts:
 *   - Mobile (< lg): 4:5 portrait asset, timeline stacked underneath.
 *   - Desktop (lg+): 16:9 landscape asset, timeline immediately below on a tint
 *     band (our asset is shorter than MM's, so we don't overlay it).
 *
 * Static server component (no client JS). The page section owns the full-bleed
 * (`!px-0 !py-0`). Used on /conka-flow (01), /conka-clarity (02), and
 * /conka-both (both).
 * ========================================================================== */

/** Shared Day 1 / Day 7 / Day 30 items — MM days-banner styling: a large day
 *  marker, the high-level message in a tile, then the supporting description. */
function DayItems({ milestones }: { milestones: ExpectMilestone[] }) {
  return (
    <>
      {milestones.map((m) => (
        <li key={m.day} className="lg:text-center">
          <div className="mb-4 text-3xl font-bold leading-none tracking-tight text-black lg:text-4xl">
            {m.day}
          </div>
          <div className="mb-5 rounded-lg border-2 border-[#1B2757] bg-white px-6 py-4">
            <h3 className="text-2xl font-bold leading-tight text-black lg:text-3xl">
              {m.title}
            </h3>
          </div>
          <p className="text-base leading-relaxed text-black lg:text-lg">
            {m.body}
          </p>
        </li>
      ))}
    </>
  );
}

export default function WhatToExpect({
  productId = "01",
}: {
  productId?: ExpectProductId;
}) {
  const milestones = expectMilestones[productId];
  const asset = whatToExpectAsset[productId];

  return (
    <div>
      {/* Visible title is baked into the asset; keep a real heading for SEO/a11y. */}
      <h2 className="sr-only">What to expect with CONKA</h2>

      {/* Mobile: portrait asset, timeline stacked underneath. */}
      <div className="lg:hidden">
        <div className="relative">
          <Image
            src={asset.mobile}
            alt={asset.alt}
            width={1080}
            height={1350}
            loading="lazy"
            sizes="100vw"
            className="h-auto w-full"
          />
          {/* Short lead-in fade from the asset into the timeline background. */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#eef1f8] to-transparent"
            aria-hidden
          />
        </div>
        <ol className="grid grid-cols-1 gap-12 bg-gradient-to-b from-[#eef1f8] to-[#dbe0f0] px-[var(--brand-gutter-mobile)] py-16">
          <DayItems milestones={milestones} />
        </ol>
      </div>

      {/* Desktop: landscape asset, timeline immediately below on a tint band. */}
      <div className="hidden lg:block">
        <Image
          src={asset.desktop}
          alt={asset.alt}
          width={1920}
          height={1080}
          loading="lazy"
          sizes="100vw"
          className="h-auto w-full"
        />
        <div className="bg-[var(--brand-tint)]">
          <ol className="mx-auto grid max-w-[1280px] grid-cols-3 gap-10 px-[var(--brand-gutter-desktop)] pb-16 pt-6">
            <DayItems milestones={milestones} />
          </ol>
        </div>
      </div>
    </div>
  );
}
