"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/app/components/navigation";
import { AccountSubNav } from "@/app/components/account/AccountSubNav";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { useAuth } from "@/app/context/AuthContext";
import { useSubscriptions, Subscription } from "@/app/hooks/useSubscriptions";
import { SubscriptionListCard } from "@/app/components/subscriptions/SubscriptionListCard";
import { ReactivateModal } from "@/app/components/subscriptions/ReactivateModal";

export default function AccountPage() {
  const router = useRouter();
  const { customer, loading, isAuthenticated } = useAuth();
  const {
    subscriptions,
    fetchSubscriptions,
    loading: subsLoading,
    reactivateSubscription,
  } = useSubscriptions();

  const [showReactivateModal, setShowReactivateModal] = useState<Subscription | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/account/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && customer) fetchSubscriptions();
  }, [isAuthenticated, customer, fetchSubscriptions]);

  // Two buckets only: Active (active) and Inactive (paused, cancelled, expired).
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");
  const inactiveSubscriptions = subscriptions.filter((s) => s.status !== "active");

  const nextRenewalMs = activeSubscriptions
    .map((s) => new Date(s.nextBillingDate).getTime())
    .filter((t) => !isNaN(t))
    .sort((a, b) => a - b)[0];
  const nextRenewalLabel = nextRenewalMs
    ? new Date(nextRenewalMs).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "None";

  const firstName = customer?.firstName;
  const greeting = firstName ? `Welcome, ${firstName} 👋` : "Welcome 👋";

  const handleReactivateFromModal = async (): Promise<boolean> => {
    if (!showReactivateModal) return false;
    setActionLoading(showReactivateModal.id);
    const success = await reactivateSubscription(showReactivateModal.id);
    if (success) await fetchSubscriptions();
    setActionLoading(null);
    return success;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !customer) return null;

  const isInitialLoading = subsLoading && subscriptions.length === 0;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />
      <AccountSubNav />

      <main className="pt-1 pb-24 lg:pt-1">
        <section className="brand-section brand-bg-white" aria-labelledby="overview-heading">
          <div className="brand-track">
            {/* Welcome */}
            <h1
              id="overview-heading"
              className="text-3xl lg:text-4xl font-semibold text-black mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              {greeting}
            </h1>

            {isInitialLoading ? (
              <div className="bg-white rounded-md border border-black/10 h-[128px] flex items-center justify-center">
                <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Compact stat bar */}
                {subscriptions.length > 0 && (
                  <AccountStatBar
                    stats={[
                      { label: "Active", value: activeSubscriptions.length },
                      { label: "Next renewal", value: nextRenewalLabel },
                    ]}
                  />
                )}

                {/* Active subscriptions */}
                {activeSubscriptions.length > 0 ? (
                  <div className="mb-8">
                    <h2 className="text-sm font-medium text-black/50 mb-3">Active</h2>
                    <div className="space-y-3">
                      {activeSubscriptions.map((sub) => (
                        <SubscriptionListCard key={sub.id} subscription={sub} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-8">
                    <EmptyHeroCard />
                  </div>
                )}

                {/* Inactive subscriptions */}
                {inactiveSubscriptions.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-sm font-medium text-black/50 mb-3">Inactive</h2>
                    <div className="space-y-3">
                      {inactiveSubscriptions.map((sub) => (
                        <SubscriptionListCard
                          key={sub.id}
                          subscription={sub}
                          onReactivate={() => setShowReactivateModal(sub)}
                          reactivateLoading={actionLoading === sub.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Previous orders */}
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--brand-navy)] hover:underline"
                >
                  Looking for past orders? View order history →
                </Link>
              </>
            )}
          </div>
        </section>
      </main>

      <ReactivateModal
        isOpen={!!showReactivateModal}
        onClose={() => setShowReactivateModal(null)}
        onReactivate={handleReactivateFromModal}
        subscriptionName={showReactivateModal?.product.title || "Subscription"}
      />
    </div>
  );
}

/** Compact navy stat bar: value over label, evenly split. */
function AccountStatBar({
  stats,
}: {
  stats: { label: string; value: string | number }[];
}) {
  return (
    <div
      className="grid rounded-xl bg-[var(--brand-navy)] text-white overflow-hidden mb-8"
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`px-3 py-2.5 text-center ${i > 0 ? "border-l border-white/15" : ""}`}
        >
          <p className="text-base font-semibold tabular-nums leading-tight">{s.value}</p>
          <p className="text-[11px] text-white mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyHeroCard() {
  return (
    <div className="bg-white rounded-md border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 lg:p-8 flex flex-col items-start gap-4">
      <p className="text-sm font-medium text-black/50">No active subscription</p>
      <h2
        className="text-2xl lg:text-3xl font-semibold text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Start a subscription to see it here.
      </h2>
      <p className="text-sm text-black/50 tabular-nums">
        100-day guarantee · Free UK shipping · Cancel anytime
      </p>
      <ConkaCTAButton href="/funnel" meta={null}>
        Start now
      </ConkaCTAButton>
    </div>
  );
}
