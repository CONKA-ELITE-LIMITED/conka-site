import Image from "next/image";
import Link from "next/link";
import { SCIENCE_MEASURE } from "@/app/lib/scienceContent";
import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";
import { TrustIconBatchTested } from "@/app/components/landing/icons";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

/* ============================================================================
 * ScienceMeasure (SCRUM-1352, Simple DTC)
 *
 * "Measure it yourself", row 5 of the home "why" accordion. Takes the place of
 * AppInsightsCallout on /science only; that component stays as it is on /app.
 * The test and user counts read from APP_INSIGHTS_TOTALS so they always match
 * /app-insights. The app CTA is the inverted secondary style: the buy CTA
 * further down the page keeps the primary fill.
 * ========================================================================== */

export default function ScienceMeasure() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
      {/* Copy leads on mobile so the argument lands before the screenshot. */}
      <div className="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-md bg-white ring-1 ring-black/5 lg:aspect-square">
        <Image
          src="/app/AppConkaRing.png"
          alt="CONKA app home screen showing the live cognitive score ring"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-contain p-8"
        />
      </div>

      <div className="order-1">
        <h2 className="brand-h2 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          {SCIENCE_MEASURE.heading}
        </h2>
        <p className="mb-6 max-w-[56ch] text-base leading-relaxed text-black">
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

        <p className="mb-7 rounded-md bg-white px-4 py-3 text-base text-black ring-1 ring-black/5">
          <span className="font-bold tabular-nums text-[var(--brand-navy)]">
            {APP_INSIGHTS_TOTALS.tests.toLocaleString("en-GB")} tests
          </span>{" "}
          across {APP_INSIGHTS_TOTALS.users} people over {APP_INSIGHTS_TOTALS.monthsSpan} months of real app data.
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
