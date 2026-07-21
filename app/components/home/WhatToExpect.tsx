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
 * Two layouts mirroring MM:
 *   - Mobile (< lg): 4:5 portrait asset, timeline stacked underneath.
 *   - Desktop (lg+): 16:9 landscape asset with the timeline overlaid on its
 *     lower band (a light scrim keeps the copy legible over the floor).
 *
 * Static server component (no client JS). The page section owns the full-bleed
 * (`!px-0 !py-0`). Used on /conka-flow (01), /conka-clarity (02); Both is ready
 * to wire when needed.
 * ========================================================================== */

/** Shared Day 1 / Day 7 / Day 30 items — MM days-banner styling. */
function DayItems({ milestones }: { milestones: ExpectMilestone[] }) {
  return (
    <>
      {milestones.map((m) => (
        <li key={m.day} className="border-t border-black/20 pt-5">
          <div className="mb-2.5 text-sm font-bold text-[#1B2757]">{m.day}</div>
          <h3 className="mb-2 text-xl font-bold leading-tight text-black lg:text-2xl">
            {m.title}
          </h3>
          <p className="text-sm leading-relaxed text-black/70 lg:text-base">
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
        <Image
          src={asset.mobile}
          alt={asset.alt}
          width={1080}
          height={1350}
          loading="lazy"
          sizes="100vw"
          className="h-auto w-full"
        />
        <ol className="grid grid-cols-1 gap-8 px-[var(--brand-gutter-mobile)] py-12">
          <DayItems milestones={milestones} />
        </ol>
      </div>

      {/* Desktop: landscape asset with the timeline overlaid on its lower band. */}
      <div className="relative hidden lg:block">
        <Image
          src={asset.desktop}
          alt={asset.alt}
          width={1920}
          height={1080}
          loading="lazy"
          sizes="100vw"
          className="h-auto w-full"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent pt-28">
          <ol className="mx-auto grid max-w-[1280px] grid-cols-3 gap-12 px-[var(--brand-gutter-desktop)] pb-10">
            <DayItems milestones={milestones} />
          </ol>
        </div>
      </div>
    </div>
  );
}
