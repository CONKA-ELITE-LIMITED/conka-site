/**
 * CONKA — "brain fuel" proof section. Server component.
 *
 * Light section built around the bright BothNeuronFloat footage: the clip
 * runs full-bleed at its native 3:4 on mobile, its pale studio edges
 * sitting naturally against the white section. The proof — headline,
 * medallists line + four metrics — sits on a light-grey card in black,
 * the four stats centred in a hairline-divided 2x2 grid. Desktop: clip
 * left in a rounded tile, headline above the proof card right.
 *
 * The headline renders twice (inside the card for mobile, column heading
 * for desktop); each copy is display:none at the other breakpoint, so
 * assistive tech sees exactly one.
 *
 * Video: the /videos/both/BothNeuronFloat trio (webm + mp4 + poster), per
 * VIDEO_OPTIMISATION.md. WebM is listed first so supporting browsers fetch
 * the lighter file (652KB vs 724KB).
 */

import type { ReactNode } from 'react';
import styles from './BrainFuelBand.module.css';

interface Metric {
  value: string;
  /** Superscript-style unit, e.g. "%" or ".3%". Optional. */
  small?: string;
  label: ReactNode;
}

const METRICS: Metric[] = [
  { value: '75', small: '%', label: <>improved cognitive<br />function in under 3 weeks</> },
  { value: '19', small: '.3%', label: <>better focus in<br />professional athletes</> },
  { value: '89', small: '%', label: <>saw an uplift<br />in test score</> },
  { value: '4', label: <>clinical<br />trials</> },
];

const TITLE = <>Trusted where focus can&rsquo;t fail</>;

export default function BrainFuelBand() {
  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        <div className={styles.media}>
          {/* preload="metadata" so the clip isn't fully downloaded on page
              load — it's below the fold. Browser fetches it when the autoplay
              element scrolls into range. */}
          <video
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/videos/both/BothNeuronFloat-poster.jpg"
          >
            <source src="/videos/both/BothNeuronFloat.webm" type="video/webm" />
            <source src="/videos/both/BothNeuronFloat.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.details}>
          <h2 className={`${styles.title} ${styles.titleDesktop}`}>{TITLE}</h2>

          {/* Proof card: title (mobile), medallists line + the 2x2 stat grid */}
          <div className={styles.card}>
            <h2 className={`${styles.title} ${styles.titleMobile}`}>{TITLE}</h2>
            <p className={styles.description}>
              By Olympic medallists, world-class athletes &amp; entrepreneurs
              on the days that matter most.
            </p>

            <div className={styles.metrics}>
              {METRICS.map((m, i) => (
                <div className={styles.metric} key={i}>
                  <div className={styles.value}>
                    {m.value}
                    {m.small && <small>{m.small}</small>}
                  </div>
                  <p className={styles.label}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
