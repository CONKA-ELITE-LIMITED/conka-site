import { redirect } from "next/navigation";

/**
 * Account entry point. Skio owns every subscription contract since the Loop
 * migration completed (2026-09-02), and its embedded portal at /account/manage
 * is the whole subscription experience, so this route is now a redirect.
 *
 * The self-built Loop list that used to live here is deleted along with the
 * rest of the Loop integration. Signed-out visitors are sent to /account/login
 * by the portal page itself, so there is no auth check to do here.
 *
 * See docs/development/featurePlans/loop-decommission.md.
 */
export default function AccountPage() {
  redirect("/account/manage");
}
