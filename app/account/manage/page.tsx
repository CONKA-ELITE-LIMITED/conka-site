import type { Metadata } from "next";
import SkioPortalFrame from "./SkioPortalFrame";

export const metadata: Metadata = {
  title: "Manage Subscription | CONKA",
  description: "Manage your CONKA subscription: skip, swap, pause, or update your plan.",
  robots: { index: false, follow: false },
};

/**
 * Skio customer portal (Phase 3). Renders Skio's hosted portal in an iframe,
 * auto-logged-in via a server-signed magic link (`/api/auth/skio-portal`). Lives
 * at its own URL so the live Loop portal on `/account` stays untouched; the
 * `/account` entry point links here only when NEXT_PUBLIC_SKIO_ENABLED is on.
 */
export default function ManageSubscriptionPage() {
  return <SkioPortalFrame />;
}
