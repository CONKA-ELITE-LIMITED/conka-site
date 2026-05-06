"use client";

import { supportMailtoHref } from "@/app/lib/supportEmail";

const EnvelopeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const EnvelopeIconSmall = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const HelpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const variantStyles = {
  "button-primary":
    "inline-flex items-center gap-2 rounded-[var(--brand-radius-interactive)] border-2 border-[var(--color-neuro-blue-dark)] bg-[var(--color-neuro-blue-dark)] px-6 py-2.5 brand-caption font-semibold text-white hover:opacity-90 transition-opacity",
  "button-secondary":
    "inline-flex items-center gap-2 rounded-[var(--brand-radius-interactive)] border-2 border-[var(--color-bone)] px-6 py-2.5 brand-caption font-semibold text-[var(--color-bone)] hover:bg-[var(--color-bone)]/10 transition-colors",
  "button-primary-small":
    "inline-flex items-center gap-2 rounded-[var(--brand-radius-interactive)] border-2 border-[var(--color-neuro-blue-dark)] bg-[var(--color-neuro-blue-dark)] px-5 py-2.5 brand-caption font-semibold text-white hover:opacity-90 transition-opacity",
  "button-outline":
    "inline-flex items-center gap-2 rounded-[var(--brand-radius-interactive)] border-2 border-[var(--color-ink)]/40 bg-[var(--color-bone)] px-6 py-2.5 brand-caption font-semibold text-[var(--color-ink)] hover:bg-[var(--brand-stroke)] transition-colors",
  inline: "underline font-medium",
  "link-blue":
    "brand-caption text-[var(--color-neuro-blue-dark)] font-medium hover:underline inline-flex items-center gap-1.5",
  "button-outline-subtle":
    "inline-flex items-center justify-center gap-2 rounded-[var(--brand-radius-interactive)] border border-[var(--brand-stroke)] py-2.5 brand-caption font-semibold text-[var(--color-ink)] hover:bg-[var(--brand-stroke)] transition-colors",
  "button-primary-small-full":
    "inline-flex items-center justify-center gap-2 rounded-[var(--brand-radius-interactive)] border-2 border-[var(--color-neuro-blue-dark)] bg-[var(--color-neuro-blue-dark)] px-4 py-2.5 brand-caption font-semibold text-white hover:opacity-90 transition-opacity w-full",
} as const;

export type ContactSupportVariant = keyof typeof variantStyles;

export interface ContactSupportLinkProps {
  /** Optional subject line for the email */
  subject?: string;
  /** Optional body for the email */
  body?: string;
  /** Visual style variant */
  variant?: ContactSupportVariant;
  /** Override default "Contact support" label */
  children?: React.ReactNode;
  /** Extra class names */
  className?: string;
  /** Icon: 'envelope' (default), 'envelope-small', 'help', or false for none */
  icon?: "envelope" | "envelope-small" | "help" | false;
  /** For use inside modals: call when link is clicked (e.g. close modal) */
  onClick?: () => void;
}

export function ContactSupportLink({
  subject,
  body,
  variant = "button-primary",
  children = "Contact support",
  className = "",
  icon = "envelope",
  onClick,
}: ContactSupportLinkProps) {
  const href = supportMailtoHref({ subject, body });
  const base = variantStyles[variant];
  const iconEl =
    icon === "envelope" ? (
      <EnvelopeIcon />
    ) : icon === "envelope-small" ? (
      <EnvelopeIconSmall />
    ) : icon === "help" ? (
      <HelpIcon />
    ) : null;

  return (
    <a
      href={href}
      className={[base, className].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      {iconEl}
      {children}
    </a>
  );
}
