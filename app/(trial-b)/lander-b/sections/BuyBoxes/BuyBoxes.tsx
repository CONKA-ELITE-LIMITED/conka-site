'use client';

/**
 * CONKA — Buy boxes section (standalone lander, straight-to-checkout).
 *
 * Mobile: stacked; desktop (≥1000px): two-column (intro + trust 2×2 left,
 * cards right). Card copy/imagery is static; prices/variant IDs/selling-plan IDs
 * come from the `data` prop (live Shopify data fetched in app/lander/page.tsx).
 */

import {useEffect, useState} from 'react';
import styles from './BuyBoxes.module.css';
import BuyCard, {type CardConfig} from './BuyCard';
import {PROMO} from './buyboxes.data';

function useMinWidth(px: number) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width:${px}px)`);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [px]);
  return match;
}

const NoCaffeineIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
    <path d="M17 9h2.2a2.4 2.4 0 0 1 0 5H17" />
    <path d="M7 2.5c-.6.8-.6 1.7 0 2.5M11 2.5c-.6.8-.6 1.7 0 2.5" />
    <line x1="3.5" y1="3.5" x2="20.5" y2="20.5" />
  </svg>
);
const ResearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3" />
    <line x1="7.3" y1="14" x2="16.7" y2="14" />
  </svg>
);
const NoSugarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="7" width="14" height="10" rx="2" />
    <path d="M9 7l3 5M15 7l-3 5" />
    <line x1="3.5" y1="3.5" x2="20.5" y2="20.5" />
  </svg>
);

function TrustItems() {
  return (
    <>
      <div className={styles.trustItem}>
        <span className={styles.trustMedia}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.trustLogo} src="/lander/partners/informed-sport.png" alt="Informed Sport certified" />
        </span>
      </div>
      <div className={styles.trustItem}>
        <span className={`${styles.trustMedia} ${styles.trustIcon}`}><NoCaffeineIcon /></span>
        <span className={styles.trustLabel}>No caffeine</span>
      </div>
      <div className={styles.trustItem}>
        <span className={`${styles.trustMedia} ${styles.trustIcon}`}><ResearchIcon /></span>
        <span className={styles.trustLabel}>£500k research</span>
      </div>
      <div className={styles.trustItem}>
        <span className={`${styles.trustMedia} ${styles.trustIcon}`}><NoSugarIcon /></span>
        <span className={styles.trustLabel}>No sugar</span>
      </div>
    </>
  );
}

export interface BuyData {
  bundle: any;
  flow: any;
  clear: any;
}

export default function BuyBoxes({data}: {data: BuyData}) {
  const isDesktop = useMinWidth(1000);

  const bundleCard: CardConfig = {
    description: 'Two 20-shot boxes + 16 free shots on your first order',
    image: '/formulas/both/BothNew.jpg',
    imageAlt: 'CONKA Flow & Clear bundle',
    title: 'CONKA – Flow & Clear',
    live: data.bundle,
    product: 'both',
  };
  const singleCard: CardConfig = {
    description: '20-shot box + 8 free shots on your first order',
    options: [
      {key: 'flow', label: 'Flow · AM', title: 'CONKA Flow', image: '/lander/FlowNew.jpg', imageAlt: 'CONKA Flow', live: data.flow, product: 'flow'},
      {key: 'clear', label: 'Clear · PM', title: 'CONKA Clear', image: '/lander/ClearNew.jpg', imageAlt: 'CONKA Clear', live: data.clear, product: 'clear'},
    ],
  };

  const intro = (
    <>
      <p className={styles.headerTitle}>Try CONKA today</p>
      <p className={styles.subhead}>
        Flow in the morning. Clear in the afternoon. Just two shots a day, every single day.
      </p>
    </>
  );
  const promo = (
    <div className={styles.promo}>
      <b>✅ Discount Auto-Applied.</b> {PROMO}
    </div>
  );
  const cards = (
    <div className={styles.cards}>
      <BuyCard data={bundleCard} />
      <BuyCard data={singleCard} />
    </div>
  );

  return (
    <section id="purchase-section" className={styles.section}>
      <div className={styles.inner}>
        {isDesktop ? (
          <>
            {promo}
            <div className={styles.body}>
              <div className={styles.intro}>
                {intro}
                <div className={`${styles.trust} ${styles.trustDesktop}`}>
                  <TrustItems />
                </div>
              </div>
              {cards}
            </div>
          </>
        ) : (
          <>
            <div className={styles.intro}>{intro}</div>
            {promo}
            {cards}
            <div className={`${styles.trust} ${styles.trustMobile}`}>
              <TrustItems />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
