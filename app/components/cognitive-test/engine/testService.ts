import { REQUEST_TIMEOUT_MS } from "./settings";
import type { Interaction, Side } from "./types";

/**
 * Client for the Flask test flow (/springboot/open, /steps, /complete), ported
 * from the app's services/TestService.js and api/springBoot/test.js. The wire
 * format is the legacy one the server keeps: camelCase except the /steps body,
 * reaction_time in seconds, side_selected as an integer enum.
 */

const SIDE_TO_LEGACY: Record<Side, number> = { left: 0, right: 1, none: 2 };

export interface TestStats {
  score1?: number;
  score2?: number;
  accuracy?: number;
  speed?: number;
  [key: string]: number | undefined;
}

async function post<T>(apiBaseUrl: string, path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/springboot${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    const reason = controller.signal.aborted ? "timed out" : "network error";
    throw new Error(`Test service ${path} ${reason}`, { cause: err });
  } finally {
    clearTimeout(timer);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || data?.error || `HTTP ${response.status}`;
    throw new Error(`Test service ${path} failed: ${message}`);
  }
  return data as T;
}

/** A fresh anonymous id per test. Never an email: this lands in test_instances.user_id. */
export function newWebUserId(): string {
  if (typeof crypto.randomUUID === "function") return `web:${crypto.randomUUID()}`;
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `web:${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function openTest(apiBaseUrl: string, userId: string): Promise<number> {
  const data = await post<{ testInstanceId?: number }>(apiBaseUrl, "/open", {
    userId,
    startRecordedDate: new Date().toISOString(),
  });
  if (typeof data?.testInstanceId !== "number") throw new Error("Test service /open returned no testInstanceId");
  return data.testInstanceId;
}

/** Idempotent server-side, so a retry after a failed response is safe. */
export async function submitSteps(apiBaseUrl: string, testInstanceId: number, steps: Interaction[]): Promise<void> {
  await post(apiBaseUrl, "/steps", {
    test_instance_id: testInstanceId,
    steps: steps.map((step) => ({
      image_id: step.imageId,
      order: step.stepOrder,
      reaction_time: step.reactionTimeMs / 1000,
      side_selected: SIDE_TO_LEGACY[step.sideSelected],
      trial_status: 0,
    })),
  });
}

export async function completeTest(apiBaseUrl: string, testInstanceId: number): Promise<TestStats> {
  const data = await post<{ stats?: TestStats }>(apiBaseUrl, "/complete", { testInstanceId });
  if (!data?.stats) throw new Error("Test service /complete returned no stats");
  return data.stats;
}
