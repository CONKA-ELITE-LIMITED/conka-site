# Simple DTC Design Language

**Status:** Re-scoped 2026-07-27 into three sequenced tickets - see "Current plan" below. Prior Phases 1-2 fold into it.
**Owner:** Rudh
**Branch:** `pdp-hero-simple-dtc` (original); re-scope + doc work on `chore/branding-docs-cleanup`.
**Related Jira:** SCRUM-1172 (Formalize "Simple DTC" design language), split from SCRUM-1171 (PDP hero Simple DTC reposition). This plan supersedes and expands 1172's original "docs-only" framing.
**Design system:** `app/brand-base.css` (the only system; `premium-base.css` is deleted).

---

## Current plan (2026-07-27 re-scope)

Re-scoped with Rudh into three sequenced tickets: **align the reference components first, then document the aligned reality, then propagate.** Documenting after aligning means the docs describe shipped truth with zero target-vs-actual gap, which is what makes the propagation pass mechanical instead of a per-page judgment call.

The three aligned reference surfaces that define the direction: **home** (`app/page.tsx`), **PDP** (`/conka-flow`, `ProductHeroV2` + `ProductBuyPanel`), and the **cart drawer** (`CartDrawer.tsx`). They agree at the macro level (sans, `brand-h1`, navy, `brand-section`/`brand-track`) but diverged at the micro level; the ratified decisions below resolve those.

### Ratified grammar decisions

**Radius - one language, borrowed from the purchase panel.** This SUPERSEDES the `rounded-2xl` guidance in the learnings log further down (the Magic Mind soft-card recipe): reference to MM shows tighter corners, so the soft cards get pulled DOWN to the commerce-control radius rather than the controls being pushed up.

| Element | Radius |
|---|---|
| Pills / buttons / nav / radios | `rounded-full` |
| Cards (content AND commerce) | `rounded-md` |
| Inner tiles / spec badges / standalone sub-elements | `rounded-lg` (kept equal-or-tighter than the parent when nested inside a card, so nothing inner looks rounder than its container) |

Nothing on acquisition surfaces is sharp (0px); zero radius stays clinical-only. Concretely: home `rounded-2xl` cards and cart `rounded-xl` tiles come down to `rounded-md`; the PDP purchase panel (`rounded-md`) is already correct and is the anchor.

**Colour.** Savings / positive = single green `#1a7f4f` (the `--brand-positive` token) everywhere; the PDP FlatPlanCard `#10B981` / `#0b7a55` is retired. Navy `#1B2757` = primary + decorative fill, sourced from a token (`--brand-navy`, to be seeded in T2). Open call inside T1: the PDP plan-tile gold `#C9A24A` "Save %" chip may be a deliberate premium accent rather than a savings signal - decide keep-gold vs go-green during the audit, do not blanket-green it.

**Typography / mono.** Sans (`--font-brand-primary`), solid black for anything a user reads. Mono is a scalpel: small, solid-black micro-badges that are scanned only (time-of-day, verified-buyer). Pare the PDP's data-label mono (eyebrow, struck price, per-shot, save chip) back to sans. Confirms the existing learnings-log rule.

### The three tickets

| # | Ticket | Scope | Status |
|---|--------|-------|--------|
| 1 | Align core Simple DTC components | Audit + name the lead variant per generic component type, then reconcile home + PDP + cart to it: radius to the `rounded-md` scale above, savings to `#1a7f4f`, mono to scalpel, and consolidate the PDP plan-card implementations (legacy `PlanSelector` banners vs `FlatPlanCard`) into one. Code + per-surface visual review. | ACTIVE |
| 2 | Document the ratified direction | Expand DESIGN_SYSTEM.md §8.5 to canonical with the concrete grammar + a "clinical to Simple DTC" mechanical mapping table; reframe `brand-base.css` so Simple DTC reads as the default and clinical as the opt-in scope; seed `--brand-navy`; fix all drift (below). Starts when T1 merges, so it documents shipped reality. | Next |
| 3 | Propagate + clean up other pages | Parent only. Per-page children cut once T2's mapping table exists. Convert the 24+ clinical pages surface-by-surface per the authority table. | Future |

### Drift to fix in Ticket 2 (verified this pass)

- `/protocol/[id]` listed as a live clinical page in DESIGN_SYSTEM.md §8 and the `brand-base.css` Layer 2 comment - the route is deleted.
- The "pages carrying `.brand-clinical`" list undercounts reality (~13 documented vs 24+ actual; missing `account/*`, `blog/*`, `faq`, `conka-both`, `professionals/*`).
- Dead doc links: `.claude/rules/pages.md` points at `SOFT_TECH_LUXURY_STYLE_SHEET_GUIDELINES.md` (missing); DESIGN_SYSTEM.md §13 points at `WEBSITE_SIMPLIFICATION_PLAN.md` (missing; the live doc is `CODEBASE_AUDIT_AND_ROADMAP.md`).
- `.claude/rules/components.md` says cards use `var(--brand-radius-card)` (32px) - contradicts the ratified `rounded-md` and the shipped Tailwind-utility approach.
- DESIGN_SYSTEM.md §8 lists `/funnel` as clinical while the §8.5 authority table assigns it to Simple DTC - resolve the contradiction.

### Jira tickets

| Key | Title | Ticket | Status |
|-----|-------|--------|--------|
| SCRUM-1181 | Align core Simple DTC components (radius, savings green, mono) | 1 | Done |
| SCRUM-1182 | Document the ratified Simple DTC direction (DESIGN_SYSTEM + brand-base.css) | 2 | Done |

T3 (propagate to the 24+ clinical pages) is ticketed when it goes active, per the active-only rule. It follows the "Clinical to Simple DTC" mapping table now in DESIGN_SYSTEM.md §8.5.

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
- **The soft card recipe (Magic Mind aligned).** The converted home product tiles (`app/components/home/ProductCard.tsx`) settled a reusable card shape: `rounded-2xl` shell with a single hairline `ring-1 ring-black/8` (not a `border-2`), the product asset on a soft `#eef1f8` surface, and **centred** content. Hierarchy is name-as-hero (big bold black) then rating, then a role pill flanked by hairlines (the MM `line, pill, line` treatment), then description, then a destyled stat trio (solid-black values, quiet grey labels, no mono grid). `LandingProductShowcase` and `AthleteCredibilityCarousel` were aligned to the same recipe.
- **`#eef1f8` is the soft surface/track tint.** The light stop of the hero SpecBadge gradient doubles as the standard soft fill for asset backgrounds, pills, and toggle tracks, paired with the navy `#1B2757` accent. It reads cleaner than the warm `#f0efea` bone once a surface has converted; the warm track was retired from the shared toggle.
- **Star ratings: fractional fill, not five solid stars.** A grey base row plus a navy fill layer clipped to `rating/5` (`overflow-hidden` + `width` %) makes distinct values legible (Flow 4.8, Clear 4.6, Both 4.7). Five solid stars hide the number. The label mirrors the PDP hero (`4.8 (373 reviews)`).
- **Rounded nav replaces the chamfer.** Overlaid carousel arrows moved from chamfered navy (`lab-clip-tr`) to `rounded-full` navy buttons with round chevron caps. Active thumbnails use a soft `ring-2` (not `border-2`); watch the gotcha that an `overflow-x-auto` scroller also clips vertical overflow, so an active ring needs `py-1` breathing room or it clips top and bottom.
- **Second shared primitive: `SegmentedToggle`** (`app/components/SegmentedToggle.tsx`). Consolidated the home product-grid filter and the Flow/Clear `FormulaToggle` into one navy-active pill on the `#eef1f8` track; `FormulaToggle` is now a thin wrapper adding the time-of-day glyphs and labels. Two rules learned: the unselected tab must be a muted-grey label on the track, never a white fill (reads as a second selected state); and, as with `DotIndicator`, the primitive fell out of converting real surfaces, reinforcing the "consolidate after conversions" ordering over designing it up front.
- **Native `<details>` for show/hide, not `useState`.** The home App USP section (`app/components/home/AppUSPSection.tsx`) converted from a clinical tabbed explorer (mono eyebrows, a "Fig." plate, `border-black/12`, the grey ramp) into a static what/why/edge accordion. Use native `<details name="...">` with a chevron on `group-open:rotate-180`, following the existing `CROFAQv2` pattern: it stays a Server Component with zero client JS. Prefer this over a `useState` tab/accordion whenever the interaction is just expand/collapse.
- **Static-first pays off at conversion time.** Once a converted section drops its client state, switch its page import from `dynamic()` to a direct server import and delete the now-stale loading skeleton (the home page's own comment, "pure server components, direct import", is the rule). AppUSP made this jump.
- **Single-athlete "simple review" beat + the white-cutout tint trick.** A Magic Mind `simple-review` homage (`app/components/AthleteReviewFeature.tsx`): one cutout portrait beside a large bold-black quote, name, and stacked black credentials; two-column on desktop, image-over-quote on mobile. Key reusable technique: the roster cutouts are white-background JPGs (`*NB.jpg`) that cannot sit on the `#eef1f8` panel without showing a white block, so `mix-blend-multiply` on the image dissolves the white into the tint (white * tint = tint) and it floats like a transparent PNG, darkening the subject only a few percent because the tint is near-white.
- **Proof rows are self-contained bands, not merged into unrelated components.** The four certification badges were pulled out of `LandingProductShowcase` into a standalone `Certifications` component (`app/components/Certifications.tsx`): a centred, responsive four-across row that owns its own background via a `background` prop defaulting to the `--brand-white` token, so it drops straight under any section. Rendered under the benefit tiles on home and all three PDPs. An earlier attempt to bake the certs into `ProductBenefitTiles` was rejected as too coupled.
- **Shared components vary by a typed `formula` prop, not per-page image props.** `ProductBenefitTiles` takes `formula` (`flow` default, `clear`) that selects the matching ingredient render pair (Clear shows lecithin/vitamin C, Flow and Both keep rhodiola/turmeric), keeping `topImage`/`bottomImage` as overrides. Pair render swaps with `sizes` on the decorative poke images so mobile stops fetching the desktop-width asset.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Define & reconcile: write the Simple DTC section in DESIGN_SYSTEM.md, fix stale premium-base / Soft-Tech Luxury / `--premium-radius-*` refs | **Done (SCRUM-1172)** |
| 2 | Seed the token layer: minimal additive Simple DTC tokens/utilities in brand-base.css, proven against the reference component | In progress — green `--brand-positive` seeded (SCRUM-1172); navy token + label utility + component proof still pending |
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
