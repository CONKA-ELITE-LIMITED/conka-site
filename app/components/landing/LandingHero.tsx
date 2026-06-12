import Image from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";
import GuaranteeRow from "./GuaranteeRow";

const AVATAR_COUNT = 5;

/* Trust micro-row: stacked avatars + (4.5 stars + Excellent 4.7) + review count */
function TrustMicroRow() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center">
        {Array.from({ length: AVATAR_COUNT }, (_, i) => (
          <div
            key={i}
            className="relative w-[35px] h-[35px] rounded-full overflow-hidden"
            style={{
              marginLeft: i === 0 ? 0 : "-10px",
              zIndex: AVATAR_COUNT - i,
            }}
          >
            <Image
              src={`/avatars/${i + 1}.jpg`}
              alt="CONKA customer"
              fill
              className="object-cover"
              sizes="35px"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-2">
          {/* 4.7 stars via overlay: grey base + gold clipped to 94% width */}
          <div
            className="relative inline-block leading-none"
            style={{ fontSize: "20px", letterSpacing: "0.05em" }}
            aria-label="4.7 out of 5 stars"
          >
            <span className="text-black/15" aria-hidden="true">
              ★★★★★
            </span>
            <span
              className="absolute top-0 left-0 overflow-hidden whitespace-nowrap"
              style={{ color: "#F59E0B", width: "94%" }}
              aria-hidden="true"
            >
              ★★★★★
            </span>
          </div>
          <span className="text-[14px] font-bold text-black">
            Excellent 4.7
          </span>
        </div>
        <span className="text-[12px] text-black mt-1">
          <strong className="font-bold">622+</strong> reviews ·{" "}
          <strong className="font-bold">5,000+</strong> daily users
        </span>
      </div>
    </div>
  );
}

export default function LandingHero() {
  return (
    <div>
      {/* Mobile — full-bleed image (clean, soft fade at bottom), trust row + title + CTA below */}
      <div className="lg:hidden">
        {/* aspect-[3/2] matches the render's native 2528x1696 so the
            composed ingredients aren't cropped away */}
        <div className="relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] aspect-[3/2]">
          <Image
            src="/formulas/both/BoxIngredientHero.png"
            alt="CONKA Flow and Clear shots surrounded by their ingredients"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>

        <header className="mt-6">
          <TrustMicroRow />
          <h1
            className="text-black font-semibold text-[38px] leading-[1.08]"
            style={{ letterSpacing: "-0.02em" }}
          >
            A Sharper Mind.
            <br />
            Morning to Evening.
          </h1>
          <p className="mt-4 text-[15px] leading-snug text-black/70">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
          </p>
        </header>

        <div className="mt-6 flex flex-col items-center">
          <ConkaCTAButton href="/conka-both" meta={null}>Buy CONKA Today</ConkaCTAButton>
          <GuaranteeRow />
        </div>
      </div>

      {/* Desktop — content left, asset right. Even split (was 1fr_2fr) so the
          asset reads as a complement to the message rather than dominating it.
          [1fr_1fr] (not grid-cols-2) so the columns respect the nowrap title's
          min width instead of letting it overflow at narrow desktop widths. */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_1fr] lg:gap-12 xl:gap-16 lg:items-center">
        {/* Left — trust row, title, CTA */}
        <div className="flex flex-col items-start">
          <TrustMicroRow />

          {/* whitespace-nowrap keeps both lines intact; the grid's text column
              sizes to fit them, which is what holds the image column down */}
          <h1
            className="text-black font-semibold text-5xl xl:text-6xl leading-[1.05] mb-5 whitespace-nowrap"
            style={{ letterSpacing: "-0.02em" }}
          >
            A Sharper Mind.
            <br />
            Morning to Evening.
          </h1>

          <p className="text-base lg:text-lg leading-snug text-black/70 mb-10 max-w-[42ch]">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
          </p>

          <div>
            <ConkaCTAButton href="/conka-both" meta={null}>Buy CONKA Today</ConkaCTAButton>
            <GuaranteeRow />
          </div>
        </div>

        {/* Right — clean asset, no overlays. Wider/shorter aspect on desktop
            so the source crop reads less zoomed. */}
        <div className="relative w-full aspect-[3/2] overflow-hidden border border-black/12 bg-[#f5f5f5]">
          <Image
            src="/formulas/both/BoxIngredientHero.png"
            alt="CONKA Flow and Clear shots surrounded by their ingredients"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
