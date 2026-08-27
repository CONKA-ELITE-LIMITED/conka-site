# Conka Website — Merged Changes: January & February 2026

119 PRs merged across 8 weeks. Organised week-by-week with interpreted purpose.

---

## JANUARY 2026 (50 PRs)

### Week 1: Jan 6–12 (11 PRs) — Science Page Launch & Foundation

| Date | PR | Summary |
|------|-----|---------|
| Jan 7 | #1 | **Science page: email capture foundation** — Email capture form, cognitive test section, desktop/mobile split layout |
| Jan 7 | #2 | **Science page: WebSDK integration (desktop)** — Embedded Cognica cognitive test SDK on the science page |
| Jan 8 | #3 | **Science page: post-test results** — Results display after cognitive test: scores, recommendations, loader, idle states |
| Jan 8 | #5 | **Science page: mobile view** — Responsive mobile layout for the cognitive test SDK and science components |
| Jan 9 | #6 | **Klaviyo web test flow integration** — Track cognitive test completions via Klaviyo API calls |
| Jan 9 | #8 | **Nike leaflet QR pages** — Campaign landing pages with Klaviyo subscribe-to-win list, email capture, campaign tracking |
| Jan 11 | #7 | **WebSDK science integration (final)** — Styling polish, colour accents, icons, mobile dynamic rendering |
| Jan 11 | #10 | **Bug fix: win form entry** — Fixed Convex error handling (return false instead of throw) |
| Jan 12 | #11 | **Privacy policy page** — Added Conka app privacy policy page |
| Jan 12 | #12 | **Favicon & meta images** — Replaced favicon, added Apple touch icon, social sharing meta images |
| Jan 12 | #13 | **Payment logos on checkout** — Added payment method logos to protocol purchase sections (desktop & mobile) |

### Week 2: Jan 13–19 (11 PRs) — Launch Polish & Conversion Optimisation

| Date | PR | Summary |
|------|-----|---------|
| Jan 13 | #14 | **Founding members banner** — Countdown banner with urgency colouring (<50 spots = red), clipboard referral, Google site verification |
| Jan 13 | #15 | **Product bug fixes** — Spacing fixes, banner config update (200 limit, 42 taken), removed AZ consultant reference |
| Jan 13 | #16 | **Bug fix: wrong discount code** — Quick code correction |
| Jan 13 | #17 | **Hero section overhaul** — New hero image, thinner nav, simplified hero without cards, cleaner benefit display |
| Jan 13 | #18 | **Buy now funnel** — Smooth-scroll anchor to trial pack, single CTA button, "Take our quiz" in header, above-the-fold hero on mobile |
| Jan 14 | #19 | **Content & visual wins** — Founder images on homepage, walnut ingredient asset, clinical copy (replacing "commentary"), centered benefits |
| Jan 14 | #20 | **Trustpilot reviews section** — Review cards with read-more, scroll indicators, shuffled cards, replaced "conka" with "CONKA" branding |
| Jan 14 | #21 | **Testimonial upgrade** — Added "Verified Customer" badge to testimonial cards |
| Jan 14 | #22 | **Misc upgrades** — Hero spacing, ingredient carousel with actual images, redirect setup, new app page placeholder |
| Jan 17 | #23 | **Shop overview page** — New shop page with protocol asset cards, better mobile card layout, pricing display |
| Jan 17 | #24 | **Simplified protocol view** — Replaced complex protocol page with simplified grid view, fixed trial pack pricing |

### Week 3: Jan 20–26 (14 PRs) — Navigation Rebuild & Analytics Foundation

| Date | PR | Summary |
|------|-----|---------|
| Jan 19 | #25 | **Subscription wording** — Changed to "forever" subscription language, lowered count baseline |
| Jan 20 | #26 | **Trial pack anchor** — Better scroll-to-trial-pack behaviour |
| Jan 20 | #27 | **Buy now → trial pack link** — Navigate to trial packs from buy-now section |
| Jan 22 | #28 | **Ingredient image fix** — Better scaling of ingredient images, removed Conka Clear placeholder |
| Jan 22 | #29 | **Navigation component refactor** — Broke monolithic nav into sub-components, fixed case-sensitive directory issues for Vercel |
| Jan 22 | #30 | **Nav reorder** — New nav order: Logo → Shop → Nav pages → Space → Quiz → Account → Cart |
| Jan 22 | #31 | **Desktop shop-all RHS + Why Conka page** — Shop expansion anchored right, created new Why Conka page with hero and data |
| Jan 22 | #32 | **Desktop "Help me choose" section** — 2-column section with quiz CTA and learn-more links |
| Jan 22 | #33 | **Mobile view upgrade** — Coloured formula images, protocol image config, formula-specific product grouping |
| Jan 23 | #34 | **Huel-style shop opener** — Smooth scroll/zoom product showcase, better quiz sizing, half-desktop nav improvements |
| Jan 26 | #35 | **Analytics foundation (SCRUM-697)** — Add-to-cart source tracking, quiz session ID capture, source from hero/footer/homepage |
| Jan 26 | #36 | **Vercel drain bug fix** — Fixed drain setup error response |
| Jan 26 | #37 | **Vercel drain logging** — Store drain data as Vercel logs |
| Jan 26 | #38 | **Barry sign-up page** — Campaign landing page with email form, stats, responsive cards |

### Week 4: Jan 27–31 (13 PRs) — B2B Portal Build & Pricing

| Date | PR | Summary |
|------|-----|---------|
| Jan 27 | #39 | **Barry Klaviyo discount** — Wired up discount code via Klaviyo, added permanent redirect |
| Jan 28 | #40 | **B2B gateway page** — Professionals landing with mode-selection cards (individual/team), new nav entry |
| Jan 28 | #41 | **B2B individual page** — Individual practitioner purchasing with formula sections, case studies, product selector |
| Jan 28 | #42 | **B2B team purchasing** — Team purchasing page with section components, tier system, mobile toggle |
| Jan 28 | #43 | **B2B business page (SCRUM-699)** — Full business page, clickable cards, page-level toggle, mobile view |
| Jan 29 | #44 | **B2B style picker refactor** — Protocol schedule calendar, formula info sections, tier key, individual-to-team flow |
| Jan 29 | #45 | **B2B price & message alignment** — Tier labels, new product data mapping, science section on practitioner page |
| Jan 29 | #46 | **B2B feedback round** — Visual UX improvements, font styling, tier key rendering |
| Jan 30 | #47 | **Cart tier normalisation** — Brick system for tier visualisation, tier updates on cart add/remove, documentation |
| Jan 30 | #48 | **Pricing & copy updates** — Better copy, estimated shipping, font updates, brick count colouring in cart |
| Jan 30 | #49 | **B2B product & copy alignment** — Better mobile spacing, visual hierarchy improvements |
| Jan 31 | #50 | **VAT pricing & cart message** — Clear pricing tier messages in cart, volume tier key, new page paths and naming |

---

## FEBRUARY 2026 (69 PRs)

### Week 5: Feb 3–9 (10 PRs) — Product Page Redesign & Style System

| Date | PR | Summary |
|------|-----|---------|
| Feb 3 | #51 | **Footer component extraction (SCRUM-695)** — Extracted footer into reusable component with Klaviyo submit, applied across all pages |
| Feb 4 | #52 | **Shop page fixes** — More robust mounting, clickable cards, mobile nav header fix, protocol image config |
| Feb 6 | #53 | **Product page RHS simplification** — Cleaner info ordering, discount cost formatting |
| Feb 6 | #54 | **Product images & selector (SCRUM-715)** — New product assets, iM8-style hero image slideshow, pack selector styling |
| Feb 6 | #55 | **Purchase sticky footer cleanup** — Cleaner mobile/desktop sticky footer, redirects from old formula pages to new ones |
| Feb 9 | #56 | **Premium style sheet creation** — New `premium-base.css` design tokens and style guide documentation |
| Feb 9 | #57 | **Product page structure** — High-level product page layout with placeholder flow, grey background treatment |
| Feb 9 | #58 | **Single product page style refactor** — New colour palette, compact layout, better spacing and button styling |
| Feb 9 | #59 | **Testimonial strip** — New auto-scrolling testimonial strip component for product pages |
| Feb 9 | #60 | **What-to-expect timeline** — Timeline section with colour hover, mobile/desktop views, product-specific content |

### Week 6: Feb 10–13 (17 PRs) — Conka Flow & Protocol Page Refactors

| Date | PR | Summary |
|------|-----|---------|
| Feb 10 | #61 | **Meta analytics (SCRUM-718)** — Meta Pixel + CAPI implementation: PageView, ViewContent, AddToCart, InitiateCheckout with deduplication |
| Feb 10 | #62 | **"What Conka solves" section** — Struggle selector with formula colours, desktop/mobile views, testimonial integration |
| Feb 10 | #63 | **Ingredients section refactor** — Premium section headings, better ingredient styling and layout |
| Feb 10 | #64 | **How-it-works refactor** — Formula-specific colours and content, better steps layout, Conka Clear taste info |
| Feb 10 | #65 | **Testimonials & customer count** — Curated testimonial list, review workflow, cleaned up dead code |
| Feb 10 | #66 | **Case study cleanup** — Editorial quote integration, logos, sticky footer colouring |
| Feb 10 | #67 | **Conka Flow page refactor** — Mobile-optimised layout, horizontal carousel, compact logic, better styling |
| Feb 11 | #68 | **Protocol page style refactor** — Premium styling applied, tier selector upgrade |
| Feb 11 | #69 | **Protocol page: upgrade existing sections** — New colour scheme, formula showcase, tier picker with grey background |
| Feb 11 | #70 | **Protocol page: new sections** — New hero assets, gradients, navigation images, removed legacy assets |
| Feb 11 | #71 | **Protocol solution & problem section** — Toggle-based explanation, simplified rendering, updated copy |
| Feb 12 | #72 | **Standard solution section** — Comparison table, protocol accent colours, white glow effect |
| Feb 12 | #73 | **Protocol timeline** — What-to-expect timeline per protocol, product/protocol accent colours, mobile 3-step limit |
| Feb 12 | #74 | **Protocol card refactor** — Expanded image cards with better content styling |
| Feb 12 | #75 | **Mobile adjustments** — Paginated components, centered content, white backgrounds, better styling |
| Feb 12 | #76 | **FAQ section** — FAQ and cross-sell components on protocol pages |
| Feb 12 | #77 | **Protocol page refactor wrap-up (SCRUM-720)** — Cross-sell components, testimonials, feature documentation |
| Feb 13 | #78-79 | **Style sheet updates (SCRUM-703)** — Cross-sell logic fixes, mobile/desktop subheadlines, horizontal scroll prevention |
| Feb 13 | #80 | **New assets & helpers** — Tube assets, protocol tier package labels, shots-per-week and cost helpers |

### Week 7: Feb 16–19 (18 PRs) — Landing Page Refactor & Visual Overhaul

| Date | PR | Summary |
|------|-----|---------|
| Feb 16 | #81 | **Testimonial refactors** — Product accent colours on testimonials, protocol review interweaving, filter capability |
| Feb 17 | #82 | **Athlete social proof** — Athlete credibility carousel with left/right toggles, testimonial assets |
| Feb 17 | #83 | **Product grid section** — New product grid with dot indicators, mobile grid, tablet styling, replaced legacy protocol grid |
| Feb 17 | #84 | **Trial pack section** — Simplified trial pack display, pill buttons, assurance messaging |
| Feb 18 | #85 | **Formula benefits refactor** — Dynamic image sections, athlete slides, neuro-blue colour scheme, animated text mounting |
| Feb 18 | #86 | **Case study section refactor** — Dark neuro-blue background, mobile cards, how-it-works desktop/mobile views, logos |
| Feb 18 | #87 | **Case study landing upgrade** — Tablet views, hero tablet layout, trust icons, stat rendering |
| Feb 18 | #88 | **Landing page refactor (SCRUM-721)** — Formula toggle scroll, tablet breakpoint support, product grid tablet view |
| Feb 18 | #89 | **Minor fixes** — Removed editorial carousel, case study asset fixes, pack size additions |
| Feb 18 | #90 | **Bug fix: add-to-cart & subscribe toggle** — Fixed add-to-cart logic, subscribe toggle shows price permanently |
| Feb 18 | #91 | **Price display fix** — Extracted pricing calculations into functions, player cards with overlays, benefit styling |
| Feb 19 | #92 | **"What is Conka" section** — Condensed info section with stats on product card, replaced legacy section |
| Feb 19 | #93 | **Product page backgrounds** — Subtle background colour rhythm, updated colour palette, cleaned up unused assets |
| Feb 19 | #94 | **Protocol product page improvements** — Softer palette, cycle trap/break sections with neuro-blue backgrounds |
| Feb 19 | #95 | **Formula benefits aligned to key benefits** — Sticky left/scroll right layout, ingredient image mapping, struggle-outcome content |
| Feb 19 | #96 | **Updated hero assets** — 2-image rotation with 8-second delay, new banner image |
| Feb 19 | #97 | **About us & FAQ upgrade** — Founder section, "Why athletes trust Conka", landing FAQ, view-more-packs CTA |
| Feb 19 | #98 | **Hero banner carousel** — 3-asset mobile hero, shared breakpoint logic, desktop/mobile hero views |

### Week 8: Feb 20–27 (19 PRs) — Landing Completion, App Page & Customer Portal

| Date | PR | Summary |
|------|-----|---------|
| Feb 20 | #99 | **Timeline on landing page** — What-to-expect timeline, how-to-take with circle assets, background rhythm improvements |
| Feb 20 | #100 | **Replace timeline with what-to-expect** — Conditional toggle, product-specific what-to-expect section |
| Feb 20 | #101 | **Hero copy upgrade** — New hero assets (box, bottles, shots), how-it-works + benefit stats, mobile assets |
| Feb 20 | #102 | **Cross-sell refactor** — Replaced legacy cross-sell with reusable product grid, dynamic copy, deleted old components |
| Feb 20 | #103 | **Merge check** — Adding asset |
| Feb 20 | #104 | **Minor UI fixes** — Reduced padding, clickable images navigate to product |
| Feb 23 | #105 | **Abandoned cart trigger** — Klaviyo abandoned cart flow integration, cart logic updates, page redirects |
| Feb 23 | #106 | **Scroll hijack / app lock section** — Sticky phone mockup section, app screenshots carousel, phone frame assets |
| Feb 24 | #107 | **App hero section** — App download section, "for subscribers" section |
| Feb 24 | #108 | **Redirects** — Redirect from /help to account login page |
| Feb 25 | #109 | **Customer portal: payment details** — Order cards, order summary stats, help card, empty state, utility components |
| Feb 25 | #110 | **Customer portal: minor upgrades** — Edit subscription modal styling, product images, empty order state |
| Feb 25 | #111 | **Edit subscription modal** — Subscription type detection, plan logic with neuro-blue styling, modal behaviour |
| Feb 25 | #112 | **App page (SCRUM-723)** — Full app page with Conka App nav entry, neuro-blue table, section styling |
| Feb 25 | #113 | **Subscription frequency fix** — Payment methods via Loop, support email updates, customer portal accuracy |
| Feb 26 | #114 | **Blogs → landing redirects** — Legacy blog redirects to Why Conka, support email API, simplified mobile banner |
| Feb 26 | #115 | **Product → Conka Flow redirect** — Permanent redirect from old product pages to Conka Flow |
| Feb 26 | #116 | **App page mobile view** — Mobile layout with formula toggle, gradient buttons, anchor sections |
| Feb 26 | #117 | **Tablet nav/hero breakpoint** — Larger breakpoint for nav and banner on tablets |
| Feb 26 | #118 | **Our Story page refactor** — Updated to premium styling, hero section for desktop/mobile |
| Feb 27 | #119 | **Documentation update** — Removed legacy docs, added Loop subscription references |

---

## Summary by Theme

| Theme | PRs | Weeks Active |
|-------|-----|--------------|
| **Science / Cognitive Test** (WebSDK, results, Klaviyo) | #1-8 | 1 |
| **Launch Polish** (favicon, hero, founding members, buy-now funnel) | #10-22 | 2 |
| **Navigation Rebuild** | #29-34 | 3 |
| **Analytics** (Vercel drain, source tracking, Meta Pixel/CAPI) | #35-37, #61 | 3, 6 |
| **Campaign Pages** (Barry, Nike QR) | #8, #38-39 | 1, 3-4 |
| **B2B / Professionals Portal** | #40-50 | 4 |
| **Design System** (premium-base.css, style guide) | #56, #78-79 | 5, 6 |
| **Product Page Redesign** (Conka Flow) | #53-55, #57-60, #62-67 | 5-6 |
| **Protocol Page Refactor** | #68-77 | 6 |
| **Landing Page Refactor** | #81-101 | 7-8 |
| **Customer Portal** | #109-113 | 8 |
| **App Page** | #106-107, #112, #116 | 8 |
| **Abandoned Cart** (Klaviyo flow) | #105 | 8 |
| **Redirects & Cleanup** | #108, #114-115, #118-119 | 8 |
