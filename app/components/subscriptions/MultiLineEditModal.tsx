"use client";

import { useState, useEffect } from "react";
import type { Subscription } from "@/app/hooks/useSubscriptions";
import { sizeToTierKey } from "@/app/lib/productSizeUtils";

type PlanType = "starter" | "pro" | "max";

interface LineEdit {
  lineId: string | number;
  productKey: string;
  size: number;
}

interface MultiLineEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onSave: (lines: LineEdit[], plan: PlanType) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
}

const CATALOG = [
  { key: "flow",  label: "Conka Flow",              image: "/formulas/ConkaFlowColour.jpg",     sizes: [4, 8, 12, 28] },
  { key: "clear", label: "Conka Clarity",            image: "/formulas/ConkaClearColour.jpg",    sizes: [4, 8, 12, 28] },
  { key: "1",     label: "Resilience Protocol",      image: "/protocols/ResilienceRed.jpg",      sizes: [4, 12, 28] },
  { key: "2",     label: "Precision Protocol",       image: "/protocols/PrecisionPurple.jpg",    sizes: [4, 12, 28] },
  { key: "3",     label: "Balance Protocol",         image: "/protocols/BalanceGreen.jpg",       sizes: [4, 12, 28] },
  { key: "4",     label: "Ultimate Protocol",        image: "/protocols/UltimatePink.jpg",       sizes: [28, 56] },
] as const;

type CatalogKey = typeof CATALOG[number]["key"];

const PLAN_CADENCE: Record<PlanType, { label: string; detail: string }> = {
  starter: { label: "Weekly",    detail: "Every 7 days" },
  pro:     { label: "Bi-Weekly", detail: "Every 14 days" },
  max:     { label: "Monthly",   detail: "Every 4 weeks" },
};

function tierKeyToPlan(tierKey: string): PlanType {
  if (tierKey === "max") return "max";
  if (tierKey === "starter") return "starter";
  return "pro"; // pro and pro_8 both use bi-weekly
}

function computeRequiredPlan(lines: LineEdit[]): PlanType {
  const order: PlanType[] = ["starter", "pro", "max"];
  let maxIdx = 0;
  for (const line of lines) {
    const idx = order.indexOf(tierKeyToPlan(sizeToTierKey(line.productKey, line.size)));
    if (idx > maxIdx) maxIdx = idx;
  }
  return order[maxIdx];
}

function inferProductKey(productTitle: string): CatalogKey {
  const t = (productTitle || "").toLowerCase();
  if (t.includes("flow")) return "flow";
  if (t.includes("clear") || t.includes("clarity")) return "clear";
  if (t.includes("resilience")) return "1";
  if (t.includes("precision")) return "2";
  if (t.includes("balance")) return "3";
  if (t.includes("ultimate")) return "4";
  return "flow";
}

function inferSize(variantTitle: string, quantity: number, productKey: string): number {
  const v = (variantTitle || "").toLowerCase();
  for (const s of [56, 28, 12, 8, 4]) {
    if (v.includes(String(s))) return s;
  }
  const product = CATALOG.find(p => p.key === productKey);
  const validSizes: readonly number[] = product?.sizes ?? [4, 12, 28];
  return validSizes.reduce((prev, curr) =>
    Math.abs(curr - quantity) < Math.abs(prev - quantity) ? curr : prev
  );
}


export function MultiLineEditModal({ isOpen, onClose, subscription, onSave, loading }: MultiLineEditModalProps) {
  const [lineEdits, setLineEdits] = useState<LineEdit[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Derived — not user-editable. Cadence is determined by the largest product in the subscription.
  const requiredPlan = computeRequiredPlan(lineEdits);

  useEffect(() => {
    if (!isOpen || !subscription) return;
    setError(null);
    setLineEdits(
      (subscription.lines || []).map(line => {
        const productKey = inferProductKey(line.productTitle || "");
        const size = inferSize(line.variantTitle || "", line.quantity ?? 1, productKey);
        return { lineId: line.id, productKey, size };
      })
    );
  }, [isOpen, subscription]);

  if (!isOpen || !subscription) return null;

  const handleProductChange = (index: number, productKey: string) => {
    setLineEdits(prev => {
      const updated = [...prev];
      const product = CATALOG.find(p => p.key === productKey);
      const validSizes: readonly number[] = product?.sizes ?? [4, 12, 28];
      const currentSize = updated[index].size;
      const newSize = (validSizes as number[]).includes(currentSize)
        ? currentSize
        : (validSizes as number[]).reduce((prev, curr) =>
            Math.abs(curr - currentSize) < Math.abs(prev - currentSize) ? curr : prev
          );
      updated[index] = { ...updated[index], productKey, size: newSize };
      return updated;
    });
  };

  const handleSizeChange = (index: number, size: number) => {
    setLineEdits(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], size };
      return updated;
    });
  };

  const handleSave = async () => {
    setError(null);
    const result = await onSave(lineEdits, requiredPlan);
    if (!result.success) {
      setError(result.message || "Failed to update subscription. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
          <div>
            <h3
              className="font-semibold text-black"
              style={{ letterSpacing: "-0.02em" }}
            >
              Edit subscription
            </h3>
            <p className="text-sm font-medium text-black/50 tabular-nums mt-0.5">
              {subscription.lines?.length ?? 0} products · shared delivery schedule
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[#f5f5f5] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-6">

          {/* Per-line editors */}
          <div>
            <p className="text-sm font-medium text-black/50 mb-3">
              Products
            </p>
            <div className="space-y-4">
              {lineEdits.map((edit, index) => {
                const product = CATALOG.find(p => p.key === edit.productKey);
                const validSizes: readonly number[] = product?.sizes ?? [4, 12, 28];
                return (
                  <div
                    key={String(edit.lineId)}
                    className="border border-black/10 rounded-md bg-[#f5f5f5] p-4 space-y-3"
                  >
                    <p className="text-[13px] text-black/50 tabular-nums">
                      Line {index + 1}
                    </p>

                    {/* Product picker */}
                    <div>
                      <label className="block text-[13px] font-medium text-black/60 mb-1.5">
                        Product
                      </label>
                      <div className="flex items-center gap-3">
                        {product && (
                          <img
                            src={product.image}
                            alt=""
                            className="w-10 h-10 object-cover flex-shrink-0 border border-black/8 rounded-md"
                          />
                        )}
                        <select
                          value={edit.productKey}
                          onChange={e => handleProductChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-black/10 rounded-md bg-white text-black text-sm focus:outline-none focus:border-[var(--brand-navy)] transition-colors"
                        >
                          {CATALOG.map(p => (
                            <option key={p.key} value={p.key}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Size picker */}
                    <div>
                      <label className="block text-[13px] font-medium text-black/60 mb-1.5">
                        Pack size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(validSizes as number[]).map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeChange(index, size)}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium tabular-nums transition-colors border ${
                              edit.size === size
                                ? "bg-[var(--brand-navy)] text-white border-[var(--brand-navy)]"
                                : "bg-white text-black border-black/10 hover:border-black/40"
                            }`}
                          >
                            {size} shots
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shared delivery frequency — auto-derived, read-only */}
          <div className="border border-black/10 rounded-md bg-[#f5f5f5] p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-black/50 mb-0.5">
                Delivery schedule
              </p>
              <p className="font-semibold text-black">
                {PLAN_CADENCE[requiredPlan].label}
                <span className="font-normal text-black/60 ml-2 text-sm">
                  {PLAN_CADENCE[requiredPlan].detail}
                </span>
              </p>
              <p className="text-sm text-black/60 mt-1">
                Set by your largest pack. Your next delivery date stays the same.
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="flex-shrink-0 text-black/40">
              <rect x="3" y="4" width="18" height="18" rx="0" ry="0"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50/50 rounded-md p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-black/8 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-black/10 hover:border-black/40 text-black text-[13px] font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || lineEdits.length === 0}
            className="flex-1 py-3 rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
