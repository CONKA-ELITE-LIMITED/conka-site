import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";

export const metadata: Metadata = {
  title: "Shipping & Returns | CONKA",
  description:
    "How CONKA ships your order, delivery times, free subscription shipping, and our 100-day money-back guarantee.",
};

export default function ShippingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navigation />

      <main className="px-6 md:px-16 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Shipping &amp; Returns
            </h1>
            <p className="text-sm opacity-70">Last updated 14 June 2026</p>
          </div>

          <div className="space-y-10 text-base leading-relaxed">
            {/* 1. UK delivery */}
            <section>
              <h2 className="text-xl font-bold mb-4">UK delivery</h2>
              <p>
                Order before 2pm on a working day and we dispatch the same day.
                Most UK orders arrive within 1 to 2 working days. You will
                receive tracking by email the moment your order ships.
              </p>
            </section>

            {/* 2. Shipping costs */}
            <section>
              <h2 className="text-xl font-bold mb-4">Shipping costs</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Subscriptions ship free, every order, for as long as you stay subscribed.</li>
                <li>
                  One-time orders show the exact delivery cost at checkout before
                  you pay.
                </li>
                <li>
                  International delivery is available. Options, times, and costs
                  are calculated and shown at checkout based on your address.
                </li>
              </ul>
            </section>

            {/* 3. Subscriptions */}
            <section>
              <h2 className="text-xl font-bold mb-4">Subscriptions</h2>
              <p>
                Subscription orders ship automatically on your chosen schedule,
                with free delivery. You can pause, skip, change, or cancel
                anytime from your{" "}
                <a className="underline" href="/account/subscriptions">
                  account
                </a>
                . No contracts.
              </p>
            </section>

            {/* 4. Returns & guarantee */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                Returns and our {GUARANTEE_DAYS}-day money-back guarantee
              </h2>
              <p>
                We want you to feel the difference, not just take our word for
                it. Try CONKA for up to {GUARANTEE_DAYS} days. If you are not
                satisfied, email{" "}
                <a className="underline" href="mailto:info@conka.io">
                  info@conka.io
                </a>{" "}
                for a full refund. No returns needed, no questions asked.
              </p>
            </section>

            {/* 5. Damaged or incorrect orders */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                Damaged or incorrect orders
              </h2>
              <p>
                If anything arrives damaged or your order is not what you
                expected, contact us at{" "}
                <a className="underline" href="mailto:info@conka.io">
                  info@conka.io
                </a>{" "}
                and we will put it right.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
