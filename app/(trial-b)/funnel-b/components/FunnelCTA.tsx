"use client";

import Image from "next/image";
import { GUARANTEE_LABEL } from "@/app/lib/offerConstants";

interface FunnelCTAProps {
  label: string;
  subLabel?: string;
  /** When true, renders sub-label with emphasis (uppercase mono badge) */
  highlightSubLabel?: boolean;
  onClick: () => void;
  loading: boolean;
  error: string | null;
}

const BUTTON_CLASSES =
  "w-full inline-flex flex-row items-center gap-4 py-3.5 pl-5 pr-8 rounded-none text-white bg-[#1B2757] transition-opacity hover:opacity-85 active:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] disabled:opacity-60 disabled:hover:opacity-60 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]";

export default function FunnelCTA({
  label,
  subLabel,
  highlightSubLabel,
  onClick,
  loading,
  error,
}: FunnelCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-black/8 px-4 pb-4 pt-2 lg:static lg:border-0 lg:p-0 lg:bg-transparent">
      {/* Trust strip — compact mono register, above the button on every breakpoint */}
      <div className="flex items-center justify-center gap-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-black/70">
        <span>{GUARANTEE_LABEL}</span>
        <span className="text-black/20" aria-hidden>·</span>
        <span>Free Shipping</span>
        <span className="text-black/20" aria-hidden>·</span>
        <span>Cancel Anytime</span>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={BUTTON_CLASSES}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2 w-full font-mono text-sm uppercase tracking-[0.12em] font-bold">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          <>
            {/* LEFT — Conka "O" mark */}
            <span className="relative w-7 h-7 shrink-0" aria-hidden>
              <Image
                src="/logos/ConkaO.png"
                alt=""
                fill
                sizes="28px"
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </span>

            {/* CENTER — title with blinking cursor + meta */}
            <span className="flex flex-col items-start flex-1 min-w-0 text-left">
              <span className="font-mono font-bold text-sm uppercase tracking-[0.12em] flex items-center gap-0.5">
                <span className="truncate">{label}</span>
                <span
                  className="inline-block ml-0.5"
                  style={{ animation: "lab-blink 1s step-end infinite" }}
                  aria-hidden
                >
                  _
                </span>
              </span>
              {subLabel && (
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.18em] mt-1 leading-none ${
                    highlightSubLabel ? "text-white" : "text-white/70"
                  }`}
                >
                  {subLabel}
                </span>
              )}
            </span>

            {/* RIGHT — arrow icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="shrink-0"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
