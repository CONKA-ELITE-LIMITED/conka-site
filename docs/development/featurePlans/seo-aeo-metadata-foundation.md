# SEO / AEO Foundation

**Status:** Phase 1 built (in review). Phase 2 unblocked, not started. Phases 3 to 6 documented, not ticketed.
**Owner:** Rudh
**Source input:** `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md` (Humphrey, keyword research)
**Created:** 2026-07-10
**Updated:** 2026-07-10

## Progress log

- **2026-07-10** Phase 1 (SCRUM-1131) built on branch `scrum-1131-canonical-fix` off the `SEO-AND-AEO-WORK` integration branch. Root canonical switched to the relative `"./"` form; dead `app/science/layout.tsx` deleted. Verified against the dev server across eight routes plus the `/go/*` noindex and `/start-b` override cases. Reviewed via `/review-code`: LGTM, no fixes needed. Awaiting push and merge into `SEO-AND-AEO-WORK`.

---

## Problem

Humphrey's keyword map audits the copy on our pages and concludes that "0 winnable keywords appear in current live copy". That conclusion is correct but it diagnoses the wrong layer. The real defect is structural, and it is worse than the copy problem.

Two independent faults, both verified against the running app:

**1. Every page declares itself a duplicate of the homepage.**

`app/layout.tsx` sets `alternates.canonical: "https://www.conka.io"`. In the Next.js App Router, `alternates` is inherited by every child route that does not override it. Only `/start` and `/start-b` override it. Verified by curling the dev server:

```
/                <link rel="canonical" href="https://www.conka.io"/>
/conka-flow      <link rel="canonical" href="https://www.conka.io"/>
/conka-clarity   <link rel="canonical" href="https://www.conka.io"/>
/conka-both      <link rel="canonical" href="https://www.conka.io"/>
/ingredients     <link rel="canonical" href="https://www.conka.io"/>
/science         <link rel="canonical" href="https://www.conka.io"/>
```

This instructs Google to drop those URLs from the index and consolidate all ranking signal onto `/`. No amount of keyword work on those pages can rank while this is true.

**2. Five indexable pages share one title tag and one meta description.**

Homepage, `/conka-flow`, `/conka-clarity`, `/conka-both` and `/ingredients` have no `metadata` export. All five inherit the root default:

- title: `CONKA - Daily Nootropic Brain Shot`
- description: `Premium daily nootropic brain shot supplements`

Four of the five are `"use client"` components, which is why nobody added metadata: client components cannot export `metadata`.

## Who it serves

Organic search traffic and AI answer engines. This is an acquisition play, and it is currently the cheapest one available: the site is spending on paid traffic while its organic surface is switched off at the infrastructure level.

## Business impact

Phase 1 is a prerequisite for all organic acquisition. Phase 2 is what lets the five commercial pages compete for the transactional keywords Humphrey identified, of which the highest value are `best nootropics uk` (KD 21, vol 480) and `buy nootropics uk` (KD 32, vol 320), both mapping to `/conka-both`.

## Appetite

A few hours for Phases 1 and 2 combined. Phases 3 onwards are separate scopes.

## Design system

Not applicable. No visual or layout change in the active phases.

---

## Verified technical findings

Each of these was tested against the running dev server, not assumed.

| Claim | Verdict | Evidence |
|-------|---------|----------|
| `alternates.canonical` in root layout is inherited by all child routes | Confirmed | Six routes curled, all emit the homepage canonical |
| Setting root `alternates.canonical: "./"` resolves per route | Confirmed | `/conka-flow` emits `https://www.conka.io/conka-flow`, `/science` emits `https://www.conka.io/science` |
| A server `layout.tsx` can supply metadata for a `"use client"` `page.tsx` | Confirmed | Probe route with client page plus server layout emitted the layout's title and description |
| Routes overriding canonical (`/start`, `/start-b`) are unaffected by the root fix | Confirmed | Deeper metadata wins |
| `/go/[slug]` remains `noindex, nofollow` after the fix | Confirmed | Emits `<meta name="robots" content="noindex, nofollow">` |

**Consequence:** the canonical fix is a one-line change in the root layout, and it repairs the whole site, including `/science`, `/our-story`, `/why-conka`, `/app` and `/case-studies`, which are outside the keyword doc's scope entirely. No per-page canonical entries are needed.

**Consequence:** no `page.tsx` splits are needed. Each client page gets a sibling `layout.tsx` that exports metadata and returns `children`.

---

## Corrections to the source document

These are errors in `CONKA_SEO_Keyword_Map_v4.md` that must not be shipped as-is.

### Prices in the meta descriptions are wrong (RESOLVED)

The product pages read `FUNNEL_PRICING` in `app/lib/funnelData.ts` via `getCadencePricingByFormula`. That matrix is the source of truth, not `landingPricing.ts` (which only holds the monthly-sub figures used by `/start`).

| Product | monthly-sub | one-time | quarterly-sub |
|---------|-------------|----------|---------------|
| Flow | £39.99, £2.00/shot | £69.98, £3.50/shot | £109.99, **£1.83/shot** |
| Clear | £39.99, £2.00/shot | £69.98, £3.50/shot | £109.99, **£1.83/shot** |
| Both | £74.99, £1.87/shot | £99.98, £2.50/shot | £149.99, **£1.25/shot** |

Findings:

- **`£59.99` is Flow's one-time product price** (`OTP_PRICE.flow = 59.99`), misattributed in the doc to Both's monthly. Both's monthly subscription is £74.99.
- **`£2.14` does not exist anywhere in the codebase.** Flow and Clear are priced identically (£39.99 / £2.00 / £1.83), so differentiating them at £2.14 vs £2.00 is wrong on its face.
- **Clear's `£2.00` is not its minimum either.** It is the monthly-sub per-shot. The genuine minimum is £1.83/shot on quarterly.

**Convention, set by the doc's own homepage line.** "From £1.25/shot" on the homepage is Both quarterly, the cheapest per-shot on the site. So "From" already means *cheapest available cadence*, not *monthly default*. Applied consistently: Flow and Clear are "From £1.83/shot", Both is "From £1.25/shot".

Both's meta is switched from a `/month` anchor to `/shot`. A "From £X/month" claim for Both would have to be either £74.99 (not compelling) or the quarterly's £50.00 effective monthly (misleading, since it bills £149.99 up front). Per-shot is accurate at both cadences and matches the homepage.

### The `/go/*` landing page keyword work is cut

The doc analyses keyword coverage across `/go/productivity-listicle`, `/go/brain-ageing-listicle` and `/go/adhd-listicle`, then notes each is `noindex`. A `noindex` page cannot rank and will not be surfaced as an AI citation. The doc's stated justification ("noindex, AI citation focus") does not hold. Cut from this programme. Revisit only if there is a separate decision to de-noindex the landers, which would conflict with the ad landing page strategy and introduce thin-content risk.

### "Brain shot" has no measured volume

The doc scores `brain shot` as `KD: -, Vol: -` and counts it toward the headline "50 keywords now in copy" while it appears on nearly every page. Owning the category term is a legitimate brand bet, but it inflates the coverage number. Treat the real figure as lower.

### The doc asks for FAQ schema and never mentions Product schema

Google restricted `FAQPage` rich results to authoritative government and health sites in August 2023, so FAQ markup will not produce rich snippets for CONKA. It still helps LLMs parse the page, so it retains AEO value. But the site has zero JSON-LD of any kind, and for an e-commerce site `Product` schema (price, availability, aggregateRating) is the higher-value markup and the one that feeds shopping surfaces. `.claude/rules/pages.md` already mandates it: "Product pages include JSON-LD structured data." Both belong in Phase 3, with `Product` ranked first.

### Em dashes

The doc's H1s and meta descriptions use em dashes. House copy rule forbids them. Replace with commas or colons when transcribing.

---

## Additional defect found during scoping

`app/lib/productHeroHelpers.ts:15` renders the Flow product page H1 with a stylised zero:

```ts
name: formulaId === "01" ? "CONKA FL0W" : formula.name,
```

The H1 on `/conka-flow` therefore reads `CONKA FL0W`. Search engines index the literal string, so the strongest on-page signal on the Flow product page does not contain the word "Flow". One-character fix, no layout risk.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Fix the site-wide inherited canonical | Built, in review (SCRUM-1131) |
| 2 | Per-page metadata on the five indexable money pages, plus the FL0W H1 fix | Unblocked, not started (SCRUM-1132) |
| 3 | Structured data: `Product` JSON-LD, then `FAQPage` JSON-LD | Future |
| 4 | Descriptive keyword H1s on the product pages | Future |
| 5 | `sitemap.ts` and `robots.ts` (neither exists today) | Future |
| 6 | Informational content surface (blog) for the research-intent keywords | Future |

Phase 1 and Phase 2 ship as **separate commits**. Phase 1 changes what Google indexes across the entire site and must be independently revertible.

---

## Active phase task breakdown

### Phase 1: Fix the inherited canonical (DONE, in review)

1. **[Frontend] Make the root canonical self-referencing** (done)
   - What: in `app/layout.tsx`, change `alternates.canonical` from the absolute `"https://www.conka.io"` to the relative `"./"`. Next resolves this against `metadataBase` and the current route.
   - Dependencies: none
   - Complexity: Small
   - Files: `app/layout.tsx`
   - Verify: curl `/`, `/conka-flow`, `/ingredients`, `/science`, `/start`, `/go/productivity-listicle` and confirm each emits its own canonical, that `/start` still canonicals to `/start`, and that `/go/*` is still `noindex, nofollow`.

2. **[Frontend] Remove the duplicate metadata export on `/science`** (done)
   - What: `app/science/page.tsx` and `app/science/layout.tsx` both exported `metadata`. The page won and the layout was dead code. Deleted `app/science/layout.tsx` outright (it did nothing but return `children`). Confirmed `science` was the only route with this duplication.
   - Files: `app/science/layout.tsx` (deleted)

### Phase 2: Per-page metadata plus the FL0W fix

Prices resolved against `funnelData.ts`. No longer blocked on Humphrey. Still blocked on SCRUM-1131.

3. **[Frontend] Homepage metadata**
   - What: `app/page.tsx` is already a server component. Add `export const metadata` in place, with title, description and OpenGraph.
   - Complexity: Small
   - Files: `app/page.tsx`

4. **[Frontend] Metadata for the four client pages**
   - What: add a sibling `layout.tsx` per route that exports `metadata` and returns `children`. Do not split `page.tsx`.
   - Complexity: Small
   - Files: `app/conka-flow/layout.tsx`, `app/conka-clarity/layout.tsx`, `app/conka-both/layout.tsx`, `app/ingredients/layout.tsx` (all new)

5. **[Frontend] Fix the FL0W H1**
   - What: remove the `"CONKA FL0W"` override so the Flow hero H1 renders `CONKA Flow`.
   - Complexity: Small
   - Files: `app/lib/productHeroHelpers.ts`
   - Risk: this is a visible brand stylisation. Confirm with the user or marketing that losing the zero is acceptable, or preserve it visually via CSS while keeping the text content indexable.

### Copy to apply (Phase 2)

Final. Transcribed from the source doc with em dashes removed, prices corrected against `funnelData.ts`, and each description trimmed to 160 characters or fewer (Google truncates around 155 to 160). Character counts verified.

**Title tags**

| Route | Title tag |
|-------|-----------|
| `/` | `Best Brain Supplement UK \| CONKA Daily Brain Shot` |
| `/conka-flow` | `CONKA Flow \| Daily Morning Brain Shot for Focus and Calm` |
| `/conka-clarity` | `CONKA Clear \| Afternoon Brain Shot for Focus Under Pressure` |
| `/conka-both` | `Buy CONKA Brain Shot \| Best Nootropic Supplement UK` |
| `/ingredients` | `CONKA Ingredients \| Ashwagandha, Alpha GPC, Ginkgo Biloba & More` |

**Meta descriptions**

| Route | Chars | Meta description |
|-------|-------|------------------|
| `/` | 145 | CONKA is the UK's leading daily brain shot, Informed Sport certified, backed by Cambridge, Durham and Exeter. 100-day guarantee. From £1.25/shot. |
| `/conka-flow` | 160 | CONKA Flow is a 30ml morning brain shot with 6 clinically-dosed adaptogens. Zero caffeine, Informed Sport certified. Sharper focus, no jitters. From £1.83/shot. |
| `/conka-clarity` | 157 | CONKA Clear is a 30ml afternoon brain shot with Alpha GPC and Ginkgo Biloba. Cuts brain fog and sharpens thinking. Informed Sport certified. From £1.83/shot. |
| `/conka-both` | 155 | Buy CONKA Flow + Clear, the UK's most clinically validated brain shot. Informed Sport certified. 16 active ingredients. 100-day guarantee. From £1.25/shot. |
| `/ingredients` | 158 | Every ingredient in CONKA Flow and Clear is clinically dosed and peer-reviewed: Ashwagandha, Rhodiola, Alpha GPC, Ginkgo Biloba, Lemon Balm. Why each is used. |

Trims made to fit, and what was protected:

- `/conka-flow`: dropped "daily". Kept `brain shot`, `focus`, `adaptogens`, `Informed Sport certified`.
- `/conka-clarity`: dropped "under pressure", which the source doc itself concedes is "not a searchable phrase". Kept `brain shot`, `brain fog`, `Alpha GPC`, `Ginkgo Biloba`, which carry this page's four keywords.
- `/conka-both`: dropped "money-back". Kept the transactional `Buy` framing and `16 active ingredients`.
- `/ingredients`: tightened the closing clause. All five ingredient names kept, since each is a standalone search term and `ginkgo biloba benefits` is the highest-volume term in the dataset.

All five also need `openGraph` (title, description, image), per `.claude/rules/pages.md`.

---

## Rabbit holes

- **Rewriting the H1s.** The product page H1 is `{content.name}` inside the shared `ProductBuyPanel.tsx:571`, used by all three PDPs. It renders a product name, not a sentence. Dropping the doc's descriptive H1 into it would break the buy panel layout on three pages simultaneously and would change a string used elsewhere as the product name. Deferred to Phase 4, where it needs a `seoHeading` prop and a visual review at 390px.
- **The ingredients page restructure.** The doc's highest-volume keyword (`ginkgo biloba benefits`, vol 5,400) requires per-ingredient H2 sections. That is a page rebuild, not a metadata change, and the keyword is informational intent that is unlikely to convert. Low priority despite high volume.
- **De-noindexing the `/go/*` landers** to make their keyword work count. Introduces thin and duplicate content risk. Separate decision.

## No-gos

- No `page.tsx` to server-component splits. The sibling `layout.tsx` pattern is verified and sufficient.
- No per-page canonical entries. The root relative canonical covers every route.
- No `/go/*` work in this programme.
- No H1 sentence rewrites in Phase 2.
- No structured data in Phase 2.

## Risks

- **Phase 1 has site-wide blast radius.** It changes what Google indexes across every route. It is the correct change, but it ships alone so it can be reverted alone. Expect index coverage in Search Console to move over the following weeks, and expect impressions on `/` to fall as signal redistributes to the individual pages. That is the intended outcome, not a regression.
- **Prices drift.** The meta descriptions hard-code prices that live in `funnelData.ts`. There is no mechanism keeping them in sync. If `FUNNEL_PRICING` changes, these five strings silently go stale in Google's index. Consider deriving them from `funnelData.ts` at build time in a later phase, or at minimum add a note in `funnelData.ts` pointing at the metadata.
- **The FL0W fix is a brand change.** Cosmetic, but visible. Needs a nod.
- **No `sitemap.ts` or `robots.ts` exists.** Discovery after Phase 1 will rely on internal linking alone until Phase 5.

## Open questions

1. Is losing the stylised `FL0W` zero acceptable to marketing, or should it be preserved via CSS with indexable text underneath?
2. Confirm the "From" convention is intended to mean the cheapest cadence (quarterly), which is what the doc's own homepage line implies. If marketing wants "From" to mean the monthly subscription instead, Flow and Clear become £2.00/shot and the homepage becomes £1.87/shot.

## References

- Source keyword research: `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- Page rules incl. mandatory SEO and JSON-LD: `.claude/rules/pages.md`
- Root metadata: `app/layout.tsx`
- Existing per-route metadata precedent: `app/science/page.tsx`, `app/go/[slug]/page.tsx`
- Shared product H1: `app/components/product/ProductBuyPanel.tsx`
- Pricing source of truth: `app/lib/landingPricing.ts`, `app/lib/funnelData.ts`

## Jira tickets

Sprint 28. Phases 3 to 6 are deliberately not ticketed.

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| [SCRUM-1131](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1131) | [Bugs] Every page canonicals to the homepage, blocking the whole site from ranking | 1 | Built, in review |
| [SCRUM-1132](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1132) | [Website & CRO] Add per-page SEO metadata to the five indexable money pages | 2 | To Do |

SCRUM-1131 blocks SCRUM-1132. The disputed prices are now resolved (see "Prices in the meta descriptions" above), so SCRUM-1132 is unblocked once SCRUM-1131 merges. Two soft open questions remain for marketing (the `FL0W` zero and the "From" convention); neither blocks the build.

## Branching model

`SEO-AND-AEO-WORK` is the integration branch and holds the plan docs. Each ticket is built on a sub-branch off it (`scrum-1131-canonical-fix`, `scrum-1132-...`), pushed, and merged back via PR into `SEO-AND-AEO-WORK`, not into `main`.
