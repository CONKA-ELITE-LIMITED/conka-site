import Image from "next/image";
import Link from "next/link";
import { formulaContent } from "@/app/lib/productData";
import { getProductImage } from "@/app/lib/productImageConfig";
import { SCIENCE_HOW_IT_WORKS } from "@/app/lib/scienceContent";
import { SunIcon, SunHorizonIcon } from "@/app/components/landing/icons";
import ScienceTrackClick from "./ScienceTrackClick";

/* ============================================================================
 * ScienceHowItWorks (SCRUM-1352, Simple DTC)
 *
 * Flow and Clear as two equal cards (never one
 * spotlighted), in the words of row 3 of the home "why" accordion. Each card
 * shows its key actives as render tiles with what each does, with no amounts: per-ingredient mg
 * and the per-shot totals are both off the page (patented formula, and the
 * totals were disputed). The card link fires science:cta_clicked, since a click
 * through to a PDP is the outcome this page is measured on.
 * ========================================================================== */

export default function ScienceHowItWorks() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2
          className="brand-h2 mb-4 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          {SCIENCE_HOW_IT_WORKS.heading}
        </h2>
        <p className="text-base leading-relaxed text-black/80">
          {SCIENCE_HOW_IT_WORKS.body}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
        {SCIENCE_HOW_IT_WORKS.shots.map((shot) => {
          const name = formulaContent[shot.productId].name;
          const TimeIcon = shot.time === "morning" ? SunIcon : SunHorizonIcon;
          const trackLocation = `${shot.time === "morning" ? "flow" : "clear"}_card`;
          return (
            <article
              key={shot.productId}
              className="flex flex-col overflow-hidden rounded-md bg-white text-black ring-1 ring-black/5"
            >
              {/* Out of the tab order: the labelled link below goes to the
                  same page, so keyboard and screen-reader users get one stop. */}
              <ScienceTrackClick location={trackLocation}>
                <Link
                  href={shot.href}
                  tabIndex={-1}
                  aria-hidden
                  className="relative block aspect-[4/3] w-full overflow-hidden bg-[#eef0f5] lg:aspect-[16/10]"
                >
                  <Image
                    src={getProductImage(shot.productId)}
                    alt={name}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-black">
                    <TimeIcon className="h-4 w-4 text-[var(--brand-navy)]" />
                    {shot.timeLabel}
                  </span>
                </Link>
              </ScienceTrackClick>

              <div className="flex flex-1 flex-col p-5 lg:p-6">
                <h3 className="mb-1.5 text-2xl font-bold leading-tight text-black">
                  {name}
                </h3>
                <p className="mb-5 text-base leading-relaxed text-black">
                  {shot.job}
                </p>

                <p className="mb-3 text-sm font-semibold text-black">Key actives</p>
                <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {shot.actives.map((active) => (
                    <li
                      key={active.name}
                      className="flex items-center gap-3 rounded-md bg-[#eef0f5] p-2 pr-3"
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white">
                        <Image
                          src={active.image}
                          alt=""
                          fill
                          loading="lazy"
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-tight text-black">
                          {active.name}
                        </span>
                        <span className="block text-sm leading-snug text-black/70">
                          {active.role}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <ScienceTrackClick
                  location={trackLocation}
                  className="mt-auto self-start"
                >
                  <Link
                    href={shot.href}
                    className="inline-flex min-h-[44px] items-center rounded-full border-2 border-[var(--brand-navy)] px-5 text-sm font-semibold text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-navy)] hover:text-white"
                  >
                    {shot.linkLabel}
                  </Link>
                </ScienceTrackClick>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}
