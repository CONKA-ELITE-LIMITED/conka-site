import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import {
  type AthleteData,
  getAthleteById,
  getCaseStudyPhotoPath,
} from "@/app/lib/caseStudiesData";

/* ============================================================================
 * AppV2Results (SCRUM-1361, Simple DTC)
 *
 * The loop, proven on real people: the gain leads each card, large and green,
 * with the baseline and latest score under it. Data comes from
 * caseStudiesData so it always matches /case-studies; an id that is removed or
 * hidden there simply drops out here.
 *
 * Testing periods run months, not a fixed 30 days, so the copy says "baseline
 * to retest" rather than promising a timeframe. Two across on mobile, four on
 * desktop. Content-only; the page owns the section.
 * ========================================================================== */

const ATHLETE_IDS = [
  "jade-shekells",
  "finn-russell",
  "nimisha-kurup",
  "jack-willis",
];

function totalScoreGain(athlete: AthleteData): number | undefined {
  return athlete.improvements.find((i) => i.metric === "Total Score")
    ?.percentage;
}

export default function AppV2Results() {
  const athletes = ATHLETE_IDS.map(getAthleteById).filter(
    (a): a is AthleteData => a !== undefined,
  );

  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2
          className="brand-h2 mb-3 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          Real people. Real scores.
        </h2>
        <p className="text-lg leading-relaxed text-black/75">
          Baseline to retest, from people who took CONKA and tracked it in the
          app.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {athletes.map((athlete) => {
          const photo = getCaseStudyPhotoPath(athlete.id) || athlete.photo;
          const focal = athlete.focalPoint ?? { x: 50, y: 50 };
          const gain = totalScoreGain(athlete);
          const before = athlete.baseline.totalScore;
          const after = athlete.results.totalScore;

          return (
            <li
              key={athlete.id}
              className="flex flex-col overflow-hidden rounded-lg bg-white text-black ring-1 ring-black/[0.06]"
            >
              {photo && (
                <div className="relative aspect-square w-full">
                  <Image
                    src={photo}
                    alt={athlete.name}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 300px, 50vw"
                    className="object-cover"
                    style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-3 lg:p-5">
                {gain !== undefined && (
                  <p className="text-3xl font-bold leading-none tabular-nums text-[var(--brand-positive)] lg:text-5xl">
                    +{gain.toFixed(1)}%
                  </p>
                )}
                {before !== undefined && after !== undefined && (
                  <p className="mt-1.5 text-sm tabular-nums text-black/70 lg:text-base">
                    Score {Math.round(before)}
                    <span aria-hidden> → </span>
                    <span className="sr-only"> to </span>
                    <span className="font-semibold text-black">
                      {Math.round(after)}
                    </span>
                  </p>
                )}
                <div className="mt-3 border-t border-black/10 pt-3">
                  <p className="text-base font-semibold leading-tight lg:text-lg">
                    {athlete.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-black/60 lg:text-sm">
                    {athlete.organization}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-center lg:mt-10">
        <ConkaCTAButton href="/case-studies" inverted>
          See all case studies
        </ConkaCTAButton>
      </div>
    </div>
  );
}
