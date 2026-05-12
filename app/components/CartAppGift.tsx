// No "use client" needed — pure render, no hooks. Rendered inside the client CartDrawer.
import Image from "next/image";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";

const APP_BULLETS = [
  "Daily brain performance score, tracked over time",
  "Personalised insights from your shots and test results",
  `${GUARANTEE_DAYS}-day money-back guarantee, no questions asked`,
];

export default function CartAppGift() {
  return (
    <div className="border border-black/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-black/8 bg-[#f9f9f9]">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
            Also included — the CONKA app
          </p>
          <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white bg-[#1B2757] px-2 py-0.5">
            Free
          </span>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/35 mt-0.5">
          iOS and Google Play
        </p>
      </div>

      {/* Content */}
      <div className="flex gap-3 p-4">
        <Image
          src="/app/AppConkaRing.png"
          alt="CONKA app showing daily brain performance score"
          width={48}
          height={104}
          className="shrink-0 w-12 h-auto"
        />
        <div className="flex-1 min-w-0 space-y-2 pt-0.5">
          {APP_BULLETS.map((bullet) => (
            <div key={bullet} className="flex gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 mt-0.5 text-[#1B2757]"
                aria-hidden
              >
                <path
                  d="M3 8.5L6.5 12L13 4.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
              <p className="text-xs text-black leading-snug">{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Asterisk note */}
      <div className="px-4 pb-3 -mt-1">
        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-black/30 leading-snug">
          *Use the same email you purchased CONKA with to access the app
        </p>
      </div>
    </div>
  );
}
