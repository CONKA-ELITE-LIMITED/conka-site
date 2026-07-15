"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FOOTER_SOCIALS } from "@/app/lib/site";

type FooterLink = { label: string; href: string; external?: boolean };

const DISCOVER: FooterLink[] = [
  { label: "The Science", href: "/science" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "FAQ", href: "/faq" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "The CONKA App", href: "/app" },
  { label: "App Insights", href: "/app-insights" },
];

const SHOP: FooterLink[] = [
  { label: "CONKA Flow", href: "/conka-flow" },
  { label: "CONKA Clear", href: "/conka-clarity" },
  { label: "Flow + Clear", href: "/conka-both" },
];

const COMPANY: FooterLink[] = [
  { label: "Our Story", href: "/our-story" },
  { label: "Why CONKA", href: "/why-conka" },
];

const SUPPORT: FooterLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Account", href: "/account" },
];

/**
 * The visible counterpart to the Organization schema's `sameAs` claim
 * (SCRUM-1141): real outbound links are what corroborate it. Text rather than
 * icons, so crawlers get readable anchor text and the mono footer stays coherent.
 */
const FOLLOW: FooterLink[] = FOOTER_SOCIALS.map((social) => ({
  label: social.label,
  href: social.url,
  external: true,
}));

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  { title: "Discover", links: DISCOVER },
  { title: "Shop", links: SHOP },
  { title: "Company", links: COMPANY },
  { title: "Support", links: SUPPORT },
  { title: "Follow", links: FOLLOW },
];

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
      className="brand-clinical bg-black text-white border-t border-white/12"
      role="contentinfo"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-28">
        {/* Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-10 md:pb-14 border-b border-white/12">
          <div className="flex flex-col items-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 tabular-nums mb-3">
              {"// Newsletter · CONKA-00"}
            </p>
            <h2
              className="brand-h3 text-white mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              Unlock a new state of mind.
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 tabular-nums">
              Tips · Research · Offers · No spam
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
                placeholder="email@domain.com"
                className="flex-1 min-h-[48px] px-4 py-3 bg-white/5 border border-white/20 text-white placeholder:text-white/40 font-mono text-sm tabular-nums focus:outline-none focus:border-white disabled:opacity-50"
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
                className="lab-clip-tr bg-white text-black hover:bg-[#1B2757] hover:text-white transition-colors min-h-[48px] px-6 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {newsletterStatus === "loading"
                  ? "Submitting"
                  : "Subscribe ↗"}
              </button>
            </form>
            {newsletterError && (
              <p
                id="footer-email-error"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 tabular-nums mt-3"
                role="alert"
              >
                Error · {newsletterError}
              </p>
            )}
            {newsletterStatus === "success" && (
              <p
                id="footer-email-success"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 tabular-nums mt-3"
                role="status"
                aria-live="polite"
              >
                Confirmed · You&apos;re in.
              </p>
            )}
          </div>
        </div>

        {/* Logo + Link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 py-10 md:py-14 border-b border-white/12">
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
              className="h-14 md:h-16 w-auto invert"
            />
          </Link>

          {/* 5 columns: 2-up on mobile (Follow lands last, on its own row),
              3-up at md, all 5 side by side from lg. */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {COLUMNS.map((col) => (
              <nav
                key={col.title}
                aria-label={col.title}
                className="flex flex-col"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 tabular-nums mb-4">
                  {"// "}{col.title}
                </p>
                <ul className="flex flex-col">
                  {col.links.map((link, idx) => (
                    <li
                      key={link.href}
                      className={
                        idx < col.links.length - 1
                          ? "border-b border-white/8"
                          : ""
                      }
                    >
                      <a
                        href={link.href}
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="flex items-center gap-3 py-2.5 min-h-[44px] group"
                      >
                        <span className="font-mono text-[9px] tabular-nums text-white/35 group-hover:text-white/60 transition-colors">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-white/75 group-hover:text-white transition-colors">
                          {link.label}
                          {link.external ? " ↗" : ""}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 tabular-nums">
            © CONKA {year} · Made in UK · All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 tabular-nums">
            Doc-FT-001 · Informed Sport · Batch tested
          </p>
        </div>
      </div>
    </footer>
  );
}
