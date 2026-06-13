/**
 * Listicle landing config (/go/[slug], format: "listicle").
 *
 * Blueprint: docs/development/featurePlans/landing-conversion/listicle-blueprint.md
 * Zones are fixed in order (hero → reasons → product → trust carousel →
 * comparison → review wall → cost breakdown → FAQ); the `body` array is
 * ordered so stat bands and review strips can be woven between reasons
 * at any position. Section types harden as each zone is built out from
 * the skeleton; the buy box resolves pricing from funnelData, not config.
 */

import type { ProductHeroId } from "../productTypes";

export type ListicleAsset =
  | {
      kind: "image";
      src: string;
      alt: string;
      aspect?: string;
      /** "contain" (default) for renders/PNGs, "cover" for photos */
      fit?: "cover" | "contain";
    }
  /** Silent autoplay loop (no controls), the IM8 reason-video pattern */
  | { kind: "video"; src: string; aspect?: string }
  /** The Fig. 01 coffee-vs-CONKA energy curves card (LandingValueComparison) */
  | { kind: "valueChart" }
  | {
      kind: "statPanel";
      tone: "dark" | "light";
      eyebrow: string;
      stats: { label: string; from?: string; to: string; delta?: string }[];
      footer?: string;
    }
  /** Labelled grey block at the right aspect ratio — framework phase */
  | { kind: "placeholder"; aspect: string; note: string };

/** Icon keys for the under-CTA trust chips; mapped to SVGs in the renderer */
export type TrustPillIcon =
  | "no-caffeine"
  | "informed-sport"
  | "guarantee"
  | "shipping"
  | "batch-tested"
  | "cancel";

export interface ListicleReview {
  /** Bold one-liner above the quote */
  headline?: string;
  quote: string;
  name: string;
  /** Role or verification line, e.g. "Verified customer" */
  detail?: string;
}

export type ListicleBodyBlock =
  | {
      kind: "reason";
      n: number;
      /** Mono category tag above the headline, e.g. "FOCUS" */
      tag?: string;
      headline: string;
      /** Problem-validate paragraph, then solution; one string for now */
      body: string;
      /** Pill callout chips under the body, e.g. "250mg citicoline" */
      chips?: string[];
      asset: ListicleAsset;
    }
  | {
      kind: "statsBand";
      eyebrow: string;
      stats: { value: string; label: string }[];
      footnote?: string;
    }
  | {
      kind: "reviewStrip";
      /** Mono eyebrow above the strip (default "What Customers Say") */
      eyebrow?: string;
      /** Rating line under the strip (default "Rated 4.7 / 5 · 622+ reviews") */
      ratingSummary?: string;
      reviews: ListicleReview[];
    }
  | {
      kind: "quoteBand";
      eyebrow: string;
      quote: string;
      name: string;
      detail?: string;
    };

export interface ListicleConfig {
  slug: string;
  /** Ad persona this page targets; tagged on every analytics event */
  persona: string;
  format: "listicle";
  /** Page title and Meta content_name */
  title: string;
  hero: {
    /** Laurel-flanked credibility chip above the headline (IM8 pattern) */
    laurel?: { eyebrow: string; body: string };
    headline: string;
    subcopy: string;
    /** Avatar + star micro-row (LandingHero pattern), e.g.
     *  { label: "Excellent 4.7", sub: "622+ reviews · 5,000+ daily users" } */
    socialProof?: { label: string; sub: string };
    /** Primary CTA; anchors to #product */
    cta: string;
    /** Trust chips under the CTA; each gets its own meaningful icon */
    trustPills?: { label: string; icon: TrustPillIcon }[];
    asset: ListicleAsset;
  };
  /** Marquee proof ticker items below the hero */
  ticker?: string[];
  /** The listicle core: reasons with bands/strips woven between */
  body: ListicleBodyBlock[];
  /** Dark CTA card bridging the last reason into the product zone */
  bridge?: { headline: string; cta: string };
  /** Buy box zone (#product anchor). Renders the shared ProductHero;
   *  pricing/variants resolve via cadenceData from the hero id. */
  product: {
    headline: string;
    subline?: string;
    /** Which product the buy box sells ("01" Flow, "02" Clear, "03" Both) */
    productHeroId?: ProductHeroId;
  };
  /** Renders the shared AthleteCredibilityCarousel (own header/content) */
  trustCarousel?: boolean;
  /** Renders the shared CROTestimonials carousel + LandingTrustBadges */
  reviewsCarousel?: boolean;
  /** Deferred from v1 until competitor numbers are sourced; omit to skip */
  comparison?: {
    eyebrow: string;
    headline: string;
    subline?: string;
    competitorLabel: string;
    rows: {
      label: string;
      /** Our cell: dose/value plus optional "+X% more" delta badge */
      us: string;
      usDelta?: string;
      them: string;
    }[];
    footnote?: string;
  };
  /** Deferred from v1 until stack prices are sourced; omit to skip */
  costBreakdown?: {
    claim: string;
    /** Circular badge copy, e.g. "Save £400+/yr" */
    savingsBadge?: string;
    lineItems: { label: string; price: string }[];
    totals: { themLabel: string; them: string; usLabel: string; us: string };
    cta?: string;
  };
  faq: { q: string; a: string }[];
  /** Fixed bottom bar anchoring to #product */
  stickyBar?: { label: string; cta: string; sub?: string };
}
