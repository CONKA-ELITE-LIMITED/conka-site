import { getHeroProductType } from "@/app/lib/productHeroHelpers";
import { MM_GALLERY_ASSETS } from "@/app/lib/mmPdpData";
import {
  getChargedPrice,
  getOfferPricing,
  getOfferVariant,
} from "@/app/lib/offerData";
import type { OfferOption, OfferOptionView } from "@/app/lib/landings/offer-types";

/**
 * An option plus everything the client needs, derived from offerData so the
 * monthly and one-time figures match the rest of the site. Throws at build time
 * rather than shipping an option whose buy-once link cannot check out.
 *
 * Shared by the offer page (OfferRenderer) and the im8 listicle's trial-pack
 * buy zone (ListicleOfferHero, SCRUM-1514), so both quote the same figures.
 */
export function buildOptionView(option: OfferOption): OfferOptionView {
  const product = getHeroProductType(option.heroId);
  const monthly = getOfferPricing(product, "monthly-sub");
  const oneTimePricing = getOfferPricing(product, "monthly-otp");
  const oneTimeVariant = getOfferVariant(product, "monthly-otp");
  if (!oneTimeVariant) {
    throw new Error(`Trial offer: no one-time variant for "${product}"`);
  }

  const oneTimePrice = getChargedPrice(oneTimePricing);

  const galleryImages = [
    ...(option.galleryLead ? [option.galleryLead] : []),
    ...MM_GALLERY_ASSETS[option.heroId],
  ];
  // The explainer goes 2nd, straight after the lead: how the trial works is the
  // first question the offer raises.
  if (option.explainerSlide) galleryImages.splice(1, 0, option.explainerSlide);

  const gifts = monthly.gifts ?? [];
  return {
    ...option,
    product,
    galleryImages,
    monthly: { price: monthly.price, shots: monthly.shotCount },
    oneTime: {
      variantId: oneTimeVariant.variantId,
      price: oneTimePrice,
      shots: oneTimePricing.shotCount,
    },
    starterPack: {
      shots: monthly.firstOrderShots ?? monthly.shotCount,
      freeShots: monthly.freeShots ?? 0,
      gifts: gifts.map((gift) => gift.label),
      value:
        (monthly.compareAtPrice ?? monthly.price) +
        (monthly.freeShotsValue ?? 0) +
        gifts.reduce((total, gift) => total + gift.rrp, 0),
    },
  };
}

/** The cheapest pack's price: the "from" figure every trial headline and CTA quotes. */
export function getTrialFromPrice(options: readonly { price: number }[]): number {
  return Math.min(...options.map((o) => o.price));
}
