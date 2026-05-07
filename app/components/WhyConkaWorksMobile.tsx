import Image from "next/image";

const LOGOS = [
  {
    src: "/logos/InformedSportLogo.png",
    alt: "Informed Sport certified",
    label: "Informed Sport",
    zoom: false,
  },
  {
    src: "/logos/UniversityOfDurham.png",
    alt: "Durham University",
    label: "Durham University",
    zoom: true,
  },
  {
    src: "/logos/UniversityOfExeter.png",
    alt: "University of Exeter",
    label: "Univ. of Exeter",
    zoom: true,
  },
  {
    src: "/logos/MadeInBritain.png",
    alt: "Made in Britain",
    label: "Made in Britain",
    zoom: false,
  },
];

export default function WhyConkaWorksMobile() {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// Credentials · PROOF-01"}
      </p>
      <h2
        className="brand-h1 mb-2 text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Certified for Performance.
      </h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-8">
        Third-party tested · University-trialled · GMP-manufactured
      </p>

      <div className="grid grid-cols-4 gap-2">
        {LOGOS.map((logo) => (
          <div
            key={logo.src}
            className="flex flex-col items-center bg-white border border-black/8 px-2 py-3 gap-2"
          >
            <div className="relative h-10 w-full">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                loading="lazy"
                className={`object-contain ${logo.zoom ? "scale-125" : ""}`}
                sizes="80px"
              />
            </div>
            <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-black/45 text-center leading-tight">
              {logo.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
