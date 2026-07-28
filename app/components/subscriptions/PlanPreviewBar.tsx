'use client';

import Image from 'next/image';
import { getProtocolImage, getFormulaImage } from '@/app/lib/productImageConfig';
import {
  PROTOCOLS,
  FORMULAS,
  getTierInfo,
  getFormulaBreakdown,
  FORMULA_PACK_LABELS,
  type TierType,
  type FormulaId,
  type PackSize,
} from '@/app/lib/subscriptionProduct';

interface PlanPreviewBarProps {
  isProtocol: boolean;
  /** Current (before) values */
  currentProtocolId: string;
  currentTier: TierType;
  currentFormulaId: FormulaId;
  currentPackSize: PackSize;
  /** Selected (after) values */
  selectedProtocol: string;
  selectedTier: TierType;
  selectedFormulaId: FormulaId;
  selectedPackSize: PackSize;
  hasChanges: boolean;
  /** Compact mode for mobile */
  compact?: boolean;
}

function ProtocolMiniCard({
  protocolId,
  tier,
  label,
  compact,
}: {
  protocolId: string;
  tier: TierType;
  label: string;
  compact?: boolean;
}) {
  const protocol = PROTOCOLS.find((p) => p.id === protocolId);
  const tierInfo = getTierInfo(protocolId, tier);
  const breakdown = getFormulaBreakdown(protocolId, tier);
  const img = getProtocolImage(protocolId);
  const imgSize = compact ? 40 : 48;

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[13px] text-black/50 mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-2.5">
        {img && (
          <div
            className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} flex-shrink-0 overflow-hidden rounded-md border border-black/8`}
          >
            <Image
              src={img}
              alt={protocol?.name ?? 'Protocol'}
              width={imgSize}
              height={imgSize}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-sm text-black truncate">
            {protocol?.name ?? 'Protocol'}
          </p>
          <p className="text-sm text-black/60 truncate">
            {tierInfo?.deliveryShots} shots · {tierInfo?.frequency}
          </p>
          {breakdown && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Image src="/formulas/ConkaFlowColour.jpg" alt="" width={14} height={14} className="overflow-hidden" />
              <span className="text-[10px] tabular-nums text-black/60">{breakdown.flowCount}</span>
              <span className="font-mono text-[10px] tabular-nums text-black/40">+</span>
              <Image src="/formulas/ConkaClearColour.jpg" alt="" width={14} height={14} className="overflow-hidden" />
              <span className="text-[10px] tabular-nums text-black/60">{breakdown.clarityCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormulaMiniCard({
  formulaId,
  packSize,
  label,
  compact,
}: {
  formulaId: FormulaId;
  packSize: PackSize;
  label: string;
  compact?: boolean;
}) {
  const formula = FORMULAS.find((f) => f.id === formulaId);
  const img = getFormulaImage(formulaId);
  const imgSize = compact ? 40 : 48;

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[13px] text-black/50 mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-2.5">
        {img && (
          <div
            className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} flex-shrink-0 overflow-hidden rounded-md border border-black/8`}
          >
            <Image
              src={img}
              alt={formula?.name ?? 'Formula'}
              width={imgSize}
              height={imgSize}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-sm text-black truncate">
            {formula?.name ?? 'Formula'}
          </p>
          <p className="text-sm text-black/60">
            {FORMULA_PACK_LABELS[packSize]}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PlanPreviewBar({
  isProtocol,
  currentProtocolId,
  currentTier,
  currentFormulaId,
  currentPackSize,
  selectedProtocol,
  selectedTier,
  selectedFormulaId,
  selectedPackSize,
  hasChanges,
  compact = false,
}: PlanPreviewBarProps) {
  if (!hasChanges) return null;

  return (
    <div
      className={`${compact ? 'p-3' : 'p-4'} rounded-md border border-[var(--brand-navy)]/20 bg-[var(--brand-navy)]/5 mb-4`}
    >
      <div className="flex items-stretch gap-3">
        {isProtocol ? (
          <>
            <ProtocolMiniCard
              protocolId={currentProtocolId}
              tier={currentTier}
              label="Current"
              compact={compact}
            />
            <div className="flex items-center px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={compact ? 16 : 20}
                height={compact ? 16 : 20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                className="text-[var(--brand-navy)] flex-shrink-0"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
            <ProtocolMiniCard
              protocolId={selectedProtocol}
              tier={selectedTier}
              label="New plan"
              compact={compact}
            />
          </>
        ) : (
          <>
            <FormulaMiniCard
              formulaId={currentFormulaId}
              packSize={currentPackSize}
              label="Current"
              compact={compact}
            />
            <div className="flex items-center px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={compact ? 16 : 20}
                height={compact ? 16 : 20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                className="text-[var(--brand-navy)] flex-shrink-0"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
            <FormulaMiniCard
              formulaId={selectedFormulaId}
              packSize={selectedPackSize}
              label="New plan"
              compact={compact}
            />
          </>
        )}
      </div>
    </div>
  );
}
