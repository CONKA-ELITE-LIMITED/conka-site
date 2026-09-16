import Image from "next/image";
import Link from "next/link";
import { SCIENCE_MEASURE } from "@/app/lib/scienceContent";
import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";
import { TrustIconBatchTested } from "@/app/components/landing/icons";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

/* ============================================================================
 * ScienceMeasure (SCRUM-1352, Simple DTC)
 *
 * Row 5 of the home "why" accordion, framed forward: the research does not end
 * at the trials, and every app test adds to it. Takes the place of
 * AppInsightsCallout on /science only.
 *
 * Mobile order is heading, phone graphic, then copy and CTAs. Desktop puts the
 * graphic in its own column spanning both rows. Counts read from
 * APP_INSIGHTS_TOTALS so they always match /app-insights. The app CTA is the
 * inverted secondary style; the buy CTA below keeps the primary fill.
 * ========================================================================== */

export default function ScienceMeasure() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0">
      <h2
        className="brand-h1 text-black lg:col-start-1 lg:row-start-1 lg:mb-4 lg:self-end"
        style={{ letterSpacing: "-0.02em" }}
      >
        {SCIENCE_MEASURE.heading}
      </h2>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#eef0f5] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:aspect-square lg:self-center">
        <Image
          src="/app/AppConkaRing.png"
          alt="CONKA app home screen showing the live cognitive score ring"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-contain p-6"
        />
      </div>

      <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
        <p className="mb-6 max-w-[56ch] text-lg leading-relaxed text-black lg:text-xl">
          {SCIENCE_MEASURE.body}
        </p>

        <ul className="mb-6 space-y-3">
          {SCIENCE_MEASURE.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-base text-black">
              <TrustIconBatchTested className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-navy)]" />
              {point}
            </li>
          ))}
        </ul>

        <p className="mb-7 rounded-md bg-[#eef0f5] px-4 py-3 text-base text-black">
          <span className="font-bold tabular-nums text-[var(--brand-navy)]">
            {APP_INSIGHTS_TOTALS.tests.toLocaleString("en-GB")} tests
          </span>{" "}
          across {APP_INSIGHTS_TOTALS.users} people over {APP_INSIGHTS_TOTALS.monthsSpan} months of real app data.
        </p>

        <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-x-6">
          <ConkaCTAButton href="/app" inverted>
            Get the free app
          </ConkaCTAButton>
          <Link
            href="/app-insights"
            className="inline-flex min-h-[44px] items-center text-base font-semibold text-[var(--brand-navy)] underline underline-offset-4"
          >
            See what the data shows
          </Link>
        </div>
      </div>
    </div>
  );
}
