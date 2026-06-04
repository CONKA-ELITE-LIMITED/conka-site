"use client";

import { useCallback, useState } from "react";
import { B2B_SPORTS, B2B_SQUAD_SIZES } from "@/app/lib/b2bData";
import { trackB2BApplicationSubmitted } from "@/app/lib/analytics";

/**
 * B2B teams enquiry form. Content-only client component: the page owns the
 * section wrapper and background. Posts to /api/b2b/apply, which routes the
 * lead to Klaviyo (welcome email + Harry notification + B2B Leads list).
 */

interface FormState {
  firstName: string;
  lastName: string;
  workEmail: string;
  phone: string;
  organisation: string;
  sport: string;
  squadSize: string;
  jobTitle: string;
  website: string;
  vatNumber: string;
  postcode: string;
  hearAbout: string;
  company: string; // honeypot
}

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  workEmail: "",
  phone: "",
  organisation: "",
  sport: "",
  squadSize: "",
  jobTitle: "",
  website: "",
  vatNumber: "",
  postcode: "",
  hearAbout: "",
  company: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelClass = "brand-eyebrow block mb-2";
const fieldClass =
  "w-full min-h-[48px] bg-white border border-black/12 rounded-none px-4 py-3 text-base text-black placeholder-black/30 focus:outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 transition-colors";

export default function ApplicationForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const update = useCallback(
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
      },
    [],
  );

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!form.workEmail.trim()) next.workEmail = "Required";
    else if (!EMAIL_RE.test(form.workEmail.trim())) next.workEmail = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Required";
    if (!form.organisation.trim()) next.organisation = "Required";
    if (!form.sport) next.sport = "Select a sport";
    if (!form.squadSize) next.squadSize = "Select a size";
    if (!form.jobTitle.trim()) next.jobTitle = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/b2b/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        setStatus("error");
        setServerError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      trackB2BApplicationSubmitted({ sport: form.sport, squadSize: form.squadSize });
      setStatus("success");
    } catch {
      setStatus("error");
      setServerError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-none border border-black/12 bg-white p-8 lg:p-10 text-center">
        <p className="brand-eyebrow mb-4">Application received</p>
        <h3 className="brand-h3 mb-3">Check your inbox.</h3>
        <p className="brand-body mx-auto">
          We have sent your team pricing link to{" "}
          <span className="font-medium">{form.workEmail}</span>. It includes
          everything you need to place an order. Can&apos;t see it? Check your spam
          folder, or email{" "}
          <a href="mailto:harry@conka.io" className="underline">
            harry@conka.io
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot: visually hidden, off-screen, not tab-reachable. Bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={update("company")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="First name" error={errors.firstName}>
          <input className={fieldClass} value={form.firstName} onChange={update("firstName")} autoComplete="given-name" />
        </Field>
        <Field label="Last name" error={errors.lastName}>
          <input className={fieldClass} value={form.lastName} onChange={update("lastName")} autoComplete="family-name" />
        </Field>
        <Field label="Work email" error={errors.workEmail}>
          <input className={fieldClass} type="email" value={form.workEmail} onChange={update("workEmail")} autoComplete="email" inputMode="email" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input className={fieldClass} type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" inputMode="tel" />
        </Field>
        <Field label="Organisation name" error={errors.organisation}>
          <input className={fieldClass} value={form.organisation} onChange={update("organisation")} autoComplete="organization" />
        </Field>
        <Field label="Job title" error={errors.jobTitle}>
          <input className={fieldClass} value={form.jobTitle} onChange={update("jobTitle")} autoComplete="organization-title" />
        </Field>
        <Field label="Sport / sector" error={errors.sport}>
          <select className={fieldClass} value={form.sport} onChange={update("sport")}>
            <option value="" disabled>
              Select a sport
            </option>
            {B2B_SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Squad / team size" error={errors.squadSize}>
          <select className={fieldClass} value={form.squadSize} onChange={update("squadSize")}>
            <option value="" disabled>
              Select a size
            </option>
            {B2B_SQUAD_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Optional details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
        <Field label="Organisation website" optional>
          <input className={fieldClass} value={form.website} onChange={update("website")} placeholder="optional" autoComplete="url" />
        </Field>
        <Field label="Company VAT number" optional>
          <input className={fieldClass} value={form.vatNumber} onChange={update("vatNumber")} placeholder="optional" />
        </Field>
        <Field label="Delivery postcode" optional>
          <input className={fieldClass} value={form.postcode} onChange={update("postcode")} placeholder="optional" autoComplete="postal-code" />
        </Field>
        <Field label="How did you hear about us" optional>
          <input className={fieldClass} value={form.hearAbout} onChange={update("hearAbout")} placeholder="optional" />
        </Field>
      </div>

      {serverError && (
        <p className="brand-mono-sub text-red-600" role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="brand-btn brand-btn-accent w-full min-h-[52px] text-sm uppercase tracking-[0.15em] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting..." : "Get team pricing"}
      </button>

      <p className="brand-mono-sub">
        We&apos;ll email your pricing link instantly. No spam.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Wrapping label implicitly associates the control, so clicking the
          label focuses it and screen readers pair them without explicit ids. */}
      <label className="block">
        <span className={labelClass}>
          {label}
          {optional && <span className="text-black/30"> · optional</span>}
        </span>
        {children}
      </label>
      {error && (
        <p className="brand-mono-sub text-red-600 mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
