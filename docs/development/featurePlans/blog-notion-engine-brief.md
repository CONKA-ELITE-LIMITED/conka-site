# Brief: what the blog engine needs to write into Notion

**For:** Humphrey (to pass to the engine / his Claude)
**About:** The "Blog Hub" Notion database (under CONKA Marketing Calendar > Content) that the site's new `/blog` reads from.
**Updated:** 2026-07-15. Upgraded from "clean markdown text" to **native Notion blocks** after inspecting the live API output.

We are wiring the CONKA site to publish blog posts directly from this Notion database: the site reads each row and renders it as a live page. Two things need to change in what the engine writes: (1) fill some structured data into database **columns**, and (2) write the article body as **native Notion blocks**, not markdown text.

---

## 1. The core change: native Notion blocks, not markdown text

Right now the engine writes each post as markdown pasted into Notion **paragraph** blocks: literal `- **bold**`, `#` headings, `[text](url)` links. Notion stores that as raw text, so on the page (and inside Notion itself) it shows literal asterisks and dashes instead of formatting, and it cannot be cleanly reviewed or edited in Notion.

The engine should instead create **native Notion blocks** via the Notion API:

| Content | Write it as | Not as |
|---------|-------------|--------|
| Section heading | a `heading_2` / `heading_3` block | a paragraph starting with `##` |
| Bold / italic | rich-text **annotations** (`bold: true`) | literal `**asterisks**` |
| Bullet point | a `bulleted_list_item` block | a paragraph starting with `- ` |
| Numbered list | a `numbered_list_item` block | a paragraph starting with `1. ` |
| Link | rich-text with an `href` (one clean link) | `[text](url)`, and never nested `[..](..[..](..))` |
| Image | an `image` block | markdown image syntax |

Before / after for one bullet:
- **Now (wrong):** a paragraph block with text `- **Alpha GPC** — crosses the blood-brain barrier...`
- **Want:** a `bulleted_list_item` block whose text is `Alpha GPC` in real bold, then `, crosses the blood-brain barrier...` (no leading `- `, no `**`, comma not em dash)

The simplest check: if the post looks properly formatted inside Notion (real headings, real bullets, real bold, no visible markdown symbols), it will render correctly on the site.

---

## 2. Fill in these database columns on every post

We have added new columns to the Blog Hub database. Populate them per post:

| Column | What to put in it | Example |
|--------|-------------------|---------|
| `Blog name` (title) | The headline. Becomes the page H1 and the base of the SEO title. 50 to 60 characters, include the target keyword. | `Brain Fog Supplement: What Actually Works and Why` |
| `Slug` | URL segment only. Lowercase, hyphenated, no spaces, no domain, no `/blog/` prefix. Must be unique. | `brain-fog-supplement-what-actually-works` |
| `Meta description` | The meta description. 150 to 160 characters. No em dashes. | `Struggling with afternoon brain fog? Here is which supplements are clinically proven to work, and the mechanism behind each.` |
| `Related products` | Which CONKA product the post features. One or more of `flow`, `clear`, `both`. Drives the automatic product call-to-action. | `clear` |
| `Hero image` | The lead image if the post has one (ideally 1200x630). Optional. | (uploaded file) |
| `Hero image alt` | Plain-language description of the hero image. Required only if a hero image is set. | `Person focusing at a desk in the afternoon` |
| `Topic` | Keep using the existing options (ADHD / Brain Ageing / Productivity). | `Productivity` |
| `Angle` | Keep as an internal editorial note. Not shown on the site. | `Menopause brain fog` |

**Do not set `Status` or `Date published`.** Those are managed by the CONKA side. Leave `Status` blank or `Draft`. A post only goes live when a human reviews it and sets `Status = Published`. The engine must never set `Published` itself.

**One post = one row.** Please avoid duplicate rows for the same post (there are a couple in there now that we will clean up).

---

## 3. Remove the SEO callout from the body

Each post body currently opens with a blue callout containing `Title tag` / `Meta description` / `URL slug` / `Primary keyword`. That data now lives in the columns above, so please **remove the callout from the body**.

---

## 4. Body rules

- **Start at Heading 2.** Do not repeat the title in the body. Currently posts include both a plain title line and a `#` heading at the top; remove both. The site renders the H1 from the `Blog name` column.
- **Answer-first opening.** The first paragraph directly answers the target query in plain language. (The current posts already do this well, keep it.)
- **Heading 2 for main sections, Heading 3 for sub-sections.** Clear hierarchy is what AI answer engines rely on.
- **No em dashes anywhere.** Use commas, colons, or shorter sentences.
- **Length:** roughly 800 to 1500 words for a cornerstone post.

---

## 5. FAQ section (optional, keep the format consistent)

If a post has an FAQ, it lets the site publish structured FAQ data that answer engines read. Use this exact, repeatable format:

- A Heading 2 titled exactly `Frequently Asked Questions`.
- Under it, each question as a **paragraph with the question in bold, beginning `Q:`**, immediately followed by an answer paragraph **beginning `A:`**.

Example (as it should look in Notion, with real bold on the Q line):

> ## Frequently Asked Questions
>
> **Q: What is the best supplement for brain fog?**
> A: The best brain fog supplements target specific mechanisms: Alpha GPC and Citicoline raise acetylcholine, Phosphatidylserine maintains neuronal membranes, and Ginkgo Biloba increases cerebral blood flow.

If a post has no FAQ, omit the section.

---

## 6. One content note

For a comparison-style term the CONKA product pages already target (for example "best nootropics uk"), differentiate the blog post's angle and title rather than mirroring the product page word for word. Informational topics (brain fog, menopause brain fog, what are nootropics, ingredient explainers) are the blog's lane. This avoids the blog and the product page competing for the same phrase.

---

## Per-post checklist for the engine

- [ ] `Blog name` set (keyword-bearing headline)
- [ ] `Slug` set (unique, lowercase-hyphenated, no domain)
- [ ] `Meta description` set (150 to 160 chars, no em dashes)
- [ ] `Related products` set (flow / clear / both)
- [ ] `Hero image` + `Hero image alt` set if a hero exists
- [ ] `Topic` and `Angle` set
- [ ] `Status` left blank or `Draft` (never `Published`)
- [ ] SEO callout removed from the body
- [ ] Body written as **native Notion blocks** (real headings, bullets, bold, links, images), no markdown symbols visible in Notion
- [ ] Body starts at Heading 2, no repeated title
- [ ] No em dashes
- [ ] FAQ (if any) in the bold-`Q:` / `A:` format above
