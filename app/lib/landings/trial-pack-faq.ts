import type { FaqEntry } from "@/app/lib/faqContent";
import { formatPrice } from "@/app/lib/productData";
import { SUPPORT_EMAIL } from "@/app/lib/supportEmail";
import type { OfferOptionId, OfferOptionView } from "./offer-types";

/**
 * "How the trial works" questions for /go/trial-pack (SCRUM-1343). Rendered
 * only on that page: true of the trial alone, so they stay out of FAQ_ITEMS
 * (see FAQ_SYSTEM.md, the offer-page carve-out).
 *
 * Every figure comes from the option views (trial price and shots from the
 * config, monthly and one-time from offerData), so a price change updates the
 * answers with it. Throws at build time if an option is missing.
 */
/** "a, b and c": the starter pack gift labels as one phrase. */
function listGifts(gifts: string[]): string {
  if (gifts.length <= 1) return gifts.join("");
  return `${gifts.slice(0, -1).join(", ")} and ${gifts[gifts.length - 1]}`;
}

export function buildTrialPackFaqs(
  options: OfferOptionView[],
  conversionDays: number,
): FaqEntry[] {
  const get = (id: OfferOptionId) => {
    const option = options.find((o) => o.id === id);
    if (!option) throw new Error(`Trial pack FAQ: no "${id}" option`);
    return option;
  };
  const oneBox = get("both_4shot");
  const twoBoxes = get("both_8shot");
  // Both sizes are Both, so they share the monthly plan, starter pack and
  // buy-once box.
  const { monthly, starterPack, oneTime } = twoBoxes;
  const perBox = oneBox.shots / 2;

  return [
    {
      id: "trial-how-it-works",
      question: "How does the trial work?",
      answer: `Choose 1 box or 2 boxes of Flow + Clear and try CONKA at home. ${conversionDays} days after your order, your trial moves onto the Flow + Clear monthly plan, and your first monthly box is the starter pack. Cancel any time before then and you won't pay for the monthly plan.`,
    },
    {
      id: "trial-pack-contents",
      question: "What's in the trial pack?",
      answer: `Each box has ${perBox} Flow for your mornings and ${perBox} Clear for your afternoons. 1 box is ${oneBox.shots} shots, 2 boxes is ${twoBoxes.shots} shots.`,
    },
    {
      id: "trial-after",
      question: `What happens after ${conversionDays} days?`,
      answer: `Your Flow + Clear monthly plan starts at ${formatPrice(monthly.price)}/month, whichever pack size you chose. Your first monthly box is the starter pack, then a new box arrives each month until you cancel.`,
    },
    {
      id: "trial-starter-pack",
      question: "What's in the starter pack?",
      answer: `Your first monthly box is the starter pack: ${starterPack.shots} shots (${starterPack.freeShots} of them free), plus ${listGifts(starterPack.gifts)}. That's ${formatPrice(starterPack.value)} of value for ${formatPrice(monthly.price)}.`,
    },
    {
      id: "trial-cancel",
      question: "How do I cancel before my monthly plan starts?",
      answer: `Log in at conka.io/account and cancel your subscription within ${conversionDays} days of your order, or email ${SUPPORT_EMAIL}. You keep your trial pack and won't be charged for the monthly plan.`,
    },
    {
      id: "trial-buy-once",
      question: "Can I buy without a subscription?",
      answer: `Yes. Use the "Or buy a box once" link under Checkout for a one-off ${oneTime.shots}-shot box of Flow + Clear (${formatPrice(oneTime.price)}). No subscription, nothing to cancel.`,
    },
  ];
}
