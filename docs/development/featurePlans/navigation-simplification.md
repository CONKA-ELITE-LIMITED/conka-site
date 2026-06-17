# Navigation Simplification

## Problem

The site header carries high cognitive load.

- **Desktop:** 6 top-level items (the Shop button plus 5 flat links: Science, Ingredients, Case Studies, CONKA App, Our Story) with no grouping. There is also a visible gap between the bottom of the header bar and the top of the Shop mega-menu when it opens, caused by a hardcoded `top` offset.
- **Mobile:** the menu opens with three large `aspect-[4/3]` product image-cards that push everything else below the fold, followed by four numbered groups that contain duplicate links (Ingredients appears in both "Learn more" and "Science"; App links are split across "Learn more" (App Insights) and "Technology" (CONKA App)).

Users cannot tell at a glance where to find things. The goal is to reduce the number of top-level choices, group content under clear labels, and keep the product (Shop) path one obvious click away.

## Who it serves

All visitors, especially paid traffic landing on a PDP and orienting for the first time. Lower nav friction means more exploration of the proof pages (science, app, story) that support the buy decision.

## Business impact

CRO / acquisition. Clearer wayfinding to evidence pages; the product path stays prominent and standalone.

## Appetite

1-2 days (Standard).

## Approach

Reduce desktop top-level items by grouping content into a few clearly-labelled hover menus while keeping **Shop** prominent and standalone. Mirror that same information architecture on mobile with compact product rows and de-duplicated groups. Define the IA once in a shared config module so desktop and mobile cannot drift.

## Design system

brand-base clinical scope: navy `#1B2757`, zero radius, JetBrains Mono labels (`uppercase tracking-[0.2em] tabular-nums`). No new tokens. Pure Tailwind, matching the existing nav.

## Information architecture

Top-level desktop goes from 6 items to 4:

| Top-level | Type | Contains |
|-----------|------|----------|
| **Shop** (dropdown) | existing mega-menu, products only | Flow, Clear, Both |
| **Science** (dropdown) | new small text dropdown | Science, Ingredients, Case Studies |
| **App** (dropdown) | new small text dropdown | The CONKA App, App Insights |
| **Our Story** | flat link | n/a |

Decisions:
- **"Why CONKA works" is removed from the desktop nav entirely.** It already lives in the footer (`Footer.tsx:24`) and will appear in the mobile nav under the Company group.
- Removing Why CONKA from the desktop nav and moving App into its own dropdown **empties the Shop mega-menu "Learn more" sidebar**, so the Shop mega-menu becomes products-only. This is a deliberate simplification, not an oversight.

Mobile uses the identical groups with no duplicate links:
- Shop by product (Flow, Clear, Both, compact rows)
- Science (Science, Ingredients, Case Studies)
- App (The CONKA App, App Insights)
- Company (Our Story, Why CONKA)

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Shared IA config + desktop dropdowns + mega-menu gap fix | Not Started |
| 2 | Mobile compact products + de-duplicated groups | Not Started |
| 3 | Nav-click analytics + keyboard-nav polish | Future |

### Phase 1 — Shared config + desktop (ACTIVE)

1. **Shared nav config.** Extract `PRODUCTS` (currently duplicated in `ShopMegaMenu.tsx` and `NavigationMobile.tsx`) and a new `NAV_GROUPS` (Science, App, Company) into one module so the IA is defined once. Complexity: Small. Files: new `app/components/navigation/navConfig.ts`, `ShopMegaMenu.tsx`, `NavigationMobile.tsx`.
2. **Reusable `NavDropdown`.** Small self-contained hover dropdown for text links: own open state plus a 150ms close timeout, `aria-expanded` / `aria-haspopup`, Escape and click-outside to close. Mirrors the existing Shop hover pattern. Complexity: Medium. Files: new `app/components/navigation/NavDropdown.tsx`.
3. **Rebuild desktop top-level.** Replace the 5 flat `NAV_LINKS` with Shop (unchanged trigger) + Science dropdown + App dropdown + Our Story flat link. Drop the now-empty "Learn more" sidebar from the Shop mega-menu. Complexity: Small. Files: `NavigationDesktop.tsx`, `ShopMegaMenu.tsx`.
4. **Close the mega-menu gap.** Replace the hardcoded `top: 80/136px` fixed offset in `ShopMegaMenu` with positioning anchored to the actual header bottom so there is no gap, and confirm it survives the scroll-hide `translate-y` transform on the `xl:fixed` nav. Complexity: Medium. Files: `ShopMegaMenu.tsx`, possibly `NavigationDesktop.tsx`.

### Phase 2 — Mobile (ACTIVE)

5. **Compact product rows.** Switch the 3 product cards from stacked `aspect-[4/3]` image cards to compact rows (small square thumbnail plus name and one-line description) so the rest of the menu is visible without scrolling. Keep 44px+ tap targets. Complexity: Medium. Files: `NavigationMobile.tsx`.
6. **De-dupe and realign groups.** Replace the four numbered groups with Science / App / Company sourced from the shared config; remove the duplicate Ingredients link and consolidate the scattered App links. Complexity: Small. Files: `NavigationMobile.tsx`.

### Phase 3 — Future

- Nav-click analytics (Vercel Analytics event per nav item / dropdown open) to see which groups get used.
- Keyboard-navigation polish: arrow-key traversal within dropdowns, focus trapping.

## Technical decisions and rationale

- **Self-contained `NavDropdown` rather than a centralised open-menu state.** Each dropdown manages its own hover open state and closes on mouse leave, avoiding a rework of the parent `Navigation.tsx` hover/timeout state machine. Trade-off: no enforced "only one open at a time", which is acceptable because they close on leave.
- **CSS-anchored mega-menu position over JS measurement.** Prefer positioning the dropdown relative to the header container (absolute under the header) instead of a `ResizeObserver`. Only reach for measurement if CSS cannot account for the banner height.
- **Shared config first.** Consolidating the duplicated `PRODUCTS` definition is a prerequisite for keeping desktop and mobile IA in sync and is the foundation of Phase 1.

## Rabbit holes

- Centralising dropdown state into the parent for "only one open at a time" plus full keyboard nav can balloon. Keep dropdowns self-contained for now; full keyboard polish is Phase 3.
- The gap fix via JS measurement could rabbit-hole. Cap it with a clean CSS absolute-positioning approach.
- Animations: match the existing instant/simple reveal. No elaborate transitions.

## No-gos

- No route changes, no new pages, no copy rewrites on destination pages.
- No imagery in the Science/App dropdowns (text links only; Shop stays the only mega-menu).
- Logo / account / cart cluster untouched.
- Banner untouched.

## Risks and edge cases

- **Accessibility:** new dropdowns need `aria-expanded`, Escape-to-close, and focus handling. Mirror the existing Shop button.
- **Scroll-hide transform:** the desktop nav is `xl:fixed` with a `translate-y` hide on scroll-down. The gap fix must not break that.
- **Mobile overlay scroll** must still work after compacting the product section.

## References

- `app/components/navigation/Navigation.tsx` (orchestrator, hover/timeout state)
- `app/components/navigation/NavigationDesktop.tsx`
- `app/components/navigation/NavigationMobile.tsx`
- `app/components/navigation/ShopMegaMenu.tsx`
- `app/components/footer/Footer.tsx` (already has the Why CONKA link)
- `.claude/rules/components.md`, `docs/branding/DESIGN_SYSTEM.md`, `docs/branding/MOBILE_OPTIMIZATION.md`

## Jira

| Ticket | Title | Phases | Status |
|--------|-------|--------|--------|
| SCRUM-1093 | [Website & CRO] Navigation: simplify header IA (grouped desktop dropdowns + compact de-duplicated mobile menu) | 1 + 2 | To Do |
</content>
</invoke>
