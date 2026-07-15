import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import FaqHub from "@/app/components/faq/FaqHub";
import { FAQ_ITEMS } from "@/app/lib/faqContent";
import { JsonLd, buildFaqSchema } from "@/app/lib/jsonLd";

export const metadata: Metadata = {
  title: "CONKA FAQ | Safety, Side Effects, Ingredients and Delivery",
  description:
    "Straight answers about CONKA: side effects, who should not take it, prescription medication and SSRIs, drug testing, caffeine, results, price and delivery.",
  openGraph: {
    title: "CONKA FAQ | Straight Answers",
    description:
      "Side effects, who should not take it, medication interactions, drug testing, caffeine, results, price and delivery. Answered properly.",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CONKA FAQ | Straight Answers",
    description:
      "Side effects, who should not take it, medication interactions, drug testing, caffeine, results, price and delivery. Answered properly.",
    images: ["/opengraph-image.png"],
  },
};

export default function FaqPage() {
  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <JsonLd schema={buildFaqSchema(FAQ_ITEMS)} />
      <Navigation />

      <main className="flex-1">
        {/* .brand-clinical zeroes brand-hero-first padding on mobile, so the
            hero needs an explicit paddingTop to clear the fixed nav. */}
        <section
          className="brand-section brand-hero-first brand-bg-white"
          style={{ paddingTop: "5rem" }}
          aria-label="Frequently asked questions"
        >
          <div className="brand-track">
            <p className="brand-eyebrow mb-3">{"// Answers · FAQ-01"}</p>
            <h1
              className="brand-h1 text-black mb-6 max-w-[20ch]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Every question, answered straight.
            </h1>
            <p className="text-base lg:text-lg text-black/70 leading-relaxed max-w-[64ch]">
              Including the ones most supplement brands avoid: side effects, who
              should not take CONKA, what happens if you stop, and how CONKA
              interacts with prescription medication. If an answer here is not
              enough, email{" "}
              <a
                className="underline underline-offset-4 hover:text-black"
                href="mailto:info@conka.io"
              >
                info@conka.io
              </a>{" "}
              and a human will reply.
            </p>
          </div>
        </section>

        <section
          className="brand-section brand-bg-white"
          aria-label="Questions and answers"
        >
          <div className="brand-track">
            <FaqHub />
          </div>
        </section>

        <section className="brand-section brand-bg-neutral" aria-label="Get started">
          <div className="brand-track">
            <h2
              className="brand-h2 text-black mb-4 max-w-[18ch]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Still deciding?
            </h2>
            <p className="text-base text-black/70 leading-relaxed max-w-[60ch] mb-8">
              Every order is covered by the 100-day money-back guarantee. Try it,
              measure it in the app, and if it does not work for you, get your
              money back.
            </p>
            <Link
              href="/conka-both"
              className="lab-clip-tr inline-flex items-center min-h-[48px] px-6 bg-black text-white font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums hover:bg-[#1B2757] transition-colors"
            >
              See the range ↗
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
