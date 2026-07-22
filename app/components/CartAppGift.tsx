// No "use client" needed — pure render, no hooks. Rendered inside the client CartDrawer.

/**
 * Compact "included free" reassurance strip for the CONKA app, pinned to the
 * bottom of the cart drawer. Light-navy tint mirrors the free-shipping banner
 * so the two blue elements bookend the cart. Deliberately lean: the sale is
 * already made here, this only reassures and reminds. The money-back guarantee
 * lives under the Checkout button, so it is intentionally not repeated.
 */
export default function CartAppGift() {
  return (
    <div className="rounded-lg bg-[#eef0f5] px-4 py-3 text-[#1B2757]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">CONKA app included</p>
        <span className="shrink-0 rounded bg-[#1B2757] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Free!
        </span>
      </div>
      <p className="mt-1 text-xs text-[#1B2757]">
        Track your daily brain score · iOS &amp; Android
      </p>
      <p className="mt-1 text-[11px] text-[#1B2757]">
        *Access with your purchase email
      </p>
    </div>
  );
}
