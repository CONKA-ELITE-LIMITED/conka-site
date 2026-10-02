"use client";

import OfferHero from "@/app/components/go/offer/OfferHero";
import { OfferPurchaseProvider } from "@/app/components/go/offer/OfferPurchase";
import { buildOptionView } from "@/app/components/go/offer/offerOptionView";
import type { OfferConfig } from "@/app/lib/landings/offer-types";
import { SECTION } from "./listicleAnalytics";

/**
 * Listicle buy zone in offer mode (SCRUM-1514): the /go/trial-pack hero, with
 * its pack selector and straight-to-checkout CTA, in place of
 * ListicleProductHero's PDP hero.
 *
 * The provider takes the listicle's slug, not the offer's, so option picks and
 * the order's `_listicle_origin` (`<slug>-product`) report against this page.
 * The heading drops to h2 under the listicle's own h1. No offer sticky bar:
 * the listicle keeps its own.
 */
export default function ListicleOfferHero({
  slug,
  offer,
}: {
  slug: string;
  offer: OfferConfig;
}) {
  const options = offer.options.map(buildOptionView);
  const fromPrice = Math.min(...options.map((o) => o.price));

  return (
    <OfferPurchaseProvider
      slug={slug}
      options={options}
      defaultOption={offer.defaultOption}
    >
      <OfferHero
        config={offer}
        fromPrice={fromPrice}
        headingLevel="h2"
        ctaSection={SECTION.product}
      />
    </OfferPurchaseProvider>
  );
}
