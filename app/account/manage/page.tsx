import type { Metadata } from "next";
import SkioPortalFrame from "./SkioPortalFrame";

export const metadata: Metadata = {
  title: "Manage Subscription | CONKA",
  description: "Manage your CONKA subscription: skip, swap, pause, or update your plan.",
  robots: { index: false, follow: false },
};

/**
 * Skio customer portal, and the account hub since the Loop decommission:
 * `/account` redirects here and the nav account icons link straight to it.
 * Renders Skio's hosted portal in an iframe, auto-logged-in via a server-signed
 * magic link (`/api/auth/skio-portal`).
 */
export default function ManageSubscriptionPage() {
  return <SkioPortalFrame />;
}
