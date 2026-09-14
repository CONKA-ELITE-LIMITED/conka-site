import Image from "next/image";
import Link from "next/link";
import TrustMicroRow from "@/app/components/landing/TrustMicroRow";
import LabFAQ from "@/app/components/landing/LabFAQ";
import MetaViewContent from "@/app/components/MetaViewContent";
import {
  SectionImpressions,
  TrackedSection,
} from "@/app/components/go/listicle/listicleAnalytics";
import { pickFaqItems, stripClaimAnchors } from "@/app/lib/faqContent";
import {
  getOfferPricing,
  getOfferVariant,
  getSavingsPercent,
  type OfferProduct,
} from "@/app/lib/offerData";
import { getCadenceGiftSummary } from "@/app/lib/cadenceData";
import { formatPrice } from "@/app/lib/productData";
import { REVIEWS, type ReviewProduct } from "@/app/lander/sections/Reviews/reviews.data";
import type { OfferConfig } from "@/app/lib/landings/offer-types";
import {
  OfferCheckoutError,
  OfferCtaButton,
  OfferPurchaseProvider,
  OfferStickyBar,
} from "./OfferPurchase";
import type { OfferUpsellData } from "./OfferUpsellModal";

/**
 * /go offer format (SCRUM-1343): a stripped-back single-offer page for paid
 * traffic. Server-rendered; only the CTAs, sticky bar and upsell modal are
 * client islands (OfferPurchase).
 *
 * Section order is fixed on purpose: hero + price tile, benefits, proof, how it
 * works, FAQ. Copy lives in the config, so a new iteration is a new slug.
 * Views and CTA clicks report through the listicle stream, keyed by slug.
 */

/** The savings pill gradient shared with CartUpsellTile and GiftValueStack. */
const SAVINGS_PILL_BG = "linear-gradient(90deg, #cdeecf, #e9f5c9)";

const REVIEW_PRODUCT: Record<OfferProduct, ReviewProduct> = {
  flow: "CONKA FLOW",
  clear: "FLOW + CLEAR",
  both: "FLOW + CLEAR",
};

/**
 * The upsell is always the product's monthly starter pack. "Value" follows the
 * starter-pack stack used on the PDPs: the all-in one-time anchor plus the RRP
 * of everything free in the first box. Throws at build time rather than
 * shipping a modal that cannot check out.
 */
function buildUpsell(product: OfferProduct): OfferUpsellData {
  const pricing = getOfferPricing(product, "monthly-sub");
  const variant = getOfferVariant(product, "monthly-sub");
  if (!variant?.sellingPlanId) {
    throw new Error(`Offer page: no monthly subscription variant for "${product}"`);
  }
  const { tiles, total: giftTotal } = getCadenceGiftSummary(pricing);
  const valueTotal = (pricing.compareAtPrice ?? pricing.price) + giftTotal;

  return {
    variantId: variant.variantId,
    sellingPlanId: variant.sellingPlanId,
    price: pricing.price,
    perShot: pricing.perShot,
    firstOrderShots: pricing.firstOrderShots ?? pricing.shotCount,
    subsequentShots: pricing.subsequentShots ?? pricing.shotCount,
    valueTotal,
    // Rounded to the penny: float sums like 152.94 - 39.99 carry noise.
    saving: Math.round((valueTotal - pricing.price) * 100) / 100,
    packImage: pricing.starterPackImage,
    tiles: tiles.map(({ id, label, rrp, image, imageFit }) => ({
      id,
      label,
      rrp,
      image,
      imageFit,
    })),
  };
}

export default function OfferRenderer({ config }: { config: OfferConfig }) {
  const { trial, hero, tile } = config;
  const upsell = buildUpsell(config.product);
  const discount = getSavingsPercent(trial.price, trial.compareAtPrice);
  const reviews = REVIEWS.filter(
    (r) => r.product === REVIEW_PRODUCT[config.product],
  ).slice(0, 2);
  const faqItems = [
    ...config.offerFaqs,
    ...pickFaqItems(...config.faqIds).map((f) => ({
      id: f.id,
      question: f.question,
      answer: stripClaimAnchors(f.answer),
    })),
  ];

  return (
    <SectionImpressions slug={config.slug}>
      <OfferPurchaseProvider
        slug={config.slug}
        product={config.product}
        productName={config.productName}
        offerId={config.offerId}
        trial={trial}
        upsell={upsell}
      >
        {/* Mid-funnel signal for paid traffic, as on the landers and BYO. */}
        <MetaViewContent
          variantIds={[trial.variantId]}
          value={trial.price}
          contentName={config.title}
        />
        <main className="brand-bg-white text-black">
          <TrackedSection section="hero">
            <section
              aria-label="Trial box offer"
              className="brand-section brand-hero-first brand-bg-white"
            >
              <div className="brand-track">
                <Image
                  src="/conka-logo.webp"
                  alt="CONKA"
                  width={440}
                  height={112}
                  className="h-7 w-auto"
                  priority
                />

                {/* Mobile stacks headline, image, tile so the price and CTA sit
                    inside the first screen. Desktop puts the image in its own
                    column beside headline + tile. */}
                <div className="mt-5 grid gap-5 md:mt-8 md:grid-cols-2 md:gap-x-12 md:gap-y-6">
                  <div className="md:col-start-1 md:row-start-1">
                    <TrustMicroRow />
                    <p className="mt-4 text-sm font-semibold text-black/60">
                      {hero.eyebrow}
                    </p>
                    <h1 className="brand-h1 mb-0 mt-1">{hero.headline}</h1>
                    <p className="brand-body mt-3 hidden text-black/70 md:block">
                      {hero.subline}
                    </p>
                  </div>

                  <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
                    <Image
                      src={hero.image.src}
                      alt={hero.image.alt}
                      width={hero.image.width}
                      height={hero.image.height}
                      className="aspect-[16/9] w-full rounded-lg object-cover md:aspect-[3/2]"
                      sizes="(min-width: 768px) 45vw, 100vw"
                      priority
                    />
                  </div>

                  <div className="brand-bg-white rounded-lg border border-black/10 p-5 text-black shadow-sm md:col-start-1 md:row-start-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-lg font-bold leading-tight">{tile.name}</p>
                      {discount > 0 && (
                        <span
                          className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#14532d]"
                          style={{ background: SAVINGS_PILL_BG }}
                        >
                          {discount}% off
                        </span>
                      )}
                    </div>

                    <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-3xl font-bold tabular-nums">
                        {formatPrice(trial.price)}
                      </span>
                      <span className="text-sm text-black/60">/week</span>
                      <span className="text-base text-black/40 line-through tabular-nums">
                        {formatPrice(trial.compareAtPrice)}
                      </span>
                    </p>

                    <div className="mt-4">
                      <OfferCtaButton section="hero" isTile>
                        {tile.cta}
                      </OfferCtaButton>
                      <OfferCheckoutError />
                    </div>
                    <p className="mt-2 text-sm text-black/60">{tile.renewal}</p>

                    <ul className="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm">
                      {tile.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <Tick />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </TrackedSection>

          <TrackedSection section="benefits">
            <section aria-label="Benefits" className="brand-section brand-bg-tint">
              <div className="brand-track">
                <h2 className="brand-h2 mb-6">{config.benefits.title}</h2>
                <ul className="grid gap-3 md:grid-cols-3">
                  {config.benefits.items.map((item) => (
                    <li
                      key={item.title}
                      className="brand-bg-white rounded-lg p-5 text-black"
                    >
                      <p className="text-lg font-bold leading-tight">{item.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-black/70">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </TrackedSection>

          {reviews.length > 0 && (
            <TrackedSection section="proof">
              <section aria-label="Customer reviews" className="brand-section brand-bg-white">
                <div className="brand-track">
                  <h2 className="brand-h2 mb-6">What customers say</h2>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {reviews.map((review) => (
                      <li
                        key={review.name}
                        className="brand-bg-tint rounded-lg p-5 text-black"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            width={80}
                            height={80}
                            className="h-10 w-10 rounded-full object-cover"
                            sizes="40px"
                            loading="lazy"
                          />
                          <div>
                            <p className="text-sm font-bold">{review.name}</p>
                            <p
                              className="text-sm leading-none text-[var(--brand-navy)]"
                              aria-label={`${review.rating} out of 5 stars`}
                            >
                              <span aria-hidden>★★★★★</span>
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 font-bold">{review.headline}</p>
                        <p className="mt-1 text-sm leading-relaxed text-black/70">
                          {review.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </TrackedSection>
          )}

          <TrackedSection section="steps">
            <section aria-label="How the trial works" className="brand-section brand-bg-tint">
              <div className="brand-track">
                <h2 className="brand-h2 mb-6">{config.steps.title}</h2>
                <ol className="grid gap-3 md:grid-cols-3">
                  {config.steps.items.map((step, i) => (
                    <li
                      key={step.title}
                      className="brand-bg-white flex gap-4 rounded-lg p-5 text-black md:flex-col md:gap-3"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-sm font-bold text-white"
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-lg font-bold leading-tight">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-black/70">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 md:max-w-sm">
                  <OfferCtaButton section="steps">{tile.cta}</OfferCtaButton>
                  <p className="mt-2 text-sm text-black/60">{tile.renewal}</p>
                </div>
              </div>
            </section>
          </TrackedSection>

          <TrackedSection section="faq">
            <section aria-label="Frequently asked questions" className="brand-section brand-bg-white">
              <div className="brand-track">
                <LabFAQ items={faqItems} hideCTA showSeeAllLink={false} />
              </div>
            </section>
          </TrackedSection>

          {/* Bottom padding clears the fixed sticky bar. Inline because
              .brand-section's padding is unlayered CSS and beats utilities. */}
          <footer
            className="brand-section brand-bg-tint text-sm text-black/60"
            style={{ paddingBottom: "7rem" }}
          >
            <div className="brand-track flex flex-wrap items-center gap-x-5 gap-y-2">
              <span>© CONKA</span>
              <Link href="/terms" className="underline decoration-black/20 underline-offset-4 hover:text-black">
                Terms
              </Link>
              <Link href="/privacy" className="underline decoration-black/20 underline-offset-4 hover:text-black">
                Privacy
              </Link>
            </div>
          </footer>
        </main>

        <OfferStickyBar label={config.sticky.label} cta={config.sticky.cta} />
      </OfferPurchaseProvider>
    </SectionImpressions>
  );
}

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-[2px] shrink-0">
      <circle cx="12" cy="12" r="10" fill="var(--brand-positive)" />
      <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
