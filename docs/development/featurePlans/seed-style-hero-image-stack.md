# Seed-Style Hero Image Stack

**Branch:** seed-style-product-hero

## Problem

Product and protocol hero components use a single-image slideshow (ProductImageSlideshow) that was designed for the funnel. Assets carry product information (thumbnails, prev/next arrows, rounded borders) rather than brand feeling. The layout also has the wrong column sticky -- the left (image) is stuck while the right (widget) scrolls, which is the inverse of the Seed/Suri PDP pattern where the widget floats alongside a tall scrolling image gallery.

## Solution

Replace the slideshow on desktop product/protocol heroes with a vertically stacked column of 6 images (4:5 aspect ratio, no chrome). Cadence selection drives which box image appears in slot 1. Sticky is moved to the right (widget) column so the image column scrolls naturally as the user reads through the information panel.

## Scope

**Phase 1 (this branch):** Desktop only. Mobile keeps existing ProductImageSlideshow behaviour.

**Phase 2 (future):** Mobile Flickity carousel per Suri pattern (80% width, peek of next slide).

## Implementation

### New files

- `app/lib/heroImageConfig.ts` -- maps formula/protocol + cadence to 6-image array
- `app/components/product/HeroImageStack.tsx` -- renders the stacked gallery (no state, no chrome)

### Modified files

- `app/components/product/ProductHero.tsx` -- swap slideshow for stack; flip sticky to right column
- `app/components/protocol/ProtocolHero.tsx` -- same for Balance (isCadenceMode path only)

### Untouched

- `ProductHeroMobile.tsx` -- mobile deferred to Phase 2
- `ProtocolHeroMobile.tsx` -- mobile deferred to Phase 2
- `ProductImageSlideshow.tsx` -- kept; still used by FunnelHeroAsset
- `FunnelHeroAsset.tsx` -- completely untouched

## Image mapping

Layout: slot 1 = full-width portrait rectangle; slots 2-5 = 2×2 square grid (matches Seed pattern).

### Flow (formulaId "01")
| Slot | monthly/OTP | quarterly |
|------|-------------|-----------|
| 1 (hero) | `/formulas/conkaFlow/FlowBox.jpg` | `/formulas/conkaFlow/FlowQuarterly.jpg` |
| 2 | `/lifestyle/flow/FlowDrink.jpg` | same |
| 3 | `/lifestyle/flow/FlowHold.jpg` | same |
| 4 | `/lifestyle/flow/FlowDeskClutter.jpg` | same |
| 5 | `/formulas/conkaFlow/FlowNutrition.jpg` | same |

### Clear (formulaId "02")
| Slot | monthly/OTP | quarterly |
|------|-------------|-----------|
| 1 (hero) | `/formulas/conkaClear/ClearBox.jpg` | `/formulas/conkaClear/ClearQuarterly.jpg` |
| 2 | `/lifestyle/clear/ClearDrink.jpg` | same |
| 3 | `/lifestyle/clear/ClearCloseTwoHands.jpg` | same |
| 4 | `/lifestyle/clear/ClearDesk.jpg` | same |
| 5 | `/formulas/conkaClear/ClearNutrition.jpg` | same |

### Balance (protocol 3 -- both)
Placeholder lifestyle shots until new Canva assets arrive.
| Slot | monthly/OTP | quarterly |
|------|-------------|-----------|
| 1 (hero) | `/formulas/both/BothBox.jpg` | `/formulas/both/BothQuarterly.jpg` |
| 2 | `/lifestyle/ConkaAtWorkDesk.jpg` | same |
| 3 | `/lifestyle/ConkaJeansHold.jpg` | same |
| 4 | `/lifestyle/GirlsLaughing.jpg` | same |
| 5 | `/lifestyle/ConkaOverShoulder.jpg` | same |

## Layout change

Before: left column sticky (`lg:sticky lg:top-24`), right column scrolls.
After: left column scrolls naturally, right column sticky (`lg:sticky lg:top-8`).

This matches Seed/Suri pattern: widget floats at viewport top while the image column tracks scroll.
