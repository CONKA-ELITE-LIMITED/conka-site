"use client";

import Link from "next/link";
import Image from "next/image";
import type { NavGroup } from "./navConfig";

/* ============================================================================
 * NavGroupMegaMenu
 *
 * Desktop mega-menu for a grouped set of links (Science, App), rendered as
 * image tiles in the same visual language as ShopMegaMenu: black-bordered
 * tiles, square asset, title + one-line description. No CTA; the whole tile
 * is the link.
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
        <div className="max-w-4xl mx-auto flex flex-wrap gap-5">
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="group w-[260px] bg-[#f5f5f5] border border-black/12 hover:bg-black/[0.04] overflow-hidden transition-colors flex flex-col"
            >
              <div
                className={`relative aspect-square overflow-hidden ${
                  link.imageFit === "contain" ? "bg-[#1c1c1c]" : "bg-white"
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
                    } group-hover:scale-[1.02] transition-transform duration-300`}
                    sizes="260px"
                  />
                )}
              </div>
              <div className="p-4 flex flex-col">
                <p className="text-base font-semibold text-black mb-1">
                  {link.label}
                </p>
                {link.description && (
                  <p className="text-xs text-black/60 leading-relaxed">
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
