'use client';

import Image from 'next/image';
import { getProtocolImage, getFormulaImage } from '@/app/lib/productImageConfig';
import { PROTOCOLS, FORMULAS, type TierType, type FormulaId } from '@/app/lib/subscriptionProduct';
import { SubscriptionIcon } from './SubscriptionIcon';

interface ProductSelectorPanelProps {
  isProtocol: boolean;
  selectedProtocol: string;
  /** Needed to filter Ultimate protocol (only show if selectedTier === 'max' or currentProtocolId === '4') */
  selectedTier: TierType;
  currentProtocolId: string;
  selectedFormulaId: FormulaId;
  currentFormulaId: FormulaId;
  onSelectProtocol: (id: string) => void;
  onSelectFormula: (id: FormulaId) => void;
  /** true = mobile (w-16 images, text-sm), false = desktop (w-20 images) */
  compact?: boolean;
  initialProtocolId: string;
  initialFormulaId: FormulaId;
}

export function ProductSelectorPanel({
  isProtocol,
  selectedProtocol,
  selectedTier,
  currentProtocolId,
  selectedFormulaId,
  onSelectProtocol,
  onSelectFormula,
  compact = false,
  initialProtocolId,
  initialFormulaId,
}: ProductSelectorPanelProps) {
  const imgSize = compact ? 64 : 80;
  const imgClass = compact ? 'w-16 h-16' : 'w-20 h-20';
  const gapClass = compact ? 'gap-3' : 'gap-4';
  const textClass = compact ? 'text-sm' : '';
  const spaceClass = compact ? 'space-y-2' : 'space-y-3';
  const imgThumbClass = compact ? 'w-10 h-10' : 'w-12 h-12';
  const imgThumbSize = compact ? 40 : 48;
  const calloutMt = compact ? 'mt-4' : 'mt-6';
  const calloutPad = compact ? 'p-3' : 'p-4';

  if (isProtocol) {
    return (
      <>
        <h3 className="text-sm font-semibold text-[var(--brand-navy)] mb-3">
          Switch protocol
        </h3>
        <p className="text-sm text-[var(--brand-navy)]/80 mb-4">
          Same pack size, same price. Pick the mix that suits you.
        </p>
        <div className={spaceClass}>
          {PROTOCOLS.filter(
            (p) => p.id !== '4' || selectedTier === 'max' || currentProtocolId === '4',
          ).map((protocol) => {
            const isSelected = selectedProtocol === protocol.id;
            const isCurrent = protocol.id === initialProtocolId;
            const img = getProtocolImage(protocol.id);
            return (
              <button
                key={protocol.id}
                type="button"
                onClick={() => onSelectProtocol(protocol.id)}
                className={`w-full rounded-md text-left border overflow-hidden ${
                  isSelected
                    ? 'bg-[var(--brand-navy)] text-white border-[var(--brand-navy)]'
                    : isCurrent
                      ? 'bg-white border-[var(--brand-navy)] hover:border-[var(--brand-navy)]'
                      : 'bg-white border-black/10 hover:border-black/40'
                }`}
              >
                <div className={`flex ${gapClass} p-3`}>
                  <div
                    className={`${imgClass} flex-shrink-0 overflow-hidden rounded-md border border-black/8`}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt=""
                        width={imgSize}
                        height={imgSize}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#f5f5f5]">
                        <SubscriptionIcon
                          name={protocol.icon}
                          className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-black'}`}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${textClass}`}>{protocol.name}</span>
                      {protocol.id === '4' && (
                        <span className={`text-[13px] ${isSelected ? 'text-white/70' : 'text-[var(--brand-navy)]'}`}>
                          Different pricing
                        </span>
                      )}
                      {isCurrent && (
                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums rounded-full px-2 py-0.5 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#f5f5f5] border border-black/10 text-black/60'
                          }`}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-0.5 ${
                        isSelected ? 'opacity-90' : 'text-black/60'
                      }`}
                    >
                      {protocol.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {/* Callout: single formulas — with product assets */}
        <div
          className={`${calloutMt} ${calloutPad} rounded-md border border-black/10 bg-[#f5f5f5]`}
        >
          <p className="text-sm font-medium text-black mb-2">
            Want CONKA Flow only or CONKA Clear only?
          </p>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`${imgThumbClass} overflow-hidden rounded-md border border-black/8 flex-shrink-0`}
            >
              {getFormulaImage('01') && (
                <Image
                  src={getFormulaImage('01')}
                  alt="CONKA Flow"
                  width={imgThumbSize}
                  height={imgThumbSize}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div
              className={`${imgThumbClass} overflow-hidden rounded-md border border-black/8 flex-shrink-0`}
            >
              {getFormulaImage('02') && (
                <Image
                  src={getFormulaImage('02')}
                  alt="CONKA Clear"
                  width={imgThumbSize}
                  height={imgThumbSize}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          <p className="text-sm text-black/60">
            Cancel this subscription and start a new one from the shop.
          </p>
        </div>
      </>
    );
  }

  // Formula selector
  return (
    <>
      <h3 className="text-sm font-semibold text-[var(--brand-navy)] mb-3">
        Switch formula
      </h3>
      <p className="text-sm text-black/60 mb-4">
        Same pack size. Switch between Flow and Clear.
      </p>
      <div className={spaceClass}>
        {FORMULAS.map((formula) => {
          const isSelected = selectedFormulaId === formula.id;
          const isCurrent = formula.id === initialFormulaId;
          const img = getFormulaImage(formula.id);
          return (
            <button
              key={formula.id}
              type="button"
              onClick={() => onSelectFormula(formula.id)}
              className={`w-full rounded-md text-left border overflow-hidden ${
                isSelected
                  ? 'bg-[var(--brand-navy)] text-white border-[var(--brand-navy)]'
                  : isCurrent
                    ? 'bg-white border-[var(--brand-navy)] hover:border-[var(--brand-navy)]'
                    : 'bg-white border-black/10 hover:border-black/40'
              }`}
            >
              <div className={`flex ${gapClass} p-3`}>
                <div
                  className={`${imgClass} flex-shrink-0 overflow-hidden border border-black/8`}
                >
                  {img ? (
                    <Image
                      src={img}
                      alt=""
                      width={imgSize}
                      height={imgSize}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#f5f5f5]">
                      <SubscriptionIcon
                        name="beaker"
                        className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-black'}`}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${textClass}`}>{formula.name}</span>
                    {isCurrent && (
                      <span
                        className={`rounded-full font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums px-2 py-0.5 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-[#f5f5f5] border border-black/10 text-black/60'
                        }`}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-0.5 ${
                      isSelected ? 'opacity-90' : 'text-black/60'
                    }`}
                  >
                    {formula.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {/* Callout: protocol bundles require new subscription */}
      <div
        className={`${calloutMt} ${calloutPad} rounded-md border border-black/10 bg-[#f5f5f5]`}
      >
        <p className="text-sm font-medium text-black mb-1">
          Want a protocol bundle (Resilience, Precision, Balance)?
        </p>
        <p className="text-sm text-black/60">
          Cancel this subscription and start a new one from the shop.
        </p>
      </div>
    </>
  );
}
