# Listicle reason assets

HTML sources for rendered images used in `/go` listicle reasons. Same technique
as `design/pdp-slides/` (see `docs/development/IMAGE_ASSET_PIPELINE.md`), but
authored at **1600x2000 (4:5)**, the shared reason frame in `ListicleRenderer`.

On a 390px phone the frame is about 335px wide, a 4.8x downscale, so keep type
at 70px or more in the artboard (about 15px on screen).

Bottle cut-outs come from `../pdp-slides/assets/` (a gitignored symlink; see
that README to recreate it).

| Source | Output | Used by |
|---|---|---|
| `routine.html` | `public/listicle/RoutineTwoShotsV4.jpg` | productivity-v2 reason 4 (conka-messaging system lines) |

Render:

```bash
tmp="$(mktemp -t routine).png"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --force-device-scale-factor=1 --hide-scrollbars --virtual-time-budget=8000 \
  --run-all-compositor-stages-before-draw --screenshot="$tmp" --window-size=1600,2000 \
  "file://$PWD/design/listicle-assets/routine.html"
sips -s format jpeg -s formatOptions 82 "$tmp" --out public/listicle/RoutineTwoShotsV4.jpg
```

Changing a served image? Bump the `V1` suffix: Next's image optimiser caches by
URL for a year.
