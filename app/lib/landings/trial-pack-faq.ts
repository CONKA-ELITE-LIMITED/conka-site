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
  const flow = get("flow");
  const clear = get("clear");
  const both = get("both");

  return [
    {
      id: "trial-how-it-works",
      question: "How does the trial work?",
      answer: `Choose Flow, Clear or Both and try CONKA at home. ${conversionDays} days after your order, your trial moves onto that product's monthly plan, and your first monthly box is the starter pack. Cancel any time before then and you won't pay for the monthly plan.`,
    },
    {
      id: "trial-pack-contents",
      question: "What's in the trial pack?",
      answer: `The Flow and Clear packs each have ${flow.shots} shots, one a day. Both has ${both.shots} shots: ${flow.shots} Flow for your mornings and ${clear.shots} Clear for your afternoons.`,
    },
    {
      id: "trial-after",
      question: `What happens after ${conversionDays} days?`,
      answer: `Your monthly plan starts: ${formatPrice(flow.monthly.price)}/month for Flow, ${formatPrice(clear.monthly.price)}/month for Clear, or ${formatPrice(both.monthly.price)}/month for Both. Your first monthly box is the starter pack, then a new box arrives each month until you cancel.`,
    },
    {
      id: "trial-starter-pack",
      question: "What's in the starter pack?",
      answer: `Your first monthly box is the starter pack. Flow or Clear comes with ${flow.starterPack.shots} shots (${flow.starterPack.freeShots} of them free), and Both with ${both.starterPack.shots} (${both.starterPack.freeShots} free). Every starter pack also includes ${listGifts(flow.starterPack.gifts)}. That's ${formatPrice(flow.starterPack.value)} of value for ${formatPrice(flow.monthly.price)}, or ${formatPrice(both.starterPack.value)} for ${formatPrice(both.monthly.price)} with Both.`,
    },
    {
      id: "trial-cancel",
      question: "How do I cancel before my monthly plan starts?",
      answer: `Log in at conka.io/account and cancel your subscription within ${conversionDays} days of your order, or email ${SUPPORT_EMAIL}. You keep your trial pack and won't be charged for the monthly plan.`,
    },
    {
      id: "trial-buy-once",
      question: "Can I buy without a subscription?",
      answer: `Yes. Use the "Or buy a box once" link under Checkout for a one-off ${flow.oneTime.shots}-shot box of Flow or Clear (${formatPrice(flow.oneTime.price)}), or a ${both.oneTime.shots}-shot box of Both (${formatPrice(both.oneTime.price)}). No subscription, nothing to cancel.`,
    },
  ];
}
