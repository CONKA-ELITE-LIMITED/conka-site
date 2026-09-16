import Image from "next/image";
import { SCIENCE_PEOPLE, SCIENCE_PEOPLE_INTRO } from "@/app/lib/scienceContent";

/* ============================================================================
 * SciencePeople (SCRUM-1353, Simple DTC)
 *
 * Named scientists with faces: the strongest credibility device on comparable
 * science pages. Photo, name, role and (where confirmed) institution.
 *
 * The photos are ~200px crops from the team deck, so they render as fixed
 * 96px thumbnails beside the text rather than full-width card images, which
 * keeps them sharp at 2x. Several are lab shots rather than headshots, so the
 * thumbnails are rounded squares, not circles that would crop the faces.
 *
 * Returns nothing for an empty list; the page also skips the section wrapper.
 * ========================================================================== */

export default function SciencePeople() {
  if (SCIENCE_PEOPLE.length === 0) return null;

  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2 className="brand-h2 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          {SCIENCE_PEOPLE_INTRO.heading}
        </h2>
        <p className="text-base leading-relaxed text-black/80">{SCIENCE_PEOPLE_INTRO.body}</p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {SCIENCE_PEOPLE.map((person) => (
          <li
            key={person.name}
            className="flex items-center gap-4 rounded-md bg-white p-4 text-black ring-1 ring-black/5"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-[#eef0f5]">
              <Image
                src={person.photo}
                alt={`Portrait of ${person.name}`}
                fill
                loading="lazy"
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold leading-tight text-black">{person.name}</h3>
              <p className="mt-1 text-base leading-snug text-black">{person.role}</p>
              {person.institution && (
                <p className="mt-0.5 text-sm text-black/60">{person.institution}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
