/* ============================================================================
 * AthleteSportMarquee
 *
 * The scrolling navy sport-breadth strip that heads the athlete proof beat.
 * Extracted from AthleteCredibilityCarousel so it can be rendered as a
 * full-bleed band *outside* the section's content track (the carousel itself
 * stays capped at the 1280px track for readability).
 *
 * Two width variants:
 *  - "contained" (default): bleeds the gutter on mobile, sits inside the track
 *    on desktop. Used when the marquee renders *inside* the carousel (e.g. the
 *    paid listicle landing) so its layout is unchanged.
 *  - fullBleed: bleeds the gutter at every breakpoint so the strip runs
 *    edge-to-edge. Only valid when rendered as a direct child of a
 *    `brand-section` (so the negative margins cancel the section gutter exactly
 *    — no 100vw, so no horizontal-scroll on pages without overflow-x: hidden).
 *
 * The sport list is broader than the signed-quote roster on purpose: it
 * captures the full range of sports CONKA athletes compete in.
 * ========================================================================== */

const SPORTS = [
  "Premiership Rugby",
  "WBO Boxing",
  "NFL",
  "Showjumping",
  "Motorsport",
  "Rugby Sevens",
  "MMA",
  "Mountain Biking",
  "Football",
  "Olympic Track",
  "NHL",
  "Triathlon",
  "British GT",
  "Athletics",
  "Ultramarathon",
];

export default function AthleteSportMarquee({
  fullBleed = false,
}: {
  fullBleed?: boolean;
} = {}) {
  // Gutter-negation bleed. Mobile gutter = 1.25rem (-mx-5); desktop gutter =
  // 5vw. fullBleed extends the bleed to desktop; contained re-contains at md.
  const bleed = fullBleed
    ? "-mx-5 w-[calc(100%+2.5rem)] md:-mx-[5vw] md:w-[calc(100%+10vw)]"
    : "-mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full";

  return (
    <div
      className={`relative overflow-hidden bg-[#1B2757] py-3 mb-8 ${bleed}`}
    >
      <span className="sr-only">
        CONKA athletes compete in: {SPORTS.join(", ")}.
      </span>
      <div
        className="inline-flex whitespace-nowrap [will-change:transform] motion-safe:animate-[marquee_60s_linear_infinite]"
        aria-hidden="true"
      >
        {[...SPORTS, ...SPORTS].map((sport, i) => (
          <span
            key={`${sport}-${i}`}
            className="inline-flex items-center text-[12px] uppercase tracking-[0.18em] font-semibold text-white"
          >
            <span>{sport}</span>
            <span className="mx-5 text-white" aria-hidden="true">
              ★
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
