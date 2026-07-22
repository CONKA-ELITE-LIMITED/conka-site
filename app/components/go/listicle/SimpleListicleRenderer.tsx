"use client";

import Image from "next/image";
import type {
  MmBodyBlock,
  MmListicleConfig,
} from "@/app/lib/landings/listicle-types";
import ProductGrid from "@/app/components/home/ProductGrid";
import AthleteTestimonials from "@/app/components/landing/AthleteTestimonials";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import LogoMarquee, { PRESS_LOGOS } from "@/app/components/landing/LogoMarquee";
import ReviewRail from "@/app/components/landing/ReviewRail";
import LandingTrustBadges from "@/app/components/landing/LandingTrustBadges";
import CROFAQv2 from "@/app/components/cro/CROFAQv2";
import CitationLine from "@/app/components/landing/CitationLine";
import { pickFaqItems, stripClaimAnchors } from "@/app/lib/faqContent";
import { useHashScroll } from "./useHashScroll";

/**
 * Simple (Magic Mind) listicle template. An editorial "N reasons" article:
 * headline + byline hero, then image-and-text reasons with a buy box woven in,
 * the product grid at #product, and a trust / FAQ / sticky tail.
 *
 * This is one of two listicle templates. The other, ListicleRenderer, is the
 * denser IM8 layout (data-viz reason panels, stat bands, comparison tables).
 * Both read the same ListicleConfig and share leaf components; the route picks
 * between them on `config.layout`. Keep this file to the MM structure only:
 * reasons are photo + heading + body, nothing between them but the buy box.
 */

const BONE = "var(--color-bone, #F9F9F9)";
const TINT = "var(--color-neuro-blue-light, #eeeff2)";

/** Editorial article header: big headline, optional byline, intro, divider. */
function SimpleHero({ hero }: { hero: MmListicleConfig["hero"] }) {
  return (
    <section
      aria-label="Hero"
      className="px-5 pt-10 md:px-[5vw] md:pt-16"
      style={{ background: BONE, color: "#111" }}
    >
      <div className="mx-auto max-w-7xl">
        <h1 className="text-[2.25rem] font-bold leading-[1.08] text-black md:text-[3.5rem] md:leading-[1.05]">
          {hero.headline}
        </h1>
        {hero.author ? (
          <div className="mt-7 flex items-center gap-3">
            {hero.author.avatar ? (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={hero.author.avatar}
                  alt={hero.author.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : null}
            <div className="text-[15px] leading-snug">
              <div className="font-bold text-black">By {hero.author.name}</div>
              <div className="text-black/55">
                Last updated {hero.author.updated}
              </div>
            </div>
          </div>
        ) : null}
        <p className="mt-7 max-w-3xl text-[16px] leading-relaxed text-black md:text-[17px]">
          {hero.subcopy}
        </p>
        <hr className="mt-9 border-0 border-t border-black/10" />
      </div>
    </section>
  );
}

/**
 * One reason: image + heading + body. Desktop is image-left / text-right,
 * uniform (no alternating). Mobile stacks heading, then image, then body; the
 * heading renders twice and toggles per breakpoint so it sits above the image
 * on mobile but beside it on desktop. Reason assets are always images here.
 */
function SimpleReason({
  block,
}: {
  block: Extract<MmBodyBlock, { kind: "reason" }>;
}) {
  const heading = (
    <>
      <span className="tabular-nums">{block.n}.</span> {block.headline}
    </>
  );
  return (
    <article className="py-10 md:grid md:grid-cols-2 md:items-center md:gap-14 md:py-16">
      {/* Heading above the image — mobile only */}
      <h3 className="mb-4 text-[22px] font-bold leading-[1.2] text-black md:hidden">
        {heading}
      </h3>

      {/* Photo — squarish corners for the editorial look */}
      <div className="md:order-1">
        <div
          className="relative w-full overflow-hidden rounded-[8px]"
          style={{ aspectRatio: block.asset.aspect ?? "4/3" }}
        >
          <Image
            src={block.asset.src}
            alt={block.asset.alt}
            fill
            className={
              block.asset.fit === "contain" ? "object-contain" : "object-cover"
            }
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Text: heading (desktop only) + body */}
      <div className="mt-6 md:order-2 md:mt-0">
        <h3 className="mb-4 hidden text-[28px] font-bold leading-[1.15] text-black md:block">
          {heading}
        </h3>
        <p className="max-w-[36rem] text-[15px] font-semibold leading-relaxed text-black">
          {block.body}
        </p>
        {block.accentLine ? (
          <p
            className="mt-3 max-w-[36rem] text-[15px] font-semibold leading-relaxed"
            style={{ color: "#1a7f4f" }}
          >
            {block.accentLine}
          </p>
        ) : null}
        {block.citation ? (
          <CitationLine
            citation={block.citation}
            href={block.citationHref}
            className="mt-4"
          />
        ) : null}
      </div>
    </article>
  );
}

/** Mid-list buy-box reprise (the reference repeats the offer after reason 5). */
function BuyBoxReprise({
  headline,
  subline,
}: {
  headline?: string;
  subline?: string;
}) {
  return (
    <div
      className="my-12 rounded-[24px] px-4 py-10 md:px-8 md:py-12"
      style={{ background: TINT }}
    >
      {headline ? (
        <div className="mb-6 text-center">
          <h3
            className="text-[26px] font-semibold leading-tight text-black md:text-[32px]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {headline}
          </h3>
          {subline ? (
            <p className="mx-auto mt-2 max-w-xl text-[15px] text-black/60">
              {subline}
            </p>
          ) : null}
        </div>
      ) : null}
      <ProductGrid />
    </div>
  );
}

export default function SimpleListicleRenderer({
  config,
}: {
  config: MmListicleConfig;
}) {
  useHashScroll();

  const showTrust =
    config.logoMarquee ||
    config.trustCarousel ||
    config.athleteTestimonials ||
    config.pressMarquee;

  return (
    <main className="min-h-screen" style={{ background: BONE, color: "#111" }}>
      <SimpleHero hero={config.hero} />

      {/* Reasons + mid-list buy box */}
      <section
        aria-label="Reasons"
        id="reasons"
        className="px-5 pb-8 md:px-[5vw]"
        style={{ background: BONE, color: "#111" }}
      >
        <div className="mx-auto max-w-7xl">
          {config.body.map((block, i) => {
            if (block.kind === "reason")
              return <SimpleReason key={i} block={block} />;
            if (block.kind === "buyBox")
              return (
                <BuyBoxReprise
                  key={i}
                  headline={block.headline}
                  subline={block.subline}
                />
              );
            // The simple template only uses reason + buyBox blocks.
            return null;
          })}
        </div>
      </section>

      {/* Product / buy box (#product anchor for the sticky bar) */}
      <section
        aria-label="Product offer"
        id="product"
        className="scroll-mt-0 px-5 py-16 md:px-[5vw] md:py-24 xl:scroll-mt-24"
        style={{ background: TINT, color: "#111" }}
      >
        <div className="mx-auto max-w-7xl">
          <ProductGrid />
        </div>
      </section>

      {/* Trust: logos, athlete testimonials, press marquee */}
      {showTrust ? (
        <section
          aria-label="Trusted by"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: BONE, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            {config.logoMarquee ? <LogoMarquee /> : null}
            {config.athleteTestimonials ? (
              <div className={config.logoMarquee ? "mt-16" : ""}>
                <AthleteTestimonials />
              </div>
            ) : null}
            {config.trustCarousel ? (
              <div
                className={
                  config.logoMarquee || config.athleteTestimonials ? "mt-14" : ""
                }
              >
                <AthleteCredibilityCarousel />
              </div>
            ) : null}
            {config.pressMarquee ? (
              <div
                className={
                  config.logoMarquee ||
                  config.athleteTestimonials ||
                  config.trustCarousel
                    ? "mt-16"
                    : ""
                }
              >
                <LogoMarquee heading="As Published On:" logos={PRESS_LOGOS} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Customer reviews */}
      {config.reviewsCarousel ? (
        <section
          aria-label="Reviews"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: BONE, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            <ReviewRail />
            <div className="mt-10">
              <LandingTrustBadges />
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ — only when the config supplies faqIds */}
      {config.faqIds.length ? (
        <section
          aria-label="FAQs"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: BONE, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            <CROFAQv2
              items={pickFaqItems(...config.faqIds).map((f) => ({
                id: f.id,
                question: f.question,
                answer: stripClaimAnchors(f.answer),
              }))}
              showSeeAllLink={false}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
