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
 * Full-bleed Skio portal: the site header stays, and the Skio iframe IS the main
 * content, filling the viewport beneath the header (it scrolls internally). The
 * portal's own header/account controls live inside the iframe, so we strip all
 * of our own account chrome here. Handles loading / signed-out / error states.
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
    <div className="flex min-h-[100dvh] flex-col bg-white text-black">
      <Navigation />
      <main className="flex flex-1 flex-col">
        <h1 className="sr-only">Manage your CONKA subscription</h1>

        {state.status === "loading" && (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin" />
          </div>
        )}

        {state.status === "error" && (
          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <p className="text-black/70 text-[15px]">{state.message}</p>
          </div>
        )}

        {state.status === "ready" && (
          <iframe
            src={state.src}
            title="Manage your CONKA subscription"
            className="w-full flex-1 border-0 bg-white"
          />
        )}
      </main>
    </div>
  );
}
