import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";

/* ============================================================================
 * AppV2Trust (SCRUM-1361, Simple DTC)
 *
 * "A score you can trust": the credibility beat, deliberately after the loop
 * and the live test rather than before them, so the page invites before it
 * lectures. It carries the research stats, Humphrey's origin (now one line)
 * and the /app-insights link, which used to be three separate sections.
 *
 * Stats sit in white tiles because the page gives this section the tint
 * background. Mobile order is heading, stats, then copy and button; desktop
 * puts the stats in their own column spanning both rows (the ScienceHero grid). Content-only; the page owns the section.
 * ========================================================================== */

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

export default function AppV2Trust() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
      <h2
        className="brand-h1 text-black lg:col-start-1 lg:row-start-1 lg:mb-4 lg:self-end"
        style={{ letterSpacing: "-0.02em" }}
      >
        A score you can trust.
      </h2>

      <dl className="grid grid-cols-2 gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
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

      <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
        <p className="mb-4 text-lg leading-relaxed text-black/80">
          The test in the CONKA app comes from Cambridge research and has been
          validated in NHS clinical trials. It measures how quickly and
          accurately your brain processes what it sees, so your score reflects
          you, not how much you have practised.
        </p>
        <p className="mb-6 text-base leading-relaxed text-black/70">
          CONKA co-founder Humphrey Bodington built it after repeated
          concussions ended his playing career, so anyone could see their brain
          measured.
        </p>
        <p className="mb-5 text-base text-black/70">
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
