"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/app/components/navigation";
import { AccountSubNav } from "@/app/components/account/AccountSubNav";
import { NextDeliveryHero } from "@/app/components/account/NextDeliveryHero";
import { HairlineSpecStrip } from "@/app/components/account/HairlineSpecStrip";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { ContactSupportLink } from "@/app/components/ContactSupportLink";
import { useAuth } from "@/app/context/AuthContext";
import { useSubscriptions, Subscription } from "@/app/hooks/useSubscriptions";
import {
  getSubscriptionImage,
  getSubscriptionType,
} from "@/app/account/subscriptions/utils";
import { RescheduleModal } from "@/app/components/subscriptions/RescheduleModal";
import { PlaceOrderModal } from "@/app/components/subscriptions/PlaceOrderModal";
import { ActiveOrderCard } from "@/app/components/account/ActiveOrderCard";
import { isActiveOrder } from "@/app/account/orders/utils";

interface OrderSummary {
  id: string;
  orderNumber: string;
  orderName?: string;
  processedAt: string;
  cancelledAt?: string;
  financialStatus: string;
  fulfillmentStatus: string;
  lineItems: Array<{ title: string }>;
}

function safeFormatDate(
  iso: string | undefined,
  options: Intl.DateTimeFormatOptions,
  fallback = "Scheduling"
): string {
  if (!iso) return fallback;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString("en-GB", options);
}

function getFormulaBadge(type: ReturnType<typeof getSubscriptionType>): string {
  if (type === "flow") return "F01";
  if (type === "clear") return "F02";
  return "BOTH";
}

export default function AccountPage() {
  const router = useRouter();
  const { customer, loading, isAuthenticated, logout } = useAuth();
  const {
    subscriptions,
    fetchSubscriptions,
    loading: subsLoading,
    skipNextOrder,
    placeOrderNow,
    rescheduleSubscription,
  } = useSubscriptions();

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState<Subscription | null>(null);
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState<Subscription | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/account/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !customer) return;
    fetchSubscriptions();
    fetch("/api/auth/orders", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated, customer, fetchSubscriptions]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");
  const nextSub = activeSubscriptions
    .map((s) => ({
      sub: s,
      time: new Date(s.nextBillingDate).getTime(),
    }))
    .filter((x) => !isNaN(x.time))
    .sort((a, b) => a.time - b.time)[0]?.sub;

  const otherActive = nextSub
    ? activeSubscriptions.filter((s) => s.id !== nextSub.id)
    : activeSubscriptions;

  const nextDeliveryShort = nextSub
    ? safeFormatDate(nextSub.nextBillingDate, { day: "numeric", month: "short" }, "None")
    : "None";
  const nextDeliveryLong = nextSub
    ? safeFormatDate(
        nextSub.nextBillingDate,
        { day: "numeric", month: "short", year: "numeric" },
        "Scheduling"
      )
    : null;

  // Earliest order date for "Member since". Iterate rather than trust sort order.
  const earliestProcessedAt = orders.reduce<string | null>((min, o) => {
    if (!o.processedAt) return min;
    if (!min) return o.processedAt;
    return new Date(o.processedAt).getTime() < new Date(min).getTime()
      ? o.processedAt
      : min;
  }, null);
  const memberSince = earliestProcessedAt
    ? safeFormatDate(earliestProcessedAt, { month: "short", year: "numeric" }, "New")
    : ordersLoading
    ? "—"
    : "New";

  const firstName = customer?.firstName;
  const greeting = firstName ? `Welcome back, ${firstName}.` : "Welcome back.";
  const orderCountLabel = ordersLoading
    ? null
    : `${orders.length} order${orders.length !== 1 ? "s" : ""}`;
  const activeLabel =
    activeSubscriptions.length > 0
      ? `${activeSubscriptions.length} active subscription${activeSubscriptions.length !== 1 ? "s" : ""}`
      : null;
  const headerSub = [
    orderCountLabel,
    activeLabel,
    nextDeliveryLong ? `next renewal ${nextDeliveryLong}` : null,
  ]
    .filter(Boolean)
    .join(" · ") || "Your account at a glance";

  const activeOrder =
    orders.length > 0 && isActiveOrder(orders[0]) ? orders[0] : null;

  const handleSkipNext = async () => {
    if (!nextSub) return;
    setActionLoading(nextSub.id);
    await skipNextOrder(nextSub.id);
    await fetchSubscriptions();
    setActionLoading(null);
  };

  const handleRescheduleFromModal = async (newDateEpoch: number): Promise<boolean> => {
    if (!showRescheduleModal) return false;
    setActionLoading(showRescheduleModal.id);
    const success = await rescheduleSubscription(showRescheduleModal.id, newDateEpoch);
    if (success) await fetchSubscriptions();
    setActionLoading(null);
    return success;
  };

  const handlePlaceOrderFromModal = async (): Promise<boolean> => {
    if (!showPlaceOrderModal) return false;
    setActionLoading(showPlaceOrderModal.id);
    const success = await placeOrderNow(showPlaceOrderModal.id);
    if (success) await fetchSubscriptions();
    setActionLoading(null);
    return success;
  };

  if (loading) {
    return (
      <div className="brand-clinical min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) return null;

  return (
    <div className="brand-clinical min-h-screen bg-white text-black">
      <Navigation />
      <AccountSubNav />

      <main className="pt-3 pb-24 lg:pt-4">
        <section
          className="brand-section brand-bg-white"
          aria-labelledby="overview-heading"
        >
          <div className="brand-track">
            {/* Welcome header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
                  {"// Account · Overview"}
                </p>
                <h1
                  id="overview-heading"
                  className="text-3xl lg:text-4xl font-semibold text-black mb-2"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {greeting}
                </h1>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
                  {headerSub}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="border border-black/12 hover:border-black/40 text-black font-mono text-[10px] uppercase tracking-[0.16em] px-4 py-2 transition-colors min-h-[44px]"
              >
                Sign out
              </button>
            </div>

            {/* Spec strip */}
            <div className="mb-12">
              <HairlineSpecStrip
                items={[
                  { label: "Active subs", value: activeSubscriptions.length },
                  { label: "Next renewal", value: nextDeliveryShort },
                  { label: "Orders placed", value: ordersLoading ? "—" : orders.length },
                  { label: "Member since", value: memberSince },
                ]}
              />
            </div>

            {/* Next delivery section */}
            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
                Fig. 01 · Next delivery
              </p>
              <h2
                className="text-2xl lg:text-3xl font-semibold text-black mb-2"
                style={{ letterSpacing: "-0.02em" }}
              >
                Your next shipment.
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
                Skip · Reschedule · Get now
              </p>
            </div>

            {ordersLoading && nextSub ? (
              <div className="mb-4 bg-white border border-black/12 h-[72px]" />
            ) : activeOrder ? (
              <div className="mb-4">
                <ActiveOrderCard
                  orderName={activeOrder.orderName || `#${activeOrder.orderNumber}`}
                  productTitle={activeOrder.lineItems[0]?.title || "Your order"}
                  fulfillmentStatus={activeOrder.fulfillmentStatus}
                />
              </div>
            ) : null}

            <div className="mb-12">
              {subsLoading && subscriptions.length === 0 ? (
                <div className="bg-white border border-black/12 h-[360px] flex items-center justify-center">
                  <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin" />
                </div>
              ) : nextSub ? (
                <NextDeliveryHero
                  subscription={nextSub}
                  onSkipNext={handleSkipNext}
                  onReschedule={() => setShowRescheduleModal(nextSub)}
                  onPlaceOrder={() => setShowPlaceOrderModal(nextSub)}
                  isActionLoading={actionLoading === nextSub.id}
                />
              ) : (
                <EmptyHeroCard />
              )}
            </div>

            {/* All active subscriptions */}
            {otherActive.length > 0 && (
              <>
                <div className="mb-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
                    Fig. 02 · All active subscriptions
                  </p>
                  <h2
                    className="text-2xl lg:text-3xl font-semibold text-black mb-2"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {nextSub ? "Also in rotation." : "Your subscriptions."}
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
                    Tap any row to manage
                  </p>
                </div>

                <div className="mb-12 bg-white border border-black/12">
                  {otherActive.map((sub, idx) => {
                    const img = getSubscriptionImage(sub);
                    const type = getSubscriptionType(sub);
                    const badge = getFormulaBadge(type);
                    const date = safeFormatDate(
                      sub.nextBillingDate,
                      { day: "numeric", month: "short", year: "numeric" },
                      "Scheduling"
                    );
                    const label =
                      sub.isMultiLine && sub.lines?.length
                        ? sub.lines.map((l) => l.productTitle).join(" + ")
                        : sub.product.title;
                    return (
                      <Link
                        key={sub.id}
                        href="/account/subscriptions"
                        className={`flex items-center gap-4 px-4 py-4 hover:bg-black/[0.02] transition-colors ${
                          idx < otherActive.length - 1 ? "border-b border-black/8" : ""
                        }`}
                      >
                        <span className="font-mono text-[10px] text-black/35 tabular-nums flex-shrink-0 w-5">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {img ? (
                          <span className="relative w-12 h-12 shrink-0 overflow-hidden bg-[#f5f5f5] border border-black/8">
                            <Image
                              src={img}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </span>
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-black truncate">
                              {label}
                            </p>
                            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#1B2757] bg-[#1B2757]/[0.06] border border-[#1B2757]/20 px-1.5 py-0.5 tabular-nums shrink-0">
                              {badge}
                            </span>
                          </div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums mt-0.5">
                            Renews · {date}
                          </p>
                        </div>
                        <span
                          className="text-black/40 font-mono shrink-0"
                          aria-hidden
                        >
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {/* Closing CTA / help */}
            <div className="bg-white border border-black/12 p-5 lg:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
                {"// Support · Fig. 03"}
              </p>
              <h3
                className="text-xl lg:text-2xl font-semibold text-black mb-2"
                style={{ letterSpacing: "-0.02em" }}
              >
                Need a hand with your account?
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
                Same day reply · UK team · real humans
              </p>
              <ContactSupportLink
                variant="inline"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1B2757]"
                icon={false}
              >
                Email support ↗
              </ContactSupportLink>
            </div>
          </div>
        </section>
      </main>

      <RescheduleModal
        isOpen={!!showRescheduleModal}
        onClose={() => setShowRescheduleModal(null)}
        onReschedule={handleRescheduleFromModal}
        subscriptionName={showRescheduleModal?.product.title || "Subscription"}
        currentNextBillingDate={showRescheduleModal?.nextBillingDate}
        hasUnfulfilledOrder={showRescheduleModal?.hasUnfulfilledOrder}
        interval={showRescheduleModal?.interval}
      />

      <PlaceOrderModal
        isOpen={!!showPlaceOrderModal}
        onClose={() => setShowPlaceOrderModal(null)}
        onPlaceOrder={handlePlaceOrderFromModal}
        subscriptionName={showPlaceOrderModal?.product.title || "Subscription"}
      />
    </div>
  );
}

function EmptyHeroCard() {
  return (
    <div className="bg-white border border-black/12 p-6 lg:p-10 flex flex-col items-start gap-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
        No active subscription
      </p>
      <h2
        className="text-2xl lg:text-3xl font-semibold text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Start a protocol to see your next delivery here.
      </h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
        100-day guarantee · Free UK shipping · Cancel anytime
      </p>
      <ConkaCTAButton href="/funnel" meta="// start your protocol">
        Start now
      </ConkaCTAButton>
    </div>
  );
}
