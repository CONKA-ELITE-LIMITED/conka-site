"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { B2B_ORDER_PATH, B2B_SPORTS, B2B_SQUAD_SIZES, EMAIL_RE } from "@/app/lib/b2bData";
import { trackB2BApplicationSubmitted } from "@/app/lib/analytics";
import B2BProcessingInterstitial from "./B2BProcessingInterstitial";

/**
 * B2B teams enquiry form. Content-only client component: the page owns the
 * section wrapper and background. Posts to /api/b2b/apply, which routes the
 * lead to Klaviyo (welcome email + Harry notification + B2B Leads list).
 *
 * On success the applicant goes straight to the order page behind a processing
 * interstitial. The welcome email is a backup copy of that link, not the way in,
 * so no delivery problem can cost us a bulk order. See SCRUM-1137.
 *
 * There is deliberately NO honeypot field. The old one was named `company`,
 * which Chrome autofill happily filled on the applicant's behalf, and the route
 * then binned the application. Do not reintroduce one.
 */

/** Give up rather than leave the applicant staring at a finished interstitial. */
const REQUEST_TIMEOUT_MS = 15_000;

const GENERIC_ERROR = "Something went wrong. Please try again.";

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
};

/** Settled outcome of the submit request, awaited by the interstitial. */
type SubmitOutcome = { ok: true } | { ok: false; error: string };

const labelClass = "brand-eyebrow block mb-2";
const fieldClass =
  "w-full min-h-[48px] bg-white border border-black/12 rounded-none px-4 py-3 text-base text-black placeholder-black/30 focus:outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 transition-colors";

export default function ApplicationForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [serverError, setServerError] = useState("");
  /** In-flight submit. The interstitial waits on this before redirecting. */
  const submission = useRef<Promise<SubmitOutcome> | null>(null);

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

  /** Never rejects: the outcome is awaited by the interstitial, not by React. */
  async function submitApplication(): Promise<SubmitOutcome> {
    try {
      const res = await fetch("/api/b2b/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        return { ok: false, error: data?.error ?? GENERIC_ERROR };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    // Kick the request off and show the interstitial over it. The two run
    // together, so the wait is real rather than a staged pause.
    submission.current = submitApplication();
    setStatus("processing");
  }

  /**
   * The interstitial has played out. Redirect only once the request has also
   * settled, so we never send someone to the order page on a failed submit.
   */
  const handleProcessingComplete = useCallback(async () => {
    const outcome = (await submission.current) ?? {
      ok: false as const,
      error: GENERIC_ERROR,
    };

    if (!outcome.ok) {
      setStatus("error");
      setServerError(outcome.error);
      return;
    }

    // Only on a confirmed success, so the event count stays reconcilable against
    // the Klaviyo metric. A failed submit is not an application.
    trackB2BApplicationSubmitted({ sport: form.sport, squadSize: form.squadSize });
    router.push(B2B_ORDER_PATH);
  }, [router, form.sport, form.squadSize]);

  // Mirror of validate()'s required checks, without writing errors. Gates the
  // submit button so it can't be clicked until every required field is valid.
  const requiredComplete =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    EMAIL_RE.test(form.workEmail.trim()) &&
    form.phone.trim() !== "" &&
    form.organisation.trim() !== "" &&
    form.sport !== "" &&
    form.squadSize !== "" &&
    form.jobTitle.trim() !== "";

  if (status === "processing") {
    return <B2BProcessingInterstitial onComplete={handleProcessingComplete} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <p className="brand-mono-sub">
        Fields marked <span className="text-red-600">*</span> are required.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="First name" required error={errors.firstName}>
          <input className={fieldClass} value={form.firstName} onChange={update("firstName")} autoComplete="given-name" />
        </Field>
        <Field label="Last name" required error={errors.lastName}>
          <input className={fieldClass} value={form.lastName} onChange={update("lastName")} autoComplete="family-name" />
        </Field>
        <Field label="Work email" required error={errors.workEmail}>
          <input className={fieldClass} type="email" value={form.workEmail} onChange={update("workEmail")} autoComplete="email" inputMode="email" />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <input className={fieldClass} type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" inputMode="tel" />
        </Field>
        <Field label="Organisation name" required error={errors.organisation}>
          <input className={fieldClass} value={form.organisation} onChange={update("organisation")} autoComplete="organization" />
        </Field>
        <Field label="Job title" required error={errors.jobTitle}>
          <input className={fieldClass} value={form.jobTitle} onChange={update("jobTitle")} autoComplete="organization-title" />
        </Field>
        <Field label="Sport / sector" required error={errors.sport}>
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
        <Field label="Squad / team size" required error={errors.squadSize}>
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
        disabled={!requiredComplete}
        className="brand-btn brand-btn-accent w-full min-h-[52px] text-sm uppercase tracking-[0.15em] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get team pricing
      </button>

      <p className="brand-mono-sub">
        {requiredComplete
          ? "Your pricing opens straight away. We'll email you a copy of the link."
          : "Complete the fields marked * to continue."}
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  optional,
  required,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Wrapping label implicitly associates the control, so clicking the
          label focuses it and screen readers pair them without explicit ids. */}
      <label className="block">
        <span className={labelClass}>
          {label}
          {required && (
            <span className="text-red-600">
              {" "}
              *<span className="sr-only"> required</span>
            </span>
          )}
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
