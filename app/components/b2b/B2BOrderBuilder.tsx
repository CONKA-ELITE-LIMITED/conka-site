"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/app/lib/productData";
import {
  B2B_PRODUCTS,
  B2B_PRODUCT_ORDER,
  B2B_TIERS,
  B2B_VAT_RATE,
  getB2BTier,
  type B2BProductKey,
} from "@/app/lib/b2bPricing";
import { trackB2BCheckoutStarted } from "@/app/lib/analytics";

/**
 * B2B order builder. Two equal Flow/Clear cards (box image + volume pricing +
 * quantity), and an order summary that hands off to Shopify checkout via
 * /api/b2b/cart. Clinical and sharp, but large and obvious: minimal micro-type.
 * Content-only: the page owns the section wrapper.
 */

const ACCENT = "var(--brand-accent)"; // navy #1B2757 under brand-clinical

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
    <div className="flex flex-col gap-6">
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
      <div className="border border-black/15 bg-white p-6 lg:p-8">
        <h2 className="text-xl font-semibold tracking-[-0.01em] mb-5">Your order</h2>

        {lines.length === 0 ? (
          <p className="text-base text-black/50">
            Choose your boxes above to build your order.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {lines.map((l) => (
              <div key={l.key} className="flex items-baseline justify-between gap-4">
                <span className="text-base">
                  <span className="font-medium">{B2B_PRODUCTS[l.key].name}</span>
                  <span className="text-black/50">
                    {" "}
                    {l.qty} {l.qty === 1 ? "box" : "boxes"} at {formatPrice(l.tier.pricePerBox)}
                  </span>
                </span>
                <span className="text-base font-medium tabular-nums whitespace-nowrap">
                  {formatPrice(l.lineTotal)}
                </span>
              </div>
            ))}

            <div className="border-t border-black/10 mt-1 pt-4 flex flex-col gap-2.5">
              <SummaryRow label="Subtotal (ex VAT)" value={formatPrice(subtotal)} />
              <SummaryRow label="VAT (20%)" value={formatPrice(vat)} />
              <SummaryRow label="Total (inc VAT)" value={formatPrice(total)} strong />
            </div>
            <p className="text-sm text-black/55 mt-1">
              Shipping is calculated at checkout by your delivery address.
            </p>
          </div>
        )}

        {/* PO number */}
        <div className="mt-6">
          <label className="block">
            <span className="block text-sm font-medium mb-2">
              PO number{" "}
              <span className="text-black/40 font-normal">(optional)</span>
            </span>
            <input
              className="w-full min-h-[52px] bg-white border border-black/20 rounded-none px-4 py-3 text-base text-black placeholder-black/35 focus:outline-none focus:border-black/50 transition-colors"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="Appears on your order and invoice"
            />
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-4" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={totalBoxes === 0 || status === "loading"}
          style={{ backgroundColor: ACCENT }}
          className="w-full min-h-[56px] mt-6 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "loading"
            ? "Starting checkout..."
            : totalBoxes === 0
              ? "Add boxes to continue"
              : `Buy now · ${formatPrice(total)} inc VAT`}
        </button>

        <p className="text-sm text-black/55 mt-4">
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
    <div className="border border-black/15 bg-white flex flex-col">
      {/* Box image */}
      <div className="relative aspect-[3/2] border-b border-black/10">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
        />
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.02em]">{product.name}</h3>
          <p className="text-base text-black/60 mt-1.5">{product.blurb}</p>
          <p className="text-sm text-black/45 mt-1">{product.shotsPerBox} shots per box</p>
        </div>

        {/* Volume pricing */}
        <div className="border border-black/12">
          {B2B_TIERS.map((tier, i) => {
            const isActive = qty > 0 && tier.label === activeTier.label;
            const range =
              tier.maxBoxes === null
                ? `${tier.minBoxes}+ boxes`
                : `${tier.minBoxes}-${tier.maxBoxes} boxes`;
            return (
              <div
                key={tier.label}
                style={isActive ? { backgroundColor: ACCENT, color: "#fff" } : undefined}
                className={`flex items-baseline justify-between px-4 py-3 text-base ${
                  i > 0 ? "border-t border-black/12" : ""
                } ${isActive ? "" : "text-black/75"}`}
              >
                <span>{range}</span>
                <span className="font-semibold tabular-nums">
                  {formatPrice(tier.pricePerBox)}
                  <span className="font-normal opacity-60"> / box</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-base font-medium">Boxes</span>
          <QtyStepper qty={qty} onQty={onQty} label={product.name} />
        </div>
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
    "h-12 w-12 flex items-center justify-center border border-black/25 bg-white text-xl leading-none hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black";

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
        className="h-12 w-16 border-y border-black/25 bg-white text-center text-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-black/10"
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
      <span className={strong ? "text-lg font-semibold" : "text-base text-black/60"}>
        {label}
      </span>
      <span
        className={`tabular-nums whitespace-nowrap ${
          strong ? "text-lg font-semibold" : "text-base text-black/60"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
