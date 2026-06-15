import Image from "next/image";
import { TrustIconGuarantee } from "./icons";

/* ============================================================================
 * ResearchBackedGraphic
 *
 * Reason-slot proof card for the "built on real proof" point: a full-bleed
 * research photo with a navy scrim (the lander band treatment), the three
 * partner universities in white chips, and a credential strip using the real
 * Informed Sport and Made in Britain badges. Static, our patterns (Tailwind,
 * next/image), no client interactivity.
 * ========================================================================== */

const UNIVERSITIES = [
  { src: "/lander/unilogos/UniversityOfCambridge.png", alt: "University of Cambridge" },
  { src: "/lander/unilogos/UniversityOfDurham.png", alt: "Durham University" },
  { src: "/lander/unilogos/UniversityOfExeter.png", alt: "University of Exeter" },
];

/** White credential chip holding a real badge image. */
function BadgeChip({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-[68px] items-center justify-center rounded-xl bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(10,15,30,0.22)]">
      <div className="relative h-full w-full">
        <Image src={src} alt={alt} fill className="object-contain" sizes="120px" />
      </div>
    </div>
  );
}

export default function ResearchBackedGraphic() {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-8">
      {/* Background research photo + navy scrim */}
      <Image
        src="/lander/research-bg.jpg"
        alt=""
        fill
        aria-hidden
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(13,18,32,0.62) 0%, rgba(13,18,32,0.55) 50%, rgba(13,18,32,0.68) 100%)",
        }}
      />

      <div className="relative z-10">
        <p className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
          Developed with leading universities
        </p>

        {/* University logos — large white chips */}
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          {UNIVERSITIES.map((u) => (
            <div
              key={u.alt}
              className="flex h-[88px] items-center justify-center rounded-2xl bg-white px-3 py-4 shadow-[0_10px_28px_rgba(10,15,30,0.24)]"
            >
              <div className="relative h-full w-full">
                <Image
                  src={u.src}
                  alt={u.alt}
                  fill
                  className="object-contain"
                  sizes="160px"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Credential strip — real badges + patent chip */}
        <div className="grid grid-cols-3 gap-2.5">
          <BadgeChip src="/logos/InformedSportLogo.png" alt="Informed Sport Certified" />
          <BadgeChip src="/logos/MadeInBritain.png" alt="Made in Britain" />
          <div className="flex h-[68px] flex-col items-center justify-center gap-1.5 rounded-xl bg-white px-2 py-2.5 shadow-[0_8px_24px_rgba(10,15,30,0.22)]">
            <TrustIconGuarantee className="h-6 w-6 text-[#1B2757]" />
            <span className="text-[10px] font-semibold leading-none text-black/70">
              Patented
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
