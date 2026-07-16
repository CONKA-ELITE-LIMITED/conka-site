"use client";

import { useEffect, useRef } from "react";
import {
  trackMetaPageView,
  firePixelOnly,
  isProductionHost,
  isPixelAvailable,
  captureFbcFromUrl,
  ensureFbp,
  getOrCreateExternalId,
} from "@/app/lib/metaPixel";

/**
 * Fires a single Meta PageView. The CAPI (server) event fires immediately and
 * independently of the pixel, so PageView is reported even when the pixel is
 * blocked or slow to load (in-app browsers, ad-blockers). The browser pixel
 * twin fires as soon as `fbq` is available, under the SAME event_id, so the two
 * dedup Meta-side rather than double-count. Runs once per mount (SPA navigations
 * may mount again). Non-blocking; does not affect render or performance.
 */
export default function MetaPageViewTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (!process.env.NEXT_PUBLIC_META_PIXEL_ID) return;
    // Production storefront only — never fire on preview deploys or localhost.
    if (!isProductionHost()) return;
    fired.current = true;

    // Establish identity on landing, before the first cart action and independent
    // of pixel load, so every subsequent event and the order itself carry it:
    // the ad-click id (fbclid -> _fbc), Meta's browser id (_fbp, which the async
    // pixel may not have written yet), and our own visitor id (conka_uid).
    captureFbcFromUrl();
    ensureFbp();
    getOrCreateExternalId();

    // Fire CAPI now (always) + the browser pixel if it is already loaded.
    const eventId = trackMetaPageView();
    if (!eventId) return;
    // Browser twin already fired inside trackMetaPageView.
    if (isPixelAvailable()) return;

    // Pixel not ready yet: fire the browser twin with the same event_id once it
    // loads, so it dedups against the CAPI event we just sent.
    const t = setInterval(() => {
      if (isPixelAvailable()) {
        firePixelOnly("PageView", eventId);
        clearInterval(t);
      }
    }, 100);
    const timeout = setTimeout(() => clearInterval(t), 5000);
    return () => {
      clearInterval(t);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
