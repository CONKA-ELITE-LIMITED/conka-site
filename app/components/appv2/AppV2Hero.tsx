import Image from "next/image";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

/* ============================================================================
 * AppV2Hero (SCRUM-1361, Simple DTC)
 *
 * "See CONKA working": the app is how you see the product do its job, not a
 * test you sit for life. Centred copy, so the headline and the download
 * buttons stay close to the top.
 *
 * The phones are the visual, in the Oura "why Oura" pattern: real screenshots
 * fanned out with the home score screen largest in the middle. Five on
 * desktop; on mobile three, under the headline.
 * Static on purpose: the centre phone is the likely LCP element, so no
 * entrance animation holds it back. Content-only; the page owns the section
 * wrapper.
 * ========================================================================== */

const PHONE_WIDTH = 1455;
const PHONE_HEIGHT = 2942;

type Phone = {
  src: string;
  alt: string;
  /** Tailwind width + overlap + stacking classes for this slot in the fan. */
  className: string;
  /** Outer phones are desktop-only; mobile shows the middle three. */
  desktopOnly?: boolean;
  centre?: boolean;
};

const PHONES: Phone[] = [
  {
    src: "/app/AppPatterns.png",
    alt: "CONKA app patterns screen linking lifestyle to cognitive score",
    className: "w-[17%] -mr-[4%] z-0",
    desktopOnly: true,
  },
  {
    src: "/app/AppLongTrends.png",
    alt: "CONKA app trend chart of cognitive score over time against a baseline",
    className: "w-[34%] -mr-[10%] md:w-[21%] md:-mr-[4%] z-10",
  },
  {
    src: "/app/AppConkaRing.png",
    alt: "CONKA app home screen showing a cognitive score of 92",
    className: "w-[44%] md:w-[26%] z-20",
    centre: true,
  },
  {
    src: "/app/AppTestBreakdown.png",
    alt: "CONKA app breakdown of the last test with speed and accuracy",
    className: "w-[34%] -ml-[10%] md:w-[21%] md:-ml-[4%] z-10",
  },
  {
    src: "/app/AppRewards.png",
    alt: "CONKA app rewards screen",
    className: "w-[17%] -ml-[4%] z-0",
    desktopOnly: true,
  },
];

export default function AppV2Hero() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1
        className="brand-h1 text-black mb-4 lg:text-[3.5rem]"
        style={{ letterSpacing: "-0.02em" }}
      >
        See CONKA working.
      </h1>

      {/* Phones sit under the headline on mobile and after the buttons from
          md: three on mobile so each stays legible, five from md. */}
      <div
        className="order-2 mb-8 flex w-full max-w-[1100px] items-center justify-center md:order-4 md:mb-0 md:mt-12"
        aria-label="Screens from the CONKA app"
        role="group"
      >
        {PHONES.map((phone) => (
          <div
            key={phone.src}
            className={`relative shrink-0 ${phone.className} ${
              phone.desktopOnly ? "hidden md:block" : ""
            }`}
          >
            <Image
              src={phone.src}
              alt={phone.alt}
              width={PHONE_WIDTH}
              height={PHONE_HEIGHT}
              priority={phone.centre}
              // Outer phones are display:none on mobile; lazy stops them
              // downloading there.
              loading={
                phone.centre ? undefined : phone.desktopOnly ? "lazy" : "eager"
              }
              sizes={
                phone.centre
                  ? "(min-width: 768px) 290px, 44vw"
                  : "(min-width: 768px) 230px, 34vw"
              }
              className="h-auto w-full drop-shadow-xl"
            />
          </div>
        ))}
      </div>

      <p className="order-3 mb-7 max-w-[46ch] text-lg leading-relaxed text-black/80 md:order-2 lg:text-xl">
        The free CONKA app measures how sharp you are. Take a quick baseline,
        start CONKA, and watch your score move.
      </p>

      <AppInstallButtons
        variant="dtc"
        trackLocation="hero"
        buttonClassName="min-h-[44px]"
        className="order-4 justify-center md:order-3"
      />
    </div>
  );
}
