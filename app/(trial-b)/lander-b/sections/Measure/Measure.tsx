'use client';


/**
 * CONKA — "We don't ask if CONKA works. We measure it." (the app section).
 *
 * Two scroll-triggered effects, both fired by an IntersectionObserver that
 * adds `styles.isIn`:
 *   1) SVG line draws (stroke-dash, length measured via getTotalLength()).
 *   2) Cognitive score counts up 72 → 89 via requestAnimationFrame.
 *
 * Static content. The App Store / Google Play hrefs are placeholders — point
 * them at CONKA's real listings.
 */

import { useEffect, useRef, useState } from 'react';
import styles from './Measure.module.css';

const FROM = 72;
const TO = 89;

const STEPS = [
  { n: '1', title: 'Install & test', desc: 'Set your baseline' },
  { n: '2', title: 'Take daily', desc: 'Flow AM, Clear PM' },
  { n: '3', title: 'Track over time', desc: 'Watch it climb' },
];

export default function Measure() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [score, setScore] = useState(FROM);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const line = sec.querySelector<SVGPathElement>('[data-meas-draw]');
    if (line) {
      try {
        line.style.setProperty('--len', String(Math.ceil(line.getTotalLength())));
      } catch {
        /* no-op on SSR / unsupported */
      }
    }

    let raf = 0;
    const countUp = () => {
      const dur = 1400;
      let start: number | null = null;
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / dur, 1);
        setScore(Math.round(FROM + (TO - FROM) * p));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            sec.classList.add(styles.isIn);
            countUp();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(sec);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          We don&rsquo;t ask if CONKA works.
          <br />
          We measure it.
        </h2>
        <p className={styles.sub}>
          Take CONKA daily and run the cognitive test in the app whenever you want. After a month,
          the numbers tell you whether it worked.
        </p>
      </div>

      <div className={styles.app}>
        <div className={styles.appTop}>
          <span className={styles.appLabel}>Your cognitive score</span>
        </div>
        <div className={styles.appRise}>
          <b>{score}</b>
          <span>↑ trending up over 30 days</span>
        </div>
        <svg className={styles.svg} viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cognitive score rising over 30 days">
          <defs>
            <linearGradient id="measGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E9B200" />
              <stop offset="100%" stopColor="#6BD37B" />
            </linearGradient>
            <linearGradient id="measFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6BD37B" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6BD37B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="20" y1="118" x2="300" y2="118" stroke="rgba(255,255,255,.10)" strokeWidth="1" />
          <line x1="20" y1="74" x2="300" y2="74" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
          <path className={styles.area} d="M20,106 C70,98 90,90 132,78 C175,66 210,54 300,40 L300,118 L20,118 Z" fill="url(#measFill)" />
          <path className={styles.line} data-meas-draw d="M20,106 C70,98 90,90 132,78 C175,66 210,54 300,40" />
          <circle className={styles.dot} cx="20" cy="106" r="4.5" fill="#E9B200" />
          <circle className={styles.dot} cx="300" cy="40" r="5.5" fill="#6BD37B" stroke="#18233F" strokeWidth="2" />
          <text className={styles.axis} x="20" y="138" textAnchor="start">Day 1</text>
          <text className={styles.axis} x="160" y="138" textAnchor="middle">Day 14</text>
          <text className={styles.axis} x="300" y="138" textAnchor="end">Day 30</text>
        </svg>
      </div>

      <div className={styles.steps}>
        {STEPS.map((s) => (
          <div className={styles.step} key={s.n}>
            <span className={styles.node}>{s.n}</span>
            <span className={styles.stepTitle}>{s.title}</span>
            <span className={styles.stepDesc}>{s.desc}</span>
          </div>
        ))}
      </div>

      <div className={styles.stores}>
        <a className={styles.store} href="#" aria-label="Download on the App Store">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.05 12.04c-.03-3.16 2.58-4.67 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.94-.2-3.79 1.14-4.78 1.14-.98 0-2.5-1.12-4.12-1.09-2.12.03-4.08 1.23-5.17 3.13-2.2 3.83-.56 9.5 1.58 12.61 1.05 1.52 2.3 3.23 3.93 3.17 1.58-.06 2.18-1.02 4.09-1.02 1.91 0 2.45 1.02 4.12.99 1.7-.03 2.78-1.55 3.82-3.08 1.2-1.76 1.7-3.47 1.72-3.56-.04-.02-3.3-1.27-3.34-5.06z M14.0 3.97c.87-1.05 1.46-2.5 1.3-3.95-1.25.05-2.77.83-3.67 1.88-.8.93-1.5 2.42-1.32 3.84 1.39.11 2.81-.71 3.69-1.77z" />
          </svg>
          <span>
            <small>Download on the</small>
            <b>App Store</b>
          </span>
        </a>
        <a className={styles.store} href="#" aria-label="Get it on Google Play">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.2 2.6c-.3.16-.5.48-.5.92v16.96c0 .44.2.76.5.92l9.06-9.4L4.2 2.6z" />
            <path d="M17.2 8.9 6.1 2.5l8.34 8.66L17.2 8.9z" opacity=".85" />
            <path d="M17.2 15.1l-2.76-3.94L6.1 21.5 17.2 15.1z" opacity=".7" />
            <path d="M20.5 10.6 17.2 8.9l-2.76 2.26 2.76 2.94 3.3-1.7c.9-.5.9-1.3 0-1.8z" />
          </svg>
          <span>
            <small>Get it on</small>
            <b>Google Play</b>
          </span>
        </a>
      </div>

      <div className={styles.guar}>
        <p className={styles.days}>
          <b>100</b> days to feel AND see the difference, or your money back.
        </p>
        <p className={styles.fine}>
          No returns. No hassles. No questions. The only thing you have to lose is the fog.
        </p>
      </div>
    </section>
  );
}
