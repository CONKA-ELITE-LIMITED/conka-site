import ScienceAdaptogens from "./ScienceAdaptogens";
import ScienceNootropics from "./ScienceNootropics";

export default function ScienceEducation() {
  return (
    <div>
      <div className="mb-8 lg:mb-12 max-w-2xl">
        <p className="brand-eyebrow mb-3">{"// Education · SCI-04"}</p>
        <h2
          className="brand-h2 text-black mb-4"
          style={{ letterSpacing: "-0.02em" }}
        >
          Adaptogens and nootropics, explained.
        </h2>
        <p className="text-sm md:text-base text-black/75 leading-relaxed">
          Two classes of active, two different jobs. Here is what each one is,
          the ingredients behind it, and how it works in the body.
        </p>
      </div>

      {/* Two columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        <ScienceAdaptogens />
        <ScienceNootropics />
      </div>
    </div>
  );
}
