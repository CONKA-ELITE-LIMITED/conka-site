import Image from "next/image";
import { StorySection as StorySectionType } from "@/app/lib/storyData";

interface StorySectionProps {
  section: StorySectionType;
  totalSections: number;
}

export function StorySection({
  section,
  totalSections,
}: StorySectionProps) {
  const formattedId = section.id.toString().padStart(2, "0");
  const formattedTotal = totalSections.toString().padStart(2, "0");
  const isEven = section.id % 2 === 0;

  return (
    <div
      className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20"
      data-section-id={section.id}
    >
      <div
        className={`flex-1 flex flex-col justify-center ${
          isEven ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-4 lg:mb-6">
          {`// Chapter ${formattedId}/${formattedTotal} · STORY-01`}
        </p>

        <div className="mb-6 lg:mb-8">
          <h2
            className="brand-h2 text-black mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            {section.headline}
          </h2>
          {section.subtitle && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
              {section.subtitle}
            </p>
          )}
        </div>

        <p
          className="brand-body text-base lg:text-lg text-black/80"
          style={{
            maxWidth: "var(--brand-body-max-width)",
            lineHeight: "var(--brand-body-leading)",
          }}
        >
          {section.body}
        </p>

        {section.quote && (
          <div className="mt-8 lg:mt-10 border-l-2 border-[#1B2757] pl-5 lg:pl-6">
            <blockquote className="brand-body text-lg lg:text-xl italic text-black mb-3">
              &ldquo;{section.quote.text}&rdquo;
            </blockquote>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-black/55">
              <span className="text-[#1B2757]">
                {section.quote.author}
              </span>
              <span className="text-black/30">·</span>
              <span>{section.quote.role}</span>
            </div>
          </div>
        )}
      </div>

      <div
        className={`flex-1 w-full ${
          isEven ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {section.image ? (
          <div className="relative w-full h-56 lg:h-[500px] overflow-hidden border border-black/12 bg-white">
            <Image
              src={section.image}
              alt={section.headline}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
            <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
              Fig. {formattedId}
            </span>
            <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
              Ch-{formattedId} / {formattedTotal}
            </span>
          </div>
        ) : (
          <div className="w-full h-56 lg:h-[500px] border border-black/12 bg-black/[0.03] flex items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 text-center px-4">
              {section.imagePlaceholder}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StorySection;
