"use client";

import { useEffect, useRef } from "react";

const RESEARCH_STATS = [
  {
    value: "93%",
    label: "Sensitivity detecting cognitive impairment",
    source: "ADePT Study, PMC10533908",
  },
  {
    value: "87.5%",
    label: "Test-retest reliability",
    source: "ADePT Study, PMC10533908",
  },
  {
    value: "14",
    label: "NHS Trusts in clinical validation trials",
    source: "HRA ISRCTN95636074",
  },
  {
    value: "16%",
    label: "Cognitive improvement in 30 days",
    source: "Clinical data",
  },
];

export function AppResearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Clinical research data"
    >
      <div
        ref={panelRef}
        className="relative bg-[#0a0a0a] border border-white/15 w-full max-w-2xl mx-4 lg:mx-auto p-8 lg:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2
              className="text-white font-medium text-xl leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Research + Clinical Data
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mt-1.5 tabular-nums">
              Cambridge-derived · FDA cleared · NHS validated
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close research panel"
            className="flex items-center justify-center min-w-[44px] min-h-[44px] border border-white/15 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 px-3 hover:text-white hover:border-white/35 transition-colors ml-4 flex-shrink-0"
          >
            Close
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RESEARCH_STATS.map((s) => (
            <div
              key={s.value}
              className="border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="font-mono text-[2.25rem] font-bold text-white tabular-nums leading-none mb-2">
                {s.value}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 leading-snug mb-2">
                {s.label}
              </p>
              <p className="font-mono text-[9px] text-white/30 tabular-nums">
                {s.source}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="font-mono text-[9px] text-white/25 tabular-nums mt-6 leading-relaxed">
          Validated across NHS Memory Clinics · Cambridge Cognition · FDA 510(k) cleared · ISRCTN95636074
        </p>
      </div>
    </div>
  );
}

export default AppResearchModal;
