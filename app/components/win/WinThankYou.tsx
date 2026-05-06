"use client";

interface WinThankYouProps {
  email?: string;
}

export default function WinThankYou({ email }: WinThankYouProps) {
  return (
    <div className="px-4 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Confirmation */}
        <div className="neo-box p-8 md:p-12 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-teal-500 flex-shrink-0"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold">You&apos;re in</h2>
          </div>
          <p className="font-mono text-xl mb-3">
            good luck — we&apos;ll be in touch soon
          </p>
          <p className="font-mono text-xs opacity-70">
            entries close soon • winner contacted by email
          </p>
        </div>

        {/* Gentle continuation */}
        <div className="space-y-6">
          <p className="font-bold text-xl md:text-2xl">
            While You&apos;re Here
          </p>

          <p className="font-primary text-base md:text-lg opacity-90">
            CONKA exists to help people think more clearly, decide faster, and
            perform better — using clinically grounded ingredients, not hype.
          </p>

          <p className="font-mono text-sm opacity-70">
            If you&apos;re curious, our 2-minute quiz helps you understand which
            protocol fits your goals.
          </p>

          <div className="flex justify-center">
            <a
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-500 text-black font-semibold text-lg border-2 border-amber-500 hover:bg-amber-600 hover:border-amber-600 transition-all"
            >
              Find your protocol
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
