'use client';

/**
 * CONKA — a single buy card (bundle or single shot), straight-to-checkout.
 *
 * State: subscription on/off (default on) and, for the single card, Flow/Clear.
 * Prices/IDs come from live Shopify data (fetched in app/lander/page.tsx).
 * Clicking the CTA creates a cart + redirects to checkout via landerCheckout().
 */

import {useState} from 'react';
import styles from './BuyBoxes.module.css';
import {OFFER, GUARANTEE} from './buyboxes.data';
import FreeShotsBadge from '@/app/components/FreeShotsBadge';
import {landerCheckout} from './lander-checkout';

const VanIcon = () => (
  <span className={styles.offerIcon}>
    <svg viewBox="0 0 24 24" fill="none" stroke="#1B2757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width: 48, height: 48}}>
      <path d="M1 5h13v11H1zM14 8h4l3 3v5h-7z" />
      <circle cx="5.5" cy="18.5" r="1.8" />
      <circle cx="17.5" cy="18.5" r="1.8" />
    </svg>
  </span>
);

type LanderProduct = 'flow' | 'clear' | 'both';

interface LivePrice {
  price: string | null;
  perShot: string;
  /** Variant this purchase type checks out (sub and OTP differ). */
  variantId?: string;
  strike?: string | null;
  sellingPlanId?: string;
  /** Numeric price for analytics. */
  amount?: number;
  /** Free bonus shots on the first subscription order. */
  freeShots?: number | null;
}
interface LiveData {
  title: string;
  variantId: string;
  available: boolean;
  /** Null when no one-time variant exists in Shopify — the card then hides the toggle. */
  oneTime: LivePrice | null;
  subscription: LivePrice | null;
}
export interface CardOption {
  key: string;
  label: string;
  title: string;
  image: string;
  imageAlt: string;
  live: LiveData | null;
  product: LanderProduct;
}
export interface CardConfig {
  description: string;
  image?: string;
  imageAlt?: string;
  title?: string;
  live?: LiveData | null;
  product?: LanderProduct;
  options?: CardOption[];
}

export default function BuyCard({data}: {data: CardConfig}) {
  const [subscription, setSubscription] = useState(true);
  const [optionKey, setOptionKey] = useState(data.options?.[0]?.key ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const option = data.options?.find((o) => o.key === optionKey);
  const image = option?.image ?? data.image;
  const imageAlt = option?.imageAlt ?? data.imageAlt;
  const title = option?.title ?? data.title;
  const live = option?.live ?? data.live ?? null;

  const canSubscribe = Boolean(live?.subscription);
  // No one-time variant in Shopify (2026-07-16 rebuild) — force subscription so the
  // card cannot show a one-time price it has no variant to charge.
  const canBuyOnce = Boolean(live?.oneTime);
  const isSub = canSubscribe && (subscription || !canBuyOnce);
  const priceSet: LivePrice | null = isSub ? live?.subscription ?? null : live?.oneTime ?? null;

  async function handleCheckout() {
    // Sub and OTP use different variants — pick the one for the active type. No
    // fallback to live.variantId: that is the subscription variant, so a missing
    // one-time variant would silently charge the sub price under a one-time label.
    const checkoutVariantId = isSub
      ? live?.subscription?.variantId
      : live?.oneTime?.variantId;
    if (!checkoutVariantId || loading) return;
    setLoading(true);
    setError(false);
    try {
      await landerCheckout({
        variantId: checkoutVariantId,
        sellingPlanId: isSub ? live?.subscription?.sellingPlanId : undefined,
        product: option?.product ?? data.product,
        purchaseType: isSub ? 'subscription' : 'one-time',
        price: priceSet?.amount,
      });
    } catch (e) {
      console.error('Checkout failed', e);
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className={`${styles.card} ${data.options ? styles.single : ''}`}>
      <div className={styles.image}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={imageAlt} />
      </div>

      <div className={styles.content}>
        {data.options && (
          <div className={styles.singleToggle} role="tablist" aria-label="Choose your shot">
            {data.options.map((o) => (
              <button
                key={o.key}
                type="button"
                role="tab"
                aria-selected={o.key === optionKey}
                className={`${styles.singleTab} ${o.key === optionKey ? styles.singleTabActive : ''}`}
                onClick={() => setOptionKey(o.key)}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.priceBig}>{priceSet?.price ?? '—'}</p>
          <div className={styles.priceSmall}>
            {isSub && priceSet?.strike && (
              <>
                <span className={styles.strike}>{priceSet.strike}</span>
                <span className={styles.sep}>|</span>
              </>
            )}
            <span>{priceSet?.perShot}</span>
          </div>
          <FreeShotsBadge
            freeShots={priceSet?.freeShots ?? undefined}
            cadence={isSub ? 'monthly-sub' : 'monthly-otp'}
            className="mt-1.5"
          />
          <p className={styles.desc}>{data.description}</p>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.offerCard}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isSub}
              // Locked on when there is no one-time variant to switch to.
              disabled={!canSubscribe || !canBuyOnce}
              onChange={(e) => setSubscription(e.target.checked)}
              aria-label="Subscribe & Save up to 33%"
            />
            <div className={styles.offerContent}>
              <span className={styles.offerHead}>{OFFER.head}</span>
              <span className={styles.offerLine}>{OFFER.line}</span>
              <span className={styles.offerSub}>{OFFER.sub}</span>
            </div>
            <VanIcon />
          </div>

          <button
            type="button"
            className={`${styles.cta} ${isSub ? '' : styles.ctaOnce}`}
            onClick={handleCheckout}
            disabled={!live?.available || loading}
          >
            {loading ? 'Loading…' : isSub ? 'Start Now' : 'Buy Once'}
          </button>

          {error && (
            <p className={styles.checkoutError} role="alert">
              Something went wrong. Please try again.
            </p>
          )}

          {isSub && (
            <div className={styles.bottomText}>
              {GUARANTEE.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
