/**
 * The FAQ list for a formula PDP (CONKA Flow / CONKA Clear): the product-specific
 * questions from formulaContent plus the shared trust answers (side effects,
 * Informed Sport) grafted on from the single FAQ source.
 *
 * One source for both the rendered accordion (LabFAQ) and the FAQPage JSON-LD in
 * the sibling layout, so schema never diverges from what the page shows.
 */

import { formulaContent, type FormulaId } from "@/app/lib/productData";
import { pickFaqItems, PDP_TRUST_FAQ_IDS, type FaqEntry } from "@/app/lib/faqContent";

export function getFormulaPdpFaqItems(formulaId: FormulaId): FaqEntry[] {
  const productFaqs: FaqEntry[] = formulaContent[formulaId].faq.map((f, i) => ({
    id: `formula-${formulaId}-${i}`,
    question: f.question,
    answer: f.answer,
  }));
  return [...productFaqs, ...pickFaqItems(...PDP_TRUST_FAQ_IDS)];
}
