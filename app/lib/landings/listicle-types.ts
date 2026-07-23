/**
 * Listicle landing config (/go/[slug], format: "listicle").
 *
 * A listicle page picks a TEMPLATE. There are two, each with its own config
 * shape so a config only ever carries the fields its template renders:
 *
 *   template: "im8" -> ListicleRenderer. The dense layout: a product-image
 *     hero, a proof ticker, and a plug-and-play library of section blocks
 *     (data-viz reason panels, stat bands, comparison tables, cost breakdown).
 *
 *   template: "mm"  -> SimpleListicleRenderer. The Magic Mind editorial layout:
 *     a headline + byline hero, and reasons that are simply photo + heading +
 *     body, with a buy box woven in. Nothing between the reasons.
 *
 * Shared fields (title, trust flags, FAQ, sticky bar) live in ListicleBase.
 * The route narrows on `template` and hands each renderer its exact type.
 *
 * Blueprint: docs/development/featurePlans/landing-conversion/listicle-blueprint.md
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
      /** CSS object-position for the cover crop (e.g. "center top"). Default center. */
      objectPosition?: string;
    }
  /** Silent autoplay loop (no controls), the IM8 reason-video pattern.
   *  fit "contain" centres the clip in a full-width black tile (for product
   *  renders); default "cover" keeps the inset 4/5 frame (for texture loops). */
  | { kind: "video"; src: string; aspect?: string; fit?: "cover" | "contain" }
  /** "Skip the 2pm crash" curve + cost table (CrashChart). Figures default
   *  from landingPricing; override per page. */
  | {
      kind: "crashChart";
      saving?: string;
      coffeePerDay?: string;
      shotsPerDay?: string;
    }
  /** Research-backed proof card: universities + key credentials */
  | { kind: "researchBacked" }
  /** Cognitive-score measure card: count-up graph + routine steps + app stores */
  | { kind: "measureTile" }
  /** Coffee vs Coffee + CONKA measured-cognition bars (CONKA app data) */
  | { kind: "cognitionBars" }
  /** 4-group average cognitive score columns, CONKA groups in green (app data) */
  | { kind: "scoreByGroup" }
  /** Day-energy curve: Without slumps in the afternoon, With CONKA holds steady */
  | { kind: "dayEnergyCurve" }
  /** Two-bar focus comparison: off CONKA vs on CONKA (+19.3%) */
  | { kind: "focusBars" }
  /** Athlete portrait with their quote overlaid + status (proof for a reason) */
  | {
      kind: "athleteQuote";
      name: string;
      role: string;
      image: string;
      quote: string;
    }
  /** Tile grid of named actives + one-line effects (our deficiency-panel answer) */
  | {
      kind: "ingredientGrid";
      eyebrow?: string;
      items: {
        icon: string;
        name: string;
        benefit: string;
        /** Optional source line under the tile, e.g. "PMID: 11081987" */
        citation?: string;
      }[];
      footer?: string;
    }
  | {
      kind: "statPanel";
      tone: "dark" | "light";
      eyebrow: string;
      stats: { label: string; from?: string; to: string; delta?: string }[];
      footer?: string;
    }
  /** Labelled grey block at the right aspect ratio — framework phase */
  | { kind: "placeholder"; aspect: string; note: string };

/** A plain photo asset (the only asset a "mm" reason uses). */
export type ListicleImageAsset = Extract<ListicleAsset, { kind: "image" }>;

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

/* ------------------------------------------------------------------ */
/* IM8 template body blocks (the plug-and-play section library)        */
/* ------------------------------------------------------------------ */

export type ListicleBodyBlock =
  | {
      kind: "reason";
      n: number;
      /** Mono category tag above the headline, e.g. "FOCUS" */
      tag?: string;
      headline: string;
      /** Problem-validate paragraph, then solution; one string for now */
      body: string;
      /** Optional source line under the body, e.g. "DOI: 10.1186/1550-2783-12-S1-P41" */
      citation?: string;
      /** Optional link target for the citation line */
      citationHref?: string;
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
    }
  /** Full-width interactive symptom explainer (bespoke, ADHD listicle) */
  | {
      kind: "symptomExplainer";
      /** Display number for the section heading, e.g. 1 renders "01." */
      n?: number;
      /** Mono category tag above the headline */
      tag?: string;
      headline: string;
      /** Intro paragraph above the symptom buttons */
      intro: string;
      /** Small-print disclaimer under the explainer */
      disclaimer?: string;
      symptoms: {
        icon: string;
        label: string;
        /** Primary symptoms show by default; the rest behind "see more" */
        primary?: boolean;
        /** "What's happening in your brain" explanation */
        brain: string;
        brainCitation?: string;
        ingredients: {
          icon: string;
          name: string;
          /** Which shot the active sits in, e.g. "Flow" or "Clear" */
          formula: string;
          detail: string;
          citation?: string;
        }[];
      }[];
    }
  /** Full-width two-segment switcher (bespoke, Brain Ageing men/women) */
  | {
      kind: "segmentToggle";
      /** Display number for the section heading, e.g. 2 renders "02." */
      n?: number;
      /** Mono category tag above the headline */
      tag?: string;
      headline: string;
      segments: {
        /** Toggle button label, e.g. "For men" */
        label: string;
        headline: string;
        body: string;
        ingredientsEyebrow?: string;
        ingredients: {
          icon: string;
          name: string;
          benefit: string;
          citation?: string;
        }[];
        ingredientsFooter?: string;
        testimonial?: { quote: string; name: string; detail?: string };
      }[];
    };

/* ------------------------------------------------------------------ */
/* MM template body blocks (photo + heading + body, plus a buy box)    */
/* ------------------------------------------------------------------ */

export type MmBodyBlock =
  | {
      kind: "reason";
      n: number;
      headline: string;
      body: string;
      /** Optional accented line under the body (e.g. a highlighted offer),
       *  rendered in the savings-green accent to stand apart from the body. */
      accentLine?: string;
      /** Optional source line under the body */
      citation?: string;
      citationHref?: string;
      /** MM reasons are always a lifestyle photo */
      asset: ListicleImageAsset;
    }
  /** Buy-box reprise between reasons (the reference repeats it after reason 5).
   *  Renders the shared home ProductGrid; the end-of-page grid stays #product. */
  | {
      kind: "buyBox";
      /** Small eyebrow pill above the headline, e.g. "Limited time offer". */
      eyebrow?: string;
      headline?: string;
      subline?: string;
      /** When set, the live subscription discount for this product + cadence is
       *  resolved from funnel pricing and substituted for a `{percent}` token in
       *  the headline/subline (e.g. subline "Try it risk free, now {percent}% off"). */
      offer?: {
        product: "both" | "flow" | "clear";
        cadence: "monthly-sub" | "quarterly-sub";
      };
    };

/* ------------------------------------------------------------------ */
/* Config: a shared base, then one shape per template                  */
/* ------------------------------------------------------------------ */

interface ListicleBase {
  slug: string;
  /** Ad persona this page targets; tagged on every analytics event */
  persona: string;
  format: "listicle";
  /** Page title and Meta content_name */
  title: string;
  /** Partner-logo marquee ("Fueling High Performers at:") in the trust zone */
  logoMarquee?: boolean;
  /** Press "As Published On:" marquee in the trust zone */
  pressMarquee?: boolean;
  /** Renders the shared AthleteCredibilityCarousel */
  trustCarousel?: boolean;
  /** Renders the 3-tile athlete testimonial block (Trusted by the Best) */
  athleteTestimonials?: boolean;
  /** Renders the shared reviews carousel + LandingTrustBadges */
  reviewsCarousel?: boolean;
  /**
   * Canonical FAQ ids (from `app/lib/faqContent.ts`), curated per persona in
   * display order. Resolved via `pickFaqItems` in the renderer. An unknown id
   * fails the build. The `/go` surface is noindex and strips claim anchors.
   */
  faqIds: string[];
  /** Fixed bottom bar anchoring to #product */
  stickyBar?: { label: string; cta: string; sub?: string };
}

/** IM8 template: dense layout, product-image hero, section-block library. */
export interface Im8ListicleConfig extends ListicleBase {
  template: "im8";
  hero: {
    /** Laurel-flanked credibility chip above the headline */
    laurel?: { eyebrow: string; body: string };
    headline: string;
    subcopy: string;
    /** Avatar + star micro-row (LandingHero pattern) */
    socialProof?: { label: string; sub: string };
    /** Primary CTA; anchors to #product */
    cta: string;
    /** Trust chips under the CTA; each gets its own icon */
    trustPills?: { label: string; icon: TrustPillIcon }[];
    asset: ListicleAsset;
  };
  /** Marquee proof ticker below the hero */
  ticker?: string[];
  /** Reasons with bands / strips woven between */
  body: ListicleBodyBlock[];
  /** Dark CTA card bridging the last reason into the product zone */
  bridge?: { headline: string; cta: string };
  /** Buy box zone. Renders ProductHeroV2 (via ListicleProductHero). */
  product: {
    /** Which product the buy box sells ("01" Flow, "02" Clear, "03" Both) */
    productHeroId?: ProductHeroId;
    /** @deprecated no longer rendered since the ProductHeroV2 buy-zone swap;
     *  ProductHeroV2 supplies its own heading + accordions. Retained so
     *  existing configs keep type-checking until the copy is removed. */
    headline?: string;
    subline?: string;
    whoItsFor?: string[];
  };
  /** Renders the app proof section (cognitive score count-up, steps, guarantee) */
  appSection?: boolean;
  /** Comparison table; omit to skip */
  comparison?: {
    eyebrow: string;
    headline: string;
    subline?: string;
    competitorLabel: string;
    rows: {
      label: string;
      us: string;
      usDelta?: string;
      them: string;
    }[];
    footnote?: string;
  };
  /** Cost breakdown block; omit to skip */
  costBreakdown?: {
    claim: string;
    savingsBadge?: string;
    lineItems: { label: string; price: string }[];
    totals: { themLabel: string; them: string; usLabel: string; us: string };
    cta?: string;
  };
}

/** MM template: editorial layout, headline + byline hero, photo reasons.
 *  The buy box is always the shared home ProductGrid, so there is no product
 *  or CTA config here. */
export interface MmListicleConfig extends ListicleBase {
  template: "mm";
  hero: {
    /** Editorial byline: "By {name}" + updated date, optional headshot */
    author?: { name: string; avatar?: string; updated: string };
    headline: string;
    subcopy: string;
  };
  body: MmBodyBlock[];
}

export type ListicleConfig = Im8ListicleConfig | MmListicleConfig;
