"use client";

import { useEffect } from "react";
import { markTrialPackSeen } from "@/app/lib/analytics";

/**
 * Marks this tab as having seen the trial pack page, so the site cart can tag a
 * later PDP order with `_trial_pack_seen` (see CART_ATTRIBUTES.md). Renders
 * nothing.
 */
export default function TrialPackSeen({ slug }: { slug: string }) {
  useEffect(() => {
    markTrialPackSeen(slug);
  }, [slug]);

  return null;
}
