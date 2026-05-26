import Image from "next/image";
import CROPillCTA from "./CROPillCTA";

const STATS = [
  { value: "150,000+", label: "shots sold to date" },
  { value: "£500,000", label: "invested into clinical research" },
];

export default function CROBrandStory() {
  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        We Created Drinkable Focus.
      </h2>

      <p className="text-[15px] leading-snug text-black mb-8">
        We spent over £500,000 and 3 years developing the first nootropic shot
        etc etc.
      </p>

      <div className="relative aspect-[10/9] w-full overflow-hidden rounded-[var(--brand-radius-container)] mb-8 bg-white">
        <Image
          src="/hero/ShotsHero.jpg"
          alt="CONKA Flow and CONKA Clear daily brain performance shots"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover object-center scale-150"
        />
      </div>

      <div className="space-y-6 mb-8">
        {STATS.map((stat) => (
          <div key={stat.value}>
            <p
              className="text-black font-semibold text-[34px] leading-none tabular-nums"
              style={{ letterSpacing: "-0.02em" }}
            >
              {stat.value}
            </p>
            <p className="text-[15px] font-bold text-black mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <CROPillCTA>Order Now</CROPillCTA>
      </div>
    </div>
  );
}
