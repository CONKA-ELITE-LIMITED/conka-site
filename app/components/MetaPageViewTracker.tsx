"use client";

import { useEffect, useRef } from "react";
import { trackMetaPageView, isProductionHost } from "@/app/lib/metaPixel";

/**
 * Fires a single Meta PageView with event_id and sends the same event to CAPI
 * for deduplication. Runs once per mount (SPA navigations may mount again).
 * Non-blocking; does not affect render or performance.
 */
export default function MetaPageViewTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (!process.env.NEXT_PUBLIC_META_PIXEL_ID) return;
    // Production storefront only — never fire on preview deploys or localhost.
    if (!isProductionHost()) return;

    const tryFire = () => {
      if (typeof window === "undefined" || !window.fbq) return false;
      fired.current = true;
      trackMetaPageView();
      return true;
    };

    if (tryFire()) return;

    const t = setInterval(() => {
      if (tryFire()) clearInterval(t);
    }, 100);
    const timeout = setTimeout(() => clearInterval(t), 5000);
    return () => {
      clearInterval(t);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
