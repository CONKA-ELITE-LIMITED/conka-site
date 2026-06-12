# Listicle Format - Reference Evaluation + Requirements

Status: EXPLORATION. Not scoped, not ticketed. Build waits for clear guidance (offer mechanics + persona content). Part of the [landing conversion programme](./README.md).

Reference: https://usecloud.co/pages/glp-1-v20#product (Cloud gummies, a successful paid-traffic listicle). Structure extracted from the live page 2026-06-12.

## The blueprint (top to bottom)

1. **Testimonial hook** - a real customer quote with name + "Verified Customer" is the first thing on the page, before any brand claim.
2. **Offer banner** - "Limited Time Offer: Save 49% + Free Shipping on your first order".
3. **Proof bar** - 4.8 stars | 1,789+ reviews | 10,000+ daily users.
4. **Listicle headline, persona-locked** - "Five Benefits GLP-1 Users Love About Cloud", subtitle names the exact drugs the audience is on (Mounjaro, Ozempic, Wegovy). The page only speaks to one person.
5. **Early CTA pair** + a trust stat (60k+ bags delivered): offer restate + "Try them Risk-Free for 30 Days".
6. **Items 1-4, identical anatomy:**
   - number + category tag ("1 - Digestion")
   - benefit headline ("Better Digestion (Seriously)")
   - problem paragraph that VALIDATES a pain the persona recognises ("the side effect nobody warns you about")
   - solution paragraph mapping named ingredients to that exact pain
7. **Mid-list proof break** - "Real Users, Real Results": survey stats (84% improved digestion, 81% regularity, 9,288 would recommend) with a methodology footnote.
8. **Item 5 is social proof, not a benefit** - "Bonus: Used by Thousands Daily" (1,789 five-star reviews). The list's payoff item is the herd signal.
9. **Product/offer section at `#product`** - ads deep-link straight here. Rating recap, what you get (28 servings, 3/day), risk reversal (30-day money back), certification badge (Informed Choice), another named testimonial.
10. **Pricing cards** - bundle tiers with strikethrough anchor prices (£99.98 struck to £49.99), "MOST POPULAR" / "BEST VALUE" labels, subscription framing, free next-day shipping.
11. **FAQs** close the page.

## Why it converts (the transferable principles)

- **Total persona lock.** Headline and subtitle name the reader's exact situation. Perfect message match with the ad that sent them. This is the same principle our whole programme is built on.
- **Problem-agitate-solve per item.** Each item names an underdiscussed pain first and earns the right to pitch. The product paragraph is specific (named ingredients, named mechanism), not vague benefit language.
- **Numbered list = consumption momentum.** Scannable, finishable, mobile-native. You always know how much is left.
- **Proof is structural, not decorative.** Proof appears at the top (stars bar), the middle (survey stats with methodology), and the close (reviews + testimonial). The last list item itself is social proof.
- **Risk reversal + anchored offer, repeated.** Discount + free shipping + money-back guarantee appear at hook, mid-page, and close. Pricing is anchored with strikethroughs and bundle tiers.
- **Purchase happens on-page.** The ad deep-links to `#product`; the buy box is on the listicle itself. No extra navigation between conviction and checkout.
- Static, fast, image-per-item. No app-like behaviour to slow first paint.

## What CONKA needs to build this format

Fits the existing `/go/[slug]` system: a `format: "listicle"` renderer beside the quiz engine, same registry, route, analytics props, and clinical style.

**Config shape (draft):** ordered sections instead of screens: `hookTestimonial`, `offerBanner?`, `proofBar`, `items[{ n, tag, headline, problem, solution, image?, chart? }]`, `proofBreak` (stats, reuse AnimatedStat/BarChart), `offer` (product section + pricing), `faq?`.

**Renderer differences from the quiz:** normal scrolling page, not screen-by-screen. Drop-off tracking via IntersectionObserver (`landing:section_viewed` per item) instead of screen index. CTA anchors to the on-page offer section.

**Reusable today:** charts and stat components, QuizButton, funnel pricing/variant data (`app/lib/funnelData.ts`), and the isolated `funnelCheckout()` for an embedded buy box (this is how we match Cloud's on-page purchase without building checkout).

**CONKA already owns the proof assets the format needs:** Informed Sport certification (their Informed Choice badge equivalent), the 100-day guarantee, university research associations, app cognitive-test data for stats. The gap is packaging them per persona.

**Estimate once unblocked:** renderer ~1 to 1.5 days; content per persona is the real work.

## Open decisions (blockers before scoping)

1. **Offer mechanics.** Cloud leans hard on 49% off + free shipping + bundle anchors. What is CONKA's listicle offer? Existing assets: subscribe-and-save, 100-day guarantee, free UK shipping. Decide whether a first-order discount exists and how it is framed.
2. **On-page purchase vs handoff.** Embedded buy box calling funnelCheckout (Cloud's pattern, fewer steps) vs CTA to /funnel (reuses an existing page, slower). Recommend embedded, but it adds a day.
3. **Stats and reviews source.** What numbers can we honestly show in a proof bar and proof break (review count, users, app data)?
4. **Item count and angles per persona** - content session output, same as quiz copy.
