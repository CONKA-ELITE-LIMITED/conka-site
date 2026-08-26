import { getImageProps } from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";
import TrustMicroRow from "./TrustMicroRow";

/* ============================================================================
 * HomeHeroStatic — the live home hero: metal-tray still renders (Magic Mind
 * structure), one art-directed asset per breakpoint.
 *
 * Mobile: the portrait tray render (750x1500) in a box ~10% shorter than
 * its native 1:2 (cropped off the top white headroom), fully self-contained
 * — staggered title + description overlaid in the remaining headroom, CTA +
 * trust row overlaid above its bottom edge. Desktop: the
 * landscape tray render (2560x1097) full-bleed at native aspect; the tray is
 * composed right of centre, so the copy + CTA overlay the pale negative
 * space on the left.
 *
 * Server component (no client JS). A single <picture> serves both crops so
 * each viewport downloads exactly one asset (two hidden next/image blocks
 * would fetch both); getImageProps supplies the optimised srcsets and
 * eager/high-priority hints for the LCP element.
 *
 * Replaces HomeHeroVideo + HomeHeroVideoDesktop (kept in the codebase,
 * unused, as the revert path).
 * ========================================================================== */

const ALT =
  "CONKA Flow and Clear shots on a steel desk tray beside a watch, pens and a notebook";

export default function HomeHeroStatic() {
  const shared = { alt: ALT, priority: true, sizes: "100vw" };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...shared,
    width: 2560,
    height: 1097,
    src: "/formulas/both/BothMetalTray.jpg",
  });
  const { props: mobileImgProps } = getImageProps({
    ...shared,
    width: 750,
    height: 1500,
    src: "/formulas/both/BothMetalTrayMobile.jpg",
  });

  return (
    <div className="max-lg:-mx-5 max-lg:w-[calc(100%+2.5rem)]">
      {/* Mobile: ~10% shorter than the asset's native 1:2 — object-bottom
          takes the crop out of the top white headroom so the tray stays
          intact and the CTA sits higher on screen. Title + description
          overlay the remaining headroom, CTA + trust row overlay near the
          bottom edge. Desktop: native 2560:1097, no crop. */}
      <div className="relative aspect-[5/9] w-full overflow-hidden lg:aspect-[2560/1097]">
        <picture>
          <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="100vw" />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in mobileImgProps */}
          <img
            {...mobileImgProps}
            className="absolute inset-0 h-full w-full object-cover object-bottom lg:object-center"
          />
        </picture>

        {/* Mobile title + description — overlaid in the top white space.
            min() caps the size on sub-360px viewports so the nowrap line
            cannot clip. */}
        <header className="relative z-10 px-5 pt-4 text-center lg:hidden">
          <h1 className="text-black" style={{ letterSpacing: "-0.025em" }}>
            <span className="block whitespace-nowrap text-[min(2.5rem,11vw)] font-bold leading-[0.98]">
              A Sharper Mind.
            </span>
            <span className="mt-1 block text-[2rem] font-medium leading-[1.05]">
              Morning to Evening.
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-[34ch] text-[15px] font-medium leading-snug text-black">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every
            day.
          </p>
        </header>

        {/* Mobile CTA + trust row — overlaid above the asset's bottom edge. */}
        <div className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center px-5 lg:hidden">
          <ConkaCTAButton href="/conka-both" meta={null} inverted>
            Buy CONKA Today
          </ConkaCTAButton>
          <TrustMicroRow className="mt-4" />
        </div>

        {/* Desktop bottom fade — the render melts into the white section below
            rather than ending on a hard edge. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[10%] lg:block"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Desktop copy — overlaid in the left negative space, vertically
            centred. Staggered two-tier title, left-aligned (brand rule). */}
        <div className="absolute inset-0 z-10 hidden items-center lg:flex">
          <div className="flex flex-col items-start gap-5 px-[5vw] text-left text-black">
            <h1 className="mb-0 text-black" style={{ letterSpacing: "-0.025em" }}>
              <span className="block whitespace-nowrap text-[4rem] font-bold leading-[0.98] xl:text-[5rem]">
                A Sharper Mind.
              </span>
              <span className="mt-1 block text-[2.75rem] font-medium leading-[1.05] xl:ml-28 xl:text-[3.5rem]">
                Morning to Evening.
              </span>
            </h1>
            <p className="max-w-[42ch] text-lg leading-snug text-black xl:text-[1.1875rem]">
              For minds that demand more. A patented nootropic shot, clinically
              formulated to support focus, memory, and mental endurance every
              day.
            </p>
            <ConkaCTAButton href="/conka-both" meta={null}>
              Buy CONKA Today
            </ConkaCTAButton>
            <TrustMicroRow className="mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
