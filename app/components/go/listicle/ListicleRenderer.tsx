"use client";

import { Fragment } from "react";
import Image from "next/image";
import type {
  ListicleAsset,
  ListicleBodyBlock,
  Im8ListicleConfig,
  ListicleReview,
} from "@/app/lib/landings/listicle-types";
import { videoTrio } from "@/app/lib/landings/videoTrio";
import LaurelBadge from "@/app/components/landing/LaurelBadge";
import Link from "next/link";
import ListicleProductHero from "./ListicleProductHero";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import CrashChart from "@/app/components/landing/CrashChart";
import CognitionBars from "@/app/components/landing/CognitionBars";
import ScoreByGroup from "@/app/components/landing/ScoreByGroup";
import AthleteQuoteCard from "@/app/components/landing/AthleteQuoteCard";
import IngredientGrid from "@/app/components/landing/IngredientGrid";
import DayEnergyCurve from "@/app/components/landing/DayEnergyCurve";
import FocusBars from "@/app/components/landing/FocusBars";
import AppMeasureSection, {
  MeasureTile,
} from "@/app/components/landing/AppMeasureSection";
import ReviewRail from "@/app/components/landing/ReviewRail";
import ResearchBackedGraphic from "@/app/components/landing/ResearchBackedGraphic";
import LogoMarquee, { PRESS_LOGOS } from "@/app/components/landing/LogoMarquee";
import CitationLine from "@/app/components/landing/CitationLine";
import SymptomExplainer from "@/app/components/landing/SymptomExplainer";
import SegmentToggle from "@/app/components/landing/SegmentToggle";
import AthleteTestimonials from "@/app/components/landing/AthleteTestimonials";
import CROFAQv2 from "@/app/components/cro/CROFAQv2";
import LandingTrustBadges from "@/app/components/landing/LandingTrustBadges";
import { pickFaqItems, stripClaimAnchors } from "@/app/lib/faqContent";
import { useHashScroll } from "./useHashScroll";

/**
 * Listicle landing renderer (/go/[slug], format: "listicle").
 *
 * SKELETON PHASE: every zone renders as a labelled block with the
 * agreed background rhythm and rough geometry so the full page can be
 * reviewed end to end. Each zone gets rebuilt to quality in its own
 * section pass (see listicle-blueprint.md), at which point it moves
 * into its own component file in this folder.
 *
 * Dark zones use --color-neuro-blue-dark pending the colour decision;
 * flipping to ink is a one-line change on DARK below.
 */

const DARK = "var(--color-neuro-blue-dark, #0e1f3f)";
const BONE = "var(--color-bone, #F9F9F9)";
/** Neuro blue for section titles on light backgrounds */
const NAVY = "#1B2757";
/* Marketing CTAs (hero, bridge, sticky, cost) navigate to the Both PDP rather
   than scrolling to the in-page buy zone. */
const BUY_HREF = "/conka-both";
/* Soft-blue sticky-bar fill (clearly tinted, not the deep navy). */
const SOFT_BLUE = "var(--go-option-tint, #dce5f7)";

/** LandingHero's avatar + star micro-row, compacted to the IM8 scale */
function TrustMicroRow({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="mb-5 flex items-center justify-start gap-2.5">
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="relative h-[26px] w-[26px] overflow-hidden rounded-full border border-black/10"
            style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: 5 - i }}
          >
            <Image
              src={`/avatars/${i + 1}.jpg`}
              alt="CONKA customer"
              fill
              className="object-cover"
              sizes="26px"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <div
            className="relative inline-block leading-none"
            style={{ fontSize: "15px", letterSpacing: "0.05em" }}
            aria-label="4.7 out of 5 stars"
          >
            <span className="text-black/15" aria-hidden="true">
              ★★★★★
            </span>
            <span
              className="absolute left-0 top-0 overflow-hidden whitespace-nowrap"
              style={{ color: "#F59E0B", width: "94%" }}
              aria-hidden="true"
            >
              ★★★★★
            </span>
          </div>
          <span className="text-[13px] font-bold tabular-nums">{label}</span>
        </div>
        <span className="mt-0.5 text-[11px] text-black/60">{sub}</span>
      </div>
    </div>
  );
}

function AssetBlock({ asset }: { asset: ListicleAsset }) {
  if (asset.kind === "crashChart") {
    return (
      <CrashChart
        saving={asset.saving}
        coffeePerDay={asset.coffeePerDay}
        shotsPerDay={asset.shotsPerDay}
      />
    );
  }

  if (asset.kind === "researchBacked") {
    return <ResearchBackedGraphic />;
  }

  if (asset.kind === "measureTile") {
    return <MeasureTile />;
  }

  if (asset.kind === "cognitionBars") {
    return <CognitionBars />;
  }

  if (asset.kind === "scoreByGroup") {
    return <ScoreByGroup />;
  }

  if (asset.kind === "dayEnergyCurve") {
    return <DayEnergyCurve />;
  }

  if (asset.kind === "focusBars") {
    return <FocusBars />;
  }

  if (asset.kind === "athleteQuote") {
    return (
      <AthleteQuoteCard
        name={asset.name}
        role={asset.role}
        image={asset.image}
        quote={asset.quote}
      />
    );
  }

  if (asset.kind === "ingredientGrid") {
    return (
      <IngredientGrid
        eyebrow={asset.eyebrow}
        items={asset.items}
        footer={asset.footer}
      />
    );
  }

  if (asset.kind === "video") {
    // "contain": full-width black tile, clip centred (product renders).
    // "cover" (default): inset 4/5 frame, clip fills it (texture loops).
    const contain = asset.fit === "contain";
    const video = videoTrio(asset.src);
    return (
      <div
        className={`relative overflow-hidden rounded-[16px] border border-black/10 w-full ${
          contain ? "bg-black" : ""
        }`}
        style={{ aspectRatio: contain ? "4/3" : (asset.aspect ?? "4/3") }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          className={`absolute inset-0 h-full w-full ${
            contain ? "object-contain" : "object-cover"
          }`}
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.mp4} type="video/mp4" />
        </video>
      </div>
    );
  }

  const note =
    asset.kind === "placeholder"
      ? asset.note
      : asset.kind === "image"
        ? asset.alt
        : asset.eyebrow;
  const aspect =
    asset.kind === "placeholder" ? asset.aspect : asset.kind === "image" ? (asset.aspect ?? "4/3") : "4/3";

  if (asset.kind === "statPanel") {
    const dark = asset.tone === "dark";
    return (
      <div
        className="flex w-full flex-col justify-center gap-4 rounded-[16px] p-8"
        style={{
          aspectRatio: aspect,
          background: dark ? DARK : "#eeeff2",
          color: dark ? "#fff" : "#111",
        }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-60">
          {asset.eyebrow}
        </div>
        {asset.stats.map((s, i) => (
          <div key={i}>
            <div className="text-sm opacity-70">{s.label}</div>
            <div className="text-2xl font-semibold tabular-nums">
              {s.from ? `${s.from} → ` : ""}
              {s.to}
              {s.delta ? (
                <span className="ml-2 text-base opacity-70">{s.delta}</span>
              ) : null}
            </div>
          </div>
        ))}
        {asset.footer ? (
          <div className="text-xs opacity-60">{asset.footer}</div>
        ) : null}
      </div>
    );
  }

  if (asset.kind === "image") {
    return (
      <div
        className="relative w-full overflow-hidden rounded-[16px]"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          className={asset.fit === "cover" ? "object-cover" : "object-contain"}
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={asset.src.endsWith(".gif")}
        />
      </div>
    );
  }

  return (
    <div
      className="flex w-full items-center justify-center rounded-[16px] border border-dashed border-current opacity-60"
      style={{ aspectRatio: aspect }}
    >
      <span className="px-6 text-center text-[11px] font-semibold uppercase tracking-[0.08em]">
        {note}
      </span>
    </div>
  );
}

function reviewInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ReviewCard({ review }: { review: ListicleReview }) {
  return (
    <div className="flex h-full flex-col rounded-[16px] border border-black/10 bg-white p-4 text-[#111]">
      <div
        className="mb-1.5 text-[13px] tracking-widest"
        style={{ color: "#F59E0B" }}
      >
        ★★★★★
      </div>
      {review.headline ? (
        <p className="mb-1 line-clamp-1 text-sm font-semibold">
          {review.headline}
        </p>
      ) : null}
      <p className="mb-3 line-clamp-4 text-[13px] leading-snug">
        {review.quote}
      </p>
      <div className="mt-auto flex items-center gap-2.5 pt-1">
        {review.image ? (
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src={review.image}
              alt={review.name}
              fill
              sizes="36px"
              className="object-cover object-[center_25%]"
            />
          </span>
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B2757] text-[11px] font-semibold text-white">
            {reviewInitials(review.name)}
          </span>
        )}
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-tight">
            {review.name}
          </div>
          {review.detail ? (
            <div className="text-[11px] leading-tight opacity-60">
              {review.detail}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Customer-review strip (IM8 "What Customers Say" band). Mobile is a swipe
 * row of cards (the next card peeks); desktop is a 3-up grid. Cards carry an
 * optional customer photo. A tinted band distinguishes it from the page.
 */
function ReviewStrip({
  reviews,
  eyebrow = "What Customers Say",
  ratingSummary = "Rated 4.7 / 5 · 622+ reviews",
}: {
  reviews: ListicleReview[];
  eyebrow?: string;
  ratingSummary?: string;
}) {
  return (
    <div
      className="my-10 rounded-[16px] px-4 py-6 md:px-10 md:py-8"
      style={{ background: "var(--color-neuro-blue-light, #eeeff2)" }}
    >
      <div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-black/55">
        {eyebrow}
      </div>

      {/* Mobile: swipe row, next card peeks (no arrows/dots) */}
      <div
        role="group"
        aria-label={`${eyebrow} (swipe to see more)`}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <div key={i} className="w-[85%] shrink-0 snap-start">
            <ReviewCard review={r} />
          </div>
        ))}
      </div>

      {/* Desktop: full row of cards */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {reviews.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>

      {/* Rating summary */}
      <div className="mt-5 flex flex-col items-center gap-1">
        <span
          aria-hidden
          className="text-sm leading-none tracking-[0.1em]"
          style={{ color: "#F59E0B" }}
        >
          ★★★★★
        </span>
        <span className="text-[13px] font-semibold tabular-nums text-black/75">
          {ratingSummary}
        </span>
      </div>
    </div>
  );
}

function BodyBlock({
  block,
  index,
}: {
  block: ListicleBodyBlock;
  index: number;
}) {
  if (block.kind === "reason") {
    const mediaFirst = index % 2 === 1;
    return (
      <article className="grid items-center gap-8 border-t border-black/10 py-14 md:grid-cols-2 md:gap-16">
        <div className={mediaFirst ? "md:order-2" : ""}>
          <h3 className="mb-4 text-balance text-[32px] font-semibold leading-[1.1] text-[#1B2757] md:text-[44px] md:leading-[1.05]">
            <span className="tabular-nums">
              {String(block.n).padStart(2, "0")}.
            </span>{" "}
            {block.headline}
          </h3>
          <p className="mb-5 max-w-[36rem] text-[15px] font-semibold leading-relaxed text-black md:text-base">
            {block.body}
          </p>
          {block.citation ? (
            <CitationLine
              citation={block.citation}
              href={block.citationHref}
              className="-mt-3 mb-5"
            />
          ) : null}
          {block.chips?.length ? (
            <div className="flex flex-wrap gap-2">
              {block.chips.map((chip, i) => (
                <span
                  key={i}
                  className="rounded-full border border-black/10 px-3.5 py-1.5 text-[12px] font-medium text-black/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className={mediaFirst ? "md:order-1" : ""}>
          <AssetBlock asset={block.asset} />
        </div>
      </article>
    );
  }

  if (block.kind === "statsBand") {
    return (
      <div
        className="my-10 rounded-[16px] px-8 py-12 text-center"
        style={{ background: DARK, color: "#fff" }}
      >
        <div className="mb-8 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-60">
          {block.eyebrow}
        </div>
        <div
          className={`mx-auto grid max-w-5xl grid-cols-1 gap-8 md:gap-6 ${
            block.stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
          }`}
        >
          {block.stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-semibold tabular-nums md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm opacity-70">{s.label}</div>
            </div>
          ))}
        </div>
        {block.footnote ? (
          <div className="mt-8 text-xs opacity-50">{block.footnote}</div>
        ) : null}
      </div>
    );
  }

  if (block.kind === "reviewStrip") {
    return (
      <ReviewStrip
        reviews={block.reviews}
        eyebrow={block.eyebrow}
        ratingSummary={block.ratingSummary}
      />
    );
  }

  if (block.kind === "symptomExplainer") {
    return (
      <div className="border-t border-black/10 py-14">
        <h3 className="mb-6 text-balance text-[32px] font-semibold leading-[1.1] text-[#1B2757] md:text-[44px] md:leading-[1.05]">
          {block.n ? (
            <span className="tabular-nums">
              {String(block.n).padStart(2, "0")}.
            </span>
          ) : null}{" "}
          {block.headline}
        </h3>
        <SymptomExplainer
          intro={block.intro}
          disclaimer={block.disclaimer}
          symptoms={block.symptoms}
        />
      </div>
    );
  }

  if (block.kind === "segmentToggle") {
    return (
      <div className="border-t border-black/10 py-14">
        <h3 className="mb-6 text-balance text-[32px] font-semibold leading-[1.1] text-[#1B2757] md:text-[44px] md:leading-[1.05]">
          {block.n ? (
            <span className="tabular-nums">
              {String(block.n).padStart(2, "0")}.
            </span>
          ) : null}{" "}
          {block.headline}
        </h3>
        <SegmentToggle segments={block.segments} />
      </div>
    );
  }

  return (
    <div className="my-10 rounded-[16px] border border-black/10 bg-white px-8 py-12 text-center">
      <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-60">
        {block.eyebrow}
      </div>
      <blockquote className="mx-auto max-w-3xl text-2xl leading-snug">
        “{block.quote}”
      </blockquote>
      <div className="mt-6 text-sm font-medium">{block.name}</div>
      {block.detail ? (
        <div className="text-xs opacity-60">{block.detail}</div>
      ) : null}
    </div>
  );
}

export default function ListicleRenderer({
  config,
}: {
  config: Im8ListicleConfig;
}) {
  useHashScroll();

  return (
    <main className="min-h-screen overflow-x-clip" style={{ background: BONE, color: "#111" }}>
      {/* Zone 1: hero — IM8 pattern: asset bleeds to the left/top/bottom edges
          on desktop at ~half viewport width; content column centres beside. */}
      <section aria-label="Hero" style={{ background: BONE, color: "#111" }}>
        <div className="grid items-center md:grid-cols-[52fr_48fr]">
          <div
            className="relative order-1 w-full"
            style={{
              aspectRatio:
                config.hero.asset.kind === "image"
                  ? (config.hero.asset.aspect ?? "1/1")
                  : undefined,
            }}
          >
            {config.hero.asset.kind === "image" ? (
              <Image
                src={config.hero.asset.src}
                alt={config.hero.asset.alt}
                fill
                priority
                className="object-cover"
                style={{ objectPosition: config.hero.asset.objectPosition ?? "center" }}
                sizes="(max-width: 768px) 100vw, 52vw"
              />
            ) : (
              <div className="h-full p-5 md:p-10">
                <AssetBlock asset={config.hero.asset} />
              </div>
            )}
          </div>
          <div className="order-2 px-5 pt-6 pb-8 md:flex md:flex-col md:justify-center md:px-14 md:py-0">
            <h1 className="mb-3 text-balance text-[1.75rem] font-semibold leading-[1.1] text-[#1B2757] md:mb-4 md:text-5xl md:leading-[1.05]">
              {config.hero.headline}
            </h1>
            <p className="mb-5 max-w-[34rem] text-[15px] leading-relaxed text-black md:text-base">
              {config.hero.subcopy}
            </p>
            {config.hero.socialProof ? (
              <TrustMicroRow
                label={config.hero.socialProof.label}
                sub={config.hero.socialProof.sub}
              />
            ) : null}
            <Link
              href={BUY_HREF}
              className="mb-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-center text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] md:w-auto"
              style={{ background: NAVY }}
            >
              {config.hero.cta}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="shrink-0"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Zone 1b: proof ticker — navy marquee, SportMarquee pattern */}
      {config.ticker?.length ? (
        <div
          aria-label="Proof ticker"
          className="relative overflow-hidden py-3"
          style={{ background: NAVY }}
        >
          <span className="sr-only">{config.ticker.join(", ")}</span>
          <div
            className="inline-flex whitespace-nowrap [will-change:transform] motion-safe:animate-[marquee_40s_linear_infinite]"
            aria-hidden="true"
          >
            {[...config.ticker, ...config.ticker].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
              >
                <span>{item}</span>
                <span className="mx-5" aria-hidden="true">
                  ★
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Zone 2: reasons */}
      <section
        aria-label="Reasons"
        id="reasons"
        className="px-5 py-16 md:px-[5vw]"
        style={{ background: BONE, color: "#111" }}
      >
        <div className="mx-auto max-w-7xl">
          {config.body.map((block, i) => (
            <Fragment key={i}>
              <BodyBlock block={block} index={i} />
              {/* World's-largest laurel badge, relocated out of the hero to sit
                  under point 1 so the hero title + CTA sit higher. */}
              {i === 0 && config.hero.laurel ? (
                <div className="flex justify-center pb-14">
                  <LaurelBadge
                    eyebrow={config.hero.laurel.eyebrow}
                    body={config.hero.laurel.body}
                  />
                </div>
              ) : null}
            </Fragment>
          ))}
          {config.bridge ? (
            <div
              className="mt-10 rounded-[16px] px-8 py-14 text-center"
              style={{ background: DARK, color: "#fff" }}
            >
              <h3 className="mb-6 text-balance text-[28px] font-semibold md:text-[36px]">
                {config.bridge.headline}
              </h3>
              <Link
                href={BUY_HREF}
                className="inline-block rounded-[12px] bg-white px-8 py-4 text-[15px] font-bold text-[#111]"
              >
                {config.bridge.cta}
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Zone 3: product / buy box — hard flip to light */}
      <section
        aria-label="Product offer"
        id="product"
        className="scroll-mt-0 px-5 py-16 md:px-[5vw] md:py-24 xl:scroll-mt-24"
        style={{ background: "#fff", color: "#111" }}
      >
        <div className="mx-auto max-w-6xl">
          <ListicleProductHero productHeroId={config.product.productHeroId} />
        </div>
      </section>

      {/* Zone 4: social proof — logo marquee, athlete testimonials, press marquee */}
      {config.logoMarquee ||
      config.trustCarousel ||
      config.athleteTestimonials ||
      config.pressMarquee ? (
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

      {/* Zone 5: comparison — deferred from v1, renders only if configured */}
      {config.comparison ? (
        <section
          aria-label="Comparison"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: "#eeeff2", color: "#111" }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-60">
              {config.comparison.eyebrow}
            </div>
            <h2 className="mb-2 text-balance text-[32px] font-semibold text-black md:text-[44px]">
              {config.comparison.headline}
            </h2>
            {config.comparison.subline ? (
              <p className="mb-10 opacity-70">{config.comparison.subline}</p>
            ) : null}
            <div className="overflow-hidden rounded-[16px] border border-black/10 bg-white text-left">
              <div className="grid grid-cols-3 gap-4 border-b border-black/10 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-70">
                <div>Ingredient</div>
                <div>CONKA</div>
                <div>{config.comparison.competitorLabel}</div>
              </div>
              {config.comparison.rows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-4 border-b border-black/5 px-6 py-4 text-sm"
                >
                  <div className="font-medium">{row.label}</div>
                  <div>
                    ✓ {row.us}
                    {row.usDelta ? (
                      <span className="ml-2 font-medium tabular-nums text-[#1B2757]">
                        {row.usDelta}
                      </span>
                    ) : null}
                  </div>
                  <div className="opacity-60">{row.them}</div>
                </div>
              ))}
            </div>
            {config.comparison.footnote ? (
              <p className="mt-6 text-xs opacity-60">
                {config.comparison.footnote}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Zone 6: customer reviews (shared carousel) */}
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

      {/* Zone 6b: app proof — "we measure it" (renders only if configured) */}
      {config.appSection ? (
        <section
          aria-label="Measure it with the app"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: BONE, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            <AppMeasureSection />
          </div>
        </section>
      ) : null}

      {/* Zone 7: cost breakdown — deferred from v1, renders only if configured */}
      {config.costBreakdown ? (
        <section
          aria-label="Cost breakdown"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: BONE, color: "#111" }}
        >
          <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-white p-10 text-[#111] shadow-sm md:grid-cols-2 md:p-14">
            <div>
              <h2 className="mb-6 text-4xl leading-tight">
                {config.costBreakdown.claim}
              </h2>
              {config.costBreakdown.savingsBadge ? (
                <div className="mb-6 inline-block rounded-full border border-black/25 px-6 py-6 text-center text-sm">
                  {config.costBreakdown.savingsBadge}
                </div>
              ) : null}
              {config.costBreakdown.cta ? (
                <div>
                  <Link
                    href={BUY_HREF}
                    className="inline-block rounded-full bg-[#111] px-8 py-4 text-sm font-medium text-white"
                  >
                    {config.costBreakdown.cta}
                  </Link>
                </div>
              ) : null}
            </div>
            <div>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
                Monthly breakdown
              </div>
              {config.costBreakdown.lineItems.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-black/10 py-3 text-sm"
                >
                  <span>{item.label}</span>
                  <span className="opacity-70">{item.price}</span>
                </div>
              ))}
              <div className="mt-6 rounded-2xl bg-black/5 p-5 text-sm">
                <div className="flex justify-between py-1">
                  <span>{config.costBreakdown.totals.themLabel}</span>
                  <span className="line-through opacity-60">
                    {config.costBreakdown.totals.them}
                  </span>
                </div>
                <div className="flex justify-between py-1 font-medium">
                  <span>{config.costBreakdown.totals.usLabel}</span>
                  <span>{config.costBreakdown.totals.us}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Zone 8: FAQ (shared component, persona-locked questions) */}
      <section
        aria-label="FAQs"
        className="px-5 py-16 pb-32 md:px-[5vw]"
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

      {/* Sticky bottom bar */}
      {config.stickyBar ? (
        <aside
          aria-label="Offer bar"
          className="fixed bottom-0 left-0 right-0 z-40 px-5 py-2 md:px-[5vw]"
          style={{ background: SOFT_BLUE, color: NAVY }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <span className="text-sm font-medium">{config.stickyBar.label}</span>
            <Link
              href={BUY_HREF}
              className="rounded-full px-6 py-2 text-center text-[13px] font-bold text-white"
              style={{ background: NAVY }}
            >
              {config.stickyBar.cta}
              {config.stickyBar.sub ? (
                <span className="block text-[10px] font-normal opacity-70">
                  {config.stickyBar.sub}
                </span>
              ) : null}
            </Link>
          </div>
        </aside>
      ) : null}
    </main>
  );
}
