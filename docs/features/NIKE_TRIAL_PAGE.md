# Nike Trial Page (`/nike`)

## Overview

Private, mobile-first onboarding page for a corporate cognition trial with a Nike team (~8-12 people). Their lead (Lucy) forwards one link a few days before the in-person kickoff, opened on a phone. The page's one job: get participants to install and set up the CONKA app **before** the kickoff, so the 20-minute session is spent on the experience, not tech support. Secondary job: look premium and considered (a brand-partner relationship asset) and set expectations for the fortnight.

Not a CRO surface, not linked from nav, `noindex`.

## How it works

- A single **Server Component** page. Dark canvas borrowed from `/app` (`#0a0a0a` + dotted grid) but with a **warm Simple DTC** treatment (rounded cards, sans, indigo `#6478e0` / green accents lifted for dark legibility), **not** full `.brand-clinical`.
- Section flow: **Hero** -> **This is CONKA** (the shots + the test) -> **Three things before Thursday** (the asks + WhatsApp) -> **How your 14 days work** (daily rhythm, window picker, calendar, the 10/14 requirement) -> **When the 14 days are up** (rewards) -> **FAQ** -> **Close** -> **More about CONKA** links.
- Renders its own minimal header (logo links home) and footer; the root layout does not inject nav/footer, so this page deliberately omits site nav/cart to keep it focused.
- Sticky in-page nav (`NikeTrialNav`) with `IntersectionObserver` scroll-spy. Sections **centre at the `lg` breakpoint** with responsive Tailwind classes (the standard convention for alignment-only differences; no `useIsMobile` component split needed).

## Entry gate

Every visit is gated behind a ceremonial code overlay (`CodeGateOverlay`), mounted by `NikeGateWrapper` via `app/nike/layout.tsx`. It shows the CONKA logo, "Nike Mind Trial", a live countdown to kickoff, and a code field. The correct code plays a short processing beat (a radial "cognition ring" that echoes the app's ring) then reveals the page underneath.

- **Code:** `NIKEMIND2026`, a hardcoded, case-insensitive constant (`ACCESS_CODE` in `CodeGateOverlay.tsx`). Not real auth and nothing precious: the page is `noindex` and the link is forwarded person-to-person.
- **Every visit.** The unlock is in-memory only (no storage), so a reload or return trip replays the ceremony. A wrong code shakes the input and lets the visitor retry, unlimited, no lockout.
- **Countdown** targets `KICKOFF` in `CodeGateOverlay.tsx` (`2026-08-06T09:00:00`, local time). It is guarded behind a mount flag so server and client markup agree (no hydration mismatch).
- **Page stays a Server Component.** All gate state, the body-scroll lock, and the reveal live in the client `NikeGateWrapper`; keeping it in the layout leaves `page.tsx` and its metadata/SSR untouched.
- **Motion.** GSAP entrance plus a fade reveal, all gated on `prefers-reduced-motion` (reduced motion shows final states and reveals straight away).

## Key files

| File | Purpose |
|------|---------|
| `app/nike/layout.tsx` | Server. Wraps the page in `NikeGateWrapper` so the entry gate mounts without turning `page.tsx` into a Client Component. |
| `app/nike/NikeGateWrapper.tsx` | Client. Holds gate state (in-memory unlock), locks body scroll while gated, renders the page as `children` under the overlay. |
| `app/nike/CodeGateOverlay.tsx` | Client. The ceremonial overlay: logo + "Nike Mind Trial" lockup, live countdown, code field (`ACCESS_CODE`), shake-on-wrong, radial-ring processing beat, GSAP entrance + reveal. |
| `app/nike/page.tsx` | The page: metadata, section orchestration, and all copy data (`asks`, `rewards`, `dailyRhythm`, `faqs`) plus the fill-in placeholders. |
| `app/nike/NikeTrialNav.tsx` | Client. Sticky anchor chips + scroll-spy. `NAV_ITEMS` ids must match the section `id`s in the page. |
| `app/nike/ShotsShowcase.tsx` | Client. Flow/Clear toggle + bottle asset + ingredient sheet, composed dark-native. Reuses `FormulaToggle`, `IngredientBottomSheet`, and `getOrderedActiveIngredients` (`app/lib/ingredientsData.ts`). |
| `app/nike/TestWindow.tsx` | Client. Interactive tap-to-select 2-hour test-window picker (illustrative only, no state persisted). |
| `app/nike/TrialCalendar.tsx` | Server. Plain calendar: the single-colour trial stretch (Thu 6 to Thu 20 Aug) over Mon-Sun columns, no phases. |
| `app/components/AppInstallButtons.tsx` | The `dtc-dark` variant was added here for this page (rounded-full, white-filled App Store + outlined Play Store on dark). |

## Before sharing the link (operational)

Fill three consts at the top of `app/nike/page.tsx`, each marked `// TODO`:

- `SESSION_TIME`, `SESSION_LOCATION` — kickoff time + place.
- `WHATSAPP_URL` — the real `https://chat.whatsapp.com/...` group invite.

Also set `KICKOFF` in `app/nike/CodeGateOverlay.tsx` (currently `2026-08-06T09:00:00`, marked `// TODO`) to the real kickoff time so the gate countdown matches `SESSION_TIME`.

App Store / Play Store URLs are the real live CONKA links (baked into `AppInstallButtons`), no placeholder needed.

## Decisions and gotchas

- **noindex mechanism.** Set via `metadata.robots`. The page is deliberately **left out of `sitemap.ts`** and **not disallowed in `robots.ts`** (disallowing would stop crawlers seeing and honouring the noindex tag). This matches the project policy for noindex landers.
- **Trial dates are hard-coded.** Kickoff Thursday 6 August; the trial runs Thursday 6 to Thursday 20 August as a single 14-day stretch (no baseline phase). They live in `TrialCalendar.tsx` (`TRIAL_START` / `TRIAL_END` / `CELLS`), the hero/kickoff copy in `page.tsx`, and `KICKOFF` in `CodeGateOverlay.tsx`. Change all three if the schedule moves.
- **FAQ copy is a trimmed reuse** of `app/lib/faqContent.ts` (Flow vs Clear, both at once, testing timing, IQ test, caffeine, sleep, medication). It is duplicated as a local `faqs` array (not imported) so it can be tuned for this audience; keep it roughly aligned if the canonical FAQ changes. Rendered as a native exclusive `<details>` accordion (shared `name="nike-faq"`), no client JS.
- **Assets are all existing** (no new files): `FlowNew.jpg` / `ClearNew.jpg`, `AppConkaRing.png`, `conka-logo.webp`, and `/opengraph-image.png` for the unfurl.
- The daily-rhythm **test** step uses the formula toggle's `SunHorizonIcon` as a placeholder glyph (the two product slots took the bottle images).

## Editing

- **Copy:** edit the `asks`, `rewards`, `dailyRhythm`, and `faqs` arrays in `page.tsx`.
- **Calendar / dates:** `TrialCalendar.tsx`, the hero kickoff block in `page.tsx`, and `KICKOFF` in `CodeGateOverlay.tsx`.
- **Gate:** the access code (`ACCESS_CODE`) and countdown target (`KICKOFF`) are consts in `CodeGateOverlay.tsx`.
- **Nav anchors:** keep `NAV_ITEMS` in `NikeTrialNav.tsx` in sync with the section `id`s (`about`, `setup`, `fortnight`, `rewards`, `faq`).

## Related

- FAQ source of truth: [`docs/features/FAQ_SYSTEM.md`](./FAQ_SYSTEM.md)
- Design language: [`docs/branding/DESIGN_SYSTEM.md`](../branding/DESIGN_SYSTEM.md) (Simple DTC, App-Dark)
