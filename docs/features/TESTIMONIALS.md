# Testimonials

Curated Loox reviews shown as an auto-scrolling strip. Data is per product type (Flow, Clarity, Protocol).

## Location

Component: `app/components/testimonials/` (Testimonials, TestimonialsAutoScrollStrip, TestimonialCard, types).  
Data: `app/lib/testimonialsFromLoox.ts` (generated).  
Filter helpers: `app/lib/testimonialsFilter.ts`.

## Usage

Get the right set for the page, then pass it in:

```tsx
import Testimonials from "@/app/components/testimonials/Testimonials";
import { getSiteTestimonialsFlow, getSiteTestimonialsClarity, getSiteTestimonialsProtocol } from "@/app/lib/testimonialsFilter";

// Formula Flow PDP
<Testimonials testimonials={getSiteTestimonialsFlow()} />

// Formula Clear PDP
<Testimonials testimonials={getSiteTestimonialsClarity()} />

// Protocol PDP
<Testimonials testimonials={getSiteTestimonialsProtocol()} />
```

Optional props: `maxReviews`, `showRating`, `autoScrollOnly` (strip only, no extra controls).

## Logic

- **Source:** `testimonialsFromLoox.ts` exports `siteTestimonialsFlow`, `siteTestimonialsClarity`, `siteTestimonialsProtocol`. Each is a pre-curated array of Loox reviews. File is **generated** by `scripts/build-loox-testimonials.mjs` from CSV; do not edit by hand (see `docs/workflows/REVIEWS_WORKFLOW.md`).
- **Filter layer:** `testimonialsFilter.ts` exposes `getSiteTestimonialsFlow()`, `getSiteTestimonialsClarity()`, `getSiteTestimonialsProtocol()`. Each maps the Loox shape to the component `Testimonial` type (name, rating, date, headline, body, photo, productType, productLabel). No extra filtering is done there—the split is already in the generated file.
- **Shuffle:** `shuffleTestimonials(array)` is available for client-side variety (e.g. homepage) if needed.
- **Display:** `Testimonials` slices by `maxReviews` if set, then renders `TestimonialsAutoScrollStrip` (auto-scroll, pause on hover/expand).

To change which reviews appear, update the CSV and re-run the build script; then the three arrays in `testimonialsFromLoox.ts` are regenerated.
