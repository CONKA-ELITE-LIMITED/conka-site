import type { Metadata } from "next";
import { Suspense } from "react";
import DemoClient from "./DemoClient";

export const metadata: Metadata = {
  title: "CONKA app demo | CONKA",
  description: "Internal harness for the CONKA web cognition test.",
  // Internal harness for the native web test engine (SCRUM-1456). Not in the
  // sitemap and not disallowed in robots.ts, so the noindex tag is honoured.
  robots: { index: false, follow: false },
};

export default function ConkaAppDemoPage() {
  return (
    <section className="brand-section brand-bg-white brand-hero-first" aria-label="Cognition test demo">
      <div className="brand-track">
        <Suspense>
          <DemoClient />
        </Suspense>
      </div>
    </section>
  );
}
