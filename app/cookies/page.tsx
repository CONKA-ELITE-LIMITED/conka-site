import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { SUPPORT_EMAIL, supportMailtoHref } from "@/app/lib/supportEmail";

export const metadata: Metadata = {
  title: "Cookie Policy | CONKA",
  description:
    "How CONKA uses cookies and similar technologies on our website.",
};

export default function CookiesPage() {
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
              Cookie Policy
            </h1>
            <p className="text-sm opacity-70">Last updated 1 April 2026</p>
          </div>

          <div className="space-y-10 text-base leading-relaxed">
            {/* 1. What are cookies */}
            <section>
              <h2 className="text-xl font-bold mb-4">1. What are cookies?</h2>
              <p>
                Cookies are small text files placed on your device when you
                visit a website. They help the website remember your preferences
                and understand how you use the site. Some cookies are essential
                for the site to work; others help us improve your experience or
                deliver relevant advertising.
              </p>
            </section>

            {/* 2. Cookies we use */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                2. Cookies we use
              </h2>

              {/* Essential */}
              <h3 className="text-lg font-semibold mt-6 mb-3">
                Essential cookies
              </h3>
              <p className="mb-3">
                These are required for the website to function. They cannot be
                disabled.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Cookie
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Provider
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Purpose
                      </th>
                      <th className="text-left py-3 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        shopify_cart_id
                      </td>
                      <td className="py-3 pr-4">CONKA (localStorage)</td>
                      <td className="py-3 pr-4">
                        Remembers your shopping cart between visits
                      </td>
                      <td className="py-3">Until cleared</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Performance */}
              <h3 className="text-lg font-semibold mt-8 mb-3">
                Performance cookies
              </h3>
              <p className="mb-3">
                These help us understand how visitors use the website so we can
                improve it.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Cookie
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Provider
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Purpose
                      </th>
                      <th className="text-left py-3 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        _ga, _ga_*
                      </td>
                      <td className="py-3 pr-4">Google Analytics</td>
                      <td className="py-3 pr-4">
                        Measures website traffic and user behaviour
                      </td>
                      <td className="py-3">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        va_*
                      </td>
                      <td className="py-3 pr-4">Vercel Analytics</td>
                      <td className="py-3 pr-4">
                        Measures page performance and load times
                      </td>
                      <td className="py-3">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Marketing */}
              <h3 className="text-lg font-semibold mt-8 mb-3">
                Marketing cookies
              </h3>
              <p className="mb-3">
                These are used to deliver relevant advertising and measure ad
                effectiveness. They are only set with your consent.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Cookie
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Provider
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold">
                        Purpose
                      </th>
                      <th className="text-left py-3 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        _fbp, _fbc
                      </td>
                      <td className="py-3 pr-4">Meta (Facebook/Instagram)</td>
                      <td className="py-3 pr-4">
                        Ad attribution, retargeting, and conversion tracking
                      </td>
                      <td className="py-3">90 days</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        TriplePixel
                      </td>
                      <td className="py-3 pr-4">Triple Whale</td>
                      <td className="py-3 pr-4">
                        Purchase attribution for advertising
                      </td>
                      <td className="py-3">Session</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        __kla_id
                      </td>
                      <td className="py-3 pr-4">Klaviyo</td>
                      <td className="py-3 pr-4">
                        Identifies visitors for email marketing personalisation
                      </td>
                      <td className="py-3">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. Managing cookies */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                3. Managing your cookie preferences
              </h2>
              <p>
                When you first visit our website, you will see a cookie consent
                banner that allows you to accept or reject non-essential
                cookies. You can change your preferences at any time by clicking
                the cookie settings link in the footer of any page.
              </p>
              <p className="mt-3">
                You can also control cookies through your browser settings. Most
                browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>View what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies from specific sites</li>
                <li>Block all cookies from being set</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p className="mt-3">
                Please note that blocking or deleting cookies may affect the
                functionality of this website. Essential cookies (such as your
                shopping cart) cannot be disabled without breaking core
                features.
              </p>
            </section>

            {/* 4. More information */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                4. More information
              </h2>
              <p>
                For more information about how we handle your personal data, see
                our{" "}
                <a
                  href="/privacy"
                  className="underline hover:opacity-70"
                >
                  Privacy Policy
                </a>
                .
              </p>
              <p className="mt-3">
                If you have any questions about our use of cookies, contact us
                at{" "}
                <a
                  href={supportMailtoHref()}
                  className="underline hover:opacity-70"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </section>

            {/* 5. Changes */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                5. Changes to this policy
              </h2>
              <p>
                We may update this cookie policy to reflect changes in the
                cookies we use or for legal reasons. The updated version will be
                posted on this page with a revised &quot;last updated&quot;
                date.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
