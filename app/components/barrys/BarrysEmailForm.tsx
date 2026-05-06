"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface BarrysEmailFormProps {
  contestId: string;
  onSuccess: () => void;
}

export default function BarrysEmailForm({
  contestId,
  onSuccess,
}: BarrysEmailFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submitEntry = useMutation(api.winEntries.submitEntry);

  // Check if email exists in Convex (only when email is valid)
  const normalizedEmail = email.toLowerCase().trim();
  const emailExists = useQuery(
    api.winEntries.checkEmailExists,
    email && normalizedEmail.includes("@")
      ? { contestId, email: normalizedEmail }
      : "skip",
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setShowSuccess(false);

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      setIsSubmitting(true);

      try {
        const normalizedEmailValue = email.toLowerCase().trim();

        // Check if email already exists in Convex
        if (emailExists === true) {
          setError("This email has already been submitted");
          setIsSubmitting(false);
          return;
        }

        // Capture userAgent and referrer for analytics
        const userAgent =
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined;
        const referrer =
          typeof window !== "undefined"
            ? document.referrer || undefined
            : undefined;

        // Submit to Convex (new entry)
        const result = await submitEntry({
          contestId,
          email: normalizedEmailValue,
          userAgent,
          referrer,
        });

        if (result.duplicate) {
          setError("This email has already been submitted");
          setIsSubmitting(false);
        } else if (result.success) {
          // Success - show message, clear input, allow another submission
          setShowSuccess(true);
          setEmail(""); // Clear input field
          setIsSubmitting(false);
          onSuccess();
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            setShowSuccess(false);
          }, 5000);
        } else {
          setError("Something went wrong. Please try again.");
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error("Failed to submit entry:", err);
        setError("Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    },
    [email, contestId, submitEntry, onSuccess, emailExists],
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="barrys-email"
            className="block font-mono text-xs uppercase tracking-widest opacity-50 mb-2"
          >
            Email Address
          </label>
          <input
            id="barrys-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
              setShowSuccess(false);
            }}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border-2 border-current rounded-lg bg-transparent font-mono text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            disabled={isSubmitting}
            required
          />
        </div>

        {error && (
          <div className="p-3 border-2 border-current bg-current/5 rounded-lg">
            <p className="font-mono text-sm opacity-90">{error}</p>
          </div>
        )}

        {showSuccess && (
          <div className="p-3 border-2 border-teal-500 bg-teal-500/10 rounded-lg">
            <p className="font-mono text-sm text-[var(--foreground)]">
              Success! Your email has been submitted.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className="neo-button px-8 py-4 font-bold text-lg w-full transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? "Submitting..." : "Get Your Discount"}
        </button>
      </form>
    </div>
  );
}
