/**
 * CONKA — Hero. Server component (no interactivity).
 *
 * Rebuilt from the prototype (originally Ketone's `hero-campaign`). The CTA
 * scrolls to the buy section; point `href` at your buy-box anchor/route.
 *
 * Image: /lander/hero.jpg (woman drinking a CONKA shot). Swap to next/image
 * with priority for LCP if you like — it's the largest-contentful element.
 */

import Image from 'next/image';
import styles from './Hero.module.css';

const Star = () => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 15 15">
    <path
      d="M7.5 10.75l-3.82 2.009.73-4.255-3.092-3.013 4.272-.62L7.5 1l1.91 3.87 4.272.621-3.091 3.013.73 4.255z"
      fill="#E9B200"
      fillRule="evenodd"
    />
  </svg>
);

interface HeroProps {
  /** Anchor/route for the CTA. */
  ctaHref?: string;
}

export default function Hero({ ctaHref = '#purchase-section' }: HeroProps) {
  return (
    <section className={styles.section}>
      <div className={styles.media}>
        {/* LCP element — priority + fetchpriority high so it's discovered early;
            next/image serves AVIF/WebP + responsive srcset. The .img class
            (width:100%, aspect-ratio, object-fit) still drives layout. */}
        <Image
          className={styles.img}
          src="/lander/hero.jpg"
          alt="Drinking a CONKA brain shot"
          width={786}
          height={558}
          priority
          sizes="(min-width: 1000px) 50vw, 100vw"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <div className={styles.rating}>
              <span className={styles.stars} aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </span>
              <p className={styles.ratingText}>250,000 shots sold</p>
            </div>

            <h1 className={styles.title}>
              Brain Performance
              <br />
              in a Shot
            </h1>

            <div className={styles.desc}>
              A patented nootropic shot, formulated
              <br />
              to support focus, memory, and mental endurance every single day.
              <div className={styles.spacer8} />
              <ul className={styles.benefits}>
                <li>🏷️ 43% off your first month</li>
                <li>🚚 Free shipping every month</li>
              </ul>
            </div>
          </div>

          <a className={styles.btn} href={ctaHref}>
            Get your 43% off
          </a>
        </div>
      </div>
    </section>
  );
}
