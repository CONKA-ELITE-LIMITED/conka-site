# CONKA Brand Voice & Copy Guidelines

> **Last updated:** 2026-03-30
> **Context:** Shared brand guidelines for all customer-facing copy — website, landing pages, funnel, ads, email. Aligned with January Brands performance marketing strategy.

---

## What CONKA is

CONKA is a UK-based liquid nootropic brain shot brand. We sell 30ml daily brain shots — **CONKA Flow** (energy/focus) and **CONKA Clear** (clarity/recovery) — primarily through subscriptions. The format is liquid, not capsules. This is the core differentiator.

---

## Brand voice

**Confident-clinical.** Premium but not elitist. Authoritative but accessible. Never corporate. Never vague.

Default tone: direct, clinical-confident, no fluff. Like someone who knows exactly what they're talking about and has the data to back it.

---

## Key proof assets

Use these across all copy. Always back claims with specifics.

| Asset | Value |
|-------|-------|
| Bottles sold | 150,000+ |
| Reviews | 500+ five-star (Loox verified) |
| University partnerships | Durham + Cambridge/Exeter |
| Certification | Informed Sport (280+ banned substances tested per batch) |
| Patent | GB2620279 |
| Cognitive tests completed | 5,000+ |
| Test participants | 150+ |
| Finn Russell improvement | +28.96% |
| Patrick Bamford improvement | +27.93% |
| Jade Shekells (Paris 2024 Olympic) | +36.72% |
| Companion app | Cognitive testing — measurable scores, not just claims |
| Guarantee | 100-day money-back (subscribers) |
| Daily cost | £2.29/day (28-pack subscription) |
| Research investment | £500,000+ · 25+ clinical trials |

---

## Copy rules

1. **Lead with pain or a counterintuitive truth** — never with the product name
2. **Back every claim with a specific number** — "+28.96%" beats "improved performance"
3. **Include at least one verifiable proof point per section**
4. **Reference the 100-day guarantee at every conversion point** (BOF/retargeting especially)
5. **No vague language** — "supports brain health" is weak; "Finn Russell improved 28.96% in 8 weeks" is strong

---

## Copywriting frameworks

When creating ad or landing page copy, specify which framework is being used:

| Framework | When to use |
|-----------|-------------|
| **PAS** (Problem → Agitate → Solution) | Cold traffic, awareness stage 1-2 |
| **BAB** (Before → After → Bridge) | Warm traffic, awareness stage 2-3 |
| **Authority First** | High-scepticism audiences, authority-led positioning |
| **Comparison** | Competitive positioning (vs coffee, vs capsules, vs other nootropics) |
| **Story** | Testimonial/case study led, retargeting |

---

## Awareness stages (Schwartz)

All copy should target a specific awareness stage:

| Stage | Audience | Approach |
|-------|----------|----------|
| 1 — Unaware | Doesn't know they have a problem | Lead with pain/identity |
| 2 — Problem Aware | Knows the problem, not the solution | Agitate the problem, introduce category |
| 3 — Solution Aware | Knows solutions exist, doesn't know CONKA | Differentiate (liquid format, data, app) |
| 4 — Product Aware | Knows CONKA, hasn't bought | Proof, guarantee, social proof, urgency |
| 5 — Most Aware | Past customer or very warm | Offer, convenience, loyalty |

---

## Claims compliance

All customer-facing copy must comply with UK/EU food supplement regulations (EFSA 1924/2006). **`docs/branding/CLAIMS_COMPLIANCE.md` is the authority** on the rules, the traffic-light system and the anchor symbols; `docs/product/FORMULATION_SPEC.md` is the authority on doses. The summary below is orientation only, not the rulebook.

Key rules:
- No quantified health claims (e.g. "improves focus by 18%") — use observational framing or EFSA-authorised claims
- EFSA-authorised claims for Vitamin C and B12 are permitted (marked with ††)
- Study references must be observational: "In one study, participants showed..."
- "Detox" is not an authorised claim
- Speed-of-effect claims require careful framing

---

## Constants

Offer terms are centralised in `app/lib/offerConstants.ts`. Always import from there — never hardcode guarantee periods or offer terms in components.
