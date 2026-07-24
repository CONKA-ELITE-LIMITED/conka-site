"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { COMPANY, FOOTER_SOCIALS } from "@/app/lib/site";

type FooterLink = { label: string; href: string };

const SHOP: FooterLink[] = [
  { label: "CONKA Flow", href: "/conka-flow" },
  { label: "CONKA Clear", href: "/conka-clarity" },
  { label: "Flow + Clear", href: "/conka-both" },
  { label: "For professionals", href: "/professionals" },
];

const DISCOVER: FooterLink[] = [
  { label: "The science", href: "/science" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Case studies", href: "/case-studies" },
  { label: "The CONKA app", href: "/app" },
  { label: "App insights", href: "/app-insights" },
  { label: "Blog", href: "/blog" },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: "Our story", href: "/our-story" },
  { label: "Why CONKA", href: "/why-conka" },
  { label: "Contact us", href: "mailto:info@conka.io" },
];

const SUPPORT: FooterLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & returns", href: "/shipping" },
  { label: "Your account", href: "/account" },
  { label: "Manage subscription", href: "/account/subscriptions" },
];

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  { title: "Shop", links: SHOP },
  { title: "Discover", links: DISCOVER },
  { title: "Company", links: COMPANY_LINKS },
  { title: "Support", links: SUPPORT },
];

const LEGAL: FooterLink[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Disclaimer", href: "/disclaimer" },
];

/**
 * Glyphs for the social row, keyed by the `label` in `SOCIAL_PROFILES`.
 * The visible label stays alongside the icon: the links are the outbound
 * corroboration of the Organization schema's `sameAs` claim (SCRUM-1141), so
 * they need readable anchor text, not an icon-only link.
 */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="17" />
      <circle cx="7.5" cy="7" r="0.75" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-3.5a2.5 2.5 0 0 1 5 0V17" />
      <line x1="11.5" y1="10.5" x2="11.5" y2="17" />
    </>
  ),
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  TikTok: (
    <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5M14 4a4.5 4.5 0 0 0 4.5 4.5" />
  ),
  Trustpilot: (
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" />
  ),
};

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  const handleNewsletterSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setNewsletterError(null);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newsletterEmail)) {
        setNewsletterError("Please enter a valid email address");
        return;
      }
      setNewsletterStatus("loading");
      try {
        const res = await fetch("/api/klaviyo/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: newsletterEmail.toLowerCase().trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.success) {
          setNewsletterStatus("success");
          setNewsletterEmail("");
        } else {
          setNewsletterStatus("error");
          setNewsletterError(
            data.error ||
              data.reason ||
              "Something went wrong. Please try again.",
          );
        }
      } catch {
        setNewsletterStatus("error");
        setNewsletterError("Something went wrong. Please try again.");
      }
    },
    [newsletterEmail],
  );

  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-black text-white border-t border-white/12"
      role="contentinfo"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-28">
        {/* Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center pb-10 md:pb-14 border-b border-white/12">
          <div className="flex flex-col items-start">
            <h2
              className="brand-h3 text-white mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Unlock a new state of mind.
            </h2>
            <p className="text-[15px] leading-relaxed text-white/60">
              Tips, research and offers. No spam.
            </p>
          </div>

          <div className="flex flex-col">
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-2"
              aria-label="Newsletter signup"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  setNewsletterError(null);
                }}
                placeholder="Your email address"
                className="flex-1 min-h-[48px] rounded-full px-5 py-3 bg-white/[0.07] border border-white/20 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 disabled:opacity-50"
                disabled={newsletterStatus === "loading"}
                required
                aria-invalid={!!newsletterError}
                aria-describedby={
                  newsletterError
                    ? "footer-email-error"
                    : newsletterStatus === "success"
                      ? "footer-email-success"
                      : undefined
                }
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="rounded-full bg-white text-black hover:bg-white/85 transition-colors min-h-[48px] px-7 text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {newsletterStatus === "loading" ? "Submitting" : "Subscribe"}
              </button>
            </form>
            {newsletterError && (
              <p
                id="footer-email-error"
                className="text-[14px] text-white/70 mt-3"
                role="alert"
              >
                {newsletterError}
              </p>
            )}
            {newsletterStatus === "success" && (
              <p
                id="footer-email-success"
                className="text-[14px] text-white/70 mt-3"
                role="status"
                aria-live="polite"
              >
                You&apos;re in. Check your inbox.
              </p>
            )}
          </div>
        </div>

        {/* Logo + link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 py-10 md:py-14 border-b border-white/12">
          <Link
            href="/"
            className="flex items-start hover:opacity-70 transition-opacity w-fit shrink-0"
            aria-label="CONKA home"
          >
            <img
              src="/conka-logo.webp"
              alt="CONKA logo"
              width={220}
              height={56}
              className="h-12 md:h-14 w-auto invert"
            />
          </Link>

          {/* 2-up on mobile, all 4 side by side from md. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            {COLUMNS.map((col) => (
              <nav
                key={col.title}
                aria-label={col.title}
                className="flex flex-col"
              >
                <h3 className="text-[14px] font-semibold text-white mb-4">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-1">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="flex items-center min-h-[36px] py-1 text-[15px] leading-snug text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Company details + socials */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 py-10 border-b border-white/12">
          <div className="text-[14px] leading-relaxed text-white/60">
            <p className="font-semibold text-white">{COMPANY.legalName}</p>
            <p>
              {COMPANY.address.street}, {COMPANY.address.locality},{" "}
              {COMPANY.address.postalCode}
            </p>
            <p className="mt-2">
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-white hover:opacity-70 transition-opacity"
              >
                {COMPANY.email}
              </a>
            </p>
          </div>

          <nav aria-label="Follow CONKA" className="flex flex-wrap gap-2">
            {FOOTER_SOCIALS.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 min-h-[44px] rounded-full border border-white/20 px-4 text-[14px] text-white/70 hover:text-white hover:border-white/50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  {SOCIAL_ICONS[social.label]}
                </svg>
                {social.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Disclaimer + legal + copyright */}
        <div className="pt-8 flex flex-col gap-5">
          <p className="text-[13px] leading-relaxed text-white/45 max-w-3xl">
            Food supplements are not a substitute for a varied, balanced diet
            and a healthy lifestyle. CONKA is not intended to diagnose, treat,
            cure or prevent any disease. If you are pregnant, breastfeeding,
            taking medication or have a medical condition, consult your doctor
            before use.{" "}
            <Link
              href="/disclaimer"
              className="text-white/70 underline underline-offset-2 hover:text-white transition-colors"
            >
              Read the full disclaimer
            </Link>
            .
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-white/45 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="text-[13px] text-white/45">
              © CONKA {year} · Made in the UK · Informed Sport batch tested
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
