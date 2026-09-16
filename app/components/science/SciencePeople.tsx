import Image from "next/image";
import { SCIENCE_PEOPLE, SCIENCE_PEOPLE_INTRO } from "@/app/lib/scienceContent";

/* ============================================================================
 * SciencePeople (SCRUM-1353, Simple DTC)
 *
 * Named scientists with faces: the strongest credibility device on comparable
 * science pages. Modelled on Nomio's team row: a square black-and-white photo,
 * the name in bold, then role and institution as plain text, no card chrome.
 *
 * Below lg it is a native horizontal scroll-snap carousel. The track bleeds to
 * the screen edge by cancelling the section gutter (1.25rem, then 5vw from md),
 * and scroll-pl matches it so the first card snaps to the text line rather
 * than the screen edge. From lg it is a four-column grid.
 *
 * Most photos are ~200px crops from the team deck, so they stay capped at
 * 12rem wide at every size to keep them near 1:1 device pixels.
 *
 * Returns nothing for an empty list; the page also skips the section wrapper.
 * ========================================================================== */

export default function SciencePeople() {
  if (SCIENCE_PEOPLE.length === 0) return null;

  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2 className="brand-h1 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          {SCIENCE_PEOPLE_INTRO.heading}
        </h2>
        <p className="text-base leading-relaxed text-black/80">{SCIENCE_PEOPLE_INTRO.body}</p>
      </div>

      <ul className="scrollbar-hide -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-2 md:-mx-[5vw] md:scroll-pl-[5vw] md:px-[5vw] lg:mx-0 lg:grid lg:snap-none lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10 lg:overflow-visible lg:px-0 lg:pb-0">
        {SCIENCE_PEOPLE.map((person) => (
            <li key={person.name} className="w-48 shrink-0 snap-start lg:w-auto">
              <div className="relative aspect-square w-full max-w-[12rem] overflow-hidden rounded-md bg-[#eef0f5]">
                <Image
                  src={person.photo}
                  alt={`Portrait of ${person.name}`}
                  fill
                  loading="lazy"
                  sizes="192px"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-3 text-base font-bold leading-tight text-black">{person.name}</h3>
              <p className="mt-1 text-sm leading-snug text-black">{person.role}</p>
              {person.institution && (
                <p className="mt-1 text-sm leading-snug text-black/60">{person.institution}</p>
              )}
            </li>
        ))}
      </ul>
    </div>
  );
}
