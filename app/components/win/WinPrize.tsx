"use client";

import Image from "next/image";

export default function WinPrize() {
  return (
    <div className="px-4 md:px-16 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Product Image - Outside box, larger */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl h-64 sm:h-80 md:h-96">
            <Image
              src="/CONKA_16.jpg"
              alt="CONKA Flow and CONKA Clear - Balance Protocol"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Text box - Aligned with image width on desktop */}
        <div className="max-w-md md:max-w-2xl mx-auto">
          <div className="neo-box p-6 md:p-8">
            <p className="font-mono text-xs uppercase opacity-70 mb-4">
              what you&apos;ll receive
            </p>
            <ul className="space-y-3 font-mono text-sm">
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-teal-500 flex-shrink-0 mt-0.5"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>1 month balance protocol</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500 flex-shrink-0 mt-0.5"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>12 shots of EACH formula </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-teal-500 flex-shrink-0 mt-0.5"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>full delivery — no cost</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
