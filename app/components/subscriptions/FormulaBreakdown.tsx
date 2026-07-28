'use client';

import Image from 'next/image';

interface FormulaBreakdownProps {
  flowCount: number;
  clarityCount: number;
  isSelected: boolean;
  isUltimate?: boolean;
}

// Flow = amber/orange product, Clear = teal/blue product
// Uses product thumbnails instead of plain colored dots for visual clarity
export function FormulaBreakdown({
  flowCount,
  clarityCount,
  isSelected,
  isUltimate = false,
}: FormulaBreakdownProps) {
  const perDeliveryText = isUltimate ? ' per delivery' : '/week';
  return (
    <div className={`flex items-center gap-2.5 mt-2 ${isSelected ? 'opacity-90' : 'opacity-70'}`}>
      <div className="flex items-center gap-1">
        <Image
          src="/formulas/ConkaFlowColour.jpg"
          alt=""
          width={16}
          height={16}
          className="overflow-hidden"
        />
        <span className="text-[10px] tabular-nums">{flowCount}x Flow</span>
      </div>
      <span className={isSelected ? 'opacity-50' : 'opacity-30'}>+</span>
      <div className="flex items-center gap-1">
        <Image
          src="/formulas/ConkaClearColour.jpg"
          alt=""
          width={16}
          height={16}
          className="overflow-hidden"
        />
        <span className="text-[10px] tabular-nums">{clarityCount}x Clear</span>
      </div>
      <span className={`text-[10px] tabular-nums ${isSelected ? 'opacity-50' : 'opacity-40'}`}>
        {perDeliveryText}
      </span>
    </div>
  );
}
