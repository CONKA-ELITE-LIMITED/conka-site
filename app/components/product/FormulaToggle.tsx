import { SunIcon, SunHorizonIcon } from "@/app/components/landing/icons";

/* ============================================================================
 * FormulaToggle
 *
 * Rounded AM/PM pill that switches between Flow (morning) and Clear
 * (afternoon). Ported from the lander's IngredientsSection toggle into a
 * shared, controlled component so the home showcase and the clinical product
 * pages render one consistent control. A deliberate rounded exception on the
 * otherwise sharp-lined clinical pages: a sharp toggle reads as a segmented
 * filter, the rounded pill reads as a friendly time-of-day switch.
 *
 * Controlled and generic over the value type so each caller keeps its own
 * identifiers (the showcase uses "flow"/"clear", the product pages use the
 * "01"/"02" FormulaId) without an extra mapping layer.
 *
 * Brand-fixed: always Flow · AM then Clear · PM, with the shared time-of-day
 * glyphs. Only the values differ per caller.
 * ========================================================================== */

const NAVY = "#1B2757";

interface FormulaToggleProps<T extends string> {
  /** Currently selected value. */
  value: T;
  /** Value emitted when the Flow (morning) tab is chosen. */
  flowValue: T;
  /** Value emitted when the Clear (afternoon) tab is chosen. */
  clearValue: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
  /** Extra classes for the unselected tab (e.g. `bg-white` to lift it off an
   *  off-white section). Active tab styling is unaffected. */
  inactiveClassName?: string;
}

export default function FormulaToggle<T extends string>({
  value,
  flowValue,
  clearValue,
  onChange,
  className = "",
  ariaLabel = "Choose your formula",
  inactiveClassName = "",
}: FormulaToggleProps<T>) {
  const tabs = [
    { value: flowValue, label: "Flow", time: "AM", Icon: SunIcon },
    { value: clearValue, label: "Clear", time: "PM", Icon: SunHorizonIcon },
  ];

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex gap-1 rounded-full bg-[#f0efea] p-[5px] ${className}`}
    >
      {tabs.map(({ value: tabValue, label, time, Icon }) => {
        const isActive = tabValue === value;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tabValue)}
            className={`flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-full px-2 py-3 text-[15px] font-medium transition-colors cursor-pointer ${
              isActive
                ? "text-white"
                : `text-[#6b6b6b] hover:text-black ${inactiveClassName}`
            }`}
            style={isActive ? { backgroundColor: NAVY } : undefined}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {label} · {time}
          </button>
        );
      })}
    </div>
  );
}
