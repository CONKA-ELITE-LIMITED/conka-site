"use client";

import Link from "next/link";
import Image from "next/image";
import type { NavGroup } from "./navConfig";

/* ============================================================================
 * NavGroupMegaMenu
 *
 * Desktop mega-menu for a grouped set of links (Science, App), rendered with
 * the same lifted product-tile treatment as ShopMegaMenu: rounded white card,
 * square asset, centred title + one-line description, and a navy footer fill
 * on hover. No CTA; the whole tile is the link.
 *
 * Two deliberate differences from the Shop tiles. The panel here stays white
 * rather than taking Shop's navy gradient, so Shop reads as the primary menu;
 * that means the card needs its own hairline ring for an edge, since a shadow
 * alone does not separate white-on-white. And there is no badge straddling the
 * image seam, because a NavLink carries no equivalent of a product's
 * time-of-day tag, so the footer uses even padding instead of Shop's pt-7.
 *
 * Positioned `absolute top-full` against the fixed nav wrapper so it drops
 * flush from the header bottom with no gap and rides the scroll-hide
 * transform. Open state is owned by the parent Navigation (one menu at a
 * time). Tiles are a fixed width and left-aligned so a 2-link group and a
 * 3-link group keep the same tile size.
 * ========================================================================== */

export default function NavGroupMegaMenu({
  isOpen,
  group,
  onClose,
  onEnter,
  onLeave,
}: {
  isOpen: boolean;
  group: NavGroup;
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full bg-white border-b border-black/12 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="w-full px-6 md:px-16 py-8">
        <div className="max-w-4xl flex flex-wrap gap-5">
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              // flex-col, not block: the row stretches every tile to the
              // tallest, so the footer has to grow into that height. Left as a
              // block, a one-line description leaves bare card below the
              // footer, which shows up as a white bar under the navy hover.
              className="group flex w-[260px] flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/10 transition-all duration-200 hover:-translate-y-1 hover:ring-2 hover:ring-[#1B2757] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]"
            >
              <div
                className={`relative aspect-square overflow-hidden ${
                  // Dark plate for transparent app screenshots; photos fill the
                  // tile and sit on the same grey as the Shop product shots.
                  link.imageFit === "contain" ? "bg-[#333333]" : "bg-[#f5f5f5]"
                }`}
              >
                {link.image && (
                  <Image
                    src={link.image}
                    alt={link.imageAlt ?? link.label}
                    fill
                    className={`${
                      link.imageFit === "contain"
                        ? "object-contain p-6"
                        : "object-cover"
                    } transition-transform duration-300 group-hover:scale-[1.04]`}
                    sizes="260px"
                  />
                )}
              </div>
              <div className="flex-1 border-t border-black/10 px-4 py-4 text-center transition-colors group-hover:border-white/15 group-hover:bg-[#1B2757]">
                <p className="text-lg font-bold text-black transition-colors group-hover:text-white">
                  {link.label}
                </p>
                {link.description && (
                  <p className="mt-1.5 text-xs leading-snug text-black/60 transition-colors group-hover:text-white/70">
                    {link.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
