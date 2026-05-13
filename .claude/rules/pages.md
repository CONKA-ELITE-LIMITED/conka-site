---
paths:
  - "app/**/page.tsx"
  - "app/**/layout.tsx"
---

# Page Rules

## Section structure
- **New pages:** Use `brand-section` + `brand-bg-{white|black|neutral}` classes from `app/brand-base.css`. Track: `brand-track`.
- **Legacy pages:** Keep `premium-section-luxury` + `premium-bg-{ink|bone|surface}` from `app/premium-base.css` until migrated. Track: `premium-track`.
- Alternate section backgrounds to create visual rhythm.
- Each section gets `aria-label` for accessibility.

## SEO (mandatory, not optional)
- Export `metadata` or `generateMetadata` with: title (with " | CONKA"), description (<160 chars), OpenGraph (title, description, image).
- Single H1 per page. Logical heading hierarchy (H1 → H2 → H3, no skips).
- All images have meaningful alt text (not "image" or "photo").
- Product pages include JSON-LD structured data.
- Canonical URL if risk of duplicate content.

## Mobile-first composition
- 74% of traffic is mobile. Review the page at 390px width before desktop.
- Hero content and primary CTA must be visible without scrolling on mobile.
- Use `loading.tsx` for Suspense boundaries on data-fetching pages.

## Premium quality check
- No section should feel flat. Use layered surfaces, background variation, visual depth.
- Each section should have distinct visual identity while feeling connected to the whole.
- Apply the "quickly consumable" test: can someone understand each section in <3 seconds on mobile?

## References
- Quality bar: `docs/branding/QUALITY_STANDARDS.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Brand voice: `docs/branding/BRAND_VOICE.md`
- SEO checklist: `docs/workflows/02-implementation-workflow.md` (Phase 5)
- Legacy design system: `docs/branding/SOFT_TECH_LUXURY_STYLE_SHEET_GUIDELINES.md`
