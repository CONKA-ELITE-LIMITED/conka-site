"use client";

import { useState } from "react";

interface RevolutPayButtonProps {
  /** Amount in minor units (e.g. 999 = £9.99) */
  amount: number;
  currency?: string;
  customerId?: string;
  className?: string;
  label?: string;
}

export default function RevolutPayButton({
  amount,
  currency = "GBP",
  customerId,
  className = "",
  label = "Buy with Revolut Pay",
}: RevolutPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-revolut-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, customerId }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkout_url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Keep loading state active — navigation takes over, no flash on redirect
      window.location.assign(data.checkout_url);
    } catch {
      setError("Could not start payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        className={`inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <>
            <span
              className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"
              aria-hidden="true"
            />
            <span>Processing…</span>
          </>
        ) : (
          label
        )}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
