import { Bottles, PhoneScreen, StatTile, type LoopStat } from "./AppLoopVisuals";

/* ============================================================================
 * AppV2Loop (SCRUM-1361, Simple DTC)
 *
 * The heart of the page: baseline, CONKA, retest. The app's job is the first
 * month, where a visitor sees the product working on their own number, not a
 * lifetime of testing.
 *
 * Same card anatomy as /science "The challenge" (ScienceChallenge): a flat
 * banner with a short label pill, then the title and one line of body. The
 * banners speak the hero's tile language (the app store assets' pattern, in
 * the site palette):
 * - phone steps: a CSS-framed screen cropped by the banner, with one floating
 *   stat tile so the step reads as its outcome;
 * - the product step: Flow and Clear as two tilted bottle tiles, labelled
 *   with when you take them.
 * The banner visuals live in AppLoopVisuals, shared with /app-insights.
 * Stacked on mobile, three across from lg. Content-only; the page owns the
 * section.
 * ========================================================================== */

type Step = {
  tag: string;
  title: string;
  body: string;
  visual:
    | { kind: "phone"; src: string; alt: string; stat: LoopStat }
    | { kind: "product" };
};

const STEPS: Step[] = [
  {
    tag: "Day 1",
    title: "Take your baseline",
    body: "A quick test in the app sets your starting score. It takes about 90 seconds.",
    visual: {
      kind: "phone",
      src: "/app/AppHomeCapture.webp",
      alt: "CONKA app home screen showing a cognitive score of 92",
      stat: { check: "Baseline set" },
    },
  },
  {
    tag: "Every day",
    title: "Take CONKA",
    body: "Flow in the morning, Clear in the afternoon. Log each shot in the app with a tap.",
    visual: { kind: "product" },
  },
  {
    tag: "Day 30",
    title: "Retest and watch it move",
    body: "Test again and see your score against your own baseline. Proof, not a feeling.",
    visual: {
      kind: "phone",
      src: "/app/AppTrendsCapture.webp",
      alt: "CONKA app chart of cognitive score over time rising above a personal baseline",
      stat: { value: "+9%", label: "since your baseline", positive: true },
    },
  },
];

export default function AppV2Loop() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2
          className="brand-h1 mb-4 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          Baseline. CONKA. Retest.
        </h2>
        <p className="text-lg leading-relaxed text-black/80 lg:text-xl">
          Your first month is where you see it. Three steps, all in the free
          app.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {STEPS.map((step) => (
          <li
            key={step.title}
            className="flex flex-col overflow-hidden rounded-md bg-white text-black ring-1 ring-black/5"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eef0f5]">
              {step.visual.kind === "phone" ? (
                <>
                  <PhoneScreen src={step.visual.src} alt={step.visual.alt} />
                  <StatTile stat={step.visual.stat} />
                </>
              ) : (
                <Bottles />
              )}
              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                {step.tag}
              </span>
            </div>
            <div className="p-5 lg:p-6">
              <h3 className="mb-1.5 text-lg font-bold leading-tight text-black">
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-black/80">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
