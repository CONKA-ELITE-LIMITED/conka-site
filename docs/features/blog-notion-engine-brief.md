# Blog engine contract: what to write into Notion

> **The contract for anything that writes posts into the Blog Hub**, chiefly Humphrey's blog engine. Hand this file to the engine's Claude as-is.
> How the site consumes the content (render pipeline, auto-publish, what silently skips a row) is canonical in [`BLOG_SYSTEM.md`](BLOG_SYSTEM.md).
> Updated 2026-09-25 (SCRUM-1461) after auditing the first 7 engine posts. The site's FAQ parser is more lenient than this contract; write to the contract, not to the parser.

**Where:** the "Blog Hub" Notion database (CONKA Marketing Calendar > Content). Every row is one post on conka.io/blog.

**How publishing works now:** when a human sets `Status = Published`, the site picks it up automatically and the post is live within about an hour (6am to midnight UK time). There is no review step after that flip. So everything below has to be right **before** a post reaches `Ready for review`.

---

## 0. What went wrong in the first batch (15 to 17 Sep)

These were fixed by hand on the CONKA side. Please make sure the engine does not repeat them:

| Mistake | Effect on the site | Correct form |
|---|---|---|
| `Hero image` left empty on every post | Blank placeholder on the blog card, no image on the article, generic image when shared | Set `Hero image` + `Hero image alt` (section 3) |
| FAQ written as `- question: "..."` / `answer: "..."` | Raw text shown on the page, no FAQ data for Google | `Q:` / `A:` paragraphs (section 5) |
| Images typed as text: `![Image 1](https://res.cloudinary.com/...)` | Alt text "Image 1"; one image was a blank blue rectangle | Real `image` block with a caption (section 3) |
| Notes left in `Meta description`: "155 chars", "Under 900 words." | The note appears in Google results | Finished copy only |
| A meta description cut off mid-sentence | Reads as broken in Google results | Complete sentence, 150 to 160 characters |
| "in 2025" in titles | Looks out of date | No years in titles |
| Two near-identical posts on the same angle | They compete with each other in search | Check for an existing post first |
| Every post tagged `Productivity` | Posts missing from the right topic pages | Choose Topics that fit the post |
| `Source` left blank | Engine posts cannot be told apart from others | `Source = engine` |

---

## 1. The status rule (most important)

The engine writes `Status = Draft` or `Status = Ready for review`. **Never `Published`.** Publishing is a human decision, and it now means live on the site within the hour.

Never set `Date published` either. The CONKA side owns it.

---

## 2. Columns to fill on every post

| Column | Rule | Example |
|---|---|---|
| `Blog name` | The headline and page H1. 50 to 60 characters, includes the target keyword. **No years** ("in 2025" dates the post the day the year turns). | `Brain Fog Supplement: What Actually Works and Why` |
| `Slug` | Lowercase, hyphenated, no domain, no `/blog/`. **Unique**, and never changed once published. | `brain-fog-supplement-what-actually-works` |
| `Meta description` | 150 to 160 characters of finished copy. **Nothing else in the field**: no character counts, notes or placeholders. No em dashes. | `Struggling with afternoon brain fog? Here is which supplements are clinically proven to work, and the mechanism behind each.` |
| `Hero image` | **Required.** An image URL or uploaded file in this property (exact API format in section 3). Landscape, ideally 1200x630. It becomes the article hero, the blog card and the social share image. | (file) |
| `Hero image alt` | **Required.** One plain sentence describing the hero image. | `A CONKA shot on a desk beside a laptop` |
| `Topic` | One or more of: ADHD, Brain Ageing, Brain Fog, Concussion, Focus, Military, Neuroscience, Nootropics, Productivity, Recovery, Sport. Pick what the post is actually about; do not default everything to Productivity. | `Focus`, `Nootropics` |
| `Related products` | One or more of `flow`, `clear`, `both`. Drives the product call-to-action. | `both` |
| `Source` | Always `engine`. | `engine` |
| `Angle` | Internal note. Never shown on the site. | `Environment and performance` |

**A post missing `Blog name`, `Slug` or `Meta description` never appears on the site, silently.** No error, no page.

**One post, one row.** Before creating a post, search the Blog Hub for an existing post on the same angle or keyword. Two posts on the same subject compete with each other in search. If one exists, improve it instead.

---

## 3. The body: native Notion blocks only

Write the body with the Notion API's native block types. If the post looks properly formatted inside Notion (real headings, real bullets, real bold, no visible markdown symbols), it renders correctly on the site.

| Content | Write it as | Never as |
|---|---|---|
| Section heading | `heading_2`, sub-section `heading_3` | a paragraph starting with `##` |
| Bold / italic | rich-text annotations | literal `**asterisks**` |
| Bullet / numbered list | `bulleted_list_item` / `numbered_list_item` | a paragraph starting with `- ` or `1. ` |
| Link | rich text with an `href` that is a plain URL, e.g. `https://conka.io/ingredients` | `[text](url)` typed as text, or a URL containing markdown |
| Image | an `image` block (uploaded file, or external URL) with a **caption** | markdown image text such as `![Image 1](https://...)` in a paragraph |

**Image captions become the image's alt text** on the site, so write a real description ("Two CONKA shots next to a morning coffee"), never `Image 1`. Never insert a placeholder or blank image; if there is no real image, leave it out.

### How to set images through the Notion API

Use Cloudinary URLs (as now) or upload the file into Notion. The site copies images from both onto conka.io at build, so they keep working even if the original is later removed. Do not use other image hosts for body images.

**Hero image** (page property, set with `pages.create` or `pages.update`):

```json
"Hero image": {
  "files": [
    { "name": "hero.jpg", "type": "external", "external": { "url": "https://res.cloudinary.com/.../hero.jpg" } }
  ]
},
"Hero image alt": {
  "rich_text": [{ "type": "text", "text": { "content": "A CONKA shot on a desk beside a laptop" } }]
}
```

**Body image** (a block, added with `blocks.children.append` where it belongs in the article):

```json
{
  "type": "image",
  "image": {
    "type": "external",
    "external": { "url": "https://res.cloudinary.com/.../photo.jpg" },
    "caption": [{ "type": "text", "text": { "content": "Two CONKA shots next to a morning coffee" } }]
  }
}
```

Uploading the file into Notion instead (Notion file upload API, `type: "file_upload"`) also works. Either way, the image must be a real photo or graphic, landscape for the hero.

Other body rules:

- **Start at Heading 2.** Never repeat the title in the body; the H1 comes from `Blog name`.
- **Answer-first opening.** The first paragraph answers the target query directly.
- **No SEO callout** (Title tag / Meta description / URL slug / Primary keyword) in the body. That data lives in the columns.
- **No em dashes anywhere.** Use commas, colons or shorter sentences.
- **Length:** roughly 800 to 1500 words.

---

## 4. FAQ format (exact)

Optional, but if present it must be exactly this, or the site shows it as broken text and search engines get no FAQ data:

- A **Heading 2** titled exactly `Frequently Asked Questions`.
- Each question as a paragraph whose text starts `Q:`, in **bold**.
- The answer as the next paragraph, starting `A:`.

As it should look in Notion (the Q line in real bold):

> ## Frequently Asked Questions
>
> **Q: What is the best supplement for brain fog?**
> A: The best brain fog supplements target specific mechanisms: Alpha GPC raises acetylcholine and Ginkgo Biloba increases cerebral blood flow.

**Never** the `question:` / `answer:` form below. It renders as raw text on the page and produces no FAQ data:

```
- question: "What is the best supplement for brain fog?"
answer: "The best brain fog supplements..."
```

---

## 5. Content note

For a term the CONKA product pages already target (for example "best nootropics uk"), take a different angle and title rather than mirroring the product page. Informational topics (brain fog, what are nootropics, ingredient explainers, focus habits) are the blog's lane.

---

## Per-post checklist

- [ ] `Status` is `Draft` or `Ready for review`, never `Published`; `Date published` untouched
- [ ] `Blog name` set, keyword-bearing, no year
- [ ] `Slug` set, unique, lowercase-hyphenated
- [ ] `Meta description` 150 to 160 chars of finished copy, nothing else in the field
- [ ] `Hero image` uploaded and `Hero image alt` written
- [ ] `Topic` chosen from the full list, `Related products` set, `Source = engine`
- [ ] No existing post on the same angle
- [ ] Body in native blocks, starting at Heading 2, no repeated title, no SEO callout
- [ ] Images are `image` blocks with descriptive captions
- [ ] Links are plain `https://` URLs
- [ ] FAQ (if any) in the bold `Q:` / `A:` form
- [ ] No em dashes
