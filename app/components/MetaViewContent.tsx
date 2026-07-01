"use client";

import { useEffect, useRef } from "react";
import { trackMetaViewContent, toContentId } from "@/app/lib/metaPixel";

/**
 * Fires a single Meta `ViewContent` on mount. Drop this into ad-landing pages
 * (funnels, landers) so paid traffic produces a real mid-funnel signal — those
 * pages previously fired only PageView, leaving Meta blind between landing and
 * the late AddToCart. Fires pixel + CAPI (shared event_id) via trackMetaViewContent.
 *
 * Pass Shopify variant GIDs in `variantIds`; they're normalised to numeric
 * content_ids here so call sites stay clean.
 */
export default function MetaViewContent({
  variantIds,
  value,
  currency = "GBP",
  contentName,
}: {
  variantIds: string[];
  value?: number;
  currency?: string;
  contentName?: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackMetaViewContent({
      content_ids: variantIds.filter(Boolean).map(toContentId),
      content_type: "product",
      ...(value != null && { value }),
      currency,
      ...(contentName && { content_name: contentName }),
    });
  }, [variantIds, value, currency, contentName]);
  return null;
}
