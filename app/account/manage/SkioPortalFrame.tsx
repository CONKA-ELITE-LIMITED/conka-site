"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import { AccountSubNav } from "@/app/components/account/AccountSubNav";
import { useAuth } from "@/app/context/AuthContext";

const SKIO_ORIGIN = "https://cpv3.skio.com";
const MIN_FRAME_HEIGHT = 800;
// The frame fills the viewport below the nav; it grows past this if Skio posts a
// taller height. Keeps the portal seamless with no double scrollbars.
const FRAME_MIN_VH = "calc(100dvh - 150px)";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; src: string }
  | { status: "error"; message: string };

/**
 * Fetches the server-signed Skio portal src and renders it in an iframe.
 * Handles loading / signed-out (redirect to login) / error states, and listens
 * for Skio's postMessage height so the frame grows with its content instead of
 * inner-scrolling. Height message shape is undocumented, so we accept a few
 * plausible forms and fall back to a tall min-height.
 */
export default function SkioPortalFrame() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [frameHeight, setFrameHeight] = useState(MIN_FRAME_HEIGHT);

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

  // Grow the frame to fit its content when Skio reports a height.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== SKIO_ORIGIN) return;
      const raw =
        typeof event.data === "number"
          ? event.data
          : typeof event.data?.height === "number"
            ? event.data.height
            : Number(event.data?.height);
      if (Number.isFinite(raw) && raw > 0) {
        setFrameHeight(Math.max(MIN_FRAME_HEIGHT, Math.ceil(raw)));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />
      <AccountSubNav />
      <main className="pb-8">
        {/* Seamless portal frame: minimal chrome, iframe carries its own header. */}
        <div className="mx-auto w-full max-w-[1400px] px-3 pt-3 sm:px-5">
          <h1 className="sr-only">Manage your CONKA subscription</h1>

          {state.status === "loading" && (
            <div
              className="flex items-center justify-center rounded-2xl bg-black/[0.02]"
              style={{ minHeight: FRAME_MIN_VH }}
            >
              <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin" />
            </div>
          )}

          {state.status === "error" && (
            <div
              className="flex items-center justify-center rounded-2xl bg-black/[0.02] p-6 text-center"
              style={{ minHeight: FRAME_MIN_VH }}
            >
              <p className="text-black/70 text-[15px]">{state.message}</p>
            </div>
          )}

          {state.status === "ready" && (
            <iframe
              src={state.src}
              title="Manage your CONKA subscription"
              className="w-full rounded-2xl bg-white"
              style={{ height: frameHeight, minHeight: FRAME_MIN_VH }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
