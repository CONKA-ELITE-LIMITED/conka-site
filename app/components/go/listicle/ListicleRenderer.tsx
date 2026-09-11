"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import type {
  ListicleAsset,
  ListicleBodyBlock,
  Im8ListicleConfig,
  ListicleReview,
} from "@/app/lib/landings/listicle-types";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { videoTrio } from "@/app/lib/landings/videoTrio";
import LaurelBadge from "@/app/components/landing/LaurelBadge";
import Link from "next/link";
import ListicleProductHero from "./ListicleProductHero";
import CrashChart from "@/app/components/landing/CrashChart";
import CognitionBars from "@/app/components/landing/CognitionBars";
import ScoreByGroup from "@/app/components/landing/ScoreByGroup";
import AthleteQuoteCard from "@/app/components/landing/AthleteQuoteCard";
import IngredientGrid from "@/app/components/landing/IngredientGrid";
import DayEnergyCurve from "@/app/components/landing/DayEnergyCurve";
import FocusBars from "@/app/components/landing/FocusBars";
import { MeasureTile } from "@/app/components/landing/AppMeasureSection";
import ResearchBackedGraphic from "@/app/components/landing/ResearchBackedGraphic";
import CitationLine from "@/app/components/landing/CitationLine";
import SymptomExplainer from "@/app/components/landing/SymptomExplainer";
import SegmentToggle from "@/app/components/landing/SegmentToggle";
import LogoMarquee, { PRESS_LOGOS } from "@/app/components/landing/LogoMarquee";
import ListicleProofTier, { ListicleLogoBand } from "./ListicleProofTier";
import {
  getDisplayDiscount,
  getOfferPricing,
  type OfferProduct,
} from "@/app/lib/offerData";
import LabFAQ from "@/app/components/landing/LabFAQ";
import { pickFaqItems, stripClaimAnchors } from "@/app/lib/faqContent";
import { useHashScroll } from "./useHashScroll";
import {
  SECTION,
  SectionImpressions,
  TrackedSection,
  sectionId,
  slugifyChoice,
  useListicleCta,
  useListicleHref,
  useListicleInteraction,
} from "./listicleAnalytics";

/**
 * Listicle landing renderer (/go/[slug], format: "listicle"), IM8 template.
 *
 * Zones: hero, the partner logo band, reasons (the plug-and-play block
 * library), the product buy box, the post-buy-box proof tier, FAQ, plus an
 * optional sticky bar. The band sits directly under the hero (SCRUM-1321):
 * institutional proof has to land while people are still on the page, and
 * reach-to-product runs 8-17%, so above the buy box it was invisible to most
 * of them. The navy proof ticker that used to sit here is gone; it read as
 * chrome rather than proof, and its claims duplicated the hero trust pills.
 * Those pills are gone too (SCRUM-1324): they were never rendered on this
 * template, and once the ticker went there was nothing left carrying the
 * claims, so the config field was dead weight rather than a pending feature.
 * The logo band (ListicleLogoBand) and proof tier (ListicleProofTier)
 * both live in ListicleProofTier.tsx and are shared with SimpleListicleRenderer;
 * the reason-block library is still inline here.
 *
 * Grammar: Simple DTC (DESIGN_SYSTEM.md §8.5). White canvas, section titles in
 * solid black, tokenised navy (--brand-navy) for decorative/interactive fills,
 * light-navy tint strips (--brand-tint), savings green (--brand-positive), DTC
 * radius scale. This resolves the hardcoded-hex colour question from SCRUM-1176.
 */

/** White DTC canvas. */
const CANVAS = "#fff";
/* Decorative Neuro Blue (--brand-accent #4058bb) splash washing out to the
 * white canvas. Anchored top-right, which is the copy column on desktop and
 * the top of the copy block on mobile, so it sits behind the headline and
 * never under the photo. Soft decorative gradients are sanctioned on Simple
 * DTC surfaces (DESIGN_SYSTEM.md §8.5); this stays under 20% alpha so the
 * canvas still reads monochrome-first. */
const HERO_WASH =
  "radial-gradient(115% 85% at 100% 0%, rgba(64,88,187,0.20) 0%, rgba(64,88,187,0.07) 40%, rgba(64,88,187,0) 72%)";
/* The same splash on the reasons section, mirrored to the left. Sized in
 * absolute px rather than percentages: that section is as tall as the whole
 * list, and a percentage-sized gradient would stretch into a wash over the
 * entire page instead of staying a splash at the top corner. */
const REASONS_WASH =
  "radial-gradient(760px 520px at 0% 0%, rgba(64,88,187,0.16) 0%, rgba(64,88,187,0.05) 45%, rgba(64,88,187,0) 75%)";
/**
 * Filled navy (--brand-navy). Serves both the dark decorative proof bands
 * (stats band, bridge, dark stat panel) and the primary/interactive +
 * decorative marks (ticker, CTAs, review initials).
 */
const NAVY = "var(--brand-navy, #1b2757)";
/* Marketing CTAs (hero, bridge, sticky) navigate to the PDP for the product
   this page sells, following the buy box's productHeroId, rather than scrolling
   to the in-page buy zone. Flow "01" -> /conka-flow, Clear "02" -> /conka-clarity,
   Both "03" (and the default) -> /conka-both. */
/** The buy-box product, in the vocabulary `offerData` uses. */
const OFFER_PRODUCT: Record<ProductHeroId, OfferProduct> = {
  "01": "flow",
  "02": "clear",
  "03": "both",
};

/**
 * What the sticky bar says about money, straight out of `offerData`, which is
 * the only place prices we can sell at are allowed to live.
 *
 * Quarterly, not monthly: the bar makes an "as low as" claim, so it has to
 * quote the cheapest cadence on offer or the claim is not true. Flow quarterly
 * is £1.83 a shot against £2.00 monthly.
 *
 * The gift figure is the same sum the PDP gift stack and the cart upsell show,
 * bonus shots plus every gift RRP, and it is floored to the nearest ten for the
 * same reason the upsell badge floors it: a round number is read in one beat
 * and never overstates what is actually given away. Flow quarterly is £118.96,
 * so the bar says £110.
 */
function stickyOffer(heroId: ProductHeroId) {
  const sub = getOfferPricing(OFFER_PRODUCT[heroId], "quarterly-sub");
  const kitValue =
    (sub.freeShotsValue ?? 0) +
    (sub.gifts ?? []).reduce((total, gift) => total + gift.rrp, 0);
  return {
    perShot: sub.perShot.toFixed(2),
    giftValue: kitValue ? Math.floor(kitValue / 10) * 10 : null,
  };
}

/**
 * Resolves the `{percent}` token in hero copy to the live discount for this
 * page's product, out of `offerData` for the same reason `stickyOffer` reads
 * from it: a percentage typed into a config is a claim with no source, and the
 * one that used to sit here (46%) matched no cadence we sell (SCRUM-1323).
 *
 * Same token name and same rule as `ProductGridHeader`, which resolves
 * `{percent}` the same way and renders on these pages too: the token is the
 * bare number and the config owns the "%" sign, so copy can read "{percent}%
 * off" or "Save {percent}%" without the resolver knowing about either.
 *
 * Quarterly, matching `stickyOffer`, so the two offer surfaces on the page
 * quote the same cadence rather than two different savings figures.
 *
 * Applied to every CTA on the page that can carry an offer (hero, bridge and
 * sticky bar) so the token behaves the same wherever it is written. No config
 * uses it outside the hero today; the others resolve to themselves.
 *
 * `getDisplayDiscount` returns 0 for an entry with no anchor price. There is
 * no such quarterly entry today, but if one ever appears the page must not
 * advertise "Save 0%". The clause is dropped for the `"Save {percent}% ..."`
 * shape these CTAs use; copy phrased any other way falls back to substituting
 * the number, so keep that opening if the degraded path matters.
 */
function resolveOfferTokens(text: string, heroId: ProductHeroId): string {
  const percent = getDisplayDiscount(
    getOfferPricing(OFFER_PRODUCT[heroId], "quarterly-sub"),
  );
  if (percent > 0) return text.replaceAll("{percent}", String(percent));
  const withoutClause = text.replace(/^\s*save\s+\{percent\}%\s*/i, "").trim();
  if (!withoutClause || withoutClause.includes("{percent}")) {
    return text.replaceAll("{percent}", String(percent));
  }
  return withoutClause.charAt(0).toUpperCase() + withoutClause.slice(1);
}

const PDP_HREF: Record<ProductHeroId, string> = {
  "01": "/conka-flow",
  "02": "/conka-clarity",
  "03": "/conka-both",
};
/* Light-navy tint strip (Simple DTC tint, not soft-blue). */
const TINT = "var(--brand-tint, #f4f5f8)";
/* Flat sibling of HERO_WASH for the sticky bar: the same Neuro Blue over white,
 * at roughly the strength the wash reaches mid-fade, so the bar reads as part
 * of the same surface as the hero rather than a grey strip stuck to the bottom.
 * This is the sanctioned Simple DTC light-navy tint (DESIGN_SYSTEM.md §8.5). */
const STICKY_TINT = "#eef1f8";

/**
 * The 4.7 star row: a grey five-star run with an amber copy clipped over it at
 * 94% width. Only the hero micro-row uses it now, since the sticky bar dropped
 * its rating line, but it stays extracted: it is twenty lines of clipped-overlay
 * trickery that reads far better named than inlined.
 *
 * It is 4.7 specifically, not rating-agnostic: the figure is baked into both
 * the 94% fill and the aria-label. Callers read the number itself out of
 * `hero.socialProof`, so if the sitewide rating ever moves, this component has
 * to move with it or the stars will quietly disagree with the digits.
 */
function StarRow({ fontSize }: { fontSize: string }) {
  return (
    <span
      className="relative inline-block leading-none"
      style={{ fontSize, letterSpacing: "0.05em" }}
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
    </span>
  );
}

/** The home hero's avatar + star micro-row, compacted to the IM8 scale.
 *  Content only: the caller owns the surrounding spacing. */
function TrustMicroRow({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-center justify-start gap-2.5">
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
          <StarRow fontSize="15px" />
          <span className="text-[13px] font-bold tabular-nums">{label}</span>
        </div>
        <span className="mt-0.5 text-[11px] text-black/60">{sub}</span>
      </div>
    </div>
  );
}

/**
 * Numbered reason heading: the counter sits above the title as a quiet eyebrow
 * rather than inline with it, and the title is solid black.
 *
 * The counter used to be an inline "01." prefix and the title navy, which was
 * the one deliberate im8 exception to the Simple DTC rule that headings are
 * solid black. Dropping it puts the listicle back on the house grammar and
 * lets the number read as a list marker instead of as part of the sentence.
 *
 * Shared by `reason`, `symptomExplainer` and `segmentToggle` so the numbered
 * spine stays visually identical across all three numbered block kinds.
 */
/**
 * Splits a stat value into the large stem and its smaller tail, the way
 * BrainFuelBand does with its explicit `value` / `small` pair: the integer
 * carries the weight and everything after it drops to 60%.
 *
 * "19.3%" -> "19" + ".3%" · "26%" -> "26" + "%" · "£10k" -> "£10" + "k" ·
 * "+14.86%" -> "+14" + ".86%". A leading sign or currency mark stays with the
 * stem, and a plain "75" gets no tail at all.
 */
function splitStatValue(value: string): [string, string] {
  const match = /^([^\d]*\d+)(.*)$/.exec(value);
  return match ? [match[1], match[2]] : [value, ""];
}

function ReasonHeading({
  n,
  className,
  children,
}: {
  n?: number;
  className: string;
  children: string;
}) {
  return (
    <div className={className}>
      {n ? (
        <p className="mb-2 text-[13px] font-semibold tabular-nums text-black/40">
          {String(n).padStart(2, "0")}
        </p>
      ) : null}
      <h3 className="text-balance text-[32px] font-semibold leading-[1.1] text-black md:text-[44px] md:leading-[1.05]">
        {children}
      </h3>
    </div>
  );
}

/**
 * A reason clip that only decodes while it is on screen.
 *
 * These used to carry a bare `autoPlay loop`, which keeps a video decoding
 * long after it has scrolled away: wasted battery and CPU on the phones 74%
 * of this traffic arrives on, and there can be several clips on one page.
 * Same treatment BottleVideo uses on the PDPs, so the two agree: no autoPlay,
 * an IntersectionObserver plays at 40% visible and pauses on exit.
 */
function ReasonVideo({
  asset,
}: {
  asset: Extract<ListicleAsset, { kind: "video" }>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.paused) el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // "contain": full-width black tile, clip centred (product renders).
  // "cover" (default): inset 4/5 frame, clip fills it (texture loops).
  const contain = asset.fit === "contain";
  const video = videoTrio(asset.src);

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-black/10 w-full ${
        contain ? "bg-black" : ""
      }`}
      style={{ aspectRatio: contain ? "4/3" : (asset.aspect ?? "4/3") }}
    >
      <video
        // Browsers do not re-read <source> children after the initial load, so
        // a changed src needs a remount rather than a re-render. Same guard
        // BottleVideo carries.
        key={asset.src}
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster={video.poster}
        aria-label={asset.alt}
        aria-hidden={asset.alt ? undefined : true}
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

function AssetBlock({ asset }: { asset: ListicleAsset }) {
  if (asset.kind === "crashChart") {
    return (
      <CrashChart
        saving={asset.saving}
        coffeePerDay={asset.coffeePerDay}
        shotsPerDay={asset.shotsPerDay}
        variant="dtc"
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
    return <ReasonVideo asset={asset} />;
  }

  const note =
    asset.kind === "placeholder"
      ? asset.note
      : asset.kind === "image"
        ? asset.alt
        : asset.eyebrow;
  const aspect =
    asset.kind === "placeholder"
      ? asset.aspect
      : asset.kind === "image"
        ? (asset.aspect ?? "4/3")
        : "4/3";

  if (asset.kind === "statPanel") {
    const dark = asset.tone === "dark";
    return (
      <div
        className="flex w-full flex-col justify-center gap-4 rounded-md p-8"
        style={{
          aspectRatio: aspect,
          background: dark ? NAVY : TINT,
          color: dark ? "#fff" : "#111",
        }}
      >
        <div className="text-xs font-semibold opacity-60">{asset.eyebrow}</div>
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
        className="relative w-full overflow-hidden rounded-md"
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
      className="flex w-full items-center justify-center rounded-md border border-dashed border-current opacity-60"
      style={{ aspectRatio: aspect }}
    >
      <span className="px-6 text-center text-xs font-semibold">{note}</span>
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
    <div className="flex h-full flex-col rounded-md border border-black/10 bg-white p-4 text-[#111]">
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
          <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full">
            <Image
              src={review.image}
              alt={review.name}
              fill
              sizes="72px"
              className="object-cover object-[center_25%]"
            />
          </span>
        ) : (
          <span
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
            style={{ background: NAVY }}
          >
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
      className="my-10 rounded-md px-4 py-6 md:px-10 md:py-8"
      style={{ background: TINT }}
    >
      <div className="mb-4 text-center text-[13px] font-semibold text-black/55">
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
  // Active-intent reporter for the interactive blocks below (symptom picker,
  // segment toggle). Unconditional per the rules of hooks; a no-op for the rest.
  const fireInteraction = useListicleInteraction();

  if (block.kind === "reason") {
    const mediaFirst = index % 2 === 1;
    return (
      <div className={`${index === 0 ? "" : "border-t border-black/10"} py-14`}>
        <article className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
          <div className={mediaFirst ? "md:order-2" : ""}>
            <ReasonHeading n={block.n} className="mb-4">
              {block.headline}
            </ReasonHeading>
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 text-[12px] font-semibold text-black shadow-sm"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--brand-positive, #1a7f4f)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
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
        {/* Full-width press band, OUTSIDE the grid: the marquee's w-max track
            would otherwise blow out the auto grid column on mobile and stretch
            the asset (e.g. the app graph) to the track width. Slower than the
            partner band (60s vs 40s) so the two never read as one track. */}
        {block.pressMarquee ? (
          <div className="mt-12">
            <LogoMarquee
              heading="As Published On:"
              logos={PRESS_LOGOS}
              durationSeconds={60}
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (block.kind === "statsBand") {
    // Styled from app/lander/sections/BrainFuelBand/BrainFuelBand.module.css,
    // value for value: #f1f1f3 card at 8px radius, title at weight 800, and a
    // 2-up metric grid whose 1px gaps over a darker container read as hairline
    // dividers. Cells are centred, which also handles an odd stat count: the
    // last cell spans the full width and its content centres in it.
    //
    // One deliberate deviation. The reference hard-sets the value at 41.6px
    // with `white-space: nowrap`, which works for its own short figures ("75",
    // "19.3%") but clips a listicle value like "+14.86%" in a half-width cell
    // at 390px. The clamp keeps 41.6px wherever it fits and shrinks only on the
    // narrowest screens, so nothing is ever cut off.
    return (
      <div
        className="my-10 flex flex-col gap-6 rounded-lg px-5 py-6 md:gap-7 md:px-7 md:py-8"
        style={{ background: "#f1f1f3", color: "#000" }}
      >
        <h3
          className="m-0 text-balance"
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.9rem, 1.2rem + 3vw, 2.75rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#000",
          }}
        >
          {block.eyebrow}
        </h3>

        <div
          className={`grid grid-cols-2 gap-px ${
            block.stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
          }`}
          style={{ background: "rgba(0, 0, 0, 0.12)" }}
        >
          {block.stats.map((st, i) => {
            // An odd count would otherwise leave a hole in a 2-col grid, and
            // the grid's own background shows through it as an empty block.
            const fillsRow =
              block.stats.length % 2 === 1 && i === block.stats.length - 1;
            const [stem, tail] = splitStatValue(st.value);
            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-center gap-2 px-2.5 py-4 text-center md:px-4 md:py-6 ${
                  fillsRow ? "col-span-2 md:col-span-1" : ""
                }`}
                style={{ background: "#f1f1f3" }}
              >
                <div
                  className="tabular-nums"
                  style={{
                    fontWeight: 850,
                    fontSize: "clamp(2rem, 9vw, 41.6px)",
                    lineHeight: "36px",
                    letterSpacing: "-0.058em",
                    color: "#000",
                  }}
                >
                  {stem}
                  {tail ? (
                    // 0.6em resolves to the reference's 24.96px against its
                    // 41.6px stem, and holds that ratio as the stem clamps
                    // down on narrow screens.
                    <small style={{ fontSize: "0.6em", fontWeight: 850 }}>
                      {tail}
                    </small>
                  ) : null}
                </div>
                <p
                  className="m-0"
                  style={{
                    fontWeight: 500,
                    fontSize: "12.48px",
                    lineHeight: "16px",
                    letterSpacing: "-0.12px",
                    color: "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  {st.label}
                </p>
              </div>
            );
          })}
        </div>

        {block.footnote ? (
          <p
            className="m-0"
            style={{
              fontWeight: 500,
              fontSize: "12.48px",
              lineHeight: "18px",
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            {block.footnote}
          </p>
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
      <div className={`${index === 0 ? "" : "border-t border-black/10"} py-14`}>
        <ReasonHeading n={block.n} className="mb-6">
          {block.headline}
        </ReasonHeading>
        <SymptomExplainer
          intro={block.intro}
          symptoms={block.symptoms}
          onSelect={(label) =>
            fireInteraction(`symptom_${slugifyChoice(label)}`)
          }
        />
      </div>
    );
  }

  if (block.kind === "segmentToggle") {
    return (
      <div className={`${index === 0 ? "" : "border-t border-black/10"} py-14`}>
        <ReasonHeading n={block.n} className="mb-6">
          {block.headline}
        </ReasonHeading>
        <SegmentToggle
          segments={block.segments}
          onSelect={(label) =>
            fireInteraction(`segment_${slugifyChoice(label)}`)
          }
        />
      </div>
    );
  }

  // Every ListicleBodyBlock kind is handled above; this satisfies the compiler.
  return null;
}

export default function ListicleRenderer({
  config,
}: {
  config: Im8ListicleConfig;
}) {
  // Split so the provider sits above the body: TrackedSection reads the shared
  // observer from context, which has to be mounted by an ancestor.
  return (
    <SectionImpressions slug={config.slug}>
      <ListicleBody config={config} />
    </SectionImpressions>
  );
}

function ListicleBody({ config }: { config: Im8ListicleConfig }) {
  useHashScroll();
  const fireCta = useListicleCta();
  const withSrc = useListicleHref();

  // The product this page sells. Drives the PDP hand-off (see PDP_HREF) and
  // every price and percentage the page quotes.
  const heroId = config.product.productHeroId ?? "03";

  // Marketing CTAs follow the product this page sells (see PDP_HREF).
  const buyHref = PDP_HREF[heroId];

  // The FAQ section carries the sticky-bar clearance (pb-32). If a config
  // supplies no faqIds that section does not render, so the clearance moves to
  // <main> to stop the bar covering the last block.
  const needsStickyClearance =
    Boolean(config.stickyBar) && !config.faqIds.length;

  // The bar states the offer and nothing else. Proof already runs twice above
  // it, in the hero micro-row and the logo band; stars and a review count down
  // here were a third copy competing with the price on a two-line strip.
  const offer = stickyOffer(heroId);

  return (
    <main
      className={`min-h-screen overflow-x-clip${needsStickyClearance ? " pb-32" : ""}`}
      style={{ background: CANVAS, color: "#111" }}
    >
      {/* Zone 1: hero — a soft educational preframe (SCRUM-1320). On desktop the
          asset still bleeds to the left/top/bottom edges at ~half viewport
          width; on mobile the copy comes FIRST (reversing SCRUM-1166) so the
          outcome headline is the first thing a cold visitor reads. */}
      <section
        aria-label="Hero"
        style={{ background: `${HERO_WASH}, ${CANVAS}`, color: "#111" }}
      >
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
                style={{
                  objectPosition: config.hero.asset.objectPosition ?? "center",
                }}
                sizes="(max-width: 768px) 100vw, 52vw"
              />
            ) : (
              <div className="h-full p-5 md:p-10">
                <AssetBlock asset={config.hero.asset} />
              </div>
            )}
          </div>
          <div className="order-1 px-5 pt-10 pb-8 md:order-2 md:flex md:flex-col md:justify-center md:px-14 md:py-0">
            {/* Simple DTC display tier (DESIGN_SYSTEM.md §8.5): on a stripped-back
                hero the oversized heading carries the hierarchy on its own. */}
            <h1
              className="mb-4 text-balance font-semibold text-black"
              style={{
                fontSize: "clamp(3rem, 9vw, 3.75rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {config.hero.headline}
            </h1>
            <p className="mb-6 max-w-[34rem] text-base leading-relaxed text-black md:text-[17px]">
              {config.hero.subcopy}
            </p>
            <Link
              href={withSrc(buyHref, SECTION.hero)}
              onClick={() => fireCta(SECTION.hero)}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-center text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-navy)] md:w-auto"
              style={{ background: NAVY }}
            >
              {resolveOfferTokens(config.hero.cta, heroId)}
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
            {/* Proof lands AFTER the ask, not before it: it reassures the click
                rather than being spent above the fold on its own. */}
            {config.hero.socialProof ? (
              <TrustMicroRow
                label={config.hero.socialProof.label}
                sub={config.hero.socialProof.sub}
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* Zone 1b: proof wall — the partner logo band, straight after the hero.
          Tracked as its own fixed zone so it has a denominator; it is not a
          `body` entry, so no reason-block id shifts. */}
      {config.proof && (config.proof.logoBand || config.proof.pressBand) ? (
        <section
          aria-label="Trusted by"
          className="px-5 py-12 md:px-[5vw] md:py-14"
          style={{ background: CANVAS, color: "#111" }}
        >
          <TrackedSection
            section={SECTION.proofWall}
            className="mx-auto max-w-7xl"
          >
            <ListicleLogoBand proof={config.proof} />
          </TrackedSection>
        </section>
      ) : null}

      {/* Zone 2: reasons */}
      <section
        aria-label="Reasons"
        id="reasons"
        className="px-5 py-16 md:px-[5vw]"
        style={{ background: `${REASONS_WASH}, ${CANVAS}`, color: "#111" }}
      >
        <div className="mx-auto max-w-7xl">
          {config.reasonsHeader ? (
            <TrackedSection
              // The first body block already opens with `border-t ... py-14`,
              // so this only needs to clear the hairline, not the whole gap.
              section={SECTION.reasonsHeader}
              className="mb-8 text-center md:mb-10"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
                {config.reasonsHeader.eyebrow}
              </p>
              {/* Sized between the reason headings (32/44, navy) and the hero
                  H1 (48/60), and solid black rather than navy, so it reads as
                  the section title rather than as another reason. */}
              <h2
                className="mx-auto max-w-[24ch] text-balance font-semibold text-black"
                style={{
                  fontSize: "clamp(2.125rem, 6.5vw, 3rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                }}
              >
                {config.reasonsHeader.headline}
              </h2>
            </TrackedSection>
          ) : null}
          {config.body.map((block, i) => (
            <Fragment key={i}>
              <TrackedSection section={sectionId(block.kind, i)}>
                <BodyBlock block={block} index={i} />
              </TrackedSection>
              {/* World's-largest laurel badge, relocated out of the hero to sit
                  under point 1 so the hero title + CTA sit higher. */}
              {i === 0 && config.hero.laurel ? (
                <div className="flex justify-center pb-14">
                  <LaurelBadge
                    eyebrow={config.hero.laurel.eyebrow}
                    body={config.hero.laurel.body}
                    variant="dtc"
                  />
                </div>
              ) : null}
            </Fragment>
          ))}
          {config.bridge ? (
            // Tracked so the bridge CTA has a denominator: unlike the hero and
            // sticky bar it is a mid-page block that can be scrolled past.
            <TrackedSection
              section={SECTION.bridge}
              className="mt-10 rounded-md px-8 py-14 text-center"
              style={{ background: NAVY, color: "#fff" }}
            >
              <h3 className="mb-6 text-balance text-[28px] font-semibold md:text-[36px]">
                {config.bridge.headline}
              </h3>
              <Link
                href={withSrc(buyHref, SECTION.bridge)}
                onClick={() => fireCta(SECTION.bridge)}
                className="inline-block rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#111]"
              >
                {resolveOfferTokens(config.bridge.cta, heroId)}
              </Link>
            </TrackedSection>
          ) : null}
        </div>
      </section>

      {/* Zone 3b: product / buy box — hard flip to light */}
      <section
        aria-label="Product offer"
        id="product"
        className="scroll-mt-0 px-5 py-16 md:px-[5vw] md:py-24 xl:scroll-mt-24"
        style={{ background: "#fff", color: "#111" }}
      >
        {/* max-w-7xl (not 6xl): ProductHeroV3's two-column grid is ~1208px at
            its natural width, so the narrower container would squeeze it. */}
        <TrackedSection section={SECTION.product} className="mx-auto max-w-7xl">
          <ListicleProductHero productHeroId={config.product.productHeroId} />
        </TrackedSection>
      </section>

      {/* Zone 4: proof tier — one named feature, then the UGC band last so it
          sits directly before the FAQ. */}
      {config.proof ? (
        <section
          aria-label="Proof"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: CANVAS, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            <ListicleProofTier proof={config.proof} />
          </div>
        </section>
      ) : null}

      {/* Zone 5: FAQ — LabFAQ, the site-standard accordion used on home and
          the PDPs. No image column (no persona lifestyle shot) and no CTA
          button (the sticky bar and the buy zone already own the CTA).
          Only when the config supplies faqIds, so an empty list cannot render
          a bare heading with no rows (matches SimpleListicleRenderer). */}
      {config.faqIds.length ? (
        <section
          aria-label="FAQs"
          className="px-5 py-16 pb-32 md:px-[5vw]"
          style={{ background: CANVAS, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            <LabFAQ
              items={pickFaqItems(...config.faqIds).map((f) => ({
                ...f,
                answer: stripClaimAnchors(f.answer),
              }))}
              hideCTA
              showSeeAllLink={false}
            />
          </div>
        </section>
      ) : null}

      {/* Sticky bottom bar */}
      {config.stickyBar ? (
        <aside
          aria-label="Offer bar"
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 px-5 py-4 md:px-[5vw]"
          style={{ background: STICKY_TINT, color: "#111" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            {/* Money only: this is the highest-closing surface on the page and
                it carried no price at all before SCRUM-1322. The reference bar
                is bold headline over a quieter second line, so the price leads
                and the gift value supports it rather than shouting alongside.

                No green here. Savings green earns its place as a badge on a
                white surface; as a bare 12px line on the navy tint it read as a
                second accent competing with the CTA. Navy ties the line to the
                button instead, and the "free" does the work the colour was
                doing. */}
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[15px] font-bold leading-tight md:text-base">
                As low as £{offer.perShot} a shot
              </span>
              {offer.giftValue ? (
                <span className="text-[12px] font-medium leading-tight text-[var(--brand-navy)]">
                  +£{offer.giftValue} of gifts free
                  {/* The qualifier is the first thing to go when space is
                      short: at 390px the full sentence was ellipsing, which
                      turned the number into "+£110 of free gifts with a sub…"
                      and lost the point of the line. */}
                  <span className="hidden sm:inline">
                    {" "}
                    with a subscription
                  </span>
                </span>
              ) : null}
            </div>
            <Link
              href={withSrc(buyHref, SECTION.sticky)}
              onClick={() => fireCta(SECTION.sticky)}
              // ConkaCTAButton's inverted contract (CTA_BASE_INVERTED): white
              // fill, navy border and text, flipping to the navy fill on hover.
              // The treatment, not the component: ConkaCTAButton renders a mono
              // uppercase label and an O-mark, which is clinical grammar and
              // would read as a foreign object on a Simple DTC bar.
              className="flex min-h-[48px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-navy)] bg-white px-7 text-center text-[var(--brand-navy)] transition-colors duration-200 hover:bg-[var(--brand-navy)] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-navy)]"
            >
              <span className="text-[15px] font-bold leading-tight">
                {resolveOfferTokens(config.stickyBar.cta, heroId)}
              </span>
            </Link>
          </div>
        </aside>
      ) : null}
    </main>
  );
}
