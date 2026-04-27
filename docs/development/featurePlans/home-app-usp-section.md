# Home App-USP section + home-page tightening

Status: Not Started
Scope size: B (1-2 days)
Design system: brand-base + CLINICAL_AESTHETIC.md
Branch: product-page-and-home-page-improvement

## Problem

The home page is missing our strongest differentiator. The CONKA app lets users verify progress themselves, rather than relying on marketing claims. No home-page section currently surfaces this.

At the same time, the home page carries two sections that are redundant:

- LabGuarantee (Section 11, 100-day risk-free guarantee) - the trust signal is already carried site-wide by LabTrustBadges, and a full purchase-assurance section belongs on product pages (Flow, Clear, Start), not mid-home-page.
- FoundersSection (Section 10) - the /our-story page is one nav-click away. Home should read as premium data-lab, not About page.

Net change: remove 2 sections, add 1. Page goes from 12 to 11 sections.

## Who it serves

Warm home-page traffic: brand-aware visitors, typically post-ad, searching CONKA directly. They need a reason-to-believe sharper than the category average.

## Business impact

- Adds a differentiator hook competitors cannot easily match ("prove it yourself").
- Tightens page density by removing two redundant sections.
- Keeps the 100-day guarantee signal present on home via LabTrustBadges without a dedicated section.

## Approach

Three moves on one branch.

1. Remove LabGuarantee section and dynamic import from `app/page.tsx`.
2. Remove FoundersSection section and dynamic import from `app/page.tsx`.
3. Build a new `AppUSPSection` component in `app/components/home/`, following CLINICAL_AESTHETIC.md, and wire it into `app/page.tsx` as new Section 6, immediately after `LabCaseStudies`. The narrative reads "clinical proof from others -> proof you run yourself."

### Design decisions

- Follow CLINICAL_AESTHETIC.md: trio header, hairline card, navy `#1B2757`, square corners via `brand-clinical` token scope, `ConkaCTAButton` as the primary CTA, mono eyebrows, no shadows, no rounded SVG strokes.
- Asset: reuse existing phone screenshots from `app/components/app/appStickyPhoneBlockData.ts` (`PHONE_SOURCES`). Render a single static cropped view inside a hairline square frame. No cross-fade, no scroll-track, no tabs - explicitly simpler than `AppStickyPhoneBlock`.
- Desktop: larger asset; mobile: smaller crop. No custom phone-frame SVG.
- Performance: dynamic import with height placeholder consistent with other home sections. `<Image>` with `priority={false}` (below the fold), explicit `sizes`, WebP if source allows.
- CTA: `ConkaCTAButton` to `/app`, label "See the app", meta line "// track your own results".
- Copy: claim-safe per BRAND_VOICE - "tools to measure your own progress", not "we prove the product works in your brain."

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Home-page cleanup (remove LabGuarantee and FoundersSection) | Not Started |
| 2 | Build AppUSPSection and wire into home | Not Started |

## Active Phase Task Breakdown

### Phase 1: Home-page cleanup

1. Remove LabGuarantee section block and `dynamic(...)` import from `app/page.tsx`.
2. Remove FoundersSection section block and `dynamic(...)` import from `app/page.tsx`.
3. Re-alternate `brand-bg-white` / `brand-bg-tint` rhythm top-to-bottom after removals and after the new section is inserted.

### Phase 2: Build AppUSPSection

1. Create `app/components/home/AppUSPSection.tsx` with the clinical layout:
   - Trio header: eyebrow `// Proof, not promises · App-01`, `brand-h1` heading, mono sub.
   - Two-column content on desktop: hairline card on the left (USP hook / what it is / why it matters), phone asset on the right inside a hairline square frame with a `Fig. 0X` plate.
   - Stacked on mobile: heading -> copy card -> asset -> CTA.
   - `ConkaCTAButton` to `/app`, label "See the app", meta "// track your own results".
   - Content-only: no `<section>`, no root `max-w-*`, no `px-*`.

2. Prepare the app visual:
   - Reuse a single image from `PHONE_SOURCES` (recommend the results or progress-graph screen - strongest "measurable progress" read).
   - Crop to a clean rectangular region inside the asset frame. No full phone bezel, no shadow system.
   - Use Next.js `<Image>`, `priority={false}`, explicit `sizes`.

3. Wire AppUSPSection into `app/page.tsx`:
   - Dynamic import with a height placeholder.
   - Insert as new Section 6, immediately after the `LabCaseStudies` section.
   - Background chosen to preserve alternation (likely `brand-bg-tint`, but confirm against final section order).

4. Draft section copy:
   - Tight clinical tone, no em dashes.
   - Claim-safe language.
   - Expect iteration with the user: bring a draft, up to two rounds of revisions.

5. Mobile QA at 390px:
   - Stack order: eyebrow -> heading -> copy card -> asset -> CTA.
   - 44px min tap target on CTA.
   - Asset sized so it does not dominate the viewport.
   - No layout shift during image load.

## Rabbit Holes

- Over-polishing the app asset (custom phone frame SVG, drop shadow, reflection, mockup system). Keep it: clean crop inside a hairline square frame, optional mono caption, nothing else.
- Copy ping-pong. Hard bound: one draft from Claude, up to two rounds of revisions with the user, then ship.

## No-Gos

- No edits to the `/app` page itself.
- No nav changes (no "App" nav item in this scope).
- No animation, video, or carousel in the new section.
- No changes to other home-page sections beyond the specific removes and the one add.
- No work on product-page guarantees (separate ticket, later).

## Risks

- Claims language must stay within BRAND_VOICE rules. Run the draft through `/review-claims` before finalising.
- Asset weight on mobile can tank LCP if unoptimised. Use `<Image>`, explicit `sizes`, `priority={false}`, WebP where possible. Below the fold so no LCP impact if dynamic-imported correctly.
- `ctaHref="/protocol/3"` on the remaining `LabTimeline` section (Section 8) will break post-simplification. Out of scope here, but flag for a separate ticket.

## References

- `app/page.tsx` - home page entry
- `app/components/landing/LabGuarantee.tsx` - being removed from home, kept for product pages
- `app/components/home/FoundersSection.tsx` - being removed from home (component may stay for /our-story reuse)
- `app/components/app/AppStickyPhoneBlock.tsx` - reference for phone asset treatment (new component is explicitly simpler)
- `app/components/app/appStickyPhoneBlockData.ts` - `PHONE_SOURCES` to reuse
- `app/components/landing/LabTrustBadges.tsx` - already carries the 100-day guarantee signal site-wide
- `docs/branding/CLINICAL_AESTHETIC.md` - visual language
- `docs/branding/BRAND_VOICE.md` - claim-safe copy
- CLAUDE.md - stack, routing, design-system migration context

## Jira tickets

| Key | Title | Phase | Status |
|-----|-------|-------|--------|
| [SCRUM-914](https://conka.atlassian.net/browse/SCRUM-914) | [Website & CRO] Home page: add App USP section, remove LabGuarantee + FoundersSection | 1 + 2 | To Do |

Parent epic: SCRUM-763 (Website & CRO). Sprint 24 (active).
