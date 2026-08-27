# Listicle System

> **Purpose:** How to create and maintain the "N reasons" listicle landing pages served at `/go/[slug]`. These are noindex ad destinations for paid traffic.

## Overview

A listicle is a config object. You write the config, register it, and the route renders it. There is no per-page component to build.

Every listicle picks one of two **templates**, and its config type changes to match:

| Template | Renderer | Looks like | Reasons are | Use for |
|----------|----------|-----------|-------------|---------|
| `mm` | `SimpleListicleRenderer` | Magic Mind editorial article | photo + heading + body | broad, simple, copy-led pages |
| `im8` | `ListicleRenderer` | dense, proof-heavy | data-viz panels, stat bands, tables | evidence-heavy persona pages |

The template is a discriminated union: an `mm` config literally cannot set IM8-only fields (product-image hero, CTA, product block) and vice versa. TypeScript guides you to exactly the fields your template uses.

## How it works

```
config (app/lib/landings/*.ts)
  -> registered in index.ts
  -> route app/go/[slug]/page.tsx: getLandingConfig(slug)
       -> config.template === "mm" ? SimpleListicleRenderer : ListicleRenderer
```

- **Static + noindex.** `generateStaticParams` builds every registered slug; `dynamicParams = false` (an unregistered slug 404s). `generateMetadata` sets `robots: { index: false, follow: false }`.
- **Buy box.** `mm` always renders the home `ProductGrid`, whose cards link out to the PDPs. `im8` renders `ListicleProductHero`, the PDP hero (`ProductHeroV2` / `ProductHeroMobileV2`) wired to its own cadence state and the cart, so it adds to cart in place.

## Analytics

Three events, wired automatically by both renderers. Nothing to configure per page.

| Event | Fires | Properties |
|-------|-------|------------|
| `listicle:section_viewed` | Once per section per pageview, when it scrolls into view | `slug`, `section` |
| `listicle:cta_clicked` | On CTA click (or add-to-cart in the `im8` buy zone) | `slug`, `section` |
| `listicle:interaction` | On an interactive-block press: the ADHD symptom picker and the brain-ageing segment toggle | `slug`, `section` |

`product` means different things per template, because the buy boxes differ: on `mm` it is a click through to a PDP, on `im8` it is an add-to-cart. Compare it within a template, not across.

`section` is either a body block (`reason_3`, `buyBox_5`) or a fixed zone (`hero`, `bridge`, `sticky`, `product`). Block ids are `${kind}_${index}` over `config.body`, so **inserting or reordering a block changes the ids below it** and breaks comparability with earlier data for that page.

Exactly two properties per event, respecting the two-property budget documented in `app/lib/analytics.ts`. The CTA's position is folded into `section` rather than sent separately, so one query returns the whole matrix:

```
dataset=events by=["eventData/slug","eventData/section"]
filter=eventName eq 'listicle:cta_clicked'
```

`section_viewed` is the denominator for `cta_clicked`: without it a low click count cannot separate a weak section from a rarely-reached one. Divide one by the other to get a per-section click-through rate.

`listicle:interaction` is the active-intent signal (a self-identifying press, not a scroll-past). It folds the *choice* into `section`, as `symptom_<label>` (ADHD) or `segment_<label>` (brain-ageing), so the same grouped query works. Only presses fire, never the pre-selected default, so a toggle's default option is under-counted relative to the one visitors switch to. Wired in `ListicleRenderer` via `useListicleInteraction`; the `SymptomExplainer` / `SegmentToggle` components stay analytics-agnostic behind an `onSelect` prop.

### Attributing the purchase

Most listicle CTAs link out to a PDP, so the click and the eventual add-to-cart would otherwise be unrelated rows. Every outbound CTA carries an origin token, `?src=<slug>-<section>`, and the PDP feeds it into the `source` field of the existing `purchase:add_to_cart` event through `getPurchaseSource()`. No new purchase event.

`source` is the right field because it already means "where did this visitor come from"; `location` keeps its existing job of saying where on the PDP they clicked (`hero` / `sticky_footer`).

The im8 buy zone sells in place, so there is no URL to read: it tags `source` from context in the same `<slug>-<section>` format, so a listicle-originated purchase looks identical whether it closed on the listicle or on a PDP.

Two guards worth knowing about: the token is sanitised on read (anything not matching `^[a-z0-9_-]{1,96}$` is discarded, since a URL param is attacker-controlled and would otherwise pollute the dashboard), and PDPs self-canonicalise from the root layout's relative `canonical: "./"`, which resolves on pathname only, so `?src=` creates no duplicate-content risk.

The mm buy boxes pass the token to the shared home `ProductGrid` through an optional `linkSrc` prop. Unset, links are untouched, so the home page is unaffected.

### Tagging the order with the persona (SCRUM-1180)

The `source` above lands the origin in Vercel, but the Shopify order needs it too, so paid orders are filterable by persona in the Orders list. The origin rides through to the order and becomes order tags:

1. **Persist.** `captureListicleSrc()` writes `?src=` to `sessionStorage` on PDP landing (the three PDP pages call it on mount), so the origin survives a within-PDP navigation that drops the param. `getListicleSrc()` reads the live URL first, then falls back to the stored value.
2. **Carry.** `CartContext` writes the origin as a hidden, cart-level `_listicle_origin` attribute on every add-to-cart (sourced from `getPurchaseOrigin()`, exactly like `_fbp` / `_fbc`, so a later origin-less add cannot wipe it). The `_` prefix keeps it off the customer's checkout.
3. **Tag.** The `orders/paid` webhook reads `_listicle_origin` from the order's note attributes and adds `listicle` plus `persona:<slug>` tags via the Admin API (`addOrderTags`), in its own try/catch so it never blocks the Purchase send.

Persona-only by design: the finer `section` stays in Vercel, keeping the Orders filter low-cardinality. An organic purchase (no `?src=` ever) carries no attribute and no tags.

### Implementation

`app/components/go/listicle/listicleAnalytics.tsx`: one shared `IntersectionObserver` for the page, handed to blocks through context. The slug lives only on the provider, so no call site can tag an event with the wrong page.

The observer itself now lives in `app/components/analytics/sectionImpressions.tsx`, shared with the PDPs (SCRUM-1260). It takes an `onSeen(section)` callback and knows nothing about event names, so each surface keeps its own event shape. This file is the listicle's thin wrapper over it, and the emitted stream is unchanged: same event names, same two properties, same `threshold: 0` and `rootMargin: "0px 0px -15% 0px"`, same once-per-section unobserve. **Do not change those observer options** without accepting that every historical `section_viewed` count is silently rebased.

The PDP side deliberately did NOT copy the index-derived id scheme described above. It keys on each section's semantic id instead, because the product pages are reordered often enough that positional ids would invalidate the dataset on the first reorder. See `trackPdpSectionViewed` in `app/lib/analytics.ts`. `mm` buy boxes use click delegation so the shared home `ProductGrid` needs no tracking props; the `im8` buy zone fires on add-to-cart instead, because delegating there would count cadence toggles and accordions as CTA clicks.

The attribution design shipped under SCRUM-1177 / SCRUM-1178; its plan doc has been folded into this one.

## Key files

| File | Purpose |
|------|---------|
| `app/lib/landings/listicle-types.ts` | The config types. `ListicleConfig = Im8ListicleConfig \| MmListicleConfig` over a shared `ListicleBase`. |
| `app/lib/landings/index.ts` | The registry. Add your config here. |
| `app/lib/landings/general-listicle.ts` | **The `mm` model config.** Copy this to start an MM page. |
| `app/lib/landings/{adhd,productivity,brain-ageing}-listicle.ts` | **The `im8` model configs.** Copy one to start an IM8 page. |
| `app/components/go/listicle/SimpleListicleRenderer.tsx` | Renders `mm`. |
| `app/components/go/listicle/ListicleRenderer.tsx` | Renders `im8`. |
| `app/go/[slug]/page.tsx` | Route: slug -> config -> renderer. |

## Create a listicle (the whole process)

1. **Copy the closest model** into a new file, e.g. `app/lib/landings/my-page.ts`. Use `general-listicle.ts` for `mm`, a persona file for `im8`.
2. **Set the identity fields:** `slug` (the URL: `/go/<slug>`), `persona` (analytics tag), `template`, `title` (page title + Meta content name).
3. **Write the hero and body** (see the template reference below). Put any new images under `public/`.
4. **Register it** in `index.ts`: import the config and add `[myConfig.slug]: myConfig` to `registry`.
5. **Build.** `npm run build`. The build fails on an unknown `faqId`, so this is your safety net.

That is the whole thing. No route, component, or analytics wiring to touch.

## Shared fields (both templates)

`slug`, `persona`, `format: "listicle"`, `template`, `title`, `faqIds`, an optional `proof` object, plus `stickyBar` (`{ label, cta, sub? }`).

- `faqIds` are ids from `app/lib/faqContent.ts`, in display order. An unknown id fails the build. The `/go` surface strips claim anchors from answers, renders via `LabFAQ` with no image column and no hub link.
- `proof` is the post-reasons proof tier, rendered by `ListicleProofTier` for both templates. Four optional moments, each doing a different job, in fixed order:

```ts
proof: {
  logoBand?: boolean,                                   // partner logos
  ugc?: { title?, subtitle?, items? },                  // UGCMarquee band
  feature?: { name, credentials[], quote, image, imageAlt },  // one named person
  reviews?: boolean,                                    // ReviewRail + trust badges
}
```

  Omit a key to skip that moment; omit `proof` for no tier at all. The `feature` portrait **must** be a white-background cutout (the component dissolves the white with `mix-blend-multiply`); every `*NB.jpg` under `public/testimonials/athlete/` qualifies. Leave `ugc.items` unset to use the shared 25-still set: below roughly 12 items the band stops reading as volume.

## `mm` template reference

```ts
{
  slug, persona, format: "listicle", template: "mm", title,
  hero: { author?: { name, avatar?, updated }, headline, subcopy },
  body: [ /* reason and buyBox blocks, in order */ ],
  // shared proof + faqIds + stickyBar
}
```

Body blocks:
- `reason` — `{ kind: "reason", n, headline, body, citation?, citationHref?, asset }`. `asset` is always an image: `{ kind: "image", src, alt, aspect?, fit? }`. Use `fit: "cover"` for lifestyle photos.
- `buyBox` — `{ kind: "buyBox", headline?, subline? }`. A mid-list `ProductGrid` (the reference repeats the offer after reason 5). The end-of-page grid is the `#product` anchor.

The hero is text-only (no image, no CTA button); the sticky bar carries the persistent CTA.

## `im8` template reference

```ts
{
  slug, persona, format: "listicle", template: "im8", title,
  hero: { laurel?, headline, subcopy, socialProof?, cta, trustPills?, asset },
  ticker?: string[],
  body: [ /* the section-block library, in order */ ],
  bridge?, product: { headline, subline?, productHeroId?, whoItsFor? },
  // shared proof + faqIds + stickyBar
}
```

The `body` array is a plug-and-play library. Blocks: `reason`, `statsBand`, `reviewStrip`, `symptomExplainer`, `segmentToggle`. An IM8 `reason` takes a rich `asset` (`kind`): `image`, `video`, `crashChart`, `researchBacked`, `measureTile`, `cognitionBars`, `scoreByGroup`, `dayEnergyCurve`, `focusBars`, `athleteQuote`, `ingredientGrid`, `statPanel`, or `placeholder`. Each maps to a component in `ListicleRenderer`; see `listicle-types.ts` for the exact fields per kind.

## `im8` zone anatomy

The eight zones the IM8 template was modelled on, top to bottom. Background
rhythm is part of the design: the listicle core sits dark, the purchase section
is a hard switch to light, trust / comparison / reviews run light, the cost
breakdown is a dark card, the FAQ is a full-bleed brand-colour block.

1. **Hero** — eyebrow tag, all-caps "N REASONS [AUDIENCE] SAY [PRODUCT] [OUTCOME]" headline, short subcopy, a proof/rating line, primary CTA anchoring to the buy section, single lifestyle asset. A row of anchor chips (one per reason) sits below as in-page nav.
2. **Reasons breakdown** — the core listicle. Each reason: number marker, category tag, all-caps *felt outcome* headline (not a feature), a problem-validate paragraph then a solution paragraph mapping named ingredients to that exact pain, one asset alternating sides. Static review cards weave between reasons roughly mid-list (a row of 3-4 quote cards, no carousel, no JS). The final reason rolls into a dark CTA card bridging into purchase.
3. **Purchase section** — hard switch to a light band, the `#product` anchor every CTA deep-links to. Left: offer card, certification badges, product imagery, thumbnail gallery. Right: buy box with rating, variant selector, an inline named testimonial, subscribe-vs-one-time radio cards, CTA, reassurance strip, payment icons, then Overview / Ingredients / How to Enjoy / What's Inside / Third-Party Tested. Purchase happens in place via `funnelCheckout()` — no cart drawer, no navigation between conviction and checkout.
4. **High-performer trust carousel** — horizontally scrolling portrait video-testimonial cards, "Rated Excellent" badge floating top-right.
5. **Them vs us comparison table** — ingredient rows, our column showing a check, "+X% MORE" and the clinical dose against a generic unnamed competitor. **CONKA constraint:** per-serving doses are fine to show; formula-share percentages are **not** (composition is secret). "+X% more than the leading X" compares to a competitor's dose and is fine.
6. **Review wall** — huge review-count headline, masonry grid of static review cards, "Show more" revealing more rows client-side.
7. **Cost breakdown** — a large dark rounded card: stacked savings claim, CTA, product render, annual-savings badge on the left; an itemised "Monthly Breakdown" of what the product replaces on the right, closing on a two-row total. CONKA equivalent is the shot vs buying citicoline, omega-3 etc. separately.
8. **FAQ + minimal footer** — full-bleed brand-colour, single-column accordion (~7 questions), "Explore all FAQs". FAQ questions are persona-specific per config, never generic. Minimal footer, and **no site nav anywhere on the page**.

## Copy standard for a `reason`

Derived from a teardown of Magic Mind and both IM8 GLP-1 variants (Jul 2026).
The tight IM8 variant is the model:

> **A listicle reason is a statement-titled, single-idea, ~60-word unit.**

- **Title is a statement, never a question.** "Protect Your Hard-Earned Muscle Mass", not "Do Brain-Training Apps Actually Work?". A question asks the reader to do work and reads like an article; a statement *is* a reason and reads like a list. Where a search question matters for AEO, put it in the `tag` eyebrow and keep the headline a statement.
- **50 to 80 words, one mechanism.** Open on the reader's specific pain in second person, pivot to the fix in one clause, at most one proof point. Push a second mechanism or extra citation into the ingredient grid, which exists to carry that detail.
- **Unbroken numbered spine.** Number every reason-type block in one run, including `symptomExplainer` and `segmentToggle`; leave interstitial `statsBand` / `reviewStrip` unnumbered. A spine that reads 1 ... (wall of text) ... 2, 3 is the failure mode.
- **Hero subhead leads with the problem**, not a product summary: the reader's pain or the gap nobody warned them about, then the product, in one to two lines.

**What not to over-correct.** Real PMIDs/DOIs under claims are a genuine trust
edge over both references, which cite little or nothing. The interactive blocks
(ADHD symptom explainer, brain-ageing segment toggle) are more engaging than
either competitor's static page. Keep both; the gap was word count and titling,
never the presence of evidence or interaction.

## Gotchas

- **Unknown `faqId` fails the build.** Deliberate: it stops a page shipping with a broken FAQ. Add the id to `faqContent.ts` first if it does not exist.
- **`mm` reasons are photos only.** The type enforces it. Put the file in `public/` and reference it as `/path.jpg`.
- **Do not register a scaffold.** There is no lorem-ipsum template file any more; copy a real model config instead.
- **Adding a third template?** Turn the route's `template === "mm" ? ... : ...` into a lookup map at that point, not before. Two templates do not need a registry.

## References

- Config types: `app/lib/landings/listicle-types.ts`
- Quiz sibling system: `docs/features/LANDING_QUIZ_SYSTEM.md`
- Landing conversion programme: `docs/development/featurePlans/landing-conversion/README.md`
