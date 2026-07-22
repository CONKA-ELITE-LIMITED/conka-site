---
paths:
  - "app/components/**/*.tsx"
  - "app/**/components/**/*.tsx"
  - "app/conka-flow/**/*.tsx"
  - "app/conka-clarity/**/*.tsx"
---

# Component Rules

## Design system compliance
- Use design tokens from `app/brand-base.css` — never hard-code colours, spacing, radii, or font sizes.
- Cards use `var(--brand-radius-card)` (32px). Buttons use `var(--brand-radius-interactive)` (16px). `.brand-clinical` scope forces all radius tokens to `0px`.
- Components return content only — no `<section>`, no `max-w-*`, no `px-*` at root. Pages own section wrappers.
- Components do not set their own background. Exception: cards/surfaces that differ from section bg must set their own text colour explicitly.

## Mobile-first enforcement
- Write base Tailwind classes for mobile (390px). Add complexity at `sm:`, `md:`, `lg:`, `xl:` breakpoints.
- If layout differs significantly between mobile and desktop, split into separate Mobile/Desktop files with `useIsMobile()` hook (breakpoint: lg/1024px).
- Every interactive element must have a minimum 44x44px tap target.

## Quickly consumable
- One idea per visual group. If a section requires connecting information across scroll positions, simplify.
- Prefer: stats, badges, icons, short headlines. Use prose only for supporting detail.
- Progressive disclosure: show the headline, let the user expand for depth.

## References
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Quality bar: `docs/branding/QUALITY_STANDARDS.md`
- Mobile patterns: `docs/branding/MOBILE_OPTIMIZATION.md`
