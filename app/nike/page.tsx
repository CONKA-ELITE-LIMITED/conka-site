import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";
import { SunHorizonIcon } from "@/app/components/landing/icons";
import NikeTrialNav from "./NikeTrialNav";
import ShotsShowcase from "./ShotsShowcase";
import TestWindow from "./TestWindow";
import TrialCalendar from "./TrialCalendar";

export const metadata: Metadata = {
  title: "For the Nike Team | CONKA",
  description:
    "Your CONKA cognition trial. Three quick things to set up before we meet, and how your 14 days work.",
  // Private onboarding page for the Nike trial. Not for search: the noindex meta
  // tag is the mechanism (the page is deliberately left out of sitemap.ts and is
  // NOT disallowed in robots.ts, so crawlers can still see and honour this tag).
  robots: { index: false, follow: false },
  // The link is forwarded person-to-person, so the message unfurl matters.
  // Reuses the existing site OG image (no new asset).
  openGraph: {
    title: "For the Nike Team | CONKA",
    description:
      "Your 14-day CONKA cognition trial. Everything to set up before we meet, and how the trial works.",
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
    body: "You see how your scores moved from your baseline across the 14 days.",
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

type RhythmStep = {
  label: string;
  title: string;
  img?: string;
  alt?: string;
  Icon?: ComponentType<{ className?: string }>;
};

const dailyRhythm: RhythmStep[] = [
  {
    img: "/formulas/conkaFlow/FlowNew.jpg",
    alt: "CONKA Flow",
    label: "Morning",
    title: "CONKA Flow",
  },
  {
    img: "/formulas/conkaClear/ClearNew.jpg",
    alt: "CONKA Clear",
    label: "Afternoon",
    title: "CONKA Clear",
  },
  { Icon: SunHorizonIcon, label: "In your window", title: "One 2-min test" },
];

const faqs = [
  {
    q: "What’s the difference between Flow and Clear?",
    a: "Flow (black cap) is for mornings: adaptogens like Ashwagandha and Lemon Balm for calm, caffeine-free focus. Clear (white cap) is for afternoons: nootropics like Alpha GPC and Glutathione, plus Vitamin C.",
  },
  {
    q: "Can I take both formulas at the same time?",
    a: "They’re built for different points in the day, Flow in the morning and Clear in the afternoon, so space them out rather than taking them together. That’s how the trial is set up and how you’ll get the cleanest read.",
  },
  {
    q: "Do I need to test at the same time every day?",
    a: "No. But we’ve found a regular testing window makes it much easier to stay consistent and on track, which is exactly what the data needs.",
  },
  {
    q: "Is the cognitive test an IQ test?",
    a: "No. It’s a two-minute cognitive assessment, an FDA-cleared task used in clinical settings, that measures things like processing speed and attention. It tracks how your own performance changes over time against your baseline, rather than scoring your intelligence or ranking you against anyone else. A bad night’s sleep or a stressful week will show up in it, which is exactly the point.",
  },
  {
    q: "Can I take CONKA with caffeine?",
    a: "Yes. CONKA is caffeine-free, so it works alongside your morning coffee with no interaction to worry about. Most people find they reach for fewer cups over time, but nothing about CONKA requires you to give up coffee.",
  },
  {
    q: "Will it affect my sleep?",
    a: "It shouldn’t, because there’s no caffeine or stimulant in either formula. That’s the practical difference between CONKA and most “focus” products, and it’s exactly why Clear is built for the afternoon slot.",
  },
  {
    q: "Can I take CONKA with medication or other supplements?",
    a: "Most everyday supplements are fine. For medication, check with your GP or pharmacist first, because it depends on the medication. Some botanicals can interact with specific drug groups: Ginkgo Biloba with blood-thinning medication, Ashwagandha with thyroid medication and sedatives, and Rhodiola with antidepressants. If you take anything in those groups, run the ingredient list past your pharmacist before you start.",
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
        <div className="brand-track mx-auto max-w-[720px] lg:text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#8f9fe8]">
            Cognition trial &middot; 2 weeks
          </p>
          <h1 className="mx-auto mt-4 max-w-[20ch] text-[32px] font-bold leading-[1.08] sm:text-[46px]">
            Welcome to the Nike Mind Trial.
          </h1>
          <p className="mx-auto mt-6 max-w-[58ch] text-[16px] leading-relaxed text-white sm:text-[18px]">
            You&rsquo;re about to spend 2 weeks measuring your own mind. The best
            performers don&rsquo;t guess whether they&rsquo;re getting sharper,
            they measure it. For the next 14 days you&rsquo;ll do the same with
            your focus: two CONKA shots a day, a two-minute test in the app, and a
            straight read on how you&rsquo;re actually performing.
          </p>

          <div className="mt-8">
            <AppInstallButtons variant="dtc-dark" className="lg:justify-center" />
            <p className="mt-3 text-[13px] text-white/70">Free to download.</p>
          </div>

          {/* Kickoff — open info block, not a tile */}
          <div className="mx-auto mt-10 max-w-[440px] border-t border-white/10 pt-6 lg:max-w-none">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f9fe8]">
              Kickoff
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:justify-center">
              <span className="text-[22px] font-bold sm:text-[26px]">
                Thursday 6 August
              </span>
              <span className="text-[15px] text-white/80">
                About 20 minutes, in person
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[15px] lg:justify-center">
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
        <div className="brand-track mx-auto max-w-[760px]">
          <h2
            id="about-heading"
            className="text-[26px] font-bold sm:text-[34px] lg:text-center"
          >
            This is CONKA
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-relaxed text-white lg:text-center">
            A daily brain shot, and an app that measures how your brain is
            performing. Over the next 14 days, you&rsquo;ll test both on yourself.
          </p>

          {/* The shots — Flow/Clear toggle, bottle asset and the shared
              ingredient bottom sheet, composed natively on the dark canvas. */}
          <div className="mt-10">
            <ShotsShowcase />
          </div>

          {/* The test — asset centred, copy stacked below */}
          <div className="mt-14 lg:text-center">
            <div className="mx-auto flex w-[220px] justify-center rounded-2xl bg-white/[0.03] py-5">
              <Image
                src="/app/AppConkaRing.png"
                alt="The CONKA app showing a daily cognition score and a history of tested days"
                width={1455}
                height={2942}
                className="h-auto max-h-[320px] w-auto"
                sizes="220px"
              />
            </div>
            <div className="mx-auto mt-6 max-w-[520px]">
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
        <div className="brand-track mx-auto max-w-[760px]">
          <h2
            id="setup-heading"
            className="text-[26px] font-bold sm:text-[34px] lg:text-center"
          >
            Three things before Thursday
          </h2>

          <ol className="mx-auto mt-6 max-w-[600px] border-t border-white/10">
            {asks.map((ask) => (
              <li key={ask.n} className="border-b border-white/10 py-7">
                <div className="flex gap-4 sm:gap-5">
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
                  </div>
                </div>
                {ask.app && (
                  <AppInstallButtons
                    variant="dtc-dark"
                    className="mt-5"
                    buttonClassName="text-[13px] px-5 py-3"
                  />
                )}
              </li>
            ))}
          </ol>

          {/* WhatsApp — open row, not a tile */}
          <div className="mx-auto mt-10 flex max-w-[600px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="brand-track mx-auto max-w-[760px]">
          <h2
            id="fortnight-heading"
            className="text-[26px] font-bold sm:text-[34px] lg:text-center"
          >
            How your 14 days work
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[16px] text-white lg:text-center">
            The same routine every day, for 14 days. Three days to set your
            baseline, then keep it going.
          </p>

          {/* Daily rhythm */}
          <div className="mt-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8f9fe8] lg:text-center">
              Every day
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-3">
              {dailyRhythm.map((step) => {
                const Icon = step.Icon;
                return (
                  <div key={step.title} className="text-center">
                    {step.img ? (
                      <div className="mx-auto h-24 w-24 overflow-hidden rounded-2xl bg-[#eef1f8]">
                        <Image
                          src={step.img}
                          alt={step.alt ?? ""}
                          width={192}
                          height={192}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      Icon && (
                        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white/[0.05] text-[#8f9fe8]">
                          <Icon className="h-8 w-8" />
                        </span>
                      )
                    )}
                    <p className="mt-3 text-[12px] uppercase tracking-wide text-white">
                      {step.label}
                    </p>
                    <p className="mt-1 text-[16px] font-semibold">{step.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Window picker */}
          <div className="mt-14 lg:text-center">
            <h3 className="text-[20px] font-semibold">
              Pick a window that suits you
            </h3>
            <p className="mx-auto mt-2 max-w-[520px] text-[15px] leading-relaxed text-white">
              Choose one two-hour window between 8am and 8pm. We&rsquo;ll remind
              you when it opens, so testing lands at a similar time each day.
            </p>
            <div className="mx-auto mt-1 max-w-[520px]">
              <TestWindow />
            </div>
          </div>

          {/* The 14-day map */}
          <div className="mt-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8f9fe8] lg:text-center">
              The 14 days
            </p>
            <div className="mx-auto mt-5 max-w-[560px]">
              <TrialCalendar />
            </div>
          </div>

          {/* The one requirement — 10 / 14 */}
          <div className="mt-14 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8f9fe8]">
              The one requirement
            </p>
            <p className="mt-3 text-[56px] font-bold leading-none tabular-nums sm:text-[64px]">
              10<span className="text-white/40">/14</span>
            </p>
            <p className="mt-2 text-[15px] font-medium text-white">
              test days, minimum
            </p>
            <div className="mx-auto mt-5 flex max-w-[300px] flex-wrap justify-center gap-1.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${
                    i < 10 ? "bg-[#6478e0]" : "border border-white/25"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
            <p className="mx-auto mt-5 max-w-[460px] text-[14px] leading-relaxed text-white/80">
              Ideally you test every day, but we know how life goes. The real ask
              is 10 test days across your 14, that&rsquo;s enough to see your true
              trend. Miss one? No stress, just pick it back up.
            </p>
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
        <div className="brand-track mx-auto max-w-[760px]">
          <h2
            id="rewards-heading"
            className="text-[26px] font-bold sm:text-[34px] lg:text-center"
          >
            When the 14 days are up
          </h2>

          <div className="mx-auto mt-10 grid gap-9 sm:max-w-[520px] sm:grid-cols-2">
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
      {/* FAQ */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="brand-section scroll-mt-20"
      >
        <div className="brand-track mx-auto max-w-[760px]">
          <h2
            id="faq-heading"
            className="text-[26px] font-bold sm:text-[34px] lg:text-center"
          >
            Questions
          </h2>
          <div className="mx-auto mt-8 max-w-[640px] border-t border-white/10">
            {faqs.map((f) => (
              <details
                key={f.q}
                name="nike-faq"
                className="group border-b border-white/10"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-[22px] font-normal leading-none text-[#8f9fe8] transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[600px] pb-5 text-[15px] leading-relaxed text-white/80">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-[14px] text-white/70 lg:text-center">
            More at{" "}
            <Link href="/faq" className={learnLink}>
              our full FAQ
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CLOSE */}
      {/* ---------------------------------------------------------------- */}
      <section className="brand-section" aria-label="See you Thursday">
        <div className="brand-track mx-auto max-w-[720px] text-center">
          <h2 className="text-[26px] font-bold leading-tight sm:text-[36px]">
            14 days. Let&rsquo;s see what you&rsquo;ve got.
          </h2>
          <p className="mt-4 text-[16px] text-white/80">See you Thursday.</p>
          <div className="mt-8 flex justify-center">
            <AppInstallButtons variant="dtc-dark" />
          </div>
        </div>
      </section>

      {/* Learn more — progressive disclosure for the curious */}
      <section className="brand-section" aria-label="More about CONKA">
        <div className="brand-track mx-auto max-w-[760px]">
          <div className="border-t border-white/10 pt-6 lg:text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              More about CONKA
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[15px] lg:justify-center">
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
