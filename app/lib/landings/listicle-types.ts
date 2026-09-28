/**
 * Listicle landing config (/go/[slug], format: "listicle").
 *
 * A listicle page picks a TEMPLATE. There are two, each with its own config
 * shape so a config only ever carries the fields its template renders:
 *
 *   template: "im8" -> ListicleRenderer. The dense layout: a product-image
 *     hero, a partner logo band, and a plug-and-play library of section blocks
 *     (data-viz reason panels, stat bands, review strips, bespoke explainers).
 *
 *   template: "mm"  -> SimpleListicleRenderer. The Magic Mind editorial layout:
 *     a headline + byline hero, and reasons that are simply photo + heading +
 *     body, with a buy box woven in. Nothing between the reasons.
 *
 * Shared fields (title, proof tier, FAQ, sticky bar) live in ListicleBase.
 * The route narrows on `template` and hands each renderer its exact type.
 *
 * Blueprint: docs/features/LISTICLE_SYSTEM.md
 */

import type { ProductHeroId } from "../productTypes";
import type { UGCItem } from "@/app/components/testimonials/UGCMarquee";
import type { AthleteReviewContent } from "@/app/components/AthleteReviewFeature";

/**
 * A single named-person proof feature: white-background cutout portrait beside
 * one large quote, rendered by AthleteReviewFeature in the post-reasons proof
 * tier. The portrait MUST be a white-background cutout, because the component
 * dissolves the white into its tint panel with mix-blend-multiply. Every
 * `*NB.jpg` under `public/testimonials/athlete/` (the AthleteCredibilityCarousel
 * roster) meets that requirement and is a valid source.
 *
 * Aliased to the component's own prop type rather than redeclared: the config
 * value is handed straight to AthleteReviewFeature, so the two cannot drift.
 */
export type ListicleProofFeature = AthleteReviewContent;

/**
 * The post-reasons proof tier. Three moments, each doing a different job, so
 * the tail of the page escalates rather than repeating itself:
 *
 *   logoBand -> institutional trust  (partner logos, above the buy box)
 *   pressBand-> press / journals     (above the buy box, under the partners)
 *   feature  -> one specific human   (AthleteReviewFeature, after the buy box)
 *   ugc      -> volume and faces     (UGCMarquee, last, before the FAQ)
 *
 * Written customer reviews are deliberately not a proof-tier moment: the
 * mid-reasons review strip already carries them. Omit a key to skip that
 * moment; omit `proof` entirely for none.
 */
export interface ListicleProof {
  /** Partner-logo marquee ("Fueling High Performers at:"), above the buy box */
  logoBand?: boolean;
  /** Press and journal marquee ("As Published On:"), under the partner band */
  pressBand?: boolean;
  /** UGC band. Pass `items` for a persona subset; omit for the shared set. */
  ugc?: { title?: string; subtitle?: string; items?: UGCItem[] };
  /** One named person, quote-led */
  feature?: ListicleProofFeature;
}

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
  | {
      kind: "video";
      src: string;
      /**
       * Accessible name for the clip. Omit when it adds nothing the reason's
       * own copy does not already say: the renderer then marks it decorative
       * rather than leaving an unlabelled media element for a screen reader.
       */
      alt?: string;
      aspect?: string;
      fit?: "cover" | "contain";
    }
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

export interface ListicleReview {
  /** Bold one-liner above the quote */
  headline?: string;
  quote: string;
  name: string;
  /** Role or verification line, e.g. "Verified customer" */
  detail?: string;
  /** Optional customer photo (public path), rendered as a circular avatar */
  image?: string;
}

/* ------------------------------------------------------------------ */
/* IM8 template body blocks (the plug-and-play section library)        */
/* ------------------------------------------------------------------ */

export type ListicleBodyBlock =
  | {
      kind: "reason";
      n: number;
      /** Category eyebrow above the headline, e.g. "Focus" or "Value"
       *  (Grüns pattern). Renders with the counter on the right and a rule
       *  under both. Omit for the plain counter-only heading. */
      tag?: string;
      headline: string;
      /** Problem-validate paragraph, then solution; one string for now.
       *  Supports the `{perDay}` offer token (see Offer tokens in LISTICLE_SYSTEM.md). */
      body: string;
      /** Bold closing fact after the body (Grüns pattern). When set, the body
       *  drops to regular weight so this line carries the emphasis. Supports
       *  the same offer tokens as `body`. */
      payoff?: string;
      /** Optional source line under the body, e.g. "DOI: 10.1186/1550-2783-12-S1-P41" */
      citation?: string;
      /** Optional link target for the citation line */
      citationHref?: string;
      /** Pill callout chips under the body, e.g. "250mg citicoline" */
      chips?: string[];
      asset: ListicleAsset;
      /** Render the "As Published On:" press/journal marquee full-width under
       *  the reason, e.g. on an evidence reason to show where the science ran. */
      pressMarquee?: boolean;
    }
  | {
      kind: "statsBand";
      /**
       * Card title. Still called `eyebrow` for the configs that already set
       * it, but since the band was restyled to the /lander proof card it
       * renders as a large bold h3, not a small uppercase marker. Write it in
       * sentence case; ALL CAPS at this size shouts.
       */
      eyebrow: string;
      /**
       * Two per row on mobile. An odd count is fine: the last stat spans the
       * full width rather than leaving a hole in the grid.
       */
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
  /** Full-width interactive symptom explainer (bespoke, ADHD listicle) */
  | {
      kind: "symptomExplainer";
      /** Display number for the section heading, e.g. 1 renders "01." */
      n?: number;
      headline: string;
      /** Intro paragraph above the symptom buttons */
      intro: string;
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
        testimonial?: {
          quote: string;
          name: string;
          detail?: string;
          /** Optional customer photo (public path), circular avatar */
          image?: string;
        };
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
  /** Post-reasons proof tier; omit for none. See ListicleProof. */
  proof?: ListicleProof;
  /**
   * Canonical FAQ ids (from `app/lib/faqContent.ts`), curated per persona in
   * display order. Resolved via `pickFaqItems` in the renderer. An unknown id
   * fails the build. The `/go` surface is noindex and strips claim anchors.
   */
  faqIds: string[];
  /**
   * Fixed bottom bar. Only the CTA label is configurable: since SCRUM-1322 the
   * bar states the per-shot price (from `landingPricing.ts`, keyed off
   * `product.productHeroId`) and the hero's rating, so a page cannot hold a
   * second, drifting copy of either. The old `label` and `sub` are gone rather
   * than left populated and unread.
   */
  stickyBar?: { cta: string };
}

/** IM8 template: dense layout, product-image hero, section-block library. */
export interface Im8ListicleConfig extends ListicleBase {
  template: "im8";
  hero: {
    /** Laurel-flanked credibility chip above the headline */
    laurel?: { eyebrow: string; body: string };
    /** Mobile only: render the partner logo band between the hero copy and
     *  the hero asset instead of after the whole hero. Desktop is unchanged. */
    proofWallAboveAsset?: boolean;
    headline: string;
    subcopy: string;
    /** Avatar + star micro-row (the home hero's TrustMicroRow pattern) */
    socialProof?: { label: string; sub: string };
    /**
     * Primary CTA; anchors to #product.
     *
     * `{percent}` resolves at render to the live quarterly discount for this
     * page's `productHeroId`, straight out of `offerData`, so the hero and the
     * sticky bar quote the same cadence and neither can drift from what we
     * actually charge. Same token and same rule as `ProductGridHeader`: the
     * token is the bare number and the copy owns the "%", so this reads
     * `"Save {percent}% on a calmer mind"`. Never write the percentage as a
     * literal (SCRUM-1323). A CTA without the token renders unchanged.
     */
    cta: string;
    asset: ListicleAsset;
  };
  /**
   * Eyebrow + title introducing the reasons block (SCRUM-1321). Carries the
   * "N Reasons ..." list promise that SCRUM-1320 took off the hero H1, so the
   * list still announces itself, just at the point the list actually starts.
   *
   * A fixed renderer zone, deliberately NOT a `body` entry: `section` ids are
   * indexed over `body`, so adding a block here would rebase every id below it
   * and void the scroll-funnel history. Tracked as `reasonsHeader`.
   */
  reasonsHeader?: {
    eyebrow: string;
    headline: string;
    /** "compact" drops the title to a quieter size so it does not compete
     *  with the hero H1. Default is the display size. */
    size?: "display" | "compact";
  };
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
