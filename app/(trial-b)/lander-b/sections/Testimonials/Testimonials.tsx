/**
 * CONKA — "Trusted by the Best in the World." testimonials. Server component.
 *
 * Mobile: three cards stacked. Desktop (≥1000px): three across, centred.
 * The prototype's carousel pagination is hidden at both the mobile and desktop
 * breakpoints (it only surfaces in a narrow tablet band), so the rendered
 * states need no carousel JS.
 *
 * CTA scrolls to the buy section — point `ctaHref` at your buy-box anchor/route.
 */

import styles from './Testimonials.module.css';
import { TESTIMONIALS } from './testimonials.data';

interface TestimonialsProps {
  ctaHref?: string;
}

export default function Testimonials({ ctaHref = '#purchase-section' }: TestimonialsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Trusted by the Best in the World.</h2>
        <p className={styles.desc}>
          We surround ourselves with pioneers across business, athletics and science.{' '}
          <b>We take performance seriously. Our partners do, too.</b>
        </p>
      </div>

      <div className={styles.cards}>
        {TESTIMONIALS.map((t) => (
          <figure
            className={`${styles.card} ${t.variant === 'navy' ? styles.cardNavy : ''}`}
            key={t.name}
          >
            <img className={styles.cardImg} src={t.image} alt={t.name} loading="lazy" />
            <div className={styles.cardBody}>
              <p className={styles.author}>
                {t.name}, <b>{t.role}</b>
              </p>
              <blockquote className={styles.quote}>{t.quote}</blockquote>
            </div>
          </figure>
        ))}
      </div>

      <div className={styles.cta}>
        <a className={styles.ctaBtn} href={ctaHref}>
          Join them today
        </a>
      </div>
    </section>
  );
}
