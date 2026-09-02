import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | CONKA",
  description:
    "How CONKA collects, uses, and protects your personal data when you use our website and purchase our products.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm opacity-70">Last updated 1 April 2026</p>
          </div>

          <div className="space-y-10 text-base leading-relaxed">
            {/* 1. Who we are */}
            <section>
              <h2 className="text-xl font-bold mb-4">1. Who we are</h2>
              <p>
                <strong>CONKA ELITE LIMITED</strong> is the data controller
                responsible for your personal data.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-4">
                <li>Company number: 13235415</li>
                <li>
                  Registered address: The Light Bulb, 1 Filament Walk, U 107
                  Conka, London, SW18 4GQ
                </li>
                <li>VAT number: GB430507628</li>
                <li>
                  Data protection contact:{" "}
                  <a
                    href="mailto:info@conka.io"
                    className="underline hover:opacity-70"
                  >
                    info@conka.io
                  </a>
                </li>
              </ul>
              <p className="mt-3">
                This policy covers data collected through our website
                (conka.io). For our mobile app privacy policy, see{" "}
                <a
                  href="/conkaapp-privacy-policy"
                  className="underline hover:opacity-70"
                >
                  CONKA App Privacy Policy
                </a>
                .
              </p>
            </section>

            {/* 2. What data we collect */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                2. What data we collect
              </h2>

              <h3 className="text-lg font-semibold mt-6 mb-3">
                Data you provide directly
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Account and order information:</strong> Name, email
                  address, delivery address, phone number, and order details
                  when you make a purchase or create an account.
                </li>
                <li>
                  <strong>Payment information:</strong> Payment card details are
                  processed by Stripe through Shopify. We do not store your full
                  card number.
                </li>
                <li>
                  <strong>Communications:</strong> If you contact us by email,
                  we keep a record of the correspondence.
                </li>
                <li>
                  <strong>Marketing preferences:</strong> Your email address and
                  consent status when you sign up for marketing emails.
                </li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">
                Data collected automatically
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Browsing data:</strong> Pages visited, time on page,
                  referral source, browser type, device type, and IP address.
                </li>
                <li>
                  <strong>Cookies and tracking technologies:</strong> See our{" "}
                  <a
                    href="/cookies"
                    className="underline hover:opacity-70"
                  >
                    Cookie Policy
                  </a>{" "}
                  for details.
                </li>
              </ul>
            </section>

            {/* 3. How we use your data */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                3. How and why we use your data
              </h2>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Purpose
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Data used
                      </th>
                      <th className="text-left py-3 font-semibold">
                        Legal basis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <tr>
                      <td className="py-3 pr-4">Fulfilling your orders</td>
                      <td className="py-3 pr-4">
                        Name, address, email, order details
                      </td>
                      <td className="py-3">Contract performance</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Processing payments</td>
                      <td className="py-3 pr-4">Payment details (via Stripe)</td>
                      <td className="py-3">Contract performance</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">
                        Managing your subscription
                      </td>
                      <td className="py-3 pr-4">
                        Account details, billing history
                      </td>
                      <td className="py-3">Contract performance</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">
                        Sending order updates and delivery notifications
                      </td>
                      <td className="py-3 pr-4">Email, order details</td>
                      <td className="py-3">Contract performance</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">
                        Email marketing (existing customers)
                      </td>
                      <td className="py-3 pr-4">
                        Email, name, purchase history
                      </td>
                      <td className="py-3">
                        Legitimate interest (soft opt-in)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">
                        Email marketing (non-customers)
                      </td>
                      <td className="py-3 pr-4">Email</td>
                      <td className="py-3">Consent</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Website analytics</td>
                      <td className="py-3 pr-4">
                        Browsing data, device info
                      </td>
                      <td className="py-3">Legitimate interest</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">
                        Advertising and retargeting
                      </td>
                      <td className="py-3 pr-4">
                        Browsing events, purchase events
                      </td>
                      <td className="py-3">Consent (via cookie consent)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Fraud prevention</td>
                      <td className="py-3 pr-4">
                        Order details, IP address, payment data
                      </td>
                      <td className="py-3">Legitimate interest</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Third parties */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                4. Who we share your data with
              </h2>
              <p>
                We share your data with the following third parties, only for
                the purposes described above:
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Provider
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Purpose
                      </th>
                      <th className="text-left py-3 font-semibold">
                        Data shared
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <tr>
                      <td className="py-3 pr-4">Shopify</td>
                      <td className="py-3 pr-4">E-commerce platform</td>
                      <td className="py-3">
                        Order data, customer details, cart data. See{" "}
                        <a
                          href="https://www.shopify.com/legal/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:opacity-70"
                        >
                          Shopify&apos;s Privacy Policy
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Stripe</td>
                      <td className="py-3 pr-4">Payment processing</td>
                      <td className="py-3">Payment card details</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Klaviyo</td>
                      <td className="py-3 pr-4">Email marketing</td>
                      <td className="py-3">
                        Email, name, purchase history
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Meta (Facebook/Instagram)</td>
                      <td className="py-3 pr-4">
                        Advertising and attribution
                      </td>
                      <td className="py-3">
                        Browsing events, purchase events
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Google Analytics</td>
                      <td className="py-3 pr-4">Website analytics</td>
                      <td className="py-3">
                        Browsing behaviour (anonymised)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Triple Whale</td>
                      <td className="py-3 pr-4">Ad attribution</td>
                      <td className="py-3">Purchase events</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Vercel</td>
                      <td className="py-3 pr-4">
                        Website hosting and analytics
                      </td>
                      <td className="py-3">Page view data</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Skio</td>
                      <td className="py-3 pr-4">Subscription management</td>
                      <td className="py-3">
                        Subscription and billing data
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Royal Mail / courier</td>
                      <td className="py-3 pr-4">Delivery</td>
                      <td className="py-3">Name, delivery address</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">
                We do not sell your personal data to any third party.
              </p>
            </section>

            {/* 5. Data retention */}
            <section>
              <h2 className="text-xl font-bold mb-4">5. Data retention</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Order and customer data:</strong> Retained for 6 years
                  after your last order (UK tax and accounting requirements).
                </li>
                <li>
                  <strong>Marketing data:</strong> Retained until you
                  unsubscribe. We remove your data from marketing lists within
                  30 days of your request.
                </li>
                <li>
                  <strong>Analytics data:</strong> Retained per the default
                  retention periods of each analytics platform (typically 14-26
                  months).
                </li>
                <li>
                  <strong>Account data:</strong> Retained while your account is
                  active. You can request deletion at any time.
                </li>
              </ul>
            </section>

            {/* 6. Security */}
            <section>
              <h2 className="text-xl font-bold mb-4">6. Security</h2>
              <p>
                We use appropriate technical and organisational measures to
                protect your personal data, including encryption, access
                controls, and secure hosting. However, no method of transmission
                over the internet or electronic storage is completely secure. We
                cannot guarantee absolute security, but we are committed to
                protecting your data to the best of our ability.
              </p>
            </section>

            {/* 7. Advertising and opt-outs */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                7. Targeted advertising and how to opt out
              </h2>
              <p>
                We use third-party advertising services to show you relevant ads
                based on your browsing behaviour on our website. This includes
                retargeting (showing you CONKA ads after you visit our site) and
                conversion tracking (measuring whether an ad led to a purchase).
              </p>
              <p className="mt-3">
                You can opt out of targeted advertising through these platforms
                directly:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>
                  <strong>Meta (Facebook/Instagram):</strong>{" "}
                  <a
                    href="https://www.facebook.com/settings/?tab=ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-70"
                  >
                    facebook.com/settings/?tab=ads
                  </a>
                </li>
                <li>
                  <strong>Google:</strong>{" "}
                  <a
                    href="https://www.google.com/settings/ads/anonymous"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-70"
                  >
                    google.com/settings/ads
                  </a>
                </li>
              </ul>
              <p className="mt-3">
                You can also manage advertising cookies through our cookie
                consent banner or your browser settings. See our{" "}
                <a
                  href="/cookies"
                  className="underline hover:opacity-70"
                >
                  Cookie Policy
                </a>{" "}
                for details.
              </p>
            </section>

            {/* 8. User-generated content */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                8. Reviews and user-generated content
              </h2>
              <p>
                We collect and display customer reviews via Loox, a verified
                review platform. Review invitations are sent to customers after
                purchase. If you submit a review, your first name and review
                content may be displayed publicly on our website. We do not
                control how others may use information you choose to make
                public through reviews.
              </p>
            </section>

            {/* 9. Your rights */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                9. Your rights under UK GDPR
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>
                  <strong>Access</strong> the personal data we hold about you
                  (Subject Access Request).
                </li>
                <li>
                  <strong>Rectify</strong> inaccurate or incomplete data.
                </li>
                <li>
                  <strong>Erase</strong> your personal data (&quot;right to be
                  forgotten&quot;), subject to legal retention obligations.
                </li>
                <li>
                  <strong>Restrict</strong> how we process your data in certain
                  circumstances.
                </li>
                <li>
                  <strong>Port</strong> your data to another provider in a
                  structured, machine-readable format.
                </li>
                <li>
                  <strong>Object</strong> to processing based on legitimate
                  interest, including direct marketing.
                </li>
                <li>
                  <strong>Withdraw consent</strong> at any time where processing
                  is based on consent (e.g. marketing emails, cookies).
                </li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, email{" "}
                <a
                  href="mailto:info@conka.io"
                  className="underline hover:opacity-70"
                >
                  info@conka.io
                </a>
                . We will respond within 30 days.
              </p>
              <p className="mt-3">
                If you are not satisfied with our response, you have the right
                to complain to the Information Commissioner&apos;s Office (ICO):
              </p>
              <ul className="list-none space-y-1 mt-2 ml-4">
                <li>
                  Website:{" "}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-70"
                  >
                    ico.org.uk
                  </a>
                </li>
                <li>Helpline: 0303 123 1113</li>
              </ul>
            </section>

            {/* 10. International transfers */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                10. International data transfers
              </h2>
              <p>
                Some of our third-party processors (including Meta, Google,
                Vercel, and Stripe) transfer data outside the UK. Where this
                happens, we ensure appropriate safeguards are in place, including
                Standard Contractual Clauses (SCCs) approved by the UK
                Information Commissioner, or transfers to countries with
                adequacy decisions.
              </p>
            </section>

            {/* 11. Cookies */}
            <section>
              <h2 className="text-xl font-bold mb-4">11. Cookies</h2>
              <p>
                We use cookies and similar technologies on our website. For full
                details of the cookies we use, why we use them, and how to
                manage your preferences, see our{" "}
                <a
                  href="/cookies"
                  className="underline hover:opacity-70"
                >
                  Cookie Policy
                </a>
                .
              </p>
            </section>

            {/* 12. Do Not Track */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                12. Do Not Track
              </h2>
              <p>
                Some browsers include a &quot;Do Not Track&quot; (DNT) feature
                that signals to websites that you do not wish to be tracked.
                There is currently no universally accepted standard for how
                websites should respond to DNT signals. At this time, our
                website does not respond to DNT signals, but you can manage
                your cookie and tracking preferences through our cookie consent
                banner.
              </p>
            </section>

            {/* 13. Third-party websites */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                13. Third-party websites and links
              </h2>
              <p>
                Our website may contain links to websites operated by third
                parties. These links are provided for your convenience and do
                not signify our endorsement of such websites. We have no
                control over, and are not responsible for, the privacy practices
                or content of third-party websites. We encourage you to review
                the privacy policies of any third-party sites you visit.
              </p>
            </section>

            {/* 14. Children */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                14. Children&apos;s data
              </h2>
              <p>
                Our products are not marketed to, or intended for, children
                under 16. We do not knowingly collect personal data from
                children under 16. If you believe we have collected data from a
                child, please contact us and we will delete it promptly.
              </p>
            </section>

            {/* 15. Changes */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                15. Changes to this policy
              </h2>
              <p>
                We may update this policy from time to time. The updated version
                will be posted on this page with a revised &quot;last
                updated&quot; date. We encourage you to review this page
                periodically.
              </p>
            </section>

            {/* 16. Contact */}
            <section>
              <h2 className="text-xl font-bold mb-4">16. Contact us</h2>
              <p>
                If you have any questions about this privacy policy or how we
                handle your data, contact us at:
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
