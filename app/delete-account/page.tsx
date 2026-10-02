import type { Metadata } from "next";
import Image from "next/image";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { SUPPORT_EMAIL, supportMailtoHref } from "@/app/lib/supportEmail";

// Public account-deletion page for the CONKA app (SCRUM-1502). Its URL is
// entered in the Google Play Console Data safety form, so it must stay
// reachable without signing in. Detail lives in the app privacy policy,
// section 14 (#deleteaccount); keep the two in step.
export const metadata: Metadata = {
  title: "Delete Your App Account | CONKA",
  description:
    "How to delete your CONKA app account, in the app or by email, and what happens to your data when you do.",
  openGraph: {
    title: "Delete Your CONKA App Account",
    description:
      "How to delete your CONKA app account, in the app or by email, and what happens to your data.",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete Your CONKA App Account",
    description:
      "How to delete your CONKA app account, in the app or by email, and what happens to your data.",
    images: ["/opengraph-image.png"],
  },
};

export default function DeleteAccountPage() {
  return (
    <div
      className="min-h-screen theme-conka-flow lg:pt-20"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navigation />

      <main className="px-6 md:px-16 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-8">
              <Image
                src="/conka.png"
                alt="CONKA logo"
                width={178}
                height={38}
                className="h-10 w-auto mx-auto"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              DELETE YOUR CONKA APP ACCOUNT
            </h1>
            <p className="text-sm opacity-70">Last updated October 1, 2026</p>
          </div>

          {/* Introduction */}
          <div className="mb-12 space-y-4">
            <p className="text-base leading-relaxed">
              This page explains how to delete your account in the{" "}
              <strong>CONKA</strong> app, made by{" "}
              <strong>CONKA ELITE LIMITED</strong>, and what happens to your
              data when you do.
            </p>
          </div>

          <section id="in-app" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              1. DELETE YOUR ACCOUNT IN THE APP
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4 text-base mb-6">
              <li>Open the CONKA app and sign in.</li>
              <li>Go to Profile, then Settings.</li>
              <li>Tap Delete account.</li>
              <li>Confirm with your password.</li>
            </ol>
            <p className="text-base leading-relaxed mb-4">
              You are signed out on every device. Sign back in within 30 days
              and your account is restored. After 30 days it is permanently
              deleted.
            </p>
          </section>

          <section id="by-email" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              2. ASK US BY EMAIL
            </h2>
            <p className="text-base leading-relaxed mb-4">
              If you cannot use the app, email{" "}
              <a
                href={supportMailtoHref({
                  subject: "Delete my CONKA app account",
                })}
                className="text-teal-500 underline"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              from the email address on your account. We only act on requests
              sent from that address. We act within one month, and the same
              30-day window applies.
            </p>
          </section>

          <section id="what-happens" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              3. WHAT HAPPENS TO YOUR DATA
            </h2>
            <p className="text-base leading-relaxed mb-4">
              We erase your name, email address, phone number, date of birth and
              app data. We keep your test results, wellness answers, Apple Health
              data, birth year, sex, sport and organisation, de-identified, for
              research and to improve CONKA. Deleting your account does not
              cancel a CONKA subscription or unsubscribe you from marketing
              emails. Full detail is in section 14 of our{" "}
              <a
                href="/conkaapp-privacy-policy#deleteaccount"
                className="text-teal-500 underline"
              >
                App Privacy Policy
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
