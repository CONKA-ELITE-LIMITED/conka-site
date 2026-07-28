"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/account", label: "Overview" },
  { href: "/account/subscriptions", label: "Subscriptions" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/details", label: "Details" },
] as const;

export function AccountSubNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account navigation"
      className="bg-white pt-5 pb-4 px-4 lg:pt-8 lg:pb-5 lg:px-[5vw]"
    >
      <div className="mx-auto max-w-[1280px] grid grid-cols-4 gap-2 lg:gap-3">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`min-h-[44px] flex items-center justify-center rounded-full border text-[13px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-navy)] ${
                isActive
                  ? "bg-[var(--brand-navy)] text-white border-[var(--brand-navy)]"
                  : "bg-white text-black/70 border-black/12 hover:text-black hover:border-black/40"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default AccountSubNav;
