# SEO / AEO Foundation (build archive)

> **This is the planning and build archive.** For the concise canonical reference of what is live and why, see `docs/seo-aeo/README.md`. This doc keeps the full history: the keyword-map corrections, verified findings, and per-phase task breakdowns.

**Status:** Phases 1 to 5, 7 and 8 all built (SCRUM-1131, 1132, 1133, 1136, 1138, 1140, 1141). The **SEO** foundation is complete, and after the 2026-07-14 AEO audit the **AEO** foundation now is too: the site has entity identity, structured data on every commercial and FAQ surface, an honest sitemap, and an `llms.txt`. **Phase 9** (AEO content shape) is the only remaining phase in this doc, and it is editorial rather than engineering work: it needs a content owner, not a developer. Phase 6 (blog) is scoped in its own plan doc, `blog-informational-content-surface.md`.
**Owner:** Rudh
**Source inputs:** `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md` (Humphrey, keyword research); AEO best-practice review (Ahrefs AEO course intro + a structured-data-for-AEO talk, summarised 2026-07-14)
**Created:** 2026-07-10
**Updated:** 2026-07-14

## Progress log

- **2026-07-10** Phase 1 (SCRUM-1131) built, reviewed (`/review-code` LGTM), and merged to `main` via PR #336 (into `SEO-AND-AEO-WORK`) then PR #337 (into `main`). Root canonical is now the relative `"./"` form; dead `app/science/layout.tsx` deleted.
- **2026-07-10** Phase 2 (SCRUM-1132) built on branch `scrum-1132-metadata` off `main`. Added `export const metadata` to `app/page.tsx` (server component, in place) and sibling `layout.tsx` files for `/conka-flow`, `/conka-clarity`, `/conka-both`, `/ingredients` (all client pages). Removed the `CONKA FL0W` override in `productHeroHelpers.ts` so the Flow PDP H1 (and its bottle alt text) now read `CONKA Flow`. Verified against the dev server: all five pages emit their own title/description/OG image, every description is 160 chars or fewer, and the Clear and Both H1s are unchanged. See "Discrepancies found during build" below for two items needing a decision.
- **2026-07-13** Phase 3 (SCRUM-1133) built, Shopify-verified, reviewed (`/review-code` LGTM), and merged to `main`. Added `app/lib/jsonLd.tsx` (`buildProductSchema`, `buildFaqSchema`, `JsonLd`, `absoluteUrl`) and `getFunnelPriceRange` in `funnelData.ts`, wired `Product` + `FAQPage` JSON-LD into the three PDP server layouts. `Product` uses an `AggregateOffer` derived from `FUNNEL_PRICING`; no `aggregateRating` (no per-product source). Verified all 9 funnel variants against the live Storefront API: every price matches `FUNNEL_PRICING` and all are `availableForSale`, so the `InStock` claim and the low/high ranges are correct. Ticket Done.
- **2026-07-13** Captured a Google Search Console baseline (`docs/analytics/seo-search-console-baseline.md`) as the pre-change measuring stick. Key finding: organic traffic is ~99% brand, only 17 URLs got any impression in 3 months, and the product pages are effectively invisible. This diagnosed discovery as the bottleneck and is the reason Phase 5 (sitemap + robots) was pulled ahead of Phase 4.
- **2026-07-13** Phase 5 (SCRUM-1136) scoped and ticketed, pulled ahead of Phase 4. Reason: with canonicals fixed but no sitemap or robots, Google is discovering pages by internal links alone. A sitemap accelerates recrawl of the now-indexable pages. The proposed `/science` + `/why-conka` metadata add was cut on inspection: both already have `metadata` exports, so their low CTR is a copy/intent issue, not a missing-tag one.
- **2026-07-13** Phase 5 (SCRUM-1136) built and merged. `app/sitemap.ts` (static hand-maintained list via an `entry(path, priority, changeFrequency)` helper) and `app/robots.ts` (allows `/`, disallows `/api/`, `/account`, `/payment/`; deliberately does not block AI crawlers, for AEO). Ticket Done.
- **2026-07-13** Phase 4 (SCRUM-1138) built and merged. Descriptive keyword subline added inside the PDP `<h1>` via an optional `seoHeading` field on the hero content, plus a mobile hero reorder. `content.name` left untouched so bottle alt text is unaffected. Ticket Done.
- **2026-07-14** Status review. Phases 1 to 5 confirmed Done in code (sitemap.ts/robots.ts exist; `seoHeading` wired through `ProductBuyPanel.tsx` and `productHeroHelpers.ts`) and in Jira (all five tickets Done). The foundation is complete. Phase 6 (blog) is the only remaining work and now lives in its own plan doc, `blog-informational-content-surface.md` (content model settled as Notion-as-headless-CMS). The two open questions below were both resolved during the Phase 2 build.
- **2026-07-14** **AEO gap audit.** External AEO best practice (two source videos, see "AEO audit" below) was compared against the live codebase. Verdict: the SEO foundation holds up, but the AEO foundation is roughly a third built. We have the schema *machinery* (`app/lib/jsonLd.tsx`) and two schema types, but only on three routes, and the site has **no entity identity at all**: no `Organization`, no `WebSite`, no `sameAs`, and not even any social links in the footer to populate one. Also found: FAQ content on `/` and `/professionals` that reuses the same `FAQ_ITEMS` array the PDPs already serialise but emits no `FAQPage` schema; `/case-studies` sitting in the sitemap with no metadata; `/barrys` and `/win` indexable despite a sitemap comment claiming otherwise; and a `lastModified` field that lies. Opened as Phases 7, 8 and 9.
- **2026-07-14** **Phase 8 (SCRUM-1140) built.** Ticketed under the Website & CRO epic (SCRUM-763) and shipped as one commit. `FAQPage` JSON-LD now renders on `/` (from `FAQ_ITEMS`) and `/professionals` (from a newly exported `TEAM_FAQS` in `TeamFAQ.tsx`), reusing the existing `buildFaqSchema`. Sibling server layouts added for `/case-studies` and `/conkaapp-privacy-policy`. `/win` and `/barrys` deleted outright and 301'd to `/` (see the decision below). `lastModified` removed from `app/sitemap.ts`. `public/llms.txt` added. Verified against a running server: exactly one `FAQPage` node per page, both mirroring content that is genuinely server-rendered (schema describing invisible content breaches Google's policy, and `LabFAQ` is a `dynamic()` import, so this was checked rather than assumed).
- **2026-07-14** **Decision: `/win` and `/barrys` deleted, not noindexed.** Scoping found they were not ad landers at all: both were **contest pages whose deadlines expired in January 2026**, still live and indexable, so Google could serve a dead competition as a CONKA result. Noindex would have left two dead pages on the site. Deleting and redirecting removes them and passes any accumulated link signal to `/`. Their component folders had no external importers. Side effect: `/go` is now the only Convex consumer.
- **2026-07-14** **Phase 7 (SCRUM-1141) built.** The site now has an entity identity. `buildOrganizationSchema` and `buildWebSiteSchema` added to `app/lib/jsonLd.tsx` and rendered once in the root layout, so every route carries exactly one `Organization` and one `WebSite` node. The Organization has a stable `@id` that `WebSite.publisher` references, so there is one entity on the site rather than a copy per node. Company details (legal name, company number 13235415, incorporation date 2021-03-01, VAT `GB430507628`, registered office, founders) were verified against Companies House and live in `COMPANY` in `app/lib/site.ts`, alongside `SOCIAL_PROFILES`. A social row was added to the main footer, which previously had zero external links. `app/manifest.ts` added, reusing the existing 512x512 `app/icon.png`.
- **2026-07-14** **`sameAs` is six entries, four of them in the footer.** LinkedIn, Instagram, TikTok and Trustpilot render as footer links; Facebook and Companies House are schema-only. All six are true identity claims, but a registry page and the least-posted channel are not somewhere to send a paying customer. The split is a single `inFooter` flag in `SOCIAL_PROFILES`. Verified: five of six URLs return 200; Trustpilot returns 403 to automated requests (Cloudflare bot-blocking, confirmed live by the product owner). Note the Trustpilot profile is registered against the older `conka.uk` domain, not `conka.io`; this was explicitly confirmed as the same entity.
- **2026-07-14** **Decisions on what NOT to assert.** No `aggregateRating` on the Organization: no queryable per-entity source, and a sitewide figure risks a Google manual action. The Trustpilot `sameAs` link gives answer engines a path to the reviews without us asserting a number we cannot back. No `telephone`: there is no public support line, and omitting the field beats inventing one. No `SearchAction`: the site has no search page for it to point at. No TikTok/YouTube/X/Amazon claims beyond what was supplied, because every `sameAs` entry is a verifiable claim and an unverifiable one costs trust rather than building it.
- **2026-07-14** **Footer social links are text, not icons.** Deliberate: the mono footer treatment suits text, and readable anchor text is a stronger corroboration signal for `sameAs` than an unlabelled icon. Icons were considered and deferred rather than shipped unverified (the browser tooling was not connected, so a mangled brand glyph could not have been caught).
- **2026-07-14** **Follow-up: `Product.brand` is not linked to the Organization.** `buildProductSchema` emits a standalone `brand: { "@type": "Brand", name: "CONKA" }`, so strictly the graph contains two "CONKA" concepts. Pointing `brand` at the Organization's `@id` would unify them and is the more correct entity graph. Deliberately left alone in SCRUM-1141: the PDP `Product` node validates cleanly today, and swapping a working `Brand` object for an `@id` reference risks a validator warning on our highest-value schema. Worth doing as its own small change, validated in the Rich Results Test.
- **2026-07-14** **Sitemap `lastModified` restored, derived from git.** Phase 8 removed the field because it was fabricated (build time on every URL). Rather than leave the signal off, or reintroduce it as a manual chore, `app/sitemap.ts` now derives each date from `git log -1` over the route's own source paths. It is true by construction, needs no discipline, and cannot rot. A skill or checklist was explicitly rejected for this: a process that depends on remembering to bump a date is how the fake dates appeared in the first place. Requires `VERCEL_DEEP_CLONE=1` in the Vercel env (Vercel shallow-clones to depth 10; the env var is documented for exactly this use case). Verified locally: dates differ per page and match real history (`/privacy` April, `/why-conka` June, the PDPs today), and `/sitemap.xml` still prerenders as static.
- **2026-07-14** **Known follow-up: `convex/winEntries.ts` is now dead code.** The Phase 8 deletion removed its only callers. Deliberately left in place: the `winEntries` table (`convex/schema.ts:114`) holds real entrant email addresses from the January contests, and dropping it would destroy data. The functions are unreachable but harmless. Fold into a Convex cleanup pass; do not delete the table without an explicit decision on the data.

## Discrepancies found during build (both resolved)

1. **Three more `FL0W` literals in body copy — RESOLVED.** `app/components/product/HeroAccordions.tsx` (lines 19, 20, 27) used the stylised `FL0W` in accordion prose. Per the product owner (2026-07-10), the stylised zero was retired: these now read `FLOW` (all caps, consistent with the sibling `CLEAR` in the same copy). No stylised `FL0W` remains in rendered output.
2. **OG images are the shared site image — ACCEPTED as-is.** All five pages reference `/opengraph-image.png` (the existing sitewide brand image) rather than bespoke per-page share images. Correct 1200x630 ratio guaranteed. Product owner confirmed per-page product OG images are nice-to-have, not needed now.

## Post-review fix

A `/review-code` pass found that Twitter cards on all five pages still inherited the generic root title/description (Next merges metadata shallowly, and `twitter` is a separate top-level field from `openGraph`). Added a per-page `twitter` block (card, title, description, image) to each of the five so X/Twitter shares carry the page-specific copy. Verified live.

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
| 1 | Fix the site-wide inherited canonical | Merged to main (SCRUM-1131) |
| 2 | Per-page metadata on the five indexable money pages, plus the FL0W H1 fix | Merged to main (SCRUM-1132) |
| 3 | Structured data: `Product` JSON-LD, then `FAQPage` JSON-LD | Merged to main (SCRUM-1133) |
| 5 | `sitemap.ts` and `robots.ts` | Merged to main (SCRUM-1136) |
| 4 | Descriptive keyword H1s on the product pages (name + visible subline in the `<h1>`) | Merged to main (SCRUM-1138) |
| 6 | Informational content surface (blog) for the research-intent keywords | Scoped (own plan doc: `blog-informational-content-surface.md`), not ticketed |
| 7 | Entity identity: `Organization` + `WebSite` schema, `sameAs`, footer social links, web manifest | **Built (SCRUM-1141)** |
| 8 | Schema coverage and indexation hygiene: FAQ schema on `/` and `/professionals`, missing metadata, `/barrys` and `/win` deleted + 301'd, honest `lastModified`, `llms.txt` | **Built (SCRUM-1140)** |
| 9 | AEO content shape: answer-first (BLUF) openings, self-contained passages, freshness dates on the existing content pages | Scoped below, not ticketed. Depends on nothing, but overlaps Phase 6 |

Phases ship as **separate commits**. Phase 1 changes what Google indexes across the entire site and must be independently revertible. Phase 5 was pulled ahead of Phase 4 after the Search Console baseline showed discovery, not on-page keyword tuning, is the current bottleneck.

**Why 7, 8 and 9 are separate branches of work, not one phase.** They differ in blocker, blast radius and skill. Phase 7 is blocked on information only Rudh or marketing can supply (the real profile URLs) and touches the root layout, so it is sitewide. Phase 8 is pure code hygiene, unblocked, and shippable this week. Phase 9 is a copy-and-content-structure job on live marketing pages that needs a human editorial pass, not an engineering one. Bundling them would let the blocked one hold the cheap one hostage.

---

## Phase 3 task breakdown (SCRUM-1133, active)

Add `Product` JSON-LD (first) and `FAQPage` JSON-LD to the three PDPs: `/conka-flow`, `/conka-clarity`, `/conka-both`. No visual or layout change. Appetite: roughly half a day. All source data already exists, none is hand-authored.

**Injection model.** The three `page.tsx` are `"use client"`; their sibling `layout.tsx` files (created in Phase 2) are server components. Render the `<script type="application/ld+json">` tags in the layouts alongside `children`.

1. **[Frontend] `jsonLd` render helper** (`app/lib/jsonLd.ts`, new)
   - Takes a schema object, returns `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />`. Absolutises image/URL paths against `metadataBase` (`https://www.conka.io`, `app/layout.tsx:78`); product images are root-relative (`/formulas/...`).
   - Complexity: Small.

2. **[Frontend] Product JSON-LD on the three PDPs**
   - Per page: `name` (Flow "CONKA Flow", Clear "CONKA Clear", Both "CONKA Flow + Clear"), `brand: "CONKA"`, `description` from `FUNNEL_PRODUCTS[product].description`, absolute `image` from `FUNNEL_HERO_IMAGES`, and an `offers` `AggregateOffer` with `lowPrice`/`highPrice` derived from `FUNNEL_PRICING` (Flow/Clear £39.99-£109.99, Both £74.99-£149.99), `priceCurrency: "GBP"`, `availability: InStock`. No `aggregateRating`.
   - Complexity: Medium (three pages, one pattern). Depends on task 1.
   - Files: `app/conka-flow/layout.tsx`, `app/conka-clarity/layout.tsx`, `app/conka-both/layout.tsx`; reads `app/lib/funnelData.ts`.

3. **[Frontend] FAQPage JSON-LD on the three PDPs**
   - Serialise existing Q&A arrays: Flow `formulaContent["01"].faq`, Clear `formulaContent["02"].faq`, Both `FAQ_ITEMS` in `app/lib/faqContent.ts`. Strip HTML in answers to plain text.
   - Complexity: Small. Depends on task 1.
   - Files: same three layouts; reads `app/lib/formulaContent.ts`, `app/lib/faqContent.ts`.

4. **[Verify] Validate**
   - Build, then paste each page's rendered JSON into the Google Rich Results Test and the Schema.org validator; confirm no errors, one Product + one FAQPage node per page, and prices match `funnelData.ts`.
   - Complexity: Small.

**Decisions (confirmed with product owner):** omit `aggregateRating` (no per-product rating source; sitewide 4.7/622 is not per-product and risks a manual action); `offers` uses real transactable prices, not the per-shot marketing figure; Both's schema `name` is "CONKA Flow + Clear".

**No-gos:** no Product schema on the homepage or `/ingredients` (neither is a single purchasable product); no `/go/*` structured data (noindex); no new component or visual change beyond the helper; no per-product review markup until a queryable rating source exists.

**Known limitations:** FAQPage rich results are restricted to gov/health sites (2023), so expect AEO/LLM value not visible snippets; Product rich results are unaffected. Price drift is mitigated by deriving from `funnelData.ts` rather than hardcoding.

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

## AEO audit (2026-07-14)

### The external input

Two source videos on Answer Engine Optimisation, distilled to five claims:

1. **Brand mentions off-site are the strongest lever.** LLMs recommend brands they see discussed on third-party sites, forums and Reddit.
2. **Structured data is "subtitles for LLMs".** JSON-LD removes the guesswork from parsing, and is far cheaper in tokens for a crawler to digest than raw HTML. `Organization` + `sameAs` is called out specifically as the way to bind a brand to a verified entity.
3. **BLUF (bottom line up front).** LLMs weight the start of a text block heavily. Put the direct answer in the first sentence under a heading.
4. **Atomic passages.** LLMs chunk content. Any H2 or H3 section must stand alone, naming its entities, without depending on context three paragraphs up.
5. **Freshness beats length.** Updated content correlates strongly with AI citation.

Plus one strategic idea worth recording: **pivot some keyword targeting to tools** (calculators, checkers, planners). An LLM answers an informational query in-chat and takes the click, but it cannot run your tool for the user.

### What we actually have, checked against the code

| AEO practice | State | Evidence |
|---|---|---|
| Structured-data machinery | **Built** | `app/lib/jsonLd.tsx`: `buildProductSchema`, `buildFaqSchema`, `JsonLd`, `absoluteUrl` |
| `Product` schema | **Built** | The three PDP layouts only |
| `FAQPage` schema | **Partly built** | The three PDP layouts only. `/` and `/professionals` render FAQ content with no schema |
| `Organization` + `sameAs` | **Missing** | No `Organization` node anywhere in the repo. No `sameAs`. **Biggest gap.** |
| `WebSite` schema | **Missing** | No sitewide node |
| `BreadcrumbList` | **Missing** | Nowhere |
| AI crawlers allowed | **Built** | `app/robots.ts` deliberately blocks none. Ahead of most sites |
| `llms.txt` | **Missing** | No `public/llms.txt`, no `.well-known/` |
| Freshness signals | **Missing, and actively wrong** | No `datePublished` / `dateModified` in any schema. `app/sitemap.ts:15` stamps **every** URL with the build time, so a CSS tweak claims all 16 pages changed |
| BLUF openings | **Missing** | Content pages are marketing arcs, not answer-first |
| Atomic passages | **Missing** | `/science` and `/ingredients` have real H2/H3 hierarchy to build on; `/why-conka` is thin (one H2, no H3s) |
| Off-site brand mentions | **Not a code problem** | No site change can deliver this. Named here so it is not mistaken for done |

**Headline verdict (as at the audit, since closed):** the SEO foundation (Phases 1 to 5) is sound. The AEO foundation is about a third built. We have the schema machinery but only two schema types on three routes, and **no entity identity at all**: an LLM has nothing on the site that tells it what CONKA *is* or which external profiles are the same company.

> **Now resolved.** Phase 8 (SCRUM-1140) closed the schema-coverage and hygiene gaps, and Phase 7 (SCRUM-1141) built the entity identity. Everything in the table above is addressed except the content-shape rows (BLUF, atomic passages, visible freshness), which are Phase 9, and off-site brand mentions, which no code change can deliver.

### Additional defects found during the audit

- **`/case-studies` has no metadata.** It is a `"use client"` page with no sibling server layout, so it inherits the generic root title and description, while sitting in the sitemap at priority 0.6. Same for `/conkaapp-privacy-policy`. Both were simply out of scope in Phase 2.
- **`/barrys` and `/win` are indexable.** The comment at `app/sitemap.ts:8` describes them as "noindex ad/funnel landers", but neither page sets a robots meta tag, so both inherit the root's `index: true, follow: true` (`app/layout.tsx:103`). Excluding them from the sitemap does not stop Google indexing them via a link. The comment asserts something the code does not do.
- **Free FAQ schema is being left on the table.** `app/page.tsx:210` renders `LabFAQ` from the same `FAQ_ITEMS` array that `/conka-both` already serialises into JSON-LD. The builder exists and is simply not called on the site's highest-authority page. `/professionals` has its own `TeamFAQ` in the same position.
- **No web manifest** (`manifest.json` / `site.webmanifest`), a minor brand-identity signal alongside the missing `Organization` schema.

---

## Phase 7 task breakdown (entity identity, BUILT: SCRUM-1141)

**Thesis.** Structured data tells an answer engine what a page *is*. `Organization` + `sameAs` tells it who *we* are, and binds "CONKA" to a verified entity rather than a string it has to disambiguate. This was the highest-leverage AEO work available and none of it existed.

**Shipped 2026-07-14.** The blocker was never engineering: it was the profile-URL list, supplied by the product owner. What made the final schema unusually strong is that it carries the Companies House number, VAT ID, registered address and incorporation date, so an answer engine can corroborate the identity claim against public record rather than taking the site's word for it. See the progress log for the `sameAs` list, the footer/schema split, and the decisions on what was deliberately not asserted.

1. **[Content] Collect the `sameAs` profile list**
   - Rudh or marketing supplies the live URLs. This was the gate on the whole phase.
   - Complexity: Small, but it was the critical path.

2. **[Frontend] `buildOrganizationSchema` + `buildWebSiteSchema`**
   - Add to `app/lib/jsonLd.tsx` alongside the existing builders. `Organization`: `name`, `url`, `logo`, `description`, `sameAs[]`, and `contactPoint` if a support address is public. `WebSite`: `name`, `alternateName`, `url`, `publisher` pointing at the Organization.
   - Render both once, in `app/layout.tsx`, so every route inherits them. Use an `@id` on the Organization so other schema nodes can reference it rather than duplicating the brand.
   - Complexity: Small. Depends on task 1.
   - Files: `app/lib/jsonLd.tsx`, `app/layout.tsx`.

3. **[Frontend] Social links in the main footer**
   - `app/components/footer/Footer.tsx` has **zero external links**. The only Instagram link on the site is in the `/lander` footer (`app/lander/sections/Footer/Footer.tsx:80`) and its trial-b clone, both noindex. So today we have neither the schema nor the raw link signals it is meant to corroborate. Add the same profile set as visible footer links.
   - Complexity: Small. Shares its input with task 1.
   - Files: `app/components/footer/Footer.tsx`.

4. **[Frontend] Web manifest**
   - Add `app/manifest.ts` (Next's typed route) with name, short name, icons, theme colour.
   - Complexity: Small.

5. **[Verify]**
   - Rich Results Test and the Schema.org validator on `/` and one PDP: exactly one `Organization` and one `WebSite` node sitewide, the PDP `Product` still validates, no duplicate brand nodes.

**No-gos:** no `aggregateRating` on the Organization (same reason it was refused on `Product`: no queryable per-entity source); no `sameAs` entry for a profile we do not actually control or that is dormant; no `SearchAction` / sitelinks searchbox, because the site has no search page for it to point at.

---

## Phase 8 task breakdown (schema coverage and indexation hygiene, BUILT: SCRUM-1140)

**Thesis.** A set of small, independent, unblocked fixes that each close a gap the audit found. None needs a decision from anyone. This is the phase to ship first, because Phase 7 is blocked and Phase 9 needs an editorial pass.

**Shipped 2026-07-14.** One deviation from the plan: task 3 changed from "noindex" to "delete and redirect" once scoping revealed the two pages were expired contests, not ad landers. Task 6 (`BreadcrumbList`) was deferred as planned. `convex/winEntries.ts` is now dead code and was deliberately left alone (see the progress log).

1. **[SEO] `FAQPage` schema on `/` and `/professionals`**
   - The builder already exists and the content already renders. Call `buildFaqSchema` with the same `FAQ_ITEMS` on the homepage, and with the `TeamFAQ` source on `/professionals`. `app/page.tsx` is a server component so the schema goes in place; `/professionals` already has a `metadata` export to sit alongside.
   - Note the known limitation: FAQ rich results are restricted to gov/health sites, so the payoff here is AEO parsing, not a visible snippet. That is exactly the point.
   - Complexity: Small.
   - Files: `app/page.tsx`, `app/professionals/page.tsx` (or a sibling layout), `app/lib/faqContent.ts`.

2. **[SEO] Metadata for `/case-studies` and `/conkaapp-privacy-policy`**
   - Sibling server `layout.tsx` per route, the pattern established in Phase 2. Both are in the sitemap and both currently inherit the generic root title and description.
   - Complexity: Small.
   - Files: `app/case-studies/layout.tsx` (new), `app/conkaapp-privacy-policy/layout.tsx` (new).

3. **[SEO] Delete `/barrys` and `/win`, and 301 both** (was: "noindex them")
   - They turned out to be expired contest pages, not ad landers, so deleting beat noindexing. Pages and both component folders deleted, permanent redirects to `/` added in `next.config.ts`, and the false comment in `app/sitemap.ts:8` corrected. Convex data and API routes left intact.
   - Files: `next.config.ts`, `app/sitemap.ts`, `app/layout.tsx` (two stale comments naming the deleted routes); deleted `app/barrys/`, `app/win/`, `app/components/barrys/`, `app/components/win/`.

4. **[SEO] Stop lying in `lastModified`** (shipped in two steps)
   - `app/sitemap.ts` set `lastModified = new Date()` for all 16 URLs, so every deploy told Google the whole site changed. First it was dropped outright (better no signal than a false one). Then, on the same day, it was **restored properly**: each route now declares the source paths it renders, and the date comes from `git log -1` over them. Automatic, true by construction, no maintenance.
   - Complexity: Small.
   - Files: `app/sitemap.ts`. Needs `VERCEL_DEEP_CLONE=1` in the Vercel env.

5. **[AEO] `llms.txt`**
   - Not in either source video and not a settled standard, but the cheapest possible AEO artifact: a plain-text map of what CONKA is and which URLs matter, for AI crawlers. Serve it from `public/llms.txt` (static) or `app/llms.txt/route.ts` if it should derive from the sitemap.
   - Complexity: Small. Speculative value, near-zero cost.

6. **[Frontend] `BreadcrumbList` schema** *(optional, lowest priority in this phase)*
   - The site is shallow (almost everything is one level from root), so breadcrumbs add little today. Worth adding when the blog lands and `/blog/<slug>` creates a real hierarchy. Listed here so it is a deliberate deferral, not an oversight.

---

## Phase 9 task breakdown (AEO content shape, not ticketed)

**Thesis.** Phases 7 and 8 are engineering. This one is editorial. BLUF, atomic passages and freshness are properties of the *prose*, and no schema can fake them.

**Important overlap:** the Phase 6 blog plan (`blog-informational-content-surface.md`) already bakes all three into its content contract: an answer-first opening paragraph, an enforced H2/H3 hierarchy, and `datePublished` / `dateModified` frontmatter feeding `BlogPosting` schema. So for *new* content this is solved on paper. Phase 9 is the **retrofit** of the same three principles onto the content pages that already exist.

1. **[Copy] Answer-first openings on the content pages**
   - `/science`, `/ingredients`, `/why-conka`, `/our-story`. For each major section, lead with the direct claim, then support it. Today these pages are marketing arcs that build to a point; answer engines extract the top of a block and will take the build-up instead of the payoff.
   - Complexity: Medium. Needs a human editorial pass and a `/review-claims` gate, since tightening a health claim into a first sentence is exactly where compliance risk concentrates.

2. **[Copy] Make passages self-contained**
   - Each H2/H3 section should name its entities ("CONKA Flow", "Alpha GPC") rather than relying on "it" or "this formula" carried from an earlier paragraph. `/science` and `/ingredients` already have a real heading hierarchy to work with. `/why-conka` is the weakest page structurally: one H2, no H3s, so it chunks badly.
   - Complexity: Medium.

3. **[Frontend] Freshness signals**
   - Give the content pages a visible and machine-readable last-reviewed date (a `<time datetime>` element plus `dateModified` in schema). This only works if the dates are **true**, which means a review cadence someone actually owns. A fabricated freshness date is the same defect as the sitemap `lastModified` above, and worth less than nothing.
   - Complexity: Small in code, but it creates an ongoing content obligation. Do not ship it without an owner.

---

## Out of scope for this programme (recorded so they are not forgotten)

- **Off-site brand mentions.** The source videos rate this the single strongest AEO lever, and no change to this repo can deliver any of it. It is a PR, digital-citation and community (Reddit, Quora) workstream that does not currently exist. Naming it here so the site work is not mistaken for a complete AEO strategy.
- **The "tool" keyword pivot.** The argument: LLMs now satisfy informational queries in-chat and keep the click, but cannot run a calculator, checker or planner for the user. A "which formula" selector or a stack checker would be a durable, non-cannibalisable traffic asset. Genuinely new strategic input, not in any existing plan doc, and deliberately not scoped here. Raise separately if it earns priority.

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

**From the Phase 2 build (both resolved)**

1. **Losing the stylised `FL0W` zero — RESOLVED.** The stylised zero was retired. The Flow PDP H1, bottle alt text, and the three body-copy literals now read `Flow` / `FLOW`. Shipped in Phase 2.
2. **The "From" convention — RESOLVED.** Confirmed to mean the cheapest available cadence (quarterly), consistent with the homepage line. Shipped: Flow and Clear "From £1.83/shot", homepage and Both "From £1.25/shot".

**From the AEO audit (open)**

3. **Which profile URLs go in `sameAs`? — RESOLVED.** Supplied by the product owner 2026-07-14: LinkedIn, Instagram, TikTok, Trustpilot, Facebook, Companies House. No Amazon storefront, no active YouTube, no X. Shipped in Phase 7. Still open, and cheap to change: whether `sales@conka.io` should be exposed alongside `info@conka.io` in the Organization schema (only `info@` ships today).
4. **Are `/barrys` and `/win` meant to be indexable? — RESOLVED.** Neither. They were expired contest pages. Deleted and 301'd to `/` in Phase 8.
5. **Who owns the content review cadence?** (Phase 9.) Freshness dates are only worth adding if they are true. Without a named owner, task 3 of Phase 9 should not ship.
6. **Sequencing: Phase 6 (blog) or Phases 7 and 8 first?** 7 and 8 are days of work and lift every page including the future blog. The blog is the bigger acquisition bet but is gated on Humphrey's content engine. They are not mutually exclusive.

## References

- Source keyword research: `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- Page rules incl. mandatory SEO and JSON-LD: `.claude/rules/pages.md`
- Root metadata: `app/layout.tsx`
- Existing per-route metadata precedent: `app/science/page.tsx`, `app/go/[slug]/page.tsx`
- Shared product H1: `app/components/product/ProductBuyPanel.tsx`
- Pricing source of truth: `app/lib/landingPricing.ts`, `app/lib/funnelData.ts`

## Jira tickets

Sprint 28. Phases 6, 7 and 9 are not ticketed yet. Phase 8 is SCRUM-1140 and is the first ticket in this programme actually linked to the Website & CRO epic (SCRUM-763): the five before it carried the epic name as a title prefix only, because `.claude/skills/scope/jira.md` used to tell the scope skill not to set `parent`. That instruction is now fixed.

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| [SCRUM-1131](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1131) | [Bugs] Every page canonicals to the homepage, blocking the whole site from ranking | 1 | Done |
| [SCRUM-1132](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1132) | [Website & CRO] Add per-page SEO metadata to the five indexable money pages | 2 | Done |
| [SCRUM-1133](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1133) | [Website & CRO] Add Product and FAQPage JSON-LD to the three PDPs (SEO Phase 3) | 3 | Done |
| [SCRUM-1136](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1136) | [Website & CRO] Add sitemap.ts and robots.ts for crawl discovery (SEO Phase 5) | 5 | Done |
| [SCRUM-1138](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1138) | [Website & CRO] Add descriptive keyword H1s to the three PDPs (SEO Phase 4) | 4 | Done |
| [SCRUM-1140](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1140) | [Website & CRO] AEO schema coverage and indexation hygiene (SEO Phase 8) | 8 | Done, merged |
| [SCRUM-1141](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1141) | [Website & CRO] Entity identity: Organization + WebSite schema, sameAs, footer socials (SEO Phase 7) | 7 | Built, in review |

All five foundation tickets (SCRUM-1131, 1132, 1133, 1136, 1138) are Done and merged to main. Phase 4 shipped with the product name kept as the visual focal point and a descriptive keyword subline added inside the same `<h1>` via an optional `seoHeading` field on the hero content (leaving `content.name`, which feeds bottle alt text, untouched). Phase 6 (blog) is tracked separately in `blog-informational-content-surface.md`.

Phases 7, 8 and 9 came out of the 2026-07-14 AEO audit and are scoped above. Suggested ticketing when they are green-lit: Phase 8 as one ticket (a batch of small, independent hygiene fixes), Phase 7 as one ticket (blocked until the `sameAs` list exists), Phase 9 as one ticket per page or as a content-stream epic, since it is editorial rather than engineering work.

## Branching model

`SEO-AND-AEO-WORK` is the integration branch and holds the plan docs. Each ticket is built on a sub-branch off it (`scrum-1131-canonical-fix`, `scrum-1132-...`), pushed, and merged back via PR into `SEO-AND-AEO-WORK`, not into `main`.
