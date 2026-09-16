import Image from "next/image";

/* ============================================================================
 * AppV2Loop (SCRUM-1361, Simple DTC)
 *
 * The heart of the page: baseline, CONKA, retest. The app's job is the first
 * month, where a visitor sees the product working on their own number, not a
 * lifetime of testing.
 *
 * Same card anatomy as /science "The challenge" (ScienceChallenge): a flat 2:1
 * banner with a short label pill, then the title and one line of body. Phone
 * banners show the top of a small screenshot on the tint; the product step
 * fills its banner with the bottles. Stacked on mobile, three across from lg.
 * Content-only; the page owns the section.
 * ========================================================================== */

const PHONE_WIDTH = 1455;
const PHONE_HEIGHT = 2942;

const STEPS: {
  tag: string;
  title: string;
  body: string;
  image: { src: string; alt: string; kind: "phone" | "product" };
}[] = [
  {
    tag: "Day 1",
    title: "Take your baseline",
    body: "A short test in the app sets your starting score. It takes about two minutes.",
    image: {
      src: "/app/AppTestDistractor.png",
      alt: "The CONKA cognitive test running in the app",
      kind: "phone",
    },
  },
  {
    tag: "Every day",
    title: "Take CONKA",
    body: "Flow in the morning, Clear in the afternoon. Log each shot in the app with a tap.",
    image: {
      src: "/formulas/labelV2/BothV5.webp",
      alt: "CONKA Flow and CONKA Clear bottles side by side",
      kind: "product",
    },
  },
  {
    tag: "Day 30",
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
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-[#eef0f5]">
              {step.image.kind === "phone" ? (
                <div className="absolute left-1/2 top-5 w-[30%] max-w-[150px] -translate-x-1/2">
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    width={PHONE_WIDTH}
                    height={PHONE_HEIGHT}
                    loading="lazy"
                    sizes="(min-width: 1024px) 150px, 30vw"
                    className="h-auto w-full drop-shadow-lg"
                  />
                </div>
              ) : (
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="object-cover"
                />
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
