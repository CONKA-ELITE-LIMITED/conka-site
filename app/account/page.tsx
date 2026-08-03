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

  const liveSubscriptions = subscriptions.filter(
    (s) => s.status === "active" || s.status === "paused",
  );
  const inactiveSubscriptions = subscriptions.filter(
    (s) => s.status === "cancelled" || s.status === "expired",
  );

  const firstName = customer?.firstName;
  const greeting = firstName ? `Welcome back, ${firstName}.` : "Welcome back.";

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

      <main className="pt-2 pb-24 lg:pt-3">
        <section className="brand-section brand-bg-white" aria-labelledby="overview-heading">
          <div className="brand-track">
            {/* Welcome */}
            <h1
              id="overview-heading"
              className="text-3xl lg:text-4xl font-semibold text-black mb-6 lg:mb-8"
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
                {/* Active subscriptions */}
                {liveSubscriptions.length > 0 ? (
                  <div className="mb-8">
                    <h2 className="text-sm font-medium text-black/50 mb-3">
                      Active subscriptions
                    </h2>
                    <div className="space-y-3">
                      {liveSubscriptions.map((sub) => (
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
                    <h2 className="text-sm font-medium text-black/50 mb-3">
                      Inactive subscriptions
                    </h2>
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
