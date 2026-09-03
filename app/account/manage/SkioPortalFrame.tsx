"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import { useAuth } from "@/app/context/AuthContext";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; src: string }
  | { status: "error"; message: string };

/**
 * Full-bleed Skio portal: the site header stays and the Skio iframe IS the
 * account, filling the remaining viewport (it scrolls internally). Handles
 * loading / signed-out / error states.
 *
 * Skio's Customer Portal v3 renders its own Orders / Account / Logout nav inside
 * the iframe, and its Orders view carries full order detail (line items,
 * shipping, summary, reorder). It is not a subscription widget bolted into our
 * account area, it IS the account area. Our own orders and details pages
 * duplicated it and were deleted, so do not add account chrome back on top.
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
      {/* The one control Skio cannot provide. Its portal has its own Logout, but
          that runs on cpv3.skio.com and our session cookies are first-party and
          httpOnly, so it can only end the Skio session: on the next load we mint
          a fresh magic link and sign the customer straight back in. Without this
          link there is no way to sign out of conka.io at all, which on a shared
          device leaves the next visitor inside the previous customer's portal.
          If Skio's own Logout is ever configured to redirect to
          /api/auth/logout, delete this row. */}
      <div className="flex justify-end px-4 pt-2 lg:px-[5vw]">
        <a
          href="/api/auth/logout"
          className="rounded-full px-2 py-1 text-[13px] font-semibold text-black/60 transition-colors hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-navy)]"
        >
          Log out of CONKA
        </a>
      </div>
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
