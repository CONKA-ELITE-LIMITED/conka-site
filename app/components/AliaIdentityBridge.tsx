"use client";

import { useEffect } from "react";
import { setCapturedIdentity } from "@/app/lib/metaPixel";

/**
 * Bridges the Alia email-capture popup to our Meta CAPI identity.
 *
 * Alia's web SDK fires a document-level `alia:signup` CustomEvent when a visitor
 * submits the popup, with `detail.email` / `detail.phone`. We persist those as
 * first-party match keys (see `setCapturedIdentity`) so every later CAPI event
 * and the Purchase carry them, lifting Event Match Quality on the upper funnel
 * for the subset of cold traffic that signs up. Renders nothing; no-op until a
 * signup fires. See SCRUM-1169.
 */
type AliaSignupDetail = { email?: string; phone?: string };

export default function AliaIdentityBridge() {
  useEffect(() => {
    const onSignup = (event: Event) => {
      const detail = (event as CustomEvent<AliaSignupDetail>).detail;
      if (!detail) return;
      setCapturedIdentity(detail.email, detail.phone);
    };
    document.addEventListener("alia:signup", onSignup);
    return () => document.removeEventListener("alia:signup", onSignup);
  }, []);

  return null;
}
