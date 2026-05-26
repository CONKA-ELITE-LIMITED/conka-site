import Image from "next/image";
import Link from "next/link";
import CROPillCTA from "./CROPillCTA";
import {
  GUARANTEE_DAYS,
  GUARANTEE_LABEL,
} from "@/app/lib/offerConstants";

/* ============================================================================
 * CROAppCallout
 *
 * V2 Section 10 on /start. The "don't trust us, test yourself" beat. By
 * this point the visitor has seen the proof; the remaining objection is
 * "what if it doesn't work for me specifically?". This section answers:
 * the CONKA app gives you the same cognitive test that generates every
 * in-app metric on the page. Take it before, take it after. If your data
 * doesn't move, the 100-day guarantee means you don't lose money.
 *
 * Every load-bearing sentence is lifted verbatim from existing site
 * components so no new claims are introduced:
 *  - H2: InsightHeroDifferentiator.tsx
 *  - Opener: AppUSPSection.tsx
 *  - "Not an IQ test" + mechanism: AppFeaturePanel.tsx
 *  - Guarantee: GUARANTEE_DAYS from offerConstants
 * ========================================================================== */

export default function CROAppCallout() {
  return (
    <div className="mx-auto max-w-[560px]">
      {/* ===== Title leads ===== */}
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-4"
        style={{ letterSpacing: "-0.02em" }}
      >
        We don&apos;t ask if CONKA works.
        <br />
        We measure it.
      </h2>

      {/* ===== Subline ===== */}
      <p className="text-[16px] text-black/85 leading-relaxed mb-7">
        Other brands tell you it works. CONKA gives you a cognitive test and a
        daily log so you can watch it happen.
      </p>

      {/* ===== Image tile (contained, bordered) ===== */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/[0.04] border border-black/12 rounded-[var(--brand-radius-container)] mb-7">
        <Image
          src="/lifestyle/ConkaAppYoga.jpg"
          alt="The CONKA app showing a 'Your Brain Over Time' graph next to a CONKA bottle"
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover"
        />
      </div>

      {/* ===== Body 1: not an IQ test ===== */}
      <p className="text-[14.5px] text-black/75 leading-relaxed mb-4">
        This isn&apos;t an IQ test. It measures how efficiently your brain
        processes information, tracked over time.
      </p>

      {/* ===== Body 2: mechanism ===== */}
      <p className="text-[14.5px] text-black/75 leading-relaxed mb-8">
        Built on Cambridge-derived visual recognition. Because it uses natural
        images, your brain can&apos;t learn or memorise the answers. Your
        score only improves if your brain actually improves.
      </p>

      {/* ===== CTA ===== */}
      <CROPillCTA className="w-full">Try CONKA risk-free</CROPillCTA>

      {/* ===== Guarantee tile (under CTA, above /app link) ===== */}
      <div className="bg-black/[0.04] rounded-[var(--brand-radius-container)] p-5 mt-5">
        <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#1B2757] mb-2">
          {GUARANTEE_LABEL}
        </p>
        <p className="text-[14px] text-black/80 leading-relaxed">
          Install the app. Test before. Take CONKA. Test after. If
          you&apos;re not happy, email us within {GUARANTEE_DAYS} days for a
          full refund.
        </p>
      </div>

      {/* ===== /app link ===== */}
      <p className="text-center mt-5">
        <Link
          href="/app"
          className="text-[13px] font-semibold text-[#1B2757] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Learn more about the app &rarr;
        </Link>
      </p>
    </div>
  );
}
