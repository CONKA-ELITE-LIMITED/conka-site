import Image from "next/image";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

/* ============================================================================
 * AppV2Hero (SCRUM-1361, Simple DTC)
 *
 * One demo, readable in seconds without a word of explanation: the home score
 * screen, with real test images floating round it labelled the way the test
 * asks you to sort them. Phone + tiles say "a quick tap test that gives you a
 * score"; the pill says how long it takes. Pattern from the app's own store
 * feature graphic, in the site palette.
 *
 * The tiles are the test's own 256px images (public/cognica/test), so they
 * cost ~25KB each. The secondary link drops visitors into the live test on
 * this page. Static on purpose: the phone is the likely LCP element. The
 * tiles' gentle float is CSS only and off under reduced motion.
 * Content-only; the page owns the section wrapper.
 * ========================================================================== */

type Tile = {
  id: string;
  alt: string;
  animal: boolean;
  /** Position, size and tilt for this slot round the phone. */
  className: string;
  /** Float phase, so the tiles never bob in step. */
  delay: string;
};

const TILES: Tile[] = [
  {
    id: "th5",
    alt: "A cat",
    animal: true,
    className: "left-0 top-[6%] -rotate-6",
    delay: "0s",
  },
  {
    id: "dh3",
    alt: "A steam train",
    animal: false,
    className: "right-0 top-[18%] rotate-6",
    delay: "-1.5s",
  },
  {
    id: "dh18",
    alt: "Big Ben",
    animal: false,
    className: "left-[2%] top-[56%] rotate-3",
    delay: "-3s",
  },
  {
    id: "th11",
    alt: "A koala",
    animal: true,
    className: "right-[2%] top-[64%] -rotate-3",
    delay: "-4.5s",
  },
];

export default function AppV2Hero() {
  return (
    // Mobile: headline, demo, body. Desktop: copy left (headline over body),
    // demo right spanning both rows.
    <div className="grid items-center gap-x-12 gap-y-8 md:grid-cols-2">
      <div className="flex flex-col items-center text-center md:col-start-1 md:row-start-1 md:items-start md:self-end md:text-left">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)] shadow-[0_4px_16px_rgba(27,39,87,0.1)] ring-1 ring-black/5">
          <span
            className="h-2 w-2 rounded-full bg-[var(--brand-accent)]"
            aria-hidden="true"
          />
          The 90-second cognition test
        </span>

        <h1
          className="brand-h1 text-[var(--brand-navy)] lg:text-[3.75rem]"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.02 }}
        >
          Know your brain.
          <br />
          <span className="text-[var(--brand-accent)]">See CONKA working.</span>
        </h1>
      </div>

      {/* Phone + floating test tiles. The box keeps the tiles inside the
          gutter on mobile, so nothing bleeds or scrolls sideways. */}
      <div
        className="relative mx-auto aspect-[5/6] w-full max-w-[520px] md:col-start-2 md:row-span-2 md:row-start-1"
        role="group"
        aria-label="The CONKA app score screen, with images from the test"
      >
        <div className="absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/app/AppConkaRing.png"
            alt="CONKA app home screen showing a cognitive score of 92"
            width={1455}
            height={2942}
            priority
            sizes="(min-width: 768px) 270px, 50vw"
            className="h-auto w-full drop-shadow-2xl"
          />
        </div>

        {TILES.map((tile) => (
          <figure
            key={tile.id}
            className={`app-hero-tile absolute w-[34%] max-w-[170px] rounded-lg bg-white p-[3%] pb-[2%] app-tile-shadow ${tile.className}`}
            style={{ animationDelay: tile.delay }}
          >
            <Image
              src={`/cognica/test/${tile.id}.jpg`}
              alt={tile.alt}
              width={256}
              height={256}
              sizes="(min-width: 768px) 160px, 30vw"
              className="aspect-square w-full rounded-md object-cover"
            />
            <figcaption
              className={`mx-auto mt-[6%] w-fit whitespace-nowrap rounded-full px-[0.7em] py-[0.3em] text-[clamp(0.6rem,2.6vw,0.8rem)] font-semibold ${
                tile.animal
                  ? "bg-[var(--brand-navy)] text-white"
                  : "bg-[var(--brand-tint)] text-[var(--brand-navy)]"
              }`}
            >
              {tile.animal ? "Animal \u2192" : "\u2190 Not an animal"}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="flex flex-col items-center text-center md:col-start-1 md:row-start-2 md:items-start md:self-start md:text-left">
        <p className="mb-7 max-w-[42ch] text-lg leading-relaxed text-black/75 lg:text-xl">
          Tap through quick images and get a score for how sharp you are. Take
          your baseline, start CONKA, and watch the number move.
        </p>

        <AppInstallButtons
          variant="dtc"
          trackLocation="hero"
          buttonClassName="min-h-[44px]"
          className="justify-center md:justify-start"
        />

        <a
          href="#try-the-test"
          className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--brand-navy)] underline decoration-black/20 underline-offset-4 hover:decoration-[var(--brand-navy)]"
        >
          Or try it here first, free &darr;
        </a>
      </div>
    </div>
  );
}
