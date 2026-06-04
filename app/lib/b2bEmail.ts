/**
 * B2B application -> Klaviyo (server-side only).
 *
 * On a valid application we do two things in Klaviyo:
 *   1. Fire a "B2B Application Submitted" event. Two flows trigger off it:
 *      the applicant welcome email (with the order-page link) and Harry's
 *      notification. Templates and flows are configured in the Klaviyo dashboard.
 *   2. Add the applicant to the B2B Leads list for follow-up and marketing.
 *
 * Both operations fail gracefully: a Klaviyo outage must never lose the lead
 * silently in a way that breaks the user's submission, but we surface partial
 * failure to the caller for logging.
 *
 * Mirrors the existing Klaviyo patterns in app/api/klaviyo/*.
 */

import { env } from "@/app/lib/env";
import { B2B_KLAVIYO } from "@/app/lib/b2bData";

const KLAVIYO_REVISION = "2024-10-15";

export interface B2BApplication {
  firstName: string;
  lastName: string;
  workEmail: string;
  phone: string;
  organisation: string;
  sport: string;
  squadSize: string;
  jobTitle: string;
  website?: string;
  vatNumber?: string;
  postcode?: string;
  hearAbout?: string;
}

export interface B2BSubmitResult {
  eventSent: boolean;
  listSubscribed: boolean;
}

/** Absolute URL of the gated order page, for the welcome email. */
function orderUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://conka.io";
  return `${base.replace(/\/$/, "")}/professionals/order`;
}

/**
 * Fire the "B2B Application Submitted" event via the Klaviyo Track API.
 * The public key is safe server-side here. Properties carry everything the
 * welcome + notification email templates need.
 */
async function fireApplicationEvent(application: B2BApplication): Promise<boolean> {
  const publicKey = env.klaviyoPublicKey;
  if (!publicKey) {
    console.error("[B2B] NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY is not configured");
    return false;
  }

  const payload = {
    token: publicKey,
    event: B2B_KLAVIYO.eventName,
    customer_properties: {
      $email: application.workEmail,
      $first_name: application.firstName,
      $last_name: application.lastName,
      $phone_number: application.phone,
      $organization: application.organisation,
      $title: application.jobTitle,
    },
    properties: {
      organisation: application.organisation,
      sport: application.sport,
      squad_size: application.squadSize,
      job_title: application.jobTitle,
      phone: application.phone,
      website: application.website ?? "",
      vat_number: application.vatNumber ?? "",
      delivery_postcode: application.postcode ?? "",
      heard_about: application.hearAbout ?? "",
      order_url: orderUrl(),
    },
  };

  try {
    const res = await fetch("https://a.klaviyo.com/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(
        `[B2B] Klaviyo Track error: ${res.status} ${res.statusText}`,
        await res.text(),
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("[B2B] Failed to fire Klaviyo event:", error);
    return false;
  }
}

/** Resolve a Klaviyo profile id for an email, creating the profile if needed. */
async function resolveProfileId(
  application: B2BApplication,
  privateKey: string,
): Promise<string | null> {
  const email = application.workEmail.toLowerCase().trim();
  const headers = {
    Authorization: `Klaviyo-API-Key ${privateKey}`,
    "Content-Type": "application/json",
    revision: KLAVIYO_REVISION,
  };

  const profilePayload = {
    data: {
      type: "profile",
      attributes: {
        email,
        first_name: application.firstName,
        last_name: application.lastName,
        phone_number: application.phone,
        organization: application.organisation,
        title: application.jobTitle,
        properties: {
          source: "b2b_professionals",
          sport: application.sport,
          squad_size: application.squadSize,
        },
      },
    },
  };

  try {
    const res = await fetch("https://a.klaviyo.com/api/profiles/", {
      method: "POST",
      headers,
      body: JSON.stringify(profilePayload),
    });

    if (res.ok) {
      const data = await res.json();
      return data?.data?.id ?? null;
    }

    // 409 Conflict -> profile already exists; pull the id from the error meta.
    if (res.status === 409) {
      const errorData = await res.json();
      const duplicateId = errorData?.errors?.[0]?.meta?.duplicate_profile_id;
      if (duplicateId) return duplicateId;
    } else {
      console.error(
        `[B2B] Klaviyo Profile error: ${res.status} ${res.statusText}`,
        await res.text(),
      );
    }
  } catch (error) {
    console.error("[B2B] Failed to create Klaviyo profile:", error);
  }

  // Fallback: look the profile up by email.
  try {
    const res = await fetch(
      `https://a.klaviyo.com/api/profiles/?filter=equals(email,"${email}")`,
      { method: "GET", headers },
    );
    if (res.ok) {
      const data = await res.json();
      return data?.data?.[0]?.id ?? null;
    }
  } catch (error) {
    console.error("[B2B] Failed to look up Klaviyo profile:", error);
  }

  return null;
}

/** Add the applicant to the B2B Leads list. */
async function subscribeToList(
  application: B2BApplication,
  privateKey: string,
): Promise<boolean> {
  if (!B2B_KLAVIYO.listId) {
    console.error("[B2B] KLAVIYO_B2B_LIST_ID is not configured");
    return false;
  }

  const profileId = await resolveProfileId(application, privateKey);
  if (!profileId) {
    console.error("[B2B] Could not resolve profile id; cannot add to list");
    return false;
  }

  try {
    const res = await fetch(
      `https://a.klaviyo.com/api/lists/${B2B_KLAVIYO.listId}/relationships/profiles/`,
      {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${privateKey}`,
          "Content-Type": "application/json",
          revision: KLAVIYO_REVISION,
        },
        body: JSON.stringify({ data: [{ type: "profile", id: profileId }] }),
      },
    );
    if (!res.ok) {
      console.error(
        `[B2B] Klaviyo List error: ${res.status} ${res.statusText}`,
        await res.text(),
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("[B2B] Failed to add profile to list:", error);
    return false;
  }
}

/**
 * Submit a B2B application to Klaviyo: fire the event (drives the welcome +
 * notification emails) and add the applicant to the B2B Leads list. Runs both
 * concurrently; each fails gracefully and independently.
 */
export async function submitB2BApplication(
  application: B2BApplication,
): Promise<B2BSubmitResult> {
  const privateKey = env.klaviyoPrivateKey;

  const [eventSent, listSubscribed] = await Promise.all([
    fireApplicationEvent(application),
    privateKey
      ? subscribeToList(application, privateKey)
      : Promise.resolve(false),
  ]);

  if (!privateKey) {
    console.error("[B2B] KLAVIYO_PRIVATE_KEY is not configured");
  }

  return { eventSent, listSubscribed };
}
