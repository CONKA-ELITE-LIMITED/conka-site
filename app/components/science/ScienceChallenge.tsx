import Image from "next/image";
import { SCIENCE_CHALLENGE } from "@/app/lib/scienceContent";

/* ============================================================================
 * ScienceChallenge (SCRUM-1352, Simple DTC)
 *
 * The problem, in the same words as row 1 of the home "why" accordion: three
 * cards, one idea each. Each opens with a 2:1 photo banner carrying a short
 * label pill (the tmrw studies-card pattern, taller for more breathing room),
 * then the title and one line of body.
 * ========================================================================== */

export default function ScienceChallenge() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2 className="brand-h1 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          {SCIENCE_CHALLENGE.heading}
        </h2>
        <p className="text-lg leading-relaxed text-black/80 lg:text-xl">{SCIENCE_CHALLENGE.body}</p>
      </div>

      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {SCIENCE_CHALLENGE.cards.map((card) => (
          <li
            key={card.title}
            className="flex flex-col overflow-hidden rounded-md bg-white text-black ring-1 ring-black/5"
          >
            <div className="relative aspect-[2/1] w-full bg-black">
              <Image
                src={card.image.src}
                alt={card.image.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                {card.tag}
              </span>
            </div>
            <div className="p-5 lg:p-6">
              <h3 className="mb-1.5 text-lg font-bold leading-tight text-black">{card.title}</h3>
              <p className="text-base leading-relaxed text-black/80">{card.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
