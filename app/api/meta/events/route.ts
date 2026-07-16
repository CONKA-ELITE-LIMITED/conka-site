/**
 * Meta Conversions API (CAPI) – server-side event forwarding
 *
 * Receives events from the client (with event_id and optional fbp) and
 * forwards them to Meta for deduplication with pixel events. If
 * META_CAPI_ACCESS_TOKEN or pixel ID is missing, returns 200 without
 * sending so the client never fails.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const META_GRAPH_VERSION = "v21.0";
const META_GRAPH_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

/**
 * SHA-256 hex of a normalized value (trim + lowercase). Undefined for empty
 * input. Mirrors `hashNormalized` in app/lib/metaCapi.ts so the client relay and
 * the Purchase webhook hash identically — an `external_id` hashed two different
 * ways would never match across the funnel.
 */
function hashNormalized(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return createHash("sha256").update(normalized).digest("hex");
}

/**
 * Production storefront host. CAPI forwards events only when the request comes
 * from here, so Vercel preview deploys (*.vercel.app) and localhost cannot push
 * events into the production dataset. Mirrors the client gate in metaPixel.ts.
 */
const PRODUCTION_HOST = "www.conka.io";

interface CAPIRequestBody {
  event_name: string;
  event_id: string;
  event_time: number;
  user_data?: {
    fbp?: string;
    fbc?: string;
    email?: string;
    /** Raw first-party visitor id (conka_uid); hashed here before sending. */
    external_id?: string;
  };
  custom_data?: Record<string, unknown>;
}

function isValidEventName(name: string): boolean {
  const allowed = [
    "PageView",
    "ViewContent",
    "AddToCart",
    "Lead",
    "InitiateCheckout",
    "AddPaymentInfo",
    "Purchase",
  ];
  return allowed.includes(name);
}

export async function POST(request: NextRequest) {
  try {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!pixelId || !accessToken) {
      return NextResponse.json({ ok: true, skipped: "no_config" }, { status: 200 });
    }

    // Production host only — never forward events from preview deploys or localhost.
    if (request.headers.get("host") !== PRODUCTION_HOST) {
      return NextResponse.json({ ok: true, skipped: "non_production_host" }, { status: 200 });
    }

    const body = (await request.json()) as CAPIRequestBody;
    const { event_name, event_id, event_time, user_data, custom_data } = body;

    if (
      typeof event_name !== "string" ||
      !event_name ||
      !isValidEventName(event_name)
    ) {
      return NextResponse.json({ ok: false, error: "invalid event_name" }, { status: 400 });
    }
    if (typeof event_id !== "string" || !event_id) {
      return NextResponse.json({ ok: false, error: "invalid event_id" }, { status: 400 });
    }
    if (typeof event_time !== "number" || event_time <= 0) {
      return NextResponse.json({ ok: false, error: "invalid event_time" }, { status: 400 });
    }

    // Hash the logged-in email (when present) for `em`, the strongest Event Match
    // Quality signal. Hashing is server-side so raw email never leaves our origin.
    // Absent for logged-out visitors, which is expected.
    const emHash = hashNormalized(user_data?.email);

    // `external_id` is always the first-party visitor id, never the email hash.
    // Meta only treats external_id as a match key when the SAME value appears
    // across a person's events, and the Purchase webhook sends conka_uid from the
    // order's note attributes. Keying off email here would break that join for
    // logged-in customers, and email already matches on `em` regardless.
    const externalIdHash = hashNormalized(user_data?.external_id);

    const serverEvent: Record<string, unknown> = {
      event_name,
      event_id,
      event_time,
      event_source_url: request.headers.get("referer") ?? undefined,
      action_source: "website",
      user_data: {
        client_user_agent: request.headers.get("user-agent") ?? undefined,
        // First IP in x-forwarded-for is the real client; Meta uses it for matching.
        client_ip_address:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
        ...(user_data?.fbp && { fbp: user_data.fbp }),
        ...(user_data?.fbc && { fbc: user_data.fbc }),
        ...(emHash && { em: emHash }),
        ...(externalIdHash && { external_id: externalIdHash }),
      },
      ...(custom_data && Object.keys(custom_data).length > 0 && { custom_data }),
    };

    const url = `${META_GRAPH_URL}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [serverEvent] }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Meta CAPI]", res.status, data);
      }
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
