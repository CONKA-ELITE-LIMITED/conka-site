"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/app/lib/productData";
import {
  B2B_PRODUCTS,
  B2B_PRODUCT_ORDER,
  B2B_TIERS,
  B2B_VAT_RATE,
  getB2BTier,
  perShotPrice,
  type B2BProductKey,
} from "@/app/lib/b2bPricing";
import { trackB2BCheckoutStarted } from "@/app/lib/analytics";

/**
 * B2B order builder. Two equal Flow/Clear cards with quantity steppers and live
 * tier pricing, plus an order summary that hands off to Shopify checkout via
 * /api/b2b/cart. Content-only: the page owns the section wrapper.
 */

const fieldClass =
  "w-full min-h-[48px] bg-white border border-black/12 rounded-none px-4 py-3 text-base text-black placeholder-black/30 focus:outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 transition-colors";

type Quantities = Record<B2BProductKey, number>;

export default function B2BOrderBuilder() {
  const [quantities, setQuantities] = useState<Quantities>({ flow: 0, clear: 0 });
  const [poNumber, setPoNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const lines = useMemo(
    () =>
      B2B_PRODUCT_ORDER.map((key) => {
        const qty = quantities[key];
        const tier = getB2BTier(qty);
        return { key, qty, tier, lineTotal: tier.pricePerBox * qty };
      }).filter((l) => l.qty > 0),
    [quantities],
  );

  const totalBoxes = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const vat = subtotal * B2B_VAT_RATE;
  const total = subtotal + vat;

  function setQty(key: B2BProductKey, next: number) {
    setQuantities((prev) => ({ ...prev, [key]: Math.max(0, Math.floor(next) || 0) }));
    if (status === "error") setStatus("idle");
  }

  async function handleCheckout() {
    if (totalBoxes === 0) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/b2b/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ product: l.key, quantity: l.qty })),
          poNumber,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.checkoutUrl) {
        setStatus("error");
        setError(data?.error ?? "Could not start checkout. Please try again.");
        return;
      }

      trackB2BCheckoutStarted({
        totalBoxes,
        subtotalExVat: subtotal,
        hasPO: poNumber.trim().length > 0,
      });
      window.location.assign(data.checkoutUrl);
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Two equal product cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {B2B_PRODUCT_ORDER.map((key) => (
          <ProductCard
            key={key}
            productKey={key}
            qty={quantities[key]}
            onQty={(n) => setQty(key, n)}
          />
        ))}
      </div>

      {/* Order summary */}
      <div className="border border-black/12 bg-white p-6 lg:p-8">
        <p className="brand-eyebrow mb-5">{"// Order summary"}</p>

        {lines.length === 0 ? (
          <p className="brand-body text-black/50">
            Add boxes above to see your order summary.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {lines.map((l) => (
              <div key={l.key} className="flex items-baseline justify-between gap-4">
                <span className="brand-body">
                  {B2B_PRODUCTS[l.key].name}
                  <span className="text-black/45">
                    {"  "}
                    {l.qty} {l.qty === 1 ? "box" : "boxes"} @ {formatPrice(l.tier.pricePerBox)}
                  </span>
                </span>
                <span className="brand-body tabular-nums whitespace-nowrap">
                  {formatPrice(l.lineTotal)}
                </span>
              </div>
            ))}

            <div className="border-t border-black/10 mt-2 pt-3 flex flex-col gap-2">
              <SummaryRow label="Subtotal (ex VAT)" value={formatPrice(subtotal)} />
              <SummaryRow label="VAT (20%)" value={formatPrice(vat)} />
              <SummaryRow label="Total (inc VAT)" value={formatPrice(total)} strong />
            </div>
            <p className="brand-mono-sub mt-1">
              Shipping calculated at checkout by delivery address.
            </p>
          </div>
        )}

        {/* PO number */}
        <div className="mt-6">
          <label className="block">
            <span className="brand-eyebrow block mb-2">
              PO number<span className="text-black/30"> · optional</span>
            </span>
            <input
              className={fieldClass}
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="Appears on your order and invoice"
            />
          </label>
        </div>

        {error && (
          <p className="brand-mono-sub text-red-600 mt-4" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={totalBoxes === 0 || status === "loading"}
          className="brand-btn brand-btn-accent w-full min-h-[52px] mt-6 text-sm uppercase tracking-[0.15em] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "loading"
            ? "Starting checkout..."
            : totalBoxes === 0
              ? "Add boxes to continue"
              : `Buy now · ${formatPrice(total)} inc VAT`}
        </button>

        <p className="brand-mono-sub mt-4">
          Prefer to pay by invoice or on account?{" "}
          <a
            href="mailto:harry@conka.io?subject=CONKA%20team%20order%20by%20invoice"
            className="underline"
          >
            Email harry@conka.io
          </a>
        </p>
      </div>
    </div>
  );
}

function ProductCard({
  productKey,
  qty,
  onQty,
}: {
  productKey: B2BProductKey;
  qty: number;
  onQty: (next: number) => void;
}) {
  const product = B2B_PRODUCTS[productKey];
  const activeTier = getB2BTier(qty);

  return (
    <div className="border border-black/12 bg-white p-6 lg:p-7 flex flex-col">
      <h3 className="brand-h3">{product.name}</h3>
      <p className="brand-mono-sub mt-1">{product.shotsPerBox} shots per box</p>
      <p className="brand-body mt-3">{product.blurb}</p>

      {/* Tier ladder */}
      <div className="mt-5 border-t border-black/10 pt-4 flex flex-col gap-1.5">
        {B2B_TIERS.map((tier) => {
          const isActive = qty > 0 && tier.label === activeTier.label;
          const range =
            tier.maxBoxes === null
              ? `${tier.minBoxes}+ boxes`
              : `${tier.minBoxes}-${tier.maxBoxes} boxes`;
          return (
            <div
              key={tier.label}
              className={`flex items-baseline justify-between gap-3 px-2 py-1.5 ${
                isActive ? "bg-black text-white" : "text-black/70"
              }`}
            >
              <span className="brand-mono-sub" style={isActive ? { color: "#fff" } : undefined}>
                {range}
              </span>
              <span
                className="brand-mono-sub tabular-nums"
                style={isActive ? { color: "#fff" } : undefined}
              >
                {formatPrice(tier.pricePerBox)} · {formatPrice(perShotPrice(tier.pricePerBox, product.shotsPerBox))}/shot
              </span>
            </div>
          );
        })}
      </div>

      {/* Quantity stepper */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="brand-eyebrow">Boxes</span>
        <QtyStepper qty={qty} onQty={onQty} label={product.name} />
      </div>
    </div>
  );
}

function QtyStepper({
  qty,
  onQty,
  label,
}: {
  qty: number;
  onQty: (next: number) => void;
  label: string;
}) {
  const btn =
    "h-11 w-11 flex items-center justify-center border border-black/20 bg-white text-lg leading-none hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black";

  return (
    <div className="flex items-stretch">
      <button
        type="button"
        className={btn}
        onClick={() => onQty(qty - 1)}
        disabled={qty <= 0}
        aria-label={`Decrease ${label} boxes`}
      >
        &minus;
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={qty === 0 ? "" : qty}
        placeholder="0"
        onChange={(e) => onQty(parseInt(e.target.value, 10) || 0)}
        aria-label={`${label} boxes`}
        className="h-11 w-16 border-y border-black/20 bg-white text-center text-base tabular-nums focus:outline-none focus:ring-2 focus:ring-black/10"
      />
      <button
        type="button"
        className={btn}
        onClick={() => onQty(qty + 1)}
        aria-label={`Increase ${label} boxes`}
      >
        +
      </button>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={strong ? "brand-body font-medium" : "brand-body text-black/60"}>
        {label}
      </span>
      <span
        className={`tabular-nums whitespace-nowrap ${
          strong ? "brand-body font-medium" : "brand-body text-black/60"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
