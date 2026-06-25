"use client";

export default function FunnelError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-[var(--color-ink)] mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Please try again or refresh the page.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full text-sm font-semibold text-white"
        style={{ background: "var(--gradient-neuro-blue-accent)" }}
      >
        Try Again
      </button>
    </div>
  );
}
