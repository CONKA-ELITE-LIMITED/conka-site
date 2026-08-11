# Magic Mind Hero Teardown + CONKA HeroV2 Alignment

Living competitive-watch / teardown — captures what Magic Mind (MM) is currently doing
on their home page, their exact mobile values (pulled from saved source), and what it
tells us about their content and optimisation approach. The goal is to **learn what MM
is doing**, not to reflexively copy it. Where we've prototyped an equivalent (`HeroV2`),
the mapping is noted — but nothing here is a committed change.

Relationship to `magic-mind-video-hero.md`: that doc is our looped-video hero (the
*previous* MM playbook). MM has since trialled a static-photo hero instead. We have
**not** confirmed a move off our video hero — `HeroV2` is a prototype we're evaluating
against it on `feature/MM-home-page-hero-alignment`. Both remain live options.

## What MM is trialling (hero direction)

MM's current home hero is a **single static photograph** of one shot held in a hand
against a soft colour gradient, in place of an animated/looped hero. The apparent intent:
move away from the polished/rendered/"AI" look toward something that feels real, tactile,
and human — the hand and real-world lighting are the point.

Structurally it's **three distinct stacked blocks** (asset on top, copy below, CTAs
below) rather than text-overlaid-on-media, so nothing competes for the same pixels and
the photograph is never scrimmed.

**For CONKA this is a hypothesis, not a verdict.** Our current home hero is the earlier
MM playbook (a full-bleed looped `BothStillWater` video with overlaid text). `HeroV2`
prototypes the static-stacked alternative so we can compare — the video is not ruled out
until we decide.

## MM exact mobile hero values (from source)

Extracted from `MM-LandingPage_files/hero.css` (saved copy of their live page). Phones
≤540px inherit base + the `max-width:1100px / 990px / 540px` blocks. Resolved font is
Circular Std; `--light-background` = `#ffffff`.

**Layout**
- `hero__wrapper`: flex; **≤990px `flex-direction: column-reverse`** → image renders on
  top, info below. ≤540px `min-height: auto`.
- `hero__info` ≤990px: `padding: 32px 16px 24px` · `gap: 32px` · flex column · centred.
- DOM order is info-first, image-second; the column-reverse is what puts the image on top.

**Image** (`hero__image`)
- `object-fit: cover`; intrinsic `1440×1352` (≈1:0.94, near-square).
- ≤540px: `max-height: 254px` · `object-position: 41.504% 0.941% !important`.
- **No border-radius, no margin, no aspect-ratio** — full-bleed, straight edges. At a
  375px viewport the rendered box is **375×254** (≈3:2 landscape band).

**Title** (`hero__title`)
- `44px` / line-height `48px` · weight **700** · letter-spacing 0 · `#000`.
- Two `<p>` lines, **both 44px** (equal size). Line 2 is `<em>` → italic, weight **400**.
- (88px/84px is the desktop ≥1100px value.)

**Description** (`hero__description`)
- `max-width: 470px` · `font-size: 22px` · line-height **25px** (~1.14, very dense) ·
  weight `450` · `#000`. No mobile override.

**Buttons** (`hero__buttons`)
- `display: grid` · `grid-template-columns: repeat(2, minmax(0, 320px))` → **two side-by-side**,
  not stacked · `gap: 16px` · `justify-content: center`. No margin-top (spacing is the
  parent's 32px gap).
- Filled `hero__button`: `padding: 16px 40px` · `border-radius: 90px` · bg `#05060a` ·
  `border: 2px solid #05060A` · color `#f0f0eb` · `14px`/`15px` · weight 700 ·
  letter-spacing 5%. Labels uppercase in markup (no `text-transform`).
- `hero__button--outline`: transparent bg, `#05060a` text, same border. ≤540px
  `padding-inline: 10px`, `gap: 3px`.

**Vertical rhythm**
- A single `hero__info gap: 32px` governs **title→description AND description→buttons** —
  flat 32px between each. 32px top pad, 24px bottom pad.

## Content / copy observations

- **Two lines, roman + italic.** "Sharper mind." (roman) / "*Sustained energy.*" (italic
  emphasis) — a benefit + a differentiator, second line styled to carry the emotional beat.
- **One tight support line.** ~10 words, plain-language mechanism ("clinically-backed
  multivitamins for your mind"). No stacked claims in the hero.
- **Dual CTA, unequal weight.** Filled "SHOP NOW" (primary) + outline "TAKE THE QUIZ"
  (secondary, a lower-commitment path). The outline button carries a small arrow SVG.
- **No trust row in the hero.** Reviews/rating live further down, not competing with the
  primary action. (CONKA intentionally keeps a trust micro-row — see divergences.)

## Optimisation observations

How MM handles the hero technically. **These are observations, not a to-do list — we keep
our own optimisation unless one of these is a known, specific win over what we already do.**

- **`loading="eager"` on the hero image** — it's the mobile LCP element, so no lazy-load.
  (We already know eager + prioritised LCP is correct; this is table stakes, not a new idea.)
- **Full responsive `srcset`** (320→1440w) + `sizes` so phones fetch a small file.
- **`object-position` instead of a crop** — one master asset, framed per breakpoint via
  `object-position` + `max-height`. Cheap, no extra exports. (We do the same in `HeroV2`.)
- **Straight-edged full-bleed** — no radius/shadow on the asset block; the colour field in
  the photo *is* the panel, so there's no separate styled container to paint.

Net: nothing here beats our current approach in a way that forces a change. The one
CONKA-specific gap is our own (see refinement 4: `HeroV2` still uses a plain `<img>`),
and that's driven by our perf rules, not by matching MM.

## MM navigation (observed — not evaluated yet)

Logged for the competitive watch; no CONKA action implied.

- **Floating pill header.** MM's nav is now a rounded pill bar floating *over* the hero
  image (hamburger · wordmark · cart), not a solid bar in normal flow. It detaches the nav
  from the page background and lets the hero photo run to the very top.
- **New expanded shop menu.** The hamburger opens a redesigned shop/product menu (product
  cards with per-item detail). Worth watching how they structure product entry from the nav.
- **Persistent top announcement bar** above the nav ("BOOST MENTAL PERFORMANCE — …").

CONKA currently uses a conventional in-flow `Navigation` with its own expanded menu
(Shop-by-product: Both / Flow / Clear). No change proposed — this is intel on where MM is
heading, to revisit if/when we look at nav.

## CONKA HeroV2 mapping (prototype — current state)

Component: `app/components/landing/HeroV2.tsx`, mounted `lg:hidden` in `app/page.tsx`
(desktop still on the video hero). Nav is our existing `Navigation` above the hero (MM
floats a nav pill over the image; we do not).

| Element | MM (phone) | CONKA HeroV2 | Note |
|---|---|---|---|
| Structure | 3 stacked blocks (image top) | 3 stacked blocks (image top) | **Matched** |
| Image band | 375×254 (~3:2), full-bleed, no radius | `aspect-[3/2]`, full-bleed `-mx-5` | **Matched** |
| Asset | 1 shot, hand, colour gradient | `FlowMmHero.jpg` (Flow, hand, pink gradient) | **Matched intent** |
| Framing | `object-position: 41.5% 0.9%` | `object-[46%_44%]` | Ours centres the bottle |
| Title | 44px, both lines equal, L2 italic 400 | L1 `clamp(2.4→3.4rem)` nowrap dominant, L2 26px | **Intentional divergence** — L1 leads |
| Description | 22px / 25px (~1.14), weight 450, black | 17px / 1.32, `font-medium`, black | Softer than MM (see refinements) |
| CTA | 2 black pills side-by-side | 1 navy mono pill + trust row, centred | **Intentional divergence** (our design system) |
| Title→desc gap | 32px | 24px (`mt-6`) | Candidate for 32px |

## Intentional divergences (keep)

- **Dominant line 1.** We enlarge "A Sharper Mind." and shrink line 2, rather than MM's
  equal-weight two lines. Deliberate — the headline is the hook.
- **Our CTA system.** Single navy (`#1B2757`) mono-label pill (`ConkaCTAButton`) + a trust
  micro-row (rating, review count, daily users). MM uses two black pills and no hero trust
  row. We keep our conversion furniture.
- **No nav-over-image.** Our `Navigation` sits above the hero in normal flow.

## Candidate refinements (deferred — not applied)

Captured for a later pass; no changes made:

1. **Denser description.** MM runs 22px/25px. Ours is 17px/1.32. Moving to ~20px with
   ~1.2 leading (or matching 22/25 exactly) would hit the "larger + denser" direction.
2. **Title→description gap = 32px** (`mt-8`) to match MM's flat rhythm.
3. **Framing sweep.** Confirm `object-[46%_44%]` keeps the bottle + cap on the common
   phone widths (360 / 390 / 430).
4. **LCP hardening before ship.** HeroV2 currently uses a plain `<img>`. For the mobile
   LCP, move to `next/image` with `priority` + a `sizes` string (mirroring MM's eager +
   srcset approach).

## References
- Video-hero direction (the alternative still in play, not superseded):
  `docs/development/featurePlans/magic-mind-video-hero.md`.
- Design system (Simple DTC, navy `#1B2757`): `docs/branding/DESIGN_SYSTEM.md` §8.5.
- Performance / LCP rules: `docs/development/PERFORMANCE_OPTIMISATION.md`.
- Component: `app/components/landing/HeroV2.tsx`. Mount: `app/page.tsx` (`lg:hidden`).
- Source teardown: `~/Desktop/DownloadsForClaude/MM-LandingPage.html` (+ `_files/hero.css`).
