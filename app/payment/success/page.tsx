import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment successful | CONKA",
  description: "Your payment was successful. Your Conka points will be added to your account shortly.",
  openGraph: {
    title: "Payment successful | CONKA",
    description: "Your payment was successful. Your Conka points will be added to your account shortly.",
  },
};

interface Props {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { order_id } = await searchParams;

  return (
    <main className="brand-section brand-bg-white min-h-screen flex items-center justify-center">
      <div className="brand-track text-center">
        <h1 className="brand-h2 text-[var(--color-ink)] mb-4">
          Payment successful
        </h1>
        <p className="brand-body mx-auto mb-2">
          Thank you for your purchase. Your Conka points will be added to your account shortly.
        </p>
        {order_id && (
          <p className="text-sm text-[var(--color-ink)] opacity-50 mb-8">
            Order reference: {order_id}
          </p>
        )}
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
