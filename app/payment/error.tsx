"use client";

import Link from "next/link";

export default function PaymentError() {
  return (
    <main className="brand-section brand-bg-white min-h-screen flex items-center justify-center">
      <div className="brand-track text-center">
        <h1 className="brand-h2 text-[var(--color-ink)] mb-4">
          Something went wrong
        </h1>
        <p className="brand-body mx-auto mb-8">
          An unexpected error occurred. No charge has been made. Please try again or contact support.
        </p>
        <Link
          href="/"
          className="inline-block bg-[var(--color-ink)] text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-80 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
