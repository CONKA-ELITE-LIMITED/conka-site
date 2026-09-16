import type { ReactNode } from "react";
import {
  SCIENCE_CHALLENGE,
  COFFEE_FINDING,
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
 * The problem, in the same words as row 1 of the
 * home "why" accordion, then our own app data on coffee as the proof that the
 * usual fix does not work. The observational caveat always renders beside the
 * numbers, never behind a disclosure: the finding is only honest with it.
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

      <ul className="mb-3 grid grid-cols-1 gap-3 lg:mb-4 lg:grid-cols-3 lg:gap-4">
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

      <div className="rounded-md bg-white p-5 text-black shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 lg:p-8">
        <h3 className="mb-5 text-xl font-bold leading-tight text-black">
          {COFFEE_FINDING.heading}
        </h3>
        <dl className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COFFEE_FINDING.stats.map((stat) => (
            // dt must precede dd in the markup; column-reverse puts the
            // number on top visually.
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end rounded-md bg-[#eef0f5] px-4 py-4"
            >
              <dt className="mt-2 text-base leading-snug text-black">{stat.label}</dt>
              <dd className="text-4xl font-bold leading-none tabular-nums text-[var(--brand-navy)]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="max-w-[80ch] text-sm leading-relaxed text-black/70">
          {COFFEE_FINDING.caveat}
        </p>
      </div>
    </div>
  );
}
