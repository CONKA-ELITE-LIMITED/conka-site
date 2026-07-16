/**
 * Meta Pixel & Conversions API (CAPI) – client helpers
 *
 * Fires standard events with event_id for deduplication. All tracking is
 * non-blocking (fire-and-forget). Fails silently if pixel ID is missing or in SSR.
 */

declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
  }
}

const META_EVENTS_API = "/api/meta/events";

/**
 * Scope for every identity cookie we write. The registrable domain, not the
 * `www` host, so the Shopify-hosted checkout on shop.conka.io reads the same
 * ids — that is how identity reaches the order and the Purchase webhook.
 */
const COOKIE_DOMAIN = ".conka.io";

/** 90 days, matching Meta's own `_fbp` / `_fbc` cookie lifetime. */
const FB_COOKIE_MAX_AGE = 90 * 24 * 60 * 60;

/** Our first-party visitor id. Sent to Meta as `external_id` on every event. */
const EXTERNAL_ID_COOKIE = "conka_uid";

/** 400 days — the longest a browser will honour (Chrome caps `max-age` here). */
const EXTERNAL_ID_MAX_AGE = 400 * 24 * 60 * 60;

/** Random UUID where available, with a unique-enough fallback. */
function generateUuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/** Generate a unique event ID for pixel/CAPI deduplication */
function generateEventId(): string {
  return generateUuid();
}

/** Read a cookie by name. Null in SSR or when absent. */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1].trim() : null;
}

/** Write a first-party identity cookie scoped to the registrable domain. */
function writeCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; domain=${COOKIE_DOMAIN}; SameSite=Lax; Secure`;
}

/** Read _fbp cookie for CAPI user_data (improves matching) */
export function getFbp(): string | null {
  return readCookie("_fbp");
}

/** Read _fbc cookie (the ad-click identifier) for CAPI user_data */
export function getFbc(): string | null {
  return readCookie("_fbc");
}

/**
 * Meta's `_fbp` browser id, writing one ourselves when the pixel has not (yet).
 * `fbevents.js` loads async, so our CAPI events routinely fired before the
 * cookie existed and shipped with no `fbp` — a match key we could always have
 * had. Written in Meta's own format so the pixel adopts it rather than issuing a
 * competing id, exactly as `captureFbcFromUrl` does for `_fbc`. Never overwrites
 * an existing value: the pixel's own `_fbp` always wins.
 */
export function ensureFbp(): string | null {
  if (typeof document === "undefined") return null;
  const existing = getFbp();
  if (existing) return existing;
  // Meta's format: fb.<subdomainIndex>.<creationTime>.<random>. Index 1 == the
  // registrable domain we scope to. A malformed value is silently ignored by Meta.
  const random = Math.floor(Math.random() * 1e10);
  const fbp = `fb.1.${Date.now()}.${random}`;
  writeCookie("_fbp", fbp, FB_COOKIE_MAX_AGE);
  return fbp;
}

/** Read the first-party visitor id without minting one. */
function getExternalId(): string | null {
  return readCookie(EXTERNAL_ID_COOKIE);
}

/**
 * The first-party visitor id, minted on first sight and persisted. Sent as
 * `external_id` on every event, so even a logged-out visitor carries one stable
 * match key. On its own an id we invented matches nobody in Meta's graph; it
 * earns its keep because `buildMetaCartAttributes` carries the same id to the
 * order, letting Meta join an anonymous AddToCart to the identified buyer.
 */
export function getOrCreateExternalId(): string | null {
  if (typeof document === "undefined") return null;
  const existing = getExternalId();
  if (existing) return existing;
  const id = generateUuid();
  writeCookie(EXTERNAL_ID_COOKIE, id, EXTERNAL_ID_MAX_AGE);
  return id;
}

/**
 * Capture the ad-click id from the landing URL (`?fbclid=`) into the `_fbc`
 * cookie in Meta's format (`fb.1.<timestamp>.<fbclid>`). Mirrors what the pixel
 * does, but runs immediately on landing and independently of pixel load, so the
 * id is available before the first cart action and even if the pixel is blocked.
 * Newest click wins. Cookie is scoped to `.conka.io` so checkout (shop.conka.io)
 * shares it. No-op when no `fbclid` is present.
 */
export function captureFbcFromUrl(): void {
  if (typeof window === "undefined") return;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return;
  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  writeCookie("_fbc", fbc, FB_COOKIE_MAX_AGE);
}

/**
 * Build cart-level Meta attributes (_fbp / _fbc / conka_uid) to attach to a
 * Shopify cart so they flow to the order's note attributes, where the
 * server-side Purchase webhook reads them for attribution. Shared by every
 * checkout path (the global CartContext AND the funnel's isolated checkout) so
 * they cannot drift apart. `conka_uid` is what lets Meta join this buyer's
 * Purchase back to the anonymous events they fired before checking out.
 *
 * Reads only, never mints: by the time a cart exists the tracker has already
 * minted the ids on landing, and a pure builder keeps the cart path free of
 * side effects. Returns [] when no cookie is present — safe to spread.
 */
export function buildMetaCartAttributes(): Array<{ key: string; value: string }> {
  const attrs: Array<{ key: string; value: string }> = [];
  const fbp = getFbp();
  const fbc = getFbc();
  const externalId = getExternalId();
  if (fbp) attrs.push({ key: "_fbp", value: fbp });
  if (fbc) attrs.push({ key: "_fbc", value: fbc });
  if (externalId) attrs.push({ key: EXTERNAL_ID_COOKIE, value: externalId });
  return attrs;
}

/** Send event to Conversions API (fire-and-forget, no await). Does not throw. */
function sendToCAPI(payload: {
  event_name: string;
  event_id: string;
  event_time: number;
  user_data?: {
    fbp?: string;
    fbc?: string;
    email?: string;
    external_id?: string;
  };
  custom_data?: Record<string, unknown>;
}): void {
  if (typeof fetch === "undefined") return;
  try {
    fetch(META_EVENTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // no-op
  }
}

export function isPixelAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

/**
 * The logged-in customer's email, mirrored out of React (AuthContext) into this
 * module so the non-React tracking layer can attach it to CAPI events. Email is
 * the single strongest Event Match Quality signal. Null when logged out. It is
 * hashed server-side in the CAPI route and never handed to the browser pixel.
 */
let userEmail: string | null = null;
export function setMetaUserData(email: string | null): void {
  userEmail = email;
}

function hasPixelId(): boolean {
  return Boolean(
    typeof process !== "undefined" &&
      process.env &&
      process.env.NEXT_PUBLIC_META_PIXEL_ID
  );
}

/**
 * Production storefront host. The pixel and CAPI fire only here — never on
 * Vercel preview deploys (*.vercel.app) or localhost — so dev/preview traffic
 * does not pollute the production dataset that ads optimise on.
 */
export const PRODUCTION_HOST = "www.conka.io";

/** True only on the production storefront. Strict host match (no apex, no preview). */
export function isProductionHost(): boolean {
  return (
    typeof window !== "undefined" &&
    window.location.hostname === PRODUCTION_HOST
  );
}

/**
 * Fire an event to Meta with pixel/CAPI deduplication.
 *
 * The browser pixel (`fbq`) fires only when it is loaded, but the CAPI relay
 * fires whenever we are on the production host with a pixel id configured — even
 * when the pixel is blocked or has not yet loaded. When both fire they share one
 * `event_id`, so Meta merges them; when only the server fires there is nothing to
 * merge, so no double-count. This is what keeps the upper funnel reported for
 * ad-blocked / in-app-browser traffic. Returns the shared `event_id` (or null
 * when CAPI is not eligible) so a caller can fire a late browser twin with it.
 */
function trackWithDedup(
  eventName: string,
  customData?: Record<string, unknown>
): string | null {
  if (!isProductionHost() || !hasPixelId()) return null;
  const eventId = generateEventId();
  const eventTime = Math.floor(Date.now() / 1000);
  firePixelOnly(eventName, eventId, customData);
  sendToCAPI({
    event_name: eventName,
    event_id: eventId,
    event_time: eventTime,
    // Send browser id (_fbp), ad-click id (_fbc), our first-party visitor id, and
    // the logged-in email so the server event matches on the strongest available
    // signal — raises Event Match Quality and reduces Meta's reliance on modelled
    // conversions. A logged-out ad visitor has no email, so `_fbc` and these two
    // ids are the only identity they can carry.
    user_data: {
      fbp: ensureFbp() ?? undefined,
      fbc: getFbc() ?? undefined,
      email: userEmail ?? undefined,
      external_id: getOrCreateExternalId() ?? undefined,
    },
    custom_data: customData,
  });
  return eventId;
}

/**
 * Fire ONLY the browser pixel for an event, under a caller-supplied `event_id`.
 * No-op when the pixel is unavailable. Used to fire a late browser twin (e.g. a
 * deferred PageView once `fbq` loads) that dedups against a CAPI event already
 * sent under the same id.
 */
export function firePixelOnly(
  eventName: string,
  eventId: string,
  customData?: Record<string, unknown>
): void {
  if (!isProductionHost() || !isPixelAvailable()) return;
  try {
    window.fbq!("track", eventName, customData ?? {}, { eventID: eventId });
  } catch {
    // no-op
  }
}

/**
 * Track PageView with deduplication. Call once per full page load (e.g. from a
 * layout client component). Returns the shared `event_id` so the caller can fire
 * a late browser twin if the pixel was not yet loaded when CAPI fired.
 */
export function trackMetaPageView(): string | null {
  return trackWithDedup("PageView");
}

/**
 * Track ViewContent for a product/protocol page. Call on mount of product or protocol pages.
 */
export function trackMetaViewContent(params: {
  content_ids: string[];
  content_type?: "product";
  content_name?: string;
  value?: number;
  currency?: string;
}): void {
  const customData: Record<string, unknown> = {
    content_ids: params.content_ids,
    content_type: params.content_type ?? "product",
  };
  if (params.content_name != null) customData.content_name = params.content_name;
  if (params.value != null) customData.value = params.value;
  if (params.currency != null) customData.currency = params.currency;
  trackWithDedup("ViewContent", customData);
}

/**
 * Extract numeric ID from Shopify GID for Meta content_ids
 */
function toContentId(gid: string): string {
  if (gid.includes("gid://shopify/")) {
    return gid.split("/").pop() ?? gid;
  }
  return gid;
}

/**
 * Track AddToCart with deduplication. Call after a successful add to cart.
 */
export function trackMetaAddToCart(params: {
  content_ids: string[];
  content_type?: "product";
  value: number;
  currency: string;
  num_items?: number;
}): void {
  const customData: Record<string, unknown> = {
    content_ids: params.content_ids,
    content_type: params.content_type ?? "product",
    value: params.value,
    currency: params.currency,
  };
  if (params.num_items != null) customData.num_items = params.num_items;
  trackWithDedup("AddToCart", customData);
}

/**
 * Track InitiateCheckout with deduplication. Call at the checkout-click moment,
 * right before redirecting to the Shopify-hosted checkout.
 *
 * Headless note: the checkout page lives on a different domain, so the pixel
 * cannot fire IC there — we must fire it on our own domain before the redirect.
 * `trackWithDedup` sends via fbq (which uses `sendBeacon`) AND the CAPI relay
 * (`fetch` with `keepalive: true`), so both survive the navigation that follows.
 */
export function trackMetaInitiateCheckout(params: {
  content_ids: string[];
  content_type?: "product";
  value: number;
  currency: string;
  num_items?: number;
}): void {
  const customData: Record<string, unknown> = {
    content_ids: params.content_ids,
    content_type: params.content_type ?? "product",
    value: params.value,
    currency: params.currency,
  };
  if (params.num_items != null) customData.num_items = params.num_items;
  trackWithDedup("InitiateCheckout", customData);
}

/**
 * Track Lead with deduplication. Fired when a /go landing quiz reaches
 * its results screen — the ad-side completion signal for quiz funnels.
 */
export function trackMetaLead(params: {
  content_name?: string;
  content_category?: string;
}): void {
  const customData: Record<string, unknown> = {};
  if (params.content_name != null) customData.content_name = params.content_name;
  if (params.content_category != null)
    customData.content_category = params.content_category;
  trackWithDedup("Lead", customData);
}

export { toContentId };
