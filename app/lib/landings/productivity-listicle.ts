import type { ListicleConfig } from "./listicle-types";
import { productivityV2Listicle } from "./productivity-v2-listicle";

/**
 * /go/productivity-listicle: the original productivity slug, now serving the
 * v2 page (SCRUM-1470, 28 Sep 2026).
 *
 * A deliberate exception to "a new iteration is a new slug"
 * (GO_LANDING_PAGES.md): the live Meta campaign points here, and repointing
 * its ads would reset their learning. So the slug stays and takes v2's content
 * whole. Edit productivity-v2-listicle.ts, not this file; the v1 copy lives in
 * git history.
 */
export const productivityListicle: ListicleConfig = {
  ...productivityV2Listicle,
  slug: "productivity-listicle",
};
