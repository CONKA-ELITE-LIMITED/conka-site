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

// Small 4-point sparkle — replaces the emoji on the free-shots badge (brand has no emoji).
const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true" style={{flexShrink: 0}}>
    <path d="M12 2l1.7 6.1L20 10l-6.3 1.9L12 18l-1.7-6.1L4 10l6.3-1.9z" />
  </svg>
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
  /** Offer trial (B): free bonus shots on first subscription order. */
  freeShots?: number | null;
  /** Offer trial (B): compulsory postage (£) on one-time orders. */
  postage?: number | null;
}
interface LiveData {
  title: string;
  variantId: string;
  available: boolean;
  oneTime: LivePrice;
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
  /** Analytics source tag for checkout (defaults to the lander). */
  source?: string;
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
  const isSub = subscription && canSubscribe;
  const priceSet: LivePrice | null = isSub ? live?.subscription ?? null : live?.oneTime ?? null;

  async function handleCheckout() {
    // Sub and OTP now use different variants — pick the one for the active type.
    const checkoutVariantId =
      (isSub ? live?.subscription?.variantId : live?.oneTime?.variantId) ?? live?.variantId;
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
        source: data.source,
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
        <img src={image} alt={imageAlt} loading="lazy" />
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
          <p className={styles.desc}>{data.description}</p>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.offerCard}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isSub}
              disabled={!canSubscribe}
              onChange={(e) => setSubscription(e.target.checked)}
              aria-label="Subscribe & Save 31%"
            />
            <div className={styles.offerContent}>
              <span className={styles.offerHead}>{OFFER.head}</span>
              <span className={styles.offerLine}>{OFFER.line}</span>
              {live?.subscription?.freeShots ? (
                <span className={styles.freeShots}>
                  <span className={styles.freeShotsBadge}>
                    <SparkleIcon /> {live.subscription.freeShots} FREE shots
                  </span>{' '}
                  on your first order
                </span>
              ) : null}
              <span className={styles.offerSub}>{OFFER.sub}</span>
            </div>
            <VanIcon />
          </div>

          {!isSub && priceSet?.postage ? (
            <p className={styles.otpNote}>
              One-time purchase · +£{priceSet.postage.toFixed(2)} postage at checkout
            </p>
          ) : null}

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
