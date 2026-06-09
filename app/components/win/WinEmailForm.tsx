"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { subscribeToWinList } from "@/app/lib/klaviyo";

interface WinEmailFormProps {
  contestId: string;
  onSuccess: (email: string) => void;
}

export default function WinEmailForm({
  contestId,
  onSuccess,
}: WinEmailFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // If it exists, skip Klaviyo (assume profile already created) and show error
        if (emailExists === true) {
          // Already in Convex - show error message
          setError("Already submitted, nice try though!");
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
          // Handle duplicate case - show error
          setError("Already submitted, nice try though!");
          setIsSubmitting(false);
        } else if (result.success) {
          // New entry - call Klaviyo API (fire-and-forget, doesn't block UX)
          subscribeToWinList(normalizedEmailValue).catch((err) => {
            // Log but don't block UX - Klaviyo failures are handled gracefully
            console.error("Klaviyo subscription failed (non-blocking):", err);
          });
          onSuccess(email);
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
    <div className="px-4 md:px-16 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-500 flex-shrink-0"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <p className="font-bold text-xl md:text-3xl">
              Enter Your Email to Enter the Draw
            </p>
          </div>
          <p className="font-mono text-xs opacity-70 mb-4">
            winner notified by email when entries close
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="neo-box p-6 md:p-8 border-l-4 border-amber-500"
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-xs uppercase tracking-widest opacity-50 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
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

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="neo-button px-8 py-4 font-bold text-lg w-full transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Submitting..." : "Enter the draw"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
