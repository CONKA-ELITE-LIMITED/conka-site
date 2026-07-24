import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { SITE_ORIGIN } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer | CONKA",
  description:
    "Product, health and endorsement disclaimers for CONKA food supplements, including UK and EU supplement wording and information for customers in the United States.",
  alternates: { canonical: `${SITE_ORIGIN}/disclaimer` },
  openGraph: {
    title: "Disclaimer | CONKA",
    description:
      "Product, health and endorsement disclaimers for CONKA food supplements.",
    images: ["/opengraph-image.png"],
  },
};

export default function DisclaimerPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navigation />

      <main className="px-6 md:px-16 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Disclaimer</h1>
            <p className="text-sm opacity-70">Last updated 24 July 2026</p>
          </div>

          {/* Summary — the same wording the footer carries, stated once up front. */}
          <div
            className="mb-12 p-6 rounded-2xl text-base leading-relaxed"
            style={{ background: "#eef0f5" }}
          >
            <p>
              CONKA products are <strong>food supplements</strong>, not
              medicines. Food supplements are not a substitute for a varied,
              balanced diet and a healthy lifestyle. Do not exceed the
              recommended daily intake. Keep out of reach of young children.
              CONKA is not intended to diagnose, treat, cure or prevent any
              disease. If you are pregnant, breastfeeding, taking medication or
              have a medical condition, consult your doctor before use.
            </p>
          </div>

          <div className="space-y-10 text-base leading-relaxed">
            {/* 1. Food supplement */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                1. CONKA is a food supplement
              </h2>
              <p>
                CONKA Flow and CONKA Clear are food supplements in liquid shot
                format, sold by CONKA ELITE LIMITED and manufactured in the
                United Kingdom. They are regulated as food, not as medicinal
                products, and they have not been assessed or licensed by the
                Medicines and Healthcare products Regulatory Agency (MHRA) or
                any equivalent medicines regulator.
              </p>
              <p className="mt-3">
                Food supplements should not be used as a substitute for a varied
                and balanced diet and a healthy lifestyle. Do not exceed the
                recommended daily intake stated on the label. Keep out of the
                reach of young children.
              </p>
            </section>

            {/* 2. Not medical advice */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                2. Not medical advice
              </h2>
              <p>
                Everything on this website, including product pages, the
                science and ingredients pages, blog articles, case studies, FAQs
                and emails, is provided for general information only. It is not
                medical advice, and it is not a substitute for a consultation
                with a qualified healthcare professional.
              </p>
              <p className="mt-3">
                Nothing we publish should be used to diagnose a condition, to
                decide whether to start, stop or change a prescribed treatment,
                or to delay seeking medical help. If you have a health concern,
                speak to your GP, pharmacist or another qualified clinician.
              </p>
            </section>

            {/* 3. Before you take CONKA */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                3. Before you take CONKA
              </h2>
              <p>Speak to your doctor or pharmacist before taking CONKA if you:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>are pregnant, trying to conceive, or breastfeeding;</li>
                <li>
                  take prescription medication, particularly blood-thinning or
                  anticoagulant medication, thyroid medication, sedatives or
                  antidepressants;
                </li>
                <li>
                  have a diagnosed medical condition, including any thyroid,
                  bleeding or autoimmune condition;
                </li>
                <li>have surgery scheduled;</li>
                <li>have a known allergy to any listed ingredient.</li>
              </ul>
              <p className="mt-3">
                CONKA is suitable from age 3 and up. We do not recommend it for
                children under 3. The full ingredient list and per-serving doses
                for every formula are published on our{" "}
                <Link href="/ingredients" className="underline hover:opacity-70">
                  ingredients page
                </Link>
                .
              </p>
            </section>

            {/* 4. Claims and research */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                4. Claims and research
              </h2>
              <p>
                Where we reference research, we are describing published studies
                on individual ingredients, not clinical trials of the finished
                CONKA product unless we say so explicitly. A study on an
                ingredient is not a promise about an outcome for you.
              </p>
              <p className="mt-3">
                Health claims made in the United Kingdom and European Union are
                limited to those authorised under Regulation (EC) No 1924/2006.
                Where a statement rests on an authorised claim, we mark it with
                a{" "}
                <span className="font-semibold">††</span> anchor and name the
                nutrient responsible. Any other description of how CONKA is used
                or experienced is not an authorised health claim.
              </p>
            </section>

            {/* 5. Individual results */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                5. Individual results vary
              </h2>
              <p>
                We do not guarantee any specific outcome. Responses to
                supplements differ from person to person and depend on sleep,
                diet, training, stress, existing health and consistency of use.
              </p>
              <p className="mt-3">
                Customer reviews, testimonials, case studies and data shown in
                the CONKA app describe the experience of the individuals
                concerned. They are not typical results, not a prediction of
                your results, and not evidence of a health benefit.
              </p>
            </section>

            {/* 6. Endorsements */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                6. Endorsements and partnerships
              </h2>
              <p>
                Some of the athletes, practitioners and creators featured on
                this website and on our social channels have a commercial or
                material connection to CONKA. That may include payment, free
                product, an affiliate commission, an ambassador agreement or an
                equity interest.
              </p>
              <p className="mt-3">
                Their statements reflect their own experience and opinion. Paid
                partnerships in advertising and on social media are labelled in
                line with the CAP Code and ASA guidance.
              </p>
            </section>

            {/* 7. Sport */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                7. Tested and competing athletes
              </h2>
              <p>
                CONKA is batch tested under Informed Sport. Informed Sport
                testing reduces, but cannot completely eliminate, the risk of a
                banned substance being present in a supplement. If you are
                subject to anti-doping rules, check the certification for the
                specific batch you hold and satisfy yourself and your governing
                body before use. Responsibility for what an athlete consumes
                rests with the athlete.
              </p>
            </section>

            {/* 8. US customers */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                8. Information for customers in the United States
              </h2>
              <p>
                CONKA is a United Kingdom company and our products are
                formulated, labelled and sold as food supplements under UK and
                EU law. The following applies to customers ordering from the
                United States, where these products are treated as dietary
                supplements:
              </p>
              <p className="mt-3">
                <em>
                  These statements have not been evaluated by the Food and Drug
                  Administration. This product is not intended to diagnose,
                  treat, cure or prevent any disease.
                </em>
              </p>
              <p className="mt-3">
                Orders shipped to the United States are sold on a
                delivered-at-place basis. Import duties, taxes and customs
                charges are the responsibility of the recipient. See our{" "}
                <Link href="/shipping" className="underline hover:opacity-70">
                  shipping information
                </Link>{" "}
                for details.
              </p>
            </section>

            {/* 9. External links */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                9. Third-party links and content
              </h2>
              <p>
                This website links to third-party sites, including published
                research, retailer listings and social platforms. We do not
                control that content and are not responsible for its accuracy or
                availability. A link is not an endorsement of everything on the
                destination site.
              </p>
            </section>

            {/* 10. Related policies */}
            <section>
              <h2 className="text-xl font-bold mb-4">10. Related policies</h2>
              <p>
                This disclaimer sits alongside our{" "}
                <Link href="/terms" className="underline hover:opacity-70">
                  terms &amp; conditions
                </Link>
                ,{" "}
                <Link href="/privacy" className="underline hover:opacity-70">
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link href="/cookies" className="underline hover:opacity-70">
                  cookie policy
                </Link>
                . Where this disclaimer and our terms &amp; conditions cover the
                same ground, the terms &amp; conditions govern the contract
                between us.
              </p>
            </section>

            {/* 11. Contact */}
            <section>
              <h2 className="text-xl font-bold mb-4">11. Contact us</h2>
              <p>
                If you have a question about anything on this page, or about
                whether CONKA is right for you, get in touch:
              </p>
              <ul className="list-none space-y-1 mt-3 ml-4">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:info@conka.io"
                    className="underline hover:opacity-70"
                  >
                    info@conka.io
                  </a>
                </li>
                <li>
                  Post: CONKA ELITE LIMITED, The Light Bulb, 1 Filament Walk, U
                  107 Conka, London, SW18 4GQ
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
