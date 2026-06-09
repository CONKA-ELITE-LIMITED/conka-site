import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import ApplicationForm from "@/app/components/b2b/ApplicationForm";
import InformedSportCertification from "@/app/components/InformedSportCertification";
import PilotProgramme from "@/app/components/b2b/PilotProgramme";

export const metadata: Metadata = {
  title: "Team & Club Pricing | CONKA",
  description:
    "Bulk CONKA for sports clubs and performance organisations. Tiered team pricing, PO numbers and invoicing supported. Apply for your pricing in seconds.",
  openGraph: {
    title: "CONKA for Teams & Clubs",
    description:
      "Equip your whole squad. Tiered bulk pricing, PO numbers and invoicing for sports clubs and performance organisations.",
  },
};

const VALUE_POINTS = [
  {
    label: "Squad pricing",
    body: "Tiered per-box pricing that drops as your order grows. The bigger the squad, the better the rate.",
  },
  {
    label: "Built for procurement",
    body: "Add a PO number at checkout and pay by card or invoice. Whatever your finance team needs.",
  },
  {
    label: "Straight to your ground",
    body: "Delivered to your training base or clubhouse, ready for the season.",
  },
];

export default function ProfessionalsPage() {
  return (
    <div className="brand-clinical brand-page min-h-screen flex flex-col">
      <Navigation />

      {/* HERO — sport positioning, no pricing */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        style={{ paddingTop: "5rem" }}
        aria-label="CONKA for teams and clubs"
      >
        <div className="brand-track">
          <p className="brand-eyebrow mb-4">
            {"// For teams & performance staff"}
          </p>
          <h1 className="brand-h1 max-w-[18ch]">
            The daily brain performance shot, for your whole squad.
          </h1>
          <p className="brand-body mt-6">
            CONKA is built for sport. Trusted by professional athletes and
            developed around clinically studied ingredients. Now available to
            clubs and performance organisations at team pricing, with the
            procurement support your finance team expects.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#apply"
              className="brand-btn brand-btn-accent inline-flex items-center justify-center min-h-[52px] w-full sm:w-auto text-sm uppercase tracking-[0.15em]"
            >
              Get team pricing
            </a>
            <a
              href="#pilot"
              className="brand-btn brand-btn-secondary inline-flex items-center justify-center min-h-[52px] w-full sm:w-auto text-sm uppercase tracking-[0.15em]"
            >
              Explore a squad pilot
            </a>
          </div>
        </div>
      </section>

      {/* TRUST — third-party anti-doping certification, promoted high */}
      <section
        className="brand-section brand-bg-tint"
        aria-label="Independent certification"
      >
        <div className="brand-track">
          <p className="brand-eyebrow mb-5">{"// Independently tested"}</p>
          <InformedSportCertification headingLevel="h2" />
        </div>
      </section>

      {/* PILOT — squad pilot USP (hero secondary CTA anchors here) */}
      <section
        id="pilot"
        className="brand-section brand-bg-white"
        aria-label="Squad pilot programme"
      >
        <div className="brand-track">
          <PilotProgramme />
        </div>
      </section>

      {/* APPLY — value points + enquiry form */}
      <section
        id="apply"
        className="brand-section brand-bg-tint"
        aria-label="Apply for team pricing"
      >
        <div className="brand-track">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
            {/* Intro / value */}
            <div>
              <p className="brand-eyebrow mb-4">{"// Apply for pricing"}</p>
              <h2 className="brand-h2 max-w-[16ch]">
                Tell us about your team. Get pricing instantly.
              </h2>
              <p className="brand-body mt-5">
                Fill in the form and we&apos;ll email your team pricing straight
                away. No approval queue, no sales call required.
              </p>
              <ul className="mt-8 flex flex-col gap-6">
                {VALUE_POINTS.map((point) => (
                  <li key={point.label}>
                    <p className="brand-eyebrow mb-1.5">{point.label}</p>
                    <p className="brand-body">{point.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div>
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION ENQUIRY — recurring supply exit ramp */}
      <section
        className="brand-section brand-bg-white"
        aria-label="Regular supply enquiry"
      >
        <div className="brand-track">
          <div className="rounded-none border border-black/12 bg-white p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="brand-eyebrow mb-2">{"// Ongoing supply"}</p>
              <h3 className="brand-h3 max-w-[22ch]">
                Need a regular supply for the whole season?
              </h3>
            </div>
            <a
              href="mailto:harryglover@conka.io?subject=CONKA%20regular%20team%20supply"
              className="brand-btn brand-btn-secondary inline-flex items-center justify-center min-h-[52px] text-sm uppercase tracking-[0.15em] whitespace-nowrap"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
