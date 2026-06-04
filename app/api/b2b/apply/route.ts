/**
 * POST /api/b2b/apply
 *
 * Receives a B2B teams enquiry, validates it, and hands it to Klaviyo
 * (welcome email + Harry notification + B2B Leads list). No database: the
 * record lives in Klaviyo. See docs/development/featurePlans/b2b-professionals-portal.md
 *
 * Spam defence: a honeypot field (silently accepted, never processed) plus a
 * light per-IP rate limit, since this endpoint sends email.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitB2BApplication } from "@/app/lib/b2bEmail";
import { B2B_SPORTS, B2B_SQUAD_SIZES } from "@/app/lib/b2bData";

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
  // Honeypot: real users never see or fill it. Validated permissively so a
  // tripped honeypot is handled below (silent success) rather than leaking a
  // validation error that reveals the trap.
  company: z.string().max(200).optional(),
});

// Light in-memory rate limit. Adequate as a spam speed-bump alongside the
// honeypot; not a hard guarantee across serverless instances.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map cannot grow unbounded across many IPs.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

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

  // Honeypot tripped: pretend success so bots move on, but do nothing.
  if (parsed.company) {
    return NextResponse.json({ success: true });
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

  // The applicant succeeded from their side as long as we received and accepted
  // the application. Partial Klaviyo failures are logged server-side for follow-up.
  if (!result.eventSent && !result.listSubscribed) {
    return NextResponse.json(
      { success: false, error: "We could not submit your enquiry. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
