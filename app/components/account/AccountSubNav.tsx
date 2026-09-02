"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

/** Shield with a check — trust badge. */
function ShieldCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="w-3.5 h-3.5 shrink-0"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9 12 2 2 4-4m4 2c0 4.5-3.15 6.75-6.66 7.97a1 1 0 0 1-.68 0C8.15 18.75 5 16.5 5 12V7.2a1 1 0 0 1 .62-.92l6-2.4a1 1 0 0 1 .76 0l6 2.4a1 1 0 0 1 .62.92V12Z"
      />
    </svg>
  );
}

/** Package / orders. */
function OrdersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="w-[18px] h-[18px] shrink-0"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20.5 7.28 12 12m0 0L3.5 7.28M12 12v9.5m9-5.44V7.94a1 1 0 0 0-.52-.88l-8-4.44a1 1 0 0 0-.96 0l-8 4.44a1 1 0 0 0-.52.88v8.12a1 1 0 0 0 .52.88l8 4.44a1 1 0 0 0 .96 0l8-4.44a1 1 0 0 0 .52-.88ZM16.5 9.5l-9-5"
      />
    </svg>
  );
}

/** Person / account. */
function AccountIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="w-[18px] h-[18px] shrink-0"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 21c0-1.4 0-2.09-.17-2.66a4 4 0 0 0-2.67-2.67C16.59 15.5 15.9 15.5 14.5 15.5h-5c-1.4 0-2.09 0-2.66.17a4 4 0 0 0-2.67 2.67C4 18.91 4 19.6 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
      />
    </svg>
  );
}

/** Arrow out of door / logout. */
function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="w-[18px] h-[18px] shrink-0"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m16 17 5-5m0 0-5-5m5 5H9m3 5c0 .93 0 1.4-.1 1.78a3 3 0 0 1-2.12 2.12C9.4 21 8.93 21 8 21h-.5c-1.4 0-2.1 0-2.65-.23a3 3 0 0 1-1.62-1.62C3 18.6 3 17.9 3 16.5v-9c0-1.4 0-2.1.23-2.65a3 3 0 0 1 1.62-1.62C5.4 3 6.1 3 7.5 3H8c.93 0 1.4 0 1.78.1a3 3 0 0 1 2.12 2.12C12 5.6 12 6.07 12 7"
      />
    </svg>
  );
}

const ACTIONS = [
  { href: "/account/orders", label: "Orders", Icon: OrdersIcon },
  { href: "/account/details", label: "Account", Icon: AccountIcon },
] as const;

/** Breadcrumb trail for the current account location. Root is always "Home". */
function useAccountCrumbs(pathname: string): { label: string; href?: string }[] {
  const path = pathname.replace(/\/+$/, "") || "/account";
  const rest = path.startsWith("/account") ? path.slice("/account".length) : "";
  const seg = rest.split("/").filter(Boolean);
  // "Home" is the Skio portal at /account/manage (/account redirects there), so
  // it is hrefless when that IS the current page.
  const atHome = seg.length === 0 || seg[0] === "manage";
  const crumbs: { label: string; href?: string }[] = [
    atHome ? { label: "Home" } : { label: "Home", href: "/account/manage" },
  ];
  if (seg[0] === "orders") crumbs.push({ label: "Orders" });
  else if (seg[0] === "details") crumbs.push({ label: "Account" });
  return crumbs;
}

export function AccountSubNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const crumbs = useAccountCrumbs(pathname);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const actionBase =
    "inline-flex items-center gap-1.5 min-h-[44px] px-2.5 py-2 text-sm font-semibold rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-navy)]";

  return (
    <nav
      aria-label="Account navigation"
      className="bg-white pt-5 pb-2 px-4 lg:pt-7 lg:pb-2 lg:px-[5vw]"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Header: trust badge + actions */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          {/* Left: trust badge (also returns to the account home) */}
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-black/15 py-1 pl-2.5 pr-3 text-sm font-medium text-black hover:border-black/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-navy)]"
          >
            <ShieldCheckIcon />
            Secure account
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {ACTIONS.map(({ href, label, Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`${actionBase} text-black ${
                    isActive ? "" : "hover:opacity-70"
                  }`}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className={`${actionBase} text-black hover:opacity-70`}
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        </div>

        {/* Breadcrumb: where you are in the account */}
        <div
          aria-label="Breadcrumb"
          className="mt-3 flex items-center gap-1.5 text-[13px] tabular-nums"
        >
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-black/30" aria-hidden>
                    ›
                  </span>
                )}
                {c.href && !isLast ? (
                  <Link href={c.href} className="text-black/50 hover:text-black transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-black" aria-current="page">
                    {c.label}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default AccountSubNav;
