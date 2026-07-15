"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type {
  ListicleAsset,
  ListicleBodyBlock,
  ListicleConfig,
  ListicleReview,
} from "@/app/lib/landings/listicle-types";
import { videoTrio } from "@/app/lib/landings/videoTrio";
import LaurelBadge from "@/app/components/landing/LaurelBadge";
import ListiclePurchase from "./ListiclePurchase";
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
import LogoMarquee from "@/app/components/landing/LogoMarquee";
import AthleteTestimonials from "@/app/components/landing/AthleteTestimonials";
import CROFAQv2 from "@/app/components/cro/CROFAQv2";
import LandingTrustBadges from "@/app/components/landing/LandingTrustBadges";
import { pickFaqItems, stripClaimAnchors } from "@/app/lib/faqContent";

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

function ReviewCard({ review }: { review: ListicleReview }) {
  return (
    <div className="rounded-[16px] border border-black/10 bg-white p-4 text-[#111]">
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
      <p className="mb-3 line-clamp-3 text-[13px] leading-snug">
        {review.quote}
      </p>
      <div className="text-[13px] font-medium">{review.name}</div>
      {review.detail ? (
        <div className="text-[11px] opacity-60">{review.detail}</div>
      ) : null}
    </div>
  );
}

/** Circular nav button for the mobile review carousel */
function CarouselArrow({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "Previous review" : "Next review"}
      onClick={onClick}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center self-center rounded-full border border-black/10 bg-white text-[#1B2757] transition active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {dir === "prev" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}

/**
 * Customer-review strip (IM8 "What Customers Say" band). Mobile shows one
 * review at a time with flanking arrows + dots; desktop shows the full row.
 * A tinted band + layered white cards distinguish it from the page.
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
  const [index, setIndex] = useState(0);
  const count = reviews.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div
      className="my-10 rounded-[16px] px-4 py-6 md:px-10 md:py-8"
      style={{ background: "var(--color-neuro-blue-light, #eeeff2)" }}
    >
      <div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-black/55">
        {eyebrow}
      </div>

      {/* Mobile: one review at a time, flanked by arrows */}
      <div className="md:hidden">
        <div className="flex items-stretch gap-2.5">
          <CarouselArrow dir="prev" onClick={() => go(-1)} />
          <div className="min-w-0 flex-1">
            <ReviewCard review={reviews[index]} />
          </div>
          <CarouselArrow dir="next" onClick={() => go(1)} />
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-[#1B2757]" : "w-1.5 bg-black/20"
              }`}
            />
          ))}
        </div>
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

function BodyBlock({ block, index }: { block: ListicleBodyBlock; index: number }) {
  if (block.kind === "reason") {
    const mediaFirst = index % 2 === 1;
    return (
      <article className="grid items-center gap-8 border-t border-black/10 py-14 md:grid-cols-2 md:gap-16">
        <div className={mediaFirst ? "md:order-2" : ""}>
          {block.tag ? (
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-60">
              {block.tag}
            </div>
          ) : null}
          <h3 className="mb-4 text-balance text-[32px] font-semibold leading-[1.1] text-[#1B2757] md:text-[44px] md:leading-[1.05]">
            <span className="tabular-nums">
              {String(block.n).padStart(2, "0")}.
            </span>{" "}
            {block.headline}
          </h3>
          <p className="mb-5 max-w-[36rem] text-[15px] leading-relaxed text-black md:text-base">
            {block.body}
          </p>
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
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
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

export default function ListicleRenderer({ config }: { config: ListicleConfig }) {
  // Land on the right section when arriving with a hash (e.g. the brain-age
  // quiz sends finishers to #product). The page is media-heavy, so elements
  // above the target shift as images/videos load and a one-shot native scroll
  // misses; re-pin to the target a few times until layout settles, and bail
  // the moment the user scrolls themselves.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let done = false;
    const scrollToTarget = () => {
      if (done) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    const stop = () => {
      done = true;
    };
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchmove", stop, { passive: true, once: true });
    const timers = [0, 150, 400, 800, 1400].map((d) =>
      window.setTimeout(scrollToTarget, d),
    );
    window.addEventListener("load", scrollToTarget);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", scrollToTarget);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, []);

  return (
    <main className="min-h-screen" style={{ background: BONE, color: "#111" }}>
      {/* Zone 1: hero — IM8 pattern: asset bleeds to the left/top/bottom
          edges on desktop at ~half viewport width and near-full height;
          content column centres vertically beside it. */}
      <section aria-label="Hero" style={{ background: BONE, color: "#111" }}>
        <div className="grid items-center md:grid-cols-[52fr_48fr]">
          <div
            className="relative order-2 w-full md:order-1"
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
                sizes="(max-width: 768px) 100vw, 52vw"
              />
            ) : (
              <div className="h-full p-5 md:p-10">
                <AssetBlock asset={config.hero.asset} />
              </div>
            )}
          </div>
          <div className="order-1 px-5 pt-6 pb-8 md:order-2 md:flex md:flex-col md:justify-center md:px-14 md:py-0">
            {config.hero.laurel ? (
              <LaurelBadge
                eyebrow={config.hero.laurel.eyebrow}
                body={config.hero.laurel.body}
                className="mb-5"
              />
            ) : null}
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
            <a
              href="#product"
              className="mb-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1B2757] px-10 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] md:w-fit"
            >
              {config.hero.cta}
            </a>
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
            <BodyBlock key={i} block={block} index={i} />
          ))}
          {config.bridge ? (
            <div
              className="mt-10 rounded-[16px] px-8 py-14 text-center"
              style={{ background: DARK, color: "#fff" }}
            >
              <h3 className="mb-6 text-balance text-[28px] font-semibold md:text-[36px]">
                {config.bridge.headline}
              </h3>
              <a
                href="#product"
                className="inline-block rounded-[12px] bg-white px-8 py-4 text-[15px] font-bold text-[#111]"
              >
                {config.bridge.cta}
              </a>
            </div>
          ) : null}
        </div>
      </section>

      {/* Zone 3: product / buy box — hard flip to light */}
      <section
        aria-label="Product offer"
        id="product"
        className="scroll-mt-0 px-5 py-16 md:px-[5vw] md:py-24 xl:scroll-mt-24"
        style={{ background: "var(--color-neuro-blue-light, #eeeff2)", color: "#111" }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h2
              className="text-3xl font-semibold leading-tight text-black md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {config.product.headline}
            </h2>
            {config.product.subline ? (
              <p className="mt-3 max-w-2xl text-base text-black/60">
                {config.product.subline}
              </p>
            ) : null}
          </div>
          <ListiclePurchase defaultSingle={config.product.productHeroId} />
        </div>
      </section>

      {/* Zone 4: social proof — logo marquee, then athlete testimonials */}
      {config.logoMarquee || config.trustCarousel || config.athleteTestimonials ? (
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
                  <a
                    href="#product"
                    className="inline-block rounded-full bg-[#111] px-8 py-4 text-sm font-medium text-white"
                  >
                    {config.costBreakdown.cta}
                  </a>
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
          className="fixed bottom-0 left-0 right-0 z-40 px-5 py-3 md:px-[5vw]"
          style={{ background: NAVY, color: "#fff" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <span className="text-sm">{config.stickyBar.label}</span>
            <a
              href="#product"
              className="rounded-[12px] bg-white px-6 py-2.5 text-center text-[13px] font-bold text-[#111]"
            >
              {config.stickyBar.cta}
              {config.stickyBar.sub ? (
                <span className="block text-[10px] font-normal opacity-70">
                  {config.stickyBar.sub}
                </span>
              ) : null}
            </a>
          </div>
        </aside>
      ) : null}
    </main>
  );
}
