/**
 * CONKA — site footer. Server component; the accordions are native <details>
 * so the +/- toggle works with zero JS.
 *
 * In Hydrogen/Remix, swap the <a href> for <Link to> and point them at real
 * product handles / page routes. Defaults open on desktop is a nice touch you
 * can add with a CSS media query (details[open]) if wanted.
 */

import styles from './Footer.module.css';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'FLOW', href: '/products/flow' },
      { label: 'CLEAR', href: '/products/clear' },
      { label: 'Flow + Clear', href: '/products/both' },
      { label: 'Shop All', href: '/products/both' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Science', href: '/pages/science' },
      { label: 'Our Partners', href: '/pages/partners' },
      { label: 'About Us', href: '/pages/about' },
      { label: 'Reviews', href: '/pages/reviews' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/pages/contact' },
      { label: 'FAQ', href: '/pages/faq' },
      { label: 'Shipping & Returns', href: '/pages/shipping' },
      { label: 'Manage Subscription', href: '/pages/subscription' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <img className={styles.logo} src="/lander/conka-logo.webp" alt="CONKA" />

      <div className={styles.cols}>
        {COLUMNS.map((col) => (
          <details className={styles.sec} key={col.title}>
            <summary>
              {col.title}
              <span className={styles.pm}>
                <span className={styles.pmPlus}>+</span>
                <span className={styles.pmMinus}>−</span>
              </span>
            </summary>
            <div className={styles.links}>
              {col.links.map((l) => (
                <a href={l.href} key={l.label}>
                  {l.label}
                </a>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className={styles.contact}>
        <p className={styles.addr}>
          <b>CONKA Elite Limited</b>
          <br />
          The Light Bulb, 1 Filament Walk, U 107 Conka,
          <br />
          London, SW18 4GQ
        </p>
        <p className={styles.contactLine}>
          Email us: <a href="mailto:info@conka.io">info@conka.io</a>
        </p>
        <div className={styles.social}>
          <a href="https://instagram.com/conka.io" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @conka.io
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.disclaimer}>
          Food supplements should not be used as a substitute for a varied, balanced diet and a
          healthy lifestyle.
        </p>
        <p className={styles.copy}>
          © CONKA 2026 · Made in UK · All rights reserved
          <br />
          <b>CONKA ELITE LIMITED</b>
        </p>
      </div>
    </footer>
  );
}
