import Image from "next/image";
import { CURATED_TESTIMONIALS } from "@/app/lib/customerTestimonials";

/* ============================================================================
 * ReviewRail
 *
 * "Real people. Real results." horizontal verified-review rail, ported from
 * the lander (app/lander/sections/Reviews) into our patterns: Tailwind (no
 * CSS Module), pure-CSS horizontal scroll (no JS carousel). Reads our canonical
 * CURATED_TESTIMONIALS so there is one review dataset, not a per-page copy.
 * Replaces CROTestimonials in the listicle reviews zone.
 * ========================================================================== */

const NAVY = "#1B2757";

/** Product pill styling keyed off the testimonial's product label. */
function pillStyle(label?: string): { background: string; color: string } {
  const l = (label ?? "").toLowerCase();
  const hasFlow = l.includes("flow");
  const hasClear = l.includes("clear");
  if (hasFlow && !hasClear) {
    return { background: "rgba(233,178,0,0.16)", color: "#8a6d00" };
  }
  // Flow + Clear (Both) and Clear-only both read navy
  return { background: "rgba(27,39,87,0.10)", color: NAVY };
}

export default function ReviewRail() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h2
          className="mb-2 text-4xl font-extrabold leading-[1.05] text-black md:text-5xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Real people. Real results.
        </h2>
        <p className="text-[15px] text-black/55">
          A few favourites from our verified reviews.
        </p>
      </div>

      <div className="-mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2.5 pt-1 scroll-pl-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0 md:scroll-pl-0">
        {CURATED_TESTIMONIALS.map((r, i) => {
          const pill = pillStyle(r.productLabel);
          return (
            <article
              key={`${r.name}-${i}`}
              className="flex w-[270px] flex-shrink-0 snap-start flex-col rounded-[20px] border border-black/10 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-medium uppercase tracking-[0.09em] text-[#999]">
                  ✓ Verified
                </span>
                {r.productLabel ? (
                  <span
                    className="rounded-full px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.06em]"
                    style={pill}
                  >
                    {r.productLabel}
                  </span>
                ) : null}
              </div>
              <div className="mb-3 flex items-center gap-1.5 text-[14.5px] tracking-[0.06em] text-[#e9b200]">
                ★★★★★{" "}
                <span className="text-[13.5px] font-extrabold tracking-[-0.01em] text-[#1d1d1d]">
                  {r.rating.toFixed(1)}
                </span>
              </div>
              <h3 className="mb-2 text-[17.5px] font-medium leading-[22px] text-[#1d1d1d]">
                {r.headline}
              </h3>
              <p className="mb-4 line-clamp-5 flex-1 whitespace-pre-line text-[14.5px] font-light leading-5 text-[#555]">
                {r.body}
              </p>
              <div className="flex items-center gap-2.5 border-t border-black/[0.08] pt-3.5">
                {r.photo ? (
                  <Image
                    src={r.photo}
                    alt={r.name}
                    width={50}
                    height={50}
                    className="h-[50px] w-[50px] flex-shrink-0 rounded-full object-cover"
                  />
                ) : null}
                <span className="text-[13.5px] font-medium text-[#1d1d1d]">
                  {r.name}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
