import Image from "next/image";
import type { TrialSlide } from "@/app/lib/landings/listicle-types";

/* ============================================================================
 * TrialCarousel
 *
 * The cards of a `trialCarousel` block: one per trial. The renderer owns
 * the heading, copy and the "your turn" bar around them. Each card shares the
 * listicle chart-tile grammar (FocusBars, CrashChart): tinted banner, the
 * figure large, a labelled column chart, a tinted takeaway strip.
 *
 * Swipe on mobile (the ReviewStrip snap pattern, 85% cards so the next one
 * peeks), a two- or three-up grid from md. CSS only, no JS carousel.
 *
 * Columns draw from `axis.min`, and the axis is always labelled, so a chart
 * that starts above zero (Bristol's 70 to 90 score range) says so on its face.
 * A value at or below the floor keeps a 2px stub so its label still has a bar.
 * ========================================================================== */

const NAVY = "#1B2757";
const GREY = "#c9ccd6";
const GREEN = "var(--brand-positive, #1a7f4f)";

function TrialCard({ slide }: { slide: TrialSlide }) {
  const { min, max, ticks } = slide.axis;
  const pct = (v: number) =>
    Math.max(0, Math.min(1, (v - min) / (max - min))) * 100;

  return (
    <div className="flex h-full flex-col rounded-lg border border-black/10 bg-white text-black">
      <div className="flex items-center gap-3 rounded-t-lg bg-[#eef1f8] px-4 py-3">
        <Image
          src={slide.logo}
          alt={slide.logoAlt}
          width={72}
          height={36}
          unoptimized
          // Fixed 2:1 box, left-aligned: crests sit at the left, a wordmark
          // (Revolut) fills the width, and the text column starts in one place.
          className="h-9 w-[72px] shrink-0 object-contain object-left"
        />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em]">
            {slide.design}
          </p>
          <p className="mt-0.5 text-[13px] text-black/60">{slide.meta}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <p
          className="font-semibold tabular-nums leading-none"
          style={{ color: GREEN, fontSize: "clamp(2rem, 8vw, 2.5rem)" }}
        >
          {slide.figure}
        </p>
        <p className="mt-1 text-[13px] font-medium">{slide.figureLabel}</p>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50">
          {slide.chartTitle}
        </p>

        {/* Plot: axis labels left, gridlines behind, columns from the floor. */}
        <div className="mt-3 flex min-h-[150px] flex-1 gap-2">
          <div className="relative w-6 shrink-0 text-[11px] tabular-nums text-black/45">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute right-0 translate-y-1/2"
                style={{ bottom: `${pct(t)}%` }}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="relative flex flex-1 items-end justify-around gap-2 border-b border-black/25">
            {ticks.map((t) => (
              <div
                key={t}
                aria-hidden
                className="absolute inset-x-0 border-t border-dashed border-black/10"
                style={{ bottom: `${pct(t)}%` }}
              />
            ))}
            {slide.bars.map((b) => (
              <div
                key={b.label}
                className="relative flex h-full max-w-[64px] flex-1 flex-col items-center justify-end"
              >
                <span className="mb-1 text-[12px] font-semibold tabular-nums">
                  {b.display}
                </span>
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `max(2px, ${pct(b.value)}%)`,
                    background: b.conka ? NAVY : GREY,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="ml-8 mt-2 flex justify-around gap-2">
          {slide.bars.map((b) => (
            <span
              key={b.label}
              className={`max-w-[64px] flex-1 text-center text-[12px] leading-tight ${
                b.conka ? "font-semibold" : "text-black/60"
              }`}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-b-lg bg-[#eef1f8] px-4 py-3">
        <p className="text-[13px] font-semibold leading-snug">{slide.caption}</p>
        {slide.source ? (
          <p className="mt-1 text-[11px] text-black/50">{slide.source}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function TrialCarousel({ slides }: { slides: TrialSlide[] }) {
  return (
    <>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((s) => (
          <div key={s.logoAlt} className="w-[85%] shrink-0 snap-start">
            <TrialCard slide={s} />
          </div>
        ))}
      </div>
      <div
        className={`hidden gap-5 md:grid ${
          slides.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {slides.map((s) => (
          <TrialCard key={s.logoAlt} slide={s} />
        ))}
      </div>
    </>
  );
}
