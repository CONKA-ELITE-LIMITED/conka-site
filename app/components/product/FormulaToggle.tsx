import { SunIcon, SunHorizonIcon } from "@/app/components/landing/icons";
import SegmentedToggle from "@/app/components/SegmentedToggle";

/* ============================================================================
 * FormulaToggle
 *
 * Flow/Clear (AM/PM) switch, a thin wrapper over the shared SegmentedToggle so
 * the home showcase and the clinical product pages render one consistent
 * control. Adds the time-of-day glyphs and the brand-fixed labels; all pill
 * styling lives in SegmentedToggle.
 *
 * Controlled and generic over the value type so each caller keeps its own
 * identifiers (the showcase uses "flow"/"clear", the product pages use the
 * "01"/"02" FormulaId) without an extra mapping layer.
 * ========================================================================== */

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
  /** Label style. "formula" (default) reads "Flow · AM" / "Clear · PM" so the
   *  product pages name the formula; "time" reads simply "Morning" /
   *  "Afternoon" for surfaces that only need the time-of-day cue. */
  variant?: "formula" | "time";
}

export default function FormulaToggle<T extends string>({
  value,
  flowValue,
  clearValue,
  onChange,
  className = "",
  ariaLabel = "Choose your formula",
  variant = "formula",
}: FormulaToggleProps<T>) {
  const options = [
    {
      value: flowValue,
      label: variant === "time" ? "Morning" : "Flow · AM",
      icon: <SunIcon className="w-[18px] h-[18px] shrink-0" />,
    },
    {
      value: clearValue,
      label: variant === "time" ? "Afternoon" : "Clear · PM",
      icon: <SunHorizonIcon className="w-[18px] h-[18px] shrink-0" />,
    },
  ];

  return (
    <SegmentedToggle
      options={options}
      value={value}
      onChange={onChange}
      ariaLabel={ariaLabel}
      className={className}
      fill
    />
  );
}
