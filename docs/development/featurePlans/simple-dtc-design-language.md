# Simple DTC Design Language

**Status:** Phases 1–2 active, Phase 3 future
**Owner:** Rudh
**Branch:** `pdp-hero-simple-dtc`
**Related Jira:** SCRUM-1172 (Formalize "Simple DTC" design language), split from SCRUM-1171 (PDP hero Simple DTC reposition). This plan supersedes and expands 1172's original "docs-only" framing.
**Design system:** `app/brand-base.css` (the only system; `premium-base.css` is deleted).

---

## Problem

The design system has evolved through three stages: premium (Soft-Tech Luxury) → clinical → **Simple DTC**. Simple DTC is the intended forward direction (black type, standard sans, one navy accent, minimal chrome) but it has never been written down. So every component author still reaches for the clinical playbook (mono eyebrows, uppercase letter-tracking, muted grey text tiers, hard-coded navy), and new work drifts back toward the stage we are leaving.

There is no source of truth to point a component conversion at, and the docs themselves are stale: they still reference `premium-base.css` (deleted), "Soft-Tech Luxury", and `--premium-radius-*` tokens that no longer exist.

## Why it matters

Indirectly this serves all paid traffic (a cleaner, less noisy conversion surface). Directly it serves velocity: it turns component simplification into a repeatable, near find-and-replace operation instead of a per-file judgment call, and stops new work from regressing to the clinical aesthetic. Retention/velocity play, not a direct CRO lever.

## Approach

Document the language and reconcile the stale docs first (this is SCRUM-1172 Parts A+B), then seed a **minimal, additive** token/utility layer in `brand-base.css` so components can be converted against real tokens rather than prose. The full component sweep (394 hard-coded navies across ~203 component files) and the stylesheet consolidation stay iterative and future. The design-system doc hardens as components actually convert, rather than trying to nail every specific up front.

## The Simple DTC rules (what gets documented)

The forward direction, captured from the reference implementation (`ProductBuyPanel`, `ProductHeroV2` on `/conka-flow`):

- **Black type, not grey tiers.** Prefer solid black for primary copy. Retire the `text-black/50–/75` opacity ramp as the default; reserve low-opacity greys for genuinely secondary metadata only.
- **Standard sans, not mono eyebrows.** Drop the JetBrains Mono eyebrow / sub-line / uppercase-tracking pattern (`font-mono ... tracking-[0.18em]`) on consumer conversion surfaces. Use the primary sans at a normal weight/size. Note (see learnings): mono is not banned outright. What Simple DTC kills is the *faded, uppercase, wide-tracked* eyebrow; mono may stay on a compact data/spec micro-label (e.g. an ingredient's `Category | form` tag) as long as it is solid black, not a muted grey.
- **Drop decorative eyebrows and uppercase micro-labels** where they add chrome without information.
- **One accent: neural blue.** The navy `#1B2757` is the single accent. It should come from a token, not a hard-coded literal.
- **Reduce styling noise** generally: fewer borders, fewer nested boxes, less letter-spacing fiddling, simpler structure.

## Per-surface authority

Simple DTC is added **alongside** Clinical (DESIGN_SYSTEM.md §8) and App-Dark (§10), not as a global replacement. Default split (adjust as surfaces convert):

| Surface group | Language |
|---------------|----------|
| Home, PDPs (`/conka-flow`, `/conka-clarity`), landing / funnel / `/go`, top-of-funnel `/professionals` | **Simple DTC** |
| Science / evidence-dense modules, `/app` dark pages (§10 App-Dark) | Clinical / App-Dark (mono + opacity ramp earns its place on dense data) |
| Account, subscription management, B2B order/management UIs | Clinical for now (mono data labels aid scanning); convert opportunistically |

## Learnings log

Captured as components convert; feeds the eventual DESIGN_SYSTEM.md section.

- **First conversion: the PDP ingredients section** (`app/components/product/ClinicalIngredients.tsx`, live on `/conka-flow`, `/conka-clarity`, `/conka-both`) is the current reference for what Simple DTC looks like in practice.
- **Mono is a scalpel, not a blanket ban.** The category tag was kept in mono but flipped to solid black. The rule that reads well: kill the faded uppercase wide-tracked *eyebrow*; keep mono only where it labels compact data, and only in black. The sweep must not blanket-delete every `font-mono`.
- **Clip corners are a clinical tell.** `lab-clip-tr` (angled corner) reads clinical; Simple DTC uses a soft `rounded-2xl`. Same for `[+]/[-]` mono toggles, which became a rotating chevron.
- **Header shape.** Drop the mono eyebrow and the grammage-led H1; lead with a plain `brand-h1` title + `brand-body` description in solid black. Section titles use `brand-h1` to match sibling sections (do not down-size to `brand-h2`).
- **Conversions surface shared primitives.** Converting the ingredient rail exposed a reusable `DotIndicator` (`app/components/DotIndicator.tsx`), now shared by the CRO testimonials rail and the PDP ingredients rail. A dead, legacy `premium/PremiumDotIndicator` was folded into it and renamed off the "Premium" prefix. Expect the sweep to keep consolidating like this, which validates the "consolidate after conversions" ordering rather than up front.
- **Navy is still a literal.** Components hard-code `#1B2757` (dots, focus ring, key-finding stat). Confirms the Phase 2 need for a Layer-1 navy token; deferred deliberately until more surfaces convert.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Define & reconcile: write the Simple DTC section in DESIGN_SYSTEM.md, fix stale premium-base / Soft-Tech Luxury / `--premium-radius-*` refs | Not Started |
| 2 | Seed the token layer: minimal additive Simple DTC tokens/utilities in brand-base.css, proven against the reference component | Not Started |
| 3 | Iterative sweep + consolidation: convert components surface-by-surface, then prune unused clinical classes and dedupe | Future |

### Phase 1 — Define & reconcile (ACTIVE)

1. **Docs — Simple DTC section in DESIGN_SYSTEM.md.** Add §8.5 (above or beside Clinical §8): the premium → clinical → Simple DTC lineage, the rules above, the per-surface authority table, and a pointer to the reference implementation. Complexity: Medium. Files: `docs/branding/DESIGN_SYSTEM.md`.
2. **Docs — reconcile lagging refs.** Remove/replace stale mentions of `premium-base.css` (deleted), "Soft-Tech Luxury", and `--premium-radius-*`; fix the "premium-base is a stub" note (the file is deleted, not a stub). Complexity: Small–Medium. Files: `docs/branding/DESIGN_SYSTEM.md`, `CLAUDE.md`, `.claude/rules/components.md`, relevant skill docs.

### Phase 2 — Seed the token layer (ACTIVE)

3. **CSS — additive Simple DTC tokens.** Promote the navy to a Layer-1 `--brand-navy` token (currently only exposed as `--brand-accent` inside `.brand-clinical`); add a navy text/bg utility and a plain (sans, non-mono, non-uppercase) eyebrow/label helper. Additive only — do not restructure existing clinical classes. Complexity: Small. Files: `app/brand-base.css`.
4. **Component — prove tokens on the reference.** Align `ProductBuyPanel` + `ProductHeroV2` / `ProductHeroMobileV2` (in flight on this branch) to the new tokens: swap literal `#1B2757` → token, mono eyebrow → plain helper, grey tiers → black. This becomes the canonical worked example the doc links to. Complexity: Medium. Files: `app/components/product/ProductBuyPanel.tsx`, `ProductHeroV2.tsx`, `ProductHeroMobileV2.tsx`.

### Phase 3 — Iterative sweep + consolidation (FUTURE)

Convert components surface-by-surface to the tokens (batched by the authority table above). Once patterns settle, prune the now-unused clinical mono classes and dedupe the stylesheet. This is the "consolidate the stylesheet after" step, deliberately deferred until conversions reveal the final token set. Scale reference: `font-mono` ~171 occurrences, hard-coded `#1B2757` ~394 across 105 files, `text-black/50–75` ~122, `tracking-[0.` ~170 — a repo-wide sweep, not a handful of files.

## Rabbit holes

- **Turning Phase 2 into the sweep.** 394 hard-coded navies is a gravity well. Phase 2 touches only the reference component to validate the tokens; everything else is Phase 3.
- **Over-tokenizing.** Resist a full type-scale rework. Seed the two or three tokens the sweep actually needs; add more as conversions reveal them.
- **Deprecating clinical prematurely.** Clinical §8 and App-Dark §10 stay valid for the surfaces that keep them.

## No-gos

- No repo-wide component sweep in this scope.
- No stylesheet pruning/consolidation yet (post-sweep, Phase 3).
- No new Jira tickets; tracked in this plan doc. SCRUM-1172 already exists and this plan expands its docs-only framing.

## References

- `docs/branding/DESIGN_SYSTEM.md` — target doc; §8 Clinical, §10 App-Dark, §11 legacy migration
- `app/brand-base.css` — the live token system (Layer 1 base, Layer 2 clinical, Layer 2.5 app-dark, Layer 3 deprecated stubs)
- `app/components/product/ProductBuyPanel.tsx` — reference capture of the Simple DTC direction
- `app/components/product/ProductHeroV2.tsx`, `ProductHeroMobileV2.tsx` — reference hero (in flight on `pdp-hero-simple-dtc`)
- SCRUM-1171 (PDP hero reposition), SCRUM-1172 (this docs/formalization work)
