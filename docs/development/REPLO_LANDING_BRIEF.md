# Replo Landing Page Brief — /start

**Purpose of this doc:** capture the sections, structure, copy, and intent of the current `/start` landing page so it can be rebuilt in Replo. Architecture and content only — styling is a separate doc (`REPLO_STYLE_CHEATSHEET.md`).

**Source page:** `https://www.conka.io/start` — noindex, paid traffic only (Meta + Google ads).

---

## Page meta

| Field | Value |
|---|---|
| Title | Try CONKA \| Daily Nootropic Brain Shots |
| Description | Two shots a day. 16 active ingredients. Informed Sport certified. Try CONKA Flow and Clear with a 100-day money-back guarantee. |
| Robots | noindex, nofollow (paid traffic only — must not rank organically) |
| Canonical | https://www.conka.io/start |

## Global offer + pricing (used across every section)

- **Hero offer:** "Get Both from £1.61/shot" (Flow + Clear monthly subscription)
- **Per day:** £3.22/day
- **Per month:** £89.99/month
- **Guarantee:** 100-Day Money-Back Guarantee
- **Coffee comparison:** £5.00/day for coffee → £53/month savings vs CONKA
- **Ingredients:** 16 active
- **Trust signals:** 150,000+ bottles sold · 4.7/5 average · 500+ verified reviews · Informed Sport certified

## Primary CTA

Every CTA button on the page leads to the funnel/checkout. Default label: **"Get Both from £1.61/shot"**. Variants used: "Try it 100% Risk Free Now", "Try CONKA Today".

---

## Page architecture (8 sections, in order)

1. Hero
2. Formula Split (Flow + Clear)
3. Testimonials
4. Value Comparison (2pm crash + price)
5. 100-Day Guarantee
6. FAQ
7. Final CTA
8. Disclaimer footer

Sections 1–7 each end in the primary CTA. That repetition is deliberate.

---

## 1. Hero

**Purpose:** Above-the-fold pitch. Establish what CONKA is, prove demand, drive the primary CTA.

**Elements (in order):**
- Stat eyebrow: `150,000+ bottles sold`
- H1: **Brain Performance in One Daily Shot.**
- Subline: *Transform your focus, memory, and mental endurance with a patented nootropic formula, clinically dosed for real, measurable results.†*
- Hero image (lifestyle shot)
- CTA: **Get Both from £1.61/shot**
- CTA sub-line: *Patented formula · Informed Sport certified · 100-day guarantee*
- Trust band: 5 customer avatars + ★★★★★ 4.7/5 + Informed Sport certified logo

**Assets:**
- Hero image: `/lifestyle/CreationOfConkaBlack.jpg`
- Avatars: `/avatars/1.jpg` – `/avatars/5.jpg`
- `/logos/InformedSportLogo.png`

---

## 2. Formula Split

**Purpose:** Show what's in the box. Frame CONKA as a deliberate AM/PM system (two shots), not a single pill.

**Section header:**
- Eyebrow: `// The formulation · ING-01`
- H2: **Two shots. Built around your day.**
- Sub: *16 active ingredients · 2 daily shots · clinically dosed*

**Two product cards:**

| Card | Dose | Window | Name | Tagline |
|---|---|---|---|---|
| Left | AM | 06:00–10:00 | CONKA Flow | Calm morning focus. |
| Right | PM | 12:00–16:00 | CONKA Clear | Afternoon reset. |

Each card has a "See what's inside ↗" affordance that opens an ingredients drawer/panel. The full ingredient lists for each formula need pulling from marketing or `app/components/landing/IngredientsPanel.tsx`.

**After cards:**
- Primary CTA
- Lab trust badges row (Informed Sport, lab-tested, GMP — see `LabTrustBadges` for the current set)

**Assets:**
- `/formulas/conkaFlow/FlowNoBackground.png`
- `/formulas/conkaClear/ClearNoBackground.png`

---

## 3. Testimonials

**Purpose:** Social proof. The star aggregate is visible immediately so the proof signal lands even before any individual review is read.

**Section header:**
- Eyebrow: `// Field observations · PROOF-03`
- H2: **Real people. Real results.**
- Aggregate badge: ★★★★★ 4.7 / 5 · 500+ verified reviews

**Structure:**
- Horizontal carousel of customer reviews, with arrow navigation and dot pagination
- Each review card contains: ✓ Verified · date · star rating · product label (FLOW / CLEAR / BOTH) · customer name · optional headline · quote · optional customer photo

**Source of reviews:** `app/lib/customerTestimonials.ts` (`CURATED_TESTIMONIALS`) — 21 testimonials pulled from Loox. **Marketing should pick 8–15 of the strongest for the Replo build.**

**After carousel:**
- Primary CTA
- Lab trust badges

---

## 4. Value Comparison

**Purpose:** The "why pay more" argument. Two stacked figures make the case that CONKA covers the day better than coffee and costs less.

**Section header:**
- Eyebrow: `// Get more for less · SCI-01`
- H1: **The 2pm crash isn't you.**
- Sub: *Caffeine peaks at 9, crashes by 2. CONKA Flow and Clear keep you covered from morning to evening.*

### Fig. 01 — Time in effect

Chart showing three rows across a 06:00–18:00 hour axis:

| Row | Caption |
|---|---|
| Coffee | peak 08–11 · crash 11–14 |
| CONKA Flow | Morning focus · 06:00 — 12:00 |
| CONKA Clear | Afternoon reset · 12:00 — 18:00 |

- Header label: `Fig. 01 · Time in effect`
- Chart title: **Who's covering you, hour by hour.**
- Legend items: Caffeine peak · Crash · CONKA coverage
- Right-aligned note: `Caffeine half-life ~5h`
- Footer source line: `Based on 7,593 cognitive tests · 712 CONKA app users · 30 months` + link "See the full data ↗" → `/app-insights#time-of-day`

### Fig. 02 — Monthly saving

- Header label: `Fig. 02 · Monthly saving`
- Title: **£53/month less than a daily coffee.**
- Row 1: Coffee — £5.00/day
- Row 2: CONKA (Both) — £3.22/day

**After both figures:**
- Primary CTA
- Lab trust badges

---

## 5. 100-Day Guarantee

**Purpose:** Risk-reverse. Tie the long guarantee to the cognitive scoring in the app — the proof system that lets us make the offer in the first place.

**Section header:**
- Eyebrow: `// Trial terms · PROOF-02`
- H2: **100-Day Risk Free Trial**
- Sub: *100 days · Refund guaranteed · Install the app*

**Two-column layout** — body copy on one side, app screenshot on the other.

**Body copy:**

> Most brands offer 30 days. We offer 100. Not generosity. Confidence.
>
> We built an app that measures your cognitive score objectively. Take your baseline on day one, test twice a week. If your numbers do not move in 100 days, contact us for a full refund. No returns. No forms.*
>
> We can only make this offer because we already know it works.

**CTA:** Try it 100% Risk Free Now

**Numbered guarantee bullets (01–04):**
1. Free UK shipping on every order
2. Full refund if your score doesn't improve
3. No return required
4. No forms, no questions, no conditions

**Footnote:** *First-time customers only. Contact info@conka.io within 100 days of your first order for a full refund.*

**Asset:** `/app/AppConkaRing.png` (CONKA app showing the cognitive ring score)

---

## 6. FAQ

**Purpose:** Knock down the final objections before the close. Accordion-style — one question expands at a time.

**Section header:**
- Eyebrow: `// Common questions · FAQ-01`
- H2: **Frequently asked questions**

| # | Category | Question | Answer |
|---|---|---|---|
| 01 | TRIAL | What if my score doesn't improve? | We offer a 100-day money-back guarantee. Try CONKA for up to 100 days, and if you're not satisfied, contact us for a full refund. No returns needed. We're confident enough in the product to take the risk for you. |
| 02 | PRODUCT | What's the difference between Flow and Clear? | CONKA Flow (black cap) is your morning foundation. It uses adaptogens like Ashwagandha and Lemon Balm for calm focus without caffeine. CONKA Clear (white cap) is your afternoon recovery shot. It combines nootropics like Alpha GPC and Glutathione with Vitamin C, which contributes to normal psychological function.†† One of each, every day. |
| 03 | PRODUCT | Can I take just one shot? | Yes. You can subscribe to Flow or Clear individually. However, the two formulas are designed to work as a daily pair. Flow supports your daytime focus and energy, Clear supports your afternoon recovery. Together they cover the full 24-hour cycle, and the combined subscription is better value per shot. |
| 04 | SHIPPING | How quickly will it arrive? | Orders placed before 2pm ship same day. Most UK customers receive their order within 1 to 2 working days. Subscriptions ship free. You'll receive tracking information by email as soon as your order dispatches. |
| 05 | SUBSCRIPTION | How do I cancel? | Cancel, pause, or modify anytime from your account. No contracts, no commitments, no questions asked. We also offer a 100-day money-back guarantee, so if you're not satisfied, you get a full refund. |

**Below the FAQ list:**
- "Still stuck? info@conka.io"
- "Avg response 4h"
- Primary CTA

---

## 7. Final CTA

**Purpose:** Last call. Strip back to a single big primary action.

**Copy:**
- Eyebrow: `// Start today · CONKA-03`
- H1: **Brain Performance. One Daily Shot.**
- Sub: *From £1.61/shot · 100-day money-back guarantee*
- CTA: **Try CONKA Today**

---

## 8. Disclaimer footer

**Purpose:** Legal compliance. Anchor symbols used throughout the page (†, ††, ‡, §, ¶, ^^, *) + the standard UK food supplement legal block.

**Must be carried over verbatim in Replo.** Full text:

- **† Clinically dosed** — Dosages of key ingredients match or exceed the amounts used in published, peer-reviewed studies on those individual ingredients. "Clinically dosed" refers to ingredient-level research, not clinical trials conducted on the CONKA product itself.
- **†† EFSA-authorised health claims** — CONKA Clear contains Vitamin C, which contributes to normal psychological function, the protection of cells from oxidative stress, normal energy-yielding metabolism, the reduction of tiredness and fatigue, and normal functioning of the nervous system. CONKA Clear also contains Vitamin B12, which contributes to normal psychological function, normal energy-yielding metabolism, the reduction of tiredness and fatigue, and normal functioning of the nervous system.
- **‡ Reviews** — Reviews collected via Loox, a verified review platform. Review invitations are sent to customers after purchase. Reviews are genuine and unedited.
- **§ Bottles sold** — Based on cumulative units sold across all channels as of March 2026.
- **¶ Ingredient-level research** — Formulated using ingredients studied across 30+ clinical trials involving 6,000+ participants. These are studies on individual ingredients, not clinical trials on the CONKA product. Individual results may vary.
- **^^ Cognitive test** — The CONKA app uses a clinically validated cognitive assessment developed by Cognetivity Neurosciences from Cambridge University research. The test is FDA cleared as a medical device with 93% sensitivity for detecting cognitive change and 87.5% test-retest reliability, validated across NHS Memory Clinics (ADePT Study, PMC10533908; HRA ISRCTN95636074). Test scores reflect individual cognitive test performance and do not constitute health claims about CONKA products. Many factors, including lifestyle changes, practice effects, and natural variation, may contribute to changes in test scores.
- **\* Guarantee** — 100-day satisfaction guarantee applies to first-time customers. Contact info@conka.io for a full refund within 100 days of your first order if you are not satisfied. See full terms at conka.io/terms.

**Standard legal block:**
> Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle. Do not exceed the recommended daily intake. Keep out of reach of young children. If you are pregnant, breastfeeding, taking medication, or under medical supervision, consult your doctor before use.
>
> CONKA Ltd · Registered in England & Wales

---

## Section-flow rationale

The order mirrors a standard direct-response funnel:

1. **Hero** — what + proof of demand → CTA
2. **Formula Split** — what's actually in it → CTA
3. **Testimonials** — proof from peers → CTA
4. **Value Comparison** — why it's worth the price (cheaper than coffee, covers the full day) → CTA
5. **Guarantee** — risk reversal (the offer only works because the app proves the result) → CTA
6. **FAQ** — kill final objections → CTA
7. **Final CTA** — last call
8. **Disclaimer** — legal

---

## Assets checklist

Pull from the existing site or marketing's master folder:

- `/lifestyle/CreationOfConkaBlack.jpg` — hero image
- `/avatars/1.jpg` – `/avatars/5.jpg` — trust band avatars
- `/logos/InformedSportLogo.png`
- `/formulas/conkaFlow/FlowNoBackground.png`
- `/formulas/conkaClear/ClearNoBackground.png`
- `/app/AppConkaRing.png` — guarantee section app screenshot
- Customer review photos (per testimonial — source from Loox)
- Lab trust badges set (see `LabTrustBadges` component for current list)

## Copy + compliance references

- **Brand voice doc:** `docs/branding/BRAND_VOICE.md` (confident-clinical tone; no em dashes in copy; claims must be EFSA-compliant)
- **Claims compliance:** run `/review-claims` before publishing any new copy

## Analytics to wire in Replo

If the Replo page lives on a Shopify subdomain (e.g. `lp.conka.io`), confirm before launch:

- Meta Pixel installed with the **same pixel ID** as `conka.io` (`NEXT_PUBLIC_META_PIXEL_ID`)
- Meta Pixel set to use **root-domain first-party cookies** (`.conka.io`) so `_fbp` persists across subdomains
- Triple Whale Shopify app installed
- GA4 cross-domain measurement configured (admin → data streams → configure domains)
- Test PageView, ViewContent, AddToCart, InitiateCheckout, Purchase in Meta Events Manager before pointing ad spend
