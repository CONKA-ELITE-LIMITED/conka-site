import Image from "next/image";
import Link from "next/link";
import CROPillCTA from "./CROPillCTA";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";

/* ============================================================================
 * CROAppCallout
 *
 * V2 Section 10 on /start, Section 9 on /startv2. The "don't trust us, test
 * yourself" beat. Visitor has seen the proof; the remaining objection is
 * "what if it doesn't work for me specifically?". This section answers by
 * pitching the CONKA app: install it, take the cognitive test before and
 * after starting CONKA, watch your own data move.
 *
 * Restructured iteration:
 *  - The original two body paragraphs ("not an IQ test" + "Cambridge-
 *    derived mechanism") were collapsed into a tighter subline plus a
 *    3-step visual grid (Install + test / Take CONKA daily / Track over
 *    time).
 *  - App install is intentionally NOT a standalone CTA. The App Store +
 *    Play Store icons live inside step 1 of the grid as small inline
 *    links — visible to people interested in installing, invisible to
 *    the rest. S9 sits in the page's conversion stack and the primary
 *    action is product trial, not app acquisition.
 *  - The guarantee block (adapted from Magic Mind's "100 Days to Feel
 *    the Difference" voice) sits ABOVE the CTA as a bordered card
 *    matching the step-tile grammar. Above-CTA placement frames the
 *    guarantee as the trust anchor that justifies clicking.
 *  - The "Try CONKA risk-free" pill stays as the load-bearing CTA.
 *
 * Install-button SVG icon paths lifted verbatim from
 * `app/components/AppInstallButtons.tsx`. We do not reuse that component
 * because its variants don't match the v2.1 register.
 * ========================================================================== */

const APP_STORE_URL =
  "https://apps.apple.com/gb/app/conka-app/id6450399391";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.conka.conkaApp&hl=en_GB";

function AppStoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm-1.64-4.03L6.05 2.66l10.72 6.43-2.6 2.6zM6.05 2.66l10.72 6.43L6.05 21.34V2.66z" />
    </svg>
  );
}

export default function CROAppCallout() {
  return (
    <div className="mx-auto max-w-[560px]">
      {/* ===== Title ===== */}
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-4"
        style={{ letterSpacing: "-0.02em" }}
      >
        We don&apos;t ask if CONKA works.
        <br />
        We measure it.
      </h2>

      {/* ===== Subline (periodic testing across a month of daily CONKA,
                 not a one-off before/after) ===== */}
      <p className="text-[16px] text-black/85 leading-relaxed mb-7">
        Take CONKA daily. Run the cognitive test in the app whenever you
        want. After a month, the numbers tell you whether it worked. Not us.
      </p>

      {/* ===== Image tile ===== */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/[0.04] border border-black/12 rounded-[var(--brand-radius-container)] mb-7">
        <Image
          src="/lifestyle/ConkaAppYoga.jpg"
          alt="The CONKA app showing a 'Your Brain Over Time' graph next to a CONKA bottle"
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover"
        />
      </div>

      {/* ===== 3-step grid (replaces the original two body paragraphs).
                 Step 01 carries the App Store + Play Store install icons
                 inline. Steps 02 and 03 are text-only. ===== */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {/* Step 01 — Install + test (with small install icons) */}
        <div className="bg-white border border-black/10 rounded-[12px] p-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#1B2757] mb-1">
            01
          </div>
          <div className="text-[13px] text-black font-semibold leading-tight mb-2">
            Install + test
          </div>
          <div className="flex items-center justify-center gap-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download CONKA app from the App Store"
              className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] text-[#1B2757] hover:bg-[#1B2757]/10 transition-colors"
            >
              <AppStoreIcon />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download CONKA app from Google Play"
              className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] text-[#1B2757] hover:bg-[#1B2757]/10 transition-colors"
            >
              <PlayStoreIcon />
            </a>
          </div>
        </div>

        {/* Step 02 — Take CONKA daily */}
        <div className="bg-white border border-black/10 rounded-[12px] p-3 text-center flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#1B2757] mb-1">
            02
          </div>
          <div className="text-[13px] text-black font-semibold leading-tight">
            Take CONKA daily
          </div>
        </div>

        {/* Step 03 — Track over time */}
        <div className="bg-white border border-black/10 rounded-[12px] p-3 text-center flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#1B2757] mb-1">
            03
          </div>
          <div className="text-[13px] text-black font-semibold leading-tight">
            Track over time
          </div>
        </div>
      </div>

      {/* ===== Guarantee card (bordered, matches step-tile grammar; sits
                 above the CTA as the trust anchor that justifies clicking).
                 Voice adapted from Magic Mind's "100 Days to Feel the
                 Difference" pattern. ===== */}
      <div className="bg-white border border-black/10 rounded-[12px] p-5 text-center mb-6">
        <h3
          className="text-[18px] font-semibold text-[#1B2757] mb-2"
          style={{ letterSpacing: "-0.01em" }}
        >
          {GUARANTEE_DAYS} days to feel the difference, or your money back.
        </h3>
        <p className="text-[13px] text-black/65 leading-relaxed">
          No returns. No hassles. No questions. The only thing you have to
          lose is the fog.
        </p>
      </div>

      {/* ===== Primary CTA ===== */}
      <CROPillCTA className="w-full">Try CONKA risk-free</CROPillCTA>

      {/* ===== /app link (small, low-emphasis closer) ===== */}
      <p className="text-center mt-4">
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
