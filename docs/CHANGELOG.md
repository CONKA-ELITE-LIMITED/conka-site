# Changelog

> High-level record of what changed, when, and why. One entry per meaningful change. For implementation details, see git history or the referenced docs/PRs.

---

<!-- changelog:newest - new entries are inserted directly below this line, newest first, one line each -->
- **2026-07-22** | Rewrote /go/why-conka listicle copy from Magic Mind placeholder to CONKA (ingredients, athletes, and proof from source data)
- **2026-07-22** | Added general MM-style listicle at /go/why-conka (simple layout variant, ProductGrid buy box, MM reference copy)
- **2026-07-22** | UGC testimonial marquee upgraded to three rows with five new customer stills
- **2026-07-22** | Refactored the cart app-gift into a compact strip and gave the nav cart a filled state when it has items
- **2026-07-22** | Rewrote the brain-ageing ad listicle to Humphrey's copy with a new men/women segment toggle block
- **2026-07-22** | Added crossed-out OTP pricing, recurring-discount line, and a savings row to subscription cart lines
- **2026-07-22** | Rewrote the ADHD ad listicle to Humphrey's copy with a new interactive symptom explainer block
- **2026-07-22** | Rewrote the productivity ad listicle to Humphrey's copy, with PMID/DOI citations and an As Published On press marquee
- **2026-07-22** | Constrained the cart Subscribe & Save button to the line item text column
- **2026-07-22** | Made the cart Subscribe & Save upsell per-product and tidied line item and footer copy
- **2026-07-22** | Restyled the filled cart line item, upsell button, and checkout footer to a cleaner DTC layout
- **2026-07-22** | Enlarged the empty-cart heading and swapped tile descriptions for time-of-day badges
- **2026-07-22** | Redesigned the cart empty state with a free-shipping banner, product tiles from the shop menu, and a Shop CONKA CTA
- **2026-07-21** | Refine PDP daily-benefits accordion: single-line summaries, all collapsed on mount, title above the render on mobile
- **2026-07-21** | Rebuild PDP daily-benefits into a Simple DTC accordion and align time-of-day badge colours across nav and product cards
- **2026-07-21** | Make ProductBenefitTiles formula-aware (Clear shows lecithin/vitamin C renders) and add sizes to the poke images so mobile stops over-fetching.
- **2026-07-21** | Render the Certifications badge band under the benefit tiles on the Flow, Clear and Both PDPs.
- **2026-07-21** | Move the home certification badges into a reusable Certifications band rendered under the benefit tiles.
- **2026-07-21** | Add a featured single-athlete review section (Jack Willis) to the home page under the product grid.
- **2026-07-21** | Redesign mobile nav menu: Magic Mind-inspired product rows with time-of-day badges, section dividers, and a featured review card
- **2026-07-21** | Home App USP section reworked into a condensed what/why/edge accordion with a clearer CTA, and made flush to the athlete marquee on mobile.
- **2026-07-21** | Home page Simple DTC pass: black hero titles, athletes moved above FAQ, guarantee section replaces What-to-Expect, on-page testimonials removed, App USP rebuilt as a static Test/Log/Graph section.
- **2026-07-21** | Simplify Informed Sport tile to one bold title and plain black body
- **2026-07-21** | Consolidate segmented toggles into one shared SegmentedToggle component
- **2026-07-21** | Apply Simple DTC styling to athlete carousel and product showcase, soften toggles
- **2026-07-21** | Center home product cards, add per-formula star ratings, soften mobile formula toggle
- **2026-07-21** | Redesign home product cards to Simple DTC style and remove FAQ figure-plate captions
- **2026-07-21** | Added What-to-Expect to the conka-both page (replacing case studies) and restyled the timeline (larger day, tiled message, centered on desktop)
- **2026-07-21** | Rebuilt the PDP What-to-Expect section as a full-bleed asset with a Magic Mind-style Day 1/7/30 timeline (overlaid on desktop, stacked on mobile), static server component
- **2026-07-21** | Convert the PDP caffeine-vs-CONKA comparison section to Simple DTC (drop mono eyebrow, solid-black copy, softened chart corners)
- **2026-07-21** | Reworked the PDP guarantee section into a Simple DTC two-column card (paper-textured copy + lifestyle image), dropped the app framing, full-bleed on mobile
- **2026-07-21** | Simplified the PDP ingredients section to the Simple DTC style (black type, softer cards, human header) and added a scroll indicator to the ingredient rail
- **2026-07-21** | Make the PDP hero badges rectangular (Magic Mind style), grey-gradient the social-proof pill, and give it a per-product live-viewer count
- **2026-07-21** | Roll the V2 PDP hero and benefits band out to conka-clarity and conka-both, make the hero spec badge product-aware, and retire the legacy hero components
- **2026-07-21** | Rework V2 flat purchase tiles (unified green-plus subscription benefits list, Full CONKA App Access, discount-consistent crossed-out prices, clearer delivery cadence) and fix hero social-proof copy
- **2026-07-21** | Align mobile PDP hero to Magic Mind (plain-label accordions, What-you'll-feel folded in, full-width Ingredients pill) and de-rule the guarantee trust bar
- **2026-07-20** | Made the conka-flow benefits band render a portrait, centred layout on mobile and mounted it in the mobile page branch
- **2026-07-20** | Added a Magic Mind-style benefits band under the conka-flow hero: textured paper tile, three benefit columns, and ingredient renders poking above and below
- **2026-07-20** | Aligned ProductHeroV2 desktop PDP hero to the Magic Mind layout: de-carded flush gallery, MM-order left identity column with spec/social pills, plain-label accordions, and an ingredients pill
- **2026-07-20** | V2 PDP plan tiles rebuilt Magic-Mind style (flat cards, price-led CTA, tap-to-expand benefits with free-shots badge)
- **2026-07-20** | New ProductHeroMobileV2 for conka-flow (badges, split header, thumbnail carousel, MM-style rating)
- **2026-07-20** | New ProductHeroV2 desktop PDP hero (3-column, flat plan cards) live on conka-flow behind a legacy-safe swap
- **2026-07-20** | Simplify the home What to Expect timeline: drop the expanders and clinical/app-data depth to a 3-milestone scan with a See the research link
- **2026-07-20** | Home: comment out the Case Studies section, add a See the research CTA to /science, trim the research section comment
- **2026-07-20** | Testimonials carousel: inset the first card inside the padded track (was flush to the mobile edge)
- **2026-07-20** | Testimonials carousel: dot indicators, centered mobile CTA, and the reviews-count subtitle back under the title
- **2026-07-20** | Cleaner testimonials carousel: equal-height tiles, gold stars only, attribution demoted to the card bottom
- **2026-07-20** | Thicker (2px) neural-blue card borders and rebuilt testimonials as a horizontal carousel with expandable tiles and a trust row
- **2026-07-20** | Home section polish: neural-blue borders, Morning/Afternoon toggle, gold most-popular badge, neural-blue pickers/tiles, compact product cards, testimonials grid
- **2026-07-20** | Simplified home sections: removed eyebrow mono lines and title reference anchors, recoloured titles dark neural blue and descriptions black
- **2026-07-20** | Home hero recolour (dark neural blue title, black copy) and removed the video legibility wash
- **2026-07-20** | Pill-shaped CTA buttons with white-on-hover flip, nav hover pills, and branded buy-panel CTA
- **2026-07-20** | When a visitor submits the Alia email-capture popup we now attach their email (and phone) to that person's Meta CAPI events, so logged-out AddToCart/InitiateCheckout carry real match keys and Meta can tie the eventual purchase back to the earlier anonymous events; sent only when captured, hashed server-side, no change for visitors who never sign up.
- **2026-07-17** | Removed the strikethrough 'was' price sitting next to the free-shots-inclusive discount on the funnel cadence selectors and the /start buy box (the two numbers used different bases and read as wrong math), and stopped the buy-once option showing a discount badge in the funnel-c variant.
- **2026-07-17** | Product hero, listicle tiles and funnel now show published per-SKU discount percentages (Flow/Clear monthly 43%, Both 46%, quarterly 63-69%) resolved from a single source of truth (discountPercent in FUNNEL_PRICING via getDisplayDiscount), and the SEO/AEO doc records prices and discounts deriving from that one table.
- **2026-07-17** | Listicle hero now leads with the title and CTA; the World's-largest brain-research laurel badge moved down to sit under point 1.
- **2026-07-17** | Listicle (/go/[slug]) hero now leads with the product asset above the copy on mobile (unchanged on desktop: asset left, copy right), so paid traffic sees the visual first.
- **2026-07-17** | Fixed the home hero warping in a half-loaded state on mobile Safari: the still poster now paints as a background-image (which always crops correctly) instead of the video's poster attribute, which Safari stretches to the box before the video decodes.
- **2026-07-17** | Added the Alia email-capture popup, loaded through the deferred marketing loader so it stays off the initial load path; it replaces the disabled legacy Klaviyo onsite popup and syncs signups to the Klaviyo master list via Alia's native integration (no Klaviyo code in this repo).
- **2026-07-17** | Blog build now fails on inconsistent or thin Notion reads, and a deploy-scoped cache key means post edits reach production on an ordinary redeploy (no manual cache clear).
- **2026-07-17** | Legacy blog Phase 6.2: every blog post now recommends three articles that actually share its subject, instead of showing every reader the same three newest posts, and all 53 recovered posts carry topic tags
- **2026-07-17** | Legacy blog Phase 6.1: stripped the Wix underline artifact that was printing raw `<u>` tags as visible text 191 times across 26 live posts, and stopped the converter re-creating it on the next import
- **2026-07-16** | The blog is live: all 53 recovered posts published, Blog added to the footer and to the Science nav menu, and the 82 old Shopify blog URLs now land on real pages instead of 404s
- **2026-07-16** | Legacy blog Phase 2: all 53 recovered posts imported to Notion as Drafts with authored meta descriptions, and the blog body now wraps long reference URLs, scrolls wide tables on mobile, and lazy-loads in-body images instead of shipping filenames as alt text
- **2026-07-16** | Legacy blog Phase 3: all 82 old Shopify blog URLs now redirect instead of 404ing (53 to their new /blog post, 29 to the live page that owns the topic), blog posts enter the sitemap dated from Notion, and posts emit BlogPosting + FAQPage structured data
- **2026-07-16** | Legacy blog Phase 1: HTML-to-Notion converter and idempotent importer for the 82-post Shopify archive, plus the pilot import of the one post still ranking while 404ing; blog images now re-host from Shopify/Wix instead of hot-linking
- **2026-07-16** | Meta CAPI now fires server-side even when the browser pixel is blocked (in-app browsers/ad-blockers), recovering upper-funnel events for ad attribution
- **2026-07-15** | Fade the home hero video base into the section-2 tint so it blends into the next section
- **2026-07-15** | Swap brain-ageing listicle hero to the working-woman photo and add a per-asset objectPosition crop control
- **2026-07-15** | Hide the product hero key-benefit pills on mobile to reclaim space above the purchase picker
- **2026-07-15** | Rebuilt the /go listicle purchase section into a two-card offer (cheaper single first, Both bundle flagged best value) in the clean funnel-c style, with the shared ingredient bottom sheet reused low-key in each tile.
- **2026-07-15** | Removed the drug-test FAQ from /conka-both, and corrected the /app Apple Health copy to iOS-only (SCRUM-1143)
- **2026-07-15** | Added FAQ to the footer Discover column and hoisted the PDP FAQ lists to module scope (SCRUM-1143)
- **2026-07-15** | Added CONKA-app-vs-brain-training and wearables FAQ answers, and made the app answer more holistic (SCRUM-1143)
- **2026-07-15** | Added a CONKA app FAQ section to /faq and wove the app coffee-vs-caffeine data into the coffee answer (SCRUM-1143)
- **2026-07-15** | Softened the drug-test FAQ answer, swapped it off the PDP FAQ for a generic nootropic question, and added an operational support section to /faq (SCRUM-1143)
- **2026-07-15** | Replaced the legacy FormulaFAQ component with the shared LabFAQ on the Flow and Clear PDPs, then deleted it (SCRUM-1143)
- **2026-07-15** | Added per-ingredient benefit and side-effect FAQs with FAQPage schema to /ingredients (SCRUM-1143)
- **2026-07-15** | Flow/Clear PDPs now surface the side-effects and Informed Sport answers, and FAQ accordions link through to /faq (SCRUM-1143)
- **2026-07-15** | Removed the EFSA Vitamin C wording from two FAQ answers and paired the remaining clinically-dosed anchor with a footnote on /faq (SCRUM-1143)
- **2026-07-15** | FAQ conversion surfaces now render a curated 9-question subset instead of all 33; /faq keeps the full set (SCRUM-1143)
- **2026-07-15** | New /faq answer hub: 33 questions with FAQPage schema, including a full safety cluster (side effects, who should not take it, medication interactions, dependency, drug testing) that most supplement brands avoid answering (SCRUM-1143).
- **2026-07-14** | FAQ content consolidated to a single source (the two lander duplicates deleted), the coffee and time-to-results contradictions resolved, and the lorem-ipsum /go/listicle-template route unregistered.
- **2026-07-14** | Entity identity for AI answer engines: sitewide Organization + WebSite JSON-LD with a verified sameAs list (LinkedIn, Instagram, TikTok, Trustpilot, Facebook, Companies House), social links in the footer, and a web manifest (SCRUM-1141)
- **2026-07-14** | Sitemap lastmod is now derived from git history per page (true by construction, no manual upkeep). Needs VERCEL_DEEP_CLONE=1 in the Vercel env.
- **2026-07-14** | AEO hygiene: FAQ schema on the home and /professionals pages, metadata for /case-studies and the app privacy policy, deleted the expired /win and /barrys contest pages (301 to home), dropped the fabricated sitemap lastmod, added llms.txt (SCRUM-1140)
- **2026-07-13** | Simplified the mobile PDP purchase footer: one CTA carrying its price, guarantee and cancel-anytime underneath, no free-shots badge.
- **2026-07-13** | Funnel headers: the CONKA logo now links back to the home page. Added a new UGC still to the testimonials marquee.
- **2026-07-13** | Replaced the Flow liquid animation with a new optimised encode and documented the standard video optimisation recipe
- **2026-07-13** | Unified the funnel analytics taxonomy across /funnel, /funnel-b and /funnel-c, fixed funnel-c order attribution and its wrong Meta ViewContent product
- **2026-07-13** | PDP hero H1s now carry a keyword subline, and on mobile the title/rating lead above the image with the description below it (SCRUM-1138)
- **2026-07-13** | Fixed the B2B enquiry form silently binning every autofilled application (the honeypot was named `company`, so Chrome filled it); applicants now go straight to the order page behind a processing interstitial instead of waiting on an email (SCRUM-1137)
- **2026-07-13** | Added sitemap.xml and robots.txt so search engines can discover and recrawl the site's indexable pages (SCRUM-1136)
- **2026-07-13** | Added Product and FAQPage JSON-LD structured data to the Flow, Clear and Both product pages for SEO and AI answer engines (SCRUM-1133)
- **2026-07-10** | SEO: unique title tags, meta descriptions, OpenGraph and Twitter cards on the 5 core pages (home, Flow, Clear, Both, Ingredients); retired the stylised FL0W wordmark so the Flow PDP reads CONKA Flow / FLOW (SCRUM-1132)
- **2026-07-10** | SEO: fixed the site-wide canonical so every page self-references instead of pointing at the homepage (SCRUM-1131)
- **2026-06-19** | Fix Meta over-reporting purchases: stop subscription rebills being sent as new Purchase events (gate the orders/paid webhook on checkout_token)
- **2026-06-18** | Section 2 desktop cards restyled: larger bottle, slim blue title bar with name and time-of-day label
- **2026-06-18** | Desktop home improvements: section 2 shows both shots as two equal cards, athlete sport marquee runs full-bleed, research band full-width on desktop
- **2026-06-18** | Added a landscape looped video hero for desktop (Magic Mind style, left copy + brain-project badge), replacing the listicle hero
- **2026-06-18** | Home: moved showcase cert icons below the CTA, swapped section 4 to the BrainFuelBand proof band (white copy)
- **2026-06-18** | Home hero/section-2 mobile tweaks: tint gap above section 2, white unselected toggle pills, higher hero copy, removed section 3 top padding
- **2026-06-18** | Added a Magic Mind-style looped video hero on the mobile home page (BothStillWater shots in still water), desktop hero unchanged
- **2026-06-18** | Restyle home research section as a full-bleed university-photo band with navy scrim and university tiles
- **2026-06-18** | Home showcase and product PDPs adopt the lander's rounded AM/PM toggle and ingredient bottom sheet; PDP ingredient tiles become a horizontal scroll rail
- **2026-06-17** | Moved the UGC social-proof marquee directly beneath the product hero on the Flow, Clear and Both PDPs
- **2026-06-17** | Nav dropdowns reworked into tile-based mega-menus (Shop/Science/App) with a cleaner, less noisy mobile menu
- **2026-06-17** | UGC marquee: two stacked rows of stills, a section title with the "Two shots a day" promise, and the band added to the Both PDP
- **2026-06-17** | Add a UGC social-proof image marquee (auto-scrolling band of customer + athlete stills) above the reviews on the Flow and Clarity PDPs
- **2026-06-16** | Removed the stray browser "Leave site?" prompt on quiz CTAs and tagged quiz CTA events with their screen
- **2026-06-16** | Quiz engine now writes a durable event log to Convex (per-quiz drop-off + conversion data foundation for a dashboard)
- **2026-06-16** | Replace the dual caffeine-curve graph with the sharp CrashChart everywhere (/start + all PDP comparison sections); delete the legacy CaffeineCurves and dead valueChart wiring
- **2026-06-16** | PDP hero sticky image column, conka-both BrainFuel band (desktop split), and /start sharp CrashChart replacing the caffeine curves
- **2026-06-16** | PDP product heroes adopt the IM8 buy box (2 plan cards + OTP text link, app gift, earnable rewards, trust strip) with sharp clinical corners
- **2026-06-16** | Add Coffee vs CONKA cognition report (5th report) to /app-insights with a four-group comparison chart
- **2026-06-15** | Listicle reasons: day-energy curve (brain-ageing R5) + two-bar focus comparison (ADHD R5), clearing the last placeholder
- **2026-06-15** | Listicle buy box: port lander ingredient bottom-sheet, drop old ingredients accordion, IM8-style horizontal-scroll trust band
- **2026-06-15** | Productivity listicle: Flow-bottle video now full-width black tile for consistent reason-tile width
- **2026-06-15** | Listicle reasons: ingredient-grid asset (stress/recall/protection stacks), Dan Norton athlete-quote card, Flow/Clear naming + 30ml-shot copy
- **2026-06-15** | Listicle buy box: 3-icon trust bar under the CTA and an IM8-style "What You'll Feel" outcomes panel from verified trial stats
- **2026-06-15** | Listicle plan cards restyled to IM8: full-width cards (no nested panel), structured header on both states, monthly-equivalent price + billing line, 2-shots-a-day, gold rounded Save badge, black one-time link
- **2026-06-15** | Listicle buy-box plan cards gain offer depth: price+save, what's-included checklist, CONKA app block (value crossed to free), and an expandable earnable app-rewards group; dynamic Subscribe & Save CTA
- **2026-06-15** | Listicle buy box gallery: contained (not full-bleed) with a visible thumbnail carousel on mobile; dropped the leading ingredients video so the product image is primary
- **2026-06-15** | Listicle data-graphics: measure tile on measurable points (replaces standalone app section), coffee-vs-CONKA cognition bars + 4-group score chart from CONKA app data, productivity R1-R3 chart/video mix
- **2026-06-15** | Listicle social proof: logo marquee with the 3-tile athlete testimonial block below it, replacing the athlete carousel (home page keeps the carousel)
- **2026-06-15** | Listicle partner-logo marquee (Fueling High Performers at:) as an optional logoMarquee config block
- **2026-06-15** | Listicle reviews zone now a verified card rail (from CURATED_TESTIMONIALS); research-backed proof graphic (universities photo + Informed Sport / Made in Britain badges) on productivity + brain-ageing proof reasons
- **2026-06-15** | Listicle app proof section: port lander Measure (cognitive score count-up + draw, steps, app-store links, 100-day guarantee) behind an appSection config flag
- **2026-06-15** | Listicle reason graphic: port lander CrashChart (2pm-crash curve + cost table) as a config-driven crashChart asset, live on ADHD + productivity pages
- **2026-06-14** | Wire /lander header + footer to real routes, add on-page FAQ accordion, add /shipping page
- **2026-06-14** | Add standalone /lander marketing landing page (paid-traffic funnel, live Shopify pricing, straight-to-checkout)
- **2026-06-14** | Add productivity and brain-ageing persona listicle pages (/go/productivity-listicle, /go/brain-ageing-listicle) on the existing listicle framework
- **2026-06-13** | Listicle review strip becomes a compact one-at-a-time arrow carousel on mobile (band, eyebrow, dots, rating line), full row on desktop
- **2026-06-13** | Home hero gets the brain-project badge and listicle trust chips, smaller avatar row above the CTA, and a simplified rectangular CTA button
- **2026-06-13** | ADHD listicle hero trust row: distinct icon mini-chips per item instead of uniform ticks
- **2026-06-13** | ADHD listicle hero mobile pass: split laurel badge, smaller headline, leaner trust labels, ADHD sticky message
- **2026-06-12** | ADHD listicle page fully dressed with assets and IM8-style hero, marquee and optimised buy box; CROTestimonials replaces LandingTestimonials site-wide
- **2026-06-12** | Listicle landing page framework shipped at /go/[slug] with first ADHD persona page, reusing site components for buy box, reviews, athletes and FAQ
- **2026-06-12** | Removed the CookieYes consent banner integration site-wide (subscription cancelled; we no longer use CookieYes). Analytics scripts now load without a consent gate
- **2026-06-12** | Quiz polish: header step counter removed, hook title anchored high with the borderless brain-scan loop below, quiz paints the document background so overscroll never flashes white
- **2026-06-12** | Brain-age quiz iteration rounds: Flow-style layout (full-bleed gamefied progress bar with perceived curve completing at the reveal, top-anchored questions, bigger type), gradient chart cards with glow + decay lines, typed commitment screen, per-answer stat split, brain-scan hook video, shortened funnel ending straight on the Both PDP
- **2026-06-12** | Shipped the brain-age quiz at /go/brain-age (ageing-brain persona, Luke's copy): dark quiz theme via config flag, numeric brain-age scoring, reveal screen with turnaround curve, cycle-loop diagram, answer mirroring, slider anchor and interstitial images
- **2026-06-12** | Consolidated the five B2B feature-plan docs into the single canonical docs/features/b2b/B2B_PORTAL.md (current state + future work) and removed them from featurePlans
- **2026-06-12** | Created the landing conversion programme doc hub (personas x formats strategy, tracking plan, listicle reference evaluation)
- **2026-06-12** | Restyled /go quiz answer tiles to a light-blue fill with a staggered cascade reveal
- **2026-06-12** | Removed the legacy protocol quiz (pages, components, data, analytics helpers); /quiz now redirects to /funnel
- **2026-06-12** | Quiz template visual pass: Flow-style centered layout with fixed logo header, bar and pie chart variants, landing video and rating line
- **2026-06-12** | Added the /go persona landing system: config-driven quiz engine with reusable question, progress, stat and chart components, full funnel analytics
- **2026-06-12** | Rebuilt /app-insights with a baseline-themed GSAP motion system: hero readings resolve on load, charts draw from the zero line, filter switches animate, plus a sharper storytelling spine and new page narrative entry
- **2026-06-11** | B2B order page gains a collapsed UK shipping disclosure showing the exact freight for the current box count plus the full band table
- **2026-06-11** | B2B pay-by-invoice orders now carry weight-banded shipping (free to 6 boxes, then 12/25/50/75 GBP), closing the last freight leak; manual pallet playbook documented
- **2026-06-11** | Weight-banded all international Shopify shipping zones (Evri, DDU) so freight scales with order size; closes the long-haul quarterly leak
- **2026-06-11** | Weight-banded the UK Shopify shipping rates (Express + 24 Hour Delivery) so freight scales with box count; protects free shipping to 6 boxes
- **2026-06-11** | Upgraded /our-story to the GSAP motion standard: animated hero, chapter image wipes, count-up stats, chapter rail, and a new dark manifesto beat
- **2026-06-11** | App page act 3 reframed from personal account stats to instrument capabilities; GSAP patterns extracted into a shared motion library (app/lib/motion.ts) with a new MOTION_GUIDE doc for reuse on future pages
- **2026-06-11** | /app gains The Engine section: Apple Health + Screen Time inputs, personalised patterns, per-test depth; journey trimmed to two beats, Compete/Rewards moved after proof
- **2026-06-11** | /app now runs the interactive GSAP rebuild directly; /appv2 route removed and the old app page components deleted
- **2026-06-11** | Added experimental /appv2 page: interactive GSAP-driven rebuild of the app page with pinned scroll journey, count-up proof stats, and product bridge
- **2026-06-10** | Ingredients page: rewrote the intro description under the title (desktop) and added it to mobile, focused on evidence transparency (SCRUM-1077)
- **2026-06-10** | Science page refactored to a product-led narrative: Flow and Clear now lead as the realised solution with hero actives folded in as proof; added a page narrative map doc
- **2026-06-10** | App origin copy now says scans in a Neuro Lab instead of naming Newcastle University.
- **2026-06-09** | Science page Phase 3: render-led ingredient deep-dive (curated hero actives with per-serving doses, mechanism, PMID) and retired the legacy pillars + Flow-vs-Clear sections
- **2026-06-09** | App page rebuild Phase 1 (SCRUM-1072): thesis hero, why/origin section, server-first refactor with cognitive test as a client island
- **2026-06-09** | Science page Phase 4: evidence ladder (four rungs, confident transparency), Revolut real-world module, evidence-engine beat, partners/patent strip, shop CTA
- **2026-06-09** | Science page: drop the dark band back to neutral and merge adaptogens + nootropics into one two-column education section
- **2026-06-09** | Science page energy pass: ingredient renders in the adaptogen/nootropic sections and a dark two-system contrast band
- **2026-06-09** | B2B value callout gains a by-the-box estimator mode (toggle) with product/icon visuals (SCRUM-1071)
- **2026-06-09** | Science page Phase 2: adaptogens and nootropics teaching modules with layered-disclosure mechanism explainers
- **2026-06-09** | Science page Phase 1: server-first rebuild with thesis hero, why-products-fail problem section, and two-system model; removed load-flash gate
- **2026-06-09** | B2B professionals: clarified pilot section copy, distributed app detail into the relevant steps, removed the weak Why-CONKA section and re-alternated section backgrounds
- **2026-06-09** | B2B professionals value callout rebuilt as an interactive squad cost estimator; design system clarifies mono is for scanned data, sans for read text
- **2026-06-09** | Phase 4: added /skill-editor skill (audit + feedback-ingestion self-improvement loop per Anthropic skill-authoring guidance); its first audit fixed 6 skills still instructing full-repo lint and a pinned-model co-author line
- **2026-06-09** | Design-system restraint: clinical detailing is now occasional not default, mono sub-line demoted to optional (eyebrow + heading is the standard opener); condensed DESIGN_SYSTEM.md 651 to 557 lines
- **2026-06-09** | Triaged the 97 real lint problems to 0 errors: fixed jsx-comment/internal-Link/unescaped-entity issues and unused vars; downgraded no-explicit-any to warn for integration code; deferred img-to-Image (51 warnings remain, acknowledged)
- **2026-06-09** | Fixed eslint ignores (anchored .next at all depths + exclude stale worktrees): lint problem count dropped 3950 to 97 by excluding build artifacts that were never our code
- **2026-06-09** | Phase 1 skills/docs efficiency refactor: CLAUDE.md efficiency doctrine, one-line append-only changelog, tightened skill descriptions, implement skill split via progressive disclosure

## June 2026

### 2026-06-09 -- B2B portal Phase 1: credibility backbone + dual-path hero

First phase of the B2B portal conversion upgrade (SCRUM-1063). The `/professionals` landing now leads with credibility: the Informed Sport anti-doping certification is promoted high on the page as a trust strip, and the hero offers a clear dual path (Get team pricing alongside Explore a squad pilot). The certification block was extracted into a shared component so the home page and PDP carousels are unchanged while the landing can reuse the same vetted copy. No new product or health claims introduced.

**Modified:** `app/components/InformedSportCertification.tsx` (new), `app/components/AthleteCredibilityCarousel.tsx`, `app/professionals/page.tsx`

### 2026-06-09 -- Scoped B2B portal conversion & credibility upgrade

Researched modern B2B/wholesale conversion best practices and scoped a wave of upgrades to the `/professionals` portal, which is warm Harry-shared sales collateral rather than cold-traffic CRO. The plan keeps direct-buy first-class, surfaces the live pilot programme (product plus app plus coach's cognitive dashboard) as a prominent USP framed as "prove it on your own squad first", promotes Informed Sport certification, and sharpens order-page tier savings. Social proof without named clubs is parked as a Future phase until real figures are gathered. Three active-phase Jira tickets created (SCRUM-1063/1064/1065, Sprint 27); planning only, no app code yet.

**Modified:** `docs/development/featurePlans/b2b-portal-conversion-upgrade.md` (new)

### 2026-06-09 -- B2B portal plan doc trimmed against the live feature doc

Cross-referenced the B2B portal build plan against the now-live feature reference (`docs/features/b2b/B2B_PORTAL.md`) and removed the duplicated and out-of-date material. The plan no longer re-documents the confirmed flow, technical-decisions table, per-file task breakdown, env-var table, or the verbose implementation log, all of which the feature doc now owns as current-state truth. It keeps only what is plan-shaped: the problem and appetite, the deliberate scope decisions, a condensed dated build history, and a consolidated "Outstanding / still to figure out" tracker. Also fixed the one factual contradiction the cross-reference surfaced: SCRUM-1056 (B2B products + discounts) was marked "Not Started" in the phase table while the implementation log already recorded it done on 8 June.

**Modified:** `docs/development/featurePlans/b2b-professionals-portal.md`

### 2026-06-08 -- B2B Shopify variant GIDs moved from env to constants

The deployed order page returned "checkout not available yet" because the card and invoice routes resolved the Flow/Clear Shopify variant GIDs from env vars that were not set in Vercel. Those GIDs are not secret (they appear in any cart and checkout URL) and do not vary by environment (one prod Shopify store), so they did not belong in env. Moved them into a single server-side constant module (`app/lib/b2bVariants.ts`), shared by both routes, which also deduplicates the definition that was copy-pasted in each. Card checkout now needs nothing in Vercel; only the genuine secret (`SHOPIFY_ADMIN_API_TOKEN`, for pay-by-invoice) and the per-environment `NEXT_PUBLIC_SITE_URL` remain as env. Dropped the now-dead "variant not configured" 503 branches.

**Modified:** `app/lib/b2bVariants.ts` (new), `app/api/b2b/cart/route.ts`, `app/api/b2b/invoice-order/route.ts`, `docs/development/featurePlans/b2b-professionals-portal.md`

### 2026-06-08 -- B2B portal code-review fixes

Follow-up cleanups from a code review of the full B2B portal flow. Pointed every customer-facing contact address in the portal (enquiry form, order builder, regular-supply CTA, and both payment-route error messages) at `harryglover@conka.io`, since several still used a `harry@conka.io` address that may not resolve. Deduplicated the client email-validation regex into a single shared `EMAIL_RE` in `b2bData.ts` (was copy-pasted in both B2B forms). Added a per-IP rate limiter to the card-checkout cart route so it matches its sibling routes (apply and invoice-order already had one). Gated the "Pay by invoice" button on the PO number as well as the finance email, so both required fields disable the button consistently rather than one erroring on click. No behavioural change to the happy paths.

**Modified:** `app/professionals/page.tsx`, `app/components/b2b/ApplicationForm.tsx`, `app/components/b2b/B2BOrderBuilder.tsx`, `app/lib/b2bData.ts`, `app/api/b2b/cart/route.ts`, `app/api/b2b/invoice-order/route.ts`

### 2026-06-08 -- B2B Phase 1 enquiry email automation live (SCRUM-1055)

Closed the last functional gap in the B2B portal: a club that submits the `/professionals` enquiry now auto-receives the order-page link and Harry is auto-notified, both via Klaviyo flows. Created the "B2B Leads" list plus two live flows keyed off the apply route's events. The applicant welcome triggers on the existing `B2B Application Submitted` event. Harry's alert needed a workaround, since a Klaviyo flow email always sends to the triggering profile: the apply route now fires a second `B2B Lead Alert` event on Harry's own profile (recipient configurable via `B2B_NOTIFY_EMAIL`), carrying the applicant's details, so the alert reaches Harry rather than the applicant. Also fixed the enquiry form, which let you submit with a required field empty: required fields now carry a visible marker and the submit button is disabled until all are valid. Verified end to end against a real inbox. The Klaviyo list id and alert recipient are plain in-code constants (one Klaviyo account, no per-environment variance), so the only env to set in Vercel before deploy is `NEXT_PUBLIC_SITE_URL`.

**Modified:** `app/lib/b2bEmail.ts`, `app/lib/b2bData.ts`, `app/components/b2b/ApplicationForm.tsx`, `docs/development/featurePlans/b2b-professionals-portal.md`

### 2026-06-08 -- B2B card-path pilot passed; both paths proven end to end (SCRUM-1061)

Ran the card "Buy now" pilot and it passed: a real card order synced to Xero with the Shopify Flow tag applied, correct inclusive VAT, B2B Sales account, and the PO in the invoice Reference (confirming the PO flows on the card path via the tag, since the card order note is empty). The order was refunded. With the invoice path already proven, both B2B purchase paths now produce a compliant Xero VAT invoice end to end. Remaining before fully live: clean up the test Xero invoices, enable Parex auto-sync, decide how the Xero VAT invoice reaches the club (manual to start), the Klaviyo enquiry-to-order email, and the merge plus Vercel env vars.

**Modified:** `docs/development/featurePlans/b2b-xero-invoicing.md` (pilot result, no app code)

### 2026-06-08 -- B2B invoice-path pilot passed + bank-transfer payment set up (SCRUM-1061 Phase 2)

Ran the pay-by-invoice pilot end to end and it passed on the core dimensions: a 1-box order produced exactly one Xero invoice at net 59 plus 11.80 VAT equals 70.80 inclusive, booked to B2B Sales, with every DTC order ignored by Parex (tag filter working). Parex initially did not map the PO into the Xero invoice Reference; their support then configured the connector to sync the Shopify order note into the Reference for future orders and retro-updated the pilot order (pending verify). Also stood up the bank-transfer payment route with no code: added a Bank Deposit manual payment method carrying CONKA's bank details and a use-your-PO-as-reference instruction, then installed the ETP Hide and Sort Payments app and added a rule that hides Bank Deposit unless the cart contains a B2B Products collection item, so it shows only on the two B2B paths and never on DTC checkout. Verified the customer experience: invoice email, pay page offering card or bank deposit, and a pending order with the bank details on confirmation.

**Modified:** `docs/development/featurePlans/b2b-xero-invoicing.md` (pilot result + Shopify payment config, no app code)

### 2026-06-08 -- B2B pay-by-invoice form hardened (SCRUM-1061 Phase 1)

Three small fixes to the B2B order page. The PO number is now required on the pay-by-invoice path (blocked client-side with an inline error and server-side with a zod min(1) in the invoice-order route), since procurement mandates it and it maps to the Xero invoice Reference; the card "Buy now" path keeps PO optional. The "Pay by invoice" button is now disabled until a valid finance email is entered, so it no longer looks clickable while the required field is empty (submission was already enforced, this closes the UX gap). The PO label updated to "required to pay by invoice". Card path behaviour is unchanged. Phase 2 (the both-path pilot to Xero) is operational and run separately.

**Modified:** `app/components/b2b/B2BOrderBuilder.tsx`, `app/api/b2b/invoice-order/route.ts`

### 2026-06-08 -- Scoped B2B pay-by-invoice hardening + both-path pilot (SCRUM-1061)

Scoped two small fixes to the B2B order page and documented the pilot that gates go-live, on a new branch off the portal feature branch. Investigation corrected the premise: the finance email is already enforced client and server side, so the only gap is UX (the Pay by invoice button is not disabled when the email is empty), and the PO is optional by design. Decisions: require the PO on the pay-by-invoice path only (card stays frictionless), and disable the Pay by invoice button until a valid finance email is entered. The plan doc now carries the full pilot protocol (run both paths to a verified Xero invoice, net 59 plus 11.80 VAT, PO in the Reference, no DTC synced) with fail diagnostics. Created SCRUM-1061, related to SCRUM-1058 and SCRUM-1060.

**Modified:** `docs/development/featurePlans/b2b-xero-invoicing.md` (scope + pilot protocol, no app code)

### 2026-06-08 -- B2B VAT enabled in Shopify and quantity-break discounts created (Road B implemented)

Implemented the Road B switch in the live Shopify admin. Enabled UK VAT collection (VAT no. GB430507628) after verifying "include tax in prices" is ON, so no consumer price changed: the 20% was always inside the inclusive gross and Shopify now records it as 20% instead of assuming 0%. Confirmed the B2B Flow and Clear variants are taxable, and briefed the accountant and Humphrey on the 8 June switchover date so they rely on the Shopify/Xero VAT figures from now instead of backing VAT out of gross manually. Created the SCRUM-1056 quantity-break discounts on a new headless-only B2B Products collection: two automatic per-item amount-off discounts triggered on the combined Flow plus Clear quantity, landing on 62.40 per box at 25-plus and 54.00 at 50-plus, with no stacking. Cart-tested on the headless checkout: 30 boxes gave 1,872 inclusive (312 VAT), 50 boxes gave 2,700 inclusive (450 VAT) with only the 50-plus discount applied. Road B is now proven end to end on both the DTC and B2B card paths. Remaining before go-live: the card-path tagging Flow, the Xero/Parex invoice email, and the pilot. Tracked in SCRUM-1060 and SCRUM-1056.

**Modified:** `docs/development/featurePlans/b2b-xero-invoicing.md`, `docs/development/featurePlans/b2b-vat-decision.md`, `docs/development/featurePlans/b2b-professionals-portal.md` (Shopify-admin config, no app code)

### 2026-06-08 -- B2B card-path tagging Flow built and Parex verified

Built and turned on the Shopify Flow rule that brings instant card "Buy now" B2B orders into the Xero sync. The headless cart can only set cart attributes, not order tags or notes, so the rule fires on order created, checks the Order Type attribute equals B2B Professionals, and adds the B2B Professionals order tag plus a Liquid-built PO tag. That puts card orders into Parex's tag scope with the PO attached, matching the pay-by-invoice path. Also re-verified Parex: connected to Conka Elite, manual sync (auto sync off), and the tax mapping (20% VAT on Income, zero code No VAT) that mirrors the now-live Shopify VAT onto the Xero invoice. All B2B VAT and invoicing config is now complete; the only remaining step is the pilot (one card and one invoice order verified end to end in Xero), best run with Harry. No app code in this change.

**Modified:** `docs/development/featurePlans/b2b-xero-invoicing.md` (Shopify Flow + Parex config, no app code)

### 2026-06-08 -- B2B VAT mechanism switched from Road A to Road B

The Parex / Xero Bridge connector vendor confirmed in writing that the connector mirrors whatever tax Shopify charged on an order and does not derive VAT from a gross price: if Shopify charges 0%, it books the Xero invoice at no VAT. Road A (leave Shopify VAT off, let the connector split the gross) would therefore have produced non-compliant zero-VAT invoices. The mechanism is now Road B: enable UK VAT collection in Shopify (VAT no. GB430507628, inclusive pricing) so Shopify charges the 20% the connector mirrors. This is safe because CONKA is VAT-registered and already accounts for DTC VAT on the inclusive gross, and with inclusive pricing on it changes no consumer price. The pricing decision (ex-VAT, club pays gross) and the website code are unchanged: the invoice route already prices in gross and discounts to the gross tier total, which is correct under inclusive 20%, so only the now-false Road A code comments were corrected. The remaining work is Shopify-admin config, an accountant heads-up on the switchover date, the card-path tagging Flow, and a pilot. Tracked in SCRUM-1060.

**Modified:** `app/api/b2b/invoice-order/route.ts`, `app/lib/b2bPricing.ts`, `docs/development/featurePlans/b2b-vat-decision.md`, `docs/development/featurePlans/b2b-xero-invoicing.md`, `docs/development/featurePlans/b2b-professionals-portal.md`

### 2026-06-05 -- B2B pay-by-invoice priced at the gross (VAT-inclusive) amount

Road A locked: B2B products get repriced to the gross VAT-inclusive amount in Shopify rather than turning on Shopify VAT collection (which would have put every DTC order's tax reporting at risk for no extra benefit). The pay-by-invoice route now computes its tier discount in gross terms via a new getB2BGrossPerBox helper, so the draft order total is what the club actually pays (Entry 70.80, Squad 62.40, Institutional 54.00 per box), and Parex splits the gross into net plus 20% VAT on the Xero invoice. This must merge to production in lockstep with the matching Shopify variant reprice to 70.80 and the gross auto-discount reconfiguration, or the draft totals will not match the variant base. The order-page display is unchanged (it already shows net plus VAT).

**Modified:** `app/api/b2b/invoice-order/route.ts`, `app/lib/b2bPricing.ts`, `docs/development/featurePlans/b2b-xero-invoicing.md`

### 2026-06-05 -- B2B Xero VAT model and go-live checklist agreed

Locked how the 20% VAT lands on B2B orders and invoices, and captured it as a single go-live checklist in the plan doc. Decision (Harry): B2B prices are ex-VAT, so the club pays the box price plus 20% and reclaims it. Reading the code surfaced that the B2B variants are priced at the net (59), so both checkout paths currently undercharge (the page promises 70.80 but Shopify charges 59); the fix is to reprice the variants to the gross and let Parex split out the VAT on the Xero invoice (inclusive treatment), with no change to the DTC flow and pending accountant sign-off. Also resolved that instant card "Buy now" orders get their own Xero invoice too, via a Shopify Flow rule that tags the order and carries the PO into the note (the Storefront cart API cannot set tags), so fast purchases are not suspended. The compliant VAT invoice is the Xero one, which must be emailed to the club. Pilot now covers both paths. No website code in this change.

**Modified:** `docs/development/featurePlans/b2b-xero-invoicing.md`

### 2026-06-05 -- B2B Xero invoicing plan (Shopify-to-Xero connector)

Scoped how paid B2B orders will book into Xero as compliant VAT invoices via an off-the-shelf connector (closing SCRUM-1058 AC6), no bespoke Xero API build. Plan captures the connector comparison (Parex vs the official Amaka integration vs others), the gating risk that our draft-order flow may clash with connectors that do not support draft orders, the one support question that decides the connector, and a three-phase shape: a small additive website change (PO into a connector-readable field), a Xero-side config step owned by whoever manages the books, and a pilot order to verify before anything is locked. Phase 1 code shipped: the B2B invoice-order route now writes the PO into the Shopify order note (verbatim, the clean Xero-Reference carrier) and a comma-sanitized tag, additively, keeping the existing custom attribute. Live-verified against Shopify. Connector setup and pilot remain (owned by whoever manages Xero).

**Modified:** `docs/development/featurePlans/b2b-xero-invoicing.md` (new), `app/api/b2b/invoice-order/route.ts`

### 2026-06-04 -- B2B pay-by-invoice path on the team order page

Sports clubs can now pay by invoice on /professionals/order, not just by card. A new "Pay by invoice" option creates a Shopify draft order at the correct volume-tier price and emails a VAT invoice to the club's finance team; the buyer pays the hosted invoice (card or bank transfer) and we ship once Harry marks it paid. Lean by design: it reuses the existing PO field and adds only a finance-email field, no second form and no delivery address (captured on Shopify's pay-link). This is CONKA's first use of the Shopify Admin API (draft orders live there, not in the Storefront API), behind a server-only token. The invoice endpoint is rate-limited as an abuse guard, and that limiter was extracted into a shared util now used by the enquiry route too.

**Modified:** `app/lib/shopifyAdmin.ts` (new), `app/api/b2b/invoice-order/route.ts` (new), `app/lib/rateLimit.ts` (new), `app/components/b2b/B2BOrderBuilder.tsx`, `app/lib/analytics.ts`, `app/api/b2b/apply/route.ts`

### 2026-06-03 -- Navigation contrast raised, logo links use Next Link, guarantee CTA shortened

Navigation text (nav links, account and cart icons, mobile menu items) raised from 65-75% black to full black for stronger contrast and readability. The logo home links in both desktop and mobile navigation now use Next.js Link instead of raw anchors, enabling client-side navigation instead of a full page reload. The /conka-both guarantee section CTA label shortened from "Learn more about the CONKA app" to "Learn more".

**Modified:** `app/components/navigation/NavigationDesktop.tsx`, `app/components/navigation/NavigationMobile.tsx`, `app/conka-both/page.tsx`

### 2026-06-03 -- FAQ content centralised, /start FAQ updated, dead FAQ components deleted

The upgraded 7-question FAQ copy now lives in a single shared module (app/lib/faqContent.ts) consumed by both LabFAQ (home, /conka-both) and CROFAQv2 (/start), so the two surfaces can no longer drift apart. CROFAQv2 keeps its native details accordion and Still wondering heading but drops its old 5-question set for the shared content. Two dead components deleted: CROFAQ.tsx (imported by nothing) and ProtocolFAQ.tsx (only referenced by the protocol barrel export, never rendered). FormulaFAQ on the PDPs is live and untouched.

**Modified:** `app/lib/faqContent.ts` (new), `app/components/landing/LabFAQ.tsx`, `app/components/cro/CROFAQv2.tsx`, `app/components/protocol/index.ts`
**Deleted:** `app/components/cro/CROFAQ.tsx`, `app/components/protocol/ProtocolFAQ.tsx`

### 2026-06-03 -- Home page FAQ rebuilt: Magic Mind question arc, lab styling stripped

LabFAQ (home, /conka-both, protocol pages) carried heavy lab decoration: a Section/Entries/Updated spec header bar, per-question category labels, a Response label with black border inside every answer, mono eyebrow, bracket toggles, and an Avg response 4h footer. All removed in favour of clean hairline-divider rows with a rotating plus toggle. The question set grew from 5 to 7 and now follows Magic Mind's funnel order: differentiation, daily safety, how to take, results timeline (Day 1/14/30, matching LabTimeline), Flow vs Clear vs Both positioning, guarantee, shipping. Answers rewritten punchier, leading with the payoff sentence, keeping every proof point (patent, Informed Sport, 280+ substances, +28.96%, 100-day guarantee from offerConstants). Lifestyle image column unchanged.

**Modified:** `app/components/landing/LabFAQ.tsx`

### 2026-06-03 -- Formula composition percentages removed site-wide (trade secret)

The exact percentage each ingredient makes up of the Flow and Clear formulas was rendered on the PDP ingredient cards (ClinicalIngredients expanded view) and twice on the /ingredients page, and the raw numbers also lived in ingredientsData.ts and formulaContent.ts, which ship to the browser inside the client bundle. The composition is proprietary. All renders removed, and the percentage and percentageValue fields deleted from both data files entirely so the numbers no longer exist anywhere client-side. Doses per serving (public, on the label) are unaffected.

**Modified:** `app/components/product/ClinicalIngredients.tsx`, `app/components/ingredients/IngredientsPageDesktop.tsx`, `app/components/ingredients/IngredientsPageMobile.tsx`, `app/lib/ingredientsData.ts`, `app/lib/formulaContent.ts`

### 2026-06-03 -- Case studies section: trust grid replaced with guarantee row, CTA centred on mobile

The home page case studies section was the last one carrying the 4-cell trust badge grid alongside its CTA. Replaced with the single GuaranteeRow tucked under the View All Case Studies button, centred on mobile and left-aligned on desktop, matching the testimonials section treatment.

**Modified:** `app/components/LabCaseStudies.tsx`

### 2026-06-03 -- LandingValueComparison rebuilt around the borrowed-energy narrative

The caffeine comparison on all three PDPs was two dense data cards: an hour-band time-in-effect chart and a price table, accurate but slow to consume. Rebuilt around the /start caffeine section's narrative in the clinical skin: "Caffeine doesn't give you energy. It borrows it." headline, a mechanism paragraph (receptors blocked, cortisol spiked, fatigue handed back at 11am), a Fig. 01 chart card with two stacked energy curves that sweep left-to-right on scroll (coffee: spike/crash cycles in black; CONKA: sustained navy plateau with Flow/Clear shot markers), a counter-mechanism paragraph (fifteen nootropics and adaptogens), a one-line price closer (53 pounds a month less than daily coffee), the CTA, and a Nootropics/Adaptogens ingredient-class strip replacing the trust badges. Desktop puts copy left and chart right; mobile reads in narrative order. The Flow-morning/Clear-afternoon coverage teaching the old chart carried now lives in the product showcase time bands and the ingredients toggle. The /start CaffeineCurves original is untouched. Props API unchanged so the three PDP call sites needed no edits.

**Modified:** `app/components/landing/LandingValueComparison.tsx`

### 2026-06-03 -- Home page CTAs centred on mobile

ConkaCTAButtons on the home page were inconsistently aligned on mobile: hero, showcase, and FAQ centred theirs while Daily Benefits, LabTimeline, App USP, and Testimonials left-aligned. All home page CTAs now centre on mobile and left-align on desktop, using the same responsive pattern (justify-center lg:justify-start). Where a GuaranteeRow accompanies the CTA (testimonials), it centres with the button.

**Modified:** `app/components/landing/LandingDailyBenefits.tsx`, `app/components/landing/LabTimeline.tsx`, `app/components/home/AppUSPSection.tsx`, `app/components/landing/LandingTestimonials.tsx`

### 2026-06-03 -- Home page noise reduction: sublines removed, trust grids consolidated, LabTimeline rebuilt around Day 1/14/30

Every home page section header carried three text registers (eyebrow, H2, mono subline) and the same 4-cell trust grid repeated up to five times down the page, so the clinical styling read as decoration rather than clarity. Mono sublines removed from Daily Benefits, Product Grid (all 3 breakpoint variants, plus the dead monoSub copy field), App USP, and Case Studies. Trust grids removed from Product Grid, LabTimeline, and Testimonials (Daily Benefits and Case Studies keep theirs deliberately). Testimonials gained the CRO-style star aggregate badge (4.7/5, 500+ verified reviews) in place of its mono subline and a GuaranteeRow tucked under its CTA. LabTimeline milestones reframed in the Magic Mind register: Day 1/Day 14/Day 30 badges (was 24 hours/14 days/30 days), benefit-led phase names (Focus & Clarity, Resilience, Better Brain), felt second-person descriptions, and the mono data subline replaced with a readable provenance sentence (141 people, 6,042 cognitive tests, 7 months) since the app dataset is a differentiator worth pointing at. Side effect: the PDP cross-sell grids (Explore Other Products) also lose their subline and trust grid via the shared component.

**Modified:** `app/components/landing/LandingDailyBenefits.tsx`, `app/components/home/ProductGrid.tsx`, `app/components/home/ProductGridMobile.tsx`, `app/components/home/ProductGridTablet.tsx`, `app/components/home/productGridCopy.tsx`, `app/components/landing/LabTimeline.tsx`, `app/components/home/AppUSPSection.tsx`, `app/components/landing/LandingTestimonials.tsx`, `app/components/LabCaseStudies.tsx`

### 2026-06-03 -- Hero headline corrected to the two-shot story, StatStrip removed

The home and CRO heroes claimed "Brain Performance in One Daily Shot" but CONKA is a two-shot system (Flow in the morning, Clear in the afternoon); the hero was the only surface on the site telling the wrong story, contradicting the showcase and PDP two scrolls later. New headline on both heroes: "A Sharper Mind. Morning to Evening." (outcome-led, Magic Mind register, the time span carries the two-shot story without explaining it). Forced onto two lines on every breakpoint. The home hero's 3-cell StatStrip (studies cited, doses delivered, substances tested) was removed as low-value, and the desktop layout moved from a 33/66 to a 50/50 text/asset split, with the nowrap title guaranteeing the text column never collapses. Descriptions intentionally unchanged. CROFinalCTA and the /start hero still carry the old headline; deferred to a follow-up.

**Modified:** `app/components/landing/LandingHero.tsx`, `app/components/cro/CROHero.tsx`

### 2026-06-02 -- Guarantee row only under PDP CTAs, FunnelAssurance deleted

Follow-up to the tile simplification: the three trust rows under the PDP CTA were still too much, and the funnel rendered them as a floating block above its CTA on desktop only, invisible on mobile. PDP heroes now show just the GuaranteeRow (green tick, 100-day money-back guarantee) tucked directly under the Add to Cart button, identical to the landing page. The funnel drops the floating block entirely; instead FunnelCTA's existing compact trust strip (guarantee, free shipping, cancel anytime) now renders on every breakpoint rather than mobile only, so desktop and mobile funnel users see the same thing. Protocol heroes (deprecated pages) swapped to GuaranteeRow as well, and the FunnelAssurance component was deleted with no remaining references.

**Deleted:** `app/components/funnel/FunnelAssurance.tsx`; **Modified:** `app/components/product/ProductHero.tsx`, `app/components/product/ProductHeroMobile.tsx`, `app/components/funnel/FunnelCTA.tsx`, `app/funnel/FunnelClient.tsx`, `app/components/protocol/ProtocolHero.tsx`, `app/components/protocol/ProtocolHeroMobile.tsx`, `app/components/GreenCheckSquare.tsx`, `app/lib/productHeroHelpers.ts`

### 2026-06-02 -- PDP cadence tiles simplified, trust rows rebuilt in GuaranteeRow register

The selected cadence tile on the product heroes showed the per-shot price twice (header row and a large anchor in the expanded section), used seven different mono-label treatments, and buried delivery details behind SHIPS and NOTE label rows. The expanded section now reads in buyer order: what you pay (total price with verifiable strikethrough and saving), then a single checklist of what ships, shipping terms, and cadence terms. Row numbers (01/02/03) removed. Checklist marks are now the site-wide green square tick (extracted to GreenCheckSquare, also used by GuaranteeRow) with a box emoji on shipment lines. FunnelAssurance was rebuilt from a 4-cell mono grid into three plain trust rows (guarantee, free UK shipping, certifications) sitting directly under the CTA, the same register as the landing page GuaranteeRow. The guarantee now appears exactly once per surface: tiles carry only what differs between options, the rows under the CTA carry what is always true. Tile helper functions (frequency, what-ships, CTA meta, checklist) moved from both hero components into productHeroHelpers so desktop and mobile wording cannot drift; this also fixed the "2 box" pluralisation bug.

**Added:** `app/components/GreenCheckSquare.tsx`, `app/components/product/TileChecklist.tsx`; **Modified:** `app/components/product/ProductHero.tsx`, `app/components/product/ProductHeroMobile.tsx`, `app/components/funnel/FunnelAssurance.tsx`, `app/components/landing/GuaranteeRow.tsx`, `app/lib/productHeroHelpers.ts`, `app/lib/funnelData.ts`

### 2026-06-02 -- Home page showcase: time-of-day bands + render-led ingredients panel

The home page What CONKA Does section (LandingProductShowcase) now leads each product card with a navy time-of-day band (sun icon, MORNING or AFTERNOON, time window) so the AM/PM ritual is unmissable, replacing the easy-to-miss corner text. Sub-copy opens with the ritual (Flow for the morning, Clear for the afternoon). On mobile the bottle asset spans the full card width and the See What's Inside footer is styled as a navy CTA block. The shared IngredientsPanel (used by the showcase and the PDP hero accordions) is now render-led: every active ingredient and the Vitamin C/B12 nutrients show their 3D render thumbnail, laid out as compact 2-up cards on desktop and full-width cards with larger assets on mobile. Interactive showcase variants (Morning/Afternoon toggle with a video stage, then a spotlight layout) were prototyped and deliberately rejected: any layout that enlarges one product demotes the other, contradicting the two-shots-one-system message. The decision is recorded in the component header.

**Modified:** `app/components/landing/LandingProductShowcase.tsx`, `app/components/landing/IngredientsPanel.tsx`, `app/components/landing/icons.tsx`

### 2026-06-02 -- Pricing strikethroughs re-anchored to the one-time price

Every compare-at price across the funnel and PDPs was anchored to the 4-shot trial pack rate (3.75 per shot), producing strikethroughs like "210.00, save 120.01 (57% off)" that a buyer cannot verify anywhere on the page, while the bullet below claimed "Save 25% vs one-time price". The numbers contradicted each other on the same screen and read as a fake discount. All subscription entries now anchor against the one-time price for the same product (quarterly anchors against 3 one-time boxes), one-time entries carry no strikethrough since they are the reference price, and one-time prices are defined once (OTP_PRICE) so the anchors can never drift. The hard-coded "Save 25%" badge in the funnel summary is now computed per product (Both saves 31%, Flow/Clear 25%). Also removed a dangling asterisk on the guarantee bullet that pointed to no footnote.

**Modified:** `app/lib/funnelData.ts`, `app/components/funnel/SummaryStep.tsx`

### 2026-06-02 -- /conka-both reordered as a proper PDP narrative, What CONKA Does section removed

The page was assembled from home page components and the order showed it: athletes before the product story, and a What CONKA Does section (LandingProductShowcase) whose two bottle cards open an ingredients slide-out, sitting directly before the new ClinicalIngredients section, two competing ingredients experiences back to back. Removed the redundant section and reordered the page to read as a PDP: hero, timeline (what to expect), ingredients (what is inside), then the proof stack (athletes, testimonials), then objection handling (comparison, case studies, guarantee, FAQ). Backgrounds re-alternated white/tint from the hero down. The ingredients section also gets id="ingredients" to match the single-formula PDPs.

**Modified:** `app/conka-both/page.tsx`

### 2026-06-02 -- ClinicalIngredients rolled out to Flow/Clarity PDPs, legacy carousel deleted (Phase 3)

The clinical ingredients section now serves all three product pages. The toggle on /conka-both was redesigned around the time-of-day framing: a Morning/Afternoon segmented control with a single bottle render of the active formula beside an identity block (formula name, mg of active nootropics as a stat, tagline). On desktop the toggle and asset sit to the right of the section title. Both single-formula PDPs (/conka-flow, /conka-clarity) swapped their legacy FormulaIngredients accordion carousel for ClinicalIngredients in single-formula mode, and the legacy component (339 lines) was deleted with zero remaining references. Net change is minus 334 lines while gaining the grammage messaging and Magic Mind card consumability on every product page.

**Modified:** `app/components/product/ClinicalIngredients.tsx`, `app/components/product/index.ts`, `app/conka-flow/page.tsx`, `app/conka-clarity/page.tsx`, `app/conka-both/page.tsx`; **Deleted:** `app/components/product/FormulaIngredients.tsx`

### 2026-06-02 -- Clinical ingredients section added to /conka-both (clinical component upgrades Phase 2)

/conka-both, the flagship product page, had no ingredients section at all, so a buyer evaluating the purchase could not see what is inside. New ClinicalIngredients component added as Section 6 (after What CONKA Does): a grammage-led header (6,842mg of Active Nootropics), an asset-dominant Flow/Clear toggle (full-width bottle image with name and per-formula nootropic load below), and Magic Mind style ingredient cards in the clinical skin. Each card shows name, class tags, render thumbnail, and a one-line benefit at a glance; expanding (native details, one open at a time) reveals the longer description, formula share, and the key study finding. All content reads from the shared ingredientsData.ts (no copy duplication), Clear keeps the product-led order (Glutathione first), and lemon oil is excluded as a flavouring. The component supports single-formula mode so the Flow/Clarity PDP rollout (Phase 3) is a one-line change per page. Downstream section backgrounds on /conka-both flipped to preserve white/tint alternation. Also cleaned 7 em-dash one-liners in the shared ingredient data (improves the /ingredients page and PDP carousels that share the field). Grammage numbers are founder-supplied constants pending verification against the formulation spec.

**Added:** `app/components/product/ClinicalIngredients.tsx`; **Modified:** `app/conka-both/page.tsx`, `app/lib/ingredientsData.ts`

### 2026-06-02 -- LabTimeline rebuilt benefits-first (clinical component upgrades Phase 1)

The home page "What to Expect" section (Section 7) was a scroll-driven timeline: IntersectionObserver rail fill, pill states, and header transitions that forced visitors to scroll through choreography to extract the benefits. Rebuilt benefits-first: three compact white milestone cards (24h / 14d / 30d), each showing a navy timeframe badge, phase label, outcome headline, and a one-line benefit at a glance. The depth (felt problem, felt outcome in plain English, a compact app-data stat, and the ingredient mechanism) sits behind a native details expander written in the KeyBenefits narrative style. Each milestone now carries a real measured stat (+1.09 pts evening focus, -5.4 pts stress cost, +28.96% average improvement); previously only the 24h step had data. The component went from a client island to a pure server component (zero JS, native details expanders), so the home page dynamic() import became a direct import. Also serves /conka-both and /protocol timeline sections via the unchanged props API. Plan doc added for the wider clinical component upgrade work (LabTimeline plus the upcoming /conka-both ingredients section).

**Modified:** `app/components/landing/LabTimeline.tsx`, `app/page.tsx`; **Added:** `docs/development/featurePlans/clinical-component-upgrades.md`

### 2026-06-01 -- Clean up cart infrastructure

Removed a dead, unused duplicate cart hook (app/hooks/useCart.ts) that had its own checkout logic and did not carry the Meta attribution attributes. Nothing imported it, but it was a footgun: importing the wrong useCart would have silently broken attribution again (the live useCart is the one in CartContext). Also fixed the long-standing lint warning in CartContext by defining removeItem before updateQuantity (which calls it) and adding it to the dependency array. Cart context and hooks are now warning-free.

**Modified:** `app/context/CartContext.tsx` · **Deleted:** `app/hooks/useCart.ts`

### 2026-06-01 -- Fix: carry _fbp/_fbc through the funnel checkout

The funnel page (/funnel) has its own checkout that bypasses the shared cart, so it was not attaching the Meta ad-click identifiers (_fbp/_fbc) to orders. Since the funnel is the primary paid-traffic destination, funnel orders were reaching Meta without the ad-click signal, weakening attribution. Extracted a single shared helper (buildMetaCartAttributes) used by both the global cart and the funnel checkout so they cannot drift again, and wired it into the funnel. Caught during the first live funnel test order, which showed the funnel line attributes but no _fbp/_fbc.

**Modified:** `app/lib/funnelCheckout.ts`, `app/lib/metaPixel.ts`, `app/context/CartContext.tsx`

### 2026-06-01 -- /why-conka rebuilt as seven proof cards (SCRUM-1049 Phase 2)

The why-conka page rebuilt from seven dense prose sections into seven expandable proof cards using the same card grammar as the PDP benefits pillars. Collapsed, each card shows a number, an outcome-led headline, one sentence, and an asset thumbnail; the whole page reads in about a minute. Expanded panels carry the asset large, a headline stat, and story prose, with app install buttons on the measurement card. The weak mission-statement reason was replaced by a 100-day risk-reversal card that routes into the CTA. All named clubs, athletes, and companies were removed (no standing permission to name partners), along with the unauthorised stress-score claim and the deprecated Balance protocol reference. The page converted from a client component with no metadata to a server component with full SEO metadata; the hero collapsed to an eyebrow plus a single-line headline; the closing CTA card now leads with the two-bottle product shot and is followed by the shared ExploreMoreRow (whose first link now points to CONKA Flow & Clear at /conka-both). Four orphaned legacy components deleted.

**Modified:** `app/lib/whyConkaData.ts`, `app/components/why-conka/WhyConkaReasons.tsx` (new), `app/components/why-conka/WhyConkaHero.tsx`, `app/components/why-conka/WhyConkaCTA.tsx`, `app/why-conka/page.tsx`, `app/components/landing/ExploreMoreRow.tsx`; **Deleted:** `WhyConkaSection.tsx`, `WhyConkaHeroMobile.tsx`, `WhyConkaMobile.tsx`, `WhyConkaDesktop.tsx`

---

### 2026-06-01 -- Clear 3D bottle render rolled out to /conka-clarity benefits pillars

The Clear bottle render arrived from marketing and /conka-clarity now gets the same rotating 3D bottle treatment /conka-flow has. Only the first 2 seconds of the 5s source are usable (the back label text in the render is garbled from 2.2s onward), so the encode trims to 2.0s before running the established Flow pipeline: centred crop 1080x1920 to 1080x1350 (4:5), lanczos scale to 720x900, audio stripped, forward+reverse concatenation baked in for a seamless 4s ping-pong loop via the native loop attribute. A 0.7x slowed variant was tried and reverted: stretching 24fps footage drops the effective frame rate and the rotation loses its smoothness, which matters more than the loop length. Output weight is light: Clear.mp4 200 KB (H.264, CRF 24, faststart), Clear.webm 197 KB (VP9), Clear-poster.jpg 26 KB; per-visitor cost roughly 225 KB. The FlowVideo client island was generalised into a formula-aware BottleVideo component (formula prop selects sources, poster, and aria-label); the three consumers (/start Section 2, home Daily Benefits, FormulaBenefitsPillars) updated with zero behaviour change for Flow. FormulaBenefitsPillars now renders the sticky media column for both formulas, the Fig. chip reads the formula name from formulaContent, and the Clear-only 3-column card grid fallback was removed. Raw master kept at raw-assets/Clear V1.mp4 (gitignored). SCRUM-1050.

**Modified:** `app/components/landing/BottleVideo.tsx` (renamed from `FlowVideo.tsx`), `app/components/landing/LandingDailyBenefits.tsx`, `app/components/product/FormulaBenefitsPillars.tsx`, `app/start/page.tsx`; **Added:** `public/videos/Clear.mp4`, `public/videos/Clear.webm`, `public/videos/Clear-poster.jpg`

---

### 2026-06-01 -- /our-story rebuilt as six chapter beats (SCRUM-1049 Phase 1)

The our-story page compressed from ten prose sections (~1,000 words) to six chapter beats (~250 words), built from BRAND_STORY_FOUNDATION.pdf merged with the strongest specifics of the old copy. Each chapter: mono label and counter chip, punchy headline, at most two sentences of prose, a full-bleed image on mobile, and either a founder pull quote or a stat block (0 proven options, 500K+ research, +16% vs placebo, 150,000+ shots). Chapter 4 shows the Flow bottle; Chapter 5 shows the CONKA app cognition-test screen (contained, not cropped) plus a scrolling marquee of generic testing environments (Premiership rugby clubs, military units, corporate teams; deliberately no named organisations). The hero collapsed to a compact credibility-led opening: H1, readable stat pair, and the laurel-flanked brain-research badge, with explicit hero padding so it clears the nav on mobile. The closing CTA drops the deprecated Protocol 03 reference and adds a new shared ExploreMoreRow component (Flow / Ingredients / App / Science links) so visitors who are not ready to buy keep exploring instead of bouncing.

**Modified:** `app/lib/storyData.ts`, `app/components/our-story/StorySection.tsx`, `app/components/our-story/OurStoryHero.tsx`, `app/components/our-story/OurStoryCTA.tsx`, `app/our-story/page.tsx`, `app/components/landing/ExploreMoreRow.tsx` (new)

---

### 2026-06-01 -- Home section reorder and image-first testimonials

Two conversion-focused changes. On the home page, the Daily Benefits section now comes before the Find Your Formula product grid, so the ingredient/benefit argument lands before the purchase decision; the white/tint section alternation is preserved and the #product-grid scroll anchor moved with the grid. Testimonial cards in LandingTestimonials are now image-first: the customer photo leads the card (4:3, full width) with the verified header, name, headline, and quote below, instead of the photo sitting at the bottom after the text. All 8 curated testimonials have photos so every card gets the treatment. Propagates to home, the three formula pages, and protocol pages.

**Modified:** `app/page.tsx`, `app/components/landing/LandingTestimonials.tsx`

---

### 2026-06-01 -- Render rollout completeness fixes from code review

The post-merge code review of the render rollout (PR #270) found two coverage gaps, both fixed. WhatToExpectMobile has its own inline formula picker (it does not use the shared FormulaToggle), so mobile visitors, 74 percent of traffic, still saw the old transparent PNG bottles in the same section where desktop showed the new photo tiles; the mobile picker buttons and the How to Use card bottle now use the FlowNew/ClearNew photo tiles, as does the matching How to Use card in WhatToExpectDesktop. Second, formulaContent.ts carried 12 more old ingredient image paths in its ingredientAsset fields (rendered by the PDP benefit detail components and What to Expect timeline); all swapped to the renders with the same fallback rules. Remaining known dead code: KeyBenefits.tsx and its Desktop/Mobile siblings are orphaned (no page renders them) and still reference old paths; left for a cleanup pass.

**Modified:** `app/components/home/WhatToExpectMobile.tsx`, `app/components/home/WhatToExpectDesktop.tsx`, `app/lib/formulaContent.ts`

---

### 2026-06-01 -- Ingredient renders rolled out to ingredientsData and the formula picker

The bespoke 3D ingredient renders (already used on /start and the recently upgraded benefit sections) are now the canonical ingredient imagery sitewide. All 16 image fields in ingredientsData.ts swapped from the old webp photos to /public/ingredients/renders/, which propagates to the /ingredients page (mobile carousel, desktop selector grid, and detail cards) and the PDP FormulaIngredients accordions on /conka-flow and /conka-clarity. Glutathione and ALCAR use the generic white-powder render until bespoke ones ship; Lemon Oil uses the Vitamin C render (citrus). The shared FormulaToggle product picker (used on /ingredients and the home What to Expect section) swapped its transparent PNG bottles with inner scaling hacks for the square FlowNew/ClearNew photographic tiles filling the buttons.

**Modified:** `app/lib/ingredientsData.ts`, `app/components/FormulaToggle.tsx`

---

### 2026-06-01 -- Home Daily Benefits expanded panels follow the PDP story-led structure

After the PDP benefits pillars proved the story-led expanded panel reads better, the home page Daily Benefits component was brought in line. Expanded panels now run: app-data stat box first (the headline number from real users), then a prose story that weaves all three bolded ingredient names into the claim, then the renders the story just referenced, then the PMID as small print. Previously the panels led with unexplained ingredient tiles and each study sentence only mentioned one of the three ingredients. The internal field was renamed from studyObservation to story to match the PDP data shape.

**Modified:** `app/components/landing/LandingDailyBenefits.tsx`

---

### 2026-06-01 -- PDP benefits pillars upgraded: Flow video, outcome titles, render thumbnails, story-led expanded panels

The Section 2 benefits pillars on /conka-flow and /conka-clarity (shared FormulaBenefitsPillars component) received the same treatment as the home page Daily Benefits section. Flow gets the rotating 3D bottle render in a sticky media column with the cards stacked beside it; Clear keeps the full-width 3-column grid until its render arrives (the component branches on formulaId). Pillar titles are now outcome-led (Improves Memory and Recall, Reduces Tiredness and Fatigue, Improves Sleep Quality on Flow; Improves Memory and Recall, Reduces Mental Fatigue, Improves Mental Clarity on Clear). Collapsed cards show their three ingredient renders as 44px thumbnails in a footer row with a mono Learn-more affordance, replacing the corner plus/minus icon. The expanded panels were restructured from stacked mono-caps fragments into a narrative: stat with a readable label, then a new prose story sentence that weaves the bolded ingredient names into the claim, then the renders the story just referenced, then the felt-translation punchline, then the source citation as small print. The story copy attributes each stat to the ingredient its cited study tested; founder to verify attributions. formulaStatsData renamed from .ts to .tsx so story fields can carry JSX. Old webp ingredient photos replaced with the bespoke 3D renders throughout (ALCAR and Glutathione use the generic white-powder render until bespoke ones ship).

**Modified:** `app/components/product/FormulaBenefitsPillars.tsx`, `app/components/product/formulaStatsData.tsx` (renamed from .ts)

---

### 2026-06-01 -- Daily Benefits collapsed thumbnails and round 2 review fixes

Three follow-ups on the round 2 home page work. The Daily Benefits cards now show their three ingredient renders as 44px thumbnails in the collapsed state, sharing one footer row with the Learn-more expander (thumbnails left, toggle right), so visitors see what is inside each pillar without tapping and the cards stay short. From the code review: the LabResearch partner grid cells switched from tint to white fill so they read as defined cards against the tint section background, and the Daily Benefits dynamic-import placeholder height was raised from 600px to approximate the real section height (1500px mobile, 900px desktop) to limit CLS during client-side navigation.

**Modified:** `app/components/landing/LandingDailyBenefits.tsx`, `app/components/landing/LabResearch.tsx`, `app/page.tsx`

---

### 2026-06-01 -- Daily Benefits section rebuilt around the rotating Flow render and outcome-led cards

The home page Daily Benefits section ("Daily habit. Lifelong benefits.") was rebuilt for faster consumption. The static lifestyle photo was replaced with the rotating 3D Flow bottle render (FlowVideo, the same asset /start uses), 4:5 portrait, sticky on desktop and full-bleed on mobile, with a Fig. 02 chip overlay. The three benefit cards now lead with outcome verbs (Improves Focus and Memory, Reduces Fatigue and Crashes, Protects Long-Term Brain Health) instead of category nouns, descriptions were cut to one line each, and the full-width "See ingredients and research" expander was shrunk to a compact mono "[+] Learn more" toggle. The expanded view swaps the old webp ingredient photos for the bespoke 3D renders from /public/ingredients/renders/. App-data stat boxes, study observations, and PMID citations are unchanged. FlowVideo moved from app/start/ to app/components/landing/ so a shared component no longer lives in a page folder; /start's import was updated with no behaviour change.

**Modified:** `app/components/landing/LandingDailyBenefits.tsx`, `app/components/landing/FlowVideo.tsx` (moved from `app/start/`), `app/start/page.tsx`

---

### 2026-06-01 -- Home page Certified-for-Performance section replaced with clinical research section

Round 2 of the home page upgrade effort. The "Certified for Performance" credentials section (WhyConkaWorks, a 3-pillar grid of Certification / Research / Manufacturing) was replaced with a new LabResearch component: the World-Class Research beat from /start rebuilt in the clinical grammar. Mono eyebrow, left-aligned two-line title, Cambridge photograph with a Fig. 03 chip overlay (desktop right column, mobile full-bleed), a 2x2 partner logo grid (Cambridge, Durham, Exeter, Made in Britain) in tint cells with sharp corners, and a closing mono spec line carrying the Made in England / GMP claim forward. No credibility content is lost: the Informed Sport pillar moved to the athlete carousel in round 1, the universities live in the partner grid, and manufacturing lives in the spec line. WhyConkaWorks itself is untouched since /protocol/[id] still renders it. LabResearch is a direct server-component import, removing one dynamic chunk from the home page.

**Modified:** `app/page.tsx`, `app/components/landing/LabResearch.tsx` (new)

---

### 2026-06-01 -- Document the Meta Purchase dedup verification method

Captured how to verify the server-side Purchase deduplicates against the Shopify Facebook channel, after finding that Shopify's checkout pixel is sandboxed (Meta Pixel Helper and Test Events cannot read the channel's event_id). The recommended check is by effect: after deploy, place one test order and watch the Purchase count in Events Manager; if it roughly doubles, the event_id does not match the channel's and the one-line eventId in the webhook needs changing. The numeric order id is the de-facto standard, so it is most likely already correct.

**Modified:** `app/api/webhooks/shopify/orders/route.ts` (comment), `docs/analytics/META_PIXEL_AND_CAPI.md`, `docs/development/featurePlans/meta-tracking-hardening.md`

### 2026-06-01 -- Server-side Meta Purchase via Shopify orders/paid webhook

Adds a first-party Purchase event we control, sent from a new Shopify orders/paid webhook to the Meta Conversions API. This is the core of the attribution fix: it sends the Shopify order id as the Meta event_id (so it deduplicates against the Shopify Facebook channel's Purchase rather than double-counting), a clean value and currency, hashed customer email/phone/name/address, the browser IP and user agent from the order, and the _fbp/_fbc ad-click identifiers carried on the order note attributes. Subscription rebills are filtered so recurring charges are not counted as new acquisitions. The webhook verifies the Shopify HMAC and is idempotent via Meta's event_id deduplication. Dormant until SHOPIFY_WEBHOOK_SECRET is set and the orders/paid webhook is registered in Shopify admin. SCRUM-1046.

**Added:** `app/lib/metaCapi.ts`, `app/api/webhooks/shopify/orders/route.ts`

The ad-click identifier is now captured on landing and carried through to the order, so the server-side Purchase event (built next) can attribute sales to the ad that drove them. Meta had flagged low fbc coverage as the core reason purchases were not attributing. On landing we read fbclid from the URL and write the _fbc cookie in Meta's format; _fbp and _fbc are then attached as cart-level attributes that flow to the order note attributes. Attributes are set when the cart is created and refreshed on subsequent adds, so returning visitors who click a new ad (retargeting audiences) are also captured. Attribution writes are best-effort and never block or fail add-to-cart. SCRUM-1047.

**Modified:** `app/lib/metaPixel.ts`, `app/components/MetaPageViewTracker.tsx`, `app/context/CartContext.tsx`, `app/api/cart/route.ts`, `app/lib/shopifyQueries.ts`

Two safe tracking fixes from the attribution diagnosis. The Meta Pixel script now loads with afterInteractive instead of lazyOnload, so the early PageView and the _fbc ad-click cookie are captured promptly rather than after a delay (improving match quality). InitiateCheckout is now fired only by the Shopify Facebook channel on the real checkout page; the two frontend fires (cart drawer and funnel) were removed, eliminating the double and triple counting that had no shared event_id to dedupe on. The unused trackMetaInitiateCheckout helper was deleted. SCRUM-1043.

**Modified:** `app/layout.tsx`, `app/components/CartDrawer.tsx`, `app/lib/funnelCheckout.ts`, `app/lib/metaPixel.ts`

The Meta pixel and Conversions API now fire only on `www.conka.io`. Previously every Vercel preview and branch deploy ran the same code with the same pixel ID, so dev and preview traffic was mixing into the production dataset the ads optimise on, dragging down data quality (Meta flagged it under "Confirm domains that belong to you"). A strict host gate is applied at four layers: the pixel base snippet no longer loads fbevents.js off-prod, the client event helper short-circuits, the page-view tracker bails early, and the CAPI route rejects non-production hosts. Pixel does not fire in local dev by design (use Meta Test Events). SCRUM-1048.

**Modified:** `app/lib/metaPixel.ts`, `app/components/MetaPageViewTracker.tsx`, `app/api/meta/events/route.ts`, `app/layout.tsx`

### 2026-06-01 -- Meta attribution: config-pass findings and Phase 3 un-gated

Documented the 2026-06-01 Meta Events Manager and Ads Manager review for the headless attribution fix. The entire Meta configuration layer is now ruled out as the cause: the apex domain `conka.io` was verified (it had never been, only the legacy myshopify domain was), the ads point at the correct single pixel with a 7-day-click window, and the stray third pixel is dead. Meta's own diagnostics confirmed the remaining problem is server-side, low `fbc` coverage through CAPI, malformed Purchase price data, and preview-deploy traffic polluting the dataset. On that evidence the Phase 2 gate was resolved to GO, so the server-side Purchase work was un-gated and ticketed (SCRUM-1046, SCRUM-1047), plus a new production-host-gating item (SCRUM-1048).

**Modified:** `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md`, `docs/development/featurePlans/meta-tracking-hardening.md`

---

### 2026-06-01 -- Code review fixes across the home page upgrade branch

Five fixes from the self-review of the home-page-upgrades branch. The hero stat strip's "4.7/5 verified customer rating" cell was replaced with "280+ banned substances tested per batch" because the trust micro-row above the H1 already states the 4.7 rating (same fact twice in one viewport). The hero's gold star fill was corrected from 90% to 94% with a matching aria-label so the visual, label, and "Excellent 4.7" text agree. The product showcase guarantee row now renders even when the CTA is hidden, so /conka-both and the protocol pages close with reassurance instead of ending abruptly on the cert icons. The unused athlete bio field was removed from the carousel type and data. The marquee and thumbnail roster now reset their edge-bleed margins at the 768px breakpoint where the section gutter actually changes, fixing a partial-bleed gap on tablet widths.

**Modified:** `app/components/landing/LandingHero.tsx`, `app/components/landing/LandingProductShowcase.tsx`, `app/components/AthleteCredibilityCarousel.tsx`

---

### 2026-06-01 -- Athlete carousel polish: thumbnail snap padding and readable subheading

Two follow-ups to the carousel rework. The mobile thumbnail strip was snapping its first tile flush against the screen edge because scroll-snap aligns to the scrollport edge and ignores visual padding; a matching scroll-padding inset (scroll-pl-5) fixes the alignment. The mono "N=7 · Olympic · WBO · IBO" subline was replaced with the readable sentence from the /start athletes section ("Olympic medallists, world champions, and international competitors use CONKA on the days that matter most"), which says the same thing without spec-sheet decoding effort.

**Modified:** `app/components/AthleteCredibilityCarousel.tsx`

---

### 2026-06-01 -- Athlete credibility carousel reworked as compact quote-led proof beat

Third section of the home page upgrade effort, porting the structure that works on /start (CROAthletes) into the clinical AthleteCredibilityCarousel while keeping its visual register. A scrolling navy sport-breadth marquee (15 sports, star separators) now opens the section, edge-to-edge on mobile and spanning the content track on desktop. The feature card is now compact and quote-led: nav arrows overlay directly on the portrait (the separate mobile nav strip and desktop bottom nav row are gone), the counter and achievement tag sit as small mono chips on the portrait corners, and the text column reduces to name, sport plus role, and the quote rendered large as the visual hero (the bio sentence no longer renders). The thumbnail roster is now image-only tiles with no names, sports, or number prefixes: 72px scrollable strip on mobile, full-width 7-column grid on desktop. An Informed Sport block (logo, "Independently tested. Every batch.", 280 banned substances and WADA copy lifted verbatim from WhyConkaWorksDesktop) closes the section as the rational anchor, styled clinically with sharp corners and a mono category label. Changes propagate to /conka-flow, /conka-clarity, and /conka-both, which render the same component.

**Modified:** `app/components/AthleteCredibilityCarousel.tsx`

---

### 2026-06-01 -- LabTrustBadges rebuilt as classic icon trust badges sitewide

The LabTrustBadges grid (Free UK Shipping, Informed Sport, Batch Tested, Cancel Anytime) was rebuilt from its mono spec-sheet treatment (uppercase 10px labels in a divided grid) into classic trust badges: a centred line-art icon, a readable semibold title, and a quiet subtitle per cell, with soft cell backgrounds and sharp corners so the row still sits comfortably on the clinical pages. The icons reuse the existing TrustIcon set that previously only served the underused LandingTrustBadges component. This change propagates to all 12 call sites, including the home page (Product Grid, Daily Benefits, Testimonials, Case Studies), the funnel assurance block, the three formula pages, and /why-conka.

**Modified:** `app/components/landing/LabTrustBadges.tsx`

---

### 2026-06-01 -- Home page product showcase upgraded with photographic bottle tiles and cert proof strip

Second section of the home page upgrade effort. The two formula cards in the "Two shots. Built around your day." section swapped their transparent PNG bottles (which needed scale-150 positioning hacks) for the square photographic FlowNew.jpg / ClearNew.jpg tiles used by the /start ingredients grid, where the asset's off-white background becomes the tile surface. The section close was restructured into a single centred proof-and-conversion group: four certification icons (Vegan, Kosher, BPA Free, Third Party Tested at 56px), then the CTA, then the 100-day guarantee row. The text-only LabTrustBadges grid that previously closed the section was removed to avoid stacking two badge rows. The guarantee row was extracted from LandingHero into a shared GuaranteeRow component so the hero and showcase stay in lockstep. This component also renders on /conka-both and the protocol pages, which inherit the same upgrade.

**Modified:** `app/components/landing/LandingProductShowcase.tsx`, `app/components/landing/LandingHero.tsx`, `app/components/landing/GuaranteeRow.tsx` (new)

---

### 2026-06-01 -- Home page hero upgraded with /start trust signals and two-bottle hero asset

First section of the home page upgrade effort, porting the highest-performing trust patterns from the /start landing page into the home hero while keeping the clinical register. The mono eyebrow ("// A new state of mind") was removed and replaced by the /start trust micro-row (5 stacked customer avatars, gold 4.5-star overlay, "Excellent 4.7", 622+ reviews and 5,000+ daily users) sitting above the H1 on both mobile and desktop. The H1 now matches the /start title format: "Brain Performance" locked on its own line with an italic emphasis on "Daily" in the second line. A 100-day money-back guarantee row was added directly under the CTA, restyled for the clinical aesthetic with a square check mark in a darker green (#047857) instead of /start's rounded consumer green; copy anchors to GUARANTEE_LABEL_FULL from offerConstants. The hero asset swapped from the lifestyle hand-off photo to the two-bottle product shot (/formulas/both/BothHero.jpg) with a GPU-only scale/translate crop to remove the source's white space. On mobile the CTA and guarantee row are centred; desktop keeps them left-aligned.

**Modified:** `app/components/landing/LandingHero.tsx`

---

### 2026-06-01 -- Collapsed /startv2 into /start and removed orphaned components

The finished landing-page v2.1 build (Sections 1-10) now lives at the canonical `/start` URL. The legacy `/start` body was replaced wholesale with the v2.1 build, the seven co-located client islands moved from `app/startv2/` into `app/start/`, the old `app/startv2/` page was deleted, and a 301 redirect `/startv2 -> /start` was added so any shared preview links resolve. `/start` keeps its noindex,nofollow stance (paid-traffic-only page); the metadata canonical was repointed to `/start`. The `LandingDisclaimer` footer was removed from the page at the founder's direction (messaging-first; legality handled separately), along with the now-unused footnote marker in the hero. With the old page body gone, seven components had no remaining consumers and were deleted: `CROHeroV2`, `CROBrandStory`, `LandingValueComparisonV2`, `CROFormulaSplitV2`, `CROBuyBox`, `CROBenefitCards`, `LandingDisclaimer`. Net reduction of roughly 1,600 lines. Shared dependencies (`CROPillCTA`, `useInView`) were verified to survive via other consumers.

**Modified:** `app/start/page.tsx`, `app/start/*` (7 islands moved in), `next.config.ts`, `app/components/cro/CROAppCallout.tsx`; **Deleted:** `app/startv2/`, the 7 orphaned components.

---

## May 2026

### 2026-05-29 -- Landing page v2.1: S9 subline reframed for periodic testing

Small copy iteration on the Section 9 App Callout subline. Previous version ("Run a quick cognitive test before CONKA. Run it again in 30 days. The numbers tell you whether it worked. Not us.") framed the cognitive test as a one-off before/after measurement. New version ("Take CONKA daily. Run the cognitive test in the app whenever you want. After a month, the numbers tell you whether it worked. Not us.") reframes it as periodic testing across a month of daily use, which matches how customers actually use the product. The "Not us" punchline stays as the closing tie-back to the H2 ("We don't ask if CONKA works. We measure it."). Doc S9 brief updated to match.

**Modified:** `app/components/cro/CROAppCallout.tsx`, `docs/development/featurePlans/landing-page-v2.1.md`.

---

### 2026-05-29 -- Landing page v2.1: Sections 8/9/10 ported to /startv2, S5 image swap, S8/S9 iteration polish

Three remaining /start sections ported to /startv2 (Customer Reviews, App Callout, FAQ) with significant iteration on top to bring the visual register fully in line with S1-S7. **S8 Customer Reviews** wired via dynamic import (carousel state, same pattern as S6 athletes); subtitle iterated from "Eight stories from the people who use CONKA every day" (read scarce) to "A few favourites from our 622+ verified reviews" so the curated 8 reads as deliberate selection rather than the total available; carousel now closes with a full-width navy "Order Now" pill plus a 3-bullet trust strip (Secure Checkout / 100-Day Guarantee / Free Shipping) using the same green-check SVG and black text grammar as the existing guarantee rows on S1, S4, S6, S7. Pattern adapted from Magic Mind's checkout reassurance row. Earlier scope deliberately omitted any CTA from S8 because "Reviews IS the proof beat", but the social-proof beat without a closing nudge left the section feeling unfinished; the trust-anchored CTA at the close converts proof into intent without reading pushy because the trust strip frontloads the friction-reduction. **S9 App Callout** wired via direct import (pure server component). Section wrapper flipped from white to soft-blue tint (`var(--brand-tint)`, the same `#f4f5f8` surface S3 uses) so the long S4-to-S10 white run gets a second register-break. Component restructured significantly: the original two body paragraphs ("not an IQ test" + "Cambridge mechanism") collapsed into a 3-step visual grid (01 Install + test / 02 Take CONKA daily / 03 Track over time) with `bg-white border border-black/10 rounded-[12px]` tiles. App Store + Play Store install links are embedded as small inline icons inside step 01 only, not promoted to a standalone install CTA. S9 sits in the page's conversion stack and product trial stays the load-bearing action; app install is the optional measurement layer for users who want it. Subline rewritten from the vague original ("Watch your data move") to concrete: "Run a quick cognitive test before CONKA. Run it again in 30 days. The numbers tell you whether it worked. Not us." Echoes the H2's "we measure it" framing. The 4-line guarantee tile was rewritten in Magic Mind's "100 Days to Feel the Difference" voice and promoted from the section close to a bordered card sitting above the primary CTA: H3 navy "100 days to feel the difference, or your money back" plus body "No returns. No hassles. No questions. The only thing you have to lose is the fog." Above-CTA placement frames the guarantee as the trust anchor that justifies clicking. `CROPillCTA` "Try CONKA risk-free" stays as the load-bearing CTA, defaulting to `FUNNEL_URL`. `/app` link kept as a small low-emphasis closer below the CTA. **S10 FAQ** wired via direct import (pure server component, native `<details>` accordion, zero client JS). **S5 Buy Box** product image swapped from `/formulas/box/BothBox.jpg` (shipping boxes) to `/formulas/both/BothHero.jpg` (two-bottle hero shot, reused from S2's previous iteration, which freed up when S2 swapped to the rotating Flow video). The buy box benefits from leading with product, not fulfillment packaging. Architecture decisions across the three ports follow the pattern established by S6 / S7: dynamic import where there is real perf benefit (CROCustomerReviews has carousel state, swipe handlers, auto-advance interval), direct import for the pure server components (CROAppCallout, CROFAQv2) where `dynamic()` would add Suspense ceremony with zero perf win. Component edits propagate to `/start` (S9 and S10) since the CRO components only render there and on `/startv2`; intentional, since `/start` is heading for deprecation and the new layouts are improvements. The v2.1 doc gains S8 / S9 / S10 briefs following the S6 / S7 template plus a cutover-readiness note flagging that `/startv2` is now a structural superset of `/start` (only the legal `LandingDisclaimer` footer block remaining before the cutover can be planned). The legal disclaimer was deliberately deferred from this scope.

**Modified:** `app/startv2/page.tsx`, `app/components/cro/CROCustomerReviews.tsx`, `app/components/cro/CROAppCallout.tsx`, `docs/development/featurePlans/landing-page-v2.1.md`, `docs/CHANGELOG.md`.

---

### 2026-05-29 -- Landing page v2.1: Section 2 bottle hero swapped to rotating Flow video

Marketing handed over a 5s 1080x1920 portrait MP4 of the CONKA Flow bottle rotating in space (3D render, not a transparent background, not a seamless loop). Section 2's static `BothHero.jpg` stand-in has been swapped for it. Encoding pipeline run locally via ffmpeg 8.1.1: source cropped from 1080x1920 (9:16) to 1080x1350 (4:5) via centred crop then scaled to 720x900 with lanczos, AAC audio track stripped, output as MP4 (libx264, CRF 24, slow preset, yuv420p, faststart) plus a parallel WebM (libvpx-vp9, target 1 Mbps, CRF 32) for Chrome / Firefox / Edge, plus a first-frame JPEG poster for the `poster=` attribute. Most important encoding move: a forward+reverse concatenation baked into the output via `filter_complex` so the file is 10s total (5s forward + 5s reversed). The reversed half ends exactly at frame 0, so the native `loop` attribute on the `<video>` element gives a mathematically seamless ping-pong with zero JS overhead and no visible jump at the loop point. This was the recommended solution after the initial "play once, freeze on last frame" approach felt strange in the section context. Final byte sizes: MP4 966 KB, WebM 909 KB, poster 28 KB. Per-visitor bandwidth lands around 937 KB on Chrome and 994 KB on Safari, both under the 1 MB hero-element budget. New client island `app/startv2/FlowVideo.tsx` (~50 lines) owns playback: IntersectionObserver at 40% threshold calls `play()` when in view and `pause()` when out of view, so the browser is not decoding a video nobody can see. `muted` + `playsInline` so iOS Safari autoplays inline. `preload="metadata"` so the initial fetch is tiny and the rest streams on play. Direct import in `page.tsx`, not `dynamic()` — the JS bundle cost is too small for the Suspense ceremony to be worth it, and the heavy thing (the video bytes) loads lazily regardless. Section 2's container aspect changed from `aspect-[5/4]` to `aspect-[4/5]` (adds around 120px of section height); the mobile-bleed pattern stays the same (`-mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[12px]`); added `bg-black/[0.04]` to the container so the brief pre-poster moment is a soft tint, not bare white. Workflow alongside: created `/raw-assets/` at the repo root with a `.gitignore` rule excluding it, and moved the 3.98 MB raw master `Flow V1.mp4` there. Raw masters live alongside the repo for re-encoding but never ship to Vercel. Future bottle renders (Clear, and any iterations) go in the same folder. Section 2 currently shows Flow only — the H2 still reads "We Created Drinkable Focus and Clarity" with Flow rotating on screen and Clear referenced in copy. When the Clear render arrives the composition will revisit, likely as a side-by-side layout or a Flow / Clear toggle. The v2.1 doc gains a Section 2 video iteration note appended to the existing Section 2 brief.

**Modified:** `app/startv2/page.tsx`, `app/startv2/FlowVideo.tsx` (new), `docs/development/featurePlans/landing-page-v2.1.md`, `.gitignore`, `public/videos/Flow.mp4` (new), `public/videos/Flow.webm` (new), `public/videos/Flow-poster.jpg` (new).

---

### 2026-05-29 -- Landing page v2.1: S6 marquee stars, athlete-thumbnail name removed, /startv2 horizontal-scroll fix

Three small iterations following the Section 7 port. First, the Section 6 sport-breadth marquee on `/startv2` now renders a white star between each sport rather than relying on plain `mx-5` spacing. The strip reads as `Premiership Rugby ★ WBO Boxing ★ NFL ★ ...` and the duplicated-list loop keeps the rhythm clean across the wrap point. Star is `aria-hidden` (decorative); the existing sr-only sentence still gives screen readers the clean comma-joined sport list, so accessibility unchanged. Second, the 7-portrait athlete roster strip at the bottom of `CROAthletes` (Section 6 on `/startv2`, Section 7 on `/start`) had its first-name label removed. Each cell is now a pure-photo 88x88 button with the image filling via `fill`; the button itself owns the rounded corners, border, and selected-state ring. `aria-label` keeps screen-reader context (athlete name + role) even without the visible name underneath. Affects both `/startv2` and `/start` since it's the same shared component; intentional, same audience tier on both pages. Third and last, a horizontal-scroll fix on `/startv2`: added `overflow-x-hidden` to the page-wrapper div. The S6 marquee uses `w-screen` plus `ml-[calc(50%-50vw)]` to break out of the section gutter and span full viewport width. On desktop browsers with a vertical scrollbar, `100vw` includes the scrollbar width while the body's usable width does not, so the marquee sat a few pixels wider than the viewport and triggered horizontal scroll on the whole page. The marquee's own `overflow-hidden` only clips its inner contents, not the element's own width. Page-level `overflow-x-hidden` clips any horizontal bleed at the wrapper boundary. Safe to add here because nothing on `/startv2` uses `position: sticky` (the one known interaction with `overflow-x-hidden`).

**Modified:** `app/startv2/page.tsx`, `app/components/cro/CROAthletes.tsx`.

---

### 2026-05-29 -- Landing page v2.1: Section 7 (research / Cambridge) ported to /startv2

Seventh section of the v2.1 design pass. Renders the existing `CROResearch` component (Cambridge hero photograph plus partner-logo strip plus description) on `/startv2` directly below the Section 6 athlete beat, with a navy "Try CONKA Today" CTA and green-tick guarantee row that mirror the S6 sandwich. Reused via direct import rather than `dynamic()`: `CROResearch` is a pure server component (no `"use client"`, no hooks, no client-side state) so the bundle-splitting ceremony that paid off for the carousel-heavy `CROAthletes` would add zero perf benefit here. No section-level callout (no eyebrow pill, no marquee strip): an earlier iteration shipped with a Cambridge-anchored eyebrow plus the 100,000+ cognitive-tests figure reused from S2, but the eyebrow was pulled when the Cambridge hero photograph and the named-partner grid were shown to carry the credibility lead on their own. The shared `CROResearch.tsx` (still rendered on `/start`'s Section 8) had its partner-logo strip rebuilt from a single horizontal flex row into a 2x2 grid of four equal-sized small grey-tinted rectangles. Each cell is `bg-black/[0.04] rounded-[12px] aspect-[2/1] overflow-hidden` with the logo image at `transform: scale(1.5)` so the logo content reads zoomed-in while the surrounding whitespace in each source asset gets clipped at the cell edge. The grid itself is capped at `mx-auto max-w-[420px]` so the tiles stay compact on desktop. Four cells, four partners: Cambridge (`/logos/UniversityOfCambridge.png`, new asset dropped this commit), Durham, Exeter, Made in Britain. Mirrors the Ketone-IQ research-partners card pattern: the grey backgrounds give the marks structure rather than letting them float on white, and the named roster reads as a deliberate tier of academic and credibility partners. Made in Britain was briefly considered for removal during scoping (three universities only) but reinstated as the fourth tile so the 2x2 reads cleanly. Both grid edits propagate to `/start`'s S8, which is acceptable: same credibility surface, same audience tier, same intent on both pages, and `/start` is heading for deprecation once `/startv2` is complete. The Durham and Exeter logo source files were also re-exported as part of this commit; behaviour and naming unchanged. The v2.1 doc gains a Section 7 brief following the S5/S6 template, and the Section 6 Reference line was softened so it no longer frames the eyebrow pill as "the v2.1 pattern": section-level callouts (pill, marquee, or none) are now chosen per section based on what the credibility lead actually needs, not as a fixed scaffolding element.

**Modified:** `app/startv2/page.tsx`, `app/components/cro/CROResearch.tsx`, `docs/development/featurePlans/landing-page-v2.1.md`, `public/logos/UniversityOfCambridge.png` (new), `public/logos/UniversityOfDurham.png`, `public/logos/UniversityOfExeter.png`.

---

### 2026-05-29 -- Landing page v2.1: Section 6 (athlete credibility) ported to /startv2

Sixth section of the v2.1 design pass. Renders the existing `CROAthletes` component (Olympic / world-champion carousel plus Informed Sport block) on `/startv2` via dynamic import, wrapped with two new elevations: a full-bleed sport-breadth marquee strip above the carousel, and a "Join the Elite" CTA plus green-tick guarantee row below. The marquee is a navy `#1B2757` band that breaks out of the section gutter via the `50% - 50vw` margin trick, scrolls 15 sports (Premiership Rugby, WBO Boxing, NFL, Showjumping, Motorsport, Rugby Sevens, MMA, Mountain Biking, Football, Olympic Track, NHL, Triathlon, British GT, Athletics, Ultramarathon) on a 60s linear loop, gated by `motion-safe:` for `prefers-reduced-motion`, with the sport list duplicated for a seamless wrap and an `sr-only` comma-joined alt for screen readers. Sports are ordered to avoid two rugby (or similar) items sitting next to each other, so the strip feels broad rather than rugby-heavy. Earlier doc call to put the athletes section in a dark Ketone-IQ register has been scrapped: the warm Magic Mind register has been working through S1-S5 and continues here; the dark marquee is the only register-break, a single punctuation rather than a full section flip. The legacy `/start` Section 6 (Benefit Cards, the "+28.96% memory" stat cards) is deliberately skipped on `/startv2`; the athlete section absorbs the "measured, not marketed" proof more powerfully than a stat-card grid. The shared `CROAthletes.tsx` (still rendered on `/start`) got its `InformedSportBlock` restructured from a vertical centered monument (160px logo, 28px headline, eyebrow + body + closing line, p-6/8 padding) into a tight horizontal row (80px logo on the left, eyebrow + 17px headline + body on the right, p-5 padding, closing line dropped). Saves around 250 to 300px of vertical space on mobile, reads as a single compact credential strip rather than a half-screen closing monument. Affects both `/start` and `/startv2`; the change is purely visual with no claims modification, and `/start` is heading for deprecation once `/startv2` is complete. CTA copy chose "Join the Elite" over "Order Now" (recycled from S2 and S4) and over "Unlock Elite Performance" (the word "performance" is regulated EFSA claim territory). Guarantee row matches the S1 hero pattern exactly: green-circle-check plus "100-day money back guarantee" on one line. Doc gains a Section 6 brief following the S4/S5 template.

**Modified:** `app/startv2/page.tsx`, `app/components/cro/CROAthletes.tsx`, `docs/development/featurePlans/landing-page-v2.1.md`.

---

### 2026-05-29 -- Meta attribution diagnosis and headless tracking fix

Diagnosed why Meta ads were spending without learning. Root cause was not the tracking code (which is sound) but the headless infrastructure: checkout ran on `conka-6770.myshopify.com` while the storefront is `www.conka.io`, so the Meta `_fbp`/`_fbc` cookies could not follow a shopper from ad click through to purchase, and Meta could not attribute conversions. The single pixel (`1138202151698404`) was confirmed correctly aligned across ads, site, and CAPI. Fixed the cookie split outside the codebase by moving checkout to the `shop.conka.io` subdomain (Vercel DNS + Shopify primary domain) and repairing the legacy theme's redirect (it was already present but broken by a stale myshopify-only hostname check plus a syntax error). This commit captures the full diagnosis and the remaining scoped work; no application code changed yet. Remaining tracking refinements (pixel load timing, InitiateCheckout de-dup, and a gated server-side Purchase webhook) are scoped in the plan doc and ticketed as SCRUM-1043 and SCRUM-1044.

**Modified:** `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md` (new), `docs/development/featurePlans/meta-tracking-hardening.md` (new).

---

### 2026-05-28 -- Landing page v2.1: Section 5 buy-box wired to cart drawer, layout polish

CTA on the Section 5 buy box now adds to the cart drawer directly rather than routing into the funnel page, mirroring the `CROBuyBox` quick-buy pattern that already ships on `/start`. The button calls `CartContext.addToCart(variantId, 1, sellingPlanId, { location: "buy_box", source: "startv2_section_5" })` with the current cadence's variant and selling-plan IDs (pulled at module scope via `getCadenceVariantByProductHeroId("03", ...)` and passed into `BuyBoxCard` as new `subVariant` and `otpVariant` props), so toggling between sub and OTP now switches both the displayed price AND the variant added to cart. Button gains a disabled state while the cart mutation is in flight or if the variant is missing, with `disabled:opacity-50 disabled:cursor-not-allowed` styling. The `funnelUrl` prop, `Link` import, and the previously-mentioned "routing to FUNNEL_URL where final cadence is chosen" model all come out. This is a quick-buy moment now, not a trust-anchor preview. Two smaller polish items shipped in the same commit: the guarantee copy under the CTA bumped from `text-black/65` to `text-black` so both the guarantee and the cancel-anytime line read at full weight, and the title + price + per-shot block reverted from its absolute overlay on the image back to a normal flow position below the image and above the "56 shots = 28 servings" description (image now leads as the first visual beat, copy follows in the lower half). Doc brief updated to match.

**Modified:** `app/startv2/BuyBoxCard.tsx`, `app/startv2/page.tsx`, `docs/development/featurePlans/landing-page-v2.1.md`.

---

### 2026-05-28 -- Landing page v2.1: Section 5 buy-box iteration (toggle, overlay, in-card guarantee)

Live-review pass on the Section 5 buy box after the initial port. The card itself moved from inline server JSX to a new client island `app/startv2/BuyBoxCard.tsx` (around 190 lines, dynamic-imported with a `min-h-[700px]` placeholder, default SSR preserved) so the sub-vs-OTP cadence toggle could come back into the card the way the legacy `/start` `CROBuyBox` has it. Sub remains the default. When the user toggles to OTP the price drops the `/mo` suffix, the strikethrough compare-at price and "Save N%" pill disappear, and the "Full CONKA app: daily cognitive tests + personalised insights" spec line goes strikethrough with a dimmed grey check and a "Sub only" tag so the give-up is visible rather than silent. The app framing itself is the second meaningful change: rather than "Full CONKA app access included" the spec now describes what the app actually does (cognitive tests + personalised insights, tied to the S2 proof line about 1,000+ brains tested through the app), and the eyebrow at the top of the section gets pulled into the same story ("Subscription auto-applied. You will get N% off, free UK shipping, and full access to the CONKA brain performance app"). The "You will get" framing is lifted from Ketone-IQ's banner copy so the eyebrow tells rather than asks. Card layout also restructured to match Ketone-IQ's pattern more directly: product title plus price row plus per-shot price now overlay the top-left of the product image (the new asset `/formulas/box/BothBox.jpg` has clean white space in its upper region so dark text reads cleanly without a scrim), a plain "56 shots = 28 servings" description line sits above the bullet list (Ketone-IQ's "24 shots = 24 servings" pattern), and the 100-day guarantee plus "Pause, adjust, or cancel anytime" line moved from outside the card to inside as the closing line under the CTA. Bullet list collapsed from four items to three (the shot-count line moved out as the description, leaving "One Flow + one Clear, every day", the CONKA app line, and "Free UK shipping"). The eyebrow pill got a `border-2 border-black/85` to match the stroke weight of the trust-badge circles below it so the four black outlines on the page now read as one family. Externals removed from `page.tsx`: the guarantee row, the `GUARANTEE_LABEL_FULL` and `formatPrice` imports (both live inside the new island now), and the `S5_SPECS` constant. Doc brief updated to match the new architecture and copy.

**Modified:** `app/startv2/BuyBoxCard.tsx` (new), `app/startv2/page.tsx`, `docs/development/featurePlans/landing-page-v2.1.md`.

---

### 2026-05-28 -- Landing page v2.1: Section 5 (buy box) ported to /startv2

Fifth section of the v2.1 design pass. Adds the buy-box beat inline in `app/startv2/page.tsx`, modelled on the Ketone-IQ buy pattern (auto-discount eyebrow + bold headline + trust-badge row + rich product card + 100-day guarantee row) and tuned for CONKA's offer shape. Headline "Your Complete Daily Routine" with italic emphasis on "Complete" anchors the Both sub as the recommended daily option. Subhead "Flow in the morning. Clear in the afternoon. Two shots a day, every day of the month" teaches the AM/PM pairing without overloading. Trust badges are a four-stamp row (Informed Sport, University Research, No Caffeine, 100-Day Guarantee) rendered as styled divs with no image assets, deliberately differentiated from the Section 4 cert strip (Vegan / Kosher / BPA / Third Party Tested). Buy-box card pulls live sub pricing, monthly-OTP strikethrough compare-at, and "Save N%" pill from `getCadencePricingByProductHeroId("03", ...)` so the numbers stay in lockstep with the funnel page and the legacy `/start` CROBuyBox. Spec checklist drops Ketone-IQ's subscription-upsell row (CONKA's headline price already IS the subscription price) and replaces it with a "Full CONKA app access included" line that does new work. CTA "Start My Routine" links to `FUNNEL_URL` where formula plus cadence get selected, so Section 5 is the trust and price anchor, not the purchase point itself. Section is fully server-rendered with zero new client JS. Eyebrow gates on `S5_SAVINGS_PERCENT > 0` so a malformed pricing payload would still produce coherent copy. Also reverts the `experimental.optimizeCss: true` flag added earlier today: it traded around 470ms of render-blocking CSS time for around 580ms of new Style and Layout main-thread work plus a 313ms long task on the page HTML itself, a net regression on /startv2 visible in the post-fix Lighthouse run (TBT jumped from 280-370ms to 540ms). The dead-CSS prune (story-* removal) and the IngredientsGrid dynamic import from that commit are kept. The v2.1 doc gains two new perf-log rows capturing the volatility we discovered (perf 65 and perf 78 on the same Section 4 deploy with no code changes, confirming the ±43 point swing flagged in the Section 3 hygiene notes) and a Section 5 brief following the S4 template.

**Modified:** `app/startv2/page.tsx`, `next.config.ts`, `docs/development/featurePlans/landing-page-v2.1.md`.

---

### 2026-05-28 -- Landing page v2.1: Section 4 detail panel restyle + bottle card overlay

Two visual tweaks to the Section 4 ingredients block. The detail panel above the tile grid switched from a tinted black/[0.04] block to a white card with a 1px black/10 border, padding bumped from 20px to 24px, and a hairline divider between the tags row and the benefit sentence. This pulls the panel into the same card family as the bottle card and the tiles below, so the whole section reads as one consistent grammar instead of three different surfaces. The bottle card no longer renders its product name and tagline as a row below the image; both moved inside the card as an absolute-positioned overlay anchored bottom-left at 20px from the corners. Saves around 90 to 100px of vertical scroll on this section. The card border was removed entirely so the asset's off-white photographic background flows into the white section background without a hard edge. Earlier note in the v2.1 doc about the overlay colliding with the centred bottle on a square card no longer applies given the new asset crops.

**Modified:** `app/startv2/IngredientsGrid.tsx`.

---

### 2026-05-28 -- Landing page v2.1: Section 4 perf fixes (critical CSS, dead-code prune, dynamic import, hero asset re-export)

After Section 4 shipped, a single Lighthouse mobile run on Vercel preview came back at perf 65, LCP 5.9s, TBT 280ms. The single number is noise per the Section 3 hygiene finding (±43 point swing on this bundle composition) but the diagnostic was clear: three render-blocking CSS chunks (24.8 KiB combined, 619ms critical path, 1,660ms `element-render-delay` on LCP) and a new 148ms long-task at 6.9s in the 1st-party chunk attributable to the `IngredientsGrid` client island hydrating. Four changes shipped together to address the regression. First, `experimental.optimizeCss: true` added to `next.config.ts`, enabling Next 16's bundled critical-CSS inlining (no `critters`/`beasties` install needed) so above-the-fold CSS goes inline and the rest is async-loaded, taking the render-blocking critical path off LCP. Second, dead CSS pruned from `app/globals.css`: the `.story-scroll-container`, `.story-section`, `.story-light`, `.story-dark`, `.story-counter`, `.story-progress-dot`, `.story-quote` and `.parallax-text` rules (~80 lines), all confirmed via grep to have zero consumers anywhere in `app/`. Leftover from a previous `/our-story` implementation, shipping sitewide via `globals.css` to every page. The `@keyframes` and `.animate-*` helpers (`animate-bounce-slow`, `animate-fade-in-up`, `animate-sticky-phone-fade`, `stagger-1..4`) were kept because `QuizResultsOverview` still uses them. Third, `IngredientsGrid` converted to a `dynamic()` import in `app/startv2/page.tsx`, mirroring the existing `CROFormulaSplitV2` pattern in `/start/page.tsx`: same default SSR behaviour (no SEO loss, no paint flash), but the JS chunk is code-split so its hydration cost lands outside the initial TBT window. `min-h-[1100px]` placeholder on the loading fallback reserves space against CLS on client-side navigation. Fourth, the hero LCP image `public/lifestyle/clear/ClearDrink.jpg` re-exported at 1200x900 (around 80 KB) from Canva, correcting the previous 720x540 export that was blurry on 2x/3x DPR mobile while still beating the original 1500x1000 at 69 KB for bytes. The doc `docs/development/featurePlans/landing-page-v2.1.md` updated with the Section 4 perf reading, the four fixes, and the outstanding lever still carried forward (polyfill prune, 13.7 KiB, `.browserslistrc` did not take effect and root cause is still unknown).

**Modified:** `next.config.ts`, `app/globals.css`, `app/startv2/page.tsx`, `public/lifestyle/clear/ClearDrink.jpg`, `docs/development/featurePlans/landing-page-v2.1.md`.

---

### 2026-05-28 -- Landing page v2.1: Section 4 polish, asset wiring, and brief documented

Closing pass on Section 4 of /startv2 after live-review iteration with the founder. New bottle assets `public/formulas/conkaFlow/FlowNew.jpg` and `public/formulas/conkaClear/ClearNew.jpg` (both square 1:1 with off-white photographic backgrounds, shipped in prior commit `4606d8d`) replaced the transparent-PNG stand-ins. The bottle card container refactored from `aspect-[5/4]` to `aspect-square` with `object-cover` so the asset's own background IS the card surface (no rectangle edge mismatch); the previous inner positioning hacks (`w-44 h-[88%] -translate-y-2 scale-150`) were removed because they were sized for transparent PNGs and made the new JPGs look crooked. Product name plus tagline moved out of the card overlay and into a new row below since the centred bottle on a square card would collide with the bottom-left overlay. The per-formula intro line above the grid (e.g. "Six active ingredients...") was consolidated into the bottle-card tagline because both lines were saying the same thing within a 200px scroll window. Eight ingredient renders shipped in prior commit `539dca3` (VitaminC, AlphaGPC, NAcetylCysteine, GinkgoBiloba, Lecithin, AlphaLipoicAcid, VitaminB12, plus the generic `11.jpg` white-powder stand-in) were wired into a new per-formula `ASSET_FILENAME` lookup in `IngredientsGrid.tsx`; the unused `LemonEssentialOil.jpg` was renamed to `AlphaGPC.jpg` and repurposed since CONKA does not need the essential-oil render. Clear's grid order was rebalanced to put Glutathione first and Vitamin C seventh per the founder's product-led call. Three Clear tiles (`glutathione`, `alcar`, and originally `alpha-gpc`) use the `11.jpg` generic white-powder fallback since those forms match the typical commercial powder appearance. Also includes a Section 2 stat tweak the founder made during the session: "100,000+ cognitive tests done" replaced with "£500,000+ invested into research" to better support the made-it-possible story. The new Section 4 brief in `docs/development/featurePlans/landing-page-v2.1.md` documents the full shipped state (job, reference, layout, image direction including all asset mappings and fallbacks, copy including all claims to revisit, architecture, and the unaddressed perf levers carried forward from Section 3). The same doc also picks up the Section 3 perf hygiene notes that were waiting in the working tree, including the median-of-5 finding (single-run Lighthouse mobile against Vercel previews swings ±43 points at our bundle composition, far beyond the doc's previous ±15-20 hedge).

**Modified:** `app/startv2/IngredientsGrid.tsx`, `app/startv2/page.tsx`, `docs/development/featurePlans/landing-page-v2.1.md`.

---

### 2026-05-28 -- Landing page v2.1: Section 4 ingredient count correction (Clear 9, headline 15)

First-review correction on Section 4 of /startv2. The initial port to the new `IngredientsGrid` client island only listed seven Clear ingredients because the source `clarityIngredients` array in `app/lib/ingredientsData.ts` was read past the truncation point during scoping and the trailing three entries (Alpha Lipoic Acid, Lemon Essential Oil, Vitamin B12) were missed. Confirmed with the founder that the canonical active count for Clear is nine, excluding `lemon-oil` which is a flavouring rather than an active. `ala` and `vitamin-b12` added to the grid's Clear list with the same name/tags/benefit shape as the others (one tight sentence, no em dashes): Alpha Lipoic Acid as "Antioxidant | Neuroprotection" and Vitamin B12 as "Vitamin | Brain Health". Clear intro line updated to "Nine active ingredients for the afternoon reset" and Clear's grid now renders as a clean 3x3 with no orphan tile. Page headline drops from "16 Science-Backed Ingredients" to "15 Science-Backed Ingredients" to match the real active count (6 Flow plus 9 Clear); aria-label on the section wrapper updated to match. Any external creative or copy that still references "16 ingredients" needs a separate sweep before this goes live.

**Modified:** `app/startv2/IngredientsGrid.tsx`, `app/startv2/page.tsx`.

---

### 2026-05-28 -- Landing page v2.1: Section 4 (Ingredients) ported to /startv2

Fourth section of the v2.1 design pass. Adds the "what's actually inside" beat inline in `app/startv2/page.tsx` along with a new client island `app/startv2/IngredientsGrid.tsx` that owns the AM/PM toggle, bottle card, ingredient tile grid, and always-visible detail panel. Headline "16 Science-Backed Ingredients" pivots from the conversational H2s of S1-S3 to a direct credibility declaration, paired with a subhead echoing the S2 proof points ("Every ingredient is dosed to match the peer-reviewed clinical research. Six years of development with leading UK universities and the military"). The grid renders 3 columns by 2 rows for Flow using the new 3D ingredient renders shipped in `public/ingredients/renders/` (Ashwagandha, Bilberry, BlackPepper, LemonBalm, RhodiolaRosea, Turmeric), with PascalCase filenames mapped to kebab-case ingredient ids via a small in-component lookup. Clear's seven ingredients render as two-letter initial-fallback tiles pending its own render batch. Each tile gets a light grey border, white background, and 14px radius; selecting a tile adds a 2px neutral outline around the whole tile (no formula-coloured accent). The detail panel above the grid restructures hierarchy Magic Mind style: ingredient name large, pipe-separated tags ("Root | Adaptogen", "Leaf | Nootropic") in small caps, then a single tight benefit sentence. The AM/PM toggle keeps the amber Flow / soft-blue Clear treatment from the existing `CROFormulaSplitV2` so the morning/afternoon ritual lands without a written instruction line. Below the grid sits a 4-icon cert strip (Vegan, Kosher, BPA Free, Third Party Tested at 68px AVIF, no labels), the navy Order Now CTA, and the same 100-day money back guarantee row used under the hero CTA. Section background stays white to match S1 and S2, leaving the page rhythm at white-white-tint-white through S4. Perf measurement pending after deploy.

**Modified:** `app/startv2/page.tsx`, `app/startv2/IngredientsGrid.tsx` (new).

---

### 2026-05-28 -- Landing page v2.1: perf hygiene bundle (hero image, .browserslistrc, perf log)

Two cheap sitewide perf wins landed in the same pass after the Section 3 fix recovered most of the TBT regression but left perf at 83 (target 85+). First, the /startv2 hero image `/public/lifestyle/clear/ClearDrink.jpg` (the LCP element on that page) was resized at the source from 1500x1000 at 69 KB to 720x540 at 38 KB, targeting the 15.3 KiB savings flagged by the Lighthouse "Improve image delivery" audit. Mobile-heavy paid traffic (74% mobile) makes the smaller source the right trade for marginal desktop-retina sharpness. Second, a new `.browserslistrc` at the repo root mirrors the `last 2 Chrome/Firefox/Safari/Edge versions, not dead` targets already declared in `package.json`, because Next.js 16's SWC compiler does not always honor the `package.json` field but reliably reads `.browserslistrc` (the open lever the PERFORMANCE_OPTIMISATION doc and the v2.1 perf log had been flagging for three runs). Expected outcome: the 13.7 KiB of `Array.at` / `Array.flat` / `Array.flatMap` / `Object.fromEntries` / `Object.hasOwn` / `String.trimStart` / `String.trimEnd` polyfills drops out of our 1st-party chunk on every page, helping FCP sitewide and the "Legacy JavaScript" Lighthouse audit. Also adds the Section 3 baseline and Section 3 perf fix rows to the v2.1 perf log with per-run notes documenting the regression and recovery and the levers chosen for Section 4.

**Modified:** `.browserslistrc` (new), `public/lifestyle/clear/ClearDrink.jpg` (resized), `docs/development/featurePlans/landing-page-v2.1.md` (perf log + notes).

---

### 2026-05-28 -- Landing page v2.1: Section 3 perf fix (server-side SVG, thin client reveal)

Recovers the TBT regression Section 3 introduced. Section 3's Lighthouse run came in at perf 80 (down from Section 2's 88) with TBT 400ms (up from 120ms, over the 200ms budget). The long-tasks report pointed at a 210ms task in the Section 3 chunk starting at 6.7s into the load: React hydrating roughly 60 SVG elements per chart across two stacked charts inside the `"use client"` `CaffeineCurves` component. The animation itself was not the cost. The static SVG markup was, because it was riding inside a client component. Fix splits `CaffeineCurves` into a Server Component holding all the SVG markup and a new thin client wrapper `CaffeineCurvesReveal` (around 50 lines) that owns the IntersectionObserver and toggles a `.revealed` class on its root div. The cover-rect transform and transition move from inline `style={coverStyle}` to a CSS module rule keyed off that class. Same visual, same behaviour, same reveal timing (2.8s cubic-bezier), same `prefers-reduced-motion` fallback (transition disabled via media query, snaps to revealed state). The two SVG chart blocks now ship as server-rendered HTML and pay zero React hydration cost. Expected outcome: the 210ms long-task disappears, TBT drops back toward the Section 2 baseline of 120ms.

**Modified:** `app/startv2/CaffeineCurves.tsx` (now a Server Component), `app/startv2/CaffeineCurvesReveal.tsx` (new), `app/startv2/CaffeineCurves.module.css` (new).

---

### 2026-05-28 -- Landing page v2.1: Section 3 polish (surface swap + curve revisions)

First-review pass on Section 3 of /startv2 after seeing it on the page. Surface swapped from cream `#F7F4ED` to the brand's existing soft-blue tint `var(--brand-tint)` (#f4f5f8), the same alternating background already used by FormulaCaseStudies, KeyBenefits, AthleteCredibility, and WhyConkaWorks. Avoids introducing a new palette token mid-build and keeps the section consistent with the rest of the clinical surfaces. Coffee curve in `CaffeineCurves.tsx` gains a third spike at ~6PM peaking lower than the first two (diminishing returns), tapering back to baseline by 11PM, with a third drink dot at the 5PM recovery point between the deep crash and the third spike. "wrecks sleep" annotation repositioned from the late-evening tail to sit above the third peak (the late-afternoon cup is what keeps you up, not the residual elevation). CONKA chart now distinguishes the two products: amber Flow dot at 8AM with a bold "Flow" label below, soft-blue Clear dot at 2PM on the plateau with a bold "Clear" label above. Brand colours match CLAUDE.md (Flow `#F59E0B` AM accent, Clear `#94B9FF` PM accent). "all day" annotation removed because the two product dots plus the visible plateau between them carry that story without needing a label.

**Modified:** `app/startv2/page.tsx`, `app/startv2/CaffeineCurves.tsx`.

---

### 2026-05-27 -- Landing page v2.1: Section 3 (Caffeine vs CONKA) ported to /startv2

Third section of the v2.1 design pass. Adds the "caffeine villain" beat inline in `app/startv2/page.tsx`: the only section on the page that is about caffeine rather than CONKA, naming the mechanism (adenosine block, cortisol spike, the 11am handback) and reframing nootropics and adaptogens as the heavy lifters that build the focus coffee borrows. First non-white section on the page, using cream `#F7F4ED` inline as the alternating surface (hex to be promoted into `app/brand-base.css` as `--brand-cream` in a follow-up now that it is locked). Centerpiece is a new client island `CaffeineCurves.tsx` rendering two stacked SVG charts (coffee on top, CONKA below) that share an x-axis from 8AM to 11PM and reveal left-to-right via a translating white cover rect, identical width and duration across both so the horizontal velocity is locked. A dashed baseline reference makes coffee's deep second crash drop visibly below where you started, and CONKA's evening taper land just above. Three annotations only ("crash", "wrecks sleep", "all day") at 13px italic semibold; drink dots mark the moments coffee or CONKA is taken (two for coffee, one for CONKA). Chart title: "Cognitive Energy levels on coffee vs CONKA". The closing paragraph integrates Magic Mind copy DNA ("nootropics and adaptogens do the heavy lifting: brain-boosting nutrients build the focus, stress-mitigating compounds keep cortisol in check"). Under the CTA, an ingredient trust strip pairs the two ingredient classes with new `NootropicsIcon.avif` and `AdaptogensIcon.avif`. IntersectionObserver triggers the animation at 30% in-view and respects `prefers-reduced-motion`. Four further trust icons (BpaFree, KosherCertified, ThirdPartyTested, VeganFriendly) are also added to `public/icons/` as the Canva batch for upcoming sections. Perf measurement pending after deploy; render-blocking CSS flagged in the prior Section 2 run is still the top LCP lever.

**Modified:** `app/startv2/page.tsx`, `app/startv2/CaffeineCurves.tsx` (new), `public/icons/` (new: NootropicsIcon.avif, AdaptogensIcon.avif, BpaFreeIcon.avif, KosherCertifiedIcon.avif, ThirdPartyTestedIcon.avif, VeganFriendlyIcon.avif).

---

### 2026-05-27 -- Landing page v2.1: doc handoff with perf log + Section 1/2 briefs

Sets the v2.1 design pass up for a clean handoff into a fresh chat for Section 3. Adds a Performance log to `landing-page-v2.1.md`: a table tracking Lighthouse mobile scores per section (Section 2 result captured at perf 88, LCP 3.8s), plus per-run notes on what the report flagged (render-blocking CSS as the biggest LCP lever, third-party JS as the global ceiling, 26 KiB of legacy polyfills in the 1st-party chunk that build-target tuning would strip). Fills out the Section 1 (Hero) and Section 2 (Brand Story) briefs with full shipped state (job, reference, layout, image treatment, copy, claims-review flags, perf delta) so a new chat picks up with complete context instead of stale `TBD` placeholders. Also tightens the Section 2 made-it-possible line to credit the broader collaborator set: "leading UK universities, professional sports clubs, and the military". The two new collaborator categories need `/review-claims` substantiation before launch.

**Modified:** `docs/development/featurePlans/landing-page-v2.1.md`, `app/startv2/page.tsx`.

---

### 2026-05-27 -- Landing page v2.1: Section 2 (Brand Story) ported to /startv2

Second section of the v2.1 design pass. Adds the brand-story beat ("We Created Drinkable Focus and Clarity") inline in `app/startv2/page.tsx`, following the Ketone-IQ-inspired structural shape: H2, single "made it possible" sentence emphasising self-funded development (6+ years, £500,000+ of our own capital, leading UK universities), the BothHero.jpg bottle asset cropped via CSS transform, two animated stats (150,000+ shots sold and 100,000+ cognitive tests done) that count up from zero on scroll into view via a small client island (`AnimatedStat.tsx`, IntersectionObserver, respects prefers-reduced-motion), a content-width Order Now CTA, and a laurel-flanked credibility badge ("One of the World's Largest consumer brain research project, 1,000+ brains tested regularly, unlocking a new level of cognitive performance"). The laurel renders by clipping a single Canva `/LaurelWreath.png` asset into left and right halves via overflow-hidden containers with `object-position: left|right center`. No new dependencies, page stays a Server Component aside from the small AnimatedStat island.

**Modified:** `app/startv2/page.tsx`, `app/startv2/AnimatedStat.tsx` (new), `public/LaurelWreath.png` (new).

---

### 2026-05-27 -- Landing page v2.1: Hero section ported inline to /startv2

First section of the v2.1 design pass. Ports the existing /start hero content inline into `app/startv2/page.tsx` rather than importing `CROHeroV2`, so spacing, typography, copy, and layout decisions are visible and tunable in one file as the design pass progresses. Applied a round of mobile tweaks against the original: top padding zeroed so the lifestyle asset butts directly under the nav; asset cropped 8% top, 12% bottom via CSS transform (GPU-only, no layout cost); H1 split onto two lines and bumped from 34px to 38px; trust micro-row shows a 4.5-star visual with "Excellent 4.7" label, bolded 622+ and 5,000+ counts, and 35px borderless avatars; CTA copy bumped to 18px with an inline right arrow; 100-day money back guarantee tick added under the CTA. No new fonts, no new dependencies, no client-side JavaScript beyond what `next/image` already needs.

**Modified:** `app/startv2/page.tsx`.

---

### 2026-05-27 -- Landing page v2.1: framework doc + empty /startv2 baseline

Kicks off the v2.1 design pass on /start. v2.0 shipped 11 sections without locking a visual system first, which Johnny (Ovrload) flagged as reading like a pitch deck rather than a landing page. v2.1 corrects this by locking the system (Magic Mind aesthetic baseline, Ketone-IQ proof-beat treatment, white/cream/navy surfaces, copy voice, Lighthouse mobile 85+ aim with 80 floor, deploy-and-measure-per-section protocol) in `docs/development/featurePlans/landing-page-v2.1.md` before any section is built. A fresh `/startv2` page is added as an empty `<main>` between Nav and Footer with noindex/nofollow metadata, so each section can be added inline once finished and measured against the perf budget. /start stays live serving paid traffic the whole build; cutover to /startv2 only happens once all 11 sections are complete.

**Modified:** `docs/development/featurePlans/landing-page-v2.1.md` (new), `app/startv2/page.tsx` (new).

---

### 2026-05-27 -- /start perf: mirror app/page.tsx import pattern

Rewrites `app/start/page.tsx` to one-for-one match the home page's import pattern in `app/page.tsx`. Only `Navigation`, `Footer`, and `CROHeroV2` remain static imports; every other below-fold section becomes `dynamic(() => import("..."), { loading: () => <div className="h-[Xpx]" /> })`. Reverses the Phase 3 decision to static-import the server components, which had left the `/start` page structurally different from the home page despite their shared underlying architecture. Skeleton heights match the prior CROBelowFold values so CLS stays at 0. Metadata export (noindex robots), V2 visual styling (`brand-v2` class, all-white section backgrounds, V2 paddings) and the disclaimer section preserved untouched. The architectural difference between `/start` and `/` is now zero; any remaining Lighthouse gap is component weight (CROBuyBox cart hooks, CROAthletes carousel portraits, CROCustomerReviews testimonials rendered 3x for infinite loop, CROFormulaSplitV2 ingredient rows), not page-level wiring. Build clean, `/start` still `○ (Static)`.

**Modified:** `app/start/page.tsx`.

---

### 2026-05-27 -- /start perf rebuild Phase 4: remove VisibilityGate from /start

Phase 4 of the /start perf rebuild (SCRUM-1041), the cleanup pass. Strips the three remaining `<VisibilityGate>` wrappers from `app/start/page.tsx` (around CROFormulaSplitV2, CROAthletes, and CROCustomerReviews). Phase 3 had already removed the other two (CROResearch and CROAppCallout) because gating Server Components prevented them from being SSR'd. The Phase 0 trace showed VG never solved the original perf problem anyway: it does not suppress modulepreloads (Next.js 16 doesn't emit those for any component), and it only defers the React mount — but the dynamic chunks are still listed in the initial HTML regardless. After removing the 3 wrappers, `app/start/page.tsx` has no `VisibilityGate` import; `grep -rln "VisibilityGate" app/` returned only the file itself, confirming /start was the sole consumer, so `app/components/VisibilityGate.tsx` is also deleted. SSR'd DOM element count in the prerendered HTML grows from 575 (Phase 3) to 1,357 because the 3 client islands now SSR via plain `dynamic()` without `ssr: false`. This is the documented trade-off of Option A: more SSR'd HTML in exchange for fewer chunks needed to paint the first frame. The Phase 0 trace confirmed hydration was not the original bottleneck (bandwidth starvation was), so the DOM increase should not hurt FCP/LCP; it may add some TBT cost we will measure in Phase 5. Option B fallback (a thin client wrapper for just the 3 carousels) remains on the shelf if the Phase 5 Lighthouse run shows TBT regression. Build still produces `/start` as `○ (Static)`.

**Modified:** `app/start/page.tsx`, `docs/development/featurePlans/landing-page-v2-perf-rebuild.md`. **Deleted:** `app/components/VisibilityGate.tsx`.

---

### 2026-05-27 -- /start perf rebuild Phase 3: inline section list, delete CROBelowFold

Phase 3 of the /start perf rebuild (SCRUM-1040), where the architectural cleanup behind Phases 1 and 2 actually starts paying off. Deletes `app/start/CROBelowFold.tsx` (194 LOC) and inlines its full 11-section list directly into `app/start/page.tsx`. The page stays a Server Component (keeps its `metadata` export). The five server components that Phases 1 and 2 produced (CROBrandStory, CROBenefitCards, CROResearch, CROAppCallout, CROFAQv2) are now static-imported alongside LandingDisclaimer (audited as server-safe). The five remaining client islands (LandingValueComparisonV2, CROFormulaSplitV2, CROBuyBox, CROAthletes, CROCustomerReviews) use plain `next/dynamic()` without `ssr: false`, which both removes the need for the launder-`ssr:false` wrapper and gets the islands into the initial HTML. Net result in the prerendered `.next/server/app/start.html`: all six server components plus CROBuyBox and (partial) LandingValueComparisonV2 are now SSR'd into the initial HTML; the three remaining VisibilityGate-wrapped client islands stay deferred until scroll. DOM element count in the prerendered HTML lands at 575, well under the 700-element budget. One deviation from the original ticket AC: VisibilityGate wrappers were stripped from CROResearch and CROAppCallout in this phase rather than waiting for Phase 4, because wrapping a Server Component in a client gate that returns null on initial render would have prevented those components from being SSR'd into the HTML at all, negating the entire point of static-importing them. The other three VisibilityGate wrappers (around the three real client islands) survive into Phase 4. Build still produces `/start` as `○ (Static)`. Next.js 16 no longer emits `<link rel="modulepreload">` for dynamic imports (it uses `<script src>` + selective `<link rel="preload" as="script">`), so the original "10 → ~5 modulepreloads" success metric does not literally apply; the equivalent win (fewer chunks competing with critical CSS for bandwidth on the first paint) is delivered.

**Modified:** `app/start/page.tsx`, `docs/development/featurePlans/landing-page-v2-perf-rebuild.md`. **Deleted:** `app/start/CROBelowFold.tsx`.

---

### 2026-05-27 -- /start perf rebuild Phase 2: strip accordion state, promote CROFAQv2 to server

Phase 2 of the /start perf rebuild (SCRUM-1039). Replaces useState-driven accordion mechanics with native HTML `<details>` / `<summary>` across the three accordion-bearing V2 sections. CROFAQv2 was a pure-accordion client component; it now drops `"use client"` and useState entirely and becomes a Server Component. CROBuyBox keeps `"use client"` for cart logic but its internal BuyBoxFAQ sub-component goes stateless via `<details name="buybox-faq">`. CROFormulaSplitV2 also keeps `"use client"` because of the genuine AM/PM toggle state, but its two nested accordions (ingredient row + nested "See the science" reveal) become `<details name="ingredient-row">` and a nested `<details>` respectively; its useState surface drops from three to one. Single-open behaviour is preserved via the HTML `name` attribute on grouped `<details>` (Chromium 120+, Safari 17.2+, Firefox 130+; older browsers fall back to multi-open with no broken UX). The +/− toggle and "See the science" / "Hide the science" label flip both use Tailwind v4's `group-open:` variant. Native snap-open animation accepted over the previous max-height transition — research note in the plan doc records why `interpolate-size: allow-keywords` was not pursued (Chrome-only support, bulk of paid /start traffic is iOS Safari which would not benefit). No visible UX regression expected. The full modulepreload-count reduction lands in Phase 3 when these server components get statically imported from page.tsx; Phase 2 alone is preparatory.

**Modified:** `app/components/cro/CROFAQv2.tsx`, `app/components/cro/CROBuyBox.tsx`, `app/components/cro/CROFormulaSplitV2.tsx`, `docs/development/featurePlans/landing-page-v2-perf-rebuild.md`.

---

### 2026-05-26 -- /start perf rebuild Phase 1: convert no-interactivity sections to Server Components

DevTools Performance trace of /start (Slow 4G, 4x CPU throttle) revealed the page sits dark for 2.85 seconds while Chrome downloads 10 dynamically-imported JS chunks in parallel. Those chunks compete with the render-blocking critical CSS for the 180 Kbps Slow 4G bandwidth; the CSS that should download in ~1s instead takes 2.6s, so FCP fires at 3.6s. Main thread is essentially idle during that window, so the original "hydration blocks LCP paint" hypothesis was wrong. Phase 1 of the perf rebuild starts removing unnecessary client components. Three V2 sections were marked `"use client"` with zero hooks, event handlers, or browser APIs — pure shadow JavaScript shipped for static content (CROBenefitCards 137 LOC, CROResearch 74 LOC, CROAppCallout 98 LOC). Drops the `"use client"` directive from all three. No behavioural change; they continue to render identically because their imports (next/link, next/image, CROPillCTA) all work fine in Server Components. The point is to reduce the modulepreload count Chrome injects into the HTML head, which is the root cause of the bandwidth starvation. Full plan and ongoing learnings live in `docs/development/featurePlans/landing-page-v2-perf-rebuild.md`. Baseline before this commit: Perf 95, FCP 2.6s, LCP 5.8s, TBT 290ms (median of 3 runs).

**Modified:** `app/components/cro/CROBenefitCards.tsx`, `app/components/cro/CROResearch.tsx`, `app/components/cro/CROAppCallout.tsx`, `docs/development/featurePlans/landing-page-v2-perf-rebuild.md`.

---

### 2026-05-26 -- Disable Klaviyo onsite signup-form script (perf)

Mobile Lighthouse audit on `/start` flagged the Klaviyo onsite bundle as one of the largest third-party drags: ~17.7 KiB of legacy-JS polyfills in `sharedUtils`, 16 KiB of unused CSS, and four long main-thread tasks (123ms, 93ms, 87ms, 58ms) spread across the audit window. Marketing then set all signup forms to draft state in the Klaviyo dashboard, which means `klaviyo.js` was loading, pinging Klaviyo, pulling Brand Library, and rendering nothing on every page. The Script tag in `app/layout.tsx` is now commented out to remove that pure-overhead load. The server-side subscribe paths are untouched: `/api/klaviyo/subscribe` and `/api/klaviyo/track-test` continue to power the Footer email signup and the `WinEmailForm`. To restore signup forms later, publish a form in the Klaviyo dashboard and uncomment the Script tag.

**Modified:** `app/layout.tsx`.

---

### 2026-05-26 -- Landing Page V2: Deferred-mount perf pass on the heaviest sections

Performance audit follow-up after all 11 V2 sections shipped. The four heaviest sections below the fold (Section 4 formula split with stateful AM/PM toggle plus 13 ingredient row images, Section 7 athletes with touch-swipe carousel plus 7 portraits plus the Informed Sport block, Section 8 Cambridge research with the full-bleed photo plus 3 partner logos, Section 10 app callout with the full-bleed lifestyle photo) are now wrapped in VisibilityGate so their dynamic JS bundles and image requests only fire when the user is within ~200px of seeing the section. Section sizes inside each gate match the existing dynamic-loading placeholder heights so cumulative layout shift stays at zero. Sections deliberately not gated: Section 2 and Section 3 (near-fold, would flash a placeholder during scroll-start); Section 5 buy box (the conversion moment, eager mount is intentional so fast scrollers always have it ready); Section 6 and Section 11 (text only, gating saves nothing meaningful); Section 9 (already inherited a gate from the V1 testimonials fork). Page composition unchanged: Server Component shell, statically imported Hero with priority LCP image, dynamic ssr:false on every below-fold section, four sections now additionally gated.

**Modified:** `app/start/CROBelowFold.tsx`.

---

### 2026-05-26 -- Landing Page V2: Section 11 FAQ ("Still wondering?")

Eleventh section of the V2 rebuild for `/start` (under parent SCRUM-1035). The last section before the legal disclaimer footer. Visual reskin of CROFAQ.tsx into V2 grammar plus one question curation pass to remove the overlap with Section 5's buy-box FAQ. Drops the V1 "What's the difference between Flow and Clear?" question because Section 5 already answers it under "What's in it?". Adds a new lead question "Why two formulas instead of one?" lifted verbatim from storyData.ts to reinforce Section 4's AM/PM system and front-load the strongest product-strategy narrative. Reorders the remaining four V1 questions broadest-product to narrowest-practical (can I take just one, how quickly will it arrive, what if my score doesn't improve, how do I cancel). H2 changes from the generic "Frequently asked questions" to the conversational "Still wondering?". The accordion mechanic mirrors Sections 4, 5, and 9: soft grey pill rows, aria-expanded, max-height transition, single-open behaviour, plain plus/minus indicators. V1 clinical chrome stripped: mono "// Common questions" eyebrow, numbered "01." prefixes, category eyebrow chips (TRIAL / PRODUCT / SHIPPING / SUBSCRIPTION), hard bordered outer container, mono bracketed toggle, black left-border answer panels, mono "Avg response 4h" footer. Contact footer kept: "Still stuck? info@conka.io" rendered as a soft centred line with a navy underlined email link. No CTA inside the section. CROFAQ.tsx is left untouched on disk (it has no other consumers but kept for revert per the V2 pattern).

**Modified:** `app/components/cro/CROFAQv2.tsx` (new), `app/start/CROBelowFold.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 10 app callout ("Don't trust us. Test yourself.")

Tenth section of the V2 rebuild for `/start` (under parent SCRUM-1035). The "don't trust us, test yourself" beat. The lifestyle image at the top shows the CONKA app's "Your Brain Over Time" graph on a phone next to a CONKA bottle. Below that the H2 lifts the strongest existing thesis line on the site verbatim: "We don't ask if CONKA works. We measure it." The body assembles three more verbatim quotes from existing site components in a tight narrative: the opener from AppUSPSection ("Other brands tell you it works. CONKA gives you a cognitive test and a daily log so you can watch it happen."), the not-an-IQ-test framing from AppFeaturePanel ("This isn't an IQ test. It measures how efficiently your brain processes information, tracked over time."), and the mechanism explanation also from AppFeaturePanel ("Built on Cambridge-derived visual recognition. Because it uses natural images, your brain can't learn or memorise the answers. Your score only improves if your brain actually improves."). A soft-grey risk-close card under the body delivers the no-risk close: "Take the test. Try CONKA. Take the test again. If your data doesn't move, we'll refund you within 100 days." A full-width navy pill CTA "Try CONKA risk-free" sends visitors to the funnel; a small text link below offers "Learn more about the app" for those who want the app deep dive. No App Store / Play Store badges in this section by design: Section 10 closes the conversion argument, not drives app downloads.

**Modified:** `app/components/cro/CROAppCallout.tsx` (new), `app/start/CROBelowFold.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 9 customer reviews (V2 reskin)

Ninth section of the V2 rebuild for `/start` (under parent SCRUM-1035). Pure visual reskin of the existing `LandingTestimonials.tsx` carousel into V2 grammar. Same eight curated testimonials, same data fields, same carousel mechanics ported verbatim (3x render for infinite loop, auto-advance every 3.5s, pause on hover or touch or expanded card, 50px swipe threshold, 200-char body truncation with Read more toggle). Every visual decision is the cleaner V2 equivalent: photo moves to the top of each card, the V1 SpecHeader block with its tick badge, mono Verified-and-date line, mono 4.5/5 rating, hairline character stars and product label divider is gone, replaced by a single row of gold SVG stars (same gold as the hero trust micro-row) and a small product label. Cards get a soft brand-radius outer border with no internal dividers. The hanging mono open-quote is gone. The "Read more" toggle becomes a bold navy underlined sans link. Chamfered lab-clip nav buttons become circular white-on-navy arrow pills like the Section 7 athlete carousel. Aggressive black-pixel dot indicators become a soft navy active pill on muted circles. Date renders as "Mar 2026" via Intl rather than the V1 ISO string. The V1 LandingTestimonials.tsx is untouched because it still serves the three Conka PDPs plus protocol pages and the home route.

**Modified:** `app/components/cro/CROCustomerReviews.tsx` (new), `app/start/CROBelowFold.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 8 Cambridge research + credentials

Eighth section of the V2 rebuild for `/start` (under parent SCRUM-1035). The academic-proof beat after the human-proof of Section 7. A hero card features the Cambridge college photograph above a bordered content area that carries the "RESEARCH BACKING" eyebrow, the card title "The Cambridge cognitive test.", and the verbatim site-vetted body explaining how the five-minute test built into the CONKA app comes from Cambridge University research via Cognetivity Neurosciences, is the same assessment used in NHS Memory Clinics, and is FDA-cleared. A credential chips line below the body reads "Cambridge-derived · FDA cleared · NHS validated". Underneath the hero card sits a supporting credentials block: a soft grey card with the line "Formulated in partnership with Durham and Exeter universities. Made in Britain." followed by the three logos centred and equally weighted (Durham, Exeter, Made in Britain). Three credibility tiers in one section: the test is Cambridge, the formulation is Durham + Exeter, the manufacturing is UK-made. All copy lifted verbatim from existing site components so no new claims are introduced.

**Modified:** `app/components/cro/CROResearch.tsx` (new), `app/start/CROBelowFold.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 7 athletes + Informed Sport

Seventh section of the V2 rebuild for `/start` (under parent SCRUM-1035). Forks the clinical `AthleteCredibilityCarousel` (still serving the three Conka PDPs untouched) into a softer V2 component focused on the athlete quote as the visual hero. Each slide stacks a large square portrait, the athlete name and sport, and the quote rendered very large. Seven circular athlete portraits sit below the active slide as a swipeable roster strip with the active one outlined navy. Touch swipe and keyboard arrows port the V1 mechanics. All V1 clinical noise removed: no mono eyebrows, no chamfered nav buttons, no "RUGBY 7s · OLYMPIC" chips, no "01." prefix on roster tiles. Below the carousel sits an Informed Sport certification card with the large logo and the legally-vetted copy lifted verbatim from WhyConkaWorksDesktop: every batch tested for 280-plus banned substances, trusted by WADA, Olympic committees, and professional sports leagues worldwide. No CTA in the section: this is the trust beat after Section 5 conversion and Section 6 numerical proof.

**Modified:** `app/components/cro/CROAthletes.tsx` (new), `app/start/CROBelowFold.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 6 % benefit cards ("Measured, not marketed.")

Sixth section of the V2 rebuild for `/start` (under parent SCRUM-1035). First "proof density" moment after the soft V2 storytelling in Sections 1-5. A single-column stack of four expandable benefit rows that surface the numbers behind the experience without resorting to a wall of statistics. Two of the four are in-app CONKA data (per-user delta methodology, 712 users / 7,593 tests / 30 months): "+1.09 pts" evening focus held during the 6-9pm dip, and "-41 ms" faster reaction time on fatigued days. The other two are PMID-backed ingredient studies: "+63%" memory (Bacopa monnieri, Small 2018) and "+30%" fatigue resistance (Acetyl-L-Carnitine, Malaguarnera 2008). Each row shows the metric on the left, label and source anchor on the right, plus a + or - affordance. Single-open accordion mechanic shared with Sections 4 and 5. The section footer explains the two anchor symbols (^^ for in-app cognitive tests, paragraph mark for peer-reviewed ingredient findings) and links to /app-insights for the full reports and methodology. No CTA in the section; conversion already happened at the Section 5 buy box, this beat earns trust.

**Modified:** `app/components/cro/CROBenefitCards.tsx` (new), `app/start/CROBelowFold.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 5 inline buy box (conka-both quick purchase)

Fifth section of the V2 rebuild for `/start` (under parent SCRUM-1035, no separate sub-ticket). First inline purchase moment on the landing page: a Ketone-IQ-inspired single product card for the conka-both bundle with an auto-checked Subscribe & Save toggle. The card carries the primary product photo, "CONKA Both" + tagline, a navy price row with the monthly-otp price grey and struck-through plus a "Save X%" pill, the per-shot micro-line, a four-item benefits checklist, and a full-width CTA whose label flips between "Start subscription · £X.XX/mo" and "Order once · £X.XX" depending on the toggle. Real cart wiring via `useCart().addToCart(variant.variantId, 1, variant.sellingPlanId, { location: "buy_box", source: "v2_quick_purchase" })` so Vercel + Triple Whale + Meta Pixel attribution lights up automatically; cart drawer opens itself. Variant and pricing resolved at render via `getCadenceVariantByProductHeroId("03", cadence)` and `getCadencePricingByProductHeroId("03", cadence)`, savings derived from the monthly-sub `compareAtPrice`. `CROPillCTA` gained optional `onClick`/`disabled`/`type` props so it can render as a `<button>` for cart actions; existing link callers are untouched. Section sits between Section 4 and the legacy testimonials block, `brand-bg-white` and standardised V2 spacing. FAQ dropdowns, quarterly cadence, and quantity stepper deferred to a follow-up.

**Modified:** `app/components/cro/CROBuyBox.tsx` (new), `app/components/cro/CROPillCTA.tsx`, `app/start/CROBelowFold.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 4 AM/PM toggle + ingredient accordion

Fourth section of the V2 rebuild for `/start` (under parent SCRUM-1035; no separate sub-ticket per current sectioning approach). Replaces the dense V1 `CROFormulaSplit` (side-by-side cards + drawer) with a single focused product card carrying a bottle close-up, dynamic one-line copy, and an AM/PM pill toggle (sun and moon icons inline as SVG). Below the card, a dynamic editorial intro line followed by a vertical stack of clickable pill-shaped ingredient rows in the 8 Hours homepage style: circular ingredient image, name, and a plus icon, expanding to a curated accordion containing the percentage of formula, the one-line claim, the top two key stats, and the first study citation. Single-open behaviour, all rows closed on first paint, accordion content reveals via `max-height` transition. The V1 `CROFormulaSplit.tsx` is left on disk untouched for revert; the shared `ingredientsData.ts` catalogue is read-only. Section background is `brand-bg-tint` to break the V2 white trio (Hero / Brand Story / Coffee vs CONKA). Standardised V2 section spacing maintained.

**Modified:** `app/components/cro/CROFormulaSplitV2.tsx` (new), `app/start/CROBelowFold.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 3 Coffee vs CONKA (animated bars)

Third section of the V2 rebuild for `/start` (SCRUM-1038, parent SCRUM-1035). Replaces the dense clinical Coffee vs CONKA chart with a single-glance LMNT-style horizontal bar comparison: Coffee fills 0 to 56% of the day (solid black peak from 9am to 12pm, red hatched crash from 12pm to 2pm) and CONKA Flow + Clear fills the entire bar in navy from 9am to 6pm. Three labelled time markers per bar replace the hour-by-hour ticks. Bars animate fill left-to-right on scroll-in using the existing `useInView` hook; `prefers-reduced-motion` skips the animation via a lazy `useState` initializer (no setState-in-effect). The shared `LandingValueComparison` is untouched and still serves `/conka-flow`, `/conka-clarity`, and `/conka-both`; the V1 chart slot was removed from `/start` so the page doesn't carry two coffee-vs-CONKA visualisations. The parent plan picked up "The CRO bet" principle and the no-Figma-for-Sections-3-to-11 decision in the same pass, and Section 2's subline was finalised to lead with the £500k/3-years line and append the trusted-by-athletes endorsement.

**Modified:** `app/components/landing/LandingValueComparisonV2.tsx` (new), `app/start/CROBelowFold.tsx`, `app/components/cro/CROBrandStory.tsx`, `docs/development/featurePlans/landing-page-v2.md`.

---

### 2026-05-26 -- Landing Page V2: Section 2 brand story ("We Created Drinkable Focus")

Second section of the V2 rebuild for `/start` (SCRUM-1037, parent SCRUM-1035). Editorial dev-story block sitting directly below the lifestyle hero: H2 "We Created Drinkable Focus", investment subline, ShotsHero.jpg product asset (cropped 10:9 with object-cover scale-150 zoom so the bottles fill the frame), two stacked stats (150,000+ shots sold to date / £500,000 invested into clinical research), and a centered navy pill CTA "Order Now".

Also extracted the navy pill CTA out of the Hero's inline implementation into a shared `CROPillCTA` component now used by both sections. The Hero pill keeps its full-width treatment by passing `className="w-full"`; Section 2 uses the content-width default with `px-10` for breathing room. Hero and Section 2 section paddings are reduced via inline styles since `globals.css` imports `brand-base.css` after Tailwind, so `pb-*` / `pt-*` utilities lose the cascade against `.brand-section` (matches the existing inline-style pattern on `/app-insights/page.tsx`).

**Modified:** `app/components/cro/CROBrandStory.tsx` (new), `app/components/cro/CROPillCTA.tsx` (new), `app/components/cro/CROHeroV2.tsx`, `app/start/CROBelowFold.tsx`, `app/start/page.tsx`.

---

### 2026-05-26 -- Landing Page V2: Section 1 hero (lifestyle, single column)

First section of the Landing Page V2 rebuild for `/start` (SCRUM-1036, parent SCRUM-1035). Replaced the clinical-grammar CRO hero with a softer, DTC-style lifestyle hero matching the Figma render: mobile full-bleed lifestyle photo on top (CONKA Clear bottle held by a customer), 5-avatar trust micro-row with gold stars and bold review microcopy, italic-Daily headline, solid-black subline, and a navy pill CTA. Introduces the foundational `.brand-v2` scope class on the `/start` page root so subsequent V2 sections inherit a softer token set (rounded radii) without affecting any other clinical page. Old `CROHero.tsx` kept on disk untouched for revert.

**Modified:** `app/components/cro/CROHeroV2.tsx` (new), `app/brand-base.css`, `app/start/page.tsx`.

---

### 2026-05-22 -- conka-both PDP: lead with athletes, add the value comparison

Restructured the section order on the /conka-both bundle product page so it leads with athlete credibility before asking for proof and price. The athlete credibility carousel and the value comparison band, both already live on /conka-flow and /conka-clarity, were added to /conka-both, and the comparison CTA now scrolls to the in-page hero purchase module rather than self-linking. The Why CONKA Works and Explore (Flow/Clear product grid) sections were removed, FAQ moved directly above the footer, and section backgrounds re-alternated white/tint so no two same-coloured sections sit adjacent. Cosmetic only: no component internals, data-layer, or analytics changes. SCRUM-1030.

**Modified:** `app/conka-both/page.tsx`.

---

### 2026-05-20 -- Customer portal address update now syncs to Loop

Updating a delivery address in the account portal changed the address in Shopify but never reached Loop, so every future subscription delivery still shipped to the old address. The root cause: the update route only ever called the Shopify Customer Account API. Loop stores the shipping address separately on each subscription contract and does not re-read Shopify's default address, so the sync was never happening (the Loop write had never been implemented). After the Shopify write succeeds, the route now pushes the new address to every active or paused Loop subscription via the Loop Admin API. The Loop sync is best-effort: if it fails, the Shopify save still stands and the response reports a partial success so the customer is told the subscription delivery address needs support rather than getting a silent miss.

**Modified:** `app/api/auth/customer/update/route.ts`, `docs/features/CUSTOMER_PORTAL.md`.

---

### 2026-05-18 -- Home ProductCard CTA uses shared ConkaCTAButton

The "Shop Now" CTA on each product card on the home page was a hand-rolled `<Link>` with the wrong clip-path: a single top-right notch (the legacy `lab-clip-tr` utility shape), not the two-corner notch (top-left + bottom-right) that defines the brand's primary CTA. This is exactly the regression the recent `lab-clip-tr` comment fix warned about. Replaced the inline button with `ConkaCTAButton` (with `meta={null}` and a `w-full max-w-none` className override so it stretches edge-to-edge inside the card), bringing the home page product cards in line with the desktop nav Shop button and the rest of the site's primary CTAs. Fix applies to desktop, tablet, and mobile grids since all three render the same `ProductCard`.

**Modified:** `app/components/home/ProductCard.tsx`.

---

### 2026-05-18 -- App Insights: lighten filter tiles, TLDR cards, and headline callouts

The four filter buttons ("How does performance change through the day?", etc.), the four "What the data shows" TLDR cards, and the per-report headline callouts inside each report all used a near-invisible white-on-dark treatment (`bg-white/[0.06]` to `bg-white/[0.10]` with light text), which made them read as decorative panels rather than interactive controls. Flipped all three surfaces to a light grey treatment (`bg-white/75` to `bg-white/85`, hover to solid white) with dark `#0a0a0a` text, so the affordance is unmistakable on the dark page background. The active filter state keeps the solid-white fill but now gains a `ring-2` outline to differentiate it from the other (now also light) tiles.

To support reusing `EvidenceStrengthBadge` on the new light surfaces, added a `tone="light" | "dark"` prop (default `"dark"`, so the badge's other consumer is unchanged). The light variant inverts dot, ring, and text colour to read against a light background.

**Modified:** `app/components/insights/InsightFilteredSections.tsx`, `app/components/insights/InsightTldrStrip.tsx`, `app/components/insights/ReportHeadlineCallout.tsx`, `app/components/insights/EvidenceStrengthBadge.tsx`.

---

### 2026-05-18 -- Desktop nav Shop button: permanent accent + matched clip-path

The desktop Shop button in the header was a white-bordered button that only filled with the accent navy on hover. It read as a low-priority chip even though Shop is the highest-intent destination in the nav. Switched it to permanent `#1B2757` fill with white text at all times, and aligned the clipped shape with `ConkaCTAButton` (12px notches on top-left and bottom-right) so the brand's primary-CTA shape is consistent everywhere it appears. Replaced the colour-swap hover with a subtle opacity fade matching the rest of the site's primary CTAs, plus an explicit focus ring for keyboard users.

Also corrected the comment on `.lab-clip-tr` in `brand-base.css`, which incorrectly claimed it matched `ConkaCTAButton`. It is a different (single top-right) clip-path, and the misleading comment was how the Shop button ended up with the wrong shape in the first place. The corrected comment now states that primary CTAs use a different two-corner notch and warns against "refactoring" them onto the utility class.

**Modified:** `app/components/navigation/NavigationDesktop.tsx`, `app/brand-base.css`.

---

### 2026-05-18 -- Customer portal profile update hardening (SCRUM-1004, SCRUM-1006)

Three fixes to `/account/details` Edit Profile flow that were silently mis-saving data for paying customers.

- **Phone-only no-op:** A phone-only update from a customer with no default address used to return a silent 200. Now returns a clear 400 telling the customer to add a delivery address first.
- **territoryCode overwrite to GB:** Migrated accounts with a null stored `territoryCode` were being silently moved to GB on save, even when the country dropdown showed US/CA/AU. The form now clamps country to a known dropdown value on open and derives `territoryCode` from country at submit.
- **Phone E.164 validation:** The phone field now validates as E.164 client-side with placeholder `+447123456789`, preventing confusing Shopify userErrors and stopping legacy non-E.164 values from round-tripping back unchanged. Soft breaking change for customers with legacy phone values, acceptable since Shopify already rejects them.
- **Stale province/zoneCode on country change:** Changing country in the modal now clears province and zoneCode (e.g. switching from US to UK no longer ships California + the US zoneCode to Shopify).
- **Partial-success in route response:** The route runs two Shopify mutations (name, address) with no transactional wrapper available. Previously a name-update-ok + address-update-fail returned a generic 400, leaving the customer record with a half-saved name the user could not see. The route now runs both mutations independently, collects per-op results, and returns an error string that names both what saved and what failed ("Your name was saved, but the address change failed: ...").

Phase 1 of SCRUM-1004 (sync the address to Loop subscription contracts) was descoped to **SCRUM-1005** after the spike confirmed the assumed admin endpoint is not publicly documented on `developer.loopwork.co`. The only update-shipping endpoint Loop documents is the storefront subscriber-portal one (session-token auth, 24h expiry), which SCRUM-1004 ruled out. SCRUM-1005 lists four options for the team to pick from before resuming engineering.

**Modified:** `app/api/auth/customer/update/route.ts`, `app/components/account/EditProfileModal.tsx`.

---

### 2026-05-15 -- Permanent redirect for /welcome-to-conka

Added a 301 redirect from `/welcome-to-conka` to the home page. The legacy URL is no longer needed and should consolidate to the canonical root for SEO.

**Modified:** `next.config.ts`

---

### 2026-05-13 -- New Claude skills: /bug, /commit, /review-analytics (SCRUM-983)

Three new Claude Code skills added to `.claude/skills/`:

- `/bug` -- Detective-first bug investigation. James Whittaker mindset + Five Whys. Enforces reproduce-before-fix and root-cause-before-patch discipline. Includes a web-specific failure patterns table (hydration mismatches, cart URL issues, CAPI deduplication failures, CLS jumps, and more).
- `/commit` -- Safe commit gate. Refuses to run on main, always updates `docs/CHANGELOG.md` before committing, stages specific files (no `git add -A`), and enforces the project commit message format with co-author line.
- `/review-analytics` -- Verify all 4 analytics systems (Vercel Analytics, Triple Whale, Meta Pixel, Meta CAPI). Checklist-driven, with a common failure patterns table. CAPI deduplication check is flagged as the highest-stakes item.

All three skills follow the architecture guide skeleton (frontmatter, Step 0 continuity check, silent gather step, response template, Key Principles footer).

**New files:** `.claude/skills/bug/SKILL.md`, `.claude/skills/commit/SKILL.md`, `.claude/skills/review-analytics/SKILL.md`.

---

### 2026-05-13 -- Funnel back button fix + home page CTA routing

**Back button:** The funnel step indicator was purely React state with no URL changes, so pressing browser back at any step exited the funnel entirely (to the previous page in browser history). Fixed by seeding a history entry for step 1 on mount (`replaceState`) and pushing a new entry on each `goToStep` call (`pushState`). A `popstate` listener detects back/forward navigation and replays the step transition animation.

**Home page CTA routing:** Several shared landing components defaulted their CTA to `/funnel` (via `ConkaCTAButton` with no `href`). None of those CTAs should reach the funnel from the home page.

- `LandingDailyBenefits` — home page only, CTA now hardcoded to `/conka-both`.
- `LandingTestimonials` — added `ctaHref` prop (default `/funnel` preserves behaviour on other pages where `hideCTA` is already passed); home page passes `/conka-both`.
- `LabFAQ` — same pattern.
- `LandingProductShowcase` — added `hideCTA` + `ctaHref` props. Home page passes `ctaHref="/conka-both"`. Product pages (`conka-both`, `protocol/[id]`) pass `hideCTA` — the "Get Both" button made no sense when the user was already on a product page.

**Modified:** `app/funnel/FunnelClient.tsx`, `app/page.tsx`, `app/conka-both/page.tsx`, `app/protocol/[id]/page.tsx`, `app/components/landing/LandingProductShowcase.tsx`, `app/components/landing/LandingTestimonials.tsx`, `app/components/landing/LabFAQ.tsx`, `app/components/landing/LandingDailyBenefits.tsx`.

---

### 2026-05-12 -- Cart upsell tile

Dynamic upsell block rendered below line items in the cart drawer. Two rules:

- **Flow or Clear in cart** — offer Both at the same cadence (monthly-sub, OTP, or quarterly). Replaces the current item.
- **Both OTP in cart** — offer Both monthly subscription. Replaces the current item.
- **Both monthly-sub or quarterly-sub** — no upsell (handled by email flows).
- **2+ lines in cart** — no upsell.

**Tile design:** Header bar with savings badge, `BothShots.jpg` (both bottles together), hero number, benefit bullets, CTA. Matches `CartAppGift` visual pattern.

**Messaging:** Shows the incremental extra cost vs what the customer currently pays (`+£30/mo more than you pay now`) and savings percentage vs buying separately (`Save 25%`). Benefit bullets explain what the extra cost buys: shot count and product name (e.g. "28 shots of Conka Clear every month") plus "The complete cognitive performance system". Subscription upgrades show `Save £40/mo` vs one-time anchor, with delivery and cancellation reassurance.

**Behaviour:** The upsell replaces the current cart item -- it does not stack on top of it. Error recovery: if the add-to-cart fails after the existing item is removed, the original variant/plan/quantity is restored and an inline error is shown.

**Analytics:** `cart:upsell_shown` and `cart:upsell_accepted` events via Vercel Analytics.

**Architecture:** Variant GID detection uses a single source of truth -- reverse-lookup Maps built from `FUNNEL_VARIANTS` in `funnelData.ts` via two new exported helpers (`detectFunnelProduct`, `detectFunnelCadence`). No GIDs duplicated in `cartUpsell.ts`.

**New files:** `app/lib/cartUpsell.ts`, `app/components/CartUpsellStrip.tsx`.
**Modified:** `app/components/CartDrawer.tsx`, `app/lib/funnelData.ts`.

---

### 2026-05-12 -- Code review: B2B cleanup (SCRUM-971)

Post-implementation review of the B2B removal. No regressions found. All lint warnings in the changed files were pre-existing (unused vars in the protocol calendar generator, `FormulaVariantConfig` type in `shopifyProductMapping.ts`). No fixes required.

---

### 2026-05-12 -- B2B/Professionals feature removed (SCRUM-971)

Full dead code removal. The B2B professional portal was built in Jan 2026 but never launched -- no live traffic, no active users.

**Deleted:** `app/professionals/` (3 pages), `app/components/professionals/` (18 components), `app/lib/b2bCartTier.ts`, `docs/features/b2b/B2B_PORTAL.md`.

**Removed from lib:** `B2BTier` type, B2B variant maps from `shopifyProductMapping.ts`, B2B helper functions (`getB2BTier`, `getB2BFormulaPricing`, etc.), B2B pricing constants and VAT helpers from `productPricing.ts`.

**Removed from cart:** `updateMultiple` API action, B2B tier normalisation from `CartContext` (was running on every cart mutation for all users), B2B VAT breakdown and tier/error banners from `CartDrawer`.

**Added:** `/professionals/:path*` redirect to `/` in `next.config.ts`.

3,134 lines deleted. TypeScript clean throughout.

---

### 2026-05-12 -- Code review fixes: funnel + cart cleanup

Post-review cleanup across the funnel and cart work:
- Removed unused `FUNNEL_CADENCES` import from `FunnelClient.tsx` (stale after `checkoutSubLabel` was removed).
- Removed dead `getSavingsPercentage` function from `CartDrawer.tsx` (defined but never called).
- Added comment to `EducationStep.tsx` explaining the `maxHeight: 600px` CSS transition pattern so it is not silently changed.
- Added comment to `CartAppGift.tsx` clarifying why `"use client"` is intentionally omitted (pure render, no hooks).

---

### 2026-05-12 -- Funnel redesign: education-first 4-step flow

**Design update** to the paid traffic funnel (`/funnel`). The previous single-page product selector is replaced with a 4-step flow designed to warm up cold paid traffic before showing prices.

**Steps:**
1. **Learn** -- two formula cards (Flow / Clear) with always-visible tagline and progressive disclosure tabs: Ingredients, What it does, What you'll notice.
2. **Choose your formula** -- product selector (Flow, Clear, Both) with no prices shown. "Both" is recommended/most popular. Description expands on selection.
3. **Choose your plan** -- cadence selector (monthly sub, quarterly sub, one-off). CTA: "Review my order" with price + product as sub-label.
4. **Review** -- order summary showing product image, What / When / How much, plus an app section (AppConkaRing screenshot, 3 bullets, iOS and Google Play label). CTA: "Proceed to checkout" with no sub-label (summary page does that job).

**Savings logic on summary:** two honest signals -- cadence saving (subscription vs one-off, or quarterly vs 3x monthly) and bundle saving (Both vs buying Flow + Clear separately at the same cadence).

**Step indicator** extended from 2 to 4 steps (Learn, Product, Plan, Review + Checkout).

---

### 2026-05-12 -- Bug fix: AthleteCredibilityCarousel mobile selection

Feature portrait image in `AthleteCredibilityCarousel` was `loading="lazy"`. When a user scrolled down to the roster strip and tapped a different athlete, the newly selected image (above the viewport) would not load. Fixed by switching the feature portrait to `loading="eager"` -- roster strip thumbnails remain lazy.

---

### 2026-05-11 -- Home page hero CTA: "Buy CONKA" + route to /conka-both

- Changed CTA label from "Try CONKA Today" to "Buy CONKA Today" in `LandingHero` (mobile + desktop layouts).
- Routed the button to `/conka-both` instead of the ad funnel URL, giving organic home page visitors the full product page experience.

---

### 2026-05-07 -- Design system: dark-page documentation and CSS truthing (no visual change)

Audit pass to make `DESIGN_SYSTEM.md` and `brand-base.css` accurately describe what `/app` and `/app-insights` actually do. No visual change to either page; both still render via the same inline `backgroundColor: "#0a0a0a"` + inline SVG dot pattern as before.

**`app/brand-base.css` Layer 2.5:**
- Removed the `.brand-app-dark` class (dead code: defined CSS variables that no component consumed).
- Replaced the `.app-dot-grid` definition with the actually-used pattern (2x2px white squares at 24px pitch, 18% opacity) so the class matches the inline SVG used on both pages. Class is still optional; pages continue to inline the pattern.
- Header comment rewritten to describe the real shell pattern (`brand-clinical` + inline dark bg) and to note that there is no separate `brand-app-dark` scope class.

**`docs/branding/DESIGN_SYSTEM.md`:**
- Section 4 (Radius): radius note corrected — the dark pages inherit zero radius from `.brand-clinical`, not from a separate App Dark rule.
- Section 8 (Clinical Aesthetic): `/app-insights` added to the active-pages list. New preface clarifies that the clinical grammar (zero radii, hairlines, mono labels, no shadows, no gradients, navy interactive-only) applies in both light and dark themes; section 10 documents the dark-theme palette specifically.
- Section 10 (App Dark Aesthetic): rewritten to reflect reality.
  - Active pages updated to `/app` and `/app-insights`.
  - Scope description updated: `brand-clinical` + inline dark bg, no `brand-app-dark` class. Page-shell snippet shown verbatim.
  - "Fixed palette" table replaced with a "ramp" table showing the most-used stops (start here), interactive surfaces, and the full ramp actually in use. Discipline note added: stay on multiples of 5 for opacity, reach for arbitrary `[0.0X]` only when an intermediate hairline tier is needed.
  - SVG dot grid section corrected to the 2x2px / 24px / 18% pattern and notes that pages inline it.
  - "Do not" list updated: invent new opacity stops outside multiples of 5 without reason; add a third dot-grid variant.

**Why:** the previous docs said the dark pages used `.brand-app-dark` and `.app-dot-grid` and a fixed white-opacity palette. None of those were accurate against the codebase. The truthing pass aligns the docs with what reviewers will see when they open the page.

---

### 2026-05-07 -- /app-insights: credibility and readability upgrade

Two-phase upgrade making the page land its differentiation message ("CONKA is not just a supplement; testing is part of the experience") and turning every report into a layman-readable artefact without losing rigour for educated readers. Filter UX preserved.

**Phase 1 -- Premise upgrade**

New components:
- `app/components/insights/InsightHeroDifferentiator.tsx` -- replacement hero. Headline rewritten to "We don't ask if Conka works. We measure it." Stats ribbon (712 users / 7,593 tests / 30 months / 4 reports) promoted from a mono caption to a designed 4-cell strip with hairline dividers, 2-col mobile / 4-col desktop.
- `app/components/insights/HowThisIsPossibleModule.tsx` -- new section between hero and the report stack. Three-step flow (Take Conka -> Test in app -> See your data) explains the measurement loop, embeds the validated-test credentials grid, and renders the verbatim CognICA credential paragraph. Fires `insights_credibility_view` once on viewport entry.
- `app/components/insights/CredentialsBadgeBlock.tsx` -- 4-stat credentials grid (93% sensitivity / 87.5% reliability / 14 NHS Trusts / 510(k) FDA-cleared). Mirrors `AppResearchModal`'s stat layout so the same proof points stay consistent across surfaces.

Page changes:
- `app/app-insights/page.tsx` -- swapped inline hero for `<InsightHeroDifferentiator />`, inserted "How this is possible" section after the hero, slimmed the methodology footer (credential paragraph removed; legal anchors only). The `^^` footnote now points readers back to the lifted credentials section.
- `app/app-insights/layout.tsx` -- metadata refreshed: title "Real cognitive data from real users | CONKA", description re-anchored on the differentiation framing, OG copy aligned.

**Phase 2 -- Readability upgrade**

Data layer (additive, no restructure):
- `app/lib/appInsightsTypes.ts` -- new types `LaymanAnchor` and `EvidenceStrength`; `ReportData` extended with `headlineFinding`, `sampleSize`, `evidenceStrength`, `laymanAnchors[]`.
- `app/lib/appInsightsData.ts` -- all four reports populated from the source `docs/conkaAppData/*.md` Summary tables. Time-of-day and Mental Fatigue marked Strong; Stress and Alcohol marked Moderate. Two layman anchors per report pairing a measured stat with a relatable comparison.

New components:
- `app/components/insights/EvidenceStrengthBadge.tsx` -- small mono pill, monochrome with a dot indicator that ramps from filled (Strong) to half-filled (Moderate) to outlined (Early signal). Borders track the same ramp.
- `app/components/insights/InsightTldrStrip.tsx` -- 4 cards above the existing filter, one per report. Each card shows headline finding + sample size + evidence badge. Click clears any active filter, scrolls to the matching section, and fires `insights_tldr_card_click` with the report id.
- `app/components/insights/MethodologyInThirtySeconds.tsx` -- expandable panel above the filter. Closed by default on mobile, opens after mount on desktop. Two-card visual contrasts "the simple way (misleading)" with "what we do (per-user delta)"; rigor caveats listed below. Fires `insights_methodology_open` once per session.
- `app/components/insights/ReportHeadlineCallout.tsx` -- per-report client island that DataReportSection now renders between the trio header and the chart card. Shows headline finding (large), evidence badge, sample size, and the layman anchors as a 2-up grid. Fires `insights_report_callout_view` once per report on viewport entry.

Modified:
- `app/components/insights/DataReportSection.tsx` -- prepends each report with `<ReportHeadlineCallout />`. Existing trio header, chart card, stat cards, Conka sub-section, ingredient bridge, and methodology footnote unchanged.
- `app/components/insights/InsightFilteredSections.tsx` -- now mounts `InsightTldrStrip` and `MethodologyInThirtySeconds` above the filter bar. Owns a `focusReport(id)` helper that clears the filter (so the target section is in the DOM) and scrolls on the next animation frame.

**Constraints honoured:**
- Locked CognICA credential language from `LandingDisclaimer.tsx` footnote ^^ copied verbatim, not rewritten.
- Existing chart components (`DataLineChart`, `DataBarChart`), stat cards (`InsightStatCard`), Conka sub-sections, and ingredient bridges untouched.
- No theme migration: page stays on the `#0a0a0a` aesthetic with the SVG dot pattern.
- No em dashes in any new copy; commas, periods, and the middle-dot `·` used as separators.
- Build remains static (`/app-insights` still pre-renders); new client islands are scoped to interactive bits only.

Phase 3 ("what we do with this data" closing module connecting findings to product decisions) deferred until product-decision narratives are locked.

---

### 2026-05-07 -- Homepage: real-data callouts on benefit components, section reorder, credentials strip simplified

Wired the real `/app-insights` data into two homepage components and reorganised the middle of the page so trust and proof land in the right order.

**Real-data callouts (`LandingDailyBenefits.tsx`, `LabTimeline.tsx`):**
- Each pillar in `LandingDailyBenefits` (Mental Performance / Sustained Energy / Brain Health) gained an `appInsight` block in the expanded section: a real stat from `/app-insights` (`−1.8 pts` fatigue cost, `+1.09 pts` Conka evening hold, `−5.4 pts` moderate stress cost), an `n=` hedge with `^^` anchor, and a "See data →" link to the relevant page anchor (`#mental-fatigue`, `#time-of-day`, `#stress`).
- `LabTimeline` 24h step gained the same callout pattern using the time-of-day data. Subtitle moved from the placeholder "N=150+ participants · 5,000+ cognitive tests" to live values pulled from `APP_INSIGHTS_TOTALS` (712 users · 7,593 tests · 30 months).
- Copy framed for intuition rather than jargon: stats read as losses ("lost on fatigued days, vs each person's own fresh-day score") or holds ("above daily average after 6pm on Conka days, when scores naturally fall") instead of clinical "cognitive cost" phrasing.

**Homepage section reorder (`app/page.tsx`):**
- New middle order: Daily Benefits (5) → Credentials (6) → Timeline (7) → App USP (8) → Testimonials (9) → Case Studies (10) → FAQ (11). The ingredient argument now precedes the trust seal which precedes the timeline; the App USP is no longer last; deep proof (Case Studies) sits below the persuasion arc for the convinced sceptic.
- Background alternation maintained throughout.

**Credentials section restructured (`WhyConkaWorks*.tsx`):**
- Spec strip removed (the 280+ / 2 / 100% counters) on both desktop and mobile.
- Desktop: tiles now compact — logo, category, heading, and tags always visible; body text collapsed behind a `[+] Details` / `[−] Less` toggle per tile.
- Mobile: rewritten from accordion cards to a 4-column logo strip (Informed Sport, Durham, Exeter, Made in Britain) under the eyebrow/heading/subline. Heading + subline carry the credibility narrative; logos do the proof.
- Durham and Exeter logos zoomed `scale-125` inside their containers on both layouts to compensate for source whitespace.

---

### 2026-05-07 -- /app-insights page: readability upgrade, filter, dosing guide, homepage integration

Major upgrade to the `/app-insights` page making it readable for a non-technical audience, plus integration back into the homepage value story.

**Copy and chart readability (`app/lib/appInsightsData.ts`):**
- All four reports rewritten for plain English: hooks, stat card topics/contexts, interpretations, and Conka sub-section copy. Technical phrases ("score deviation from personal mean", "Conka-tagged subset", "DIP GAP") replaced with layperson language.
- `insightNote` field added to each chart — renders as a plain-English "key finding" title above the chart plot before the reader looks at the data.
- Bar chart data fixes: `meta: "noise"` on the 1-5 drinks bar changed to `"no clear effect"`.

**Chart improvements:**
- `DataBarChart`: `domain: ["auto", 0]` so negative bars clearly grow downward from zero; bars now solid white (`rgba(255,255,255,0.9)`) with a dim fill for noise-level values; `"YOUR TYPICAL DAY"` label on the zero reference line.
- `DataLineChart`: `"Without Conka"` / `"With Conka"` legend labels; zero line labelled; axis ticks and tooltip text corrected to white (Recharts `itemStyle` required for tooltip row colour, `contentStyle` alone does not cascade).
- `DataReportSection`: `insightNote` rendered as a bordered "// Key finding" block above the chart slot.

**Dosing guide on time-of-day chart (`app/lib/appInsightsTypes.ts`, `DataLineChart.tsx`):**
- `DosingBand` type added with `x1`, `x2`, `label`, `window`, `description`, `fillColor`, `swatchColor`.
- Time-of-day chart ships two `ReferenceArea` fills: Flow (07–13, amber tint) and Clear (13–19, blue tint). Clear's band ends at 19:00 — not 22:00 — accurately representing an afternoon shot.
- Explicit key card rendered below the chart showing product name, time window, and dosing instruction for each shot. Fixed-height scoping: `h-[280px]` now wraps only the `ResponsiveContainer`, so the key card sits in normal flow rather than overflowing into the stat cards.

**Question-based filter (`app/components/insights/InsightFilteredSections.tsx`):**
- New `InsightFilteredSections` client component replaces the four static section imports on the page. Renders a filter bar with four conversational question buttons above the reports.
- Selecting a filter unmounts the other three sections (not just hides them, so charts do not render offscreen). Selecting again or clicking Clear resets to show all.
- Mobile: short labels (Time of day / Fatigue / Stress / Alcohol) in a 4-col grid. Desktop: full question text wraps inside equal-width columns.
- Clear button: full-width, white border + text + X icon, only visible when a filter is active.
- Each section has an `id` anchor (`#time-of-day`, `#mental-fatigue`, `#stress`, `#alcohol`) with `scroll-mt-24` for nav clearance.

**App download CTA (`app/app-insights/page.tsx`):**
- `AppDownloadSection` added above the methodology footnote, consistent with `/app` page.

**Nav integration (`app/components/navigation/ShopMegaMenu.tsx`):**
- "App Insights" added to the Learn More sidebar in the desktop mega menu.

**Homepage integration (`app/components/landing/LandingValueComparison.tsx`):**
- "See the full data ↗" link added to the Fig. 01 card footer, linking to `/app-insights#time-of-day`.
- Source attribution shown: 7,593 tests, 712 users, 30 months.
- Performance: `next/link` is part of the Next.js core bundle (no extra bytes); new elements use `transition-colors` only (Rule 1 compliant); `/start` consumption unaffected (`ssr: false` dynamic import in `CROBelowFold.tsx`).

**LandingProductShowcase refactor (`app/components/landing/LandingProductShowcase.tsx`):**
- Replaced `LabWhatsInsideMini` with the same clickable 2-col card grid used in `CROFormulaSplit`. Cards open `IngredientsPanel` on click. Analytics tracked via `showcase:ingredients_viewed`.

---

### 2026-05-07 -- /app-insights page: full data report page with charts, stat cards, ingredient evidence

Built the `/app-insights` page presenting four CONKA app data reports (Time of Day, Mental Fatigue, Stress, Alcohol) covering 712 users, 7,593 tests, and 30 months of data.

**New pages and components:**
- `app/app-insights/page.tsx` + `app/app-insights/layout.tsx` -- dark clinical page matching /app aesthetic, SEO metadata
- `app/app-insights/sections/` -- four thin section wrappers (TimeOfDay, MentalFatigue, Stress, Alcohol)
- `app/components/insights/DataReportSection.tsx` -- shared wrapper: eyebrow + H2 + subline + chart slot + stat cards + interpretation + optional Conka sub-section + optional ingredient bridge + methodology footnote
- `app/components/insights/DataLineChart.tsx` -- Recharts `LineChart` wrapper, two lines (no-Conka vs Conka), dark-styled tooltip
- `app/components/insights/DataBarChart.tsx` -- Recharts `BarChart` wrapper, value-keyed bar colours, zero reference line
- `app/components/insights/InsightStatCard.tsx` -- stat card: counter + topic + large value + context + caveat
- `app/components/insights/IngredientBridge.tsx` -- ingredient evidence block with PMID links to PubMed
- `app/components/app/AppInsightsCallout.tsx` -- curiosity callout on /app linking to /app-insights

**New data layer:**
- `app/lib/appInsightsTypes.ts` -- TypeScript types for all report data shapes
- `app/lib/appInsightsData.ts` -- four typed report objects with all chart data, stat cards, interpretations, Conka sub-sections (where data supports it), ingredient bridges, and methodology notes

**Compliance:** All copy reviewed against EFSA / UK food supplement rules. Ingredient bridge findings use the "In one study, participants taking [X] showed..." observational pattern with `¶` anchors. Conka sub-sections describe the dataset, not product effects. No health claims. Stress section ships without a Conka observation (n=3, below defensible threshold).

**Updated:**
- `/app` page: replaced `AppDataInsights` section with `AppInsightsCallout`; callout moved above `AppWidgetGrid`
- Desktop nav: removed App Insights link (accessible via /app callout and footer)
- Mobile nav: added App Insights to "Learn more" group
- Footer: added App Insights to Discover column
- `AppWidgetGrid`, `AppFeaturePanel`, `AppDownloadSection`: raised all text opacity values for readability on dark surfaces

---

### 2026-05-07 -- /start performance: deferred SSR for below-fold sections, autoplay carousel removed, Klaviyo fonts identified

Production Lighthouse on /start dropped from 80 (May baseline) to 40 on mobile -- LCP 8.5s, TBT 1,200ms. Investigation traced three root causes that the original `PERFORMANCE_OPTIMISATION.md` did not catch.

**1. App Router `dynamic()` was still SSR'ing all sections (`app/start/page.tsx`).** The doc implied dynamic imports cut SSR weight, but in App Router `dynamic()` only defers the *client bundle download* -- the component is still server-rendered into initial HTML by default. /start was shipping 1,217 DOM elements on initial paint, all of which had to hydrate before LCP could land. LCP element render delay was 2,100ms while the hero image was already in memory by 330ms. Fixed by passing `ssr: false` to all 7 below-fold dynamic imports. Safe because /start has `robots: { index: false }`. Pre-hydration DOM dropped from 1,217 to ~50.

**2. Autoplay carousel was re-rendering during the Lighthouse window (`CROTestimonials`).** `setInterval` ticking every 3.5s with React state updates triggered a render + reconcile + paint on every tick during the 10s mobile audit window. Removed the autoplay entirely. Manual nav (prev/next buttons, dot tabs, swipe) preserved. Wrap-around still works.

**3. Klaviyo Brand Library was auto-loading Google Fonts site-wide.** Even with `layout.tsx` having no `next/font/google` imports, `fonts.googleapis.com/css2` was still in the critical chain at 2,520ms. Traced to `klaviyo.js` injecting a stylesheet that pulls every font from the Klaviyo Brand Library -- Poppins (7 variants), Albert Sans, Cormorant Garamond, IBM Plex Sans were all Google Fonts. Fix is dashboard-only: removed Google Fonts from Klaviyo Brand Library, swapped to Helvetica / Klaviyo-hosted in active signup forms.

**New components / patterns:**
- `app/components/VisibilityGate.tsx` -- `IntersectionObserver`-based wrapper that defers mounting children until the user scrolls within 200px of the section. Wrapped around `CROTestimonials` on /start.
- `ssr: false` + `loading` skeleton pattern for noindex landing pages, documented in Rule 4.

**Doc updates (`docs/development/PERFORMANCE_OPTIMISATION.md`):**
- Rule 1: new "JS-driven animation timers" subsection
- Rule 4: App Router gotcha, `ssr: false` rule, `<VisibilityGate>` pattern, DOM size budget
- Rule 5: corrected `layout.tsx` font list (Poppins/Caveat/Syne/DM_Sans/IBM Plex Mono all gone), new "Third-party scripts that auto-load Google Fonts" subsection
- Benchmarks table extended with May 7 rows (regression + Track 1 + Track 2 pending re-measurement)
- Pre-commit checklist gains 5 items

**Pending:** re-measure Lighthouse against prod /start after deploy and after Klaviyo signup forms have been updated. Targets recorded as TBD in the benchmark table.

---

### 2026-05-06 -- CSS system consolidated: premium-base.css deleted, component graveyard cleared

**`premium-base.css` fully deprecated and deleted.** Migration completed in three buckets:

- **Bucket 1 -- orphaned components deleted:** Entire `app/components/shop/` directory (ShopHero, FormulasShowcase, FormulaPanel and all variants -- TODO #7 complete). `protocol/ProtocolBenefits`, `ProtocolSectionPlaceholder`. `protocol/why/CycleBreak`, `CycleRecognition`, `CycleTransformation`, `CycleTrap` (CycleBreakDesktop + Mobile retained, still have consumers). 10 product components confirmed zero-consumer and deleted: `ClinicalStudyCard`, `ProductTabs`, `ProtocolBenefitsMobile`, `FormulaBenefitsMobile`, `FormulaIngredientsWithToggle`, `HowItWorks`, `PackSelectorPremium`, `PurchaseToggle`.

- **Bucket 2 -- active files migrated:** 14 files with `premium-*` class usages updated to `brand-*` equivalents. Payment pages (`cancel`, `success`, `error`): `premium-section-luxury` → `brand-section`, `premium-bg-bone` → `brand-bg-white`, `premium-track` → `brand-track`, `premium-section-heading` → `brand-h2`, `premium-body` → `brand-body`. Science page: same swaps, dead modifier classes removed. Landing components (5): `--letter-spacing-premium-title` → `--tracking-tight`. Navigation (`FormulaCardCompact`, `ProtocolCard`): CSS vars swapped to `--brand-radius-*` and `--brand-stroke`. `NavigationMobile` + `ProductImageSlideshow`: `--premium-gutter-mobile-tight` hardcoded to `0.25rem`. `ContactSupportLink`: `premium-body-sm` → `brand-caption`, radius and stroke vars updated.

- **Bucket 3 -- CSS layer deleted:** Layer 4 (Soft-Tech Luxury legacy block, ~330 lines) removed from `brand-base.css`. `@import "./premium-base.css"` removed from `globals.css`. `premium-base.css` stub deleted.

**Result:** Zero `premium-*` references anywhere in the codebase. `globals.css` now imports only `tailwindcss` and `brand-base.css`. `brand-base.css` is the single CSS source.

---

### 2026-05-06 -- Font system completed: Neue Haas + JetBrains Mono only, all Google fonts removed

Completed the font system unification. The site now ships exactly two fonts, both self-hosted local fonts with no external network dependency.

**Neue Haas Grotesk is now the true primary across all text.** `--font-primary` and `font-sans` previously pointed to Poppins (a legacy Google Font). Remapped both to `var(--font-brand-primary)` (Neue Haas). Poppins removed from `layout.tsx` -- import, declaration, and body className variable all deleted. All typography on all pages (body default, `premium-*` classes, `font-primary` utility, Tailwind `font-sans` utility) now resolves to Neue Haas.

**IBM Plex Mono deleted (Phases 3+4).** `.premium-data` in `premium-base.css` migrated from `var(--font-clinical)` to `var(--font-brand-data)`. Four chart components (`RadarChart`, `SynergyChart`, `BenefitDetail`, `StudyBarChart`) had inline `fontFamily: "var(--font-ibm-plex-mono)"` -- all updated to `var(--font-jetbrains-mono)`. `--font-clinical` and `.font-clinical` removed from `globals.css`. `.story-counter` updated. `IBM_Plex_Mono` import and `ibmPlexMono` declaration removed from `layout.tsx`. Zero IBM Plex Mono references remain.

**Caveat (handwriting font) removed entirely.** Was only referenced via `font-commentary` class on legacy pages (quiz, win, professionals, protocol). Not in the brand spec (spec defines Neue Haas + JetBrains Mono only). All 28 `font-commentary` occurrences across 13 files replaced with `font-mono`. `.font-commentary` class and `--font-commentary` / `--font-handwriting` variables removed from CSS. Caveat import and declaration removed from `layout.tsx`. This eliminates the `fonts.googleapis.com` critical CSS chain (was showing at 2,023ms in production Lighthouse, blocking LCP).

**Docs updated (Phase 5).** `PERFORMANCE_OPTIMISATION.md` updated: removed IBM Plex Mono from the active font list, documented both removal events. `MOBILE_OPTIMIZATION.md`: `font-clinical` reference updated to `font-mono`.

**Result:** Zero Google Font requests on any page. Both fonts are local. No external font network dependency in the critical render path.

---

### 2026-05-06 -- Mono font unification (Phase 1+2): font-clinical → font-mono on JetBrains Mono; /shop deleted

Closed the practice/preach gap on monospace usage. Brand spec said `JetBrains Mono` (local) for all data/eyebrow/mono text, but Tailwind's `font-mono` utility was mapped to IBM Plex Mono via `--font-clinical`, so the 50+ `font-mono` usages on home, CRO, landing, and PDP components were silently rendering in the wrong (Google) font. Two visually similar mono fonts were shipping side-by-side on every page.

**Phase 1 -- One-line CSS remap (`globals.css`):** `@theme inline { --font-mono: var(--font-jetbrains-mono); }` (was `var(--font-clinical)`). Every existing `font-mono` Tailwind utility now resolves to JetBrains Mono. Zero JSX edits required for this phase.

**Phase 2 -- Bulk migration of `.font-clinical` → `font-mono`:** 260 occurrences across 52 .tsx files (B2B portal, win, protocol, quiz, product, shop, barrys, navigation, banner, plus several home/landing components). Mechanical find/replace via sed. After migration: zero `font-clinical` references in any .tsx file, all mono text now resolves to JetBrains Mono via the Tailwind utility.

**`/shop` deleted:** `/shop/page.tsx` removed. `/shop` and `/shop/:path*` redirect to `/conka-both` via `next.config.ts`. The shop component tree (`ShopHero`, `FormulasShowcase`, `FormulaPanel`, etc.) was only consumed by the deleted page -- now orphaned. Logged as deferred cleanup task #7 in `docs/TODO.md` (one-release safety-net pattern, matching protocol cleanup).

**Phases 3-6 deferred:** `.premium-data` migration, deleting IBM Plex Mono from `layout.tsx`, removing `--font-clinical` / `--font-ibm-plex-mono` variables from CSS, doc updates, and Tailwind theme simplification. Plan documented in conversation; tackle in a follow-up.

**Why:** Two near-identical monospace fonts loaded on every page is a performance and consistency cost with no design benefit. The `--font-mono` indirection was a leftover from the brand-base migration that never got finished.

---

### 2026-05-06 -- Performance: browserslist, font preload, animation fix, performance doc

Production Lighthouse score was 76 vs. a previous baseline of 80. Three root causes identified and fixed.

**1. Legacy JS polyfills eliminated (`package.json`):** No `browserslist` config existed, so Next.js defaulted to targeting browsers from ~2018 (Chrome 64, Safari 12). This caused 13.8 KiB of polyfills for `Array.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `trimStart`, `trimEnd` -- all Baseline features natively supported in 2024 browsers. Fixed by adding a modern `browserslist` to `package.json` targeting the last 2 versions of Chrome, Firefox, Safari, and Edge.

**2. Google Fonts critical CSS chain fixed (`app/layout.tsx`):** Production Lighthouse showed `fonts.googleapis.com/css2?family=` at 1,999ms in the critical dependency chain, blocking the hero image (LCP). Caused by `next/font/google` including font CSS in the preload chain for all 5 Google fonts on every page -- including pages like `/start` that never use those fonts. Fixed by adding `preload: false` + `display: "swap"` to all five: Poppins, Caveat, IBM Plex Mono, Syne, DM_Sans. Local fonts (Neue Haas, JetBrains Mono) unaffected.

**3. Non-composited animation fixed (`CROTestimonials`):** Dot indicators used `transition-all` with `w-1.5` / `w-4` toggling, animating `width` (non-composited, layout-triggering). Fixed by fixing all dots at `w-4 h-1.5` and using `transition-colors duration-300` only.

**4. Removed unused Google fonts (`layout.tsx`, `premium-base.css`):** Syne and DM_Sans were imported on every page but only referenced by `.premium-pdp .premium-display-hero` and `.premium-pdp .premium-body-hero` CSS rules — `.premium-pdp` had zero JSX consumers (scope was deleted during brand-base migration). Removed both `next/font/google` imports, the CSS rules, and the `${syne.variable}` / `${dmSans.variable}` body className entries.

**5. `docs/development/PERFORMANCE_OPTIMISATION.md` created:** Forward-looking performance standard consolidating all Lighthouse learnings. Added to `CLAUDE.md` docs index.

**Why the regression happened:** `browserslist` and `preload: false` are configuration-level concerns invisible to the component author. Without a standing document, each new session starts from zero on these rules.

---

### 2026-05-06 -- /start CRO landing page rebuild

Rebuilt `/start` as a fully isolated CRO surface. All components live in `app/components/cro/` so the page can be iterated on independently without risk to shared components used across PDPs, home, and protocol pages.

**Isolated CRO component tree (`app/components/cro/`):**
- `CROHero` -- no eyebrow, no FigurePlate. Mobile-first layout: stat → H1 → subline → plain contained image → CTA → TrustBand (avatar stack + stars + Informed Sport). Subline updated to "Transform your focus, memory, and mental endurance..." (Seed-style benefit framing). CTA copy: "Get Both from £X/shot".
- `CROFormulaSplit` -- two product cards (Flow / Clear) as full-card buttons opening `IngredientsPanel`. Bottom affordance row "See what's inside ↗". No hand-rolled CTA inside each card.
- `CROTestimonials` -- infinite scroll carousel with a compact star aggregate badge (4.7/5 · 500+ verified reviews) directly under the heading.
- `CROGuarantee` -- Sutherland-inspired copy reframe ("Most brands offer 30 days. We offer 100. Not generosity. Confidence."). CTA moved above the bullet list so it sits at peak persuasion. Bullets: Free UK shipping, Full refund if score doesn't improve, No return required, No forms no questions no conditions.
- `CROFAQ` -- data table widget removed (was adding scroll length before answers). Image moved below the accordion and flush with the section bottom (FAQ section `paddingBottom: 0`). `FigurePlate` retained on the image.
- `CROFinalCTA` -- left-aligned, `brand-h1` for closing weight, `brand-eyebrow` with `CONKA-03`.

**`app/start/page.tsx` -- rebuilt section order:**
All sections dynamic-imported (zero initial bundle impact). Section sequence: Hero → Formula Split → Testimonials → Value Comparison → Guarantee → FAQ → Final CTA. Also incorporates `LandingValueComparison` (2pm crash chart + price comparison) dynamic-imported from the shared landing component tree.

**Clinical Aesthetic alignment pass (`CLINICAL_AESTHETIC.md`):**
- All interior section headings normalised to `brand-h2` (was a mix of `brand-h1` and `brand-h2`). `CROFinalCTA` kept at `brand-h1` intentionally for closing weight.
- Eyebrows using `.brand-eyebrow` class everywhere (no hand-rolled mono strings).
- Topic codes corrected: `ING-01` formula split, `PROOF-02` guarantee, `PROOF-03` testimonials, `FAQ-01` FAQ, `CONKA-03` final CTA.
- `CROFinalCTA` eyebrow `mb-3` added. `CROFAQ` heading `mb-2` + `letterSpacing` added.
- Figure plate in `CROFAQ` renumbered to `n={1}` (only plate on the page).

**Why:** `/start` was a 10-section page pulling from shared components that also serve the home page and PDPs. A single conversion-focused change risked regressions across the site. The isolated `cro/` tree lets us iterate aggressively on the acquisition funnel without that constraint.

### 2026-05-06 -- /conka-both PDP, ProductHero extended to "03", image lightbox on all PDPs, sticky footer fix

**`/conka-both` PDP (`app/conka-both/page.tsx`):**
- Replaced `ProtocolHero`/`ProtocolHeroMobile` with `ProductHero`/`ProductHeroMobile` using `productHeroId="03"`.
- Removed all legacy `selectedTier`, `purchaseType` state -- page now uses the same cadence model as Flow and Clarity.

**Type system (`app/lib/productTypes.ts`, `cadenceData.ts`, `heroImageConfig.ts`, `productHeroHelpers.ts`):**
- Added `BothProductId = "03"` and `ProductHeroId = FormulaId | BothProductId`.
- `BOTH_HERO_CONTENT` added to `cadenceData.ts` (name, tagline, headline, soldCount).
- `getCadencePricingByProductHeroId` / `getCadenceVariantByProductHeroId` route "03" to the existing balance funnel data.
- `getProductHeroImages` / `getProductHeroImagesMobile` in `heroImageConfig.ts` unified for all three products.
- `productHeroHelpers.ts` (new) -- single source of truth for `getHeroContent` and `getHeroProductType`, eliminating duplication between desktop and mobile hero components.

**Image lightbox (`app/components/product/ImageLightbox.tsx`, `HeroImageStack.tsx`, `ProductImageSlideshow.tsx`):**
- New `ImageLightbox` component renders via `createPortal` to `document.body`, escaping all ancestor stacking contexts.
- Clicking the main hero image on any PDP opens the lightbox. Thumbnails in the slideshow continue to navigate the inline carousel as before.
- Supports keyboard nav (Escape, ArrowLeft, ArrowRight), body scroll lock, backdrop-click to close, and a thumbnail strip.
- `HeroImageStack` (desktop) and `ProductImageSlideshow` (mobile) both wired up.

**Sticky footer (`StickyPurchaseFooter.tsx`, `StickyPurchaseFooterMobile.tsx`):**
- Added `productHeroId?: ProductHeroId` prop. When `"03"` is passed, footer shows "CONKA Flow + Clear" with the correct product thumbnail instead of the legacy "Balance Protocol" fallback.
- `/conka-both` updated to pass `productHeroId="03"` on both footer components.

**Branch:** `landing-page-review-refactor`

---

### 2026-05-06 -- ProductCard simplified to browse-only; Aaron H testimonial added

**ProductCard quick-buy removal (`app/components/home/ProductCard.tsx`):**
- Removed subscribe/one-time toggle, pricing display, billing note, and Add to Cart button from all product grid cards.
- Replaced with a single "Shop Now" link (same navy chamfer style) pointing to the product PDP.
- Removed spec row ("Liquid · 1 shot (30ml) daily · 4-pack") from all cards.
- Cleaned up all now-dead code: `id` field from `ProductCardData` interface and data objects, `BALANCE_PROTOCOL_ID` constant, `FormulaId`/`ProtocolId` type imports, cart/pricing/variant imports, `'use client'` directive. Component is now a Server Component.
- `ProductGridMobile` and `ProductGridTablet` unchanged -- they inherit the simplified card automatically.
- **Why:** Aligns the product grid with the new simplified offering direction (Flow / Clear / Both). Quick-buy on a browse grid adds complexity without conversion value; the PDP is the right place for purchase decisions.

**Aaron H testimonial added (`app/lib/customerTestimonials.ts`):**
- New entry: Aaron H., 5 stars, "Performance without the burnout", `productLabel: "Flow + Clear"`, photo `/testimonials/dtc/AaronH.jpg`.
- Copy edited to remove em dashes per site style rules.
- Appears automatically in `LandingTestimonials` carousel as the 8th card.

**Branch:** `landing-page-review-refactor`

---

## April 2026

### 2026-04-29 -- Case studies: three new Revolut athlete entries (Doris Regazi live, two pending assets)

Added three new business professional entries to `app/lib/caseStudiesData.ts` from the March 2026 Revolut cohort. All three used the Balance Protocol (`productVersion: "both"`, `protocolUsed: "Balance Protocol"`, protocol ID 4).

**New entries:**
- **Doris Regazi** (`doris-regazi`) — Account Executive, Revolut. +30.78% total score (61.33 → 80.21), +22.62% accuracy, +8.23% speed. 17 tests (3 baseline + 14 post). Tier 3.
- **Fred Windsor-Lewis** (`fred-windsor-lewis`) — Account Executive, Revolut. +7.64% total score (72.33 → 77.86), +2.89% accuracy, +4.17% speed. 10 tests (3 baseline + 7 post). Tier 3. Commented out pending photo asset.
- **Alessandro Ventura** (`alessandro-ventura`) — Account Executive, Revolut. +2.33% total score (86.0 → 88.0), +1.14% accuracy, +1.57% speed. 8 tests (3 baseline + 5 post). Tier 3. Commented out pending photo asset.

**Photo wiring (Doris only):**
- `DorisRegazi.jpg` added to `/public/caseStudies/`.
- `"doris-regazi"` entry added to `CASE_STUDY_PHOTO_PATHS`.
- `photo` and `focalPoint: { x: 50, y: 30 }` set on her athlete object (face centred in upper third of the square shot).
- Fred and Alessandro wrapped in a `/* ... */` block comment with an "Uncomment when photo assets are available" note. Uncomment and add their `CASE_STUDY_PHOTO_PATHS` entries once images land in `/public/caseStudies/`.

**Why:** Adds the first non-athlete business cohort case studies from a named employer (Revolut), strengthening the professional-user proof story on the case studies page. Doris's result (+30.78%) is among the strongest in the dataset for a business professional and gives the page a high-impact new card immediately.

---

### 2026-04-28 -- PDP Phase B+C: ingredient images on benefit pillars, ProductWhatYouGet section, scroll-driven WhatToExpect timeline

Three feature additions to `/conka-flow` and `/conka-clarity` as part of the ongoing PDP upgrade pass.

**`FormulaBenefitsPillars` -- ingredient images + PMID references:**
- Each expanded pillar now shows a 3-up ingredient grid below the "felt translation" copy. Images are pulled from `/ingredients/{flow,clear}/` and rendered at `aspect-square` with `object-cover`. Grid uses `bg-[var(--brand-tint)]` tiles with an ingredient name label underneath.
- A `sourceRef` field added to each curated stat surfaces the peer-reviewed citation (PMID or regulatory reference) directly below the stat label in the expanded state. Flow pillars cite PMID 12888775, EFSA Reg. No 432/2012, and PMID 32021735. Clarity pillars cite PMID 29246725, PMID 18937015, and PMID 22628390.
- `formulaStatsData.ts` type extended with `ingredients?: { name: string; imageSrc: string }[]` and `sourceRef?: string`.

**`ProductWhatYouGet` (new component):**
- New section on both PDPs between Ingredients and What to Expect: `id="what-you-get"`, `brand-bg-tint`.
- Editorial split layout: `FigurePlate`-wrapped lifestyle image (formula box open) on the left/top, content card on the right/below.
- Content card: "In every box" em-dash bullet list (28 shots, Informed Sport certified, recyclable packaging) + "How it ships" delivery rows with solid navy savings badges (`bg-[#1B2757]`) and `href="#hero"` links scrolling the user back to the cadence widget.
- Heading: "From the lab to your door." Box images: Flow uses `FlowBoxOpen.jpg`, Clarity uses `ClearBoxOpen.jpg`.
- Exported from `app/components/product/index.ts`.

**`WhatToExpect` -- scroll-driven stage activation (desktop + mobile):**
- Ported the LabTimeline scroll pattern to both `WhatToExpectDesktop.tsx` and `WhatToExpectMobile.tsx`.
- IntersectionObserver gates the scroll listener (300px root margin). rAF-throttled scroll compute reads dot positions relative to the list container. As the viewport centre passes each checkpoint, that stage becomes "active".
- Active and passed stages: full opacity, brand accent dot, accent pill. Future stages: `opacity-50`, dimmed dot (`bg-black/20`), dimmed pill (`bg-black/8 text-black/50`).
- Vertical rail: absolute `w-px` base (full height, `bg-black/10`) and fill (`bg-[var(--brand-accent)]`) driven by `railFillPx` state. Both positioned at `left-[5px]` (half of 10px dot width).
- Formula-change reset: on `selectedFormula` change, a `requestAnimationFrame` callback resets all rail state to zero before the next compute fires.
- `motion-safe:transition-opacity` and `motion-safe:transition-colors` on stage rows, dots, and subheading pills for reduced-motion compliance.
- Vibe asset grid (NeuronsConnection, water, sky images) removed. Each formula now shows a single lifestyle image wrapped in `FigurePlate`. Flow uses `FlowShadow.jpg`, Clarity uses `ClearLaugh.jpg`.

**Why:** Ingredient images give users visual confirmation of what they are taking at the moment they are most curious (post-claim read). The "What You Get" section removes uncertainty about what arrives and how, reducing pre-purchase friction. The scroll-driven timeline makes the progression feel earned rather than decorative -- matching the premium feel of LabTimeline already present on the landing page.

**Branch:** `PDP-what-you-get-and-badge-section`

---

### 2026-04-27 -- PDP upgrade pass: Magic Mind pillar pattern, hero copy rewrite, section reorder, Clarity alignment

Full upgrade of `/conka-flow` and `/conka-clarity` product pages benchmarked against Magic Mind, Seed, and Suri. Work split across three areas: (1) hero copy tightened to the Magic Mind 3-part shape (tagline + promise + mechanism + differentiator), (2) page sections reordered to a conversion-optimised 12-step structure, and (3) a new `FormulaBenefitsPillars` component replaces four legacy benefit components with an expand-on-tap accordion. Changes to `ProductHero`, `ProductHeroMobile`, `StickyPurchaseFooterMobile`, and `FormulaIngredients` applied at the component level so both pages benefit automatically.

**Hero copy:**
- `formulaContent["01"]` (Flow) tagline rewritten from a product-feature fragment to a 4-word brand promise: *Sharper focus. Calmer energy.* Headline rewritten to the Magic Mind 3-sentence shape: promise -> mechanism -> differentiator, grounding caffeine-free and 6-ingredient framing explicitly.
- `formulaContent["02"]` (Clarity) tagline: *Sharper recall. Faster thinking.* Headline: *Cut through brain fog on demand. 10 clinically-dosed actives -- including Alpha GPC, Ginkgo, and Vitamin C -- prime cerebral blood flow and key neurotransmitters. One shot, afternoon, whenever clarity matters.*
- Meta pill removed from `ProductHero` and `ProductHeroMobile` (was rendered above the H1, added noise without informational value). Both desktop and mobile components updated.
- Tagline slot added directly below the H1 with reduced gap (`mt-0 mb-3 lg:mb-4`) and increased size (`text-lg lg:text-xl`), matching the visual rhythm Magic Mind uses between product name and sub-description.

**Hero widget polish (savings + per-shot copy):**
- Savings meta in the CTA button now shows absolute pounds (`Save £X`) rather than a percentage, matching the cadence widget's existing price format.
- "1 shot per day" line removed from the non-expanded cadence card (was duplicated with the expanded panel). Expanded panel retains "Observed: peer-reviewed" sub-copy.
- Thumbnail strip in `ProductImageSlideshow` hidden on mobile via `hideThumbnails` prop -- reduces layout height and keeps the hero tighter on small viewports.

**Section reorder (/conka-flow):**
- Previous structure (10 sections, legacy benefit components) replaced with a 12-section arrangement: Hero > Pillars > Ingredients > What to Expect > Anchor Athlete > Comparison > Guarantee > FAQ > Testimonials > Explore.
- `AthleteCredibilityCarousel`, `LandingValueComparison` (with `/protocol/3` upsell CTA), and `LabGuarantee` surfaced for the first time on the Flow product page.
- `LandingTestimonials` moved to the closing pre-Explore slot (previously near the top).
- `FormulaIngredients` gains `hideCTA` prop so the secondary CTA within that section no longer competes with the primary add-to-cart action.
- `FormulaBenefitsStats`, `FormulaBenefits`, `FormulaBenefitsMobile`, `HowItWorks`, `FormulaCaseStudies`, and `FormulaCaseStudiesMobile` removed from both pages; TODO headers added to each component file to flag decommission.
- JSX comment placeholders added for `FormulaQualityBadges` and `ProductWhatYouGet` (Phase 3, not yet built).

**`FormulaBenefitsPillars` (new component):**
- Client Component at `app/components/product/FormulaBenefitsPillars.tsx`, exported from the product barrel.
- Magic Mind's 3-pillar pattern: each pillar shows a counter + name + one-line benefit at rest; tapping expands to reveal the peer-reviewed stat, its anchor study label, and a "felt translation" written in plain language.
- Accordion driven by `useState` + `aria-expanded` / `aria-controls`. Only one pillar open at a time.
- `CURATED_STATS` in `formulaStatsData.ts` extended with optional `pillarName`, `oneLine`, and `feltTranslation` fields. Flow pillars ordered memory -> fatigue -> sleep. Clarity pillars: cerebral blood flow -> memory -> fatigue resistance.
- Stat anchors: Flow uses +40% memory¶, +32% fatigue resistance¶, +19% sleep quality¶; Clarity uses +57% cerebral blood flow¶, +63% memory¶, +30% fatigue resistance¶.
- Accepted pillar copy option A for Flow (performance framing), and options A/B/A for Clarity (recall / sustained output / blood flow).

**Sticky footer redesign (mobile):**
- `StickyPurchaseFooterMobile` cadence-mode branch rebuilt: full `ConkaCTAButton` instead of a bare price strip, trust strip above ("28-shot box · Informed Sport certified · Cancel anytime"), savings meta passed as the button's `meta` prop (shows absolute £ savings), `backdrop-blur-md` container, `cadenceCompareAtPrice` prop plumbing added.
- Desktop `StickyPurchaseFooter` unchanged (already shows pricing + cadence label clearly).

**`LandingValueComparison`:**
- `ctaHref` and `ctaLabel` optional props added so Flow/Clarity can link to `/protocol/3` ("Try the full system") without forking the component. Default behaviour (no props) unchanged for `/start`.

**`ConkaCTAButton`:**
- Center span gains `flex-1 min-w-0` so the right-arrow SVG anchors at the trailing edge of the button regardless of label length. Previously the arrow floated midway when labels were short.

**/conka-clarity alignment:**
- Page fully rewritten to mirror `/conka-flow/page.tsx` with `formulaId="02"` and `exclude={["clear"]}`. Section order, component set, and comment structure are now identical.
- `getSiteTestimonialsClarity` filter dropped; `LandingTestimonials` now renders the full testimonial set on Clarity, matching Flow.
- Meta Pixel `content_name` kept as `"CONKA Clarity"` (not "CONKA Clear") to preserve production tracking history.
- `cadenceCompareAtPrice` plumbed through to `StickyPurchaseFooterMobile` for savings display.

**/protocol/[id] mobile scroll fix:**
- `brand-page` CSS class added to the mobile branch wrapper of `/protocol/[id]/page.tsx` only. Prevents horizontal scroll caused by `FormulaCaseStudiesMobile`'s 75vw card carousel overflowing the viewport. Desktop branch excluded because `overflow-x: hidden` on `.brand-page` would break `position: sticky` on the protocol hero buying widget.

**Why:** The previous product pages passed a functional review but failed a "quick-to-consume" test on mobile: flat section order buried proof points below the fold, legacy benefit components required reading across multiple stat blocks before a single claim landed, and the hero copy described product features rather than making a promise. Magic Mind outperforms on all three -- their pillar pattern, 4-word tagline, and 3-sentence hero description each communicate one idea instantly. The reorder follows the attention arc (promise > proof > trust > decision) rather than the former spec-sheet structure. Aligning Clarity to Flow also makes both pages maintainable as a pair rather than drifting independently.

**Branch:** `flow-pdp-hero-copy`
**Commits:** `5a2fdfd`, `a0936b4`, `f4fd1eb`, `6f9fe3d`, `2118fd6`, `0fc2c51`, `2ba7d51`, `b58ca88`, `2a044fe`, `3eb695c`, `06f3148`

---

### 2026-04-27 -- Seed/Suri-style image stack on product and protocol hero, mobile layout alignment, shots-per-day label

Upgraded the desktop product and protocol hero image layout to match the editorial pattern used by Seed and Suri: a full-width portrait box shot (cadence-driven) above a 2x2 square grid of lifestyle images. The right-hand purchase widget is now sticky while the image column scrolls, which is the opposite of the previous layout. Mobile heroes were realigned so the image comes first, then the title and stars, matching the existing `ProductHeroMobile` structure throughout.

**Image stack (desktop):**
- New `HeroImageStack` server component: slot 0 renders at natural aspect ratio (no crop), slots 1-4 form a `grid-cols-2` square grid with `object-cover`. No `"use client"` directive needed.
- New `app/lib/heroImageConfig.ts` data layer: all image-path selection (formula/protocol + cadence) centralised here, out of components.
- Flow: box shot + FlowClose, FlowWork, FlowBoxOpen, FlowNutrition. Clear: box shot + ClearPassed, ClearHoldJeans, ClearBoxOpen, ClearNutrition. Balance: box shot + BothHold, FlowBoxOpen, BothJeans, ClearBoxOpen.
- Cadence-driven slot 0: quarterly-sub uses the quarterly box asset, all others use the standard box asset.
- `ProductImageSlideshow` left untouched -- remains the image component for the funnel.

**Mobile:**
- `ProtocolHeroMobile` reordered to image-first (was header-first), matching `ProductHeroMobile`. Stars reduced from 18px to 16px, title from `brand-h1` to `brand-h2`.
- Square mobile box assets added for all six Balance cadence variants (`BothBoxMobile.jpg`, `BothQuarterlyMobile.jpg`, etc.).

**Protocol page (`/protocol/[id]`):**
- Testimonial section updated to use the shared `LandingTestimonials` component (was a protocol-filtered variant).
- Section order updated: Hero > Case Studies > Timeline > Why CONKA Works > Explore > What It Does > Calendar > Testimonials > Guarantee > FAQ.

**Widget copy:**
- Per-shot price label now reads "per shot · 1 shot per day" (Flow/Clear) and "per shot · 2 shots per day" (Balance) in the expanded cadence card, on both desktop and mobile.

**Assets added:** `public/formulas/box/` (12 box shots -- 6 desktop portrait, 6 mobile square), `public/lifestyle/flow/FlowClose.jpg`, `public/lifestyle/flow/FlowWork.jpg`, `public/lifestyle/clear/ClearPassed.jpg`, `public/lifestyle/clear/ClearHoldJeans.jpg`, `public/formulas/both/BothJeans.jpg`.

**Why:** The previous hero used a funnel-style image slideshow on the product PDP, which felt lightweight compared to Seed and Suri's editorial stacked-image treatment. The image stack signals product quality and gives customers more visual context before committing. The sticky widget pattern keeps the purchase action visible as the customer browses the images. The shots-per-day label removes ambiguity on Balance, where two shots daily is a non-obvious usage pattern for new customers.

**Branch:** `seed-style-product-hero`
**Commits:** `be06658`, `ddbec57`, `5213b17`, `a6e9167`, `bf83e59`, `ab4c2be`, `c67dc0b`

### 2026-04-27 -- Product page offering aligned to funnel: cadence model, hero widget upgrade, purchase accordion

Aligned the product pages (Flow, Clear, Balance) to the offering already live on the funnel page. The core change: the old pack-size selector (4/8/12/28 shots) is replaced by a cadence selector (quarterly subscription / monthly subscription / one-time), with a fixed 28-shot box. This brings the product pages into parity with the funnel and eliminates a point of confusion for customers who arrive via ads and then navigate to the product page directly.

**Offering change (cadence model):**
- `ProductHero` and `ProductHeroMobile` now render a 3-option cadence selector (Quarterly Sub, Monthly Sub, One-Time) instead of a pack-size picker. Cadence drives pricing, badge, and feature bullets via `FUNNEL_CADENCES` -- the same data source as the funnel page.
- `ProtocolHero` and `ProtocolHeroMobile` updated identically for the Balance page (protocol 3). Non-Balance protocols are gated behind `isCadenceMode` and unchanged.
- `cadenceData.ts` adapter layer isolates product/protocol pages from `funnelData.ts` internals.

**Sticky purchase footer:**
- `StickyPurchaseFooter` (desktop): cadence mode shows a product thumbnail + cadence label + price strip alongside the CTA. Old pack-size / subscribe toggle preserved with NOTE comments flagging it for future removal once all pages have migrated.
- `StickyPurchaseFooterMobile`: cadence mode collapses to a single full-width "Add to Cart · £X.XX" CTA -- no picker on mobile since cadence selection happens in the hero widget above.

**Hero widget polish:**
- Desktop image/widget split changed to 60:40 (was roughly 44:48) for a more image-led layout on both `ProductHero` and `ProtocolHero`.
- Desktop H1 capped at `2.5rem` (down from `3.5rem` clamp max) and stars reduced from 18px to 14px -- both desktop-only via `lg:` overrides, mobile unchanged.
- `ProductImageSlideshow` keyed on `selectedCadence` so the slide index resets when cadence changes.

**Balance page:**
- H1 conditionally renders "CONKA Flow + Clear" (was "Balance Protocol") on both desktop and mobile heroes.
- Protocol subtitle updated to "Flow in the morning. Clear in the afternoon." Description rewritten to make the morning/afternoon sequencing explicit, with "CONKA Clarity" corrected to "CONKA Clear" throughout.

**Hero accordions (new -- Seed / Magic Mind pattern):**
- New `HeroAccordions` component added below `FunnelAssurance` on all four hero components.
- Three items: "Who it's for" (expand inline, 2 formula-specific bullets per product), "100-Day Risk-Free Trial" (expand inline using `GUARANTEE_DAYS`), and "Ingredients" (opens existing `IngredientsPanel` modal; Balance shows "Flow Ingredients" and "Clear Ingredients" as two separate triggers).

**Why:** Customers arriving from paid Meta ads were landing on a funnel page offering 28-shot cadence options, then navigating to the product page and seeing a pack-size selector with a different set of choices. The two surfaces described the same products with different models, creating friction and eroding trust. Aligning them removes that gap. The accordion section below the CTA matches the pattern used by Magic Mind and Seed -- two of the strongest PDPs in the functional supplement category -- and gives customers ingredient transparency and guarantee detail without leaving the purchase widget.

**Branch:** `product-page-cadence-widget`
**Commits:** `3da47f8`, `cd189b0`, `02e2125`, `0b4328f`, `d63735d`, `62fcda4`

### 2026-04-23 -- Acquisition surface pass: landing hero, value comparison, timeline, product showcase + CTA system

Multi-component tune-up across the `/start` and `/` acquisition flow. Reframed the landing hero's copy + asset, rebuilt `LandingValueComparison` around the 2pm-crash framing, replaced the protocol-style "What it does" section with a Seed-style two-product showcase, rebuilt `LabTimeline` as a scroll-driven progress rail with study-protocol bullets, reshaped the primary CTA, and removed engineering-flavoured detail from the ingredients sheet. Single working branch (`Component-Improvements`); one logical commit per surface.

**`LandingHero`:**
- New eyebrow `// A New State Of Mind` (was `// Daily Brain Performance`). Hero CTA copy `Get Started Today` -> `Try CONKA Today`.
- Aspirational subhead under the H1 with a `†` claim anchor: *"For minds that demand more. A patented nootropic shot, clinically formulated to support focus, memory, and mental endurance every day."* Mirrored on mobile and desktop.
- Mobile asset: dropped the title overlay + bottom-gradient mask; replaced with a clean image plus a short `h-10` white feather at the bottom for a soft hand-off into the page.
- Desktop asset: aspect changed `4/3` -> `3/2` (shorter, less aggressively cropped), single light border added.
- Stat strip collapsed from a separate `dense` desktop variant + 3-col mobile into one responsive 3-col layout with single light border (no more `lab-asset-frame` double-border). Centered cells, value above label, scales up on desktop (`text-2xl` values, `text-[10px]` labels).
- Hero CTA call sites pass `meta={null}` to suppress the `// ...` meta line on the primary action.

**`ConkaCTAButton`:**
- Clip-path now notches the top-left **and** bottom-right corners (was top-right only) for a "cut from a sheet" lab feel.
- Width changed from `w-full lg:w-auto lg:max-w-md` to `min-w-[14rem] max-w-md` -- the button hugs its content at every breakpoint with a sensible floor and ceiling.
- Title span gains `whitespace-nowrap`; inner column drops `flex-1 / min-w-0` so long labels stay on one line instead of wrapping and forcing the button to full width on mobile.
- Tighter mobile gap and padding (`gap-3 lg:gap-4`, `pl-3 pr-5 lg:pl-5 lg:pr-8`) so longer labels comfortably fit within the mobile content column.
- New `onClick` prop renders the button as `<button>` instead of `<a>` / `<Link>` -- needed for modal triggers like the ingredients button.
- New `compact` variant: text + light-up `↗` angle arrow, no O-icon, fills its container, same notched navy shape. Pulled from the `ShopMegaMenu` LEARN_MORE arrow pattern. For in-card / secondary placements where the default treatment would overflow.
- All `/start`-rendered components (`LandingHero`, `LandingWhatItDoes` -> `LandingProductShowcase`, `LandingDailyBenefits`, `LandingValueComparison`, `LandingTestimonials`, `LabTimeline`, `LabGuarantee`, `LabFAQ`, `LabCaseStudies`) now pass `meta={null}` so the `// ...` line is suppressed across the landing experience. `LabGuarantee` drops the now-redundant `sm:w-auto` className override.

**`LandingProductShowcase` (renamed from `LandingWhatItDoes`):**
- New eyebrow `// The Formulation` + H2 *Two shots. Built around your day.* + Seed-style grounded subhead.
- `LabDosingWindows` bar removed; `InfoCard` text tiles inside `LabWhatsInsideMini` removed (the spec rows for ONSET / DURATION / KEY ACTIVES / USE CASE). Section is now just two product cards plus CTA + trust badges.
- Each product card: tag (AM / PM + window), bigger desktop bottle, larger product name, and a one-line tagline (Flow: *Calm morning focus.* / Clear: *Afternoon reset.*).
- Ingredients button swapped from a hand-rolled `<button>` to `<ConkaCTAButton compact onClick={...}>` so the secondary action shares the CTA family while staying in-card.
- Wired into `/`, `/start`, `/protocol/[id]`. `LandingWhatItDoes.tsx` and `LabDosingWindows.tsx` deleted as orphaned.

**`IngredientsPanel`:**
- "Base & carriers" block dropped (carriers / solvents are formulation process detail, not interesting to the average reader).
- Close button now solid navy by default for clearer visibility (was a hairline outline that filled on hover).

**`LabCaseStudies`:**
- Title: *Athletes, Founders, Corporates.* -> *Athletes, Founders, Execs.*
- Stats strip flipped: number now sits **above** the label, content centred, swapped the `lab-asset-frame` double-border for a single light border to match the hero stat strip.

**`LandingValueComparison` reframe (CRO + Sutherland):**
- Eyebrow `// Get More For Less` + H2 *The 2pm crash isn't you.* (loss frame -- reframes the afternoon dip as the product's fault, not the user's). Subhead grounds the chart that follows.
- Dropped the "cost per active" math frame (engineer's metric) and the standalone savings strip (positioned CONKA as a coffee substitute).
- **Fig. 01 - Time in effect chart:** three rows (Coffee, CONKA Flow, CONKA Clear). Coffee = solid-black peak `08-11` + diagonal-hash crash `11-14`. Flow / Clear = solid navy `#1B2757` bands. Bars animate `scaleX(0 -> 1)` from the left when the section enters view, staggered 180ms so the reveal sweeps L->R like a timeline. Header cleaned: eyebrow + bold heading, no top-right time range.
- **Fig. 02 - Monthly saving card:** header mirrors Fig. 01's eyebrow + bold heading pattern; the bold title IS the headline claim (`£X/month less than a daily coffee`). Two clean price-per-day rows (Coffee vs CONKA Both), prices bumped to `text-2xl` / `text-3xl` for prominence. "Actives" mentions removed throughout; savings line promoted from footer strip to section title.

**`LabTimeline` rebuild (scroll-driven progress rail):**
- Three steps (24h / 14d / 30d), each a navy timeframe pill on a vertical rail with a compact card of bulleted outcomes beneath. Pills simplified from `T+24H · 24 hours` to just `24 hours`.
- Card layout: title sits in the header strip (white text on navy when active, black on white when inactive). Body is just the bullet list; footer carries phase identity (`Phase 01 · Focus stabilisation` with the identity in navy). Cards are noticeably shorter than before -- title and 2-cell footer collapsed.
- Bullets switched from em-dash markers to bracketed mono numbers `[01]` `[02]` `[03]` in IBM Plex Mono. Reads as a study-protocol entry rather than a generic dash list; pulls the brand mono voice into the densest part of the card.
- Section sub-header replaces *"What to expect when taking CONKA"* with the proof-scale line *"Based on N=150+ participants · 5,000+ cognitive tests"*. Caption below the cards removed (de-duplicated).
- **Interaction:** single rAF-throttled scroll handler derives both `activeIndex` and rail fill from pill positions; `IntersectionObserver` removed for one source of truth. Rail base + fill bookended by first-pill-centre and last-pill-centre so the line literally starts at badge 1 and ends at badge 3. Fill grows linearly between adjacent pill centres so it always reaches the active checkpoint rather than stalling early. **Cumulative lit state:** every step at or before the active one stays illuminated.
- Rail visible on every viewport (not just desktop), so the metaphor holds on mobile.
- Desktop sidebar image bumped `450px -> 600px` so the cards lose width and the asset carries more weight. Sidebar gains a `Fig. 03` plate per the clinical aesthetic plates rule (replaces the old corner brackets).
- Copy lifted with more aspirational + sensory language while staying grounded in measurable outcomes:
  - 24h title: *Focus without the noise.* / bullets reference duration + the 2pm-dip framing from the same page's value comparison.
  - 14d title: *Your sharpest weeks yet.* / first bullet hooks directly to the CONKA app's measured data ("Cognitive scores trending consistently higher").
  - 30d title: *A measurably sharper baseline.* / first bullet is the consistency claim ("Less variation in your daily cognitive function") -- harder to dispute than peak-performance claims.
  - Outcome labels: `Momentum` -> `Cognitive momentum`; `Baseline reset` -> `Baseline shift` (more accurate; you're not resetting to a default).
- **Compliance:** section H2 gains a `^^` superscript anchoring to the existing `Cognitive test` footnote in `LandingDisclaimer`, since steps 2 and 3 reference cognitive test data. Resolves on `/start` (matches the pattern `LabCaseStudies` uses on the same page).
- **Perf:** component is dynamic-imported at every call site (`/`, `/start`, `/protocol/[id]`) so JS stays off the initial bundle. Observer + scroll listener ride inside the deferred chunk. Bundle growth ~1 KB inside the existing lazy chunk; zero impact on initial paint. All transitions use `motion-safe:*` so `prefers-reduced-motion` disables them; activation still works, just instantly.

**Why:** Acquisition pages were lifted aesthetically in the prior pass but several surfaces still read as engineering-spec rather than consumer-grade. Hero needed a clearer premise + cleaner asset hand-off; CTA was visually heavy with a distracting meta line; product section was over-explaining with spec text instead of letting the bottles carry the showcase; value comparison was leading with arithmetic when the felt argument (coffee crashes by 2pm) was below the fold; timeline was a stack of generic content cards rather than a visualised progression. Each change tightens message hierarchy and trades clever framing for plainly understood claims, while still earning the clinical aesthetic through the `lab-` grammar (mono labels, hairline borders, bracketed counters, navy interactive). Every cognitive-performance claim that touches the CONKA app's measured data is now anchored to the existing `^^` footnote.

**Branch:** `Component-Improvements`
**Commits:** `786ed8c`, `7b93364`, `d33965c`, `d08e6a4`, `b1dd96e`, `06b48e3`, `5570138`, `c45f8ac`, `af005cf`, `cdb24ba`

### 2026-04-22 -- /app hero unified responsive layout + download section phone asset

Iterated the `/app` hero on an experimentation branch. Replaced the split mobile/desktop implementations with a single responsive layout mirroring `OurStoryHero` (stacked on mobile, 60/40 grid on desktop) and swapped the phone-mockup hero for a landscape lifestyle asset. `AppDownloadSection` got the old phone render added on the left as a separate figure frame, and its outer card wrapper was removed so the asset and copy sit as siblings.

**`AppHero` (`app/components/app/AppHero.tsx`):**
- Collapsed the split mobile/desktop trees into one layout: `flex flex-col` on mobile, `lg:grid lg:grid-cols-[3fr_2fr] lg:items-center` on desktop. Same copy and hierarchy render at every breakpoint, so the two views can no longer drift apart.
- New asset: landscape `/app/NothingAppRing.jpg` inside a `lg:aspect-[3/2]` hairline frame on `bg-[#f5f5f5]`. Plates `Fig. 01` top-left, `The Future In Your Hands` bottom-right.
- Copy refresh: eyebrow `Brain Performance Technology`, H1 `The Gold Standard of Cognitive Testing`, mono sub `3-min test · Wellness log · Measurable progress`, body `This isn't an IQ test. It measures how efficiently your brain processes information, tracked over time. Most brands ask you to trust their claims. We hand you the instrument to see CONKA working for yourself.` Meta line under CTAs trimmed to `Free to use`.
- Install buttons: passed `flex-1 justify-center whitespace-nowrap !text-[10px] !tracking-[0.16em] !px-4 !gap-2` via `buttonClassName` + `iconSize={16}` so iOS and Android share a single row, Play Store cannot wrap, and the pair caps at `max-w-md`.
- Dead code removed: `STATS` array, `appHeroFloat` keyframe, `app-hero-mount-left` / `app-hero-mount-right` / `app-hero-float` classes, `order-1`/`order-2` shuffling.

**`AppDownloadSection` (`app/components/app/AppDownloadSection.tsx`):**
- Outer `bg-white border border-black/12 p-6 lg:p-10` card wrapper dropped. Phone asset and copy now live as siblings inside a `lg:grid-cols-[1fr_1fr]` grid.
- Left cell: `/app/AppConkaRing.png` (the old hero phone render) inside a `bg-[#f5f5f5]` hairline frame, `aspect-[4/5]` on mobile, `lg:aspect-[5/6]` on desktop, with a gentle `appDownloadFloat` animation.
- Plates: `Fig. 07` top-left, `App Interface` bottom-right. Other page assets keep their existing figure numbers for now.

**Assets:**
- `public/app/NothingAppRing.jpg` (new) - landscape hero photo.
- `public/app/AppConkaRing.png` (updated).

**Why:** Previous `/app` hero had mobile and desktop diverging on both copy and structure (different headlines, stats on desktop only, full-bleed image on mobile only). Collapsing to a single layout guarantees message parity and removes a whole branch of conditional rendering. The new "not an IQ test" body positions the app around information-processing efficiency and leads with a show-don't-tell stance ("we give you the instrument, not just claims") that differentiates CONKA from supplement marketing in general. `AppDownloadSection` gained visual weight by bringing the phone render back into the conversion surface rather than leaving it as a text-only closing card.
**Branch:** `app-page-experimentation` (exploratory)
**Commit:** `efb32aa`

### 2026-04-21 -- Navigation, footer, /why-conka clinical refactor + brand-base.css reorganisation

Pulled the last three site-wide surfaces -- desktop + mobile navigation, the global footer, and `/why-conka` -- onto the clinical grammar, then reorganised `app/brand-base.css` around the clinical-vs-legacy split so the next session can see at a glance what is the default and what is legacy carry-over.

**Navigation (`NavigationDesktop`, `NavigationMobile`, `ShopMegaMenu`):**
- Desktop header gets `border-b border-black/12` hairline (was ad-hoc shadow). Shop trigger is now a hairline tag with `lab-clip-tr` chamfer that fills navy on hover. Nav links: `font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-black/65 hover:text-[#1B2757]`. Cart badge flipped from amber pill to navy square (`bg-[#1B2757] text-white font-mono text-[9px] tabular-nums`). All SVG icons standardised on `strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"`.
- Mobile menu reorganised into three doc-code columns -- `// Learn more` (Ingredients / Our Story / Why CONKA), `// Science` (Science / Ingredients / Case Studies), `// Technology` (CONKA App). "What's inside Flow & Clear" copy block removed. Product cards flipped vertical (full-width `aspect-[4/3]` image + stacked info), product names normalised (`Both (Flow + Clear)` / `Flow` / `Clear`).
- Shop mega menu left sidebar simplified back to a single "Learn more" section (Why CONKA works / The CONKA App) after a brief experiment with three grouped sections was rejected as redundant with the main nav. Product card CTA replaced hand-rolled "Explore ↗" with `ConkaCTAButton` (per-product meta lines `// the full daily system`, `// morning focus · energy`, `// afternoon clarity · recovery`, width-forced full via `lg:!w-full lg:!max-w-none`). Overlay badges now read just `Flow + Clear` / `Flow` / `Clear`. Product cards restructured so the image is its own `<Link>` and the CTA is a sibling link -- avoided nested anchors.

**Footer (`Footer.tsx`):**
Kept the black background, rebuilt everything else on the clinical grammar. Newsletter block now a 2-col layout: trio header on the left (`// Newsletter · Dispatch-00` + `brand-h3` "Unlock a new state of mind." + mono sub `Tips · Research · Offers · No spam`), square form on the right with `bg-white/5 border border-white/20` input and a `lab-clip-tr` white-to-navy-on-hover Subscribe button (`Subscribe ↗`). Logo + link columns grid now `auto_1fr` split by a hairline `border-white/12`. Each column header is a mono doc-code (`// Discover` / `// Shop` / `// Company` / `// Support`). Links numbered `01`–`NN` mono with hairline `border-white/8` row dividers. Shop column drops the Quiz link (scheduled for removal) and adds "Flow + Clear". New bottom meta row: `© CONKA {year} · Made in UK · All rights reserved` left, `Doc-FT-001 · Informed Sport · Batch tested` right. Submit button resting state black-on-white flips to `hover:bg-[#1B2757] hover:text-white`. Em-dash opener in the old subcopy ("—sign up for newsletters") removed -- canonical dot separator throughout.

**`/why-conka`:**
- Page root wrapped in `brand-clinical`, loading state re-chromed to mono `// loading`.
- Hero split into two-column desktop (image LEFT, content RIGHT) and stacked mobile. Image is the ring lifestyle shot at `/lifestyle/ClearJeansTwo.jpg` inside a hairline `aspect-[4/5]` frame with `Fig. 00` + `Overview` plates, anchoring the page-wide figure sequence (0 → 7).
- Section backgrounds flipped so the hero (white) alternates cleanly through all seven points (tint → white → tint → white → tint → white → tint) and the closing CTA (`/protocol/3` Balance) lands on white. Theme keys in `whyConkaData` inverted accordingly.
- `WhyConkaSection` rewritten: `R-{id}` researcher counter + `Reason {id} / 07` plates, hairline image frame with `Fig. 0X` top-left + `Reason 0X / 07` bottom-right, navy subheading, alternating image-side by parity. `AppInstallButtons` on point 4 swapped to `variant="clinical"`.
- `WhyConkaCTA` rewritten as the canonical clinical closing card (eyebrow + `brand-h2` "Unlock your cognitive potential." + body + mono guarantee line + `ConkaCTAButton` + `LabTrustBadges`) pointing at `/protocol/3`. The separate Quiz CTA was dropped -- quiz is being redirected per `WEBSITE_SIMPLIFICATION_PLAN.md`.
- Em-dashes purged from every headline / subheading / description in `app/lib/whyConkaData.ts` (7 replacements across 5 points) -- middle-dot / colon / period depending on grammar. Reason 6 image swapped from `/story/clinical-trial.jpg` to `/lifestyle/FlowConkaRing.jpg`. Navy `<span>` around "CONKA" in the hero headline removed on both desktop and mobile -- plain black, accent reserved for interactive.

**`/shop` hero mobile alignment (`ShopHeroMobile.tsx`):**
Stripped the root `<section>` wrapper (page owns it now), converted to the trio header pattern: `01 · Shop · 03 formulas` mono eyebrow + `brand-h1` "Clarity and focus you can feel." + mono sub `Start simple · Feel the difference · 100-day guarantee`. Left-aligned, no centred text.

**`app/brand-base.css` reorganisation (no behaviour change, comments + section markers only):**
- Top-of-file legend now names three explicit layers: Layer 1 base tokens + classes, Layer 2 clinical scope + utilities (the default for new work), Layer 3 legacy compat + deprecation candidates.
- Each layer boundary gets a banner comment (`LAYER 1 — BASE TOKENS`, etc.) so the clinical block is visually separated from the pre-clinical block.
- Moved the compatibility tokens (`--brand-surface`, `--brand-stroke`, `--brand-border-color`), product accent pairs (`--brand-flow-accent`, `--brand-clear-accent`), and gradient accent (`--brand-gradient-accent`) into a dedicated Layer 3 `:root` block, each marked `@deprecated` with the migration rationale and the condition for removal.
- Moved the `.brand-card` / `.brand-card-bordered` / `.brand-container` / `.brand-btn` component classes into Layer 3 with a `@deprecated — do not reach for these on new work` header, pointing clinical consumers at the Tailwind utility pattern (`bg-white border border-black/12 p-5 lg:p-6`) from `CLINICAL_AESTHETIC.md`.
- Marked `brand-bg-neutral` and `brand-bg-deep-grey` as legacy alongside the clinical-active backgrounds (`brand-bg-white`, `brand-bg-tint`, `brand-bg-black`).
- The clinical scope block (`.brand-clinical`) now sits in its own clearly labelled Layer 2 section with a list of every page currently using it, the token overrides, the hero-flush media query, and the three unscoped utilities (`.lab-asset-frame`, `.lab-clip-tr`, `@keyframes lab-blink`).

**Why:** Header, footer, and `/why-conka` were the last three surfaces still running pre-clinical styling -- a user entering the site through the nav saw amber cart badges, pill-radius CTAs, and the old blue-accent "Why CONKA?" hero before any clinical section loaded. The CSS reorg is the first time the file has distinguished default-brand tokens from clinical overrides from deprecation candidates; previously the three were interleaved and the TODOs weren't actionable because there was no structure to point at. With the clinical grammar now dominant across every user-facing surface, Layer 3 becomes the explicit hit-list for future cleanup.
**Spec:** `docs/branding/CLINICAL_AESTHETIC.md`
**Branch:** `header-footer-upgrade`

### 2026-04-21 -- /app page + cognitive test section full clinical refactor

Completed the `/app` page migration started under SCRUM-906. The page-level `brand-clinical` wrapper and a couple of neighbouring components had landed, but the four child components (`AppHero`, `AppStickyPhoneBlock`, `AppSubscribersSection`, `AppDownloadSection`) and the entire cognitive-test section were still on the pre-clinical premium surfaces -- dark ink hero with floating-phone animation, gradient neuro-blue sticky scroll block, premium-card-soft surfaces with 40px radii, gradient-ringed benefit circles, pill-radius CTAs. This pass brings all of it onto the clinical grammar.

**/app child components:**
- `AppHero` consolidated from a 3-file split (`AppHeroDesktop`, `AppHeroMobile`, local `types.ts` all deleted) into a single responsive content-only component. Dark ink background replaced with brand white; trio header (mono eyebrow + `brand-h1` + mono sub-line), 3-col hairline stat strip, `Fig. 01 -- Conka app` figure plate on the phone mockup (`bg-[#f5f5f5] border border-black/12` with `aspect-[4/5] lg:aspect-[5/6]`), clinical `AppInstallButtons`. Float + mount animations renamed (`app-hero-float` / `app-hero-mount`) and retained.
- `AppStickyPhoneBlock` desktop rewritten to the clinical sticky-panel pattern: white background, mono `01 / 04 -- eyebrow -- Measurable` counter per section, hairline `StatCard`s with navy `#1B2757` values, grid-distributed bottom tab strip (`grid-template-columns: repeat(N, 1fr)`) so each tab anchors at the start of its progress segment and lines up with the navy scroll fill, plus 5 boundary tick marks that flip grey -> navy as sections are passed. `useScrollTrack`, `SCROLL_MULTIPLIER = 0.85`, `scrollToSection`, and all swipe/nav behaviour preserved unchanged.
- `AppStickyPhoneBlockMobile` rebuilt on the same vocabulary: mono counter, navy progress bar, `ChamferNav` prev/next (navy + `lab-clip-tr`), 2-col tab roster with active `bg-[#1B2757] text-white` tiles, `SWIPE_THRESHOLD_PX=50` retained.
- `AppSubscribersSection` swapped to hairline 3-col rewards spec strip (Token +10 / Tier up 30 / Redeem Free) with `Fig. 06 -- Rewards interface` + `Subscribers only` plates on the mockup.
- `AppDownloadSection` reduced to a minimal hairline closing CTA card -- trio header, clinical install buttons, mono credibility line.
- `AppInstallButtons` gained a `variant?: "gradient" | "clinical"` prop. Clinical renders navy solid (App Store) + hairline `#1B2757` bordered white (Play Store), `font-mono text-[11px] uppercase tracking-[0.2em]`, `lab-clip-tr`, `↗` arrow. Gradient variant preserved for `/why-conka` which hasn't migrated yet.
- `PhoneFrame` (exported shared primitive) reworked so the phone image sits in an explicit inset box (`top-16 right-6 bottom-16 left-32` desktop, `top-10 right-3 bottom-10 left-20` mobile) with `object-contain object-right`. Result: phone is anchored right, "peeking" into frame at a smaller scale, with a dedicated left zone for the Fig plate. Plate bulked up (`top-4 left-4`, `px-3 py-1.5`, `text-[10px]`, `bg-black/65`) so it reads cleanly without crowding the phone.

**Cognitive-test section (all sub-components):**
- `CognitiveTestSection` + `CognitiveTestSectionMobile` re-chrome: trio header (`Test Your Brain -- Cognetivity SDK -- 2-Min Assessment`), hairline `BenefitsSpecStrip` (Validation / Results / Profile with navy tabular values) replacing the gradient neuro-blue circles, testing-state frame wrapped in a top spec bar (`Fig. 07 -- Cognetivity SDK` + live pulse dot) + hairline frame + bottom 3-col spec strip (J / F / Speed + Accuracy). Play-again CTA flipped to hairline-with-navy-fill-on-hover + `lab-clip-tr` + `↻`.
- `CognitiveTestIdleCard` moved to hairline + navy tile brain icon (44x44, stroke 1.75, `strokeLinecap="square"`, `strokeLinejoin="miter"`) + clinical start CTA.
- `EmailCaptureForm` swapped to square-cornered inputs with navy focus ring, custom square checkbox with navy fill, navy submit button + trio header + mono back link.
- `CognitiveTestLoader` replaced progress ring + premium card with hairline card + navy tile (pulse -> checkmark), mono `XXX%` counter, navy hairline progress bar, `01 02 03` stage counter in mono.
- `CognitiveTestScores` swapped from premium-card-soft + gradient score text to hairline card with `Fig. 08 -- Speed of Processing` top bar + 3-col score grid (navy tabular values) + email footer spec line.
- `CognitiveTestRecommendation` converted to hairline card with navy left edge, navy primary + hairline secondary buttons (both `lab-clip-tr`).
- `CognitiveTestAppPromo` restyled as hairline card with dot-bullet feature strip, navy App Store + hairline Google Play buttons.
- `CognicaSDK` iframe wrapper loading state swapped to the navy-tile + mono "Initialising assessment" shimmer pattern so the boot state matches the rest of the section (heavier chrome like the Fig plate and spec bars moved up to `CognitiveTestSection` where it belongs -- the SDK wrapper just serves the iframe now).

**Section rhythm + nav alignment on `/app`:**
- Section ordering held but backgrounds re-flipped: cognitive-test moved to `brand-bg-tint` and case-studies to `brand-bg-white` so we don't get two adjacent white sections after the download CTA.
- The scroll-hijack bottom nav was previously a wrapping flex row, which put tab 3 and tab 4 mid-line on narrow viewports and left no positional relationship with the progress bar. Now a grid with `numSections` equal columns, text-left per cell, so tab N sits at `((N-1) / N) * 100%` which matches the start of segment N on the fill bar.

**Why:** `/app` was advertised as "migrated" but the four child components still ran the dark ink hero + gradient sticky block + gradient benefit circles + pill CTAs, so the page jumped aesthetic mid-scroll -- clinical header, premium body, clinical footer. The cognitive-test sub-components in particular were the heaviest remaining island of premium styling on the site, and they render on both `/app` and (via embedded SDK) as the primary conversion moment on that page. The phone-frame and nav-alignment fixes came out of the first preview: phone was flush to the frame edge which crowded the Fig plate, and the flex-wrap tabs looked arbitrarily spaced against the continuous scroll bar.
**Plan:** `docs/development/featurePlans/clinical-aesthetic-page-alignment.md` (extends the /app treatment under SCRUM-906)
**Commit:** `cfd1fed`
**Branch:** `full-website-realignment`

### 2026-04-21 -- Full-website clinical aesthetic realignment (SCRUM-906)

Extended the clinical aesthetic from `/start` + `/` into the rest of the site -- product PDPs, ingredients, our story, /protocol/3, /case-studies, /science, and /app -- then reshuffled the Balance PDP and added a per-athlete "what they took" card on case studies.

**PDP alignment (Phase 1 -- /conka-flow + /conka-clarity):**
- `FormulaCaseStudies` elevated to the clinical carousel treatment: hero stat row, spec-sheet `AthleteSpecCard`, hairline borders, navy `#1B2757` focus ring, mono eyebrows, `tabular-nums`, em-dash separators. `FormulaFAQ` tightened to the `LabFAQ` pattern (spec header row, `01.`-`NN.` mono numbering, category tags, `[+]`/`[-]` indicators, left-border accent).
- `FormulaBenefits` desktop + mobile moved onto the clinical surface -- double-border `lab-asset-frame` removed from internal panels, benefit stat scales reduced (`4xl`/`5xl` -> `3xl`/`4xl`) so the data doesn't overshadow the copy.
- `FormulaIngredients` rebuilt as a compact accordion card list (replacing the split desktop/mobile layouts). Most Popular badge clipping fixed on the pack selector (moved from `overflow-hidden` parent to an isolated positioning context).
- Dropped leftover `"use client"` directives from static presentational components (stats, HowItWorks).

**Phase 2 -- /protocol/3 (Balance):**
- `ProtocolHero` / `ProtocolHeroMobile` rewritten to the `ProductHero` pattern: packselect grid (`grid grid-cols-3 gap-2`), navy selected state, `ConkaCTAButton` with inverted-ring ConkaO + blinking underscore + 12px polygon chamfer. Removed `rounded-xl` / `rounded-full` / `shadow-md` / `ring-2` / emoji badge.
- Section components swapped wholesale for their clinical equivalents: `LandingWhatItDoes`, `WhyConkaWorks`, `LabTimeline`, `LabGuarantee`, `LabFAQ`, `LandingTestimonials` (with `hideCTA`), `FormulaCaseStudies` / `FormulaCaseStudiesMobile` routed by `productId={selectedProtocolId}` (Balance has its own athlete set).
- `brand-clinical` wrapper on both mobile + desktop root divs.
- Deprecation sweep: deleted `HomeWhatItDoes`, `LandingFAQ`, `LandingGuarantee`, `LandingTimeline` -- all superseded by the Lab* / shared variants consumed above.
- Post-swap reorder: Hero -> Case Studies -> What It Does -> Why CONKA Works -> Timeline -> Testimonials -> Guarantee -> FAQ -> Explore, mobile and desktop now share an identical sequence. Backgrounds alternate W-T-W-T-W-T-W-T-W. `WhyConkaWorks` added to desktop (previously mobile-only) so the rhythm holds on both breakpoints without forking the sequence.

**Phase 5 -- /case-studies:**
- `CaseStudiesPageDesktop` + `CaseStudiesPageMobile` rewritten with the trio header pattern (mono eyebrow + `brand-h1` + mono sub), hairline borders, `tabular-nums`, em-dash + middle-dot separators. Desktop gets a 3-cell stat strip (Athletes / Tests / Avg. lift) in a bordered grid.
- `AthleteSidebar` given clinical filter chips, hairline-bordered athlete tiles with `SportIcon` thumbnails, navy highlight for active/featured.
- `FeaturedAthletesCarousel` polished: hairline cards, mono labels, navy focus ring, `snap-x snap-mandatory scroll-smooth` for tactile swiping -- kept to visual alignment, no nav-arrow additions.
- `AthleteStats.tsx` trimmed to only export `ComparisonChart` (the sole live consumer); hairline bars + navy fill, em-dash baseline-vs-results labels. Deleted `AthleteCard.tsx`, `FeaturedAthletes.tsx`, `AthleteFilterBar.tsx` (all orphaned after the rewrite); pruned barrel in `index.ts`. Net -500 lines.
- `/case-studies` root: `brand-clinical` wrapper, `brand-section brand-hero-first brand-bg-white`, clinical loading state.

**"What they took" per-athlete card (new):**
`WhatTheyTook` replaces the generic "Try CONKA now" footer on the mobile case study and sits inline on desktop below Field Notes. Reads `athlete.productVersion` and resolves to one of three product configs (Flow / Clear / Both) with matching bottles, label, and destination (`/conka-flow` / `/conka-clarity` / `/protocol/3`). Noah Curtis corrected from `productVersion: "02"` to `"both"` + Balance Protocol to match attribution.

**Static content pages (/ingredients, /our-story, /science, /app):**
Each page migrated onto `brand-clinical` with `brand-section` / `brand-track` composition, hairline borders, navy accent, left-aligned trio headers, em-dash separators, and `tabular-nums` on stat blocks. `/app` carried the cognitive test section across to the same treatment.

**Why:** The clinical aesthetic was contained to `/start` and `/` while the rest of the site still ran the pre-clinical `premium-base` surfaces, dark dramatic sections, and pill CTAs -- jumping from a paid-traffic landing page into a PDP felt like two different sites. /protocol/3 in particular was still running the old ProtocolHero + FAQ pair against the already-elevated /conka-flow and /conka-clarity, which made Balance read as an older product. Reordering Balance to lead with Case Studies puts social proof in front of product education -- same promotion that worked on /start. The per-athlete "what they took" card is a lower-friction hand-off than a generic Balance CTA at the bottom of every case study.
**Plan:** `docs/development/featurePlans/clinical-aesthetic-page-alignment.md` (Phases 1, 2, 5 Done; 3-4 Done via /science + /our-story commits; /app + /ingredients extensions beyond original scope)
**Ticket:** SCRUM-906
**Branch:** `full-website-realignment`

### 2026-04-21 -- Home page clinical aesthetic alignment

Pulled the home page onto the clinical aesthetic established on `/start` and `/funnel`, tightened the section order around earlier social proof, and refreshed the reference doc.

**LabWhatsInsideMini 4-col desktop:**
`grid-cols-2 lg:grid-cols-4` with child order `FLOW product - FLOW info - CLEAR product - CLEAR info` so desktop reads as paired product/info bookends and mobile keeps the product-left/info-right pairing on each row.

**Home section reorder + swaps:**
- Section 6 `KeyBenefits` -> `LandingDailyBenefits` (3 pillars variant matching the clinical section rhythm).
- Section 8 `WhatToExpect` -> `LabTimeline` with `ctaHref="/protocol/3"`; sub-copy simplified from `"Protocol window: T+0 to T+30D - N=150+ participants"` to `"What to expect when taking CONKA"`. Added `ctaHref` + `ctaLabel` props so the same component can be retargeted per page.
- New Section 11 `LabGuarantee` above FAQ with `ctaHref="/protocol/3"`; FAQ flipped to `brand-bg-tint` to preserve white/tint alternation.
- `KeyBenefits` and `WhatToExpect` kept in the repo with a `REVIEW:` banner noting they're no longer on the home but may still be reused on PDPs.

**Cleanup surfaced by `/review-code`:**
Removed `console.log` add-to-cart wrappers in `ProductGrid` / `ProductGridMobile` / `ProductGridTablet`, deleted the now-dead `onAddToCart` prop plumbing, removed the unused `getProductBadge` export, and collapsed `ProductCard.handleAddToCart` into a single-path early-return (replaces the previous silent-failure branch). Dropped orphaned imports from `app/page.tsx` (`useState`, `useEffect`, `keyBenefits`, testimonial helpers).

**`docs/branding/CLINICAL_AESTHETIC.md` rewrite:**
Restructured the doc around patterns actually in use: `brand-clinical` token overrides table, utility list (`lab-clip-tr` / `lab-asset-frame` / `lab-blink` / 10px overlay chamfer), standard patterns (trio header, data card, card header row, spec strip, segmented tabs, em-dash bullets, chamfer nav), typography + colour grammar, `ConkaCTAButton` rules, component prop conventions (`hideCTA`/`ctaHref`/`ctaLabel` + content-only structural contract), responsive patterns, trust grid, corner brackets, and an explicit "do not" list.

**Why:** The home page still leaned on the pre-clinical `KeyBenefits` + `WhatToExpect` components, so the jump from hero to the rest of the scroll felt inconsistent with `/start` and `/funnel`. Cleanup came out of the code review and fixes a real silent-failure path in add-to-cart. Doc rewrite was needed so the next session can extend the aesthetic without re-reading source.
**Branch:** `main-page-and-navigation-alingment`

### 2026-04-21 -- Lab-to-brand-base migration complete + landing polish (SCRUM-901)

Promoted the clinical `/startV1` aesthetic into `/start` and shipped a round of landing-page refinements on top.

**SCRUM-901 migration:**
- Added `.brand-clinical` scope to `app/brand-base.css` (zero radii, navy `#1B2757` accent, light tint, mobile hero flush rule) plus `.lab-asset-frame`, `.lab-clip-tr`, and `lab-blink` keyframe as unscoped utilities.
- New `ConkaCTAButton` (navy, chamfer clip, blinking cursor) used on `/start` only. `LandingCTA` kept untouched on `/` and `/protocol/[id]` with a phase-out TODO.
- Content-swapped `LandingHero`, `LandingWhatItDoes`, `LandingValueComparison`, `LandingTestimonials` to the Lab* bodies; relocated 6 Lab* components into `app/components/landing/` and `LabCaseStudies` into `app/components/`. Deleted `app/startV1/` and `app/start/TestimonialsSection.tsx`. `/start` root now carries `brand-clinical`.

**Landing reorder for earlier social proof:**
- Split `LandingWhatItDoes` (formulation) and `LandingDailyBenefits` (3 pillars) into separate sections with `LabCaseStudies` between them. `LandingWhatItDoes` dropped `"use client"` now that the pillar state lives on DailyBenefits. Section backgrounds re-flipped to preserve white/tint alternation.
- Mobile flush fix on DailyBenefits asset (`-mt-20 lg:mt-0`) to match LabTimeline's edge-to-edge banner pattern.

**LabFAQ clinical elevation (6 changes, one pass):**
Spec header row (`Section Q&A / Entries N=5 / Updated 2026-04`) in `lab-asset-frame`, `01.`-`05.` mono numbering, category tags (`TRIAL`/`PRODUCT`/`SHIPPING`/`SUBSCRIPTION`), mono `[+]`/`[-]` indicators replacing the chevron, left-border accent + `Response` mono label on the open answer, `Still stuck? info@conka.io - Avg response 4h` footer. Asset swapped from `ClearDrink.jpg` to `FlowDeskClutter.jpg`.

**Corner-bracket framing system (new aesthetic primitive):**
Two absolute-positioned L-shaped spans (20% of container width/height, 6px thick, 12px inset from the corners) replace full `lab-asset-frame` double-borders on select assets. Applied to:
- LabFAQ lifestyle asset (black, desktop-only)
- LandingDailyBenefits asset (black, desktop-only; lab-asset-frame removed)
- LabTimeline desktop sidebar (white, always-on; lab-asset-frame removed)

Guarantee phone mockup stays frame-free.

**Why:** `/startV1` was the validated landing direction but paid traffic still hit the older `/start` look. Reordering social proof higher addresses the "proof before product education" concern for cold traffic. Corner brackets give assets an angular, logo-adjacent framing without the heaviness of a full double-border - reads more editorial than catalogue.
**Plan:** `docs/development/featurePlans/lab-to-brand-base-migration.md`
**Ticket:** SCRUM-901
**Branch:** `New-Stylng-extraction-landing-page`

### 2026-04-17 -- Fix account profile update (was completely broken)

The Edit Profile modal on `/account` was returning 200 OK but never actually updating anything in Shopify. Two root causes:

**Wrong API:** The `/api/auth/customer/update` route was calling the **Storefront API** via `shopifyFetch`, but the auth token (`shcat_...`) is a **Customer Account API** OAuth token. The Storefront API silently ignored the invalid token. Rewrote the entire route to use the Customer Account API (`https://shopify.com/{shopId}/account/customer/api/2024-10/graphql`) with the token as the `Authorization` header, matching the session and orders routes.

**Auth not sent:** Before the API rewrite, the route also expected a `Bearer` token in the `Authorization` header, but the frontend never sent one (the token lives in cookies). Fixed by reading from the `customer_access_token` cookie.

**Additional fixes found during code review:**
- Address updates were always creating new addresses (duplicates). Now queries for existing default address ID and uses `customerAddressUpdate` when one exists, `customerAddressCreate` only for first-time addresses. Both use `defaultAddress: true` param (the `customerDefaultAddressUpdate` mutation does not exist in the Customer Account API).
- Email field made read-only with explanation. The Customer Account API `customerUpdate` mutation only supports `firstName` and `lastName` -- no email, no phone.
- Phone number moved to `CustomerAddressInput.phoneNumber` on the address mutation (the only place the Customer Account API accepts it).
- Country names mapped to ISO codes (GB, US, CA, AU, IE) via `territoryCode` field. Province uses `zoneCode` (not `provinceCode`). These are Customer Account API field names, which differ from the Storefront API.
- GraphQL-level errors now checked (previously only HTTP status was checked, so schema mismatches returned silent 200s).
- UI refresh fixed: `checkSession()` now called after save instead of `router.refresh()`, which only refreshes server components while customer data lives in client-side `AuthContext`.

**Why:** Customer reported 401 on profile update. Investigation revealed the entire update flow was non-functional since it was built (wrong API, wrong auth method, address duplication, silent email no-op).
**Branch:** `account-update-details-bug`

### 2026-04-16 -- PDP purchase flow overhaul + ProtocolHero alignment

Complete redesign of the purchase flow on Flow, Clear, and Both (Protocol) product pages, inspired by Magic Mind's PDP pattern.

**Hero declutter (ProductHero + ProductHeroMobile):**
Removed 4-stat benefit grid (data lives in FormulaBenefitsStats further down), removed "Your Selection" summary box, removed "How would you like to purchase?" label, removed "No minimum commitment" (redundant with "Cancel anytime"). Meta pill moved below carousel on mobile.

**PackSelectorPremium simplification:**
Stripped to minimal radio-button style. Labels changed to "4 Shots / 8 Shots / 12 Shots / 28 Shots". Removed prices, billing text, tier labels ("Starter"/"Pro"/"Max"), and accent colors. "Most Popular" badge (brand-accent) on 12-pack. Reduced font size and border radius for cleaner look.

**Purchase tile redesign (Magic Mind-inspired):**
Subscribe tile always expanded with bullet list visible. "Save 20% off every order" badge (light brand-accent) next to "Subscribe" title. Delivery description in plain language ("4 shots delivered every week", "28 shots delivered every month"). Checkmark bullets: Free UK shipping, Pause/skip/cancel, 100-day guarantee. Crossed-out one-time price always visible. Buy Once tile shows price + per-shot only. Selected state uses brand-accent ring + banner (matching funnel pattern).

**FormulaBenefitsStats overhaul (Desktop + Mobile):**
Reduced from 6 stats to 3 per formula for EFSA compliance. Flow: sleep quality (+42% ¶), memory (+18% ¶), tiredness/fatigue (†† EFSA). Clear: memory (+63% ¶), fatigue resistance (+30% ¶), cerebral blood flow (+57% ¶). Dropped stress and anxiety stats (RED claims per CLAIMS_COMPLIANCE.md). Stats enlarged to single-column layout (4xl/5xl desktop, 3xl mobile). Shared `CURATED_STATS` and `getDeliveryDescription` extracted to `formulaStatsData.ts`.

**ProtocolHero alignment:**
Rewrote to match ProductHero pattern. Removed ProtocolRatioSelector (protocols being deprecated). Removed "Your Bundle" shot visualization grid. Meta pill states "A 50:50 split of Flow and Clear". Replaced TierSelectorPremium with inline 3-column selector (4/12/28 Shots). Same subscribe/buy-once tiles, brand-accent CTA, LandingTrustBadges.

**Brand-accent unification:**
Replaced all product-specific colors (Flow amber, Clear blue, protocol gradients) with `var(--brand-accent)` across: CTA buttons (solid, no gradient), subscribe tile badges/ring, HowItWorks step numbers, StickyPurchaseFooter (desktop + mobile) toggle and CTA, star ratings (all amber). Removed `FORMULA_COLORS`, `getProductGradient`, `getProtocolAccent`, `getGradientTextColor` imports from all updated components.

**Font update:**
Removed `font-primary` class (Poppins) from ProductHero and ProductHeroMobile H1 elements. `brand-h1-bold` class now correctly applies Neue Haas Grotesk via `var(--font-brand-primary)`.

**Dead code cleanup:**
Removed `usePremium` prop from StickyPurchaseFooter and StickyPurchaseFooterMobile (+ all 6 call sites). Removed unused imports across 8 files. Zero lint warnings.

**Why:** Purchase flow had too much noise (6 stats, summary box, confusing pack labels, collapsing subscribe tile, product-specific color soup). Magic Mind's PDP is the category benchmark. Stats included non-compliant stress/anxiety claims. Brand-accent unification creates visual consistency across all product pages.
**Branch:** `product-page-improvements`

### 2026-04-16 -- Larger nav tiles, lifestyle asset refresh, homepage hero copy, asset cleanup

**Mobile nav product tiles (NavigationMobile):**
Enlarged "Shop by Product" tile images from 56px (`w-14 h-14`) to 112px (`w-28 h-28`) so product photos are clearly visible on mobile. Tile padding kept at `p-3`, gap bumped to `gap-4`, image border radius to `rounded-xl`.

**Homepage hero copy (Hero):**
Synced homepage hero messaging with landing page (`LandingHero`). Headline now reads "The only brain supplement you can measure." with matching body copy.

**FormulaBenefitsStats asset refresh (Desktop + Mobile):**
Replaced generic product bottle images with lifestyle photography. Primary images: Flow uses `ConkaAtWorkDesk.jpg`, Clear uses `BlurGrab.jpg`. Supporting thumbnails (desktop only) now per-formula: Flow shows `FlowBoxOpen.jpg`, `FlowDrink.jpg`, `FlowLeaf.jpg`; Clear shows `ConkaJeansHold.jpg`, `ClearTable.jpg`, `ClearBag.jpg`.

**HowItWorks asset refresh:**
Primary images: Flow uses `FlowDrink.jpg`, Clear uses `ClearBoxOpen.jpg`. Supporting assets: Flow uses `FlowConkaRing.jpg` + `ConkaDesk.jpg`; Clear uses `ClearJeansTwo.jpg` + `ClearDesk.jpg`.

**Asset cleanup (15 files deleted):**
Removed unused assets after audit: `HoldBoth.jpg`, `FlowTaste.jpg`, `ClearTaste.jpg`, `HoneyTaste.jpg`, `CitrusTaste.jpg`, `WomanPink.jpg`, `SatWoman.jpg`, and 8 unused hero images (`Hero.jpg`, `SamHero.jpg`, `ClearHero.jpg`, `HeroBannerH.jpg`, `HeroBannerW.jpg`, `AppShotsHero.jpg`, `HeroBanner.jpg`, `HeroBannerMobileH.jpg`). Only `ShotsHero.jpg` retained in `/hero/`.

**Why:** Nav tile images were too small to see products. Lifestyle photography from TQBF shoot replaces older product renders across PDP sections. Hero copy aligned for consistency. Unused assets removed to reduce repo size.
**Branch:** `larger-nav-shop-tiles`

### 2026-04-16 -- Visual system migration: product, protocol, and content pages

Migrated 5 pages and ~40 components from `premium-base.css` to `brand-base.css`, completing the visual system alignment started with the homepage upgrade on 2026-04-07.

**Phase 1 -- Product pages (conka-flow + conka-clarity):**
Rewrote both page wrappers from `premium-section-luxury`/`premium-track` to `brand-section`/`brand-track` with white/tint alternation. Migrated 15 shared product components: ProductHero, FormulaIngredients, FormulaBenefits (desktop + mobile + stats), BenefitDetail, BenefitList, HowItWorks, FormulaFAQ, FormulaCaseStudies, StickyPurchaseFooter, PackSelectorPremium. Flattened all dark `neuro-blue-dark` section backgrounds to `brand-bg-tint`. Removed `premium-pdp` overflow wrapper. Replaced `neo-button` with `brand-btn` in FormulaIngredients.

**Phase 2 -- Protocol page (Balance, id=3):**
Migrated 13 protocol components: ProtocolHero, CycleTrap, CycleBreak (desktop + mobile), CycleTransformation, ProtocolCalendar, ProtocolFAQ, TierSelectorPremium, WhatToExpectTimeline (+ desktop/mobile sub-components), ProtocolRatioSelector. CycleBreak hover/tap-to-reveal keeps `brand-black` for expanded state (UI feedback pattern, not section background).

**Phase 3 -- Content pages (science + our-story):**
Migrated 8 science components (ScienceHero, ScienceQuote, ScienceAdaptogens, SciencePillars, PillarCard, SynergyChart, ScienceDifferent, EvidenceSummary) and 4 our-story components (OurStoryHero, OurStoryHeroMobile, StorySection, OurStoryCTA). Replaced `neuro-blue-end` accent references with `brand-accent`. EvidenceSummary data card kept dark (`brand-black`) as a data-emphasis surface. OurStoryCTA fully flipped from dark-on-light to light-on-dark. Our-story page flattened from theme-based dark/light alternation to white/tint rhythm.

**CSS prep:**
Added compatibility tokens (`--brand-surface`, `--brand-stroke`, `--brand-border-color`) to `brand-base.css`. Marked `premium-base.css` header as LEGACY with migration TODO. Both CSS files remain loaded globally; no breaking changes for unmigrated pages.

**Why:** Homepage was migrated to `brand-base.css` on 2026-04-07 but all other pages still used `premium-base.css` with dark dramatic sections, different card radii, and no accent colour. This created visual inconsistency across the site. Flattening to white/tint aligns with the Landing Page Visual System and competitive benchmarks (Headstrong, Overload, AG1, Magic Mind).
**Plan:** `docs/development/featurePlans/visual-system-migration.md`
**Branch:** `other-page-aesthetic-migration`

### 2026-04-16 — TQBF lifestyle assets, navigation simplification, ProductGrid reorder, CTA + trust badge pass

Multi-part update integrating new TQBF lifestyle photography and simplifying the site towards the Flow/Clear/Both offering.

**Hero simplification (LandingHero + Hero):**
Social proof pill restyled to brand-accent badge ("150,000+ bottles sold"). Star rating moved to plain text line below hero image. CTA copy changed to "Try CONKA Today". Tightened vertical spacing between avatars and trust badges. 5% top crop on mobile hero image.

**Product image overhaul (productImageConfig):**
Flow, Clear, and Balance navigation/grid images replaced with TQBF lifestyle hold photos (`FlowHold.jpg`, `ClearHold.jpg`, `BothHold.jpg`). Single config change cascaded to 30+ consumers (ProductGrid, Navigation, subscriptions, account pages, B2B portal).

**Navigation mega-menu simplification:**
Replaced tabbed sidebar (Shop by Bundle / Shop Individual Formula / Help me Choose quiz) with simplified two-column layout: left sidebar has "Shop by Product" label + "Learn More" links (Ingredients, Why CONKA, CONKA App), right side shows 3 product cards (Both, Flow, Clear) with lifestyle images. Mobile menu updated with product cards, learn more section, and full nav links. Removed `HoveredSection` state, deleted `ShopMegaMenuContent.tsx`. Quiz link removed from desktop nav.

**ProductGrid reorder + brand-accent buttons:**
Reordered all three breakpoint variants (Desktop/Tablet/Mobile) to show Both first, then Flow, then Clear. Badge colours replaced from product-specific gradients to `var(--brand-accent)`. Badge labels updated to "Most Popular" / "Morning" / "Afternoon". CTA buttons simplified from product-specific gradients to brand-accent blue. Protocol renamed to "Both (Flow + Clear)" throughout ProductCard with updated copy removing protocol language.

**Lifestyle images in WhatItDoes sections (Landing + Home):**
Added `CreationOfConka.jpg` lifestyle image with desktop split layout (sticky image left, title + pillar cards right; stacked on mobile). Added CTA buttons between bottle visuals and lifestyle image ("Get Both from £X/shot" on landing, "Try CONKA Today" on homepage). LandingTrustBadges placed under each CTA.

**LandingTrustBadges added under CTAs:**
Trust badges (Free UK Shipping, Informed Sport, Every Batch Tested, Cancel Anytime) added beneath CTAs in `CaseStudiesDataDriven` and `LandingValueComparison`.

**Other asset updates:**
LandingTimeline desktop sidebar image swapped to `ConkaAtWorkDesk.jpg`. WhatToExpect (Desktop/Mobile) lifestyle images replaced with `FlowBoxOpen.jpg` (Flow) and `ClearLaugh.jpg` (Clear). Protocol 3 PDP hero image aligned with funnel (`BothBox.jpg`).

**Why:** TQBF lifestyle shoot provided premium photography to replace colour-based product renders. Navigation and ProductGrid simplified ahead of full protocol deprecation. Trust badges and CTAs distributed across more sections to reduce friction.
**Branch:** `lifestyle-asset-intergration`

### 2026-04-14 -- Homepage Phase 3: landing parity + Balance-only ProductGrid (SCRUM-885/886/887/888)
Four-part homepage upgrade that brings the organic entry point into parity with `/start` and locks the product offering to Balance ahead of the protocol deprecation.

**Section composition + reordering (3.1 + 3.2):**

- **`LandingHero` reused on homepage.** Homepage no longer runs a bespoke hero — `LandingHero` now backs both pages via optional `ctaHref` / `ctaLabel` props (defaults preserve `/start` funnel behaviour). Homepage passes a Balance-routed CTA. `Hero` / `HeroDesktop` / `HeroMobile` / `HeroBannerCarousel` flagged as orphaned for a follow-up cleanup pass.
- **CTA copy unified.** Both heroes now read `Get Both from £{PRICE_PER_SHOT_BOTH}/shot →`. Homepage hero keeps the `/protocol/3` destination per the homepage-for-organic-traffic divergence; `/start` keeps the funnel destination.
- **`LandingWhatItDoes` added as homepage section 2.** Replaces the previous "what CONKA does" slot with the same component `/start` uses. Homepage hides the trailing CTA + trust badges (ProductGrid below is the chooser).
- **Athlete carousel renamed + repositioned.** Heading "Why Athletes Trust CONKA" → "Why High Performers Trust CONKA". Case Studies moved above Testimonials, with white/tint alternation re-cascaded so adjacent backgrounds never collide.

**ProductGrid Balance-only + protocol PDP selector removed (3.3):**

- **Protocol variant selector gone from `ProductGrid` (Desktop / Tablet / Mobile) and from the protocol PDP hero.** All three grid variants render Balance imagery unconditionally; `protocolVariant` state and flow-heavy/clear-heavy plumbing removed. `/protocol/1` and `/protocol/2` URLs still route (no deep-link breakage) — just no UI to switch between them.
- **ProductGrid card normalisation.** `FunnelAssurance` swapped for `LandingTrustBadges` across Desktop/Tablet/Mobile. Cards now stretch to cell height (`items-stretch` + `flex-1`), Protocol card got clinical stats (Memory / Stress / Sleep) so every card has the same sections, Best-For rendering unified to the bulleted list across all three products (Protocol's paragraph variant + `BALANCE_PROTOCOL_BEST_FOR` dead-code deleted), and `min-h` reservations on the benefit headline + body copy so shorter copy no longer creates empty whitespace between content and pricing.
- **Cart / pricing / B2B tier logic untouched.**

**Component-level style alignment (3.4):**

- Mechanical token + spacing migration across the remaining homepage-only components (`KeyBenefits` Desktop + Mobile, `WhyConkaWorks`, `WhatToExpect` Desktop + Mobile, `FoundersSection`, home `LandingFAQ`) to match `/start` patterns — left-aligned headings, `text-black/60` subtitles, accent CTAs, `brand-radius-card` radii. No content rewrites, no structural changes.

**Explicit no-gos held:** Navigation (including the Shop mega-menu) and Footer untouched. Quiz untouched. No protocol content / metafield / pricing changes beyond the variant-picker removal. No `/start` page-level code changes (only backwards-compatible prop additions to shared components).

**Why:** The homepage was drifting behind `/start` on both hero pattern and product-education framing, and the homepage ProductGrid was still offering flow-heavy/clear-heavy variants that will never ship. Reusing the landing components via props avoids a fork, and locking ProductGrid to Balance prepares for Phase 4 (full protocol deprecation).
**Plan:** `docs/development/featurePlans/homepage-upgrade.md` (Phase 3)
**Tickets:** SCRUM-885, SCRUM-886, SCRUM-887, SCRUM-888
**Branch:** `home-page-alingment-and-performance-improvement`

### 2026-04-14 -- Landing page Phase E + iteration: merged WhatItDoes, 100-day guarantee, branded timeline, ProductSplit dropped (SCRUM-877)
Three structural fixes shipped as one PR, plus a heavy iteration pass after the first cut.

**Phase E core (SCRUM-877):**

- **Merged `LandingWhatItDoes` + `LandingWhatsInside`.** The two sections covered the same 3 functional pillars twice — once as generic benefits, once as ingredient evidence. Merged into one component: each tile now carries the WhatItDoes heading + body and slots WhatsInside's ingredient pills + tap-to-reveal study observation + PMID beneath it. `LandingWhatsInside.tsx` and `IngredientAccordion.tsx` deleted (consumed only by the deleted WhatsInside). All `††` EFSA anchors and `¶` observational phrasing ported across without regression. Component became a Client Component for the per-tile expand state. After iteration, ingredient pills moved into the reveal panel (default-collapsed) so collapsed cards show only icon + heading + body + trigger — much lower cognitive load.
- **Resurrected `LandingGuarantee` as a dedicated 100-day section.** Previously dead code. Now wired between Timeline and FAQ with Magic Mind copy adapted to CONKA voice: title "100-Day Risk Free Trial", four-bullet refund mechanic (Free UK shipping, Money back guarantee, No return required, Nothing to lose), CTA "Try it 100% Risk Free Now". `GUARANTEE_DAYS` constant templated throughout (no hardcoded "100"). Phone mockup retained as visual proof — the cognitive score is the receipt that the guarantee is meaningful. Mounted via `next/dynamic`.
- **Branded timeline header asset.** `LandingTimeline` text title swapped for `/story/YourBrainOptimised.jpg` (1125x2250 portrait). Mobile renders full-bleed, edge-to-edge — negative margin + `calc()` width cancels the brand-section mobile gutter, `-mt-20` on the component root cancels the section's mobile padding-top so the asset sits flush with the section start, `aspect-[1/1.9]` trims ~5% off the bottom whitespace. Tablet (md+) keeps a contained 16:6 cropped banner with rounded corners. Desktop (lg+) hides the banner entirely and shows the original "Your Brain, Optimised." h2 + subtitle text with SatWoman.jpg lifestyle image as the right-side sticky sidebar (sr-only h2 on mobile/tablet so the asset image doesn't double up the heading).
- **`AmPmConnector` shared component.** Morning ↔ Afternoon connector strip extracted from inline `LandingProductSplit` markup into a reusable component. Used in both `LandingProductSplit` and the merged `LandingWhatItDoes` (above the bottle tiles).
- **`WhatsInsideProductMini` polish.** Bottle tile backgrounds flipped to white (was `bg-black/[0.02]`). Bottle image rendering aligned with `LandingProductSplit` — same `w-20 h-44 lg:w-32 lg:h-64` container + `scale-150` (was `scale-200` on a smaller container which upsampled visibly). Time badges made explicit ("Take in the morning" / "Take in the afternoon" instead of bare "Morning"/"Afternoon"). Ingredient-list line ("Lemon Balm · Ashwagandha · +4 more...") replaced with benefit-led summary sentences ("Calm focus without caffeine." / "Afternoon clarity ritual.") — observational phrasing, no new claim surface.

**Section composition iteration (heavier than originally scoped):**

- **Removed `LandingProductSplit` from `/start`.** Component file kept on disk in case it returns. Section count drops 10 → 9.
- **Reorder.** `vs Coffee` ↔ `ProductSplit` swap (before ProductSplit was dropped). After ProductSplit removal: `Testimonials` moved up into its slot. Then `Testimonials` ↔ `Guarantee` swapped, putting the guarantee earlier in the page where risk reversal can do more work. Cascade-flipped backgrounds for sections 7-9 so white/tint alternation holds end-to-end with no adjacent same-bg breaks.
- **Final flow (9 sections):** Hero (white) → WhatItDoes merged (tint) → Case Studies (white) → vs Coffee (tint) → 100-Day Guarantee (white) → Timeline (tint) → Testimonials (white) → FAQ (tint) → Disclaimer (white).
- **Landing testimonial headlines overridden.** Loox-imported headlines are the customer's own opening sentence, often long, repetitive, or mid-thought. On the landing carousel, overridden via a name-keyed map in `TestimonialsSection.tsx` to short, varied summary titles ("Sharper training, no crash", "Words just flow", "An edge on the pitch", etc.). Body copy unchanged. Source data untouched.

**Why:** Two of the original 10 sections were duplicative (WhatItDoes/WhatsInside) and the 100-day guarantee — a category-leading differentiator — was buried in trust badges and footnotes. Magic Mind landing page was the reference. Iterative tightening through the build dropped ProductSplit, reordered around the guarantee, and gave the timeline a branded full-bleed header.
**Plan:** `docs/development/featurePlans/landing-and-funnel-page.md` (Phase E, marked Done)
**Claims log:** entries 55-64
**Ticket:** SCRUM-877
**Branch:** `feature/landing-merge-whatItDoes-guarantee`

### 2026-04-13 -- Landing page Phase D: product education polish + Ingredients modal
Three connected pieces on `/start` shipped as one Phase D.

**Product education polish (LandingWhatItDoes):** Section title from "What CONKA does." to "Daily habit. Lifelong benefits." (Magic Mind habit framing per Johnny). Tile descriptions tightened to one scannable sentence each, hedging ("help", "not just") dropped. EFSA Vitamin C `††` anchor retained on Brain Health tile.

**Ingredients modal (new):** Native per-product `IngredientsPanel` launched from outlined "Ingredients" buttons on both `LandingProductSplit` and `LandingWhatsInside` ProductMini tiles. New `app/lib/supplementFacts.ts` data module sourced from `FORMULATION_SPEC.md`. Explicit mg amounts deliberately NOT shipped to the client -- ingredient order (descending concentration, per supplement-facts convention) communicates relative quantity without exposing the formula. Only %NRV retained on Clear's Vit C (3,125%) and B12 (60,000%) to substantiate EFSA claims. Modal uses single-column layout (nutritional disclosure, not a benefits document) with focus management, ESC/backdrop close, body-scroll lock, `role="dialog"` + `aria-modal`. `landing:ingredients_viewed` Vercel Analytics event fires with `source: "product_split" | "whats_inside"` for attribution. Shared `IngredientsButton` extracted to avoid markup duplication.

**Bottle image deblur (LandingProductSplit):** Source PNGs are 1000 x 1000 8-bit colormap with transparent padding around the bottle, so large-render upscaling caused visible banding. Reverted to small container + `scale-150` matching the crisp approach used in `WhatToExpectMobile` / `FormulaToggle` / `ProductMini`. Follow-up: re-export source PNGs to 24-bit full-colour tight-crop as a separate asset task.

**Tile height normalisation (LandingWhatsInside):** `mt-auto` on `IngredientsButton` pins it to the bottom of each ProductMini flex column so Flow and Clear CTAs align horizontally regardless of ingredient-preview text wrap.

**CaseStudiesDataDriven metric labels:** Tile label changed from generic "Change in test score" to metric-specific descriptions of what the Cognetivity CognICA test measures -- "Cognitive function" (Total Score), "Cognitive speed" (Speed), "Cognitive accuracy" (Accuracy). Total Score as a proxy for cognitive function is peer-reviewed (Modarres et al., Front Aging Neurosci 2023, doi:10.3389/fnagi.2023.1243316) and the device is FDA-cleared as a cognitive assessment (21 CFR 882.1470). `^^` test-validation anchor and global disclaimer footer remain.

**Why:** Cold traffic landing on `/start` needed a native path to ingredient transparency without leaving the page, and the competitive IP around formulation concentrations needed protecting. CognICA labels replace a meaningless generic label with the metric the published research actually supports.
**Plan:** `docs/development/featurePlans/landing-and-funnel-page.md` (Phase D)
**Claims log:** entries 44-53
**Branch:** `next-stage-improvements`

### 2026-04-10 -- Landing page: What to Expect timeline + product education (SCRUM-870, SCRUM-871)
Two new sections and one major redesign on `/start`, all driven by Johnny's feedback and Magic Mind as reference.

**What to Expect timeline (SCRUM-870):** Redesigned `LandingTimeline` from vertical-line-and-dots to card-style layout (Day 1, 14 Days, 30 Days). Copy rewritten to feeling-first tone. Desktop shows lifestyle image (SatWoman.jpg) on right. Proof point ("5,000+ cognitive tests across 150+ participants") + CTA + trust badges beneath.

**What CONKA Does (SCRUM-871):** New 3-tile section at position 2 (after Hero, before proof). Mental Performance / Sustained Energy / Brain Health. Cards with icons, brand-h1 headings, 2-sentence descriptions. Claims-compliant (EFSA Vitamin C `††` anchor).

**What's Inside (SCRUM-871):** Replaced `LandingBenefits` with `LandingWhatsInside`. 3 functional ingredient groups (Focus & Clarity, Energy & Resilience, Protection & Recovery) with tap-to-reveal studies per group. Ingredient pills with bold names and dosages. Mini product split (Flow + Clear bottles) on mobile and desktop. Old `LandingBenefits.tsx` deleted.

**Cross-cutting:** All section titles bumped from `brand-h2` to `brand-h1`. Trust badges extracted to shared `LandingTrustBadges` component. Page reordered: product education before case studies. Background alternation maintained across 10 sections.
**Why:** Johnny flagged product education as the biggest gap for cold traffic. "They need to understand what CONKA is before seeing proof."
**Tickets:** SCRUM-870, SCRUM-871
**Plan:** `docs/development/featurePlans/landing-and-funnel-page.md` (Phase A.7-A.9, Phase B)
**Branch:** `what-you-will-feel`, `SCRUM-871`

### 2026-04-09 — Case study showcase update (IP-safe list)
Replaced showcased case study athletes to remove those with team logo IP issues. New highlight list: Jack Willis, Nimisha Kurup, Max Lahiff, Josh Stanton, Ben Cox, Aaron Hope, Shane Corstorphine, Liz Glover (Millie Hammond ready but held back). Added data entries and photos for Ben Cox (Revolut) and Liz Glover (Retired Banker). Updated `featured` flags so `/case-studies` page (desktop carousel + mobile sort) aligns with homepage teaser. Deleted 3 unused legacy components (`CaseStudies.tsx`, `CaseStudiesDesktop.tsx`, `CaseStudiesMobile.tsx`).
**Why:** Several original featured athletes had team logos visible in photos, creating IP risk. Also rebalanced the list to better represent business/corporate users alongside athletes.
**Branch:** `updating-showcased-case-study-data`

### 2026-04-08 — /start performance optimisation (65 → 71, ongoing)
Four rounds of performance work on the ad landing page.

**Round 1 (65 → 69):** Moved page composition from a single `"use client"` wrapper (`StartPageClient`) to a server component so HTML is pre-rendered — eliminated ~2.3s LCP element render delay. Dynamic-imported 5 below-fold sections (ProductSplit, ValueComparison, Benefits, FAQ, CaseStudies) to reduce initial JS bundle. Removed `will-change` and 0ms `reveal-cleanup` animations that caused non-composited animation warnings. Added explicit width/height to footer logo. Removed unused Shopify preconnect hints (cart API is server-side proxied).

**Round 2 (logo + script deferral):** Replaced nav logo `conka.svg` (593KB — embedded raster PNG in an SVG wrapper) with a generated `conka-logo.webp` (7.5KB, 440×112 2x retina), saving 585KB on every page load site-wide. Switched footer logo from `conka.png` (48KB) to the same WebP. Tightened hero image `sizes` attribute. Attempted deferring CookieYes/Klaviyo to `lazyOnload` — insufficient, CookieYes banner still claimed LCP.

**Round 3 (CookieYes LCP fix → 71):** Research showed LCP updates until first user interaction and Lighthouse lab tests have no interaction, so script deferral alone can't prevent CookieYes from claiming LCP. Fixed with two-layer approach: (1) interaction-triggered script loading — CookieYes only loads on scroll/click/touch/keypress with 7s failsafe timeout, (2) CSS `translateY(100%)` on `.cky-consent-container` so banner renders off-screen initially (off-screen elements excluded from LCP by spec), then slides in. Also switched CookieYes dashboard from full-width Banner to Box layout (top-left) to reduce rendered area. Result: LCP element correctly became the hero image. FCP dropped from 3.1s to 1.2s, SI from 6.1s to 4.1s.

**Round 4 (hero + Klaviyo revert):** Added explicit `fetchPriority="high"` to hero image — Lighthouse flagged it as missing despite Next.js `priority` prop (not output in SSR for client components). Reverted Klaviyo from `lazyOnload` back to `afterInteractive` — the change caused 170KB of Klaviyo chunks to load within the desktop measurement window, dropping desktop score from 90 to 80. Klaviyo was `afterInteractive` in the original baseline so reverting doesn't affect mobile gains.

**Why:** `/start` is the primary paid traffic landing page (74% mobile). Score started at 65; currently 71 mobile. Key remaining bottleneck is LCP element render delay (1,120ms) caused by render-blocking CSS.
**Note:** GDPR compliance gap discovered — no consent gating exists for GTM, Meta Pixel, Klaviyo, or Triple Pixel despite cookie policy claiming otherwise. Separate issue from performance.
**Branches:** `second-optimisatio-round`, `third-round-optimisation`, `please-please-please`, `fetch-quick-hero-image`

### 2026-04-08 — Funnel P2: product selection, plan page, upsell, and Evening-to-Afternoon audit
Funnel product selection (Step 1): removed feature-bashing caption, header to "Your CONKA plan", product descriptions rewritten to outcome-focused copy, dynamic CTA showing product name + per-shot price with sub-label. Funnel plan page (Step 2): header to "Your delivery plan", mobile hero removed, per-product accent colors on cadence cards (blue/amber/teal), price anchors switched to £3.75/shot trial pack reference with savings %, dynamic CTA per cadence. Upsell bottom sheet (renamed from UpsellModal): per-shot hero block showing price drop, new copy and benefit bullets, social nudge line, backdrop dismiss separated from decline-to-checkout. Global terminology audit: replaced "Evening" with "Afternoon" for CONKA Clear across 10 files (testimonials untouched).
**Why:** P2 priority work before scaling paid spend. Sharper copy, dynamic pricing CTAs, and per-product visual identity reduce decision fatigue in the funnel. "Afternoon" aligns with updated product positioning.
**Tickets:** SCRUM-862, SCRUM-863, SCRUM-864
**Plan:** `docs/development/featurePlans/landing-page-upgrades.md` (Phases 3-5)
**Branch:** `landing-page-upgrades`

### 2026-04-07 — Homepage performance + brand-base migration
Simplified homepage hero from 4-image carousel to single product image (matching `/start` LandingHero pattern). Removed rotating headline words, desktop/mobile split, and carousel JS. Added `loading="lazy"` to all below-fold images across 7 components (~25 images). Converted raw `<img>` tags to `next/image` in LandingFAQ and KeyBenefitsDesktop. Then migrated all 10 homepage sections from `premium-base.css` to `brand-base.css`: replaced section wrappers, applied white/tint alternating backgrounds, updated all component tokens (74 replacements across 11 files), moved WhyConkaWorks from dark to light background, left-aligned all headers, updated radius values (32/24/16px), and applied accent-only CTA buttons.
**Why:** Homepage was visually inconsistent with `/start` landing page (different design system, dark sections, centred headers, pill buttons). Carousel added JS weight and 3 unnecessary image requests. Homepage is the primary organic entry point and needed to match the brand standard.
**Tickets:** SCRUM-855, SCRUM-856
**Plan:** `docs/development/featurePlans/homepage-upgrade.md`
**Migration tracker:** `docs/development/WEBSITE_STYLING_MIGRATION.md`

### 2026-04-07 — /start mobile performance optimization
Lighthouse mobile score was 63/100 with 9.2s LCP. Added AVIF/WebP image formats and cache config to `next.config.ts`. Lazy-loaded below-fold images (FlowHold 658KB, ClearDrink, AppConkaRing). Trimmed legacy Google Font weights (Syne, DM Sans, Caveat, IBM Plex Mono) to only weights actually used. Deferred Triple Pixel from `afterInteractive` to `lazyOnload`. Added preconnect hints for GA and Meta domains. Replaced inline hero animation styles with CSS classes. Updated `/implement` and `/review` skills with performance-conscious defaults.
**Why:** Performance is the highest-leverage CRO fix for the primary paid traffic landing page (74% mobile). Prerequisite for Phase 1 benefits redesign (SCRUM-850).
**Ticket:** SCRUM-852
**Plan:** `docs/development/featurePlans/landing-benefits-redesign.md` (Phase 0)

### 2026-04-02 — Landing page visual system
Replaced the heavy black/neutral section backgrounds with a single subtle tint (`#f4f5f8`). CTA buttons now use brand accent (`#4058bb`). Established 4-tier text colour system (100/80/60/40%), consistent heading spacing (`mb-10`), and killed all inline style opacity. Product split cards now show individual bottle images instead of shared AM/PM lifestyle shot. Footnote anchors styled as muted superscript.
**Why:** Competitive analysis (Headstrong, Overload, AG1, Magic Mind) showed the page was too heavy. Evidence-based approach documented in `docs/branding/LANDING_PAGE_VISUAL_SYSTEM.md`.
**PR:** #150

### 2026-04-01 — Testimonial section on homepage
Testimonial heading/subtitle now inherit text colour from the parent section background.
**PR:** #149

### 2026-04-01 — Funnel CRO optimisation (3 phases)
Reordered funnel to Product > Cadence > Checkout. Reworked upsell logic. Hardened copy across landing and funnel pages. Migrated landing + funnel from `premium-base.css` to `brand-base.css`. Fixed compliance, alt text, and anchor consistency.
**Why:** Conversion rate optimisation following initial funnel build.
**PR:** #148

### 2026-04-01 — Cookie consent banner
Added CookieYes consent banner for GDPR compliance.
**PR:** #146

### 2026-04-01 — Legal pages
Created terms, privacy policy, and cookies pages. Updated contact email to info@conka.io.
**Why:** Legal requirement before running paid traffic.
**PR:** #145

### 2026-04-01 — Landing page code quality
Review-driven cleanup: guarantee mismatch fix, noindex added, server component conversion, code quality pass.
**PR:** #144

---

## March 2026

### 2026-03-31 — Brand guidelines integration
New `brand-base.css` design system tokens. Added Neue Haas Grotesk and JetBrains Mono fonts. Created claims compliance doc, brand voice doc, quality standards. Established local rules for components and pages.
**Why:** New brand direction from marketing. Previous system (`premium-base.css`) was ad-hoc. Needed a single source of truth.
**PR:** #143

### 2026-03-31 — Development workflow improvement
Added quality standards doc. Enforced mobile-first across workflows. Added brand voice, code review, UX iteration, and Jira workflow docs.
**PR:** #142

### 2026-03-30 — Funnel bug fixes (Henry feedback)
Fixed offer constants, icons, copy, and count display issues flagged during internal review.
**PR:** #141

### 2026-03-27 — Funnel page UX iteration
Better styling, layout, pre-selection defaults, copy refinement, upsell improvements. Integrated real Shopify product data for Flow/Clear monthly variants.
**Why:** Iterating toward launch-ready state after initial build.
**PRs:** #137, #138, #139, #140

### 2026-03-25-26 — Funnel page built
Multi-step paginated funnel (Plan > Product > Checkout). Standalone data layer (`funnelData.ts`), isolated checkout flow (`funnelCheckout.ts`), step indicator, upsell modal, analytics events. Mobile-first.
**Why:** January Brands workshop identified frictionless funnel as the primary conversion lever. Overload/Fussy pattern.
**PR:** #137

### 2026-03-25 — Landing page built
8-section landing page at `/start` for paid Meta traffic. Hero, benefits, product split, what's inside, testimonials, guarantee, case studies, FAQ. All CTAs point to `/funnel`. Noindex.
**Why:** Paid traffic needs a dedicated conversion page, not the homepage.
**PR:** #136

### 2026-03-24 — Website simplification plan
Created `WEBSITE_SIMPLIFICATION_PLAN.md` and `CONKA_BUSINESS_CONTEXT.md` documenting the pivot from protocols to Flow/Clear/Both.
**Why:** January Brands workshop. Protocols are too confusing, killing conversion from paid traffic.

### 2026-03-13 — Customer portal aligned to Loop
Added cancellation modal with winback discount, reorder for single products, apply discount code functionality.
**Why:** Aligning the customer portal to Loop's subscription management features.
**PR:** #135

---

## February 2026

### 2026-02-20-27 — Customer portal, app page, abandoned cart
Customer portal with order history, subscription editing, payment methods. Full app page with cognitive test integration. Abandoned cart Klaviyo flow. Our Story page refactor.
**PRs:** #99-119

### 2026-02-16-19 — Homepage refactor
Athlete credibility carousel, product grid, formula benefits with ingredient images, case study redesign, hero banner carousel, what-to-expect timeline, founders section, FAQ.
**Why:** Complete visual overhaul of the homepage after product page work was done.
**PRs:** #81-98

### 2026-02-10-13 — Product and protocol page refactors
Meta Pixel + CAPI analytics. Conka Flow product page redesign. Protocol page full refactor with premium styling.
**PRs:** #61-80

### 2026-02-03-09 — Product page redesign and design system
Created `premium-base.css` design token system. Product page structure, image slideshow, testimonial strip, what-to-expect timeline.
**Why:** Moving from ad-hoc styling to a consistent design system.
**PRs:** #51-60

---

## January 2026

### 2026-01-27-31 — B2B professionals portal
Full B2B purchasing portal with individual/team modes, tier pricing system, cart tier normalisation, VAT pricing.
**PRs:** #39-50

### 2026-01-20-26 — Navigation rebuild and analytics
Navigation refactored into sub-components. Shop mega menu. Add-to-cart source tracking, quiz session ID capture. Barry campaign page.
**PRs:** #25-38

### 2026-01-13-19 — Launch polish
Founding members banner, hero overhaul, buy-now funnel, Trustpilot reviews, shop overview page.
**PRs:** #14-24

### 2026-01-06-12 — Science page and launch
Science page with embedded Cognica cognitive test SDK, email capture, Klaviyo integration. Nike QR campaign pages. Privacy policy, favicon, payment logos.
**PRs:** #1-13
