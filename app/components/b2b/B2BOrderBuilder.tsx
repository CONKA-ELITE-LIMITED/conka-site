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
import { EMAIL_RE } from "@/app/lib/b2bData";
import { trackB2BCheckoutStarted, trackB2BInvoiceRequested } from "@/app/lib/analytics";

/**
 * B2B order builder. Two compact Flow/Clear cards plus an order summary, laid
 * out as three columns on desktop so the whole order sits in one eyeline.
 *
 * Pricing is driven by the COMBINED box total (Flow + Clear): the tier the total
 * lands in sets the per-box price for every box. Clinical and sharp, but large
 * and obvious. Content-only: the page owns the section wrapper.
 */

const ACCENT = "var(--brand-accent)"; // navy #1B2757 under brand-clinical
const INPUT_CLASS =
  "w-full min-h-[52px] bg-white border border-black/20 rounded-none px-4 py-3 text-base text-black placeholder-black/35 focus:outline-none focus:border-black/50 transition-colors";

type Quantities = Record<B2BProductKey, number>;

export default function B2BOrderBuilder() {
  const [quantities, setQuantities] = useState<Quantities>({ flow: 0, clear: 0 });
  const [poNumber, setPoNumber] = useState("");
  const [financeEmail, setFinanceEmail] = useState("");
  // Which action is in flight (if any); a single error string serves both paths.
  const [status, setStatus] = useState<"idle" | "checkout" | "invoice">("idle");
  const [error, setError] = useState("");
  // Finance email the invoice was sent to; set on success to show confirmation.
  const [sentTo, setSentTo] = useState<string | null>(null);

  const totalBoxes = quantities.flow + quantities.clear;
  const tier = getB2BTier(totalBoxes);
  const unitPrice = tier.pricePerBox;

  const lines = useMemo(
    () =>
      B2B_PRODUCT_ORDER.map((key) => {
        const qty = quantities[key];
        return {
          key,
          qty,
          shots: qty * B2B_PRODUCTS[key].shotsPerBox,
          lineTotal: unitPrice * qty,
        };
      }).filter((l) => l.qty > 0),
    [quantities, unitPrice],
  );

  const totalShots = lines.reduce((sum, l) => sum + l.shots, 0);
  const subtotal = unitPrice * totalBoxes;
  const vat = subtotal * B2B_VAT_RATE;
  const total = subtotal + vat;
  const hasPO = poNumber.trim().length > 0;
  const financeEmailValid = EMAIL_RE.test(financeEmail.trim());

  function setQty(key: B2BProductKey, next: number) {
    setQuantities((prev) => ({ ...prev, [key]: Math.max(0, Math.floor(next) || 0) }));
    if (error) setError("");
  }

  async function handleCheckout() {
    if (totalBoxes === 0 || status !== "idle") return;
    setStatus("checkout");
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
        setStatus("idle");
        setError(data?.error ?? "Could not start checkout. Please try again.");
        return;
      }

      trackB2BCheckoutStarted({
        totalBoxes,
        subtotalExVat: subtotal,
        hasPO,
      });
      window.location.assign(data.checkoutUrl);
    } catch {
      setStatus("idle");
      setError("Network error. Please try again.");
    }
  }

  async function handleInvoice() {
    if (totalBoxes === 0 || status !== "idle") return;
    if (!hasPO) {
      setError("Enter your PO number to pay by invoice.");
      return;
    }
    if (!financeEmailValid) {
      setError("Enter a valid finance email so we can send the invoice.");
      return;
    }
    setStatus("invoice");
    setError("");
    try {
      const res = await fetch("/api/b2b/invoice-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ product: l.key, quantity: l.qty })),
          financeEmail: financeEmail.trim(),
          poNumber,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setStatus("idle");
        setError(data?.error ?? "Could not send the invoice. Please try again.");
        return;
      }

      trackB2BInvoiceRequested({
        totalBoxes,
        subtotalExVat: subtotal,
        hasPO,
      });
      setSentTo(financeEmail.trim());
    } catch {
      setStatus("idle");
      setError("Network error. Please try again.");
    }
  }

  if (sentTo) {
    return <InvoiceSentCard financeEmail={sentTo} />;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 items-start">
      {B2B_PRODUCT_ORDER.map((key) => (
        <ProductCard
          key={key}
          productKey={key}
          qty={quantities[key]}
          onQty={(n) => setQty(key, n)}
        />
      ))}

      {/* Summary spans both columns on mobile, sits as the third column on desktop */}
      <div className="col-span-2 lg:col-span-1 border border-black/15 bg-white p-6">
        <h2 className="text-xl font-semibold tracking-[-0.01em] mb-4">Your order</h2>

        {/* Volume pricing (combined total) */}
        <div className="border border-black/12">
          {B2B_TIERS.map((t, i) => {
            const isActive = totalBoxes > 0 && t.label === tier.label;
            const range =
              t.maxBoxes === null
                ? `${t.minBoxes}+ boxes`
                : `${t.minBoxes}-${t.maxBoxes} boxes`;
            return (
              <div
                key={t.label}
                style={isActive ? { backgroundColor: ACCENT, color: "#fff" } : undefined}
                className={`flex items-baseline justify-between px-3.5 py-2.5 text-sm ${
                  i > 0 ? "border-t border-black/12" : ""
                } ${isActive ? "" : "text-black/70"}`}
              >
                <span>{range}</span>
                <span className="font-semibold tabular-nums">
                  {formatPrice(t.pricePerBox)}
                  <span className="font-normal opacity-60"> / box</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Line items */}
        <div className="mt-5">
          {lines.length === 0 ? (
            <p className="text-base text-black/50">
              Choose your boxes to build your order.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {lines.map((l) => (
                <div key={l.key} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-medium text-black">
                      {l.qty} &times; {B2B_PRODUCTS[l.key].name}
                    </p>
                    <p className="text-sm text-black/50">
                      {l.shots.toLocaleString()} shots at {formatPrice(unitPrice)}/box
                    </p>
                  </div>
                  <p className="text-lg font-medium tabular-nums whitespace-nowrap">
                    {formatPrice(l.lineTotal)}
                  </p>
                </div>
              ))}

              <div className="border-t border-black/10 pt-4 flex flex-col gap-2.5">
                <SummaryRow
                  label={`${totalBoxes} boxes · ${totalShots.toLocaleString()} shots`}
                  value=""
                  muted
                />
                <SummaryRow label="Subtotal (ex VAT)" value={formatPrice(subtotal)} />
                <SummaryRow label="VAT (20%)" value={formatPrice(vat)} />
                <SummaryRow label="Total (inc VAT)" value={formatPrice(total)} strong />
              </div>
              <p className="text-sm text-black/55">
                Shipping is calculated at checkout by your delivery address.
              </p>
            </div>
          )}
        </div>

        {/* PO number + finance email. The PO carries through to the order and
            invoice; the finance email is where the Shopify invoice is sent. */}
        <div className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="block text-sm font-medium mb-2">
              PO number{" "}
              <span className="text-black/40 font-normal">
                (required to pay by invoice)
              </span>
            </span>
            <input
              className={INPUT_CLASS}
              value={poNumber}
              onChange={(e) => {
                setPoNumber(e.target.value);
                if (error) setError("");
              }}
              placeholder="Appears on your order and invoice"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">
              Finance email{" "}
              <span className="text-black/40 font-normal">(for pay by invoice)</span>
            </span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className={INPUT_CLASS}
              value={financeEmail}
              onChange={(e) => {
                setFinanceEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="accounts@yourclub.com"
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
          disabled={totalBoxes === 0 || status !== "idle"}
          style={{ backgroundColor: ACCENT }}
          className="w-full min-h-[56px] mt-6 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "checkout"
            ? "Starting checkout..."
            : totalBoxes === 0
              ? "Add boxes to continue"
              : `Buy now · ${formatPrice(total)} inc VAT`}
        </button>

        <button
          type="button"
          onClick={handleInvoice}
          disabled={totalBoxes === 0 || status !== "idle" || !financeEmailValid || !hasPO}
          style={{ borderColor: ACCENT, color: ACCENT }}
          className="w-full min-h-[56px] mt-3 text-base font-medium bg-white border transition-colors hover:bg-black/[0.03] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "invoice" ? "Sending invoice..." : "Pay by invoice"}
        </button>

        <p className="text-sm text-black/55 mt-4">
          Pay by invoice sends a VAT invoice to your finance team. We ship once it
          is paid. Prefer to talk first?{" "}
          <a
            href="mailto:harryglover@conka.io?subject=CONKA%20team%20order"
            className="underline"
          >
            Email harryglover@conka.io
          </a>
        </p>
      </div>
    </div>
  );
}

function InvoiceSentCard({ financeEmail }: { financeEmail: string }) {
  return (
    <div className="border border-black/15 bg-white p-8 lg:p-12 max-w-[640px]">
      <p className="text-sm font-medium mb-3" style={{ color: ACCENT }}>
        Pay by invoice
      </p>
      <h2 className="text-3xl lg:text-4xl font-semibold tracking-[-0.02em] mb-5">
        Invoice on its way.
      </h2>
      <p className="text-lg text-black/70 leading-relaxed max-w-[52ch]">
        We&apos;ve emailed your VAT invoice to{" "}
        <span className="font-medium text-black">{financeEmail}</span>. Your order
        is reserved. Once payment reaches us, we&apos;ll ship your team&apos;s CONKA
        straight to you.
      </p>
      <p className="text-base text-black/55 mt-6">
        Questions?{" "}
        <a href="mailto:harryglover@conka.io" className="underline">
          harryglover@conka.io
        </a>
      </p>
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

  return (
    <div className="border border-black/15 bg-white flex flex-col">
      <div className="relative aspect-[3/2] border-b border-black/10">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 1024px) 50vw, 400px"
          className="object-cover"
        />
      </div>

      <div className="p-4 lg:p-5 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.01em]">{product.name}</h3>
          <p className="text-sm text-black/50 mt-0.5">
            {product.blurb}
          </p>
        </div>
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
    "h-12 w-12 shrink-0 flex items-center justify-center border border-black/25 bg-white text-xl leading-none hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black";

  return (
    <div className="flex">
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
        className="h-12 flex-1 min-w-0 border-y border-black/25 bg-white text-center text-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-black/10"
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
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  const base = strong
    ? "text-lg font-semibold"
    : muted
      ? "text-sm text-black/50"
      : "text-base text-black/60";
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={base}>{label}</span>
      {value && <span className={`tabular-nums whitespace-nowrap ${base}`}>{value}</span>}
    </div>
  );
}
