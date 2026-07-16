/**
 * Meta Conversions API — server-side helpers.
 *
 * Hashing + Purchase event send for first-party server events (the Shopify
 * order webhook). Mirrors the send shape in app/api/meta/events/route.ts but
 * adds SHA-256 hashed identity for high Event Match Quality. Never throws;
 * returns false (no-op) if the pixel id or access token is missing.
 */
import { createHash } from "crypto";

const META_GRAPH_VERSION = "v21.0";

/** SHA-256 hex of a normalized string (trim + lowercase). Undefined for empty input. */
function hashNormalized(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

/** Hash a phone number: strip everything except digits before hashing. */
function hashPhone(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  return createHash("sha256").update(digits).digest("hex");
}

/** Raw (already lowercased) value with whitespace removed, then hashed — for city/zip. */
function hashCollapsed(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return hashNormalized(value.replace(/\s+/g, ""));
}

export interface PurchaseUserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null; // 2-letter ISO
  /**
   * One or more stable ids for this person, hashed and sent as `external_id`.
   * Meta accepts several and matches on any. Pass the first-party visitor id
   * (conka_uid) first: it is the one that also appears on the buyer's earlier
   * anonymous events, so it is what joins the Purchase back to the upper funnel.
   */
  externalId?: string | string[] | null;
  fbp?: string | null; // sent raw, not hashed
  fbc?: string | null; // sent raw, not hashed
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
}

export interface PurchaseEvent {
  eventId: string; // shared with the Shopify FB channel Purchase for dedup
  eventTime: number; // unix seconds
  value: number;
  currency: string;
  contentIds?: string[];
  numItems?: number;
  user: PurchaseUserData;
  eventSourceUrl?: string;
}

/** Build Meta user_data: hashed PII (arrays) + raw fbp/fbc/ip/ua. */
function buildUserData(u: PurchaseUserData): Record<string, unknown> {
  const ud: Record<string, unknown> = {};
  const em = hashNormalized(u.email);
  const ph = hashPhone(u.phone);
  const fn = hashNormalized(u.firstName);
  const ln = hashNormalized(u.lastName);
  const ct = hashCollapsed(u.city);
  const st = hashNormalized(u.state);
  const zp = hashCollapsed(u.zip);
  const country = hashNormalized(u.country);
  const externalIds = (Array.isArray(u.externalId) ? u.externalId : [u.externalId])
    .map((id) => hashNormalized(id))
    .filter((v): v is string => Boolean(v));

  if (em) ud.em = [em];
  if (ph) ud.ph = [ph];
  if (fn) ud.fn = [fn];
  if (ln) ud.ln = [ln];
  if (ct) ud.ct = [ct];
  if (st) ud.st = [st];
  if (zp) ud.zp = [zp];
  if (country) ud.country = [country];
  if (externalIds.length > 0) ud.external_id = externalIds;
  if (u.fbp) ud.fbp = u.fbp;
  if (u.fbc) ud.fbc = u.fbc;
  if (u.clientIpAddress) ud.client_ip_address = u.clientIpAddress;
  if (u.clientUserAgent) ud.client_user_agent = u.clientUserAgent;
  return ud;
}

/**
 * Send a Purchase event to Meta CAPI for the configured pixel. Fire-and-forget
 * style: returns false (no-op) if config is missing, never throws.
 */
export async function sendPurchaseToCapi(event: PurchaseEvent): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return false;

  const custom_data: Record<string, unknown> = {
    value: event.value,
    currency: event.currency,
  };
  if (event.contentIds && event.contentIds.length > 0) {
    custom_data.content_ids = event.contentIds;
    custom_data.content_type = "product";
  }
  if (event.numItems != null) custom_data.num_items = event.numItems;

  const serverEvent: Record<string, unknown> = {
    event_name: "Purchase",
    event_id: event.eventId,
    event_time: event.eventTime,
    action_source: "website",
    ...(event.eventSourceUrl && { event_source_url: event.eventSourceUrl }),
    user_data: buildUserData(event.user),
    custom_data,
  };

  const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(
    accessToken
  )}`;

  // When set, route events to the Events Manager "Test Events" tab for
  // verification. Set META_TEST_EVENT_CODE while testing, then unset it.
  const testEventCode = process.env.META_TEST_EVENT_CODE;
  const payload: Record<string, unknown> = { data: [serverEvent] };
  if (testEventCode) payload.test_event_code = testEventCode;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok && process.env.NODE_ENV === "development") {
      const data = await res.json().catch(() => ({}));
      console.warn("[Meta CAPI Purchase]", res.status, data);
    }
    return res.ok;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Meta CAPI Purchase] send failed", err);
    }
    return false;
  }
}
