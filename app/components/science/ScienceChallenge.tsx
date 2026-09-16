import type { ReactNode } from "react";
import { SCIENCE_CHALLENGE, type ChallengeIcon } from "@/app/lib/scienceContent";
import {
  IconNotification,
  IconBolt,
  IconQuestion,
} from "@/app/components/landing/icons";

/* ============================================================================
 * ScienceChallenge (SCRUM-1352, Simple DTC)
 *
 * The problem, in the same words as row 1 of the home "why" accordion: three
 * icon cards, one idea each.
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
        {SCIENCE_CHALLENGE.cards.map((card) => {
          const Icon = ICONS[card.icon];
          return (
            <li
              key={card.title}
              className="rounded-md bg-white p-5 text-black ring-1 ring-black/5 lg:p-6"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-navy)] text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mb-1.5 text-lg font-bold leading-tight text-black">{card.title}</h3>
              <p className="text-base leading-relaxed text-black/80">{card.body}</p>
            </li>
          );
        })}
      </ul>

    </div>
  );
}
