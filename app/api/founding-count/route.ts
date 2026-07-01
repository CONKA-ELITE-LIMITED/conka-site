import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

/**
 * Founding-member spots remaining — server-side, cached.
 *
 * Replaces a per-page realtime Convex subscription (the whole ConvexReactClient,
 * ~80 KB, was loading on every page just to feed this one number into the nav
 * banner). The count changes slowly, so a 5-minute cache is plenty and the
 * Convex client stays out of the browser bundle entirely.
 */
const getFoundingCount = unstable_cache(
  async (): Promise<number | null> => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    try {
      const client = new ConvexHttpClient(url);
      const counter = await client.query(api.foundingMemberCounter.getCounter);
      return counter?.spotsRemaining ?? null;
    } catch {
      return null;
    }
  },
  ["founding-count"],
  { revalidate: 300 },
);

export async function GET() {
  const spotsRemaining = await getFoundingCount();
  return NextResponse.json(
    { spotsRemaining },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
  );
}
