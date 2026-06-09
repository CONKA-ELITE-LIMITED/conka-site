# B2B Professionals Portal - Conversion & Credibility Upgrade

A wave of conversion and credibility upgrades to the B2B professionals portal, grounded in B2B best-practice research (2025-2026). Goal: turn the thin `/professionals` landing into proper sales collateral that does Harry's selling for him, showcase the proof CONKA already has, surface the pilot programme as a USP, and make the offer and pricing unmistakable.

> **The portal itself is live.** Implemented logic is documented in `docs/features/b2b/B2B_PORTAL.md`; build history is in `docs/development/featurePlans/b2b-professionals-portal.md`. This doc scopes the visual/conversion upgrade wave only.

## Problem

When Harry sends a warm prospect the `/professionals` link, the page does not do enough selling. It is currently hero + enquiry form + a single CTA. It does not showcase proof, does not make the pilot USP visible, and does not make the value unmistakable. On the order page, tiers are shown but the saving is not obvious.

- **Who it serves:** Performance directors, sports scientists, and procurement at UK sports clubs and performance orgs.
- **Traffic source:** Warm, sales-led, Harry-shared links. Not cold organic to start (the page becomes nav-reachable later). This makes it sales-enablement collateral, not a top-of-funnel CRO surface fighting bounce.
- **Business impact:** Higher enquiry-to-order conversion and AOV on a high-value channel (a 50-box order is roughly GBP 2,250 ex VAT). The pilot USP opens a path for clubs that will not commit to bulk on faith.

## Appetite

Roughly 1 week, built section by section with user direction. Each phase ships independently to a Vercel preview. This is presentational/cosmetic work plus light display logic; no new backend, no checkout changes, no new payment paths.

## Design system

brand-base scoped under `.brand-clinical`: zero-radius tokens, navy `#1B2757` accent (interactive only, never decorative), hairline borders (`border-black/8` to `/12`), mono labels (`font-mono text-[9px]`-`[11px]`), no shadows or gradients. New sections use `brand-section` + `brand-bg-*` + `brand-track`. Note the `.brand-clinical` hero gotcha: it zeros `brand-hero-first` padding on mobile, so sections must follow the established padding pattern.

## Approach

Expand the landing into layered sales collateral (trust -> how it works -> pilot USP -> proof -> value), reframe athlete proof for a professional audience without touching the shared home/PDP carousel, and sharpen pricing clarity on the order page only. Direct buy stays first-class; the pilot is a prominent USP, not the hero; the order page stays clean.

## Key reframes from research

- **Bottom-of-funnel, sophisticated buyer.** Specificity and evidence convert; glossy emotional marketing lowers perceived rigour. Section arc: fit -> value -> confidence -> action, with proof placed next to the CTA.
- **Show the deal on the order page** (per-box anchored, "you save", next-tier nudge). Keep the landing price-free.
- **Informed Sport / anti-doping certification is the strongest B2B trust signal** (often a procurement prerequisite). Promote it high and near the CTA.
- **Pilot is "prove it on your own squad first", not a credited SaaS pilot.** The real mechanic is: buy a small batch for the squad, we layer the app + coach's cognitive dashboard + testing cadence on top, you see your own athletes' data before scaling. No invented credit terms.
- **Social proof without named clubs.** Anonymised outcomes (role + sport + squad band + KPI), aggregate counts, category/sport badges, named individual athletes (who can lawfully endorse). Never club crests, kit, stadium imagery, or "trusted by [team]" (implied-endorsement line).
- **Athlete carousel reframed, not deleted.** For this audience the consumer-style quote carousel reads as fluff. Demote athletes to supporting context, lead with practitioner/science/certification, reframe endorsement into usage-in-context.

## The pilot programme (source detail for Phase 2)

Two flexible formats, presented as the USP nobody else offers (app + coach's cognitive dashboard + testing cadence):

- **Starter pilot - 2 weeks.** Buy product for 5-15 athletes, squad set up on the app, cognitive testing ideally 3x/week, a coach's view to observe cognitive performance.
- **In-depth pilot - 4-6 weeks.** Adds a 2-week baseline period on the app before taking product (measures the change, not just the level), then the product phase. Same coach's view and testing cadence.

De-risk framing: start small, prove it on your own squad's data, then scale to a bulk order. CTA is a direct mailto to Harry with a templated subject and body prompting three non-constraining context points (estimated squad size, time period, coach-view interest). No form-build, no backend.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Credibility backbone + hero refine | For review (SCRUM-1063) |
| 2 | Pilot programme USP section | Not Started (ACTIVE) |
| 3 | Order-page pricing clarity | Not Started (ACTIVE) |
| 4 | B2B social proof | Future (gated on sign-off-ready proof data) |
| 5 | Education + ROI layer | Future |
| 6 | Nav reachability + section analytics | Future |

### Phase 1: Credibility backbone + hero refine - ACTIVE

1. **[Component] Extract shared certification component.**
   - What: lift `InformedSportBlock` out of `AthleteCredibilityCarousel` into a standalone `app/components/b2b/InformedSportCertification.tsx`, render it back inside the carousel unchanged so home and the three PDPs are untouched.
   - Dependencies: none.
   - Complexity: Small.
   - Files: `app/components/AthleteCredibilityCarousel.tsx`, new component file.

2. **[Page] Hero refine + dual path.**
   - What: sharper headline/subcopy for a warm professional buyer; primary CTA "Get team pricing" plus secondary "Explore a squad pilot" anchoring to the Phase 2 section.
   - Dependencies: none (secondary CTA anchor target lands with Phase 2).
   - Complexity: Small.
   - Files: `app/professionals/page.tsx`.

3. **[Page] Anti-doping trust strip.**
   - What: place the extracted certification block high on the landing, in the clinical aesthetic.
   - Dependencies: task 1.
   - Complexity: Small.
   - Files: `app/professionals/page.tsx`.

### Phase 2: Pilot programme USP section - ACTIVE

1. **[Component] PilotProgramme section.**
   - What: a presentational section leading with the USP (app + coach's cognitive dashboard + 3x/week testing), two format cards (Starter 2-week, In-depth 4-6-week with 2-week baseline), and the "prove it on your own squad first" de-risk line. Mailto-to-Harry CTA with templated subject/body. Mobile: format cards and any timeline stack vertically at 390px.
   - Dependencies: none.
   - Complexity: Medium.
   - Files: new `app/components/b2b/PilotProgramme.tsx`, `app/professionals/page.tsx`.

2. **[Copy] Pilot copy.**
   - What: final copy for both formats, the USP lead, the de-risk line, and the mailto template. Stays presentational and honest (no invented credit terms, no new product claims).
   - Dependencies: task 1 structure.
   - Complexity: Small.

### Phase 3: Order-page pricing clarity - ACTIVE

1. **[Lib] Next-tier helper.**
   - What: a small helper (e.g. `getB2BNextTier(boxes)`) returning boxes-to-next-tier and the per-box saving at the next tier. Reuses existing tier data; keeps the combined-total model.
   - Dependencies: none.
   - Complexity: Small.
   - Files: `app/lib/b2bPricing.ts`.

2. **[Component] Tier table + next-tier nudge.**
   - What: a per-box anchored tier display with a "you save" column, and a live "you are N boxes from the next tier" nudge in the order summary. No other order-page changes.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: `app/components/b2b/B2BOrderBuilder.tsx`.

## Future phases (not ticketed)

- **Phase 4: B2B social proof.** New B2B proof component: anonymised club outcomes (role + sport + squad band + KPI), aggregate counts, category/sport badges, reframed athlete usage-in-context. Gated on real, sign-off-ready figures (Revolut data plus high-level stats from other trials, to be gathered). Placeholders must not ship.
- **Phase 5: Education + ROI layer.** Bite-size "how it works / what you get" via progressive disclosure (accordions/steps), plus cost-per-athlete-per-day value framing.
- **Phase 6: Nav reachability + section analytics.** Make `/professionals` reachable in nav when ready; add light section-engagement events following the existing `app/lib/analytics.ts` pattern (alongside the existing `b2b_checkout_started` / `b2b_invoice_requested`).

## Rabbit holes

- **Shared carousel blast radius.** Avoided by extracting the cert block and building a separate B2B proof component later; we do not restyle the live home/PDP carousel.
- **Pilot section becoming a mini-app.** Keep it a presentational section, not an interactive configurator or booking system.
- **Over-engineering the tier table.** It is a clearer display of existing tiers, not a new pricing engine.

## No-gos

- No club crests, kit, stadium imagery, or "trusted by [team]" (implied-endorsement line).
- No price on the public landing page.
- No new order-page paths or checkout changes (stays clean).
- No interactive or bookable pilot flow in this wave (mailto to Harry only).
- No new product or health claims introduced anywhere.

## Risks

- **Proof-data readiness** gates Phase 4. Placeholder figures must not ship.
- **brand-clinical mobile gotcha** - the hero zeros `brand-hero-first` padding on mobile; new sections must follow the established padding pattern.
- **Athlete reframe** must keep existing claims compliant (no new claims introduced).

## References

- Live feature reference: `docs/features/b2b/B2B_PORTAL.md`
- Portal build history: `docs/development/featurePlans/b2b-professionals-portal.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md` (sections 8 Clinical Aesthetic, 12 new-section checklist)
- Brand voice: `docs/branding/BRAND_VOICE.md`
- Current code: `app/professionals/page.tsx`, `app/components/b2b/B2BOrderBuilder.tsx`, `app/lib/b2bPricing.ts`, `app/components/AthleteCredibilityCarousel.tsx`

## Jira tickets

Created in Sprint 27, assigned to Rudh, under the Website & CRO epic (SCRUM-763, drag into place on the board).

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1063 | B2B portal upgrade Phase 1: credibility backbone + hero refine | 1 | To Do |
| SCRUM-1064 | B2B portal upgrade Phase 2: pilot programme USP section | 2 | To Do |
| SCRUM-1065 | B2B portal upgrade Phase 3: order-page pricing clarity | 3 | To Do |

Future phases (4 social proof, 5 education/ROI, 6 nav + analytics) are intentionally not ticketed yet.
