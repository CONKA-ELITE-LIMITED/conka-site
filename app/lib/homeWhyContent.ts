/* ============================================================================
 * homeWhyContent (SCRUM-1265)
 *
 * The rows of the home page's "why" accordion, the section that frames a
 * problem before the page sells anything. Structured Problem -> Solution ->
 * Mechanism -> Proof -> Verify: PAS (docs/branding/BRAND_VOICE.md) for the
 * first three, which is the right shape for the cold paid traffic this section
 * exists for, then two rows of evidence.
 *
 * Kept as data rather than JSX so the copy can be rewritten without touching
 * the component, and so the `lede` line can be dropped later as a one-line
 * change if it reads noisy. The copy is the part of this section most likely
 * to need iteration.
 *
 * Every number here traces to the proof table in BRAND_VOICE.md. Do not add a
 * figure that is not in that table.
 * ========================================================================== */

export interface HomeWhyRow {
  /** Row heading, also the accordion's clickable label. */
  title: string;
  /**
   * The emotional beat, rendered as a highlighted line above the body. One
   * sentence, no numbers: the specifics belong in `body`.
   */
  lede: string;
  /** The rational follow-through. Two sentences at most. */
  body: string;
}

export const HOME_WHY_ROWS: HomeWhyRow[] = [
  {
    title: "The Challenge",
    lede: "Modern life is quietly dismantling your attention.",
    body: "Notifications, endless screens and back-to-back demands fragment the day. The usual answer is more caffeine, which buys an hour and charges interest in jitters, an afternoon crash and a worse night's sleep.",
  },
  {
    title: "The Solution",
    lede: "Feed the brain instead of flogging it.",
    body: "CONKA is a daily shot of clinically dosed nootropics and adaptogens, with zero caffeine. It builds cognitive capacity over weeks rather than borrowing energy from tomorrow.",
  },
  {
    title: "How CONKA Works",
    lede: "Two shots, built around how your day actually runs.",
    body: "Flow is the morning shot for focus and drive. Clear is the afternoon shot that protects the back half of the day and helps you wind down properly, so the two work as one system rather than one dose repeated.",
  },
  {
    title: "Peer Reviewed Research",
    lede: "Evidence you can check, not claims you have to take on trust.",
    body: "Over £500,000 invested across 25+ clinical trials, with university partnerships at Durham, Cambridge and Exeter. Every batch is Informed Sport certified against 280+ banned substances.",
  },
  {
    title: "Measure It Yourself",
    lede: "No need to leave it to chance.",
    // "FDA-cleared" is established site copy, not a new claim: see
    // app/case-studies/layout.tsx, InsightHeroDifferentiator and
    // HowThisIsPossibleModule, the last of which cites FDA 21 CFR 882.1470.
    // Two minutes is the canonical duration (faqContent x6, CaseStudiesHero,
    // PilotProgramme, the listicles). Two files said five and were corrected
    // 2026-08-27: HowThisIsPossibleModule and whyConkaData.
    body: "The CONKA app has a two-minute FDA-cleared cognitive test built in, derived from Cambridge research and used in NHS memory clinics. Test on CONKA and off it, and watch your own score rather than trusting ours.",
  },
];

/**
 * Headline, split so the accent word can render inside its own outlined pill.
 *
 * There is deliberately no subline. One was tried and cut 2026-08-27: the four
 * row titles already say what the section covers, so a line explaining that it
 * covers four things was restating the obvious directly above them.
 */
export const HOME_WHY_HEADLINE = {
  lead: "Tackling modern distraction with",
  accent: "Precision",
} as const;
