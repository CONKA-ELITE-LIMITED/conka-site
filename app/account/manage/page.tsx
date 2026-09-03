import type { Metadata } from "next";
import SkioPortalFrame from "./SkioPortalFrame";

export const metadata: Metadata = {
  title: "Manage Subscription | CONKA",
  description: "Manage your CONKA subscription: skip, swap, pause, or update your plan.",
  robots: { index: false, follow: false },
};

/**
 * The account. Skio's hosted portal in an iframe, auto-logged-in via a
 * server-signed magic link (`/api/auth/skio-portal`), covering subscriptions,
 * orders, addresses and payment.
 *
 * This is the canonical account URL: every internal link and the post-login
 * redirect point straight here, and `/account`, `/account/subscriptions/*`,
 * `/account/orders` and `/account/details` all redirect in.
 */
export default function ManageSubscriptionPage() {
  return <SkioPortalFrame />;
}
