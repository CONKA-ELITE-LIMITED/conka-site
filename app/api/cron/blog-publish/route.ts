import { NextResponse } from "next/server";
import { getPublishedFingerprint } from "@/app/lib/blog";
import { SITE_ORIGIN } from "@/app/lib/site";

/**
 * Blog auto-publish (SCRUM-1460).
 *
 * The blog is static and reads Notion at build only, so a post flipped to
 * Published used to wait for a human redeploy. Vercel Cron calls this hourly
 * from 6am to midnight UK time (`vercel.json`). It compares the fingerprint of
 * the live deploy with a fresh Notion read and triggers a production deploy
 * only when they differ, so a burst of flips becomes one build and an
 * unchanged blog costs one Notion query.
 *
 * Loop and pile-up protection: no trigger while a production build is queued
 * or running, and none within `FAILURE_BACKOFF_MS` of a failed one. A failed
 * build never replaces the live deploy, so backing off is always safe.
 *
 * See docs/features/BLOG_SYSTEM.md.
 */
export const dynamic = "force-dynamic";

/** The website project on Vercel. Not secret, one account: constants, not env. */
const VERCEL_PROJECT_ID = "prj_ngcTTAV2aYQsza3lhOV0TrcMTVzJ";
const VERCEL_TEAM_ID = "team_RYAm8UuAbSGDfZz1cn0M4tgr";

const FAILURE_BACKOFF_MS = 3 * 60 * 60 * 1000;
const IN_FLIGHT_STATES = new Set(["QUEUED", "INITIALIZING", "BUILDING"]);

interface VercelDeployment {
  state?: string;
  readyState?: string;
  created: number;
}

/** One line per run, so the cron's decision is readable in the runtime logs. */
function respond(decision: string, status = 200) {
  console.log(`[blog-publish] ${decision}`);
  return NextResponse.json({ decision }, { status });
}

/** The newest production deployment, or null if Vercel could not be asked. */
async function latestProductionDeployment(
  token: string,
): Promise<VercelDeployment | null | "none"> {
  const url =
    `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}` +
    `&teamId=${VERCEL_TEAM_ID}&target=production&limit=1`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { deployments?: VercelDeployment[] };
    return body.deployments?.[0] ?? "none";
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const hookUrl = process.env.BLOG_DEPLOY_HOOK_URL;
  const vercelToken = process.env.VERCEL_API_TOKEN;
  if (!hookUrl || !vercelToken) {
    return respond(
      "error: BLOG_DEPLOY_HOOK_URL and VERCEL_API_TOKEN must both be set",
      500,
    );
  }

  let liveFingerprint: string;
  try {
    const res = await fetch(`${SITE_ORIGIN}/api/blog/fingerprint`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    liveFingerprint = ((await res.json()) as { fingerprint: string }).fingerprint;
  } catch (err) {
    return respond(
      `error: could not read the live fingerprint: ${
        err instanceof Error ? err.message : String(err)
      }`,
      502,
    );
  }

  let notionFingerprint: string;
  try {
    notionFingerprint = await getPublishedFingerprint();
  } catch (err) {
    return respond(
      `error: Notion read failed: ${err instanceof Error ? err.message : String(err)}`,
      502,
    );
  }

  if (notionFingerprint === liveFingerprint) return respond("no change");

  // Fail closed: without knowing the build state we cannot rule out piling a
  // build onto a running one, or retrying a failing one every hour.
  const latest = await latestProductionDeployment(vercelToken);
  if (latest === null) {
    return respond("skipped: could not read deployment state from Vercel", 502);
  }
  if (latest !== "none") {
    const state = latest.state ?? latest.readyState ?? "";
    if (IN_FLIGHT_STATES.has(state)) {
      return respond(`skipped: production build already ${state.toLowerCase()}`);
    }
    if (state === "ERROR" && Date.now() - latest.created < FAILURE_BACKOFF_MS) {
      return respond("skipped: last production build failed under 3 hours ago");
    }
  }

  try {
    const res = await fetch(hookUrl, { method: "POST", cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    return respond(
      `error: deploy hook failed: ${err instanceof Error ? err.message : String(err)}`,
      502,
    );
  }
  return respond("triggered: blog changed since the live deploy");
}
