"use client";

import Image from "next/image";
import type {
  MmBodyBlock,
  MmListicleConfig,
} from "@/app/lib/landings/listicle-types";
import ProductGrid from "@/app/components/home/ProductGrid";
import ListicleProofTier, { ListicleLogoBand } from "./ListicleProofTier";
import LabFAQ from "@/app/components/landing/LabFAQ";
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
      <div className="mx-auto max-w-[820px]">
        <h1 className="text-[2rem] font-bold leading-[1.1] text-black md:text-[2.75rem] md:leading-[1.08]">
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
        <p className="mt-7 max-w-3xl text-[16px] font-semibold leading-relaxed text-black md:text-[17px]">
          {hero.subcopy}
        </p>
        <hr className="mt-9 border-0 border-t border-black/10" />
      </div>
    </section>
  );
}

/**
 * One reason: image + heading + body. Same content, just rearranged per
 * breakpoint: mobile stacks heading → image → body; desktop is a uniform
 * two-column row, asset left / copy right, with the asset held to a fixed
 * width so it does not scale up from its mobile size. The heading renders
 * twice and toggles per breakpoint so it sits above the image on mobile but
 * beside it on desktop. Reason assets are always images here.
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
    <article className="py-8 md:grid md:grid-cols-[minmax(0,350px)_minmax(0,1fr)] md:items-center md:gap-10 md:py-10">
      {/* Heading above the image — mobile only */}
      <h3 className="mb-4 text-[22px] font-bold leading-[1.2] text-black md:hidden">
        {heading}
      </h3>

      {/* Photo — squarish corners for the editorial look */}
      <div>
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
            sizes="(max-width: 768px) 100vw, 350px"
          />
        </div>
      </div>

      {/* Text: heading (desktop only) + body */}
      <div className="mt-6 md:mt-0">
        <h3 className="mb-4 hidden text-[28px] font-bold leading-[1.15] text-black md:block">
          {heading}
        </h3>
        <p className="max-w-[30rem] text-[15px] font-semibold leading-relaxed text-black">
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

/**
 * Buy-box: a spacing wrapper around the ProductGrid, which renders its own offer
 * header (eyebrow pill + title + subline) by default. A buyBox block can override
 * that header copy; the defaults live in ProductGridHeader. `block.headline` maps
 * to the header title.
 */
function BuyBox({
  block,
}: {
  block: Extract<MmBodyBlock, { kind: "buyBox" }>;
}) {
  return (
    <div className="my-12 md:my-16">
      <ProductGrid
        header={{
          eyebrow: block.eyebrow,
          title: block.headline,
          subline: block.subline,
          offer: block.offer,
        }}
      />
    </div>
  );
}

export default function SimpleListicleRenderer({
  config,
}: {
  config: MmListicleConfig;
}) {
  useHashScroll();

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
        {config.body.map((block, i) => {
          if (block.kind === "reason")
            return (
              <div key={i} className="mx-auto max-w-[820px]">
                <SimpleReason block={block} />
              </div>
            );
          if (block.kind === "buyBox")
            // Break out of the 820px reading column to the home-page grid width.
            return (
              <div key={i} className="brand-track">
                <BuyBox block={block} />
              </div>
            );
          // The simple template only uses reason + buyBox blocks.
          return null;
        })}
      </section>

      {/* Logo band: institutional trust, above the buy box */}
      {config.proof && (config.proof.logoBand || config.proof.pressBand) ? (
        <section
          aria-label="Trusted by"
          className="px-5 pt-16 md:px-[5vw]"
          style={{ background: BONE, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            <ListicleLogoBand proof={config.proof} />
          </div>
        </section>
      ) : null}

      {/* Product / buy box (#product anchor for the sticky bar) */}
      <section
        aria-label="Product offer"
        id="product"
        className="scroll-mt-0 px-5 py-16 md:px-[5vw] md:py-24 xl:scroll-mt-24"
        style={{ background: TINT, color: "#111" }}
      >
        <div className="brand-track">
          <ProductGrid />
        </div>
      </section>

      {/* Proof tier: one named feature, then the UGC band before the FAQ */}
      {config.proof ? (
        <section
          aria-label="Proof"
          className="px-5 py-16 md:px-[5vw]"
          style={{ background: BONE, color: "#111" }}
        >
          <div className="mx-auto max-w-7xl">
            <ListicleProofTier proof={config.proof} />
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
            <LabFAQ
              items={pickFaqItems(...config.faqIds).map((f) => ({
                ...f,
                answer: stripClaimAnchors(f.answer),
              }))}
              image={null}
              hideCTA
              showSeeAllLink={false}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
