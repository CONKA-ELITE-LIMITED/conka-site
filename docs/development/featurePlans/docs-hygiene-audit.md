# Docs Hygiene Audit and Cleanup

**Status:** DONE (2026-08-27). All five phases complete.
**Execution log:** `docs/development/featurePlans/docs-hygiene-progress.md`
**Tracking:** [SCRUM-1268](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1268)
**Type:** Internal tooling / documentation. Not a website feature.

---

## Problem

The `docs/` tree has 130 markdown files: 41 feature plans and 89 canonical docs. Feature plans accumulate because scoping creates one per feature and nothing deletes it after the work ships.

The obvious symptom is clutter. The audit found the real problem is the opposite direction:

**22 canonical docs contain references to code that no longer exists**, and several sit in CLAUDE.md's docs index, which means they are the first thing read at the start of any task. A stale plan doc in `featurePlans/` costs nothing until someone opens it. A wrong `PERFORMANCE_OPTIMISATION.md` costs something every time an agent follows its checklist and reaches for a deleted component.

Secondary findings:

- **8 feature plans declare a status their own code contradicts.** Reading the header gives you the wrong answer about whether work shipped.
- **18 canonical docs are orphaned** from `docs/README.md`, including all of `docs/ops/`, the active commercial layer.
- **12 cross-doc references point at files that do not exist.**

## Why this is worth doing

This serves neither acquisition nor retention. Its justification is agent and developer correctness: CLAUDE.md points at roughly 30 docs, and a meaningful fraction describe a codebase that no longer exists. Wrong canon produces wrong code. That is worth half a day and not much more, which is why Phase 3 is metered rather than pushed through in one sitting.

---

## Audit results

### Canonical docs with stale references (Phase 1 targets)

| Doc | What it claims | Reality |
|---|---|---|
| `development/PERFORMANCE_OPTIMISATION.md` | mandatory checklist: wrap in `VisibilityGate.tsx`; `/start` uses `app/start/CROBelowFold.tsx` | both files deleted. In CLAUDE.md index, so actively misleading |
| `features/PROJECT_OVERVIEW.md` | routes include `/protocol/[id]`, `/quiz`, `/quiz/results`, `/shop`; quiz analytics live; links `./PRODUCT_DATA.md` | all routes deleted. Also duplicates MASTER_CONTEXT wholesale |
| `features/WHAT_TO_EXPECT.md` | documents `WhatToExpectTimeline.tsx` and `app/lib/whatToExpectData.ts` | both deleted. V2 shipped and this doc has no record of it |
| `features/CROSS_SELL.md` | "Explore other protocols" section, `app/components/crossSell/` | directory deleted |
| `features/CASE_STUDIES.md` | `getAthletesForProtocol("1"-"4")`, `productId` as protocol id | helper no longer in `app/` |
| `development/GO_LIVE_PRICING_AUDIT.md` | "One file drives almost everything: `app/lib/funnelData.ts`" | file does not exist; `/funnel` deleted. Whole doc is dead |
| `development/CART_ATTRIBUTES.md` | `protocol_page` source = add from `/protocol/[id]`; quiz referrer logic | routes deleted |
| `MASTER_CONTEXT.md` | `/protocol/[id]` redirects to homepage; `/quiz` code kept; `.premium-pdp` sticky gotcha | protocol redirects to `/conka-both`, quiz code removed, `premium-base.css` deleted |
| `branding/MOBILE_OPTIMIZATION.md` | component table lists `ProtocolBuilderMobile.tsx`, `ProtocolCalendarSectionMobile.tsx` | deleted |
| `development/CODEBASE_AUDIT_AND_ROADMAP.md` | Q1: "Protocol system still fully present (~3.3k lines)" | deleted |
| `development/TRIAL_PAGES_PERFORMANCE_PLAYBOOK.md` | body references `funnel-b`, `/funnel` as live siblings | deleted (its own header says so, body was not updated) |
| `workflows/03-nextjs-development.md` | `.premium-pdp` overflow rule as current guidance | class no longer exists |
| `product/FORMULATION_SPEC.md` | audit row for `app/components/landing/LandingWhatsInside.tsx` | deleted |
| `product/SKU_AND_SHOT_REFERENCE.md` | `app/components/subscriptions/SubscriptionCard.tsx` | not present |
| `analytics/META_PIXEL_AND_CAPI.md` | ViewContent fires on `protocol/[id]` | route deleted |
| `features/LANDING_QUIZ_SYSTEM.md` | "The legacy code is scheduled for removal" | already removed |
| `TODO.md` | "Protocol System Cleanup" item 1: delete `app/protocol/[id]/page.tsx` | already done |
| `CLAUDE.md` (root, line 20) | "The `/protocol/[id]` route and its components **are being deleted**" | already gone. Only `ProtocolId`, `PROTOCOL_VARIANTS` and `app/lib/legacy/protocolSubscriptions.ts` remain, which the doc describes correctly |

### Feature plan verdicts (41 docs)

**DELETE (3)** - fully superseded, nothing unique at risk:

| File | Reason |
|---|---|
| `AI_Systems_Engineering_Master_Notes.md` | Not a CONKA document. Generic notes on a YouTube series. Zero repo facts |
| `listicle-im8-simple-dtc.md` | Shipped; the one decision it holds is already in `docs/CHANGELOG.md` |
| `landing-conversion/quiz-format.md` | Shipped; build record only. Fix 2 inbound links first |

**ARCHIVE (8)** - superseded but hold rationale with no other home. Move to `docs/development/featurePlans/archive/`:

| File | What would be lost |
|---|---|
| `account-portal-simple-dtc.md` | The read-vs-scan mono rule; what was deliberately kept clinical. Linked from `docs/README.md` line 77 |
| `blog-informational-content-surface.md` | Content-model options table (why not Sanity/Contentful/Convex/MDX); SSG-over-ISR rationale. Linked from 2 source files |
| `magic-mind-video-hero.md` | The revert path: which components and `/videos/both` assets to restore. Nothing else records this |
| `seo-aeo-metadata-foundation.md` | Already self-labelled an archive. 55KB of per-phase build record |
| `synergy-3pl-integration.md` | Test-path evidence (orders #3522/#3523/#3524), EAN/customs data, metafield schema |
| `landing-conversion/CONKA-LANDER-HANDOVER.md` | Vendor drop-in contract: CSS-Modules `.conka-lander` scoping, straight-to-checkout decision |
| `landing-conversion/adhd-listicle-copy-upgrade.md` | AnswerSocrates keyword research and full drafted copy |
| `landing-conversion/listicle-format.md` | usecloud.co section-by-section teardown and conversion principles |

**MERGE-THEN-DELETE (13)** - fold the unique content into the canonical doc, then delete. Grouped by target so this is 6 sittings, not 13:

| Target canonical doc | Plans to fold in | Key content to carry |
|---|---|---|
| `features/LISTICLE_SYSTEM.md` | `listicle-copy-framing-review.md`, `listicle-cta-attribution.md`, `landing-conversion/listicle-blueprint.md` | The ~60-word statement-titled variant-B rule; event taxonomy rationale (section-impression denominators); IM8 zone anatomy, which LISTICLE_SYSTEM already depends on. Open items go to `docs/TODO.md` |
| `features/LANDING_QUIZ_SYSTEM.md` | `quiz-insights.md`, `landing-conversion/brain-age-quiz.md` | Convex migration note; Phase 2 dashboard scope; dark-theme-per-config decision; Luke's copy provenance |
| `analytics/ATTRIBUTION_STATE_AND_PLAN.md` | `meta-upper-funnel-identity.md` | Its "Corrections to the source doc" section, which may never have been folded back; match-quality baselines ATC 3.2 / IC 3.0 / Purchase 6.6 |
| `analytics/META_PIXEL_AND_CAPI.md` | `meta-tracking-hardening.md` | InitiateCheckout triple-fire diagnosis; Phase 2 gate criteria |
| `analytics/LISTICLE_PERFORMANCE.md` | `productivity-listicle-founder-reposition.md` | 17% vs 45%/35% first-fold retention diagnosis; message-match break argument |
| `branding/DESIGN_SYSTEM.md` §8.5 | `simple-dtc-design-language.md` | Why radius was pulled down to commerce-control scale rather than cards pushed up; the open gold vs green call |
| `seo-aeo/README.md` | `aeo-content-shape-phase-9.md` | Instrument validation IDs (PMC10533908, ISRCTN95636074, 93% sensitivity, 14 NHS Trusts); the deferred white-paper ticket |
| `features/KLAVIYO_FLOWS_AND_INTEGRATION.md` | `alia-email-capture-integration.md` | The ~360ms Google Fonts regression that killed `klaviyo.js`; single-opt-in requirement on `WBbMia` |
| `features/b2b/B2B_PORTAL.md` | `b2b-enquiry-honeypot-silent-drop.md` | Klaviyo IDs (metric `VSeGwy`, list `Xhqyt8`, flows `SbRqyH`/`X6Uh4U`); Phase 2 monitoring, which B2B_PORTAL does not carry |
| `features/WHAT_TO_EXPECT.md` | `what-to-expect-v2-timeline.md` | Update the canonical doc to V2 **first**. Right now the plan is the only record of what shipped |
| `featurePlans/pdp-structure-rework.md` | `pdp-mm-upgrades-flow.md` | Magic Mind PDP teardown and the single-browsable-ingredient-section argument. Confirmed superseded |

**KEEP (17)** - active work or live contracts. Three are misfiled and should move out of `featurePlans/`:

| File | Move to | Why |
|---|---|---|
| `blog-notion-engine-brief.md` | `docs/features/` | A live authoring contract, not a plan. `BLOG_SYSTEM.md` explicitly defers to it |
| `aeo-free-tool-runbook.md` | `docs/seo-aeo/` | A recurring ops runbook |
| `CONKA_SEO_Keyword_Map_v4.md` | `docs/seo-aeo/` | A source dataset (312 keywords), not a plan |

Remaining KEEP, unchanged: `ab-testing-mvp`, `account-portal-funnel-simplification`, `aeo-demographic-query-research`, `asset-and-protocol-cleanup`, `attribution-robustness`, `build-your-order-consolidation`, `legacy-blog-migration`, `listicle-template-upgrade`, `order-size-shipping-tiers`, `pdp-structure-rework`, `skio-klaviyo-retention-migration`, `skio-subscription-migration`, `landing-conversion/README.md`.

### Plans whose status header contradicts the code (8)

Cheapest single win in the whole audit. Correct these headers:

| File | Says | Actually |
|---|---|---|
| `alia-email-capture-integration.md` | "Not Started" | Shipped (`AliaIdentityBridge` in `app/layout.tsx`) |
| `b2b-enquiry-honeypot-silent-drop.md` | "DIAGNOSED, not fixed" | Fixed (SCRUM-1137 live) |
| `asset-and-protocol-cleanup.md` | "Not started" | Phases 1-4 done (its own phase table says so) |
| `aeo-content-shape-phase-9.md` | "In progress" | `seo-aeo/README.md` says shipped |
| `listicle-copy-framing-review.md` | "Analysis only. No copy changed." | Copy changed |
| `listicle-cta-attribution.md` | "Not started" | Shipped |
| `productivity-listicle-founder-reposition.md` | "Scoped, not started" | Shipped 2026-07-27 |
| `listicle-template-upgrade.md` | "Scoped, not started" | Mostly shipped |

Also: `account-portal-simple-dtc.md` contradicts itself. Phase table says all four phases Done; Jira table says SCRUM-1188 "To Do". Confirm the ticket before archiving.

### Index gaps (Phase 4)

**Orphaned from `docs/README.md` (18 of 89):**

| Folder | Files |
|---|---|
| `ops/` | `README.md`, `subscription-platform.md`, `vendor-costs.md`. Entire folder missing despite being the active commercial hub |
| `email-signature/` | `README.md`. Folder missing entirely |
| `analytics/` | `ATTRIBUTION_STATE_AND_PLAN.md`, `HISTORY.md`, `EMAIL_CAPTURE_ENRICHMENT.md`, `PDP_SECTION_TRACKING.md` |
| `development/` | `LANDING_PAGE_CLAIMS_LOG.md`, `LTV_TAGGING_PLAN.md`, `MEASURING_COMPONENT_HEIGHTS.md`, `changelog-jan-feb-2026.md` |
| `features/` | `nike-mind-partnership.md`, `nike-mind-research.md`, `nike-mind-deck-copy.md`, `nike-mind-partnership-deliverables.md`, `conka-brand-overview-deck.md` |
| `workflows/` | `10-figma-decks.md` (in CLAUDE.md but not `docs/README.md`) |

**Dead cross-references (12):**

| Source | Dead ref | Fix |
|---|---|---|
| `MASTER_CONTEXT.md:36,194` | `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` | Deleted, no replacement. Remove the ref |
| `workflows/09-ux-iteration.md:135,159` | same | same |
| `landing-conversion/README.md` | same | same |
| `MASTER_CONTEXT.md:195` | `docs/PRODUCT_DATA.md` | `docs/product/PRODUCT_DATA.md` |
| `workflows/04-shopify-commerce.md:68` | `docs/PRODUCT_DATA.md` | same |
| `features/PROJECT_OVERVIEW.md:34` | `./PRODUCT_DATA.md` | same |
| `workflows/01,02,05,README` (5 refs) | `docs/PROJECT_OVERVIEW.md` | `docs/features/PROJECT_OVERVIEW.md` |
| `features/TESTIMONIALS.md:33` | `docs/REVIEWS_WORKFLOW.md` | `docs/workflows/REVIEWS_WORKFLOW.md` |
| `analytics/HISTORY.md:14,50` | `FUNNEL_EVENTS.md` | `BYO_EVENTS.md` |
| `features/nike-mind-partnership.md:9` | `nike-trial-deck-copy.md`, `nike-engagement-mechanic-options.md` | Not in repo. Resolve or remove |
| `conkaAppData/coffee-conka-cognition-report.md` | `assets/coffee-conka/*.png` (x2) | Images not in repo |

**Canonical docs missing from CLAUDE.md's index (14):** `PRICING_HISTORY.md`, `CHANGELOG.md`, `product/PRODUCT_DATA.md`, `product/FORMULATION_SPEC.md`, `development/CART_PRICING_SOURCE_OF_TRUTH.md`, `development/TRIAL_PAGES_PERFORMANCE_PLAYBOOK.md`, `development/CART_ATTRIBUTES.md`, `branding/CLAIMS_COMPLIANCE.md`, `shipping/SHIPPING_AND_COURIERS.md`, `ops/README.md`, `deployment/VERCEL_GIT_CONNECTION.md`, `features/KLAVIYO_FLOWS_AND_INTEGRATION.md`, `workflows/REVIEWS_WORKFLOW.md`, `seo-aeo/AEO_PLAYBOOK.md`.

Note: `docs/README.md` has **zero dead links** and CLAUDE.md has **zero dead paths**. The problem is omission, not breakage.

### Duplication (Phase 5, future)

| Pair | Canonical | Action |
|---|---|---|
| `MASTER_CONTEXT.md` vs `features/PROJECT_OVERVIEW.md` | MASTER_CONTEXT | PROJECT_OVERVIEW is 4 months stale and mostly wrong. Delete or fold in |
| `development/CART_ATTRIBUTES.md` vs `development/LTV_TAGGING_PLAN.md` | CART_ATTRIBUTES | LTV_TAGGING_PLAN is the quiz/protocol-era predecessor |
| `analytics/README.md` vs `ATTRIBUTION_STATE_AND_PLAN` vs `HEADLESS_ATTRIBUTION_FIX` vs `HISTORY` | analytics/README | Three self-labelled historical docs, none indexed. Consolidate or archive |
| `features/LISTICLE_SYSTEM.md` vs `features/LANDING_QUIZ_SYSTEM.md` | Neither | Both claim to be the reference for `/go/[slug]`. Needs one parent doc plus two format sub-docs |
| `branding/QUALITY_STANDARDS` vs `MOBILE_OPTIMIZATION` vs `DESIGN_SYSTEM` | DESIGN_SYSTEM | Mobile-first mandate restated in all three; only DESIGN_SYSTEM is current |
| `BRAND_VOICE` vs `CLAIMS_COMPLIANCE` vs `development/LANDING_PAGE_CLAIMS_LOG` | CLAIMS_COMPLIANCE for rules, FORMULATION_SPEC for doses | LANDING_PAGE_CLAIMS_LOG flags its own mg figures as wrong. Archive it |
| `PRICING_HISTORY` vs `product/SKU_AND_SHOT_REFERENCE` vs `development/GO_LIVE_PRICING_AUDIT` | SKU_AND_SHOT_REFERENCE | GO_LIVE_PRICING_AUDIT is a dead one-shot built on a deleted file. Retire it |
| `CHANGELOG.md` vs `development/changelog-jan-feb-2026.md` | CHANGELOG | The other is an orphaned one-off PR digest |

---

## Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Correct the canon | **Done** |
| 2 | Retire the dead plans | **Done** |
| 3 | Merge-then-delete the 13 | **Done** |
| 4 | Repair the indexes | **Done** |
| 5 | De-duplicate | **Done** |

> **The tables below are the audit as taken on 2026-08-27, kept as the record of
> what was found.** They describe the state *before* the fix, so do not read them
> as current. Where execution diverged from the audit (extra stale docs found,
> two docs archived that the audit had not flagged, corrections already folded in
> that the audit thought were outstanding), the divergence is recorded in
> `docs-hygiene-progress.md`.

### Phase 1: Correct the canon (ACTIVE)

Fix wrong facts only. No restructuring.

1. **Docs - correct stale code and route references**
   - What: work the Phase 1 table above. Each edit is a targeted replacement of a dead path, component name, or route with the current truth, or deletion of the claim if there is no replacement
   - Dependencies: none
   - Complexity: Medium (18 files, small edits each)
   - Files: see the "Canonical docs with stale references" table, plus `CLAUDE.md` line 20

2. **Docs - bring `features/WHAT_TO_EXPECT.md` up to V2**
   - What: rewrite against `app/components/home/WhatToExpectV2.tsx` and the brighten helper at `app/lib/motion.ts:117`. This is a real rewrite, not a find-and-replace, because the doc currently describes a deleted component
   - Dependencies: none. Must land before the `what-to-expect-v2-timeline.md` merge in Phase 3
   - Complexity: Small
   - Files: `docs/features/WHAT_TO_EXPECT.md`

3. **Docs - retire `development/GO_LIVE_PRICING_AUDIT.md`**
   - What: the whole doc is built on `app/lib/funnelData.ts`, which does not exist. Move to archive rather than repair
   - Dependencies: Phase 2 archive folder must exist
   - Complexity: Small

### Phase 2: Retire the dead plans (ACTIVE)

1. **Docs - create the archive folder**
   - What: `docs/development/featurePlans/archive/` with a one-line README explaining what lives there and why it is not deleted
   - Complexity: Small

2. **Docs - delete the 3 dead plans**
   - What: delete `AI_Systems_Engineering_Master_Notes.md`, `listicle-im8-simple-dtc.md`, `landing-conversion/quiz-format.md`. Fix the 2 inbound links to `quiz-format.md` first (`landing-conversion/README.md`, `landing-conversion/brain-age-quiz.md`)
   - Complexity: Small

3. **Docs - archive the 8**
   - What: move to `archive/`, repath every inbound link. `seo-aeo-metadata-foundation.md` has 4 inbound links, `synergy-3pl-integration.md` has 3, `account-portal-simple-dtc.md` is in `docs/README.md` line 77, `blog-informational-content-surface.md` is linked from `app/lib/blog.ts` and `app/lib/blogTransform.ts`
   - Dependencies: archive folder
   - Complexity: Medium (link repathing is the work, not the moving)

4. **Docs - correct the 8 lying status headers**
   - What: see the table above. Confirm SCRUM-1188 before touching `account-portal-simple-dtc.md`
   - Complexity: Small

5. **Docs - relocate the 3 misfiled docs**
   - What: `blog-notion-engine-brief.md` to `docs/features/`, `aeo-free-tool-runbook.md` and `CONKA_SEO_Keyword_Map_v4.md` to `docs/seo-aeo/`. Repath inbound links, including from `scripts/legacy-blog/convert.ts` and `scripts/legacy-blog/metaDescriptions.ts`
   - Complexity: Medium (`CONKA_SEO_Keyword_Map_v4.md` has 6 inbound links)

### Phase 3: Merge-then-delete the 13 (ACTIVE, metered)

One sitting per target doc, in this order. Each sitting: read the plan, fold the "key content to carry" into the target, delete the plan, repath inbound links.

1. `features/WHAT_TO_EXPECT.md` (blocked on Phase 1 task 2)
2. `features/LISTICLE_SYSTEM.md` (3 plans)
3. `features/LANDING_QUIZ_SYSTEM.md` (2 plans)
4. `analytics/*` (3 plans across ATTRIBUTION_STATE_AND_PLAN, META_PIXEL_AND_CAPI, LISTICLE_PERFORMANCE)
5. `branding/DESIGN_SYSTEM.md` §8.5, `seo-aeo/README.md`, `features/KLAVIYO_FLOWS_AND_INTEGRATION.md`, `features/b2b/B2B_PORTAL.md` (1 plan each)
6. `featurePlans/pdp-structure-rework.md` (absorbs `pdp-mm-upgrades-flow.md`)

Complexity: Large in aggregate, Small per sitting.

### Phase 4: Repair the indexes (ACTIVE)

1. **Docs - add the 18 orphans to `docs/README.md`**, `ops/` and `email-signature/` as new folder rows
2. **Docs - fix the 12 dead cross-references** per the table above
3. **Docs - add the 14 missing canonical docs to CLAUDE.md's index table.** Judgement call on which genuinely earn a row; `ops/README.md`, `shipping/SHIPPING_AND_COURIERS.md` and `features/KLAVIYO_FLOWS_AND_INTEGRATION.md` clearly do

Complexity: Medium.

### Phase 5: De-duplicate (DONE)

Resolved as follows. The `LISTICLE_SYSTEM` / `LANDING_QUIZ_SYSTEM` overlap was the one worth solving properly, and it got the parent-plus-two-formats treatment the table proposed.

| Pair | Resolution |
|---|---|
| `MASTER_CONTEXT` vs `features/PROJECT_OVERVIEW` | **PROJECT_OVERVIEW deleted.** All 34 lines were already in MASTER_CONTEXT; 5 inbound references repointed |
| `CART_ATTRIBUTES` vs `LTV_TAGGING_PLAN` | **LTV_TAGGING_PLAN archived** |
| The analytics quartet | **No change, deliberately.** `analytics/README.md` already declares precedence ("if a linked doc contradicts this page, this page wins for what is live today"), the two historical docs carry banners, and Phase 4 indexed all four. Four distinct declared jobs, not duplication |
| `LISTICLE_SYSTEM` vs `LANDING_QUIZ_SYSTEM` | **New thin parent `features/GO_LANDING_PAGES.md`** owns the route, registry, noindex/never-link rules and shared analytics constraints. Both format docs shed that preamble and now open by deferring to it |
| `QUALITY_STANDARDS` vs `MOBILE_OPTIMIZATION` vs `DESIGN_SYSTEM` | **Split by job.** DESIGN_SYSTEM §7 is the single statement of the mandate, QUALITY_STANDARDS keeps only the review gate, MOBILE_OPTIMIZATION is the pattern library. Each says so at the top |
| `BRAND_VOICE` vs `CLAIMS_COMPLIANCE` vs `LANDING_PAGE_CLAIMS_LOG` | **LANDING_PAGE_CLAIMS_LOG archived.** BRAND_VOICE had pointed at it as *the* claims reference, which was the worst pointer in the tree: that doc flags its own mg figures as wrong. Now points at CLAIMS_COMPLIANCE for rules and FORMULATION_SPEC for doses |
| `PRICING_HISTORY` vs `SKU_AND_SHOT_REFERENCE` vs `GO_LIVE_PRICING_AUDIT` | **Already resolved in Phase 1** (GO_LIVE_PRICING_AUDIT archived). The other two do different jobs: SKU is the map, PRICING_HISTORY is a dated append-only log that defers to `OFFER_PRICING` in code |
| `CHANGELOG` vs `changelog-jan-feb-2026` | **changelog-jan-feb-2026 archived** |

---

## Rabbit holes

- **Phase 3 is where scope explodes.** Every merge tempts a rewrite of the target doc. The rule is: fold in the missing facts, do not restructure. Restructuring is Phase 5.
- **Link repathing is the hidden cost of archiving.** Five plans are referenced from `.ts` source comments (`app/lib/landings/productivity-listicle.ts:19`, `app/lib/legacy/protocolSubscriptions.ts`, `app/lib/blog.ts`, `app/lib/blogTransform.ts`, `scripts/legacy-blog/*`). Moving or deleting those leaves dangling references in code, not just docs.
- **Do not audit the audit.** `CODEBASE_AUDIT_AND_ROADMAP.md` has its own stale claims. Correct them in Phase 1, do not re-run the codebase audit it describes.

## No-gos

- No rewriting docs that are merely old but still correct. `BRAND_VOICE.md`, `QUALITY_STANDARDS.md`, `CLAIMS_COMPLIANCE.md` and the `workflows/` set are 3 to 5 months old and largely fine. Age alone is not a defect.
- No touching `docs/conkaAppData/` data snapshots. Age is expected for a dated report.
- No consolidating the `workflows/` folder. It is verbose but accurate.
- No deleting anything with unique rationale. When in doubt, archive.
- No new documentation. This task removes and corrects; it does not add.

## Risks

- **Deleting a doc someone still relies on.** Mitigation: archive rather than delete for all 8 ARCHIVE verdicts, and the audit lists inbound links per file.
- **Parallel sessions.** Multiple Claude sessions run on this repo. Stage only this task's files by name.
- **Status confirmation gap.** `account-portal-simple-dtc.md` contradicts itself on SCRUM-1188. Confirm before archiving.
- **`order-size-shipping-tiers.md` Phase 3** has been "next" since 12 June. Confirmed live for now; if it dies, this drops to MERGE-THEN-DELETE and `docs/README.md` line 77 needs editing.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Archive folder or rely on git history | `docs/development/featurePlans/archive/` | Several docs hold rationale with no other home (the video-hero revert path, the usecloud.co teardown). Git archaeology is not something anyone actually performs |
| Is `pdp-mm-upgrades-flow.md` superseded | Yes | Confirmed by owner. Fold the Magic Mind teardown into `pdp-structure-rework.md` and delete |
| Is `order-size-shipping-tiers` Phase 3 live | Yes, keep | Confirmed by owner |
| Ticket granularity | One ticket, four phases as acceptance criteria | Lets Phase 3 be ticked off incrementally without four open tickets |

## Design language

Not applicable. No UI, no components, no routes.

## Analytics

Not applicable.

## References

- `CLAUDE.md` docs index and workflows tables
- `docs/README.md` (the docs index)
- `docs/TODO.md` (deferred work tracker; Phase 3 open items land here)
- `.claude/skills/scope/shape.md` (the process that creates these plan docs in the first place)

## Jira

| Ticket | Scope | Status |
|---|---|---|
| [SCRUM-1268](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1268) | Phases 1 to 4 | To Do |

Epic: SCRUM-769 (Infrastructure & Ops). Labels: `documentation`, `tech-debt`. Left in the backlog rather than Sprint 30, which closes 29 Aug 2026.
