import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import B2BOrderBuilder from "@/app/components/b2b/B2BOrderBuilder";

export const metadata: Metadata = {
  title: "Team Order | CONKA",
  description: "Place your CONKA team order at squad pricing.",
  // Unlisted: reachable only via the link emailed after applying.
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfessionalsOrderPage() {
  return (
    <div className="brand-clinical brand-page min-h-screen flex flex-col">
      <Navigation />

      <section
        className="brand-section brand-hero-first brand-bg-white"
        style={{ paddingTop: "5rem" }}
        aria-label="Team order"
      >
        <div className="brand-track">
          <p className="brand-eyebrow mb-4">{"// Team pricing"}</p>
          <h1 className="brand-h1 max-w-[20ch]">Build your team order.</h1>
          <p className="brand-body mt-6">
            Choose Flow, Clear, or both. Your per-box price drops automatically as
            the quantity grows. Prices shown exclude VAT, which is added with
            shipping at checkout. Add a PO number if your finance team needs one.
          </p>
        </div>
      </section>

      <section className="brand-section brand-bg-tint" aria-label="Order builder">
        <div className="brand-track">
          <B2BOrderBuilder />
        </div>
      </section>

      <Footer />
    </div>
  );
}
