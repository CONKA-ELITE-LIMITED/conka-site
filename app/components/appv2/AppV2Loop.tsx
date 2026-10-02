import Image from "next/image";

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
 * Screens are the store pipeline's raw captures (conkaApp
 * design/app-store/captures) and the bottles its renders, all small webps.
 * Stacked on mobile, three across from lg. Content-only; the page owns the
 * section.
 * ========================================================================== */

/** The outcome tile: a big value over a short label, or a check and a
 *  single line when the step's outcome is done rather than a number. */
type Stat =
  | { value: string; label: string; positive?: boolean }
  | { check: string };

type Step = {
  tag: string;
  title: string;
  body: string;
  visual:
    | { kind: "phone"; src: string; alt: string; stat: Stat }
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

const BOTTLES = [
  {
    src: "/app/AppFlowBottle.webp",
    alt: "A bottle of CONKA Flow",
    name: "CONKA Flow",
    when: "Morning",
    className: "-rotate-6 translate-y-2",
  },
  {
    src: "/app/AppClearBottle.webp",
    alt: "A bottle of CONKA Clear",
    name: "CONKA Clear",
    when: "Afternoon",
    className: "rotate-6 -translate-y-1",
  },
];

function StatTile({ stat }: { stat: Stat }) {
  const tile =
    "absolute bottom-4 left-3 rounded-lg bg-white px-3.5 py-2.5 text-left shadow-[0_8px_24px_rgba(27,39,87,0.16)] lg:left-4";

  if ("check" in stat) {
    return (
      <div className={`${tile} flex items-center gap-2.5`}>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-positive)] text-white"
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-base font-bold leading-none text-[var(--brand-navy)]">
          {stat.check}
        </p>
      </div>
    );
  }

  return (
    <div className={tile}>
      <p
        className={`text-xl font-bold leading-none tracking-tight lg:text-2xl ${
          stat.positive
            ? "text-[var(--brand-positive)]"
            : "text-[var(--brand-navy)]"
        }`}
      >
        {stat.value}
      </p>
      <p className="mt-1 text-xs font-medium text-black/60">{stat.label}</p>
    </div>
  );
}

function Bottles() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
      {BOTTLES.map((bottle) => (
        <figure
          key={bottle.name}
          className={`w-[38%] max-w-[170px] rounded-lg bg-white p-[3%] pb-3 shadow-[0_12px_32px_rgba(27,39,87,0.18)] ${bottle.className}`}
        >
          <Image
            src={bottle.src}
            alt={bottle.alt}
            width={480}
            height={480}
            loading="lazy"
            sizes="(min-width: 1024px) 160px, 36vw"
            className="aspect-square w-full rounded-md object-cover"
          />
          <figcaption className="mt-2 px-1">
            <span className="block text-sm font-bold leading-tight text-[var(--brand-navy)]">
              {bottle.name}
            </span>
            <span className="mt-1 inline-block rounded-full bg-[var(--brand-navy)] px-2.5 py-0.5 text-xs font-semibold text-white">
              {bottle.when}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

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
                  {/* The banner crops the phone at its bottom edge, so the
                      screen reads as carrying on rather than ending. */}
                  <div className="absolute left-[54%] top-8 w-[46%] max-w-[220px] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border-[5px] border-[#0d0e10] bg-[#0d0e10] shadow-2xl">
                    <Image
                      src={step.visual.src}
                      alt={step.visual.alt}
                      width={720}
                      height={1200}
                      loading="lazy"
                      sizes="(min-width: 1024px) 220px, 46vw"
                      className="h-auto w-full"
                    />
                  </div>
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
