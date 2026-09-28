import Image from "next/image";
import type { ListicleAsset } from "@/app/lib/landings/listicle-types";

type Athlete = Extract<ListicleAsset, { kind: "athleteScores" }>["athletes"][number];

/* ============================================================================
 * AthleteScoreCarousel
 *
 * Reason visual: a swipeable run of athlete cards, each a square portrait with
 * the score change as the hero number and the before-and-after score under
 * it. Square rather than the reasons' 4:5 frame, so the swipe row stays short;
 * the next card peeks at 85% to invite the swipe. Athletes and professionals
 * mix, so the office reader sees someone like them.
 *
 * CSS scroll-snap only, no JS. Figures come from caseStudiesData (CognICA
 * total score, baseline vs results); the config copies them in so a page
 * never pulls the whole roster into its bundle.
 * ========================================================================== */

function AthleteCard({ athlete }: { athlete: Athlete }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-black/10 bg-[#eef1f8]">
      <Image
        src={athlete.image}
        alt={athlete.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 85vw, 40vw"
        loading="lazy"
      />
      <div
        className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-20 text-white"
        style={{
          background:
            "linear-gradient(to top, rgba(14,31,63,0.95) 0%, rgba(14,31,63,0.7) 55%, rgba(14,31,63,0) 100%)",
        }}
      >
        <p
          className="font-semibold tabular-nums leading-none"
          style={{ fontSize: "clamp(3rem, 14vw, 4.25rem)" }}
        >
          {athlete.change}
        </p>
        <p className="mt-2 text-[13px] tabular-nums text-white/75">
          Cognitive score {athlete.from.toFixed(1)} → {athlete.to.toFixed(1)}
        </p>
        <p className="mt-3 text-[17px] font-bold leading-tight">
          {athlete.name}
        </p>
        <p className="text-[13px] text-white/75">{athlete.role}</p>
      </div>
    </div>
  );
}

export default function AthleteScoreCarousel({
  athletes,
}: {
  athletes: Athlete[];
}) {
  return (
    <div
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="region"
      aria-label="Athlete cognitive score results"
    >
      {athletes.map((a) => (
        <div key={a.name} className="w-[85%] shrink-0 snap-start">
          <AthleteCard athlete={a} />
        </div>
      ))}
    </div>
  );
}
