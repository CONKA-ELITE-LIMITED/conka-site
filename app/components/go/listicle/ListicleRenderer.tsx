"use client";

import { useState } from "react";
import Image from "next/image";
import type {
  ListicleAsset,
  ListicleBodyBlock,
  ListicleConfig,
  ListicleReview,
} from "@/app/lib/landings/listicle-types";
import ListicleProductHero, {
  ListicleProductHeroMobile,
} from "./ListicleProductHero";
import AthleteCredibilityCarousel from "@/app/components/AthleteCredibilityCarousel";
import CROTestimonials from "@/app/components/cro/CROTestimonials";
import { ValueComparisonChart } from "@/app/components/landing/LandingValueComparison";
import CROFAQv2 from "@/app/components/cro/CROFAQv2";
import LandingTrustBadges from "@/app/components/landing/LandingTrustBadges";
import useIsMobile from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import {
  CadenceType,
  getCadenceVariantByProductHeroId,
} from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";

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
    <div className="mb-5 flex items-center justify-center gap-2.5">
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
          <span className="text-[13px] font-bold">{label}</span>
        </div>
        <span className="mt-0.5 text-[11px] opacity-80">{sub}</span>
      </div>
    </div>
  );
}

/**
 * Credibility chip, IM8 "Clinicians' Choice" style: a left/right split —
 * laurel-flanked credential label on the left, descriptive sentence on
 * the right, divided by a hairline. Tinted brand border + soft shadow.
 */
function LaurelBadge({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <div className="mb-5 flex items-stretch gap-3 rounded-[14px] border border-[#1B2757]/25 bg-white px-3 py-2.5 shadow-[0_4px_18px_rgba(27,39,87,0.12)] md:w-fit">
      {/* Left: laurel-flanked credential */}
      <div className="flex flex-shrink-0 items-center gap-1.5 pr-3">
        <div
          className="relative h-9 w-3 flex-shrink-0 overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src="/LaurelWreath.png"
            alt=""
            fill
            sizes="32px"
            style={{ objectFit: "cover", objectPosition: "left center" }}
          />
        </div>
        <span className="max-w-[4.5rem] text-center text-[10px] font-bold uppercase leading-[1.15] tracking-[0.08em] text-[#1B2757]">
          {eyebrow}
        </span>
        <div
          className="relative h-9 w-3 flex-shrink-0 overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src="/LaurelWreath.png"
            alt=""
            fill
            sizes="32px"
            style={{ objectFit: "cover", objectPosition: "right center" }}
          />
        </div>
      </div>
      {/* Right: descriptive body */}
      <div className="flex items-center border-l border-black/10 pl-3 md:max-w-[20rem]">
        <p className="text-[11px] font-medium leading-snug text-black/70">
          {body}
        </p>
      </div>
    </div>
  );
}

function AssetBlock({ asset }: { asset: ListicleAsset }) {
  if (asset.kind === "valueChart") {
    return <ValueComparisonChart />;
  }

  if (asset.kind === "video") {
    return (
      <div
        className="relative mx-auto w-4/5 overflow-hidden rounded-3xl"
        style={{ aspectRatio: asset.aspect ?? "4/3" }}
      >
        <video
          src={asset.src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
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
        className="flex w-full flex-col justify-center gap-4 rounded-3xl p-8"
        style={{
          aspectRatio: aspect,
          background: dark ? DARK : "#eeeff2",
          color: dark ? "#fff" : "#111",
        }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
          {asset.eyebrow}
        </div>
        {asset.stats.map((s, i) => (
          <div key={i}>
            <div className="text-sm opacity-70">{s.label}</div>
            <div className="text-2xl font-medium">
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
        className="relative w-full overflow-hidden rounded-3xl"
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
      className="flex w-full items-center justify-center rounded-3xl border border-dashed border-current opacity-60"
      style={{ aspectRatio: aspect }}
    >
      <span className="px-6 text-center font-mono text-xs uppercase tracking-[0.14em]">
        {note}
      </span>
    </div>
  );
}

/** Embedded PDP hero as the on-page buy box; same wiring as the PDPs */
function ListicleBuyBox({ formulaId }: { formulaId: ProductHeroId }) {
  const isMobile = useIsMobile();
  const { addToCart } = useCart();
  const [selectedCadence, setSelectedCadence] =
    useState<CadenceType>("monthly-sub");

  const handleAddToCart = async (cadence: CadenceType = selectedCadence) => {
    const variantData = getCadenceVariantByProductHeroId(formulaId, cadence);
    if (variantData?.variantId) {
      await addToCart(variantData.variantId, 1, variantData.sellingPlanId, {
        location: "listicle_buybox",
        source: "listicle",
      });
    } else {
      console.warn("Variant not configured for cadence:", cadence);
    }
  };

  // IM8 pattern: the one-time-purchase text link adds straight to cart
  const handleOtpAddToCart = () => {
    setSelectedCadence("monthly-otp");
    void handleAddToCart("monthly-otp");
  };

  const Hero = isMobile ? ListicleProductHeroMobile : ListicleProductHero;
  return (
    <Hero
      formulaId={formulaId}
      selectedCadence={selectedCadence}
      onCadenceChange={setSelectedCadence}
      onAddToCart={() => void handleAddToCart()}
      onOtpAddToCart={handleOtpAddToCart}
    />
  );
}

function ReviewCard({ review }: { review: ListicleReview }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-[#111] shadow-sm">
      <div className="mb-2 text-sm tracking-widest" style={{ color: "#F59E0B" }}>
        ★★★★★
      </div>
      {review.headline ? (
        <p className="mb-1 text-sm font-semibold">{review.headline}</p>
      ) : null}
      <p className="mb-4 text-sm leading-relaxed">{review.quote}</p>
      <div className="text-sm font-medium">{review.name}</div>
      {review.detail ? (
        <div className="text-xs opacity-60">{review.detail}</div>
      ) : null}
    </div>
  );
}

function BodyBlock({ block, index }: { block: ListicleBodyBlock; index: number }) {
  if (block.kind === "reason") {
    const mediaFirst = index % 2 === 1;
    return (
      <article className="grid items-center gap-8 border-t border-black/10 py-14 md:grid-cols-2 md:gap-16">
        <div className={mediaFirst ? "md:order-2" : ""}>
          <div className="mb-4 text-xl font-medium" style={{ color: NAVY }}>
            {String(block.n).padStart(2, "0")}
          </div>
          {block.tag ? (
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
              {block.tag}
            </div>
          ) : null}
          <h3
            className="mb-4 text-4xl leading-tight md:text-5xl"
            style={{
              letterSpacing: "var(--letter-spacing-premium-title)",
              color: NAVY,
            }}
          >
            {block.headline}
          </h3>
          <p className="mb-5 max-w-[36rem] whitespace-pre-line text-base leading-relaxed opacity-80">
            {block.body}
          </p>
          {block.chips?.length ? (
            <div className="flex flex-wrap gap-2">
              {block.chips.map((chip, i) => (
                <span
                  key={i}
                  className="rounded-full border border-black/20 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em]"
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
        className="my-10 rounded-3xl px-8 py-12 text-center"
        style={{ background: DARK, color: "#fff" }}
      >
        <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
          {block.eyebrow}
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {block.stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-medium md:text-5xl">{s.value}</div>
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
      <div className="my-10 grid gap-4 md:grid-cols-3">
        {block.reviews.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>
    );
  }

  return (
    <div className="my-10 rounded-3xl bg-white px-8 py-12 text-center shadow-sm">
      <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
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
              />
            ) : null}
            <h1
              className="mb-4 text-[1.7rem] leading-[1.12] md:mb-5 md:text-5xl md:leading-tight"
              style={{
                letterSpacing: "var(--letter-spacing-premium-title)",
                color: NAVY,
              }}
            >
              {config.hero.headline}
            </h1>
            <p className="mb-5 max-w-[34rem] text-base leading-relaxed opacity-80">
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
              className="mx-auto mb-6 block w-fit rounded-full px-8 py-4 text-center text-sm font-medium text-white"
              style={{ background: NAVY }}
            >
              {config.hero.cta}
            </a>
            {config.hero.trustPills?.length ? (
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
                {config.hero.trustPills.map((pill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-black/65"
                  >
                    <span className="text-[#1B2757]" aria-hidden>
                      ✓
                    </span>
                    {pill}
                  </span>
                ))}
              </div>
            ) : null}
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
              className="mt-10 rounded-3xl px-8 py-14 text-center"
              style={{ background: DARK, color: "#fff" }}
            >
              <h3 className="mb-6 text-3xl">{config.bridge.headline}</h3>
              <a
                href="#product"
                className="inline-block rounded-full bg-white px-8 py-4 text-sm font-medium text-[#111]"
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
        className="px-5 py-16 md:px-[5vw] md:py-24"
        style={{ background: "var(--color-neuro-blue-light, #eeeff2)", color: "#111" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-5xl">{config.product.headline}</h2>
            {config.product.subline ? (
              <p className="opacity-70">{config.product.subline}</p>
            ) : null}
          </div>
          <ListicleBuyBox formulaId={config.product.productHeroId ?? "03"} />
        </div>
      </section>

      {/* Zone 4: athlete trust (shared component) */}
      {config.trustCarousel ? (
        <section
          aria-label="Trusted by"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: BONE, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            <AthleteCredibilityCarousel />
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
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
              {config.comparison.eyebrow}
            </div>
            <h2 className="mb-2 text-4xl">{config.comparison.headline}</h2>
            {config.comparison.subline ? (
              <p className="mb-10 opacity-70">{config.comparison.subline}</p>
            ) : null}
            <div className="overflow-hidden rounded-3xl bg-white text-left shadow-sm">
              <div className="grid grid-cols-3 gap-4 border-b border-black/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.1em] opacity-70">
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
                      <span className="ml-2 font-medium text-[#0e1f3f]">
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
            <CROTestimonials hideCTA />
            <div className="mt-10">
              <LandingTrustBadges />
            </div>
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
            items={config.faq.map((f, i) => ({
              id: `faq-${i}`,
              question: f.q,
              answer: f.a,
            }))}
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
              className="rounded-full bg-white px-6 py-2.5 text-center text-xs font-medium text-[#111]"
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
