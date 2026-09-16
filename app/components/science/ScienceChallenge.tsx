import type { ReactNode } from "react";
import Image from "next/image";
import {
  SCIENCE_CHALLENGE,
  type ChallengeCard,
  type ChallengeIcon,
} from "@/app/lib/scienceContent";
import {
  IconNotification,
  IconBolt,
  IconQuestion,
} from "@/app/components/landing/icons";

/* ============================================================================
 * ScienceChallenge (SCRUM-1352, Simple DTC)
 *
 * The problem, in the same words as row 1 of the home "why" accordion: three
 * cards, one idea each. Each card takes an optional photo banner (the tmrw
 * studies-card pattern); cards without one fall back to icon-only.
 * ========================================================================== */

const ICONS: Record<ChallengeIcon, (props: { className?: string }) => ReactNode> = {
  notification: IconNotification,
  bolt: IconBolt,
  question: IconQuestion,
};

export default function ScienceChallenge() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2 className="brand-h2 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          {SCIENCE_CHALLENGE.heading}
        </h2>
        <p className="text-base leading-relaxed text-black/80">{SCIENCE_CHALLENGE.body}</p>
      </div>

      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {SCIENCE_CHALLENGE.cards.map((card: ChallengeCard) => {
          const Icon = ICONS[card.icon];
          return (
            <li
              key={card.title}
              className="flex flex-col overflow-hidden rounded-md bg-white text-black ring-1 ring-black/5"
            >
              {card.image && (
                <div className="relative aspect-[16/9] w-full bg-[#eef0f5]">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5 lg:p-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-navy)] text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-1.5 text-lg font-bold leading-tight text-black">{card.title}</h3>
                <p className="text-base leading-relaxed text-black/80">{card.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

    </div>
  );
}
