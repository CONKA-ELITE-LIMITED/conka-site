import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";
import NikeTrialNav from "./NikeTrialNav";
import ShotsShowcase from "./ShotsShowcase";
import TestWindow from "./TestWindow";
import TrialCalendar from "./TrialCalendar";

export const metadata: Metadata = {
  title: "For the Nike Team | CONKA",
  description:
    "Your CONKA cognition trial. Three quick things to set up before we meet, and what the two weeks look like.",
  // Private onboarding page for the Nike trial. Not for search: the noindex meta
  // tag is the mechanism (the page is deliberately left out of sitemap.ts and is
  // NOT disallowed in robots.ts, so crawlers can still see and honour this tag).
  robots: { index: false, follow: false },
  // The link is forwarded person-to-person, so the message unfurl matters.
  // Reuses the existing site OG image (no new asset).
  openGraph: {
    title: "For the Nike Team | CONKA",
    description:
      "Your two-week CONKA cognition trial. Everything to set up before we meet, and what the fortnight looks like.",
    images: ["/opengraph-image.png"],
  },
};

/* -------------------------------------------------------------------------- */
/*  Fill-in slots. Update these before sharing the link with the Nike team.   */
/* -------------------------------------------------------------------------- */

// TODO: kickoff time, e.g. "10:00am"
const SESSION_TIME = "[ add time ]";
// TODO: kickoff location, e.g. "Nike London, 3rd floor studio"
const SESSION_LOCATION = "[ add location ]";
// TODO: replace with the real WhatsApp group invite link (https://chat.whatsapp.com/...)
const WHATSAPP_URL = "https://chat.whatsapp.com/REPLACE_WITH_INVITE_CODE";

/* -------------------------------------------------------------------------- */
/*  Small inline icons (no new assets). Stroke = currentColor.                */
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string };
const iconBase = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TrendIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} aria-hidden>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M17 7h4v4" />
  </svg>
);
const GiftIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} aria-hidden>
    <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7S11 3 8.5 3 6 6 8 7M12 7s1-4 3.5-4S18 6 16 7" />
  </svg>
);
const WhatsAppIcon = ({ className }: IconProps) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24zm-4.6 4.4c-.15 0-.4.06-.6.28-.2.22-.79.77-.79 1.88s.81 2.18.92 2.33c.11.15 1.57 2.4 3.8 3.36.53.23.94.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.31-.53 1.5-1.05.18-.52.18-.96.13-1.05-.05-.09-.2-.15-.42-.26-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.77-1.09-.65-.58-1.09-1.3-1.22-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.21-.68-1.65-.18-.43-.36-.37-.5-.38l-.42-.01z" />
  </svg>
);

/* -------------------------------------------------------------------------- */

const rewards = [
  {
    Icon: TrendIcon,
    title: "Your results",
    body: "You see how your scores moved from your baseline across the two weeks.",
  },
  {
    Icon: GiftIcon,
    title: "A prize draw",
    body: "Consistent testers go into a prize draw, with smaller rewards along the way.",
  },
];

const asks = [
  {
    n: 1,
    title: "Download the app and create your account",
    body: "Search “CONKA” if the buttons don’t open.",
    app: true,
  },
  {
    n: 2,
    title: "Turn on notifications",
    body: "It’s how we remind you to test each day.",
    app: false,
  },
  {
    n: 3,
    title: "Complete one test",
    body: "This will be your practice test, so don’t worry about your score.",
    app: false,
  },
];

const moreLinks = [
  { href: "/our-story", label: "Our story" },
  { href: "/science", label: "The science" },
  { href: "/app", label: "The app" },
  { href: "/", label: "conka.io" },
];

const learnLink =
  "underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white";

export default function NikeTrialPage() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect x='11' y='11' width='2' height='2' fill='rgba(255%2C255%2C255%2C0.14)'/%3E%3C/svg%3E\")",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Minimal header — deliberately no site nav/cart, this is a focused page */}
      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-[5vw]">
        <Link href="/" aria-label="CONKA home" className="inline-flex">
          <Image
            src="/conka-logo.webp"
            alt="CONKA"
            width={440}
            height={112}
            className="h-6 w-auto brightness-0 invert sm:h-7"
            priority
          />
        </Link>
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/70">
          For the Nike team
        </span>
      </header>

      <NikeTrialNav />

      {/* ---------------------------------------------------------------- */}
      {/* HERO */}
      {/* ---------------------------------------------------------------- */}
      <section className="brand-section" aria-label="Welcome">
        <div className="brand-track max-w-[720px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#8f9fe8]">
            Welcome
          </p>
          <h1 className="mt-4 text-[32px] font-bold leading-[1.08] sm:text-[46px]">
            You&rsquo;re about to spend two weeks measuring your own mind.
          </h1>
          <p className="mt-6 text-[16px] leading-relaxed text-white sm:text-[18px]">
            The best performers don&rsquo;t guess whether they&rsquo;re getting
            sharper. They measure it. For the next two weeks you&rsquo;ll do the
            same with your focus: two CONKA shots a day, a two-minute test in the
            app, and a straight read on how you&rsquo;re actually performing.
          </p>

          <div className="mt-8">
            <AppInstallButtons variant="dtc-dark" />
            <p className="mt-3 text-[13px] text-white/70">Free to download.</p>
          </div>

          {/* Kickoff — open info block, not a tile */}
          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f9fe8]">
              Kickoff
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-[22px] font-bold sm:text-[26px]">
                Thursday 6 August
              </span>
              <span className="text-[15px] text-white/80">
                About 20 minutes, in person
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[15px]">
              <span className="text-white/70">
                Time{" "}
                <span className="font-medium text-white">{SESSION_TIME}</span>
              </span>
              <span className="text-white/70">
                Where{" "}
                <span className="font-medium text-white">{SESSION_LOCATION}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* ABOUT — cold-start orientation: what CONKA is */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="brand-section scroll-mt-20"
      >
        <div className="brand-track max-w-[760px]">
          <h2 id="about-heading" className="text-[26px] font-bold sm:text-[34px]">
            This is CONKA
          </h2>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-white">
            A daily brain shot, and an app that measures how your brain is
            performing. Over the next two weeks, you&rsquo;ll test both on
            yourself.
          </p>

          {/* The shots — Flow/Clear toggle, bottle asset and the shared
              ingredient bottom sheet, composed natively on the dark canvas. */}
          <div className="mt-8">
            <ShotsShowcase />
          </div>

          {/* The test */}
          <div className="mt-12 sm:flex sm:items-center sm:gap-8">
            <div className="flex justify-center rounded-2xl bg-white/[0.03] py-5 sm:w-[240px] sm:shrink-0">
              <Image
                src="/app/AppConkaRing.png"
                alt="The CONKA app showing a daily cognition score and a history of tested days"
                width={1455}
                height={2942}
                className="h-auto max-h-[320px] w-auto"
                sizes="(max-width: 640px) 55vw, 240px"
              />
            </div>
            <div className="mt-5 sm:mt-0">
              <h3 className="text-[20px] font-semibold">The test</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white">
                Two minutes in the app scores how sharp you are. Take it daily and
                it becomes a trend, so you can see the shots working on your own
                numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SETUP — the three asks (open list, not tiles) */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="setup"
        aria-labelledby="setup-heading"
        className="brand-section scroll-mt-20"
      >
        <div className="brand-track max-w-[760px]">
          <h2 id="setup-heading" className="text-[26px] font-bold sm:text-[34px]">
            Three things before Thursday
          </h2>

          <ol className="mt-6 border-t border-white/10">
            {asks.map((ask) => (
              <li
                key={ask.n}
                className="flex gap-4 border-b border-white/10 py-7 sm:gap-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6478e0] text-[16px] font-bold text-white">
                  {ask.n}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[18px] font-semibold leading-snug sm:text-[20px]">
                    {ask.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/85">
                    {ask.body}
                  </p>
                  {ask.app && (
                    <AppInstallButtons
                      variant="dtc-dark"
                      className="mt-5"
                      buttonClassName="text-[13px] px-5 py-3"
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>

          {/* WhatsApp — open row, not a tile */}
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-[18px] font-semibold sm:text-[20px]">
                Join the WhatsApp group
              </h3>
              <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-white/85">
                A daily nudge, and a direct line to us during the trial.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] shrink-0 items-center gap-2 self-start rounded-full bg-[#25D366] px-6 text-[14px] font-semibold text-[#0a1a10] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              <WhatsAppIcon />
              Join the group
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FORTNIGHT — plan + calendar + window */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="fortnight"
        aria-labelledby="fortnight-heading"
        className="brand-section scroll-mt-20"
      >
        <div className="brand-track max-w-[760px]">
          <h2
            id="fortnight-heading"
            className="text-[26px] font-bold sm:text-[34px]"
          >
            Your two weeks
          </h2>
          <p className="mt-3 text-[16px] text-white">
            Three days to set your baseline, then the two-week trial.
          </p>

          <div className="mt-8">
            <TrialCalendar />
          </div>

          {/* Window picker */}
          <div className="mt-10">
            <h3 className="text-[20px] font-semibold">
              Pick a window that suits you
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white">
              Choose one two-hour window between 8am and 8pm. We&rsquo;ll remind
              you when it opens, so testing lands at a similar time each day.
            </p>
            <TestWindow />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* REWARDS — what happens at the end (open columns) */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="rewards"
        aria-labelledby="rewards-heading"
        className="brand-section scroll-mt-20"
      >
        <div className="brand-track max-w-[760px]">
          <h2
            id="rewards-heading"
            className="text-[26px] font-bold sm:text-[34px]"
          >
            When the two weeks are up
          </h2>

          <div className="mt-10 grid gap-9 sm:max-w-[520px] sm:grid-cols-2">
            {rewards.map((reward) => {
              const Icon = reward.Icon;
              return (
                <div
                  key={reward.title}
                  className="flex flex-col items-center text-center"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a7f4f]/15 text-[#4ade80]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[18px] font-semibold">
                    {reward.title}
                  </h3>
                  <p className="mt-2 max-w-[280px] text-[15px] leading-relaxed text-white/85">
                    {reward.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CLOSE */}
      {/* ---------------------------------------------------------------- */}
      <section className="brand-section" aria-label="See you Thursday">
        <div className="brand-track max-w-[720px] text-center">
          <h2 className="text-[26px] font-bold leading-tight sm:text-[36px]">
            Two weeks. Let&rsquo;s see what you&rsquo;ve got.
          </h2>
          <p className="mt-4 text-[16px] text-white/80">See you Thursday.</p>
          <div className="mt-8 flex justify-center">
            <AppInstallButtons variant="dtc-dark" />
          </div>
        </div>
      </section>

      {/* Learn more — progressive disclosure for the curious */}
      <section className="brand-section" aria-label="More about CONKA">
        <div className="brand-track max-w-[760px]">
          <div className="border-t border-white/10 pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              More about CONKA
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
              {moreLinks.map((link) => (
                <Link key={link.href} href={link.href} className={learnLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1280px] px-5 pb-10 pt-2 md:px-[5vw]">
        <p className="text-[12px] text-white/60">
          CONKA &middot; for the Nike team
        </p>
      </footer>
    </div>
  );
}
