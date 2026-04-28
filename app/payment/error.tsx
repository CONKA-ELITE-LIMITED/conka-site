"use client";

export default function PaymentError() {
  return (
    <main className="premium-section-luxury premium-bg-bone min-h-screen flex items-center justify-center">
      <div className="premium-track text-center">
        <h1 className="premium-section-heading text-[var(--color-ink)] mb-4">
          Something went wrong
        </h1>
        <p className="premium-body mx-auto mb-8">
          An unexpected error occurred. No charge has been made. Please try again or contact support.
        </p>
        <a
          href="/"
          className="inline-block bg-[var(--color-ink)] text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-80 transition-opacity"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
