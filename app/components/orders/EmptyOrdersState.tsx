import Link from "next/link";
import Image from "next/image";
import { getFormulaImage } from "@/app/lib/productImageConfig";

export function EmptyOrdersState() {
  const flowImage = getFormulaImage("01");
  const clearImage = getFormulaImage("02");
  return (
    <div className="bg-white border border-black/12 p-10 md:p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-[#f5f5f5] border border-black/12 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="text-black/40"
        >
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      </div>
      <h2
        className="text-xl font-semibold text-black mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        No orders yet
      </h2>
      <p className="text-sm text-black/60 mb-8 max-w-[65ch] mx-auto">
        Once you place an order, you&apos;ll be able to track it here and see
        your complete order history.
      </p>

      <div className="border-t border-black/8 pt-8 mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-4">
          Start Shopping
        </p>
        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
          <Link
            href="/conka-flow"
            className="bg-white border border-black/12 hover:border-black/40 p-5 transition-colors text-left overflow-hidden"
          >
            {flowImage ? (
              <div className="w-full aspect-square max-w-[180px] mx-auto border border-black/8 overflow-hidden mb-4">
                <Image src={flowImage} alt="CONKA Flow" width={180} height={180} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-[#f5f5f5] border border-black/8 mb-4" />
            )}
            <p className="font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>
              CONKA Flow
            </p>
            <p className="text-sm text-black/60">
              Caffeine-Free Focus
            </p>
          </Link>
          <Link
            href="/conka-clarity"
            className="bg-white border border-black/12 hover:border-black/40 p-5 transition-colors text-left overflow-hidden"
          >
            {clearImage ? (
              <div className="w-full aspect-square max-w-[180px] mx-auto border border-black/8 overflow-hidden mb-4">
                <Image src={clearImage} alt="CONKA Clear" width={180} height={180} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-[#f5f5f5] border border-black/8 mb-4" />
            )}
            <p className="font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>
              CONKA Clear
            </p>
            <p className="text-sm text-black/60">
              Peak Performance
            </p>
          </Link>
        </div>
        <Link
          href="/funnel"
          className="inline-flex items-center gap-2 bg-[#1B2757] text-white font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums px-8 py-3 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)] hover:opacity-90 transition-opacity"
        >
          Get started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
