"use client";

import Image from "next/image";
import { Subscription } from "@/app/hooks/useSubscriptions";
import {
  getSubscriptionImage,
  getSubscriptionType,
} from "@/app/account/subscriptions/utils";

interface NextDeliveryHeroProps {
  subscription: Subscription;
  onSkipNext: () => void;
  onReschedule: () => void;
  onPlaceOrder: () => void;
  isActionLoading?: boolean;
}

function getFormulaLabel(type: ReturnType<typeof getSubscriptionType>): string {
  if (type === "flow") return "F01";
  if (type === "clear") return "F02";
  return "BOTH";
}

function formatNextDelivery(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Scheduling";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NextDeliveryHero({
  subscription,
  onSkipNext,
  onReschedule,
  onPlaceOrder,
  isActionLoading = false,
}: NextDeliveryHeroProps) {
  const image = getSubscriptionImage(subscription);
  const type = getSubscriptionType(subscription);
  const formulaLabel = getFormulaLabel(type);
  const title = subscription.product.title || "Your subscription";
  const renewalDateLabel = formatNextDelivery(subscription.nextBillingDate);

  return (
    <article
      aria-label="Next delivery"
      className="bg-white border border-black/12 grid grid-cols-1 lg:grid-cols-[288px_1fr]"
    >
      {/* Imagery */}
      <div className="relative aspect-[4/5] bg-[#f5f5f5] border-b lg:border-b-0 lg:border-r border-black/12 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 288px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-11 h-11 flex items-center justify-center text-white"
              style={{ backgroundColor: "#1B2757" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
                strokeLinejoin="miter"
              >
                <rect x="3" y="7" width="18" height="13" />
                <path d="M3 7l9-4 9 4" />
              </svg>
            </div>
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"
        />
        <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
          Fig. 01 · Next ship
        </span>
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 flex flex-col gap-5">
        <div className="flex items-start gap-3 flex-wrap">
          <h2
            className="text-xl lg:text-2xl font-semibold text-black"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#1B2757] bg-[#1B2757]/[0.06] border border-[#1B2757]/20 px-2 py-0.5 tabular-nums shrink-0 mt-1">
            {formulaLabel}
          </span>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
            Next renewal
          </p>
          <p
            className="text-3xl lg:text-4xl font-semibold tabular-nums text-black"
            style={{ letterSpacing: "-0.02em" }}
          >
            {renewalDateLabel}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-auto">
          <HeroActionButton
            onClick={onSkipNext}
            disabled={isActionLoading}
            label="Skip"
          />
          <HeroActionButton
            onClick={onReschedule}
            disabled={isActionLoading}
            label="Reschedule"
          />
          <HeroActionButton
            onClick={onPlaceOrder}
            disabled={isActionLoading}
            label="Get now"
          />
        </div>
      </div>
    </article>
  );
}

function HeroActionButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="lab-clip-tr min-h-[44px] flex items-center justify-center bg-[#1B2757] text-white font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}

export default NextDeliveryHero;
