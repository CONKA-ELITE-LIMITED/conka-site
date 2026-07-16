/**
 * Authored meta descriptions for the legacy import, keyed by Shopify handle.
 *
 * Not optional. `app/lib/blog.ts` skips any row with no `Meta description`
 * (see toSummary), so a post without one never renders at all: this gates
 * rendering, not just publishing. The importer refuses to write a row whose
 * handle is missing here rather than creating an invisible post.
 *
 * Rules (docs/development/featurePlans/blog-notion-engine-brief.md):
 * 150 to 160 characters, no em dashes, answers the query the post targets.
 * Drafted here and reviewed by the owner at the `Status` gate.
 *
 * Phase 1 (SCRUM-1155) authors the pilot only. The remaining 52 land with
 * the bulk import in SCRUM-1156.
 */
export const META_DESCRIPTIONS: Record<string, string> = {
  "visualisation-mental-imagery-and-rehearsal":
    "Visualisation and mental rehearsal change the brain through neuroplasticity and mirror neurons. Here is the science, and how to practise it in sport and work.",
};
