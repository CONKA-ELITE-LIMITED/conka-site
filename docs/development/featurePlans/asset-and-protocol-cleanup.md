# Asset and Protocol Tech Debt Cleanup

**Status:** Not started
**Owner:** Rudh
**Branch:** `chore-asset-and-protocol-cleanup`
**Tracking:** Plan doc only, no Jira
**Created:** 2026-07-14

---

## Problem

The repo carries two piles of dead weight that make the codebase harder to reason about than the product actually is:

1. **~84 MB of unreferenced assets.** 150 of the 418 files in `public/` are referenced by nothing in the codebase. The bulk is a root-level photo dump: 62 `CONKA_*.jpg` / `CONKA_*[ai].png` files totalling 68 MB, of which only 6 are actually used. Of the 150, **141 were deleted and 9 kept deliberately** (see the keep-list in Phase 1).
2. **~3,400 lines of dead protocol code.** The 4-protocol system was hidden behind a redirect months ago but never removed. The route, its components, and its copy modules are still fully present.

An asset audit also surfaced two real bugs (see Phase 2).

## Why it matters

This is maintainability, not conversion. The honest justification: the protocol code sits inside the product-data layer, so anyone touching pricing, product types, or the `productData` barrel has to reason about a product line that no longer exists. Several components already carry TODOs blocked on the protocol route being swept. The video bug means we ship optimised WebM and poster assets that are never served to users.

## Appetite

About a day. Each phase ships independently via a Vercel preview.

## Design system

Not applicable. No UI is being built.

---

## Critical constraint: protocols are only half dead

The **presentation** layer is dead. The **commerce** layer is not.

`ProtocolId` is threaded through code that serves existing customers:

- `app/lib/shopifyProductMapping.ts` holds `PROTOCOL_VARIANTS`, a map of real Shopify variant IDs keyed by protocol and tier. `CartContext` reaches it via `app/lib/productMetadata.ts`.
- The account portal supports protocol subscription editing: `app/hooks/useSubscriptionEditor.ts` is built around `currentProtocolId`, and `EditSubscriptionModal`, `ProductSelectorPanel`, `TierSelectorPanel` and `PlanPreviewBar` all consume `ProtocolId`.
- `app/api/auth/subscriptions/route.ts` and the pause route return protocol IDs and `/protocols/*.jpg` image paths.
- `app/lib/productTypes.ts` defines `ProductId = FormulaId | ProtocolId`.

**Working assumption (decided 2026-07-14): customers are still on protocol subscriptions.** The commerce layer is therefore treated as permanent legacy support. Deleting it would break those customers' portal and their renewal variant mapping. `public/protocols/` is likewise NOT orphaned: those box images render in the subscriptions and orders UI.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Delete unreferenced `public/` assets | **Done** (2026-07-14, 141 files, 83.2 MB) |
| 2 | Fix the video source and poster bugs | Not started |
| 3 | Delete the protocol presentation layer | Not started |
| 4 | Quarantine the protocol commerce layer | Not started |
| 5 | Delete the commerce layer entirely | Not planned (see below) |

---

## Phase 1: Delete unreferenced assets

**What:** Remove the unreferenced files in `public/`. 150 were unreferenced, 141 were deleted (83.2 MB), 9 were kept deliberately. `public/` went from 125 MB to 42 MB.

**Method used to identify them.** Every file in `public/` was cross-referenced against all 700 non-markdown source files (code, config, CSS, data modules). Two refinements mattered:

- **Markdown was excluded from the corpus.** `development_changelog.md` mentions dozens of assets that were removed from the site long ago, so a match there means the opposite of "in use".
- **Full paths were verified, not filenames.** Basename matching produced ten false positives from name collisions. For example `/lifestyle/flow/FlowHold.jpg` is dead, but the similarly named `/formulas/conkaFlow/FlowHold.jpg` is live.

**Breakdown:**

| Group | Files | Notes |
|-------|-------|-------|
| Root `CONKA_*` photos | 62 | ~68 MB. Only `CONKA_01`, `01x`, `02x`, `04`, `06`, `15` are live |
| Superseded athlete photos | 5 | Code uses the `*NB.jpg` no-background cutouts; originals orphaned |
| Ingredient `.webp` set | 12 | Mostly replaced by `/ingredients/renders/`; 4 stragglers still live |
| Old video cuts | 9 | Fully unreferenced sets (`BothIngredients`, `Flow`, `Clear`), MP4 included |
| Story, lifestyle, listicles, science | ~30 | Leftovers from earlier page versions |
| Next.js scaffold SVGs | 5 | `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` |

**Explicitly KEEP (the 9 unreferenced files that were NOT deleted):**

- `public/llms.txt` and `public/googlef7db7b8d1e309e2e.html` (2). Nothing references them because they are fetched directly by URL. The second is the Google Search Console verification file; deleting it drops site verification.
- `public/logo.png`, `public/conka.webp`, `public/conka.svg`, `public/logos/Klarna.png`, `public/sebdechaves.jpeg` (5). Unreferenced in code, but these are exactly the kind of asset hotlinked from a Klaviyo email template or a Meta ad, which this repo cannot see. Only ~600 KB combined, so not worth the risk.
- `public/videos/misc/BrainScan.webm` and `BrainScan-poster.jpg` (2). Unreferenced only because of the Phase 2 bug. `BrainScan.mp4` is live, and Phase 2 exists to start serving these two. Deleting them would turn a fixable bug into permanent asset loss.

Also untouched (never unreferenced): `public/protocols/`, which renders in the subscriptions and orders UI.

**Complexity:** Small. No code changes.

**Note:** This does not shrink the repo clone. `.git` is 232 MB and deleting files does not rewrite history. The win is a cleaner working tree and a smaller deploy bundle. Rewriting history to reclaim the space is a no-go (see Rabbit holes).

---

## Phase 2: Fix the video bugs

Both bugs were found during the asset audit. Neither is cosmetic.

**Bug 1: WebM and poster assets are never served.**
`app/components/go/QuizScreens.tsx` renders video with a bare `src`:

```tsx
<video src={screen.video} ... />
```

There are no `<source>` elements and no `poster` attribute, so the `.webm` fallback and the poster frame produced for `BrainScan` do nothing. Users of `/go/brain-age` get the MP4 with no poster.

This applies to `BrainScan` only. `public/videos/misc/BrainScan.webm` and `BrainScan-poster.jpg` were therefore **excluded from the Phase 1 deletion** and remain on disk, because they are unreferenced only as a consequence of this bug. The `BothIngredients`, `Flow` and `Clear` video sets were fully unreferenced including their MP4s, so those were deleted in Phase 1.

**Fix:** adopt the `<source>` + `poster` pattern already used correctly in `app/components/landing/LandingHeroVideo.tsx`. WebM first, MP4 second, poster on the element.

**Bug 2: stale comment.**
A comment points at `/lander/video/Flow.webm` while the actual `<source>` loads `BrainFuel.mp4`. It exists in **two** files:

- `app/lander/sections/BrainFuelBand/BrainFuelBand.tsx:8`
- `app/(trial-b)/lander-b/sections/BrainFuelBand/BrainFuelBand.tsx:8`

That comment was the only thing keeping `/lander/video/Flow.webm` looking alive.

**Complexity:** Small.

---

## Phase 3: Delete the protocol presentation layer

**Delete outright** (~3,407 lines):

- `app/protocol/[id]/page.tsx` (the route)
- `app/components/protocol/**` (ProtocolHero, ProtocolHeroMobile, ProtocolCalendar and its mobile twin, ProtocolBenefits, ProtocolRatioSelector, TierSelector, TierSelectorPremium, `why/CycleBreak*`)
- `app/components/navigation/ProtocolCard.tsx`
- `app/components/navigation/protocolHeroConfig.ts`
- `app/lib/protocolContent.ts`, `protocolSelectorData.ts`, `protocolSynergyCopy.ts`, `protocolWhyCopy.ts`, `protocolProblemCycleCopy.ts`

**Refactor:**

1. **`StickyPurchaseFooter.tsx` and `StickyPurchaseFooterMobile.tsx`** — strip the `protocolId` branch. The prop is optional and the live PDPs (`/conka-flow`, `/conka-clarity`, `/conka-both`) all pass `formulaId`, so the protocol pricing path is unreachable dead code.
2. **`app/lib/productHelpers.ts`** — remove `getProtocolPricing` and the protocol branches.
3. **`app/lib/productData.ts`** — remove the `protocolContent` re-export from the barrel.
4. **`app/components/cognitive-test/CognitiveTestRecommendation.tsx`** — repoint the three hardcoded `/protocol/N` links to `/conka-both`. Decided 2026-07-14. This removes a redirect hop rather than changing behaviour, since `/protocol/:path*` already redirects there.
5. **`app/components/orders/OrderCard.tsx`** — same, repoint its `/protocol/N` mapping to `/conka-both`.

**Keep:** the `/protocol/:path*` redirect in `next.config.ts`. It protects inbound links and indexed URLs.

**Bonus unblocked:** several components carry TODOs reading "no longer used on /conka-flow PDP, check if can be deleted once /conka-clarity and /protocol/3 are swept" (`FormulaCaseStudies.tsx`, `FormulaBenefits.tsx`, `FormulaBenefitsStats*.tsx`, `LandingCTA.tsx`). Deleting the route makes those evaluable. Assess them, but do not let it expand the phase.

**Complexity:** Medium. The deletion is mechanical; the care is in the refactors.

---

## Phase 4: Quarantine the protocol commerce layer

**What:** Keep every piece of the commerce layer working, but isolate it behind a clearly named legacy boundary so it reads as "support for existing subscribers" rather than "live product".

In scope to relocate or clearly mark:

- `ProtocolId` (`app/lib/productTypes.ts`)
- `protocolPricing` (`app/lib/productPricing.ts`)
- `PROTOCOL_COLORS` (`app/lib/productColors.ts`)
- `PROTOCOL_VARIANTS` (`app/lib/shopifyProductMapping.ts`)
- The subscriptions UI and the subscription API routes

The goal is that the next person touching the product-data layer immediately understands this code is legacy support, not something to build on. This is the change that stops the mess being re-discovered.

**Complexity:** Medium. Zero behaviour change; the test is that the account portal still works.

---

## Phase 5: Delete the commerce layer entirely

**Not planned.** Working assumption is that customers hold protocol subscriptions, so this layer is permanent legacy support.

Revisit only if protocol subscriptions reach zero, which would require migrating any remaining subscribers onto Flow / Clear / Both variants in Shopify first. That is an ops job, not a code job. If it ever happens, this phase would delete `ProtocolId`, `PROTOCOL_VARIANTS`, the protocol branches of the subscriptions UI, `public/protocols/`, and collapse `ProductId = FormulaId | ProtocolId` down to `FormulaId`.

---

## Rabbit holes

- **Refactoring the subscriptions UI while in Phase 4.** It works, real customers depend on it, and it is not what this work is for. Isolate, do not improve.
- **Collapsing `ProductId = FormulaId | ProtocolId`.** Touches the whole data layer. Blocked behind Phase 5, which is not planned.
- **Rewriting git history to reclaim the 83 MB.** `.git` is 232 MB and file deletion does not shrink it. Not worth the force-push cost to a shared repo.
- **Chasing the Phase 3 bonus TODOs.** Evaluate them, but a separate sweep if they turn out to be non-trivial.

## No-gos

- Not deleting `public/protocols/`, `PROTOCOL_VARIANTS`, or the subscription editing flow.
- Not removing the `/protocol`, `/quiz`, or `/shop` redirects in `next.config.ts`.
- Not deleting `llms.txt` or the Google Search Console verification file.
- Not deleting the small brand assets that may be hotlinked externally.

## Risks

- **Externally hotlinked assets.** This analysis can only see the repo. Assets referenced from Klaviyo templates, Meta ads or Shopify emails are invisible to it. Mitigated by keeping the small brand assets and by the fact that everything else being deleted is either a raw photo dump or a superseded variant.
- **Over-reaching on asset deletion.** Mitigated by full-path verification, which already caught ten false positives.
- **Phase 4 regression risk.** Moving types around can silently break the account portal. Verify subscription editing end to end before merging.

## Verification

- Phase 1: `npm run build` succeeds, spot-check that key pages still render their imagery.
- Phase 2: confirm in the browser that the quiz video loads a poster frame and that a WebM is served where supported.
- Phase 3: `npm run build` with no type errors, `/conka-flow`, `/conka-clarity`, `/conka-both` PDPs still price correctly, `/protocol/1` still redirects.
- Phase 4: the account portal can still load, edit and pause a protocol subscription.

## References

- `docs/TODO.md` (Protocol System Cleanup)
- `docs/development/CODEBASE_AUDIT_AND_ROADMAP.md` (item Q1: protocol system still fully present despite being "removed"; item Q5: cognitive-test links to dead `/protocol/*`)
- `next.config.ts` (redirects)
- `app/lib/productData.ts` (the barrel)
