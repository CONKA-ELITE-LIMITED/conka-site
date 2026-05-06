"use client";

import { useState } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { WinPageDesktop, WinPageMobile } from "@/app/components/win";
import useIsMobile from "@/app/hooks/useIsMobile";

const CONTEST_ID = "win_protocol3_09012026";
const DEADLINE = "2026-01-16T17:00:00Z";

export default function WinPage() {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSuccess = (email: string) => {
    setSubmittedEmail(email);
    setEmailSubmitted(true);
  };

  return (
    <div
      className="min-h-screen theme-conka-flow"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navigation />

      <main className="pb-12">
        {isMobile === undefined ? (
          <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <p className="font-mono text-sm opacity-50">Loading...</p>
            </div>
          </div>
        ) : isMobile ? (
          <WinPageMobile
            contestId={CONTEST_ID}
            deadline={DEADLINE}
            emailSubmitted={emailSubmitted}
            submittedEmail={submittedEmail}
            onSuccess={handleSuccess}
          />
        ) : (
          <WinPageDesktop
            contestId={CONTEST_ID}
            deadline={DEADLINE}
            emailSubmitted={emailSubmitted}
            submittedEmail={submittedEmail}
            onSuccess={handleSuccess}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
