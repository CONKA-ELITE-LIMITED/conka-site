# Docs Hygiene Audit - Execution Log

**Tracks:** [SCRUM-1268](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1268)
**Plan:** `docs/development/featurePlans/docs-hygiene-audit.md`
**Branch:** `docs/hygiene-audit-phases-1-4`
**Started:** 2026-08-27

This is the working log for Phases 1 to 4. It records what was changed, what was
decided in flight, and what is left for a human. Delete it once SCRUM-1268 closes;
the durable record is the corrected docs themselves plus git history.

---

## Verified ground truth

Checked against the working tree before any edit, so the corrections are not
themselves guesses:

| Claim under audit | Reality |
|---|---|
| `app/components/VisibilityGate.tsx` | gone |
| `app/start/CROBelowFold.tsx` | gone |
| `app/components/product/WhatToExpectTimeline.tsx` | gone; replaced by `app/components/home/WhatToExpectV2.tsx` + `app/lib/whatToExpectV2.ts` |
| `app/lib/whatToExpectData.ts` | gone |
| `app/components/crossSell/` | gone, zero consumers in `app/` |
| `getAthletesForProtocol` | gone, zero hits in `app/` |
| `app/components/subscriptions/SubscriptionCard.tsx` | gone |
| `app/lib/funnelData.ts` | gone |
| `app/protocol`, `app/quiz`, `app/shop` | gone |
| `/protocol/:path*`, `/shop`, `/shop/:path*` | permanent redirect to `/conka-both` |
| `/quiz/:path*`, `/funnel`, `/funnel-b`, `/funnel-c` | permanent redirect to `/build-your-order` |

Two corrections to the audit itself, found while verifying:

1. The audit says `MASTER_CONTEXT.md` claims protocol "redirects to homepage" and
   that this is wrong. Correct, but the real target is `/conka-both`, not the
   homepage, and `/quiz` redirects to `/build-your-order` rather than being
   "kept for repurposing".
2. `docs/CHANGELOG.md` and `docs/development/changelog-jan-feb-2026.md` reference
   most of the deleted files, but they are **historical records** and correctly
   describe those files as deleted at the time. They are out of scope. The AC is
   "referenced as if it exists", not "mentioned".

---

## Decisions taken in flight

| Decision | Choice | Why |
|---|---|---|
| SCRUM-1188 is In Progress, not "To Do" as the plan doc says | Archive `account-portal-simple-dtc.md` anyway; flag the open ticket | Archiving is non-destructive and the doc's own phase table says all four phases are Done. The ticket was simply never closed. Flagged for a human below |
| Changelog files carrying dead paths | Left alone | Historical record. Correcting them would falsify history |

---

## Phase log

### Phase 1 - Correct the canon (DONE)

18 canonical docs corrected, plus CLAUDE.md. Notable ones where the fix was
substantive rather than a path swap:

- **`development/PERFORMANCE_OPTIMISATION.md`** was the worst offender because it
  is in CLAUDE.md's index and gives a *mandatory checklist*. It told you to wrap
  heavy sections in `<VisibilityGate>` and to pass `ssr: false` on noindex pages.
  Both were **tried and deliberately reversed** in the May 2026 /start rebuild:
  the gate never suppressed the chunk (Next 16 lists it in the initial HTML
  regardless) and it prevented Server Components from being SSR'd at all, while
  a Phase 0 trace showed bandwidth starvation, not hydration, was the real
  bottleneck. Rewritten to record the negative result so nobody rebuilds either.
- **`features/WHAT_TO_EXPECT.md`** rewritten from scratch against
  `WhatToExpectV2.tsx` + `whatToExpectV2.ts`. It had documented a deleted
  component, so the shipped V2 was entirely undocumented.
- **`branding/MOBILE_OPTIMIZATION.md`** - the audit flagged 2 dead rows. Actually
  **7 of 8** components in its table were deleted, and all 3 rows of the
  "Protocol PDP examples" table. Rebuilt both against `find app -name "*Mobile.tsx"`.
- **`CLAUDE.md`** - the audit flagged only line 20, but the whole "Current
  strategic direction (March 2026)" block was stale: it described the ad landing
  page and funnel page as upcoming (both shipped), and the quiz as "hidden, may
  be repurposed" (deleted, redirects to `/build-your-order`). Rewritten.
- **`development/CART_ATTRIBUTES.md`** - its `source` value table listed 4
  values, 3 of them retired. Replaced with the 8 values actually in `app/`, plus
  a note that `getAddToCartSource()` is now inert (it keys on `/quiz`, which
  cannot be reached).

### Phase 2 - Retire the dead plans (DONE)

- Created `archive/` with a README that says what lives there and where the live
  answer is instead.
- Deleted 3, archived 8, as scoped. **Plus two not in the audit's list** (see
  Deviations).
- Corrected 8 lying status headers, **plus a 9th** (`quiz-insights.md` said "Not
  Started" but `convex/quizEvents.ts` and the table both exist, so Phase 1 had
  shipped).
- Relocated the 3 misfiled docs and repathed every inbound reference, including
  the ones in `.ts` source comments.

### Phase 3 - Merge-then-delete the 13 (DONE)

All 13 folded into their named target and deleted. Where the audit predicted
content was missing and it turned out already present, nothing was duplicated:

- **`meta-upper-funnel-identity.md`** - the audit (and a standing memory note)
  said its "Corrections to the source doc" may never have been folded back.
  They had been: `ATTRIBUTION_STATE_AND_PLAN.md` already carried the A4-is-moot
  finding and the Test-Events false-negative warning. What was genuinely missing
  was the shipped design (`external_id` = `conka_uid` everywhere, why Phase 2 was
  not optional, the two bugs review caught), so that was folded in instead.
- **`branding/DESIGN_SYSTEM.md` §8.5** already documented the radius grammar and
  had *resolved* the "open gold vs green call" as keep-gold. Only the rationale
  was missing, so only the rationale was added.
- **`listicle-cta-attribution.md`** - `LISTICLE_SYSTEM.md` already carried the
  event taxonomy and the section-impression-as-denominator argument in more
  depth than the plan. Folded in the IM8 zone anatomy and the ~60-word
  statement-titled reason rule instead.

### Phase 4 - Repair the indexes (DONE)

- `docs/README.md`: the audit counted 18 orphans; the real number was **22**.
  All now covered, with new rows for `ops/`, `email-signature/`, and a new
  "Partnerships & decks" section for the five Nike/brand-deck docs.
- All 12 dead cross-references fixed. A link check across `docs/` + `CLAUDE.md`
  now reports **zero** dead markdown links (the 3 remaining hits are literal
  `[text](url)` examples inside prose in `blog-notion-engine-brief.md`).
- Found and fixed **24 more** dead links the audit had not caught:
  `features/CUSTOMER_PORTAL.md` linked every source file as `../app/...`, which
  resolves to `docs/app/` rather than the repo's `app/`.
- CLAUDE.md's index gained 14 rows.

---

## Deviations from the audit

| Deviation | Why |
|---|---|
| Archived `docs/features/CROSS_SELL.md`, which the audit listed only as a Phase 1 "fix stale refs" target | `app/components/crossSell/` is deleted with **zero** consumers in `app/`. The doc describes a feature that does not exist in any form, so there was nothing to correct it to. Archiving matches the audit's own "when in doubt, archive" rule and its handling of `GO_LIVE_PRICING_AUDIT.md`, which is the same situation |
| The archive folder holds retired **canonical docs**, not just feature plans | The audit already sent `GO_LIVE_PRICING_AUDIT.md` (a canonical doc) there. The README is worded to cover both |
| Touched `docs/conkaAppData/coffee-conka-cognition-report.md`, which the no-gos exclude | Only to fix 2 broken image embeds pointing at PNGs never committed to the repo, which AC8 requires. The report's data is untouched. The no-go is about not "freshening" dated data, not about leaving broken links |
| Edited 7 `.ts`/`.tsx` files | AC10 says docs-only, but AC5 explicitly requires the `.ts` source-comment references to resolve. **Comments only, no logic**, verified by the diff: 10 lines changed across 10 files, every one a doc path in a comment |
| Fixed stale refs in 4 *active* plan docs the audit's Phase 1 table did not list | `ab-testing-mvp`, `account-portal-funnel-simplification`, `skio-subscription-migration` and `asset-and-protocol-cleanup` all pointed at `app/lib/funnelData.ts` or `SubscriptionCard.tsx` as live. AC1 covers every doc under `docs/`, not only the tabled ones. Repointed to `byoData.ts` / `SubscriptionListCard.tsx` |

---

## Issues hit

- **`git rm` refused the merged plans** because they had local modifications from
  the Phase 2 status-header pass. Used `git rm -f` after confirming the content
  was already folded into the target doc.
- **A find-and-replace left `IGNORE` marker text** in three files while repointing
  links to deleted listicle plans. Caught by grep and cleaned in the same pass;
  no marker survives.
- **The audit's own dead-reference list is incomplete**, in both directions: it
  missed 24 dead links in `CUSTOMER_PORTAL.md` and 4 orphans, and it listed two
  corrections as outstanding that had already been folded in. Treat its tables as
  a strong starting point, not a complete inventory.

---

## Left for a human

- **SCRUM-1188** ("[Frontend] Convert /account portal to Simple DTC") is still
  In Progress in Jira although the work shipped. Close it.
- **Phase 5 (de-duplication) is untouched**, as scoped. The pair worth solving
  properly is `LISTICLE_SYSTEM.md` vs `LANDING_QUIZ_SYSTEM.md`: both claim
  authority over `/go/[slug]` and neither wholly has it. Note that Phase 3 made
  both docs *bigger*, so the overlap is now more visible, not less.
- **Two Skio docs are referenced but not written:** `docs/features/skio/migration.md`
  and `skio-attribution-fulfilment-parity.md`. Marked "(not yet written)" rather
  than linked, so the link check stays clean.
- **`docs/features/PROJECT_OVERVIEW.md` duplicates `MASTER_CONTEXT.md` wholesale.**
  Corrected in Phase 1 rather than deleted, because deletion is a Phase 5 call.
