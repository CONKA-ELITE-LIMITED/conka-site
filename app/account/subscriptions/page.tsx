import { redirect } from "next/navigation";

/**
 * The standalone subscriptions list duplicated the account overview (which now
 * shows active + inactive subscriptions). Redirect to the overview; the
 * deep-linkable detail route /account/subscriptions/[id] is unaffected.
 */
export default function SubscriptionsIndexRedirect() {
  redirect("/account");
}
