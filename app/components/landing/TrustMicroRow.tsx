import Image from "next/image";

const AVATAR_COUNT = 5;

/* Trust micro-row: stacked avatars + (4.7 stars + Excellent 4.7) + review count.
   Compacted to the IM8 scale. Bottom margin is owned by the parent. Shared by
   the home heroes (LandingHero, LandingHeroVideo). */
export default function TrustMicroRow({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: AVATAR_COUNT }, (_, i) => (
          <div
            key={i}
            className="relative w-[26px] h-[26px] rounded-full overflow-hidden border border-black/10"
            style={{
              marginLeft: i === 0 ? 0 : "-8px",
              zIndex: AVATAR_COUNT - i,
            }}
          >
            <Image
              src={`/avatars/${i + 1}.jpg`}
              alt="CONKA customer"
              fill
              className="object-cover"
              sizes="26px"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          {/* 4.7 stars via overlay: grey base + gold clipped to 94% width */}
          <div
            className="relative inline-block leading-none"
            style={{ fontSize: "15px", letterSpacing: "0.05em" }}
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
          <span className="text-[13px] font-bold text-black">
            Excellent 4.7
          </span>
        </div>
        <span className="text-[11px] text-black/80 mt-0.5">
          <strong className="font-bold">622+</strong> reviews ·{" "}
          <strong className="font-bold">5,000+</strong> daily users
        </span>
      </div>
    </div>
  );
}
