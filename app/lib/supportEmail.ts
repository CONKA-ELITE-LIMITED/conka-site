/**
 * Single source of truth for the customer support / contact email.
 *
 * The address itself lives once, in `COMPANY.email` (`app/lib/site.ts`), which
 * is the same value the footer, legal pages and Organization JSON-LD render.
 * Do not hard-code a contact address anywhere else: import SUPPORT_EMAIL for
 * display text and supportMailtoHref() for mailto links.
 *
 * Exception: the B2B / professionals surfaces deliberately route enquiries to a
 * named account owner (`app/lib/b2bData.ts`), not to this shared inbox.
 */
import { COMPANY } from "@/app/lib/site";

export const SUPPORT_EMAIL = COMPANY.email;

export function supportMailtoHref(options?: {
  subject?: string;
  body?: string;
}): string {
  const { subject, body } = options ?? {};
  // Percent-encode by hand rather than via URLSearchParams: that encodes a
  // space as "+", which RFC 6068 does not treat as a space in mailto headers,
  // so clients such as Apple Mail and Outlook show a literal "Trial+enquiry".
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const query = params.length ? `?${params.join("&")}` : "";
  return `mailto:${SUPPORT_EMAIL}${query}`;
}
