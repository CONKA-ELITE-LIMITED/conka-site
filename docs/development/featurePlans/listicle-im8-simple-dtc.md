# im8 Listicle Template to Simple DTC

Cosmetic alignment of the `im8` listicle template (`/go/[slug]` pages using `template: "im8"`) to the Simple DTC design language, per `docs/branding/DESIGN_SYSTEM.md` section 8.5. Part of the Simple DTC programme (parent Jira **SCRUM-1183**). Styling only: zero functionality, config, copy, or analytics change.

## Problem

The `mm` listicle template (`SimpleListicleRenderer`) is already Simple DTC (why-conka was copied from it). The `im8` template (`ListicleRenderer`) is still the old "Soft-Tech Luxury" bone + navy + uppercase-eyebrow look: hardcoded `#1B2757` navy headings / pills, `#0e1f3f` dark, uppercase mono-style eyebrows (`tracking-[0.08/0.1/0.18em]`), bone / soft-blue tints. Three live paid ad pages run on im8, so their grammar is out of step with the rest of the site.

## Who it serves / business impact

Paid ad traffic landing on the three im8 pages. This is a live acquisition surface, so the work is a faithful grammar alignment only: no layout, hierarchy, or copy change, so conversion behaviour is not disturbed. Consistent DTC grammar across landers reinforces the brand and removes the premium/clinical mismatch.

## Scope decision (approved)

**Full alignment** (chrome + shared graphics via variants), as a standalone ticket under SCRUM-1183. The im8 renderer composes ~15 `components/landing/*` graphics that are also used by other live paid landers (`/lander`, `/start`, `/lander-b`) and some by home / PDPs. To align im8 without changing those, each shared graphic that carries clinical/premium tells gets a DTC **variant** (opt-in prop); im8 passes the DTC variant, all other consumers keep their current look untouched. Graphics that are already design-neutral need no variant.

## Design language decision

Simple DTC per the section 8.5 mapping table: navy `#1B2757` headings to `text-black`, `#0e1f3f` to `text-black`, drop uppercase mono eyebrows (lead with plain `brand-h1` + `brand-body`), bone / soft-blue tints to white / `--brand-tint`, radius on the DTC scale (`rounded-md` cards, `rounded-full` pills, `rounded-lg` standalone tiles), primary / decorative navy via `--brand-navy` token, savings / positive via `--brand-positive` green. Resolves the hardcoded-hex colour question flagged in SCRUM-1176 by moving to tokens.

## Surface area

| Kind | Files |
|------|-------|
| im8 renderer (chrome) | `app/components/go/listicle/ListicleRenderer.tsx` |
| Go shell | `app/go/[slug]/page.tsx`, `app/go/layout.tsx`, `app/go/[slug]/error.tsx` (check for `.brand-clinical` to drop) |
| im8 hero | `app/components/go/listicle/ListicleProductHero.tsx` |
| Listicle proof tier (shared mm + im8) | `app/components/go/listicle/ListicleProofTier.tsx` (+ `ListicleLogoBand`) |
| Shared landing graphics (variant, not in-place) | `components/landing/*`: `LaurelBadge`, `CrashChart`, `CognitionBars`, `ScoreByGroup`, `AthleteQuoteCard`, `IngredientGrid`, `DayEnergyCurve`, `FocusBars`, `MeasureTile` / `AppMeasureSection`, `ResearchBackedGraphic`, `SymptomExplainer`, `SegmentToggle`, `LogoMarquee`, `UGCMarquee` |

`mm` template (`SimpleListicleRenderer`) is already DTC and out of scope. `home/ProductGrid` is already DTC and shared site-wide; do not touch.

### Live im8 pages (blast radius)

- `/go/adhd-listicle`
- `/go/productivity-listicle`
- `/go/brain-ageing-listicle`

Other live consumers of the shared graphics that must stay visually unchanged: `/lander`, `/start`, `/lander-b`, home, PDPs.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | im8 chrome + go shell + im8 hero + listicle proof tier | Not Started |
| 2 | Shared graphics to DTC variants, batch A (proof / stat / data-viz panels) | Not Started |
| 3 | Shared graphics to DTC variants, batch B (badges / marquees / toggles / explainers) | Not Started |
| 4 | Regression pass + docs | Not Started |

All phases active. Ship each phase independently. Single Jira ticket; phases are the internal build order.

### Phase 1 - im8 chrome + shell
1. **ListicleRenderer chrome** - navy `#1B2757` headings/pills to `text-black` / `--brand-navy` per DTC rules, drop uppercase mono eyebrows, bone/soft-blue tints to white / `--brand-tint`, DTC radius scale. Medium. `app/components/go/listicle/ListicleRenderer.tsx`
2. **Go shell** - drop `.brand-clinical` if present on the go layout/route; ensure DTC canvas. Small. `app/go/layout.tsx`, `app/go/[slug]/page.tsx`
3. **im8 hero + proof tier** - `ListicleProductHero` and `ListicleProofTier` to DTC grammar (rounded, sans, tokens). ProofTier is shared with the already-DTC mm template, so DTC alignment is consistent for both. Medium. `ListicleProductHero.tsx`, `ListicleProofTier.tsx`

### Phase 2 - Shared graphics, batch A
1. **Data-viz / stat panels** - audit each; where it carries navy/mono/premium tells add a `variant="dtc"` (or equivalent) opt-in prop and have `ListicleRenderer` pass it; skip if already neutral. Other consumers keep the default. Large. `components/landing/{CrashChart,CognitionBars,ScoreByGroup,FocusBars,DayEnergyCurve,MeasureTile,AppMeasureSection,ResearchBackedGraphic}.tsx`

### Phase 3 - Shared graphics, batch B
1. **Badges / marquees / toggles / explainers** - same variant approach. Large. `components/landing/{LaurelBadge,IngredientGrid,AthleteQuoteCard,SymptomExplainer,SegmentToggle,LogoMarquee,UGCMarquee}.tsx`

### Phase 4 - Regression + docs
1. **Regression** - verify `/lander`, `/start`, `/lander-b`, home, PDPs are visually unchanged (the variant default path), and the 3 im8 pages render correctly at 390px and desktop. Medium.
2. **Docs** - note im8 listicle moved to Simple DTC in the section 8.5 authority table. Small. `docs/branding/DESIGN_SYSTEM.md`

## Rabbit holes

- **Shared-component variants are the whole risk.** Any in-place edit to a `components/landing/*` graphic changes `/lander`, `/start`, `/lander-b` too. Always add an opt-in variant; never restyle the default path. Regression-check the other consumers per component.
- **Variant sprawl.** Not every graphic needs a variant. Audit first; a design-neutral chart needs no change. Add a variant only where a clinical/premium tell is present.
- **Overlap with in-flight tickets.** SCRUM-1176 (proof-tier rebuild + FAQ unify + colour-token decision) and SCRUM-1187 (productivity hero reposition) touch the same im8 surface. Do the DTC alignment first so those rebuilds land on the aligned grammar; cross-noted on both tickets.

## No-gos

- No functionality, config, copy, or analytics change. Do not touch the analytics wiring (`listicleAnalytics.tsx`) or the block ids (`${kind}_${index}`).
- Do not edit listicle data/config: `app/lib/landings/*` (registry, `listicle-types.ts`, `general-listicle.ts`, `adhd-listicle.ts`, `productivity-listicle.ts`, `brain-ageing-listicle.ts`, `videoTrio.ts`), `app/lib/faqContent.ts`.
- Do not restyle the shared landing graphics on their default path (only via opt-in variant). Do not touch `mm` (`SimpleListicleRenderer`) or `home/ProductGrid` (already DTC).

## Risks

- Live paid traffic: keep the change grammar-only (no layout / hierarchy / copy change) so conversion is not disturbed; worth monitoring the 3 pages post-deploy.
- Regression surface on 3 other live landers via the shared graphics; the variant default path is the guard.
- Mobile 390px review per im8 page.

## References

- Grammar: `docs/branding/DESIGN_SYSTEM.md` section 8.5 (mapping table + authority table)
- Listicle system: `docs/features/LISTICLE_SYSTEM.md`
- Reference DTC listicle: `app/components/go/listicle/SimpleListicleRenderer.tsx` (mm, already DTC)
- Variant pattern precedent: `AppInstallButtons` `dtc` variant (SCRUM-1184)
- Parent programme ticket: SCRUM-1183; overlapping: SCRUM-1176, SCRUM-1187

## Jira

| Ticket | Title | Scope | Status |
|--------|-------|-------|--------|
| SCRUM-1189 | [Frontend] Convert im8 listicle template to Simple DTC | im8 template, all 4 phases | To Do |

Subtask of the programme parent SCRUM-1183. Overlap cross-noted on SCRUM-1176 (proof-tier rebuild + colour decision) and SCRUM-1187 (productivity hero reposition): do SCRUM-1189 first so those rebuilds land on the aligned grammar.
