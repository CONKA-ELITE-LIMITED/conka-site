/**
 * CONKA — dark "brain fuel" band. Server component.
 *
 * Looping muted video (the CONKA shot render) + a headline + four proof
 * stats. The figures are editorial — verify sources before launch (see
 * README compliance note).
 *
 * Video: /lander/video/Flow.webm. Add a poster frame for nicer first paint.
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

export default function BrainFuelBand() {
  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <video
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/lander/video/BrainFuel.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.details}>
          <p className={styles.description}>
            Trusted where focus can&rsquo;t fail —{' '}
            <b>
              by olympic medallists, world-class athletes &amp; entrepreneurs on the days that
              matter most.
            </b>
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
    </section>
  );
}
