import { formatPrice } from "@/app/lib/productData";
import OfferCountdown from "./OfferCountdown";

/**
 * OfferCountdownBanner: the offer page's top bar, in place of the site nav
 * (Grüns pattern, SCRUM-1343). Offer copy on the left, a countdown to the end
 * of the week on the right. Used on the trial pack page only, never site-wide.
 *
 * A server component: the copy ships as HTML, and only the timer
 * (OfferCountdown) hydrates.
 *
 * Content only: the page owns the bar's background and gutters.
 */
export default function OfferCountdownBanner({ fromPrice }: { fromPrice: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <p className="min-w-0 text-[12px] font-bold uppercase leading-tight tracking-wide sm:text-[13px]">
        <span className="block">This week only</span>
        <span className="block">CONKA trial pack from {formatPrice(fromPrice)}</span>
      </p>
      <OfferCountdown />
    </div>
  );
}
