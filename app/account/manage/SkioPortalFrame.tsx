"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import { AccountSubNav } from "@/app/components/account/AccountSubNav";
import { useAuth } from "@/app/context/AuthContext";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; src: string }
  | { status: "error"; message: string };

/**
 * Full-bleed Skio portal: the site header and account sub-nav stay, and the Skio
 * iframe IS the main content, filling the remaining viewport (it scrolls
 * internally). Handles loading / signed-out / error states.
 *
 * The sub-nav is not decoration. Since the Loop decommission this page is the
 * account hub (/account redirects here), and it carries the only links to order
 * history and profile editing. Those are Shopify surfaces covering one-time
 * purchases and the customer record, which the Skio iframe's own controls do not
 * reach. Removing it strands both pages.
 */
export default function SkioPortalFrame() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  // Redirect signed-out visitors to login (mirrors /account).
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch the signed iframe src once authenticated.
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/skio-portal");
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.src) {
          setState({ status: "ready", src: data.src });
        } else if (res.status === 401) {
          router.replace("/account/login");
        } else {
          setState({
            status: "error",
            message: data.error || "We could not open the subscription portal.",
          });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "We could not open the subscription portal." });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, router]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white text-black">
      <Navigation />
      <AccountSubNav />
      {/* Full-bleed: the iframe fills the area under the header edge-to-edge
          (absolute inset-0 removes any sizing gaps) and scrolls internally. */}
      <main className="relative min-h-0 flex-1">
        <h1 className="sr-only">Manage your CONKA subscription</h1>

        {state.status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin" />
          </div>
        )}

        {state.status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-black/70 text-[15px]">{state.message}</p>
          </div>
        )}

        {state.status === "ready" && (
          <iframe
            src={state.src}
            title="Manage your CONKA subscription"
            className="absolute inset-0 block h-full w-full border-0 bg-white"
          />
        )}
      </main>
    </div>
  );
}
