# CONKA Quality Standards

> What distinguishes a CONKA page from a template. Read this before building any customer-facing page or component.

---

## The quality bar

Three questions every section must pass:

1. **Does it feel layered and dimensional** (not flat)?
2. **Can someone understand it in under 3 seconds** on a phone screen?
3. **Does it look like it belongs next to Seed.com's homepage**, not a Shopify theme?

If any answer is no, the section needs more work.

---

## Mobile is the default

74% of traffic is mobile (50% iOS, 24% Android). Most arrive from paid social ads on their phone.

- Design at 390px first. Desktop is the adaptation, not the other way around.
- Every component gets mobile review before desktop review.
- If it doesn't work on mobile, it doesn't ship.
- If mobile and desktop layouts conflict, mobile wins.

---

## The "quickly consumable" principle

From Ovrload: information must be simple, easily understood, AND fast to digest. Two separate tests — clarity AND speed. Apply to every component:

- **One idea per viewport.** If a user has to scroll back up to connect two pieces of information, the section is too complex.
- **Scannable > readable.** Headlines, stats, icons, badges. Prose is for supporting detail, not primary communication.
- **Progressive disclosure over density.** Show the headline; let them tap/scroll for depth.
- **Numbers beat paragraphs.** "150,000+ bottles sold" communicates faster than "trusted by a large and growing community."
- **Remove before you add.** If removing an element doesn't reduce understanding, it shouldn't be there.

---

## Reference site patterns

### Seed.com — Layered depth

- Components sit ON sections, not IN them. Cards, tiles, and surfaces create visual layers — nothing feels flat or pasted onto a background.
- Brand colours woven through every section create distinct-but-connected visual flow. Each section has its own identity but clearly belongs to the same site.
- 3D product renders and subtle shadows create physical presence.
- **Learn from:** Their visual layering and sense of dimension.
- **Avoid:** Their performance is poor. Do not replicate their heavy 3D/animation approach.

### Ovrload — Conversion intensity

- Every element serves conversion. No decorative filler.
- Animated reviews, real faces, countdown timers — urgency without feeling cheap.
- Crystal clear optics: what you get, what you save, what happens next.
- First-time buyer upsells integrated into the flow, not bolted on.
- **Learn from:** Their information design, purchasing flow intensity, and speed-as-premium feel.

### Magic Mind — Approachable science

- Uses coffee as a familiar proxy for an unfamiliar product category. Find CONKA's equivalent bridge (the daily routine, the morning ritual, the pre-workout).
- Illustrations and friendly visuals make complex science feel non-threatening.
- Social proof woven into the narrative, not dumped in a review wall.
- Outstanding breathability/whitespace — sections feel spacious, never cramped.
- **Learn from:** Their science-to-consumer translation and whitespace discipline. Most similar product category to CONKA — closest reference for messaging, research communication, and product narrative.

### Suri — Premium subscription hardware

- Large-format lifestyle photography and high-quality gifs/video used as primary content — not supporting decoration.
- Purchase widget is a strong reference for stepped selection UI: 1. Choose colour → 2. Bundle → 3. Plan. Clear, low-friction, no ambiguity about what you're configuring at each step.
- Subscription framing is baked into the product decision, not appended at checkout.
- **Learn from:** Their lifestyle asset scale and the stepped purchase widget structure — directly applicable to CONKA's funnel page cadence × product selector.

### Nothing — Technical consumer branding

- Futuristic aesthetic that avoids bland lifestyle clichés — their photography and art direction feels editorial and considered.
- Heavily stylised site shows that clinical/technical can feel exciting rather than sterile.
- Dotted wordmark is a strong brand signature — demonstrates how a single typographic choice carries the whole identity.
- **Learn from:** How they make a spec-sheet aesthetic feel desirable, not cold. Good counter-reference for keeping CONKA's clinical direction energised.

---

## What distinguishes CONKA from a template

| Template default | CONKA standard |
|-----------------|----------------|
| Flat cards on white backgrounds | Layered surfaces with depth — shadows, overlapping elements, background variation |
| Generic stock photography | Product-specific imagery, athlete photos, data visualisations |
| Wall of text explaining benefits | Single stat or proof point per card, expandable for detail |
| Same layout repeated per section | Each section has distinct visual identity within the shared system |
| Desktop-first, squeezed for mobile | Mobile-native layout, expanded for desktop |
| Price shown immediately | Value established first, price revealed progressively |
| Uniform section spacing | Varied vertical rhythm — tighter grouping within related content, more air between topics |

---

## How this connects to other docs

- **HOW to build** (design tokens, classes, section patterns): `docs/branding/DESIGN_SYSTEM.md`
- **HOW to write** (copy voice, proof assets, claims compliance): `docs/branding/BRAND_VOICE.md`
- **Mobile component patterns** (split components, progressive disclosure): `docs/branding/MOBILE_OPTIMIZATION.md`
- **Conversion principles** (hierarchy, cognitive load, trust): `docs/workflows/09-ux-iteration.md`
- **Implementation process** (phases, checklist, deployment): `docs/workflows/02-implementation-workflow.md`
