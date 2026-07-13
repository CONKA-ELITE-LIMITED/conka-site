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
   *either* the Klaviyo event *or* the list-add succeeded. The email is the
   entire point of the form, so a failed event with a successful list-add still
   tells the applicant to check an inbox that will never receive anything.
2. **Honeypot trips are logged nowhere.** A trapped applicant produces no log
   line, no alert, no lead - completely undetectable.
3. **No monitoring on the funnel.** Nothing would have told us the metric had
   flatlined at zero for a month. The only reason we know is that Harry noticed.
4. **`NEXT_PUBLIC_SITE_URL` still unset in Vercel prod** - the welcome email's
   `order_url` falls back to `https://conka.io/professionals/order`, which
   307-redirects to www. Works, but should be set (already tracked in the
   B2B_PORTAL close-out checks).

## Plan

### Phase 1 - Stop the bleeding (the actual bug)

Pick one:

- **Option A (recommended): remove the honeypot entirely.** `/professionals` is
  an unlisted, `noindex`, off-nav page reached only via Harry's shared links. It
  gets warm traffic, not bot traffic. The per-IP rate limit already covers the
  spam case. The honeypot is defending against a threat this page doesn't have,
  and it has now cost us real money.
- **Option B: make it autofill-proof.** Rename to something no heuristic
  recognises (`hp_token`, not `company`), drop the "Company" label, keep
  `tabindex="-1"` and `aria-hidden`. Safer than today but still a silent-drop
  mechanism, so pair it with logging below.

Either way:

- **Log every honeypot trip** (`console.error` with the submitted email) so a
  trapped human is never invisible again.
- **Fix the success contract:** only return `{success: true}` when
  `eventSent` is true. If the event fails, the applicant must see an error and a
  fallback (`harryglover@conka.io`), not a false "check your inbox".

### Phase 2 - Simplify: stop making the email the gate

Right now the entire £2,250 lead hangs on one email surviving Klaviyo, spam
filters and Gmail's Updates tab. It shouldn't.

**On successful submit, redirect the applicant straight to
`/professionals/order`**, and send the email as a *backup* copy of the link
rather than the only way in.

This removes the whole class of failure we were just blind to for a month, and
it's a straight conversion win: the club sees pricing immediately, in the moment
they're motivated, instead of context-switching to their inbox. The email still
does its job (a permanent, shareable link for the finance team), it just stops
being a single point of failure.

Note this does not weaken the channel-conflict protection: the order page is
already an unlisted `noindex` URL, and the only thing the form gates today is
*being told the URL* - a gate that a 10-second form fill was never really
enforcing anyway.

### Phase 3 - Don't go blind again

- Add a Klaviyo-side or lightweight alert if `B2B Application Submitted` goes
  N days at zero while `/professionals` is receiving traffic.
- Add the section/funnel analytics already listed as future work in
  `B2B_PORTAL.md` (`b2b_application_submitted` fires client-side today via
  `trackB2BApplicationSubmitted`, but nothing reconciles it against what
  actually reached Klaviyo - that reconciliation is exactly the check that would
  have caught this on day one).

## Files touched

| File | Change |
|------|--------|
| `app/components/b2b/ApplicationForm.tsx` | Remove or rename the honeypot; redirect to `/professionals/order` on success |
| `app/api/b2b/apply/route.ts` | Remove/loosen honeypot short-circuit, log trips, tighten the success contract to require `eventSent` |
| `app/lib/b2bEmail.ts` | No change needed (verified working) |
| `docs/features/b2b/B2B_PORTAL.md` | Update the journey + edge-cases sections once shipped |

## Acceptance criteria

- A form submission made **with browser autofill enabled in Chrome** produces a
  `B2B Application Submitted` event in Klaviyo and a welcome email. (This is the
  exact case that fails today - test it explicitly, not just a hand-typed form.)
- A user who submits successfully lands on `/professionals/order` without
  needing the email.
- A Klaviyo failure produces a visible error to the user, never a false success.
- Test leads from the 13 Jul diagnostic are cleaned out of Klaviyo.
