"use client";

import { useEffect, useRef } from "react";

interface AppWidgetGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  total?: number;
}

export default function AppWidgetGridModal({
  isOpen,
  onClose,
  children,
  onPrev,
  onNext,
  currentIndex,
  total,
}: AppWidgetGridModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasPagination = onPrev !== undefined && onNext !== undefined;

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-[#0a0a0a] border border-white/15 w-full max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          {hasPagination && currentIndex !== undefined && total !== undefined ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 tabular-nums">
              {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
          ) : (
            <span />
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center min-w-[44px] min-h-[44px] border border-white/15 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 px-3 hover:text-white hover:border-white/35 transition-colors ml-auto"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[75vh]">{children}</div>

        {/* Pagination */}
        {hasPagination && (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors min-h-[44px] pr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Prev
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors min-h-[44px] pl-4"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
