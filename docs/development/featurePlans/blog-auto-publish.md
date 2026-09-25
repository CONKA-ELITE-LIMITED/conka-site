# Blog auto-publish + engine contract

Scoped 2026-09-25. Canonical blog reference: `docs/features/BLOG_SYSTEM.md`.

## Problem

1. **Publishing needs a human redeploy.** The blog is static and reads Notion at build only, so flipping `Status` to `Published` does nothing until someone remembers to redeploy.
2. **Humphrey's engine writes posts that render badly.** Checked 2026-09-25 against the 7 engine posts created 15 to 17 Sep (all Published and live):
   - **No hero on any of them.** `Hero image` empty, no page cover. Cards show the placeholder tile, the article has no hero, OG falls back to the sitewide image.
   - **Images are markdown typed as text,** not Notion image blocks: `![Image 1](https://res.cloudinary.com/dly2qvw7o/...)` inside a paragraph (1 post, 2 images). It renders, but hotlinked from Humphrey's Cloudinary (not in our rehost list) with alt text "Image 1".
   - **Every FAQ uses the rejected `- question:` YAML form.** Live: raw YAML visible in the body, no `FAQPage` schema.
   - A leftover "155 chars" note in one meta description (NASA post), "in 2025" in two titles, two near-duplicate posts both live (`every-technological-revolution-cost-us-human-skill` and `every-technological-revolution-made-life-easier-cost-us-human-skill`), all 7 tagged `Productivity`, `Source` blank instead of `engine`.

**Serves:** acquisition via organic search. More posts, live sooner, with heroes, OG images and FAQ rich results.

## Decisions

- **Automate the redeploy, do not move to ISR.** The site stays fully static. ISR would need runtime image hosting (Vercel cannot write `public/` at runtime, so Blob), runtime-safe build guards, a tagged fetch cache (the deploy-keyed header makes every revalidation stale), `notFound` instead of throw for unpublished posts, and sitemap/hub revalidation. That is days of work and new failure modes to save a few minutes. The archived surface plan rejected ISR for the same reasons.
- **Poll, do not push.** A Vercel cron checks Notion hourly from 6am to midnight UK time and redeploys only when the published set changed. Chosen over a Notion "on Published, send webhook" automation because it needs no human management:
  - bulk flips collapse into one build (a webhook fires one build per row),
  - body edits to live posts and unpublishes are caught automatically (no "Push changes" button),
  - draft edits cause no rebuilds,
  - no webhook to miss.
  Cost: up to an hour plus build time from flip to live (overnight flips go live at the 6am run). Each check is one Notion query of about a second; builds only happen when something changed.
- **Safety of repeated builds.** A failed build never replaces the live deployment; the deploy hook builds `main` HEAD, which is already live because every merge auto-deploys (15 production deploys 16 to 22 Sep); builds queue rather than collide.
- **The Status flip stays the only human gate.** With auto-deploy, `Published` means live within minutes, so the engine must never set it.
- **Keep rejecting the YAML FAQ form.** Fixed at the source by the engine, not by widening the parser (`BLOG_SYSTEM.md` policy).

## Phases

| Phase | Description | Ticket |
|-------|-------------|--------|
| 1 | Auto-publish: cron + fingerprint + deploy hook | SCRUM-1460 |
| 2 | Engine contract + image safety nets + live post fixes | SCRUM-1461 |
| 3 | ISR + Blob for seconds-level publishing | Future, only if minutes of latency ever matters |

### Phase 1: Auto-publish (about half a day)

1. **Shared fingerprint function.** `publishedFingerprint(rows)` in `app/lib/blog.ts` (or `blogTransform.ts`): hash of sorted `(slug, last_edited_time)` for rows that pass the **same validation** the renderer uses (Published, has title, slug, meta description). Pure: no image rehosting, no build guards. One function used by both sides is the loop guard.
2. **Build-time fingerprint.** A static route, `app/blog/fingerprint.json/route.ts` (`dynamic = "force-static"`), computes the fingerprint from `queryBlogRows()` at build and serves `{ fingerprint, builtAt }`. The live file therefore describes exactly what the live deploy rendered. Keep it out of the sitemap; `noindex` via `X-Robots-Tag`.
3. **Cron route.** `app/api/cron/blog-publish/route.ts`:
   - Rejects requests without `Authorization: Bearer ${CRON_SECRET}`.
   - Reads Notion rows (the runtime path of `queryBlogRows`, no snapshot/lock), computes the fingerprint, fetches the live `/blog/fingerprint.json`.
   - Equal: return 200, no-op.
   - Different: check the Vercel API for the latest production deployment. Skip if one is `QUEUED`/`BUILDING`. Back off (skip) if the latest production deployment is `ERROR` and under 3 hours old. Otherwise POST the deploy hook.
   - Logs the decision in one line (`blog-publish: no change | triggered | skipped: building | skipped: recent failure`).
4. **Wiring.** `vercel.json` `crons`: `{ "path": "/api/cron/blog-publish", "schedule": "0 5-23 * * *" }` (UTC: 06:00 to 00:00 BST, 05:00 to 23:00 GMT). Hourly needs Vercel Pro; Hobby allows one run a day. Confirm the plan before building. Create the Vercel deploy hook on `main`. Env vars (all secrets, production only): `BLOG_DEPLOY_HOOK_URL`, `CRON_SECRET`, `VERCEL_API_TOKEN` (read deployments only).
5. **Failed-deploy alert.** Vercel notification for failed production deployments to the owner. Nobody watches these builds any more.
6. **Docs.** `BLOG_SYSTEM.md`: publishing is now automatic within the hour (6am to midnight); how to read the cron log; how to force one (trigger the hook). Remove the "then redeploy" instructions there and in `scripts/README.md`.

### Phase 2: Engine contract + safety nets (about half a day, plus engine time)

1. **Rehost Cloudinary.** Add `res.cloudinary.com` to `REHOSTABLE_IMAGE_HOSTS` (`app/lib/blog.ts:128`). We own copies at build.
2. **Hero fallback.** When `Hero image` is empty, the article hero and OG image use the first rehosted body image. Cards stay on the placeholder (a card fallback would need every body fetched per listing render). Files: `app/lib/blog.ts`, `app/blog/[slug]/page.tsx`.
3. **Junk alt text.** `usableAlt` (`MarkdownBody.tsx:45`) also drops `image` and `Image N`.
4. **Rewrite `docs/features/blog-notion-engine-brief.md` as the engine contract:**
   - Required: `Blog name`, unique `Slug`, `Meta description` (under 160 chars, no notes). Missing any = silently never rendered.
   - `Status`: engine writes `Draft` or `Ready for review` only. **Never `Published`**, which now goes live automatically within minutes.
   - `Source = engine`. `Topic` from the full 11-option list, chosen per post. `Related products`.
   - `Hero image` required: file upload (or external URL) 1200x630, plus `Hero image alt`.
   - Body images: native image blocks, caption = descriptive alt. Never markdown image text.
   - Links: native rich-text links with plain `https://` URLs.
   - FAQ: the strict `**Q:** / **A:**` form under `## Frequently Asked Questions`. The `- question:` form is broken (renders raw, no schema).
   - No years in titles, no em dashes, start at H2, check for an existing post on the same angle before writing.
5. **Message to Humphrey** (plain text): link to the contract, the Status rule, and a request that the engine rewrite the 7 live posts to it and archive the older duplicate (`every-technological-revolution-cost-us-human-skill`, keep the newer `...-made-life-easier-...`). Note: archiving a live slug 404s it; add a redirect to the kept slug in `legacyBlogRedirects.ts` if it has picked up traffic.

## Rabbit holes

- **Fingerprint drift = rebuild loop.** If the cron and the build ever disagree about what is live, the site rebuilds every hour. One shared function, and the Vercel-state back-off, are the two defences. Test by running the cron route against a deploy it just produced: it must no-op.
- **Build guards at runtime.** `assertConsistentSlugs` / `assertPostFloor` run whenever `NODE_ENV=production` and hold module state. The cron must not call `getAllPosts`; it uses rows plus the pure fingerprint only.
- **Notion `last_edited_time` is minute-granular.** An edit within the same minute as the build read could be missed until the next edit. Acceptable; note it in the doc.

## No-gos

ISR or runtime rendering from Notion. Notion webhook automations. A publish rate limit for Humphrey (the engine cannot publish at all). Parsing the YAML FAQ form. A second CMS.

## Risks

- A burst of flips during an in-flight build causes at most one follow-up build (the cron skips while building).
- A persistent build failure (e.g. a post-floor breach) retries at most every 3 hours, and the alert fires on the first failure; the live site is unaffected throughout.
- A leaked deploy hook only costs build minutes. Delete and recreate it in Vercel, update the env var.

## Jira tickets

- SCRUM-1460: [Infrastructure & Ops] Blog auto-publish: cron redeploys when the published set changes (Phase 1)
- SCRUM-1461: [Website & CRO] Blog engine contract, image safety nets and fixing the 7 live engine posts (Phase 2)
