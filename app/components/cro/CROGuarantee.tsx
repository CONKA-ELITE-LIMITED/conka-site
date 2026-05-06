import Image from "next/image";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";
import ConkaCTAButton from "../landing/ConkaCTAButton";

const BULLETS = [
  "Free UK shipping on every order",
  "Full refund if your score doesn't improve",
  "No return required",
  "No forms, no questions, no conditions",
];

export default function CROGuarantee({
  hideCTA = false,
  ctaLabel,
  ctaHref,
}: {
  hideCTA?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  return (
    <div>
      <p className="brand-eyebrow mb-3">
        {"// Trial terms · PROOF-02"}
      </p>

      <div className="mb-8">
        <h2
          className="brand-h2 mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          {GUARANTEE_DAYS}-Day Risk Free Trial
        </h2>
        <p className="brand-mono-sub">
          100 days · Refund guaranteed · Install the app
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
        <div className="flex-1 order-2 lg:order-1 w-full">
          <p className="brand-body text-black/70">
            Most brands offer 30 days. We offer {GUARANTEE_DAYS}. Not generosity. Confidence.
          </p>
          <p className="brand-body text-black/70 mt-4">
            We built an app that measures your cognitive score objectively. Take your baseline on day one, test twice a week. If your numbers do not move in {GUARANTEE_DAYS} days, contact us for a full refund. No returns. No forms.
            <sup className="text-[0.5em] text-black/40 align-super">*</sup>
          </p>
          <p className="brand-body text-black/70 mt-4">
            We can only make this offer because we already know it works.
          </p>

          {!hideCTA && (
            <div className="mt-8">
              <ConkaCTAButton href={ctaHref} meta={null}>
                {ctaLabel ?? "Try it 100% Risk Free Now"}
              </ConkaCTAButton>
            </div>
          )}

          <ul className="mt-6 border-t border-black/10">
            {BULLETS.map((bullet, i) => (
              <li
                key={bullet}
                className="flex items-baseline gap-4 py-3 border-b border-black/8"
              >
                <span className="font-mono text-[11px] font-bold tabular-nums text-black/50 leading-none shrink-0 w-7">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <span className="text-sm lg:text-base text-black/80 leading-snug">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-black/40">
            *First-time customers only. Contact info@conka.io within{" "}
            {GUARANTEE_DAYS} days of your first order for a full refund.
          </p>
        </div>

        <div className="relative flex justify-center order-1 lg:order-2 w-full lg:w-auto">
          <div
            className="relative"
            style={{ width: "clamp(180px, 40vw, 240px)" }}
          >
            <Image
              src="/app/AppConkaRing.png"
              alt="CONKA app showing cognitive performance score"
              width={240}
              height={480}
              loading="lazy"
              className="block w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
