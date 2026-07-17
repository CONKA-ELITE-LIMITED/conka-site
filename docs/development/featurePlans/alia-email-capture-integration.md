# Alia Email-Capture Popup Integration

**Status:** Not Started
**Owner:** Rudh
**Created:** 2026-07-17
**Design system:** N/A (Alia renders its own popup UI; no site components)

## Problem

The site has had no on-site email-capture popup since the legacy Klaviyo onsite form was disabled on 2026-05-26 (all Klaviyo signup forms were set to draft, so `klaviyo.js` loaded on every page and rendered nothing, costing ~360ms main-thread and re-injecting Google Fonts site-wide). Alia is the paid replacement, bought as a Shopify app, to grow the top-of-funnel email list from paid and organic traffic.

## Who it serves

All site visitors, especially cold paid traffic who bounce without buying. Captured emails feed Klaviyo nurture and win-back flows, turning otherwise-lost sessions into a retargetable owned audience.

## Business impact

List growth lowers the cost of repeat conversion (owned channel vs paid re-acquisition). Acquisition-adjacent CRO.

## Approach

Embed Alia's single async `embed.js` through the existing deferred-marketing loader (`app/components/DelayedAnalytics.tsx`) so it stays out of the initial load window, then wire Alia to Klaviyo entirely inside Alia's dashboard (native OAuth integration) pointing at the master list `WBbMia`. No custom Klaviyo API code is written on our side.

Embed snippet (as supplied by Alia):

```html
<script src="https://backend.alia-prod.com/public/embed.js?shop=conka-6770.myshopify.com" async></script>
```

In Next.js this becomes a `next/script` `<Script>` with `strategy="lazyOnload"` inside `DelayedAnalytics.tsx`.

## The Klaviyo integration (key decision)

**No code in this repo touches Klaviyo for Alia.** The sync is Alia-native:

1. Alia dashboard, Integrations page, Connect under Klaviyo (OAuth).
2. Set the email subscriber list to the master list `WBbMia` (https://www.klaviyo.com/list/WBbMia) - the same "new users" list the footer newsletter signup already feeds via `app/api/klaviyo/subscribe/route.ts`.
3. Enable **single opt-in** on that list in Klaviyo (Lists & Segments, list Settings, Consent) so signups go live immediately, matching legacy popup behaviour.

Do **not** re-enable the old commented-out `klaviyo.js` onsite script in `app/layout.tsx` (lines ~148-164). Alia replaces it; re-adding it re-introduces the Google-Fonts and unused-CSS perf regression that got it disabled.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Embed Alia via deferred loader + performance validation | Not Started |
| 2 | Klaviyo dashboard wiring + verification (ops, no code) | Not Started |
| 3 | Doc cleanup (stale Klaviyo reference + changelog) | Not Started |

### Phase 1: Embed + performance validation

1. **Add Alia to the deferred loader** (Small)
   - What: Add `<Script src="https://backend.alia-prod.com/public/embed.js?shop=conka-6770.myshopify.com" strategy="lazyOnload" />` inside `DelayedAnalytics.tsx`, so it loads on the same first-engagement / 4000ms-idle gate as GA and Triple Whale.
   - Files: `app/components/DelayedAnalytics.tsx`
2. **Font-injection audit** (Small)
   - What: Per PERFORMANCE_OPTIMISATION.md Rule 5, confirm Alia's popup builder does not auto-load its own Google Fonts site-wide (the exact regression that made the old Klaviyo script costly). Inspect network + coverage on a preview deploy.
3. **Lighthouse before/after** (Small)
   - What: Per Rule 3, mandatory for any new third-party script. Benchmark `/start` on the Vercel preview (not localhost) before and after, confirm no meaningful TBT/LCP regression.

### Phase 2: Klaviyo wiring (dashboard, no code)

4. In Alia dashboard, connect Klaviyo via OAuth, set email list to `WBbMia`, enable single opt-in on the list in Klaviyo. Submit a test email through the live popup and confirm the profile appears in `WBbMia` (ideally with an Alia source property for segmentation).

### Phase 3: Docs

5. Update `docs/features/KLAVIYO_FLOWS_AND_INTEGRATION.md` (remove the stale "onsite script is loaded in app/layout.tsx" claim; document Alia as the current popup mechanism and the WBbMia sync). Add a `docs/CHANGELOG.md` entry.

## Rabbit holes

- **Immediacy vs deferral.** If marketing wants an instant entry popup, the engagement / 4s-idle gate could feel slightly late. Keep the deferred loader (popups typically trigger on time delay / scroll / exit-intent regardless). Only revisit with a Lighthouse cost check if there is a concrete complaint.
- **Alia's own fonts/CSS** re-introducing the Klaviyo-style regression, caught by the Phase 1 font-injection audit.

## No-gos

- No custom Klaviyo API integration for Alia (native OAuth handles it).
- Not re-enabling the old `klaviyo.js` onsite script.
- No new site UI components (Alia self-renders its popup).

## Risks

- Alia embed loading its own web fonts or heavy CSS. Mitigated by the Phase 1 audit and Lighthouse gate.
- No cookie-consent gate currently exists (CookieYes removed 2026-06-12), so Alia loads unblocked. This is expected and works technically; any PII/consent posture is a business decision, out of scope here.

## References

- `app/components/DelayedAnalytics.tsx` - deferred marketing-script loader (GA + Triple Whale), the home for Alia
- `app/layout.tsx` ~148-164 - disabled legacy `klaviyo.js` onsite script (do not re-enable)
- `app/api/klaviyo/subscribe/route.ts:47` - server-side subscribe to master list `WBbMia` (footer newsletter)
- `docs/development/PERFORMANCE_OPTIMISATION.md` - Rule 3 (script strategy + mandatory Lighthouse), Rule 5 (third-party font injection)
- `docs/features/KLAVIYO_FLOWS_AND_INTEGRATION.md` - stale, to be updated in Phase 3

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1164 | [Email & Marketing] Integrate Alia email-capture popup + Klaviyo sync | 1-3 (all) | To Do |

Sprint 28. Epic: SCRUM-767 (Email & Marketing).
