# What to expect timeline

Scroll-driven "what you'll feel, and when" timeline on the three PDPs. A vertical
line draws down as you scroll and each milestone block brightens as the line
reaches it. Desktop (lg+) pairs the timeline with a CSS-sticky product render
column; mobile is header plus stacked timeline only.

> **V2.** This replaced the earlier `WhatToExpectTimeline` (stage-per-product
> copy with desktop/mobile split files and protocol variants). That component,
> its mobile twin and `app/lib/whatToExpectData.ts` are all deleted.

## Location

| File | Role |
|---|---|
| `app/components/home/WhatToExpectV2.tsx` | The component. Client, content-only |
| `app/lib/whatToExpectV2.ts` | Copy, milestones, header and the sticky-column asset |
| `app/lib/motion.ts` | `drawProgress` (line draw) and `scrubBrighten` (block brighten) |

## Usage

```tsx
<WhatToExpectV2 productId="01" />   // "01" Flow | "02" Clear | "both"
```

Live on `app/conka-flow/page.tsx`, `app/conka-clarity/page.tsx` and
`app/conka-both/page.tsx`. `productId` defaults to `"01"`.

Content-only: the page owns the `<section>` wrapper and background.

## Config

`app/lib/whatToExpectV2.ts` exports:

- `ExpectV2ProductId` = `"01" | "02" | "both"`
- `ExpectV2Milestone` = `{ title, body }`
- `expectV2Milestones: Record<ExpectV2ProductId, ExpectV2Milestone[]>` — five
  milestones per product: First 15 Mins, Next 4-8 Hours, No Crash Ever, Week 1,
  Week 2+
- `expectV2Header` — shared `{ title, subtitle }` across all three products
- `expectV2Asset: Record<ExpectV2ProductId, ExpectV2Asset>` — the portrait render
  for the desktop sticky column

**Copy rule.** The reader's felt experience is the subject ("Most people
feel...", "You'll notice..."); mechanism trails behind "as"; concrete daily
moments over abstract states. Milestone timing maps to the ingredients: fast
actors (Lemon Balm, Rhodiola, Alpha GPC, Ginkgo) carry the early beats,
builders (Ashwagandha, the antioxidant stack) carry Week 1+.

## Motion

GSAP is **not** statically imported. The PDPs are the only routes this component
ships on and nothing else there uses GSAP, so the motion layer loads by dynamic
import only when the section approaches the viewport, and only when motion is
allowed. It stays out of those routes' first-load JS.

- `drawProgress("[data-wte-line]", "[data-wte-timeline]")` draws the line
- `scrubBrighten("[data-wte-block]")` fades each block from `dim` (0.2) to full
  opacity as it passes through the viewport

The JSX carries the final, fully-lit state, so no-JS, reduced-motion and the
pre-load moment all show the complete timeline. The scrub is position-synced,
so binding late loses nothing. There is no `ScrollTrigger` pin; the desktop
column uses `position: sticky`.

The PDPs mount one tree at a time via `useIsMobile()`, so the `isMobile`
dependency rebinds and refreshes triggers once the tree settles and positions
are measured against the final layout.

See `docs/development/MOTION_GUIDE.md` for the shared helpers.

## Build notes and gotchas

Carried over from the V2 build plan (SCRUM-1253, Aug 2026), which is now deleted.

- **Double render.** Each PDP mounts this section twice, as separate mobile and
  desktop trees. Triggers are scoped per instance; if you touch the motion layer,
  verify the hidden tree's triggers behave rather than assuming one instance.
- **Sticky death.** Any `overflow-x: hidden` ancestor kills the desktop column's
  `position: sticky`. Check the PDP wrapper before changing layout above this
  section.
- **Mobile scrub feel.** Transform and opacity only. If low-end jank appears,
  drop mobile to an in-view brighten rather than fighting the scrub.
- **No ScrollTrigger pin**, deliberately: CSS sticky preserves the
  one-pin-per-page budget.
- **Sticky asset spec:** FMC-style side-profile shots, exactly 4:5 at 810x1013
  (`conkaFlow/FlowShotSide.jpg`, `conkaClear/ClearShotSide.jpg`,
  `both/BothShotSide.jpg`).
- **Five beats, not three.** V2 is taller than V1 on mobile. That is accepted:
  the scroll interaction is the point of the section.
- **No analytics.** This is a passive section and fires no events.

The V2 milestone labels came from the Gray Matters reference; the bodies were
rewritten feeling-first with CONKA trial numbers (28% cortisol, 16% cognition,
35% fatigue).
