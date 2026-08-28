# A/B Testing — Lean MVP for a Headless Store

**Status:** Research / not built · **Date:** 2026-08-04 · **Owner:** Rudh

Goal: improve conversion on Meta-ad → listicle → PDP → checkout by testing
**big-swing** changes on a low ad budget, and knowing clearly which one won
without drowning in noise. This doc is the settled framing: how we judge a test,
what we capture, and the one mechanism we build.

---

## TL;DR (the decisions)

1. **No third-party tool.** Shoplift/Intelligems are Shopify **theme-native** —
   they inject into `theme.liquid` and test Liquid templates. Our storefront is
   **headless Next.js**; those pages never render through the Shopify theme, so
   the tools could only test our hosted *checkout*. ~$99–499/mo for zero
   coverage. Binned. (Details §1.)
2. **Judge every test on one tiny KPI set, tiered by role** (§2): a **verdict**
   metric that decides it (nCPA at held NC-AOV), a **proxy** that reads fast
   (listicle CTR / add-to-cart rate), and **guardrails** that stop us fooling
   ourselves (CVR, AOV). Plus the **funnel step-chain** per variant so a loss is
   diagnostic, not a shrug. Nothing else gets captured (§2.3).
3. **Split on our own side, at one URL, via edge middleware — this is the
   default** (§4). It keeps traffic on **one Meta ad set**, which protects Meta's
   learning phase. Splitting at the ad-set level fragments the conversion signal
   and, at our volume, is the *worse* option — reserve it for when the variable
   lives inside the ad itself (§3).
4. **Only test big swings; call it on the proxy, confirm on the verdict.** A 10%
   lift on our ~3% purchase baseline would need ~100k visitors/variant. The proxy
   (20–40% baseline) reaches significance ~10× faster; nCPA confirms direction.
5. **Two-phase discipline** (§2.4): Phase 1 answers *which* variant wins — ship
   it and move on. Only spend on Phase 2 (*why* it wins) when a result demands it
   (a tie, or a winner that sets brand-wide direction).
6. **Rolling ~10+ day window, conditions frozen.** Sticky bucketing keeps each
   returning visitor in one variant, so a longer run accumulates clean sample.
   Don't change creative/price/offer mid-test.

---

## 1. Why the market tools don't fit

**Shoplift** ($99+/mo, "how pages look") and **Intelligems** ($49–499/mo, "how
much you charge") both integrate through the **Shopify theme + Liquid**. Our site
is headless Next.js on Vercel; Shopify only renders checkout. So neither can test
`/go/[slug]` or `/conka-both`. The ideas worth copying: 50/50 sticky split,
**server-decided (no flicker)**, and RPV/CVR/AOV per variant.

## 2. How we judge a test (the KPI framework)

This is the part that keeps us out of the noise. We measure the money outcome,
one fast leading indicator that predicts it, a couple of guardrails, and the
funnel steps — and nothing else.

### 2.1 The three roles

Testing two heroes, in plain terms:

- **Verdict = the scoreboard.** The one number a decision actually turns on:
  **nCPA** (new-customer cost per acquisition = ad spend ÷ new customers), read
  **with NC-AOV** attached so a "cheaper but worse customers" win doesn't count.
  Lower nCPA at equal-or-better NC-AOV → ship it.
- **Proxy = the halftime read.** nCPA is slow to trust at our volume, so we watch
  a metric that moves in *days* and points the same way: **listicle CTR**
  (listicle→PDP) for landing tests, **add-to-cart rate** for PDP tests. High
  baseline (20–40%) → significance ~10× faster than purchase. This is what you
  *watch*; nCPA *confirms*.
- **Guardrail = the anti-cheat.** A variant can win the proxy by lying — a
  clickbait hero pulls clicks (CTR up) from the wrong people who then don't buy
  (**CVR** down) or buy less (**AOV** down). Guardrails catch that.

| Role | Metric | What it's for |
|---|---|---|
| **Verdict** | **nCPA** + **NC-AOV** (together) | The decision. Lower nCPA at held-or-better NC-AOV = win. |
| **Proxy** | **Listicle CTR** · **Add-to-cart rate** | Fast leading read; what you watch day to day. |
| **Guardrail** | **CVR** (session→purchase) · **AOV** | Catches a variant that games the proxy but leaks lower down. |
| *Context (denominators, not KPIs)* | Sessions · Orders · Ad spend | Needed to compute the above; never judged on directly. |

### 2.2 The funnel step-chain (the one thing we DO add)

For each variant, capture the counts at every step:

**sessions → listicle→PDP clicks → add-to-cart → checkout → purchase**

Five counts. This is the difference between *"variant B has a worse CVR"* (a dead
number) and *"B is worse **because it loses people at the cart, not the PDP**"*
(actionable — the hero's fine, the cart's the problem). It's **nearly free**: we
already fire add-to-cart and initiate-checkout events; this is just reading them
**sliced by variant**. It stays inside Phase 1 and makes a losing test diagnostic.

### 2.3 What we deliberately do NOT capture

Time on section, scroll depth, per-section dwell, section bounce, heatmaps. None
of it changes a ship/kill decision. **The line:** capture *where in the funnel a
variant leaks* (the 5 counts); do **not** capture *why they leaked at that step* —
until a specific result makes us ask.

### 2.4 Two-phase discipline

- **Phase 1 — "which?"** Does hero A or B buy new customers cheaper? Needs only
  the verdict + the step-chain. You do not need to know *why* to answer this.
- **Phase 2 — "why?"** What about the winner works. This is where richer capture
  would live — **but you only earn it when Phase 1 hands you a specific
  question.** Most tests never raise one: B wins, you ship B, next test. Spend on
  "why" only when (a) the test *tied* (the one case the endpoint told you
  nothing), or (b) the winner implies a **brand-wide direction** you'll reuse
  (e.g. "clinical hero beats lifestyle hero" shapes every future page).

## 3. Why we split on-site, not at the ad set

The instinct is that a second landing URL + a duplicate ad set is "free" (zero
code). It isn't — it hides a **media cost** that, at our volume, makes it the
*worse* option.

**Meta's learning phase.** Meta optimises **one ad set** toward a conversion
event and needs **~50 conversions/ad set/week** to exit learning and deliver
efficiently. Below that, delivery stays noisy and expensive.

- **Ad-set split** cuts one ad set into two → each gets **half the budget and
  half the conversion signal**, and the two sets **bid against each other**
  (audience overlap), inflating our own costs. At **single-digit new-customer
  orders/day** (per the jbiq dashboard), one consolidated set is *already*
  marginal against the 50/week bar; split it and **neither set clears learning** →
  both deliver worse, and you need ~2× the time to read a result.
- **On-site split keeps one ad set.** All budget, all conversion events, all
  learning stay consolidated. Meta optimises one clean funnel; the A/B difference
  happens *after* the click, invisible to the optimiser. Only mild cost: Meta
  optimises toward a *blend* of A and B — nothing like fragmenting the signal.

**The rule:**

| If the variable lives… | Split… | Why |
|---|---|---|
| **On our pages** (hero, headline, CTA, PDP selector, listicle content) | **Same URL, on-site middleware** (default) | One ad set → learning protected, reads faster. One-time build serves every future on-site test. |
| **Inside the ad** (creative, audience, placement) | Meta's **native A/B Experiments** (mutually exclusive, no overlap) | Genuinely in Meta, not our site. Accept it needs more volume; run only for large expected effects. |

## 4. The mechanism — one thin edge middleware

For a same-URL test, the only real engineering question is **where the variant is
decided**, because of flicker:

- **Browser-side (wrong default):** server renders control, React hydrates, reads
  the cookie, *swaps in* the variant → a visible flash of control **that biases
  the test** (people half-see both states) and adds layout shift (CLS).
- **Server-side (right):** the server knows the variant before it renders a pixel
  → one clean version, zero flash.

Server-side means middleware — Next.js Server Components can't set cookies during
render, so the edge is the correct (and only clean) place to decide + persist a
bucket.

```ts
// middleware.ts — matcher scoped to the ONE test route
export function middleware(req) {
  let bucket = req.cookies.get('exp_bucket')?.value          // sticky 0–99
  const res = NextResponse.next()
  if (!bucket) {
    bucket = String(hash(crypto.randomUUID()) % 100)
    res.cookies.set('exp_bucket', bucket, { maxAge: 400d, domain: '.conka.io' })
  }
  const variant = Number(bucket) < 50 ? 'A' : 'B'            // 50/50, sticky
  res.headers.set('x-exp-bothsel', variant)                 // server render reads this
  return res
}
```

The page (Server Component) reads `x-exp-bothsel` via `headers()` and renders the
right version directly.

**Design notes:**
- **Dedicated `exp_bucket` cookie, not `conka_uid`.** `conka_uid` is minted
  *client-side* (`document.cookie` in `metaPixel.ts`), so a first-time visitor's
  first paint has no id server-side → flicker at the exact moment it matters. A
  middleware-minted cookie is authoritative from request #1, and keeps us off the
  Meta identity path (which we don't want to risk).
- **Scope the matcher tightly** (the one test route). Rest of the site never
  invokes middleware → zero overhead. Our PDPs are already dynamic (Shopify data,
  cart), so the marginal cost on the test route is a few ms + no full-page CDN
  cache for that route — negligible and contained.

### Carrying the variant to the KPIs (no new pipeline)

Once the server knows the variant, pack it into the `source`/`origin` string at
add-to-cart the way the codebase already packs values (`analytics.ts` documents a
2-custom-prop Vercel budget, hence `source = "<slug>-<section>"`):
`origin = "<slug>-<section>|exp_bothsel:B"`. That single string already flows to
the **Vercel event** *and* to **Shopify order tags** via the `orders/paid`
webhook. So per variant we get, with no extra instrumentation:

- the **funnel step-chain** (§2.2), sliced by variant
- **nCPA** = (½ the shared spend) ÷ new customers per variant (traffic ~50/50)
- **AOV / CVR** straight off the tagged orders

Meta CAPI/Triple Whale have no prop limit — add `variant` to `custom_data` if we
want it in the ads dataset too. Convex `experimentEvents` (clone the `quizEvents`
pattern) is an **optional** richer-funnel follow-up, not needed for v1.

## 5. Sticky bucketing — the facts we rely on

- **`conka_uid`** (`getOrCreateExternalId()`, `app/lib/metaPixel.ts`): 400-day
  first-party cookie, scoped `.conka.io` (survives to checkout). Minted
  **client-side** — hence we mint the experiment bucket in middleware instead, so
  the server has it on first paint.
- Bucketing is deterministic and sticky by construction: `hash(bucket) % 100` →
  variant, held for the cookie's life, so a longer window accumulates sample
  rather than re-rolling returning visitors.

## 6. The two candidate tests

### Test A — Both-PDP variant selector (Magic-Mind-style)
A segmented "**choose Flow / Clear / Both**" selector on `/conka-both`, so a
visitor picks a single formula inline instead of bouncing to another PDP.

- **Self-contained, no schema/cart changes.** `offerData.ts` holds
  `FUNNEL_VARIANTS.flow/.clear/.both` (variant GID + selling plan per cadence),
  and `addToCart` takes an arbitrary `variantId`/`sellingPlanId`. Add a
  `selectedProduct` state next to `selectedCadence` in `app/conka-both/page.tsx`,
  swap `getCadenceVariantByProductHeroId("03", cadence)` for a product+cadence
  lookup, render a toggle in `ProductHeroV2`/`ProductHeroMobileV2`.
- **Split:** on-site middleware (control = current Both-only page; variant = page
  with selector). **Proxy:** add-to-cart rate. **Guardrail:** AOV (a selector can
  shift mix Both→single and lower basket — watch it).
- **⚠️ Brand constraint:** memory `no-single-product-emphasis` — a *neutral,
  equal-weight* three-way toggle is fine; a Flow-forward default is not. Confirm
  in design review before it ships.

### Test B — Listicle hero / copy / CTA / traffic-direction
The listicle registry (`app/lib/landings/`) makes each page a **pure config
object** — hero image, headline, subcopy, CTA, destination all in config.

- **What to test (one variable per test):** `hero.asset` (image), `hero.headline`
  / `hero.subcopy`, `hero.cta` + `stickyBar.cta`, **traffic direction** (which PDP
  a `mm` CTA points to), or `template` (`mm` editorial vs `im8` sell-in-place).
- **Split:** prefer **same URL + on-site middleware flip** (one ad set, protects
  learning) over registering a second slug + duplicate ad set. **Proxy:**
  listicle→PDP CTR (`?src=`) for `mm`, add-to-cart rate for `im8`.
- **Highest-leverage first:** hero image and traffic-direction move CR most; CTA
  wording least. Rank accordingly.

## 7. Suggested order & effort

| # | Test | Build | Why this order |
|---|---|---|---|
| 1 | Build `getVariant()` + the scoped **middleware** + origin-packing | ~half a day | The one piece of real infra; unblocks every on-site test and protects Meta learning. |
| 2 | Listicle **hero image** (same-URL flip) | ~1h config | Biggest effect size, fastest proxy signal. |
| 3 | Listicle **traffic direction** (which PDP) | ~1h config | Strategic question, cheap once middleware exists. |
| 4 | **Both-PDP selector** | ~0.5–1 day | Higher-effort UI; needs the brand-constraint sign-off. |
| 5 | Listicle CTA / copy | ~1h each | Smaller effect; run after the big levers. |

Convex `experimentEvents` is an optional follow-up if we want richer per-variant
funnels than Shopify tags + Vercel already give us.

## 7.5 Decision — measuring the new purchasing-layout PDP (2026-08-24, SCRUM-1243)

**Decision: split at one URL via middleware (option b), but build at its own path first.** Two stages, because they answer different questions.

**Stage 1 — own path, while building.** Ship the new layout at its own route (e.g. `/conka-both-v2`), `noindex`, no middleware. This is for QA, design review and `/review-visual`, not for measurement. It costs nothing (it is just a route), it shows up as its own row in the conka-lab Pages view, and you can share a link without touching live traffic.

**Stage 2 — middleware sticky 50/50 at the canonical URL, when it goes live for the test.** The own path stays as the direct-access route for internal checks.

**Why not the own path alone.** An own path needs its own traffic. At ~21k visitors/month there is no spare ad budget to point at a second destination, and organic/direct visitors will never find the test route, so you would be measuring a self-selected trickle against a normal population. That is not a comparison. The middleware split also keeps one Meta ad set intact (§3), which matters more at our volume than it would at scale.

**Call it on the proxy, not the verdict.** 21k/month split 50/50 is ~10.5k visitors per variant per month. On a ~3% purchase baseline that is nowhere near significance for nCPA in any sane window (§TL;DR 4 puts it at ~100k/variant). Judge this test on **add-to-cart rate** (20-40% baseline, roughly 10x faster to significance) and treat nCPA as directional confirmation only. If the proxy cannot separate the variants inside a rolling ~10-day window, the layout change was not a big enough swing.

### Carrying the variant to the KPIs — two channels, only one is budget-constrained

The two-property limit is a **Vercel Web Analytics** constraint. **Shopify cart attributes have no such limit.** Treating them as one problem is what makes this look harder than it is.

- **To Shopify / the order:** add the variant as its **own cart attribute** (e.g. `_experiment`), alongside `_listicle_origin` in `CartContext`. Underscore-prefixed so it stays hidden from the customer in checkout (see the `getPurchaseSource` note in `analytics.ts`). No packing, no limit, and it works for **all** traffic rather than only listicle-sourced visitors.
- **To Vercel events:** keep to two properties by packing the variant into an existing one, as §"Carrying the variant to the KPIs" describes.

**⚠️ The packing scheme in that section does not work as written.** It proposes `origin = "<slug>-<section>|exp_bothsel:B"`, but `isValidListicleSrc` (`app/lib/analytics.ts:537`) validates against `/^[a-z0-9_-]{1,96}$/i`. Neither `|` nor `:` is in that character class, so the token is **silently rejected** and `getListicleSrc()` returns null: the origin is not degraded, it is *lost*. Use a separator that survives the existing regex, e.g. `brainage-hero__exp-pdpv2-b`, or widen the regex deliberately. Do not widen it casually, since the value reaches Shopify.

**Second gap in that scheme:** `_listicle_origin` is only set for visitors who arrived from a `/go` listicle. A PDP test will take most of its traffic direct, so packing the variant into the origin string covers a minority of the sample. This is the main reason the variant belongs in its own cart attribute rather than packed into the origin.

---

## 8. Open questions

- Per-variant funnels in Convex, or is "Shopify order tags + Meta + Vercel" enough
  for v1? (Lean: enough for v1.)
- Significance: manual calculator per test, or a small `/app`-style internal
  readout? (Lean: manual calculator first.)
- Confirm the Both selector respects `no-single-product-emphasis` in design
  review before it ships as a variant.

---

**Related:** `docs/features/LISTICLE_SYSTEM.md` · `app/lib/offerData.ts` ·
`app/lib/metaPixel.ts` (`getOrCreateExternalId`) · `convex/quizEvents.ts` ·
`docs/analytics/README.md`
