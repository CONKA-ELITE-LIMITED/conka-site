import type { Metadata } from "next";
import Image from "next/image";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";
import NikeTrialNav from "./NikeTrialNav";
import TrialCalendar from "./TrialCalendar";

export const metadata: Metadata = {
  title: "For the Nike Team | CONKA",
  description:
    "Your CONKA cognition trial. Three quick things to set up before we meet, and what the two weeks look like.",
  // Private onboarding page for the Nike trial. Not for search: the noindex meta
  // tag is the mechanism (the page is deliberately left out of sitemap.ts and is
  // NOT disallowed in robots.ts, so crawlers can still see and honour this tag).
  robots: { index: false, follow: false },
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

const TargetIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </svg>
);
const SunIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} aria-hidden>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
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
const CheckIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
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
    title: "Your personal results",
    body: "A clear picture of how your cognition moved across the two weeks. Yours to keep.",
  },
  {
    Icon: GiftIcon,
    title: "Rewards for consistency",
    body: "Show up across the fortnight and you're in for rewards, including a prize draw.",
  },
  {
    Icon: CheckIcon,
    title: "Everyone finishes with something",
    body: "Whatever your scores decide to do, nobody leaves empty-handed.",
  },
];

const asks = [
  {
    n: 1,
    title: "Download the app and create an account",
    body: "This is where your daily test lives and where your results build up. Search “CONKA” if the buttons don’t open.",
    app: true,
  },
  {
    n: 2,
    title: "Allow notifications when the app asks",
    body: "This is how you get your daily test reminder at the time you choose. Without it, it’s easy to lose a day, and the days are what make your results.",
    app: false,
  },
  {
    n: 3,
    title: "Do one practice test at home",
    body: "It won’t count toward anything. It just means your first real test on the day reflects you, not the five seconds it takes to learn the buttons.",
    app: false,
  },
];

const cardClass = "rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7";

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
        <Image
          src="/conka-logo.webp"
          alt="CONKA"
          width={440}
          height={112}
          className="h-6 w-auto brightness-0 invert sm:h-7"
          priority
        />
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/45">
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
          <h1 className="mt-4 text-[30px] font-bold leading-[1.12] sm:text-[44px]">
            You&rsquo;re about to spend two weeks measuring your own mind.
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
            You&rsquo;re on a two-week CONKA trial with the Nike team. Two daily
            shots, one quick test in the app, and you get to watch your own
            cognition change. Everything to get started is on this page.
          </p>

          <div className="mt-7">
            <AppInstallButtons variant="dtc-dark" />
            <p className="mt-3 text-[13px] text-white/45">Free to download.</p>
          </div>

          {/* Kickoff card */}
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f9fe8]">
              Kickoff
            </p>
            <p className="mt-3 text-[22px] font-bold sm:text-[26px]">
              Thursday 6 August
            </p>
            <p className="mt-1 text-[15px] text-white/70">
              About 20 minutes, in person.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-white/10 pt-4 text-[15px]">
              <span className="text-white/50">
                Time{" "}
                <span className="font-medium text-white/85">{SESSION_TIME}</span>
              </span>
              <span className="text-white/50">
                Where{" "}
                <span className="font-medium text-white/85">
                  {SESSION_LOCATION}
                </span>
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
            First, what this is
          </h2>
          <p className="mt-3 max-w-[580px] text-[16px] leading-relaxed text-white/65">
            CONKA is a cognitive-performance company. We make a daily brain shot,
            and an app that measures whether it&rsquo;s working. For the next two
            weeks, you&rsquo;re testing both on yourself.
          </p>

          <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2">
            {/* The shots */}
            <div className={cardClass}>
              <div className="overflow-hidden rounded-2xl bg-white">
                <Image
                  src="/formulas/both/BothNew.jpg"
                  alt="The two CONKA shots, flow and clear, side by side"
                  width={875}
                  height={875}
                  className="h-auto w-full"
                  sizes="(max-width: 640px) 90vw, 360px"
                />
              </div>
              <h3 className="mt-5 text-[19px] font-semibold">The shots</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/65">
                Two a day. They&rsquo;re the thing we&rsquo;re testing.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <SunIcon className="h-4 w-4 text-[#f0b24b]" /> Morning: flow
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MoonIcon className="h-4 w-4 text-[#8f9fe8]" /> Afternoon: clear
                </span>
              </div>
            </div>

            {/* The test */}
            <div className={cardClass}>
              <div className="flex justify-center rounded-2xl bg-white/[0.02] py-4">
                <Image
                  src="/app/AppConkaRing.png"
                  alt="The CONKA app showing a daily cognition score and a history of tested days"
                  width={1455}
                  height={2942}
                  className="h-auto max-h-[300px] w-auto"
                  sizes="(max-width: 640px) 55vw, 220px"
                />
              </div>
              <h3 className="mt-5 text-[19px] font-semibold">The test</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/65">
                A two-minute test in the app scores how your mind is performing.
                Take it once a day and it becomes a trend that&rsquo;s yours.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <TargetIcon className="h-4 w-4 text-[#8f9fe8]" /> One a day, in a
                  window you pick
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SETUP — the three asks */}
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
          <p className="mt-3 text-[16px] text-white/60">
            About five minutes, all on your phone.
          </p>

          <div className="mt-8 space-y-4">
            {asks.map((ask) => (
              <div key={ask.n} className={cardClass}>
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6478e0] text-[17px] font-bold text-white">
                    {ask.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[18px] font-semibold leading-snug sm:text-[20px]">
                      {ask.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-white/65">
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
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp */}
          <div className="mt-6 rounded-3xl border border-[#1a7f4f]/30 bg-[#1a7f4f]/[0.08] p-6">
            <h3 className="text-[18px] font-semibold sm:text-[20px]">
              Join the WhatsApp group
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/65">
              One daily nudge so a day never slips, and somewhere to ask us
              anything across the trial.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] px-6 text-[14px] font-semibold text-[#0a1a10] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              <WhatsAppIcon />
              Join the group
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FORTNIGHT — calendar */}
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
            What the two weeks look like
          </h2>
          <p className="mt-3 text-[16px] text-white/60">
            A few tests to find your baseline, then a trend that&rsquo;s yours.
          </p>

          <div className="mt-8">
            <TrialCalendar />
          </div>

          <p className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-[17px] font-medium leading-relaxed text-white/85 sm:text-[19px]">
            The story only appears if you show up for it. Two weeks is exactly
            long enough to watch it move.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* REWARDS — what you get */}
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
            What you walk away with
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {rewards.map((reward) => {
              const Icon = reward.Icon;
              return (
                <div key={reward.title} className={cardClass}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a7f4f]/15 text-[#4ade80]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[18px] font-semibold">
                    {reward.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">
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
        <div className="brand-track max-w-[760px]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
            <h2 className="text-[24px] font-bold leading-tight sm:text-[32px]">
              Bring your phone charged. That&rsquo;s it.
            </h2>
            <p className="mt-3 text-[16px] text-white/60">See you Thursday.</p>
            <div className="mt-7 flex justify-center">
              <AppInstallButtons variant="dtc-dark" />
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1280px] px-5 pb-10 pt-4 md:px-[5vw]">
        <p className="text-[12px] text-white/35">
          CONKA &middot; for the Nike team
        </p>
      </footer>
    </div>
  );
}
