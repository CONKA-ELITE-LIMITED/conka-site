import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";
import { SUPPORT_EMAIL, supportMailtoHref } from "@/app/lib/supportEmail";

export const metadata: Metadata = {
  title: "Terms & Conditions | CONKA",
  description:
    "Terms and conditions for purchasing CONKA products, subscriptions, and using the CONKA website.",
};

export default function TermsPage() {
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
              Terms &amp; Conditions
            </h1>
            <p className="text-sm opacity-70">Last updated 1 April 2026</p>
          </div>

          <div className="space-y-10 text-base leading-relaxed">
            {/* 1. About Us */}
            <section>
              <h2 className="text-xl font-bold mb-4">1. About us</h2>
              <p>
                This website (<strong>conka.io</strong>) is operated by{" "}
                <strong>CONKA ELITE LIMITED</strong>, a company registered in
                England and Wales.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-4">
                <li>Company number: 13235415</li>
                <li>
                  Registered address: The Light Bulb, 1 Filament Walk, U 107
                  Conka, London, SW18 4GQ
                </li>
                <li>VAT number: GB430507628</li>
                <li>
                  Contact:{" "}
                  <a
                    href={supportMailtoHref()}
                    className="underline hover:opacity-70"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </li>
              </ul>
              <p className="mt-3">
                In these terms, &quot;we&quot;, &quot;us&quot;, and
                &quot;our&quot; refer to CONKA ELITE LIMITED. &quot;You&quot;
                refers to the person placing an order or using this website.
              </p>
            </section>

            {/* 2. Products */}
            <section>
              <h2 className="text-xl font-bold mb-4">2. Our products</h2>
              <p>
                CONKA products are <strong>food supplements</strong> in liquid
                shot format (30ml per shot). They are not medicines and are not
                intended to diagnose, treat, cure, or prevent any disease.
              </p>
              <p className="mt-3">
                Food supplements should not be used as a substitute for a varied
                and balanced diet and a healthy lifestyle. Do not exceed the
                recommended daily intake. If you are pregnant, breastfeeding,
                taking medication, or under medical supervision, consult your
                doctor before use.
              </p>
            </section>

            {/* 3. Orders and Pricing */}
            <section>
              <h2 className="text-xl font-bold mb-4">3. Orders and pricing</h2>
              <p>
                All prices are displayed in pounds sterling (GBP) and include
                VAT at 20%. Prices are subject to change, but changes will not
                affect orders that have already been confirmed.
              </p>
              <p className="mt-3">
                When you place an order, you are making an offer to purchase.
                Your order is accepted when we send you a confirmation email.
                Payment is taken at the time of order via our payment processor
                (Stripe, through Shopify).
              </p>
              <p className="mt-3">
                We reserve the right to refuse or cancel any order for any
                reason, including suspected fraud. If we cancel your order after
                payment has been taken, you will receive a full refund.
              </p>
            </section>

            {/* 4. Subscriptions */}
            <section>
              <h2 className="text-xl font-bold mb-4">4. Subscriptions</h2>
              <p>
                When you subscribe, you authorise us to charge your chosen
                payment method on a recurring basis (monthly or quarterly,
                depending on your selected plan) until you cancel.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>
                  <strong>Billing:</strong> Your subscription renews
                  automatically at the end of each billing period. You will be
                  charged the subscription price at the start of each new
                  period.
                </li>
                <li>
                  <strong>Cancel anytime:</strong> You may cancel, pause, or
                  modify your subscription at any time through your account
                  portal or by emailing{" "}
                  <a
                    href={supportMailtoHref()}
                    className="underline hover:opacity-70"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                  . No questions asked. No cancellation fees.
                </li>
                <li>
                  <strong>Effect of cancellation:</strong> When you cancel, your
                  subscription remains active until the end of your current
                  billing period. No further charges will be made after that
                  point.
                </li>
                <li>
                  <strong>Price changes:</strong> If we change subscription
                  prices, we will notify you by email at least 14 days before
                  the new price takes effect. You may cancel before the new
                  price applies.
                </li>
              </ul>
            </section>

            {/* 5. Guarantee */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                5. {GUARANTEE_DAYS}-day money-back guarantee
              </h2>
              <p>
                We offer a {GUARANTEE_DAYS}-day money-back guarantee to
                first-time customers. If you are not satisfied with your
                purchase for any reason, you may request a full refund within{" "}
                {GUARANTEE_DAYS} days of receiving your first order.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>
                  <strong>Who qualifies:</strong> First-time customers only
                  (one guarantee claim per person).
                </li>
                <li>
                  <strong>How to claim:</strong> Email{" "}
                  <a
                    href={supportMailtoHref()}
                    className="underline hover:opacity-70"
                  >
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  within {GUARANTEE_DAYS} days of receiving your first order.
                </li>
                <li>
                  <strong>Refund:</strong> Full refund of the purchase price.
                  No returns required.
                </li>
                <li>
                  <strong>Processing:</strong> Refunds are processed within 14
                  days of your request being approved.
                </li>
              </ul>
              <p className="mt-3">
                This guarantee is in addition to your statutory rights and does
                not affect them.
              </p>
            </section>

            {/* 6. Delivery */}
            <section>
              <h2 className="text-xl font-bold mb-4">6. Delivery</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>UK delivery:</strong> Orders placed before 2pm on a
                  working day are dispatched the same day. Most UK deliveries
                  arrive within 1 to 2 working days.
                </li>
                <li>
                  <strong>UK shipping cost:</strong> Free on all subscription
                  orders. One-time purchase shipping costs are shown at
                  checkout.
                </li>
                <li>
                  <strong>International delivery:</strong> We ship
                  internationally. Delivery times and shipping costs vary by
                  destination and are calculated at checkout.
                </li>
                <li>
                  <strong>Tracking:</strong> You will receive tracking
                  information by email once your order has been dispatched.
                </li>
              </ul>
            </section>

            {/* 7. Consumer Rights */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                7. Your consumer rights
              </h2>
              <p>
                Under the Consumer Contracts (Information, Cancellation and
                Additional Charges) Regulations 2013, you have the right to
                cancel your order within 14 days of receiving your goods, for
                any reason.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>
                  <strong>14-day cooling-off period:</strong> You have 14 days
                  from the day you receive your order to notify us that you wish
                  to cancel.
                </li>
                <li>
                  <strong>How to cancel:</strong> Email{" "}
                  <a
                    href={supportMailtoHref()}
                    className="underline hover:opacity-70"
                  >
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  stating your name, order number, and that you wish to cancel.
                </li>
                <li>
                  <strong>Returns:</strong> You must return the goods within 14
                  days of notifying us. You are responsible for the cost of
                  return postage.
                </li>
                <li>
                  <strong>Refund:</strong> We will refund the purchase price
                  (including original delivery costs) within 14 days of
                  receiving the returned goods.
                </li>
              </ul>
              <p className="mt-3">
                This right is separate from our {GUARANTEE_DAYS}-day
                money-back guarantee. Our guarantee offers a longer period and
                does not require you to return the product.
              </p>
            </section>

            {/* 8. Returns Outside Guarantee */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                8. Faulty or incorrect goods
              </h2>
              <p>
                Under the Consumer Rights Act 2015, goods must be of
                satisfactory quality, fit for purpose, and as described. If you
                receive a faulty, damaged, or incorrect product:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>
                  Contact{" "}
                  <a
                    href={supportMailtoHref()}
                    className="underline hover:opacity-70"
                  >
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  with your order number, a description of the issue, and photos
                  if applicable.
                </li>
                <li>
                  We will arrange a replacement or full refund at no cost to
                  you.
                </li>
              </ul>
            </section>

            {/* 9. Intellectual Property */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                9. Intellectual property
              </h2>
              <p>
                All content on this website, including text, images, logos,
                branding, and product formulations, is the property of CONKA
                ELITE LIMITED or its licensors. CONKA Flow holds UK patent
                GB2620279.
              </p>
              <p className="mt-3">
                You may not reproduce, distribute, or use any content from this
                website without our prior written consent.
              </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                10. Limitation of liability
              </h2>
              <p>
                Our products are food supplements. They are not intended as a
                substitute for medical advice, diagnosis, or treatment. Always
                consult a healthcare professional before starting any new
                supplement.
              </p>
              <p className="mt-3">
                Individual results may vary. We do not guarantee any specific
                health outcomes from using our products.
              </p>
              <p className="mt-3">
                To the fullest extent permitted by law, our total liability to
                you for any claim arising from or related to your use of our
                products or this website is limited to the amount you paid for
                the products in question.
              </p>
              <p className="mt-3">
                Nothing in these terms excludes or limits our liability for
                death or personal injury caused by negligence, fraud, or any
                other liability that cannot be excluded by law.
              </p>
            </section>

            {/* 11. Privacy */}
            <section>
              <h2 className="text-xl font-bold mb-4">11. Privacy</h2>
              <p>
                We process your personal data in accordance with our{" "}
                <a
                  href="/privacy"
                  className="underline hover:opacity-70"
                >
                  Privacy Policy
                </a>
                . By placing an order, you consent to the processing described
                in that policy.
              </p>
            </section>

            {/* 12. Governing Law */}
            <section>
              <h2 className="text-xl font-bold mb-4">12. Governing law</h2>
              <p>
                These terms are governed by the laws of England and Wales. Any
                disputes will be subject to the exclusive jurisdiction of the
                courts of England and Wales.
              </p>
            </section>

            {/* 13. Changes */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                13. Changes to these terms
              </h2>
              <p>
                We may update these terms from time to time. The updated version
                will be posted on this page with a revised &quot;last
                updated&quot; date. Continued use of the website after changes
                are posted constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* 14. Contact */}
            <section>
              <h2 className="text-xl font-bold mb-4">14. Contact us</h2>
              <p>
                If you have any questions about these terms, contact us at:
              </p>
              <ul className="list-none space-y-1 mt-3 ml-4">
                <li>
                  Email:{" "}
                  <a
                    href={supportMailtoHref()}
                    className="underline hover:opacity-70"
                  >
                    {SUPPORT_EMAIL}
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
