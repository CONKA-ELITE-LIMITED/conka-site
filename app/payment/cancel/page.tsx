import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment cancelled | CONKA",
  description: "Your payment was cancelled. No charge has been made.",
  openGraph: {
    title: "Payment cancelled | CONKA",
    description: "Your payment was cancelled. No charge has been made.",
  },
};

interface Props {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function PaymentCancelPage({ searchParams }: Props) {
  const { order_id } = await searchParams;

  return (
    <main className="brand-section brand-bg-white min-h-screen flex items-center justify-center">
      <div className="brand-track text-center">
        <h1 className="brand-h2 text-[var(--color-ink)] mb-4">
          Payment cancelled
        </h1>
        <p className="brand-body mx-auto mb-8">
          Your payment was not completed. No charge has been made.
          {order_id && (
            <span className="block mt-1 text-sm opacity-50">Order reference: {order_id}</span>
          )}
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
