import AppPhoneCard, { type AppPhoneCardImage } from "./AppPhoneCard";

/* ============================================================================
 * AppV2Features (SCRUM-1361, Simple DTC)
 *
 * "More in the app": the reasons to keep the app after the first month.
 * It replaces two older dark sections that made the same points. Same card
 * and carousel anatomy as AppV2Loop.
 * Content-only; the page owns the section.
 * ========================================================================== */

const FEATURES: {
  title: string;
  body: string;
  image: AppPhoneCardImage;
}[] = [
  {
    title: "See what moves your score",
    body: "The habits that lift your number and the ones that drag it down, from training days to low sleep.",
    image: {
      src: "/app/AppPatterns.png",
      alt: "CONKA app patterns screen showing what lifts and lowers the score",
      kind: "phone",
    },
  },
  {
    title: "Works with Apple Health",
    body: "Steps, HRV, time outdoors and screen time sit next to your score, so you can see the whole picture.",
    image: {
      src: "/app/AppConkaRingInt.png",
      alt: "CONKA app home screen with Apple Health and Screen Time data",
      kind: "phone",
    },
  },
  {
    title: "Compete with friends",
    body: "Climb the leaderboard, challenge friends, and earn rewards every time you test as a subscriber.",
    image: {
      src: "/app/AppLeaderboard.png",
      alt: "CONKA app friends leaderboard ranked by score",
      kind: "phone",
    },
  },
];

export default function AppV2Features() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2
          className="brand-h2 mb-3 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          More in the app.
        </h2>
        <p className="text-lg leading-relaxed text-black/75">
          Once you have your baseline, the app keeps it interesting.
        </p>
      </div>

      <div className="-mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {FEATURES.map((feature) => (
          <AppPhoneCard
            key={feature.title}
            {...feature}
            className="w-[82%] shrink-0 snap-start md:w-auto"
          />
        ))}
      </div>
    </div>
  );
}
