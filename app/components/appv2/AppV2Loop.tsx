import AppPhoneCard, { type AppPhoneCardImage } from "./AppPhoneCard";

/* ============================================================================
 * AppV2Loop (SCRUM-1361, Simple DTC)
 *
 * The heart of the page: baseline, CONKA, retest. The app's job is the first
 * month, where a visitor sees the product working on their own number, not a
 * lifetime of testing.
 *
 * Three cards: a snap carousel with a peek below `md` (three stacked phone
 * cards run too long on a phone), a row of three from `md`. The -mx-5 / px-5
 * pair cancels the mobile gutter so cards scroll edge to edge, and scroll-pl-5
 * keeps the snap point on the gutter. Content-only; the page owns the section.
 * ========================================================================== */

const STEPS: {
  eyebrow: string;
  title: string;
  body: string;
  image: AppPhoneCardImage;
}[] = [
  {
    eyebrow: "Day 1",
    title: "Take your baseline",
    body: "A short test in the app sets your starting score. It takes about two minutes.",
    image: {
      src: "/app/AppTestDistractor.png",
      alt: "The CONKA cognitive test running in the app",
      kind: "phone",
    },
  },
  {
    eyebrow: "Every day",
    title: "Take CONKA",
    body: "Flow in the morning, Clear in the afternoon. Log each shot in the app with a tap.",
    image: {
      src: "/formulas/labelV2/BothV5.webp",
      alt: "CONKA Flow and CONKA Clear bottles side by side",
      kind: "product",
    },
  },
  {
    eyebrow: "Day 30",
    title: "Retest and watch it move",
    body: "Test again and see your score against your own baseline. Proof, not a feeling.",
    image: {
      src: "/app/AppLongTrends.png",
      alt: "CONKA app chart of cognitive score over time against a personal baseline",
      kind: "phone",
    },
  },
];

export default function AppV2Loop() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2
          className="brand-h2 mb-3 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          Baseline. CONKA. Retest.
        </h2>
        <p className="text-lg leading-relaxed text-black/75">
          Your first month is where you see it. Three steps, all in the free
          app.
        </p>
      </div>

      <div className="-mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {STEPS.map((step) => (
          <AppPhoneCard
            key={step.title}
            {...step}
            className="w-[82%] shrink-0 snap-start md:w-auto"
          />
        ))}
      </div>
    </div>
  );
}
