'use client';


/**
 * CONKA — "Skip the 2pm crash" comparison chart.
 *
 * Faithful React/Next port of the approved prototype. The SVG line-draw is
 * scroll-triggered: an IntersectionObserver adds `styles.isIn` once the
 * section enters the viewport, which fires the CSS transitions. On mount we
 * measure each drawable path with getTotalLength() and set its `--len` so the
 * stroke-dash animation runs the exact path length.
 *
 * COMMERCE NOTE: the three figures (saving, coffee/day, shots/day) are passed
 * as props with the prototype values as defaults. When wiring Shopify, derive
 * `shotsPerDay` from the live "Both" subscription price; the rest is editorial.
 */

import { useEffect, useRef } from 'react';
import styles from './CrashChart.module.css';

interface CrashChartProps {
  /** Headline saving vs a monthly coffee habit. */
  saving?: string;
  coffeePerDay?: string;
  shotsPerDay?: string;
}

function CoffeeIcon({ stroke = '#1d1d1d', width = 1.6 }: { stroke?: string; width?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9h11v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z" />
      <path d="M16 10h2.2a2.2 2.2 0 0 1 0 4.4H16" />
      <path d="M8 3c-.5.7-.5 1.5 0 2.2M11.5 3c-.5.7-.5 1.5 0 2.2" />
    </svg>
  );
}

export default function CrashChart({
  saving = '£53',
  coffeePerDay = '£5.00/day',
  shotsPerDay = '£3.22/day',
}: CrashChartProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    // Measure each drawable path so the dash animation matches its length.
    sec.querySelectorAll<SVGPathElement>('[data-cmp-draw]').forEach((p) => {
      try {
        const len = p.getTotalLength();
        p.style.setProperty('--len', String(Math.ceil(len)));
      } catch {
        /* getTotalLength unavailable (SSR/old browser) — animation simply no-ops */
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            sec.classList.add(styles.isIn);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.head}>
        <h2 className={styles.title}>Skip the 2pm crash</h2>
        <p className={styles.sub}>Coffee only gets you started. CONKA gets you through the entire day.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.chart}>
          <div className={styles.legend}>
            <span className={styles.leg}>
              <CoffeeIcon />
              Coffee
            </span>
            <span className={styles.leg}>
              <span className={styles.swatch} style={{ background: 'linear-gradient(90deg,#E9A23A,#6E97D6)' }} />
              CONKA Flow + Clear
            </span>
          </div>
          <p className={styles.cap}>Focus levels through the day</p>

          <svg
            className={styles.svg}
            viewBox="0 0 340 250"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Focus through the day: coffee crashes at 2pm, CONKA stays steady all day"
          >
            <defs>
              <linearGradient id="conkaGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E9A23A" />
                <stop offset="48%" stopColor="#CF9A78" />
                <stop offset="100%" stopColor="#5B86C9" />
              </linearGradient>
              <linearGradient id="conkaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9DB8E0" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#9DB8E0" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="coffeeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D9483B" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#D9483B" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* gridlines */}
            <line x1="30" y1="70" x2="320" y2="70" stroke="#efefef" strokeWidth="1" />
            <line x1="30" y1="135" x2="320" y2="135" stroke="#efefef" strokeWidth="1" />
            <line x1="30" y1="200" x2="320" y2="200" stroke="#e6e6e6" strokeWidth="1" />

            {/* CONKA area + line */}
            <path className={styles.area} d="M30,140 C58,95 75,75 95,72 C150,66 220,64 280,62 C300,61 312,61 320,60 L320,200 L30,200 Z" fill="url(#conkaFill)" />
            <path className={`${styles.line} ${styles.lineConka} ${styles.draw}`} data-cmp-draw d="M30,140 C58,95 75,75 95,72 C150,66 220,64 280,62 C300,61 312,61 320,60" />

            {/* Coffee area (full) */}
            <path className={styles.area} d="M30,175 C52,92 62,62 78,60 C110,58 140,64 165,68 C178,70 184,71 191,72 C200,82 205,122 215,152 C224,176 236,188 252,189 C278,191 300,190 320,190 L320,200 L30,200 Z" fill="url(#coffeeFill)" />
            {/* Coffee rise/plateau (black) to 2pm */}
            <path className={`${styles.line} ${styles.lineCoffee} ${styles.draw}`} data-cmp-draw d="M30,175 C52,92 62,62 78,60 C110,58 140,64 165,68 C178,70 184,71 191,72" />
            {/* Coffee crash (red) after 2pm */}
            <path className={`${styles.line} ${styles.lineCrash} ${styles.draw}`} data-cmp-draw d="M191,72 C200,82 205,122 215,152 C224,176 236,188 252,189 C278,191 300,190 320,190" />

            {/* 2pm crash marker */}
            <g className={styles.marker}>
              <line x1="191" y1="44" x2="191" y2="196" stroke="#D9483B" strokeWidth="1.3" strokeDasharray="4 4" opacity="0.5" />
              <text className={styles.crashLbl} x="191" y="36" textAnchor="middle">
                ↓ 2pm crash
              </text>
            </g>
            <circle className={styles.dot} cx="191" cy="72" r="5.5" fill="#D9483B" stroke="#fff" strokeWidth="2" />
            <circle className={`${styles.dot} ${styles.dotEnd}`} cx="320" cy="60" r="5.5" fill="#5B86C9" stroke="#fff" strokeWidth="2" />
            <text className={`${styles.endLbl} ${styles.dot} ${styles.dotEnd}`} x="314" y="50" textAnchor="end">
              steady
            </text>

            {/* axis */}
            <text className={styles.axis} x="30" y="222" textAnchor="start">9am</text>
            <text className={styles.axis} x="126" y="222" textAnchor="middle">12pm</text>
            <text className={styles.axis} x="191" y="222" textAnchor="middle">2pm</text>
            <text className={styles.axis} x="320" y="222" textAnchor="end">6pm</text>
          </svg>
        </div>

        <div className={styles.cost}>
          <p className={styles.costHead}>
            Costs <b>{saving}</b> less than your monthly coffee bill
          </p>
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              <CoffeeIcon stroke="currentColor" />
              Daily coffee
            </span>
            <span className={styles.price}>{coffeePerDay}</span>
          </div>
          <div className={`${styles.row} ${styles.rowConka}`}>
            <span className={styles.rowLabel}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9.4" y="2.5" width="5.2" height="2.6" rx="0.6" />
                <path d="M10 5.1h4v1.8l.95 1.05c.67.74 1.05 1.7 1.05 2.7V19a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8.35c0-1 .38-1.96 1.05-2.7L10 6.9V5.1Z" />
                <line x1="8.7" y1="13.6" x2="15.3" y2="13.6" />
              </svg>
              Both shots
            </span>
            <span className={styles.price}>{shotsPerDay}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
