# Image Asset Pipeline

How to build rendered image assets (carousel slides, listicle cards, anything
that is text-on-image) as HTML and render them to JPG, rather than drawing them
by hand in Figma.

Companion to `VIDEO_OPTIMISATION.md`. Reference implementation:
`design/pdp-slides/`, which produces the 26 PDP carousel assets.

---

## When this applies

Use it when the asset is **type-led and data-backed**: a comparison table, a
value stack, a stat card, a labelled ingredient grid. Anything where the words
and the numbers are the point.

Do **not** use it for photography, retouching, or organic layout. Those are
Figma and Photoshop jobs. This pipeline is for structured information.

---

## The legibility floor, and why it is the whole game

This is the single most useful thing on this page.

A rendered asset is authored large and displayed small, so **type that looks
generous on the artboard can be unreadable in production**. Compute the scale
factor before designing anything:

```
scale factor = artboard width / display width
minimum artboard px = target on-screen px x scale factor
```

Worked example, the PDP carousel:

| | |
|---|---|
| Artboard | 2400px wide |
| Displayed | 100vw on mobile, so 390px on a common phone |
| Scale factor | 2400 / 390 = **6.15x** |
| Want 14px on screen | 14 x 6.15 = **~90px on the artboard** |

So ~90px is the floor. The slide this replaced set its table row labels at 47px,
which rendered at **7.6px**. It had been decorative rather than readable since
the day it shipped, and nobody caught it because everyone reviewed it at full
size on a laptop.

**Always render a proof at true display width and look at that**, not at the
artboard. In practice this is one extra `sips -Z 390`.

The corollary is a word budget. At the floor, a 2400px artboard holds roughly
40 characters per line at full width. If the copy does not fit, the copy is
wrong, not the type size.

---

## Pipeline

```
HTML + CSS  ->  headless Chrome screenshot  ->  sips downsample  ->  JPG in public/
```

No dependencies to install. Chrome and `sips` are already on macOS.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --force-device-scale-factor=1 --hide-scrollbars \
  --virtual-time-budget=8000 --run-all-compositor-stages-before-draw \
  --screenshot=out.png --window-size=2400,1715 "file://$PWD/slide.html"

sips -Z 2000 out.png                                    # downsample
sips -s format jpeg -s formatOptions 82 out.png --out final.jpg
```

**Render large, downsample once.** Authoring at 2400 and exporting at 2000 gives
free supersampling: edges and small type come out cleaner than rendering at 2000
directly. Pick the export width from the real display ceiling, not the artboard.
The carousel tops out near 1400px even at 3x DPR, so 2000 is headroom rather
than waste.

Wrap it in a script (`design/pdp-slides/render.sh` is the model) so a re-render
is one command and nobody hand-types flags.

---

## Why HTML rather than Figma

Three reasons, in order of how much they actually mattered:

1. **The brand fonts.** Figma's MCP writes against a cloud font catalogue that
   does not contain Neue Haas Grotesk or ABC Favorit, and a local install does
   not help. Anything built there is locked to a substitute typeface. HTML loads
   the real `.ttf` and `.otf` files straight from `app/fonts/`.
2. **The numbers are duplicated from the data layer.** Slides carry prices,
   percentages and doses that already live in `offerData.ts`, `ingredientsData.ts`
   and the FAQ. As HTML they stay greppable, so a price change surfaces every
   asset it invalidates. Baked into a binary, they drift silently.
3. **Iteration cost.** A copy tweak is a one-line edit and a re-render, versus a
   round trip through a design tool.

Figma still wins for exploratory visual design and for anything a designer needs
to nudge by hand. Judge composition wherever is fastest; produce the final set
here.

---

## Keep the sources in the repo

The HTML is small (140K for 27 slides) and it is the only thing connecting a
price change to the images that carry that price. `git grep 39.99` finds them.
A rendered JPG is opaque and a code comment goes stale.

Source **photography** is the opposite: large, derived from an external library,
and it never serves. Keep it out. `design/pdp-slides/assets` is a gitignored
symlink to a folder outside the repo, so relative paths still resolve while the
binaries stay out of every clone. The render script fails loudly when the link
is missing, because without that check Chrome renders broken images and writes
them over the live assets.

---

## The preview canvas

The thing that made iteration fast enough to be worth doing.

A single HTML page that iframes every slide twice: once scaled to fit, once at
**true display width**. Keep it open in a second window; it reloads on focus, so
the loop is edit, alt-tab, look.

```js
window.addEventListener('focus', () => location.reload());
```

Two things learned the hard way:

- **Mount only what is under review.** Each row is two full-size iframes loading
  their own fonts and imagery. Fifty of them will choke the page. Comment out the
  settled sections rather than deleting them.
- **Label anything not wired in.** Give proposals a different border colour and
  say so in the section heading, so a preview is never mistaken for something
  live.

Model: `design/pdp-slides/CANVAS.html`.

---

## Gotchas

**Fonts race the screenshot.** Chrome will screenshot before local `@font-face`
files finish loading, and the affected text renders **blank with no error**.
Always pass `--virtual-time-budget=8000`. This one is silent and intermittent,
so it will pass a hundred times and then bite.

**Film grain roughly doubles JPEG weight.** JPEG spends most of its bits encoding
noise. A grain overlay took one slide from 372K to 730K at the same quality, and
at thumbnail size it is invisible anyway. Composition beats compression settings:
check what is in the image before reaching for the quality slider.

**Match a photo's ground with a gradient, not a flat colour.** Studio backdrops
are almost never one tone. Sample the source at several heights and rebuild it as
a multi-stop gradient, otherwise the seam shows wherever the photo is letterboxed
or scrimmed:

```python
for frac in (0.02, 0.25, 0.5, 0.75, 0.98):
    y = int(H * frac); print(a[y, :40].mean(0).astype(int))   # far-left strip
```

**Crop a photo to the frame's aspect rather than letterboxing it.** Fitting a
square shot into 7:5 leaves side gaps that need colour-matching. Cropping to the
band that holds the subject fills the width outright, keeps the cast shadow
intact, and needs no matching at all.

**macOS ships bash 3.2.** No associative arrays. Use a `case` statement.

**`sips` handles everything needed here** (resize, convert, quality) and reads
AVIF and WebP. No ImageMagick required.

---

## Cutting a product out of its background

Needed whenever a bottle has to sit on a coloured ground.

**A flood fill from the border does not work on translucent glass.** It walks
straight through the amber and eats the product, leaving only outlines.

What works is thresholding on **saturation and luminance**, then a per-row
scanline fill:

```python
rough = (lum < 150) | (sat > 15)          # product is dark or saturated
rough &= ~((lum > 185) & (sat < 8))       # never claim clean backdrop
for y in range(H):                         # a bottle is horizontally convex,
    xs = np.flatnonzero(rough[y])          # so filling between the first and
    if xs.size < 25: continue              # last hit recovers the specular
    mask[y, xs.min():xs.max()+1] = True    # highlights a threshold would punch out
```

**Measure separation before attempting it.** Sample the border against the
product centre. Flow's bottle was luminance 18 / saturation 45 against a backdrop
of 198 / 0.9, which is trivially separable. Clear's silver cap was 193 against a
197 backdrop, four points apart, and no threshold can do that. Two minutes of
measurement saves an hour of failed attempts.

**Measure the subject, not the canvas.** A "810x1013 transparent bottle" turned
out to be 80% empty canvas with a 301x618 bottle in it. Compare candidates on
their alpha bounding box:

```python
ys, xs = np.where(np.asarray(im)[:, :, 3] > 12)
print(xs.max()-xs.min()+1, ys.max()-ys.min()+1)
```

**Check colour, not just resolution.** Two same-resolution cut-outs of the same
product differed by an olive cast on one. Composite candidates side by side
before choosing.

**A canvas is not a resolution.** A "new, higher-quality" 1000x1000 bottle
turned out to hold the same 310x624 subject as the file already shipping, and
its pixels were byte-identical to it. Diff the alpha-cropped candidates before
believing anyone, including yourself:

```python
crop = im.crop(im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox())
print(ImageChops.difference(crop, current).getbbox())   # None means identical
```

**When a subject cannot be thresholded, reuse an old mask as a template.**
Clear's cap is unseparable, so its high-resolution cut-out was never re-derived
— the existing low-resolution alpha was scaled up and applied to the full-size
render instead. It works whenever the two files are the *same render* at
different scales, and one shared feature proves that and supplies the mapping in
one step. Use a feature the threshold *can* find: here the amber glass, 461x764
in the source against 300x497 in the old cut-out, giving 1.537 on both axes to
three decimals. Agreement across both axes is the check; if the ratios diverge,
the files are different renders and the template will not fit.

Scale the alpha by that factor, crop the source to the mapped origin, apply.
The silhouette edge is inherited and stays as soft as the original, but the
interior — the label type, which is the only part that has to read at display
size — comes through native. Verify by compositing against a coloured ground
and looking for a backdrop halo at the shoulder, which is what a misaligned
template produces.

**Fit the mask analytically, not by search.** An optimiser over scale and offset
drifted to the edge of its search range and produced a visibly haloed cut-out,
because the residual it minimises is dominated by resampling noise across the
whole subject rather than by edge alignment. Two bounding boxes give the exact
answer in closed form.

---

## Checklist

- [ ] Scale factor computed, type floor set, copy fits the word budget
- [ ] Proof rendered at **true display width** and actually looked at
- [ ] `--virtual-time-budget` set, no blank text
- [ ] Rendered large, downsampled once
- [ ] Output size compared against the existing assets on that surface
- [ ] Every number traced to its source in the data layer
- [ ] Sources committed, binaries kept out
