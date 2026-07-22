import type { ListicleConfig, ListicleReview } from "./listicle-types";
import type { Testimonial } from "@/app/components/testimonials/types";
import { CURATED_TESTIMONIALS } from "@/app/lib/customerTestimonials";

/** Map a curated DTC testimonial onto the listicle review card shape */
function toReview(t: Testimonial, limit = 220): ListicleReview {
  return {
    headline: t.headline,
    quote:
      t.body.length > limit ? `${t.body.slice(0, limit).trimEnd()}...` : t.body,
    name: t.name,
    detail: t.productLabel ? `Verified · ${t.productLabel}` : "Verified customer",
  };
}

const byName = (name: string) =>
  CURATED_TESTIMONIALS.find((t) => t.name === name)!;

/**
 * Reference listicle config. Placeholder copy throughout: the structure
 * is the deliverable. To create a real persona listicle, copy this file,
 * swap the copy and assets, and register the new config in index.ts.
 *
 * Zone grammar (from the IM8 reference, see listicle-blueprint.md):
 * hero hook → proof ticker → numbered reasons with bands woven in →
 * bridge CTA → buy box → trust carousel → comparison → review wall →
 * cost breakdown → FAQ, with a fixed bottom bar anchoring to #product.
 */
export const listicleTemplate: ListicleConfig = {
  slug: "listicle-template",
  persona: "template",
  format: "listicle",
  template: "im8",
  title: "6 reasons placeholder headline",
  hero: {
    laurel: {
      eyebrow: "Placeholder eyebrow",
      body: "Placeholder credibility badge line lorem ipsum dolor sit amet.",
    },
    headline:
      "6 Reasons Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod",
    subcopy:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    socialProof: {
      label: "Excellent 4.7",
      sub: "622+ reviews · 5,000+ daily users",
    },
    cta: "Placeholder primary CTA",
    trustPills: [
      { label: "Informed Sport Certified", icon: "informed-sport" },
      { label: "100-day guarantee", icon: "guarantee" },
      { label: "Third-party tested", icon: "batch-tested" },
    ],
    asset: {
      kind: "image",
      src: "/formulas/both/BoxIngredientHero.png",
      alt: "CONKA Flow and Clear shots with their ingredients",
      aspect: "2528/1696",
    },
  },
  ticker: [
    "MADE IN THE UK",
    "INFORMED SPORT CERTIFIED",
    "100-DAY GUARANTEE",
    "UNIVERSITY RESEARCH",
    "THIRD-PARTY TESTED",
  ],
  body: [
    {
      kind: "reason",
      n: 1,
      tag: "PLACEHOLDER TAG",
      headline: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing",
      body: "Problem paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit. Solution paragraph sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, mapping named ingredients to the pain.",
      chips: ["250mg placeholder", "+40% placeholder"],
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Lifestyle photo + floating review chip",
      },
    },
    {
      kind: "reason",
      n: 2,
      tag: "PLACEHOLDER TAG",
      headline: "Sed Do Eiusmod Tempor Incididunt Ut Labore",
      body: "Problem paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit. Solution paragraph sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      asset: {
        kind: "statPanel",
        tone: "dark",
        eyebrow: "PLACEHOLDER STAT PANEL",
        stats: [{ label: "Lorem ipsum", from: "25mg", to: "100mg", delta: "+300%" }],
        footer: "Placeholder footer line",
      },
    },
    {
      kind: "statsBand",
      eyebrow: "CLINICALLY PROVEN",
      stats: [
        { value: "+14.86%", label: "Sharper thinking vs placebo" },
        { value: "80%", label: "Improved cognitive scores" },
        { value: "+19.3%", label: "Sharper focus in pro athletes" },
        { value: "75%", label: "Improved in under 3 weeks" },
      ],
      footnote:
        "*From CONKA cognitive trials, including a 6-week randomised double-blind placebo-controlled trial with 29 professional rugby players.",
    },
    {
      kind: "reason",
      n: 3,
      tag: "PLACEHOLDER TAG",
      headline: "Ut Enim Ad Minim Veniam, Quis Nostrud",
      body: "Problem paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit. Solution paragraph sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      asset: {
        kind: "statPanel",
        tone: "light",
        eyebrow: "PLACEHOLDER LIGHT PANEL",
        stats: [
          { label: "Lorem ipsum", to: "Placeholder" },
          { label: "Dolor sit", to: "Placeholder" },
          { label: "Amet elit", to: "Placeholder" },
        ],
      },
    },
    {
      kind: "reason",
      n: 4,
      tag: "PLACEHOLDER TAG",
      headline: "Duis Aute Irure Dolor In Reprehenderit",
      body: "Problem paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit. Solution paragraph sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      chips: ["Placeholder chip"],
      asset: { kind: "placeholder", aspect: "4/3", note: "Product photo" },
    },
    {
      kind: "reviewStrip",
      reviews: [
        toReview(byName("Jack G.")),
        toReview(byName("Phil B.")),
        toReview(byName("Alex L.")),
      ],
    },
    {
      kind: "reason",
      n: 5,
      tag: "PLACEHOLDER TAG",
      headline: "Excepteur Sint Occaecat Cupidatat Non Proident",
      body: "Problem paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit. Solution paragraph sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "App screenshot / data visual",
      },
    },
    {
      kind: "reason",
      n: 6,
      tag: "PLACEHOLDER TAG",
      headline: "Sunt In Culpa Qui Officia Deserunt Mollit",
      body: "Problem paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit. Solution paragraph sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      chips: ["Placeholder chip", "Placeholder chip"],
      asset: {
        kind: "placeholder",
        aspect: "4/3",
        note: "Certification badge + ambassador chip",
      },
    },
  ],
  bridge: {
    headline: "Placeholder bridge line lorem ipsum dolor sit amet",
    cta: "Placeholder bridge CTA",
  },
  product: {
    headline: "Placeholder Product Section Headline",
    subline: "Placeholder customer-count subline lorem ipsum dolor",
    productHeroId: "03",
  },
  trustCarousel: true,
  reviewsCarousel: true,
  // Canonical FAQ ids (see app/lib/faqContent.ts), curated per persona in
  // display order. Swap for the ids that fit this landing's audience.
  faqIds: ["different", "caffeine", "results", "how-to-take", "guarantee", "delivery"],
  stickyBar: {
    label: "Placeholder sticky bar line",
    cta: "Get started",
    sub: "Placeholder offer",
  },
};
