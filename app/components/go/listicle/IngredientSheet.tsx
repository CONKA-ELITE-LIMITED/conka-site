"use client";

/**
 * IngredientSheet — the lander's "Full ingredient list" bottom-sheet, lifted
 * into the listicle buy box. Reuses the lander data (ingredients.data) and its
 * CSS module verbatim so the sheet looks identical; the only change is the
 * Flow/Clear toggle moves inside the sheet head (the buy box has no section
 * toggle to drive it). Trigger button is Tailwind to sit in the buy box.
 */

import { useEffect, useState } from "react";
import { FORMULAS } from "@/app/lander/sections/IngredientsSection/ingredients.data";
import styles from "@/app/lander/sections/IngredientsSection/IngredientsSection.module.css";

type FormulaKey = "flow" | "clear";

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

export default function IngredientSheet({
  formulas,
}: {
  /** Which formula tabs to surface; first is the default */
  formulas: FormulaKey[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<FormulaKey>(formulas[0]);
  const formula = FORMULAS[active];
  const showToggle = formulas.length > 1;

  // Lock body scroll while the sheet is open; Escape to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 border border-black/10 bg-white py-3.5 text-sm font-semibold text-black/80 transition-colors hover:bg-black/[0.03]"
      >
        See what&apos;s inside {showToggle ? "Flow & Clear" : formula.name}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {open && (
        <div className={styles.modal} aria-modal="true" role="dialog">
          <div className={styles.modalOverlay} onClick={() => setOpen(false)} />
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
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            {showToggle && (
              <div className={styles.toggle} role="tablist" aria-label="Choose your formula">
                <button
                  type="button"
                  className={`${styles.tab} ${active === "flow" ? styles.tabActive : ""}`}
                  role="tab"
                  aria-selected={active === "flow"}
                  onClick={() => setActive("flow")}
                >
                  <FlowIcon />
                  Flow · AM
                </button>
                <button
                  type="button"
                  className={`${styles.tab} ${active === "clear" ? styles.tabActive : ""}`}
                  role="tab"
                  aria-selected={active === "clear"}
                  onClick={() => setActive("clear")}
                >
                  <ClearIcon />
                  Clear · PM
                </button>
              </div>
            )}

            <div>
              {formula.items.map((it) => (
                <details className={styles.row} key={`row-${formula.key}-${it.name}`}>
                  <summary className={styles.rowSummary}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny lazy modal thumb, matches lander source */}
                    <img className={styles.rowThumb} src={it.img} alt={it.name} loading="lazy" />
                    <span className={styles.rowName}>{it.name}</span>
                    <span className={styles.rowTag}>{it.tag}</span>
                    <Chevron />
                  </summary>
                  <div className={styles.rowDetail}>
                    <p dangerouslySetInnerHTML={{ __html: it.detail }} />
                    <p className={styles.rowFinding}>
                      <b>{it.stat}</b> {it.metric} ·{" "}
                      <span className={styles.rowCite}>{it.cite}</span>
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
