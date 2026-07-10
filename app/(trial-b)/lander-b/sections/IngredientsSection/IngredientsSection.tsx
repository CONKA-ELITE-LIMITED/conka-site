'use client';


/**
 * CONKA — "15 Science-Backed Ingredients" section.
 *
 * Faithful React/Next port of the approved prototype. No commerce dependency:
 * all copy lives in ./ingredients.data.ts. The only thing a dev may want to
 * wire later is the "Full ingredient list" CTA → real product pages, but the
 * section works standalone as-is.
 *
 * Assets expected under /public/lander/... — see conka-handoff/ASSETS.md.
 */

import { useEffect, useState } from 'react';
import { FORMULAS } from './ingredients.data';
import styles from './IngredientsSection.module.css';

type FormulaKey = 'flow' | 'clear';

function FlowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M12 2v6M15 5l-3 3-3-3" />
      <path d="M5.2 18a7 7 0 0 1 13.6 0" />
      <path d="M2 18h3M19 18h3" />
      <path d="M2 22h20" />
    </svg>
  );
}

const Chevron = () => (
  <svg className={styles.rowChev} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function IngredientsSection() {
  const [active, setActive] = useState<FormulaKey>('flow');
  const [modalOpen, setModalOpen] = useState(false);
  const formula = FORMULAS[active];

  // Lock body scroll while the bottom-sheet is open.
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setModalOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [modalOpen]);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          15 Science-Backed
          <br />
          Ingredients.
        </h2>
        <p className={styles.body}>
          Every ingredient is dosed to match the peer-reviewed clinical research. Six years of
          development with leading UK universities and the military.
        </p>
      </div>

      {/* AM / PM formula toggle */}
      <div className={styles.toggle} role="tablist" aria-label="Choose your formula">
        <button
          type="button"
          className={`${styles.tab} ${active === 'flow' ? styles.tabActive : ''}`}
          role="tab"
          aria-selected={active === 'flow'}
          onClick={() => setActive('flow')}
        >
          <FlowIcon />
          Flow · AM
        </button>
        <button
          type="button"
          className={`${styles.tab} ${active === 'clear' ? styles.tabActive : ''}`}
          role="tab"
          aria-selected={active === 'clear'}
          onClick={() => setActive('clear')}
        >
          <ClearIcon />
          Clear · PM
        </button>
      </div>

      {/* Selected-formula strip */}
      <div className={styles.product}>
        <div className={styles.productTop}>
          {/* next/image is fine here too; plain <img> keeps the port framework-agnostic. */}
          <img className={styles.productImg} src={formula.img} alt={formula.name} loading="lazy" />
          <div className={styles.productInfo}>
            <p className={styles.productName}>{formula.name}</p>
            <p className={styles.productSub}>{formula.sub}</p>
            <span className={styles.productMg}>{formula.mg}</span>
            <span className={styles.productMgLabel}>active nootropics</span>
          </div>
        </div>
        <button type="button" className={styles.productBtn} onClick={() => setModalOpen(true)}>
          Full ingredient list
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Horizontal ingredient rail */}
      <div className={styles.rail}>
        {formula.items.map((it) => (
          <div className={styles.card} key={`${formula.key}-${it.name}`}>
            <img className={styles.cardImg} src={it.img} alt={it.name} loading="lazy" />
            <div className={styles.cardBody}>
              <span className={styles.cardTag}>{it.tag}</span>
              <p className={styles.cardName}>{it.name}</p>
              <p className={styles.cardBenefit} dangerouslySetInnerHTML={{ __html: it.benefit }} />
              <div className={styles.cardFinding}>
                <span className={styles.cardStat}>{it.stat}</span>
                <span className={styles.cardMetric}>{it.metric}</span>
              </div>
              <p className={styles.cardCite}>{it.cite}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.foot}>
        <p className={styles.footCount}>
          {formula.count} <span className={styles.muted}>in this formula</span>
        </p>
        <p className={styles.footLegal}>
          Patented formula GB2620279 · Every batch Informed Sport tested
        </p>
      </div>

      {/* Full ingredient list — bottom-sheet modal */}
      {modalOpen && (
        <div className={styles.modal} aria-modal="true" role="dialog">
          <div className={styles.modalOverlay} onClick={() => setModalOpen(false)} />
          <div className={styles.modalSheet}>
            <div className={styles.modalHead}>
              <div>
                <p className={styles.modalTitle}>{formula.name}</p>
                <p className={styles.modalSubtitle}>{formula.ingCount}</p>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                aria-label="Close"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div>
              {formula.items.map((it) => (
                <details className={styles.row} key={`row-${formula.key}-${it.name}`}>
                  <summary className={styles.rowSummary}>
                    <img className={styles.rowThumb} src={it.img} alt={it.name} loading="lazy" />
                    <span className={styles.rowName}>{it.name}</span>
                    <span className={styles.rowTag}>{it.tag}</span>
                    <Chevron />
                  </summary>
                  <div className={styles.rowDetail}>
                    <p dangerouslySetInnerHTML={{ __html: it.detail }} />
                    <p className={styles.rowFinding}>
                      <b>{it.stat}</b> {it.metric} ·{' '}
                      <span className={styles.rowCite}>{it.cite}</span>
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
