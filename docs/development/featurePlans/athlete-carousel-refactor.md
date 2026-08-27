# Athlete Credibility Carousel Refactor

Cut the height of the athlete beat and put the review first. Benchmarked against AG1 and IM8.

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Tighten the carousel (height and hierarchy) | Not Started |
| 2 | Consolidate the `/start` CROAthletes fork | Not Started |
| 3 | Home entry in `PAGE_NARRATIVES.md` | Not Started |
| 4 | Carousel engagement event | Future |

**Design language:** Simple DTC. See DESIGN_SYSTEM.md section 8.5.

---

## Problem

The athlete beat is the page's strongest social proof, and its quote (the actual review) is unreachable on a phone. Mobile spends a 3-line subheader, a roster strip, a counter row and a full-height portrait before the first word an athlete says. 74% of traffic is mobile paid social, so this is the governing view.

**Who it serves:** cold mobile paid-social traffic on home and the three PDPs, deep enough into the page to be evaluating credibility.

**Business impact:** Acquisition / CRO. Gets the review above the fold in the section it belongs to, and shortens the scroll to the FAQ and final CTA below it.

**Appetite:** a day or two.

---

## The finding that shaped this

The desktop layout is already the target pattern. The feature card is:

```
grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]
```

Image left, quote right, side by side. On mobile it collapses to one column, so an unconstrained portrait stacks on top and pushes the quote off screen.

**The height problem is almost entirely mobile.** That is why this is a day of work rather than a rebuild.

---

## Benchmark

AG1 and IM8 both run: title, then straight into a peek-style swipe carousel. No subheader, no counter, no arrows, no roster strip. Card = image, name, short credential, quote.

Their cards are not smaller than ours. The height goes elsewhere: we spend a subheader, a roster strip and a counter before the first quote, and our portrait is close to full-bleed tall where theirs is cropped. Three of those four are chrome.

**What we keep that they do not have:** the roster strip. It is the one element that shows breadth (seven athletes at once) rather than one at a time, and it doubles as the scroll indicator MOBILE_OPTIMIZATION requires, which is what lets the counter go.

---

## Phase 1: Tighten the carousel (ACTIVE, SCRUM-1267)

1. **Collapse the header to one title.** Drop the `<p>` subheader entirely. Its clause "on the days that matter most" is duplicated verbatim in `BrainFuelBand`, so this also removes a literal repeat on home. `AthleteCredibilityCarousel.tsx:97-108`
2. **Remove the counter pill and the achievement pill.** Both are Clinical devices on a Simple DTC surface. Keep the arrows: they overlay the image and cost zero height. `:171-177`
3. **Cap the mobile portrait.** Fixed aspect ratio below `lg` so the text column enters the viewport with the image. Desktop's 5fr/6fr split untouched. **Main height win.** `:150-189`
4. **Shrink the roster strip into an index.** Smaller thumbnails, tighter gap, keep the active ring. `:110-146`
5. **Add a `compact` variant to `InformedSportCertification`.** `variant?: "full" | "compact"`, defaulting to `"full"` so `/professionals` is untouched by omission. Compact renders the logo plus the bold line, dropping the 3-line paragraph.

## Phase 2: Consolidate the `/start` fork (ACTIVE, SCRUM-1273)

`app/components/cro/CROAthletes.tsx` (332 lines) is a full fork of the carousel (315 lines) with its own athlete array and its own Informed Sport block. A restyle does not propagate to `/start`.

The two `ATHLETES` arrays are byte-identical except one field: the carousel has `achievementMono` (the mono pill, deleted in Phase 1), `/start` has `bio` (a full credential sentence).

**Decision (Rudh, 27 Aug):** the short line wins. The consolidated card shows name plus `sport - role`. Both `achievementMono` and `bio` are dropped from the shared type. `/start` loses the bio sentence, accepted because it costs 2 to 3 lines of exactly the height Phase 1 is reclaiming.

Both `/start` and `/start-b` get the shared component. `next.config.ts` 307s `/start` to `/start-b` for a live trial, so `/start-b` is reachable and `/start` is the revert path; changing only one leaves the revert inconsistent.

## Phase 3: Home entry in PAGE_NARRATIVES.md (ACTIVE, SCRUM-1274)

The highest-traffic page on the site has no story map. Flagged as a risk in home-page-round-2.md and never actioned.

## Phase 4: Carousel engagement event (FUTURE)

Fire an event when someone advances the carousel, so we can tell whether the tightening made the section more engaging or merely shorter. Deliberately not in this appetite: `home:section_viewed` shipped 27 Aug, so there is no baseline to compare against yet.

---

## Decisions

**Keep the roster strip.** The original Phase 3 brief and SCRUM-1267 AC3 said keep it as an index; AG1 and IM8 have no equivalent. Rudh chose keep-and-tighten: breadth is the thing our version has that theirs does not, and it earns its height by also serving as the scroll indicator.

**Carousel only, note the rest.** Home makes the athlete argument three times (BrainFuelBand at 5, AthleteReviewFeature at 7, the carousel at 12). Recorded as the weakest link in the new PAGE_NARRATIVES entry rather than fixed here.

**Consolidate rather than fork.** `/start` takes no ad traffic (Rudh), so the usual "do not touch a paid-traffic page in a refactor it did not ask for" caution does not apply.

**No data informed this.** `home:section_viewed` shipped 27 Aug, so there is no usable history on whether people reach or drop at the athletes section. This is an argument for keeping the refactor cheap and reversible rather than authoritative. Revisit in a week.

---

## Rabbit holes

- **The portraits are cutouts** (`*NB.jpg`, no background). Capping the aspect ratio with `object-cover` can crop heads. Budget for per-image `object-position`. **Circuit breaker:** if more than two need individual tuning, stop and use a fixed height with `object-contain` instead.
- **Consolidation tempting a rewrite.** Phase 2 is a delete-and-swap, not a redesign of the `/start` section. If `/start` needs layout changes to accept the shared component, stop and reassess.

## No-gos

- `BrainFuelBand` is not touched, and its four stats are not folded in. That is Phase 6 of `pdp-structure-rework.md` and outside this appetite.
- `AthleteReviewFeature` is not touched.
- No home-only variant prop on the carousel. If per-surface conditionals appear, stop and reassess.
- No route, redirect or metadata changes.

## Risks

- `/professionals` regresses if the Informed Sport variant defaults to compact. Mitigated by defaulting to `"full"`.
- `/start-b` is a live 307 trial destination. Phase 2 changes a page inside a running experiment; confirm the trial is not mid-read.
- SCRUM-1267's original AC2, AC3 and AC7 predate the AG1/IM8 benchmark. Restated on the ticket.

---

## Files

| Path | Why |
|------|-----|
| `app/components/AthleteCredibilityCarousel.tsx` | The component. Client, 315 lines, holds the local `ATHLETES` array, `NavButton`, feature card, roster strip, renders `InformedSportCertification`. One responsive component, no mobile/desktop split |
| `app/components/InformedSportCertification.tsx` | The badge to reduce. **Also rendered standalone by `app/professionals/page.tsx:89`**, so it needs a prop, not a deletion |
| `app/components/cro/CROAthletes.tsx` | The `/start` fork, deleted in Phase 2 |
| `app/lib/athleteData.ts` | New in Phase 2, the single athlete array |
| `app/components/AthleteSportMarquee.tsx` | Breadth strip, rendered separately by home and the PDPs (`showMarquee={false}`), so it is part of the section's total height |

**Consuming surfaces (verification):** `app/page.tsx`, `app/conka-flow/page.tsx`, `app/conka-clarity/page.tsx`, `app/conka-both/page.tsx`, `app/(trial-b)/start-b/page.tsx`, `app/start/page.tsx`, `app/professionals/page.tsx`.

## References

- `docs/development/featurePlans/home-page-round-2.md` - this supersedes its Phase 3
- `docs/development/featurePlans/pdp-structure-rework.md` - Phase 6 overlaps; the styling half closes with this work, the stats-merge half does not
- `docs/branding/DESIGN_SYSTEM.md` section 8.5 - Simple DTC spec
- `docs/branding/MOBILE_OPTIMIZATION.md` - horizontal scroll carousel rules

## Jira tickets

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1267 | Tighten the athlete credibility carousel: cut height, lead with the review | 1 | To Do |
| SCRUM-1273 | [Frontend] Consolidate the /start CROAthletes fork onto the shared carousel | 2 | To Do |
| SCRUM-1274 | [Docs] Add the home entry to PAGE_NARRATIVES.md | 3 | To Do |
