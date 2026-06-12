"use client";

export default function GoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="brand-clinical flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-white px-5 text-center text-black">
      <h1 className="text-2xl font-medium">Something went wrong</h1>
      <p className="text-sm text-black/60">Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="px-8 py-3 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-90"
        style={{ backgroundColor: "var(--brand-accent)" }}
      >
        Try again
      </button>
    </div>
  );
}
