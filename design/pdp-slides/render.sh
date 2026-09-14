#!/bin/bash
# Renders the PDP carousel slides to public/formulas/mmPdpAssetsV2/.
#   ./render.sh            renders every slide
#   ./render.sh s1 s4      renders just those
#
# Slides are authored at 2400x1715 (7:5, the aspect ProductImageSlideshow uses)
# and downsampled to 2000px wide. The carousel tops out around 1400px even at
# 3x DPR, so 2000 leaves headroom without paying for pixels nobody sees.
# NOTE: macOS bash is 3.2 — no associative arrays, hence the case statement.
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../../public/formulas/mmPdpAssetsV2"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
WIDTH=2000
QUALITY=82

slide_name() {
  case "$1" in
    s0) echo FlowStarterKit ;;   s1) echo FlowBenefitStack ;;
    s2) echo FlowWhatToExpect ;; s3) echo FlowIngredients ;;
    s4) echo FlowVsCoffee ;;     s0q) echo FlowStarterKitQuarterly ;;
    shared-proof) echo SharedProof ;;   shared-tested) echo SharedTested ;;
    s7) echo FlowReview ;;          s8) echo FlowGuarantee ;;
    c8) echo ClearGuarantee ;;
    c0) echo ClearStarterKit ;;  c0q) echo ClearStarterKitQuarterly ;;
    c1) echo ClearBenefitStack ;; c2) echo ClearWhatToExpect ;;
    c3) echo ClearIngredients ;;  c4) echo ClearVsCoffee ;;
    c7) echo ClearReview ;;        b0) echo BothStarterKit ;;    b0q) echo BothStarterKitQuarterly ;;
    b1) echo BothBenefitStack ;;  b2) echo BothWhatToExpect ;;
    b3) echo BothIngredients ;;   b4) echo BothVsCoffee ;;
    b7) echo BothReview ;;        b8) echo BothGuarantee ;;
    t0) echo FlowTrialBox ;;      ct0) echo ClearTrialBox ;;
    bt0) echo BothTrialBox ;;     tp1) echo TrialPackHowItWorks ;;
    *)  echo "$1" ;;
  esac
}

# Source photography lives outside the repo (6.9MB that never serves). HERE/assets
# is a gitignored symlink to it; without it Chrome renders the slides with silent
# broken images, so fail here instead. Check the cut-outs added since the symlink
# was first written too — a stale copy of the folder fails the same silent way as
# a missing one.
for required in FlowCutout ClearCutoutV2 BothCutoutV2; do
  if [ ! -e "$HERE/assets/$required.png" ]; then
    echo "error: $HERE/assets/$required.png is missing." >&2
    echo "       Slide photography is not in the repo. See README.md, 'Source photography'." >&2
    exit 1
  fi
done

mkdir -p "$OUT"
if [ $# -gt 0 ]; then SLIDES="$*"; else SLIDES="s0 s0q s1 s2 s3 s4 s7 s8 c0 c0q c1 c2 c3 c4 c7 c8 b0 b0q b1 b2 b3 b4 b7 b8 shared-proof shared-tested t0 ct0 bt0 tp1"; fi

for s in $SLIDES; do
  out="$(slide_name "$s")"
  tmp="$(mktemp -t "$s").png"
  trap 'rm -f "$tmp"' EXIT
  # virtual-time-budget waits for the local @font-face files; without it Chrome
  # can screenshot before they load and text renders blank.
  "$CHROME" --headless --disable-gpu --force-device-scale-factor=1 --hide-scrollbars \
    --virtual-time-budget=8000 --run-all-compositor-stages-before-draw \
    --screenshot="$tmp" --window-size=2400,1715 "file://$HERE/slides/$s.html" 2>/dev/null
  sips -Z $WIDTH "$tmp" >/dev/null
  sips -s format jpeg -s formatOptions $QUALITY "$tmp" --out "$OUT/$out.jpg" >/dev/null
  rm -f "$tmp"
  printf "%-4s -> %-22s %s\n" "$s" "$out.jpg" "$(ls -lh "$OUT/$out.jpg" | awk '{print $5}')"
done
