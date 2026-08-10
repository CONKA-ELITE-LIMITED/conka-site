# CONKA Email Signature

Branded email signatures for CONKA staff. Two variants:

- **`conka-signature-dark.html`** (primary) — dark card, CONKA wordmark, deck hero
  imagery (chrome head + bottles, app "92" phone), real App Store / Google Play
  badges. Uses the Nike-deck visual language.
- **`conka-signature-light.html`** (fallback) — white, text-only, no hosted
  images required. Bulletproof across every client. Use if image hosting is a
  problem or for a lighter look.

Figma source: **CONKA Email Signature** file (`arkWVGch7t0tGOduwrd9qS`), frame `5:2`.

---

## How the dark version works

Email clients cannot embed image data (Gmail strips base64 data-URIs), so every
image must be served from a public URL. The five assets live in **`public/email/`**
in this repo, so once deployed they are served from our own domain:

| Asset | URL after deploy |
|-------|------------------|
| `public/email/head.png` | `https://www.conka.io/email/head.png` |
| `public/email/phone.png` | `https://www.conka.io/email/phone.png` |
| `public/email/conka-logo.png` | `https://www.conka.io/email/conka-logo.png` |
| `public/email/badge-appstore.png` | `https://www.conka.io/email/badge-appstore.png` |
| `public/email/badge-googleplay.png` | `https://www.conka.io/email/badge-googleplay.png` |

The HTML already points at these URLs. **Deploy first, then install** — pasting
while the URLs still 404 makes clients cache broken images.

## Links wired into the signature

- Logo -> `https://www.conka.io`
- Email -> `mailto:rudhkurup@conka.io`
- App Store badge -> iOS listing (`id6450399391`)
- Google Play badge -> Android listing (`com.conka.conkaApp`)

Name, title, email and address are **live text**, so they always render even if a
recipient has images turned off.

## Install in Gmail

1. Ensure this branch is merged and deployed (assets live at the URLs above).
2. Open `conka-signature-dark.html` in a browser.
3. Select the whole signature block, copy (Cmd+C).
4. Gmail -> Settings (gear) -> See all settings -> General -> Signature.
5. Paste into the signature box, Save Changes.

Apple Mail and Outlook 365 / web: same copy-paste into their signature editors.

## Adapting for another person

Edit the middle block of the HTML: change the name, the title line, and the
`mailto:` address. Everything else (logo, imagery, badges, address) stays the same.

## Known limitations

- **Outlook desktop (Windows)** ignores `border-radius`, so the dark card shows
  square corners there. Images, text and links are unaffected.
- Gmail caches external images via its proxy, so if you change an asset later at
  the same filename, recipients may see the cached old one for a while. Bust it by
  shipping a new filename (e.g. `head-v2.png`) and updating the HTML.
