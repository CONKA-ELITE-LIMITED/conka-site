/**
 * In-article product call-to-action. Maps a post's related product to the
 * canonical nav product data and links to the PDP. Analytics (source: 'blog')
 * is wired in Phase 3.
 */
import Image from "next/image";
import Link from "next/link";
import { NAV_PRODUCTS } from "@/app/components/navigation/navConfig";
import type { RelatedProduct } from "@/app/lib/blog";

const HREF: Record<RelatedProduct, string> = {
  flow: "/conka-flow",
  clear: "/conka-clarity",
  both: "/conka-both",
};

const SHORT: Record<RelatedProduct, string> = {
  flow: "Flow",
  clear: "Clear",
  both: "Both",
};

export default function ProductCTA({ product }: { product: RelatedProduct }) {
  const nav = NAV_PRODUCTS.find((p) => p.href === HREF[product]);
  if (!nav) return null;

  return (
    <aside className="rounded-md bg-[#eef1f8] p-6 sm:p-8 ring-1 ring-black/8">
      <p className="text-[13px] font-semibold text-[#1B2757]">
        Recommended
      </p>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="relative h-24 w-24 shrink-0 rounded-md bg-white">
          <Image
            src={nav.image}
            alt={nav.alt}
            fill
            sizes="96px"
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="brand-h3">{nav.name}</h3>
          <p className="brand-body !max-w-none mt-1 text-black/60">
            {nav.descriptionLong}
          </p>
        </div>
        <Link
          href={nav.href}
          className="inline-flex items-center justify-center rounded-full bg-[#1B2757] text-white hover:bg-[#26325f] transition-colors min-h-[48px] px-7 text-[15px] font-semibold whitespace-nowrap"
        >
          Shop {SHORT[product]}
        </Link>
      </div>
    </aside>
  );
}
