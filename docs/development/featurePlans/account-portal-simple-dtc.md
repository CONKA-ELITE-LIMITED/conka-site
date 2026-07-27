# Account Portal to Simple DTC

Cosmetic conversion of the logged-in customer portal from Clinical to Simple DTC, per `docs/branding/DESIGN_SYSTEM.md` section 8.5. Part of the Simple DTC programme (parent Jira **SCRUM-1183**). Styling only: no behaviour, copy, analytics, or commerce-logic change.

## Problem

The logged-in customer portal is still Clinical (zero radius, mono micro-labels, `lab-clip-tr` chamfers, navy-interactive-only) while the rest of the customer-facing site has moved to Simple DTC. Subscribers spend their post-purchase life in the portal (managing plans, checking orders), so a spec-sheet feel undercuts the warmer brand they bought into.

## Who it serves / business impact

Existing paying subscribers. This is a **retention / LTV** surface, not paid acquisition. Simple DTC's rounded, plain-language legibility makes self-serve plan management easier to read and act on, reducing confusion-driven support contacts and churn friction. This supersedes the older "convert opportunistically, low priority" framing in the section 8.5 authority table: the portal is the surface customers see most after they buy, so alignment matters.

## Approach

Mechanical clinical to DTC restyle per the section 8.5 mapping table, surface by surface. Markup / className only. Every portal component is account-only (no shared-with-excluded risk found), so all changes are in-place except the two site-wide externals, which are handled via props.

## Design language decision

**Simple DTC.** Drop `.brand-clinical` from the account route roots entirely (the audit found no `--brand-radius-*` reliance in the portal, so removing the scope is safe and cleaner). Radius set with Tailwind (`rounded-md` cards, `rounded-full` pills/buttons, `rounded-lg` standalone badges); colours from the Layer 1 tokens `--brand-navy` (`#1B2757`) and `--brand-positive` (`#1a7f4f`). This aligns with the site-wide move away from Clinical.

### Mechanical map applied (section 8.5)

| Clinical | Simple DTC |
|----------|-----------|
| `.brand-clinical` zero radius | remove scope; Tailwind `rounded-md` / `rounded-full` / `rounded-lg` |
| mono eyebrow (`font-mono uppercase tracking-[0.18em]` low-opacity) | drop; plain `brand-h1` + `brand-body` solid black |
| section title `text-[#0e1f3f]` / navy | `text-black` |
| mono data labels a user READS (order no., dates, prices, plan qty) | sans, solid black |
| mono micro-badge a user SCANS (status) | keep mono, solid black, `text-[9px]`, `tracking-[0.12em]` |
| navy interactive-only | filled `--brand-navy` as primary AND decorative |
| no shadows | soft `shadow-[0_2px_12px_rgba(0,0,0,0.08)]` + `ring-1` on lifted cards |
| `lab-clip-tr` chamfer, `[+]/[-]` mono toggles | `rounded-full` buttons, rotating chevron |
| savings / positive value | green `--brand-positive` at `/10` tint |
| `ConkaCTAButton` mono meta line | pass `meta={null}` |

## Surface area (per route)

`/login` and `/register` live under `app/account/login/` and `app/account/register/`.

| Route | Page file | Components |
|-------|-----------|-----------|
| `/account` | `app/account/page.tsx` | `account/AccountSubNav`, `account/NextDeliveryHero`, `account/HairlineSpecStrip`, `account/ActiveOrderCard`, `landing/ConkaCTAButton` (prop), `ContactSupportLink` |
| `/account/orders` | `app/account/orders/page.tsx` | `orders/OrdersPageHeader`, `orders/OrderSummaryStats`, `orders/EmptyOrdersState`, `orders/OrderCard`, `orders/OrdersHelpCard` |
| `/account/subscriptions` | `app/account/subscriptions/page.tsx` | `subscriptions/*`: `SubscriptionCard`, `PastSubscriptionCard`, `SubscriptionsPageHeader`, `SubscriptionSummaryStats`, `EmptySubscriptionsState`, `SubscriptionsHelpCard`, and 8 modals (Cancellation / Pause / Reschedule / Resume / Edit / MultiLineEdit / Reactivate / PlaceOrder) |
| `/account/details` | `app/account/details/page.tsx` | `account/AccountSubNav`, `account/EditProfileModal` |
| `/login` | `app/account/login/page.tsx` | `navigation` only |
| `/register` | `app/account/register/page.tsx` | `navigation` only |

`AccountSubNav` is shared across the four main account routes (one edit aligns the frame everywhere).

### Clinical-tell concentration (from audit)

Heaviest: `app/account/page.tsx`, `app/account/details/page.tsx`, `EditProfileModal.tsx`, `NextDeliveryHero.tsx` (portal's only `lab-clip-tr`), `ActiveOrderCard.tsx`. The `orders` and `subscriptions` **pages** are already near-neutral; their weight lives in child components. No `rounded-2xl`/`rounded-xl`, no `text-[#0e1f3f]`, no `--brand-radius`, no `brand-data-label` literals found in the portal.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Shell + dashboard | Not Started |
| 2 | Orders | Not Started |
| 3 | Subscriptions (list + 8 modals) | Not Started |
| 4 | Details + auth entry + docs | Not Started |

All phases are active (the whole portal is in scope). Ship each phase independently so the portal is never half-broken. Tracked as a single Jira child ticket; phases are the internal build order.

### Phase 1 — Shell + dashboard
1. **AccountSubNav** (do first) — mono to sans labels, `rounded-full` active pill, focus ring. Small. `app/components/account/AccountSubNav.tsx`
2. **Dashboard + hero** — drop `.brand-clinical`; `NextDeliveryHero` chamfer to `rounded-md` + soft shadow; next-delivery date/qty mono to sans solid black; navy literals to `--brand-navy`. Medium. `app/account/page.tsx`, `components/account/{NextDeliveryHero,HairlineSpecStrip,ActiveOrderCard}.tsx`
3. **Dashboard CTA** — `meta={null}` on `ConkaCTAButton`. Small. `app/account/page.tsx`

### Phase 2 — Orders
1. **Order components** — `rounded-md` cards + `ring-1` / soft shadow; order number / date / total mono to sans; status stays a scan-badge (mono `text-[9px]` solid) or DTC pill per the read-vs-scan rule. Medium. `components/orders/*`, `app/account/orders/page.tsx`

### Phase 3 — Subscriptions
1. **List surfaces** — cards / header / stats / empty / help: rounded cards, sans data, navy tokens, green `--brand-positive` for savings/positive. Medium. `components/subscriptions/{SubscriptionCard,PastSubscriptionCard,SubscriptionsPageHeader,SubscriptionSummaryStats,EmptySubscriptionsState,SubscriptionsHelpCard}.tsx`
2. **Modal family** — restyle 8 modals to rounded + soft shadow; `[+]/[-]` / chamfer to `rounded-full` / chevron. **Markup only** — leave `ProductSelectorPanel` / `PlanPreviewBar` / `EditSubscriptionModal` commerce logic untouched. Large. `components/subscriptions/*Modal*.tsx`

### Phase 4 — Details + auth + docs
1. **Details + profile edit** — rounded inputs / cards, sans labels, navy tokens. Medium. `app/account/details/page.tsx`, `components/account/EditProfileModal.tsx`
2. **Auth entry** — `/login` + `/register` form restyle (rounded inputs / buttons, drop mono, focus rings). Small. `app/account/login/page.tsx`, `app/account/register/page.tsx`
3. **Docs** — update DESIGN_SYSTEM.md section 8.5 authority table (Account to Simple DTC) + section 8 brand-clinical page list. Small. `docs/branding/DESIGN_SYSTEM.md`

## Rabbit holes

- **Subscription modals carry commerce logic** (PROTOCOL_VARIANTS, plan selection). Restyle markup only; do not refactor logic or tidy the protocol / pause code (it is quarantined pending the subscriber audit, see `project_protocol_subscriber_audit`). This is where scope explodes if unguarded.
- **Mono to sans per-label judgment.** Data a user reads goes sans; only true scan-badges (status) keep the mono scalpel. Follow the read-vs-scan rule; do not redesign each label.
- **Modal density shift.** Rounded + shadow can change heights. Keep structure; swap grammar only.

## No-gos

- No behaviour, copy, analytics, or commerce-logic change.
- Do not edit the ring-fenced files: subscription / order utils (`app/account/subscriptions/utils.ts`, `app/account/orders/utils.ts`), `app/api/subscriptions/**`, `app/api/auth/subscriptions/**`, `app/lib/legacy/protocolSubscriptions.ts`, `app/lib/{subscriptionProduct,productMetadata,productData}.ts`.
- Do not edit shared `navigation` or `landing/ConkaCTAButton` components; drive via props.
- Do not touch excluded surfaces (`/science`, `/app`, `/app-insights`, B2B order/management UI).

## Risks

- Subscriptions is the highest-value surface and the largest phase; re-verify every modal and card state (active / paused / past / empty) after restyle.
- Mobile 390px review per route (portal is used on phones).

## Commerce logic to ring-fence (avoid)

`app/lib/legacy/protocolSubscriptions.ts`; `app/lib/{subscriptionProduct,productMetadata,productData}.ts` (PROTOCOL_VARIANTS); `app/account/subscriptions/utils.ts`; `app/account/orders/utils.ts`; `app/api/subscriptions/**`; `app/api/auth/subscriptions/**`; and the PROTOCOL logic inside `components/subscriptions/{ProductSelectorPanel,PlanPreviewBar,EditSubscriptionModal}.tsx` (restyle markup only).

## References

- Grammar: `docs/branding/DESIGN_SYSTEM.md` section 8.5 (mapping table + authority table)
- Programme learnings: `docs/development/featurePlans/simple-dtc-design-language.md`
- Reference implementations: cart drawer, `app/page.tsx`, `/conka-flow` PDP (`ProductHeroV2` + `ProductBuyPanel`)
- Parent programme ticket: SCRUM-1183

## Jira

| Ticket | Title | Scope | Status |
|--------|-------|-------|--------|
| SCRUM-1188 | [Frontend] Convert /account portal to Simple DTC | Whole portal (all 4 phases) | To Do |

Subtask of the programme parent SCRUM-1183.

## Programme context (held, not in this scope)

Remaining Simple DTC pages still Clinical and deferred by the user for now: `/our-story`, `/faq`, `/professionals` (top-of-funnel). Converted and merged: `/why-conka`, `/ingredients`, `/case-studies`.
