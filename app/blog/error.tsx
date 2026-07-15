"use client";

/** Route error boundary for /blog and /blog/[slug]. */
export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
        Blog
      </p>
      <h1 className="brand-h2 mt-3">Something went wrong.</h1>
      <p className="brand-body mt-3 text-black/60">
        We could not load this page just now.
      </p>
      <button
        type="button"
        onClick={reset}
        className="lab-clip-tr mt-8 inline-flex items-center justify-center bg-black text-white hover:bg-[#1B2757] transition-colors min-h-[48px] px-6 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums"
      >
        Try again
      </button>
    </div>
  );
}
