"use client";

import { useEffect, useMemo, useState } from "react";
import type { BannerConfig } from "./types";

const FOUNDING_MEMBER_DEADLINE = new Date("2026-03-15T23:59:59");
const SPOTS_FALLBACK = 155;

/**
 * Hook to get active banner configuration.
 *
 * The spots-remaining number is lazy-loaded from a cached server route
 * (`/api/founding-count`) rather than a realtime Convex subscription — the
 * count changes slowly, so there's no need to ship the ConvexReactClient
 * (~80 KB) on every page just to power this banner. Falls back to a constant
 * until the fetch resolves, and only fetches when the banner is actually active.
 */
export function useBannerConfig(bannerId: string): BannerConfig | null {
  const isPastDeadline = useMemo(
    () =>
      bannerId === "founding-member" && new Date() > FOUNDING_MEMBER_DEADLINE,
    [bannerId],
  );
  const isActive = bannerId === "founding-member" && !isPastDeadline;

  const [spotsRemaining, setSpotsRemaining] = useState<number>(SPOTS_FALLBACK);
  useEffect(() => {
    if (!isActive) return;
    let cancelled = false;
    fetch("/api/founding-count")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && typeof d?.spotsRemaining === "number") {
          setSpotsRemaining(d.spotsRemaining);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isActive]);

  const isUrgent = spotsRemaining <= 20; // Urgent when 20 or fewer spots (10% of 200)

  const config = useMemo(() => {
    if (bannerId === "founding-member") {
      return {
        id: "founding-member",
        enabled: true,
        deadline: FOUNDING_MEMBER_DEADLINE,
        dismissible: true,
        variant: "marquee" as const,
        dismissalKey: "foundingMemberBannerDismissed",
        content: {
          text: [
            { text: "Founding Member • Code " },
            { text: "FOUNDING200", bold: true, isCode: true },
            {
              text: " • 20% off subscriptions forever • Deadline: 15th March 2026 • ",
            },
          ],
          secondaryText: [
            { text: `${spotsRemaining} `, bold: true, urgent: isUrgent },
            { text: "spots remaining", bold: true },
          ],
          button: {
            text: "Copy Code",
            copyText: "FOUNDING200",
          },
        },
        styling: {
          bgColor: "bg-black",
          textColor: "text-white",
          borderColor: "border-black",
        },
      } as BannerConfig;
    }
    return null;
  }, [bannerId, spotsRemaining, isUrgent]);

  // Return null if banner should not be shown (disabled or past deadline).
  if (!config || !config.enabled || isPastDeadline) {
    return null;
  }

  return config;
}
