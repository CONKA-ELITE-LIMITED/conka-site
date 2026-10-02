import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";

/* ============================================================================
 * AppV2Trust (SCRUM-1361, Simple DTC)
 *
 * "Simple to learn. Impossible to cheat.": the credibility beat, headlined as
 * the objection it answers (can't you just get good at the game?), in the app
 * store's own line. Deliberately after the loop and the live test, so the
 * page invites before it lectures.
 *
 * It answers the why before it shows the data: one trial as a filmstrip built
 * from the test's own image and mask (an image for a fraction of a second, a
 * noise mask, your tap; exact timings stay off the page), then four reasons
 * from the app's ungameable list (conkaApp
 * docs/app/features/cognitive-testing/cognica-game.md). The research stats,
 * Humphrey's origin and the /app-insights link follow as the supporting
 * proof. The reasons are a +/- accordion at every size, one open at a time
 * with the first open, so the section stays short.
 *
 * Stats and reason surfaces are white because the page gives this section the
 * tint background. Content-only; the page owns the section.
 * ========================================================================== */

const LEARNING_STUDY_HREF = "https://www.nature.com/articles/s41598-018-37709-x";

const TRIAL = [
  { label: "Image flashes", kind: "image" as const },
  { label: "Noise mask", kind: "mask" as const },
  { label: "You tap", kind: "tap" as const },
];

const REASONS: {
  title: string;
  body: string;
  source?: { text: string; href: string };
}[] = [
  {
    title: "Too fast to game",
    body: "Each image shows for a fraction of a second, then a pattern wipes it. Your brain answers before you can strategise.",
  },
  {
    title: "Nothing to memorise",
    body: "The images change, so there are no answers to learn. A peer-reviewed study found no significant learning effect over repeat tests.",
    source: { text: "Scientific Reports, 2019", href: LEARNING_STUDY_HREF },
  },
  {
    title: "No reading or maths",
    body: "No reading, maths or general knowledge. Language, education and culture give no one a head start.",
  },
  {
    title: "Hard-wired, not learned",
    body: "Spotting animals is one of the brain\u2019s oldest reflexes. The task lights up 32 brain regions, so your score is your whole brain at work.",
  },
];

const STATS: {
  value: string;
  label: string;
  source?: { text: string; href: string };
}[] = [
  {
    value: "93%",
    label: "Sensitivity detecting cognitive impairment",
    source: {
      text: "ADePT study",
      href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10533908/",
    },
  },
  {
    value: "87.5%",
    label: "Test-retest reliability",
    source: {
      text: "ADePT study",
      href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10533908/",
    },
  },
  {
    value: "14",
    label: "NHS Trusts in clinical validation trials",
    source: {
      text: "ISRCTN95636074",
      href: "https://www.isrctn.com/ISRCTN95636074",
    },
  },
  {
    value: "FDA",
    label: "510(k) cleared test technology",
  },
];

function ReasonBody({ reason }: { reason: (typeof REASONS)[number] }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-black/75">{reason.body}</p>
      {reason.source && (
        <a
          href={reason.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-black/50 underline underline-offset-2 hover:text-black"
        >
          {reason.source.text}
        </a>
      )}
    </>
  );
}

export default function AppV2Trust() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-16">
        <div>
          <h2
            className="brand-h1 mb-4 text-black"
            style={{ letterSpacing: "-0.02em" }}
          >
            Simple to learn.
            <br />
            <span className="text-[var(--brand-accent)]">
              Impossible to cheat.
            </span>
          </h2>
          <p className="mb-8 max-w-[44ch] text-lg leading-relaxed text-black/80">
            Your score is how quickly and accurately your brain processes what
            it sees. There is nothing to study for, and nothing to practise.
          </p>

          {/* One trial, start to finish. Built from the test's own image and
              mask, so it shows exactly what the visitor will see. */}
          <figure>
            <ol className="grid grid-cols-3 gap-6">
              {TRIAL.map((frame, i) => (
                <li key={frame.label}>
                  <div className="relative">
                    {i > 0 && (
                      <span
                        className="absolute -left-[1.15rem] top-1/2 -translate-y-1/2 text-base font-semibold text-black/30"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    )}
                    <div className="aspect-square overflow-hidden rounded-lg bg-white p-1.5 app-tile-shadow-sm">
                      {frame.kind === "tap" ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-md bg-[var(--brand-navy)] p-2">
                          <span className="w-full rounded-full bg-white/15 py-1 text-center text-[clamp(0.65rem,2.6vw,0.8rem)] font-semibold text-white">
                            &larr; Not
                          </span>
                          <span className="w-full rounded-full bg-white py-1 text-center text-[clamp(0.65rem,2.6vw,0.8rem)] font-semibold text-[var(--brand-navy)]">
                            Animal &rarr;
                          </span>
                        </div>
                      ) : (
                        <Image
                          src={
                            frame.kind === "image"
                              ? "/cognica/test/th5.jpg"
                              : "/cognica/masks/21.png"
                          }
                          alt={
                            frame.kind === "image"
                              ? "A test image of a cat"
                              : "The noise pattern that wipes each image"
                          }
                          width={256}
                          height={256}
                          loading="lazy"
                          sizes="(min-width: 1024px) 150px, 26vw"
                          className="h-full w-full rounded-md object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs font-semibold text-black/70 sm:text-sm">
                    {frame.label}
                  </p>
                </li>
              ))}
            </ol>
            <figcaption className="mt-3 text-sm text-black/60">
              One trial. The test runs dozens of them in about 90 seconds.
            </figcaption>
          </figure>
        </div>

        {/* One accordion at every size: native details sharing a name, so
            opening one closes the others. The first starts open. */}
        <ul className="flex flex-col gap-2 lg:self-center">
          {REASONS.map((reason, i) => (
            <li key={reason.title}>
              <details
                name="app-trust-reasons"
                open={i === 0}
                className="group rounded-md bg-white text-black"
              >
                <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 lg:px-5 lg:py-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-bold leading-tight text-[var(--brand-navy)] lg:text-lg">
                    {reason.title}
                  </h3>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef0f5] text-lg font-semibold leading-none text-[var(--brand-navy)] transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-4 pb-4 lg:px-5 lg:pb-5">
                  <ReasonBody reason={reason} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-4">
        {STATS.map((stat) => (
          // dt must precede dd in the markup; column-reverse puts the number
          // on top visually.
          <div
            key={stat.label}
            className="flex flex-col-reverse justify-end rounded-md bg-white p-4 text-black lg:p-5"
          >
            <dt className="mt-2 text-sm leading-snug text-black/75">
              {stat.label}
              {stat.source && (
                <a
                  href={stat.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-xs text-black/50 underline underline-offset-2 hover:text-black"
                >
                  {stat.source.text}
                </a>
              )}
            </dt>
            <dd className="text-3xl font-bold leading-none tabular-nums text-[var(--brand-navy)] lg:text-4xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <p className="max-w-[70ch] text-base leading-relaxed text-black/70">
          Built on Cambridge research and validated in NHS clinical trials.
          CONKA co-founder Humphrey Bodington built it after repeated
          concussions ended his playing career, so anyone could see their
          brain measured.{" "}
          <span className="font-semibold tabular-nums text-black">
            {APP_INSIGHTS_TOTALS.tests.toLocaleString("en-GB")} tests
          </span>{" "}
          from {APP_INSIGHTS_TOTALS.users} people so far.
        </p>
        <ConkaCTAButton href="/app-insights" inverted>
          See the app data
        </ConkaCTAButton>
      </div>
    </div>
  );
}
