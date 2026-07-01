/**
 * Meta Conversions API (CAPI) – server-side event forwarding
 *
 * Receives events from the client (with event_id and optional fbp) and
 * forwards them to Meta for deduplication with pixel events. If
 * META_CAPI_ACCESS_TOKEN or pixel ID is missing, returns 200 without
 * sending so the client never fails.
 */

import { NextRequest, NextResponse } from "next/server";

const META_GRAPH_VERSION = "v21.0";
const META_GRAPH_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

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
  user_data?: { fbp?: string; fbc?: string };
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
