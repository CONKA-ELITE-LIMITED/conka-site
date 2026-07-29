"use client";

/** Route error boundary for /blog and /blog/[slug]. */
export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[13px] font-medium text-black/45">
        Blog
      </p>
      <h1 className="brand-h2 mt-3">Something went wrong.</h1>
      <p className="brand-body mt-3 text-black/60">
        We could not load this page just now.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1B2757] text-white hover:opacity-90 transition-opacity min-h-[48px] px-7 text-[15px] font-semibold"
      >
        Try again
      </button>
    </div>
  );
}
