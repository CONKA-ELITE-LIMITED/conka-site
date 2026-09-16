import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/app/lib/env";
import { createRateLimiter, getClientIp } from "@/app/lib/rateLimit";

/**
 * Request body schema for an /app test signup. `consent` must be literally
 * true: the checkbox is the marketing consent, so a request without it is
 * refused rather than silently subscribed.
 */
const appTestSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  consent: z.literal(true),
});

const MASTER_LIST_ID = "WBbMia";
const SIGNUP_SOURCE = "app_test";
const KLAVIYO_REVISION = "2024-10-15";

// This route records marketing consent, so a script posting other people's
// addresses would put them on the list as subscribed. A per-IP speed-bump
// keeps that from scaling; a real visitor replaying the test stays well under.
const isRateLimited = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });

/**
 * POST /api/klaviyo/app-test-signup
 *
 * Captures an email the moment it passes the /app test gate (SCRUM-1360), so a
 * visitor who drops out mid-test is not lost. Two Klaviyo calls:
 *
 * 1. Profile import: upserts the profile with `source: app_test`.
 * 2. Subscription job: records email marketing consent as SUBSCRIBED and adds
 *    the profile to the master list. `custom_source` labels where the consent
 *    came from in Klaviyo's consent record.
 *
 * The score still arrives separately, at the end, via /api/klaviyo/track-test.
 * Returns 200 on every outcome except rate limiting, and the client never
 * awaits the response, so the test flow is never interrupted.
 */
export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { success: false, reason: "Rate limited" },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const validationResult = appTestSignupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "Invalid request data",
        details: validationResult.error.issues,
      });
    }

    const klaviyoPrivateKey = env.klaviyoPrivateKey;
    if (!klaviyoPrivateKey) {
      console.error("KLAVIYO_PRIVATE_KEY is not configured");
      return NextResponse.json({ success: false, reason: "Not configured" });
    }

    const email = validationResult.data.email.toLowerCase().trim();
    const headers = {
      Authorization: `Klaviyo-API-Key ${klaviyoPrivateKey}`,
      "Content-Type": "application/json",
      revision: KLAVIYO_REVISION,
    };

    const profileResponse = await fetch(
      "https://a.klaviyo.com/api/profile-import/",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: {
            type: "profile",
            attributes: {
              email,
              properties: { source: SIGNUP_SOURCE },
            },
          },
        }),
      },
    );

    if (!profileResponse.ok) {
      // Not fatal: the subscription job below still creates the profile and
      // records consent, it just lands without the source property.
      console.error(
        `Klaviyo profile import error: ${profileResponse.status}`,
        await profileResponse.text(),
      );
    }

    const subscribeResponse = await fetch(
      "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: {
            type: "profile-subscription-bulk-create-job",
            attributes: {
              custom_source: SIGNUP_SOURCE,
              profiles: {
                data: [
                  {
                    type: "profile",
                    attributes: {
                      email,
                      subscriptions: {
                        email: { marketing: { consent: "SUBSCRIBED" } },
                      },
                    },
                  },
                ],
              },
            },
            relationships: {
              list: { data: { type: "list", id: MASTER_LIST_ID } },
            },
          },
        }),
      },
    );

    if (!subscribeResponse.ok) {
      console.error(
        `Klaviyo subscription job error: ${subscribeResponse.status}`,
        await subscribeResponse.text(),
      );
      return NextResponse.json({
        success: false,
        reason: "Klaviyo API error",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error capturing /app test signup:", error);
    return NextResponse.json({ success: false, reason: "Internal error" });
  }
}
