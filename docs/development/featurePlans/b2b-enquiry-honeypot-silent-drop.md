# B2B Enquiry: Honeypot Silently Dropping Real Applicants

**Status:** DIAGNOSED, not fixed - ready to execute
**Created:** 2026-07-13 · **Owner:** Rudh
**Severity:** High - every autofilled application since 8 Jun has been silently binned. Each lost lead is a bulk order worth ~£2,250 ex VAT.
**Relates to:** `docs/features/b2b/B2B_PORTAL.md` (canonical B2B reference), `docs/features/KLAVIYO_FLOWS_AND_INTEGRATION.md`

---

## Symptom

Applicants fill in the `/professionals` enquiry form, see the "Check your inbox"
success screen, and never receive the order-page link. In Klaviyo, no new
profiles enter the `B2B Applicant Welcome` flow. The only events on the metric
are the test addresses created while the feature was built in June.

## Root cause

The anti-spam honeypot is catching real users, because it is named after a field
browsers autofill.

`app/api/b2b/apply/route.ts` treats a filled honeypot as a bot and **silently
fakes success** - it returns `{"success": true}`, fires nothing to Klaviyo, and
adds nothing to the leads list:

```ts
// Honeypot tripped: pretend success so bots move on, but do nothing.
if (parsed.company) {
  return NextResponse.json({ success: true });
}
```

The honeypot in `app/components/b2b/ApplicationForm.tsx` renders as:

```html
<div aria-hidden="true" class="absolute -left-[9999px] ...">
  <label for="company">Company</label>
  <input id="company" type="text" tabindex="-1" autoComplete="off" value="" />
</div>
```

A field called `company`, labelled "Company", inside a form whose real fields
carry `autocomplete="organization"`, `"email"`, `"tel"` and `"given-name"`.
Chrome's autofill heuristics map `company` to the ORGANIZATION field type, so
when a user autofills their work details - exactly what procurement staff at a
club do - **the browser fills the honeypot for them**. `autocomplete="off"` does
not prevent this; Chrome routinely ignores it for profile/address autofill.
Safari and password managers (1Password, LastPass) behave the same way.

Result: applicant sees the success screen, the lead is dropped, nothing is
logged, nobody finds out.

## Evidence (gathered 13 Jul 2026)

Every other layer is healthy. This was verified, not assumed:

| Check | Result |
|-------|--------|
| Klaviyo metric `B2B Application Submitted` (`VSeGwy`) | **6 events ever**, all test addresses (`rudhkurup+b2btest@`, `+routetest@`, `gloverhal95@`). Latest real-world one: a prod test on 16 Jun. |
| Klaviyo `B2B Leads` list (`Xhqyt8`) | **3 profiles**, same tests. |
| Flows `B2B Applicant Welcome` (`SbRqyH`) + `B2B Lead Alert` (`X6Uh4U`) | Both **live**, not draft, not archived. |
| Klaviyo legacy `/api/track` endpoint | **Still works.** Probe event accepted, returned `1`. Not deprecated out from under us. |
| Prod route `POST https://www.conka.io/api/b2b/apply` | **Works end to end.** Real payload posted 13 Jul 10:41 → event landed in Klaviyo with all properties intact. |
| Env keys in prod | Present and working (the 13 Jul test proves the public key is inlined in the prod build). |
| Rate limiter | Not implicated - it returns a visible 429, not a silent success. |
| Apex → www redirect (`conka.io` 307 → `www.conka.io`) | Harmless. The page is served from www, so the form's relative `fetch("/api/b2b/apply")` stays same-origin. |

**Not one real applicant has ever reached Klaviyo** - not even a partial write
(no orphan list-adds without events). Combined with users reporting they *did*
submit and *did* see confirmation, the honeypot short-circuit is the only path
that produces "user sees success + zero trace server-side". Every other failure
mode (network error, 500, validation, rate limit) surfaces a visible error to
the user.

### Test-data cleanup

The 13 Jul diagnostic created a live lead. Delete before/while executing:
- Klaviyo profile `rudhkurup+b2bdebug13jul@conka.io` (org "Debug Test FC"), on the B2B Leads list.
- Harry received one lead-alert email for it.
- Also a stray probe metric `Zz Debug Track Probe` (profile `rudhkurup+klaviyoprobe@conka.io`) - harmless, no flow attached, but tidy it up.

## Contributing issues (these are why it stayed invisible for a month)

1. **The route lies about success.** `route.ts` returns `{success: true}` if
   *either* the Klaviyo event *or* the list-add succeeded, so a failed event
   with a successful list-add still tells the applicant to check an inbox that
   will never receive anything. Note the fix for this is **loud logging, not
   blocking the applicant** - see Phase 1 decision 2.
2. **Honeypot trips are logged nowhere.** A trapped applicant produces no log
   line, no alert, no lead - completely undetectable.
3. **No monitoring on the funnel.** Nothing would have told us the metric had
   flatlined at zero for a month. The only reason we know is that Harry noticed.
4. **`NEXT_PUBLIC_SITE_URL` still unset in Vercel prod** - the welcome email's
   `order_url` falls back to `https://conka.io/professionals/order`, which
   307-redirects to www. Works, but should be set (already tracked in the
   B2B_PORTAL close-out checks).

## Plan

**Scoped 13 Jul 2026 → SCRUM-1137.** Phase 1 below is the approved, ticketed
scope and ships as a single deploy. Phase 2 is future.

### Phase 1 - Immediate entry + honeypot fix (SCRUM-1137, ACTIVE)

Three decisions were taken at scoping. They are the plan; the alternatives are
recorded only so nobody re-opens them.

1. **Remove the honeypot entirely.** Not renamed, not made autofill-proof -
   removed. `/professionals` is an unlisted, `noindex`, off-nav page reached
   only via Harry's shared links. It gets warm traffic, not bot traffic. The
   per-IP rate limit already covers the spam case. The honeypot was defending
   against a threat this page doesn't have, and it has cost real money. Keeping
   any silent-drop mechanism in the code invites this class of bug back.

2. **Never block the applicant. Do NOT gate success on `eventSent`.**

   > An earlier draft of this doc recommended returning `{success: true}` only
   > when the Klaviyo event fired. **That recommendation is wrong under
   > immediate entry and has been withdrawn.** It was written when the email was
   > the only way in, so a failed event genuinely meant a dead lead. Once the
   > applicant is redirected straight to the order page, the email is a backup,
   > not the gate - and blocking entry on a failed marketing-platform call would
   > mean a Klaviyo outage costs a £2,250 order. That is the exact failure mode
   > this work exists to delete.

   So: return `success` whenever the submission is **received**, let the
   applicant through, and `console.error` loudly when `eventSent` or `alertSent`
   is false so a Klaviyo failure is visible in the Vercel logs instead of
   silent. The lead data is captured at submit either way. A failed alert to
   Harry is an internal problem, not the applicant's.

   A genuine request failure (network error, 500) still shows the inline error
   with the `harryglover@conka.io` fallback and does **not** redirect.

3. **Immediate entry, behind an honest processing interstitial.** On submit,
   capture the lead, fire both Klaviyo flows exactly as today (applicant welcome
   + Harry lead alert - both already fire from the single `submitB2BApplication`
   call, so no integration change), then run a short interstitial over the
   **real** API latency and route the applicant straight to
   `/professionals/order`.

   The interstitial is not a fake delay. It covers a call that genuinely takes a
   moment, holds a ~2s minimum floor so it cannot flicker, and gives a failed
   call somewhere to surface an error instead of dumping the user on a page that
   lied to them. It also lends the trade-pricing reveal a sense of formal
   qualification rather than a door that just swings open. Model it on
   `AnalyzingView` (`app/components/go/QuizScreens.tsx:443`).

This removes the whole class of failure we were blind to for a month, and it is
a straight conversion win: the club sees pricing while it is still motivated,
instead of context-switching to an inbox. The email still does its job (a
permanent, shareable link for the finance team), it just stops being a single
point of failure.

Immediate entry does **not** weaken the channel-conflict protection: the order
page is already an unlisted `noindex` URL, and the only thing the form ever
gated was *being told the URL* - a gate that a 10-second form fill was never
really enforcing anyway.

### Phase 2 - Don't go blind again (Future)

- Alert if `B2B Application Submitted` sits at zero for N days while
  `/professionals` is receiving traffic. Nothing would have told us the metric
  had flatlined for a month; the only reason we know is that Harry noticed.
- Add the section/funnel analytics already listed as future work in
  `B2B_PORTAL.md` (`b2b_application_submitted` fires client-side today via
  `trackB2BApplicationSubmitted`, but nothing reconciles it against what
  actually reached Klaviyo - that reconciliation is exactly the check that would
  have caught this on day one).

## Out of scope (Phase 1)

- **Prefilling the order builder** with the applicant's organisation, finance
  email or PO. `B2BOrderBuilder` is self-contained `useState` with no props,
  query params or storage, so this is net-new plumbing and it leaks org details
  into the URL.
- **Extracting `AnalyzingView` into a shared primitive.** It is coupled to quiz
  screen types. Copy it, don't refactor the quiz.
- **Tokenised access to `/professionals/order`.** It stays unlisted + `noindex`.
- **Klaviyo flow copy.** The welcome email still reads "here's your link" when
  the applicant is already on the page. That edit is dashboard-side, not in this
  repo, and is Rudh's to make.

## Files touched

| File | Change |
|------|--------|
| `app/api/b2b/apply/route.ts` | Remove the `company` honeypot from the zod schema and delete the silent-success branch; log loudly when `eventSent` / `alertSent` is false; return success whenever the submission is received |
| `app/components/b2b/ApplicationForm.tsx` | Remove the honeypot div + `company` from `FormState`; replace the success screen with the interstitial, then `router.push("/professionals/order")` |
| `app/components/b2b/B2BProcessingInterstitial.tsx` | **New.** Sequenced processing steps, modelled on `AnalyzingView`; awaits the API promise with a ~2s minimum floor |
| `app/lib/b2bEmail.ts` | No change needed (verified working, both emails already fire from one call) |
| `docs/features/b2b/B2B_PORTAL.md` | Update the journey mermaid, the edge-cases honeypot line, and the API table once shipped |

## Acceptance criteria

Full, testable list lives on **SCRUM-1137**. The load-bearing ones:

- A form submission made **with browser autofill enabled in Chrome** produces a
  `B2B Application Submitted` event in Klaviyo and a welcome email. This is the
  exact case that fails today. **Hand-typing the form is not a valid test** - it
  never triggers autofill and will pass even if the bug survives. That is
  precisely how this shipped green in June.
- The same submission fires `B2B Lead Alert` on Harry's profile and he receives
  the lead-alert email with the applicant's details.
- A user who submits successfully lands on `/professionals/order` without
  needing the email.
- **A Klaviyo failure does NOT block the applicant.** They still reach
  `/professionals/order`, and the failure is written to the server log with
  their email. Only a genuine request failure (network / 500) shows the inline
  error with the `harryglover@conka.io` fallback, and that path does not
  redirect.
- No field named `company` (or any other autofill-recognised name) exists in the
  form or the apply route's zod schema.
- Test leads from the 13 Jul diagnostic are cleaned out of Klaviyo (see above).

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1137 | [Bugs] B2B enquiry: honeypot silently drops autofilled applicants, switch to immediate entry to /professionals/order | 1 | To Do |
