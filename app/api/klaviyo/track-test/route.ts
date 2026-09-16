import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/app/lib/env";

/**
 * Request body schema for cognitive test tracking
 */
const trackTestSchema = z.object({
  email: z.string().email("Invalid email address"),
  score: z.number().int().min(0).max(100),
  accuracy: z.number().int().min(0).max(100),
  speed: z.number().int().min(0).max(100),
});

/**
 * POST /api/klaviyo/track-test
 *
 * Tracks a cognitive test completion event to Klaviyo.
 * This endpoint handles errors gracefully and always returns 200 OK
 * to ensure the user experience is never interrupted.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = trackTestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { email, score, accuracy, speed } = validationResult.data;

    // Get Klaviyo public key
    const klaviyoPublicKey = env.klaviyoPublicKey;
    if (!klaviyoPublicKey) {
      console.error("NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY is not configured");
      // Return 200 OK even if key is missing - graceful failure
      return NextResponse.json({ success: false, reason: "Not configured" });
    }

    // Prepare Klaviyo Track API payload
    const klaviyoPayload = {
      token: klaviyoPublicKey,
      event: "Website Short Test Submitted",
      customer_properties: {
        $email: email,
      },
      properties: {
        latest_website_score: score,
        accuracy: accuracy,
        speed: speed,
      },
    };

    // Call Klaviyo Track API
    const klaviyoResponse = await fetch("https://a.klaviyo.com/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(klaviyoPayload),
    });

    if (!klaviyoResponse.ok) {
      const errorText = await klaviyoResponse.text();
      console.error(
        `Klaviyo API error: ${klaviyoResponse.status} ${klaviyoResponse.statusText}`,
        errorText,
      );
      // Return 200 OK even if Klaviyo fails - graceful failure
      return NextResponse.json({
        success: false,
        reason: "Klaviyo API error",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error but return 200 OK - never break user flow
    console.error("Error tracking to Klaviyo:", error);
    return NextResponse.json({
      success: false,
      reason: "Internal error",
    });
  }
}
