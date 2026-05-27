import type { Metadata } from "next";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Try CONKA | Daily Nootropic Brain Shots",
  description:
    "Two shots a day. 16 active ingredients. Informed Sport certified. Try CONKA Flow and Clear with a 100-day money-back guarantee.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://www.conka.io/startv2",
  },
  openGraph: {
    title: "Try CONKA | Daily Nootropic Brain Shots",
    description:
      "Two shots a day. 16 active ingredients. Informed Sport certified. Start your daily brain performance routine.",
  },
};

export default function StartV2Page() {
  return (
    <div className="min-h-screen bg-[var(--brand-white)] text-[var(--brand-black)]">
      <Navigation />
      <main aria-label="Landing page v2.1 — work in progress" />
      <Footer />
    </div>
  );
}
