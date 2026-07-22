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
- **Analytics.** Events are tagged with `persona`; set it per config.
- **Buy box.** `mm` always renders the home `ProductGrid`. `im8` renders `ListiclePurchase` (pricing resolves from `funnelData`, not config).

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

`slug`, `persona`, `format: "listicle"`, `template`, `title`, `faqIds`, and optional trust/proof toggles: `logoMarquee`, `pressMarquee`, `trustCarousel`, `athleteTestimonials`, `reviewsCarousel`, plus `stickyBar` (`{ label, cta, sub? }`).

- `faqIds` are ids from `app/lib/faqContent.ts`, in display order. An unknown id fails the build. The `/go` surface strips claim anchors from answers.

## `mm` template reference

```ts
{
  slug, persona, format: "listicle", template: "mm", title,
  hero: { author?: { name, avatar?, updated }, headline, subcopy },
  body: [ /* reason and buyBox blocks, in order */ ],
  // shared trust flags + faqIds + stickyBar
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
  appSection?, comparison?, costBreakdown?,
  // shared trust flags + faqIds + stickyBar
}
```

The `body` array is a plug-and-play library. Blocks: `reason`, `statsBand`, `reviewStrip`, `quoteBand`, `symptomExplainer`, `segmentToggle`. An IM8 `reason` takes a rich `asset` (`kind`): `image`, `video`, `crashChart`, `researchBacked`, `measureTile`, `cognitionBars`, `scoreByGroup`, `dayEnergyCurve`, `focusBars`, `athleteQuote`, `ingredientGrid`, `statPanel`, or `placeholder`. Each maps to a component in `ListicleRenderer`; see `listicle-types.ts` for the exact fields per kind.

## Gotchas

- **Unknown `faqId` fails the build.** Deliberate: it stops a page shipping with a broken FAQ. Add the id to `faqContent.ts` first if it does not exist.
- **`mm` reasons are photos only.** The type enforces it. Put the file in `public/` and reference it as `/path.jpg`.
- **Do not register a scaffold.** There is no lorem-ipsum template file any more; copy a real model config instead.
- **Adding a third template?** Turn the route's `template === "mm" ? ... : ...` into a lookup map at that point, not before. Two templates do not need a registry.

## References

- Config types: `app/lib/landings/listicle-types.ts`
- Quiz sibling system: `docs/features/LANDING_QUIZ_SYSTEM.md`
- Blueprint (IM8 zone anatomy): `docs/development/featurePlans/landing-conversion/listicle-blueprint.md`
