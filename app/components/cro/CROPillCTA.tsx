import Link from "next/link";
import { FUNNEL_URL } from "@/app/lib/landingConstants";

interface CROPillCTAProps {
  children: React.ReactNode;
  /** Provide for link mode. Defaults to FUNNEL_URL when neither href nor onClick is set. */
  href?: string;
  className?: string;
  /** Providing onClick switches to button mode (renders a <button> instead of a <Link>). */
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function CROPillCTA({
  children,
  href,
  className = "",
  onClick,
  disabled,
  type = "button",
}: CROPillCTAProps) {
  const base = `inline-flex items-center justify-center bg-[#1B2757] text-white font-semibold text-base py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] ${
    disabled ? "opacity-60 cursor-not-allowed" : ""
  } ${className}`;

  if (onClick) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={base}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href ?? FUNNEL_URL} className={base}>
      {children}
    </Link>
  );
}
