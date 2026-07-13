/**
 * POST /api/b2b/apply
 *
 * Receives a B2B teams enquiry, validates it, and hands it to Klaviyo
 * (welcome email + Harry notification + B2B Leads list). No database: the
 * record lives in Klaviyo. See docs/features/b2b/B2B_PORTAL.md
 *
 * Spam defence is the per-IP rate limit alone. There is deliberately NO
 * honeypot: the old one was a hidden field named `company`, which Chrome's
 * autofill mapped to the organisation field and filled on the applicant's
 * behalf. Every autofilled application was then silently discarded. Any field
 * a browser can recognise is a field a browser will fill, so we do not
 * reintroduce one. See SCRUM-1137.
 *
 * The applicant is never blocked on Klaviyo. Once the submission is accepted
 * we return success and the client sends them straight to the order page; the
 * email is a backup copy of that link, not the gate. A Klaviyo outage must not
 * cost a bulk order, so failures are logged loudly rather than surfaced.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitB2BApplication } from "@/app/lib/b2bEmail";
import { B2B_SPORTS, B2B_SQUAD_SIZES } from "@/app/lib/b2bData";
import { createRateLimiter, getClientIp } from "@/app/lib/rateLimit";

export const runtime = "nodejs";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  workEmail: z.string().trim().email("A valid work email is required").max(200),
  phone: z.string().trim().min(5, "Phone is required").max(40),
  organisation: z.string().trim().min(1, "Organisation name is required").max(200),
  sport: z.enum(B2B_SPORTS),
  squadSize: z.enum(B2B_SQUAD_SIZES),
  jobTitle: z.string().trim().min(1, "Job title is required").max(120),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  vatNumber: z.string().trim().max(40).optional().or(z.literal("")),
  postcode: z.string().trim().max(20).optional().or(z.literal("")),
  hearAbout: z.string().trim().max(300).optional().or(z.literal("")),
});

// Light in-memory rate limit. Adequate as a spam speed-bump alongside the
// honeypot; not a hard guarantee across serverless instances.
const isRateLimited = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let parsed: z.infer<typeof applicationSchema>;
  try {
    const body = await request.json();
    const result = applicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }
    parsed = result.data;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const result = await submitB2BApplication({
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    workEmail: parsed.workEmail,
    phone: parsed.phone,
    organisation: parsed.organisation,
    sport: parsed.sport,
    squadSize: parsed.squadSize,
    jobTitle: parsed.jobTitle,
    website: parsed.website || undefined,
    vatNumber: parsed.vatNumber || undefined,
    postcode: parsed.postcode || undefined,
    hearAbout: parsed.hearAbout || undefined,
  });

  // Deliberately not a failure for the applicant. They are about to be sent
  // straight to the order page, so a Klaviyo problem costs us the email and the
  // lead record, not the sale. Blocking here would let a Klaviyo outage turn a
  // bulk order away at the door. Log loudly instead: this is the only signal we
  // get, and its absence for a month is what hid SCRUM-1137.
  if (!result.eventSent || !result.alertSent || !result.listSubscribed) {
    console.error(
      `[B2B] Klaviyo handoff incomplete for ${parsed.workEmail} (${parsed.organisation}): ` +
        `event=${result.eventSent} alert=${result.alertSent} list=${result.listSubscribed}. ` +
        `Applicant was let through to the order page; follow up manually.`,
    );
  }

  return NextResponse.json({ success: true });
}
