# PDP carousel slides

**The general technique is documented in
[`docs/development/IMAGE_ASSET_PIPELINE.md`](../../docs/development/IMAGE_ASSET_PIPELINE.md).**
This file covers only what is specific to this set.

Source for the Flow PDP carousel assets. **Not shipped** — nothing under `app/`
imports this directory; it is design source that renders *into* `public/`.

## Source photography is not in the repo

`assets/` is a **gitignored symlink**. The 15 source images are 6.9MB that never
serve, and they are derived from the Ai Assets library, so they live at:

```
~/.claude/projects/-Users-rudh-Conka-Repos-conkaWebsite/pdp-slide-assets/
```

The slide HTML *is* in the repo, deliberately. Those files carry fourteen live
prices and several claims, so `git grep 39.99` finds every carousel image a price
change invalidates. Nothing else in the repo makes that link.

On a fresh clone, recreate the symlink before rendering:

```bash
ln -s ~/.claude/projects/-Users-rudh-Conka-Repos-conkaWebsite/pdp-slide-assets \
      design/pdp-slides/assets
```

`render.sh` fails with that instruction if the link is missing, rather than
rendering slides with silently broken images.

## Render

```bash
./render.sh          # all slides
./render.sh s1 s4    # just those
```

Output goes to `public/formulas/mmPdpAssetsV2/`. The consumer is
`MM_GALLERY_ASSETS["01"]` in `app/lib/mmPdpData.ts`, plus `starterPackImage`
on Flow `monthly-sub` in `app/lib/offerData.ts` (slide `s0`).

## Slides

| File | Output | Argument it makes |
|------|--------|-------------------|
| `s0` | `FlowStarterKit.jpg` | £152.94 of value for £39.99 (monthly) |
| `s0q` | `FlowStarterKitQuarterly.jpg` | £328.90 of value for £109.99 (quarterly) |
| `s1` | `FlowBenefitStack.jpg` | Four outcomes, not a spec |
| `s2` | `FlowWhatToExpect.jpg` | 15min → week 2+ onset arc |
| `s3` | `FlowIngredients.jpg` | Six ingredients, benefit-tagged |
| `s4` | `FlowVsCoffee.jpg` | Beats coffee and Rx, 6 rows |
| `s7` | `FlowReview.jpg` | 4.7 / 622, Phil B. on the caffeine cycle |
| `c0` | `ClearStarterKit.jpg` | Clear pack, monthly figures |
| `c0q` | `ClearStarterKitQuarterly.jpg` | Clear pack, quarterly figures |
| `c1` | `ClearBenefitStack.jpg` | Cut through the fog |
| `c2` | `ClearWhatToExpect.jpg` | Clear's onset arc |
| `c3` | `ClearIngredients.jpg` | Nine ingredients, 3x3 |
| `c4` | `ClearVsCoffee.jpg` | Same table, Clear bottle |
| `c7` | `ClearReview.jpg` | Aaron H. on the afternoon coffee |
| `shared-proof` | `SharedProof.jpg` | +28.96% measured in the app |
| `shared-tested` | `SharedTested.jpg` | Informed Sport + 4 certifications |
| `s8` | `FlowGuarantee.jpg` | 100 days, Flow box |
| `c8` | `ClearGuarantee.jpg` | 100 days, Clear box |
| `b0` | `BothStarterKit.jpg` | £236.93 of value for £74.99 |
| `b0q` | `BothStarterKitQuarterly.jpg` | £508.87 of value for £149.99 |
| `b1` | `BothBenefitStack.jpg` | Morning to evening, on the tray shot |
| `b2` | `BothWhatToExpect.jpg` | The two-shot day |
| `b3` | `BothIngredients.jpg` | The nine curated across both |
| `b4` | `BothVsCoffee.jpg` | Same table, Both pair |
| `b7` | `BothReview.jpg` | Jack G. on running both |
| `b8` | `BothGuarantee.jpg` | 100 days, Both boxes |
| `t0` | `FlowTrialBoxV2.jpg` | `/go/flow-trial` hero: focus without the crash, 50% off |
| `ct0` | `ClearTrialBoxV2.jpg` | Clear trial hero: beat the afternoon slump, 50% off |
| `bt0` | `BothTrialBoxV3.jpg` | `/go/trial-pack` default hero: sharp from morning to evening, lowest price ever, staggered boxes |
| `tp1` | `TrialPackHowItWorksV2.jpg` | Trial pack explainer: trial today, starter pack day 7, 42% off each month |
| `ftp1` | `FlowTrialHowItWorks.jpg` | Flow trial explainer: 4-shot box today, Flow starter pack day 7, 43% off each month |
| `ctp1` | `ClearTrialHowItWorks.jpg` | Clear trial explainer: same as `ftp1` for Clear |

**Re-rendering a slide the site already serves? Give it a new filename** (bump the
`V2` suffix in `slide_name` above and in the config that references it). Next's
image optimiser caches by URL for a year (`minimumCacheTTL` in `next.config`), so
a changed file under the same name keeps serving the old optimised copy, locally
and on deployed previews. Locally, `rm -rf .next/dev/cache/images` also clears it.

`tp1` burns in Both monthly figures from `offerData.ts` (£74.99, £236.93 of
starter-pack value, 42% vs the £129.97 one-off reference). Like `s0`, re-render it
if any of them change. It carries no trial price: those are still placeholders.
`ftp1` / `ctp1` are the same layout with the single-formula monthly figures
(£39.99 / 20 shots, 28-shot first box, £152.94 of value, 43% vs £69.98).

`bt0` uses `t0` / `ct0`'s structure (stacked headline, sub, tick row, no
benefit list) with a benefit-led headline and a low-barrier sub, "lowest price ever" (SCRUM-1343).
No price is burned in: a figure here contradicted the page's own trial price. Side by side, `Both8Box.jpg` (2752x1536) could
not get larger beside that column: the gap between the boxes is only 196px of
ground (x 1291-1487), so there was nothing to close. It renders from
`assets/Both8BoxStagger.jpg` instead, built in two steps:

1. **Flatten the ground.** The studio ground runs 220 at the corners to 253 behind
   the boxes. Each 64px cell's brightest pixel estimates the ground (cells under
   228 are box and get filled from neighbours), blurred and divided out, then
   luminance 238-248 ramps to white. Result: `Both8BoxWhite.jpg`, ground 255.
2. **Stagger.** The left half (x 0-1389, Flow) drops 900px; the right half
   (x 1389-end, Clear) sits 819px right of it, the offset at which the two
   silhouettes (luminance < 200) come within ~24px. The halves are multiplied onto
   white, uncropped: 2182x2436.

Do not crop the composite tight to the boxes. An earlier version did, and it cut
the floor shadows, leaving a visible line. The slide lets the image run off the
frame and under the copy instead: its ground is white, so no edge shows.

The slide ground is white (as on `b1`), so the flattened ground has no edge.
`mix-blend-mode: multiply` onto a tinted ground was tried and did not apply in the
headless render: the composite showed as a white rectangle.

`t0` is the `galleryLead` in `app/lib/landings/flow-trial.ts`, not part of
`MM_GALLERY_ASSETS`. It carries no price, so a price change does not invalidate
it, but it does claim "50% off for life": re-render if the Skio weekly discount
changes. Slide 2 on that page is `s1`, so the hero deliberately repeats none of
its benefits. Photo: `assets/Flow4BoxLight.jpg`, converted from `Ai
Assets/Box/Flow4BoxLight.webp`.

Two slides are product-agnostic and are shared by both galleries, hence the
`Shared` prefix: proof and testing. The guarantee is not shared — each formula
shows its own box, since the caps differ.

`s1` / `c1` use the hand-hold photographs, which are the only human presence in
the set and the only thing that conveys how small a 30ml shot actually is.
Clear's pricing is numerically identical to Flow's at every cadence, so `c0`
and `c0q` carry the same figures as `s0` / `s0q` and differ only in photograph.

`s0` and `s0q` share one plain photo and differ only in their figures — the
same arrangement the Figma frames use, where monthly and quarterly point at a
single image hash with different labels composited on top.

Flow's pack shot is `FlowStartPackV2.jpg`, cropped from a 2000x2000 square to
the 2400x1380 band around the products (rows 470-1620 of the source). Cropping
rather than letterboxing means it fills the frame width, so there are no side
gaps to colour-match, and the cast shadow stays intact instead of being cut.

## Constraints that shaped these

- **Authored at 2400×1715 (7:5)**, the aspect `ProductImageSlideshow` renders.
  Downsampled to 2000px on render — the carousel tops out near 1400px even at
  3× DPR, so 2000 is headroom, not waste.
- **Type floor: ~90px in the artboard.** Slides render full-bleed at 100vw on
  mobile, so a 390px phone scales the artboard by 6.15×. Anything under ~90px
  lands below 14px and stops being readable. This is why the old comparison
  slide failed: its row labels rendered at an effective 7.6px.
- **No grain overlay.** An earlier version had one; it doubled JPEG weight
  (730K → 372K without) and is invisible below ~1000px.
- **Fonts are the real brand faces** — Neue Haas Grotesk, ABC Favorit and
  JetBrains Mono, loaded from `app/fonts/` via `@font-face`. Figma's MCP cannot
  set Neue Haas at all, which is why these are authored here rather than there.

## Gotchas

- `render.sh` passes `--virtual-time-budget=8000`. Without it Chrome can
  screenshot before the local `@font-face` files load and text renders **blank**
  with no error.
- macOS ships bash 3.2, so `render.sh` uses a `case` statement rather than an
  associative array.
- `FlowCutout.png` was cut from `Product Ai Assets/New Shot Lables/Nomio
  Style/FlowSingle.png` by thresholding on saturation and luminance, then
  filling each row between its first and last hit. A flood fill from the border
  does **not** work — it leaks through the translucent amber glass.

## Prices are burned into `s0` / `s0q`

The bottom bars carry £152.94 / £39.99 and £328.90 / £109.99. This
contradicts the rule in
`docs/development/featurePlans/flow-starter-pack.md` that prices live in HTML,
though the artwork it replaced broke it too. If any figure changes, edit the
relevant slide and re-run `render.sh`.

## Clear's pack photo is a generation behind

Flow uses `FlowStartPackV2.jpg`; Clear is still on `ClearStartPackClean.jpg`,
which is the older treatment. A Clear shot matching the Flow V2 setup would fix
both the label fault below and the treatment mismatch in one go.

## Known fault in the Clear pack photo

`assets/ClearStartPackClean.jpg` shows bottles with **white Clear caps but
"Flow" labels**. Verified at 3x zoom. The artwork it replaces
(`public/formulas/starterPack/ClearStarterPack.jpg`) has the identical fault, so
this is inherited rather than introduced — but it is wrong and the source render
should be regenerated with Clear labels.

## Clear bottle resolution

`ClearCutoutV2.png` is **476x959** of actual bottle against Flow's 435x874, so
Clear now runs about 9% sharper than Flow at matched scale. Aspect matches to
0.001, so layouts transfer between the two without adjustment.

It replaced `ClearCutout.png`, which was 310x624 and was being stretched to
2.79x on `c2` and 1.52x on `b2`. **Every slide renders from V2.** `ClearCutout.png`
is still on disk, unreferenced, because V2 is cut using its alpha channel as a
template — see below — so it is the provenance of the file that replaced it.

### How V2 was cut

The pipeline doc's warning still holds: Clear's silver cap sits at luminance 193
against a 197 backdrop, so no threshold separates it and the silhouette cannot
be re-derived. It did not need to be. `ClearCutout.png` and the full-size
studio render `New Shot Lables/Nomio Style/ClearSingle.png` (2752x1536) are the
**same render at different scales**, so the old file's alpha channel works as a
template:

1. Find the amber-glass bounding box in each — 461x764 in the source against
   300x497 in the cut-out. The ratio is 1.537 on both axes to three decimals,
   which is the confirmation that they are the same render.
2. Scale the old alpha by that factor, crop the source to match, apply.

The mask edge is inherited and therefore soft, but every interior pixel — the
label type, which is the only part that has to read — is native. `ClearSingle`
is the exact counterpart of `FlowSingle`, which `FlowCutout` came from; it was
simply never used.

An earlier candidate from `FMC-style/ClearTransparent.png` was 310x624 like the
original and carried a visible olive-green cast. A 1000x1000 `Clear2.png` was
also evaluated and rejected: its bottle occupies exactly 310x624 and those
pixels are byte-identical to `ClearCutout.png`. Canvas size is not resolution —
**measure the alpha bounding box, not the file**.

## Both

`BothCutoutV2.png` is composited from `FlowCutout` and `ClearCutoutV2` rather
than taken from `FMC-style/BothTransparent.png`, whose Clear bottle carries the
same olive cast rejected for the Clear slides. Compositing also gives 877x959
against that file's 548x564.

The geometry is Clear underneath at `x=400`, Flow over it at `x=0`, both at full
canvas height — the V1 layout (`799x874`, Clear at `x=365`) scaled by 1.097 so
Clear lands at its native size. Flow is upscaled 1.097x in the process, which
costs nothing in practice: `b7` draws the composite 1000px tall either way, so
Flow's effective scale is unchanged at 1.14x while Clear's drops from 1.60x to
1.04x. `BothCutout.png` is superseded and unreferenced.

`b2` is the one slide with authored copy: `whatToExpectV2.ts` has no `"03"`
block, so its milestones do not exist in the repo. It is structured around the
two-shot day (morning / afternoon / week 1 / week 2+) rather than an onset
timeline, which is Both's actual proposition.

`b0` / `b0q` inherit a fault: `BothStartPackClean` shows only Flow-labelled
bottles. A Both pack should show a Flow/Clear mix.

## The running photograph on `shared-tested`

The testing slide runs over a black-and-white running photograph, on the logic
that Informed Sport is an athlete certification. **Its source is only
399x501**, so at the current panel width it is upscaled roughly 3.9x. It holds
together because the dark treatment hides the softness, but it is the one
asset in the set running below its source resolution and a high-resolution
replacement is the single best thing to swap in.

## Alternatives kept but not chosen

`previews/p4a-ingredients-wheel.html` (a 15-spoke ring) and
`previews/p4b-ingredients-split.html` (AM/PM columns) were both built for
Both's ingredient slide. The two-row layout in `slides/b3.html` won because it
shows the bottles at real size *and* labels every ingredient with its
mechanism. Render the alternatives by hand, not via `render.sh`, so they do
not land in `public/`.
