'use client';

/**
 * Dual offer block (offer trial B) — the Both bundle card + a single card with a
 * Flow/Clear toggle, straight-to-Shopify checkout via BuyCard.
 *
 * Extracted so both /lander-b and /start-b show the same offer. Renders a single
 * stacked column by default (mobile-first); pass a wider container to lay the two
 * cards side by side. Card data (prices, variants, free shots) is built here from
 * the canonical funnel catalogue so it stays in lockstep with the rest of the trial.
 */

import BuyCard, { type CardConfig } from './BuyCard';
import {
  getOfferVariant,
  getOfferPricing,
  type FunnelProduct,
} from '../../../lib/funnelData';

const money = (n: number) => '£' + n.toFixed(2);
const perShot = (n: number) => '£' + n.toFixed(2) + '/shot';

const CARD_TITLE: Record<FunnelProduct, string> = {
  flow: 'CONKA Flow',
  clear: 'CONKA Clear',
  both: 'CONKA – Flow & Clear',
};

function buildCard(product: FunnelProduct) {
  const subVariant = getOfferVariant(product, 'monthly-sub');
  const otpVariant = getOfferVariant(product, 'monthly-otp');
  const subPricing = getOfferPricing(product, 'monthly-sub');
  const otpPricing = getOfferPricing(product, 'monthly-otp');

  const variantId = subVariant?.variantId ?? otpVariant?.variantId ?? '';

  return {
    title: CARD_TITLE[product],
    variantId,
    available: Boolean(variantId),
    oneTime: {
      price: money(otpPricing.price),
      perShot: perShot(otpPricing.perShot),
      amount: otpPricing.price,
      postage: otpPricing.postage ?? null,
    },
    subscription: subVariant
      ? {
          sellingPlanId: subVariant.sellingPlanId,
          price: money(subPricing.price),
          perShot: perShot(subPricing.perShot),
          strike: subPricing.compareAtPrice ? money(subPricing.compareAtPrice) : null,
          amount: subPricing.price,
          freeShots: subPricing.freeShots ?? null,
        }
      : null,
  };
}

interface OfferCardsProps {
  /** Analytics source tag passed to checkout (defaults to the lander). */
  source?: string;
  /** Extra classes on the cards container (e.g. to lay out side-by-side). */
  className?: string;
}

export default function OfferCards({ source, className = '' }: OfferCardsProps) {
  const bundleCard: CardConfig = {
    description: '40 shots + 16 free shots on your first order',
    image: '/formulas/both/BothNew.jpg',
    imageAlt: 'CONKA Flow & Clear bundle',
    title: 'CONKA – Flow & Clear',
    live: buildCard('both'),
    product: 'both',
    source,
  };
  const singleCard: CardConfig = {
    description: '20 shots + 8 free shots on your first order',
    source,
    options: [
      { key: 'flow', label: 'Flow · AM', title: 'CONKA Flow', image: '/lander/FlowNew.jpg', imageAlt: 'CONKA Flow', live: buildCard('flow'), product: 'flow' },
      { key: 'clear', label: 'Clear · PM', title: 'CONKA Clear', image: '/lander/ClearNew.jpg', imageAlt: 'CONKA Clear', live: buildCard('clear'), product: 'clear' },
    ],
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <BuyCard data={bundleCard} />
      <BuyCard data={singleCard} />
    </div>
  );
}
