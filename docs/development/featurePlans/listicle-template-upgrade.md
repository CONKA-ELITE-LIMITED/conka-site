# Listicle Template Upgrade + Three Persona Rewrites

**Status:** Scoped, not started
**Tracking:** Plan doc only (no Jira)
**Design system:** Existing `/go` listicle/landing token system (no migration)

## Problem

Humphrey rewrote the copy and sentiment for three persona listicles (Productivity, ADHD, Brain Ageing). The current template cannot express a few things the new copy needs: citations under claims, a press "As Published On" marquee, and two bespoke interactive sections (ADHD symptom explainer, Brain Ageing male/female toggle). A secondary issue: every persona currently renders the same hardcoded charts, logos and athletes, which undercuts the persona-specific pitch.

## Who it serves

Paid Meta traffic landing on persona-matched listicles at `/go/[slug]` (noindex). Part of the persona-landing CRO push.

## Business impact

Higher listicle to buy-box conversion by matching the pitch and proof to the persona (real citations, real press). Keeping the shared surface small also keeps every future listicle cheap to author.

## Guiding principle (from the critical review)

Build shared components only for what recurs across two or more listicles. Build single-use sections plainly as bespoke blocks, do not generalise them. Lean on the existing config-driven primitives (`reason`, `statsBand`, `ingredientGrid`, `image`, `video`/`.gif`, `athleteQuote`, FAQ ids) rather than reinventing them.

## Current-state facts (from architecture audit)

- All three configs already exist and are registered: `productivity-listicle.ts`, `adhd-listicle.ts`, `brain-ageing-listicle.ts`. This is an extend, not a greenfield build.
- Renderer is `app/components/go/listicle/ListicleRenderer.tsx`, an ~860-line client monolith. Body blocks dispatch via an if-chain (`BodyBlock`), assets via an if-chain (`AssetBlock`). Some zones (comparison, costBreakdown, statsBand) are inline in the renderer.
- Config-driven and reusable as-is: `reason`, `statsBand`, `reviewStrip` blocks; `image`, `video`, `athleteQuote`, `ingredientGrid`, `statPanel` assets; FAQ id resolution; hero/ticker/bridge/product/stickyBar.
- Hardcoded to a single dataset (every persona shows identical output): `scoreByGroup`, `crashChart` (mostly), `measureTile`, `researchBacked`, `cognitionBars`, `dayEnergyCurve`, `focusBars`, `LogoMarquee`, `AthleteTestimonials`, `ReviewRail`.
- FAQ: config supplies `faqIds` only, resolved against canonical `app/lib/faqContent.ts` (`pickFaqItems`, throws on unknown id). `CROFAQv2` can render arbitrary items, but the config does not expose custom copy.
- Registration: add config to `app/lib/landings/index.ts`; route is `app/go/[slug]/page.tsx` (`dynamicParams = false`, noindex).
- `.gif` assets are served via the config-driven `image`/`video` path with `unoptimized`, so the CognICA "Do you see an animal?" clip needs no new component.

## Decisions

1. **FAQ storage:** all FAQ copy lives in canonical `app/lib/faqContent.ts` and is referenced by `faqIds`, following the same per-surface-subset pattern used on product pages. No config type change, no divergent copy path.
2. **Press assets and CognICA GIF:** use placeholders in the active phases; download and optimise the real Drive-folder assets in Phase 5.
3. **Shared vs bespoke:** shared core plus per-persona bespoke blocks. The two interactive sections stay bespoke to one persona each.
4. **CognICA section:** no new component. It is a `reason` block plus a `.gif` asset plus the press marquee.
5. **Comparison table:** not built. Productivity's "vs caffeine" is prose plus the `88%` stat plus the existing `crashChart`.
6. **Compounding/counter:** no shared component. Productivity's "loop" is a prose `reason`. Brain Ageing's "+15 years" is at most a small count-up stat reusing the existing `useInView` pattern, decided at build.

## Cut from the first draft (and why)

| Dropped | Reason |
|---------|--------|
| CognICA test component | Existing `reason` + `.gif` asset + press marquee cover it. |
| Config-driven comparison block | Single consumer (Productivity), and that moment is prose + stat + existing `crashChart`. |
| Shared CompoundingLoop component | Two different shapes (prose loop vs one counter); bundling invents a shape neither needs. |
| Bespoke PressLogoCarousel | Reuse `LogoMarquee` mechanics, parameterised, instead of a second marquee. |
| Custom FAQ escape hatch | Canonical FAQ + ids is the established pattern and needs no type change. |
| Single-big-stat variant | `statsBand` already takes a 1 to 4 entry array plus a source line. |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Shared template foundation (citations + press marquee reuse) | Complete |
| 2 | Productivity listicle rewrite | Complete |
| 3 | ADHD listicle rewrite (+ bespoke symptom explainer) | Complete (FAQ copy pending, see TODO.md) |
| 4 | Brain Ageing listicle rewrite (+ bespoke male/female toggle, + Brain Ageing FAQ entries) | Not started |
| 5 | Asset finalisation + chart honesty parameterisation | Future |

> **Phase 1 note (build):** the FAQ task was moved out of Phase 1 into the
> respective persona rewrites (Phases 3 and 4). Adding canonical FAQ entries
> needs no shared foundation code (the `faqIds` mechanism already resolves),
> the ADHD FAQ copy was not supplied yet, and the entries belong with each
> rewrite. Phase 1 shipped the two genuine code capabilities: citations and the
> press marquee.

Each phase is independently shippable via Vercel preview.

### Phase 1: Shared template foundation

1. **Citations (PMID/DOI)** - Small
   - What: an optional citation line rendered under claim sentences and under `ingredientGrid` items. Config supplies a citation string (and optional source URL). Wire into the `reason`/`statsBand` renderers and extend `IngredientGrid` items with an optional `citation` field.
   - Files: `app/lib/landings/listicle-types.ts`, `app/components/landing/CitationLine.tsx` (new, small), `app/components/landing/IngredientGrid.tsx`, `app/components/go/listicle/ListicleRenderer.tsx`
2. **Press "As Published On" marquee** - Medium
   - What: make `LogoMarquee` data-driven (heading + logo set as props) so it can render either the existing partner logos or a press-logo set. Add a config flag/field to opt a listicle into the press variant. Placeholder logos.
   - Files: `app/components/landing/LogoMarquee.tsx`, `listicle-types.ts`, `ListicleRenderer.tsx`, `public/lander/press/` (placeholders)
3. ~~Add persona FAQ entries to canonical source~~ - **Moved to Phases 3 and 4.** No shared code is required (the `faqIds` mechanism already resolves against `app/lib/faqContent.ts`), so each persona's FAQ entries are added alongside its rewrite, following the existing structure and claims-anchor conventions.

**Phase 1 delivered:**
- `app/components/landing/CitationLine.tsx` (new): small-print PMID/DOI/PMC source line, optional link.
- `IngredientGrid` items take an optional `citation` (rendered under each tile).
- `reason` blocks take optional `citation` + `citationHref` (rendered under the body).
- `LogoMarquee` parameterised (`heading`, `logos`); items with no `src` render as text wordmarks. New `PRESS_LOGOS` export (text placeholders for the "As Published On:" outlets).
- New config flag `pressMarquee?: boolean`; renders the press marquee in the trust zone (Zone 4). Placement can move inline per persona later.

### Phase 2: Productivity listicle rewrite

1. **Rewrite `productivity-listicle.ts`** - Medium
   - What: map Humphrey's hero and six reasons onto existing primitives plus Phase 1 citations and press marquee. The bad-nights section is an `ingredientGrid` with citations. The "vs caffeine" moment reuses `crashChart` + a stat. CognICA is a `reason` + `.gif`.
   - Dependencies: Phase 1
   - Files: `app/lib/landings/productivity-listicle.ts`

### Phase 3: ADHD listicle rewrite

1. **Symptom explainer (bespoke)** - Large
   - What: one stateful component. Symptom buttons (primary set plus a "see more" toggle), a "what's happening in your brain" panel, and per-symptom ingredient cards with citations. Data comes from config so the copy is not hardcoded, but the component is ADHD-specific and not generalised. Humphrey supplied a reference HTML/JS spec (inspiration, not to copy verbatim).
   - Files: `app/components/landing/SymptomExplainer.tsx` (new), `listicle-types.ts`, `ListicleRenderer.tsx`
2. **Rewrite `adhd-listicle.ts`** - Medium
   - What: Humphrey's copy, stats with source links, CognICA reason + gif, press marquee, canonical FAQ ids (from Phase 1 task 3).
   - Dependencies: Phase 1, Phase 3 task 1
   - Files: `app/lib/landings/adhd-listicle.ts`

### Phase 4: Brain Ageing listicle rewrite

1. **Male/female toggle (bespoke)** - Large
   - What: a two-segment control that swaps a section's headline, ingredient card, stats and testimonial. Two segments only, not a generic N-segment engine.
   - Files: `app/components/landing/SegmentToggle.tsx` (new), `listicle-types.ts`, `ListicleRenderer.tsx`
2. **Rewrite `brain-ageing-listicle.ts`** - Medium
   - What: Humphrey's copy, photo testimonials via reused `athleteQuote` (Dan Norton, Shane, Rosalind, Anthony and others), optional "+15 years" count-up stat, CognICA reason + gif, press marquee, canonical FAQ ids.
   - Dependencies: Phase 1, Phase 4 task 1
   - Files: `app/lib/landings/brain-ageing-listicle.ts`, testimonial images under `public/testimonials/` or `public/lander/`

### Phase 5: Asset finalisation + chart honesty (Future)

- Download and optimise the real press logos and the CognICA test GIF from the shared Drive folder; swap out placeholders.
- Parameterise the hardcoded chart components (`scoreByGroup`, `crashChart`, `focusBars`, etc.) so each persona shows honest, persona-specific data instead of the shared defaults.
- Optional: extract the renderer monolith's inline zones into per-zone components (the file's own header comment names this as the intended direction). Only if it earns its keep.

## Rabbit holes

- **Full renderer refactor.** Tempting given the 860-line monolith, but out of scope. Phase 1 extracts only what the new blocks force. Full zone extraction is a Phase 5 optional.
- **Chart parameterisation creep.** The new copy leans mostly on `statsBand` (config-driven) plus citations, so chart honesty is deferred to Phase 5 and does not block the rewrites.
- **Over-generalising the interactive blocks.** The symptom explainer and male/female toggle are bespoke to one persona each. Do not turn them into generic engines.

## No-gos

- No fully generic config engine for the interactive sections.
- No downloading or optimising of the real press logos or CognICA GIF in the active phases (placeholders, then Phase 5).
- No touching the buy box, cart, or checkout.
- These pages stay noindex.
- No new custom-FAQ copy path in the config (canonical faqContent.ts only).

## Risks

- **Citations must render exactly as supplied** so claims stay verifiable. No compliance pass is being done in this scope (per standing steer), but the PMIDs/DOIs must match the source copy.
- **Mobile** is the main risk on the symptom explainer and male/female toggle (button grids, panel reflow). Each needs an explicit mobile check before its phase ships.
- **Appetite.** Three Scale-C rewrites in a day is tight. The phasing lets Productivity ship first and the others continue independently.

## Open assumptions to confirm at build

- Slugs stay `productivity-listicle`, `adhd-listicle`, `brain-ageing-listicle` (the quiz already owns `/go/brain-age`).
- The CognICA block copy is per-persona configurable (config text), so "early signs of ADHD" vs "diagnose dementia" framing lives in each config, not a shared string.

## References

- Architecture: `app/lib/landings/listicle-types.ts`, `app/components/go/listicle/ListicleRenderer.tsx`, `app/lib/landings/index.ts`, `app/go/[slug]/page.tsx`
- FAQ system: `docs/features/FAQ_SYSTEM.md`, `app/lib/faqContent.ts`
- Persona landing programme: `docs/development/featurePlans/landing-conversion/README.md`
- Existing reusable pieces: `app/components/landing/IngredientGrid.tsx`, `LogoMarquee.tsx`, `AthleteQuoteCard.tsx`, `CrashChart.tsx`
