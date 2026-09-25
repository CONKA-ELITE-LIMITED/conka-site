/**
 * Klaviyo Integration Utilities
 *
 * Client-side utility functions for tracking events to Klaviyo.
 */

import { CONKA_APP_API_ORIGIN } from "./conkaAppApi";

/**
 * Sends a finished website test to Klaviyo through the CONKA app server, which
 * reads the scores from its own test_stats rather than trusting the browser,
 * and fires "Website Short Test Submitted" (SCRUM-1455). Idempotent per email
 * and test, so a repeat call never double-sends. Fire-and-forget: never throws.
 *
 * @param email - User's email address
 * @param testInstanceId - The completed test, from the engine's onComplete
 * @param sourcePage - Page path the test ran on, e.g. "/app"
 */
export async function submitWebTestResult(
  email: string,
  testInstanceId: number,
  sourcePage: string,
): Promise<void> {
  try {
    const response = await fetch(
      `${CONKA_APP_API_ORIGIN}/api/klaviyo/web-test-complete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, testInstanceId, sourcePage }),
      },
    );

    if (!response.ok) {
      console.error(
        `Klaviyo web test submit failed: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Failed to send web test result to Klaviyo:", error);
  }
}

/**
 * Captures an /app test signup the moment the email gate is passed: subscribes
 * the email to the master list with marketing consent, tagged `source: app_test`
 * (SCRUM-1360). Runs before the test so a visitor who drops out is still
 * captured. Fire-and-forget: never throws.
 *
 * @param email - User's email address
 */
export async function subscribeAppTestSignup(email: string): Promise<void> {
  try {
    const response = await fetch("/api/klaviyo/app-test-signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, consent: true }),
    });

    if (!response.ok) {
      console.error(
        `Klaviyo app test signup failed: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Failed to capture app test signup:", error);
  }
}

/**
 * Subscribes an email to the Klaviyo master list (WBbMia) for the Win page.
 * This is a fire-and-forget operation that never throws errors.
 *
 * @param email - User's email address
 */
export async function subscribeToWinList(email: string): Promise<void> {
  try {
    const response = await fetch("/api/klaviyo/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!response.ok) {
      // Log error but don't throw - graceful failure
      console.error(
        `Klaviyo subscription failed: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    // Silently fail - never interrupt user experience
    console.error("Failed to subscribe to Klaviyo list:", error);
  }
}
