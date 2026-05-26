import Link from "next/link";
import { FUNNEL_URL } from "@/app/lib/landingConstants";

export default function CROPillCTA({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href ?? FUNNEL_URL}
      className={`inline-flex items-center justify-center bg-[#1B2757] text-white font-semibold text-base py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] ${className}`}
    >
      {children}
    </Link>
  );
}
