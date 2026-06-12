import Link from "next/link";
import Image from "next/image";
import { getFormulaImage } from "@/app/lib/productImageConfig";

export function EmptySubscriptionsState() {
  const flowImage = getFormulaImage("01");
  const clearImage = getFormulaImage("02");
  return (
    <div className="bg-white border border-black/12 p-10 md:p-12 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="mx-auto mb-6 text-black/30"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
      <h2
        className="text-xl font-semibold text-black mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        No active subscriptions
      </h2>
      <p className="text-sm text-black/60 mb-8 max-w-[65ch] mx-auto">
        Subscribe to your favorite protocols for automatic deliveries and
        savings.
      </p>
      {(flowImage || clearImage) && (
        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
          {flowImage && (
            <Link
              href="/conka-flow"
              className="bg-white border border-black/12 hover:border-black/40 p-5 transition-colors text-left overflow-hidden"
            >
              <div className="w-full aspect-square max-w-[180px] mx-auto border border-black/8 overflow-hidden mb-4">
                <Image src={flowImage} alt="CONKA Flow" width={180} height={180} className="w-full h-full object-cover" />
              </div>
              <p className="font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>CONKA Flow</p>
              <p className="text-sm text-black/60">Caffeine-Free Focus</p>
            </Link>
          )}
          {clearImage && (
            <Link
              href="/conka-clarity"
              className="bg-white border border-black/12 hover:border-black/40 p-5 transition-colors text-left overflow-hidden"
            >
              <div className="w-full aspect-square max-w-[180px] mx-auto border border-black/8 overflow-hidden mb-4">
                <Image src={clearImage} alt="CONKA Clear" width={180} height={180} className="w-full h-full object-cover" />
              </div>
              <p className="font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>CONKA Clear</p>
              <p className="text-sm text-black/60">Peak Performance</p>
            </Link>
          )}
        </div>
      )}
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
  );
}
