"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import GuaranteeRow from "@/app/components/landing/GuaranteeRow";
import { formatPrice } from "@/app/lib/productData";
import {
  CadenceType,
  getCadencePricingByProductHeroId,
  FUNNEL_CADENCES,
} from "@/app/lib/cadenceData";
import {
  getProductHeroImages,
  getProductHeroImagesMobile,
} from "@/app/lib/heroImageConfig";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
  getPriceFrequency,
  getTileChecklist,
  getCTAMeta,
} from "@/app/lib/productHeroHelpers";
import ProductImageSlideshow from "@/app/components/product/ProductImageSlideshow";
import HeroAccordions from "@/app/components/product/HeroAccordions";
import TileChecklist from "@/app/components/product/TileChecklist";

/* ============================================================================
 * ListicleProductHero (+ Mobile)
 *
 * Landing-optimised fork of ProductHero/ProductHeroMobile for /go listicle
 * pages, following the IM8 buy-box pattern: only the two subscription
 * cadences render as selectable cards (quarterly leads), and one-time
 * purchase is demoted to a small underlined text link below the cards.
 * Corners are square (no brand-card radius). PDP behaviour is otherwise
 * preserved: same pricing helpers, checklist, CTA meta and accordions.
 * ========================================================================== */

interface ListicleProductHeroProps {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
}

const SUB_CADENCES: CadenceType[] = ["quarterly-sub", "monthly-sub"];

function PlanSelector({
  formulaId,
  selectedCadence,
  onCadenceChange,
}: Omit<ListicleProductHeroProps, "onAddToCart">) {
  const otpPricing = getCadencePricingByProductHeroId(formulaId, "monthly-otp");
  const otpSelected = selectedCadence === "monthly-otp";

  return (
    <div className="flex flex-col gap-3">
      {SUB_CADENCES.map((cadence) => {
        const display = FUNNEL_CADENCES[cadence];
        const isSelected = selectedCadence === cadence;
        const cadencePricing = getCadencePricingByProductHeroId(
          formulaId,
          cadence,
        );
        const frequency = getPriceFrequency(cadence);
        const bannerLabel = display.badge;

        return (
          <button
            key={isSelected ? `active-${cadence}` : cadence}
            type="button"
            onClick={() => onCadenceChange(cadence)}
            className={`relative w-full select-none overflow-hidden border-2 bg-white text-left transition-all duration-200 ${
              isSelected
                ? "card-pulse border-[#1B2757] shadow-md"
                : "border-black/10 shadow-sm hover:border-black/25"
            }`}
          >
            {bannerLabel && (
              <div className="bg-[#1B2757] px-4 py-1.5 text-center font-mono text-[10px] font-bold uppercase leading-none tracking-[0.16em] text-white">
                {bannerLabel}
              </div>
            )}

            <div className={isSelected ? "p-4" : "px-4 py-3"}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-[#1B2757] bg-[#1B2757]"
                        : "border-black/30 bg-white"
                    }`}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={`transition-all duration-200 ${isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                    >
                      <path
                        d="M2.5 8.5L6.5 12L13.5 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${isSelected ? "text-lg text-[var(--brand-black)]" : "text-base text-black/65"}`}
                    >
                      {display.label}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.12em] ${
                        isSelected
                          ? "bg-[#1B2757]/10 text-[#1B2757]"
                          : "bg-black/[0.05] text-black/55"
                      }`}
                    >
                      {cadencePricing.shotCount} shots · 1/day
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p
                    className={`font-semibold tabular-nums ${isSelected ? "text-base text-[var(--brand-black)]" : "text-sm text-black/60"}`}
                  >
                    {formatPrice(cadencePricing.perShot)}
                    <span className="font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-black/40">
                      /shot
                    </span>
                  </p>
                  {!isSelected && (
                    <p className="mt-0.5 font-mono text-[10px] uppercase tabular-nums tracking-[0.12em] text-black/40">
                      {formatPrice(cadencePricing.price)}
                      {frequency}
                    </p>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="ml-8 mt-4 space-y-3 border-t border-black/10 pt-4">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums text-[var(--brand-black)]">
                      {formatPrice(cadencePricing.price)}
                      <span className="text-base font-semibold">
                        {frequency}
                      </span>
                    </span>
                    {cadencePricing.compareAtPrice && (
                      <>
                        <span className="font-mono text-[10px] uppercase tabular-nums tracking-[0.14em] text-black/40 line-through">
                          {formatPrice(cadencePricing.compareAtPrice)}
                        </span>
                        <span className="font-mono text-[10px] font-semibold uppercase tabular-nums tracking-[0.14em] text-[#1B2757]">
                          Save{" "}
                          {formatPrice(
                            cadencePricing.compareAtPrice -
                              cadencePricing.price,
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  <TileChecklist
                    items={getTileChecklist(cadence, cadencePricing.shotCount)}
                  />
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* One-time purchase demoted to a text link, IM8-style */}
      <button
        type="button"
        onClick={() => onCadenceChange("monthly-otp")}
        className={`mx-auto mt-1 w-fit text-center text-sm underline underline-offset-4 transition-colors ${
          otpSelected
            ? "font-semibold text-[#1B2757]"
            : "text-black/55 hover:text-black"
        }`}
      >
        One time purchase · {formatPrice(otpPricing.price)}
        {otpSelected ? " ✓" : ""}
      </button>
    </div>
  );
}

function BuyPanel({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
}: ListicleProductHeroProps) {
  const content = getHeroContent(formulaId);
  const pricing = getCadencePricingByProductHeroId(formulaId, selectedCadence);

  return (
    <>
      <div className="mb-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <div className="flex" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-[#1B2757]"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="brand-data text-black/60">{content.soldCount}</span>
        </div>
        <h2
          className="brand-h1 leading-tight lg:!text-[2.25rem]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {content.name}
        </h2>
        <p
          className="mb-3 mt-0 text-lg leading-snug text-black/65"
          style={{ letterSpacing: "-0.01em" }}
        >
          {content.tagline}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-black/75 md:text-base">
        {content.headline}
      </p>

      <PlanSelector
        formulaId={formulaId}
        selectedCadence={selectedCadence}
        onCadenceChange={onCadenceChange}
      />

      <div>
        <ConkaCTAButton
          onClick={onAddToCart}
          meta={getCTAMeta(selectedCadence, pricing)}
          className="w-full max-w-none"
        >
          Add to Cart
        </ConkaCTAButton>
        <GuaranteeRow />
      </div>

      <HeroAccordions productType={getHeroProductType(formulaId)} />
    </>
  );
}

export function ListicleProductHeroMobile(props: ListicleProductHeroProps) {
  const content = getHeroContent(props.formulaId);
  const images = getProductHeroImagesMobile(
    props.formulaId,
    props.selectedCadence,
  ).map((src) => ({ src }));

  return (
    <>
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#FAFAFA]">
        <ProductImageSlideshow
          key={props.selectedCadence}
          images={images}
          alt={`${content.name} bottle`}
          fullBleedThumbnails
          hideThumbnails
        />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-3 pt-3">
        <BuyPanel {...props} />
      </div>
    </>
  );
}

export default function ListicleProductHero(props: ListicleProductHeroProps) {
  const content = getHeroContent(props.formulaId);
  const images = getProductHeroImages(props.formulaId, props.selectedCadence).map(
    (src) => ({ src }),
  );

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)] lg:flex-row lg:items-start lg:justify-center">
      {/* IM8 gallery pattern: primary image, thumbnail strip below */}
      <div className="relative z-0 order-1 lg:sticky lg:top-8 lg:w-[58%] lg:flex-shrink-0 lg:self-start">
        <ProductImageSlideshow
          key={props.selectedCadence}
          images={images}
          alt={`${content.name} bottle`}
        />
      </div>

      <div className="relative z-10 order-2 min-w-0 flex-1 lg:sticky lg:top-8 lg:w-[40%] lg:flex-shrink-0 lg:self-start">
        <div
          className="relative z-10 flex flex-col gap-[var(--brand-space-s)] bg-white lg:gap-[var(--brand-space-m)]"
          style={{
            paddingLeft: "var(--brand-space-m)",
            paddingRight: "var(--brand-space-m)",
            paddingTop: "var(--brand-space-s)",
            paddingBottom: "var(--brand-space-m)",
          }}
        >
          <BuyPanel {...props} />
        </div>
      </div>
    </div>
  );
}
