/**
 * Klaviyo Integration Utilities
 *
 * Client-side utility functions for tracking events to Klaviyo.
 */

/**
 * Tracks a cognitive test completion event to Klaviyo.
 * This is a fire-and-forget operation that never throws errors.
 *
 * @param email - User's email address
 * @param score - Overall cognitive score (0-100)
 * @param accuracy - Accuracy percentage (0-100)
 * @param speed - Speed percentage (0-100)
 */
export async function trackCognitiveTest(
  email: string,
  score: number,
  accuracy: number,
  speed: number,
): Promise<void> {
  try {
    const response = await fetch("/api/klaviyo/track-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        score,
        accuracy,
        speed,
      }),
    });

    if (!response.ok) {
      // Log error but don't throw - graceful failure
      console.error(
        `Klaviyo tracking failed: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    // Silently fail - never interrupt user experience
    console.error("Failed to track cognitive test to Klaviyo:", error);
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
