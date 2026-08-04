'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  getOfferPricing,
  getSwapTargets,
  type FunnelProduct,
  type FunnelCadence,
} from '@/app/lib/funnelData';
import { getFormulaImage } from '@/app/lib/productImageConfig';

const PRODUCT_NAME: Record<FunnelProduct, string> = {
  flow: 'Flow',
  clear: 'Clear',
  both: 'Both',
};

function productImage(product: FunnelProduct): string {
  if (product === 'both') return '/formulas/both/BothBox.jpg';
  return getFormulaImage(product === 'flow' ? '01' : '02');
}

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwap: (target: FunnelProduct) => Promise<boolean>;
  currentProduct: FunnelProduct;
  cadence: FunnelCadence;
  currentPrice: number;
  subscriptionName: string;
}

export function SwapModal({
  isOpen,
  onClose,
  onSwap,
  currentProduct,
  cadence,
  currentPrice,
  subscriptionName,
}: SwapModalProps) {
  const [selected, setSelected] = useState<FunnelProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const targets = getSwapTargets(currentProduct);

  const handleClose = () => {
    setSelected(null);
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const success = await onSwap(selected);
      if (success) {
        handleClose();
      } else {
        setError('Unable to swap your product right now. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-black/8 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black" style={{ letterSpacing: '-0.02em' }}>
              Swap product
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-[#f5f5f5] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p className="text-sm font-medium text-black/50 tabular-nums mt-1">{subscriptionName}</p>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50/50 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <p className="text-sm text-black/60 mb-4">
            Switch to a different formula on the same delivery schedule. Your price updates to match.
          </p>

          <div className="space-y-2">
            {targets.map((target) => {
              const price = getOfferPricing(target, cadence).price;
              const isSelected = selected === target;
              return (
                <label
                  key={target}
                  className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-[var(--brand-navy)] bg-[var(--brand-navy)]/5'
                      : 'border-black/10 hover:border-black/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="swap-target"
                    value={target}
                    checked={isSelected}
                    onChange={() => setSelected(target)}
                    className="sr-only"
                  />
                  <span className="relative w-12 h-12 shrink-0 overflow-hidden rounded-md bg-[#f5f5f5] border border-black/8">
                    <Image src={productImage(target)} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-black">{PRODUCT_NAME[target]}</span>
                    <span className="block text-[13px] text-black/55 tabular-nums">
                      £{price.toFixed(2)} / delivery
                    </span>
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      isSelected ? 'border-[var(--brand-navy)]' : 'border-black/20'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[var(--brand-navy)]" />}
                  </span>
                </label>
              );
            })}
          </div>

          {selected && (
            <div className="mt-4 p-3 bg-[#f5f5f5] border border-black/10 rounded-md">
              <p className="text-sm text-black tabular-nums">
                New price:{' '}
                <span className="font-semibold">
                  £{getOfferPricing(selected, cadence).price.toFixed(2)}
                </span>{' '}
                <span className="text-black/45">(was £{currentPrice.toFixed(2)})</span>
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-3 rounded-full border border-black/10 hover:border-black/40 text-black text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selected || loading}
              className="flex-1 py-3 rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Swapping...
                </span>
              ) : (
                'Confirm swap'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
